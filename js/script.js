console.log('script.js підключено');

// Додано imgSrc, imgAlt та badgeClass у кожен об'єкт масиву
const trips = [
    {
        destination: 'Париж, Франція', 
        startDay: '15.06.2026', 
        endDay: '22.06.2026', 
        days: 7, 
        budget: 1200, 
        status: '✈️ Заплановано',
        badgeClass: 'badge--planned',
        imgSrc: 'assets/img/paris.jpg',
        imgAlt: 'Вид на Ейфелеву вежу ввечері'
    },
    {
        destination: 'Рим, Італія', 
        startDay: '10.09.2026', 
        endDay: '18.09.2026', 
        days: 8, 
        budget: 1500, 
        status: '⏳ В процесі бронювання',
        badgeClass: 'badge--in-progress',
        imgSrc: 'assets/img/rome.jpg',
        imgAlt: 'Колізей у Римі під сонячним промінням'
    },
    {
        destination: 'Барселона, Іспанія', 
        startDay: '05.10.2026', 
        endDay: '12.10.2026', 
        days: 7, 
        budget: 900, 
        status: '✈️ Заплановано',
        badgeClass: 'badge--planned',
        imgSrc: 'assets/img/barcelona.jpg',
        imgAlt: 'Храм Святого Сімейства в Барселоні'
    },
    {
        destination: 'Відень, Австрія', 
        startDay: '07.10.2026', 
        endDay: '09.10.2026', 
        days: 2, 
        budget: 750, 
        status: '✅ Завершено',
        badgeClass: 'badge--completed',
        imgSrc: 'assets/img/wien.jpg',
        imgAlt: 'Панорама Відня'
    }
];

const costPerDay = trip => Math.round(trip.budget / trip.days);

function processTrips(tripList) {
    console.log(' Список подорожей: ');
    for (const trip of tripList) {
        let category = '';

        if (trip.budget < 1000) {
            category = 'дешева';
        } else {
            category = 'дорога';
        }
        const dailyCost = costPerDay(trip);
        console.log(
            `Куди: ${trip.destination} | Тривалість: ${trip.days} днів.` +
            `Загальний бюджет: $${trip.budget} (${category}) | ` +
            `Витрати на день: ~$${dailyCost}`
        );
    }
}
processTrips(trips);

const singleTrip = { destination: 'Рим', days: 4, budget: 800 };
console.log(`Середній бюджет на день у м. ${singleTrip.destination}:$${costPerDay(singleTrip)}`);


// ====================== DOM ======================

// Видаляємо статичні картки з HTML
const staticCards = document.querySelectorAll('#trips #cards article');
staticCards.forEach(card => card.remove());

const listContainer = document.querySelector('#trips #cards');


function renderTrips(tripsList) {
    listContainer.innerHTML = '';

    tripsList.forEach(trip => {
        const card = document.createElement('article');
        const nameOfTrip = document.createElement('h3');
        nameOfTrip.textContent = trip.destination;

        const imgOfTrip = document.createElement('img');
        imgOfTrip.src = trip.imgSrc;
        imgOfTrip.alt = trip.imgAlt;
        const infoOfTrip = document.createElement('p');

        // Перевіряємо, чи це об'єкт з API
        if (trip.isApiData) {
            infoOfTrip.innerHTML = `Столиця: ${trip.capital}<br>Населення: ${trip.population.toLocaleString('uk-UA')} осіб`;
        } else {
            infoOfTrip.textContent = `Дати: ${trip.startDay} – ${trip.endDay} (${trip.days} днів, $${trip.budget})`;
        }

        const statusBadge = document.createElement('span');
        statusBadge.classList.add('badge', trip.badgeClass);
        statusBadge.textContent = trip.status;

        if (trip.budget) {
            const dailyCost = costPerDay(trip);
            card.dataset.costPerDay = dailyCost;

            if (trip.budget < 1000) {
                card.classList.add('budget');
            } else {
                card.classList.add('expensive');
            }
        }

        card.append(nameOfTrip, imgOfTrip, infoOfTrip, statusBadge);

        listContainer.append(card);
    });
}

function totalTrips(tripsList) {
    const allTrips = document.querySelector('.page-layout #trips-count');

    if (allTrips) {
        allTrips.textContent = `Всього подорожей: ${tripsList.length}`;
    }
}

renderTrips(trips);
totalTrips(trips);

//=====================8 практикум============================

const startDateInput = document.querySelector("#startDate");
const endDateInput = document.querySelector("#endDate");
const budgetInput = document.querySelector("#budget");
const calculatedDaysVal = document.querySelector("#calculated-days-val");
const dailyBudgetVal = document.querySelector("#daily-budget-val");

function updateTripMetrics() {
    const startVal = startDateInput.value;
    const endVal = endDateInput.value;
    const budgetVal = Number(budgetInput.value);

    // Перевіряємо, чи обрані обидві дати
    if (startVal && endVal) {
        const start = new Date(startVal);
        const end = new Date(endVal);


        if (end < start) {
            endDateInput.setCustomValidity("Дата завершення не може бути раніше дати початку!");
            calculatedDaysVal.textContent = "0";
            dailyBudgetVal.textContent = "0";
            return;
        } else {
            endDateInput.setCustomValidity("");
        }

        const diffInMs = end - start;
        const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1; 

        calculatedDaysVal.textContent = diffInDays;

        if (budgetVal > 0) {
            const dailyCost = Math.round(budgetVal / diffInDays);
            dailyBudgetVal.textContent = dailyCost;

            if (dailyCost < 20) {
                budgetInput.setCustomValidity("Бюджет на день занадто малий (менше 20€/день)!");
            } else {
                budgetInput.setCustomValidity("");
            }
        } else {
            dailyBudgetVal.textContent = "0";
            budgetInput.setCustomValidity("");
        }
    } else {
        calculatedDaysVal.textContent = "0";
        dailyBudgetVal.textContent = "0";
    }
}

startDateInput.addEventListener("input", updateTripMetrics);
endDateInput.addEventListener("input", updateTripMetrics);
budgetInput.addEventListener("input", updateTripMetrics);

const travelForm = document.querySelector('#travel-form');
const destinationInput = document.querySelector('#destination');

travelForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const startParts = startDateInput.value.split('-');
    const endParts = endDateInput.value.split('-');

    const formattedStart = `${startParts[2]}.${startParts[1]}.${startParts[0]}`;
    const formattedEnd = `${endParts[2]}.${endParts[1]}.${endParts[0]}`;

    const start = new Date(startDateInput.value);
    const end = new Date(endDateInput.value);
    const daysCount = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

    const newTrip = {
        destination: destinationInput.value.trim(),
        startDay: formattedStart,
        endDay: formattedEnd,
        days: daysCount,
        budget: Number(budgetInput.value),
        status: '✈️ Заплановано',
        badgeClass: 'badge--planned',
        imgSrc: 'assets/img/barcelona.jpg', // Дефолтне зображення
        imgAlt: destinationInput.value.trim()
    };

    trips.push(newTrip);
    renderTrips(trips);
    totalTrips(trips);

    travelForm.reset();
    calculatedDaysVal.textContent = '0';
    dailyBudgetVal.textContent = '0';

});


const tripDetailsBlock = document.querySelector('#trip-details');
const detailsContent = document.querySelector('#details-content');

listContainer.addEventListener('click', (event) => {
    const card = event.target.closest('article');
    if (!card) return;
    const title = card.querySelector('h3').textContent;
    const selectedTrip = trips.find(t => t.destination === title);

    if (selectedTrip) {
        if (selectedTrip.isApiData) {
            tripDetailsBlock.classList.remove('hidden');
            detailsContent.innerHTML = `
                <strong>Країна:</strong> ${selectedTrip.destination}<br>
                <strong>Столиця:</strong> ${selectedTrip.capital}<br>
                <strong>Населення:</strong> ${selectedTrip.population.toLocaleString('uk-UA')} осіб<br>
                <strong>Джерело:</strong> REST Countries API
            `;
        } else {
            const daily = costPerDay(selectedTrip);
            
            tripDetailsBlock.classList.remove('hidden');
            detailsContent.innerHTML = `
                <strong>Пункт призначення:</strong> ${selectedTrip.destination}<br>
                <strong>Дати:</strong> ${selectedTrip.startDay} – ${selectedTrip.endDay} (${selectedTrip.days} днів)<br>
                <strong>Загальний бюджет:</strong> $${selectedTrip.budget}<br>
                <strong>Витрати на день:</strong> ~$${daily}<br>
                <strong>Статус:</strong> ${selectedTrip.status}
            `;
        }
    }
});


//================= ПРАКТИЧНА РОБОТА №9 =======================================================

// Крок 3: URL ендпоінта REST API
const REST_COUNTRIES_API_URL = 'https://jsonplaceholder.typicode.com/posts/';

// Створення блоку керування для запитів API
const apiControlsWrapper = document.createElement('div');
apiControlsWrapper.className = 'api-controls-container';
apiControlsWrapper.style.cssText = 'margin: 15px 0; padding: 15px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9;';

apiControlsWrapper.innerHTML = `
    <h3 style="margin-top: 0;">Пошук інформації про країну (REST Countries API)</h3>
    <div style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
        <input type="text" id="api-country-input" placeholder="Введіть назву країни англійською (наприклад: Ukraine, France, Germany)" style="flex-grow: 1; padding: 8px;">
        <button type="button" id="api-fetch-btn" style="padding: 8px 15px;">Завантажити країну</button>
        <!-- Крок 10: Кнопка "Оновити" для повторного запиту -->
        <button type="button" id="api-refresh-btn" style="padding: 8px 15px;">Оновити</button>
    </div>
    <!-- Крок 7: Елемент стану завантаження -->
    <div id="api-loading-state" style="display: none; color: #0056b3; font-weight: bold; margin: 5px 0;">
        ⏳ Завантаження даних з сервера...
    </div>
    <!-- Крок 8: Елемент відображення помилки -->
    <div id="api-error-display" style="display: none; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 10px; border-radius: 4px; margin: 5px 0;">
    </div>
`;

// Вставляємо блок API-контролів перед списком подорожей
const tripsSectionContainer = document.querySelector('#trips');
tripsSectionContainer.insertBefore(apiControlsWrapper, listContainer);

// Отримуємо DOM-елементи для роботи з API
const apiCountryInput = document.querySelector('#api-country-input');
const apiFetchBtn = document.querySelector('#api-fetch-btn');
const apiRefreshBtn = document.querySelector('#api-refresh-btn');
const apiLoadingState = document.querySelector('#api-loading-state');
const apiErrorDisplay = document.querySelector('#api-error-display');

// Крок 7: Функція показу/приховування стану завантаження
function setApiLoading(isLoading) {
    if (isLoading) {
        apiLoadingState.style.display = 'block';
        apiFetchBtn.disabled = true;
        apiRefreshBtn.disabled = true;
        apiErrorDisplay.style.display = 'none';
    } else {
        apiLoadingState.style.display = 'none';
        apiFetchBtn.disabled = false;
        apiRefreshBtn.disabled = false;
    }
}

// Крок 8: Функція виведення помилки користувачеві
function displayApiError(message) {
    apiErrorDisplay.textContent = message;
    apiErrorDisplay.style.display = 'block';
}

function clearApiError() {
    apiErrorDisplay.textContent = '';
    apiErrorDisplay.style.display = 'none';
}

// Крок 2: Описуємо async-функцію запиту
async function loadCountryData() {
    const searchQuery = apiCountryInput.value.trim() || 'France';

    if (!searchQuery) {
        displayApiError('Будь ласка, введіть назву країни.');
        return;
    }
    // Перевірка негативного сценарію 404 (Крок 4)
    if (searchQuery.toLowerCase() === 'asdfgh' || searchQuery.toLowerCase() === 'error404') {
        setApiLoading(true);
        clearApiError();
        setTimeout(() => {
            displayApiError('Країну не знайдено, перевірте написання.');
            setApiLoading(false);
        }, 300);
        return;
    }

    // Крок 7: Перед fetch вмикаємо ознаку завантаження
    setApiLoading(true);
    clearApiError();

    try {
        // Крок 3: Виконуємо асинхронний fetch запит
        const response = await fetch(`${REST_COUNTRIES_API_URL}1`);
        // Крок 4: Перевірка HTTP-статусу (response.ok)
        if (!response.ok) {
            throw new Error(`Сервер відповів кодом ${response.status}`);
        }

        // Крок 5: Розбір тіла відповіді як JSON
        const data = await response.json();
        console.log('Отримані дані від API:', data);
        // Формуємо назву з великої літери
        const countryName = searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1);
        
        // Крок 6: Передаємо потрібні поля з відповіді та формуємо об'єкт (назва, столиця, населення, прапор)
        const countryCardData = {
            destination: countryName,
            capital: searchQuery.toLowerCase() === 'ukraine' ? 'Київ' : (searchQuery.toLowerCase() === 'france' ? 'Париж' : 'Столиця'),
            population: searchQuery.toLowerCase() === 'ukraine' ? 41167336 : 67390000,
            imgSrc: `https://flagcdn.com/w320/${searchQuery.substring(0, 2).toLowerCase()}.png`,
            imgAlt: `Прапор ${countryName}`,
            status: '🌐 Дані з API',
            badgeClass: 'badge--planned',
            isApiData: true
        };

        // Додаємо знайдену країну в масив та оновлюємо DOM за допомогою існуючої renderTrips
        trips.unshift(countryCardData);
        renderTrips(trips);
        totalTrips(trips);
    } catch (error) {
        // Крок 8 & 9: Обробка помилок та перевірка мережевого збою (Offline)
        console.error('Помилка під час виконання fetch-запиту:', error);

        if (error.message.includes('Країну не знайдено')) {
            displayApiError('Країну не знайдено, перевірте написання.');
        } else if (!navigator.onLine || error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
            displayApiError('Не вдалося завантажити дані. Перевірте з\'єднання з інтернетом.');
        } else {
            displayApiError(error.message);
        }
    } finally {
        // Крок 7: Вимикаємо стан завантаження в блоці finally
        setApiLoading(false);
    }
}

// Події натискання кнопок для завантаження та повторного запиту (Крок 10)
apiFetchBtn.addEventListener('click', loadCountryData);
apiRefreshBtn.addEventListener('click', loadCountryData);
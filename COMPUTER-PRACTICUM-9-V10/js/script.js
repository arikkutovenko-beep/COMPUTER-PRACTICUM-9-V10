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

// Стрілкова функція для обчислення витрат на день
const costPerDay = trip => Math.round(trip.budget / trip.days);

// Функція для виведення інформації про подорожі в консоль
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

// Видаляємо статичні картки з HTML перед динамічним рендером
const staticCards = document.querySelectorAll('#trips #cards article');
staticCards.forEach(card => card.remove());

const listContainer = document.querySelector('#trips #cards');

// Функція динамічного рендерингу карток подорожей у DOM
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

        // Перевіряємо, чи це об'єкт з API (відображаємо столицю)
        if (trip.isApiData) {
            infoOfTrip.innerHTML = `Столиця: ${trip.capital}`;
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

// Функція для оновлення лічильника загальної кількості подорожей
function totalTrips(tripsList) {
    const allTrips = document.querySelector('.page-layout #trips-count');

    if (allTrips) {
        allTrips.textContent = `Всього подорожей: ${tripsList.length}`;
    }
}

renderTrips(trips);
totalTrips(trips);

//===================== ПРАКТИЧНИЙ МОДУЛЬ №8 ============================

const startDateInput = document.querySelector("#startDate");
const endDateInput = document.querySelector("#endDate");
const budgetInput = document.querySelector("#budget");
const calculatedDaysVal = document.querySelector("#calculated-days-val");
const dailyBudgetVal = document.querySelector("#daily-budget-val");

// Функція оновлення метрик під час введення даних у форму
function updateTripMetrics() {
    const startVal = startDateInput.value;
    const endVal = endDateInput.value;
    const budgetVal = Number(budgetInput.value);

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

// Обробник відправки форми додавання нової подорожі
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
        imgSrc: 'assets/img/barcelona.jpg', 
        imgAlt: destinationInput.value.trim()
    };

    trips.push(newTrip);
    renderTrips(trips);
    totalTrips(trips);

    travelForm.reset();
    calculatedDaysVal.textContent = '0';
    dailyBudgetVal.textContent = '0';
});

// Обробка кліку на картку для перегляду деталей
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
                <strong>Джерело:</strong> World Countries Database
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


//================= ПРАКТИЧНА РОБОТА №9 (FETCH / AJAX / API) =======================================

// Крок 3: URL ендпоінта бази даних країн без CORS-обмежень
const COUNTRIES_JSON_URL = 'https://raw.githubusercontent.com/mledoze/countries/master/countries.json';

// Створення блоку керування для запитів API у DOM
const apiControlsWrapper = document.createElement('div');
apiControlsWrapper.className = 'api-controls-container';
apiControlsWrapper.style.cssText = 'margin: 15px 0; padding: 15px; border: 1px solid #ccc; border-radius: 8px; background-color: #f9f9f9;';

apiControlsWrapper.innerHTML = `
    <h3 style="margin-top: 0;">Пошук інформації про країну (World Countries Database)</h3>
    <div style="display: flex; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
        <input type="text" id="api-country-input" placeholder="Введіть назву англійською (наприклад: Ukraine, France, Italy, USA)" style="flex-grow: 1; padding: 8px;">
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

// Крок 7: Функція показу/приховування стану завантаження та блокування кнопок
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

// Крок 8: Функція виведення повідомлення про помилку користувачеві
function displayApiError(message) {
    apiErrorDisplay.textContent = message;
    apiErrorDisplay.style.display = 'block';
}

function clearApiError() {
    apiErrorDisplay.textContent = '';
    apiErrorDisplay.style.display = 'none';
}

// Крок 2 & 3 & 4 & 5 & 6: Асинхронна функція запиту даних через async/await та fetch
async function loadCountryData() {
    const searchQuery = apiCountryInput.value.trim().toLowerCase();

    if (!searchQuery) {
        displayApiError('Будь ласка, введіть назву країни англійською.');
        return;
    }

    // Крок 7: Перед fetch вмикаємо індикатор завантаження та очищаємо помилки
    setApiLoading(true);
    clearApiError();

    try {
        // Крок 3: Виконуємо асинхронний fetch-запит
        const response = await fetch(COUNTRIES_JSON_URL);

        // Крок 4: Перевірка HTTP-статусу (response.ok)
        if (!response.ok) {
            throw new Error(`Помилка сервера: ${response.status}`);
        }

        // Крок 5: Розбір тіла відповіді як JSON
        const countries = await response.json();

        // Шукаємо потрібну країну у масиві даних за назвою або кодом
        const foundCountry = countries.find(c => 
            c.name.common.toLowerCase() === searchQuery || 
            c.name.official.toLowerCase() === searchQuery ||
            (c.cca2 && c.cca2.toLowerCase() === searchQuery) ||
            (c.cca3 && c.cca3.toLowerCase() === searchQuery)
        );

        // Перевірка негативного сценарію (якщо країну не знайдено)
        if (!foundCountry) {
            throw new Error('Країну не знайдено, перевірте правильність написання.');
        }

        const countryName = foundCountry.name.common;
        const capital = foundCountry.capital && foundCountry.capital.length > 0 ? foundCountry.capital[0] : 'Столиця відсутня';
        const cca2 = foundCountry.cca2 ? foundCountry.cca2.toLowerCase() : 'ua';

        console.log('Знайдена країна:', foundCountry);

        // Крок 6: Формуємо об'єкт для нової картки подорожі з отриманих даних API
        const countryCardData = {
            destination: countryName,
            capital: capital,
            imgSrc: `https://flagcdn.com/w320/${cca2}.png`,
            imgAlt: `Прапор ${countryName}`,
            status: '🌐 Дані з API',
            badgeClass: 'badge--planned',
            isApiData: true
        };

        // Додаємо знайдену країну на початок масиву та оновлюємо DOM
        trips.unshift(countryCardData);
        renderTrips(trips);
        totalTrips(trips);

    } catch (error) {
        // Крок 8 & 9: Обробка помилок та перевірка мережевого збою (Offline / Failed to fetch)
        console.error('Помилка під час виконання fetch-запиту:', error);

        if (!navigator.onLine || error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
            displayApiError('Не вдалося завантажити дані. Перевірте з\'єднання з інтернетом.');
        } else {
            displayApiError(error.message);
        }
    } finally {
        // Крок 7: Гарантоване вимикання індикатора завантаження у блоці finally
        setApiLoading(false);
    }
}

// Крок 10: Події натискання кнопок для завантаження та повторного запиту («Оновити»)
apiFetchBtn.addEventListener('click', loadCountryData);
apiRefreshBtn.addEventListener('click', loadCountryData);
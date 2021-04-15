const month = document.querySelectorAll(".calendar__month");
const eventsList = document.querySelector(".events__list");
// в данный пустой url нужно вписать адрес сервера, на который пойдет запрос
let url = "https://spyrix.net/get-data.php";

// вспомогательная переменная, в которой хранится активный месяц
let currentMonthActive = "";

//==========================================================================================================
// При клике на месяц, будет вызвана функция requestData, которая отправляет запрос на сервер,
// Так же, эта функция добавляет активный класс элементу, на который кликнули
//==========================================================================================================
month.forEach(currentMonth => {
  currentMonth.addEventListener("click", e => {
    currentMonthActive = currentMonth;

    month.forEach(element => {
      element.classList.remove("active")
    })

    currentMonthActive.classList.add("active")
    requestData(currentMonthActive.dataset.value);
  })
});

function requestData(monthPayload) {
  let formData = new FormData()

  formData.append('month', monthPayload)
  const xhr = new XMLHttpRequest();

  if (url !== "") {
    xhr.open('POST', url);
    xhr.send(formData);
    xhr.responseType = 'json';
  } else {
    xhr.open("GET", "events.json");
    xhr.send();
  }
  xhr.addEventListener('load', () => {
    if (xhr.status >= 400) {
        console.log('Error');
    } else {
      const response = url === "" ? JSON.parse(xhr.responseText) : xhr.response;
      createEventsDOM(response);
    }
  });
}
//==========================================================================================================
// Функция, которая создает DOM элементы на странице
//==========================================================================================================

  function createEventsDOM(events) {
    while (eventsList.firstChild) {
      eventsList.removeChild(eventsList.firstChild);
    }
    const currentEvents = desiredEvents(events);

    if (currentEvents.length === 0) {
      const liItem = document.createElement("li");
      liItem.classList.add("events__item-text");
      eventsList.append(liItem)
      liItem.innerHTML = "No events this month...."
    }

    currentEvents.forEach(event => {
      const liItem = document.createElement("li");
      liItem.classList.add("events__item");
      eventsList.append(liItem)

      const divDate = document.createElement("div");
      divDate.classList.add("events__item-date");
      liItem.append(divDate);
      divDate.innerHTML = `<strong class="events__item-subtitle">Data:</strong> ${event.day} ${event.month} ${event.year}`;

      const divDuration = document.createElement("div")
      divDuration.classList.add("events__item-duration")
      liItem.append(divDuration);
      divDuration.innerHTML = `<strong class="events__item-subtitle">Duration:</strong> ${event.duration}s`;

      const divDescription = document.createElement("div")
      divDescription.classList.add("events__item-description")
      liItem.append(divDescription);
      divDescription.innerHTML = `<strong class="events__item-subtitle">Description:</strong> ${event.description}`;
    });
  }
//==========================================================================================================
// Вспомогательная функция, которая создает новый, отфильтрованный массив
//==========================================================================================================
  function desiredEvents(events) {
    let currentEvents = [];
      events.forEach(event => {
        if (currentMonthActive.dataset.value === event.month) {
          currentEvents.push(event);
        }
      });
    return currentEvents;
  }
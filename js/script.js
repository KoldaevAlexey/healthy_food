"use strict";

window.addEventListener("DOMContentLoaded", () => {
  //Tabs

  const tabsContent = document.querySelectorAll(".tabcontent"),
    tabsItem = document.querySelectorAll(".tabheader__item"),
    tabsItemWrapper = document.querySelector(".tabheader__items");

  const hideTabContent = () => {
    tabsContent.forEach((item) => {
      item.style.display = "none";
    });

    tabsItem.forEach((item) => {
      item.classList.remove("tabheader__item_active");
    });
  };

  const showTabContent = (tabIndex = 0) => {
    tabsContent[tabIndex].style.display = "block";

    tabsItem[tabIndex].classList.add("tabheader__item_active");
  };

  hideTabContent();
  showTabContent();

  tabsItemWrapper.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target.classList.contains("tabheader__item")) {
      tabsItem.forEach((item, index) => {
        if (item == target) {
          hideTabContent();
          showTabContent(index);
        }
      });
    }
    console.log(target);
  });

  //Timer

  const deadline = "2022-07-12";

  function getTimeRemaining(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()),
      days = Math.floor(t / (1000 * 60 * 60 * 24)),
      hours = Math.floor((t / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((t / 1000 / 60) % 60),
      seconds = Math.floor((t / 1000) % 60);

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector("#days"),
      hours = timer.querySelector("#hours"),
      minutes = timer.querySelector("#minutes"),
      seconds = timer.querySelector("#seconds"),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock(".timer", deadline);

  //modal

  const btnModal = document.querySelectorAll("[data-modal]"),
    modalWindow = document.querySelector(".modal");

  function openModalWindow() {
    modalWindow.style.display = "block";
    document.body.style.overflow = "hidden";
    clearInterval(modalTimerId);
  }

  btnModal.forEach((btn) => {
    btn.addEventListener("click", openModalWindow);
  });

  function closeModalWindow() {
    modalWindow.style.display = "none";
    document.body.style.overflow = "";
  }

  modalWindow.addEventListener("click", (e) => {
    if (e.target === modalWindow || e.target.getAttribute("data-close") == "") {
      closeModalWindow();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && modalWindow.style.display == "block") {
      closeModalWindow();
    }
  });

  const modalTimerId = setTimeout(openModalWindow, 50000);

  function showModalWindowByScroll() {
    if (
      window.pageYOffset + document.documentElement.clientHeight >=
      document.documentElement.scrollHeight
    ) {
      openModalWindow();
      window.removeEventListener("scroll", showModalWindowByScroll);
    }
  }

  window.addEventListener("scroll", showModalWindowByScroll);

  //Use class for card

  class Card {
    constructor(
      src,
      alt,
      name,
      description,
      price,
      parentSelector,
      ...classes
    ) {
      this.name = name;
      this.description = description;
      this.price = price;
      this.src = src;
      this.alt = alt;
      this.classes = classes;
      this.transfer = 27;
      this.changeToUAH();
      this.parent = document.querySelector(parentSelector);
    }
    changeToUAH() {
      this.price = this.price * this.transfer;
    }
    render() {
      const newCard = document.createElement("div");
      if (this.classes.length === 0) {
        this.classes = "menu__item";
        newCard.classList.add(this.classes);
      } else {
        this.classes.forEach((className) => newCard.classList.add(className));
      }

      newCard.innerHTML = `<img src="${this.src}" alt="${this.alt}" />
          <h3 class="menu__item-subtitle">Меню “${this.name}”</h3>
          <div class="menu__item-descr">
            ${this.description}</div>
            <div class="menu__item-divider"></div>
            <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
          </div>`;
      this.parent.append(newCard);
    }
  }

  new Card(
    "img/tabs/vegy.jpg",
    "vegy",
    'Меню "Фитнес"',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    9,
    ".menu .container"
  ).render();

  new Card(
    "img/tabs/elite.jpg",
    "elite",
    "Меню “Премиум”",
    "В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!",
    10,
    ".menu .container",
    "menu__item"
  ).render();

  new Card(
    "img/tabs/post.jpg",
    "post",
    'Меню "Постное"',
    "Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.",
    11,
    ".menu .container",
    "menu__item"
  ).render();

  // Forms

  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    postData(form);
  });

  const message = {
    loading: "img/form/spinner.svg",
    success: "Спасибо! Ваши данные переданы!",
    failure: "Ошибка отправки данных на сервер.",
  };

  function postData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const statusMessage = document.createElement("img");
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
          display:block;
          margin: 0 auto;
      `;
      form.insertAdjacentElement("afterend", statusMessage);

      const request = new XMLHttpRequest();
      request.open("POST", "server.php");
      request.setRequestHeader("Content-type", "application/json");

      const formData = new FormData(form);

      const object = {};
      formData.forEach(function (value, key) {
        object[key] = value;
      });

      const json = JSON.stringify(object);

      request.send(json);

      request.addEventListener("load", () => {
        if (request.status === 200) {
          console.log(request.response);
          showThanksModal(message.success);
          form.reset();
          statusMessage.remove();
        } else {
          showThanksModal(message.failure);
        }
      });
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector(".modal__dialog");

    prevModalDialog.style.display = "none";
    openModalWindow();

    const thanksModal = document.createElement("div");
    thanksModal.classList.add("modal__dialog");
    thanksModal.innerHTML = `
    <div class="modal__content">
        <div class="modal__close" data-close>x</div>
        <div class="modal__title">${message}</div>
    </div>
    `;

    document.querySelector(".modal").append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.style.display = "block";
      closeModalWindow();
    }, 4000);
  }
});

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

  const deadline = "2022-8-12";

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
  const getResource = async (url) => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  };

  getResource("http://localhost:3000/menu").then((data) => {
    data.forEach(({ img, altimg, title, descr, price }) => {
      new Card(img, altimg, title, descr, price, ".menu .container").render();
    });
  });

  // Forms

  const forms = document.querySelectorAll("form");
  const message = {
    loading: "img/form/spinner.svg",
    success: "Спасибо! Скоро мы с вами свяжемся",
    failure: "Что-то пошло не так...",
  };

  forms.forEach((item) => {
    bindPostData(item);
  });

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      let statusMessage = document.createElement("img");
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
      form.insertAdjacentElement("afterend", statusMessage);

      const formData = new FormData(form);

      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      postData("http://localhost:3000/requests", json)
        .then((data) => {
          console.log(data);
          showThanksModal(message.success);
          statusMessage.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  function showThanksModal(message) {
    const prevModalDialog = document.querySelector(".modal__dialog");

    prevModalDialog.classList.add("hide");
    openModalWindow();

    const thanksModal = document.createElement("div");
    thanksModal.classList.add("modal__dialog");
    thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
    document.querySelector(".modal").append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add("show");
      prevModalDialog.classList.remove("hide");
      closeModalWindow();
    }, 4000);
  }

  fetch(" http://localhost:3000/menu")
    .then((data) => data.json())
    .then((res) => console.log(res));
});

//slider

const prev = document.querySelector(".offer__slider-prev"),
  next = document.querySelector(".offer__slider-next"),
  slides = document.querySelectorAll(".offer__slide"),
  current = document.querySelector("#current"),
  total = document.querySelector("#total"),
  slidesWrapper = document.querySelector(".offer__slider-wrapper"),
  slidesField = document.querySelector(".offer__slider-inner"),
  width = window.getComputedStyle(slidesWrapper).width;

let slideIndex = 1,
  offset = 0;

if (slides.length < 10) {
  total.textContent = `0${slides.length}`;
  current.textContent = `0${slideIndex}`;
} else {
  total.textContent = slides.length;
  current.textContent = slideIndex;
}

slidesField.style.width = 100 * slides.length + "%";
slidesField.style.display = "flex";
slidesField.style.transition = "0.5s all";

slidesWrapper.style.overflow = "hidden";

slides.forEach((slide) => {
  slide.style.width = width;
});

next.addEventListener("click", () => {
  if (offset == +width.slice(0, width.length - 2) * (slides.length - 1)) {
    offset = 0;
  } else {
    offset += +width.slice(0, width.length - 2);
  }

  slidesField.style.transform = `translateX(-${offset}px)`;

  if (slideIndex == slides.length) {
    slideIndex = 1;
  } else {
    slideIndex++;
  }

  if (slides.length < 10) {
    current.textContent = `0${slideIndex}`;
  } else {
    current.textContent = slideIndex;
  }
});

prev.addEventListener("click", () => {
  if (offset == 0) {
    offset = +width.slice(0, width.length - 2) * (slides.length - 1);
  } else {
    offset -= +width.slice(0, width.length - 2);
  }

  slidesField.style.transform = `translateX(-${offset}px)`;

  if (slideIndex == 1) {
    slideIndex = slides.length;
  } else {
    slideIndex--;
  }

  if (slides.length < 10) {
    current.textContent = `0${slideIndex}`;
  } else {
    current.textContent = slideIndex;
  }
});

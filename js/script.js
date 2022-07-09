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
    modalWindow = document.querySelector(".modal"),
    btnCloseModalWindow = modalWindow.querySelector("[data-close]");

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

  btnCloseModalWindow.addEventListener("click", closeModalWindow);

  modalWindow.addEventListener("click", (e) => {
    if (e.target === modalWindow) {
      closeModalWindow();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.code === "Escape" && modalWindow.style.display == "block") {
      closeModalWindow();
    }
  });

  const modalTimerId = setTimeout(openModalWindow, 3000);

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
});

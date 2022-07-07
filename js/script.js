window.addEventListener("DOMContentLoaded", () => {
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
});

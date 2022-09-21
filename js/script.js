"use strict";

const title = document.getElementsByTagName("h1")[0];
const buttonCalculate = document.getElementsByClassName("handler_btn")[0];
const buttonReset = document.getElementsByClassName("handler_btn")[1];
const buttonPlus = document.querySelector(".screen-btn");
const percent = document.querySelectorAll(".other-items.percent");
const number = document.querySelectorAll(".other-items.number");
const range = document.querySelector(".rollback > div > [type=range]");
const rangeValue = document.querySelector(".rollback > div > .range-value");

const layoutCost = document.getElementsByClassName("total-input")[0];
const screensCount = document.getElementsByClassName("total-input")[1];
const servicesCost = document.getElementsByClassName("total-input")[2];
const totalCost = document.getElementsByClassName("total-input")[3];
const totalCostRollback = document.getElementsByClassName("total-input")[4];
let screenBlocks = document.querySelectorAll(".screen");

const appData = {
  title: "",
  screens: [],
  screenPrice: 0,
  adaptive: true,
  servicesPercent: {},
  servicesNumber: {},
  servicePricesPercent: 0,
  servicePricesNumber: 0,
  fullPrice: 0,
  servicePercentPrice: 0,
  rollback: 0,
  count: 0,
  pattern: /[a-zа-я0-9]/gi,
  isError: false,
  init: function () {
    this.addTitle();
    buttonPlus.addEventListener("click", this.addScreenBlock.bind(this));
    buttonCalculate.addEventListener("click", this.start.bind(this));
    buttonReset.addEventListener("click", this.reset.bind(this));
    range.addEventListener("input", this.addRollback.bind(this));
  },
  addRollback: function (event) {
    this.rollback = +event.target.value;
    rangeValue.textContent = event.target.value + "%";
  },
  addTitle: function () {
    document.title = title.textContent;
  },
  showResult: function () {
    layoutCost.value = this.screenPrice;
    servicesCost.value = this.servicePricesPercent + this.servicePricesNumber;
    totalCost.value = this.fullPrice;
    totalCostRollback.value = this.servicePercentPrice;
    screensCount.value = this.count;
  },
  addScreens: function () {
    screenBlocks = document.querySelectorAll(".screen");
    screenBlocks.forEach((screen, index) => {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input");
      const selectName = select.options[select.selectedIndex].textContent;
      this.screens.push({
        id: index,
        name: selectName,
        price: +select.value * +input.value,
        count: +input.value,
      });
    });
  },
  addServices: function () {
    percent.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check.checked) {
        this.servicesPercent[label.textContent] = +input.value;
      }
    });

    number.forEach((item) => {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check.checked) {
        this.servicesNumber[label.textContent] = +input.value;
      }
    });
  },
  start: function () {
    this.isError = false;
    screenBlocks = document.querySelectorAll(".screen");

    screenBlocks.forEach((screen) => {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input");
      if (input.value.trim() === "" || select.value.trim() === "") {
        this.isError = true;
      }
    });

    if (!this.isError) {
      this.itemsBlock();
      this.addScreens();
      this.addServices();
      this.addPrices();
      // appData.getServicePercentPrices(appData.fullPrice, appData.rollback);
      // appData.logger();
      console.log(this);
      this.showResult();
    } else {
      alert("Пожалуйста, заполните поля");
    }
  },
  itemsBlock: function () {
    screenBlocks = document.querySelectorAll(".screen");
    screenBlocks.forEach((screen) => {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input");
      select.setAttribute("disabled", "");
      input.setAttribute("disabled", "");
    });
    buttonCalculate.style.display = "none";
    buttonReset.style.display = "block";
  },
  reset: function () {
    buttonReset.style.display = "none";
    buttonCalculate.style.display = "block";

    screenBlocks = document.querySelectorAll(".screen");
    for (let i = 1; i < screenBlocks.length; i++) {
      screenBlocks[i].parentNode.removeChild(screenBlocks[i]);
    }
    const select = screenBlocks[0].querySelector("select");
    const input = screenBlocks[0].querySelector("input");
    select.removeAttribute("disabled");
    select.value = "";
    input.removeAttribute("disabled");
    input.value = "";

    document.querySelectorAll("input[type=checkbox]").forEach((item) => {
      item.checked = false;
    });
    document.querySelectorAll(".total-input").forEach((item) => {
      item.value = "0";
    });

    this.screens.splice(0, this.screens.length);
    for (let key in this.servicesPercent) {
      delete this.servicesPercent[key];
    }
    for (let key in this.servicesNumber) {
      delete this.servicesNumber[key];
    }

    this.screenPrice = 0;
    this.servicePricesPercent = 0;
    this.servicePricesNumber = 0;
    this.fullPrice = 0;
    this.servicePercentPrice = 0;
    this.rollback = 0;
    this.count = 0;
    this.isError = false;

    range.value = "0";
    rangeValue.textContent = "0%";
  },
  addScreenBlock: function () {
    const cloneScreen = screenBlocks[0].cloneNode(true);
    cloneScreen.querySelector("input").value = "";
    screenBlocks[screenBlocks.length - 1].after(cloneScreen);
  },
  addPrices: function () {
    this.screenPrice = this.screens.reduce((sum, screen) => {
      return sum + screen.price;
    }, 0);

    for (let key in this.servicesNumber) {
      this.servicePricesNumber += this.servicesNumber[key];
    }

    for (let key in this.servicesPercent) {
      this.servicePricesPercent +=
        this.screenPrice * (this.servicesPercent[key] / 100);
    }

    this.fullPrice =
      +this.screenPrice + this.servicePricesPercent + this.servicePricesNumber;

    this.servicePercentPrice =
      this.fullPrice - this.fullPrice * (this.rollback / 100);

    this.count = this.screens.reduce((sum, screen) => {
      return sum + screen.count;
    }, 0);
  },
  // getServicePercentPrices: function (fullPrice, rollback) {
  //   appData.servicePercentPrice = fullPrice - fullPrice * (rollback / 100);
  // },
  logger: function () {
    console.log("Стоимость разработки сайта: " + this.fullPrice + " рублей");
    console.log(
      "Стоимость за вычетом отката посреднику: " + this.servicePercentPrice
    );
    for (let key in this) {
      console.log(key, this[key]);
    }
  },
};

appData.init();

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
    appData.addTitle();
    buttonPlus.addEventListener("click", appData.addScreenBlock);
    buttonCalculate.addEventListener("click", appData.start);
    range.addEventListener("input", appData.addRollback);
  },
  addRollback: function (event) {
    appData.rollback = +event.target.value;
    rangeValue.textContent = event.target.value + "%";
  },
  addTitle: function () {
    document.title = title.textContent;
  },
  showResult: function () {
    layoutCost.value = appData.screenPrice;
    servicesCost.value =
      appData.servicePricesPercent + appData.servicePricesNumber;
    totalCost.value = appData.fullPrice;
    totalCostRollback.value = appData.servicePercentPrice;
    screensCount.value = appData.count;
  },
  addScreens: function () {
    screenBlocks = document.querySelectorAll(".screen");
    screenBlocks.forEach(function (screen, index) {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input");
      const selectName = select.options[select.selectedIndex].textContent;
      appData.screens.push({
        id: index,
        name: selectName,
        price: +select.value * +input.value,
        count: +input.value,
      });
    });
  },
  addServices: function () {
    percent.forEach(function (item) {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check.checked) {
        appData.servicesPercent[label.textContent] = +input.value;
      }
    });

    number.forEach(function (item) {
      const check = item.querySelector("input[type=checkbox]");
      const label = item.querySelector("label");
      const input = item.querySelector("input[type=text]");

      if (check.checked) {
        appData.servicesNumber[label.textContent] = +input.value;
      }
    });
  },
  start: function () {
    appData.isError = false;
    screenBlocks = document.querySelectorAll(".screen");

    screenBlocks.forEach(function (screen, index) {
      const select = screen.querySelector("select");
      const input = screen.querySelector("input");
      if (input.value.trim() === "" || select.value.trim() === "") {
        appData.isError = true;
      }
    });

    if (!appData.isError) {
      appData.addScreens();
      appData.addServices();
      appData.addPrices();
      // appData.getServicePercentPrices(appData.fullPrice, appData.rollback);
      // appData.logger();
      console.log(appData);
      appData.showResult();
    } else {
      alert("Пожалуйста, заполните поля");
    }
  },
  addScreenBlock: function () {
    const cloneScreen = screenBlocks[0].cloneNode(true);
    screenBlocks[screenBlocks.length - 1].after(cloneScreen);
  },
  addPrices: function () {
    appData.screenPrice = appData.screens.reduce(function (sum, screen) {
      return sum + screen.price;
    }, 0);

    for (let key in appData.servicesNumber) {
      appData.servicePricesNumber += appData.servicesNumber[key];
    }

    for (let key in appData.servicesPercent) {
      appData.servicePricesPercent +=
        appData.screenPrice * (appData.servicesPercent[key] / 100);
    }

    appData.fullPrice =
      +appData.screenPrice +
      appData.servicePricesPercent +
      appData.servicePricesNumber;

    appData.servicePercentPrice =
      appData.fullPrice - appData.fullPrice * (appData.rollback / 100);

    appData.count = appData.screens.reduce(function (sum, screen) {
      return sum + screen.count;
    }, 0);
  },
  getServicePercentPrices: function (fullPrice, rollback) {
    appData.servicePercentPrice = fullPrice - fullPrice * (rollback / 100);
  },
  logger: function () {
    console.log("Стоимость разработки сайта: " + appData.fullPrice + " рублей");
    console.log(
      "Стоимость за вычетом отката посреднику: " + appData.servicePercentPrice
    );
    for (let key in appData) {
      console.log(key, appData[key]);
    }
  },
};

appData.init();

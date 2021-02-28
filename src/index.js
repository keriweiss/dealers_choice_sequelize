import axios from "axios";
import renderMain from "./main/main";
import { renderPopup, restaurantsPizzas } from "./popup/popup";
import renderPizzas from "./popup/pizzas";

const createEl = (el = "div") => document.createElement(el);
const nav = document.querySelector("nav");
let restaurantList = document.querySelector("#restaurant-list");
let restaurantPopup = document.querySelector("#restaurant-popup");

let restDetails, pizzaPile, toppings;

let isPreview = false;
document.addEventListener("click", async (ev) => {
  if (ev.target.className === "navpopup") window.close();
  if (ev.target.tagName === "NAV") {
    renderAll();
  }
  if (ev.target.parentElement.className === "restaurant") {
    // Had trouble getting the hash change to word properly. The hash would change correctly,
    // but popup would open with previous hash, not changed.
    // restaurantId = window.location.hash.slice(1);
    const restaurantId = ev.target.parentElement.id;
    window.open(`/${restaurantId}`, "popup", "width=800,height=800");
  }
  if (ev.target.id === "menupreview") {
    if (!isPreview) {
      renderPizzas({ restaurantsPizzas, toppings, restaurantPopup });
      isPreview = true;
    } else {
      restaurantPopup.removeChild(pizzaPile);
      isPreview = false;
    }
  }
});

document.addEventListener("DOMContentLoaded", async (ev) => {
  const restaurantId = location.pathname.slice(1);
  toppings = (await axios.get(`/api/pizza`)).data;
  restDetails = (await axios.get(`/api/restaurant/${restaurantId}`)).data;
  await renderPopup({ restDetails, restaurantPopup });
});

renderMain({ nav, restaurantList });

export default createEl;

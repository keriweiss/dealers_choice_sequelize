import axios from "axios";

let pizzaList = document.querySelector("#pizza-list");
let restaurantList = document.querySelector("#restaurant-list");
let restaurantPopup = document.querySelector("#restaurant-popup");
let restaurantId, restDetails, restaurantsPizzas;

const createEl = (el = "div") => document.createElement(el);
const nav = document.querySelector("nav");
const content = document.querySelector("#content");

const renderRestaurant = (restaurants) => {
  for (const restaurant of restaurants) {
    const restList = createEl("li");
    restList.innerHTML = `<a href ='#${restaurant.id}'>${restaurant.name}</a>`;
    restList.id = `${restaurant.id}`;
    restList.classList.toggle("restaurant");
    restaurantList.appendChild(restList);
  }
};

// const renderDetails = (restDetails) => {
//   const li = createEl("li");
//   li.innerHTML = restDetails.neighborhood;
//   const restaurant = document.querySelector(`#${restDetails.id}`);
//   console.log(restDetails);
//   for (const pizza of restDetails.pizzas) {
//     const ul = createEl("ul");
//     ul.innerHTML = pizza["unique-pizza"]["unique_name"]
//       ? `${pizza["unique-pizza"]["unique_name"]}: ${pizza.name}`
//       : pizza.name;
//     li.appendChild(ul);
//   }
//   restaurant.appendChild(li);
// };

const renderMain = async () => {
  console.log("test");
  nav.innerHTML = "Home";
  restaurantList.innerHTML = "";
  // const pizzas = (await axios.get("/api/pizza")).data;
  const restaurants = (await axios.get("/api/restaurant")).data;
  await renderRestaurant(restaurants);
};

const renderPopup = async (restDetails) => {
  restaurantPopup.innerHTML = `${restDetails.name.toUpperCase()}`;
  console.log(restDetails);
  const detailList = createEl();
  const { neighborhood, year_opened, waitservice, slice, pizzas } = restDetails;
  const description = createEl("p");
  description.innerHTML = `Neighborhood: ${neighborhood}<br>Since: ${new Date(
    year_opened
  ).getFullYear()}<br>Serving slices: ${
    slice ? "Yes" : "No"
  }<br>Waiter service: ${waitservice ? "Yes" : "No"}`;
  detailList.append(description);
  const menuPreview = createEl("button");
  menuPreview.id = "menupreview";
  menuPreview.innerHTML = `Pizza Preview`;
  restaurantPopup.appendChild(detailList);
  restaurantPopup.appendChild(menuPreview);
  restaurantsPizzas = pizzas;
};

const renderPizzas = async (restaurantsPizzas) => {
  restaurantsPizzas.forEach((za) => {
    const pie = createEl("p");
    console.log(za);
    za.unique_pizza.unique_name
      ? (pie.innerHTML = `${za.unique_pizza.unique_name}`)
      : (pie.innerHTML = `${za.name}`);
    restaurantPopup.appendChild(pie);
  });
};
let isPreview = false;
document.addEventListener("click", async (ev) => {
  if (ev.target.className === "navpopup") window.close();
  if (ev.target.tagName === "NAV") {
    renderAll();
  }
  if (ev.target.parentElement.className === "restaurant") {
    restaurantId = await window.location.hash.slice(1);
    // restDetails = (await axios.get(`/api/restaurant/${restaurantId}`)).data;
    await window.open(`/${restaurantId}`, "popup", "width=600,height=600");
    // renderDetails(restDetails);
  }
  if (ev.target.id === "menupreview") {
    if (!isPreview) {
      renderPizzas(restaurantsPizzas);
      isPreview = true;
    }
  }
});

document.addEventListener("DOMContentLoaded", async (ev) => {
  restaurantId = location.pathname.slice(1);
  restDetails = (await axios.get(`/api/restaurant/${restaurantId}`)).data;
  await renderPopup(restDetails);
});

renderMain();

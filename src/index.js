import axios from "axios";

let whatsPizza = document.querySelector("#whatspizza");
let restaurantList = document.querySelector("#restaurant-list");
let restaurantPopup = document.querySelector("#restaurant-popup");
let restaurantId, restDetails, restaurantsPizzas, pizzaPile, toppings;

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

const renderMain = async () => {
  nav.innerHTML = "Home";
  restaurantList.innerHTML = "";
  const restaurants = (await axios.get("/api/restaurant")).data;
  await renderRestaurant(restaurants);
  await renderWhatIsPizza(toppings);
};

const renderPopup = async (restDetails) => {
  restaurantPopup.innerHTML = `<h2>${restDetails.name.toUpperCase()}</h2>`;
  const detailList = createEl();
  const description = createEl("p");
  const menuPreview = createEl("button");
  const { neighborhood, year_opened, waitservice, slice, pizzas } = restDetails;

  description.innerHTML = `Neighborhood: ${neighborhood}<br>Since: ${new Date(
    year_opened
  ).getFullYear()}<br>Serving slices: ${
    slice ? "Yes" : "No"
  }<br>Waiter service: ${waitservice ? "Yes" : "No"}`;

  menuPreview.id = "menupreview";
  menuPreview.innerHTML = `Pizza Preview`;

  detailList.append(description);
  restaurantPopup.append(detailList, menuPreview);

  restaurantsPizzas = pizzas;
};

const renderWhatIsPizza = async (toppings) => {};

const renderPizzas = async (restaurantsPizzas, toppings) => {
  const pizzaPile = createEl();
  pizzaPile.id = "pizzapile";
  restaurantsPizzas.forEach((za) => {
    const pie = createEl("li");
    za.unique_pizza.unique_name
      ? (pie.innerHTML = `${za.unique_pizza.unique_name} (${za.name})`)
      : (pie.innerHTML = `${za.name}`);
    for (let base of toppings) {
      if (base.id === za.id && !za.unique_pizza.unique_name) {
        if (base.toppings.length) {
          pie.innerHTML += `<br><span id = toppingsLabel>Toppings:<span>`;
          for (let topping of base.toppings) {
            if (topping.name !== za.name) pizzaPile.appendChild(pie);
            console.log(restaurantsPizzas);
            const toppingsList = createEl("ul");
            toppingsList.innerHTML = `${topping.name}`;
            pie.appendChild(toppingsList);
          }
        }
      }
    }
    if (za.unique_pizza.unique_name) pizzaPile.appendChild(pie);
  });
  restaurantPopup.appendChild(pizzaPile);
};

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
    restaurantId = ev.target.parentElement.id;
    window.open(`/${restaurantId}`, "popup", "width=800,height=800");
  }
  if (ev.target.id === "menupreview") {
    if (!isPreview) {
      renderPizzas(restaurantsPizzas, toppings);
      isPreview = true;
    } else {
      pizzaPile = document.querySelector("#pizzapile");
      console.log(pizzaPile);
      restaurantPopup.removeChild(pizzaPile);
      isPreview = false;
    }
  }
});

document.addEventListener("DOMContentLoaded", async (ev) => {
  restaurantId = location.pathname.slice(1);
  toppings = (await axios.get(`/api/pizza`)).data;
  restDetails = (await axios.get(`/api/restaurant/${restaurantId}`)).data;
  await renderPopup(restDetails);
});

renderMain();

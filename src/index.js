import axios from "axios";

const createEl = (el = "div") => document.createElement(el);
const nav = document.querySelector("nav");
let restaurantList = document.querySelector("#restaurant-list");
let restaurantPopup = document.querySelector("#restaurant-popup");

let restDetails, restaurantsPizzas, pizzaPile, toppings, uniqueNames;

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

  uniqueNames = pizzas.map((za) => {
    if (za.unique_pizza.unique_name) {
      return za.name;
    }
    return null;
  });
  restaurantsPizzas = pizzas;
};

// rendering pizza list for each restaurant, where if pizza has a unique name,
// unique name is displayed with description in parenthesis
const renderPizzas = async (restaurantsPizzas, toppings) => {
  let allToppings = [];
  const restPizzas = restaurantsPizzas.map((za) => za.name);
  pizzaPile = createEl();
  pizzaPile.id = "pizzaPile";
  restaurantsPizzas.forEach((za) => {
    const pie = createEl("li");
    za.unique_pizza.unique_name
      ? (pie.innerHTML = `${za.unique_pizza.unique_name} (${za.name})`)
      : (pie.innerHTML = `${za.name}`);

    // creating array of toppings for each restaurant, where if the topping is on a pizza
    // with a unique name, the topping is left off of the list.

    for (let base of toppings) {
      if (
        base.id === za.id &&
        !za.unique_pizza.unique_name &&
        base.toppings.length
      ) {
        for (let topping of base.toppings) {
          if (topping.name !== za.name) pizzaPile.appendChild(pie);
          if (
            restPizzas.includes(topping.name) &&
            !uniqueNames.includes(topping.name)
          )
            allToppings.push(topping.name);
        }
      }
    }
    if (za.unique_pizza.unique_name) pizzaPile.appendChild(pie);
  });
  const uniqueToppings = new Set(allToppings);
  const toppingList = createEl("h4");
  if (allToppings.length) toppingList.innerHTML = "Toppings:";

  restaurantPopup.appendChild(pizzaPile);
  pizzaPile.appendChild(toppingList);
  uniqueToppings.forEach((topping) => {
    const aTopping = createEl("ul");
    aTopping.innerHTML = topping;
    toppingList.appendChild(aTopping);
  });
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
    const restaurantId = ev.target.parentElement.id;
    window.open(`/${restaurantId}`, "popup", "width=800,height=800");
  }
  if (ev.target.id === "menupreview") {
    if (!isPreview) {
      renderPizzas(restaurantsPizzas, toppings);
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
  await renderPopup(restDetails);
});

renderMain();

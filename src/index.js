import axios from "axios";

let pizzaList = document.querySelector("#pizza-list");
let restaurantList = document.querySelector("#restaurant-list");

const createEl = (el = "div") => document.createElement(el);
const nav = document.querySelector("nav");
const content = document.querySelector("#content");

// const renderPizza = (pizzas) => {
//   for (const pizza of pizzas) {
//     const newLi = document.createElement("li");
//     newLi.innerHTML = `${pizza.name}`;
//     newLi.id = pizza.id;
//     newLi.classList.toggle("pizza");
//     pizzaList.appendChild(newLi);
//   }
// };

const renderRestaurant = (restaurants) => {
  for (const restaurant of restaurants) {
    const li = createEl("li");
    li.innerHTML = `<a href ='#${restaurant.id}'>${restaurant.name}</a>`;
    li.id = restaurant.id;
    li.classList.toggle("restaurant");
    // for (const pizza of restaurant.pizzas) {
    //   const ul = createEl("ul");
    //   ul.innerHTML = pizza["unique-pizza"]["unique_name"]
    //     ? `${pizza["unique-pizza"]["unique_name"]}: ${pizza.name}`
    //     : pizza.name;
    //   li.appendChild(ul);
    // }
    restaurantList.appendChild(li);
  }
};

const renderDetails = (restDetails) => {
  const li = createEl("li");
  console.log(restDetails);
  li.innerHTML = restDetails.name;
  pizzaList.appendChild(li);
};

const renderAll = async () => {
  // const restaurantId = window.location.hash.slice(1);
  // content.innerHTML = "";
  nav.innerHTML = "Home";
  // const restDetails = (await axios.get(`/api/restaurant/${restaurantId}`)).data;
  const pizzas = (await axios.get("/api/pizza")).data;
  const restaurants = (await axios.get("/api/restaurant")).data;
  renderRestaurant(restaurants);
};

document.addEventListener("click", async (ev) => {
  if (ev.target.tagName === "NAV") {
    renderAll();
  }
  const restaurantId = window.location.hash.slice(1);
  const restDetails = (await axios.get(`/api/restaurant/${restaurantId}`)).data;
  console.log(ev.target.parentElement);
  if (ev.target.parentElement.className === "restaurant") {
    console.log("true");
    renderDetails(restDetails);
  }
});

renderAll();

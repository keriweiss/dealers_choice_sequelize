import axios from "axios";
import createEl from "../index";

const renderRestaurant = async ({ restaurants, restaurantList }) => {
  for (const restaurant of restaurants) {
    const restList = createEl("li");
    restList.innerHTML = `<a href ='#${restaurant.id}'>${restaurant.name}</a>`;
    restList.id = `${restaurant.id}`;
    restList.classList.toggle("restaurant");
    restaurantList.appendChild(restList);
  }
};

export default renderRestaurant;

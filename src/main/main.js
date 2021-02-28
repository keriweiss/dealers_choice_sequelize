import axios from "axios";
import renderRestaurant from "./restaurant";

const renderMain = async ({ nav, restaurantList }) => {
  nav.innerHTML = "Home";
  restaurantList.innerHTML = "";
  const restaurants = (await axios.get("/api/restaurant")).data;
  await renderRestaurant({ restaurants, restaurantList });
};

export default renderMain;

import createEl from "../index";
import { uniqueNames } from "./popup";

//I should probably split renderPizzas up into 2 renders - (renderPizzas, renderToppings).
const renderPizzas = async ({
  restaurantsPizzas,
  toppings,
  restaurantPopup,
}) => {
  let allToppings = [];
  const restPizzas = restaurantsPizzas.map((za) => za.name);
  const pizzaPile = createEl();
  pizzaPile.id = "pizzaPile";
  restaurantsPizzas.forEach((za) => {
    const pie = createEl("li");
    za.unique_pizza.unique_name
      ? (pie.innerHTML = `${za.unique_pizza.unique_name} (${za.name})`)
      : (pie.innerHTML = `${za.name}`);

    // creating array of toppings for each restaurant, where if the topping is the same as
    // a pizza with a unique name, the topping is left off of the list.
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

  uniqueToppings.forEach((topping) => {
    const aTopping = createEl("ul");
    aTopping.innerHTML = topping;
    toppingList.appendChild(aTopping);
  });

  restaurantPopup.appendChild(pizzaPile);
  pizzaPile.appendChild(toppingList);
};

export default renderPizzas;

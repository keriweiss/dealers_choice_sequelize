import createEl from "../index";

let uniqueNames, restaurantsPizzas;

const renderPopup = async ({ restDetails, restaurantPopup }) => {
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

export { renderPopup, uniqueNames, restaurantsPizzas };

var Entrées = null;
var sidesAndVegetables = null;
var soups = null;

async function getLunch() {
  const url = "https://www.sagedining.com/microsites/getMenuItems?menuId=127574&date=04/30/2025&meal=Lunch&mode=";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const text = await response.text();
    const data = JSON.parse(text);

    Entrées = data["Entrées"] || [];
    sidesAndVegetables = data["Sides and Vegetables"] || [];
    soups = data["Soups"] || [];

    function logCategoryItems(categoryName, items) {
      console.log(`${categoryName}:`);
      if (items && items.length > 0) {
        items.forEach(item => {
          console.log(`- ${item.name}`);
        });
      } else {
        console.log(`No ${categoryName.toLowerCase()} available today.`);
      }
    }

    logCategoryItems("Entrées", Entrées);
    logCategoryItems("Sides and Vegetables", sidesAndVegetables);
    logCategoryItems("Soups", soups);

    return data;
  } catch (error) {
    console.error("Error fetching or parsing data:", error.message);
  }
}

async function getEntrées() {
  return Entrées;
}

async function getSidesAndVegetables() {
  return sidesAndVegetables;
}

async function getSoups() {
  return soups;
}

getLunch();
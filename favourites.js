const recipeContainer = document.querySelector(".recipe"); //элемент-контейнер для вставки карточки рецепта
const favouritesMessage = document.querySelector(".favourites__msg"); // сообщение об отсутствии добавленных фаворитов
let count; //вспомогательный счётчик для генерирования уникальных ключей в локальном хранилище
if (localStorage.length == 0) {
    count = 0;
} else {
    count = Math.max.apply(null, Object.keys(localStorage)); // счётчик принимает значение максимального ключа, имеющегося в локальном хранилище
    favouritesMessage.hidden = true;
}
for (let key in localStorage) {
    // извлечение идентификаторов рецептов из локального хранилища
    let value = localStorage[key].toString();
    if (value.startsWith("recipe")) {
        getRecipeById(value);
    }
}
// функция вывода карточки рецепта
function getRecipeById(id) {
    recipeContainer.innerHTML = "";
    fetch(
        `https://api.edamam.com/api/recipes/v2/${id}?type=public&app_id=9b9922f0&app_key=9a7c84f1906467f9c52cc89461237793`
    )
        .then((response) => response.json())
        .then((data) => {
            const currentRecipe = data.recipe;
            const ingredientsArray = currentRecipe.ingredients;
            const ingredientText = document.createElement("p"); //создаём элемент под вывод ингредиентов
            for (let ingredient of ingredientsArray) {
                ingredientText.innerText += `${ingredient.text} <br>`;
            } //выводим текст каждого из ингредиентов
            let recipeIUri = currentRecipe.uri;
            let recipeId = recipeIUri.substring(recipeIUri.indexOf("#") + 1);
            recipeContainer.innerHTML += `<div class="recipe__container">
      <div class="recipe__wrapper">
          <div class="recipe__description">
              <h3>${currentRecipe.label}</h3>
              <div class="recipe__id" hidden>${recipeId}</div> 
              <div class="recipe__text">
              <div class="recipe__ingredients">
                  <h4>Ingredients:</h4>
                  <p>${ingredientText.innerText}</p>
              </div>
              <div class="recipe__calories">
                  <h4>Calories:</h4>
                  <p>${Math.round(currentRecipe.calories)} cal</p>
              </div>
              </div>
              <div class="recipe__btns">
              <a href="${
                  currentRecipe.url
              }" target="_blank"><button class="recipe__btn">To the recipe</button></a>
              <img class="fav__icon" src="./assets/icons/added-hovered.svg">
                        </div>
          </div>
          <div class="recipe__img">
              <img
                  src="${currentRecipe.image}"
                  alt="recipe-image"
              />
          </div>
      </div>
      </div> `;
      const icons = document.querySelectorAll(".fav__icon"); // иконки добавления в избранное
            //добавление событий на иконки избранного
            icons.forEach((icon) => {
                icon.addEventListener("mouseover", () => {
                    let srcString = icon.src;
                    if (srcString.endsWith("add-static.svg")) {
                        icon.src = "./assets/icons/add-hovered.svg";
                    } else {
                        icon.src = "./assets/icons/added-static.svg";
                    }
                })
                icon.addEventListener("mouseout", () => {
                    let srcString = icon.src;
                    if (
                        srcString.endsWith("add-hovered.svg") ||
                        srcString.endsWith("add-static.svg")
                    ) {
                        icon.src = "./assets/icons/add-static.svg";
                    } else {
                        icon.src = "./assets/icons/added-hovered.svg";
                    }
                })
                icon.addEventListener("click", () => {
                    let srcString = icon.src;
                    if (
                        srcString.endsWith("add-hovered.svg") ||
                        srcString.endsWith("add-static.svg")
                    ) {
                        icon.src = "./assets/icons/added-hovered.svg";
                        count++;
                        let iconParent = icon.parentNode.parentNode; // через родительский узел кликнутой иконки извлекаем id рецепта
                        let id = iconParent.querySelector(".recipe__id").innerHTML;
                        let key = `${count}`;
                        let value = id;
                        localStorage.setItem(key, value); // добавление id рецепта в локальное хранилище
                    } else {
                        let iconParent = icon.parentNode.parentNode;
                        let id = iconParent.querySelector(".recipe__id").innerHTML;
                        let recipeKey;
                        for (let key in localStorage) {
                            if (localStorage[key] == id) {
                                recipeKey = key;
                            }
                        }
                        localStorage.removeItem(recipeKey); // удаление рецепта из локального хранилища
                        icon.src = "./assets/icons/add-static.svg";
                    }
                })
            })
        })
}

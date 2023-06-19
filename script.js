// Даша
const recipeContainer = document.querySelector(".recipe"); //элемент-контейнер для вставки карточки рецепта
const recipeInput = document.getElementById("recipe-input"); //инпут ввода названия рецепта
const cuisineTypeInput = document.getElementById("cuisine-type"); //выпад список выбора cuisine-type
const dishTypeInput = document.getElementById("dish-type"); //выпад список выбора dish-type
const searchButton = document.querySelector(".search-screen__button"); //кнопка Search
let mealTypeArray =[]; //массив со значениями meal-type
let dietTypeArray =[]; //массив со значениями diet-type
let extraParamsArray =[];//массив со значениями diet-type

//функция выбора meal-type
function getMealType() {
  let checkboxes = document.querySelectorAll('input[name="meal-type"]:checked');
  let output = [];
  checkboxes.forEach((checkbox) => {
    output.push(checkbox.value);
  });
  mealTypeArray=output;
  console.log(mealTypeArray);
}

//функция выбора diet-type
function getDietType() {
  let checkboxes = document.querySelectorAll('input[name="diet-type"]:checked');
  let output = [];
  checkboxes.forEach((checkbox) => {
    output.push(checkbox.value);
  });
  dietTypeArray=output;
  console.log(dietTypeArray);
}

//функция выбора extra-params
function getExtraParams() {
  let checkboxes = document.querySelectorAll(
    'input[name="health"]:checked'
  );
  let output = [];
  checkboxes.forEach((checkbox) => {
    output.push(checkbox.value);
  });
  extraParamsArray=output;
  console.log(extraParamsArray);
}

// searchButton.addEventListener('click',getMealType );
// searchButton.addEventListener('click',getDietType );
// searchButton.addEventListener('click',getExtraParams);



// функция генерации url

function createUrl() {
  let url = `https://api.edamam.com/api/recipes/v2?type=public&app_id=49cb99a1&app_key=6fdb65e8bebf7aae4729017d5d272627`;

  if (recipeInput.value !== "") {
    url += `&q=${recipeInput.value}`;
  }
  if (cuisineTypeInput.value !== "") {
    url += `&cuisineType=${cuisineTypeInput.value}`;
  }

  if (dishTypeInput.value !== "") {
    url += `&dishType=${dishTypeInput.value}`;
  }

  if (mealTypeArray.length !== 0) {
    mealTypeArray.forEach ((elem) => {
        url += `&mealType=${elem}`;
    }) 
  }

  if (dietTypeArray.length !== 0) {
    dietTypeArray.forEach ((elem) => {
        url += `&dietType=${elem}`;
    }) 
  }

  if (extraParamsArray.length !== 0) {
    extraParamsArray.forEach ((elem) => {
        url += `&health=${elem}`;
    }) 
  }
  console.log(url);
  return url;
}


// функция вывода карточки рецепта
function getRecipe() {
    recipeContainer.innerHTML = "";
    fetch(`${createUrl()}`)
    .then((response) => response.json())
    .then((data) => {
        console.log(data);
        const recipesArray = data.hits;
        console.log(recipesArray);
        for (let recipe of recipesArray) {
          console.log(recipe);
          console.log(recipe.recipe.label);
          console.log(recipe.recipe.calories);
          console.log(recipe.recipe.ingredients);
          const ingredientsArray = recipe.recipe.ingredients;
          const ingredientText = document.createElement("p"); //создаём элемент под вывод ингредиентов
          const favouriteIconContainer = document.createElement("div");//создаём контейнер для сердечка избранного
          favouriteIconContainer.classList.add('fav__icon-container');
          const favouriteIcon = document.createElement("img");//создаём элемент сердечко избранное
          favouriteIcon.classList.add('fav__icon');
          favouriteIcon.src='./assets/icons/add-static.svg';
          favouriteIcon.title='Добавить в избранное';
          favouriteIconContainer.appendChild(favouriteIcon);
          recipeContainer.appendChild(favouriteIconContainer);
          for (let ingredient of ingredientsArray) {
            console.log(ingredient.text);
            ingredientText.innerText += `${ingredient.text} <br>`;
          }; //выводим текст каждого из ингредиентов
  
          recipeContainer.innerHTML += `<div class="recipe__container">
      <div class="recipe__wrapper">
          <div class="recipe__description">
              <h3>${recipe.recipe.label}</h3>
              <div class="recipe__text">
              <div class="recipe__ingredients">
                  <h4>Ingredients:</h4>
                  <p>${ingredientText.innerText}</p>
              </div>
              <div class="recipe__calories">
                  <h4>Calories:</h4>
                  <p>${Math.round(recipe.recipe.calories)} cal</p>
              </div>
              </div>
              <a href="${recipe.recipe.url}" target="_blank"><button class="recipe__btn">To the recipe</button></a>
          </div>
          <div class="recipe__img">
              <img
                  src="${recipe.recipe.image}"
                  alt="recipe-image"
              />
          </div>
      </div>
      </div> `;
        }
      })
  };
  


  

  // добавляем обработчик событий на Search
searchButton.addEventListener("click", getRecipe);




// let url = `https://api.edamam.com/api/recipes/v2?app_id=49cb99a1&app_key=6fdb65e8bebf7aae4729017d5d272627`;
// `https://api.edamam.com/search?q=&app_id=49cb99a1&app_key=6fdb65e8bebf7aae4729017d5d272627&diet=balanced&mealType=breakfast`
{/* <img class="fav__icon" src="./assets/icons/add-static.svg"></img> */}



























































































//Альбина
const icons = document.querySelectorAll('.fav__icon');
icons.forEach(icon => {
    icon.addEventListener('mouseover', () => {
        let srcString = icon.src;
        if(srcString.endsWith('add-static.svg')){
            icon.src = './assets/icons/add-hovered.svg';
        } else {
            icon.src = './assets/icons/added-static.svg';
        }
    })
    icon.addEventListener('mouseout', () => {
        let srcString = icon.src;
        if(srcString.endsWith('add-hovered.svg') || srcString.endsWith('add-static.svg')){
            icon.src = './assets/icons/add-static.svg';
        } else {
            icon.src = './assets/icons/added-hovered.svg';
        }
        
    })
    icon.addEventListener('click', () => {
        let srcString = icon.src;
        if(srcString.endsWith('add-hovered.svg') || srcString.endsWith('add-static.svg')){
            icon.src = './assets/icons/added-hovered.svg';
        } else {
            icon.src = './assets/icons/add-static.svg';
        }
        
    })
})



























































































































































































































//Лена

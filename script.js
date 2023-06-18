// Даша
const recipeContainer = document.querySelector('.recipe');
console.log(recipeContainer);

// заполняем карточку рецепта
fetch('https://api.edamam.com/search?q=&app_id=49cb99a1&app_key=6fdb65e8bebf7aae4729017d5d272627&diet=balanced&mealType=breakfast')
.then(response =>response.json())
.then(data => {
console.log(data);
const recipesArray = data.hits;
console.log(recipesArray);
for (let recipe of recipesArray) {
console.log(recipe);
console.log(recipe.recipe.label);
console.log(recipe.recipe.calories);
console.log(recipe.recipe.ingredients);
const ingredientsArray = recipe.recipe.ingredients;
const ingredientText=document.createElement('p'); //создаём элемент под вывод ингредиентов
for (let ingredient of ingredientsArray) {
    console.log(ingredient.text);
    ingredientText.innerText+=`${ingredient.text} <br>`
} //выводим текст каждого из ингредиентов

recipeContainer.innerHTML+=`<div class="recipe__container">
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
</div> `
}}
)
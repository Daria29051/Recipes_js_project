// Даша
const recipeContainer = document.querySelector(".recipe"); //элемент-контейнер для вставки карточки рецепта
const recipeInput = document.getElementById("recipe-input"); //инпут ввода названия рецепта
const cuisineTypeInput = document.getElementById("cuisine-type"); //выпад список выбора cuisine-type
const dishTypeInput = document.getElementById("dish-type"); //выпад список выбора dish-type
const searchButton = document.querySelector(".search-screen__button"); //кнопка Search
let mealTypeArray =[]; //массив со значениями meal-type
let dietTypeArray =[]; //массив со значениями diet-type
let extraParamsArray =[];//массив со значениями diet-type
let count; //вспомогательный счётчик для генерирования уникальных ключей в локальном хранилище
if(localStorage.length == 0){
    count = 0;
} else {
    count = Math.max.apply(null, Object.keys(localStorage)); // счётчик принимает значение максимального ключа, имеющегося в локальном хранилище
}


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

        if (recipesArray.length===0) {
          recipeContainer.classList.add('error');
          throw new Error('Recipe is not found');
        }

        for (let recipe of recipesArray) {
          console.log(recipe);
          console.log(recipe.recipe.label);
          console.log(recipe.recipe.calories);
          console.log(recipe.recipe.ingredients);
          const ingredientsArray = recipe.recipe.ingredients;
          const ingredientText = document.createElement("p"); //создаём элемент под вывод ингредиентов
          for (let ingredient of ingredientsArray) {
            console.log(ingredient.text);
            ingredientText.innerText += `${ingredient.text} <br>`;
          }; //выводим текст каждого из ингредиентов
          let recipeIUri= recipe.recipe.uri;
          let recipeId = recipeIUri.substring(recipeIUri.indexOf('#') + 1);
          console.log(recipeId);
          recipeContainer.innerHTML += `<div class="recipe__container">
      <div class="recipe__wrapper">
          <div class="recipe__description">
              <h3>${recipe.recipe.label}</h3>
              <div class="recipe__id" hidden>${recipeId}</div>
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
              <div class="recipe__btns">
              <a href="${recipe.recipe.url}" target="_blank"><button class="recipe__btn">To the recipe</button></a>
              <img class="fav__icon" src="./assets/icons/add-static.svg">
                        </div>
          </div>
          <div class="recipe__img">
              <img
                  src="${recipe.recipe.image}"
                  alt="recipe-image"
              />
          </div>
      </div>
      </div> `;
      
      //Альбина
const icons = document.querySelectorAll('.fav__icon'); // иконки добавления в избранное
//добавление событий на иконки избранного
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
            count++;
            let iconParent = icon.parentNode.parentNode; // через родительский узел кликнутой иконки извлекаем id рецепта
            let id = (iconParent.querySelector('.recipe__id')).innerHTML;
            let key = `${count}`;
            let value = id;
            localStorage.setItem(key, value); // добавление id рецепта в локальное хранилище
        } else {
          let iconParent = icon.parentNode.parentNode;
            let id = (iconParent.querySelector('.recipe__id')).innerHTML;
            let recipeKey;
            for(let key in localStorage){
              if(localStorage[key] == id){
                recipeKey = key;
              }
            }
            localStorage.removeItem(recipeKey); // удаление рецепта из локального хранилища
            icon.src = './assets/icons/add-static.svg';
        }
        
    })
})

        }
      })

      
  .catch(err=> {
    recipeContainer.innerHTML = `An error occured: ${err.message}. Please, try again.`;
        console.log(`An error occured: ${err.message}. Please, try again.`);  
        }
        )
  };
  


  

  // добавляем обработчик событий на Search
searchButton.addEventListener("click", getRecipe);




// let url = `https://api.edamam.com/api/recipes/v2?app_id=49cb99a1&app_key=6fdb65e8bebf7aae4729017d5d272627`;
// `https://api.edamam.com/search?q=&app_id=49cb99a1&app_key=6fdb65e8bebf7aae4729017d5d272627&diet=balanced&mealType=breakfast`
{/* <img class="fav__icon" src="./assets/icons/add-static.svg"></img> */}






















































































































































































































































































































//Лена модальное окно для введения сообщения
// let modal = document.getElementById ('myModal');
// let message = document.getElementById ('header_message');
// let span = document.getElementsByClassName ("close")[0];

// message.onclick = function () {
//   modal.style.display = "block";
// }
// span.onclick = function () {
//   modal.style.display = "none";
// }
// window.onclick = function (event) {
//   if (event.target == modal) {
//     modal.style.display = "none";
//   }
// }
let message = document.getElementById ('header_message');
let modal = document.getElementById ('myModal');
message.addEventListener('click', () => {
  modal.style.display = "block";
  modal.innerHTML += `<div class="modal-content">
  <span class="close"></span>
    <div class="modal_wrapper">
      <input placeholder="Your name" class="input"></input>
      <input placeholder="Your email" class="input" id="emailUser"></input>
      <input placeholder="Leave us a message" class="input"></input>
    </div> 
    <button class="btn_send">Send</button>
  </div>`;
  let span = document.getElementsByClassName ("close")[0];
  message.onclick = function () {
  modal.style.display = "block";
}
span.onclick = function () {
  modal.style.display = "none";
}
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
let btnSend = document.getElementsByClassName('.btn_send');
btnSend.addEventListener ('click', () => {
  let forms = document.querySelectorAll ('.input');
  let emailUser = document.getElementById ('emailUser');

function validateEmail(emailUser) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

forms.onsubmit = function () {
  let emailVal = emailUser.value;
  let emptyInputs = Array.from(forms).filter(input => input.value === '');
  forms.forEach (function (input) {
    if (input.value === '' ){
      input.classList.add('error');
      console.log('not filled');
    }else{
      input.classList.remove('error');
    }
  });
  if (emptyInputs.length !== 0) {
    console.log('not filled');
    return false;
  }

  if (!validateEmail (emailValid)) {
    console.log ('email not valid');
    return false;
  }
}
})
})

//проверка заполнения данных в модальном окне
// let forms = document.querySelectorAll ('.input');
// let emailUser = document.getElementById ('emailUser');

// function validateEmail(emailUser) {
//   let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   return re.test(String(email).toLowerCase());
// }

// forms.onsubmit = function () {
//   let emailVal = emailUser.value;
//   let emptyInputs = Array.from(forms).filter(input => input.value === '');
//   forms.forEach (function (input) {
//     if (input.value === '' ){
//       input.classList.add('error');
//       console.log('not filled');
//     }else{
//       input.classList.remove('error');
//     }
//   });
//   if (emptyInputs.length !== 0) {
//     console.log('not filled');
//     return false;
//   }

//   if (!validateEmail (emailValid)) {
//     console.log ('email not valid');
//     return false;
//   }
// }

// let btnSend = document.getElementsByClassName('.btn_send');
// btnSend.addEventListener ('click', () => {
//   if ( document.getElementById('userName').value == "" ) {
//     alert ( "Please fill in your name" ); valid = false;
//   }
//   return valid;
// })



// проверка имейла на валидность
const submit = document.getElementById ("submit");
const emailCheck = document.getElementById ("e-mail");
const expression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
let span1 = document.querySelector ('.span1');
submit.onclick = function (e) {
  e.preventDefault();
  if(!validate (expression, emailCheck.value)){
    notValid (submit, span1, 'Your email is invalid');
  }else{
    valid (submit, span1, 'You have successfully subscribed');
  }

  function validate (regex, submit) {
    return regex.test(submit);
  }
  function notValid (submit, el, mess) {
    submit.classList.add('is-invalid');
    el.innerHTML = mess;
  }
  function valid (submit, el, mess) {
    submit.classList.remove('is-invalid');
    submit.classList.add('is-valid');
    el.innerHTML = mess;
  }
}


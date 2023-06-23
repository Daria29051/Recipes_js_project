// Даша
// ПЕРЕМЕННЫЕ ДЛЯ БЛОКА ПОИСКА РЕЦЕПТОВ
const recipeContainer = document.querySelector(".recipe"); //элемент-контейнер для вставки карточки рецепта
const recipeInput = document.getElementById("recipe-input"); //инпут ввода названия рецепта
const cuisineTypeInput = document.getElementById("cuisine-type"); //выпад список выбора cuisine-type
const dishTypeInput = document.getElementById("dish-type"); //выпад список выбора dish-type
const searchButton = document.querySelector(".search-screen__button"); //кнопка Search
let mealTypeArray =[]; //массив со значениями meal-type
let dietTypeArray =[]; //массив со значениями diet-type
let extraParamsArray =[];//массив со значениями diet-type


//ПЕРЕМЕННЫЕ ДЛЯ РАЗДЕЛА FAVOURITES
let count; //вспомогательный счётчик для генерирования уникальных ключей в локальном хранилище


//ПЕРЕМЕННЫЕ ДЛЯ МОДАЛЬНОГО ОКНА LOGIN
const loginHeaderButton = document.querySelector('.header_login'); //кнопка Login в header

//ПЕРЕМЕННЫЕ ДЛЯ МОДАЛЬНОГО ОКНА SEND A MESSAGE
const message = document.getElementById ('header_message'); ///кнопка SEND A MESSAGE в header


//ПЕРЕМЕННЫЕ ПРОВЕРКИ НА ВАЛИДНОСТЬ SUBSCRIBE В FOOTER
const submit = document.getElementById ("submit"); //кнопка subscribe в футере

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

// вешаем обработчик на кнопку Search
searchButton.addEventListener('click',getMealType );
searchButton.addEventListener('click',getDietType );
searchButton.addEventListener('click',getExtraParams);



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
    let iconParent = icon.parentNode.parentNode; // через родительский узел кликнутой иконки извлекаем id рецепта
    let id = (iconParent.querySelector('.recipe__id')).innerHTML;
    for(let key in localStorage){
      if(localStorage[key] == id){
        icon.src = './assets/icons/added-hovered.svg'; 
      }
    }
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
            let key = `${count}`;
            let value = id;
            localStorage.setItem(key, value); // добавление id рецепта в локальное хранилище
        } else {
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



// МОДАЛЬНОЕ ОКНО LOGIN (ДАША)


// вешаем обработчик событий (вызов модального окна по клику на пункт Login меню)
loginHeaderButton.addEventListener('click', createLoginModal);

//ФУНКЦИЯ-СБОРЩИК МОДАЛЬНОГО ОКНА
function createLoginModal() {
const loginModal = document.getElementById('loginModal');
loginModal.innerHTML = `<form><div class="modal-dialog" id="loginModalSignIn">
<div class="modal-content">
  <div class="modal-header">
  <img class="modal-logo" src="assets/icons/free-icon-restaurant-6122680.png">
    <h5 class="modal-title" id="loginModalLabel">Sign in</h5>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
  </div>
  <div class="modal-body">
  <div class="login__name-part hidden">
  <label for="login__name">First Name</label>
  <input type="text" id="login__name" class="login__name" />
</div>

<div class="login__surname-part hidden">
<label for="login__surname">Last Name</label>
<input type="text" id="login__surname" class="login__surname" />
</div>

  <div class="login__email-part">
  <label for="login__email">Email address</label>
  <input type="email" class="login__email" id="login__email" />
</div>

<div class="login__password-part">
  <label for="login__password">Password</label>
  <input type="password" class="login__password" />
</div>

<div class="login__confirm-password-part hidden">
<label for="login__confirm-password">Confirm Password</label>
<input type="password" id="login__confirm-password" class="login__confirm-password" />
</div>

</form>
<span class="login__error"></span>
<div class="login-button-part">
  <button class="login__login-button" type="button">Login</button>
</div>

<a class="login__forgot-password" href="#!">Forgot password?</a>
  </div>
  <div class="modal-footer">
    <p class="login__no-account">Don't have an account?</p>
 <a class="login__register-link" href="#!">Register here</a>
  <a href="#!" class="login__terms-of-use">Terms of use.</a>
  <a href="#!" class="login__privacy-policy">Privacy policy</a>
  <img class="login__img" src="assets/img/login-img.jpg">
  </div>
</div>
</div>`;
let loginModalWindow = new bootstrap.Modal(loginModal);
loginModalWindow.show();

//добавляем обработчики событий (изменение формы Sign in / Register и проверка валидности формы)
const registerLink = document.querySelector('.login__register-link');// ссылка смены формы Sign in / Register
registerLink.addEventListener('click', changeForm);
const loginButton = document.querySelector('.login__login-button');//кнопка Login
loginButton.addEventListener('click', checkValidity);

// переменные формы Login
const firstName = document.querySelector('.login__name-part'); //блок First Name
const lastName = document.querySelector('.login__surname-part');//блок Last Name
const confirmPassword = document.querySelector('.login__confirm-password-part'); //блок Confirm Password
const forgotPassword = document.querySelector('.login__forgot-password'); // forgot your password

// ФУНКЦИЯ ИЗМЕНЕНИЯ ФОРМЫ SIGN IN /REGISTER
function changeForm() {
  // скрываем/показываем  доп поля в форме регистрации
  firstName.classList.toggle('hidden');
  lastName.classList.toggle('hidden');
  confirmPassword.classList.toggle('hidden');

  // меняем название кнопки Login/Register
  if (loginButton.innerText==='Login') {
    loginButton.innerText='Register';
  } else {
    loginButton.innerText='Login';
  }

  // скрываем/показваем фразу Forgot your password?
  forgotPassword.classList.toggle('hidden');
  
  //меняем Title
  const title = document.querySelector('.modal-title');
  if (title.innerText==='Sign in') {
    title.innerText='Register';
  } else {
    title.innerText='Sign in';
  }
//меняем фразу have account/don`t have an account
const noAccount = document.querySelector('.login__no-account');
if (noAccount.innerText===`Don't have an account?`) {
  noAccount.innerText=`Already have an account?`;
} else {
  noAccount.innerText=`Don't have an account?`;
}

//меняем название cссылки Sign in here/Register here
const registerLink =document.querySelector('.login__register-link');
if (registerLink.innerText==='Register here') {
  registerLink.innerText='Sign in here';
} else {
  registerLink.innerText='Register here';
}
}


// ФУНКЦИЯ ПРОВЕРКИ ВАЛИДНОСТИ ФОРМЫ
function checkValidity () {
  let errors = [];
  const emailInput = document.querySelector('.login__email'); //input ввода email
  const passwordInput = document.querySelector('.login__password'); //input ввода password
  const firstNameInput = document.querySelector('.login__name');//input ввода first name
  const lastNameInput = document.querySelector('.login__surname');//input ввода last name
  const confirmPasswordInput = document.querySelector('.login__confirm-password');//input ввода confirm-password
  const reEmail=/^[A-Z0-9._%+-]+@[A-Z0-9-]+.+.[A-Z]{2,4}$/i;//регулярное выражение проверки мейла
  const errorField = document.querySelector('.login__error'); //поле вывода ошибок
  if (firstName.classList.contains('hidden')===false && firstNameInput.value ==='') {
    errors.push(`Please, fill in your First Name.`);
  }

  if (lastName.classList.contains('hidden')===false && lastNameInput.value ==='') {
    errors.push(`Please, fill in your Last Name.`);
  }

  if (emailInput.value ==='') {
    errors.push(`Please, fill in your email.`);
  }
  
  if (reEmail.test(emailInput.value)!==true) {
    errors.push(`Email is not valid.`);
  }

  if (passwordInput.value ==='') {
    errors.push(`Please, fill in password.`);
  } 

  if (passwordInput.value.length < 8) {
    errors.push(`Please, enter 8-digit password.`);
  }

  if (confirmPassword.classList.contains('hidden')===false && passwordInput.value !== confirmPasswordInput.value) {
    errors.push('Passwords don`t match each other.');
  }

  errorField.innerHTML= errors.join('<br>');
  
  
  if (errors.length === 0 && loginButton.innerText==='Login') {
    loginModal.innerHTML = `<div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
      <img class="modal-logo" src="assets/icons/free-icon-restaurant-6122680.png">
        <p class="modal-title" id="loginModalLabel">You have successfully logged in.</p>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
      </div>
    </div>
  </div>`
} else if (errors.length === 0 && loginButton.innerText==='Register') {
  loginModal.innerHTML = `<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
    <img class="modal-logo" src="assets/icons/free-icon-restaurant-6122680.png">
      <p class="modal-title" id="loginModalLabel">You have successfully registered.</p>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Закрыть"></button>
    </div>
  </div>
</div>`
}

}
}

















































































































































































































































//ЛЕНА

// вешаем обработчик событий на пункт меню Send a message для показа модал окна
message.addEventListener('click', createMessageModal);

//ФУНКЦИЯ ОТРИСОВКИ МОДАЛЬНОГО ОКНА SEND A MESSAGE
function createMessageModal() {
  const modal = document.getElementById ('myModal'); //поле для вставки модального окна
  modal.style.display = "block";
  modal.innerHTML = `<div class="modal-content">
  <span class="close"></span>
    <div class="modal_wrapper">
      <input placeholder="Your name" class="input" id="name-input"></input>
      <input placeholder="Your email" class="input" id="emailUser"></input>
      <input placeholder="Leave us a message" class="input" id="message-input"></input>
    </div> 
    <span class="message-errors"></span>
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

let btnSend = document.querySelector('.btn_send'); //кнопка send

// вешаем обработчки событий на кнопку send
btnSend.addEventListener('click', sendMessage);

//ФУНКЦИЯ ОТПРАВКИ СООБЩЕНИЯ
function sendMessage() {
  let userName = document.getElementById ('name-input'); //инпут name
  let emailUser = document.getElementById ('emailUser'); //инпут mail
  let userMessage = document.getElementById ('message-input'); //инпут message

  //функция проверки мейла
function validateEmail(emailUser) {
  let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(emailUser).toLowerCase());
}


  let errorsArray =[]; //массив с ошибками
  let messageErrors = document.querySelector('.message-errors'); //поле вывода ошибок


  if (userName.value ==='') {
    errorsArray.push(`Please, fill in your name.`)
  }

  if (emailUser.value ==='') {
    errorsArray.push(`Please, fill in your email.`)
  }

  if (!validateEmail (emailUser.value)) {
        console.log ('email not valid');
        errorsArray.push(`Email is not valid.`) 
      }

  if (userMessage.value ==='') {
        errorsArray.push(`Please, fill in your message.`)
      }

      messageErrors.innerHTML = errorsArray.join('<br>');

  if (errorsArray.length === 0) {
    modal.innerHTML=`<div class="modal-content">Your message is successfully sent.</div>`
  }
}
}




// ПРОВЕРКА МЕЙЛА НА ВАЛИДНОСТЬ (FOOTER)



submit.addEventListener('click', subscribeCheckValidity);

function subscribeCheckValidity(e){
  e.preventDefault();
  const emailCheck = document.getElementById ("e-mail");
  const expression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const span1 = document.querySelector ('.span1');
 
  if(!validate (expression, emailCheck.value)){
    notValid (submit, span1, 'Your email is invalid.');
  }else{
    valid (submit, span1, 'You have successfully subscribed.');
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




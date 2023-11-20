"use strict";

const photoEl = document.querySelector(".photo");
const imgEl = document.querySelector(".photo__img");
const textAutorEl = document.querySelector(".details__text-autor");
const buttonLikeEl = document.querySelector(".details__button-like");
const quantityLikeEl = document.querySelector(".details__like-quantity");

const testEl = document.querySelector(".test");

let photoIsLiked = false;
let authorization =`Bearer ${getTokenFromCookie()}`;

const urlParams = document.location.search;
const searchParams = new URLSearchParams(urlParams);
const code = searchParams.get("code");

const clientSecret = "QcB-w_xhUOvQoxR9WwVfTGzKA2ltGO0a-WBlJsTx4D4";
const clientId = "SQU1x6MlVVkxobfip8bz8QiqOgKidozss96_wIgxFDk";
const redirectURI = "https%3A%2F%2Fvalentin447.github.io%2Fcors_test";
const scope = "public+write_likes";
const grantType = "authorization_code";


console.log(`версия = 33`);


if (code) {
  console.log("20) Новый токен")
  fetch(
    `https://unsplash.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectURI}&code=${code}&grant_type=${grantType}`,
    {
      method: "POST",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data.access_token);
      console.log("+++++++++++++++");
      console.log(document.cookie);
      if (data.access_token) {
        document.cookie = `access_token=${data.access_token}`;
        console.log("new token" + data.access_token);
        console.log("+++++++++++++++");
        console.log("new cookie" + document.cookie);
        authorization =`Bearer ${data.access_token}`;
      }
    });
}

async function fetchPhotos() {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?client_id=${clientId}`,
      {
        method: "GET",
        headers: {
          Authorization: authorization,
        },
      }
    );
    const photo = await response.json();
    return photo;
  } catch (error) {
    console.error("Ошибка при загрузке фотографий:", error);
    return undefined;
  }
}

async function loadPhoto() {
  console.log("40) localStorage.length" + localStorage.length);
  console.log("41) localStorage.getItem('photo')" + JSON.parse(localStorage.getItem("photo")));
  await fetchPhotos().then(res=>{
    setLocalStorage(res);
    imgEl.src = JSON.parse(localStorage.getItem("photo")).url;
    imgEl.alt = JSON.parse(localStorage.getItem("photo")).alt;
    textAutorEl.textContent = `Имя фотографа: ${JSON.parse(localStorage.getItem("photo")).userName}.`;
    buttonLikeEl.textContent = `Поставить лайк`;
    quantityLikeEl.textContent = `Лайков: ${JSON.parse(localStorage.getItem("photo")).likes}`;
  });
}
if(localStorage.lenght === 0){
  await 
  console.log("42) localStorage.getItem('photo')" + JSON.parse(localStorage.getItem("photo")));
} 
loadPhoto();

buttonLikeEl.addEventListener("click", () => {
  console.log(`1) getTokenFromCookie() = ${getTokenFromCookie()}`);
  console.log(`2) authorization = ${authorization}`);
  console.log(`3) cookis = ${document.cookie}`)
  if(getTokenFromCookie()){
    fetch(
      `https://api.unsplash.com/photos/${JSON.parse(localStorage.getItem("photo")).id}/like?client_id=${clientId}`,
      {
        method: "POST",
        headers: {
          "Authorization": authorization,
          "Accept-Version": "v1"
        },
      }
    ).then(res => {
      console.log("30) Ответ сервера " + res);
    });

  } else {
    window.location.href = `https://unsplash.com/oauth/authorize?redirect_uri=${redirectURI}&client_id=${clientId}&response_type=code&scope=${scope}`;
  }
  if (buttonLikeEl.textContent === "Поставить лайк") {
    buttonLikeEl.textContent = `Убрать лайк`;
    quantityLikeEl.textContent = `Лайков: ${JSON.parse(localStorage.getItem("photo")).likes + 1}`;
  } else {
    buttonLikeEl.textContent = `Поставить лайк`;
    quantityLikeEl.textContent = `Лайков: ${JSON.parse(localStorage.getItem("photo")).likes}`;
  }
});

testEl.addEventListener("click", () => {
  window.location.href = `https://unsplash.com/oauth/authorize?redirect_uri=${redirectURI}&client_id=${clientId}&response_type=code&scope=${scope}`;
});

function getTokenFromCookie() {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const cookieArr = cookie.split("=");
    if (cookieArr[0] === "access_token") {
      return cookieArr[1];
    }
  }
  return "";
}

function setLocalStorage(photo){
  console.log(`50) setLocalStorage`);
  window.localStorage.setItem("photo", JSON.stringify({photoID: photo.id, url: photo.urls.regular, likes: photo.likes, userName: photo.user.name, alt: photo.alt_description}));
  console.log(`51) setLocalStorage`);
}
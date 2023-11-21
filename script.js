"use strict";

const photoEl = document.querySelector(".photo");
const imgEl = document.querySelector(".photo__img");
const textAutorEl = document.querySelector(".details__text-autor");
const buttonLikeEl = document.querySelector(".details__button-like");
const quantityLikeEl = document.querySelector(".details__like-quantity");

const testEl = document.querySelector(".test");

let photoIsLiked = false;
let authorization = `Bearer ${getTokenFromCookie()}`;
let currentDate = new Date();

const urlParams = document.location.search;
const searchParams = new URLSearchParams(urlParams);
const code = searchParams.get("code");

const clientSecret = "QcB-w_xhUOvQoxR9WwVfTGzKA2ltGO0a-WBlJsTx4D4";
const clientId = "SQU1x6MlVVkxobfip8bz8QiqOgKidozss96_wIgxFDk";
const redirectURI = "https%3A%2F%2Fvalentin447.github.io%2Fcors_test";
const scope = "public+write_likes";
const grantType = "authorization_code";

if (code && !getTokenFromCookie()) {
  fetch(
    `https://unsplash.com/oauth/token?client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectURI}&code=${code}&grant_type=${grantType}`,
    {
      method: "POST",
    }
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.access_token) {
        document.cookie = `accessToken=${data.access_token}; max-age=864000`;
        authorization = `Bearer ${data.access_token}`;
      }
    })
    .catch((error) =>
      console.error("Ошибка при получении токена авторизации:", error)
    );
}

async function fetchPhotos() {
  const response = await fetch(
    `https://api.unsplash.com/photos/random?client_id=${clientId}`,
    {
      method: "GET",
      headers: {
        Authorization: authorization,
      },
    }
  ).catch((error) => console.error("Ошибка при загрузке фотографий:", error));
  const photo = await response.json();

  return photo;
}

async function loadPhoto() {
  if (localStorage.getItem("photo") && !timeNewPhoto()) {
    paintPhoto();
  } else {
    await fetchPhotos().then((res) => {
      setLocalStorage(res);
      paintPhoto();
    });
  }
}

function paintPhoto() {
  imgEl.src = JSON.parse(localStorage.getItem("photo")).url;
  imgEl.alt = JSON.parse(localStorage.getItem("photo")).alt;
  textAutorEl.textContent = `Имя фотографа: ${
    JSON.parse(localStorage.getItem("photo")).userName
  }.`;
  if (JSON.parse(localStorage.getItem("photo")).likedByUser) {
    buttonLikeEl.textContent = `Убрать лайк`;
  } else {
    buttonLikeEl.textContent = `Поставить лайк`;
  }
  quantityLikeEl.textContent = `Лайков: ${
    JSON.parse(localStorage.getItem("photo")).likes
  }`;
}
loadPhoto();

buttonLikeEl.addEventListener("click", () => {
  if (getTokenFromCookie()) {
    if (buttonLikeEl.textContent === "Поставить лайк") {
      togleLike("POST");
    } else {
      togleLike("DELETE");
    }
  } else {
    try {
      window.location.href = `https://unsplash.com/oauth/authorize?redirect_uri=${redirectURI}&client_id=${clientId}&response_type=code&scope=${scope}`;
    } catch (error) {
      console.error("Ошибка при получении ключа авторизации:", error);
      return undefined;
    }
  }
});

function getTokenFromCookie() {
  const name = "accessToken";
  var matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setLocalStorage(photo) {
  window.localStorage.setItem(
    "photo",
    JSON.stringify({
      id: photo.id,
      url: photo.urls.regular,
      likes: photo.likes,
      likedByUser: photo.liked_by_user,
      userName: photo.user.name,
      alt: photo.alt_description,
    })
  );
}

function togleLike(method) {
  fetch(
    `https://api.unsplash.com/photos/${
      JSON.parse(localStorage.getItem("photo")).id
    }/like?client_id=${clientId}`,
    {
      method: method,
      headers: {
        Authorization: authorization,
        "Accept-Version": "v1",
      },
    }
  )
    .then((response) => {
      if (response.ok) {
        if (method === "POST") {
          buttonLikeEl.textContent = `Убрать лайк`;
          quantityLikeEl.textContent = `Лайков: ${
            JSON.parse(localStorage.getItem("photo")).likes + 1
          }`;
        } else {
          buttonLikeEl.textContent = `Поставить лайк`;
          quantityLikeEl.textContent = `Лайков: ${
            JSON.parse(localStorage.getItem("photo")).likes
          }`;
        }
      }
    })
    .catch((error) =>
      console.error("Ошибка при попытки поставить лайк:", error)
    );
}

function timeNewPhoto() {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const cookieArr = cookie.split("=");
    if (cookieArr[0] === "lifetime") {
      return false;
    }
  }
  document.cookie = "lifetime=1day; max-age=86400";
  return true;
}

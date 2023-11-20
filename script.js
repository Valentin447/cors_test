"use strict";

const photoEl = document.querySelector(".photo");
const imgEl = document.querySelector(".photo__img");
const textAutorEl = document.querySelector(".details__text-autor");
const buttonLikeEl = document.querySelector(".details__button-like");
const quantityLikeEl = document.querySelector(".details__like-quantity");

const testEl = document.querySelector(".test");

let photoID = "";
let photo = undefined;
let photoIsLiked = false;
let authorization = getTokenFromCookie();

const urlParams = document.location.search;
const searchParams = new URLSearchParams(urlParams);
const code = searchParams.get("code");

const clientSecret = "QcB-w_xhUOvQoxR9WwVfTGzKA2ltGO0a-WBlJsTx4D4";
const clientId = "SQU1x6MlVVkxobfip8bz8QiqOgKidozss96_wIgxFDk";
const redirectURI = "https://valentin447.github.io/cors_test";
const scope = "public+write_likes";
const grantType = "authorization_code";

console.log(`версия = 19`);
if (code) {
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
        // document.cookie = `access_token=${data.access_token}`;
      }
    });
}

async function fetchPhotos() {
  
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?client_id=SQU1x6MlVVkxobfip8bz8QiqOgKidozss96_wIgxFDk`,
      {
        method: "GET",
        headers: {
          Authorization: authorization,
        },
      }
    );

    const photos = await response.json();
    
    return photos;
  } catch (error) {
    console.error("Ошибка при загрузке фотографий:", error);
    return [];
  }
}

async function loadPhoto() {
  const response = await fetchPhotos();
  photo = response;
  imgEl.src = photo.urls.regular;
  imgEl.alt = photo.alt_description;

  photoID = photo.id;
  textAutorEl.textContent = `Имя фотографа: ${photo.user.name}.`;
  buttonLikeEl.textContent = `Поставить лайк`;
  quantityLikeEl.textContent = `Лайков: ${photo.likes}`;

}

loadPhoto();

buttonLikeEl.addEventListener("click", () => {
  if(getTokenFromCookie()){
    fetch(
      `https://unsplash.com/photos/${photoID}/like`,
      {
        method: "POST",
        headers: {
          Authorization: authorization,
        },
      }
    ).then(res => {
      if(res.ok){

      }
    });

  } else {
    window.location.href = `https://unsplash.com/oauth/authorize?redirect_uri=${redirectURI}&client_id=${clientId}&response_type=code&scope=${scope}`;
  }
  if (buttonLikeEl.textContent === "Поставить лайк") {
    buttonLikeEl.textContent = `Убрать лайк`;
    quantityLikeEl.textContent = `Лайков: ${photo.likes + 1}`;
  } else {
    buttonLikeEl.textContent = `Поставить лайк`;
    quantityLikeEl.textContent = `Лайков: ${photo.likes}`;
  }
});

testEl.addEventListener("click", () => {
  console.log(photo);

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

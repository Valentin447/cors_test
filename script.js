"use strict";

const photoEl = document.querySelector(".photo");
const imgEl = document.querySelector(".photo__img");
const textAutorEl = document.querySelector(".details__text-autor");
const buttonLikeEl = document.querySelector(".details__button-like");

let photoID = "";

async function fetchPhotos() {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?client_id=SQU1x6MlVVkxobfip8bz8QiqOgKidozss96_wIgxFDk`
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
  console.log(response);
  const photo = response;
  imgEl.src = photo.urls.regular;
  imgEl.alt = photo.alt_description;
  
  
  photoID = photo.id;
  console.log(photoID);
  textAutorEl.textContent = `Имя фотографа: ${photo.user.name}.`;
  buttonLikeEl.textContent =`Лайков: ${photo.likes}`;
}

loadPhoto();

buttonLikeEl.addEventListener("click", ()=>{
  fetch(`https://unsplash.com/oauth/authorize?redirect_uri=https%3A%2F%2Fvalentin447.github.io%2Fcors_test%2Findex.html HTTP/1.1&client_id=SQU1x6MlVVkxobfip8bz8QiqOgKidozss96_wIgxFDk&response_type=code&scope=public+write_likes`, {
    method: "POST",
  })
  .then(res => console.log(res.ok));


  // fetch(`https://api.unsplash.com/me`, {
  //   method: "GET",
  //   headers: {
  //     Authorization: "Client-ID SQU1x6MlVVkxobfip8bz8QiqOgKidozss96_wIgxFDk"
  //   },
  // })
  // .then(res => console.log(res));
});

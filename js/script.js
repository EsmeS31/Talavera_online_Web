/* CASA TALAVERA - SIMPLE JAVASCRIPT */

/* --------------------
   MOBILE MENU
-------------------- */

let menuButton = document.querySelector(".menu-button");
let navigation = document.querySelector(".site-nav");

menuButton.addEventListener("click", function () {
  if (navigation.classList.contains("is-open")) {
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
  } else {
    navigation.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
  }
});

/* --------------------
   PRODUCT CAROUSEL
-------------------- */

let slides = document.querySelectorAll(".carousel-slide");
let previousButton = document.querySelector(".previous-button");
let nextButton = document.querySelector(".next-button");
let carouselStatus = document.querySelector(".carousel-status");

/* The first slide is number 0. */
let currentSlide = 0;

function showSlide() {
  /* First, hide all slides. */
  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove("active-slide");
  }

  /* Then, show only the current slide. */
  slides[currentSlide].classList.add("active-slide");

  carouselStatus.textContent =
    "Showing product " + (currentSlide + 1) + " of " + slides.length;
}

nextButton.addEventListener("click", function () {
  currentSlide = currentSlide + 1;

  /* Return to the first slide after the last slide. */
  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }

  showSlide();
});

previousButton.addEventListener("click", function () {
  currentSlide = currentSlide - 1;

  /* Go to the last slide if the user is on the first slide. */
  if (currentSlide < 0) {
    currentSlide = slides.length - 1;
  }

  showSlide();
});

/* --------------------
   PRODUCT SEARCH
-------------------- */

let searchBox = document.getElementById("product-search");
let productCards = document.querySelectorAll(".product-card");
let noProductsMessage = document.querySelector(".no-products");

function searchProducts() {
  let searchWords = searchBox.value.toLowerCase();
  let numberOfProductsFound = 0;

  for (let i = 0; i < productCards.length; i++) {
    let productName = productCards[i].getAttribute("data-name");

    if (productName.includes(searchWords)) {
      productCards[i].hidden = false;
      numberOfProductsFound = numberOfProductsFound + 1;
    } else {
      productCards[i].hidden = true;
    }
  }

  if (numberOfProductsFound === 0) {
    noProductsMessage.hidden = false;
  } else {
    noProductsMessage.hidden = true;
  }
}

searchBox.addEventListener("input", searchProducts);

/* --------------------
   CATEGORY FILTER BUTTONS
-------------------- */

let filterButtons = document.querySelectorAll(".filter-button");
let showAllButton = document.querySelector(".show-all-button");

for (let i = 0; i < filterButtons.length; i++) {
  filterButtons[i].addEventListener("click", function () {
    let category = filterButtons[i].getAttribute("data-filter");
    let numberOfProductsFound = 0;

    /* Remove the blue background from every filter button. */
    for (let j = 0; j < filterButtons.length; j++) {
      filterButtons[j].classList.remove("selected-filter");
    }

    /* Add the blue background to the button that was clicked. */
    filterButtons[i].classList.add("selected-filter");

    for (let j = 0; j < productCards.length; j++) {
      let productCategory = productCards[j].getAttribute("data-category");

      if (category === "all" || category === productCategory) {
        productCards[j].hidden = false;
        numberOfProductsFound = numberOfProductsFound + 1;
      } else {
        productCards[j].hidden = true;
      }
    }

    if (numberOfProductsFound === 0) {
      noProductsMessage.hidden = false;
    } else {
      noProductsMessage.hidden = true;
    }
  });
}

/* The View all pieces button shows every product again. */
showAllButton.addEventListener("click", function () {
  searchBox.value = "";

  for (let i = 0; i < productCards.length; i++) {
    productCards[i].hidden = false;
  }

  for (let i = 0; i < filterButtons.length; i++) {
    filterButtons[i].classList.remove("selected-filter");
  }

  filterButtons[0].classList.add("selected-filter");
  noProductsMessage.hidden = true;
});

/* --------------------
   CONTACT FORM
-------------------- */

let contactForm = document.getElementById("contact-form");
let formMessage = document.querySelector(".form-message");

contactForm.addEventListener("submit", function (event) {
  /* This stops the page from refreshing when the form is submitted. */
  event.preventDefault();

  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let message = document.getElementById("message").value.trim();

  if (name === "" || email === "" || message === "") {
    formMessage.textContent = "Please fill out every box.";
    formMessage.classList.remove("success-message");
  } else if (email.includes("@") === false) {
    formMessage.textContent = "Please enter an email address with @.";
    formMessage.classList.remove("success-message");
  } else {
    formMessage.textContent =
      "Thank you, " + name + "! Your message is ready to send.";

    formMessage.classList.add("success-message");
    contactForm.reset();
  }
});
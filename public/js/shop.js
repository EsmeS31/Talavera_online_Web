"use strict";
const CART_KEY = 'casa-talavera-cart-v1';
const DISCOUNT_KEY = 'casa-talavera-discount-v1';
// The server puts its product list in this script element on each page.
const productData = document.getElementById('products-data');
let products = [];
if (productData) {
    products = JSON.parse(productData.textContent || '[]');
}
function formatPrice(amount) {
    return '$' + amount.toFixed(2);
}
// Load the saved cart. If the saved text is missing or invalid, use an empty cart.
function readCart() {
    try {
        const savedCart = localStorage.getItem(CART_KEY);
        if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            if (Array.isArray(parsedCart)) {
                return parsedCart;
            }
        }
    }
    catch (error) {
        // The cart will start empty if the saved data cannot be read.
    }
    return [];
}
function writeCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
}
function updateCartCount() {
    const cart = readCart();
    let itemCount = 0;
    for (let i = 0; i < cart.length; i++) {
        itemCount = itemCount + cart[i].quantity;
    }
    const countLabels = document.querySelectorAll('.cart-count');
    for (let i = 0; i < countLabels.length; i++) {
        countLabels[i].textContent = String(itemCount);
    }
}
function addToCart(productId) {
    const cart = readCart();
    let productIsInCart = false;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            cart[i].quantity = cart[i].quantity + 1;
            productIsInCart = true;
            break;
        }
    }
    if (!productIsInCart) {
        cart.push({ id: productId, quantity: 1 });
    }
    writeCart(cart);
    const addButtons = document.querySelectorAll('.add-to-cart');
    for (let i = 0; i < addButtons.length; i++) {
        if (addButtons[i].dataset.productId === productId) {
            const button = addButtons[i];
            const originalText = button.textContent || 'Add to bag';
            button.textContent = 'Added to bag ✓';
            window.setTimeout(function () {
                button.textContent = originalText;
            }, 1300);
            break;
        }
    }
}
const addButtons = document.querySelectorAll('.add-to-cart');
for (let i = 0; i < addButtons.length; i++) {
    addButtons[i].addEventListener('click', function () {
        const productId = addButtons[i].dataset.productId;
        if (productId) {
            addToCart(productId);
        }
    });
}
// Open and close the small-screen navigation menu.
const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.site-nav');
if (menuButton && navigation) {
    menuButton.addEventListener('click', function () {
        const menuIsOpen = navigation.classList.toggle('is-open');
        menuButton.setAttribute('aria-expanded', String(menuIsOpen));
    });
    const navigationLinks = navigation.querySelectorAll('a');
    for (let i = 0; i < navigationLinks.length; i++) {
        navigationLinks[i].addEventListener('click', function () {
            navigation.classList.remove('is-open');
            menuButton.setAttribute('aria-expanded', 'false');
        });
    }
}
// Show one featured product at a time.
const slides = document.querySelectorAll('.carousel-slide');
let currentSlide = 0;
function showSlide() {
    if (slides.length === 0) {
        return;
    }
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active-slide');
    }
    slides[currentSlide].classList.add('active-slide');
    const carouselStatus = document.querySelector('.carousel-status');
    if (carouselStatus) {
        carouselStatus.textContent =
            'Showing product ' + (currentSlide + 1) + ' of ' + slides.length;
    }
}
const nextButton = document.querySelector('.next-button');
const previousButton = document.querySelector('.previous-button');
if (nextButton) {
    nextButton.addEventListener('click', function () {
        currentSlide = currentSlide + 1;
        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }
        showSlide();
    });
}
if (previousButton) {
    previousButton.addEventListener('click', function () {
        currentSlide = currentSlide - 1;
        if (currentSlide < 0) {
            currentSlide = slides.length - 1;
        }
        showSlide();
    });
}
// Search text and the selected category are applied at the same time.
const searchBox = document.querySelector('#product-search');
const productCards = document.querySelectorAll('.product-card');
const filterButtons = document.querySelectorAll('.filter-button');
let selectedCategory = 'all';
function filterProducts() {
    let searchText = '';
    if (searchBox) {
        searchText = searchBox.value.trim().toLowerCase();
    }
    let visibleProductCount = 0;
    for (let i = 0; i < productCards.length; i++) {
        const card = productCards[i];
        const productName = card.dataset.name || '';
        const productCategory = card.dataset.category || '';
        const nameMatches = productName.includes(searchText);
        let categoryMatches = selectedCategory === 'all';
        if (productCategory === selectedCategory) {
            categoryMatches = true;
        }
        if (nameMatches && categoryMatches) {
            card.hidden = false;
            visibleProductCount = visibleProductCount + 1;
        }
        else {
            card.hidden = true;
        }
    }
    const noProductsMessage = document.querySelector('.no-products');
    if (noProductsMessage) {
        noProductsMessage.hidden = visibleProductCount !== 0;
    }
    const resultsCount = document.querySelector('.results-count');
    if (resultsCount) {
        const word = visibleProductCount === 1 ? 'piece' : 'pieces';
        resultsCount.textContent = visibleProductCount + ' ' + word;
    }
}
if (searchBox) {
    searchBox.addEventListener('input', filterProducts);
}
for (let i = 0; i < filterButtons.length; i++) {
    filterButtons[i].addEventListener('click', function () {
        selectedCategory = filterButtons[i].dataset.filter || 'all';
        for (let j = 0; j < filterButtons.length; j++) {
            const isSelected = filterButtons[j] === filterButtons[i];
            filterButtons[j].classList.toggle('selected-filter', isSelected);
            filterButtons[j].setAttribute('aria-pressed', String(isSelected));
        }
        filterProducts();
    });
}
const showAllButton = document.querySelector('.show-all-button');
if (showAllButton) {
    showAllButton.addEventListener('click', function () {
        if (searchBox) {
            searchBox.value = '';
        }
        selectedCategory = 'all';
        for (let i = 0; i < filterButtons.length; i++) {
            const isAllButton = i === 0;
            filterButtons[i].classList.toggle('selected-filter', isAllButton);
            filterButtons[i].setAttribute('aria-pressed', String(isAllButton));
        }
        filterProducts();
    });
}
// This demo validates and acknowledges messages locally; it does not email them.
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (!contactForm.reportValidity()) {
            return;
        }
        const formData = new FormData(contactForm);
        const name = String(formData.get('name') || 'there').trim();
        const formMessage = contactForm.querySelector('.form-message');
        if (formMessage) {
            formMessage.textContent =
                'Thank you, ' + name + '! Your message has been recorded for this demo.';
            formMessage.classList.add('success-message');
        }
        contactForm.reset();
    });
}
// Calculate and display the shopping bag.
const cartItemList = document.querySelector('.cart-item-list');
const discountInput = document.querySelector('#discount-code');
let activeDiscount = localStorage.getItem(DISCOUNT_KEY) || '';
function calculateDiscount(subtotal) {
    if (activeDiscount === 'TALAVERA10') {
        return subtotal * 0.1;
    }
    if (activeDiscount === 'CASA15') {
        if (subtotal < 15) {
            return subtotal;
        }
        return 15;
    }
    return 0;
}
function updateSummary(subtotal) {
    const discount = calculateDiscount(subtotal);
    let shipping = 8;
    if (subtotal === 0 || subtotal >= 100) {
        shipping = 0;
    }
    const subtotalText = document.getElementById('subtotal');
    const discountText = document.getElementById('discount-amount');
    const shippingText = document.getElementById('shipping');
    const totalText = document.getElementById('total');
    const discountLine = document.querySelector('.discount-line');
    if (subtotalText) {
        subtotalText.textContent = formatPrice(subtotal);
    }
    if (discountText) {
        discountText.textContent = '−' + formatPrice(discount);
    }
    if (shippingText) {
        if (subtotal === 0) {
            shippingText.textContent = '—';
        }
        else if (shipping === 0) {
            shippingText.textContent = 'Free';
        }
        else {
            shippingText.textContent = formatPrice(shipping);
        }
    }
    if (totalText) {
        totalText.textContent = formatPrice(subtotal - discount + shipping);
    }
    if (discountLine) {
        discountLine.hidden = discount === 0;
    }
}
function connectCartButtons() {
    const quantityButtons = document.querySelectorAll('.quantity-control button');
    for (let i = 0; i < quantityButtons.length; i++) {
        quantityButtons[i].addEventListener('click', function () {
            const productId = quantityButtons[i].dataset.id;
            const action = quantityButtons[i].dataset.action;
            if (productId && action) {
                changeCartItem(productId, action);
            }
        });
    }
    const removeButtons = document.querySelectorAll('.remove-item');
    for (let i = 0; i < removeButtons.length; i++) {
        removeButtons[i].addEventListener('click', function () {
            const productId = removeButtons[i].dataset.id;
            if (productId) {
                removeCartItem(productId);
            }
        });
    }
}
function changeCartItem(productId, action) {
    const cart = readCart();
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId) {
            if (action === 'increase') {
                cart[i].quantity = cart[i].quantity + 1;
            }
            else if (action === 'decrease') {
                cart[i].quantity = cart[i].quantity - 1;
            }
            break;
        }
    }
    const updatedCart = [];
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].quantity > 0) {
            updatedCart.push(cart[i]);
        }
    }
    writeCart(updatedCart);
    renderCart();
}
function removeCartItem(productId) {
    const cart = readCart();
    const updatedCart = [];
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id !== productId) {
            updatedCart.push(cart[i]);
        }
    }
    writeCart(updatedCart);
    renderCart();
}
function renderCart() {
    if (!cartItemList) {
        return;
    }
    const cart = readCart();
    let subtotal = 0;
    cartItemList.innerHTML = '';
    const emptyCart = document.querySelector('.empty-cart');
    if (emptyCart) {
        emptyCart.hidden = cart.length > 0;
    }
    for (let i = 0; i < cart.length; i++) {
        let product;
        for (let j = 0; j < products.length; j++) {
            if (products[j].id === cart[i].id) {
                product = products[j];
                break;
            }
        }
        if (product) {
            subtotal = subtotal + product.price * cart[i].quantity;
            const cartItem = document.createElement('article');
            cartItem.className = 'cart-item';
            cartItem.innerHTML =
                '<div class="cart-thumb product-art ' + product.color + '" aria-hidden="true">' +
                    '<span>' + product.placeholder + '</span></div>' +
                    '<div class="cart-item-details">' +
                    '<p class="product-category">' + product.categoryName + '</p>' +
                    '<h3>' + product.name + '</h3>' +
                    '<p>' + formatPrice(product.price) + ' each</p>' +
                    '<div class="quantity-control" aria-label="Quantity for ' + product.name + '">' +
                    '<button type="button" data-action="decrease" data-id="' + product.id + '" aria-label="Decrease quantity">−</button>' +
                    '<span>' + cart[i].quantity + '</span>' +
                    '<button type="button" data-action="increase" data-id="' + product.id + '" aria-label="Increase quantity">+</button>' +
                    '</div></div>' +
                    '<div class="cart-item-end"><strong>' +
                    formatPrice(product.price * cart[i].quantity) +
                    '</strong><button class="remove-item" type="button" data-id="' + product.id + '">Remove</button></div>';
            cartItemList.appendChild(cartItem);
        }
    }
    updateSummary(subtotal);
    updateCartCount();
    connectCartButtons();
}
const applyDiscountButton = document.querySelector('#apply-discount');
if (applyDiscountButton) {
    applyDiscountButton.addEventListener('click', function () {
        let code = '';
        if (discountInput) {
            code = discountInput.value.trim().toUpperCase();
        }
        const discountFeedback = document.querySelector('.discount-feedback');
        if (code === 'TALAVERA10' || code === 'CASA15') {
            activeDiscount = code;
            localStorage.setItem(DISCOUNT_KEY, code);
            if (discountFeedback) {
                discountFeedback.textContent = code + ' applied. Your total has been updated.';
                discountFeedback.classList.add('success-message');
            }
        }
        else {
            activeDiscount = '';
            localStorage.removeItem(DISCOUNT_KEY);
            if (discountFeedback) {
                discountFeedback.textContent = 'Code not recognized. Try TALAVERA10 or CASA15.';
                discountFeedback.classList.remove('success-message');
            }
        }
        renderCart();
    });
}
if (discountInput) {
    discountInput.value = activeDiscount;
}
const checkoutButton = document.querySelector('.checkout-button');
if (checkoutButton) {
    checkoutButton.addEventListener('click', function () {
        const checkoutNote = document.querySelector('.checkout-note');
        if (checkoutNote) {
            if (readCart().length > 0) {
                checkoutNote.textContent =
                    'Checkout is a project demo. No payment is collected.';
            }
            else {
                checkoutNote.textContent = 'Add a piece to your bag before checking out.';
            }
        }
    });
}
updateCartCount();
renderCart();

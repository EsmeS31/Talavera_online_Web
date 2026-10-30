// Describe the information stored for one product.
type Product = {
  id: string;
  name: string;
  category: string;
  categoryName: string;
  placeholder: string;
  price: number;
  color: string;
  description: string;
  featured: boolean;
};

// A cart line stores a product ID and the number of items selected.
type CartLine = {
  id: string;
  quantity: number;
};

const CART_KEY = 'casa-talavera-cart-v1';
const DISCOUNT_KEY = 'casa-talavera-discount-v1';

// The server puts its product list in this script element on each page.
const productData = document.getElementById('products-data');
let products: Product[] = [];

if (productData) {
  products = JSON.parse(productData.textContent || '[]');
}

function formatPrice(amount: number): string {
  return '$' + amount.toFixed(2);
}

// Load the saved cart. If the saved text is missing or invalid, use an empty cart.
function readCart(): CartLine[] {
  try {
    const savedCart = localStorage.getItem(CART_KEY);

    if (savedCart) {
      const parsedCart: unknown = JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        return parsedCart as CartLine[];
      }
    }
  } catch (error) {
    // The cart will start empty if the saved data cannot be read.
  }

  return [];
}

function writeCart(cart: CartLine[]): void {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount(): void {
  const cart = readCart();
  let itemCount = 0;

  for (let i = 0; i < cart.length; i++) {
    itemCount = itemCount + cart[i].quantity;
  }

  const countLabels = document.querySelectorAll<HTMLElement>('.cart-count');

  for (let i = 0; i < countLabels.length; i++) {
    countLabels[i].textContent = String(itemCount);
  }
}

function addToCart(productId: string): void {
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

  const addButtons = document.querySelectorAll<HTMLButtonElement>('.add-to-cart');

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

const addButtons = document.querySelectorAll<HTMLButtonElement>('.add-to-cart');

for (let i = 0; i < addButtons.length; i++) {
  addButtons[i].addEventListener('click', function () {
    const productId = addButtons[i].dataset.productId;

    if (productId) {
      addToCart(productId);
    }
  });
}

// Open and close the small-screen navigation menu.
const menuButton = document.querySelector<HTMLButtonElement>('.menu-button');
const navigation = document.querySelector<HTMLElement>('.site-nav');

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
const slides = document.querySelectorAll<HTMLElement>('.carousel-slide');
let currentSlide = 0;

function showSlide(): void {
  if (slides.length === 0) {
    return;
  }

  for (let i = 0; i < slides.length; i++) {
    slides[i].classList.remove('active-slide');
  }

  slides[currentSlide].classList.add('active-slide');

  const carouselStatus = document.querySelector<HTMLElement>('.carousel-status');

  if (carouselStatus) {
    carouselStatus.textContent =
      'Showing product ' + (currentSlide + 1) + ' of ' + slides.length;
  }
}

const nextButton = document.querySelector<HTMLButtonElement>('.next-button');
const previousButton = document.querySelector<HTMLButtonElement>('.previous-button');

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
const searchBox = document.querySelector<HTMLInputElement>('#product-search');
const productCards = document.querySelectorAll<HTMLElement>('.product-card');
const filterButtons = document.querySelectorAll<HTMLButtonElement>('.filter-button');
let selectedCategory = 'all';

function filterProducts(): void {
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
    } else {
      card.hidden = true;
    }
  }

  const noProductsMessage = document.querySelector<HTMLElement>('.no-products');

  if (noProductsMessage) {
    noProductsMessage.hidden = visibleProductCount !== 0;
  }

  const resultsCount = document.querySelector<HTMLElement>('.results-count');

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

const showAllButton = document.querySelector<HTMLButtonElement>('.show-all-button');

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
const contactForm = document.querySelector<HTMLFormElement>('#contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get('name') || 'there').trim();
    const formMessage = contactForm.querySelector<HTMLElement>('.form-message');

    if (formMessage) {
      formMessage.textContent =
        'Thank you, ' + name + '! Your message has been recorded for this demo.';
      formMessage.classList.add('success-message');
    }

    contactForm.reset();
  });
}

// Calculate and display the shopping bag.
const cartItemList = document.querySelector<HTMLElement>('.cart-item-list');
const discountInput = document.querySelector<HTMLInputElement>('#discount-code');
let activeDiscount = localStorage.getItem(DISCOUNT_KEY) || '';

function calculateDiscount(subtotal: number): number {
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

function updateSummary(subtotal: number): void {
  const discount = calculateDiscount(subtotal);
  let shipping = 8;

  if (subtotal === 0 || subtotal >= 100) {
    shipping = 0;
  }

  const subtotalText = document.getElementById('subtotal');
  const discountText = document.getElementById('discount-amount');
  const shippingText = document.getElementById('shipping');
  const totalText = document.getElementById('total');
  const discountLine = document.querySelector<HTMLElement>('.discount-line');

  if (subtotalText) {
    subtotalText.textContent = formatPrice(subtotal);
  }

  if (discountText) {
    discountText.textContent = '−' + formatPrice(discount);
  }

  if (shippingText) {
    if (subtotal === 0) {
      shippingText.textContent = '—';
    } else if (shipping === 0) {
      shippingText.textContent = 'Free';
    } else {
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

function connectCartButtons(): void {
  const quantityButtons = document.querySelectorAll<HTMLButtonElement>(
    '.quantity-control button'
  );

  for (let i = 0; i < quantityButtons.length; i++) {
    quantityButtons[i].addEventListener('click', function () {
      const productId = quantityButtons[i].dataset.id;
      const action = quantityButtons[i].dataset.action;

      if (productId && action) {
        changeCartItem(productId, action);
      }
    });
  }

  const removeButtons = document.querySelectorAll<HTMLButtonElement>('.remove-item');

  for (let i = 0; i < removeButtons.length; i++) {
    removeButtons[i].addEventListener('click', function () {
      const productId = removeButtons[i].dataset.id;

      if (productId) {
        removeCartItem(productId);
      }
    });
  }
}

function changeCartItem(productId: string, action: string): void {
  const cart = readCart();

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id === productId) {
      if (action === 'increase') {
        cart[i].quantity = cart[i].quantity + 1;
      } else if (action === 'decrease') {
        cart[i].quantity = cart[i].quantity - 1;
      }
      break;
    }
  }

  const updatedCart: CartLine[] = [];

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].quantity > 0) {
      updatedCart.push(cart[i]);
    }
  }

  writeCart(updatedCart);
  renderCart();
}

function removeCartItem(productId: string): void {
  const cart = readCart();
  const updatedCart: CartLine[] = [];

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].id !== productId) {
      updatedCart.push(cart[i]);
    }
  }

  writeCart(updatedCart);
  renderCart();
}

function renderCart(): void {
  if (!cartItemList) {
    return;
  }

  const cart = readCart();
  let subtotal = 0;
  cartItemList.innerHTML = '';

  const emptyCart = document.querySelector<HTMLElement>('.empty-cart');

  if (emptyCart) {
    emptyCart.hidden = cart.length > 0;
  }

  for (let i = 0; i < cart.length; i++) {
    let product: Product | undefined;

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

const applyDiscountButton = document.querySelector<HTMLButtonElement>('#apply-discount');

if (applyDiscountButton) {
  applyDiscountButton.addEventListener('click', function () {
    let code = '';

    if (discountInput) {
      code = discountInput.value.trim().toUpperCase();
    }

    const discountFeedback = document.querySelector<HTMLElement>('.discount-feedback');

    if (code === 'TALAVERA10' || code === 'CASA15') {
      activeDiscount = code;
      localStorage.setItem(DISCOUNT_KEY, code);

      if (discountFeedback) {
        discountFeedback.textContent = code + ' applied. Your total has been updated.';
        discountFeedback.classList.add('success-message');
      }
    } else {
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

const checkoutButton = document.querySelector<HTMLButtonElement>('.checkout-button');

if (checkoutButton) {
  checkoutButton.addEventListener('click', function () {
    const checkoutNote = document.querySelector<HTMLElement>('.checkout-note');

    if (checkoutNote) {
      if (readCart().length > 0) {
        checkoutNote.textContent =
          'Checkout is a project demo. No payment is collected.';
      } else {
        checkoutNote.textContent = 'Add a piece to your bag before checking out.';
      }
    }
  });
}

updateCartCount();
renderCart();

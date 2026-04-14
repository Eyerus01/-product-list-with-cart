const products = [
  {
    image: {
      thumbnail: './assets/images/image-waffle-thumbnail.jpg',
      mobile: './assets/images/image-waffle-mobile.jpg',
      tablet: './assets/images/image-waffle-tablet.jpg',
      desktop: './assets/images/image-waffle-desktop.jpg'
    },
    name: 'Waffle with Berries',
    category: 'Waffle',
    price: 6.5
  },
  {
    image: {
      thumbnail: './assets/images/image-creme-brulee-thumbnail.jpg',
      mobile: './assets/images/image-creme-brulee-mobile.jpg',
      tablet: './assets/images/image-creme-brulee-tablet.jpg',
      desktop: './assets/images/image-creme-brulee-desktop.jpg'
    },
    name: 'Vanilla Bean Crème Brûlée',
    category: 'Crème Brûlée',
    price: 7.0
  },
  {
    image: {
      thumbnail: './assets/images/image-macaron-thumbnail.jpg',
      mobile: './assets/images/image-macaron-mobile.jpg',
      tablet: './assets/images/image-macaron-tablet.jpg',
      desktop: './assets/images/image-macaron-desktop.jpg'
    },
    name: 'Macaron Mix of Five',
    category: 'Macaron',
    price: 8.0
  },
  {
    image: {
      thumbnail: './assets/images/image-tiramisu-thumbnail.jpg',
      mobile: './assets/images/image-tiramisu-mobile.jpg',
      tablet: './assets/images/image-tiramisu-tablet.jpg',
      desktop: './assets/images/image-tiramisu-desktop.jpg'
    },
    name: 'Classic Tiramisu',
    category: 'Tiramisu',
    price: 5.5
  },
  {
    image: {
      thumbnail: './assets/images/image-baklava-thumbnail.jpg',
      mobile: './assets/images/image-baklava-mobile.jpg',
      tablet: './assets/images/image-baklava-tablet.jpg',
      desktop: './assets/images/image-baklava-desktop.jpg'
    },
    name: 'Pistachio Baklava',
    category: 'Baklava',
    price: 4.0
  },
  {
    image: {
      thumbnail: './assets/images/image-meringue-thumbnail.jpg',
      mobile: './assets/images/image-meringue-mobile.jpg',
      tablet: './assets/images/image-meringue-tablet.jpg',
      desktop: './assets/images/image-meringue-desktop.jpg'
    },
    name: 'Lemon Meringue Pie',
    category: 'Pie',
    price: 5.0
  },
  {
    image: {
      thumbnail: './assets/images/image-cake-thumbnail.jpg',
      mobile: './assets/images/image-cake-mobile.jpg',
      tablet: './assets/images/image-cake-tablet.jpg',
      desktop: './assets/images/image-cake-desktop.jpg'
    },
    name: 'Red Velvet Cake',
    category: 'Cake',
    price: 4.5
  },
  {
    image: {
      thumbnail: './assets/images/image-brownie-thumbnail.jpg',
      mobile: './assets/images/image-brownie-mobile.jpg',
      tablet: './assets/images/image-brownie-tablet.jpg',
      desktop: './assets/images/image-brownie-desktop.jpg'
    },
    name: 'Salted Caramel Brownie',
    category: 'Brownie',
    price: 4.5
  },
  {
    image: {
      thumbnail: './assets/images/image-panna-cotta-thumbnail.jpg',
      mobile: './assets/images/image-panna-cotta-mobile.jpg',
      tablet: './assets/images/image-panna-cotta-tablet.jpg',
      desktop: './assets/images/image-panna-cotta-desktop.jpg'
    },
    name: 'Vanilla Panna Cotta',
    category: 'Panna Cotta',
    price: 6.5
  }
];

const productGrid = document.getElementById('productGrid');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const orderTotalEl = document.getElementById('orderTotal');
const confirmOrderButton = document.getElementById('confirmOrderButton');
const confirmationModal = document.getElementById('confirmationModal');
const confirmationList = document.getElementById('confirmationList');
const checkoutTotal = document.getElementById('checkoutTotal');
const startNewOrderButton = document.getElementById('startNewOrderButton');

let cart = {};

const formatPrice = (value) => `$${value.toFixed(2)}`;

const cartItems = () =>
  Object.entries(cart)
    .map(([id, quantity]) => ({
      id: Number(id),
      quantity,
      ...products[id],
      subtotal: products[id].price * quantity
    }));

const renderProducts = () => {
  productGrid.innerHTML = products
    .map((product, index) => {
      const quantity = cart[index] || 0;
      const inCart = quantity > 0;
      const actionMarkup = inCart
        ? `
            <div class="product-action" aria-label="Update quantity for ${product.name}">
              <span class="quantity-control">
                <button type="button" class="qty-btn" data-id="${index}" data-action="decrease" aria-label="Decrease quantity">−</button>
                <span class="qty-count">${quantity}</span>
                <button type="button" class="qty-btn" data-id="${index}" data-action="increase" aria-label="Increase quantity">+</button>
              </span>
            </div>
          `
        : `
            <button
              type="button"
              class="product-action"
              data-id="${index}"
              aria-label="Add ${product.name} to cart">
              <img src="./assets/images/icon-add-to-cart.svg" alt="" class="cart-icon">
              <span>Add to cart</span>
            </button>
          `;

      return `
        <article class="product-card" data-id="${index}">
          <div class="image-wrap">
            <img src="${product.image.mobile}" alt="${product.name}" class="product-image">
            ${actionMarkup}
          </div>
          <p class="product-category">${product.category}</p>
          <h3 class="product-title">${product.name}</h3>
          <p class="product-price">${formatPrice(product.price)}</p>
        </article>
      `;
    })
    .join('');
};

const renderCart = () => {
  const items = cartItems();
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);

  cartCountEl.textContent = `(${totalQuantity})`;

  if (items.length === 0) {
    cartItemsEl.innerHTML = `<p class="cart-empty">Your added items will appear here.</p>`;
    orderTotalEl.textContent = '$0.00';
    confirmOrderButton.disabled = true;
    return;
  }

  cartItemsEl.innerHTML = items
    .map(
      (item) => `
        <div class="cart-item" data-id="${item.id}">
          <div>
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-detail">${item.quantity}x @ ${formatPrice(item.price)}</p>
          </div>
          <div class="cart-item-actions">
            <p class="cart-item-price">${formatPrice(item.subtotal)}</p>
            <button class="remove-button" type="button" data-action="remove" data-id="${item.id}" aria-label="Remove ${item.name}">×</button>
          </div>
        </div>
      `
    )
    .join('');

  orderTotalEl.textContent = formatPrice(totalPrice);
  confirmOrderButton.disabled = false;
};

const renderConfirmation = () => {
  const items = cartItems();
  const totalPrice = items.reduce((sum, item) => sum + item.subtotal, 0);

  confirmationList.innerHTML = items
    .map(
      (item) => `
        <div class="confirmation-item">
          <img class="confirmation-thumb" src="${item.image.thumbnail}" alt="${item.name}">
          <div>
            <p>${item.name}</p>
            <p class="cart-item-detail">${item.quantity}x @ ${formatPrice(item.price)}</p>
          </div>
          <p>${formatPrice(item.subtotal)}</p>
        </div>
      `
    )
    .join('');

  checkoutTotal.textContent = formatPrice(totalPrice);
};

const updateQuantity = (id, delta) => {
  const current = cart[id] || 0;
  const updated = current + delta;

  if (updated <= 0) {
    delete cart[id];
  } else {
    cart[id] = updated;
  }

  renderProducts();
  renderCart();
};

const handleProductGridClick = (event) => {
  const button = event.target.closest('button[data-id]');
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action || 'toggle';

  if (action === 'toggle') {
    if (!cart[id]) {
      cart[id] = 1;
      renderProducts();
      renderCart();
    }
    return;
  }

  if (action === 'increase') {
    updateQuantity(id, 1);
  }

  if (action === 'decrease') {
    updateQuantity(id, -1);
  }
};

const handleCartClick = (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const id = button.dataset.id;
  const action = button.dataset.action;

  if (action === 'remove') {
    delete cart[id];
    renderProducts();
    renderCart();
  }
};

const showModal = () => {
  if (Object.keys(cart).length === 0) return;
  renderConfirmation();
  confirmationModal.classList.remove('hidden');
};

const hideModal = () => {
  confirmationModal.classList.add('hidden');
};

const resetOrder = () => {
  cart = {};
  renderProducts();
  renderCart();
  hideModal();
};

productGrid.addEventListener('click', handleProductGridClick);
cartItemsEl.addEventListener('click', handleCartClick);
confirmOrderButton.addEventListener('click', showModal);
startNewOrderButton.addEventListener('click', resetOrder);
confirmationModal.addEventListener('click', (event) => {
  if (event.target.dataset.close === 'true') {
    hideModal();
  }
});

renderProducts();
renderCart();

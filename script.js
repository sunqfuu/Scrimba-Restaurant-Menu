import products from "./data.js";
import { v4 as uuidv4 } from "https://cdn.jsdelivr.net/npm/uuid@11.0.2/+esm";

const cardsEl = document.querySelector(".cards");
const ordersEl = document.querySelector(".orders");
const payModal = document.querySelector(".pay-modal");

let orderList = [];

document.addEventListener("click", (event) => {
  const productElement = event.target.closest(".product-add");
  if (productElement && productElement.dataset.product) {
    const productIndex = Number(productElement.dataset.product);
    const selectedProduct = products[productIndex];

    orderList.push({
      name: selectedProduct.name,
      price: selectedProduct.price,
      uuid: uuidv4(),
    });
    renderOrders();
  } else if (event.target.dataset.removeOrder) {
    orderList = orderList.filter(
      (order) => order.uuid !== event.target.dataset.removeOrder
    );
    renderOrders();
  } else if (event.target.classList.contains("complete-order-btn")) {
    payModal.showModal();
  } else if (event.target.classList.contains("close-modal")) {
    payModal.close();
  } else if (event.target.classList.contains("complete-payment-btn")) {
    event.preventDefault();
    const form = document.querySelector(".order-form");

    if (form.checkValidity()) {
      orderList = [];
      renderOrders();

      const orderMessage = `<div class="order-message">
                <p>Thanks, James! Your order is on its way!</p>
            </div>`;
      payModal.close();
      ordersEl.innerHTML = orderMessage;
    } else {
      form.reportValidity();
    }
  }
});

function renderProducts() {
  let cardsHTML = "";
  products.forEach((product) => {
    cardsHTML += `
        <div class="product-card">
            <div class=product-card-img>
                <i class="fa-solid ${product.icon} fa-2xl product-icon"></i>
            </div>
            <div class="product-info">
                <h2 class="product-name">${product.name}</h2>
                <p class="product-ingredients">${product.ingredients.join(
                  ", "
                )}</p>
                <p class="product-price">$${product.price}</p>
            </div>
            <div class="product-add" data-product="${product.id}">
                <i class="fa-solid fa-plus"></i>
            </div>
        </div>`;
  });
  cardsEl.innerHTML = cardsHTML;
}

payModal.addEventListener("click", (e) => {
  const dialogDimensions = payModal.getBoundingClientRect();
  if (
    e.clientX < dialogDimensions.left ||
    e.clientX > dialogDimensions.right ||
    e.clientY < dialogDimensions.top ||
    e.clientY > dialogDimensions.bottom
  ) {
    payModal.close();
  }
});

function renderOrders() {
  if (orderList.length === 0) {
    ordersEl.innerHTML = "";
    return;
  }

  const totalPrice = orderList.reduce((acc, curr) => {
    return acc + curr.price;
  }, 0);

  let ordersHTML = `
    <div class="order-section">
        <div class="order-section-header">
            <h1 class="order-header">Your Orders</h1>
        </div>
        <div class="order">
    `;

  orderList.forEach((product) => {
    ordersHTML += `
        <div class="product-order">
            <p class="product-order-name">${product.name}</p>
            <button class="remove-product-btn" data-remove-order="${product.uuid}">remove</button>
            <p class="product-order-price">$${product.price}</p>
        </div>
        `;
  });

  ordersHTML += `
    </div>
    <div class=total-price-section">
        <p>Total price: <span class="total-price">$${totalPrice}</span></p>
    </div>
    <div class="complete-section">
        <button class="complete-order-btn">Complete order</button>
    </div>
    </div>
    `;

  ordersEl.innerHTML = ordersHTML;
}

renderProducts();

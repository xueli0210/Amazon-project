import { saveNewQuantity, updateQuantity, calculateCartQuantity, cart, removeFromCart } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";


// Generate HTML for order summary
let cartSummaryHTML = '';

cart.forEach(cartItem => {
  const {productId} = cartItem;

  let matchingProduct;

  products.forEach(product => {
    if(product.id === productId) {
      matchingProduct = product;
    }
  });

  cartSummaryHTML += `
    <div class="cart-item-container 
    js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: Wednesday, June 15
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src='${matchingProduct.image}'>

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link js-update-link link-primary" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input-${matchingProduct.id} js-quantity-input" data-product-id="${matchingProduct.id}">
            <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingProduct.id}">
              Save
            </span>
            <span class="delete-quantity-link js-delete-link link-primary" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>

          <div class="delivery-option">
            <input type="radio" class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" checked class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio" class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Update checkout items
  const cartQuantity = calculateCartQuantity()
  document.querySelector('.js-return-to-home-link')
    .innerHTML = `${cartQuantity} items`

});

document.querySelector('.js-order-summary')
  .innerHTML = cartSummaryHTML;

// Delete item when clicking delete
document.querySelectorAll('.js-delete-link')
  .forEach(link => {
    link.addEventListener('click', () => {
      const {productId} = link.dataset;
      removeFromCart(productId);

      const cartQuantity = calculateCartQuantity()
      document.querySelector('.js-return-to-home-link')
        .innerHTML = `${cartQuantity} items`

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();
    });
  })

// Update quantity when clicking update
document.querySelectorAll('.js-update-link')
  .forEach(link => {
    link.addEventListener('click', () => {
      const {productId} = link.dataset;
      // add a new class to the cart item being updated
      document.querySelector(`.js-cart-item-container-${productId}`).classList.add("is-editing-quantity");
    })
  })

// Update quantity when clicking save
document.querySelectorAll('.js-save-quantity-link')
  .forEach(link => {
    link.addEventListener('click', () => {
      const {productId} = link.dataset;
      saveNewQuantity(productId);
    })
  })

// Update quantity when hitting Enter
document.querySelectorAll('.js-quantity-input')
  .forEach(link => {
    link.addEventListener('keydown', event => {
      if(event.key==='Enter') {
        const {productId} = link.dataset;
        saveNewQuantity(productId);
      };
    });
  })
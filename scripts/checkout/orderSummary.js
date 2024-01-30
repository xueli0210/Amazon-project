//Named export
import { updateDeliveryOption, 
         saveNewQuantity, 
         updateQuantity, 
         calculateCartQuantity, 
         cart, 
         removeFromCart } from "../../data/cart.js";
import { deliveryOptions, 
         calculateDeliveryDate, 
         getDeliveryOption } from "../../data/deliveryOptions.js";
import { products, 
         getProduct } from "../../data/products.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";

//Default export
import formatCurrency from "../utils/money.js";

export function renderOrderSummary () {

// Generate HTML for order summary
  let cartSummaryHTML = '';

  cart.forEach(cartItem => {
    const {productId} = cartItem;

    const matchingProduct = getProduct(productId);

    const {deliveryOptionId} = cartItem;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const dateString = calculateDeliveryDate(deliveryOption);

    cartSummaryHTML += `
      <div class="cart-item-container 
      js-cart-item-container
      js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src='${matchingProduct.image}'>

          <div class="cart-item-details">
            <div class="product-name 
            js-product-name-${matchingProduct.id}">
              ${matchingProduct.name}
            </div>
            <div class="product-price
            js-product-price-${matchingProduct.id}">
              $${formatCurrency(matchingProduct.priceCents)}
            </div>
            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
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
              <span class="delete-quantity-link js-delete-link link-primary js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProduct, cartItem)}
          </div>
        </div>
      </div>
    `;
    
    renderCheckoutHeader();

  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach(deliveryOption => {
      const dateString = calculateDeliveryDate(deliveryOption);

      const priceString = deliveryOption.priceCents === 0
      ? 'FREE'
      : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `
      <div class="delivery-option js-delivery-option js-delivery-option-${matchingProduct.id}-${deliveryOption.id}"
        data-product-id = "${matchingProduct.id}"
        data-delivery-option-id = "${deliveryOption.id}">
        <input type="radio" 
          ${isChecked ? "checked" : ""}
          class="delivery-option-input
          js-delivery-option-input-${matchingProduct.id}-${deliveryOption.id}"
          name="delivery-option-${matchingProduct.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
          ${priceString} Shipping
          </div>
        </div>
      </div>
      `
    })

    return html;

  }

  document.querySelector('.js-order-summary')
    .innerHTML = cartSummaryHTML;

  // Delete item when clicking delete
  document.querySelectorAll('.js-delete-link')
    .forEach(link => {
      link.addEventListener('click', () => {
        const {productId} = link.dataset;
        removeFromCart(productId); // update the data (controller --> model)

        // regenerate HTML (model --> view)
        renderOrderSummary();
        renderPaymentSummary(); 
        renderCheckoutHeader();

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
        saveNewQuantity(productId); // update the data (controller --> model)

        // regenerate HTML (model --> view)
        renderOrderSummary();
        renderPaymentSummary(); 
        renderCheckoutHeader();

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
    });

  // Update delivery option
  document.querySelectorAll('.js-delivery-option')
    .forEach((element) => {
      element.addEventListener('click', () => {
        const {productId, deliveryOptionId} = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId); // update the data (controller --> model)

        // regenerate HTML (model --> view)
        renderOrderSummary();
        renderPaymentSummary(); 
        renderCheckoutHeader();

      });
    });
};
import { renderCheckoutHeader } from "../scripts/checkout/checkoutHeader.js";
import { getDeliveryOption } from "./deliveryOptions.js";

export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart'));
}

export function saveNewQuantity(productId){
  const inputElement = document.querySelector(`.js-quantity-input-${productId}`);
  const newQuantity = Number(inputElement.value);
  const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);

  if(newQuantity >0 && newQuantity < 1000) {
    
    updateQuantity(productId, newQuantity);

    quantityLabel.innerHTML = newQuantity;
  
    // Update checkout items count at the top of the page
    renderCheckoutHeader();
    
    // remove the new class on the cart item being updated
    document.querySelector(`.js-cart-item-container-${productId}`).classList.remove("is-editing-quantity");
  } else {
    alert("Quantity must be between 0 and 1000");
  };
}

export function updateQuantity(productId, newQuantity) {
  let matchingItem;

  cart.forEach(cartItem => {
    if(cartItem.productId === productId) {
      matchingItem = cartItem;
    }
  });
  matchingItem.quantity = newQuantity;
  
  saveToStroage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach(cartItem => {
    cartQuantity += cartItem.quantity;
  }); 

  return cartQuantity
}

function saveToStroage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity) {
  let matchingItem;

  cart.forEach(cartItem => {
    if(productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if(!quantity) {
    if (matchingItem) {
      matchingItem.quantity += 1;
    } else {
      cart.push({
        productId,
        quantity: 1,
        deliveryOptionId: "1"
      });
    }
  } else {
    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      cart.push({
        productId,
        quantity,
        deliveryOptionId: "1"
      });
    }
  }


  saveToStroage();
};

export function removeFromCart(productId) {
  const newCart = [];
  cart.forEach(cartItem => {
    if(cartItem.productId !== productId) {
      newCart.push(cartItem)
    }
  });

  cart = newCart;

  saveToStroage();
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;

  cart.forEach(cartItem => {
    if(productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (!matchingItem) {
    return
  } 

  if (!getDeliveryOption(deliveryOptionId)) {
    return
  }

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStroage();
}
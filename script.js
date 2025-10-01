document.getElementById('searchInput').addEventListener('keyup', function() {
let filter = this.value.toLowerCase();
let menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(function(item) {
let itemName = item.querySelector('.item-name').textContent.toLowerCase();
if (itemName.includes(filter)) {item.style.display = '';} else {item.style.display = 'none';}
    });
});

document.getElementById('searchInput').addEventListener('search', function() {
if (this.value === '') {
let menuItems = document.querySelectorAll('.menu-item');
menuItems.forEach(function(item) {item.style.display = '';});
    }
});

document.addEventListener('DOMContentLoaded', () => {
const menuList = document.getElementById('menuList');
const deliveryCheckbox = document.getElementById('delivery');
    let selectedItems = {};

const saveCartToLocalStorage = () => {
localStorage.setItem('shoppingCart', JSON.stringify(selectedItems));
};

const loadCartFromLocalStorage = () => {
const savedCart = localStorage.getItem('shoppingCart');
if (savedCart) {selectedItems = JSON.parse(savedCart);}
};

const updateOnClassColor = () => {
const onElement = document.querySelector('.on');
if (onElement) {
const hasSelectedItems = Object.values(selectedItems).some(qty => qty > 0);
onElement.style.background = hasSelectedItems ? '#ff4500' : '';}
};

const updateCartDisplay = () => {
const cartList = document.getElementById('cartItemsList');
cartList.innerHTML = '';
let hasItemsInCart = false;

for (const itemName in selectedItems) {
const quantity = selectedItems[itemName];
if (quantity > 0) {
hasItemsInCart = true;
const listItem = document.createElement('li');
listItem.classList.add('cart-item');
const itemText = document.createElement('span');
itemText.textContent = `${quantity} ${itemName}`;
const controlsContainer = document.createElement('div');
controlsContainer.classList.add('cart-item-controls');
const decreaseButtonCart = document.createElement('button');
decreaseButtonCart.textContent = '-';
decreaseButtonCart.addEventListener('click', () => {
const originalItem = Array.from(menuList.children).find(item => 
item.querySelector('.item-name')?.textContent === itemName
);
originalItem?.querySelector('.decrease-btn')?.click();
});

const increaseButtonCart = document.createElement('button');
increaseButtonCart.textContent = '+';
increaseButtonCart.addEventListener('click', () => {
const originalItem = Array.from(menuList.children).find(item => 
item.querySelector('.item-name')?.textContent === itemName);
originalItem?.querySelector('.increase-btn')?.click();
});

controlsContainer.appendChild(decreaseButtonCart);
controlsContainer.appendChild(increaseButtonCart);
listItem.appendChild(itemText);
listItem.appendChild(controlsContainer);
cartList.appendChild(listItem);}
}

if (!hasItemsInCart) {
const emptyMessage = document.createElement('li');
emptyMessage.textContent = 'Seu carrinho está vazio';
emptyMessage.classList.add('cart-empty-message');
cartList.appendChild(emptyMessage);}
};

const updateTotalDisplay = () => {
let currentTotal = 0;
let hasSelectedItems = false;
for (const itemName in selectedItems) {
const quantity = selectedItems[itemName];
if (quantity > 0) {
hasSelectedItems = true;
const itemElement = Array.from(menuList.children).find(item =>
item.querySelector('.item-name') && item.querySelector('.item-name').textContent === itemName);
if (itemElement) {
const priceText = itemElement.querySelector('.item-price').textContent;
const price = parseFloat(priceText.replace('R$', '').replace(',', '.').trim());
currentTotal += price * quantity;}
    }
}

if (deliveryCheckbox && deliveryCheckbox.checked) {currentTotal += 5;}

const totalDivId = 'totalPriceDisplay';
let totalDisplayDiv = document.getElementById(totalDivId);
if (hasSelectedItems) {
if (!totalDisplayDiv) {
totalDisplayDiv = document.createElement('div');
totalDisplayDiv.id = totalDivId;
totalDisplayDiv.classList.add('total');
document.querySelector('.container').appendChild(totalDisplayDiv);
}
totalDisplayDiv.innerHTML = `Total: R$ ${currentTotal.toFixed(2).replace('.', ',')}`;
totalDisplayDiv.style.display = 'block';
} else {
if (totalDisplayDiv) {totalDisplayDiv.style.display = 'none';}
    }
};

if (deliveryCheckbox) {deliveryCheckbox.addEventListener('change', updateTotalDisplay);}

const updateOrderButtonVisibility = () => {
const orderButton = document.getElementById('orderButton');
const hasSelectedItems = Object.values(selectedItems).some(qty => qty > 0);
if (hasSelectedItems) {
if (!orderButton) {createOrderButton();
} else {orderButton.style.display = 'block';}
} else {if (orderButton) {orderButton.style.display = 'none';}
    }
};

const createOrderButton = () => {
const orderButton = document.createElement('button');
orderButton.id = 'orderButton';
orderButton.textContent = 'Fazer pedido';
orderButton.addEventListener('click', sendOrderToWhatsApp);
document.querySelector('.container').appendChild(orderButton);
};

const sendOrderToWhatsApp = () => {
let orderMessage = "Olá! Gostaria de fazer o seguinte pedido:\n\n";
let totalItems = 0;
for (const itemName in selectedItems) {
const quantity = selectedItems[itemName];
if (quantity > 0) {
orderMessage += `- ${quantity}x ${itemName}\n`;
    totalItems++;}
}
if (totalItems === 0) {alert("Por favor, selecione pelo menos um item");
return;}

let currentTotal = 0;
for (const itemName in selectedItems) {
const quantity = selectedItems[itemName];
if (quantity > 0) {
const itemElement = Array.from(menuList.children).find(item =>
item.querySelector('.item-name') && item.querySelector('.item-name').textContent === itemName);
if (itemElement) {
const priceText = itemElement.querySelector('.item-price').textContent;
const price = parseFloat(priceText.replace('R$', '').replace(',', '.').trim());
currentTotal += price * quantity;}
    }
}

if (deliveryCheckbox && deliveryCheckbox.checked) {
currentTotal += 5;
orderMessage += "\nPara entrega\n";
} else {orderMessage += "\nPara retirar no local\n";}
orderMessage += `\nTotal do pedido: R$ ${currentTotal.toFixed(2).replace('.', ',')}\n`;
const whatsappNumber = '558894063875';
const encodedMessage = encodeURIComponent(orderMessage);
const whatsappURL = `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`;
window.open(whatsappURL, '_blank');
};

const initializeMenu = () => {
Array.from(menuList.children).forEach(item => {
const itemNameElement = item.querySelector('.item-name');
if (itemNameElement) {
const itemName = itemNameElement.textContent;
if (!selectedItems[itemName]) {
selectedItems[itemName] = 0;}

const quantitySpan = document.createElement('span');
quantitySpan.textContent = selectedItems[itemName] || '0';
quantitySpan.classList.add('item-quantity');
const controlsContainer = document.createElement('div');
controlsContainer.classList.add('item-controls');
const decreaseButton = document.createElement('button');
decreaseButton.classList.add('decrease-btn');
decreaseButton.textContent = '-';
const increaseButton = document.createElement('button');
increaseButton.classList.add('increase-btn');
increaseButton.textContent = '+';

decreaseButton.addEventListener('click', () => {
let currentQuantity = parseInt(quantitySpan.textContent);
if (currentQuantity > 0) {
currentQuantity--;
quantitySpan.textContent = currentQuantity;
selectedItems[itemName] = currentQuantity;
increaseButton.style.border = currentQuantity > 0 ? '2px solid #ff4500' : '';
updateOrderButtonVisibility();
updateTotalDisplay();
updateCartDisplay();
updateOnClassColor();
saveCartToLocalStorage();}
});

increaseButton.addEventListener('click', () => {
let currentQuantity = parseInt(quantitySpan.textContent);
currentQuantity++;
quantitySpan.textContent = currentQuantity;
selectedItems[itemName] = currentQuantity;
increaseButton.style.border = currentQuantity > 0 ? '2px solid #ff4500' : '';
updateOrderButtonVisibility();
updateTotalDisplay();
updateCartDisplay();
updateOnClassColor();
saveCartToLocalStorage();
});

controlsContainer.appendChild(decreaseButton);
controlsContainer.appendChild(quantitySpan);
controlsContainer.appendChild(increaseButton);
item.appendChild(controlsContainer);
        }
    });
}

loadCartFromLocalStorage();
initializeMenu();
updateOrderButtonVisibility();
updateTotalDisplay();
updateCartDisplay();
updateOnClassColor();
});

document.addEventListener('DOMContentLoaded', () => {
const container = document.querySelector('.carousel-container');
const images = document.querySelectorAll('.carousel-image');
const numImages = images.length;
let currentIndex = 0;
const intervalTime = 3000;
const visibleImages = 2; 
let imagesLoaded = 0;

function showCarouselWhenReady() {
imagesLoaded++;
if (imagesLoaded === numImages) {
container.style.visibility = 'visible';
container.style.opacity = '1';
initializeCarousel();}
}

images.forEach(img => {
if (img.complete) {
showCarouselWhenReady();
} else {img.addEventListener('load', showCarouselWhenReady);}
});

function initializeCarousel() {
function updateCarousel() {
images.forEach((img, index) => {
let offset = index - currentIndex;

if (offset > numImages / 2) {
offset -= numImages;
} else if (offset < -numImages / 2) {
offset += numImages;}

const absOffset = Math.abs(offset);
const scale = absOffset > 0 ? Math.pow(0.85, absOffset) : 1.2;
const translateX = offset * 40;
const zIndex = numImages - absOffset;
const opacity = absOffset <= visibleImages ? 1 : 0;
const filter = `blur(${absOffset * 1.5}px)`;
                
img.style.transform = `translateX(${translateX}%) scale(${scale})`;
img.style.zIndex = zIndex;
img.style.opacity = opacity;
img.style.filter = filter;
});
}

function nextImage() {
currentIndex = (currentIndex + 1) % numImages;
updateCarousel();}

let carouselInterval = setInterval(nextImage, intervalTime);

images.forEach((img, index) => {
img.addEventListener('click', () => {
currentIndex = index;
updateCarousel();
clearInterval(carouselInterval);
carouselInterval = setInterval(nextImage, intervalTime);
    });
});
        
updateCarousel();}
});

document.addEventListener('DOMContentLoaded', (event) => {
const showButton = document.querySelector('.show');
const closeButton = document.querySelector('.close');
const popup = document.querySelector('.popup');
const POPUP_URL_PATH = '/cart';

function showPopup() {
if (window.location.pathname !== POPUP_URL_PATH) {
history.pushState({ popupOpen: true }, '', POPUP_URL_PATH);}
popup.style.display = 'block';
    }

function hidePopup() {
popup.style.display = 'none';
if (window.location.pathname.includes(POPUP_URL_PATH)) {history.back();}
}

showButton.addEventListener('click', showPopup);
closeButton.addEventListener('click', hidePopup);
window.addEventListener('popstate', (event) => {
if (!window.location.pathname.includes(POPUP_URL_PATH)) {
if (popup.style.display === 'block') {popup.style.display = 'none';}
} else {
if (popup.style.display === 'none') {popup.style.display = 'block';}
    }
});

if (window.location.pathname.includes(POPUP_URL_PATH)) {popup.style.display = 'block';}
});

document.addEventListener('DOMContentLoaded', () => {
const toggleButton = document.getElementById('toggle-mode');
const body = document.body;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {body.classList.add('dark-mode');}
toggleButton.addEventListener('click', () => {
body.classList.toggle('dark-mode');
if (body.classList.contains('dark-mode')) {localStorage.setItem('theme', 'dark');
} else {localStorage.setItem('theme', 'light');}
  });
});

if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
navigator.serviceWorker.register('/service-worker.js', {scope: '/'})
.then(registration => {console.log('Registrado com sucesso!');})
.catch(error => {console.log('Erro:', error);});
    });
}

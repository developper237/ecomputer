// Updated JavaScript for E-Commerce Site with Backend Integration

const cart = []; // Array to store cart items
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalElement = document.querySelector('.cart-total');
const cartEmptyMessage = document.querySelector('.cart-container p');

const API_BASE_URL = 'http://localhost:3000'; // Base URL of the backend server

// Function to fetch products from the backend and display them
async function fetchProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Function to display products dynamically
function displayProducts(products) {
    const productsContainer = document.querySelector('.products-container');
    productsContainer.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>$${product.price.toFixed(2)}</p>
            <button class="add-to-cart" data-id="${product._id}">Ajouter au panier</button>
        `;
        productsContainer.appendChild(productCard);
    });

    // Add event listeners to "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.getAttribute('data-id');
            addToCart(productId);
        });
    });
}

// Function to update the cart display
function updateCartDisplay() {
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartEmptyMessage.style.display = 'block';
        cartTotalElement.textContent = 'Total: $0.00';
        return;
    }

    cartEmptyMessage.style.display = 'none';
    let total = 0;

    cart.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
            <button class="remove-item" data-index="${index}">Retirer</button>
        `;
        cartItemsContainer.appendChild(listItem);
        total += item.price;
    });

    cartTotalElement.textContent = `Total: $${total.toFixed(2)}`;

    // Add event listeners for remove buttons
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            removeFromCart(index);
        });
    });
}

// Function to add items to the cart by fetching details from the backend
async function addToCart(productId) {
    try {
        const response = await fetch(`${API_BASE_URL}/products/${productId}`);
        const product = await response.json();
        cart.push({ name: product.name, price: product.price });
        updateCartDisplay();
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
}

// Function to remove items from the cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartDisplay();
}

// Fetch and display products on page load
fetchProducts();

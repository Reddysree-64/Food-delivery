
// =====================================
// FOOD DELIVERY APP - JAVASCRIPT
// =====================================


// =====================================
// 1. LOCAL STORAGE
// =====================================

const USERS_KEY = "users";
const CURRENT_USER_KEY = "currentUser";
const ORDERS_KEY = "orders";

function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
}

function getOrders() {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function saveOrders(orders) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}


// =====================================
// 2. FOOD MENU - 8 FIXED FOOD ITEMS
// IMPORTANT: Keep this before HOME PAGE
// =====================================

const foodItems = [
    {
        id: 1,
        name: "Chicken Biryani",
        price: 220,
        image:"https://images.unsplash.com/photo-1633945274405-b6c8069047b0"
    },
    {
        id: 2,
        name: "Paneer Butter Masala",
        price: 180,
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500"
    },
    {
        id: 3,
        name: "Masala Dosa",
        price: 90,
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500"
    },
    {
        id: 4,
        name: "Veg Fried Rice",
        price: 130,
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500"
    },
    {
        id: 5,
        name: "Pizza",
        price: 250,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500"
    },
    {
        id: 6,
        name: "Burger",
        price: 120,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500"
    },
    {
        id: 7,
        name: "French Fries",
        price: 80,
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500"
    },
    {
        id: 8,
        name: "Chocolate Cake",
        price: 100,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"
    }
];


// =====================================
// 3. CART
// =====================================

let cart = [];


// =====================================
// 4. LOGIN AND SIGNUP PAGE
// =====================================

function showLogin() {
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("signupForm").style.display = "none";

    document.getElementById("loginTab").classList.add("active");
    document.getElementById("signupTab").classList.remove("active");
}

function showSignup() {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("signupForm").style.display = "block";

    document.getElementById("signupTab").classList.add("active");
    document.getElementById("loginTab").classList.remove("active");
}


// =====================================
// 5. SIGN UP
// =====================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {

    if (getCurrentUser()) {
        window.location.href = "home.html";
    }

    signupForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name = document.getElementById("signupName").value.trim();

        const email = document.getElementById("signupEmail").value.trim().toLowerCase();

        const password = document.getElementById("signupPassword").value;

        const address = document.getElementById("signupAddress").value.trim();

        const users = getUsers();

        const existingUser = users.find(user => user.email === email);

        if (existingUser) {

            document.getElementById("signupMessage").textContent =
                "This email is already registered!";

            return;
        }

        const newUser = {
            name: name,
            email: email,
            password: password,
            address: address
        };

        users.push(newUser);

        saveUsers(users);

        document.getElementById("signupMessage").textContent =
            "Account created successfully! Please login.";

        signupForm.reset();

        setTimeout(showLogin, 1000);

    });
}


// =====================================
// 6. LOGIN
// =====================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim().toLowerCase();

        const password = document.getElementById("loginPassword").value;

        const users = getUsers();

        const user = users.find(function(savedUser) {

            return savedUser.email === email &&
                   savedUser.password === password;

        });

        if (user) {

            localStorage.setItem(
                CURRENT_USER_KEY,
                JSON.stringify(user)
            );

            window.location.href = "home.html";

        } else {

            document.getElementById("loginMessage").textContent =
                "Invalid email or password!";

        }

    });
}


// =====================================
// 7. HOME PAGE AUTHENTICATION
// =====================================

const isHomePage = document.getElementById("foodMenu");

if (isHomePage) {

    const currentUser = getCurrentUser();

    if (!currentUser) {

        window.location.href = "index.html";

    } else {

        document.getElementById("welcomeUser").textContent =
            "Welcome, " + currentUser.name;

        document.getElementById("deliveryAddress").value =
            currentUser.address || "";

        displayFood();

        displayCart();

        displayOrders();

    }
}


// =====================================
// 8. LOGOUT
// =====================================

function logout() {

    localStorage.removeItem(CURRENT_USER_KEY);

    window.location.href = "index.html";

}


// =====================================
// 9. DISPLAY FOOD MENU
// =====================================

function displayFood() {

    const foodMenu = document.getElementById("foodMenu");

    if (!foodMenu) return;

    foodMenu.innerHTML = "";

    foodItems.forEach(function(food) {

        foodMenu.innerHTML += `

            <div class="food-card">

                <img src="${food.image}" alt="${food.name}">

                <h3>${food.name}</h3>

                <p>₹${food.price}</p>

                <button onclick="addToCart(${food.id})">
                    Add to Cart
                </button>

            </div>

        `;

    });

}


// =====================================
// 10. ADD TO CART
// =====================================

function addToCart(foodId) {
    

    if (!getCurrentUser()) {

        window.location.href = "index.html";

        return;
    }

    const food = foodItems.find(item => item.id === foodId);

    if (food) {

        cart.push({

            id: food.id,

            name: food.name,

            price: food.price,

            quantity: 1

        });

    }

    displayCart();
    showCartToast(food.name);

}


// =====================================
// 11. REMOVE FROM CART
// =====================================

function removeFromCart(index) {

    cart.splice(index, 1);

    displayCart();

}


// =====================================
// 12. DISPLAY CART
// =====================================

function displayCart() {

    const cartItems = document.getElementById("cartItems");

    if (!cartItems) return;

    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {

        cartItems.innerHTML =
            '<p class="empty-message">Your cart is empty. Add some delicious food!</p>';

    } else {

        cart.forEach(function(item, index) {

            const itemTotal = item.price * item.quantity;

            total += itemTotal;

            cartItems.innerHTML += `

                <div class="cart-item">

                    <div>

                        <strong>${item.name}</strong>

                        <p>
                            ₹${item.price} × ${item.quantity} = ₹${itemTotal}
                        </p>

                    </div>

                    <button onclick="removeFromCart(${index})">
                        Remove
                    </button>

                </div>

            `;

        });

    }

    document.getElementById("cartTotal").textContent =
        "Total: ₹" + total;

}


// =====================================
// 13. PLACE ORDER - CREATE
// =====================================

function placeOrder() {

    const currentUser = getCurrentUser();

    if (!currentUser) {

        window.location.href = "index.html";

        return;
    }

    if (cart.length === 0) {

        alert("Your cart is empty! Please add food items.");

        return;
    }

    const address = document.getElementById("deliveryAddress").value.trim();

    if (!address) {

        alert("Please enter your delivery address.");

        return;
    }

    const totalAmount = cart.reduce(function(total, item) {

        return total + (item.price * item.quantity);

    }, 0);

    const newOrder = {

        orderId: Date.now(),

        userEmail: currentUser.email,

        items: cart.map(item => ({ ...item })),

        totalAmount: totalAmount,

        address: address,

        status: "Preparing"

    };

    const orders = getOrders();

    orders.push(newOrder);

    saveOrders(orders);

    // Clear cart after successful order

    cart = [];

    displayCart();

    displayOrders();

    document.getElementById("orderMessage").textContent =
        "Your order has been placed successfully! 🎉";

}


// =====================================
// 14. MY ORDERS - READ
// =====================================

function displayOrders() {

    const myOrders = document.getElementById("myOrders");

    if (!myOrders) return;

    const currentUser = getCurrentUser();

    if (!currentUser) {

        window.location.href = "index.html";

        return;
    }

    const orders = getOrders();

    const userOrders = orders.filter(function(order) {

        return order.userEmail === currentUser.email;

    });

    myOrders.innerHTML = "";

    if (userOrders.length === 0) {

        myOrders.innerHTML =
            '<p class="empty-message">You have not placed any orders yet.</p>';

        return;
    }

    userOrders.forEach(function(order) {

        const foodDetails = order.items.map(function(item) {

            return `${item.name} × ${item.quantity}`;

        }).join(", ");

        myOrders.innerHTML += `

            <div class="order-card">

                <h3>Order #${order.orderId}</h3>

                <p>
                    <strong>Food Items:</strong> ${foodDetails}
                </p>

                <p>
                    <strong>Total Amount:</strong> ₹${order.totalAmount}
                </p>

                <p>
                    <strong>Delivery Address:</strong> ${order.address}
                </p>

                <p>
                    <strong>Status:</strong> ${order.status}
                </p>

                <div class="order-actions">

                    <button class="edit-btn"
                        onclick="editOrder(${order.orderId})">
                        Edit
                    </button>

                    <button class="delete-btn"
                        onclick="deleteOrder(${order.orderId})">
                        Delete
                    </button>

                </div>

            </div>

        `;

    });

}


// =====================================
// 15. EDIT ORDER - UPDATE
// =====================================

function editOrder(orderId) {

    const orders = getOrders();

    const currentUser = getCurrentUser();

    if (!currentUser) return;

    const order = orders.find(function(item) {

        return item.orderId === orderId &&
               item.userEmail === currentUser.email;

    });

    if (!order) return;

    const newAddress = prompt(
        "Enter new delivery address:",
        order.address
    );

    if (newAddress === null) return;

    if (newAddress.trim() === "") {

        alert("Address cannot be empty.");

        return;
    }

    for (let i = 0; i < order.items.length; i++) {

        const item = order.items[i];

        const newQuantity = prompt(
            "Enter quantity for " + item.name + ":",
            item.quantity
        );

        if (newQuantity === null) return;

        const quantity = Number(newQuantity);

        if (!Number.isInteger(quantity) || quantity < 1) {

            alert("Please enter a valid quantity (minimum 1).");

            return;
        }

        item.quantity = quantity;

    }

    order.address = newAddress.trim();

    // Recalculate total price

    order.totalAmount = order.items.reduce(function(total, item) {

        return total + (item.price * item.quantity);

    }, 0);

    saveOrders(orders);

    displayOrders();

    alert("Order updated successfully! 🎉");

}


// =====================================
// 16. DELETE ORDER - DELETE
// =====================================

function deleteOrder(orderId) {

    const currentUser = getCurrentUser();

    if (!currentUser) return;

    const confirmDelete = confirm(
        "Are you sure you want to delete this order?"
    );

    if (!confirmDelete) return;

    const orders = getOrders();

    const updatedOrders = orders.filter(function(order) {

        return !(
            order.orderId === orderId &&
            order.userEmail === currentUser.email
        );

    });

    saveOrders(updatedOrders);

    displayOrders();

    alert("Order deleted successfully!");

    

}

// CINEMATIC SCROLL ZOOM

const heroSection = document.querySelector(".hero-section");

if (heroSection) {
    window.addEventListener("scroll", () => {
        const scrollAmount = Math.min(window.scrollY, 700);

        const scale = 1.15 - (scrollAmount / 700) * 0.15;

        heroSection.style.setProperty("--hero-scale", scale);
    });
}

// ===== THEME SELECTOR FUNCTIONALITY =====

const themeSelector = document.getElementById("themeSelector");

// Load the saved theme or use Royal Orange
const savedTheme = localStorage.getItem("foodAppTheme") || "orange";

document.body.dataset.theme = savedTheme;

// Show the saved theme in the dropdown
if (themeSelector) {
    themeSelector.value = savedTheme;

    themeSelector.addEventListener("change", function () {
        const selectedTheme = this.value;

        // Apply the selected theme
        document.body.dataset.theme = selectedTheme;

        // Remember the theme
        localStorage.setItem("foodAppTheme", selectedTheme);
    });
}

// ===== LIGHT / DARK MODE =====

const modeToggle = document.getElementById("modeToggle");

// Load saved appearance
let savedMode = localStorage.getItem("foodAppMode") || "light";

// Apply appearance
document.body.dataset.mode = savedMode;

// Update button text
function updateModeButton() {
    if (modeToggle) {
        modeToggle.textContent =
            savedMode === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
}

updateModeButton();

// Switch appearance when clicked
if (modeToggle) {
    modeToggle.addEventListener("click", function () {
        savedMode = savedMode === "light" ? "dark" : "light";

        document.body.dataset.mode = savedMode;

        localStorage.setItem("foodAppMode", savedMode);

        updateModeButton();
    });
}

// ADD TO CART SUCCESS MESSAGE

function showCartToast(foodName) {
    const oldToast = document.querySelector(".cart-toast");

    if (oldToast) {
        oldToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = "cart-toast";
    toast.textContent = "✓ " + foodName + " added to your cart successfully!";

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2500);
}
// =====================================
// END OF FOOD DELIVERY APP
// =====================================

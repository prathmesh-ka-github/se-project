console.log('Profile js working')
async function getUserDetails() {
    const name = document.getElementById('name')
    const email = document.getElementById('email')
    const address = document.getElementById('address')
    const phone = document.getElementById('phone')
    const useremail = localStorage.getItem('userEmail')
    await fetch('/getuserdetails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({useremail})
    }).then(res => {
        res.json().then(data=> {
            console.log(data)
            name.innerHTML = data.name
            email.innerHTML = data.email
            phone.innerHTML = "+1 " + data.phone
            address.innerHTML =  data.addressLine1 +", "+ data.city +", "+ data.state +", zipcode - "+ data.zip +", "+ data.countryCode + "."
        })
    })
}

getUserDetails()

function logout() {
    localStorage.removeItem("userEmail");
    window.location.href="/login"
}
function updateCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}
function cancleOrder(id) {
    let orders = JSON.parse(localStorage.getItem('order')) || [];
    orders = orders.filter(item => item.id !== id);
    console.log(orders) 
    localStorage.setItem('order', JSON.stringify(orders));
    loadOrderItems();
    updateCounter();
}


function loadOrderItems() {
    const orders = JSON.parse(localStorage.getItem('order')) || [];
    const ordersItemsContainer = document.getElementById('orderItems');

    if (orders.length === 0) {
        cartItemsContainer.innerHTML = "<p>You dont have any orders :(</p> <a href='cart.html'>shopping cart</a>";
        return;
    }

    ordersItemsContainer.innerHTML = orders.map(item => {
        console.log(item.images)
        return `

            <div id='${item.id}' class="order">
                <div class="order-img">
                    <img src="${item.images}" alt="${item.name}">
                </div>
                <div class="order-details">
                    <div>Order ID -  <span id="order-id">${item.id}</span></div>
                    <div>Name -  <span id="order-name">${item.name || "Unnamed Product"}</span></div>
                    <div>Price - $<span id="order-price">${item.selling_price}</span> </div>
                    <div>Quantity - <span id="order-quantity">${item.quantity}</span> </div>
                    <div>Status - Under processing</div>
                    <div>
                        <button onclick="cancleOrder('${item.id}')">Cancle order</button>
                    </div>
                </div>
            </div>
            `;
    }).join("");
}

{/* <div class="item" data-id="${item.id}">
<img src="${item.images}" alt="${item.name}" class="card-image">
<div>
    <p><strong>Product Name:</strong> ${item.name || "Unnamed Product"}</p>
    <p><strong>Price:</strong> $${item.selling_price}</p>
    <p><strong>Quantity:</strong> ${item.quantity}</p>
</div>
<div class="controls">
    <button class="quantity-btn" onclick="decreaseQuantity('${item.id}')">-</button>
    <button class="quantity-btn" onclick="increaseQuantity('${item.id}')">+</button>
    <button class="remove-btn" onclick="removeFromCart('${item.id}')">Delete</button>
    <button class="remove-btn" onclick="moveToWishlist('${item.id}')">Move to Wishlist</button>
</div>
</div> */}

// function removeFromCart(id) {
//     let cart = JSON.parse(localStorage.getItem('cart')) || [];
//     cart = cart.filter(item => item.id !== id);
//     localStorage.setItem('cart', JSON.stringify(cart));
//     loadCartItems();
//     updateCounter();
// }


document.addEventListener('DOMContentLoaded', () => {
    updateCounter();
    loadOrderItems()
});

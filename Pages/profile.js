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
if (localStorage.getItem('userEmail')) {
    getUserDetails()
}else {
    window.location.href="/login"
}

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
    const ordersItemsContainer = document.getElementById('orderItems');
    const orders = JSON.parse(localStorage.getItem('order')) || [];
    if (orders.length === 0) {
        ordersItemsContainer.innerHTML = "<p class='no-orders'>You don't have any orders :(</p>";
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
                    <div class="cancleorder-btn">
                        <button onclick="cancleOrder('${item.id}')">Cancle order</button>
                    </div>
                </div>
            </div>
            `;
    }).join("");
}
function loadClosetItems() {
    const closetItemsContainer = document.getElementById('closetItems');
    const closetItems = JSON.parse(localStorage.getItem('recommendations')) || [];
    if (closetItems.length == 0) {
        closetItemsContainer.innerHTML = "<p class='no-orders'>You don't have any outfits saved :(</p>"
        return
    }
    // console.log(closetItems)
    // for (let i = 0; i < closetItems.length; i++) {
    //     const item = closetItems[i];
    //     console.log(item)
    // }

    closetItems.map(itemarray => {
        closetItemsContainer.innerHTML = itemarray.map(item => {            
            console.log(item)
            return `
                <div id='${item.index}' class="recommendation">
                    <div class="recommendation-img">
                        <img src="${item.img}" alt="${item.name}">
                    </div>
                    <div class="order-details">
                        <div id="recommendation-name">${item.name || "Unnamed Product"}</div>
                    </div>
                </div>
                `;
        }).join("");
    })

}

document.addEventListener('DOMContentLoaded', () => {
    updateCounter();
    loadOrderItems();
    loadClosetItems();
});
//! 5222300179

const ordersBtn = document.getElementById('orders');
const closetBtn = document.getElementById('closet');
const profileBtn = document.getElementById('profile');

const ordersSection = document.getElementById('orders-section')
const profileSection = document.getElementById('profile-section')
const closetSection = document.getElementById('closet-section')

ordersBtn.addEventListener('click', function(){
    ordersBtn.classList.add('active')
    profileBtn.classList.remove('active')
    closetBtn.classList.remove('active')
    
    ordersSection.classList.remove('novisible')
    profileSection.classList.add('novisible')
    closetSection.classList.add('novisible')
})

profileBtn.addEventListener('click', function(){
    ordersBtn.classList.remove('active')
    profileBtn.classList.add('active')
    closetBtn.classList.remove('active')

    ordersSection.classList.add('novisible')
    profileSection.classList.remove('novisible')
    closetSection.classList.add('novisible')
})

closetBtn.addEventListener('click', function(){
    ordersBtn.classList.remove('active')
    profileBtn.classList.remove('active')
    closetBtn.classList.add('active')

    ordersSection.classList.add('novisible')
    profileSection.classList.add('novisible')
    closetSection.classList.remove('novisible')
})
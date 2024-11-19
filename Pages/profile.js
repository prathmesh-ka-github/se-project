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
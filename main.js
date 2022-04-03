// this is for the drink detail pages

var slideIndex = 3;
    showSlides(slideIndex);
    setInterval(function() {plusSlides(1)}, 2000)

    function plusSlides(n) {
    showSlides(slideIndex += n);
}

    function currentSlide(n) {
    showSlides(slideIndex = n);
}

    function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    var dots = document.getElementsByClassName("demo");
    var captionText = document.getElementById("caption");
    if (n > slides.length) {slideIndex = 1}
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
}
    for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
}
    slides[slideIndex-1].style.display = "block";
    dots[slideIndex-1].className += " active";
    captionText.innerHTML = dots[slideIndex-1].alt;

}


// if the document is still loading, then addEventListener, otherwise run ready()
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready()
}

// set up:
// 1. all the necessary eventListeners,
// 2. fetch/store data from localstorage
// 3. update the item number and total price for the items in the cart.
function ready() {
    var cartItemsInStorage
    // if we have the local storage for cart items, then fetch it.
    if (localStorage.getItem('cart-items')) {
        cartItemsInStorage = JSON.parse(localStorage.getItem('cart-items'))
    } else {
        cartItemsInStorage = []
        localStorage.setItem('cart-items', JSON.stringify(cartItemsInStorage))
    }

    updateCartItemNum()

    // if we are in the cart page, then we fetch the existing data from the local storage.
    if (document.getElementsByClassName('cart-items')[0] !== undefined) {
        var cartItems = JSON.parse(localStorage.getItem('cart-items'))
        for (var i = 0; i < cartItems.length; i++) {
            var cartItem = cartItems[i]
            addItemToCart(
                cartItem.name,
                cartItem.size,
                cartItem.flavor,
                cartItem.price,
                cartItem.quantity
            )
        }
        updateCartTotal()
    }

    // set up the remove buttons with click event listeners
    var removeCartItemButtons = document.getElementsByClassName(
        'cart-remove-button'
    )

    for (var i = 0; i < removeCartItemButtons.length; i++) {
        var button = removeCartItemButtons[i]
        button.addEventListener('click', removeItem)
    }

    // set up quantity input with event listeners
    var quantityInputs = document.getElementsByClassName('item-quantity')
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i]
        input.addEventListener('change', quantityChanged)
    }

    // set up add to cart buttons with event listeners
    var addToCartButtons = document.getElementsByClassName('add-to-cart')
    for (var i = 0; i < addToCartButtons.length; i++) {
        var button = addToCartButtons[i]
        button.addEventListener('click', addToCartClicked)
    }
}

// event handler for clicking the add to cart button
function addToCartClicked(event) {
    var button = event.target
    var detailElement =
        button.parentElement.parentElement.parentElement.parentElement

    var nameElement = detailElement.getElementsByClassName('detail-product-name')
    var name = nameElement[0].innerText

    var quantityElement = detailElement.getElementsByClassName('detail-num')

    var quantity = quantityElement[0].value

    var flavorElement = detailElement.getElementsByClassName('detail-flavor')
    var flavor = flavorElement[0].value

    var sizeElement = detailElement.getElementsByClassName('detail-size')
    var size = sizeElement[0].value

    var priceElement = detailElement.getElementsByClassName('detail-price')
    var price = priceElement[0].innerText

    var cartItems = JSON.parse(localStorage.getItem('cart-items'))
    cartItems.push({
        name: name,
        quantity: quantity,
        flavor: flavor,
        size: size,
        price: price,
    })

    localStorage.setItem('cart-items', JSON.stringify(cartItems))
    updateCartItemNum()
}

// event handler for adding item to cart items list.
function addItemToCart(name, size, flavor, price, quantity) {
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartRow = document.createElement('div')
    cartRow.classList.add('cart-row')
    cartRow.classList.add('order-detail')
    cartRow.classList.add('flex-container')

    var cartRowContents = `
  <div class="flex-container-order-detail">
    <div class="cart-product-name item-name">${name},</div>
    <div class="cart-product-detail item-size">${size},</div>
    <div class="cart-product-detail item-flavor">${flavor},</div>
    <div class="cart-product-detail item-price">${price}</div>

  </div>
  <div class="flex-container-order-detail">
  <input
    class="cart-product-detail item-quantity"
    type="number"
    value=${quantity}
    disabled
  />
    <button class="button cart-remove-button">remove</button>
  </div>`

    cartRow.innerHTML = cartRowContents
    cartItems.append(cartRow)
}

//event handler for changing the quntity of an item.
function quantityChanged(event) {
    var input = event.target
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1
    }
    updateCartTotal()
}

// event handler for removing an item from the cart
function removeItem(event) {
    var buttonClicked = event.target

    var itemInfoElement = buttonClicked.parentElement.parentElement

    var nameElement = itemInfoElement.getElementsByClassName('item-name')
    var name = nameElement[0].innerText

    var quantityElement = itemInfoElement.getElementsByClassName('item-quantity')
    var quantity = quantityElement[0].value

    var flavorElement = itemInfoElement.getElementsByClassName('item-flavor')
    var flavor = flavorElement[0].innerText

    var sizeElement = itemInfoElement.getElementsByClassName('item-size')
    var size = sizeElement[0].innerText

    var priceElement = itemInfoElement.getElementsByClassName('item-price')
    var price = priceElement[0].innerText

    var cartItemsWhenRemove = JSON.parse(localStorage.getItem('cart-items'))
    for (var i = 0; i < cartItemsWhenRemove.length; i++) {
        var item = cartItemsWhenRemove[i]

        if (
            item.name === name.slice(0, -1) &&
            item.price === price &&
            item.size === size.slice(0, -1) &&
            item.flavor === flavor.slice(0, -1) &&
            item.quantity === quantity
        ) {
            cartItemsWhenRemove.splice(i, 1)
            localStorage.setItem('cart-items', JSON.stringify(cartItemsWhenRemove))
            break
        }
    }

    itemInfoElement.remove()
    updateCartTotal()
    updateCartItemNum()
}

//update the cart item number when add or remove items.
function updateCartItemNum() {
    var cartItemNum = document.getElementsByClassName('cart-item-number')[0]
    if (localStorage.getItem('cart-items')) {
        cartItems = JSON.parse(localStorage.getItem('cart-items'))
        cartItemNum.innerHTML = cartItems.length
    } else {
        cartItemNum.innerHTML = 0
    }
}

// update the total price for the items in the cart
function updateCartTotal() {
    var cartItems = document.getElementsByClassName('cart-items')[0]
    var cartRows = cartItems.getElementsByClassName('cart-row')
    var totalValue = 0
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i]
        var quantityElement = cartRow.getElementsByClassName('item-quantity')[0]
        var quantity = parseFloat(quantityElement.value)

        var priceElement = cartRow.getElementsByClassName('item-price')[0]
        var price = parseFloat(priceElement.innerText.replace('$', ''))

        totalValue += quantity * price
    }
    totalValue = Math.round(totalValue * 100) / 100
    document.getElementsByClassName('cart-total-price')[0].innerText =
        'Total: ' + '$' + totalValue
}







fetch('https://my-json-server.typicode.com/nghiattps13085/apigoldenowl/shoes')
    .then(response => response.json())
    .then(data => showdata(data));

function showdata(data) {
    datahtml = ""
    data.forEach(element => {

        datahtml += `<div class="item">
        <div class="image"  style="background-color:${element.color};">
            <img src="${element.image}" alt="">
        </div>

        <div class="name">${element.name}</div>
        <div class="descreption">
        ${element.description}
        </div>
        <div class="bottom" id="id${element.id}">
            <div class="price">$${element.price}</div>
            <div class="btncheck" ><i class="fa fa-check"></i></div>
            <div class="btn"><button onclick="addtocart(${element.id})" >Add to cart</button></div>
        </div>
    </div>`;
    });

    document.querySelector("#products").innerHTML = datahtml;
    loadcart();

}

function addtocart(id) {
    fetch('https://my-json-server.typicode.com/nghiattps13085/apigoldenowl/shoes/' + id)
        .then(response => response.json())
        .then(data => savedata(data));
}

function savedata(data) {
    var body = document.querySelector('#id' + data.id);
    incart = false;
    let cart = [];
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        for (i = 0; i < cart.length; i++) {
            if (data.id == cart[i].id) {
                incart = true;
                break;
            }
        }
    }
    if (incart == false) {
        data.incarts = true;
        cart.push(data);
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    body.children[1].style.display = "block";
    body.children[2].style.display = "none";
    loadcart()
}

function loadcart(check) {
    count = 0;
    total = 0;
    carthtml = "";
    if (localStorage.getItem('cart')) {
        cart = JSON.parse(localStorage.getItem('cart'));
        if (cart.length == 0) {
            document.querySelector("#emty").style.display = "block";
            document.querySelector("#cart").innerHTML = carthtml;
        } else {
            document.querySelector("#emty").style.display = "none";
            cart.forEach(element => {
                if (element.sl) sl = element.sl
                else sl = 1;
                total += element.price * sl;
                count++;
                carthtml += `<div class="cart-item" id="anima${count}">
                <div class="circle " style="background-color: ${element.color}">
                    <img src=" ${element.image}" alt="">
                </div>
                <div class="right">
                    <div class="name" data-aos="fade-left">
                           ${element.name}
                    </div>
                    <div class="price">
                       $  <span  id="price${count}">${element.price}</span>
                    </div>
                    <div class="count">
                        <div class="btndown" onclick="downfunc(${element.id},${count})" >-</div>
                        <div class="number" id="num${count}">${sl}</div>
                        <div class="btnup" onclick="upfunc(${count})">+</div>
                        <div class="delete" onclick="remove(${element.id},${count})"><i class="fa fa-trash-o"></i></div>
                    </div>
                </div>
            </div>`;
                document.querySelector("#cart").innerHTML = carthtml;
                // document.getElementById("#anima" + element.id).style.animation = "addcart 1s ease";
            })
            if (check != 1) {
                anime = document.getElementById("anima" + cart.length);
                anime.children[0].style.animation = "addcart 0.5s ease-in-out";
                anime.children[1].style.animation = "addcart 0.5s ease-in-out";
            }
        }

    }

    document.querySelector("#total").innerHTML = total.toFixed(2)
}

function downfunc(id, count) {
    num = parseInt(document.querySelector("#num" + count).innerHTML)
    price = parseFloat(document.querySelector("#price" + count).innerHTML)
    total = parseFloat(document.querySelector("#total").innerHTML)
    newcart = []
    cart = JSON.parse(localStorage.getItem('cart'));
    if (num == 1) {
        document.querySelector("#num" + count).innerHTML = 0;
        remove(id, count)
    } else {
        num--;
        for (i = 0; i < cart.length; i++) {
            if (i == id - 1) {
                cart[i].sl = num
                newcart.push(cart[i])
            } else {
                newcart.push(cart[i])
            }
        }

        localStorage.removeItem('cart');
        localStorage.setItem('cart', JSON.stringify(newcart));
        document.querySelector("#num" + count).innerHTML = num;
        document.querySelector("#total").innerHTML = (total - price).toFixed(2)
    }
}

function upfunc(id) {
    newcart = []
    cart = JSON.parse(localStorage.getItem('cart'));
    num = parseInt(document.querySelector("#num" + id).innerHTML)

    price = parseFloat(document.querySelector("#price" + id).innerHTML)
    num++;
    for (i = 0; i < cart.length; i++) {
        if (i == id - 1) {
            cart[i].sl = num
            newcart.push(cart[i])
        } else {
            newcart.push(cart[i])
        }
    }
    localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify(newcart));



    total = parseFloat(document.querySelector("#total").innerHTML)
    document.querySelector("#num" + id).innerHTML = num;
    document.querySelector("#total").innerHTML = (total + price).toFixed(2)


}

function remove(id, count) {
    var body = document.querySelector('#id' + id);
    cart = JSON.parse(localStorage.getItem('cart'));

    for (i = 0; i < cart.length; i++) {
        if (cart[i].id == id) {
            bien = i;
            break;
        }
    }
    cart.splice(bien, 1);
    localStorage.removeItem('cart');
    localStorage.setItem('cart', JSON.stringify(cart));
    body.children[1].style.display = "none";
    body.children[2].style.display = "block";
    check = 1
    anime = document.getElementById("anima" + count);
    anime.children[0].style.animation = "deletecart 0.6s ease-in-out";
    anime.children[1].style.animation = "deletecart 0.6s ease-in-out";
    // setTimeout(loadcart(check), 3000)
    setTimeout(function() {
        loadcart(check)
    }, 600);
}
 const cartitemdv =document.getElementById("cartdiv");
const cart = {}
        
function addtocart(name,image,price){
    console.log(`item add to cart ${name}`)

        // cartitemdv.insertAdjacentHTML('beforeend',mycartitems_templates)
        if(cart[name]){
            console.log("item alreay exist");}
        else{
            cart[name] = {
                    name:name,
                    quantity: 1,
                    image:image,
                    totalPrice: price
                };
        }
        console.log(cart)
        updatecart();
        }

function updatecart(){
for (let product in cart){
        console.log("item in cart",cart[product],product);
        let curnt_cart = `<div class="cart-item">
                    <img src="${cart[product].image}" height="100" width="100">
                    <div class="cart-item-info">
                        <h4>test -  ${product}</h4>
                        <p class="price">${cart[product].price}birr</p>
                    </div>
                    <input type="number" value="1" min="1" max="10" class="qty-input">
                    <span class="cart-total">45,000 BIRR</span>
                    <button class="btn remove-btn">Remove</button>
                </div> `
        cartitemdv.insertAdjacentHTML("beforeend",curnt_cart);


    }
}
    const productdiv = document.getElementById("productdiv")
    const products = [
            {name:"Hp",price:230,category:"computer",rating:4.5,imagelink:"https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop","instock":true},
            {name:"Dell",price:230,category:"computer",rating:4.5,imagelink:"https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop","instock":false},
            {name:"Lenovo",price:230,category:"computer",rating:4.5,imagelink:"https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop","instock":false},
            {name:"Infinix",price:230,category:"phone",rating:4.5,imagelink:"https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop","instock":false},
            {name:"samsung",price:230,category:"phone",rating:4.5,imagelink:"https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop","instock":false},
            {name:"tecno",price:230,category:"computer",rating:4.5,imagelink:"https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=687&auto=format&fit=crop","instock":true},
  
        ]
     
function format_myproducts(name,image,price,cat,in_stock){
    const my_product_template = `
        <div class="product-card">
                <a href="product.html"><img src="${image}" height="200" width="200"></a>
                <h3>${name}</h3>
                <strike>55,000 BIRR</strike>
                <p class="price">${price} BIRR</p>
                <p>Category: ${cat}</p>
                <div><span>★★★★★ 4.5</span></div>
               <button class="btn"  onclick="addtocart('${name}','${image}','${price}')">Add to Cart</button>
                <a href="checkout.html"><button class="btn btn-green">BUY</button></a>
            </div>
        `

function formatcart(name,image,price){
    let mycartitems_templates = `
        <div class="cart-item">
                    <img src="${image}" height="100" width="100">
                    <div class="cart-item-info">
                        <h4>test - ${name}</h4>
                        <p class="price">${price}birr</p>
                    </div>
                    <input type="number" value="1" min="1" max="10" class="qty-input">
                    <span class="cart-total">45,000 BIRR</span>
                    <button class="btn remove-btn">Remove</button>
                </div>
        `
        return my_product_template
}

return my_product_template
}
    
    
        
    for(const p of products ){
            console.log(p.name)
            let product_html = format_myproducts(p.name,p.imagelink,p.price,p.category,true)
            productdiv.insertAdjacentHTML("beforeend", product_html)
            
        }


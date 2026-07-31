 const cartitemdv =document.getElementById("cartdiv");
const cart = {}
        
function addtocart(name,image,price){

                //iwill implemnt later
        }

    const productdiv = document.getElementById("productdiv")
    const products = [
            {name:"Hp",price:230,category:"computer",rating:4.5,imagelink:"https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop","instock":true},
            {name:"Dell",price:230,category:"computer",rating:4.5,imagelink:"https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop","instock":false},
            {name:"Lenovo",price:230,category:"computer",rating:4.5,imagelink:"https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop","instock":false},
            {name:"Infinix",price:230,category:"phone",rating:4.5,imagelink:"https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop","instock":false},
            {name:"samsung",price:230,category:"phone",rating:4.5,imagelink:"https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop","instock":false},
            {name:"tecno",price:230,category:"computer",rating:4.5,imagelink:"https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop","instock":true},
  
        ]
     
function format_myproducts(name,image,price,cat,in_stock){
    const my_product_template = `
        <div class="product-card">
                <a href="product.html"><img src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop" height="200" width="200"></a>
                <h3>Tegegn${name}</h3>
                <strike>55,000 BIRR</strike>
                <p class="price">45,000 BIRR</p>
                <p>Category: Computers</p>
                <div><span>★★★★★ 4.5</span></div>
               <button class="btn" >Add to Cart</button>
                <a href="checkout.html"><button class="btn btn-green">BUY</button></a>
            </div>
        `
return my_product_template
}
    
    const mycartitems_templates = `
        <div class="cart-item">
                    <img src="https://images.unsplash.com/photo-1541807084-5c52b6b3adef?q=80&w=687&auto=format&fit=crop" height="100" width="100">
                    <div class="cart-item-info">
                        <h4>test</h4>
                        <p class="price">45,000 BIRR</p>
                    </div>
                    <input type="number" value="1" min="1" max="10" class="qty-input">
                    <span class="cart-total">45,000 BIRR</span>
                    <button class="btn remove-btn">Remove</button>
                </div>
        `
        
    for(const p of products ){
            console.log(p.name)
            // let product_html = format_myproducts(p)
            //productdiv.insertAdjacentHTML("beforeend", my_product_template)
            
        }


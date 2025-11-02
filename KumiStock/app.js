let products = JSON.parse(localStorage.getItem('products')) || [];
let sales = JSON.parse(localStorage.getItem('sales')) || [];

function addProduct(){
    const name = document.getElementById('product-name').value;
    const supplier = document.getElementById('supplier').value;
    const cost = parseFloat(document.getElementById('cost-price').value);
    const price = parseFloat(document.getElementById('selling-price').value);
    const qty = parseInt(document.getElementById('quantity').value);
    const image = document.getElementById('product-image').files[0] ? imagePreview.src : ''; // save image as Base64

    if(name && supplier && cost && price && qty){
        products.push({name, supplier, cost, price, qty, image});
        localStorage.setItem('products', JSON.stringify(products));
        updateDashboard();
        updateProductSelect();
    }
}



function updateProductSelect(){
    const select=document.getElementById('product-select');
    if(!select) return;
    select.innerHTML=products.map((p,i)=>`<option value="${i}">${p.name}</option>`).join('');
}

function recordSale(){
    const index=parseInt(document.getElementById('product-select').value);
    const qtySold=parseInt(document.getElementById('quantity-sold').value);
    if(index>=0 && qtySold){
        const product=products[index];
        if(product.qty>=qtySold){
            product.qty-=qtySold;
            sales.push({name:product.name,qtySold,profit:(product.price-product.cost)*qtySold});
            localStorage.setItem('products',JSON.stringify(products));
            localStorage.setItem('sales',JSON.stringify(sales));
            updateDashboard();
        }else{
            alert('Not enough stock');
        }
    }
}

function updateDashboard(){
    const totalSales = sales.reduce((a,s)=>a+s.qtySold,0);
    const totalProfit = sales.reduce((a,s)=>a+s.profit,0);
    const lowStock = products.filter(p=>p.qty<5).length;

    const totalSalesElem = document.getElementById('total-sales');
    if(totalSalesElem) totalSalesElem.innerText = totalSales + ' items';

    const totalProfitElem = document.getElementById('total-profit');
    if(totalProfitElem) totalProfitElem.innerText = totalProfit + ' UGX';

    const lowStockElem = document.getElementById('low-stock');
    if(lowStockElem) lowStockElem.innerText = lowStock;

   const tbody = document.querySelector('#products-table tbody');
    if(tbody){
        tbody.innerHTML = '';
        products.forEach(p=>{
            const rowClass = p.qty < 5 ? 'low-stock' : '';
            tbody.innerHTML += `<tr class="${rowClass}">
                <td>${p.image ? `<img src="${p.image}" alt="${p.name}">` : ''}</td>
                <td>${p.name}</td>
                <td>${p.supplier}</td>
                <td>${p.qty}</td>
                <td>${p.cost}</td>
                <td>${p.price}</td>
            </tr>`;
        });
    }


}

function runReport(){
    const totalSales = sales.reduce((a,s)=>a+s.qtySold,0);
    const totalProfit = sales.reduce((a,s)=>a+s.profit,0);
    const output = document.getElementById('report-output');
    if(output) output.innerHTML = `<p>Total Items Sold: ${totalSales}</p><p>Total Profit: ${totalProfit} UGX</p>`;
}
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if(hamburger && navLinks){
  hamburger.addEventListener('click', ()=>{
    navLinks.classList.toggle('show');
  });
}

// Preview product image
const imageInput = document.getElementById('product-image');
const imagePreview = document.getElementById('image-preview');

if(imageInput){
    imageInput.addEventListener('change', function(){
        const file = this.files[0];
        if(file){
            const reader = new FileReader();
            reader.onload = function(e){
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        }
    });
}


updateDashboard();
updateProductSelect();

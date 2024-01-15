document.addEventListener('DOMContentLoaded', function() {
    const productContainer = document.querySelector('#product-container')
    const productURL = `http://localhost:8000/products`
    const productForm = document.querySelector('#product-form')
    let allProducts = []

    fetch(`${productURL}`)
    .then( response => response.json() )
    .then( productData => productData.forEach(function(product) {
        allProducts = productData
        productContainer.innerHTML += `
        <div id="product-${product.id}" class="product">
            <h2>${product.name}</h2>
            <h4>Price: $${product.price}</h4>
            <h4>Dollar Price: u$d ${product.dollarPrice}</h4>
            <button data-id="${product.id}" id="edit-${product.id}" data-action="edit">Edit</button>
            <button data-id="${product.id}" id="delete-${product.id}" data-action="delete">Delete</button>
        </div>
        <div id=edit-product-${product.id}></div>`
    })) // end of product fetch

    productForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const nameInput = productForm.querySelector('#name').value
        const priceInput = productForm.querySelector('#price').value
        
        fetch(`${productURL}`, {
            method: 'POST',
            body: JSON.stringify({
              name: nameInput,
              price: priceInput
            }),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then( response => response.json())
        .then( product => {
            allProducts.push(product);

            productContainer.innerHTML += `
            <div id="product-${product.id}" class="product">
                <h2>${product.name}</h2>
                <h4>Price: $${product.price}</h4>
                <h4>Dollar Price: u$d ${product.dollarPrice}</h4>
                <button data-id="${product.id}" id="edit-${product.id}" data-action="edit">Edit</button>
                <button data-id="${product.id}" id="delete-${product.id}" data-action="delete">Delete</button>
            </div>
            <div id=edit-product-${product.id}></div>`
        })
    }) // end of eventListener for adding a product

    productContainer.addEventListener('click', (e) => {
        if (e.target.dataset.action === 'edit') {
            const editButton = document.querySelector(`#edit-${e.target.dataset.id}`)
            editButton.disabled = true

            const productData = allProducts.find((product) => {
              return product.id == e.target.dataset.id
            });

            const editForm = productContainer.querySelector(`#edit-product-${e.target.dataset.id}`);

            editForm.innerHTML += `
            <div id='edit-product' class="edit-product">
              <form id="product-form">
                <input required id="edit-name" placeholder="${productData.name}">
                <input required id="edit-price" placeholder="${productData.price}">
                <input type="submit" value="Edit Product">
            </div>`;

            editForm.addEventListener("submit", (e) => {
                e.preventDefault()
                const nameInput = document.querySelector("#edit-name").value
                const priceInput = document.querySelector("#edit-price").value
                const editedProduct = document.querySelector(`#product-${productData.id}`)
                
                fetch(`${productURL}/${productData.id}`, {
                  method: 'PUT',
                  body: JSON.stringify({
                    name: nameInput,
                    price: priceInput
                  }),
                  headers: {
                    'Content-Type': 'application/json'
                  }
                }).then( response => response.json() )
                .then( product => {
                  editedProduct.innerHTML = `
                  <div id="product-${product.id}" class="product">
                    <h2>${product.name}</h2>
                    <h4>Product: $${product.price}</h4>
                    <h4>Dollar Price: u$d ${product.dollarPrice}</h4>
                    <button data-id=${product.id} id="edit-${product.id}" data-action="edit">Edit</button>
                    <button data-id=${product.id} id="delete-${product.id}" data-action="delete">Delete</button>
                  </div>
                  <div id="edit-product-${product.id}"></div>`
                  editForm.innerHTML = ""
                })
            }) // end of this event Listener for edit submit
        } else if (e.target.dataset.action === 'delete') {
            document.querySelector(`#product-${e.target.dataset.id}`).remove()
            fetch(`${productURL}/${e.target.dataset.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              }
            }).then( response => response.json())
        }
    }) // end of eventListener for editing and deleting a product
});
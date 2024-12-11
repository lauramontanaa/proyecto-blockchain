
  const productForm = document.querySelector("#productForm")

  document.addEventListener("DOMContentLoaded", ()=> {
        App.init()
  })

  productForm.addEventListener("submit", e =>{
    e.preventDefault()

        App.created(
            productForm["product"].value,
            productForm["amount"].value,
            productForm["code"].value,
            productForm["size"].value,
            productForm["color"].value,
            productForm["description"].value 
        );
  })
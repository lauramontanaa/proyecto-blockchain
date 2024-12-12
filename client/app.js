App = {
  contracts: {},

  init: async () => {
    console.log("Loaded");
    await App.loadWeb3();
    await App.loadAccount();
    await App.loadContracts();
    App.render();
    await App.renderProduct();
  },

  loadWeb3: async () => {

    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("successful connection");
    } else if (web3) {
      web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        "No ethereum browser is installed. Try it installing MetaMask"
      );
    }
  },

  loadAccount: async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts);
    App.account = accounts[0];
  },

  loadContracts: async () => {
    const response = await fetch("productTrace.json"); 
    const productTraceJSON = await response.json();
    console.log(productTraceJSON);

    App.contracts.productsContract = TruffleContract(productTraceJSON); 

    App.contracts.productsContract.setProvider(App.web3Provider); 

    App.productsContract = await App.contracts.productsContract.deployed(); 
  },

  render: () => {
    document.getElementById("account").innerText = App.account;
  },

  renderProduct: async () => {
    const counter = await App.productsContract.counter();
    const counterNumber = counter.toNumber();
    console.log(counterNumber);

    let html = "";

    for (let i = 1; i <= counterNumber; i++) {
      const prod = await App.productsContract.products(i);
      console.log(prod);

      const _id = prod[0];
      const _product = prod[1];
      const _amount = prod[2];
      const _code = prod[3];
      const _size = prod[4];
      const _color = prod[5];
      const _description = prod[6];
      const _done = prod[7];
      const _createdAt = prod[8];

      let prodElement = `

        <div class="card bg-light mb-2">
          <div class="card-header d-flex justify-content-between align-items-center bg-white" >
              <h5>${_product}</h5>
              <div class="form-check form-switch">
              <input class="form-check-input" data-id="${_id}" type="checkbox" ${_done && "checked"} 
                onchange="App.toggleDone(this)"              
              />

              </div>
          </div>


          <div class="card-body">
              <span class="text_card">Cantidad:  ${_amount}</span><br>
              <span class="text_card">Código: ${_code}</span><br>
              <span class="text_card">Talla: ${_size}</span><br>
              <span class="text_card">Color: ${_color}</span><br>
              <span class="text_card">Descripción: ${_description}</span>
              </div>
              <div class="card-footer text-muted">
              <p class"text-secondary">El producto fue agregado al inventario ${new Date(_createdAt * 1000).toLocaleString()}</p>
              </div>
              </div>

      `;
      html += prodElement;
    }

    document.querySelector("#productsList").innerHTML = html;
  },

  created: async (product, amount, code, size, color, description) => {
    const result = await App.productsContract.createProduct(
      product,
      amount,
      code,
      size,
      color,
      description,
      {
        from: App.account,
      }
    );
    console.log(result.logs[0].args);

    window.color.reload();
  },

  toggleDone: async (element) => {
    console.log(element.dataset.id);
    const prodId = element.dataset.id;
    await App.productsContract.toggleDone(prodId, {
      from: App.account,
    });
    window.color.reload();
  },
};

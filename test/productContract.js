const productContract = artifacts.require("productTrace");


contract("productTrace", (accounts) => {

  before(async () => {
    this.productContract = await productContract.deployed();
  });

  it("migrate deployed successfully", async () => {
    const address = await this.productContract.address;

    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
  });

  it("get Product List", async () => {
    const counter = await this.productContract.counter();
    const prod = await this.productContract.products(counter);

    assert.equal(prod.id.toNumber(), counter.toNumber());
    assert.equal(prod.product, "Camisa");
    assert.equal(prod.amount, "5");
    assert.equal(prod.code, "CA001");
    assert.equal(prod.size, "XXL");
    assert.equal(prod.color, "Azul");
    assert.equal(prod.description, "Manga Corta");
    assert.equal(prod.done, false);
    assert.equal(counter, 1);
  });

  it("product created successfully", async () => {
    const result = await this.productContract.createProduct("Cacao", "Cosecha", "8090", "20", "Cali-Colombia, Hacienda Cacao", "Ejemplo");
    const prodEvent = result.logs[0].args;
    const counter = await this.productContract.counter();

    assert.equal(counter, 2);
    assert.equal(prodEvent.id.toNumber(), 2);
    assert.equal(prodEvent.product, "Camisa");
    assert.equal(prodEvent.amount, "5");
    assert.equal(prodEvent.code, "CA001");
    assert.equal(prodEvent.size, "XXL");
    assert.equal(prodEvent.color, "Azul");
    assert.equal(prodEvent.description, "Manga Corta");
    assert.equal(prodEvent.done, false);
  });

  it("product toggled done", async () => {
    const result = await this.productContract.toggleDone(1);
    const prodEvent = result.logs[0].args;
    const prod = await this.productContract.products(1);

    assert.equal(prod.done, true);
    assert.equal(prodEvent.id.toNumber(), 1);
    assert.equal(prodEvent.done, true);
  });
});
import 'mocha';
import {expect} from "chai";

/*
Extract product over specified price

Given the following products :
|Name|Price|
|House|50|
|Cable|29|
|iPhone|1200|
The extracted product length is 3 when the over specified price is 1
The extracted product length is 2 when the over specified price is 30
The extracted product length is 1 when the over specified price is 1000
|Name|Price|
|Mouse|50|
|Laptop|1500|
|Keyboard|20|
|Power cord|5|
The extracted product length is 1 when the over specified price is 300
*/

//===============================
interface Product {
    name:string,
    price:number
}
interface ProductRepo{
    allProducts(): Product[];
}
class fakeProductRepo implements ProductRepo{
    constructor(private products: Product[]){}
    allProducts(): Product[] {
        return this.products
    }

}
const extractProductsWithOverSpecifiedPrice = (productsRepo:ProductRepo,specifiedPrice:number): number => {
    return productsRepo.allProducts().filter(product=> product.price>specifiedPrice).length
}
//================================

describe("Extract product over specified price",()=> {
    const extractedPriceTestScenarios:Scenario[] = [
        {overSpecifiedPrice:1, expectedLength:3,productRepo:new fakeProductRepo([{name:'House',price:50},{name:'Cable',price:29},{name:'iPhone',price:1200},])},
        {overSpecifiedPrice:30, expectedLength:2,productRepo:new fakeProductRepo([{name:'House',price:50},{name:'Cable',price:29},{name:'iPhone',price:1200},])},
        {overSpecifiedPrice:1000, expectedLength:1,productRepo:new fakeProductRepo([{name:'House',price:50},{name:'Cable',price:29},{name:'iPhone',price:1200},])},
        {overSpecifiedPrice:500, expectedLength:1,productRepo:new fakeProductRepo([{name:'House',price:50},{name:'Cable',price:29},{name:'iPhone',price:1200},])},
        {overSpecifiedPrice:300, expectedLength:1,productRepo:new fakeProductRepo([{name:'Mouse',price:50},{name:'iPhone',price:1500},{name:'Keyboard',price:20},{name:'Power cord',price:5},])},
        {overSpecifiedPrice:300, expectedLength:1,productRepo:new fakeProductRepo([{name:'Mouse',price:50},{name:'Laptop',price:1500},{name:'Keyboard',price:20},{name:'Power cord',price:5},])},
    ]
    extractedPriceTestScenarios.forEach(extractedPriceTestScenario => {
        it(`The extracted product length is ${extractedPriceTestScenario.expectedLength} when the over specified price is ${extractedPriceTestScenario.overSpecifiedPrice}`,()=>{
            expect(extractProductsWithOverSpecifiedPrice(extractedPriceTestScenario.productRepo, extractedPriceTestScenario.overSpecifiedPrice)).equal(extractedPriceTestScenario.expectedLength)
        })
    })
})
interface Scenario {
    overSpecifiedPrice:number,
    expectedLength:number,
    productRepo:ProductRepo
}



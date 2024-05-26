import fs from "fs"
import { fromDir, parseProduct, product } from "./util"
import { productIsValid, urlRoot } from "./provider";
import { populateDB } from "./db";

const parsedProducts: product[] = [];
const fields: Set<string> = new Set<string>();
const addProduct = (path: string) => {
    const product = parseProduct(path);
    if (!productIsValid(product)) return; // Brand key not found!
    product.url = urlRoot + product.url;
    parsedProducts.push(product);
    product.attributes.forEach(e => {
        fields.add(e.field);
    })
}
fromDir("./products", "index.html", addProduct);

fs.writeFileSync("products.json", JSON.stringify(parsedProducts));
fs.writeFileSync("fields.json", JSON.stringify(Array.from(fields)));

populateDB(parsedProducts);
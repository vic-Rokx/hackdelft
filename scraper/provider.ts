import { product } from "./util"

export const urlRoot = "https://lenntech.com/";
export function productIsValid(product: product) {
    return !(product.attributes.filter(e => e.field === "Brand").length === 0);
}
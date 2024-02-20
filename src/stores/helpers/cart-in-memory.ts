import { ProductProps } from "@/utils/data/products";
import { ProductCartProps } from "../cart-store";

export function add(products: ProductCartProps[], newProduct: ProductProps) {
    const existingProduct = products.find(({ id}) => newProduct.id === id)
    if(!existingProduct) return [...products, {...newProduct, quantity: 1 }]
    return products.map((product) => product.id === existingProduct.id ? {
        ...product, quantity: product.quantity + 1
    } : product)
}

export function remove(products: ProductCartProps[], productRemovedId: string) {
    const updatedProducts = products.map((product) => (
        product.id === productRemovedId ? {
            ...product,
            quantity: product.quantity > 0 ? product.quantity - 1 : 0
        } : product
    ))
    return updatedProducts.filter((product) => product.quantity)
}
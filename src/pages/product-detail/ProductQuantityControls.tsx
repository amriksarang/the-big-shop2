import React, { ReactElement } from 'react';

interface ProductQuantityControlsParameters {
    setQuantity: (quantity: any) => void,
    quantity: number,
    handleProduct: () => void
}

const ProductQuantityControls: React.FC<ProductQuantityControlsParameters> = ({setQuantity, quantity, handleProduct}): ReactElement => {
    return <>
        <button className='product-detail-decrease-button' onClick={() => setQuantity( (quantity:number) => quantity > 1 ? quantity - 1 : 1) }> - </button> 
        <span data-testid='quantity-elem'>{quantity}</span>
        <button className='product-detail-increase-button' data-testid="increment" onClick={() => setQuantity( (quantity:number) => quantity + 1) }> + </button>
        <button  className='button' onClick={handleProduct} data-testid="add-product">Add Product</button>
    </>
}

export default ProductQuantityControls;
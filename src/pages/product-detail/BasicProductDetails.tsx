import React, { ReactElement, HTMLAttributes } from 'react';
import { Feature, Features, Position, ProductVarient, Products, Varients } from '../../interfaces/Products';

interface BasicProductDetailsParameters {
    product: Products,
    ratingStyle: () => HTMLAttributes<string>,
    discountedPrice: () => number
}

const BasicProductDetails: React.FC<BasicProductDetailsParameters> = ({product, ratingStyle, discountedPrice}): ReactElement => {
    return <>
        <h3>{product["product-title"]}</h3>
        <p><a href="#" className='product-detail-store'>Visit the {product.features["Brand"]} Store</a></p>
        <div> <div className="product-ratings">
            <div className="empty-stars">&nbsp;</div>
            <div className="filled-stars" style={ratingStyle()}></div>
        </div>&nbsp;{product.features["Reviews"]}&nbsp; ratings</div>
        <p className='mrp-price' style={{'marginLeft': 0}}>MRP: Rs.{product.mrp}</p>
        <p>Rs. {discountedPrice()} (less {product.discount})</p>
    </>
}

export default BasicProductDetails;
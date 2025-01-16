import React, { ReactElement, HTMLAttributes } from 'react';
import { Products } from "../../interfaces/Products";
import { Link } from "react-router-dom";

interface ProductsListItemsParameters {
    productsList: Partial<Array<Products>>
}

const ProductsListItems: React.FC<ProductsListItemsParameters> = ({productsList}): ReactElement => {
    return <>
    {
        productsList.map((productItem: Products | undefined) => {
                    
            let product = productItem!;
            let discountValue = product.discount || '';
            let mrp = parseInt(product.mrp.replace(",", ""));
            let discount = parseInt(discountValue.replace("%", ""));
            let discountedPrice = mrp - (mrp * discount) / 100;
            let ratingStars = product.features.Rating;
            let startWidthPercentage = (ratingStars * 100) / 5;
            let style = { '--width': `${startWidthPercentage}%` };

            return (
                <Link
                    to={`/product?productId=${product["product-id"]}`}
                    key={product["product-title"]}
                >
                    <div className="product">
                        <img
                            src={product.images.small}
                            alt={product["product-title"]}
                        />
                        <div className="discounted-price">
                            ₹ {discountedPrice}&nbsp;
                        </div>
                        <div className="mrp-price">₹ {product.mrp}</div>
                        <div className="product-title">
                            {product["product-title"]}
                        </div>
                        <div className="product-ratings">
                            <div className="empty-stars">&nbsp;</div>
                            <div className="filled-stars" style={style as HTMLAttributes<string>}></div>
                        </div>
                        <div className="rating-reviews">
                            ({product.features.Reviews})
                        </div>
                    </div>
                </Link>
            );
                    
        })
    }

    </>
}

export default ProductsListItems;

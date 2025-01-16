import React, { ReactElement } from 'react';
import { Features } from '../../interfaces/Products';

interface ProductFeaturesParameters {
    features: Features
}

const ProductFeatures: React.FC<ProductFeaturesParameters> = ({features}): ReactElement => {
    return <ul>
        {
            Object.entries(features).map( ([key, value]) => <li key={key}>
            {`${key}: ${value}`}
        </li>)
        }
    </ul>

}

export default ProductFeatures;
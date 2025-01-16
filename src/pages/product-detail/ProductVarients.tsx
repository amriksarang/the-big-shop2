import React, { ReactElement } from 'react';
import { Position, ProductVarient, Varients } from '../../interfaces/Products';

interface ProductVarientParameters {
    varients: Varients[],
    position: Partial<Position>,
    handleVarients: (type: string, index: number, varient: ProductVarient) => void

}

const ProductVarients: React.FC<ProductVarientParameters> = ({varients, position, handleVarients}): ReactElement => {
    return <ul>
        {    
            varients.map( (varient, index) => {            
                let selectedVarient = position;
                if(!selectedVarient){
                    selectedVarient = {[varient.type]: 0};
                }
                
                return <li key={varient.type} className="varient-list">
                            {`${varient.type}`}&nbsp;
                            {
                            varient.value.map((item, index1) => 
                                <span  key={item.id + item.value} className={selectedVarient[varient.type] === index1 ? "selected-varient" : "not-selected-varient"}
                                    onClick={() => handleVarients(varient.type, index1, {"type": varient.type, "id": item.id, "value": item.value, "price": item.price})}>
                                    &nbsp;&nbsp;{item.value} &nbsp;&nbsp;
                                </span>
                            )
                            }
                        </li>
            })
        }
        
    </ul>

}

export default ProductVarients;
import React, { ReactElement } from 'react';
import { Address } from '../../interfaces/User';

interface UserAddressParameters {
    addresses: Array<Address>,
    houseIndex: number,
    handleAddress: (item: Address, index: number) => void
}

const UserAddress: React.FC<UserAddressParameters> = ({addresses, houseIndex, handleAddress}): ReactElement => {
    return <ul>
    {
        addresses && addresses.map((item: Address, index: number) => {
            return  item && <li key={item._id} style={{border: houseIndex === index ? "2px solid brown " : "1px solid lightgrey"}}>
                <input type="radio" checked={index === houseIndex} disabled/>
                <div className='house-details'>
                    <p>{item.houseno}</p>
                    <p>{item.street1}</p>
                    {item.street2 && <p>{item.street2}</p>}
                    <p>{item.city}</p>
                    <p>{item.state}</p>
                    <p>{item.zipcode}</p>
                </div>
                <button className='button' 
                    onClick={() => {
                        alert(index !== 0 && houseIndex === index)
                        handleAddress(item, index)
                    }} 
                    disabled={ addresses.length === 1 ? true : false}>Select</button>
            </li>
        })
    }
    </ul>
}

export default UserAddress;
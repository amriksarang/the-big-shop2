import React, { ReactElement } from 'react';
import mobileFeatures from '../../config/mobileFeatures';
import { Feature,  SearchData, SearchFunction } from '../../interfaces/Products';
import './SearchTool.scss';

const SearchTool: React.FC<SearchFunction> = ({setSearchData}) : ReactElement => {

    //let productType = new URLSearchParams(window.location.search).get('products');

    const handleSelection = (e: React.ChangeEvent) => {
        
        let value = e.target.getAttribute("data-search-value") as string;
        let featureValue: string | number;
        
        if(value.indexOf("-") === -1 && !isNaN(parseInt(value)))
            featureValue = parseInt(value);
        else 
            featureValue = value;

        let checked = (e.target as HTMLInputElement).checked;
        if(checked){
            setSearchData( (searchData: SearchData[]) => {
                let data = searchData;
                if(!data) data = [];
                    
                const val: SearchData[] = [
                    ...data,
                    {
                        features: e.target.getAttribute("data-search-field")!,
                        value: featureValue
                    }
                ];
                
                return val
            });
        }else{
            setSearchData( (data: SearchData[]) => {
                
                const val: SearchData[] = data.filter( item => item.value !== featureValue);
                
                
                return val;
            });
        }
    }

    const getSearchItem = (feature: Feature) => {
        return feature.values.map( item => (
            <p key={item }> 
                <input type="checkbox" onChange={(e) => handleSelection(e)}  data-search-field={feature.type} data-search-value={item} /> 
                <span className="feature-value" >{item} {feature.unit}</span>
            </p>
        ));
    }

    const getSearchItems = () => {
        
        return mobileFeatures.map( (feature: Feature) => (
            <div className="search-tool-items" key={feature.type}>
                <p>{feature.type}</p>
                <div className="search-tool-item" >
                    {getSearchItem(feature)}
                </div>
            </div>
        ));
    }

    return (
        <div className="search-tool">
            {getSearchItems()}
        </div>
    );
}

export default SearchTool;


export interface Products{
    category: string,
    'sub-category': string,
    'product-id': number,
    'product-title': string,
    mrp: string,
    discount?: string,
    details: string,
    features: Features,
    varients: Varients[],
    images: ProductImages,
}

export interface Features{
    'RAM' : Array<number>,
    'Camera' : number,
    'Battery' : number,
    'Processor' : string,
    'Screen Size' : 6.7,
    'Storage' : Array<number>,
    'Rating' : number,
    'Brand' : string,
    'Reviews' : number
}

export interface Varients{
    "type": string,
    value: VarientValue[],
    price?: string
}

export interface ProductVarient{
    type: string, 
    id: string, 
    value: string | number, 
    price?: string
}

export interface VarientValue{
    "id": string,
    "value": string,
    price?: string
}

export interface ProductImages{
    small: string,
    large : Array<string>,
    thumbs: Array<string>
}

export interface Image{
    
}

export interface CartItem{
    product: Products,
    productPrice: number,
    quantity: number,
    varient: Array<ProductVarient>
}

export interface ProductCart{
    products: Array<CartItem>,
    total: number
}

export interface SearchData{
    features: string,
    value: string | number
}

export interface Feature{
    type: string,
    values: string[] | number[],
    unit?: string
}

export interface SearchFunction{
    setSearchData: ( callback: (data: SearchData[]) => SearchData[] ) => void
}

export interface Position{
    [type: string]: number
}
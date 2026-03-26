export interface IProductList {
    id: string;
    name: string;
    description: string;
    price: number;
    category?: string;
    image_url: string;
    instock?: boolean;
    rating?: number
}
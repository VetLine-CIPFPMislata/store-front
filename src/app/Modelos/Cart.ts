import { User } from './User';

export interface Product {
    id: number;
    name: string;
    productDescription: string;
    basePrice: number;
    price: number;
    discountPercentage: number;
    pictureProduct: string;
    quantity: number;
    rating: number;
}

export interface CartItem {
    id: number;
    quantity: number;
    cartId: number;
    product: Product;
    unitPrice: number;
}

export interface Cart {
    id: number;
    totalProducts: number;
    totalPrice: number;
    user: User;
    items: CartItem[];
}

export interface AddToCartRequest {
    productId: number;
    quantity: number;
}

export interface UpdateQuantityRequest {
    quantity: number;
}

export interface PaymentCardData {
    numeroTarjeta: string;
    fechaCaducidad: string;
    cvc: string;
    nombreCompleto: string;
}

export interface CheckoutRequest {
    address: string;
}

export interface Order {
    id: number;
    totalProducts: number;
    totalPrice: number;
    state: string;
    user: User;
    createdAt: string;
    orderAt: string;
    address: string;
    items: OrderItem[];
}

export interface OrderItem {
    id: number;
    quantity: number;
    unitPrice: number;
    product: Product;
}

export interface PaymentRequest {
    cardData: PaymentCardData;
    amount: number;
    concept: string;
}

export interface PaymentResultDto {
    success: boolean;
    message: string;
    referenceNumber: string | null;
    paidAmount: number;
    dateTime: string | null;
    errorCode: string | null;
}

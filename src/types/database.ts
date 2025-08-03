import { ObjectId } from "mongodb";

export interface BaseDocument {
    _id?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface User extends BaseDocument {
    email: string;
    name: string;
    password: string;
    role: "user" | "admin";
    phone?: string;
    avatar?: string;
    shippingInfo?: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        postalCode: string;
        notes: string;
    };
}

export interface CakeOrder extends BaseDocument {
    userId: ObjectId;
    cakeType: string;
    size: "small" | "medium" | "large";
    flavor: string;
    description?: string;
    price: number;
    status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
    deliveryDate: Date;
    deliveryAddress: string;
    customerInfo: {
        name: string;
        phone: string;
        email: string;
    };
}

export interface Review extends BaseDocument {
    userId: ObjectId;
    orderId?: ObjectId;
    rating: number; // 1-5
    comment: string;
    isApproved: boolean;
    customerName: string;
}

export interface PhotoReview extends BaseDocument {
    cakeName: string;
    cakeDescription: string;
    totalPrice: number;
    totalWeight: number;
    images: string[]; // Масив URL зображень для слайдера
    completedDate: Date; // Дата виконання замовлення
    isApproved: boolean;
}

export interface PortfolioItem extends BaseDocument {
    title: string;
    image: string; // URL до зображення
}

export interface ContactMessage extends BaseDocument {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    isRead: boolean;
    replied: boolean;
}

export interface DatabaseCollections {
    users: User;
    orders: CakeOrder;
    reviews: Review;
    portfolio: PortfolioItem;
    messages: ContactMessage;
}

export type CreateUser = Omit<User, "_id" | "createdAt" | "updatedAt">;
export type CreateCakeOrder = Omit<
    CakeOrder,
    "_id" | "createdAt" | "updatedAt"
>;
export type CreateReview = Omit<Review, "_id" | "createdAt" | "updatedAt">;
export type CreatePortfolioItem = Omit<
    PortfolioItem,
    "_id" | "createdAt" | "updatedAt"
>;
export type CreateContactMessage = Omit<
    ContactMessage,
    "_id" | "createdAt" | "updatedAt"
>;

export type UpdateUser = Partial<Omit<User, "_id">> & { _id: ObjectId };
export type UpdateCakeOrder = Partial<Omit<CakeOrder, "_id">> & {
    _id: ObjectId;
};
export type UpdateReview = Partial<Omit<Review, "_id">> & { _id: ObjectId };
export type UpdatePortfolioItem = Partial<Omit<PortfolioItem, "_id">> & {
    _id: ObjectId;
};
export type UpdateContactMessage = Partial<Omit<ContactMessage, "_id">> & {
    _id: ObjectId;
};

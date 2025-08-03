// Shared user types for consistent usage across the application

export interface UserShippingInfo {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    notes: string;
}

export interface UserSession {
    id: string;
    name?: string | null;
    email?: string | null;
    role?: string;
    phone?: string;
    shippingInfo?: UserShippingInfo;
}

export interface ExtendedUser extends UserSession {
    _id?: string;
    createdAt?: string;
    updatedAt?: string;
}

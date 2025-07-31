import { ObjectId } from "mongodb";
import {
  CakeOrder,
  CreateUser,
  CreateCakeOrder,
  CreateReview,
} from "../types/database";

// Input validation interfaces
export interface UserInput {
  email?: string;
  name?: string;
  password?: string;
  phone?: string;
  role?: string;
  avatar?: string;
}

export interface OrderInput {
  userId?: string;
  cakeType?: string;
  size?: string;
  flavor?: string;
  description?: string;
  price?: string | number;
  deliveryDate?: string | Date;
  deliveryAddress?: string;
  customerInfo?: {
    name?: string;
    phone?: string;
    email?: string;
  };
}

export interface ReviewInput {
  userId?: string;
  orderId?: string;
  rating?: string | number;
  comment?: string;
  customerName?: string;
}

export interface PaginationInput {
  page?: string | number;
  limit?: string | number;
  sortBy?: string;
  sortOrder?: string;
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  const phoneRegex =
    /^(\+38)?[\s\-]?(\(?0\d{2}\)?[\s\-]?\d{3}[\s\-]?\d{2}[\s\-]?\d{2})$/;
  return phoneRegex.test(phone);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Пароль має бути не менше 8 символів");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Пароль має містити принаймні одну велику літеру");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Пароль має містити принаймні одну малу літеру");
  }

  if (!/\d/.test(password)) {
    errors.push("Пароль має містити принаймні одну цифру");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateRating(rating: number): boolean {
  return rating >= 1 && rating <= 5 && Number.isInteger(rating);
}

export function isValidObjectId(id: string): boolean {
  return ObjectId.isValid(id);
}

export function validateCreateUser(data: UserInput): CreateUser {
  if (!data.email || !validateEmail(data.email)) {
    throw new ValidationError("Невірний email");
  }

  if (!data.name || data.name.trim().length < 2) {
    throw new ValidationError("Ім'я має бути не менше 2 символів");
  }

  if (!data.password) {
    throw new ValidationError("Пароль обов'язковий");
  }

  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    throw new ValidationError(passwordValidation.errors.join(", "));
  }

  if (data.phone && !validatePhone(data.phone)) {
    throw new ValidationError("Невірний формат телефону");
  }

  if (data.role && !["user", "admin"].includes(data.role)) {
    throw new ValidationError("Невірна роль користувача");
  }

  return {
    email: data.email.toLowerCase().trim(),
    name: data.name.trim(),
    password: data.password,
    role: (data.role as "user" | "admin") || "user",
    phone: data.phone?.trim(),
    avatar: data.avatar?.trim(),
  };
}

export function validateCreateOrder(data: OrderInput): CreateCakeOrder {
  if (!data.userId || !isValidObjectId(data.userId)) {
    throw new ValidationError("Невірний ID користувача");
  }

  if (!data.cakeType || data.cakeType.trim().length < 3) {
    throw new ValidationError("Тип торта має бути не менше 3 символів");
  }

  if (!data.size || !["small", "medium", "large"].includes(data.size)) {
    throw new ValidationError("Невірний розмір торта");
  }

  if (!data.flavor || data.flavor.trim().length < 2) {
    throw new ValidationError("Смак має бути не менше 2 символів");
  }

  const price =
    typeof data.price === "string" ? parseInt(data.price) : data.price;
  if (!price || price <= 0) {
    throw new ValidationError("Ціна має бути більше 0");
  }

  if (!data.deliveryDate || new Date(data.deliveryDate) <= new Date()) {
    throw new ValidationError("Дата доставки має бути в майбутньому");
  }

  if (!data.deliveryAddress || data.deliveryAddress.trim().length < 10) {
    throw new ValidationError("Адреса доставки має бути не менше 10 символів");
  }

  if (!data.customerInfo?.name || data.customerInfo.name.trim().length < 2) {
    throw new ValidationError("Ім'я замовника обов'язкове");
  }

  if (!data.customerInfo?.phone || !validatePhone(data.customerInfo.phone)) {
    throw new ValidationError("Невірний телефон замовника");
  }

  if (!data.customerInfo?.email || !validateEmail(data.customerInfo.email)) {
    throw new ValidationError("Невірний email замовника");
  }

  return {
    userId: new ObjectId(data.userId),
    cakeType: data.cakeType.trim(),
    size: data.size as "small" | "medium" | "large",
    flavor: data.flavor.trim(),
    description: data.description?.trim(),
    price: price,
    status: "pending",
    deliveryDate: new Date(data.deliveryDate!),
    deliveryAddress: data.deliveryAddress!.trim(),
    customerInfo: {
      name: data.customerInfo!.name!.trim(),
      phone: data.customerInfo!.phone!.trim(),
      email: data.customerInfo!.email!.toLowerCase().trim(),
    },
  };
}

export function validateCreateReview(data: ReviewInput): CreateReview {
  if (!data.userId || !isValidObjectId(data.userId)) {
    throw new ValidationError("Невірний ID користувача");
  }

  if (data.orderId && !isValidObjectId(data.orderId)) {
    throw new ValidationError("Невірний ID замовлення");
  }

  const rating =
    typeof data.rating === "string" ? parseInt(data.rating) : data.rating;
  if (!rating || !validateRating(rating)) {
    throw new ValidationError("Рейтинг має бути від 1 до 5");
  }

  if (!data.comment || data.comment.trim().length < 10) {
    throw new ValidationError("Коментар має бути не менше 10 символів");
  }

  if (!data.customerName || data.customerName.trim().length < 2) {
    throw new ValidationError("Ім'я замовника обов'язкове");
  }

  return {
    userId: new ObjectId(data.userId),
    orderId: data.orderId ? new ObjectId(data.orderId) : undefined,
    rating: rating,
    comment: data.comment!.trim(),
    isApproved: false,
    customerName: data.customerName!.trim(),
  };
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
  }).format(price);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function formatOrderStatus(status: CakeOrder["status"]): string {
  const statusMap = {
    pending: "Очікується",
    confirmed: "Підтверджено",
    in_progress: "Виготовляється",
    completed: "Виконано",
    cancelled: "Скасовано",
  };

  return statusMap[status] || status;
}

export function validateImageFile(file: File): {
  isValid: boolean;
  error?: string;
} {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Дозволені тільки файли JPEG, PNG, WebP",
    };
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: "Розмір файлу не повинен перевищувати 5MB",
    };
  }

  return { isValid: true };
}

export function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2);
  const extension = originalName.split(".").pop();
  return `${timestamp}_${random}.${extension}`;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export function validatePaginationOptions(
  options: PaginationInput
): PaginationOptions {
  return {
    page: Math.max(1, parseInt(String(options.page)) || 1),
    limit: Math.min(100, Math.max(1, parseInt(String(options.limit)) || 10)),
    sortBy: options.sortBy || "createdAt",
    sortOrder: ["asc", "desc"].includes(options.sortOrder || "")
      ? (options.sortOrder as "asc" | "desc")
      : "desc",
  };
}

export function calculatePagination(total: number, options: PaginationOptions) {
  const totalPages = Math.ceil(total / options.limit);
  const hasNextPage = options.page < totalPages;
  const hasPrevPage = options.page > 1;

  return {
    total,
    totalPages,
    currentPage: options.page,
    limit: options.limit,
    hasNextPage,
    hasPrevPage,
    skip: (options.page - 1) * options.limit,
  };
}

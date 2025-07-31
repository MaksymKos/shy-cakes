import { Db, Collection, ObjectId } from "mongodb";
import {
  DatabaseCollections,
  CreateUser,
  CreateCakeOrder,
  CreateReview,
  CreatePortfolioItem,
  CreateContactMessage,
  User,
  CakeOrder,
  Review,
  PortfolioItem,
  ContactMessage,
} from "../../types/database";
import clientPromise from "./db";

export async function getDatabase(): Promise<Db> {
  const maxRetries = 3;
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Database connection attempt ${attempt}/${maxRetries}`);
      const client = await clientPromise;
      const dbName = process.env.MONGODB_DB || "shy-cakes";
      const db = client.db(dbName);
      
      // Test the connection
      await db.admin().ping();
      console.log("Database connection successful");
      
      return db;
    } catch (error) {
      lastError = error as Error;
      console.error(`Database connection attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        const delay = attempt * 2000; // Exponential backoff: 2s, 4s, 6s
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  console.error("All database connection attempts failed:", lastError);
  throw new Error(`Database connection failed after ${maxRetries} attempts: ${lastError?.message}`);
}

export async function getCollection<T extends keyof DatabaseCollections>(
  collectionName: T
): Promise<Collection<DatabaseCollections[T]>> {
  const db = await getDatabase();
  return db.collection<DatabaseCollections[T]>(collectionName);
}

export function addTimestamps<T>(
  document: T
): T & { createdAt: Date; updatedAt: Date } {
  const now = new Date();
  return {
    ...document,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateTimestamp<T>(document: T): T & { updatedAt: Date } {
  return {
    ...document,
    updatedAt: new Date(),
  };
}

export async function createUser(userData: CreateUser) {
  const users = await getCollection("users");
  const userWithTimestamps = addTimestamps(userData);
  return await users.insertOne(userWithTimestamps);
}

export async function findUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await getCollection("users");
    return await users.findOne({ email: email.toLowerCase() });
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw new Error("Database connection failed");
  }
}

export async function findUserById(
  userId: string | ObjectId
): Promise<User | null> {
  const users = await getCollection("users");
  const id = typeof userId === "string" ? new ObjectId(userId) : userId;
  return await users.findOne({ _id: id });
}

export async function updateUser(
  userId: string | ObjectId,
  updateData: Partial<User>
) {
  const users = await getCollection("users");
  const id = typeof userId === "string" ? new ObjectId(userId) : userId;
  const dataWithTimestamp = updateTimestamp(updateData);
  return await users.updateOne({ _id: id }, { $set: dataWithTimestamp });
}

export async function getAllUsers(): Promise<User[]> {
  const users = await getCollection("users");
  return await users.find({}).sort({ createdAt: -1 }).toArray();
}

export async function createOrder(orderData: CreateCakeOrder) {
  const orders = await getCollection("orders");
  const orderWithTimestamps = addTimestamps(orderData);
  return await orders.insertOne(orderWithTimestamps);
}

export async function getUserOrders(
  userId: string | ObjectId
): Promise<CakeOrder[]> {
  const orders = await getCollection("orders");
  const id = typeof userId === "string" ? new ObjectId(userId) : userId;
  return await orders.find({ userId: id }).sort({ createdAt: -1 }).toArray();
}

export async function getOrderById(
  orderId: string | ObjectId
): Promise<CakeOrder | null> {
  const orders = await getCollection("orders");
  const id = typeof orderId === "string" ? new ObjectId(orderId) : orderId;
  return await orders.findOne({ _id: id });
}

export async function updateOrderStatus(
  orderId: string | ObjectId,
  status: CakeOrder["status"]
) {
  const orders = await getCollection("orders");
  const id = typeof orderId === "string" ? new ObjectId(orderId) : orderId;
  return await orders.updateOne(
    { _id: id },
    { $set: { status, updatedAt: new Date() } }
  );
}

export async function getAllOrders(): Promise<CakeOrder[]> {
  const orders = await getCollection("orders");
  return await orders.find({}).sort({ createdAt: -1 }).toArray();
}

export async function createReview(reviewData: CreateReview) {
  const reviews = await getCollection("reviews");
  const reviewWithTimestamps = addTimestamps(reviewData);
  return await reviews.insertOne(reviewWithTimestamps);
}

export async function getApprovedReviews(): Promise<Review[]> {
  const reviews = await getCollection("reviews");
  return await reviews
    .find({ isApproved: true })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getAllReviews(): Promise<Review[]> {
  const reviews = await getCollection("reviews");
  return await reviews.find({}).sort({ createdAt: -1 }).toArray();
}

export async function approveReview(reviewId: string | ObjectId) {
  const reviews = await getCollection("reviews");
  const id = typeof reviewId === "string" ? new ObjectId(reviewId) : reviewId;
  return await reviews.updateOne(
    { _id: id },
    { $set: { isApproved: true, updatedAt: new Date() } }
  );
}

export async function createPortfolioItem(itemData: CreatePortfolioItem) {
  const portfolio = await getCollection("portfolio");
  const itemWithTimestamps = addTimestamps(itemData);
  return await portfolio.insertOne(itemWithTimestamps);
}

export async function getVisiblePortfolioItems(): Promise<PortfolioItem[]> {
  const portfolio = await getCollection("portfolio");
  return await portfolio
    .find({ isVisible: true })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getAllPortfolioItems(): Promise<PortfolioItem[]> {
  const portfolio = await getCollection("portfolio");
  return await portfolio.find({}).sort({ createdAt: -1 }).toArray();
}

export async function updatePortfolioItem(
  itemId: string | ObjectId,
  updateData: Partial<PortfolioItem>
) {
  const portfolio = await getCollection("portfolio");
  const id = typeof itemId === "string" ? new ObjectId(itemId) : itemId;
  const dataWithTimestamp = updateTimestamp(updateData);
  return await portfolio.updateOne({ _id: id }, { $set: dataWithTimestamp });
}

export async function deletePortfolioItem(itemId: string | ObjectId) {
  const portfolio = await getCollection("portfolio");
  const id = typeof itemId === "string" ? new ObjectId(itemId) : itemId;
  return await portfolio.deleteOne({ _id: id });
}

export async function createContactMessage(messageData: CreateContactMessage) {
  const messages = await getCollection("messages");
  const messageWithTimestamps = addTimestamps(messageData);
  return await messages.insertOne(messageWithTimestamps);
}

export async function getUnreadMessages(): Promise<ContactMessage[]> {
  const messages = await getCollection("messages");
  return await messages
    .find({ isRead: false })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getAllMessages(): Promise<ContactMessage[]> {
  const messages = await getCollection("messages");
  return await messages.find({}).sort({ createdAt: -1 }).toArray();
}

export async function markMessageAsRead(messageId: string | ObjectId) {
  const messages = await getCollection("messages");
  const id =
    typeof messageId === "string" ? new ObjectId(messageId) : messageId;
  return await messages.updateOne(
    { _id: id },
    { $set: { isRead: true, updatedAt: new Date() } }
  );
}

export async function markMessageAsReplied(messageId: string | ObjectId) {
  const messages = await getCollection("messages");
  const id =
    typeof messageId === "string" ? new ObjectId(messageId) : messageId;
  return await messages.updateOne(
    { _id: id },
    { $set: { replied: true, updatedAt: new Date() } }
  );
}

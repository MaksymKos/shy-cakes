import { useState } from 'react';
import { 
  User, 
  CakeOrder, 
  Review, 
  PortfolioItem, 
  ContactMessage,
  CreateUser,
  CreateCakeOrder,
  CreateReview,
  CreatePortfolioItem,
  CreateContactMessage
} from '../types/database';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: CreateUser) => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error('Failed to create user');
      const newUser = await response.json();
      setUsers(prev => [newUser, ...prev]);
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return { users, loading, error, fetchUsers, createUser };
}

export function useOrders(userId?: string) {
  const [orders, setOrders] = useState<CakeOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = userId ? `/api/orders?userId=${userId}` : '/api/orders';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: CreateCakeOrder) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error('Failed to create order');
      const newOrder = await response.json();
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const updateOrderStatus = async (orderId: string, status: CakeOrder['status']) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Failed to update order');
      const updatedOrder = await response.json();
      setOrders(prev => prev.map(order => 
        order._id?.toString() === orderId ? updatedOrder : order
      ));
      return updatedOrder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return { orders, loading, error, fetchOrders, createOrder, updateOrderStatus };
}

export function useReviews(approvedOnly: boolean = false) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const url = approvedOnly ? '/api/reviews?approved=true' : '/api/reviews';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData: CreateReview) => {
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });
      if (!response.ok) throw new Error('Failed to create review');
      const newReview = await response.json();
      if (!approvedOnly) {
        setReviews(prev => [newReview, ...prev]);
      }
      return newReview;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const approveReview = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/approve`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to approve review');
      const approvedReview = await response.json();
      setReviews(prev => prev.map(review => 
        review._id?.toString() === reviewId ? approvedReview : review
      ));
      return approvedReview;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return { reviews, loading, error, fetchReviews, createReview, approveReview };
}

export function usePortfolio(visibleOnly: boolean = false) {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const url = visibleOnly ? '/api/portfolio?visible=true' : '/api/portfolio';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch portfolio');
      const data = await response.json();
      setPortfolioItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createPortfolioItem = async (itemData: CreatePortfolioItem) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData),
      });
      if (!response.ok) throw new Error('Failed to create portfolio item');
      const newItem = await response.json();
      if (!visibleOnly || newItem.isVisible) {
        setPortfolioItems(prev => [newItem, ...prev]);
      }
      return newItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const updatePortfolioItem = async (itemId: string, updateData: Partial<PortfolioItem>) => {
    try {
      const response = await fetch(`/api/portfolio/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error('Failed to update portfolio item');
      const updatedItem = await response.json();
      setPortfolioItems(prev => prev.map(item => 
        item._id?.toString() === itemId ? updatedItem : item
      ));
      return updatedItem;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const deletePortfolioItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/portfolio/${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete portfolio item');
      setPortfolioItems(prev => prev.filter(item => item._id?.toString() !== itemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return { 
    portfolioItems, 
    loading, 
    error, 
    fetchPortfolio, 
    createPortfolioItem, 
    updatePortfolioItem, 
    deletePortfolioItem 
  };
}

export function useContactMessages(unreadOnly: boolean = false) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const url = unreadOnly ? '/api/messages?unread=true' : '/api/messages';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch messages');
      const data = await response.json();
      setMessages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const createMessage = async (messageData: CreateContactMessage) => {
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
      if (!response.ok) throw new Error('Failed to create message');
      const newMessage = await response.json();
      if (!unreadOnly || !newMessage.isRead) {
        setMessages(prev => [newMessage, ...prev]);
      }
      return newMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/read`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to mark message as read');
      const updatedMessage = await response.json();
      setMessages(prev => prev.map(message => 
        message._id?.toString() === messageId ? updatedMessage : message
      ));
      return updatedMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  const markAsReplied = async (messageId: string) => {
    try {
      const response = await fetch(`/api/messages/${messageId}/reply`, {
        method: 'PATCH',
      });
      if (!response.ok) throw new Error('Failed to mark message as replied');
      const updatedMessage = await response.json();
      setMessages(prev => prev.map(message => 
        message._id?.toString() === messageId ? updatedMessage : message
      ));
      return updatedMessage;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      throw err;
    }
  };

  return { messages, loading, error, fetchMessages, createMessage, markAsRead, markAsReplied };
}

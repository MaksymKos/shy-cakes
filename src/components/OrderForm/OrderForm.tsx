import React, { useState, useEffect } from 'react';
import { useOrders } from '../../hooks/useDatabase';
import { CakeOrder, CreateCakeOrder } from '../../types/database';
import { ObjectId } from 'mongodb';

interface OrderFormProps {
  userId: string;
  onOrderCreated?: (order: CakeOrder) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ userId, onOrderCreated }) => {
  const { orders, loading, error, fetchOrders, createOrder } = useOrders(userId);
  const [formData, setFormData] = useState<CreateCakeOrder>({
    userId: new ObjectId(userId),
    cakeType: '',
    size: 'medium',
    flavor: '',
    description: '',
    price: 0,
    status: 'pending',
    deliveryDate: new Date(),
    deliveryAddress: '',
    customerInfo: {
      name: '',
      phone: '',
      email: ''
    }
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newOrder = await createOrder(formData);
      onOrderCreated?.(newOrder);
      setFormData({
        userId: new ObjectId(userId),
        cakeType: '',
        size: 'medium',
        flavor: '',
        description: '',
        price: 0,
        status: 'pending',
        deliveryDate: new Date(),
        deliveryAddress: '',
        customerInfo: {
          name: '',
          phone: '',
          email: ''
        }
      });
    } catch (err) {
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name.startsWith('customerInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          [field]: value
        }
      }));
    } else if (name === 'price') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else if (name === 'deliveryDate') {
      setFormData(prev => ({ ...prev, [name]: new Date(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Замовити торт</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Тип торта
            </label>
            <input
              type="text"
              name="cakeType"
              value={formData.cakeType}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Наприклад: Весільний торт"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Розмір
            </label>
            <select
              name="size"
              value={formData.size}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="small">Малий</option>
              <option value="medium">Середній</option>
              <option value="large">Великий</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Смак
            </label>
            <input
              type="text"
              name="flavor"
              value={formData.flavor}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Наприклад: Шоколадний"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ціна (грн)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Дата доставки
            </label>
            <input
              type="datetime-local"
              name="deliveryDate"
              value={formData.deliveryDate.toISOString().slice(0, 16)}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Адреса доставки
            </label>
            <input
              type="text"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Повна адреса доставки"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Опис (необов'язково)
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Додаткові побажання щодо торта"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ім'я замовника
            </label>
            <input
              type="text"
              name="customerInfo.name"
              value={formData.customerInfo.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Телефон
            </label>
            <input
              type="tel"
              name="customerInfo.phone"
              value={formData.customerInfo.phone}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="customerInfo.email"
              value={formData.customerInfo.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Створення замовлення...' : 'Створити замовлення'}
        </button>
      </form>

      {/* Список існуючих замовлень */}
      {orders.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Ваші замовлення</h3>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id?.toString()} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">{order.cakeType}</h4>
                    <p className="text-sm text-gray-600">
                      {order.size} • {order.flavor} • {order.price} грн
                    </p>
                    <p className="text-sm text-gray-600">
                      Доставка: {order.deliveryDate.toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;

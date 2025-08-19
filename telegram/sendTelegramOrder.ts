import axios from "axios";

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface Order {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  deliveryDate: string;
  weight: number;
  specialRequests: string;
  paymentMethod: string;
}

export async function sendOrderToTelegram(order: Order) {
    const text = `
      Нове замовлення!
      Ім'я: ${order.customerName}
      Телефон: ${order.customerPhone}
      Email: ${order.customerEmail || "-"}
      Адреса: ${order.deliveryAddress}
      Дата: ${order.deliveryDate}
      Вага/Кількість: ${order.weight}
      Побажання: ${order.specialRequests || "немає"}
      Спосіб оплати: ${order.paymentMethod}
  `;
  await axios.post(
    `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
    {
      chat_id: CHAT_ID,
      text,
      parse_mode: "HTML",
    }
  );
}

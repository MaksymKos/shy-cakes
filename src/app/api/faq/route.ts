import { NextRequest, NextResponse } from "next/server";
import { ObjectId, Db } from "mongodb";
import { getDatabase } from "@/api/db/operations";

export interface FAQItem {
  _id?: ObjectId | string;
  id: number;
  question: string;
  answer: string;
  order?: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Default FAQ data
const defaultFAQs: Omit<FAQItem, "_id" | "createdAt" | "updatedAt">[] = [
  {
    id: 1,
    question: "Питання 1?",
    answer: "Відповідь на перше питання. Тут буде детальна інформація.",
    order: 1,
    isActive: true,
  },
  {
    id: 2,
    question: "Декор",
    answer:
      "Ваш торт може бути будь-якого кольору, з бажаним надписом, прикрашений шоколадними або живими квітами, шоколадними фігурками, кульками, цукровими картинками, ручним розписом, макаронами, мусовими серцями, сезонними ягодами тощо. Фінальна вартість десерта з декором розраховується окремо, залежно від оформлення і розміру торта.",
    order: 2,
    isActive: true,
  },
  {
    id: 3,
    question: "За скільки часу робити замовлення?",
    answer:
      "Ми завжди маємо вільні торти «на сьогодні» вагою 1 кг, замовити можна навіть в останній момент і не турбуватись про свято! В такому випадку ми запропонуємо вам наявні смаки з меню. Замовлення будь-якого смаку з меню приймаємо за 7 днів до потрібної дати. Якщо ви бажаєте прикрасити свій торт декором, що виготовляється спеціально для вас, наприклад іменні топпери, картинки з фото – тоді замовлення варто робити раніше.",
    order: 3,
    isActive: true,
  },
  {
    id: 4,
    question: "Як забрати замовлення?",
    answer:
      "Забрати десерти можна щодня з 11:00 до 20:00 години, або ж скористатись доставкою: діє на замовлення від 450 грн в межах 3 км, від 600 грн в межах 3-10 км і від 1000 грн понад 10 км та найближче передмістя Вінниці. Працює щодня з 12:30 до 21:00 години, коштує 90 грн.",
    order: 4,
    isActive: true,
  },
];

export async function GET() {
  try {
    const db = await getDatabase();

    // Check if FAQ collection exists and has data
    const faqCount = await db.collection("faq").countDocuments();

    // If no FAQ items exist, initialize with default data
    if (faqCount === 0) {
      await initializeDefaultFAQ(db);
    }

    const faqs = await db
      .collection("faq")
      .find({ isActive: { $ne: false } })
      .sort({ order: 1, id: 1 })
      .toArray();

    // Convert _id to string for frontend
    const serializedFaqs = faqs.map((faq) => ({
      ...faq,
      _id: faq._id.toString(),
    }));

    return NextResponse.json(serializedFaqs);
  } catch (error) {
    console.error("Get FAQ error:", error);
    return NextResponse.json(
      { error: "Помилка отримання FAQ" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const faqData: Omit<FAQItem, "_id"> = {
      id: body.id,
      question: body.question?.trim() || "",
      answer: body.answer?.trim() || "",
      order: body.order || body.id,
      isActive: body.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    if (!faqData.question || !faqData.answer) {
      return NextResponse.json(
        { error: "Питання та відповідь обов'язкові" },
        { status: 400 }
      );
    }

    const db = await getDatabase();

    // Check if FAQ with this ID already exists
    const existingFaq = await db.collection("faq").findOne({ id: faqData.id });
    if (existingFaq) {
      return NextResponse.json(
        { error: "FAQ з таким ID вже існує" },
        { status: 400 }
      );
    }

    const result = await db.collection("faq").insertOne(faqData);

    return NextResponse.json({
      success: true,
      faqId: result.insertedId,
    });
  } catch (error) {
    console.error("Create FAQ error:", error);
    return NextResponse.json(
      { error: "Помилка створення FAQ" },
      { status: 500 }
    );
  }
}

// Helper function to initialize default FAQ
async function initializeDefaultFAQ(db: Db) {
  try {
    const faqsToInsert = defaultFAQs.map((faq) => ({
      ...faq,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    await db.collection("faq").insertMany(faqsToInsert);
    console.log("Default FAQ items initialized");
  } catch (error) {
    console.error("Error initializing default FAQ:", error);
  }
}

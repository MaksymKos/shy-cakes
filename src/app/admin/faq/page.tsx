'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FAQItem } from '@/app/api/faq/route';

export default function FAQAdminPage() {
    const router = useRouter();
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
    const [newFaq, setNewFaq] = useState<Partial<FAQItem>>({
        question: '',
        answer: '',
        order: 1,
        isActive: true
    });
    const [showNewForm, setShowNewForm] = useState(false);

    useEffect(() => {
        fetchFaqs();
    }, []);

    const fetchFaqs = async () => {
        try {
            const response = await fetch('/api/faq');
            if (response.ok) {
                const data = await response.json();
                setFaqs(data);
            }
        } catch (error) {
            console.error('Error fetching FAQs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getNextId = () => {
        if (faqs.length === 0) return 1;
        const maxId = Math.max(...faqs.map(faq => faq.id));
        return maxId + 1;
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const faqData = {
                ...newFaq,
                id: getNextId(),
            };

            const response = await fetch('/api/faq', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(faqData),
            });

            if (response.ok) {
                setNewFaq({
                    question: '',
                    answer: '',
                    order: 1,
                    isActive: true
                });
                setShowNewForm(false);
                fetchFaqs();
            }
        } catch (error) {
            console.error('Error creating FAQ:', error);
        }
    };

    const handleUpdate = async (id: string, updateData: Partial<FAQItem>) => {
        try {
            const response = await fetch(`/api/faq/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                setEditingFaq(null);
                fetchFaqs();
            }
        } catch (error) {
            console.error('Error updating FAQ:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Видалити це питання?')) {
            try {
                const response = await fetch(`/api/faq/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    fetchFaqs();
                }
            } catch (error) {
                console.error('Error deleting FAQ:', error);
            }
        }
    };

    if (loading) {
        return <div className="p-6">Завантаження...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0 bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => router.push('/admin')}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span className="text-sm sm:text-base">Назад до панелі</span>
                        </button>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <div>
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">❓ Управління FAQ</h1>
                            <p className="mt-2 text-gray-600 text-sm sm:text-base">
                                Редагування питань та відповідей для сайту
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                    <div className="mb-6">
                        <button
                            onClick={() => setShowNewForm(!showNewForm)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            {showNewForm ? 'Скасувати' : '+ Додати нове питання'}
                        </button>
                    </div>

                {}
                {showNewForm && (
                    <form onSubmit={handleCreate} className="bg-gray-50 p-4 rounded-md mb-6">
                        <h3 className="text-lg font-medium mb-3">Нове питання</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Питання:</label>
                                <input
                                    type="text"
                                    value={newFaq.question || ''}
                                    onChange={(e) => setNewFaq({...newFaq, question: e.target.value})}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Відповідь:</label>
                                <textarea
                                    value={newFaq.answer || ''}
                                    onChange={(e) => setNewFaq({...newFaq, answer: e.target.value})}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    rows={4}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Порядок:</label>
                                    <input
                                        type="number"
                                        value={newFaq.order || 1}
                                        onChange={(e) => setNewFaq({...newFaq, order: parseInt(e.target.value)})}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                        min="1"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Активне:</label>
                                    <select
                                        value={newFaq.isActive ? 'true' : 'false'}
                                        onChange={(e) => setNewFaq({...newFaq, isActive: e.target.value === 'true'})}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                                    >
                                        <option value="true">Так</option>
                                        <option value="false">Ні</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                type="submit"
                                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                            >
                                Створити
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {}
            <div className="space-y-6 mt-6">
              {faqs.map((faq) => (
                <div
                  key={faq._id?.toString()}
                  className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm"
                >
                  {editingFaq?._id === faq._id ? (
                    <EditFAQForm
                      faq={faq}
                      onSave={(updateData) => handleUpdate(faq._id as string, updateData)}
                      onCancel={() => setEditingFaq(null)}
                    />
                  ) : (
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{faq.question}</h3>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                            <span>ID: {faq.id}</span>
                            <span>Порядок: {faq.order}</span>
                            <span className={faq.isActive ? "text-green-600" : "text-red-500"}>
                              {faq.isActive ? 'Активне' : 'Неактивне'}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingFaq(faq)}
                            className="px-3 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          >
                            Редагувати
                          </button>
                          <button
                            onClick={() => handleDelete(faq._id as string)}
                            className="px-3 py-1 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition"
                          >
                            Видалити
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-gray-800">
                        <p className="whitespace-pre-line">{faq.answer}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {faqs.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    FAQ питання не знайдено
                </div>
            )}
            </div>
        </div>
    );
}

interface EditFAQFormProps {
    faq: FAQItem;
    onSave: (updateData: Partial<FAQItem>) => void;
    onCancel: () => void;
}

function EditFAQForm({ faq, onSave, onCancel }: EditFAQFormProps) {
    const [formData, setFormData] = useState<Partial<FAQItem>>({
        question: faq.question,
        answer: faq.answer,
        order: faq.order,
        isActive: faq.isActive,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-1">Питання:</label>
                <input
                    type="text"
                    value={formData.question || ''}
                    onChange={(e) => setFormData({...formData, question: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Відповідь:</label>
                <textarea
                    value={formData.answer || ''}
                    onChange={(e) => setFormData({...formData, answer: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={6}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Порядок:</label>
                    <input
                        type="number"
                        value={formData.order || 1}
                        onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        min="1"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Активне:</label>
                    <select
                        value={formData.isActive ? 'true' : 'false'}
                        onChange={(e) => setFormData({...formData, isActive: e.target.value === 'true'})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                        <option value="true">Так</option>
                        <option value="false">Ні</option>
                    </select>
                </div>
            </div>
            <div className="flex space-x-2">
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                    Зберегти
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                    Скасувати
                </button>
            </div>
        </form>
    );
}

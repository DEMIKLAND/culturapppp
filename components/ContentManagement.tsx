
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Content, ContentType, Role } from '../types';
import { generateAIDescription } from '../services/geminiService';

const ContentManagement: React.FC = () => {
    const { content, addContent, updateContent, deleteContent } = useData();
    const { t } = useLanguage();
    const { currentUser } = useAuth();

    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingContent, setEditingContent] = useState<Content | null>(null);
    const [formData, setFormData] = useState({ title: '', description: '', imageUrl: '', url: '', type: ContentType.NEWS });
    const [isGenerating, setIsGenerating] = useState(false);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerateDesc = async () => {
        if (!formData.title || !formData.type) {
            alert('Please provide a title and type first.');
            return;
        }
        setIsGenerating(true);
        const description = await generateAIDescription(formData.title, formData.type);
        setFormData({ ...formData, description });
        setIsGenerating(false);
    };
    
    const resetForm = () => {
        setFormData({ title: '', description: '', imageUrl: '', url: '', type: ContentType.NEWS });
        setEditingContent(null);
        setIsFormVisible(false);
    };

    const handleEdit = (c: Content) => {
        setEditingContent(c);
        setFormData({ title: c.title, description: c.description, imageUrl: c.imageUrl, url: c.url, type: c.type });
        setIsFormVisible(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        if (editingContent) {
            updateContent({ ...editingContent, ...formData });
        } else {
            addContent(formData, currentUser.id);
        }
        resetForm();
    };
    
    const canManageContent = currentUser?.role === Role.ADMIN || currentUser?.role === Role.EDITOR;

    if (!canManageContent) return <p>You do not have permission to manage content.</p>;

    return (
        <div className="bg-secondary p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{t('contentManagement')}</h2>
                <button onClick={() => { resetForm(); setIsFormVisible(!isFormVisible); }} className="bg-accent text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90">{isFormVisible ? t('cancel') : t('publish')}</button>
            </div>

            {isFormVisible && (
                <form onSubmit={handleSubmit} className="space-y-4 mb-8 p-4 bg-primary rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="title" value={formData.title} onChange={handleFormChange} placeholder={t('title')} required className="px-3 py-2 bg-secondary border border-gray-600 rounded-md"/>
                        <select name="type" value={formData.type} onChange={handleFormChange} className="px-3 py-2 bg-secondary border border-gray-600 rounded-md">
                            <option value={ContentType.NEWS}>{t('news')}</option>
                            <option value={ContentType.VIDEO}>{t('videos')}</option>
                            <option value={ContentType.MUSIC}>{t('music')}</option>
                        </select>
                    </div>
                    <div>
                        <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder={t('description')} required rows={3} className="w-full px-3 py-2 bg-secondary border border-gray-600 rounded-md"/>
                        <button type="button" onClick={handleGenerateDesc} disabled={isGenerating} className="mt-2 text-sm text-accent hover:underline disabled:opacity-50 disabled:cursor-not-allowed">
                            {isGenerating ? 'Generating...' : t('generateWithAI')}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="imageUrl" value={formData.imageUrl} onChange={handleFormChange} placeholder={t('imageURL')} required className="px-3 py-2 bg-secondary border border-gray-600 rounded-md"/>
                        <input name="url" value={formData.url} onChange={handleFormChange} placeholder={t('contentURL')} required className="px-3 py-2 bg-secondary border border-gray-600 rounded-md"/>
                    </div>
                    <button type="submit" className="w-full py-2 font-semibold text-white bg-accent rounded-md hover:bg-opacity-90">{editingContent ? t('save') : t('publish')}</button>
                </form>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    {/* Table headers */}
                    <thead className="bg-primary">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">{t('title')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">{t('type')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-secondary divide-y divide-gray-700">
                        {content.map(c => (
                            <tr key={c.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{c.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{c.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button onClick={() => handleEdit(c)} className="text-indigo-400 hover:text-indigo-300">{t('edit')}</button>
                                    <button onClick={() => window.confirm(t('confirmDelete')) && deleteContent(c.id)} className="text-red-500 hover:text-red-400">{t('delete')}</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ContentManagement;

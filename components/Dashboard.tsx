
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { ContentType } from '../types';
import ContentCard from './ContentCard';
import PlaylistManager from './PlaylistManager';

const Dashboard: React.FC = () => {
    const { content } = useData();
    const { t } = useLanguage();
    const [filter, setFilter] = useState<ContentType | 'ALL'>('ALL');

    const filteredContent = filter === 'ALL' ? content : content.filter(c => c.type === filter);

    const FilterButton: React.FC<{ type: ContentType | 'ALL'; label: string }> = ({ type, label }) => (
        <button
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === type ? 'bg-accent text-white' : 'bg-primary hover:bg-gray-800'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <h1 className="text-3xl font-bold mb-6 text-text-primary">{t('newsFeed')}</h1>
                <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
                    <FilterButton type="ALL" label={t('all')} />
                    <FilterButton type={ContentType.NEWS} label={t('news')} />
                    <FilterButton type={ContentType.VIDEO} label={t('videos')} />
                    <FilterButton type={ContentType.MUSIC} label={t('music')} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredContent.map(item => (
                        <ContentCard key={item.id} content={item} />
                    ))}
                </div>
            </div>
            <div className="lg:col-span-1">
                 <PlaylistManager />
            </div>
        </div>
    );
};

export default Dashboard;

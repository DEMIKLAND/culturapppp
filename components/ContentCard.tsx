
import React, { useState } from 'react';
import { Content, ContentType, Playlist } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

interface ContentCardProps {
    content: Content;
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
    const { t } = useLanguage();
    const { playlists, addContentToPlaylist } = useData();
    const { currentUser } = useAuth();
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);

    const userPlaylists = playlists.filter(p => p.userId === currentUser?.id);

    const handleAddToPlaylist = (playlistId: string) => {
        addContentToPlaylist(playlistId, content);
        setShowPlaylistModal(false);
    };

    const getContentTypeLabel = (type: ContentType) => {
        switch(type) {
            case ContentType.NEWS: return t('news');
            case ContentType.VIDEO: return t('videos');
            case ContentType.MUSIC: return t('music');
            default: return '';
        }
    };

    const isMedia = content.type === ContentType.MUSIC || content.type === ContentType.VIDEO;

    return (
        <div className="bg-secondary rounded-lg overflow-hidden shadow-lg transform hover:-translate-y-1 transition-transform duration-300">
            <img src={content.imageUrl} alt={content.title} className="w-full h-48 object-cover"/>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm text-accent font-semibold">{getContentTypeLabel(content.type)}</p>
                        <h3 className="text-xl font-bold text-text-primary mt-1">{content.title}</h3>
                    </div>
                    {isMedia && (
                         <button onClick={() => setShowPlaylistModal(true)} title={t('addToPlaylist')} className="text-text-secondary hover:text-accent transition-colors p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </button>
                    )}
                </div>
                <p className="text-text-secondary mt-2 text-sm">{content.description}</p>
            </div>
            {showPlaylistModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setShowPlaylistModal(false)}>
                    <div className="bg-secondary p-6 rounded-lg shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                        <h4 className="text-lg font-bold mb-4">{t('addToPlaylist')}</h4>
                        {userPlaylists.length > 0 ? (
                            <ul className="space-y-2">
                                {userPlaylists.map(playlist => (
                                    <li key={playlist.id}>
                                        <button onClick={() => handleAddToPlaylist(playlist.id)} className="w-full text-left p-2 rounded hover:bg-primary transition-colors">
                                            {playlist.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-text-secondary">{t('createPlaylist')} first.</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ContentCard;

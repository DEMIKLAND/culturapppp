
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';

const PlaylistManager: React.FC = () => {
    const { currentUser } = useAuth();
    const { playlists, addPlaylist, deletePlaylist, removeContentFromPlaylist } = useData();
    const { t } = useLanguage();
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(null);

    const userPlaylists = playlists.filter(p => p.userId === currentUser?.id);

    const handleCreatePlaylist = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPlaylistName.trim() && currentUser) {
            addPlaylist(newPlaylistName.trim(), currentUser.id);
            setNewPlaylistName('');
        }
    };

    return (
        <div className="bg-secondary p-6 rounded-lg shadow-lg sticky top-8">
            <h2 className="text-2xl font-bold mb-4">{t('myPlaylists')}</h2>
            <p className="text-xs text-text-secondary mb-4">{t('offlineNote')}</p>
            
            <form onSubmit={handleCreatePlaylist} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={newPlaylistName}
                    onChange={(e) => setNewPlaylistName(e.target.value)}
                    placeholder={t('playlistName')}
                    className="flex-grow px-3 py-2 bg-primary border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
                <button type="submit" className="bg-accent text-white px-4 py-2 rounded-md font-semibold hover:bg-opacity-90 text-sm">+</button>
            </form>

            <div className="space-y-4 max-h-96 overflow-y-auto">
                {userPlaylists.map(playlist => (
                    <div key={playlist.id} className="bg-primary p-3 rounded-md">
                        <div className="flex justify-between items-center cursor-pointer" onClick={() => setExpandedPlaylist(expandedPlaylist === playlist.id ? null : playlist.id)}>
                            <h3 className="font-semibold">{playlist.name}</h3>
                             <div className="flex items-center">
                                <span className="text-xs text-text-secondary mr-2">{playlist.items.length} items</span>
                                <button onClick={(e) => { e.stopPropagation(); deletePlaylist(playlist.id); }} className="text-red-500 hover:text-red-400 p-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </div>
                        {expandedPlaylist === playlist.id && (
                            <ul className="mt-3 space-y-2 border-t border-gray-700 pt-3">
                                {playlist.items.map(item => (
                                    <li key={item.contentId} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <img src={item.imageUrl} alt={item.title} className="w-8 h-8 rounded object-cover" />
                                            <span className="text-text-secondary">{item.title}</span>
                                        </div>
                                        <button onClick={() => removeContentFromPlaylist(playlist.id, item.contentId)} className="text-red-500 hover:text-red-400 p-1">
                                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </li>
                                ))}
                                {playlist.items.length === 0 && <p className="text-xs text-text-secondary text-center">{t('addToPlaylist')}</p>}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlaylistManager;

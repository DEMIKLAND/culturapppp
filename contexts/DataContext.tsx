
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Role, Content, ContentType, Playlist, PlaylistItem } from '../types';
import { getInitialData } from '../services/localStorageService';

interface DataContextType {
    users: User[];
    content: Content[];
    playlists: Playlist[];
    addUser: (nickname: string, email: string, pass: string) => User;
    updateUser: (updatedUser: User) => void;
    deleteUser: (userId: string) => void;
    addContent: (content: Omit<Content, 'id' | 'createdAt' | 'authorId'>, authorId: string) => void;
    updateContent: (updatedContent: Content) => void;
    deleteContent: (contentId: string) => void;
    addPlaylist: (name: string, userId: string) => void;
    deletePlaylist: (playlistId: string) => void;
    addContentToPlaylist: (playlistId: string, contentItem: Content) => void;
    removeContentFromPlaylist: (playlistId: string, contentId: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [users, setUsers] = useState<User[]>([]);
    const [content, setContent] = useState<Content[]>([]);
    const [playlists, setPlaylists] = useState<Playlist[]>([]);

    useEffect(() => {
        const { users, content, playlists } = getInitialData();
        setUsers(users);
        setContent(content);
        setPlaylists(playlists);
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            localStorage.setItem('cultur_users', JSON.stringify(users));
        }
    }, [users]);
    
    useEffect(() => {
        if (content.length > 0) {
            localStorage.setItem('cultur_content', JSON.stringify(content));
        }
    }, [content]);

    useEffect(() => {
        if (playlists.length > 0) {
           localStorage.setItem('cultur_playlists', JSON.stringify(playlists));
        }
    }, [playlists]);

    const addUser = (nickname: string, email: string, pass: string): User => {
        const newUser: User = {
            id: `user_${Date.now()}`,
            nickname,
            email,
            passwordHash: pass, // Not hashed for this demo
            role: Role.USER,
        };
        setUsers(prev => [...prev, newUser]);
        return newUser;
    };
    
    const updateUser = (updatedUser: User) => {
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    };

    const deleteUser = (userId: string) => {
        setUsers(prev => prev.filter(u => u.id !== userId));
    };

    const addContent = (newContent: Omit<Content, 'id' | 'createdAt' | 'authorId'>, authorId: string) => {
        const fullContent: Content = {
            ...newContent,
            id: `content_${Date.now()}`,
            authorId,
            createdAt: new Date().toISOString(),
        };
        setContent(prev => [fullContent, ...prev]);
    };
    
    const updateContent = (updatedContent: Content) => {
        setContent(prev => prev.map(c => c.id === updatedContent.id ? updatedContent : c));
    };

    const deleteContent = (contentId: string) => {
        setContent(prev => prev.filter(c => c.id !== contentId));
    };

    const addPlaylist = (name: string, userId: string) => {
        const newPlaylist: Playlist = {
            id: `playlist_${Date.now()}`,
            name,
            userId,
            items: [],
        };
        setPlaylists(prev => [...prev, newPlaylist]);
    };

    const deletePlaylist = (playlistId: string) => {
        setPlaylists(prev => prev.filter(p => p.id !== playlistId));
    };

    const addContentToPlaylist = (playlistId: string, contentItem: Content) => {
        setPlaylists(prev => prev.map(p => {
            if (p.id === playlistId && !p.items.some(item => item.contentId === contentItem.id)) {
                const newPlaylistItem: PlaylistItem = {
                    contentId: contentItem.id,
                    title: contentItem.title,
                    imageUrl: contentItem.imageUrl,
                    url: contentItem.url,
                };
                return { ...p, items: [...p.items, newPlaylistItem] };
            }
            return p;
        }));
    };
    
    const removeContentFromPlaylist = (playlistId: string, contentId: string) => {
        setPlaylists(prev => prev.map(p => {
            if (p.id === playlistId) {
                return { ...p, items: p.items.filter(item => item.contentId !== contentId) };
            }
            return p;
        }));
    };

    return (
        <DataContext.Provider value={{ 
            users, content, playlists, 
            addUser, updateUser, deleteUser,
            addContent, updateContent, deleteContent,
            addPlaylist, deletePlaylist, addContentToPlaylist, removeContentFromPlaylist
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

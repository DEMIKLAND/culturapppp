
import { User, Content, Playlist, Role, ContentType } from '../types';

export const getInitialData = () => {
    let users = JSON.parse(localStorage.getItem('cultur_users') || '[]') as User[];
    let content = JSON.parse(localStorage.getItem('cultur_content') || '[]') as Content[];
    let playlists = JSON.parse(localStorage.getItem('cultur_playlists') || '[]') as Playlist[];

    // Add admin user if not present
    if (!users.some(u => u.role === Role.ADMIN)) {
        const adminUser: User = {
            id: 'admin_001',
            nickname: 'Admin',
            email: 'Admin',
            passwordHash: 'ep1so1n1',
            role: Role.ADMIN
        };
        users.push(adminUser);
        localStorage.setItem('cultur_users', JSON.stringify(users));
    }
    
    // Add sample content if none exists
    if (content.length === 0) {
        const adminId = users.find(u => u.role === Role.ADMIN)?.id || 'admin_001';
        content = [
            {
                id: 'news_001',
                type: ContentType.NEWS,
                title: 'Cultur Platform Launch',
                description: 'The new multimedia platform Cultur has officially launched, bringing together music, videos, and news in one place.',
                url: '#',
                imageUrl: 'https://picsum.photos/seed/news1/600/400',
                authorId: adminId,
                createdAt: new Date().toISOString()
            },
            {
                id: 'video_001',
                type: ContentType.VIDEO,
                title: 'Live Concert: The Rockers',
                description: 'An exclusive recording of The Rockers\' latest live performance. Experience the energy!',
                url: '#',
                imageUrl: 'https://picsum.photos/seed/video1/600/400',
                authorId: adminId,
                createdAt: new Date().toISOString()
            },
            {
                id: 'music_001',
                type: ContentType.MUSIC,
                title: 'Chill Beats Mix',
                description: 'A 2-hour mix of instrumental chillhop beats perfect for studying or relaxing.',
                url: '#',
                imageUrl: 'https://picsum.photos/seed/music1/600/400',
                authorId: adminId,
                createdAt: new Date().toISOString()
            },
             {
                id: 'music_002',
                type: ContentType.MUSIC,
                title: 'Synthwave Dreams',
                description: 'Journey through a retro-futuristic soundscape with this synthwave compilation.',
                url: '#',
                imageUrl: 'https://picsum.photos/seed/music2/600/400',
                authorId: adminId,
                createdAt: new Date().toISOString()
            },
        ];
        localStorage.setItem('cultur_content', JSON.stringify(content));
    }

    return { users, content, playlists };
};

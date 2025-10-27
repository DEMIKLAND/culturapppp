
export enum Role {
    USER = 'USER',
    EDITOR = 'EDITOR',
    ADMIN = 'ADMIN',
}

export interface User {
    id: string;
    nickname: string;
    email: string;
    passwordHash: string; // In a real app, never store plain text passwords
    role: Role;
}

export enum ContentType {
    NEWS = 'NEWS',
    VIDEO = 'VIDEO',
    MUSIC = 'MUSIC',
}

export interface Content {
    id: string;
    type: ContentType;
    title: string;
    description: string;
    url: string; // URL to video, music file, or news article
    imageUrl: string;
    authorId: string;
    createdAt: string;
}

export interface PlaylistItem {
    contentId: string;
    title: string;
    imageUrl: string;
    url: string;
}

export interface Playlist {
    id: string;
    name: string;
    userId: string;
    items: PlaylistItem[];
}

export type Language = 'en' | 'ru';

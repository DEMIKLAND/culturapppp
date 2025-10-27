
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Role } from '../types';

const Header: React.FC = () => {
    const { currentUser, logout } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    return (
        <header className="bg-secondary p-4 shadow-lg flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-accent">Cultur</Link>
            <div className="flex items-center space-x-4">
                {currentUser && <span className="text-text-secondary">Welcome, {currentUser.nickname}</span>}
                {currentUser?.role === Role.ADMIN && (
                     <Link to="/admin" className="text-text-primary hover:text-accent transition-colors">{t('adminPanel')}</Link>
                )}
                <button
                    onClick={handleLogout}
                    className="bg-accent px-4 py-2 text-white font-semibold rounded-md hover:bg-opacity-80 transition"
                >
                    {t('logout')}
                </button>
            </div>
        </header>
    );
};

export default Header;

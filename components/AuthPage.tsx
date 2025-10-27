
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useLanguage } from '../contexts/LanguageContext';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { t } = useLanguage();

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary">
            <div className="w-full max-w-md p-8 space-y-8 bg-secondary rounded-xl shadow-2xl">
                <div className="flex border-b border-gray-600">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`w-1/2 py-4 text-lg font-medium text-center transition-colors duration-300 ${isLogin ? 'text-accent border-b-2 border-accent' : 'text-text-secondary'}`}
                    >
                        {t('login')}
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`w-1/2 py-4 text-lg font-medium text-center transition-colors duration-300 ${!isLogin ? 'text-accent border-b-2 border-accent' : 'text-text-secondary'}`}
                    >
                        {t('register')}
                    </button>
                </div>
                {isLogin ? <LoginForm /> : <RegisterForm />}
            </div>
        </div>
    );
};

export default AuthPage;


import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
    const { setLanguage, t } = useLanguage();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-primary">
            <div className="text-center p-8 bg-secondary rounded-lg shadow-2xl">
                <h1 className="text-4xl font-bold mb-4 text-accent">{t('welcome')}</h1>
                <p className="text-lg text-text-secondary mb-8">{t('chooseLanguage')}</p>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setLanguage('en')}
                        className="px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-opacity-80 transition duration-300"
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLanguage('ru')}
                        className="px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-opacity-80 transition duration-300"
                    >
                        Русский
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LanguageSelector;


import React from 'react';
import { useData } from '../contexts/DataContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Role } from '../types';

const UserManagement: React.FC = () => {
    const { users, updateUser, deleteUser } = useData();
    const { t } = useLanguage();

    const handleRoleChange = (user: User) => {
        const newRole = user.role === Role.EDITOR ? Role.USER : Role.EDITOR;
        updateUser({ ...user, role: newRole });
    };

    return (
        <div className="bg-secondary p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{t('userManagement')}</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-primary">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">{t('nickname')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">{t('email')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">{t('role')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-secondary divide-y divide-gray-700">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">{user.nickname}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    {user.role !== Role.ADMIN && (
                                        <>
                                            <button 
                                                onClick={() => handleRoleChange(user)}
                                                className="text-indigo-400 hover:text-indigo-300 transition"
                                            >
                                                {user.role === Role.EDITOR ? t('demoteToUser') : t('promoteToEditor')}
                                            </button>
                                            <button 
                                                onClick={() => window.confirm(t('confirmDelete')) && deleteUser(user.id)}
                                                className="text-red-500 hover:text-red-400 transition"
                                            >
                                                {t('delete')}
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;

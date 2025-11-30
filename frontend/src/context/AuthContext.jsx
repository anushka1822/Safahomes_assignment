import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({ email: decoded.sub });
            } catch (error) {
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const data = await authService.login(username, password);
        localStorage.setItem('token', data.access_token);
        const decoded = jwtDecode(data.access_token);
        setUser({ email: decoded.sub });
    };

    const signup = async (email, password) => {
        const data = await authService.signup(email, password);
        localStorage.setItem('token', data.access_token);
        const decoded = jwtDecode(data.access_token);
        setUser({ email: decoded.sub });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

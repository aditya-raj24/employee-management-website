import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUsers, createUser } from '../utils/storage';

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
    
    // Initialize default admin if no users exist
    const users = getUsers();
    if (users.length === 0) {
      const defaultAdmin = createUser({
        id: '1',
        email: 'admin@company.com',
        password: 'admin123',
        name: 'System Admin',
        role: 'admin',
        department: 'IT',
        position: 'Administrator',
        createdAt: new Date().toISOString(),
      });
      
      // Create some sample employees
      createUser({
        id: '2',
        email: 'krish@company.com',
        password: 'employee123',
        name: 'Krish Singh',
        role: 'employee',
        department: 'Development',
        position: 'Frontend Developer',
        createdAt: new Date().toISOString(),
      });
      
      createUser({
        id: '3',
        email: 'sara@company.com',
        password: 'employee123',
        name: 'Sara Jey',
        role: 'employee',
        department: 'Design',
        position: 'UI/UX Designer',
        createdAt: new Date().toISOString(),
      });
      createUser({
        id: '4',
        email: 'sarah@company.com',
        password: 'employee123',
        name: 'Sarah Verma',
        role: 'employee',
        department: 'Developmet',
        position: 'AI/ML Engineer',
        createdAt: new Date().toISOString(),
      });
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    currentUser,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
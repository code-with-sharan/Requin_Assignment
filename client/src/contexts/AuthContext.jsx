import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // If there's a saved user in localStorage, parse and return it Otherwise return null for logged out state
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null; 
  });

  // login function will receive token from the server and set the user state and save it to localStorage
  const login = (data) => { 
    const userData = {
      token: data.token, // jwt token
      ...data.user // all user properties
    };
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // logout function will set the user state to null and remove the user from localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 
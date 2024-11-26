import React from 'react';
import { Toaster } from 'react-hot-toast';
import LoginForm from './components/LoginForm';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <LoginForm />
    </AuthProvider>
  );
}

export default App;
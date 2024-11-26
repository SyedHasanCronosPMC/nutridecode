import React from 'react';
import GoogleButton from './auth/GoogleButton';
import EmailForm from './auth/EmailForm';
import Divider from './auth/Divider';
import Header from './auth/Header';

export default function LoginForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <Header />

        <div className="mt-8 space-y-6">
          <GoogleButton />
          <Divider />
          <EmailForm />
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
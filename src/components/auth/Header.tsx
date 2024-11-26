import React from 'react';
import { Chrome } from 'lucide-react';

export default function Header() {
  return (
    <div className="text-center">
      <div className="mx-auto h-12 w-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center">
        <Chrome className="h-8 w-8" />
      </div>
      <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome back</h2>
      <p className="mt-2 text-sm text-gray-600">
        Sign in to your account to continue
      </p>
    </div>
  );
}
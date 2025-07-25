'use client'
import React, { useState } from 'react';
import { AlertTriangle, X, Shield } from 'lucide-react';
import Footer from '@/app/components/Footer';

const DeleteAccountPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle deletion logic here
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <img src="/logo.png" alt="DUVI Logo" className="h-20 w-auto" />
          <button className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-primary transition">
            Iniciar Sesión
          </button>
        </div>
      </nav>

      <div className="pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="w-12 h-12 text-red-600" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Eliminar Cuenta
              </h1>
              <p className="text-black">
                Esta acción es permanente y no se puede deshacer
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <X className="w-5 h-5 text-red-500 mt-0.5" />
                <p className="text-sm text-red-600">
                  Al eliminar tu cuenta, perderás acceso a todos tus datos, historial de viajes y beneficios acumulados.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  Confirmar Eliminación
                </button>
              </div>
            </form>

            <div className="mt-6 flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
              <Shield className="w-5 h-5 text-gray-500" />
              <p className="text-sm text-black">
                Por seguridad, necesitamos verificar tu identidad
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DeleteAccountPage;
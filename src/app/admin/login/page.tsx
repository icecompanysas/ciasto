'use client'

import { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, DollarSign, AlertCircle, Calculator, TrendingUp, PieChart } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API_URL}/auth/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        
        // Guardar token y datos del usuario
        localStorage.setItem('token', data.access_token)
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('userId', data.user.id)
        
        // Redirigir al dashboard
        window.location.href = '/admin/dashboard'
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Credenciales inválidas')
      }
    } catch (error) {
      setError('Error de conexión. Por favor, intenta más tarde.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-40 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-bounce" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-ping" />
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        <DollarSign className="absolute top-20 left-10 w-8 h-8 text-blue-400/30 animate-bounce" />
        <Calculator className="absolute top-40 right-20 w-6 h-6 text-indigo-400/40 animate-pulse" />
        <TrendingUp className="absolute bottom-40 left-20 w-10 h-10 text-blue-300/30 animate-bounce" />
        <PieChart className="absolute bottom-20 right-10 w-7 h-7 text-indigo-300/40 animate-pulse" />
      </div>

      <div className="relative max-w-md w-full space-y-8">
        <div>
          {/* Logo financiero */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <DollarSign className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-center text-3xl font-bold text-white">
            Gestión de Empresa
          </h2>
          <p className="mt-2 text-center text-lg text-blue-400 font-semibold tracking-wider">
            PANEL DE CONTROL 
          </p>
          <p className="mt-4 text-center text-sm text-gray-300">
            Administra tu Empresa
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="Tu contraseña"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  <>
                    <DollarSign className="w-5 h-5 mr-2" />
                    Acceder al Panel
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              ¿Olvidaste tu contraseña? Contacta al administrador
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-white/20">
            <p className="text-center text-sm text-gray-300 mb-4">
              Funcionalidades disponibles:
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs text-gray-400">
              <div className="flex items-center">
                <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
                <span>Estadísticas</span>
              </div>
              <div className="flex items-center">
                <PieChart className="w-4 h-4 mr-2 text-indigo-400" />
                <span>Reportes</span>
              </div>
              <div className="flex items-center">
                <Calculator className="w-4 h-4 mr-2 text-blue-400" />
                <span>Categorización</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-indigo-400" />
                <span>Control Total</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Gestión de Empresas - Control 
          </p>
        </div>
      </div>
    </div>
  )
}
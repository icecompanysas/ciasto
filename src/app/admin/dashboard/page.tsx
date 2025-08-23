// app/admin/dashboard/page.tsx
'use client'
import Link from 'next/link';
import { 
  ChevronRight, TrendingUp, DollarSign, ShoppingCart, Package, Wallet, Store
} from 'lucide-react';

export default function DashboardPage() {
  const modules = [
    {
      name: 'Gestión de Gastos',
      description: 'Control de gastos personales',
      color: 'bg-green-500',
      icon: Wallet,
      href: '/admin/dashboard/gastos',
      available: true
    },
    {
      name: 'Restaurante',
      description: 'Gestión del restaurante',
      color: 'bg-red-500',
      icon: Store,
      href: '/admin/dashboard/restaurante',
      available: false
    }
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          ¡Bienvenido!
        </h1>
        <p className="text-gray-600">
          Selecciona un módulo para comenzar
        </p>
      </div>

      {/* Módulos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {modules.map((module) => {
          const IconComponent = module.icon;
          return (
            <div key={module.name}>
              {module.available ? (
                <Link href={module.href}>
                  <div className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg ${module.color}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {module.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm">
                      {module.description}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border p-6 opacity-60">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${module.color}`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {module.name}
                  </h3>
                  
                  <p className="text-gray-600 text-sm">
                    Próximamente
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Gastos Mes</p>
              <p className="text-2xl font-bold text-gray-900">$0</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Productos</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pedidos</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ventas</p>
              <p className="text-2xl font-bold text-gray-900">$0</p>
            </div>
            <TrendingUp className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

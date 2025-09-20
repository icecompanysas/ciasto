'use client'
import SidebarItem from './SidebarItem'
import { adminSidebarGeneral } from './SidebarRoute.data'
import { useRouter } from 'next/navigation'

export function Sidebar() {
    const router = useRouter()

    const handleLogout = async () => {
        if (confirm('¿Cerrar sesión?')) {
            localStorage.clear()
            router.push('/admin/login')
        }
    }

    return (
        <div className="flex flex-col justify-between h-full">
            <div className="p-4 lg:p-6">
                <div className="mb-6">
                    <h1 className="text-lg lg:text-xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-xs lg:text-sm text-gray-500">Panel de control</p>
                </div>
                
                <p className="text-slate-500 mb-2 text-sm font-medium">General</p>
                <div className="space-y-1">
                    {adminSidebarGeneral.map((item) => (
                        <SidebarItem key={item.label} item={item} />
                    ))}
                </div>
            </div>
            
            <div className="p-4 lg:p-6 border-t border-gray-200">
                <button
                    className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    onClick={handleLogout}
                >
                    Cerrar Sesión
                </button>
                
                <footer className="mt-3 text-center text-xs text-gray-500">
                    © 2024 Todos los derechos reservados
                </footer>
            </div>
        </div>
    )
}
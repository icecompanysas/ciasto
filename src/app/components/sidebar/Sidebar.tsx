'use client'
import SidebarItem from './SidebarItem'
import { adminSidebarGeneral } from './SidebarRoute.data'
import { useRouter } from 'next/navigation'

export function Sidebar() {
    const router = useRouter()

    const handleLogout = async () => {
        if (confirm('¿Cerrar sesión?')) {
            localStorage.clear()
            router.push('/login')
        }
    }

    return (
        <div className="flex flex-col justify-between h-full">
            <div className="p-2 md:p-6">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
                    <p className="text-sm text-gray-500">Panel de control</p>
                </div>
                
                <p className="text-slate-500 mb-2">General</p>
                {adminSidebarGeneral.map((item) => (
                    <SidebarItem key={item.label} item={item} />
                ))}
            </div>
            
            <div className="p-6">
                <button
                    className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                    onClick={handleLogout}
                >
                    Cerrar Sesión
                </button>
                
                <footer className="mt-3 text-center text-xs text-gray-500">
                    2024 todos los derechos reservados
                </footer>
            </div>
        </div>
    )
}
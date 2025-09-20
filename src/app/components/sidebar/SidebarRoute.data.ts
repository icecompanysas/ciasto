// components/sidebar/SidebarRoute.data.ts
import {
    Home,
    Wallet,
    Store,
    Package,
    Settings,
    BarChart4,
    Tag
} from 'lucide-react';

export const adminSidebarGeneral = [
    {
        icon: Home,
        label: "Dashboard",
        href: "/admin/dashboard"
    },
    {
        icon: Wallet,
        label: "Gastos Personales",
        href: "/admin/dashboard/gastos"
    },
    {
        icon: Tag,
        label: "Categorías Restaurante",
        href: "/admin/dashboard/restaurante/categorias"
    },
    {
        icon: Package,
        label: "Productos Restaurante",
        href: "/admin/dashboard/restaurante/productos"
    },
    {
        icon: BarChart4,
        label: "Estadísticas",
        href: "/admin/dashboard/stats"
    },
    {
        icon: Settings,
        label: "Opciones de Producto",
        href: "/admin/dashboard/restaurante/variaciones"
    },
    {
        icon: Settings,
        label: "Configuración",
        href: "/admin/dashboard/settings"
    }
];

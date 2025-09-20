"use client"
import Link from "next/link";
import { SidebarItemProps } from "./SidebarItem.types";
import { usePathname } from "next/navigation";

export default function SidebarItem(props: SidebarItemProps) {
    const {item} = props
    const {href, icon: Icon, label} = item
    const pathname = usePathname()
    const activePath = pathname === href
    
    return (
        <Link 
            href={href}
            className={`flex items-center gap-x-3 p-3 rounded-lg text-sm font-medium transition-colors ${
                activePath 
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
            }`}
        >
            <Icon className="h-5 w-5 flex-shrink-0" strokeWidth={1.5} />
            <span className="truncate">{label}</span>
        </Link>
    )
}
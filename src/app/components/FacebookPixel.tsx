'use client'
// components/FacebookPixel.tsx
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    fbq: any;
  }
}

const FB_PIXEL_ID = '188234118645327'; // Reemplaza con tu ID de Pixel

const FacebookPixel = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Inicializar Facebook Pixel
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', FB_PIXEL_ID);
  }, []);

  useEffect(() => {
    // Trackear pageview en cada cambio de ruta
    fbq('track', 'PageView');
  }, [pathname]);

  return null;
};

export default FacebookPixel;
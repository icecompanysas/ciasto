'use client'
import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  link: string;
  technologies: string[];
  category: 'web' | 'mobile' | 'platform';
  features: string[];
}

interface Service {
  icon: string;
  title: string;
  description: string;
  fullDescription: string;
  technologies: string[];
  benefits: string[];
  processes: string[];
}

interface WhatsAppForm {
  name: string;
  projectType: string;
  projectInfo: string;
}

const HomePage: React.FC = () => {
  const [activeProject, setActiveProject] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showWhatsAppForm, setShowWhatsAppForm] = useState<boolean>(false);
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false); 
  const [whatsappForm, setWhatsappForm] = useState<WhatsAppForm>({
    name: '',
    projectType: '',
    projectInfo: ''
  });



 useEffect(() => {
    setMounted(true);
    setIsVisible(true);
  }, []);

    useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);


  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      if (showMobileMenu) {
        setShowMobileMenu(false);
      }
    };

    if (showMobileMenu) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [showMobileMenu, mounted]);

  
  useEffect(() => {
    if (!mounted) return;

    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMobileMenu, mounted]);

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hola! Soy ${whatsappForm.name}. 

Tipo de proyecto: ${whatsappForm.projectType}

Información del proyecto:
${whatsappForm.projectInfo}

Me gustaría recibir más información y una cotización.`;

    const whatsappUrl = `https://wa.me/573132694664?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowWhatsAppForm(false);
    setWhatsappForm({ name: '', projectType: '', projectInfo: '' });
  };

  const projects: Project[] = [
    {
      id: 1,
      title: "Duvi - Aplicación de Transporte",
      description: "Aplicación móvil completa estilo InDrive para servicios de transporte con geolocalización en tiempo real y sistema de pagos integrado.",
      fullDescription: "Duvi es una aplicación móvil revolucionaria desarrollada con Flutter que conecta conductores y pasajeros de manera eficiente. La app incluye sistema de geolocalización en tiempo real, cálculo dinámico de tarifas, chat en vivo, notificaciones push, sistema de calificaciones, múltiples métodos de pago y panel administrativo completo. Implementamos arquitectura MVVM, integración con Google Maps API, Firebase para backend y autenticación, y Stripe para procesamiento de pagos seguros.",
      image: "/api/placeholder/600/400",
      link: "https://play.google.com/store/apps/details?id=com.duvi.app&pli=1",
      technologies: ["Flutter", "Firebase", "Google Maps API", "Stripe", "Node.js", "MongoDB"],
      category: "mobile",
      features: ["Geolocalización tiempo real", "Sistema de pagos", "Chat en vivo", "Calificaciones", "Panel admin", "Notificaciones push"]
    },
    {
      id: 2,
      title: "Ialtius Pro - Plataforma Empresarial",
      description: "Plataforma empresarial completa con gestión avanzada de recursos, analytics en tiempo real y automatización de procesos comerciales.",
      fullDescription: "Ialtius Pro es una solución empresarial integral desarrollada con Next.js y TypeScript que automatiza procesos comerciales complejos. La plataforma incluye dashboard analítico avanzado, gestión de inventarios, CRM integrado, facturación electrónica, reportes personalizables, integraciones API, gestión de usuarios con roles y permisos, y módulos de contabilidad. Implementamos arquitectura de microservicios, base de datos PostgreSQL optimizada, Redis para cache, y deployment en AWS con alta disponibilidad.",
      image: "/api/placeholder/600/400",
      link: "https://www.ialtiuspro.com/",
      technologies: ["Next.js", "TypeScript", "PostgreSQL", "AWS", "Redis", "Docker"],
      category: "web",
      features: ["Dashboard analítico", "CRM integrado", "Facturación electrónica", "Gestión inventarios", "Reportes personalizables", "API integrations"]
    },
    {
      id: 3,
      title: "Uber Yaaa - Marketplace Digital",
      description: "Sistema de gestión y marketplace avanzado con funcionalidades completas de e-commerce, gestión de vendedores y analytics.",
      fullDescription: "Uber Yaaa es un marketplace digital completo desarrollado con React y Node.js que facilita la conexión entre vendedores y compradores. La plataforma incluye catálogo de productos dinámico, carrito de compras avanzado, sistema de pagos múltiples, gestión de vendedores, panel de analytics, sistema de reviews y ratings, chat integrado, y módulo de logística. Implementamos arquitectura escalable con MongoDB, integración con pasarelas de pago, sistema de notificaciones en tiempo real y optimización SEO avanzada.",
      image: "/api/placeholder/600/400",
      link: "https://www.uberyaaa.com/",
      technologies: ["React", "Node.js", "MongoDB", "Redis", "Socket.io", "Elasticsearch"],
      category: "platform",
      features: ["Marketplace completo", "Gestión vendedores", "Sistema pagos", "Analytics avanzado", "Chat integrado", "SEO optimizado"]
    },
    {
      id: 4,
      title: "Concelcol - Portal Corporativo",
      description: "Portal corporativo avanzado con sistema de gestión documental, workflow automatizado y módulos de comunicación interna.",
      fullDescription: "Concelcol es un portal corporativo desarrollado con Next.js y Nest.js que centraliza la gestión empresarial. La plataforma incluye sistema de gestión documental con OCR, workflows automatizados, comunicación interna, directorio de empleados, calendario corporativo, módulo de recursos humanos, sistema de aprobaciones, y reportes ejecutivos. Implementamos autenticación SSO, integración con Active Directory, almacenamiento en cloud, backup automático y alta seguridad con encriptación end-to-end.",
      image: "/api/placeholder/600/400",
      link: "https://concelcol.com.co/",
      technologies: ["Next.js", "Nest.js", "PostgreSQL", "Docker", "AWS S3", "OCR"],
      category: "web",
      features: ["Gestión documental", "Workflows automatizados", "SSO integrado", "RRHH módulo", "Calendario corporativo", "Reportes ejecutivos"]
    },
    {
      id: 5,
      title: "Dely - Plataforma de Delivery",
      description: "Plataforma completa de delivery con tracking en tiempo real, gestión de restaurantes y sistema de pagos integrado.",
      fullDescription: "Dely es una plataforma de delivery desarrollada con React y Node.js que conecta restaurantes, repartidores y clientes. La plataforma incluye tracking GPS en tiempo real, gestión de menús dinámicos, sistema de pedidos automatizado, chat en vivo, calificaciones y reviews, gestión de promociones, panel para restaurantes, app para repartidores y analytics detallado. Implementamos Socket.io para tiempo real, integración con mapas, sistema de notificaciones push, y optimización para alto volumen de transacciones.",
      image: "/api/placeholder/600/400",
      link: "https://dely.vercel.app/",
      technologies: ["React", "Node.js", "Socket.io", "Stripe", "Google Maps", "Redis"],
      category: "platform",
      features: ["Tracking tiempo real", "Gestión restaurantes", "App repartidores", "Sistema pagos", "Chat en vivo", "Analytics detallado"]
    },
    {
      id: 6,
      title: "Seguros de Colombia - Sistema Integral",
      description: "Sistema integral de gestión de seguros con cotización automática, gestión de pólizas y portal del cliente.",
      fullDescription: "Seguros de Colombia es un sistema integral desarrollado con Next.js y TypeScript para la gestión completa de seguros. La plataforma incluye cotizador automático inteligente, gestión de pólizas, portal del cliente, sistema de siniestros, CRM especializado, reportes actuariales, integración con APIs de aseguradoras, y módulo de facturación. Implementamos algoritmos de pricing dinámico, integración con centrales de riesgo, workflow de aprobaciones, y cumplimiento normativo SARLAFT.",
      image: "/api/placeholder/600/400",
      link: "https://www.segurosdecolombiasdc.com.co/",
      technologies: ["Next.js", "TypeScript", "MySQL", "AWS", "API Gateway", "Lambda"],
      category: "web",
      features: ["Cotizador automático", "Gestión pólizas", "Portal cliente", "Sistema siniestros", "CRM especializado", "Cumplimiento normativo"]
    }
  ];

  const services: Service[] = [
    {
      icon: "🌐",
      title: "Desarrollo Web Profesional",
      description: "Creamos aplicaciones web modernas, escalables y optimizadas usando las tecnologías más avanzadas del mercado.",
      fullDescription: "Nuestro servicio de desarrollo web profesional abarca desde sitios web corporativos hasta aplicaciones web complejas y plataformas empresariales. Utilizamos tecnologías de vanguardia como Next.js, React, TypeScript y Node.js para crear soluciones web robustas, escalables y de alto rendimiento. Cada proyecto incluye diseño responsive, optimización SEO, integración de APIs, sistemas de gestión de contenido, e-commerce avanzado, y paneles administrativos personalizados.",
      technologies: ["Next.js", "React", "TypeScript", "Nest.js", "Node.js", "PostgreSQL", "MongoDB"],
      benefits: [
        "Sitios web ultra-rápidos y optimizados para SEO",
        "Diseño responsive que se adapta a cualquier dispositivo",
        "Integración con sistemas de pago y APIs externas",
        "Paneles administrativos intuitivos y funcionales",
        "Arquitectura escalable preparada para el crecimiento",
        "Seguridad avanzada y cumplimiento normativo"
      ],
      processes: [
        "Análisis de requisitos y planificación estratégica",
        "Diseño UX/UI centrado en el usuario",
        "Desarrollo ágil con entregas incrementales",
        "Testing exhaustivo y control de calidad",
        "Deployment en servidores optimizados",
        "Mantenimiento y soporte técnico continuo"
      ]
    },
    {
      icon: "📱",
      title: "Desarrollo de Aplicaciones Móviles",
      description: "Desarrollamos apps nativas y multiplataforma con experiencia de usuario excepcional y rendimiento óptimo.",
      fullDescription: "Especializados en desarrollo de aplicaciones móviles para iOS y Android, utilizamos Flutter y React Native para crear apps multiplataforma de alta calidad. Nuestro enfoque incluye diseño centrado en el usuario, integración con APIs, funcionalidades offline, notificaciones push, geolocalización, pagos in-app, y optimización de rendimiento. Desarrollamos desde apps simples hasta aplicaciones empresariales complejas como sistemas de delivery, transporte, e-commerce móvil y plataformas de servicios.",
      technologies: ["Flutter", "React Native", "iOS Native", "Android Native", "Firebase", "AWS Amplify"],
      benefits: [
        "Apps multiplataforma con código compartido",
        "Rendimiento nativo en iOS y Android",
        "Integración completa con APIs y servicios cloud",
        "Funcionalidades offline y sincronización automática",
        "Notificaciones push personalizadas",
        "Publicación y optimización en las tiendas de apps"
      ],
      processes: [
        "Investigación de mercado y análisis competitivo",
        "Prototipado interactivo y validación de concepto",
        "Desarrollo con metodologías ágiles",
        "Testing en dispositivos reales múltiples",
        "Optimización de rendimiento y batería",
        "Publicación y marketing en app stores"
      ]
    },
    {
      icon: "☁️",
      title: "Arquitectura Cloud y Backend",
      description: "Diseñamos y desarrollamos arquitecturas cloud escalables con APIs robustas, seguras y de alto rendimiento.",
      fullDescription: "Nuestro servicio de arquitectura cloud y backend incluye el diseño e implementación de sistemas distribuidos, APIs RESTful y GraphQL, microservicios, bases de datos optimizadas, y infraestructura como código. Trabajamos con AWS, Google Cloud y Azure para crear soluciones escalables, seguras y cost-effective. Implementamos CI/CD, monitoreo avanzado, backup automático, y arquitecturas serverless para máxima eficiencia y disponibilidad.",
      technologies: ["AWS", "Google Cloud", "Firebase", "Docker", "Kubernetes", "Serverless", "GraphQL"],
      benefits: [
        "Infraestructura auto-escalable según demanda",
        "APIs robustas con documentación completa",
        "Seguridad avanzada y cumplimiento normativo",
        "Monitoreo en tiempo real y alertas automáticas",
        "Backup automático y recuperación ante desastres",
        "Optimización de costos y recursos cloud"
      ],
      processes: [
        "Auditoría de infraestructura actual",
        "Diseño de arquitectura cloud personalizada",
        "Migración gradual y sin interrupciones",
        "Implementación de DevOps y CI/CD",
        "Configuración de monitoreo y alertas",
        "Optimización continua y escalamiento"
      ]
    },
    {
      icon: "🚀",
      title: "Plataformas Digitales Personalizadas",
      description: "Desarrollamos plataformas completas tipo marketplace, gestión empresarial, eventos y sistemas especializados.",
      fullDescription: "Creamos plataformas digitales personalizadas que transforman modelos de negocio tradicionales. Desde marketplaces multivendedor hasta sistemas de gestión empresarial, plataformas de eventos, LMS educativos, y sistemas especializados por industria. Cada plataforma incluye paneles administrativos completos, gestión de usuarios avanzada, sistemas de pago, analytics en tiempo real, integraciones múltiples, y módulos personalizables según las necesidades específicas del negocio.",
      technologies: ["Full Stack", "Microservicios", "Redis", "Elasticsearch", "Socket.io", "Blockchain"],
      benefits: [
        "Plataformas escalables desde 100 hasta millones de usuarios",
        "Paneles administrativos completos y personalizables",
        "Integraciones con sistemas externos y APIs",
        "Analytics avanzado y reportes en tiempo real",
        "Arquitectura modular para fácil expansión",
        "Soporte multiteniente y white-label"
      ],
      processes: [
        "Workshop de definición de modelo de negocio",
        "Arquitectura de información y wireframes",
        "Desarrollo MVP para validación temprana",
        "Desarrollo iterativo con feedback continuo",
        "Testing exhaustivo y optimización",
        "Lanzamiento y crecimiento asistido"
      ]
    }
  ];

  const technologies = [
    { name: 'Next.js', icon: '⚛️', category: 'Frontend', description: 'Framework React para aplicaciones web de producción' },
    { name: 'React', icon: '⚛️', category: 'Frontend', description: 'Librería JavaScript para interfaces de usuario' },
    { name: 'TypeScript', icon: '📘', category: 'Language', description: 'JavaScript con tipado estático para mayor robustez' },
    { name: 'Flutter', icon: '📱', category: 'Mobile', description: 'Framework de Google para apps multiplataforma' },
    { name: 'Nest.js', icon: '🟥', category: 'Backend', description: 'Framework Node.js para APIs escalables y robustas' },
    { name: 'Node.js', icon: '🟢', category: 'Backend', description: 'Runtime JavaScript para desarrollo backend' },
    { name: 'Firebase', icon: '🔥', category: 'Cloud', description: 'Plataforma de Google para desarrollo rápido' },
    { name: 'AWS', icon: '☁️', category: 'Cloud', description: 'Servicios cloud de Amazon para infraestructura' },
    { name: 'PostgreSQL', icon: '🐘', category: 'Database', description: 'Base de datos relacional avanzada' },
    { name: 'MongoDB', icon: '🍃', category: 'Database', description: 'Base de datos NoSQL flexible y escalable' },
    { name: 'Docker', icon: '🐳', category: 'DevOps', description: 'Contenedorización para deployment consistente' },
    { name: 'Kubernetes', icon: '⚙️', category: 'DevOps', description: 'Orquestación de contenedores para escalabilidad' }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Descubrimiento y Análisis",
      description: "Analizamos a fondo tus necesidades, objetivos de negocio, audiencia objetivo y competencia para crear una estrategia sólida.",
      details: "Realizamos workshops colaborativos, investigación de mercado, análisis de competencia, definición de buyer personas, arquitectura de información y especificaciones técnicas detalladas."
    },
    {
      step: "02",
      title: "Diseño y Prototipado",
      description: "Creamos wireframes, mockups y prototipos interactivos centrados en la experiencia del usuario y optimizados para conversión.",
      details: "Diseño UX/UI profesional, prototipado interactivo, testing de usabilidad, sistemas de design tokens, guías de estilo y documentación completa del diseño."
    },
    {
      step: "03",
      title: "Desarrollo Ágil",
      description: "Desarrollamos tu proyecto usando metodologías ágiles con entregas incrementales y feedback continuo para asegurar el mejor resultado.",
      details: "Desarrollo en sprints, code reviews, testing automatizado, integración continua, deployment automático y documentación técnica completa."
    },
    {
      step: "04",
      title: "Testing y Optimización",
      description: "Realizamos pruebas exhaustivas de funcionalidad, rendimiento, seguridad y compatibilidad para garantizar la máxima calidad.",
      details: "Testing funcional, pruebas de rendimiento, auditorías de seguridad, testing de compatibilidad cross-browser, optimización SEO y accesibilidad."
    },
    {
      step: "05",
      title: "Lanzamiento y Deployment",
      description: "Desplegamos tu proyecto en infraestructura optimizada con monitoreo avanzado y configuración de analytics.",
      details: "Configuración de servidores, SSL certificates, CDN setup, monitoreo en tiempo real, backup automático y configuración de analytics avanzado."
    },
    {
      step: "06",
      title: "Soporte y Evolución",
      description: "Brindamos soporte técnico continuo, mantenimiento proactivo y evolución constante basada en métricas y feedback de usuarios.",
      details: "Soporte técnico 24/7, actualizaciones de seguridad, optimización continua, análisis de métricas, nuevas funcionalidades y escalamiento según crecimiento."
    }
  ];
  if (!mounted) {
    return (
      <>
        <Head>
          <title>Sinko - Desarrollo de Software en Colombia | Apps Móviles y Páginas Web</title>
          <meta name="description" content="Sinko es la startup líder en desarrollo de software en Colombia. Creamos aplicaciones móviles, páginas web y plataformas digitales con Next.js, Flutter, Firebase. +20 proyectos exitosos. Cotiza gratis." />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-black mb-4" style={{
              background: 'linear-gradient(135deg, #3498DB 0%, #1ABC9C 50%, #2ECC71 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              SINKO
            </div>
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>Sinko - Desarrollo de Software en Colombia | Apps Móviles y Páginas Web</title>
        <meta name="description" content="Sinko es una startup de desarrollo de software en Colombia. Creamos aplicaciones móviles, páginas web y plataformas digitales con Next.js, Flutter, Firebase. +40 proyectos exitosos. Cotiza gratis." />
        <meta name="keywords" content="desarrollo de software Colombia, aplicaciones móviles Colombia, páginas web Bogotá, desarrollo web Next.js, apps Flutter, plataformas digitales, startup tecnológica Colombia, desarrollo de apps, diseño web profesional" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Sinko - Desarrollo de Software en Colombia" />
        <meta property="og:description" content="Transformamos ideas en productos digitales exitosos. Especialistas en desarrollo web, móvil y plataformas personalizadas." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://sinko.dev" />
        <link rel="icon" href="/favicon.ico" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Sinko",
            "description": "Startup de desarrollo de software especializada en aplicaciones web, móviles y plataformas digitales",
            "url": "https://sinko.dev",
            "logo": "https://sinko.dev/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+57-313-269-4664",
              "contactType": "customer service"
            },
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Bogotá",
              "addressCountry": "Colombia"
            },
            "sameAs": [
              "https://wa.me/573132694664"
            ]
          })}
        </script>
      </Head>

      {/* WhatsApp Float Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setShowWhatsAppForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 animate-pulse"
          aria-label="Contactar por WhatsApp"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.51 3.415" />
          </svg>
        </button>
      </div>

      {/* WhatsApp Form Modal */}
      {showWhatsAppForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Contactar por WhatsApp</h3>
              <button
                onClick={() => setShowWhatsAppForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  required
                  value={whatsappForm.name}
                  onChange={(e) => setWhatsappForm({ ...whatsappForm, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de proyecto *
                </label>
                <select
                  required
                  value={whatsappForm.projectType}
                  onChange={(e) => setWhatsappForm({ ...whatsappForm, projectType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="Página Web Empresarial">Página Web Empresarial</option>
                  <option value="E-commerce / Tienda Online">E-commerce / Tienda Online</option>
                  <option value="Aplicación Móvil">Aplicación Móvil</option>
                  <option value="Plataforma Digital">Plataforma Digital</option>
                  <option value="Marketplace">Marketplace</option>
                  <option value="Sistema de Gestión">Sistema de Gestión</option>
                  <option value="Portal Corporativo">Portal Corporativo</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Información del proyecto *
                </label>
                <textarea
                  required
                  rows={4}
                  value={whatsappForm.projectInfo}
                  onChange={(e) => setWhatsappForm({ ...whatsappForm, projectInfo: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Cuéntanos sobre tu proyecto, objetivos, funcionalidades deseadas, timeline, presupuesto aproximado..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowWhatsAppForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Enviar a WhatsApp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <header className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${scrolled ? 'shadow-lg' : ''
        }`} style={{
          background: scrolled
            ? 'rgba(255, 255, 255, 0.98)'
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(52, 152, 219, 0.2)' : '1px solid rgba(52, 152, 219, 0.1)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0, 0, 0, 0.15)'
            : '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo - mantiene tamaño consistente */}
            <div className="text-4xl font-black tracking-tight transition-all duration-300" style={{
              background: 'linear-gradient(135deg, #3498DB 0%, #1ABC9C 50%, #2ECC71 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              SINKO
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex space-x-8">
              <a href="#servicios" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold">Servicios</a>
              <a href="#proyectos" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold">Proyectos</a>
              <a href="#proceso" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold">Proceso</a>
              <a href="#tecnologias" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold">Tecnologías</a>
              <a href="#contacto" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-semibold">Contacto</a>
            </div>

            {/* Desktop CTA Button - tamaño consistente */}
            <button
              onClick={() => setShowWhatsAppForm(true)}
              className="hidden lg:block text-white px-8 py-3 rounded-full font-bold hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #FF4B2B 0%, #FFA500 100%)',
                boxShadow: '0 8px 32px rgba(255, 75, 43, 0.3)'
              }}
            >
              🚀 Comenzar Proyecto
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Abrir menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showMobileMenu ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden transition-all duration-300 overflow-hidden ${showMobileMenu ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
            <div className="py-4 space-y-1 border-t border-gray-200 mt-4">
              {[
                { href: '#servicios', label: 'Servicios', icon: '🌐' },
                { href: '#proyectos', label: 'Proyectos', icon: '🚀' },
                { href: '#proceso', label: 'Proceso', icon: '⚡' },
                { href: '#tecnologias', label: 'Tecnologías', icon: '💻' },
                { href: '#contacto', label: 'Contacto', icon: '📞' }
              ].map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className="flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-all duration-200 font-semibold"
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </a>
              ))}

              {/* Mobile CTA Button */}
              <div className="px-4 py-2">
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    setShowWhatsAppForm(true);
                  }}
                  className="w-full text-white px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #FF4B2B 0%, #FFA500 100%)',
                    boxShadow: '0 4px 20px rgba(255, 75, 43, 0.3)'
                  }}
                >
                  🚀 Comenzar Proyecto
                </button>
              </div>

              {/* Contact Info in Mobile */}
              <div className="px-4 py-2 border-t border-gray-200 mt-2">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Contacto directo:</p>
                  <a
                    href="https://wa.me/573132694664"
                    className="inline-flex items-center text-green-600 font-semibold text-sm"
                  >
                    <span className="mr-2">📱</span>
                    +57 313 269 4664
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
     {/* Hero Section - Optimizada para móvil */}
<section className={`min-h-screen flex items-center justify-center pt-20 sm:pt-28 pb-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
  style={{
    background: `linear-gradient(135deg, rgba(52, 152, 219, 0.1) 0%, rgba(26, 188, 156, 0.1) 50%, rgba(46, 204, 113, 0.1) 100%)`
  }}>
  <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 text-center">
    <div className="mb-6 sm:mb-8">
      <span className="inline-block px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 sm:mb-6 text-white"
        style={{
          background: `linear-gradient(135deg, #FF4B2B 0%, #FFA500 100%)`
        }}>
        🚀 Startup Tecnológica
      </span>
      
      {/* Título responsive */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight px-2">
        <span style={{
          background: `linear-gradient(135deg, #3498DB 0%, #1ABC9C 50%, #2ECC71 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Desarrollamos
        </span>
        <br />
        <span className="text-white-900">el futuro digital</span>
      </h1>
      
      {/* Subtítulo responsive */}
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-white-800 px-2">
        Especialistas en Desarrollo Web, Aplicaciones Móviles y Plataformas Digitales
      </h2>
      
      {/* Descripción responsive */}
      <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-2">
        Somos <strong>Sinko</strong>, la startup de desarrollo de software con gran proyección en Colombia.
        Transformamos ideas revolucionarias en productos digitales exitosos que impulsan el crecimiento de tu negocio.
        Con más de <strong>40+ proyectos desarrollados</strong> y tecnologías de vanguardia como <strong>Next.js, Flutter, Firebase y AWS</strong>,
        creamos soluciones digitales que marcan la diferencia en el mercado colombiano e internacional.
      </p>
    </div>

    {/* Botones CTA responsive */}
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-16 px-4">
      <button
        onClick={() => setShowWhatsAppForm(true)}
        className="w-full sm:w-auto text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        style={{
          background: `linear-gradient(135deg, #3498DB 0%, #1ABC9C 100%)`
        }}
      >
        🚀 Ver Nuestros Proyectos
      </button>
      <button
        onClick={() => setShowWhatsAppForm(true)}
        className="w-full sm:w-auto border-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:text-white"
        style={{
          borderColor: '#3498DB',
          color: '#3498DB',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = `linear-gradient(135deg, #3498DB 0%, #1ABC9C 100%)`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        💬 Cotización Gratis
      </button>
    </div>

    {/* Stats - Responsive grid */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 max-w-4xl mx-auto mb-8 sm:mb-16 px-2">
      {[
        { number: '40+', label: 'Proyectos Exitosos' },
        { number: '50+', label: 'Clientes Satisfechos' },
        { number: '5+', label: 'Años de Experiencia' },
        { number: '24/7', label: 'Soporte Técnico' }
      ].map((stat, index) => (
        <div key={index} className={`bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg border transition-all duration-500 hover:shadow-xl hover:scale-105 ${isVisible ? 'animate-fadeInUp' : ''}`} style={{ animationDelay: `${index * 100}ms` }}>
          <div className="text-xl sm:text-2xl md:text-3xl font-black mb-1 sm:mb-2" style={{ color: '#3498DB' }}>{stat.number}</div>
          <div className="font-semibold text-gray-700 text-xs sm:text-sm md:text-base leading-tight">{stat.label}</div>
        </div>
      ))}
    </div>

    {/* Tech Stack Preview - Responsive grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 md:gap-6 max-w-5xl mx-auto px-2">
      {[
        { name: 'Next.js', icon: '⚛️' },
        { name: 'Flutter', icon: '📱' },
        { name: 'Firebase', icon: '🔥' },
        { name: 'Nest.js', icon: '🟥' },
        { name: 'TypeScript', icon: '📘' },
        { name: 'AWS', icon: '☁️' }
      ].map((tech, index) => (
        <div key={tech.name} className={`bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-lg border transition-all duration-500 hover:shadow-xl hover:scale-105 ${isVisible ? 'animate-fadeInUp' : ''}`} style={{ animationDelay: `${index * 100}ms` }}>
          <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{tech.icon}</div>
          <div className="font-semibold text-gray-700 text-xs sm:text-sm leading-tight">{tech.name}</div>
        </div>
      ))}
    </div>
  </div>
</section>


      {/* Services Section */}
      <section id="servicios" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6" style={{
              background: `linear-gradient(135deg, #3498DB 0%, #1ABC9C 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Servicios de Desarrollo de Software
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Ofrecemos servicios completos de desarrollo de software en Colombia, desde páginas web corporativas
              hasta aplicaciones móviles complejas y plataformas digitales empresariales. Cada proyecto incluye
              consultoría estratégica, diseño UX/UI, desarrollo técnico y soporte continuo.
            </p>
          </div>

          <div className="space-y-16">
            {services.map((service, index) => (
              <div key={index} className={`${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} flex flex-col lg:flex gap-12 items-center`}>
                <div className="lg:w-1/2">
                  <div className="bg-white rounded-3xl p-8 shadow-xl border hover:shadow-2xl transition-all duration-300">
                    <div className="text-6xl mb-6">{service.icon}</div>
                    <h3 className="text-3xl font-bold mb-4 text-gray-900">{service.title}</h3>
                    <p className="text-gray-600 mb-6 text-lg leading-relaxed">{service.fullDescription}</p>

                    <div className="mb-6">
                      <h4 className="font-bold text-gray-900 mb-3">Tecnologías que utilizamos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="px-3 py-1 rounded-full text-sm font-medium text-white"
                            style={{ background: `linear-gradient(135deg, #1ABC9C 0%, #2ECC71 100%)` }}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setShowWhatsAppForm(true)}
                      className="text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                      style={{
                        background: `linear-gradient(135deg, #FF4B2B 0%, #FFA500 100%)`
                      }}
                    >
                      Solicitar Cotización
                    </button>
                  </div>
                </div>

                <div className="lg:w-1/2">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xl font-bold mb-4 text-gray-900">✅ Beneficios clave:</h4>
                      <ul className="space-y-3">
                        {service.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start">
                            <span className="text-green-500 mr-3 mt-1">✓</span>
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xl font-bold mb-4 text-gray-900">🔄 Nuestro proceso:</h4>
                      <ul className="space-y-3">
                        {service.processes.map((process, processIndex) => (
                          <li key={processIndex} className="flex items-start">
                            <span className="text-blue-500 mr-3 mt-1 text-sm font-bold">{processIndex + 1}.</span>
                            <span className="text-gray-700">{process}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="proceso" className="py-20" style={{
        background: `linear-gradient(135deg, rgba(52, 152, 219, 0.05) 0%, rgba(26, 188, 156, 0.05) 100%)`
      }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6" style={{
              background: `linear-gradient(135deg, #3498DB 0%, #1ABC9C 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Nuestro Proceso de Desarrollo
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Seguimos una metodología probada que garantiza resultados excepcionales en cada proyecto de desarrollo de software.
              Desde la conceptualización hasta el lanzamiento y mantenimiento, cada etapa está diseñada para maximizar el éxito de tu inversión.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4"
                    style={{
                      background: `linear-gradient(135deg, #3498DB 0%, #1ABC9C 100%)`
                    }}>
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                <div className="text-sm text-gray-500 leading-relaxed">
                  {step.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="proyectos" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6" style={{
              background: `linear-gradient(135deg, #3498DB 0%, #1ABC9C 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Proyectos Exitosos Desarrollados
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Hemos desarrollado más de 40+ proyectos exitosos para empresas de diversos sectores en Colombia y Latinoamérica.
              Desde aplicaciones móviles innovadoras hasta plataformas empresariales complejas, cada proyecto demuestra
              nuestra experiencia en desarrollo de software de clase mundial.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={project.id} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border">
                <div className="h-48 flex items-center justify-center"
                  style={{
                    background: project.category === 'mobile'
                      ? `linear-gradient(135deg, #2ECC71 0%, #F4D03F 100%)`
                      : project.category === 'web'
                        ? `linear-gradient(135deg, #3498DB 0%, #1ABC9C 100%)`
                        : `linear-gradient(135deg, #FF4B2B 0%, #FFA500 100%)`
                  }}>
                  <div className="text-6xl text-white">
                    {project.category === 'mobile' ? '📱' : project.category === 'web' ? '🌐' : '⚡'}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white`}
                      style={{
                        background: project.category === 'mobile'
                          ? '#2ECC71'
                          : project.category === 'web'
                            ? '#3498DB'
                            : '#FF4B2B'
                      }}>
                      {project.category === 'mobile' ? 'Móvil' : project.category === 'web' ? 'Web' : 'Plataforma'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Características principales:</h4>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.features.slice(0, 3).map((feature, featureIndex) => (
                        <span key={featureIndex} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech, techIndex) => (
                      <span key={techIndex} className="text-xs px-2 py-1 rounded-lg text-white"
                        style={{ background: '#1ABC9C' }}>
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs">
                        +{project.technologies.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-4 py-2 rounded-lg font-semibold text-white transition-all duration-300 hover:shadow-lg"
                      style={{ background: `linear-gradient(135deg, #3498DB 0%, #1ABC9C 100%)` }}
                    >
                      Ver Proyecto
                    </a>
                    <button
                      onClick={() => setShowWhatsAppForm(true)}
                      className="px-4 py-2 border-2 rounded-lg font-semibold transition-all duration-300"
                      style={{ borderColor: '#3498DB', color: '#3498DB' }}
                    >
                      Cotizar Similar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-6">
              ¿Tienes una idea similar? Podemos desarrollar una solución personalizada para tu negocio.
            </p>
            <button
              onClick={() => setShowWhatsAppForm(true)}
              className="text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, #FF4B2B 0%, #FFA500 100%)`
              }}
            >
              🚀 Desarrollar Mi Proyecto
            </button>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section id="tecnologias" className="py-20" style={{
        background: `linear-gradient(135deg, rgba(52, 152, 219, 0.05) 0%, rgba(26, 188, 156, 0.05) 100%)`
      }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6" style={{
              background: `linear-gradient(135deg, #3498DB 0%, #1ABC9C 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Stack Tecnológico de Vanguardia
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Trabajamos exclusivamente con las tecnologías más modernas y demandadas del mercado internacional.
              Nuestro stack tecnológico garantiza aplicaciones robustas, escalables y preparadas para el futuro,
              asegurando que tu inversión en desarrollo de software tenga el máximo retorno y longevidad.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
            {technologies.map((tech, index) => (
              <div key={tech.name} className="bg-white rounded-2xl p-6 text-center shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-4xl mb-4">{tech.icon}</div>
                <div className="font-bold text-gray-900 mb-2">{tech.name}</div>
                <div className="text-xs font-semibold mb-2 px-2 py-1 rounded-full text-white"
                  style={{
                    background: tech.category === 'Frontend' ? '#3498DB' :
                      tech.category === 'Backend' ? '#2ECC71' :
                        tech.category === 'Mobile' ? '#FF4B2B' :
                          tech.category === 'Cloud' ? '#1ABC9C' :
                            tech.category === 'Database' ? '#FFA500' : '#F4D03F'
                  }}>
                  {tech.category}
                </div>
                <p className="text-xs text-gray-600">{tech.description}</p>
              </div>
            ))}
          </div>

          {/* Technology Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Frontend & UI/UX",
                description: "Creamos interfaces modernas y experiencias de usuario excepcionales",
                techs: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Figma"],
                color: "#3498DB"
              },
              {
                title: "Backend & APIs",
                description: "Desarrollamos APIs robustas y arquitecturas escalables",
                techs: ["Nest.js", "Node.js", "GraphQL", "REST APIs", "Microservicios"],
                color: "#2ECC71"
              },
              {
                title: "Mobile Development",
                description: "Apps nativas y multiplataforma de alto rendimiento",
                techs: ["Flutter", "React Native", "iOS", "Android", "PWA"],
                color: "#FF4B2B"
              },
              {
                title: "Cloud & DevOps",
                description: "Infraestructura cloud escalable y deployment automatizado",
                techs: ["AWS", "Google Cloud", "Docker", "Kubernetes", "CI/CD"],
                color: "#1ABC9C"
              },
              {
                title: "Databases",
                description: "Gestión de datos eficiente y optimizada",
                techs: ["PostgreSQL", "MongoDB", "Redis", "Firebase", "Elasticsearch"],
                color: "#FFA500"
              },
              {
                title: "Integrations",
                description: "Conectamos tu software con servicios externos",
                techs: ["Payment Gateways", "Social Login", "APIs Third-party", "Webhooks"],
                color: "#F4D03F"
              }
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg border hover:shadow-xl transition-all duration-300">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{category.title}</h3>
                <p className="text-gray-600 mb-6">{category.description}</p>
                <div className="flex flex-wrap gap-2">
                  {category.techs.map((tech, techIndex) => (
                    <span key={techIndex} className="px-3 py-1 rounded-full text-sm font-medium text-white"
                      style={{ background: category.color }}>
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6" style={{
              background: `linear-gradient(135deg, #3498DB 0%, #1ABC9C 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              ¿Por Qué Elegir Sinko?
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Somos más que una empresa de desarrollo de software. Somos tu socio estratégico en la transformación digital,
              comprometidos con el éxito de tu proyecto desde la idea inicial hasta el crecimiento sostenible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🏆",
                title: "Experiencia Comprobada",
                description: "Más de 40+ proyectos exitosos desarrollados para empresas de diversos sectores en Colombia y Latinoamérica.",
                details: "Portfolio diverso que incluye fintech, e-commerce, logística, salud, educación y más."
              },
              {
                icon: "⚡",
                title: "Tecnología de Vanguardia",
                description: "Utilizamos exclusivamente las tecnologías más modernas y demandadas del mercado internacional.",
                details: "Stack actualizado constantemente: Next.js, Flutter, Firebase, AWS, TypeScript y más."
              },
              {
                icon: "🎯",
                title: "Enfoque en Resultados",
                description: "Cada línea de código está orientada a generar valor real para tu negocio y tus usuarios.",
                details: "Medimos el éxito por el impacto en tu ROI, conversiones y satisfacción del usuario."
              },
              {
                icon: "🚀",
                title: "Metodología Ágil",
                description: "Desarrollo iterativo con entregas frecuentes y feedback continuo para garantizar el mejor resultado.",
                details: "Sprints de 2 semanas, demos regulares y ajustes basados en feedback real."
              },
              {
                icon: "🔒",
                title: "Seguridad y Calidad",
                description: "Implementamos las mejores prácticas de seguridad y testing para garantizar software robusto.",
                details: "Code reviews, testing automatizado, auditorías de seguridad y documentación completa."
              },
              {
                icon: "📞",
                title: "Soporte Integral",
                description: "Acompañamiento completo desde la conceptualización hasta el mantenimiento y evolución continua.",
                details: "Soporte técnico 24/7, actualizaciones regulares y evolución basada en métricas."
              },
              {
                icon: "💰",
                title: "Excelente Relación Calidad-Precio",
                description: "Ofrecemos desarrollo de software de clase mundial a precios competitivos del mercado colombiano.",
                details: "Transparencia total en costos, sin sorpresas y con planes de pago flexibles."
              },
              {
                icon: "🌎",
                title: "Visión Internacional",
                description: "Desarrollamos software preparado para escalabilidad global desde el primer día.",
                details: "Arquitectura cloud-native, multi-idioma, multi-moneda y compliance internacional."
              },
              {
                icon: "🤝",
                title: "Partnership de Largo Plazo",
                description: "No solo desarrollamos tu software, te acompañamos en todo el ciclo de vida y crecimiento.",
                details: "Relaciones duraderas, evolución continua y crecimiento conjunto sostenible."
              }
            ].map((reason, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-lg border hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="text-5xl mb-4">{reason.icon}</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">{reason.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{reason.description}</p>
                <p className="text-sm text-gray-500">{reason.details}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{
        background: `linear-gradient(135deg, #3498DB 0%, #1ABC9C 50%, #2ECC71 100%)`
      }}>
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-5xl font-black text-white mb-6">
            ¿Listo para Transformar tu Idea en Realidad?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            Únete a más de 50+ empresas que han confiado en Sinko para desarrollar sus productos digitales.
            Transformamos conceptos innovadores en software exitoso que impulsa el crecimiento de tu negocio.
            <strong> ¡Comencemos hoy mismo tu proyecto!</strong>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => setShowWhatsAppForm(true)}
              className="bg-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{ color: '#3498DB' }}
            >
              🚀 Iniciar Mi Proyecto Ahora
            </button>
            <button
              onClick={() => setShowWhatsAppForm(true)}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-all duration-300"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#3498DB';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'white';
              }}
            >
              💬 Cotización Gratuita WhatsApp
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24h</div>
              <div className="text-white/80">Respuesta garantizada</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">100%</div>
              <div className="text-white/80">Proyectos entregados</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">50+</div>
              <div className="text-white/80">Clientes satisfechos</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6" style={{
              background: `linear-gradient(135deg, #3498DB 0%, #1ABC9C 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Preguntas Frecuentes
            </h2>
            <p className="text-xl text-gray-600">
              Resolvemos las dudas más comunes sobre nuestros servicios de desarrollo de software
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "¿Cuánto tiempo toma desarrollar una aplicación web o móvil?",
                answer: "El tiempo de desarrollo varía según la complejidad del proyecto. Una página web corporativa puede tomar 2-4 semanas, mientras que una aplicación móvil compleja puede requerir 3-6 meses. Durante la consulta inicial, te proporcionamos un timeline detallado específico para tu proyecto."
              },
              {
                question: "¿Cuáles son los costos de desarrollo de software?",
                answer: "Nuestros precios son competitivos y transparentes. Una página web profesional puede costar desde $500 USD, mientras que aplicaciones móviles  pueden iniciar desde $1,500 USD. Cada proyecto recibe una cotización personalizada basada en sus requerimientos específicos."
              },
              {
                question: "¿Ofrecen soporte y mantenimiento después del lanzamiento?",
                answer: "Sí, ofrecemos planes de soporte y mantenimiento 24/7 que incluyen actualizaciones de seguridad, optimizaciones de rendimiento, backup automático, monitoreo y soporte técnico. También proporcionamos evolución continua basada en feedback de usuarios y métricas."
              },
              {
                question: "¿Pueden integrar mi software con sistemas existentes?",
                answer: "Absolutamente. Tenemos amplia experiencia integrando con ERPs, CRMs, sistemas de pago, APIs de terceros, bases de datos legacy y cualquier sistema existente. Realizamos auditorías técnicas para garantizar integraciones seamless y seguras."
              },
              {
                question: "¿Qué incluye el proceso de desarrollo?",
                answer: "Nuestro proceso integral incluye: análisis de requisitos, arquitectura de información, diseño UX/UI, desarrollo frontend y backend, testing exhaustivo, deployment, capacitación, documentación completa y soporte post-lanzamiento."
              },
              {
                question: "¿Desarrollan tanto para iOS como Android?",
                answer: "Sí, desarrollamos aplicaciones nativas para iOS y Android, así como aplicaciones multiplataforma usando Flutter y React Native. Recomendamos la mejor opción según tu presupuesto, timeline y requerimientos técnicos específicos."
              },
              {
                question: "¿Cómo garantizan la seguridad del software?",
                answer: "Implementamos las mejores prácticas de seguridad: encriptación end-to-end, autenticación robusta, auditorías de seguridad, cumplimiento GDPR/LGPD, backup automático, SSL certificates, y actualizaciones regulares de seguridad."
              },
              {
                question: "¿Pueden ayudar con el hosting y deployment?",
                answer: "Sí, manejamos todo el proceso de hosting y deployment en plataformas cloud como AWS, Google Cloud o Azure. Configuramos infraestructura escalable, CDN, monitoreo, backup automático y optimizaciones de rendimiento."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-6">
              ¿Tienes más preguntas? Estamos aquí para ayudarte.
            </p>
            <button
              onClick={() => setShowWhatsAppForm(true)}
              className="text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{
                background: `linear-gradient(135deg, #2ECC71 0%, #1ABC9C 100%)`
              }}
            >
              💬 Hacer Pregunta por WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="text-4xl font-black mb-4" style={{
                background: `linear-gradient(135deg, #3498DB 0%, #1ABC9C 50%, #2ECC71 100%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                SINKO
              </div>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Somos la startup de desarrollo de software más innovadora de Colombia.
                Transformamos ideas revolucionarias en productos digitales exitosos que impulsan
                el crecimiento de empresas en toda Latinoamérica.
              </p>
              <div className="mb-6">
                <h4 className="font-bold text-white mb-3">🏆 Certificaciones y Alianzas:</h4>
                <div className="flex flex-wrap gap-2">
                  {['AWS Partner', 'Google Cloud', 'Flutter Expert', 'Next.js Specialist'].map((cert, index) => (
                    <span key={index} className="bg-gray-800 text-gray-300 px-3 py-1 rounded-full text-sm">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex space-x-4">
                <a href="mailto:hola@sinko.dev" className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300"
                  style={{ backgroundColor: '#FF4B2B' }}>
                  📧
                </a>
                <a href="https://wa.me/573132694664" className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300"
                  style={{ backgroundColor: '#2ECC71' }}>
                  📱
                </a>
                <a href="https://linkedin.com/company/sinko" className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300"
                  style={{ backgroundColor: '#3498DB' }}>
                  💼
                </a>
                <a href="https://github.com/sinko-dev" className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:shadow-lg transition-all duration-300"
                  style={{ backgroundColor: '#1ABC9C' }}>
                  🔧
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Servicios Principales</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#servicios" className="hover:text-white transition-colors">🌐 Desarrollo Web Profesional</a></li>
                <li><a href="#servicios" className="hover:text-white transition-colors">📱 Apps Móviles iOS/Android</a></li>
                <li><a href="#servicios" className="hover:text-white transition-colors">☁️ Arquitectura Cloud & APIs</a></li>
                <li><a href="#servicios" className="hover:text-white transition-colors">🚀 Plataformas Digitales</a></li>
                <li><a href="#servicios" className="hover:text-white transition-colors">🛒 E-commerce Avanzado</a></li>
                <li><a href="#servicios" className="hover:text-white transition-colors">🔧 Mantenimiento & Soporte</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-white">Contacto Directo</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <span className="mr-3">📧</span>
                  <a href="mailto:sinko@icecompany.com.co" className="hover:text-white transition-colors">
                    hola@icecompany.com.co
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="mr-3">📱</span>
                  <a href="https://wa.me/573132694664" className="hover:text-white transition-colors">
                    +57 313 269 4664
                  </a>
                </li>
                <li className="flex items-center">
                  <span className="mr-3">📍</span>
                  <span>Calle 25 a 2 a 28 - Fusagasugá, Colombia</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-3">🌐</span>
                  <span>www.sinko.dev</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-3">⏰</span>
                  <span>Lun - Vie: 8AM - 6PM</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-3">🚨</span>
                  <span>Soporte 24/7 disponible</span>
                </li>
              </ul>

              <div className="mt-6">
                <button
                  onClick={() => setShowWhatsAppForm(true)}
                  className="w-full text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  style={{
                    background: `linear-gradient(135deg, #2ECC71 0%, #1ABC9C 100%)`
                  }}
                >
                  💬 Contactar WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-white mb-3">🏷️ Palabras Clave SEO:</h4>
                <p className="text-sm text-gray-500 leading-relaxed">
                  desarrollo de software Colombia, aplicaciones móviles Bogotá, páginas web profesionales,
                  desarrollo web Next.js, apps Flutter Colombia, plataformas digitales, startup tecnológica,
                  desarrollo de apps iOS Android, e-commerce Colombia, APIs REST GraphQL, cloud AWS Firebase
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400 mb-2">
                  Desarrollo de Software en Colombia | Especialistas en:
                </div>
                <div className="flex flex-wrap justify-end gap-2">
                  {['Next.js', 'Flutter', 'Firebase', 'AWS', 'React', 'Node.js'].map((tech, index) => (
                    <span key={index} className="bg-gray-800 text-gray-400 px-2 py-1 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center mt-8 pt-8 border-t border-gray-800">
              <p className="text-gray-400">
                &copy; 2025 <strong>Sinko</strong> - Desarrollo de Software en Colombia.
                Todos los derechos reservados. |
                <span className="text-red-400"> Hecho con ❤️ en  Fusgasugá, Colombia</span> |
                Transformando ideas en productos digitales exitosos desde 2022.
              </p>
              <div className="mt-4 text-sm text-gray-500">
                <a href="#" className="hover:text-white mr-6">Política de Privacidad</a>
                <a href="#" className="hover:text-white mr-6">Términos y Condiciones</a>
                <a href="#" className="hover:text-white">Política de Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

<style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
   .header-fixed {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
  }
   @media (max-width: 640px) {
    /* Asegurar que no haya overflow horizontal */
    .hero-container {
      overflow-x: hidden;
    }
    
    /* Ajustar espaciado en móvil */
    .hero-title {
      line-height: 1.1;
    }
    
    /* Mejorar legibilidad en pantallas pequeñas */
    .hero-description {
      font-size: 0.95rem;
      line-height: 1.5;
    }
  }
  
  @media (max-width: 480px) {
    /* Para pantallas muy pequeñas */
    .stats-grid {
      gap: 0.5rem;
    }
    
    .tech-grid {
      gap: 0.5rem;
    }
    
    /* Asegurar que los botones no se salgan */
    .cta-buttons {
      padding: 0 1rem;
    }
  }
  
  /* Prevenir scroll horizontal global */
  body {
    overflow-x: hidden;
  }
  
  /* Mejorar animaciones en móvil */
  @media (prefers-reduced-motion: reduce) {
    .animate-fadeInUp {
      animation: none;
    }
    
    .transition-all {
      transition: none;
    }
  }
  
  /* Asegurar que los gradientes se vean bien en todos los dispositivos */
  .gradient-text {
    background: linear-gradient(135deg, #3498DB 0%, #1ABC9C 50%, #2ECC71 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    display: inline-block;
  }
  
  /* Mejorar contraste en pantallas pequeñas */
  @media (max-width: 768px) {
    .text-gray-600 {
      color: #4a5568;
    }
    
    .text-gray-700 {
      color: #2d3748;
    }
  } 
  body {
    padding-top: 0;
  }
  

  html {
    scroll-behavior: smooth;
    scroll-padding-top: 100px; 
  }
 @media (max-width: 1024px) {
    html {
      scroll-padding-top: 90px;
    }
  }
  
  /* Prevenir scroll horizontal en móvil */
  body {
    overflow-x: hidden;
  }
  
  /* Prevenir scroll horizontal en móvil */
  body {
    overflow-x: hidden;
  }
  
  /* Animaciones mejoradas para el menú móvil */
  .mobile-menu-enter {
    transform: translateY(-10px);
    opacity: 0;
  }
  
  .mobile-menu-enter-active {
    transform: translateY(0);
    opacity: 1;
    transition: all 300ms ease-out;
  }
  
 
  @supports (backdrop-filter: blur(20px)) {
    header {
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
    }
  }
  

  @supports not (backdrop-filter: blur(20px)) {
    header {
      background: rgba(255, 255, 255, 0.98) !important;
    }
  }
  
  @media (max-width: 768px) {
    button, a {
      min-height: 44px; /* Tamaño mínimo táctil recomendado */
    }
  }
  
  
  .mobile-menu-container {
    max-height: calc(100vh - 80px);
    overflow-y: auto;
  }

        /* WhatsApp Float Animation */
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-pulse {
          animation: pulse 2s infinite;
        }

        /* SEO Optimizations */
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        h1, h2, h3 {
          font-weight: 900;
          line-height: 1.2;
        }

        /* Accessibility */
        button:focus, a:focus {
          outline: 2px solid #3498DB;
          outline-offset: 2px;
        }

        /* Performance optimizations */
        img {
          loading: lazy;
        }
      `}</style>
    </>
  );
};

export default HomePage;
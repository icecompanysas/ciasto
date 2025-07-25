'use client'
import React from 'react';
import { Shield, Lock, FileText, UserCheck } from 'lucide-react';
import Footer from '@/app/components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="fixed w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <img
            src="/logo.png"
            alt="DUVI Logo"
            className="h-20 w-auto"
          />
          <button className="bg-secondary text-white px-6 py-2 rounded-lg hover:bg-primary transition">
            Iniciar Sesión
          </button>
        </div>
      </nav>

      {/* Header Section */}
      <div className="relative pt-32 pb-16 bg-gradient-to-b from-secondary to-primary">
        <div className="container mx-auto px-6">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Política de Privacidad
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              Tu privacidad es nuestra prioridad
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Introducción
            </h2>
            <p className="text-black mb-4">
              En DUVI, nos comprometemos a proteger y respetar tu privacidad. Esta política explica cómo recopilamos, utilizamos y protegemos tu información personal cuando utilizas nuestra plataforma de transporte.
            </p>
          </section>

          {/* Key Points */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 text-secondary mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Protección de Datos</h3>
              </div>
              <p className="text-black">
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra accesos no autorizados.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-105">
              <div className="flex items-center mb-4">
                <Lock className="w-8 h-8 text-secondary mr-3" />
                <h3 className="text-xl font-semibold text-gray-800">Control de tu Información</h3>
              </div>
              <p className="text-black">
                Tienes control sobre tus datos personales y puedes solicitar acceso, corrección o eliminación de los mismos.
              </p>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-8">
            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Información que Recopilamos</h2>
              <ul className="space-y-4 text-black">
                <li className="flex items-start">
                  <FileText className="w-6 h-6 text-secondary mr-3 mt-1" />
                  <span>
                    <strong>Información personal:</strong> Nombre, correo electrónico, número de teléfono y dirección.
                  </span>
                </li>
                <li className="flex items-start">
                  <FileText className="w-6 h-6 text-secondary mr-3 mt-1" />
                  <span>
                    <strong>Información de ubicación:</strong> Datos de GPS durante los viajes para garantizar la seguridad y eficiencia del servicio.
                  </span>
                </li>
                <li className="flex items-start">
                  <FileText className="w-6 h-6 text-secondary mr-3 mt-1" />
                  <span>
                    <strong>Información de pago:</strong> Datos de tarjetas de crédito/débito procesados de manera segura.
                  </span>
                </li>
              </ul>
            </section>

            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Uso de la Información</h2>
              <ul className="space-y-4 text-black">
                <li className="flex items-start">
                  <UserCheck className="w-6 h-6 text-secondary mr-3 mt-1" />
                  <span>
                    <strong>Prestación del servicio:</strong> Para facilitar los viajes y garantizar una experiencia segura.
                  </span>
                </li>
                <li className="flex items-start">
                  <UserCheck className="w-6 h-6 text-secondary mr-3 mt-1" />
                  <span>
                    <strong>Mejora del servicio:</strong> Análisis para mejorar nuestros servicios y experiencia del usuario.
                  </span>
                </li>
                <li className="flex items-start">
                  <UserCheck className="w-6 h-6 text-secondary mr-3 mt-1" />
                  <span>
                    <strong>Comunicaciones:</strong> Envío de actualizaciones importantes sobre el servicio y promociones.
                  </span>
                </li>
              </ul>
            </section>

            <section className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">Tus Derechos</h2>
              <p className="text-black mb-4">
                Como usuario de DUVI, tienes derecho a:
              </p>
              <ul className="space-y-4 text-black">
                <li>• Acceder a tus datos personales</li>
                <li>• Rectificar información inexacta</li>
                <li>• Solicitar la eliminación de tus datos</li>
                <li>• Oponerte al procesamiento de tus datos</li>
                <li>• Recibir tus datos en un formato estructurado</li>
              </ul>
            </section>
          </div>

          {/* Contact Section */}
          <section className="bg-white rounded-xl shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Contacto</h2>
            <p className="text-black mb-4">
              Si tienes preguntas sobre nuestra política de privacidad o el manejo de tus datos personales, contáctanos en:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">Email: privacidad@duvi.com</p>
              <p className="text-gray-700">Teléfono: (123) 456-7890</p>
            </div>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
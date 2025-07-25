// pages/index.js
import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Informes Financieros - Copropiedad</title>
        <meta name="description" content="Sistema de informes financieros para la copropiedad" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-blue-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Sistema de Informes Financieros</h1>
          <p className="mt-2">Copropiedad - Periodo 2024</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-10 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b pb-2">Informes Disponibles</h2>
          <p className="mb-6 text-gray-700">
            Seleccione el informe financiero que desea consultar:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Informe Financiero Básico */}
            <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-50 p-4">
                <h3 className="text-xl font-bold text-blue-800">Informe Financiero 2024</h3>
                <p className="text-black mt-2">
                  Presentación gerencial con visualización de datos clave para toma de decisiones.
                </p>
              </div>
              <div className="p-4 border-t">
                <p className="text-sm text-gray-500 mb-4">
                  <span className="font-semibold">Última actualización:</span> 08/03/2025
                </p>
                <div className="flex justify-between items-center">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    Aprobado
                  </span>
                  <Link href="/informe-financiero" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded text-sm">
                    Ver Informe
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Informe Gerencial */}
            <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-purple-50 p-4">
                <h3 className="text-xl font-bold text-purple-800">Presentación Gerencial</h3>
                <p className="text-black mt-2">
                  Presentación resumida para la junta directiva con indicadores principales.
                </p>
              </div>
              <div className="p-4 border-t">
                <p className="text-sm text-gray-500 mb-4">
                  <span className="font-semibold">Última actualización:</span> 31/12/2024
                </p>
                <div className="flex justify-between items-center">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                    Aprobado
                  </span>
                  <Link href="/informe-gerencial-2" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded text-sm">
                    Ver Informe
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Informe Financiero Detallado */}
            <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-teal-50 p-4">
                <h3 className="text-xl font-bold text-teal-800">Informe Financiero Detallado</h3>
                <p className="text-black mt-2">
                  Análisis completo basado en notas contables con recomendaciones específicas.
                </p>
              </div>
              <div className="p-4 border-t">
                <p className="text-sm text-gray-500 mb-4">
                  <span className="font-semibold">Última actualización:</span> 08/03/2025
                </p>
                <div className="flex justify-between items-center">
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                    En revisión
                  </span>
                  <Link href="/informe-financiero-detallado" className="bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded text-sm">
                    Ver Informe
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Análisis Presupuestal */}
            <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-gray-100">
              <div className="bg-gray-200 p-4">
                <h3 className="text-xl font-bold text-gray-700">Análisis Presupuestal 2025</h3>
                <p className="text-black mt-2">
                  Proyección de presupuesto para el año 2025 basado en datos históricos.
                </p>
              </div>
              <div className="p-4 border-t">
                <p className="text-sm text-gray-500 mb-4">
                  <span className="font-semibold">Programado para:</span> 15/04/2025
                </p>
                <div className="flex justify-between items-center">
                  <span className="inline-block px-3 py-1 bg-gray-300 text-gray-800 rounded-full text-xs font-semibold">
                    Próximamente
                  </span>
                  <button disabled className="bg-gray-400 text-white py-2 px-4 rounded text-sm cursor-not-allowed">
                    No disponible
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-800 border-b pb-2">Indicadores Financieros Clave</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
            <div className="border rounded-lg p-4 text-center">
              <p className="text-gray-500 text-sm">Recursos Disponibles</p>
              <p className="text-2xl font-bold text-blue-600">$36.960.135</p>
              <p className="text-xs text-gray-400">Actualizado: 31/12/2024</p>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <p className="text-gray-500 text-sm">Total Deudores</p>
              <p className="text-2xl font-bold text-orange-600">$53.908.255</p>
              <p className="text-xs text-red-500">Incremento: $29.134.507</p>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <p className="text-gray-500 text-sm">Déficit del Ejercicio</p>
              <p className="text-2xl font-bold text-red-600">$2.930.916</p>
              <p className="text-xs text-gray-400">Vigencia 2024</p>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <p className="text-gray-500 text-sm">Fondo de Imprevistos</p>
              <p className="text-2xl font-bold text-green-600">$13.107.343</p>
              <p className="text-xs text-orange-500">Por monetizar: $9.034.705</p>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/informe-financiero-detallado" className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded">
              Ver Análisis Completo
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white p-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p>Copropiedad - Sistema de Informes Financieros</p>
              <p className="text-sm text-gray-400 mt-1">© 2025 - Todos los derechos reservados</p>
            </div>
            <div className="mt-4 md:mt-0">
              <p className="text-sm">Desarrollado por Administración</p>
              <p className="text-sm text-gray-400">Versión 1.0.0</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-secondary text-gray-300 rounded-t-3xl mt-20">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Grid principal */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Columna 1 - Información de la empresa */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold mb-4">Nuestra Empresa</h3>
            <p className="text-sm leading-loose">
              Nos dedicamos a ofrecer soluciones innovadoras y servicios de alta calidad para nuestros clientes.
            </p>
          </div>

          {/* Columna 2 - Enlaces rápidos */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-white transition-colors duration-300">Inicio</a></li>
              <li><a href="/soluciones" className="hover:text-white transition-colors duration-300">Soluciones</a></li>
              <li><a href="/tecnologias" className="hover:text-white transition-colors duration-300">Tecnologiás</a></li>
             
            </ul>
          </div>

          {/* Columna 3 - Información de contacto */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin size={20} />
                <span>Calle 25 a 2 a 28 Fusagasugá - Colombia </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} /> 
                <span>6018719943</span>
                <Phone size={20} /> 
                <span>3132694664</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={20} />
                <span>info@ingenieroscolombia.com</span>
              </div>
            </div>
          </div>

          {/* Columna 4 - Redes sociales */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors duration-300">
                <Facebook size={24} />
              </a>
              
              <a href="#" className="hover:text-white transition-colors duration-300">
                <Instagram size={24} />
              </a>
              <a href="#" className="hover:text-white transition-colors duration-300">
                <Linkedin size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          {/* Footer inferior */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">
              © {new Date().getFullYear()} Ingenieros Colombia Ice Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-sm hover:text-white transition-colors duration-300">
                Política de Privacidad
              </a>
              <a href="#" className="text-sm hover:text-white transition-colors duration-300">
                Términos de Servicio
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
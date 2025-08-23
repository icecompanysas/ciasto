// components/shared/WhatsAppButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

interface FormData {
  name: string;
  phone: string;
  idNumber: string;
}

const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    idNumber: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Add a delay before showing the button for better UX
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.phone.trim())) {
      newErrors.phone = 'Ingresa un teléfono válido de 10 dígitos';
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'La cédula es requerida';
    } else if (!/^\d{8,11}$/.test(formData.idNumber.trim())) {
      newErrors.idNumber = 'Ingresa una cédula válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format the WhatsApp message with the form data
      const message = `Hola, mi nombre es *${formData.name}*. Mi número de teléfono es *${formData.phone}* y mi cédula es *${formData.idNumber}*. Quisiera obtener más información sobre sus seguros.`;
      const encodedMessage = encodeURIComponent(message);
      
      // Open WhatsApp with the pre-filled message
      window.open(`https://wa.me/573219534302?text=${encodedMessage}`, '_blank');
      
      // Close the form and reset data
      setIsOpen(false);
      setFormData({ name: '', phone: '', idNumber: '' });
    }
  };

  if (!showButton) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed right-6 bottom-6 z-50 w-16 h-16 bg-green-500 rounded-full shadow-lg flex items-center justify-center transition-all transform ${
          isOpen ? 'scale-0' : 'scale-100 hover:scale-110'
        }`}
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle className="h-8 w-8 text-white" />
        <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center animate-pulse">
          1
        </span>
      </button>

      {/* Form modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-green-500 p-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mr-3">
                  <MessageCircle className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-white text-lg font-bold">WhatsApp Contacto</h3>
                  <p className="text-green-100 text-sm">Te contestaremos en breve</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white p-1 rounded-full hover:bg-green-600 transition"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            {/* Contact form */}
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full p-3 border ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                      placeholder="Ej: Juan Pérez"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Número de teléfono
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full p-3 border ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                      placeholder="Ej: 3101234567"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">
                      Número de cédula
                    </label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleChange}
                      className={`w-full p-3 border ${
                        errors.idNumber ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500`}
                      placeholder="Ej: 1020304050"
                    />
                    {errors.idNumber && (
                      <p className="text-red-500 text-xs mt-1">{errors.idNumber}</p>
                    )}
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg flex items-center justify-center transition-colors font-medium shadow-md"
                >
                  <span>Contactar por WhatsApp</span>
                  <Send className="h-5 w-5 ml-2" />
                </button>
                
                <p className="text-xs text-gray-500 mt-4 text-center">
                  Al enviar este formulario, aceptas ser contactado por nuestro equipo. Tus datos están seguros con nosotros.
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WhatsAppButton;
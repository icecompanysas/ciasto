'use client'
import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, MessageCircle, MapPin, Clock, Star, X, Heart } from 'lucide-react';

const CiastoDeliveryApp = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('pizzas');
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [orderType, setOrderType] = useState(''); // 'mesa' o 'domicilio'
  const [selectedTable, setSelectedTable] = useState(null);

  const menuData = {
    pizzas: {
      title: "Pizzas Artesanales",
      icon: "🍕",
      items: [
        { id: 1, name: "Pizza Hawaiana", price: 14000, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&h=400&fit=crop", description: "Deliciosa pizza con jamón dulce, piña tropical fresca y abundante queso mozzarella sobre nuestra masa artesanal hecha en casa" },
        { id: 2, name: "Pizza Margarita", price: 14000, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&h=400&fit=crop", description: "La clásica pizza italiana con tomate fresco, albahaca aromática, mozzarella de búfala y un toque de aceite de oliva extra virgen" },
        { id: 3, name: "Pizza Pepperoni", price: 15000, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&h=400&fit=crop", description: "Generosas porciones de pepperoni premium con queso mozzarella derretido sobre nuestra salsa de tomate especial" },
        { id: 4, name: "Pizza Pollo Champiñones", price: 16000, image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=500&h=400&fit=crop", description: "Pollo asado jugoso, champiñones frescos salteados, queso mozzarella y nuestra salsa blanca cremosa" },
        { id: 5, name: "Pizza Mexicana", price: 18000, image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&h=400&fit=crop", description: "Explosión de sabores con jalapeños picantes, carne especiada, cebolla roja, cilantro fresco y queso mexicano" },
        { id: 6, name: "Pizza Colombiana", price: 18000, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=400&fit=crop", description: "Sabores típicos colombianos con chorizo casero, maíz tierno, aguacate fresco, queso campesino y salsa rosada" }
      ]
    },
    pannecook: {
      title: "Panne Cook",
      icon: "🥘",
      items: [
        { id: 7, name: "Pollo con Champiñones", price: 26000, image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=500&h=400&fit=crop", description: "Pechuga de pollo jugosa salteada con champiñones frescos en una cremosa salsa de vino blanco, acompañada de papas doradas" },
        { id: 8, name: "Stroganoff de Carne", price: 29000, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop", description: "Tiras de carne tierna cocinadas lentamente en salsa cremosa con champiñones, servida con papas y arroz blanco" }
      ]
    },
    lasanas: {
      title: "Lasañas Artesanales",
      icon: "🍝",
      items: [
        { id: 9, name: "Lasaña Base Plátano", price: 25000, image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=400&fit=crop", description: "Innovadora lasaña con láminas finas de plátano maduro, carne molida especiada, pollo desmenuzado o combinación mixta con queso gratinado" },
        { id: 10, name: "Lasaña Tradicional", price: 25000, image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&h=400&fit=crop", description: "Lasaña clásica con pasta fresca casera, capas de carne bolognesa, pollo en salsa blanca o combinación mixta con quesos especiales" }
      ]
    },
    pastas: {
      title: "Pastas Gourmet",
      icon: "🍜",
      items: [
        { id: 11, name: "Pasta Carbonara", price: 26000, image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=500&h=400&fit=crop", description: "Fettuccine cremoso con panceta crujiente, huevo fresco, queso parmesano auténtico y pimienta negra recién molida" },
        { id: 12, name: "Pasta Alfredo con Pollo", price: 26000, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop", description: "Deliciosos fettuccine bañados en nuestra cremosa salsa alfredo casera con pollo asado y queso parmesano" },
        { id: 13, name: "Raviolis de Res", price: 28000, image: "https://images.unsplash.com/photo-1587740908075-1ba4f250d633?w=500&h=400&fit=crop", description: "Raviolis artesanales rellenos de carne de res especiada, bañados en nuestra exclusiva salsa de la casa con hierbas finas" }
      ]
    },
    hamburguesas: {
      title: "Hamburguesas Gourmet",
      icon: "🍔",
      items: [
        { id: 14, name: "Hamburguesa Clásica", price: 28000, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop", description: "125gr de carne angus premium, queso mozzarella derretido, lechuga fresca, tomate, cebolla y salsas especiales, acompañada de papas artesanales crujientes" }
      ]
    },
    dulces: {
      title: "Antojos Dulces",
      icon: "🍰",
      items: [
        { id: 15, name: "Alfajor Artesanal", price: 4000, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop", description: "Delicioso alfajor casero con galletas suaves, dulce de leche cremoso argentino y coco rallado, horneado diariamente" },
        { id: 16, name: "Pack de 3 Alfajores", price: 10000, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop", description: "Trio de alfajores artesanales con diferentes sabores: dulce de leche clásico, chocolate y arequipe, perfectos para compartir" },
        { id: 17, name: "Milhoja Casera", price: 10000, image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=500&h=400&fit=crop", description: "Tradicional milhoja con capas crujientes de hojaldre, rellena de crema pastelera vanilla auténtica y coronada con azúcar glasé" }
      ]
    },
    bebidas: {
      title: "Bebidas Refrescantes",
      icon: "🥤",
      items: [
        { id: 18, name: "Soda Italiana Frutos Rojos", price: 10000, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=400&fit=crop", description: "Refrescante soda artesanal con mix de frutos rojos: mora, fresa y arándanos naturales, endulzada naturalmente" },
        { id: 19, name: "Soda Italiana Frutos Tropicales", price: 10000, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=500&h=400&fit=crop", description: "Deliciosa combinación tropical con maracuyá fresco y mango maduro, una explosión de sabor refrescante" },
        { id: 20, name: "Coca-Cola", price: 5000, image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500&h=400&fit=crop", description: "Refrescante Coca-Cola bien fría, el acompañante perfecto para cualquier comida" },
        { id: 21, name: "Sprite", price: 5000, image: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=500&h=400&fit=crop", description: "Sprite con limón natural, burbujeante y refrescante, ideal para limpiar el paladar" },
        { id: 22, name: "Agua Bretaña", price: 5000, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&h=400&fit=crop", description: "Agua mineral natural Bretaña, pura y cristalina directamente de los manantiales colombianos" },
        { id: 23, name: "Agua Natural", price: 5000, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=500&h=400&fit=crop", description: "Agua purificada natural, esencial para acompañar tu comida y mantenerte hidratado" },
        { id: 24, name: "Limonada Natural", price: 7000, image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&h=400&fit=crop", description: "Limonada fresca preparada al momento con limones naturales, endulzada a la perfección" },
        { id: 25, name: "Café Prensa Francesa", price: 8000, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=400&fit=crop", description: "Café gourmet 100% colombiano preparado en prensa francesa, aromático y de cuerpo completo. Sirve 2 tazas" }
      ]
    },
    cervezas: {
      title: "Cervezas Premium",
      icon: "🍺",
      items: [
        { id: 26, name: "Cerveza Águila", price: 6000, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&h=400&fit=crop", description: "Cerveza Águila, el sabor tradicional colombiano, refrescante y perfecta para acompañar" },
        { id: 27, name: "Club Colombia", price: 7000, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&h=400&fit=crop", description: "Cerveza Club Colombia premium, con carácter y sabor distintivo, ideal para momentos especiales" },
        { id: 28, name: "Corona Extra", price: 8000, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&h=400&fit=crop", description: "Cerveza Corona Extra importada, ligera y refrescante, perfecta con una rodaja de limón" },
        { id: 29, name: "Stella Artois", price: 8000, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=500&h=400&fit=crop", description: "Cerveza Stella Artois premium belga, elegante y sofisticada, con siglos de tradición cervecera" }
      ]
    },
    otros: {
      title: "Productos Especiales",
      icon: "☕",
      items: [
        { id: 30, name: "Café Andinas Coffee", price: 38000, image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=500&h=400&fit=crop", description: "Café premium 100% colombiano Andinas Coffee de 454gr, disponible molido o en grano, cultivado en las montañas andinas" }
      ]
    }
  };

  const categories = Object.keys(menuData);

  const getUserLocation = () => {
    setLocationLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          };
          setUserLocation(location);
          setLocationLoading(false);
          setDeliveryAddress(`Lat: ${location.latitude.toFixed(6)}, Lng: ${location.longitude.toFixed(6)}`);
        },
        (error) => {
          setLocationLoading(false);
          alert('No se pudo obtener la ubicación. Por favor, ingresa tu dirección manualmente.');
        }
      );
    } else {
      setLocationLoading(false);
      alert('Tu navegador no soporta geolocalización. Por favor, ingresa tu dirección manualmente.');
    }
  };

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        const updatedCart = prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        
        setAddedProduct(item);
        setShowAddedModal(true);
        setTimeout(() => {
          setShowAddedModal(false);
          setAddedProduct(null);
        }, 2000);
        
        return updatedCart;
      }
      
      const newCart = [...prevCart, { ...item, quantity: 1 }];
      
      setAddedProduct(item);
      setShowAddedModal(true);
      setTimeout(() => {
        setShowAddedModal(false);
        setAddedProduct(null);
      }, 2000);
      
      return newCart;
    });
  };

  const removeFromCart = (itemId) => {
    setCart(prevCart => {
      return prevCart.map(cartItem =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: Math.max(0, cartItem.quantity - 1) }
          : cartItem
      ).filter(cartItem => cartItem.quantity > 0);
    });
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const sendWhatsAppOrder = () => {
    // Validar según el tipo de pedido
    if (orderType === 'mesa' && !selectedTable) {
      alert('Por favor, selecciona una mesa');
      return;
    }
    
    if (orderType === 'domicilio' && !userLocation && !deliveryAddress.trim()) {
      alert('Por favor, proporciona tu ubicación o dirección de entrega');
      return;
    }
    
    const orderText = cart.map(item => 
      `${item.quantity}x ${item.name} - ${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');
    
    const total = getTotalPrice();
    
    let locationInfo = '';
    if (orderType === 'mesa') {
      locationInfo = `🍽️ *Tipo de pedido:* Mesa\n📍 *Mesa número:* ${selectedTable}`;
    } else {
      if (userLocation) {
        const wazeLink = `https://waze.com/ul?ll=${userLocation.latitude},${userLocation.longitude}&navigate=yes`;
        const googleMapsLink = `https://maps.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}`;
        locationInfo = `🚗 *Tipo de pedido:* Domicilio\n\n📍 *Coordenadas GPS:*\nLatitud: ${userLocation.latitude}\nLongitud: ${userLocation.longitude}\n\n🗺️ *Enlaces de navegación:*\nWaze: ${wazeLink}\nGoogle Maps: ${googleMapsLink}`;
        
        if (deliveryAddress.trim()) {
          locationInfo += `\n\n📝 *Dirección adicional:* ${deliveryAddress}`;
        }
      } else {
        locationInfo = `🚗 *Tipo de pedido:* Domicilio\n📍 *Dirección:* ${deliveryAddress}`;
      }
    }
    
    const message = `🍕 *PEDIDO CIASTO* 🍕\n\n${orderText}\n\n💰 *Total: ${total.toLocaleString()}*\n\n${locationInfo}\n\n¡Gracias por elegir Ciasto! 🙌`;
    
    const whatsappUrl = `https://wa.me/573175935632?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const sendWhatsAppMessage = () => {
    const message = "¡Hola! Tengo una consulta sobre el menú de Ciasto 🍕";
    const whatsappUrl = `https://wa.me/573175935632?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl font-bold text-red-600">Ciasto</h1>
                <p className="text-sm text-gray-500">Baked & Tasty</p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Chinauta, Cundinamarca</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>30-45 min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="font-semibold">4.8</span>
              </div>
            </div>

            <button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-red-600 text-white px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-red-700 transition-colors shadow-lg"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Carrito</span>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="pt-20">
        <div className="relative bg-gradient-to-r from-red-600 via-red-500 to-orange-500 text-white overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=600&fit=crop')"
            }}
          ></div>
          <div className="relative max-w-6xl mx-auto px-4 py-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Sabores Auténticos</h2>
            <p className="text-lg md:text-xl text-red-100">Pizzas artesanales, pastas frescas y delicias caseras</p>
          </div>
        </div>

        {/* Horizontal Category Scroll */}
        <div className="bg-white border-b border-gray-200 sticky top-20 z-40 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex space-x-6 overflow-x-auto scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 flex flex-col items-center space-y-3 px-6 py-4 rounded-xl transition-all ${
                    selectedCategory === category
                      ? 'bg-red-50 text-red-600 shadow-md'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-3xl">{menuData[category].icon}</span>
                  <span className="text-sm font-semibold whitespace-nowrap">{menuData[category].title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-8">
              <span className="text-4xl">{menuData[selectedCategory].icon}</span>
              <h3 className="text-3xl font-bold text-gray-900">{menuData[selectedCategory].title}</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {menuData[selectedCategory].items.map(item => (
                <div key={item.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <button className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all">
                        <Heart className="w-5 h-5 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">{item.name}</h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{item.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-red-600">
                        ${item.price.toLocaleString()}
                      </div>
                      
                      {cart.find(cartItem => cartItem.id === item.id) ? (
                        <div className="flex items-center space-x-3 bg-gray-50 rounded-xl p-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-bold min-w-8 text-center">
                            {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => addToCart(item)}
                          className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors flex items-center space-x-2 font-semibold"
                        >
                          <Plus className="w-5 h-5" />
                          <span>Agregar</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showAddedModal && addedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 animate-slideInUp shadow-2xl">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <div className="text-3xl">✅</div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">¡Producto agregado!</h3>
              <div className="flex items-center justify-center space-x-4 mb-6">
                <img 
                  src={addedProduct.image} 
                  alt={addedProduct.name}
                  className="w-16 h-16 object-cover rounded-xl"
                />
                <div className="text-left">
                  <p className="font-bold text-gray-900">{addedProduct.name}</p>
                  <p className="text-red-600 font-bold text-lg">${addedProduct.price.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-6">
                Se agregó exitosamente a tu carrito
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddedModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
                >
                  Continuar comprando
                </button>
                <button
                  onClick={() => {
                    setShowAddedModal(false);
                    setShowCart(true);
                  }}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-xl hover:bg-red-700 transition-colors font-semibold"
                >
                  Ver carrito
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
          <div className="bg-white w-full max-w-lg h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Tu pedido</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="w-20 h-20 mx-auto text-gray-300 mb-6" />
                  <p className="text-xl text-gray-500 mb-2">Tu carrito está vacío</p>
                  <p className="text-gray-400">Agrega productos deliciosos para comenzar</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-8">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center bg-gray-50 p-4 rounded-xl">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-xl mr-4"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 mb-1">{item.name}</h4>
                          <p className="text-red-600 font-bold text-lg">${item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center space-x-3 bg-white rounded-xl p-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-lg min-w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Selector de tipo de pedido */}
                  <div className="mb-8">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">¿Cómo quieres recibir tu pedido?</h4>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <button
                        onClick={() => {
                          setOrderType('mesa');
                          setUserLocation(null);
                          setDeliveryAddress('');
                        }}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          orderType === 'mesa'
                            ? 'border-orange-500 bg-orange-50 text-orange-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-4xl mb-3">🍽️</div>
                        <div className="font-bold text-lg mb-1">En Mesa</div>
                        <div className="text-sm opacity-75">Comer en el restaurante</div>
                      </button>
                      
                      <button
                        onClick={() => {
                          setOrderType('domicilio');
                          setSelectedTable(null);
                        }}
                        className={`p-6 rounded-xl border-2 transition-all ${
                          orderType === 'domicilio'
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-4xl mb-3">🚗</div>
                        <div className="font-bold text-lg mb-1">Domicilio</div>
                        <div className="text-sm opacity-75">Entrega a tu dirección</div>
                      </button>
                    </div>
                  </div>

                  {/* Selector de mesa */}
                  {orderType === 'mesa' && (
                    <div className="mb-8">
                      <h4 className="text-lg font-bold text-gray-900 mb-4">🍽️ Selecciona tu mesa</h4>
                      <div className="grid grid-cols-5 gap-3">
                        {Array.from({ length: 15 }, (_, i) => i + 1).map(tableNumber => (
                          <button
                            key={tableNumber}
                            onClick={() => setSelectedTable(tableNumber)}
                            className={`aspect-square rounded-xl border-2 flex items-center justify-center font-bold text-lg transition-all ${
                              selectedTable === tableNumber
                                ? 'border-orange-500 bg-orange-500 text-white shadow-lg'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50'
                            }`}
                          >
                            {tableNumber}
                          </button>
                        ))}
                      </div>
                      {selectedTable && (
                        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <p className="text-orange-700 font-medium">
                            ✅ Mesa {selectedTable} seleccionada
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Campo de dirección para domicilio */}
                  {orderType === 'domicilio' && (
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-3">
                        <label className="block text-lg font-bold text-gray-900">
                          🚗 Información de entrega
                        </label>
                        <button
                          onClick={getUserLocation}
                          disabled={locationLoading}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            locationLoading 
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                              : userLocation 
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          <MapPin className="w-4 h-4" />
                          <span>
                            {locationLoading ? 'Obteniendo...' : userLocation ? 'Ubicación obtenida ✓' : 'Usar mi ubicación'}
                          </span>
                        </button>
                      </div>
                      
                      {userLocation && (
                        <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                          <p className="text-sm text-green-700">
                            📍 Ubicación GPS obtenida: {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
                          </p>
                          <p className="text-xs text-green-600 mt-1">
                            Se enviará el enlace de Waze para facilitar la entrega
                          </p>
                        </div>
                      )}
                      
                      <textarea
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder={userLocation ? "Dirección adicional (opcional): apartamento, casa, punto de referencia..." : "Ingresa tu dirección completa con referencias, número de casa, barrio..."}
                        className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700"
                        rows="4"
                      />
                    </div>
                  )}
                  
                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-8">
                      <span className="text-xl font-bold text-gray-900">Total:</span>
                      <span className="text-3xl font-bold text-red-600">
                        ${getTotalPrice().toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={sendWhatsAppOrder}
                      disabled={!orderType || (orderType === 'mesa' && !selectedTable) || (orderType === 'domicilio' && !userLocation && !deliveryAddress.trim())}
                      className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center space-x-3 ${
                        (orderType && ((orderType === 'mesa' && selectedTable) || (orderType === 'domicilio' && (userLocation || deliveryAddress.trim()))))
                          ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span>Enviar pedido por WhatsApp</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Float Button */}
      <button
        onClick={sendWhatsAppMessage}
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl hover:bg-green-600 transition-all z-40 hover:scale-110"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-4xl font-bold mb-4 text-red-500">Ciasto</div>
          <p className="text-gray-400 mb-6 text-lg">Baked & Tasty - Sabores auténticos a domicilio</p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="text-center">
              <div className="font-bold mb-2 text-white">📍 Ubicación</div>
              <p className="text-gray-400">Calle los Ocobos Av. Eucaliptos<br />Chinauta, Cundinamarca</p>
            </div>
            <div className="text-center">
              <div className="font-bold mb-2 text-white">📞 Contacto</div>
              <p className="text-gray-400">317-593-5632</p>
            </div>
            <div className="text-center">
              <div className="font-bold mb-2 text-white">⏰ Horarios</div>
              <p className="text-gray-400">Entrega: 30-45 minutos<br />Lun - Dom: 11:00 AM - 10:00 PM</p>
            </div>
          </div>
        </div>
      </footer>

      <div className="h-20"></div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes slideInUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CiastoDeliveryApp;
'use client'
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Minus, MessageCircle, MapPin, Clock, Star, Phone, X } from 'lucide-react';

const CiastoDeliveryApp = () => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('pizzas');
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const menuData = {
    pizzas: {
      title: "Pizzas Artesanales",
      icon: "🍕",
      items: [
        { id: 1, name: "Hawaiana", price: 14000, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop", description: "Jamón, piña y queso mozzarella sobre masa artesanal" },
        { id: 2, name: "Margarita", price: 14000, image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400&h=300&fit=crop", description: "Tomate fresco, albahaca y mozzarella de búfala" },
        { id: 3, name: "Pepperoni/Salami", price: 15000, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop", description: "Generoso pepperoni o salami con queso mozzarella" },
        { id: 4, name: "Pollo Champiñones", price: 16000, image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400&h=300&fit=crop", description: "Pollo asado, champiñones frescos y queso mozzarella" },
        { id: 5, name: "Mexicana", price: 18000, image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400&h=300&fit=crop", description: "Jalapeños, carne especiada, cebolla roja y cilantro" },
        { id: 6, name: "Colombiana", price: 18000, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop", description: "Chorizo, maíz, aguacate y queso campesino" }
      ]
    },
    pannecook: {
      title: "Panne Cook",
      icon: "🥘",
      items: [
        { id: 7, name: "Pollo con Champiñones", price: 26000, image: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400&h=300&fit=crop", description: "Pollo jugoso salteado con champiñones en salsa cremosa" },
        { id: 8, name: "Stroganoff", price: 29000, image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop", description: "Carne tierna en salsa cremosa con champiñones y papas" }
      ]
    },
    lasanas: {
      title: "Lasañas Artesanales",
      icon: "🍝",
      items: [
        { id: 9, name: "Lasaña Base Plátano", price: 25000, image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop", description: "Innovadora lasaña con láminas de plátano, carne, pollo o mixta" },
        { id: 10, name: "Lasaña Base Pasta", price: 25000, image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=300&fit=crop", description: "Lasaña tradicional con pasta fresca, carne, pollo o mixta" }
      ]
    },
    pastas: {
      title: "Pastas",
      icon: "🍜",
      items: [
        { id: 11, name: "Carbonara", price: 26000, image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop", description: "Pasta cremosa con panceta, huevo, queso parmesano y pimienta" },
        { id: 12, name: "Pasta Alfredo con Pollo", price: 26000, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop", description: "Fettuccine en salsa alfredo cremosa con pollo asado" },
        { id: 13, name: "Raviolis de Res", price: 28000, image: "https://images.unsplash.com/photo-1587740908075-1ba4f250d633?w=400&h=300&fit=crop", description: "Raviolis artesanales rellenos de carne con nuestra salsa especial" }
      ]
    },
    hamburguesas: {
      title: "Hamburguesas",
      icon: "🍔",
      items: [
        { id: 14, name: "Hamburguesa Clásica", price: 28000, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", description: "125gr de carne angus, queso mozzarella, vegetales frescos + papas artesanales" }
      ]
    },
    dulces: {
      title: "Antojos Dulces",
      icon: "🍰",
      items: [
        { id: 15, name: "Alfajor (Unidad)", price: 4000, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop", description: "Delicioso alfajor artesanal con dulce de leche" },
        { id: 16, name: "Alfajores (X3)", price: 10000, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop", description: "Pack de 3 alfajores artesanales con dulce de leche" },
        { id: 17, name: "Milhoja", price: 10000, image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=300&fit=crop", description: "Tradicional milhoja casera con crema pastelera" }
      ]
    },
    bebidas: {
      title: "Bebidas",
      icon: "🥤",
      items: [
        { id: 18, name: "Soda Italiana Frutos Rojos", price: 10000, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop", description: "Refrescante soda con sabores de mora, fresa y arándanos" },
        { id: 19, name: "Soda Italiana Frutos Amarillos", price: 10000, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop", description: "Deliciosa combinación de maracuyá y mango natural" },
        { id: 20, name: "Coca-Cola", price: 5000, image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=400&h=300&fit=crop", description: "Refrescante Coca-Cola bien fría" },
        { id: 21, name: "Sprite", price: 5000, image: "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?w=400&h=300&fit=crop", description: "Sprite con limón natural, perfecta para refrescar" },
        { id: 22, name: "Bretaña", price: 5000, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop", description: "Agua mineral natural Bretaña" },
        { id: 23, name: "Agua Natural", price: 5000, image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop", description: "Agua purificada natural" },
        { id: 24, name: "Limonada Natural", price: 7000, image: "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=400&h=300&fit=crop", description: "Limonada fresca preparada con limones naturales" },
        { id: 25, name: "Prensa Francesa", price: 8000, image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop", description: "Café gourmet preparado en prensa francesa - 2 tazas" }
      ]
    },
    cervezas: {
      title: "Cervezas",
      icon: "🍺",
      items: [
        { id: 26, name: "Águila", price: 6000, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop", description: "Cerveza Águila, tradición colombiana" },
        { id: 27, name: "Club Colombia", price: 7000, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop", description: "Cerveza Club Colombia premium" },
        { id: 28, name: "Corona Extra", price: 8000, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop", description: "Cerveza Corona Extra importada" },
        { id: 29, name: "Stella Artois", price: 8000, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop", description: "Cerveza Stella Artois premium belga" }
      ]
    },
    otros: {
      title: "Otros Productos",
      icon: "☕",
      items: [
        { id: 30, name: "Andinas Coffee 454gr", price: 38000, image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=300&fit=crop", description: "Café premium 100% colombiano, molido o en grano" }
      ]
    }
  };

  const categories = Object.keys(menuData);

  const addToCart = (item) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        const updatedCart = prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
        
        // Mostrar modal de confirmación
        setAddedProduct(item);
        setShowAddedModal(true);
        
        // Ocultar modal después de 2 segundos
        setTimeout(() => {
          setShowAddedModal(false);
          setAddedProduct(null);
        }, 2000);
        
        return updatedCart;
      }
      
      const newCart = [...prevCart, { ...item, quantity: 1 }];
      
      // Mostrar modal de confirmación
      setAddedProduct(item);
      setShowAddedModal(true);
      
      // Ocultar modal después de 2 segundos
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
    if (!deliveryAddress.trim()) {
      alert('Por favor, ingresa tu dirección de entrega');
      return;
    }
    
    const orderText = cart.map(item => 
      `${item.quantity}x ${item.name} - ${(item.price * item.quantity).toLocaleString()}`
    ).join('\n');
    
    const total = getTotalPrice();
    const message = `🍕 *PEDIDO CIASTO* 🍕\n\n${orderText}\n\n💰 *Total: ${total.toLocaleString()}*\n\n📍 *Dirección de entrega:*\n${deliveryAddress}\n\n¡Gracias por elegir Ciasto! 🙌`;
    
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
      <header className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Info */}
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Ciasto</h1>
                <p className="text-xs text-gray-500">Baked & Tasty</p>
              </div>
            </div>

            {/* Location and Time */}
            <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>Chinauta</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>30-45 min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span>4.8</span>
              </div>
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-700 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Carrito</span>
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {getTotalItems()}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Restaurant Info Banner */}
      <div className="pt-16">
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">Ciasto</h2>
                <p className="text-red-100 mb-1">Pizzas artesanales y más</p>
                <p className="text-sm text-red-200">Chinauta, Cundinamarca • 317-593-5632</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="w-5 h-5 text-yellow-300 fill-current" />
                  <span className="text-lg font-semibold">4.8</span>
                </div>
                <p className="text-sm text-red-200">30-45 min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Horizontal Category Scroll */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="px-4 py-4">
            <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 flex flex-col items-center space-y-2 px-4 py-3 rounded-xl transition-all ${
                    selectedCategory === category
                      ? 'bg-red-50 text-red-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{menuData[category].icon}</span>
                  <span className="text-sm font-medium whitespace-nowrap">{menuData[category].title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-4 py-6">
          <div className="max-w-6xl mx-auto">
            {/* Selected Category Products */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl">{menuData[selectedCategory].icon}</span>
                <h3 className="text-2xl font-bold text-gray-900">{menuData[selectedCategory].title}</h3>
              </div>
              
              <div className="space-y-4">
                {menuData[selectedCategory].items.map(item => (
                  <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-xl overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-4">
                            <h4 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h4>
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                            <div className="text-xl font-bold text-red-600">
                              ${item.price.toLocaleString()}
                            </div>
                          </div>
                          
                          {/* Add to Cart Controls */}
                          <div className="flex items-center">
                            {cart.find(cartItem => cartItem.id === item.id) ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                                <span className="text-lg font-semibold min-w-8 text-center">
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
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-1"
                              >
                                <Plus className="w-4 h-4" />
                                <span>Agregar</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación */}
      {showAddedModal && addedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 animate-slideInUp">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="text-2xl">✅</div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">¡Producto agregado!</h3>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <img 
                  src={addedProduct.image} 
                  alt={addedProduct.name}
                  className="w-12 h-12 object-cover rounded-lg"
                />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{addedProduct.name}</p>
                  <p className="text-red-600 font-semibold">${addedProduct.price.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Se agregó a tu carrito exitosamente
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowAddedModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Continuar comprando
                </button>
                <button
                  onClick={() => {
                    setShowAddedModal(false);
                    setShowCart(true);
                  }}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
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
          <div className="bg-white w-full max-w-md h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Tu pedido</h3>
                <button
                  onClick={() => setShowCart(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">Tu carrito está vacío</p>
                  <p className="text-sm text-gray-400 mt-2">Agrega productos para comenzar</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map(item => (
                      <div key={item.id} className="flex items-center bg-gray-50 p-4 rounded-lg">
                        <div className="w-12 h-12 bg-white rounded-lg overflow-hidden mr-3">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.name}</h4>
                          <p className="text-red-600 font-semibold">${item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-semibold min-w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Campo de dirección */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      📍 Dirección de entrega
                    </label>
                    <textarea
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Ingresa tu dirección completa con referencias..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                      rows="3"
                    />
                  </div>
                  
                  <div className="border-t pt-6">
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-lg font-semibold text-gray-900">Total:</span>
                      <span className="text-2xl font-bold text-red-600">
                        ${getTotalPrice().toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={sendWhatsAppOrder}
                      disabled={!deliveryAddress.trim()}
                      className={`w-full py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${
                        deliveryAddress.trim() 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      <MessageCircle className="w-5 h-5" />
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
        className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-40"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Bottom Safe Area for Mobile */}
      <div className="h-20"></div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        @keyframes slideInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CiastoDeliveryApp;
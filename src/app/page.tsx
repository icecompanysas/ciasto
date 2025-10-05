// 'use client'
// import React, { useState, useEffect } from 'react';
// import { ShoppingCart, Plus, Minus, MessageCircle, MapPin, Clock, Star, X, Heart, Search, Filter } from 'lucide-react';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gastos-production-c86a.up.railway.app';

// interface CategoriaProducto {
//   id: number;
//   nombre: string;
//   icono: string;
//   activa: boolean;
//   orden: number;
// }

// interface Producto {
//   id: number;
//   categoria_id: number;
//   nombre: string;
//   descripcion: string;
//   precio: number;
//   imagen_url?: string;
//   disponible: boolean;
//   destacado: boolean;
//   orden: number;
//   requiere_empaque: boolean;
//   costo_empaque: number;
//   categoria: CategoriaProducto;
// }

// const CiastoDeliveryApp = () => {
//   // Estados existentes
//   const [cart, setCart] = useState([]);
//   const [showCart, setShowCart] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState('');
//   const [showAddedModal, setShowAddedModal] = useState(false);
//   const [addedProduct, setAddedProduct] = useState(null);
//   const [deliveryAddress, setDeliveryAddress] = useState('');
//   const [userLocation, setUserLocation] = useState(null);
//   const [locationLoading, setLocationLoading] = useState(false);
//   const [orderType, setOrderType] = useState('');
//   const [selectedTable, setSelectedTable] = useState(null);

//   // Nuevos estados para datos de API
//   const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
//   const [productos, setProductos] = useState<Producto[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');

//   // Cargar datos de la API
//   useEffect(() => {
//     cargarDatos();
//   }, []);

//   // Establecer categoría por defecto cuando se cargen las categorías
//   useEffect(() => {
//     if (categorias.length > 0 && !selectedCategory) {
//       setSelectedCategory(categorias[0].id.toString());
//     }
//   }, [categorias]);

//   // Funciones auxiliares
//   const formatCurrency = (amount) => {
//     return `$ ${Number(amount).toLocaleString('es-CO')}`;
//   };

//   const getTotalItems = () => {
//     return cart.reduce((total, item) => total + item.quantity, 0);
//   };

//   const getTotalPrice = () => {
//     return cart.reduce((total, item) => {
//       const productPrice = Number(item.precio) || 0;
//       const packagingCost = item.requiere_empaque ? (Number(item.costo_empaque) || 0) : 0;
//       return total + ((productPrice + packagingCost) * item.quantity);
//     }, 0);
//   };

//   const apiCall = async (endpoint: string) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}${endpoint}`);
//       if (!response.ok) {
//         throw new Error(`Error ${response.status}: ${response.statusText}`);
//       }
//       return response.json();
//     } catch (error) {
//       console.error('API Error:', error);
//       throw error;
//     }
//   };

//   const cargarDatos = async () => {
//     setLoading(true);
//     try {
//       const [categoriasRes, productosRes] = await Promise.all([
//         apiCall('/categorias-productos'),
//         apiCall('/productos')
//       ]);

//       // Filtrar solo categorías activas y ordenar
//       const categoriasActivas = categoriasRes
//         .filter(cat => cat.activa)
//         .sort((a, b) => a.orden - b.orden);

//       // Filtrar solo productos disponibles y ordenar
//       const productosDisponibles = productosRes
//         .filter(prod => prod.disponible)
//         .sort((a, b) => a.orden - b.orden);

//       setCategorias(categoriasActivas);
//       setProductos(productosDisponibles);
//     } catch (err) {
//       setError('Error al cargar los datos del menú');
//       console.error('Error cargando datos:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filtrar productos por categoría seleccionada y término de búsqueda
//   const productosFiltrados = productos.filter(producto => {
//     const matchCategoria = !selectedCategory || producto.categoria_id.toString() === selectedCategory;
//     const matchBusqueda = !searchTerm || 
//       producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
//     return matchCategoria && matchBusqueda;
//   });

//   // Productos destacados
//   const productosDestacados = productos.filter(prod => prod.destacado).slice(0, 6);

//   const getUserLocation = () => {
//     setLocationLoading(true);
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const location = {
//             latitude: position.coords.latitude,
//             longitude: position.coords.longitude
//           };
//           setUserLocation(location);
//           setLocationLoading(false);
//           // No llenar automáticamente el campo de dirección con coordenadas
//         },
//         (error) => {
//           setLocationLoading(false);
//           alert('No se pudo obtener la ubicación. Por favor, ingresa tu dirección manualmente.');
//         }
//       );
//     } else {
//       setLocationLoading(false);
//       alert('Tu navegador no soporta geolocalización. Por favor, ingresa tu dirección manualmente.');
//     }
//   };

//   const addToCart = (item) => {
//     setCart(prevCart => {
//       const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
//       if (existingItem) {
//         const updatedCart = prevCart.map(cartItem =>
//           cartItem.id === item.id
//             ? { ...cartItem, quantity: cartItem.quantity + 1 }
//             : cartItem
//         );
        
//         setAddedProduct(item);
//         setShowAddedModal(true);
//         setTimeout(() => {
//           setShowAddedModal(false);
//           setAddedProduct(null);
//         }, 2000);
        
//         return updatedCart;
//       }
      
//       const newCart = [...prevCart, { ...item, quantity: 1 }];
      
//       setAddedProduct(item);
//       setShowAddedModal(true);
//       setTimeout(() => {
//         setShowAddedModal(false);
//         setAddedProduct(null);
//       }, 2000);
      
//       return newCart;
//     });
//   };

//   const removeFromCart = (itemId) => {
//     setCart(prevCart => {
//       return prevCart.map(cartItem =>
//         cartItem.id === itemId
//           ? { ...cartItem, quantity: Math.max(0, cartItem.quantity - 1) }
//           : cartItem
//       ).filter(cartItem => cartItem.quantity > 0);
//     });
//   };

//   const sendWhatsAppOrder = () => {
//     if (orderType === 'mesa' && !selectedTable) {
//       alert('Por favor, selecciona una mesa');
//       return;
//     }
    
//     if (orderType === 'domicilio' && !userLocation && !deliveryAddress.trim()) {
//       alert('Por favor, proporciona tu ubicación o dirección de entrega');
//       return;
//     }
    
//     const orderText = cart.map(item => {
//       const productPrice = Number(item.precio) || 0;
//       const packagingCost = item.requiere_empaque ? (Number(item.costo_empaque) || 0) : 0;
//       const itemTotal = (productPrice + packagingCost) * item.quantity;
      
//       let itemLine = `${item.quantity}x ${item.nombre} - ${formatCurrency(productPrice)}`;
//       if (item.requiere_empaque && item.costo_empaque > 0) {
//         itemLine += ` (+${formatCurrency(packagingCost)} empaque)`;
//       }
//       itemLine += ` = ${formatCurrency(itemTotal)}`;
      
//       return itemLine;
//     }).join('\n');
    
//     const total = getTotalPrice();
    
//     let locationInfo = '';
//     if (orderType === 'mesa') {
//       locationInfo = `🍽️ *Tipo de pedido:* Mesa\n📍 *Mesa número:* ${selectedTable}`;
//     } else {
//       if (userLocation) {
//         const wazeLink = `https://waze.com/ul?ll=${userLocation.latitude},${userLocation.longitude}&navigate=yes`;
//         const googleMapsLink = `https://maps.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}`;
//         locationInfo = `🚗 *Tipo de pedido:* Domicilio\n\n📍 *Coordenadas GPS:*\nLatitud: ${userLocation.latitude}\nLongitud: ${userLocation.longitude}\n\n🗺️ *Enlaces de navegación:*\nWaze: ${wazeLink}\nGoogle Maps: ${googleMapsLink}`;
        
//         if (deliveryAddress.trim()) {
//           locationInfo += `\n\n📝 *Dirección adicional:* ${deliveryAddress}`;
//         }
//       } else {
//         locationInfo = `🚗 *Tipo de pedido:* Domicilio\n📍 *Dirección:* ${deliveryAddress}`;
//       }
//     }
    
//     const message = `🍕 *PEDIDO * 🍕\n\n${orderText}\n\n💰 *Total: ${formatCurrency(total)}*\n\n${locationInfo}\n\n¡Gracias por elegir Ciasto! 🙌`;
    
//     const whatsappUrl = `https://wa.me/573175935632?text=${encodeURIComponent(message)}`;
//     window.open(whatsappUrl, '_blank');
//   };

//   const sendWhatsAppMessage = () => {
//     const message = "¡Hola! Tengo una consulta sobre el menú de Ciasto 🍕";
//     const whatsappUrl = `https://wa.me/573175935632?text=${encodeURIComponent(message)}`;
//     window.open(whatsappUrl, '_blank');
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Cargando menú delicioso...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto p-6">
//           <div className="text-red-500 text-6xl mb-4">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar el menú</h2>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <button
//             onClick={cargarDatos}
//             className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
//           >
//             Reintentar
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Fixed Header - Estilo Rappi */}
//       <header className="bg-white shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
//         <div className="px-4 py-3">
//           <div className="flex items-center justify-between max-w-7xl mx-auto">
//             <div className="flex items-center space-x-4">
              
//               <div>
//                 <img src="/logo-ciasto.png" alt="Ciasto" className="h-20 w-auto" />
                
//               </div>
//             </div>

//             <div className="hidden md:flex items-center space-x-6 text-sm text-gray-600">
//               <div className="flex items-center space-x-1">
//                 <MapPin className="w-4 h-4 text-red-500" />
//                 <span>Chinauta, Cundinamarca</span>
//               </div>
//               <div className="flex items-center space-x-1">
//                 <Clock className="w-4 h-4 text-green-500" />
//                 <span>30-45 min</span>
//               </div>
//               <div className="flex items-center space-x-1">
//                 <Star className="w-4 h-4 text-yellow-500 fill-current" />
//                 <span className="font-semibold">4.8</span>
//                 <span className="text-gray-400">(200+ reseñas)</span>
//               </div>
//             </div>

//             <button
//               onClick={() => setShowCart(!showCart)}
//               className="relative bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl"
//             >
//               <ShoppingCart className="w-5 h-5" />
//               <span className="hidden sm:inline">Carrito</span>
//               {getTotalItems() > 0 && (
//                 <span className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse">
//                   {getTotalItems()}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section Mejorado */}
//       <div className="pt-16">
//         <div className="relative bg-gradient-to-br from-red-500 via-red-600 to-orange-600 text-white overflow-hidden">
//           <div className="absolute inset-0 bg-black bg-opacity-30"></div>
//           <div 
//             className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
//             style={{
//               backgroundImage: "url('https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=600&fit=crop')"
//             }}
//           ></div>
//           <div className="relative max-w-7xl mx-auto px-4 py-8">
//             <div className="text-center mb-6">
//               <h2 className="text-3xl md:text-4xl font-bold mb-2">Sabores Auténticos</h2>
//               <p className="text-lg md:text-xl text-red-100 mb-6">Pizzas artesanales, pastas frescas y delicias caseras</p>
              
//               {/* Barra de búsqueda */}
//               <div className="max-w-md mx-auto">
//                 <div className="relative">
//                   <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                   <input
//                     type="text"
//                     placeholder="Buscar en el menú..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50 text-gray-900 placeholder-gray-500"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Productos destacados */}
//             {productosDestacados.length > 0 && (
//               <div>
//                 <h3 className="text-xl font-bold mb-4 text-center">✨ Productos Destacados</h3>
//                 <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
//                   {productosDestacados.map(producto => (
//                     <div key={producto.id} className="flex-shrink-0 bg-white bg-opacity-90 rounded-xl p-4 w-64 backdrop-blur-sm">
//                       <div className="flex items-center space-x-3">
//                         <img 
//                           src={producto.imagen_url || '/placeholder-food.jpg'} 
//                           alt={producto.nombre}
//                           className="w-16 h-16 object-cover rounded-lg"
//                           onError={(e) => {
//                             e.currentTarget.src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop';
//                           }}
//                         />
//                         <div className="flex-1">
//                           <h4 className="font-bold text-gray-900 text-sm">{producto.nombre}</h4>
//                           <p className="text-red-600 font-bold">{formatCurrency(producto.precio)}</p>
//                         </div>
//                         <button
//                           onClick={() => addToCart(producto)}
//                           className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
//                         >
//                           <Plus className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Categories Navigation - Estilo Rappi */}
//         <div className="bg-white border-b border-gray-200 sticky top-16 z-40 shadow-sm">
//           <div className="max-w-7xl mx-auto px-4 py-4">
//             <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
//               {categorias.map(categoria => (
//                 <button
//                   key={categoria.id}
//                   onClick={() => setSelectedCategory(categoria.id.toString())}
//                   className={`flex-shrink-0 flex items-center space-x-2 px-4 py-3 rounded-xl transition-all font-medium ${
//                     selectedCategory === categoria.id.toString()
//                       ? 'bg-red-500 text-white shadow-md'
//                       : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                   }`}
//                 >
//                   <span className="text-lg">{categoria.icono}</span>
//                   <span className="text-sm whitespace-nowrap">{categoria.nombre}</span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           {searchTerm && (
//             <div className="mb-6">
//               <p className="text-gray-600">
//                 Resultados para: <span className="font-semibold">"{searchTerm}"</span> 
//                 ({productosFiltrados.length} productos)
//               </p>
//             </div>
//           )}

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//             {productosFiltrados.map(item => (
//               <div key={item.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
//                 <div className="relative h-48 overflow-hidden">
//                   <img 
//                     src={item.imagen_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop'} 
//                     alt={item.nombre}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.currentTarget.src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop';
//                     }}
//                   />
//                   <div className="absolute top-3 right-3 flex space-x-2">
//                     {item.destacado && (
//                       <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
//                         ⭐ Destacado
//                       </span>
//                     )}
//                     <button className="bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all">
//                       <Heart className="w-4 h-4 text-gray-400 hover:text-red-500" />
//                     </button>
//                   </div>
//                 </div>
                
//                 <div className="p-4">
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex-1">
//                       <h4 className="text-lg font-bold text-gray-900 mb-1">{item.nombre}</h4>
//                       <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{item.descripcion}</p>
//                     </div>
//                   </div>

//                   {item.requiere_empaque && item.costo_empaque > 0 && (
//                     <div className="mb-3 p-2 bg-blue-50 rounded-lg">
//                       <p className="text-xs text-blue-700">
//                         📦 Costo empaque: {formatCurrency(item.costo_empaque)}
//                       </p>
//                     </div>
//                   )}
                  
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <div className="text-xl font-bold text-red-600">
//                         {formatCurrency(item.precio)}
//                       </div>
//                       {item.requiere_empaque && item.costo_empaque > 0 && (
//                         <div className="text-sm text-gray-500">
//                           Total: {formatCurrency(Number(item.precio) + Number(item.costo_empaque))}
//                         </div>
//                       )}
//                     </div>
                    
//                     {cart.find(cartItem => cartItem.id === item.id) ? (
//                       <div className="flex items-center space-x-2 bg-gray-50 rounded-xl p-1">
//                         <button
//                           onClick={() => removeFromCart(item.id)}
//                           className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
//                         >
//                           <Minus className="w-4 h-4" />
//                         </button>
//                         <span className="text-lg font-bold min-w-8 text-center">
//                           {cart.find(cartItem => cartItem.id === item.id)?.quantity || 0}
//                         </span>
//                         <button
//                           onClick={() => addToCart(item)}
//                           className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors"
//                         >
//                           <Plus className="w-4 h-4" />
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => addToCart(item)}
//                         className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-colors flex items-center space-x-1 font-medium text-sm"
//                       >
//                         <Plus className="w-4 h-4" />
//                         <span>Agregar</span>
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {productosFiltrados.length === 0 && (
//             <div className="text-center py-16">
//               <div className="text-6xl mb-4">🔍</div>
//               <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron productos</h3>
//               <p className="text-gray-600">
//                 {searchTerm ? 
//                   `No hay productos que coincidan con "${searchTerm}"` : 
//                   'No hay productos disponibles en esta categoría'
//                 }
//               </p>
//               {searchTerm && (
//                 <button
//                   onClick={() => setSearchTerm('')}
//                   className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
//                 >
//                   Limpiar búsqueda
//                 </button>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modal de confirmación mejorado */}
//       {showAddedModal && addedProduct && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 animate-slideInUp shadow-2xl">
//             <div className="text-center">
//               <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <div className="text-2xl">✅</div>
//               </div>
//               <h3 className="text-lg font-bold text-gray-900 mb-3">¡Producto agregado!</h3>
//               <div className="flex items-center justify-center space-x-3 mb-4">
//                 <img 
//                   src={addedProduct.imagen_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop'} 
//                   alt={addedProduct.nombre}
//                   className="w-12 h-12 object-cover rounded-lg"
//                   onError={(e) => {
//                     e.currentTarget.src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop';
//                   }}
//                 />
//                 <div className="text-left">
//                   <p className="font-bold text-gray-900 text-sm">{addedProduct.nombre}</p>
//                   <p className="text-red-600 font-bold">{formatCurrency(addedProduct.precio)}</p>
//                 </div>
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => setShowAddedModal(false)}
//                   className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
//                 >
//                   Continuar
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowAddedModal(false);
//                     setShowCart(true);
//                   }}
//                   className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
//                 >
//                   Ver carrito
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Cart Sidebar Mejorado */}
//       {showCart && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
//           <div className="bg-white w-full max-w-lg h-full overflow-y-auto">
//             <div className="p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h3 className="text-xl font-bold text-gray-900">Tu pedido</h3>
//                 <button
//                   onClick={() => setShowCart(false)}
//                   className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
              
//               {cart.length === 0 ? (
//                 <div className="text-center py-16">
//                   <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
//                   <p className="text-lg text-gray-500 mb-2">Tu carrito está vacío</p>
//                   <p className="text-gray-400 text-sm">Agrega productos deliciosos para comenzar</p>
//                 </div>
//               ) : (
//                 <>
//                   <div className="space-y-3 mb-6">
//                     {cart.map(item => {
//                       const productPrice = Number(item.precio) || 0;
//                       const packagingCost = item.requiere_empaque ? (Number(item.costo_empaque) || 0) : 0;
//                       const itemTotal = (productPrice + packagingCost) * item.quantity;

//                       return (
//                         <div key={item.id} className="flex items-center bg-gray-50 p-3 rounded-xl">
//                           <img 
//                             src={item.imagen_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop'} 
//                             alt={item.nombre}
//                             className="w-14 h-14 object-cover rounded-lg mr-3"
//                             onError={(e) => {
//                               e.currentTarget.src = 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=400&fit=crop';
//                             }}
//                           />
//                           <div className="flex-1">
//                             <h4 className="font-bold text-gray-900 text-sm mb-1">{item.nombre}</h4>
//                             <div className="text-xs text-gray-600">
//                               <p>{formatCurrency(productPrice)}</p>
//                               {item.requiere_empaque && packagingCost > 0 && (
//                                 <p>+ Empaque: {formatCurrency(packagingCost)}</p>
//                               )}
//                             </div>
//                             <p className="text-red-600 font-bold text-sm">{formatCurrency(itemTotal)}</p>
//                           </div>
//                           <div className="flex items-center space-x-2 bg-white rounded-lg p-1">
//                             <button
//                               onClick={() => removeFromCart(item.id)}
//                               className="w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200"
//                             >
//                               <Minus className="w-3 h-3" />
//                             </button>
//                             <span className="font-bold text-sm min-w-6 text-center">{item.quantity}</span>
//                             <button
//                               onClick={() => addToCart(item)}
//                               className="w-7 h-7 bg-green-100 text-green-600 rounded-full flex items-center justify-center hover:bg-green-200"
//                             >
//                               <Plus className="w-3 h-3" />
//                             </button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
                  
//                   {/* Selector de tipo de pedido */}
//                   <div className="mb-6">
//                     <h4 className="text-lg font-bold text-gray-900 mb-3">¿Cómo quieres recibir tu pedido?</h4>
//                     <div className="grid grid-cols-2 gap-3 mb-4">
//                       <button
//                         onClick={() => {
//                           setOrderType('mesa');
//                           setUserLocation(null);
//                           setDeliveryAddress('');
//                         }}
//                         className={`p-4 rounded-xl border-2 transition-all ${
//                           orderType === 'mesa'
//                             ? 'border-orange-500 bg-orange-50 text-orange-700'
//                             : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
//                         }`}
//                       >
//                         <div className="text-3xl mb-2">🍽️</div>
//                         <div className="font-bold text-sm mb-1">En Mesa</div>
//                         <div className="text-xs opacity-75">Comer en el restaurante</div>
//                       </button>
                      
//                       <button
//                         onClick={() => {
//                           setOrderType('domicilio');
//                           setSelectedTable(null);
//                         }}
//                         className={`p-4 rounded-xl border-2 transition-all ${
//                           orderType === 'domicilio'
//                             ? 'border-blue-500 bg-blue-50 text-blue-700'
//                             : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
//                         }`}
//                       >
//                         <div className="text-3xl mb-2">🚗</div>
//                         <div className="font-bold text-sm mb-1">Domicilio</div>
//                         <div className="text-xs opacity-75">Entrega a tu dirección</div>
//                       </button>
//                     </div>
//                   </div>

//                   {/* Selector de mesa */}
//                   {orderType === 'mesa' && (
//                     <div className="mb-6">
//                       <h4 className="text-lg font-bold text-gray-900 mb-3">🍽️ Selecciona tu mesa</h4>
//                       <div className="grid grid-cols-5 gap-2">
//                         {Array.from({ length: 15 }, (_, i) => i + 1).map(tableNumber => (
//                           <button
//                             key={tableNumber}
//                             onClick={() => setSelectedTable(tableNumber)}
//                             className={`aspect-square rounded-lg border-2 flex items-center justify-center font-bold text-sm transition-all ${
//                               selectedTable === tableNumber
//                                 ? 'border-orange-500 bg-orange-500 text-white shadow-lg'
//                                 : 'border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:bg-orange-50'
//                             }`}
//                           >
//                             {tableNumber}
//                           </button>
//                         ))}
//                       </div>
//                       {selectedTable && (
//                         <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
//                           <p className="text-orange-700 font-medium text-sm">
//                             ✅ Mesa {selectedTable} seleccionada
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   )}

//                   {/* Campo de dirección para domicilio */}
//                   {orderType === 'domicilio' && (
//                     <div className="mb-6">
//                       <h4 className="text-lg font-bold text-gray-900 mb-3">🚗 Información de entrega</h4>
                      
//                       {/* Opción 1: Ubicación GPS */}
//                       <div className="mb-4 p-4 border-2 border-gray-200 rounded-xl">
//                         <div className="flex items-center justify-between mb-2">
//                           <div>
//                             <h5 className="font-bold text-gray-900">📍 Opción 1: Ubicación GPS</h5>
//                             <p className="text-sm text-gray-600">Más rápido y preciso para el delivery</p>
//                           </div>
//                           <button
//                             onClick={getUserLocation}
//                             disabled={locationLoading}
//                             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                               locationLoading 
//                                 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
//                                 : userLocation 
//                                   ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                                   : 'bg-blue-500 text-white hover:bg-blue-600'
//                             }`}
//                           >
//                             {locationLoading ? 'Obteniendo...' : userLocation ? 'Ubicación obtenida ✓' : 'Activar GPS'}
//                           </button>
//                         </div>
                        
//                         {userLocation && (
//                           <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
//                             <p className="text-sm text-green-700 font-medium mb-1">
//                               ✅ Ubicación GPS obtenida exitosamente
//                             </p>
//                             <p className="text-xs text-green-600">
//                               Se enviará enlace de navegación (Waze/Google Maps) para facilitar la entrega
//                             </p>
//                           </div>
//                         )}
//                       </div>

//                       {/* Separador */}
//                       <div className="flex items-center my-4">
//                         <div className="flex-1 border-t border-gray-300"></div>
//                         <span className="px-3 text-sm text-gray-500 bg-gray-50">O</span>
//                         <div className="flex-1 border-t border-gray-300"></div>
//                       </div>

//                       {/* Opción 2: Dirección manual */}
//                       <div className="mb-4">
//                         <div className="mb-2">
//                           <h5 className="font-bold text-gray-900">✏️ Opción 2: Dirección manual</h5>
//                           <p className="text-sm text-gray-600">Escribe tu dirección completa</p>
//                         </div>
                        
//                         <textarea
//                           value={deliveryAddress}
//                           onChange={(e) => setDeliveryAddress(e.target.value)}
//                           placeholder="Ej: Calle 45 # 12-34, Apartamento 301, Edificio Torres del Centro, Barrio La Esperanza. Portería color azul."
//                           className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700 text-sm"
//                           rows="3"
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                           Incluye: dirección, número de casa/apartamento, barrio y puntos de referencia
//                         </p>
//                       </div>

//                       {/* Estado de validación */}
//                       {!userLocation && !deliveryAddress.trim() && (
//                         <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                           <p className="text-sm text-yellow-700">
//                             ⚠️ Selecciona al menos una opción para poder procesar tu pedido
//                           </p>
//                         </div>
//                       )}

//                       {(userLocation || deliveryAddress.trim()) && (
//                         <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
//                           <p className="text-sm text-blue-700">
//                             ✅ Información de entrega completa
//                           </p>
//                         </div>
//                       )}
//                     </div>
//                   )}
                  
//                   <div className="border-t pt-4">
//                     <div className="flex justify-between items-center mb-6">
//                       <span className="text-lg font-bold text-gray-900">Total:</span>
//                       <span className="text-2xl font-bold text-red-600">
//                         {formatCurrency(getTotalPrice())}
//                       </span>
//                     </div>
//                     <button
//                       onClick={sendWhatsAppOrder}
//                       disabled={!orderType || (orderType === 'mesa' && !selectedTable) || (orderType === 'domicilio' && !userLocation && !deliveryAddress.trim())}
//                       className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 ${
//                         (orderType && ((orderType === 'mesa' && selectedTable) || (orderType === 'domicilio' && (userLocation || deliveryAddress.trim()))))
//                           ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg hover:shadow-xl' 
//                           : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                       }`}
//                     >
//                       <MessageCircle className="w-5 h-5" />
//                       <span>Enviar pedido por WhatsApp</span>
//                     </button>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* WhatsApp Float Button */}
//       <button
//         onClick={sendWhatsAppMessage}
//         className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-xl hover:bg-green-600 transition-all z-40 hover:scale-110"
//       >
//         <MessageCircle className="w-6 h-6" />
//       </button>

//       {/* Footer */}
//       <footer className="bg-gray-900 text-white py-8 mt-12">
//         <div className="max-w-7xl mx-auto px-4 text-center">
//           <div className="text-3xl font-bold mb-3 text-red-500">Ciasto</div>
//           <p className="text-gray-400 mb-4 text-lg">Baked & Tasty - Sabores auténticos a domicilio</p>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
//             <div className="text-center">
//               <div className="font-bold mb-2 text-white">📍 Ubicación</div>
//               <p className="text-gray-400">Calle los Ocobos Av. Eucaliptos<br />Chinauta, Cundinamarca</p>
//             </div>
//             <div className="text-center">
//               <div className="font-bold mb-2 text-white">📞 Contacto</div>
//               <p className="text-gray-400">317-593-5632</p>
//             </div>
//             <div className="text-center">
//               <div className="font-bold mb-2 text-white">⏰ Horarios</div>
//               <p className="text-gray-400">Entrega: 30-45 minutos<br />Lun - Dom: 11:00 AM - 10:00 PM</p>
//             </div>
//           </div>
//         </div>
//       </footer>

//       <div className="h-20"></div>

//       <style jsx>{`
//         .scrollbar-hide {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//         .scrollbar-hide::-webkit-scrollbar {
//           display: none;
//         }
        
//         @keyframes slideInUp {
//           from {
//             transform: translateY(30px);
//             opacity: 0;
//           }
//           to {
//             transform: translateY(0);
//             opacity: 1;
//           }
//         }
        
//         .animate-slideInUp {
//           animation: slideInUp 0.4s ease-out;
//         }

//         .line-clamp-2 {
//           display: -webkit-box;
//           -webkit-line-clamp: 2;
//           -webkit-box-orient: vertical;
//           overflow: hidden;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default CiastoDeliveryApp;

// src/app/page.tsx
'use client'
export default function PageSuspendida() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-100 text-center p-8">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        Servicio suspendido temporalmente
      </h1>
      <p className="text-lg text-gray-700">
        Este sitio se encuentra desactivado por mantenimiento o suspensión del servicio.
      </p>
    </main>
  );
}

// app/admin/dashboard/restaurante/productos/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Save, X, AlertCircle, Package, Eye, 
  Filter, Search, Download, Image as ImageIcon, DollarSign, Tag
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface CategoriaProducto {
  id: number;
  nombre: string;
  icono: string;
}

interface Producto {
  id: number;
  categoria_id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen_url?: string;
  disponible: boolean;
  destacado: boolean;
  orden: number;
  requiere_empaque: boolean;
  costo_empaque: number;
  categoria: CategoriaProducto;
  created_at?: string;
  updated_at?: string;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Estados para modal
  const [showModal, setShowModal] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    categoria_id: '',
    busqueda: '',
    disponible: ''
  });
  
  // Estado para formulario
  const [form, setForm] = useState({
    categoria_id: '',
    nombre: '',
    descripcion: '',
    precio: '',
    imagen_url: '',
    disponible: true,
    destacado: false,
    orden: 0,
    requiere_empaque: false,
    costo_empaque: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  };

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [productosRes, categoriasRes] = await Promise.all([
        apiCall('/productos'),
        apiCall('/categorias-productos')
      ]);
      
      setProductos(productosRes);
      setCategorias(categoriasRes.filter((c: any) => c.activa));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productoData = {
        categoria_id: parseInt(form.categoria_id),
        nombre: form.nombre,
        descripcion: form.descripcion,
        precio: parseFloat(form.precio),
        imagen_url: form.imagen_url || undefined,
        disponible: form.disponible,
        destacado: form.destacado,
        orden: form.orden,
        requiere_empaque: form.requiere_empaque,
        costo_empaque: form.costo_empaque ? parseFloat(form.costo_empaque) : 0
      };

      if (editingProducto) {
        await apiCall(`/productos/${editingProducto.id}`, {
          method: 'PATCH',
          body: JSON.stringify(productoData)
        });
      } else {
        await apiCall('/productos', {
          method: 'POST',
          body: JSON.stringify(productoData)
        });
      }

      resetForm();
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar producto');
    } finally {
      setLoading(false);
    }
  };

  const eliminarProducto = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
      await apiCall(`/productos/${id}`, { method: 'DELETE' });
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar producto');
    }
  };

  const toggleDisponibilidad = async (id: number) => {
    try {
      await apiCall(`/productos/${id}/toggle-disponibilidad`, {
        method: 'PATCH'
      });
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar disponibilidad');
    }
  };

  const editarProducto = (producto: Producto) => {
    setForm({
      categoria_id: producto.categoria_id.toString(),
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio.toString(),
      imagen_url: producto.imagen_url || '',
      disponible: producto.disponible,
      destacado: producto.destacado,
      orden: producto.orden,
      requiere_empaque: producto.requiere_empaque,
      costo_empaque: producto.costo_empaque ? producto.costo_empaque.toString() : ''
    });
    setEditingProducto(producto);
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      categoria_id: '',
      nombre: '',
      descripcion: '',
      precio: '',
      imagen_url: '',
      disponible: true,
      destacado: false,
      orden: 0,
      requiere_empaque: false,
      costo_empaque: ''
    });
    setEditingProducto(null);
    setShowModal(false);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const productosFiltrados = productos.filter(producto => {
    const matchCategoria = !filtros.categoria_id || producto.categoria_id.toString() === filtros.categoria_id;
    const matchBusqueda = !filtros.busqueda || 
      producto.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      producto.descripcion?.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const matchDisponible = filtros.disponible === '' || 
      (filtros.disponible === 'true' && producto.disponible) ||
      (filtros.disponible === 'false' && !producto.disponible);
    
    return matchCategoria && matchBusqueda && matchDisponible;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos del Restaurante</h1>
          <p className="text-gray-600">Gestiona los productos del menú</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
            <button onClick={() => setError('')} className="ml-auto">
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900">{productos.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">
                {productos.filter(p => p.disponible).length}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Destacados</p>
              <p className="text-2xl font-bold text-gray-900">
                {productos.filter(p => p.destacado).length}
              </p>
            </div>
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Precio Promedio</p>
              <p className="text-2xl font-bold text-gray-900">
                {productos.length > 0 
                  ? formatCurrency(productos.reduce((sum, p) => sum + p.precio, 0) / productos.length)
                  : '$0'
                }
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filtros
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={filtros.categoria_id}
              onChange={(e) => setFiltros({...filtros, categoria_id: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(categoria => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.icono} {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Disponibilidad
            </label>
            <select
              value={filtros.disponible}
              onChange={(e) => setFiltros({...filtros, disponible: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="true">Disponibles</option>
              <option value="false">No disponibles</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buscar
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar producto..."
                value={filtros.busqueda}
                onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>
          
          <div className="flex items-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Aplicar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Productos ({productosFiltrados.length})
          </h3>
          <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
            <Download className="w-4 h-4" />
            <span>Exportar</span>
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Cargando...</p>
          </div>
        ) : (
          <div className="p-6">
            {productosFiltrados.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No hay productos para mostrar</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Agregar primer producto
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productosFiltrados.map((producto) => (
                  <div 
                    key={producto.id} 
                    className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Imagen */}
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      {producto.imagen_url ? (
                        <img 
                          src={producto.imagen_url} 
                          alt={producto.nombre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Contenido */}
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{producto.nombre}</h4>
                          <p className="text-sm text-gray-500 mt-1">{producto.descripcion}</p>
                        </div>
                        <div className="flex space-x-1 ml-2">
                          <button
                            onClick={() => editarProducto(producto)}
                            className="text-blue-600 hover:text-blue-900 p-1"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => eliminarProducto(producto.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Precio y categoría */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-green-600">
                          {formatCurrency(producto.precio)}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{producto.categoria.icono}</span>
                          <span className="text-sm text-gray-600">{producto.categoria.nombre}</span>
                        </div>
                      </div>

                      {/* Empaque */}
                      {producto.requiere_empaque && (
                        <div className="text-sm text-gray-500 mb-3">
                          📦 Empaque: {formatCurrency(producto.costo_empaque)}
                        </div>
                      )}

                      {/* Badges */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {producto.destacado && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                            ⭐ Destacado
                          </span>
                        )}
                        <button
                          onClick={() => toggleDisponibilidad(producto.id)}
                          className={`px-2 py-1 text-xs rounded-full ${
                            producto.disponible 
                              ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {producto.disponible ? '✅ Disponible' : '❌ No disponible'}
                        </button>
                      </div>

                      {/* Orden */}
                      <div className="text-xs text-gray-500">
                        <p><strong>Orden:</strong> {producto.orden}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-xl bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingProducto ? 'Editar Producto' : 'Nuevo Producto'}
              </h3>
              <button onClick={resetForm}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            <form onSubmit={guardarProducto} className="space-y-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.nombre}
                    onChange={(e) => setForm({...form, nombre: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del producto"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.precio}
                    onChange={(e) => setForm({...form, precio: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción *
                </label>
                <textarea
                  required
                  value={form.descripcion}
                  onChange={(e) => setForm({...form, descripcion: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descripción del producto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  required
                  value={form.categoria_id}
                  onChange={(e) => setForm({...form, categoria_id: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.icono} {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de la imagen
                </label>
                <input
                  type="url"
                  value={form.imagen_url}
                  onChange={(e) => setForm({...form, imagen_url: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orden
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.orden}
                    onChange={(e) => setForm({...form, orden: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Costo de empaque
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.costo_empaque}
                    onChange={(e) => setForm({...form, costo_empaque: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.disponible}
                    onChange={(e) => setForm({...form, disponible: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Disponible
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.destacado}
                    onChange={(e) => setForm({...form, destacado: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Destacado
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.requiere_empaque}
                    onChange={(e) => setForm({...form, requiere_empaque: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Requiere empaque
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingProducto ? 'Actualizar' : 'Guardar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
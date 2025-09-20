// app/admin/dashboard/restaurante/productos/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import {
  Plus, Edit, Trash2, Save, X, AlertCircle, Package, Eye,
  Filter, Search, Download, Image as ImageIcon, DollarSign, Tag, Upload, Settings
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gastos-production-c86a.up.railway.app';

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
  tiene_variaciones: boolean;
  categoria: CategoriaProducto;
  grupos_variacion?: any[];
  created_at?: string;
  updated_at?: string;
}
interface GrupoVariacion {
  id: number;
  nombre: string;
  descripcion?: string;
  es_obligatorio: boolean;
  permite_multiple: boolean;
  activo: boolean;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showVariationsModal, setShowVariationsModal] = useState(false);
  const [selectedProductoForVariations, setSelectedProductoForVariations] = useState<Producto | null>(null);
  const [selectedVariaciones, setSelectedVariaciones] = useState<number[]>([]);
  const [gruposVariacion, setGruposVariacion] = useState<GrupoVariacion[]>([]);

  // Estados para modal
  const [showModal, setShowModal] = useState(false);
  const [editingProducto, setEditingProducto] = useState<Producto | null>(null);

  // Estados para filtros
  const [filtros, setFiltros] = useState({
    categoria_id: '',
    busqueda: '',
    disponible: ''
  });

  // Estado para formulario - ELIMINADO imagen_url, AGREGADO archivo
  const [form, setForm] = useState({
    categoria_id: '',
    nombre: '',
    descripcion: '',
    precio: '',
    disponible: true,
    destacado: false,
    orden: 0,
    requiere_empaque: false,
    costo_empaque: ''
  });

  // Estado para el archivo de imagen
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    cargarDatos();
  }, []);


  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          // NO agregar Content-Type para FormData, el navegador lo hace automáticamente
          ...(token && { 'Authorization': `Bearer ${token}` }),
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Si no puede parsear JSON, usar mensaje por defecto
        }
        throw new Error(errorMessage);
      }

      // AGREGAR ESTA VALIDACIÓN:
      // Verificar si hay contenido antes de parsear JSON
      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');

      // Si no hay contenido o no es JSON, devolver objeto vacío
      if (contentLength === '0' || !contentType || !contentType.includes('application/json')) {
        return {};
      }

      const text = await response.text();
      return text ? JSON.parse(text) : {};

    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };
  const cargarDatos = async () => {
  setLoading(true);
  try {
    const [productosRes, categoriasRes, gruposRes] = await Promise.all([
      apiCall('/productos/con-variaciones'), // Cambiar este endpoint
      apiCall('/categorias-productos'),
      apiCall('/grupos-variacion') // Agregar esta línea
    ]);
    
    setProductos(productosRes);
    setCategorias(categoriasRes.filter((c: any) => c.activa));
    setGruposVariacion(gruposRes); // Agregar esta línea
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error al cargar datos');
  } finally {
    setLoading(false);
  }
};;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten archivos de imagen');
        return;
      }

      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Máximo 5MB permitido');
        return;
      }

      setSelectedFile(file);

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const guardarProducto = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validaciones adicionales antes de enviar
      if (!form.categoria_id || isNaN(parseInt(form.categoria_id))) {
        throw new Error('Debe seleccionar una categoría válida');
      }

      if (!form.precio || isNaN(parseFloat(form.precio)) || parseFloat(form.precio) <= 0) {
        throw new Error('El precio debe ser un número mayor a 0');
      }

      if (form.costo_empaque && isNaN(parseFloat(form.costo_empaque))) {
        throw new Error('El costo de empaque debe ser un número válido');
      }

      // Crear FormData para envío multipart
      const formData = new FormData();

      // Agregar datos del producto con conversión de tipos correcta
      formData.append('categoria_id', parseInt(form.categoria_id).toString());
      formData.append('nombre', form.nombre.trim());
      formData.append('descripcion', form.descripcion.trim());
      formData.append('precio', parseFloat(form.precio).toString());
      formData.append('disponible', form.disponible ? 'true' : 'false');
      formData.append('destacado', form.destacado ? 'true' : 'false');
      formData.append('orden', parseInt(form.orden.toString()).toString());
      formData.append('requiere_empaque', form.requiere_empaque ? 'true' : 'false');
      formData.append('costo_empaque', form.costo_empaque ? parseFloat(form.costo_empaque).toString() : '0');

      // DEBUG: Verificar valores de booleanos
      console.log('🔍 Valores booleanos:');
      console.log('form.destacado:', form.destacado, typeof form.destacado);
      console.log('form.disponible:', form.disponible, typeof form.disponible);
      console.log('form.requiere_empaque:', form.requiere_empaque, typeof form.requiere_empaque);

      // Agregar imagen solo si hay un archivo nuevo seleccionado
      if (selectedFile) {
        formData.append('imagen', selectedFile);
        console.log('📷 Imagen nueva seleccionada para subir');
      } else {
        console.log('📷 No hay imagen nueva - mantiene la actual');
      }

      // Debug: Mostrar qué se está enviando
      console.log('📝 Datos que se envían:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      let response;
      if (editingProducto) {
        // Si estamos editando y NO hay archivo nuevo, usar endpoint normal sin imagen
        if (!selectedFile) {
          // Usar endpoint PATCH normal para solo actualizar datos
          const jsonData = {
            categoria_id: parseInt(form.categoria_id),
            nombre: form.nombre.trim(),
            descripcion: form.descripcion.trim(),
            precio: parseFloat(form.precio),
            disponible: form.disponible,
            destacado: form.destacado,
            orden: parseInt(form.orden.toString()),
            requiere_empaque: form.requiere_empaque,
            costo_empaque: form.costo_empaque ? parseFloat(form.costo_empaque) : 0
          };

          response = await fetch(`${API_BASE_URL}/productos/${editingProducto.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
            },
            body: JSON.stringify(jsonData)
          });
        } else {
          // Hay imagen nueva, usar endpoint with-image
          response = await fetch(`${API_BASE_URL}/productos/${editingProducto.id}/with-image`, {
            method: 'PATCH',
            headers: {
              'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
            },
            body: formData
          });
        }
      } else {
        // Crear producto nuevo siempre usa with-image (aunque no tenga imagen)
        response = await fetch(`${API_BASE_URL}/productos/with-image`, {
          method: 'POST',
          headers: {
            'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
          },
          body: formData
        });
      }

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Si no puede parsear JSON, usar mensaje por defecto
        }
        throw new Error(errorMessage);
      }

      resetForm();
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar producto');
      console.error('Error guardando producto:', err);
    } finally {
      setLoading(false);
    }
  };
  // Función para gestionar variaciones de un producto
  const gestionarVariaciones = async (producto: Producto) => {
    try {
      // Cargar variaciones actuales del producto
      const productoConVariaciones = await apiCall(`/productos/${producto.id}/variaciones`);
      setSelectedProductoForVariations(productoConVariaciones);

      // Establecer variaciones seleccionadas actuales
      const variacionesActuales = productoConVariaciones.grupos_variacion?.map((pv: any) => pv.grupo.id) || [];
      setSelectedVariaciones(variacionesActuales);

      setShowVariationsModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar variaciones');
    }
  };

  // Función para guardar variaciones
  const guardarVariaciones = async () => {
    if (!selectedProductoForVariations) return;

    setLoading(true);
    try {
      await apiCall(`/productos/${selectedProductoForVariations.id}/asignar-variaciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grupos_ids: selectedVariaciones })
      });

      setShowVariationsModal(false);
      setSelectedProductoForVariations(null);
      setSelectedVariaciones([]);
      await cargarDatos(); // Recargar para ver cambios
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar variaciones');
    } finally {
      setLoading(false);
    }
  };
  const eliminarProducto = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este producto? Esta acción eliminará también su imagen.')) return;

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
      disponible: producto.disponible,
      destacado: producto.destacado,
      orden: producto.orden,
      requiere_empaque: producto.requiere_empaque,
      costo_empaque: producto.costo_empaque ? producto.costo_empaque.toString() : ''
    });

    // CORREGIDO: Mostrar imagen actual pero NO establecer como archivo seleccionado
    if (producto.imagen_url) {
      setImagePreview(producto.imagen_url);
      setSelectedFile(null); // ⭐ IMPORTANTE: No hay archivo nuevo seleccionado
    } else {
      setImagePreview('');
      setSelectedFile(null);
    }

    setEditingProducto(producto);
    setShowModal(true);
    setError(''); // Limpiar errores
  };

  const resetForm = () => {
    setForm({
      categoria_id: '',
      nombre: '',
      descripcion: '',
      precio: '',
      disponible: true,
      destacado: false,
      orden: 0,
      requiere_empaque: false,
      costo_empaque: ''
    });
    setEditingProducto(null);
    setShowModal(false);
    setSelectedFile(null);
    setImagePreview('');
    setError(''); // Limpiar errores
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
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-800 flex-1">{error}</span>
            <button
              onClick={() => setError('')}
              className="ml-auto hover:bg-red-100 rounded p-1"
            >
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
              onChange={(e) => setFiltros({ ...filtros, categoria_id: e.target.value })}
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
              onChange={(e) => setFiltros({ ...filtros, disponible: e.target.value })}
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
                onChange={(e) => setFiltros({ ...filtros, busqueda: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="flex items-end">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors">
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
          <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1 transition-colors">
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
                <h4 className="text-lg font-medium text-gray-900 mb-2">No hay productos para mostrar</h4>
                <p className="text-gray-500 mb-4">Comienza agregando tu primer producto al menú</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
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
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      )}
                      <div className="hidden">
                        <ImageIcon className="w-12 h-12 text-gray-400" />
                      </div>
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
                            disabled={loading}
                            className="text-blue-600 hover:text-blue-900 p-1 disabled:opacity-50 transition-colors"
                            title="Editar producto"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => gestionarVariaciones(producto)}
                            disabled={loading}
                            className="text-purple-600 hover:text-purple-900 p-1 disabled:opacity-50 transition-colors"
                            title="Gestionar variaciones"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => eliminarProducto(producto.id)}
                            disabled={loading}
                            className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50 transition-colors"
                            title="Eliminar producto"
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
                        {producto.tiene_variaciones && (
  <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
    🔧 Con variaciones
  </span>
)}
                        <button
                          onClick={() => toggleDisponibilidad(producto.id)}
                          disabled={loading}
                          className={`px-2 py-1 text-xs rounded-full transition-colors disabled:opacity-50 ${producto.disponible
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
              <button
                onClick={resetForm}
                disabled={loading}
                className="disabled:opacity-50"
              >
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
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nombre del producto"
                    disabled={loading}
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
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    disabled={loading}
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
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Descripción del producto"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <select
                  required
                  value={form.categoria_id}
                  onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="">Seleccionar categoría</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id} value={categoria.id}>
                      {categoria.icono} {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Campo para carga de imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen del producto
                </label>
                <div className="space-y-4">
                  {/* Input file */}
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click para subir</span> o arrastra y suelta
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, JPEG hasta 5MB</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={loading}
                      />
                    </label>
                  </div>

                  {/* Preview de la imagen */}
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setImagePreview('');
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        disabled={loading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {selectedFile && (
                    <p className="text-sm text-gray-600">
                      Archivo seleccionado: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
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
                    onChange={(e) => setForm({ ...form, orden: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">Orden de visualización en el menú</p>
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
                    onChange={(e) => setForm({ ...form, costo_empaque: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    disabled={loading}
                  />
                  <p className="text-xs text-gray-500 mt-1">Costo adicional por empaque (opcional)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.disponible}
                    onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Disponible
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.destacado}
                    onChange={(e) => setForm({ ...form, destacado: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Destacado
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.requiere_empaque}
                    onChange={(e) => setForm({ ...form, requiere_empaque: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Requiere empaque
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !form.nombre.trim() || !form.descripcion.trim() || !form.precio || !form.categoria_id}
                  className="px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
                >
                  {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                  <Save className="w-4 h-4" />
                  <span>{editingProducto ? 'Actualizar' : 'Guardar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Variaciones */}
      {showVariationsModal && selectedProductoForVariations && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-xl bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Gestionar Variaciones: {selectedProductoForVariations.nombre}
              </h3>
              <button
                onClick={() => {
                  setShowVariationsModal(false);
                  setSelectedProductoForVariations(null);
                  setSelectedVariaciones([]);
                }}
                disabled={loading}
                className="disabled:opacity-50"
              >
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Selecciona los grupos de variación que aplicarán a este producto.
                Los clientes podrán elegir opciones de cada grupo seleccionado.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-blue-900 mb-2">💡 ¿Cómo funciona?</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>Grupos obligatorios:</strong> El cliente DEBE elegir una opción</li>
                  <li>• <strong>Grupos opcionales:</strong> El cliente puede elegir o no</li>
                  <li>• <strong>Selección múltiple:</strong> Permite elegir varias opciones del mismo grupo</li>
                  <li>• <strong>Precios adicionales:</strong> Se suman al precio base del producto</li>
                </ul>
              </div>

              {gruposVariacion.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 text-gray-400 mx-auto mb-4">📦</div>
                  <p className="text-gray-500 mb-4">No hay grupos de variación disponibles</p>
                  <button
                    onClick={() => window.open('/admin/dashboard/restaurante/variaciones', '_blank')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Crear grupos de variación
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {gruposVariacion.map(grupo => (
                    <div key={grupo.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedVariaciones.includes(grupo.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedVariaciones([...selectedVariaciones, grupo.id]);
                            } else {
                              setSelectedVariaciones(selectedVariaciones.filter(id => id !== grupo.id));
                            }
                          }}
                          className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        />
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 flex items-center space-x-2">
                            <span>{grupo.nombre}</span>
                            {grupo.es_obligatorio && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                Obligatorio
                              </span>
                            )}
                            {grupo.permite_multiple && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Múltiple
                              </span>
                            )}
                          </h5>
                          {grupo.descripcion && (
                            <p className="text-sm text-gray-600 mt-1">{grupo.descripcion}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                onClick={() => {
                  setShowVariationsModal(false);
                  setSelectedProductoForVariations(null);
                  setSelectedVariaciones([]);
                }}
                disabled={loading}
                className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardarVariaciones}
                disabled={loading}
                className="px-6 py-3 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
              >
                {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                <Save className="w-4 h-4" />
                <span>Guardar Variaciones</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
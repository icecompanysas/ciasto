// app/admin/dashboard/restaurante/categorias/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Save, X, AlertCircle, Tag, Package
} from 'lucide-react';

// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface CategoriaProducto {
  id: number;
  nombre: string;
  descripcion?: string;
  icono: string;
  activa: boolean;
  orden: number;
  productos?: any[]; // Los productos relacionados
  created_at?: string;
  updated_at?: string;
}

export default function CategoriasProductosPage() {
  const [categorias, setCategorias] = useState<CategoriaProducto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Estados para modal
  const [showModal, setShowModal] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<CategoriaProducto | null>(null);
  
  // Estado para formulario
  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    icono: '🍽️',
    activa: true,
    orden: 0
  });

  // Cargar datos iniciales
  useEffect(() => {
    cargarCategorias();
  }, []);

  const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  try {
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
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Si no puede parsear JSON, usar mensaje por defecto
      }
      throw new Error(errorMessage);
    }

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

  const cargarCategorias = async () => {
    setLoading(true);
    try {
      const response = await apiCall('/categorias-productos');
      setCategorias(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const guardarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCategoria) {
        await apiCall(`/categorias-productos/${editingCategoria.id}`, {
          method: 'PATCH',
          body: JSON.stringify(form)
        });
      } else {
        await apiCall('/categorias-productos', {
          method: 'POST',
          body: JSON.stringify(form)
        });
      }

      resetForm();
      await cargarCategorias();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar categoría');
    } finally {
      setLoading(false);
    }
  };

  const eliminarCategoria = async (id: number) => {
    if (!confirm('¿Estás seguro de desactivar esta categoría?')) return;
    
    try {
      await apiCall(`/categorias-productos/${id}`, { method: 'DELETE' });
      await cargarCategorias();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al desactivar categoría');
    }
  };

  const toggleEstado = async (categoria: CategoriaProducto) => {
    try {
      await apiCall(`/categorias-productos/${categoria.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ...categoria, activa: !categoria.activa })
      });
      await cargarCategorias();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado');
    }
  };

  const editarCategoria = (categoria: CategoriaProducto) => {
    setForm({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
      icono: categoria.icono,
      activa: categoria.activa,
      orden: categoria.orden
    });
    setEditingCategoria(categoria);
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      nombre: '',
      descripcion: '',
      icono: '🍽️',
      activa: true,
      orden: 0
    });
    setEditingCategoria(null);
    setShowModal(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías de Productos</h1>
          <p className="text-gray-600">Gestiona las categorías de productos del menú</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Categoría</span>
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

      {/* Stats rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Categorías</p>
              <p className="text-2xl font-bold text-gray-900">{categorias.length}</p>
            </div>
            <Tag className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Activas</p>
              <p className="text-2xl font-bold text-gray-900">
                {categorias.filter(c => c.activa).length}
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
              <p className="text-sm font-medium text-gray-600">Total Productos</p>
              <p className="text-2xl font-bold text-gray-900">
                {categorias.reduce((total, cat) => total + (cat.productos?.length || 0), 0)}
              </p>
            </div>
            <Package className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Lista de Categorías */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Categorías ({categorias.length})
          </h3>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Cargando...</p>
          </div>
        ) : (
          <div className="p-6">
            {categorias.length === 0 ? (
              <div className="text-center py-12">
                <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No hay categorías creadas</p>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Crear primera categoría
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorias.map((categoria) => (
                  <div 
                    key={categoria.id} 
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {categoria.icono}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{categoria.nombre}</h4>
                          {categoria.descripcion && (
                            <p className="text-sm text-gray-500">{categoria.descripcion}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editarCategoria(categoria)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => eliminarCategoria(categoria.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <p>Orden: {categoria.orden}</p>
                        <p>Productos: {categoria.productos?.length || 0}</p>
                      </div>
                      <button
                        onClick={() => toggleEstado(categoria)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          categoria.activa 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {categoria.activa ? 'Activa' : 'Inactiva'}
                      </button>
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
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/3 shadow-lg rounded-xl bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button onClick={resetForm}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            <form onSubmit={guardarCategoria} className="space-y-6">
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
                  placeholder="Ej: Entradas, Platos principales, Bebidas"
                  maxLength={100}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({...form, descripcion: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descripción opcional de la categoría"
                  maxLength={200}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icono
                  </label>
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl p-2 border rounded-lg">
                      {form.icono}
                    </div>
                    <input
                      type="text"
                      value={form.icono}
                      onChange={(e) => setForm({...form, icono: e.target.value})}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="🍽️"
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Puedes usar emojis como icono</p>
                </div>
                
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
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={form.activa}
                  onChange={(e) => setForm({...form, activa: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Categoría activa
                </label>
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
                  <span>{editingCategoria ? 'Actualizar' : 'Guardar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
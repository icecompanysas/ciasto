// app/admin/dashboard/restaurante/variaciones/page.tsx
'use client'
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Save, X, AlertCircle, Settings, Eye, 
  Filter, Search, Download, Image as ImageIcon, DollarSign, Tag, Upload,
  Layers, Grid, ToggleLeft, ToggleRight
} from 'lucide-react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://gastos-production-c86a.up.railway.app';

interface GrupoVariacion {
  id: number;
  nombre: string;
  descripcion?: string;
  es_obligatorio: boolean;
  permite_multiple: boolean;
  minimo_selecciones: number;
  maximo_selecciones?: number;
  orden: number;
  activo: boolean;
  opciones?: OpcionVariacion[];
}

interface OpcionVariacion {
  id: number;
  grupo_id: number;
  nombre: string;
  descripcion?: string;
  precio_adicional: number;
  disponible: boolean;
  orden: number;
  imagen_url?: string;
  grupo?: GrupoVariacion;
}

export default function VariacionesPage() {
  const [grupos, setGrupos] = useState<GrupoVariacion[]>([]);
  const [opciones, setOpciones] = useState<OpcionVariacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Estados para modales
  const [showModalGrupo, setShowModalGrupo] = useState(false);
  const [showModalOpcion, setShowModalOpcion] = useState(false);
  const [editingGrupo, setEditingGrupo] = useState<GrupoVariacion | null>(null);
  const [editingOpcion, setEditingOpcion] = useState<OpcionVariacion | null>(null);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    grupoId: '',
    busqueda: '',
    disponible: ''
  });
  
  // Estados para formularios
  const [formGrupo, setFormGrupo] = useState({
    nombre: '',
    descripcion: '',
    es_obligatorio: false,
    permite_multiple: false,
    minimo_selecciones: 1,
    maximo_selecciones: '',
    orden: 0
  });

  const [formOpcion, setFormOpcion] = useState({
    grupo_id: '',
    nombre: '',
    descripcion: '',
    precio_adicional: '',
    disponible: true,
    orden: 0
  });

  // Estado para archivo de imagen de opciones
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

      const contentType = response.headers.get('content-type');
      const contentLength = response.headers.get('content-length');
      
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
      const [gruposRes, opcionesRes] = await Promise.all([
        apiCall('/grupos-variacion?incluir_opciones=true'),
        apiCall('/opciones-variacion')
      ]);
      
      setGrupos(gruposRes);
      setOpciones(opcionesRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Solo se permiten archivos de imagen');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('El archivo es demasiado grande. Máximo 5MB permitido');
        return;
      }

      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const guardarGrupo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const jsonData = {
        ...formGrupo,
        maximo_selecciones: formGrupo.maximo_selecciones ? parseInt(formGrupo.maximo_selecciones) : null
      };

      if (editingGrupo) {
        await apiCall(`/grupos-variacion/${editingGrupo.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jsonData)
        });
      } else {
        await apiCall('/grupos-variacion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(jsonData)
        });
      }

      resetFormGrupo();
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar grupo');
    } finally {
      setLoading(false);
    }
  };

  const guardarOpcion = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    let endpoint = '/opciones-variacion';
    let method = 'POST';

    if (editingOpcion) {
      endpoint = `/opciones-variacion/${editingOpcion.id}`;
      method = 'PATCH';
    }

    // Siempre usar JSON para crear/editar opciones (más simple)
    const jsonData = {
      grupo_id: parseInt(formOpcion.grupo_id),
      nombre: formOpcion.nombre.trim(),
      descripcion: formOpcion.descripcion?.trim() || null,
      precio_adicional: parseFloat(formOpcion.precio_adicional) || 0,
      disponible: formOpcion.disponible,
      orden: formOpcion.orden
    };

    console.log('Enviando datos:', jsonData); // Para debug

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json', // ← ESTO FALTABA
        'Authorization': localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : '',
      },
      body: JSON.stringify(jsonData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al guardar opción');
    }

    resetFormOpcion();
    await cargarDatos();
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Error al guardar opción');
    console.error('Error:', err);
  } finally {
    setLoading(false);
  }
};
  const eliminarGrupo = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este grupo? Esto eliminará también todas sus opciones.')) return;
    
    try {
      await apiCall(`/grupos-variacion/${id}`, { method: 'DELETE' });
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar grupo');
    }
  };

  const eliminarOpcion = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar esta opción?')) return;
    
    try {
      await apiCall(`/opciones-variacion/${id}`, { method: 'DELETE' });
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar opción');
    }
  };

  const toggleActivoGrupo = async (id: number) => {
    try {
      await apiCall(`/grupos-variacion/${id}/toggle-activo`, { method: 'PATCH' });
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado');
    }
  };

  const toggleDisponibleOpcion = async (id: number) => {
    try {
      await apiCall(`/opciones-variacion/${id}/toggle-disponible`, { method: 'PATCH' });
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar disponibilidad');
    }
  };

  const editarGrupo = (grupo: GrupoVariacion) => {
    setFormGrupo({
      nombre: grupo.nombre,
      descripcion: grupo.descripcion || '',
      es_obligatorio: grupo.es_obligatorio,
      permite_multiple: grupo.permite_multiple,
      minimo_selecciones: grupo.minimo_selecciones,
      maximo_selecciones: grupo.maximo_selecciones?.toString() || '',
      orden: grupo.orden
    });
    setEditingGrupo(grupo);
    setShowModalGrupo(true);
    setError('');
  };

  const editarOpcion = (opcion: OpcionVariacion) => {
    setFormOpcion({
      grupo_id: opcion.grupo_id.toString(),
      nombre: opcion.nombre,
      descripcion: opcion.descripcion || '',
      precio_adicional: opcion.precio_adicional.toString(),
      disponible: opcion.disponible,
      orden: opcion.orden
    });
    
    if (opcion.imagen_url) {
      setImagePreview(opcion.imagen_url);
      setSelectedFile(null);
    } else {
      setImagePreview('');
      setSelectedFile(null);
    }
    
    setEditingOpcion(opcion);
    setShowModalOpcion(true);
    setError('');
  };

  const resetFormGrupo = () => {
    setFormGrupo({
      nombre: '',
      descripcion: '',
      es_obligatorio: false,
      permite_multiple: false,
      minimo_selecciones: 1,
      maximo_selecciones: '',
      orden: 0
    });
    setEditingGrupo(null);
    setShowModalGrupo(false);
    setError('');
  };

  const resetFormOpcion = () => {
    setFormOpcion({
      grupo_id: '',
      nombre: '',
      descripcion: '',
      precio_adicional: '',
      disponible: true,
      orden: 0
    });
    setEditingOpcion(null);
    setShowModalOpcion(false);
    setSelectedFile(null);
    setImagePreview('');
    setError('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const opcionesFiltradas = opciones.filter(opcion => {
    const matchGrupo = !filtros.grupoId || opcion.grupo_id.toString() === filtros.grupoId;
    const matchBusqueda = !filtros.busqueda || 
      opcion.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      opcion.descripcion?.toLowerCase().includes(filtros.busqueda.toLowerCase());
    const matchDisponible = filtros.disponible === '' || 
      (filtros.disponible === 'true' && opcion.disponible) ||
      (filtros.disponible === 'false' && !opcion.disponible);
    
    return matchGrupo && matchBusqueda && matchDisponible;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Variaciones de Productos</h1>
          <p className="text-gray-600">Gestiona grupos y opciones de variación (sabores, tamaños, etc.)</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowModalGrupo(true)}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
          >
            <Layers className="w-4 h-4" />
            <span>Nuevo Grupo</span>
          </button>
          <button
            onClick={() => setShowModalOpcion(true)}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Opción</span>
          </button>
        </div>
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
              <p className="text-sm font-medium text-gray-600">Total Grupos</p>
              <p className="text-2xl font-bold text-gray-900">{grupos.length}</p>
            </div>
            <Layers className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Grupos Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {grupos.filter(g => g.activo).length}
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
              <p className="text-sm font-medium text-gray-600">Total Opciones</p>
              <p className="text-2xl font-bold text-gray-900">{opciones.length}</p>
            </div>
            <Grid className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Opciones Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">
                {opciones.filter(o => o.disponible).length}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs para cambiar entre vistas */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button className="border-blue-500 text-blue-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm">
              Grupos de Variación
            </button>
          </nav>
        </div>
      </div>

      {/* Tabs para cambiar entre vistas */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button 
              className="border-blue-500 text-blue-600 whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm"
              onClick={() => window.location.href = '/admin/dashboard/restaurante/productos'}
            >
              ← Volver a Productos
            </button>
          </nav>
        </div>
      </div>

      {/* Lista de Grupos */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Grupos de Variación ({grupos.length})
          </h3>
          <div className="text-sm text-gray-500">
            Estos grupos se pueden asignar a productos desde la página de productos
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Cargando...</p>
          </div>
        ) : (
          <div className="p-6">
            {grupos.length === 0 ? (
              <div className="text-center py-12">
                <Layers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No hay grupos de variación</h4>
                <p className="text-gray-500 mb-4">Comienza creando tu primer grupo de variación</p>
                <button
                  onClick={() => setShowModalGrupo(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Crear primer grupo
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {grupos.map((grupo) => (
                  <div 
                    key={grupo.id} 
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900">{grupo.nombre}</h4>
                          <div className="flex space-x-2">
                            {grupo.es_obligatorio && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                Obligatorio
                              </span>
                            )}
                            {grupo.permite_multiple && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Múltiple
                              </span>
                            )}
                            <button
                              onClick={() => toggleActivoGrupo(grupo.id)}
                              disabled={loading}
                              className={`px-2 py-1 text-xs rounded-full transition-colors disabled:opacity-50 ${
                                grupo.activo 
                                  ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                            >
                              {grupo.activo ? 'Activo' : 'Inactivo'}
                            </button>
                          </div>
                        </div>
                        {grupo.descripcion && (
                          <p className="text-gray-600 mb-2">{grupo.descripcion}</p>
                        )}
                        <div className="text-sm text-gray-500">
                          <p><strong>Selecciones:</strong> {grupo.minimo_selecciones} mín{grupo.maximo_selecciones ? `, ${grupo.maximo_selecciones} máx` : ', sin límite'}</p>
                          <p><strong>Orden:</strong> {grupo.orden}</p>
                          <p><strong>Opciones:</strong> {grupo.opciones?.length || 0}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editarGrupo(grupo)}
                          disabled={loading}
                          className="text-blue-600 hover:text-blue-900 p-2 disabled:opacity-50 transition-colors"
                          title="Editar grupo"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => eliminarGrupo(grupo.id)}
                          disabled={loading}
                          className="text-red-600 hover:text-red-900 p-2 disabled:opacity-50 transition-colors"
                          title="Eliminar grupo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Opciones del grupo */}
                    {grupo.opciones && grupo.opciones.length > 0 && (
                      <div className="border-t pt-4">
                        <h5 className="text-sm font-medium text-gray-700 mb-3">Opciones disponibles:</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {grupo.opciones.map(opcion => (
                            <div key={opcion.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-sm">{opcion.nombre}</span>
                                <div className="flex items-center space-x-1">
                                  <button
                                    onClick={() => editarOpcion(opcion)}
                                    className="text-blue-600 hover:text-blue-900 p-1"
                                    title="Editar opción"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </button>
                                  <button
                                    onClick={() => eliminarOpcion(opcion.id)}
                                    className="text-red-600 hover:text-red-900 p-1"
                                    title="Eliminar opción"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              {opcion.precio_adicional > 0 && (
                                <p className="text-green-600 text-xs font-medium">
                                  +{formatCurrency(opcion.precio_adicional)}
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-2">
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  opcion.disponible 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {opcion.disponible ? 'Disponible' : 'No disponible'}
                                </span>
                                {opcion.imagen_url && (
                                  <img 
                                    src={opcion.imagen_url} 
                                    alt={opcion.nombre}
                                    className="w-8 h-8 object-cover rounded"
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Grupo */}
      {showModalGrupo && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-xl bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingGrupo ? 'Editar Grupo de Variación' : 'Nuevo Grupo de Variación'}
              </h3>
              <button 
                onClick={resetFormGrupo}
                disabled={loading}
                className="disabled:opacity-50"
              >
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            <form onSubmit={guardarGrupo} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Grupo *
                </label>
                <input
                  type="text"
                  required
                  value={formGrupo.nombre}
                  onChange={(e) => setFormGrupo({...formGrupo, nombre: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Sabores, Tamaños, Proteínas"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formGrupo.descripcion}
                  onChange={(e) => setFormGrupo({...formGrupo, descripcion: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Descripción que verá el cliente"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mínimo de selecciones
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formGrupo.minimo_selecciones}
                    onChange={(e) => setFormGrupo({...formGrupo, minimo_selecciones: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Máximo de selecciones
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formGrupo.maximo_selecciones}
                    onChange={(e) => setFormGrupo({...formGrupo, maximo_selecciones: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Sin límite"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Orden de presentación
                </label>
                <input
                  type="number"
                  min="0"
                  value={formGrupo.orden}
                  onChange={(e) => setFormGrupo({...formGrupo, orden: parseInt(e.target.value) || 0})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formGrupo.es_obligatorio}
                    onChange={(e) => setFormGrupo({...formGrupo, es_obligatorio: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Es obligatorio elegir una opción
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formGrupo.permite_multiple}
                    onChange={(e) => setFormGrupo({...formGrupo, permite_multiple: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Permite selección múltiple
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={resetFormGrupo}
                  disabled={loading}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !formGrupo.nombre.trim()}
                  className="px-6 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
                >
                  {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                  <Save className="w-4 h-4" />
                  <span>{editingGrupo ? 'Actualizar' : 'Guardar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Opción */}
      {showModalOpcion && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-xl bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingOpcion ? 'Editar Opción de Variación' : 'Nueva Opción de Variación'}
              </h3>
              <button 
                onClick={resetFormOpcion}
                disabled={loading}
                className="disabled:opacity-50"
              >
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            <form onSubmit={guardarOpcion} className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grupo de Variación *
                </label>
                <select
                  required
                  value={formOpcion.grupo_id}
                  onChange={(e) => setFormOpcion({...formOpcion, grupo_id: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={loading}
                >
                  <option value="">Seleccionar grupo</option>
                  {grupos.filter(g => g.activo).map(grupo => (
                    <option key={grupo.id} value={grupo.id}>
                      {grupo.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Opción *
                  </label>
                  <input
                    type="text"
                    required
                    value={formOpcion.nombre}
                    onChange={(e) => setFormOpcion({...formOpcion, nombre: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Fresa, Grande, Pollo"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precio Adicional
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formOpcion.precio_adicional}
                    onChange={(e) => setFormOpcion({...formOpcion, precio_adicional: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formOpcion.descripcion}
                  onChange={(e) => setFormOpcion({...formOpcion, descripcion: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={2}
                  placeholder="Descripción de la opción"
                  disabled={loading}
                />
              </div>

              {/* Campo para imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen de la opción
                </label>
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-2 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click para subir</span> imagen
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
                    value={formOpcion.orden}
                    onChange={(e) => setFormOpcion({...formOpcion, orden: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading}
                  />
                </div>

                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    checked={formOpcion.disponible}
                    onChange={(e) => setFormOpcion({...formOpcion, disponible: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    disabled={loading}
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Disponible
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={resetFormOpcion}
                  disabled={loading}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !formOpcion.nombre.trim() || !formOpcion.grupo_id}
                  className="px-6 py-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2 transition-colors"
                >
                  {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>}
                  <Save className="w-4 h-4" />
                  <span>{editingOpcion ? 'Actualizar' : 'Guardar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
'use client'
import React, { useState, useEffect } from 'react';
import { 
  Plus, TrendingUp, DollarSign, PieChart, BarChart3, 
  Calendar, Edit, Trash2, Download, AlertCircle, Save, 
  Filter, Search, X, Target, Utensils, Car, Heart, Book, 
  Shirt, Smartphone, MoreHorizontal
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart as RechartsPieChart, Cell, BarChart, Bar, Pie, Area, AreaChart
} from 'recharts';

// Configuración de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Tipos TypeScript
interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  color: string;
  icono: string;
  activa: boolean;
  created_at: string;
  updated_at: string;
}

interface Gasto {
  id: number;
  user_id: number;
  categoria_id: number;
  titulo: string;
  descripcion?: string;
  monto: number;
  fecha: string;
  hora?: string;
  metodo_pago: string;
  es_recurrente: boolean;
  etiquetas?: string[];
  categoria: Categoria;
  created_at: string;
  updated_at: string;
}

interface EstadisticasData {
  totalMes: number;
  totalHoy: number;
  promedioMes: number;
  cantidadGastos: number;
  gastosPorCategoria: Array<{
    id: number;
    nombre: string;
    color: string;
    total: number;
    cantidad: number;
    promedio: number;
  }>;
  gastosPorDia: Array<{
    fecha: string;
    total: number;
    cantidad: number;
  }>;
}

export default function GastosModule() {
  // Estados principales
  const [activeView, setActiveView] = useState('dashboard');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [estadisticas, setEstadisticas] = useState<EstadisticasData>({
    totalMes: 0,
    totalHoy: 0,
    promedioMes: 0,
    cantidadGastos: 0,
    gastosPorCategoria: [],
    gastosPorDia: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Estados para modales
  const [showGastoModal, setShowGastoModal] = useState(false);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [editingGasto, setEditingGasto] = useState<Gasto | null>(null);
  const [editingCategoria, setEditingCategoria] = useState<Categoria | null>(null);
  
  // Estados para filtros
  const [filtros, setFiltros] = useState({
    fechaInicio: '',
    fechaFin: '',
    categoria_id: '',
    busqueda: ''
  });
  
  // Estados para formularios
  const [formGasto, setFormGasto] = useState({
    titulo: '',
    descripcion: '',
    monto: '',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5),
    categoria_id: '',
    metodo_pago: 'efectivo',
    es_recurrente: false,
    etiquetas: []
  });
  
  const [formCategoria, setFormCategoria] = useState({
    nombre: '',
    descripcion: '',
    color: '#6366f1',
    icono: 'folder'
  });

  // Funciones API
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

  // Cargar datos iniciales
  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (activeView === 'dashboard') {
      cargarEstadisticas();
    }
  }, [activeView, gastos]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const userId = getUserId();
      
      const [categoriasRes, gastosRes] = await Promise.all([
        apiCall('/categorias'),
        apiCall(`/gastos?user_id=${userId}`)
      ]);
      
      setCategorias(categoriasRes);
      setGastos(gastosRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const userId = getUserId();
      const hoy = new Date().toISOString().split('T')[0];
      const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
      const finMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString().split('T')[0];

      const [totalMes, porCategoria, porPeriodo] = await Promise.all([
        apiCall(`/gastos/total?user_id=${userId}&fecha_inicio=${inicioMes}&fecha_fin=${finMes}`),
        apiCall(`/gastos/estadisticas/categoria?user_id=${userId}&fecha_inicio=${inicioMes}&fecha_fin=${finMes}`),
        apiCall(`/gastos/estadisticas/periodo?user_id=${userId}&fecha_inicio=${inicioMes}&fecha_fin=${finMes}`)
      ]);

      const gastosHoy = gastos
        .filter(g => g.fecha === hoy)
        .reduce((sum, g) => sum + Number(g.monto), 0);

      const categoriasFormateadas = Array.isArray(porCategoria) ? porCategoria.map(cat => ({
        id: cat.id,
        nombre: cat.nombre,
        color: cat.color,
        total: Number(cat.total) || 0,
        cantidad: Number(cat.cantidad) || 0,
        promedio: Number(cat.promedio) || 0
      })) : [];

      const periodoFormateado = Array.isArray(porPeriodo) ? porPeriodo.map(dia => ({
        fecha: dia.fecha,
        total: Number(dia.total) || 0,
        cantidad: Number(dia.cantidad) || 0
      })) : [];

      setEstadisticas({
        totalMes: Number(totalMes) || 0,
        totalHoy: gastosHoy,
        promedioMes: gastos.length > 0 ? (Number(totalMes) || 0) / gastos.length : 0,
        cantidadGastos: gastos.length,
        gastosPorCategoria: categoriasFormateadas,
        gastosPorDia: periodoFormateado
      });
    } catch (err) {
      console.error('Error cargando estadísticas:', err);
    }
  };

  // Funciones CRUD Gastos
  const guardarGasto = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const gastoData = {
        ...formGasto,
        user_id: getUserId(),
        categoria_id: parseInt(formGasto.categoria_id),
        monto: parseFloat(formGasto.monto),
        fecha: formGasto.fecha
      };

      if (editingGasto) {
        await apiCall(`/gastos/${editingGasto.id}`, {
          method: 'PATCH',
          body: JSON.stringify(gastoData)
        });
      } else {
        await apiCall('/gastos', {
          method: 'POST',
          body: JSON.stringify(gastoData)
        });
      }

      resetFormGasto();
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar gasto');
    } finally {
      setLoading(false);
    }
  };

  const eliminarGasto = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este gasto?')) return;
    
    try {
      await apiCall(`/gastos/${id}`, { method: 'DELETE' });
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar gasto');
    }
  };

  // Funciones CRUD Categorías
  const guardarCategoria = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCategoria) {
        await apiCall(`/categorias/${editingCategoria.id}`, {
          method: 'PATCH',
          body: JSON.stringify(formCategoria)
        });
      } else {
        await apiCall('/categorias', {
          method: 'POST',
          body: JSON.stringify(formCategoria)
        });
      }

      resetFormCategoria();
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar categoría');
    } finally {
      setLoading(false);
    }
  };

  const eliminarCategoria = async (id: number) => {
    if (!confirm('¿Estás seguro de desactivar esta categoría?')) return;
    
    try {
      await apiCall(`/categorias/${id}`, { method: 'DELETE' });
      await cargarDatos();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar categoría');
    }
  };

  // Funciones de utilidad
  const getUserId = () => {
    return parseInt(localStorage.getItem('userId') || '1');
  };

  const resetFormGasto = () => {
    setFormGasto({
      titulo: '',
      descripcion: '',
      monto: '',
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().slice(0, 5),
      categoria_id: '',
      metodo_pago: 'efectivo',
      es_recurrente: false,
      etiquetas: []
    });
    setEditingGasto(null);
    setShowGastoModal(false);
  };

  const resetFormCategoria = () => {
    setFormCategoria({
      nombre: '',
      descripcion: '',
      color: '#6366f1',
      icono: 'folder'
    });
    setEditingCategoria(null);
    setShowCategoriaModal(false);
  };

  const editarGasto = (gasto: Gasto) => {
    setFormGasto({
      titulo: gasto.titulo,
      descripcion: gasto.descripcion || '',
      monto: gasto.monto.toString(),
      fecha: gasto.fecha,
      hora: gasto.hora || '',
      categoria_id: gasto.categoria_id.toString(),
      metodo_pago: gasto.metodo_pago,
      es_recurrente: gasto.es_recurrente,
      etiquetas: gasto.etiquetas || []
    });
    setEditingGasto(gasto);
    setShowGastoModal(true);
  };

  const editarCategoria = (categoria: Categoria) => {
    setFormCategoria({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || '',
      color: categoria.color,
      icono: categoria.icono
    });
    setEditingCategoria(categoria);
    setShowCategoriaModal(true);
  };

  // Aplicar filtros
  const aplicarFiltros = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('user_id', getUserId().toString());
      
      if (filtros.fechaInicio) params.append('fecha_inicio', filtros.fechaInicio);
      if (filtros.fechaFin) params.append('fecha_fin', filtros.fechaFin);
      if (filtros.categoria_id) params.append('categoria_id', filtros.categoria_id);
      if (filtros.busqueda) params.append('busqueda', filtros.busqueda);

      const gastosRes = await apiCall(`/gastos?${params.toString()}`);
      setGastos(gastosRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al filtrar gastos');
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      fechaInicio: '',
      fechaFin: '',
      categoria_id: '',
      busqueda: ''
    });
    cargarDatos();
  };

  // Formateo de moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Iconos para categorías
  const getIconComponent = (iconName: string) => {
    const icons: Record<string, React.ComponentType<any>> = {
      'utensils': Utensils,
      'car': Car,
      'heart': Heart,
      'book': Book,
      'shirt': Shirt,
      'smartphone': Smartphone,
      'more-horizontal': MoreHorizontal
    };
    const IconComponent = icons[iconName] || MoreHorizontal;
    return <IconComponent className="w-5 h-5" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 capitalize">
              {activeView === 'dashboard' ? 'Panel de Gastos' : activeView}
            </h2>
            <p className="text-gray-600 text-xs lg:text-sm">
              {activeView === 'dashboard' && `Total de gastos: ${estadisticas.cantidadGastos}`}
              {activeView === 'gastos' && `${gastos.length} gastos registrados`}
              {activeView === 'categorias' && `${categorias.length} categorías activas`}
            </p>
          </div>
          
          {/* Navegación de pestañas */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveView('gastos')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'gastos'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Gastos
            </button>
            <button
              onClick={() => setActiveView('categorias')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'categorias'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Categorías
            </button>
          </div>
          
          <div className="flex space-x-2 lg:space-x-3">
            {activeView === 'gastos' && (
              <button
                onClick={() => setShowGastoModal(true)}
                className="bg-blue-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-1 lg:space-x-2 text-sm lg:text-base"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nuevo Gasto</span>
                <span className="sm:hidden">Nuevo</span>
              </button>
            )}
            {activeView === 'categorias' && (
              <button
                onClick={() => setShowCategoriaModal(true)}
                className="bg-green-600 text-white px-3 lg:px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-1 lg:space-x-2 text-sm lg:text-base"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Nueva Categoría</span>
                <span className="sm:hidden">Nueva</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Error Alert */}
      {error && (
        <div className="mx-6 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800">{error}</span>
            <button onClick={() => setError('')} className="ml-auto">
              <X className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      )}

      {/* Contenido */}
      <main className="p-6">
        {/* DASHBOARD */}
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total del Mes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(estadisticas.totalMes)}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <DollarSign className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-500">
                    Promedio: {formatCurrency(estadisticas.promedioMes)}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Gastos Hoy</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(estadisticas.totalHoy)}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <Calendar className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Gastos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {estadisticas.cantidadGastos}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Categorías</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {categorias.filter(c => c.activa).length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full bg-orange-100">
                    <PieChart className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Gráfico por Categorías */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Gastos por Categoría
                </h3>
                <div className="h-80">
                  {estadisticas.gastosPorCategoria.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={estadisticas.gastosPorCategoria}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="total"
                          label={({ nombre, total }) => `${nombre}: ${formatCurrency(Number(total))}`}
                        >
                          {estadisticas.gastosPorCategoria.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">No hay datos para mostrar</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Gráfico Temporal */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tendencia de Gastos
                </h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={estadisticas.gastosPorDia}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="fecha" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString('es-CO')}
                      />
                      <YAxis tickFormatter={(value) => formatCurrency(value)} />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString('es-CO')}
                        formatter={(value) => [formatCurrency(Number(value)), 'Total']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="total" 
                        stroke="#3b82f6" 
                        fill="#3b82f680"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Gastos recientes */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Gastos Recientes
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {gastos.slice(0, 5).map((gasto) => (
                    <div key={gasto.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: gasto.categoria.color }}
                        />
                        <div>
                          <p className="font-medium text-gray-900">{gasto.titulo}</p>
                          <p className="text-sm text-gray-500">{gasto.categoria.nombre}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(Number(gasto.monto))}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(gasto.fecha).toLocaleDateString('es-CO')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GASTOS */}
        {activeView === 'gastos' && (
          <div className="space-y-6">
            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filtros
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Inicio
                  </label>
                  <input
                    type="date"
                    value={filtros.fechaInicio}
                    onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    value={filtros.fechaFin}
                    onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
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
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buscar
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Buscar por título..."
                      value={filtros.busqueda}
                      onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>
              <div className="flex space-x-3 mt-4">
                <button
                  onClick={aplicarFiltros}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Aplicar Filtros</span>
                </button>
                <button
                  onClick={limpiarFiltros}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                >
                  Limpiar
                </button>
              </div>
            </div>

            {/* Lista de Gastos */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Gastos ({gastos.length})
                </h3>
                <button className="text-blue-600 hover:text-blue-700 flex items-center space-x-1">
                  <Download className="w-4 h-4" />
                  <span>Exportar</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gasto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Método
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {gastos.map((gasto) => (
                      <tr key={gasto.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {gasto.titulo}
                            </div>
                            {gasto.descripcion && (
                              <div className="text-sm text-gray-500">
                                {gasto.descripcion}
                              </div>
                            )}
                            {gasto.es_recurrente && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                                Recurrente
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: gasto.categoria?.color }}
                            />
                            <span className="text-sm text-gray-900">
                              {gasto.categoria?.nombre}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatCurrency(Number(gasto.monto))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(gasto.fecha).toLocaleDateString('es-CO')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {gasto.metodo_pago}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => editarGasto(gasto)}
                              className="text-blue-600 hover:text-blue-900 p-1"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => eliminarGasto(gasto.id)}
                              className="text-red-600 hover:text-red-900 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {gastos.length === 0 && (
                  <div className="text-center py-12">
                    <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No hay gastos para mostrar</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CATEGORÍAS */}
        {activeView === 'categorias' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Categorías ({categorias.length})
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categorias.map((categoria) => (
                  <div 
                    key={categoria.id} 
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="p-3 rounded-lg"
                          style={{ backgroundColor: `${categoria.color}20` }}
                        >
                          {getIconComponent(categoria.icono)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{categoria.nombre}</h4>
                          <p className="text-sm text-gray-500">{categoria.descripcion}</p>
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
                    <div className="text-sm text-gray-500">
                      <p>Gastos: {gastos.filter(g => g.categoria_id === categoria.id).length}</p>
                      <p>Total: {formatCurrency(
                        gastos
                          .filter(g => g.categoria_id === categoria.id)
                          .reduce((sum, g) => sum + Number(g.monto), 0)
                      )}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal Agregar/Editar Gasto */}
      {showGastoModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-xl bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingGasto ? 'Editar Gasto' : 'Nuevo Gasto'}
              </h3>
              <button onClick={resetFormGasto}>
                <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
            
            <form onSubmit={guardarGasto} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  required
                  value={formGasto.titulo}
                  onChange={(e) => setFormGasto({...formGasto, titulo: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Almuerzo en restaurante"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formGasto.descripcion}
                  onChange={(e) => setFormGasto({...formGasto, descripcion: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descripción opcional del gasto"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Monto *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formGasto.monto}
                    onChange={(e) => setFormGasto({...formGasto, monto: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    required
                    value={formGasto.fecha}
                    onChange={(e) => setFormGasto({...formGasto, fecha: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora
                  </label>
                  <input
                    type="time"
                    value={formGasto.hora}
                    onChange={(e) => setFormGasto({...formGasto, hora: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría *
                  </label>
                  <select
                    required
                    value={formGasto.categoria_id}
                    onChange={(e) => setFormGasto({...formGasto, categoria_id: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Seleccionar categoría</option>
                    {categorias.filter(c => c.activa).map(categoria => (
                      <option key={categoria.id} value={categoria.id}>
                        {categoria.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Método de Pago
                  </label>
                  <select
                    value={formGasto.metodo_pago}
                    onChange={(e) => setFormGasto({...formGasto, metodo_pago: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="pse">PSE</option>
                    <option value="nequi">Nequi</option>
                    <option value="daviplata">Daviplata</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formGasto.es_recurrente}
                  onChange={(e) => setFormGasto({...formGasto, es_recurrente: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">
                  Gasto recurrente
                </label>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={resetFormGasto}
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
                  <span>{editingGasto ? 'Actualizar' : 'Guardar'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Agregar/Editar Categoría */}
      {showCategoriaModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/3 shadow-lg rounded-xl bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
              </h3>
              <button onClick={resetFormCategoria}>
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
                  value={formCategoria.nombre}
                  onChange={(e) => setFormCategoria({...formCategoria, nombre: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Alimentación"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formCategoria.descripcion}
                  onChange={(e) => setFormCategoria({...formCategoria, descripcion: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Descripción de la categoría"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formCategoria.color}
                      onChange={(e) => setFormCategoria({...formCategoria, color: e.target.value})}
                      className="w-12 h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formCategoria.color}
                      onChange={(e) => setFormCategoria({...formCategoria, color: e.target.value})}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="#6366f1"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icono
                  </label>
                  <select
                    value={formCategoria.icono}
                    onChange={(e) => setFormCategoria({...formCategoria, icono: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="utensils">🍽️ Alimentación</option>
                    <option value="car">🚗 Transporte</option>
                    <option value="heart">❤️ Salud</option>
                    <option value="book">📚 Educación</option>
                    <option value="shirt">👕 Ropa</option>
                    <option value="smartphone">📱 Tecnología</option>
                    <option value="more-horizontal">📋 Otros</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={resetFormCategoria}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
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
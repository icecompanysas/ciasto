import React from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const InformeFinancieroParte2 = () => {
  // Formatear números para mostrarlos en pesos colombianos
  const formatCurrency = (value) => {
    return `$${value.toLocaleString('es-CO')}`;
  };
  
  // Colores para los gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="p-6 bg-gray-50 font-sans">
      {/* CABECERA DEL INFORME - PARTE 2 */}
      

      {/* NOTA 6: CUENTAS POR PAGAR */}
      <div className="bg-white text-black p-6 rounded-lg shadow-lg mb-10">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-2 border-b">NOTA 6: CUENTAS POR PAGAR</h2>
        
        <p className="mb-4">
          Registra el valor adeudado por la copropiedad por los bienes y servicios recibidos que al cierre del ejercicio quedaron pendientes por pagar, tal como se detalla a continuación:
        </p>
        
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Concepto</th>
                <th className="border p-3 text-right">Valor</th>
                <th className="border p-3 text-left">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">Cuentas varias</td>
                <td className="border p-3 text-right font-medium">$1.386.000,00</td>
                <td className="border p-3"></td>
              </tr>
              <tr>
                <td className="border p-3">Sistema de gestión y seguridad en el trabajo</td>
                <td className="border p-3 text-right font-medium">$1.462.500,00</td>
                <td className="border p-3">Implementación del sistema</td>
              </tr>
              <tr>
                <td className="border p-3">Servicio de vigilancia ICONS</td>
                <td className="border p-3 text-right font-medium">$36.960.000,00</td>
                <td className="border p-3">Noviembre y diciembre de 2024</td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td className="border p-3">TOTAL CUENTAS POR PAGAR</td>
                <td className="border p-3 text-right">$39.808.500,00</td>
                <td className="border p-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p className="mb-4">
          El valor de $1.386.000,00 corresponde a cuentas varias pendientes por pagar.
        </p>
        
        <p className="mb-4">
          El valor de $1.462.500,00 corresponde a la implementación del sistema de gestión y seguridad en el trabajo.
        </p>
        
        <p className="mb-6">
          El valor de $36.960.000,00 corresponde al servicio de vigilancia con la empresa ICONS del mes de noviembre y diciembre de 2024.
        </p>
        
        {/* Gráfico para CUENTAS POR PAGAR */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">Distribución de Cuentas por Pagar</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Cuentas varias', value: 1386000 },
                  { name: 'Sistema de gestión y seguridad', value: 1462500 },
                  { name: 'Servicio vigilancia ICONS', value: 36960000 }
                ]}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {[0, 1, 2].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NOTA 7: ACREEDORES OFICIALES */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-2 border-b">NOTA 7: ACREEDORES OFICIALES</h2>
        
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Concepto</th>
                <th className="border p-3 text-right">Valor</th>
                <th className="border p-3 text-left">Observaciones</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">Retención en la fuente</td>
                <td className="border p-3 text-right font-medium">$122.338,00</td>
                <td className="border p-3">A pagar en enero 2025</td>
              </tr>
              <tr>
                <td className="border p-3">Retención de industria y comercio</td>
                <td className="border p-3 text-right font-medium">$23.282,00</td>
                <td className="border p-3">A pagar en enero 2025</td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td className="border p-3">TOTAL ACREEDORES OFICIALES</td>
                <td className="border p-3 text-right">$145.620,00</td>
                <td className="border p-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p className="mb-4">
          El valor de retención en la fuente $122.338,00 corresponde a las retenciones efectuadas a los diferentes prestadores de servicios. Este valor se cancela en el mes de enero de 2025.
        </p>
        
        <p className="mb-6">
          El valor de retención de industria y comercio por valor $23.282,00 corresponde a las retenciones efectuadas a los diferentes prestadores de servicios. Este valor se cancela en el mes de enero de 2025.
        </p>
        
        {/* Gráfico para ACREEDORES OFICIALES */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">Composición de Acreedores Oficiales</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={[
                { name: 'Retención en la fuente', value: 122338 },
                { name: 'Retención de industria y comercio', value: 23282 }
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="value" fill="#34A853">
                {[0, 1].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>


    

    
    </div>
  );
};

export default InformeFinancieroParte2;
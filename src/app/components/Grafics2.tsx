import React from 'react';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const InformeFinancieroParte3 = () => {
  // Formatear números para mostrarlos en pesos colombianos
  const formatCurrency = (value) => {
    return `$${value.toLocaleString('es-CO')}`;
  };
  
  // Colores para los gráficos
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

  return (
    <div className="p-6 text-black bg-gray-50 font-sans">
      {/* CABECERA DEL INFORME - PARTE 3 */}
    

      {/* NOTA 8: OTRAS CUENTAS POR PAGAR */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-2 border-b">NOTA 8: OTRAS CUENTAS POR PAGAR</h2>
        
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
                <td className="border p-3">Anticipos cuotas futuras</td>
                <td className="border p-3 text-right font-medium">$7.898.137,00</td>
                <td className="border p-3">Valores entregados por los copropietarios</td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td className="border p-3">TOTAL</td>
                <td className="border p-3 text-right">$7.898.137,00</td>
                <td className="border p-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p className="mb-6">
          El valor de $7.898.137,00 corresponde a los valores entregados por los copropietarios como anticipos a las cuotas futuras de administración, el sistema aplica mes a mes según corresponda el tercero o predio.
        </p>
        
        {/* Gráfico para OTRAS CUENTAS POR PAGAR */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">Anticipos de Cuotas Futuras</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'Anticipos cuotas futuras', value: 7898137 }
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="value" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NOTA 9: PATRIMONIO */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-2 border-b">NOTA 9: PATRIMONIO</h2>
        
        <p className="mb-4">
          El Patrimonio está constituido por los excedentes del presente ejercicio, resultados de años anteriores, reservas legales y estatutarias. El grupo más representativo dentro del patrimonio son las EXCEDENTES acumuladas o de periodos anteriores.
        </p>
        
        <p className="mb-6">
          Se deja la observación en cuanto a los excedentes acumulados, ya que la copropiedad pertenece a un Régimen Especial el cual no declara renta no puede generar y acumular los excedentes estos deberán estar invertidos mediante un proyecto que se debe presentar por medio de la Administración para mejoras de la copropiedad y generar un fondo de proyectos, avalado por la Asamblea.
        </p>
      </div>

      {/* NOTA 10 y 11: INGRESOS */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-2 border-b">NOTA 10 Y 11: INGRESOS</h2>
        
        <p className="mb-4">
          Comprende los valores recibidos y/o causados como resultado de las actividades desarrolladas en cumplimiento de su objeto social, mediante el pago de unas cuotas de administración y demás ingresos por concepto de rendimientos financieros, intereses por mora, sanciones por inasistencia, parqueaderos, fondo de imprevistos, cuota extraordinaria, multas por incumplimiento.
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
              <tr className="bg-blue-50">
                <td className="border p-3 font-bold" colSpan="3">Ingresos Operacionales</td>
              </tr>
              <tr>
                <td className="border p-3">Cuotas de administración</td>
                <td className="border p-3 text-right font-medium">$399.256.116,00</td>
                <td className="border p-3">Valor mensual</td>
              </tr>
              <tr>
                <td className="border p-3">Intereses moratorios</td>
                <td className="border p-3 text-right font-medium">$12.409.906,00</td>
                <td className="border p-3"></td>
              </tr>
              <tr>
                <td className="border p-3">Retroactivos cuotas administración</td>
                <td className="border p-3 text-right font-medium">$1.296.000,00</td>
                <td className="border p-3">No percibidas en los primeros tres meses</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="border p-3 font-bold" colSpan="3">Ingresos No Operacionales</td>
              </tr>
              <tr>
                <td className="border p-3">Rendimientos financieros AV VILLAS</td>
                <td className="border p-3 text-right font-medium">$8.668,94</td>
                <td className="border p-3"></td>
              </tr>
              <tr>
                <td className="border p-3">Reintegros años anteriores</td>
                <td className="border p-3 text-right font-medium">$11.157.213,00</td>
                <td className="border p-3"></td>
              </tr>
              <tr>
                <td className="border p-3">Reconocimiento fondo imprevistos</td>
                <td className="border p-3 text-right font-medium">$4.327.884,00</td>
                <td className="border p-3">1% de causación de ingresos</td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td className="border p-3">TOTAL INGRESOS</td>
                <td className="border p-3 text-right">$428.455.787,94</td>
                <td className="border p-3"></td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p className="mb-4">
          De acuerdo a los ingresos presentados se observa el crecimiento de los mismos según la variación total en el valor de $110.540.699,00.
        </p>
        
        <p className="mb-4">
          Como se observa el valor más representativo de los ingresos que tiene a la copropiedad es la acusación de las cuotas por expensas de administración, lo que apoya al presupuesto de ingresos de forma mensual el valor causado mensual es de $399.256.116,00, siendo este el valor con que cuenta la administración para ejecutar los gastos que necesita la copropiedad para mantenerla en adecuada forma.
        </p>
        
        <p className="mb-6">
          El valor de $4.327.884,00 corresponde a reconocimiento del fondo de imprevistos del 1% de la causación de los ingresos, el cual se debe monetizar en una cuenta contable.
        </p>
        
        {/* Gráfico para INGRESOS */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">Distribución de Ingresos</h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Cuotas administración', value: 399256116 },
                  { name: 'Intereses moratorios', value: 12409906 },
                  { name: 'Retroactivos cuotas', value: 1296000 },
                  { name: 'Rendimientos financieros', value: 8669 },
                  { name: 'Reintegros años anteriores', value: 11157213 },
                  { name: 'Fondo de imprevistos', value: 4327884 }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => percent > 0.02 ? `${name}: ${(percent * 100).toFixed(1)}%` : ''}
                outerRadius={130}
                fill="#8884d8"
                dataKey="value"
              >
                {[0, 1, 2, 3, 4, 5].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend layout="vertical" verticalAlign="middle" align="right" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NOTA 12: GASTOS OPERACIONALES */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-2 border-b">NOTA 12: GASTOS OPERACIONALES</h2>
        
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Honorarios</h3>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Concepto</th>
                <th className="border p-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">Servicios contables 2024 (1)</td>
                <td className="border p-3 text-right font-medium">$5.600.000,00</td>
              </tr>
              <tr>
                <td className="border p-3">Honorarios jurídicos</td>
                <td className="border p-3 text-right font-medium">$523.600,00</td>
              </tr>
              <tr>
                <td className="border p-3">Servicios contables 2024 (2)</td>
                <td className="border p-3 text-right font-medium">$8.900.000,00</td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td className="border p-3">TOTAL HONORARIOS</td>
                <td className="border p-3 text-right">$15.023.600,00</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Seguros</h3>
        <p className="mb-4">
          Este valor corresponde a la contratación de la póliza de áreas comunes que la copropiedad debe tener según los requisitos exigidos en la ley 675 de 2001. Se deberá tener presente el valor de aseguramiento esto para tener claridad hasta donde las áreas comunes podrán ser recuperadas en el evento de presentarse alguna novedad. Es importante tener al día este requisito y así mismo ver que no tenga un valor infra asegurado. Como se observa en la variación hubo un aumento en el gasto en el valor de $324.308,00.
        </p>
        
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Servicios</h3>
        <p className="mb-4">
          Este ítem comprende todos los gastos por servicios de vigilancia, aseo, todero, acueducto, energía eléctrica, servicio de teléfono e internet, servicio de salvavidas, servicio de fumigación los cuales se necesitan para su normal funcionamiento. Se generan variaciones considerables en el rubro de aseo, toderia y vigilancia.
        </p>
        
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Gastos Legales</h3>
        <p className="mb-4">
          Corresponden a compras de certificados y estampillas procultura.
        </p>
        
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Mantenimientos</h3>
        <p className="mb-4">
          Es concepto corresponde a las diferentes compras para mantenimientos que debe efectuar la copropiedad para mantener en óptimas condiciones las áreas comunes y equipo que posee el conjunto. Se anexa cada uno de los gastos de los mantenimientos.
        </p>
        
        <p className="mb-4">
          El valor de $1.567.200,00 corresponde al valor cancelado por el concepto de Instalaciones eléctricas. En comparación con el año 2023 tuvo un aumento de $1.329.700,00.
        </p>
        
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Depreciación</h3>
        <p className="mb-4">
          El valor de $1.381.539,00 corresponde a la contabilización del desgaste normal de los equipos que posee la copropiedad para el uso normal de esta. Estos gastos no son erogaciones de dinero, son registros contables que en ningún momento comprometen los fondos de esta.
        </p>
        
        <p className="mb-4">
          El valor de $533.333,00 corresponde a la amortización del software contable.
        </p>
        
        <h3 className="text-xl font-semibold text-blue-700 mb-4">Diversos</h3>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Concepto</th>
                <th className="border p-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">Navidad</td>
                <td className="border p-3 text-right font-medium">$2.573.210,00</td>
              </tr>
              <tr>
                <td className="border p-3">Insumos de aseo</td>
                <td className="border p-3 text-right font-medium">$3.034.553,00</td>
              </tr>
              <tr>
                <td className="border p-3">Cafetería portería, aseo y administración</td>
                <td className="border p-3 text-right font-medium">$223.130,00</td>
              </tr>
              <tr>
                <td className="border p-3">Resma y misceláneos</td>
                <td className="border p-3 text-right font-medium">$951.350,00</td>
              </tr>
              <tr>
                <td className="border p-3">Combustible</td>
                <td className="border p-3 text-right font-medium">$547.480,00</td>
              </tr>
              <tr>
                <td className="border p-3">Movilización en compras</td>
                <td className="border p-3 text-right font-medium">$162.470,00</td>
              </tr>
              <tr>
                <td className="border p-3">Asamblea ordinaria</td>
                <td className="border p-3 text-right font-medium">$2.726.000,00</td>
              </tr>
              <tr>
                <td className="border p-3">Día dulce</td>
                <td className="border p-3 text-right font-medium">$527.025,00</td>
              </tr>
              <tr>
                <td className="border p-3">Actualización software contable SYSCO</td>
                <td className="border p-3 text-right font-medium">$599.182,00</td>
              </tr>
              <tr>
                <td className="border p-3">Implementación sistema SG-SST</td>
                <td className="border p-3 text-right font-medium">$3.250.000,00</td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td className="border p-3">TOTAL GASTOS DIVERSOS</td>
                <td className="border p-3 text-right">$14.594.400,00</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Gráfico para GASTOS OPERACIONALES */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">Distribución de Gastos Diversos</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={[
                { name: 'Navidad', value: 2573210 },
                { name: 'Insumos de aseo', value: 3034553 },
                { name: 'Cafetería', value: 223130 },
                { name: 'Oficina', value: 951350 },
                { name: 'Combustible', value: 547480 },
                { name: 'Movilización', value: 162470 },
                { name: 'Asamblea', value: 2726000 },
                { name: 'Día dulce', value: 527025 },
                { name: 'Software', value: 599182 },
                { name: 'SG-SST', value: 3250000 }
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" height={60} angle={-45} textAnchor="end" />
              <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="value">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NOTA 13: GASTOS NO OPERACIONALES */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-10">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 pb-2 border-b">NOTA 13: GASTOS NO OPERACIONALES</h2>
        
        <p className="mb-4">
          Corresponden a los gastos por comisiones, notas bancarias. Los gastos en mención se detallan a continuación:
        </p>
        
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Concepto</th>
                <th className="border p-3 text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-3">Comisiones bancarias e IVA</td>
                <td className="border p-3 text-right font-medium">$1.402.537,60</td>
              </tr>
              <tr>
                <td className="border p-3">Reconocimiento gasto vigencia 2023</td>
                <td className="border p-3 text-right font-medium">$256.186,00</td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td className="border p-3">TOTAL GASTOS NO OPERACIONALES</td>
                <td className="border p-3 text-right">$1.658.723,60</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Gráfico para GASTOS NO OPERACIONALES */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">Gastos No Operacionales</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Comisiones bancarias e IVA', value: 1402537.6 },
                  { name: 'Gasto vigencia 2023', value: 256186 }
                ]}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {[0, 1].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-6">
          <p className="text-xl font-bold text-red-700">
            Se evidencia un déficit del ejercicio por un valor de $11.047.456,66.
          </p>
        </div>
        
        {/* Gráfico para RESULTADO FINAL */}
        <div className="mt-6 border-t pt-6">
          <h3 className="text-xl font-semibold text-blue-700 mb-4 text-center">Resultado del Ejercicio</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={[
                { name: 'Total Ingresos', value: 428455787.94 },
                { name: 'Total Gastos', value: 439503244.6 }
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="value" name="Valor">
                {[0, 1].map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#00C49F' : '#FF8042'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="text-center mt-4">
            <p className="font-bold text-red-600">Déficit: {formatCurrency(11047456.66)}</p>
          </div>
        </div>
      </div>

      <div className="bg-blue-800 p-6 rounded-lg text-white text-center">
        <p className="text-lg font-semibold">Informe Financiero 2024</p>
        <p className="mt-2">Documento preparado para la administración de la copropiedad</p>
        <p className="mt-1">Fecha de elaboración: 31 de diciembre de 2024</p>
      </div>
    </div>
  );
};

export default InformeFinancieroParte3;
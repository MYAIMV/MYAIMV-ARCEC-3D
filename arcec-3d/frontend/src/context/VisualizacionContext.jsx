import { createContext, useContext, useState } from 'react'

const VisualizacionContext = createContext(null)

export const VisualizacionProvider = ({ children }) => {
  const [nombreArchivo, setNombreArchivo] = useState(null)

  // Datos crudos del archivo: qué columnas son expresiones, cuáles son metadata,
  // y todas las filas (puede haber muchas — el usuario elige cuál corrida ver).
  const [datosArchivo, setDatosArchivo] = useState(null) // { columnasExpresion, columnasMetadata, filas }
  const [filaSeleccionada, setFilaSeleccionada] = useState(0)

  // Cuál función (columna) de la fila actual se está graficando — se grafica UNA a la vez.
  const [funcionSeleccionada, setFuncionSeleccionada] = useState(null) // { columna, expresion }

  // variablesInfo: { [nombre]: { modo: 'grafico' | 'constante', valor, min, max } }
  // Son las variables de la función actualmente seleccionada.
  const [variablesInfo, setVariablesInfo] = useState({})

  // Resultado de la última graficación: '2d' (curva) o '3d' (superficie)
  const [tipoGrafica, setTipoGrafica] = useState(null)
  const [datosGrafica, setDatosGrafica] = useState(null) // curva {ejeX,valores,varX} o malla {ejeX,ejeY,Z,varX,varY}
  const [haySuperficie, setHaySuperficie] = useState(false)
  const [modoVista, setModoVistaGuardado] = useState('3d')

  const limpiar = () => {
    setNombreArchivo(null)
    setDatosArchivo(null)
    setFilaSeleccionada(0)
    setFuncionSeleccionada(null)
    setVariablesInfo({})
    setTipoGrafica(null)
    setDatosGrafica(null)
    setHaySuperficie(false)
    setModoVistaGuardado('3d')
  }

  return (
    <VisualizacionContext.Provider value={{
      nombreArchivo, setNombreArchivo,
      datosArchivo, setDatosArchivo,
      filaSeleccionada, setFilaSeleccionada,
      funcionSeleccionada, setFuncionSeleccionada,
      variablesInfo, setVariablesInfo,
      tipoGrafica, setTipoGrafica,
      datosGrafica, setDatosGrafica,
      haySuperficie, setHaySuperficie,
      modoVista, setModoVistaGuardado,
      limpiar
    }}>
      {children}
    </VisualizacionContext.Provider>
  )
}

export const useVisualizacion = () => {
  const ctx = useContext(VisualizacionContext)
  if (!ctx) throw new Error('useVisualizacion debe usarse dentro de VisualizacionProvider')
  return ctx
}

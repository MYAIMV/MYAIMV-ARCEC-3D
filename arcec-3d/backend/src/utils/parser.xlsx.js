import * as XLSX from 'xlsx'
import { parsearArchivoGenerico } from './parser.generico.js'

const escaparCampoCSV = (valor) => {
  if (valor === null || valor === undefined) return ''
  const texto = String(valor)
  if (texto.includes(',') || texto.includes('"') || texto.includes('\n')) {
    return `"${texto.replace(/"/g, '""')}"`
  }
  return texto
}

// Lee un archivo .xlsx (buffer), lo convierte a texto CSV y reutiliza el
// detector genérico de columnas — así no hace falta ningún parser especial
// para Excel, con tal de que el archivo sea tabular.
export const parsearXlsxGenerico = (buffer) => {
  const workbook = XLSX.read(buffer, { type: 'buffer' })
  const nombreHoja = workbook.SheetNames[0]
  if (!nombreHoja) return { columnasExpresion: [], columnasMetadata: [], filas: [] }

  const hoja = workbook.Sheets[nombreHoja]
  const filas = XLSX.utils.sheet_to_json(hoja, { header: 1, raw: true, defval: '' })
  if (filas.length < 1) return { columnasExpresion: [], columnasMetadata: [], filas: [] }

  const lineasCSV = filas.map(fila => fila.map(escaparCampoCSV).join(','))
  const contenidoCSV = lineasCSV.join('\n')

  return parsearArchivoGenerico(contenidoCSV)
}

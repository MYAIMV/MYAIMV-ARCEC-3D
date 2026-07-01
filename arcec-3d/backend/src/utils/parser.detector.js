// Detecta si el contenido de un archivo corresponde al formato Eddie o Dummy
export const detectarFormato = (contenido) => {
  const primeraLinea = contenido.trim().split('\n')[0] || ''

  // Formato Eddie: encabezado CSV con columnas típicas
  if (/train_error|test_error|weights_w|bias_b/i.test(primeraLinea)) {
    return 'eddie'
  }

  // Formato Dummy: líneas "num;expresion;(tupla)"
  const segundaLinea = contenido.trim().split('\n')[0] || ''
  if (/^\d+\s*;/.test(segundaLinea) && /np\.float/.test(contenido)) {
    return 'dummy'
  }

  return null
}

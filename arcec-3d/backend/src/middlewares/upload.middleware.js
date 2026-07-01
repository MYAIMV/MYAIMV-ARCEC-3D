import multer from 'multer'

const storage = multer.memoryStorage()

const fileFilter = (_req, file, cb) => {
  const extensionesValidas = ['.csv', '.txt', '.xlsx']
  const nombre = file.originalname.toLowerCase()
  const esValido = extensionesValidas.some(ext => nombre.endsWith(ext))
  if (!esValido) return cb(new Error('Solo se permiten archivos .csv, .txt o .xlsx'))
  cb(null, true)
}

export const uploadCsv = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
})

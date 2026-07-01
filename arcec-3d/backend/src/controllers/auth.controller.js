import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { UsuarioModel } from '../models/usuario.model.js'

const SALT_ROUNDS = 10

export const AuthController = {
  // POST /api/auth/registro
  async registro(req, res) {
    try {
      const { nombre_completo, correo_institucional, contrasena } = req.body

      if (!nombre_completo || !correo_institucional || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' })
      }
      if (contrasena.length < 6) {
        return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' })
      }

      const existente = await UsuarioModel.findByCorreo(correo_institucional)
      if (existente) {
        return res.status(409).json({ error: 'Ya existe una cuenta con ese correo institucional' })
      }

      const hash = await bcrypt.hash(contrasena, SALT_ROUNDS)
      const id_usuario = await UsuarioModel.create({
        nombre_completo,
        correo_institucional,
        contrasena: hash
      })

      res.status(201).json({
        message: 'Usuario registrado correctamente',
        usuario: { id_usuario, nombre_completo, correo_institucional }
      })
    } catch (err) {
      res.status(500).json({ error: 'Error al registrar usuario: ' + err.message })
    }
  },

  // POST /api/auth/login
  async login(req, res) {
    try {
      const { correo_institucional, contrasena } = req.body

      if (!correo_institucional || !contrasena) {
        return res.status(400).json({ error: 'Correo y contraseña son obligatorios' })
      }

      const usuario = await UsuarioModel.findByCorreo(correo_institucional)
      if (!usuario) {
        return res.status(401).json({ error: 'Credenciales inválidas' })
      }

      const passwordValido = await bcrypt.compare(contrasena, usuario.contrasena)
      if (!passwordValido) {
        return res.status(401).json({ error: 'Credenciales inválidas' })
      }

      const token = jwt.sign(
        { id_usuario: usuario.id_usuario, correo_institucional: usuario.correo_institucional },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
      )

      res.json({
        message: 'Inicio de sesión exitoso',
        token,
        usuario: {
          id_usuario: usuario.id_usuario,
          nombre_completo: usuario.nombre_completo,
          correo_institucional: usuario.correo_institucional
        }
      })
    } catch (err) {
      res.status(500).json({ error: 'Error al iniciar sesión: ' + err.message })
    }
  },

  // GET /api/auth/perfil (requiere token)
  async perfil(req, res) {
    try {
      const usuario = await UsuarioModel.findById(req.usuario.id_usuario)
      if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' })
      res.json({ usuario })
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
}

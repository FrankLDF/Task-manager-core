// Importaciones
import prisma from '../config/db.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Función para registrar un usuario
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: 'Todos los campos son obligatorios' })
    }

    // Validar formato de email
    const caracteres = email.split('@')
    if (caracteres.length !== 2) {
      return res
        .status(400)
        .json({ error: 'El correo electrónico debe tener un formato válido' })
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.users.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado.' })
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario
    const user = await prisma.users.create({
      data: { name, email, password: hashedPassword },
    })

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Enviar el token en la cookie
    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Solo en HTTPS en producción
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      })
      .status(201)
      .json({
        message: 'Usuario creado con éxito',
        user: { id: user.id, name: user.name, email: user.email }, // Enviar datos del usuario
        token,
      })
  } catch (error) {
    console.error('Error en el registro:', error)
    res.status(500).json({ error: 'Error al crear usuario' })
  }
}

// Función para iniciar sesión
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Buscar usuario por email
    console.log('Intentando login con:', email, password)
    const user = await prisma.users.findUnique({ where: { email } })
    if (!user) {
      return res
        .status(401)
        .json({ error: 'Credenciales incorrectas. Inténtelo nuevamente!' })
    }

    // Comparar contraseñas
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ error: 'Credenciales incorrectas. Inténtelo nuevamente!' })
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    // Eliminar la contraseña del objeto antes de enviarlo
    const { password: _, ...userData } = user

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      })
      .json({ message: 'Inicio de sesión exitoso', user: userData, token }) // 🔹 Agregamos `user` en la respuesta
  } catch (error) {
    console.error('Error en el inicio de sesión:', error)
    res.status(500).json({ error: 'Error en el inicio de sesión' })
  }
}

// Función para cerrar sesión
export const logoutUser = (req, res) => {
  res
    .clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    .status(200)
    .json({ message: 'Sesión cerrada con éxito' })
}

// Exportación correcta con ES Modules
export default { register, login, logoutUser }

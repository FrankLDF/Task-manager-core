import jwt from 'jsonwebtoken'

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token

  if (!token) {
    return res
      .status(403)
      .json({ error: 'Token requerido o formato incorrecto' })
  }

  // Verificar el token con el JWT Secret
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token de autenticación inválido.' })
    }

    // Si el token es válido, asignamos el id del usuario al objeto req
    req.userId = decoded.id
    next()
  })
}

export default verifyToken

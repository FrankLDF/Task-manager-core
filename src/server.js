// Importaciones
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import path from 'path'
import authRoutes from './routes/auth.routes.js'
import taskRoutes from './routes/task.routes.js'
import cookieParser from 'cookie-parser'
// import swaggerDocs from './config/swagger.js'

// Configuración de dotenv con ruta absoluta
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const app = express()
app.disable('x-powered-by')
// swaggerDocs(app)

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN, // Permitir peticiones desde tu frontend
    credentials: true, // Permite enviar cookies en la solicitud
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas
  })
)
app.use(express.json())
app.use(morgan('dev'))
app.use(cookieParser())

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

// Ruta básica
app.get('/', (req, res) => {
  res.send('✅ La API está funcionando exitosamente...')
})

// Iniciar el servidor
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en: --> http://localhost:${PORT}`)
})

import { PrismaClient } from '@prisma/client'

// Crear una instancia de Prisma Client
const prisma = new PrismaClient()

// funcion para validar si prisma ha logrado conectarse con exito a la base de datos
const connectToDatabase = async () => {
  try {
    await prisma.$connect()
    console.log('✅ Prisma se ha conectado a la base de datos')
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error)
    process.exit(1) // Salir del proceso si no se puede conectar
  }
}

// Llamar a la función para conectar a la base de datos
connectToDatabase()
// Exportar la instancia para usarla en otros archivos
export default prisma

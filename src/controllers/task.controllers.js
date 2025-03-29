import prisma from '../config/db.js'

const allowedStatuses = ['PENDING', 'IN_PROGRESS', 'DONE']
const allowedPriorities = ['LOW', 'MEDIUM', 'HIGH']

// Obtener todas las tareas asignadas a un usuario
const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.tasks.findMany({
      where: { assigned_to: req.userId },
    })
    res.json(tasks)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener tareas' })
  }
}

// Obtener una tarea por su ID
const getTaskById = async (req, res) => {
  try {
    const task = await prisma.tasks.findUnique({
      where: { id: req.params.id },
    })

    if (!task) return res.status(404).json({ error: 'Tarea no encontrada' })

    res.json(task)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al obtener la tarea' })
  }
}

// Crear una nueva tarea
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body
    const userId = req.userId // Obtener el ID del usuario autenticado

    // Convertir los valores a mayúsculas para la validación
    const normalizedStatus = status.toUpperCase()
    const normalizedPriority = priority.toUpperCase()

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({ error: 'Estado inválido.' })
    }
    if (!allowedPriorities.includes(normalizedPriority)) {
      return res.status(400).json({ error: 'Prioridad inválida.' })
    }

    const task = await prisma.tasks.create({
      data: {
        title,
        description,
        status: normalizedStatus,
        priority: normalizedPriority,
        assigned_to: userId, // Asignar la tarea al usuario autenticado
      },
    })

    res.status(201).json(task)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: 'Error al crear la tarea' })
  }
}

// Actualizar una tarea con validación y verificación de existencia
const updateTask = async (req, res) => {
  try {
    const { title, description, status, priority } = req.body
    const { id } = req.params

    // Verificar si el ID es válido
    if (!id) {
      return res.status(400).json({ error: 'ID de tarea no proporcionado' })
    }

    // Buscar la tarea antes de actualizarla
    const existingTask = await prisma.tasks.findUnique({
      where: { id },
    })

    if (!existingTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' })
    }

    // Convertir status y priority a mayúsculas si están presentes
    const formattedStatus = status ? status.toUpperCase() : undefined
    const formattedPriority = priority ? priority.toUpperCase() : undefined

    // Validar valores permitidos
    if (formattedStatus && !allowedStatuses.includes(formattedStatus)) {
      return res.status(400).json({ error: 'Estado inválido' })
    }
    if (formattedPriority && !allowedPriorities.includes(formattedPriority)) {
      return res.status(400).json({ error: 'Prioridad inválida' })
    }

    // Actualizar la tarea
    const updatedTask = await prisma.tasks.update({
      where: { id },
      data: {
        title,
        description,
        status: formattedStatus,
        priority: formattedPriority,
      },
    })

    res.json({ message: 'Tarea actualizada', task: updatedTask })
  } catch (error) {
    console.error('Error al actualizar la tarea:', error)
    res.status(500).json({ error: 'Error al actualizar la tarea' })
  }
}

// Eliminar una tarea con verificación de existencia
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar si la tarea existe antes de eliminarla
    const existingTask = await prisma.tasks.findUnique({
      where: { id },
    })

    if (!existingTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' })
    }

    await prisma.tasks.delete({
      where: { id },
    })

    res.json({ message: 'Tarea eliminada' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al eliminar la tarea' })
  }
}

// Exportación correcta con ES Modules
export { getTasks, getTaskById, createTask, updateTask, deleteTask }

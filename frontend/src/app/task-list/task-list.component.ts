import { Component, OnInit } from '@angular/core'
import { TaskService } from '../services/task.service'
import { Task } from '../models/task.model'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

@Component({
    imports: [CommonModule, FormsModule],
    selector: 'app-task-list',
    templateUrl: './task-list.component.html',
    styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
    tasks: Task[] = [] // Almacena la lista de tareas
    newTask: Task = { _id: '', text: '', completed: false } // Nueva tarea a ser añadida
    isEditing: boolean = false // Determina si estamos editando una tarea
    editingTaskId: string | null = null // Almacena el ID de la tarea que estamos editando
    showModal: boolean = false // Para controlar la visibilidad del modal
    confirmDeleteId: string | null = null // ID de la tarea a eliminar
    showAddTaskModal: boolean = false // Para controlar la visibilidad del modal

    constructor(private taskService: TaskService) {}

    ngOnInit(): void {
        this.getTasks() // Llamamos al método para obtener las tareas al iniciar el componente
    }

    getTasks(): void {
        this.taskService.getTasks().subscribe({
            next: (tasks: Task[]) => {
                this.tasks = tasks // Asignar las tareas obtenidas a la variable 'tasks'
                console.log('Tareas obtenidas:', this.tasks) // Aquí estamos registrando las tareas para ver si llegan correctamente
            },
            error: (error) => {
                console.error('Error al obtener las tareas:', error) // Si hay un error en la solicitud, se muestra aquí
            }
        })
    }

    // Activar el modo de edición de la tarea
    editTask(task: Task): void {
        this.isEditing = true
        this.editingTaskId = task._id // Almacenamos el ID de la tarea que estamos editando
    }

    // Guardar la tarea cuando se presiona Enter o se pierde el foco
    saveTask(task: Task): void {
        if (task.text.trim()) {
            this.taskService.updateTask(task._id, task).subscribe({
                next: (updatedTask) => {
                    console.log('Tarea actualizada:', updatedTask)
                    this.isEditing = false // Desactivar el modo de edición
                    this.editingTaskId = null // Limpiar el ID de la tarea editada
                },
                error: (error) => {
                    console.error('Error al actualizar la tarea:', error)
                }
            })
        } else {
            // Si el texto está vacío, también se puede cancelar la edición
            this.isEditing = false
            this.editingTaskId = null
        }
    }

    // Actualizar el texto mientras se escribe
    onEditTextChange(task: Task, event: KeyboardEvent): void {
        task.text = (event.target as HTMLInputElement).value
    }

    openAddTaskModal() {
        this.showAddTaskModal = true
    }

    closeAddTaskModal() {
        this.showAddTaskModal = false
        this.newTask.text = '' // Reiniciar texto del input
    }

    // Método para agregar una nueva tarea
    addTask(): void {
        if (this.newTask.text.trim()) {
            this.taskService.addTask(this.newTask).subscribe({
                next: (task) => {
                    this.tasks.push(task) // Añadimos la nueva tarea a la lista de tareas
                    this.newTask = { _id: '', text: '', completed: false } // Limpiamos la nueva tarea
                    this.closeAddTaskModal() // Cerramos el modal después de añadir la tarea },
                },
                error: (error) => {
                    console.error('Error al agregar la tarea', error) // Manejo de errores
                }
            })
        }
    }

    toggleTaskCompletion(task: Task): void {
        const previousState = task.completed
        task.completed = !task.completed
        console.log('Tarea antes de la actualización:', task)

        this.taskService.updateTask(task._id, task).subscribe({
            next: (updatedTask) => {
                console.log(
                    'Tarea actualizada en la base de datos:',
                    updatedTask
                )
            },
            error: (error) => {
                console.error('Error al actualizar la tarea:', error)
            }
        })
        console.log(previousState)
        console.log(task.completed)
    }

    updateTask(task: Task): void {
        // Cambiar el estado de la tarea (por ejemplo, alternar 'completed')
        const updatedTask: Task = {
            ...task,
            completed: !task.completed // Alternar el estado de completado
        }

        // Llamar al servicio para actualizar la tarea
        this.taskService.updateTask(task._id, updatedTask).subscribe({
            next: (updatedTask) => {
                // Actualizar la tarea en la lista con la respuesta de la API
                const index = this.tasks.findIndex((t) => t._id === task._id)
                if (index !== -1) {
                    this.tasks[index] = updatedTask // Actualizar la tarea en el arreglo
                }
                console.log('Tarea actualizada:', updatedTask)
            },
            error: (error) => {
                console.error('Error al actualizar la tarea:', error)
            }
        })
    }

    confirmDeleteTask(task: Task): void {
        this.confirmDeleteId = task._id
        this.showModal = true // Mostrar el modal
    }

    closeModal(): void {
        this.showModal = false // Ocultar el modal
        this.confirmDeleteId = null // Limpiar el ID de la tarea a eliminar
    }

    deleteTask(): void {
        if (!this.confirmDeleteId) return // Verificamos que haya un ID de tarea a eliminar
        this.taskService.deleteTask(this.confirmDeleteId).subscribe({
            next: () => {
                // Eliminar la tarea de la lista local
                this.tasks = this.tasks.filter(
                    (task) => task._id !== this.confirmDeleteId
                )

                // Cerrar el modal después de eliminar la tarea
                this.closeModal()
            },
            error: (error) => {
                console.error('Error al eliminar la tarea:', error)
            }
        })
    }
}

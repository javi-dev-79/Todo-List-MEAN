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
    filteredTasks: Task[] = [] // Almacena las tareas filtradas
    newTask: Task = { _id: '', text: '', completed: false } // Nueva tarea a ser añadida
    isEditing: boolean = false // Determina si estamos editando una tarea
    editingTaskId: string | null = null // Almacena el ID de la tarea que estamos editando
    showModal: boolean = false // Para controlar la visibilidad del modal
    confirmDeleteId: string | null = null // ID de la tarea a eliminar
    showAddTaskModal: boolean = false // Para controlar la visibilidad del modal
    filter: string = 'all' // Estado del filtro

    constructor(private taskService: TaskService) {}

    ngOnInit(): void {
        this.getTasks() // Llamamos al método para obtener las tareas al iniciar el componente
    }

    getTasks(): void {
        this.taskService.getTasks().subscribe({
            next: (tasks: Task[]) => {
                this.tasks = tasks // Asignar las tareas obtenidas a la variable 'tasks'
                this.applyFilter() // Aplicar el filtro inicial
            },
            error: (error) => {
                console.error('Error al obtener las tareas:', error) // Si hay un error en la solicitud, se muestra aquí
            }
        })
    }

    applyFilter(): void {
        if (this.filter === 'completed') {
            this.filteredTasks = this.tasks.filter((task) => task.completed)
        } else if (this.filter === 'pending') {
            this.filteredTasks = this.tasks.filter((task) => !task.completed)
        } else {
            this.filteredTasks = this.tasks
        }
    }

    setFilter(filter: string): void {
        this.filter = filter
        this.applyFilter()
    }

    addTask(): void {
        if (this.newTask.text.trim()) {
            this.taskService.addTask(this.newTask).subscribe({
                next: (task) => {
                    this.tasks.push(task) // Añadimos la nueva tarea a la lista de tareas
                    this.newTask = { _id: '', text: '', completed: false } // Limpiamos la nueva tarea
                    this.closeAddTaskModal() // Cerramos el modal después de añadir la tarea
                    this.applyFilter() // Aplicar el filtro después de añadir la tarea
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
                this.applyFilter() // Aplicar el filtro después de actualizar la tarea
            },
            error: (error) => {
                console.error('Error al actualizar la tarea:', error)
                task.completed = previousState // Revertir el estado si hay un error
            }
        })
    }

    editTask(task: Task): void {
        this.isEditing = true
        this.editingTaskId = task._id // Almacenamos el ID de la tarea que estamos editando
    }

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
            this.isEditing = false
            this.editingTaskId = null
        }
    }

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

    confirmDeleteTask(task: Task): void {
        this.confirmDeleteId = task._id
        this.showModal = true // Mostrar el modal de confirmación
    }

    closeModal(): void {
        this.showModal = false // Ocultar el modal
        this.confirmDeleteId = null // Limpiar el ID de la tarea a eliminar
    }

    deleteTask(): void {
        if (!this.confirmDeleteId) return // Verificamos que haya un ID de tarea a eliminar
        this.taskService.deleteTask(this.confirmDeleteId).subscribe({
            next: () => {
                this.tasks = this.tasks.filter(
                    (task) => task._id !== this.confirmDeleteId
                )
                this.closeModal() // Cerrar el modal después de eliminar la tarea
            },
            error: (error) => {
                console.error('Error al eliminar la tarea:', error)
            }
        })
    }

    clearCompletedTasks(): void {
        const completedTasksIds = this.tasks
            .filter((task) => task.completed)
            .map((task) => task._id)

        if (completedTasksIds.length > 0) {
            this.taskService.deleteMultipleTasks(completedTasksIds).subscribe({
                next: () => {
                    this.tasks = this.tasks.filter((task) => !task.completed)
                    this.applyFilter() // Aplicar el filtro después de eliminar las tareas completadas
                },
                error: (error) => {
                    console.error(
                        'Error al eliminar las tareas completadas:',
                        error
                    )
                }
            })
        }
    }
}

import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs'
import { Task } from '../models/task.model'

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = 'http://localhost:3000/api/tasks'

    constructor(private http: HttpClient) {}

    getTasks(): Observable<Task[]> {
        return this.http.get<Task[]>(this.apiUrl)
    }

    getTask(_id: string): Observable<Task> {
        return this.http.get<Task>(`${this.apiUrl}/${_id}`)
    }

    addTask(task: Task): Observable<Task> {
        return this.http.post<Task>(this.apiUrl, task)
    }

    updateTask(_id: string, task: Task): Observable<Task> {
        return this.http.put<Task>(`${this.apiUrl}/${_id}`, task)
    }

    deleteTask(_id: string): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${_id}`)
    }
}

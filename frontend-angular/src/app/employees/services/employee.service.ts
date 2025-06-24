import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ResultHandler } from '@app/utils/services/result-handler.type';
import { Employee } from '@app/employees/models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    private readonly apiUrl = environment.apiUrl + '/employees';

    constructor(private readonly http: HttpClient) {}

    // Créer un nouvel employé
    create(employee: Employee, resultHandler?: ResultHandler<Employee>): void {
        this.http.post<Employee>(this.apiUrl, employee).subscribe({
            next: (data) => resultHandler?.next?.(data),
            error: (error) => resultHandler?.error?.(error),
        });
    }

    // Obtenir tous les employés
    getAll(resultHandler?: ResultHandler<Employee[]>): void {
        this.http.get<Employee[]>(this.apiUrl).subscribe({
            next: (data) => resultHandler?.next?.(data),
            error: (error) => resultHandler?.error?.(error),
        });
    }

    // Obtenir un employé par ID
    getById(id: string, resultHandler?: ResultHandler<Employee>): void {
        this.http.get<Employee>(`${this.apiUrl}/${id}`).subscribe({
            next: (data) => resultHandler?.next?.(data),
            error: (error) => resultHandler?.error?.(error),
        });
    }

    // Mettre à jour un employé
    update(id: string, employee: Employee, resultHandler?: ResultHandler<Employee>): void {
        this.http.put<Employee>(`${this.apiUrl}/${id}`, employee).subscribe({
            next: (data) => resultHandler?.next?.(data),
            error: (error) => resultHandler?.error?.(error),
        });
    }

    // Supprimer un employé
    delete(id: string, resultHandler?: ResultHandler<void>): void {
        this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
            next: () => resultHandler?.next?.(),
            error: (error) => resultHandler?.error?.(error),
        });
    }
}
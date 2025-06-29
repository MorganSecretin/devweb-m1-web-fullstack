import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ResultHandler } from '@app/utils/services/result-handler.type';
import { Employee } from '@app/employees/models/employee.model';
import { Absence } from '@app/employees/models/abscence.model';
import { Vacation } from '@app/employees/models/vacation.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
    private readonly apiUrl = environment.apiUrl + '/employees';

    constructor(private readonly http: HttpClient) {}

    // Compter le nombre d'employés
    count(resultHandler?: ResultHandler<number>): void {
        this.http.get<number>(`${this.apiUrl}/count`).subscribe({
            next: (data) => resultHandler?.next?.(data),
            error: (error) => resultHandler?.error?.(error),
        });
    }

    // Créer un nouvel employé
    create(employee: Employee, resultHandler?: ResultHandler<Employee>): void {
        // Convertir vers le format DTO attendu par le backend
        const employeeDto = {
            id: employee.id,
            name: employee.name,
            birth: employee.birth,
            address: employee.address,
            email: employee.email,
            phone: employee.phone,
            job: employee.job,
            salary: employee.salary,
            contractStart: employee.contractStart,
            contractEnd: employee.contractEnd,
            comment: employee.comment
        };
        
        this.http.post<Employee>(this.apiUrl, employeeDto).subscribe({
            next: (data) => resultHandler?.next?.(data),
            error: (error) => {
                console.error('Erreur création employé:', error);
                if (error.status === 409) {
                    // Erreur de conflit (email ou ID déjà existant)
                    const message = typeof error.error === 'string' ? error.error : 'Un employé avec ces informations existe déjà';
                    resultHandler?.error?.({ ...error, message });
                } else {
                    resultHandler?.error?.(error);
                }
            },
        });
    }

    // Obtenir tous les employés
    getAll(resultHandler?: ResultHandler<Employee[]>): void {
        this.http.get<Employee[]>(this.apiUrl).subscribe({
            next: (data) => {
                // S'assurer que data est un tableau, sinon retourner un tableau vide
                const employees = Array.isArray(data) ? data : [];
                resultHandler?.next?.(employees);
            },
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
        // Convertir vers le format DTO attendu par le backend
        const employeeDto = {
            id: employee.id,
            name: employee.name,
            birth: employee.birth,
            address: employee.address,
            email: employee.email,
            phone: employee.phone,
            job: employee.job,
            salary: employee.salary,
            contractStart: employee.contractStart,
            contractEnd: employee.contractEnd,
            comment: employee.comment
        };
        
        this.http.put<Employee>(`${this.apiUrl}/${id}`, employeeDto).subscribe({
            next: (data) => resultHandler?.next?.(data),
            error: (error) => {
                console.error('Erreur mise à jour employé:', error);
                if (error.status === 409) {
                    // Erreur de conflit (email déjà existant)
                    const message = typeof error.error === 'string' ? error.error : 'Un employé avec cet email existe déjà';
                    resultHandler?.error?.({ ...error, message });
                } else {
                    resultHandler?.error?.(error);
                }
            },
        });
    }

    // Vérifier si un email existe déjà (pour validation côté frontend)
    checkEmailExists(email: string, resultHandler?: ResultHandler<boolean>): void {
        this.http.get<boolean>(`${this.apiUrl}/check-email/${encodeURIComponent(email)}`).subscribe({
            next: (exists) => resultHandler?.next?.(exists),
            error: (error) => {
                // En cas d'erreur, on considère que l'email n'existe pas
                resultHandler?.next?.(false);
            },
        });
    }

    // Supprimer un employé
    delete(id: string, resultHandler?: ResultHandler<void>): void {
        this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
            next: () => resultHandler?.next?.(),
            error: (error) => resultHandler?.error?.(error),
        });
    }

    // Ajouter une absence à un employé
    addAbsenceToEmployee(employeeId: string, absence: Omit<Absence, 'id'>, resultHandler?: ResultHandler<Employee>): void {
        this.http.post<Employee>(`${this.apiUrl}/${employeeId}/absences`, absence).subscribe({
            next: (data) => resultHandler?.next?.(data),
            error: (error) => resultHandler?.error?.(error),
        });
    }

    // Ajouter un congé à un employé
    addVacationToEmployee(employeeId: string, vacation: Omit<Vacation, 'id'>, resultHandler?: ResultHandler<Employee>): void {
        this.http.post<Employee>(`${this.apiUrl}/${employeeId}/vacations`, vacation).subscribe({
            next: (data) => resultHandler?.next?.(data),
            error: (error) => resultHandler?.error?.(error),
        });
    }
}
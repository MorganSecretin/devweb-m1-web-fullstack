import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ResultHandler } from '@app/utils/services/result-handler.type';
import { Applicant } from '@app/applicants/models/applicant.model';

@Injectable({ providedIn: 'root' })
export class ApplicantService {
    private readonly apiUrl = environment.apiUrl + '/applicants';

    constructor(private readonly http: HttpClient) {}

    // Compter le nombre de candidats
    count(resultHandler?: ResultHandler<number>): void {
        this.http.get<number>(`${this.apiUrl}/count`).subscribe({
            next: (data) => resultHandler?.next?.(data),
            error: (error) => resultHandler?.error?.(error),
        });
    }

    // Créer un nouvel employé
    create(applicant: Applicant, resultHandler?: ResultHandler<Applicant>): void {
        this.http.post<Applicant>(this.apiUrl, applicant).subscribe({
            next: (data) => resultHandler?.next?.(data),
            error: (error) => resultHandler?.error?.(error),
        });
    }

    // Obtenir tous les employés
    getAll(resultHandler?: ResultHandler<Applicant[]>): void {
        this.http.get<Applicant[]>(this.apiUrl).subscribe({
            next: (data) => resultHandler?.next?.(data),
            error: (error) => resultHandler?.error?.(error),
        });
    }

    // Obtenir un employé par ID
    getById(id: string, resultHandler?: ResultHandler<Applicant>): void {
        this.http.get<Applicant>(`${this.apiUrl}/${id}`).subscribe({
            next: (data) => resultHandler?.next?.(data),
            error: (error) => resultHandler?.error?.(error),
        });
    }

    // Mettre à jour un employé
    update(id: string, applicant: Applicant, resultHandler?: ResultHandler<Applicant>): void {
        this.http.put<Applicant>(`${this.apiUrl}/${id}`, applicant).subscribe({
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
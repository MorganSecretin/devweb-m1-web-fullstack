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

    // Créer un nouvel candidat
    create(applicant: Applicant, resultHandler?: ResultHandler<Applicant>): void {
        // Convertir vers le format DTO attendu par le backend
        const applicantDto = {
            id: applicant.id,
            name: applicant.name,
            birth: applicant.birth,
            address: applicant.address,
            email: applicant.email,
            phone: applicant.phone,
            note: applicant.note,
            domain: applicant.domain,
            interviewDate: applicant.interviewDate,
            comment: applicant.comment
        };
        
        this.http.post<Applicant>(this.apiUrl, applicantDto).subscribe({
            next: (data) => resultHandler?.next?.(data),
            error: (error) => {
                if (error.status === 409) {
                    // Erreur de conflit (email ou ID déjà existant)
                    const message = typeof error.error === 'string' ? error.error : 'Un candidat avec ces informations existe déjà';
                    resultHandler?.error?.({ ...error, message });
                } else {
                    resultHandler?.error?.(error);
                }
            },
        });
    }

    // Obtenir tous les candidats
    getAll(resultHandler?: ResultHandler<Applicant[]>): void {
        this.http.get<Applicant[]>(this.apiUrl).subscribe({
            next: (data) => {
                // S'assurer que data est un tableau, sinon retourner un tableau vide
                const applicants = Array.isArray(data) ? data : [];
                resultHandler?.next?.(applicants);
            },
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

    // Mettre à jour un candidat
    update(id: string, applicant: Applicant, resultHandler?: ResultHandler<Applicant>): void {
        // Convertir vers le format DTO attendu par le backend
        const applicantDto = {
            id: applicant.id,
            name: applicant.name,
            birth: applicant.birth,
            address: applicant.address,
            email: applicant.email,
            phone: applicant.phone,
            note: applicant.note,
            domain: applicant.domain,
            interviewDate: applicant.interviewDate,
            comment: applicant.comment
        };
        
        this.http.put<Applicant>(`${this.apiUrl}/${id}`, applicantDto).subscribe({
            next: (data) => resultHandler?.next?.(data),
            error: (error) => {
                console.error('Erreur mise à jour candidat:', error);
                if (error.status === 409) {
                    // Erreur de conflit (email déjà existant)
                    const message = typeof error.error === 'string' ? error.error : 'Un candidat avec cet email existe déjà';
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

    // Supprimer un candidat
    delete(id: string, resultHandler?: ResultHandler<void>): void {
        this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
            next: () => resultHandler?.next?.(),
            error: (error) => resultHandler?.error?.(error),
        });
    }
}
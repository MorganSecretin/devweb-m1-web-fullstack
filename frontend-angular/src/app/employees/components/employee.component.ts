import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Employee } from '@app/employees/models/employee.model';
import { EmployeeService } from '@app/employees/services/employee.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-employee',
    standalone: true,
    template: `
        <div class="flex gap-4 items-center">
            <h2>Employés</h2>
            <p-button severity="primary" (click)="startCreate()">Ajouter</p-button>
        </div>
        <p-table [value]="employees" [tableStyle]="{ 'min-width': '50rem' }">
            <ng-template pTemplate="header">
                <tr>
                    <th>Nom</th>
                    <th>Occupation</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Action</th>
                </tr>
            </ng-template>
            <ng-template pTemplate="body" let-employee>
                <tr>
                    <td>{{ employee.person?.name || '' }}</td>
                    <td>{{ employee.job || '' }}</td>
                    <td>{{ employee.person?.email || '' }}</td>
                    <td>{{ employee.person?.phone || '' }}</td>
                    <td class="flex gap-2">
                        <p-button severity="success" (click)="view(employee)">Voir</p-button>
                        <p-button severity="info" (click)="update(employee)">Mettre à jour</p-button>
                        <p-button severity="danger" (click)="delete(employee)">Supprimer</p-button>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    `,
    imports: [CommonModule, TableModule, ButtonModule],
})
export class EmployeeComponent {
    protected readonly employees: Employee[] = [];

    constructor(
        private readonly employeeService: EmployeeService,
        private readonly router: Router
    ) {}

    ngOnInit() {
        this.load();
    }

    load() {
        // Vider le tableau avant de charger
        this.employees.length = 0;
        
        this.employeeService.getAll({
            next: (data) => {
                this.employees.push(...data);
                console.log('Employees loaded:', this.employees.length);
            },
            error: (error) => {
                console.error('Error loading employees:', error);
            }
        });
    }    startCreate() {
        // Navigation vers la page de création d'un nouvel employé
        this.router.navigate(['/employees/new']);
    }

    view(employee: Employee) {
        // Navigation vers la page de détails de l'employé
        if (employee && employee.person && employee.person.id) {
            this.router.navigate(['/employees/view', employee.person.id]);
        }
    }

    update(employee: Employee) {
        // Navigation vers la page de modification de l'employé
        if (employee && employee.person && employee.person.id) {
            this.router.navigate(['/employees/edit', employee.person.id]);
        }
    }

    delete(employee: Employee) {
        // Confirmer avant suppression
        if (employee && employee.person && employee.person.id) {
            const name = employee.person.name || 'cet employé';
            if (confirm(`Êtes-vous sûr de vouloir supprimer ${name} ?`)) {
                this.employeeService.delete(employee.person.id, {
                    next: () => {
                        // Recharger la liste
                        this.load();
                    },
                    error: (error) => {
                        console.error('Erreur lors de la suppression de l\'employé:', error);
                    }
                });
            }
        }
    }
}

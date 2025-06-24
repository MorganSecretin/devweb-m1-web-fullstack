import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Employee } from '@app/employees/models/employee.model';
import { EmployeeService } from '@app/employees/services/employee.service';
import { TableModule } from 'primeng/table';

@Component({
    selector: 'app-employee',
    standalone: true,
    template: `
        <h2>Employee Component</h2>
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
                    <td>{{ employee.person.name }}</td>
                    <td>{{ employee.job }}</td>
                    <td>{{ employee.person.email }}</td>
                    <td>{{ employee.person.phone }}</td>
                    <td>
                        <button type="button" (click)="viewEmployee(employee)">Voir</button>
                        <button type="button" (click)="updateEmployee(employee)">Mettre à jour</button>
                        <button type="button" (click)="deleteEmployee(employee)">Supprimer</button>
                    </td>
                </tr>
            </ng-template>
        </p-table>
    `,
    imports: [CommonModule, TableModule],
})
export class EmployeeComponent {
    protected readonly employees: Employee[] = [];

    constructor(private readonly employeeService: EmployeeService) {}

    ngOnInit() {
        this.employeeService.getAll({
            next: (data) => {
                this.employees.push(...data);
                console.log('Employees loaded:', this.employees.length);
            },
            error: (error) => {
                console.error('Error loading employees:', error);
            }
        });
    }

    viewEmployee(employee: Employee) {
        // Implémenter la logique pour voir les détails de l'employé
        console.log('Voir', employee);
    }

    updateEmployee(employee: Employee) {
        // Implémenter la logique pour mettre à jour l'employé
        console.log('Mettre à jour', employee);
    }

    deleteEmployee(employee: Employee) {
        // Implémenter la logique pour supprimer l'employé
        console.log('Supprimer', employee);
    }
}
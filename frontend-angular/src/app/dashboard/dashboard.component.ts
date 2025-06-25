import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicantService } from '@app/applicants/services/applicants.service';
import { EmployeeService } from '@app/employees/services/employee.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    template: `
    <h1>welcome</h1>
    <div style="display: flex; justify-content: center; align-items: center; height: 60vh; gap: 2rem;">
        <div
            style="background: #f5f5f5; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 2rem 3rem; min-width: 200px; text-align: center; cursor: pointer;"
            (click)="navigateTo('/employees')"
            >
            <h2>Employés</h2>
            <p style="font-size: 2.5rem; margin: 0;">{{ nbEmployees }}</p>
        </div>
        <div
            style="background: #f5f5f5; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); padding: 2rem 3rem; min-width: 200px; text-align: center; cursor: pointer;"
            (click)="navigateTo('/applicants')"
            >
            <h2>Candidats</h2>
            <p style="font-size: 2.5rem; margin: 0;">{{ nbApplicants }}</p>
        </div>
    </div>
    `
})
export class DashboardComponent {
    nbEmployees: number = 0;
    nbApplicants: number = 0;

    constructor(
        private readonly employeeService: EmployeeService,
        private readonly applicantService: ApplicantService,
        private readonly router: Router,
    ) {}

    ngOnInit() {
        this.employeeService.count({
            next: (count) => {
                this.nbEmployees = count;
            },
            error: (error) => {
                console.error('Erreur lors du comptage des employés:', error);
            }
        });

        this.applicantService.count({
            next: (count) => {
                this.nbApplicants = count;
            },
            error: (error) => {
                console.error('Erreur lors du comptage des candidats:', error);
            }
        });
    }

    navigateTo(path: string): void {
        this.router.navigate([path]);
    }
}
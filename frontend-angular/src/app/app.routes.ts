import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { LoginComponent } from './auth/components/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EmployeeComponent } from '@app/employees/components/employee.component';
import { ApplicantComponent } from '@app/applicants/components/applicant.component';
import { ApplicantViewComponent } from '@app/applicants/components/applicant-view/applicant-view.component';
import { ApplicantEditComponent } from '@app/applicants/components/applicant-edit/applicant-edit.component';
import { EmployeeViewComponent } from '@app/employees/components/employee-view/employee-view.component';
import { EmployeeEditComponent } from '@app/employees/components/employee-edit/employee-edit.component';

export const appRoutes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: 'dashboard', component: DashboardComponent },
            { path: 'register', component: RegisterComponent },
            { path: 'login', component: LoginComponent },
            { path: 'employees', component: EmployeeComponent },
            { path: 'employees/view/:id', component: EmployeeViewComponent },
            { path: 'employees/edit/:id', component: EmployeeEditComponent },
            { path: 'employees/new', component: EmployeeEditComponent },
            { path: 'applicants', component: ApplicantComponent },
            { path: 'applicants/view/:id', component: ApplicantViewComponent },
            { path: 'applicants/edit/:id', component: ApplicantEditComponent },
            { path: 'applicants/new', component: ApplicantEditComponent },
        ]
    },
    // { path: 'landing', component: Landing },
    // { path: 'notfound', component: Notfound },
    // { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    // { path: '**', redirectTo: '/notfound' }
];

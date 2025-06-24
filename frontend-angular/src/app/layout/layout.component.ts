import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TokenService } from '@app/auth/services/token.service';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterModule, ButtonModule, MenubarModule],
    template: `
        <header class="flex items-center justify-between px-6 py-4 bg-gray-100 shadow">
            <nav class="flex gap-8">
                <a routerLink="/dashboard" class="text-gray-700 hover:text-blue-600 font-semibold">Accueil</a>
                <a routerLink="/employees" class="text-gray-700 hover:text-blue-600 font-semibold">Employés</a>
                <a routerLink="/applicants" class="text-gray-700 hover:text-blue-600 font-semibold">Candidats</a>
            </nav>
            <div class="flex gap-2">
                @if (!isAuthenticated) { 
                    <button pButton type="button" label="Register" class="p-button-outlined" (click)="redirectTo('/register')"></button>
                    <button pButton type="button" label="Login" class="p-button-outlined" (click)="redirectTo('/login')"></button>
                }
                @else {
                    <button pButton type="button" label="Logout" class="p-button-danger" (click)="logout()"></button>
                }
            </div>
        </header>
        <main class="flex-1 p-6">
            <router-outlet></router-outlet>
        </main>
        <footer class="text-center py-4 bg-gray-100 border-t text-gray-500 text-sm">
            © 2024 frontend-angular. Tous droits réservés.
        </footer>
    `
})
export class LayoutComponent {
    constructor(
        private readonly router: Router,
        private readonly authService: TokenService,
    ) {}

    get isAuthenticated(): boolean {
        return this.authService.isAuthenticated();
    }

    redirectTo(path: string): void {
        this.router.navigate([path]);
    }

    logout(): void {
        this.authService.removeToken();
        this.redirectTo('/login');
    }
}
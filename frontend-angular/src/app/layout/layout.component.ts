import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [RouterModule, ButtonModule, MenubarModule],
    template: `
        <header class="flex items-center justify-between px-6 py-4 bg-gray-100 shadow">
            <nav class="flex gap-8">
                <a routerLink="/register" class="text-gray-700 hover:text-blue-600 font-semibold">Register</a>
                <a routerLink="/test2" class="text-gray-700 hover:text-blue-600 font-semibold">Test 2</a>
                <a routerLink="/test3" class="text-gray-700 hover:text-blue-600 font-semibold">Test 3</a>
            </nav>
            <div class="flex gap-2">
                <button pButton type="button" label="Register" class="p-button-outlined"></button>
                <button pButton type="button" label="Login" class="p-button-outlined"></button>
                <button pButton type="button" label="Logout" class="p-button-danger"></button>
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
export class LayoutComponent {}
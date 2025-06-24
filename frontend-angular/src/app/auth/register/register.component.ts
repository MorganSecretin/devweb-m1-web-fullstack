import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, PasswordModule, ButtonModule, SelectModule],
    template: `
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <div class="p-field">
                <label for="username">Nom d'utilisateur</label>
                <input id="username" type="text" pInputText formControlName="username" />
            </div>
            <div class="p-field">
                <label for="email">Email</label>
                <input id="email" type="email" pInputText formControlName="email" />
            </div>
            <div class="p-field">
                <label for="password">Mot de passe</label>
                <input id="password" type="password" pPassword formControlName="password" />
            </div>
            <div class="p-field">
                <label for="roles">Rôle</label>
                <p-select id="roles" formControlName="roles" [options]="roles" optionLabel="label" optionValue="value"></p-select>
            </div>
            <button pButton type="submit" label="S'inscrire" [disabled]="registerForm.invalid"></button>
        </form>
        <pre *ngIf="submitted">{{ registerForm.value | json }}</pre>
    `
})
export class RegisterComponent {
    readonly roles = [
        { label: 'Utilisateur', value: 'USER_ROLE' },
        { label: 'Administrateur', value: 'ADMIN_ROLE' }
    ];

    registerForm = new FormGroup({
        username: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', Validators.required),
        roles: new FormControl('USER_ROLE') // Rôle par défaut
    });
    submitted = false;

    constructor(private fb: FormBuilder) {}

    onSubmit() {
        this.submitted = true;
        if (this.registerForm.valid) {
            // Traitement de l'inscription ici
        }
    }
}

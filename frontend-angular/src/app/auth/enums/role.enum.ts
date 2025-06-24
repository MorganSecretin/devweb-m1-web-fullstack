export enum Role {
    ROLE_USER = 'ROLE_USER',
    ROLE_ADMIN = 'ROLE_ADMIN',
}

export const roleList: { label: string; value: Role }[] = [
    { label: 'Utilisateur', value: Role.ROLE_USER },
    { label: 'Administrateur', value: Role.ROLE_ADMIN }
];

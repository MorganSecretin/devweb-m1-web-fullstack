export interface Person {
    id: string; // 2 letters min and 2 numbers
    name?: string;
    birth?: string; // ISO date string (e.g., '2023-12-31')
    address?: string;
    email: string;
    phone?: string; // 0644043030 format
}

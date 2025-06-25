export interface Applicant {
    id: string; // Required
    name?: string;
    birth?: string; // ISO date string (e.g., '2023-12-31')
    address?: string;
    email: string; // Required
    phone?: string; // 0644043030 format
    note?: number;
    domain?: string;
    interviewDate?: string; // ISO date string (LocalDate)
    comment?: string;
}

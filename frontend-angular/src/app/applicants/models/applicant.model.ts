import { Person } from "@app/shared/models/person.model";

export interface Applicant {
    id: string; // Same as Person ID
    person: Person; // Define Person interface or import if exists
    note?: number;
    domain?: string;
    interviewDate?: string; // ISO date string (LocalDate)
    comment?: string;
}

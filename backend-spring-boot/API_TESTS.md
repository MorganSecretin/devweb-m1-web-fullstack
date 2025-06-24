# Test des endpoints CRUD pour Employee et Applicant

## Endpoints disponibles

### Employee endpoints:
- GET    /api/employees           - Lister tous les employés
- GET    /api/employees/{id}      - Obtenir un employé par ID
- POST   /api/employees           - Créer un nouvel employé
- PUT    /api/employees/{id}      - Mettre à jour un employé
- DELETE /api/employees/{id}      - Supprimer un employé

### Applicant endpoints:
- GET    /api/applicants          - Lister tous les candidats
- GET    /api/applicants/{id}     - Obtenir un candidat par ID
- POST   /api/applicants          - Créer un nouveau candidat
- PUT    /api/applicants/{id}     - Mettre à jour un candidat
- DELETE /api/applicants/{id}     - Supprimer un candidat

## Exemples de payload JSON

### Créer un employé (POST /api/employees):
```json
{
  "person": {
    "id": "AB99",
    "name": "Jean Dupont",
    "birth": "1990-05-15",
    "address": "123 Rue Test",
    "email": "jean.dupont@test.com",
    "phone": "0123456789"
  },
  "job": "Développeur Full Stack",
  "salary": 45000,
  "contractStart": "2024-01-01",
  "contractEnd": "2025-12-31",
  "comment": "Très bon profil technique"
}
```

### Créer un candidat (POST /api/applicants):
```json
{
  "person": {
    "id": "CD99",
    "name": "Marie Martin",
    "birth": "1992-03-20",
    "address": "456 Rue Candidat",
    "email": "marie.martin@test.com",
    "phone": "0987654321"
  },
  "note": 9,
  "domain": "Informatique",
  "interviewDate": "2025-07-15",
  "comment": "Excellent candidat avec une forte motivation"
}
```

## Tests rapides avec curl (Windows PowerShell):

### 1. Créer un employé:
```powershell
Invoke-RestMethod -Uri "http://localhost:8090/api/employees" -Method POST -ContentType "application/json" -Body '{
  "person": {
    "id": "AB99",
    "name": "Jean Dupont",
    "birth": "1990-05-15",
    "address": "123 Rue Test",
    "email": "jean.dupont@test.com",
    "phone": "0123456789"
  },
  "job": "Développeur Full Stack",
  "salary": 45000,
  "contractStart": "2024-01-01",
  "contractEnd": "2025-12-31",
  "comment": "Très bon profil technique"
}'
```

### 2. Lister tous les employés:
```powershell
Invoke-RestMethod -Uri "http://localhost:8090/api/employees" -Method GET
```

### 3. Créer un candidat:
```powershell
Invoke-RestMethod -Uri "http://localhost:8090/api/applicants" -Method POST -ContentType "application/json" -Body '{
  "person": {
    "id": "CD99",
    "name": "Marie Martin",
    "birth": "1992-03-20",
    "address": "456 Rue Candidat",
    "email": "marie.martin@test.com",
    "phone": "0987654321"
  },
  "note": 9,
  "domain": "Informatique",
  "interviewDate": "2025-07-15",
  "comment": "Excellent candidat avec une forte motivation"
}'
```

### 4. Lister tous les candidats:
```powershell
Invoke-RestMethod -Uri "http://localhost:8090/api/applicants" -Method GET
```

## Structure des DTOs créés:

### PersonDto:
- id: String (4 caractères)
- name: String
- birth: LocalDate
- address: String
- email: String
- phone: String (10 caractères)

### EmployeeDto:
- person: PersonDto
- job: String
- salary: float
- contractStart: LocalDate
- contractEnd: LocalDate
- comment: String

### ApplicantDto:
- person: PersonDto
- note: Integer (0-10)
- domain: String
- interviewDate: LocalDate
- comment: String

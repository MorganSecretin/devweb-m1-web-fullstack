
-- Données de test
-- Password = root --
INSERT INTO users (name, password, email, roles, is_enabled) VALUES
    ('Alice Dupont', '$2a$12$eX0xX7r2vl//ZxtBdTPrF.NXb35c1ZlrJet2S5dFG8JdBdRbRMXjC', 'alice.dupont@example.com', 'ROLE_USER', true),
    ('Bob Martin', '$2a$12$eX0xX7r2vl//ZxtBdTPrF.NXb35c1ZlrJet2S5dFG8JdBdRbRMXjC', 'bob.martin@example.com', 'ROLE_ADMIN,ROLE_USER', true);

-- Données pour persons
INSERT INTO persons (id, name, birth, address, email, phone) VALUES
    ('AB12', 'Alice Dupont', '1995-05-20', '123 rue A', 'alice@example.com', '0612345678'),
    ('CD34', 'Charles Durand', '1988-09-15', '456 rue B', 'charles@example.com', '0698765432'),
    ('EF56', 'Emma Fontaine', '1990-03-10', '789 rue C', 'emma@example.com', '0677889900'),
    ('GH78', 'Gabriel Martin', '1985-11-30', '321 rue D', 'gabriel@example.com', '0655443322');

-- Données pour les employés
INSERT INTO employees (id, job, salary, contract_start, contract_end, comment) VALUES
    ('CD34', 'Développeur', 42000, '2024-01-01', '2026-01-01', 'Employé confirmé'),
    ('EF56', 'Chargée RH', 39000, '2024-03-01', '2025-12-31', 'Polyvalente'),
    ('GH78', 'Chef de projet', 53000, '2023-05-01', '2025-05-01', 'Leadership apprécié');

-- Données pour les candidats
INSERT INTO applicants (id, note, domain, interview_date, comment) VALUES
    ('AB12', 8, 'Informatique', '2025-07-01', 'Bon profil');

-- Données pour Vacation (avec références vers les employés)
INSERT INTO vacations (start_date, end_date, employee_id) VALUES
    ('2024-07-01', '2024-07-15', 'CD34'),
    ('2024-08-01', '2024-08-10', 'EF56'),
    ('2024-12-20', '2025-01-05', 'GH78');

-- Données pour Absence (avec références vers les employés)
INSERT INTO absences (date, description, employee_id) VALUES
    ('2024-06-01', 'Maladie', 'CD34'),
    ('2024-06-05', 'Rendez-vous médical', 'EF56'),
    ('2024-06-10', 'Absence injustifiée', 'GH78');

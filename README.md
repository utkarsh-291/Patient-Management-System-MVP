# MediCore - Hospital Patient Management System

A full-stack Patient Management System (PMS) designed to streamline hospital operation. It features role-based access control (Admin vs. Doctor), patient records, appointment scheduling, and medical history tracking.

# TECH STACK

* **Backend:** Django, Django REST Framework (DRF)
* **Frontend:** React, Tailwind CSS, Vite
* **Database:** PostgreSQL
* **Authentication:** JWT (JSON Web Tokens)

## Features

* **Role-Based Access:**
    * **Admins:** Full control (Add/Delete Patients, Manage Appointments).
    * **Doctors:** View/Add records, but restricted from deleting sensitive data.
* **Dashboard:** Real-time statistics of total patients and pending appointments.
* **Patient Management:** Complete CRUD operations for patient data.
* **Appointment System:** Schedule, Cancel, and Mark appointments as "Completed".
* **Medical Records:** Digital history of diagnoses and prescriptions.

## Installation & Setup

### Prerequisites
* Node.js & npm
* Python 3.x
* PostgreSQL

### 1. Clone the Repository
```bash
git clone https://github.com/utkarsh-291/Patient-Management-System-MVP.git
```
### 2. Backend Setup (Django)
```bash
cd backend
python -m venv venv

#activate Virtual environment
venv\Scripts\activate

pip install -r requirements.txt

python manage.py migrate
python manage.py runserver
```

### 3. Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```

# Login Credentials (Demo)

Admin Account (Full Access):
* Username: admin
* Password: admin

Doctor Account (Restricted Access):
* Username: dr_house
* Password: testpass123

Developed for College Minor Project





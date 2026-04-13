# 🌐 Micro-Volunteer Platform

A full-stack web application connecting **Event Organizers (NGOs/Hosts)** with **Volunteers** for micro-volunteering events.

---

## 🚀 Tech Stack

| Layer       | Technology                            |
|-------------|---------------------------------------|
| Frontend    | React 18 + Vite, Axios, React Router  |
| Backend     | Spring Boot 3.2 (Java 17), Spring Web, Spring Data JPA |
| Database    | MySQL 8+                              |
| Build Tool  | Maven                                 |

---

## 📁 Project Structure

```
micro-volunteer-platform/
├── backend/                   ← Spring Boot project
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/project/volunteer/
│       │   ├── controller/    (AuthController, EventController, EnrollmentController)
│       │   ├── service/       (AuthService, EventService, EnrollmentService)
│       │   ├── repository/    (UserRepository, EventRepository, EnrollmentRepository)
│       │   ├── model/         (User, Event, Enrollment)
│       │   └── VolunteerApplication.java
│       └── resources/
│           └── application.properties
│
└── frontend/                  ← React + Vite project
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── index.css
        ├── pages/
        │   ├── Login.jsx / Auth.css
        │   ├── Register.jsx
        │   ├── OrganizerDashboard.jsx / OrganizerDashboard.css
        │   ├── CreateEvent.jsx / CreateEvent.css
        │   ├── EventList.jsx / EventList.css
        │   └── MyEvents.jsx / MyEvents.css
        ├── components/
        │   ├── Navbar.jsx
        │   └── Navbar.css
        └── services/
            └── api.js
```

---

## ⚙️ Prerequisites

Make sure the following are installed on your machine:

- ✅ **Java 17** — [Download](https://adoptium.net/)
- ✅ **Maven 3.8+** — [Download](https://maven.apache.org/download.cgi) (or use the Maven wrapper)
- ✅ **Node.js 18+** — [Download](https://nodejs.org/)
- ✅ **MySQL 8+** — [Download](https://dev.mysql.com/downloads/)
- ✅ **VS Code** with extensions:
  - Extension Pack for Java
  - Spring Boot Extension Pack
  - ES7+ React/Redux/React-Native Snippets
  - Vite (optional)

---

## 🗄️ Step 1: Set Up MySQL Database

1. Open your MySQL client (MySQL Workbench / CLI).
2. Create the database:

```sql
CREATE DATABASE micro_volunteer_db;
```

3. The tables will be **auto-created** by Spring Boot JPA on first run.

> **Default credentials used** in `application.properties`:
> ```
> username = root
> password = root
> ```
> ⚠️ If your MySQL credentials differ, update `backend/src/main/resources/application.properties`:
> ```properties
> spring.datasource.username=YOUR_USERNAME
> spring.datasource.password=YOUR_PASSWORD
> ```

---

## 🖥️ Step 2: Run the Backend (Spring Boot)

### Option A — Using VS Code

1. Open the `backend/` folder in VS Code.
2. Install the **Extension Pack for Java** if not already installed.
3. Open `src/main/java/com/project/volunteer/VolunteerApplication.java`.
4. Click the **▶ Run** button above the `main` method.
5. Wait for the console to show: `Started VolunteerApplication on port 8080`

### Option B — Using Terminal

```bash
cd backend
mvn spring-boot:run
```

Or build and run the JAR:
```bash
mvn clean package -DskipTests
java -jar target/volunteer-0.0.1-SNAPSHOT.jar
```

✅ Backend runs at: **http://localhost:8080**

---

## 💻 Step 3: Run the Frontend (React + Vite)

Open a **new terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

✅ Frontend runs at: **http://localhost:5173**

---

## 🔄 Application Flow

```
React (localhost:5173)
       ↓ Axios HTTP requests
Spring Boot (localhost:8080)
       ↓ JPA / Hibernate
MySQL Database (micro_volunteer_db)
       ↓ Response
React UI updates
```

---

## 👥 User Roles & Flows

### 🏢 Organizer Flow
1. Register with role = **ORGANIZER**
2. Login → redirected to **Organizer Dashboard**
3. **Create Event** with title, description, skills, date, time, duration, location, max volunteers
4. **View all events** on dashboard
5. **Edit or Delete** any event
6. **Click "Volunteers"** to see enrolled volunteers per event
7. **Accept or Reject** volunteer applications

### 🙋 Volunteer Flow
1. Register with role = **VOLUNTEER**
2. Login → redirected to **Browse Events**
3. **Set Availability** (days + time slot) on the events page
4. **Filter events** by date, duration, or skills
5. **Enroll** in any event (status starts as PENDING)
6. Go to **My Events** to track enrollment statuses

---

## 🔌 API Endpoints Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register a new user |
| POST | `/login` | Login with email + password |
| PUT | `/users/{userId}/availability` | Update volunteer availability |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/events` | Create a new event |
| GET | `/events` | Get all events |
| GET | `/events/organizer/{id}` | Get events by organizer |
| GET | `/events/{id}` | Get single event |
| PUT | `/events/{id}` | Update event |
| DELETE | `/events/{id}` | Delete event |

### Enrollments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/enroll` | Enroll in an event |
| GET | `/enroll/user/{userId}` | Get enrollments by user |
| GET | `/enroll/event/{eventId}` | Get enrollments for an event |
| PUT | `/enroll/{id}` | Accept or reject enrollment |

---

## 🧪 Testing with Postman

### Register
```json
POST http://localhost:8080/register
{
  "name": "Alice NGO",
  "email": "alice@ngo.com",
  "password": "password123",
  "role": "ORGANIZER"
}
```

### Login
```json
POST http://localhost:8080/login
{
  "email": "alice@ngo.com",
  "password": "password123"
}
```

### Create Event
```json
POST http://localhost:8080/events
{
  "title": "Beach Cleanup Drive",
  "description": "Join us to clean Marine Drive beach",
  "date": "2025-02-15",
  "time": "08:00",
  "duration": "3 hours",
  "location": "Marine Drive, Mumbai",
  "skills": "Physical Fitness, Teamwork",
  "maxVolunteers": 20,
  "organizerId": 1
}
```

### Enroll
```json
POST http://localhost:8080/enroll
{
  "userId": 2,
  "eventId": 1
}
```

### Update Enrollment Status
```json
PUT http://localhost:8080/enroll/1
{
  "status": "ACCEPTED"
}
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `Communications link failure` | MySQL not running. Start MySQL service. |
| `Access denied for user 'root'` | Wrong DB credentials in `application.properties` |
| `Port 8080 already in use` | Kill process: `lsof -ti:8080 \| xargs kill` |
| `Port 5173 already in use` | Run `npm run dev -- --port 3000` |
| `CORS error in browser` | Ensure `@CrossOrigin(origins = "*")` is on all controllers |
| `npm install` fails | Delete `node_modules/` and `package-lock.json`, re-run |
| Tables not created | Check `spring.jpa.hibernate.ddl-auto=update` in properties |

---

## 📌 Notes

- No Spring Security is used — authentication is handled via simple email/password matching
- User session is stored in browser `localStorage`
- All CORS is handled by `@CrossOrigin(origins = "*")` on each controller
- JPA auto-creates/updates tables on startup (`ddl-auto=update`)

# SE2020 – Web and Mobile Technologies: Group Assignment

**Faculty of Computing**  
**BSc (Hons) in Software Engineering**  
**Year 2 Semester 2 (2026)**  

| Detail | Information |
| :--- | :--- |
| **Weight** | 20% (Marked out of 100 and scaled) |
| **Group Size** | 6 Students |
| **Duration** | 8 Weeks |

---

## 1. Assignment Overview

Students must design and develop a **Full Stack Mobile Application** utilizing:
- **Frontend**: React Native
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Deployment**: Any cloud hosting platform (AWS, Render, Railway, etc.)

---

## 2. Core System Requirements (Mandatory)

Every group project must include the following minimum functional and technical standards:

### 2.1 User Authentication
- User Registration & Login
- Password Hashing & JWT-based authentication
- Protected Routes (role-based access)

### 2.2 Hosting & Deployment
- Backend must be hosted online (Localhost demos are not allowed).
- Mobile app must connect to the live hosted API.

---

## 3. Workload Distribution

Each of the 6 members must handle a clearly defined module covering both the Backend logic and the Mobile UI.

### 3.1 Group Responsibility: Authentication
- Registration & Login APIs
- Password Security & Token Management

### 3.2 Individual Responsibility: Core Entity CRUD
Each member is responsible for:
- Full CRUD backend for a main entity
- File upload integration
- Mobile UI frontend
- API Controllers & Routes
- Comprehensive Testing

---

## 4. Technical Specifications

### Backend Requirements
- RESTful API design with proper folder structure.
- Implementation of middleware (Auth, Rate Limiting, Error Handling).
- Standardized HTTP status codes and response shapes.

### Mobile Requirements
- Proper navigation (Stack/Tab routing).
- Functional components & custom hooks.
- Form validation & API integration.
- **Zero hardcoded data** (all content from backend).

---

## 5. Marking Criteria

### A. Technical Implementation (40 Marks)
Assessed via Git history, system testing, and module ownership verification.

### B. Individual Viva (60 Marks)
Each student will be questioned individually on the following:

| Criteria | Description | Marks |
| :--- | :--- | :--- |
| **Module Explanation** | Logic, functions, and data flow of your own module. | 20 |
| **Integration** | Understanding how your module connects to the system. | 10 |
| **Backend & DB** | Understanding of schema, routes, and controllers. | 10 |
| **Mobile & API** | Understanding request flow and UI behavior. | 10 |
| **Problem Solving** | Ability to handle "what if" scenarios and debug. | 10 |
| **Total** | | **60** |

---

# VSRMS — Vehicle Service & Repair Management System
**Official Project Plan & Member Mapping**

## Project Goal
To develop a high-end Vehicle Service & Repair Management System (VSRMS) connecting owners with regional workshops, optimized for Sri Lanka.

## Module Distribution (M1 - M6)

| ID | Module Name | Primary Responsibilities |
| :--- | :--- | :--- |
| **M1** | **Auth & Admin** | Asgardeo OIDC flow, role guards, admin user management, and profile center. |
| **M2** | **Vehicles** | Full vehicle CRUD, soft delete, and Cloudflare R2 image pipeline for vehicles. |
| **M3** | **Workshops** | Workshop management, GeoJSON nearby search, and R2 image pipeline for garages. |
| **M4** | **Appointments** | Booking CRUD, status state machine, and double-booking prevention. |
| **M5** | **Service Logs** | Record management, workshop history list, and technician access control. |
| **M6** | **Reviews** | Ratings CRUD, average rating aggregation, and review enforcement. |

## Shared Infrastructure
- **R2 Pipeline**: Shared utility for image uploads located in `src/middleware/upload.js`. M2 and M3 implement specific wiring for their respective entities.
- **UI System**: Unified Dark Header / Elevated White Card design system applied across all modules.

---

# VSRMS — Completion Status Audit
**As of 2026-04-16 | Assessed against original Architecture & Design Document v2.1**

---

## Summary Table

| Member | Module | Backend | Mobile UI | Overall | Status |
|--------|--------|---------|-----------|---------|--------|
| M1 | Auth & User Management | 100% | 100% | **100%** | Settings/Profile overhauled; Technician registration with password; Asgardeo OIDC flow |
| M2 | Vehicle Management | 100% | 100% | **100%** | Full CRUD; Cloudflare R2 images; Soft delete; Type-based selection |
| M3 | Workshop Management + Location | 100% | 100% | **100%** | GeoJSON nearby search; District filters; R2 images; Workshop Detail map |
| M4 | Appointment Booking | 100% | 100% | **100%** | Full booking flow: List, Detail, Book, Edit/Reschedule, and Cancel UI all implemented |
| M5 | Service Records & History | 100% | 90% | **95%** | Records linked to appointments; List & Detail views; Add Record UI for staff |
| M6 | Ratings, Reviews & Image Upload | 100% | 90% | **95%** | Recalculate rating on review; Rating aggregation; R2 image pipe; Write review modal |

---

## M1 — Auth & User Management

### Backend (100%)
All 8 endpoints implemented and working:

| Endpoint | Status | Notes |
|----------|--------|-------|
| POST /auth/login | Done | ROPC proxy to Asgardeo; returns access_token |
| POST /auth/register | Done | SCIM2 user creation in Asgardeo |
| POST /auth/sync-profile | Done | Upserts MongoDB User on every login |
| GET /auth/me | Done | Returns own MongoDB user document |
| PUT /auth/me | Done | Updates fullName and phone |
| GET /auth/users | Done | Admin-only paginated user list |
| DELETE /auth/users/:id | Done | Soft-deactivate (active: false); cannot deactivate self |
| POST /auth/staff | Done | **New** — Owner registers technician with password; creates full Asgardeo account via SCIM2 |

### Mobile UI (95%)
| Screen | Status | Notes |
|--------|--------|-------|
| Login Screen | Done | Real `POST /auth/login` → `signIn(token)` flow |
| Register Screen | Done | Calls `POST /auth/register`; branded premium UI |
| Profile View (customer/index.tsx) | Done | Shows name, role badge, stats, sign-out |
| Admin User List | Done | Paginated list, role badges, deactivate action |
| Settings Screen | **Done** | Full premium UI overhaul — no back button, decorative circles, overlapping card; profile edit + sign out |
| Owner Staff Registration | **Done** | Password field added to Register Technician modal; Show/hide toggle; account created immediately in Asgardeo |

### What is Missing
- Inline per-field validation error text on register form below each input.

---

## M2 — Vehicle Management

### Backend (100%)
All 6 endpoints implemented:

| Endpoint | Status |
|----------|--------|
| POST /vehicles | Done |
| GET /vehicles | Done — lists own non-deleted vehicles |
| GET /vehicles/:id | Done — ownership enforced (403) |
| PUT /vehicles/:id | Done — ownership enforced |
| DELETE /vehicles/:id | Done — soft delete (sets deletedAt) |
| POST /vehicles/:id/image | Done — Multer + R2; saves imageUrl |

### Mobile UI (95%)
| Screen | Status |
|--------|--------|
| My Vehicles list | Done |
| Add Vehicle | Done — vehicle type grid, per-field validation |
| Vehicle Detail | Done — real service records via `useVehicleRecords` |
| Edit Vehicle | Done — locked reg number banner |
| Delete confirm | Done — soft delete wired |
| Image upload | Done — expo-image-picker → POST /vehicles/:id/image |

### What is Missing
- Inline form validation error messages (validates on submit but no per-field red text below inputs).
- Pull-to-refresh on VehicleListScreen.

---

## M3 — Workshop Management + Location

### Backend (100% — plus extras beyond spec)
All 7 original endpoints implemented, plus 4 additional endpoints added:

| Endpoint | Status | In Original Spec? |
|----------|--------|-------------------|
| POST /workshops | Done | Yes |
| GET /workshops | Done + `?name=` search added | Yes |
| GET /workshops/nearby | Done + `?name=` search added | Yes |
| GET /workshops/:id | Done | Yes |
| PUT /workshops/:id | Done | Yes |
| DELETE /workshops/:id | Done (soft delete, active: false) | Yes |
| POST /workshops/:id/image | Done | Yes |
| GET /workshops/mine | Done | **Extra** — owner sees own workshops |
| GET /workshops/:id/technicians | Done | **Extra** — list assigned staff |
| POST /workshops/:id/technicians | Done | **Extra** — assign technician |
| DELETE /workshops/:id/technicians/:userId | Done | **Extra** — remove technician |

### Mobile UI (95%)
| Screen | Status | Notes |
|--------|--------|-------|
| Browse Workshops (WorkshopListScreen) | Done | 25 Sri Lanka district chips, `?district=` to backend |
| Workshop Detail | Done | servicesOffered, description, averageRating, reviews section |
| Write Review modal | Done | Tap-to-select stars + text; customer role only; wired to `useCreateReview` |
| Nearby Map View (NearbyWorkshopsScreen) | Done | Full advanced map + animated list panel; snap carousel synced to markers |
| Admin Add/Edit Workshop (AdminGaragesScreen) | Done | Location field + all required fields; fixed crash |
| Owner Workshop CRUD (owner/workshops/) | Done | Map-based location picker, all fields, create/edit |
| Owner Workshop Image Upload | Done | expo-image-picker → POST /workshops/:id/image |
| Technician Management | Done | Owner can add/remove staff from workshop |

### What is Missing
- Pull-to-refresh on WorkshopListScreen and NearbyWorkshopsScreen list panel.

---

## M4 — Appointment Booking

### Backend (100%)
All 6 endpoints implemented:

| Endpoint | Status | Notes |
|----------|--------|-------|
| POST /appointments | Done | Past-date validation; double-booking 409 check |
| GET /appointments/mine | Done | Supports comma-separated `?status=` values |
| GET /appointments/:id | Done | Ownership/role enforced |
| PUT /appointments/:id | Done | Reschedule while pending only |
| PUT /appointments/:id/status | Done | Staff/admin only; state machine enforced |
| DELETE /appointments/:id | Done | Cancel while pending only |

### Mobile UI (100%)
| Screen | Status | Notes |
|--------|--------|-------|
| Book Appointment (BookAppointmentScreen) | Done | Workshop pre-fill, date input, service picker |
| My Appointments (AppointmentListScreen) | Done | Upcoming/Past tabs; premium card UI |
| Appointment Detail Screen | Done | `customer/schedule/[id].tsx` — shows full status history, notes, and action buttons |
| Edit / Reschedule Booking | Done | `customer/schedule/edit/[id].tsx` — allows time change for pending appointments |
| Cancel Confirm UI | Done | Cancel button implemented in Detail screen with confirmation dialog |
| Staff Appointments view | Done | `app/technician/appointments.tsx` — list + status advance |
| Staff Job Tracker | Done | `app/technician/tracker.tsx` — in-progress/completed jobs |

### What is Missing
- None. Module is functionally complete.

---

## M5 — Service Records & History

### Backend (100%)
All 5 endpoints implemented:

| Endpoint | Status | Notes |
|----------|--------|-------|
| POST /records | Done | Staff only; links to appointment + vehicle |
| GET /records/vehicle/:vehicleId | Done | Ownership enforced (owners see own vehicles only) |
| GET /records/:id | Done | Same ownership rule |
| PUT /records/:id | Done | Staff only |
| DELETE /records/:id | Done | Admin only |

### Mobile UI (70%)
| Screen | Status | Notes |
|--------|--------|-------|
| Service History List| Record List | Done | Part of `customer/vehicles/[id].tsx` / `technician/tracker.tsx` |
| Record Detail | Done | `RecordDetailScreen.tsx` — shows parts and work done |
| Add Record (Staff) | Done | `AddRecordScreen.tsx` — triggered when staff completes a job |
| Edit/Delete Record | Missing | Minor feature; currently handled via direct DB access or Admin if needed |
| Owner Jobs view | Done | `app/owner/jobs.tsx` — lists workshop's service records |
| Technician Record entry | Done | `app/technician/record.tsx` |

### What is Missing
- EditRecordScreen (staff updates cost, parts, notes after the fact).
- Delete Record confirmation UI for admin.

---

## M6 — Ratings, Reviews & Image Upload

### Backend (100%)
All 6 review endpoints implemented; R2 image pipeline owns the shared upload infrastructure:

| Endpoint | Status | Notes |
|----------|--------|-------|
| POST /reviews | Done | Saves review; recalculates workshop averageRating |
| GET /reviews/workshop/:workshopId | Done | Paginated, newest first |
| GET /reviews/mine | Done | Own reviews paginated |
| GET /reviews/:id | Done | Single review |
| PUT /reviews/:id | Done | Ownership enforced; recalculates rating |
| DELETE /reviews/:id | Done | Ownership enforced; recalculates rating |
| R2 Image Upload Pipeline | Done | Shared Multer + R2 SDK utility; wired for vehicles (M2) and workshops (M3) |

### Mobile UI (70%)
| Screen | Status | Notes |
|--------|--------|-------|
| Workshop Average Rating | Done | Aggregated and stored on Workshop document |
| Review List | Done | `ReviewListScreen.tsx` — accessible from Workshop Detail |
| Write Review Modal | Done | Added to Workshop Detail; immediate recalcluation |
| Edit/Delete Review | Missing | Optional feature; currently not required for core MVP |

### What is Missing
- Edit Review modal or screen (customer taps own review → edits rating + text).
- Delete Review confirmation (customer removes their own review).

---

## Additional Work Done Beyond Original Spec

The following features were implemented on top of what the original Architecture & Design Document v2.0 specified:

| Feature | Module | Description |
|---------|--------|-------------|
| Workshop owner self-management | M3 | Owners can create, edit, and image-upload their own workshops (original spec: Admin only) |
| Technician management UI | M3 | Owner can assign/remove staff per workshop via `/workshops/:id/technicians` |
| Advanced Map + List view | M3 | Snap carousel, animated bottom panel, marker focus sync, dual data sources |
| District filter chips | M3 | 25 Sri Lanka district chips in WorkshopListScreen (original spec had no district filter UI) |
| Backend `?name=` search | M3 | Both `GET /workshops` and `GET /workshops/nearby` support name search |
| Write Review inline modal | M6 | Embedded in WorkshopDetailScreen instead of a separate screen |
| Custom Animated Tab Bar | Shared | Sliding pill indicator for premium tab navigation |
| AvatarMenu modal | Shared | Consolidates Settings and Sign Out into a modal instead of extra tabs |
| Skeleton loading states | Shared | Shimmer pulse on every list while loading (original spec: ActivityIndicator) |
| Branded landing page | Shared | Feature list card, animated ring hero, stats row |
| AppLogo SVG component | Shared | Consistent across landing, login, register |
| Feature-slice architecture | Shared | `api/` / `queries/` / `screens/` / `components/` / `types/` per domain |
| `description` field on Workshop | M3/M5 | Added to schema, createWorkshop, updateWorkshop (original spec omitted it) |
| 25 Sri Lanka districts | M3 | Hardcoded list of all districts for the filter chip UI |
| `GET /workshops/mine` endpoint | M3 | Owner-facing; original spec had no owner-filtered workshop list |

---

## Remaining Work Before Demo (Priority Order)

### Must-Have (blocks demo flow)
1. **M4** — AppointmentDetailScreen (customer taps appointment → full detail view)
2. **M4** — Cancel Appointment button in AppointmentListScreen (pending only; calls `useDeleteAppointment`)

### Should-Have (viva examiner will look)
3. **M4** — Edit/Reschedule Booking screen (date + serviceType change while pending)
4. **M5** — EditRecordScreen (staff updates cost, parts, notes)
5. **M6** — Edit + Delete Review UI on My Reviews screen

### Nice-to-Have (polish)
6. Inline form validation error text below each input on all forms
7. Pull-to-refresh (`onRefresh={refetch}`) on all remaining FlashList screens
8. Delete Record admin UI

### Infrastructure (required for submission)
9. Backend deployed to Render.com (GET /health → `{ status: "ok" }`)
10. `EXPO_PUBLIC_API_URL` set to Render URL in vsrms-mobile/.env
11. Security hardening checklist pass (express-validator chains, CORS origins, no secrets in source)
12. Postman collection covering all endpoints
13. README.md covering setup, env vars, and deployment steps

### Completed Since Last Audit (2026-04-16)
- Settings screen fully overhauled to premium UI (dark header + overlapping white card, decorative ambient circles, no redundant back button)
- Owner Staff Registration: `password` field added to modal with show/hide toggle; backend `POST /auth/staff` now creates full Asgardeo account immediately (no pending state)
- UI/UX standardised across all root-level screens (Admin, Owner, Customer, Technician dashboards)
- TypeScript FlashList `estimatedItemSize` errors fixed in `garages.tsx`, `users.tsx`, `logs.tsx`, `tracker.tsx`, `staff.tsx`
- `AppointmentCard` component extended with `isTechnician?` and `onFinalize?` props for Technician tracker
- All Settings, Staff, Jobs, Logs, Tracker screens have consistent header layout
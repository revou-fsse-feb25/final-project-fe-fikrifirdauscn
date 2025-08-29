# Music Events – Frontend (Next.js)

## 1) Project Description
A lightweight Next.js frontend for browsing music events. It provides a responsive UI to explore events, filter by category or name, and view event details. It is designed to work with a NestJS backend via direct calls or through a built-in proxy for cookie-based authentication.

---

## 2) List of Features
- Browse list of events with search (by name/artist) and category filter
- Event detail view (date, location, artist, price, availability, image)
- Category dropdown sourced from backend
- Configurable API access:
  - **Direct mode** (call backend domain)
  - **Proxy mode** (use Next.js API routes → simplifies cookies/CORS)
- Basic error states and loading indicators
- Ready for cookie-only auth backends (no localStorage token needed)

---

## 3) Tech Stack Used
- **Framework**: Next.js (React, App Router)
- **Language**: TypeScript
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS (and utility classes)
- **Icons/UI (optional)**: lucide-react, shadcn/ui (if included)
- **Tooling**: ESLint, Prettier (optional scripts)

---

## 4) Installation & Usage Instructions

### Prerequisites
- Node.js 18+ (or current LTS)
- A running backend (NestJS) that exposes `/api` routes (events, categories)

### Environment Variables
Create a `.env.local` with one of the following setups:

**A. Proxy Mode (recommended for cookie-based auth)**

## Use Next.js API routes as a proxy (first-party cookies)
### NEXT_PUBLIC_USE_PROXY=1
**B. Direct Mode**

## Directly call your backend base URL (must include /api server prefix if used)
NEXT_PUBLIC_API_BASE=https://final-project-be-fikrifirdauscn-production.up.railway.app/
NEXT_PUBLIC_USE_PROXY=0


> **Notes**
> - Proxy mode simplifies CORS and cookies (SameSite=Lax).
> - Direct mode across domains requires backend cookies set with `SameSite=None; Secure` and proper CORS.

### Install & Run
```bash```
# Install dependencies
npm install

# Development
npm run dev

# Production build & run
npm run build
npm run start

### Project Scripts (typical)
npm run lint         # Lint
npm run format       # Format (if configured)


---
## 5) Links to Frontend:
Frontend: (https://final-project-be-fikrifirdauscn-production.up.railway.app/)

---
## 6) Screenshots:
<img src=docs/screenshots/Snipaste_2025-08-29_23-53-38.png>
<img src=docs/screenshots/Snipaste_2025-08-29_23-54-20.png>
<img src=docs/screenshots/Snipaste_2025-08-29_23-54-34.png>
<img src=docs/screenshots/Snipaste_2025-08-29_23-54-42.png>
<img src=docs/screenshots/Snipaste_2025-08-29_23-55-03.png>
<img src=docs/screenshots/Snipaste_2025-08-29_23-55-03.png>
<img src=docs/screenshots/Snipaste_2025-08-29_23-55-13.png>
<img src=docs/screenshots/Snipaste_2025-08-29_23-55-44.png>
<img src=docs/screenshots/Snipaste_2025-08-29_23-56-18.png>

---
## 7) ERD on Documentation:


erDiagram
  CATEGORY ||--o{ EVENT : "has many"
  CATEGORY {
    string id PK
    string name
    datetime createdAt optional
    datetime updatedAt optional
  }
  EVENT {
    string id PK
    string name
    string description optional
    datetime date
    string location
    string artist
    decimal price
    int totalTickets
    int availableTickets
    string imageUrl optional
    string categoryId FK optional
    datetime createdAt optional
    datetime updatedAt optional
  }


Table category {
  id          varchar [pk]
  name        varchar
  created_at  timestamp
  updated_at  timestamp
}

Table event {
  id                varchar [pk]
  name              varchar
  description       text
  date              timestamp
  location          varchar
  artist            varchar
  price             decimal(12,2)
  total_tickets     int
  available_tickets int
  image_url         varchar
  category_id       varchar [ref: > category.id] // optional
  created_at        timestamp
  updated_at        timestamp
}

Ref: category.id < event.category_id



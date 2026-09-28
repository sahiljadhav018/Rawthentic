# 🌐 Smart Tour Connect (STC)
### Smart India Hackathon (SIH 2026) | Problem Statement: SIH26204
**Team**: `Rawauthentic` | **Theme**: `Travel & Tourism` | **Category**: `Software`  
**Lead Developer & System Architect**: Sahil Jadhav ([sahilujadhav143@gmail.com](mailto:sahilujadhav143@gmail.com))

> **Smart Tour Connect** is an autonomous multi-modal transit grid and direct P2P tourism platform. It eliminates 18–30% OTA middleman fees, empowers rural homestay economies, computes predictive budget calculations, and provides an offline-first 24/7 SOS safety grid.

---

## 📑 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Complete Technology Stack](#2-complete-technology-stack)
   - [A. Frontend Technologies & Libraries](#a-frontend-technologies--libraries)
   - [B. Backend & Database Technologies](#b-backend--database-technologies)
   - [C. Networking, Tunneling & Security](#c-networking-tunneling--security)
   - [D. Administrative & Business Tools](#d-administrative--business-tools)
3. [Step-by-Step Usage Guide](#3-step-by-step-usage-guide)
   - [A. How to Start the App (Local & Public)](#a-how-to-start-the-app-local--public)
   - [B. How to Use the Traveler Portal](#b-how-to-use-the-traveler-portal)
   - [C. How to Install on Mobile (Android & iOS)](#c-how-to-install-on-mobile-android--ios)
   - [D. How to Use the Private Owner Backend](#d-how-to-use-the-private-owner-backend)
4. [File & Directory Structure](#4-file--directory-structure)
5. [API & Data Specifications](#5-api--data-specifications)

---

## 1. Architecture Overview

```mermaid
graph TD
    User["📱 Mobile / Desktop Traveler"] -->|HTTPS / Port 8000| WebUI["🎨 Responsive Frontend (index.html)"]
    Admin["🔒 Host / Admin Console"] -->|Direct Secure Link| BackendUI["📊 Management Console (admin.html)"]
    
    subgraph Frontend Engines
        WebUI --> ThreeJS["🌍 Three.js 3D Earth (WebGL)"]
        WebUI --> LeafletMap["🗺️ Leaflet.js Transit Map"]
        WebUI --> PWA["📲 PWA Engine (sw.js & manifest.json)"]
        WebUI --> AudioSiren["🚨 Web Audio SOS Synthesizer"]
        WebUI --> Dock["🖥️ Apple-Inspired Physics Dock"]
        WebUI --> QRGen["🏁 QRCode.js Digital Eco-Pass"]
    end

    subgraph Backend Server (server.py)
        WebUI -->|REST API / POST| PyServer["🐍 Python 3 Multi-Format Server"]
        PyServer --> DBJson["📁 backend_db.json (Document DB)"]
        PyServer --> DBCsv["📊 backend_bookings.csv (Excel Ledger)"]
        PyServer --> DBTxt["📄 backend_summary.txt (Receipt Slips)"]
        CloudRelay["☁️ Cloud Relay (CrudCrud)"] -->|Async Background Thread| PyServer
    end

    subgraph Edge Networking
        PyServer --> Cloudflare["🛡️ Cloudflare Zero-Trust Tunnel"]
        Cloudflare --> PublicURL["🌐 Global Public HTTPS URL"]
    end
```

---

## 2. Complete Technology Stack

### A. Frontend Technologies & Libraries

| Technology / Library | Version / Source | Primary Role & Implementation Details |
| :--- | :--- | :--- |
| **HTML5 & Semantic Markup** | W3C Standard | Provides accessible, mobile-first single-page application structure, meta viewports, and semantic container tagging. |
| **Tailwind CSS** | v3.x (CDN) | **Utility-First Styling Engine:** Rapid luxury styling, responsive breakpoints (`sm:`, `md:`, `lg:`), flexbox/grid layouts, and custom glassmorphism (`backdrop-blur-xl`, `rgba` borders). |
| **Three.js & WebGL** | `r128` | **Interactive 3D Earth (`js/earth3d.js`):** Renders a photo-realistic, rotating Earth globe with Day texture, Night city lights, Alpha cloud layer, and an Atmosphere glow shader. Supports mouse and touch orbit controls. |
| **Leaflet.js & OpenStreetMap** | v1.9.4 | **Interactive Transit & Destination Map:** Renders GPS pins, crowd heatmaps, tourist routes, and dynamic polyline transit lines across India and international hubs without paid API keys. |
| **Apple-Style Physics Dock** | Custom JS + CSS / React Specs | **Magnification Navigation Dock:** Cosine-smoothed magnetic pull physics where icons smoothly enlarge up to `1.45x` on cursor hover with vertical spring displacement. Also authored as shadcn/Framer-Motion components (`dock.tsx`, `SmartTourDock.tsx`). |
| **Web Audio API** | Native Browser API | **Emergency SOS Hardware Siren Synthesizer:** Direct synthesis of high-decibel dual-frequency audio waves (880Hz to 1200Hz sweep) through hardware sound card without relying on external MP3 files. Works 100% offline. |
| **HTML5 Geolocation API** | Native Browser API | Captures real-time tourist GPS coordinates (`latitude`, `longitude`) during SOS distress triggers to report exact location to authorities. |
| **QRCode.js** | CDN Minified | **Digital Eco-Pass & Boarding Ticket:** Generates instantaneous, scannable QR verification codes containing passenger names, booking ID, destination, and seat reservation data on ticket modals. |
| **Google Places Autocomplete** | Maps JavaScript API | Autocomplete address search for departure and destination input with automatic fallback to popular tourism hotspots. |
| **Progressive Web App (PWA v2)** | W3C Spec | **Mobile Installation & Offline Caching:** Service Worker (`sw.js`) with cache-first asset strategy and Web App Manifest (`manifest.json`) compliant with Google Chrome WebAPK standards. |
| **Multi-Currency Converter** | Custom Engine | Real-time mathematical currency converter supporting **INR (₹)**, **USD ($)**, **EUR (€)**, **GBP (£)**, and **JPY (¥)**. |
| **Jitter-Free Typewriter Engine** | Custom JS | Smoothly types and deletes destination titles ("Kerala", "Kashmir", "Goa Beach", "Manali", "Bali") using a fixed-height container and non-breaking spaces (`\u00A0`) to eliminate vertical layout jump. |

---

### B. Backend & Database Technologies

| Component | Technology | Implementation Details |
| :--- | :--- | :--- |
| **Application Server** | **Python 3 Standard Library** | Built with `http.server`, `socketserver`, `json`, `csv`, and `urllib.request`. **Zero external pip dependencies required**, making it instantly runnable on any machine with Python installed. |
| **REST API Engine** | Native HTTP Handlers | Handles `GET /api/bookings`, `GET /api/status`, and `POST /api/bookings` with full **CORS** headers (`Access-Control-Allow-Origin: *`) enabled. |
| **Multi-Format Storage Engine** | Triple Synchronized Ledgers | Automatically saves every reservation into 3 formats at the same second: <br> 1. `backend_db.json` (Structured JSON NoSQL Store) <br> 2. `backend_bookings.csv` (Microsoft Excel-compatible spreadsheet with UTF-8 BOM) <br> 3. `backend_summary.txt` (Human-readable formatted receipt slip & ledger). |
| **Mobile Cloud Relay Worker** | Python Daemon Thread | An asynchronous background worker (`threading.Thread`) that continuously syncs reservations from mobile phones using mobile cellular networks (4G/5G) via an encrypted remote cloud buffer. |

---

### C. Networking, Tunneling & Security

| Tool | Role | Benefit |
| :--- | :--- | :--- |
| **Cloudflare Tunnel (`cloudflared`)** | Zero-Trust Edge Reverse Proxy | Exposes local development port `8000` to a secure global HTTPS address (`*.trycloudflare.com`) without router port-forwarding or public IP exposure. |
| **HTTPS SSL/TLS Encryption** | Cloudflare Edge Certificates | Enforces HTTPS encryption required by mobile browsers for **PWA WebAPK installation**, **Geolocation API**, and **Service Worker registration**. |

---

### D. Administrative & Business Tools

| Feature | File / Interface | Details |
| :--- | :--- | :--- |
| **Host / Admin Console** | `admin.html` | Secure administrative portal displaying all passenger names, contact numbers, selected trains, booked hotels, total expenses, and timestamps. |
| **One-Click Export Tools** | Embedded in Admin Console | 1-click downloads for **Excel (.csv)**, **Receipt Ledger (.txt)**, and **JSON database**. |
| **Dark / Light Theme Toggle** | Custom CSS Variables | Allows full day/night theme switching across both client and admin dashboards. |

---

## 3. Step-by-Step Usage Guide

### A. How to Start the App (Local & Public)

#### 1. Start the Backend Server (Terminal 1)
```powershell
# Open terminal inside the project directory
python server.py
```
> The server will start on `http://localhost:8000`.

#### 2. Start the Cloudflare Tunnel (Terminal 2 — Optional for Mobile Access)
```powershell
# Open terminal inside the project directory
.\cloudflared.exe tunnel --url http://localhost:8000
```
> Copy the generated public URL (e.g., `https://subcommittee-phone-tomatoes-speeches.trycloudflare.com`).

---

### B. How to Use the Traveler Portal

1. **Explore Destinations & 3D Earth:**
   - On the homepage, inspect the rotating 3D Earth. You can click and drag to rotate the globe.
   - Look at the typewriter banner highlighting destinations like *Kerala, Kashmir, Goa, Manali, Bali*.
2. **Search Packages & Estimate Budgets:**
   - Use the **Search Packages** card: select your destination, holiday type (*Hills, Beach, Heritage, Wildlife, Luxury*), and budget range (*₹5,000 to ₹35,000+*).
   - Click **Search Packages** to scroll to the Customizer.
3. **Customize Your Trip:**
   - Enter your **Name** and **Mobile Number**.
   - Adjust the number of **Travelers** and **Trip Days**.
   - Choose your preferred transport mode: **Train (Eco-Express)**, **EV Bus**, or **Shared Flight**.
   - Review the calculated budget breakdown: Train fare, Hotel cost, Meals, Local Transit, and Sightseeing.
4. **Generate Digital Eco-Pass & Boarding Ticket:**
   - Click **Book Package & Generate Eco-Pass**.
   - A modal displays your verified Boarding Pass, Seat/Cabin info, and dynamic QR code.
   - The booking is automatically transmitted to the Python backend and saved in CSV, TXT, and JSON formats.
5. **Emergency SOS System:**
   - In case of distress, tap the red **🚨 SOS** button in the header.
   - The app captures your GPS coordinates and sounds an emergency siren synthesizer. Tap **Send Police / Medical Alert** to transmit coordinates.

---

### C. How to Install on Mobile (Android & iOS)

Open the public HTTPS link in your mobile browser:
👉 `https://subcommittee-phone-tomatoes-speeches.trycloudflare.com`

#### For Android (Google Chrome / Brave):
1. Tap the green **`📲 Install`** button in the header or sub-navigation bar.
2. If the native prompt appears, tap **"Install"**.
3. **Alternative Manual Method:**
   - Tap the three dots **(⋮)** in the top-right corner of Chrome.
   - Select **"Install app"** (or **"Add to Home screen"**).
   - Tap **"Install"**.
4. The app will install with its custom app icon on your home screen and run in fullscreen standalone mode.

#### For iPhone / iPad (Apple Safari):
1. Tap the **Share button (⎋)** at the bottom of Safari.
2. Scroll down and tap **"Add to Home Screen"**.
3. Tap **"Add"** in the top-right corner.

---

### D. How to Use the Host & Admin Portal

Open the admin portal in your browser:
* **Local:** [http://localhost:8000/admin.html](http://localhost:8000/admin.html)

#### Admin Actions:
1. **View Real-Time Reservations:**
   - The table displays every booking made on mobile or PC, including Passenger Name, Phone Number, Destination, Dates, Budget, Hotel, and Status.
2. **Search & Filter:**
   - Use the search bar to filter by Passenger Name, Booking ID, or Destination.
3. **Export Reports:**
   - Click **📊 Export Excel (.CSV)** to download the raw data spreadsheet for accounting.
   - Click **📄 Export Ledger (.TXT)** to download printable ASCII receipt slips.
   - Click **📁 Export JSON** to backup the entire database.

---

## 4. File & Directory Structure

```
smart-tour-connect/
│
├── index.html                                 # Main Public Client Single Page Application (PWA)
├── login.html                                 # Authentication Portal with Siberian Husky Animation
├── admin.html                                 # Host & Administrative Console
├── server.py                                  # Python 3 Zero-Dependency REST API & Storage Server
├── transit_hotel_engine.py                    # Real Transit (IRCTC/Buses) & Direct Homestay Engine
├── Rawauthentic_SIH2026_SmartTourConnect.pdf  # Final SIH 2026 Submission Presentation (PDF)
├── Rawauthentic_SIH2026_SmartTourConnect.pptx # Final SIH 2026 Submission Presentation (PPTX)
├── cloudflared.exe                            # Cloudflare Tunnel Binary for HTTPS Edge Hosting
├── start_app.bat                              # 1-Click Startup Launcher Script
├── manifest.json                              # Web App Manifest for PWA WebAPK compliance
├── sw.js                                      # Service Worker v2 for offline caching
│
├── assets/                                    # Textures, Husky Animation Poses & Audio
├── css/                                       # Custom Stylings (custom.css)
├── js/                                        # Modular Client Engines
│   ├── app.js                                 # Core Application State & UI Controller
│   ├── budgetEngine.js                        # Dynamic Budget Planner & Calculations
│   ├── earth3d.js                             # Three.js 3D Earth WebGL Engine
│   ├── dynamicPricing.js                      # Dynamic Yield Management Engine
│   ├── itineraryEngine.js                     # AI Itinerary Generator
│   ├── realCatalog.js                         # Verified Homestay & Hotel Directory
│   └── data.js                                # Seed Data & Multilingual Prompts
│
├── backend_db.json                            # Live Document Database (Auto-updated)
├── backend_bookings.csv                       # Live Excel Spreadsheet Ledger (Auto-updated)
└── backend_summary.txt                        # Printable Text Receipt Slips (Auto-updated)
```

---

## 5. API & Data Specifications

### `GET /api/bookings`
Returns an array of all booked trips:
```json
[
  {
    "id": "STC-GLO-102934",
    "createdAt": "2026-09-10 12:30:00",
    "customerName": "Rahul Sharma",
    "customerPhone": "+91 98765 43210",
    "destination": "Kerala Backwaters & Munnar",
    "travelers": 2,
    "durationDays": 3,
    "financials": {
      "userBudget": "₹12,499",
      "totalExpense": "₹9,850",
      "remainingSavings": "₹2,649",
      "budgetStatus": "WITHIN_BUDGET"
    },
    "train": {
      "name": "Netravati Superfast Express",
      "number": "16345",
      "totalFare": "₹2,450"
    },
    "hotel": {
      "hotelType": "Verified Heritage Stay",
      "totalHotelCost": "₹3,200"
    },
    "status": "CONFIRMED"
  }
]
```

### `GET /api/status`
Returns backend health telemetry:
```json
{
  "status": "ONLINE",
  "storageFiles": ["backend_db.json", "backend_bookings.csv", "backend_summary.txt"],
  "time": "2026-09-10 12:55:00"
}
```

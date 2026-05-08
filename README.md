<div align="center">
  <img src="https://img.icons8.com/color/96/000000/shield.png" alt="Logo" width="80" height="80">
  
  # 🛡️ Campus Safety Management System
  
  **An AI-Powered Real-Time Security & Crowd Monitoring Dashboard**
  
  [![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=for-the-badge)](https://github.com/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

</div>

---

## 📖 Project Description

**Campus Safety Management System** is an advanced, AI-driven security application designed to monitor crowd density and detect anomalies in real-time. By leveraging computer vision models directly in the browser alongside a robust backend, it helps campus security teams preemptively manage overcrowding, track unauthorized access, and receive instant alerts. 

Designed for scalability and speed, the platform offers a sleek analytics dashboard, highly customizable threshold settings per user, and seamless WhatsApp/SMS integrations.

---

## ✨ Features

- **🔴 Real-Time Monitoring:** Live camera feed with edge-computed object and person detection.
- **🤖 AI-Powered Detection:** Utilizes TensorFlow.js (COCO-SSD / MobileNet V2) for blazing-fast inference without server-side lag.
- **📱 Instant Alerts (WhatsApp/SMS):** Automated real-time notifications via Twilio when crowd thresholds are breached or anomalies are detected.
- **📊 Analytics Dashboard:** Interactive data visualization of historical alerts and detection metrics.
- **⚙️ Custom Alert Thresholds:** Set personalized baseline density and sensitivity limits for triggering alerts.
- **🗄️ Robust Data Storage:** PostgreSQL-backed persistent storage for users, settings, and alert history.
- **🔐 Secure Authentication:** Full user registration, login, and secure session management.

---

## 🛠️ Technologies Used

### Frontend
- **Framework:** React.js + Vite
- **Styling:** Tailwind CSS + Radix UI components
- **AI/ML:** TensorFlow.js (COCO-SSD model)
- **Data Fetching:** React Query (@tanstack/react-query)
- **Routing:** Wouter

### Backend
- **Runtime:** Node.js (Express.js)
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Drizzle ORM
- **API Spec:** OpenAPI + Orval Codegen
- **Integration:** Twilio API (SMS / WhatsApp)
- **Security:** bcryptjs, express-session

---

## 🧠 AI Modules

The system uses **TensorFlow.js** running directly in the client's browser to minimize latency and ensure privacy. 
- **Model:** `COCO-SSD Lite MobileNet V2`
- **Functionality:** Identifies and draws bounding boxes around persons in real-time, calculating crowd density instantly. Anomalies are flagged if the count exceeds the dynamically configured threshold.

---

## 🚀 Installation Guide

### Prerequisites
Before you begin, ensure you have met the following requirements:
- **Node.js** (v20 or higher recommended)
- **pnpm** (v9 or higher)
- **PostgreSQL Database** (e.g., Neon, Supabase, or local)
- **Twilio Account** (For SMS/WhatsApp alerts)

### 1. Clone the Repository
```bash
git clone https://github.com/utkarshverma-tech/Titan_X.git
cd Titan_X
```

### 2. Install Dependencies
This project is structured as a monorepo. Install all workspace dependencies via pnpm:
```bash
pnpm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your configurations:
```env
DATABASE_URL=postgresql://user:password@host:port/db_name?sslmode=require
SESSION_SECRET=your_super_secret_session_key
PORT=3001
```

### 4. Database Migrations
Push the database schema using Drizzle ORM:
```bash
pnpm --filter @workspace/db run push
```

---

## 💻 How to Run the Project

You will need two terminal windows to run both the frontend and the backend simultaneously.

**Terminal 1 — API Server:**
```bash
pnpm --filter @workspace/api-server run dev
```

**Terminal 2 — Frontend Application:**
```bash
pnpm --filter @workspace/campus-safety run dev
```

Visit `http://localhost:5173` in your browser. The frontend will automatically proxy `/api` requests to the backend server.

---

## 🏗️ System Architecture

1. **Client Layer:** The browser captures webcam video, runs TF.js for frame-by-frame inference, and calculates local density.
2. **API Layer:** An Express server receives periodic "snapshots" or anomaly triggers from the client.
3. **Database Layer:** PostgreSQL stores user configurations and alert metadata.
4. **Integration Layer:** The backend communicates with the Twilio API to dispatch emergency texts.

---

## 📸 Screenshots

| Dashboard | Real-time Camera Feed |
|-----------|-----------------------|
| ![Dashboard](./image1.png) | ![Camera Feed](./image2.png) |

| Analytics & Insights | Settings & Configurations |
|----------------------|---------------------------|
| ![Analytics](./image3.png) | ![Settings](./image4.png) |

---

## 🚨 Alert System Explanation

The alert system is designed to be highly responsive and customizable:
1. **Detection:** The camera continuously counts the number of people in the frame.
2. **Threshold Check:** If the `Person Count > Configured Baseline`, an anomaly state is triggered.
3. **API Dispatch:** The frontend sends a `POST /api/alerts` request to the backend.
4. **Notification:** The backend checks the user's settings. If `Twilio SMS Alerts` are enabled and configured, an instant WhatsApp/SMS message is sent to the designated security personnel.

---

## 👤 Face & Person Detection Workflow

```mermaid
graph LR
    A[Camera Feed] --> B[TensorFlow.js COCO-SSD]
    B --> C{Person Detected?}
    C -- Yes --> D[Draw Bounding Box & Increment Count]
    C -- No --> E[Continue Scanning]
    D --> F{Count > Baseline?}
    F -- Yes --> G[Trigger Alert via API]
    G --> H[Twilio SMS/WhatsApp Dispatched]
```

---

## 🔮 Future Improvements

- [ ] Multi-camera feed integration (CCTV RTSP streams).
- [ ] Facial recognition for authorized personnel vs. unknown visitors.
- [ ] Weapon or violent behavior detection models.
- [ ] Advanced geographical heatmaps for large campus zones.
- [ ] Push notifications for progressive web apps (PWA).

---

## 🎬 Project Demo

**🌐 [Live Website](https://titan-x-campus-safety.vercel.app/)**

---

## 🧑‍💻 Contributors

**Utkarsh Verma & Team**  
*Academic / Group Project*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/utkarshverma89)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/utkarshverma-tech)
[![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](https://utkarshverma.in/)

---

## 📜 License

This project is licensed under the MIT License.

---
<div align="center">
  <i>If you found this project helpful, please consider giving it a ⭐ on GitHub!</i>
</div>

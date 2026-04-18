# Medico Digital Marketing Documentation

Welcome to the documentation for **Medico Digital Marketing**, a robust clinical marketing and patient management platform. This system combines a sleek public-facing website with a powerful administrative backend for lead nurturing, automated marketing, and Telegram-based CRM interactions.

---

## 🏗️ Architecture Overview

The project is built using a modern decoupled architecture:

*   **Frontend**: A responsive React application bootstrapped with Vite. It uses Material UI for the design system and Framer Motion for premium animations.
*   **Backend**: A Python-based Django application utilizing Django Rest Framework (DRF) for its API. It handles data persistence, authentication, and external service integrations (Email, Telegram).
*   **Database**: SQLite (standard for local development/staging).
*   **Integrations**: 
    *   **Telegram Bot API**: For automated patient engagement and CRM.
    *   **SMTP Email**: For newsletters and clinical inquiry replies.

---

## 🌟 Core Features

### 1. Public Clinical Website
The frontend provides a polished experience for patients, featuring:
*   **Hero Section**: Dynamic introduction to clinical services.
*   **Service Catalog**: Detailed listing of clinical specialties.
*   **Clinical Blog**: Educational content and health updates.
*   **Patient Reviews**: Verified testimonials with star ratings.
*   **Interactive Gallery**: Visual showcase of clinical facilities.
*   **Team Showcase**: Profiles of professional medical staff.
*   **Contact & Lead Capture**: Secure forms for patient inquiries.

### 2. Administrative Hub (The "Clinical Hub")
A comprehensive dashboard (`/admin`) for staff to manage all aspects of the platform:

#### 📊 Dashboard & Analytics
*   **Real-time KPI Tracking**: Monitor conversion rates, patient retention, and referral traffic.
*   **Revenue Channels**: Breakdown of bookings from direct site, Telegram, and referrals.
*   **Service Index**: Performance monitoring for specific clinical departments (Dental, Surgical, etc.).
*   **System Status**: Automated health checks and sync logs.

#### 🏢 GSL Master Hub (Enterprise Management)
*   **Article Management**: CRUD for inventory items, products, services, and fixed assets.
*   **Consignee Records**: Detailed management of Customers, Patients, Suppliers, Employees, and Banks.
*   **Miscellaneous Config**: Settings for currencies, taxes, plans, schedules, and facilities.

#### 🌐 Website Manager
*   **Content Control**: Full CRUD for Services, Blogs, Video Reels, Reviews, and Team members.
*   **Interactive Gallery**: Manage visual assets for the clinical showcase.
*   **Social Hub**: Integrated tracking and connection for Instagram, Facebook, and TikTok.

### 3. Patient Inbox & Inquiry System
*   **Unified Inbox**: View all inquiries from the website contact forms.
*   **Quick Reply**: Send professionally formatted email replies directly from the dashboard.
*   **Lead Conversion**: One-click conversion from one-time inquiries into marketing subscribers.

### 4. Smart Marketing Suite
*   **Newsletter Management**: Manage and export active subscriber lists.
*   **Email Templates**: Create reusable HTML templates with personalized placeholders (e.g., `{{name}}`).
*   **Campaign Manager**: Schedule and blast targeted email campaigns with delivery progress tracking.

### 5. Smart Telegram CRM
Integrates directly with a Telegram Bot to provide:
*   **User Tracking**: Automatically registers users who interact with the bot.
*   **Automated Tagging**: Tags users based on behavior (e.g., `new_user`, `interested`).
*   **Appointment Tracking**: Log and manage patient appointments made via Telegram.
*   **Targeted Campaigns**: Send personalized Telegram messages to specific user segments.

---

## 🛠️ Technical Implementation

### Frontend Structure (`/frontend`)
*   `src/api.js`: Centralized API client with automatic environment detection.
*   `src/components/AdminPanel.jsx`: Core logic and hierarchical navigation for the administrative interface.
*   `src/components/TelegramCRM.jsx`: Dedicated interface for Telegram-based patient management.
*   `src/App.jsx`: Route definitions and layout management.

### Backend Structure (`/api`)
*   `models.py`: Defines the database schema (Services, Campaigns, Telegram Users, Social Hub, etc.).
*   `views.py`: API logic handled through DRF ViewSets.
*   `telegram_service.py`: Wraps the Telegram Bot API for processing webhooks.
*   `email_service.py`: Handles SMTP delivery and campaign logs.

---

## 🚀 Getting Started

### Local Development

1.  **Start the Backend**:
    *   Ensure your Python virtual environment is active.
    *   Run `python manage.py runserver` to start the API on port 8000.
2.  **Start the Frontend**:
    *   Navigate to the `frontend` directory.
    *   Run `npm run dev` (or `cmd /c "npm run dev"` if PowerShell scripts are disabled) to start the Vite server on port 5173.
3.  **Bot Polling (Optional)**:
    *   Run `python local_bot_polling.py` to handle Telegram bot events locally.

---

## 📊 Content Management
The platform supports rich media handling, including:
*   **Image Uploads**: Automated storage for blog covers, team photos, and gallery items.
*   **Video Reels**: Support for direct file uploads (MP4/MOV) and external links (YouTube/TikTok).
*   **File Field Safeguards**: The admin panel automatically prevents re-uploading existing media when updating text fields, optimizing server bandwidth.

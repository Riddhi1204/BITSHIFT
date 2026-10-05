# 🩸 HemoVite

### AI-Powered Blood Management & Emergency Response Platform

HemoVite is a smart blood management platform designed to connect **citizens, blood banks, hospitals, NGOs, and government authorities** through a centralized digital ecosystem.

The platform focuses on improving blood availability, reducing emergency response time, monitoring blood inventory, identifying shortage hotspots, and reducing blood wastage caused by expiry or improper inventory management.

---

## 🚀 Overview

Blood availability can become a critical problem during medical emergencies, accidents, surgeries, and natural disasters.

Traditional blood management systems often suffer from:

- Lack of real-time blood availability information
- Delayed communication between hospitals and blood banks
- Difficulty locating nearby donors
- Poor visibility into regional blood shortages
- Blood units expiring before utilization
- Lack of centralized government-level monitoring
- Fragmented communication between organizations

**HemoVite** addresses these challenges through a centralized, role-based platform.

The system connects:

> 👤 Citizens → 🏥 Hospitals → 🩸 Blood Banks → 🤝 NGOs → 🏛️ Government

---

# 🎯 Project Objectives

The primary objectives of HemoVite are:

- Improve emergency blood availability
- Reduce blood search and response time
- Connect donors with people requiring blood
- Help hospitals find available blood resources
- Provide blood banks with digital inventory management
- Help NGOs coordinate blood donation activities
- Provide government authorities with regional blood intelligence
- Identify blood shortage hotspots
- Track blood expiry and wastage
- Reduce unnecessary blood wastage
- Provide data-driven insights for better blood management

---

# ✨ Key Features

## 👤 Citizen Platform

Citizens can use HemoVite to:

- Register/login
- Create donor profiles
- Add blood group
- Add location
- View donation history
- Check donation eligibility
- Find nearby blood requests
- View emergency blood requirements
- Set donor availability
- Respond to blood requests
- Track donation activity

### Donor Availability

Donors can indicate their availability:

🟢 Available  
🟡 Available in Emergency  
🔴 Not Available

This helps organizations identify potential donors during emergencies.

---

# 🏥 Hospital Dashboard

Hospitals can manage and monitor their blood requirements through a dedicated dashboard.

### Features

- Hospital profile
- Blood requirements
- Emergency requests
- Blood inventory visibility
- Blood requests tracking
- Request status monitoring
- Available blood information
- Emergency response monitoring
- Blood shortage alerts
- Dashboard analytics

Hospitals can use the platform to identify available blood resources and coordinate with registered blood banks and other organizations.

---

# 🩸 Blood Bank Dashboard

Blood banks are provided with a dedicated inventory management system.

### Features

- Blood inventory management
- Blood group-wise stock
- Component-wise inventory
- Blood collection records
- Blood issue/usage tracking
- Expiry monitoring
- Waste management
- Emergency blood requests
- Inventory alerts
- Analytics

### Inventory Monitoring

Blood inventory can be monitored based on:

- Blood group
- Component
- Quantity
- Collection date
- Expiry date
- Availability
- Status

---

# ⏳ Expiry & Waste Management

One of HemoVite's important features is the **Expiry & Waste Management System**.

Blood units can become unusable when they remain unused for too long.

HemoVite helps organizations identify these units before they expire.

### Expiry Status

🟢 Safe  
🟡 Expiring Soon  
🔴 Expired  
⚫ Wasted  
🔵 Used

### Expiry Monitoring

The system can identify:

- Units expiring today
- Units expiring within 3 days
- Units expiring within 7 days
- Units expiring within 30 days

### Waste Management

Authorized users can record blood wastage with reasons such as:

- Expired
- Damaged Bag
- Contamination
- Temperature Excursion
- Quality Issue
- Leakage
- Processing Error
- Other

### Waste Analytics

The system can analyze:

- Total wasted units
- Waste percentage
- Waste by blood group
- Waste by organization
- Waste by reason
- Monthly waste trends
- Expiry vs usage
- Regional wastage

---

# 🤝 NGO Dashboard

NGOs can help coordinate blood donation and emergency requirements.

### Features

- Donor coordination
- Emergency blood requests
- Nearby blood availability
- Expiry alerts
- Blood shortage information
- Donation campaigns
- Area-wise blood requirements
- Blood wastage insights

NGOs can act as a coordination layer between citizens, hospitals, and blood banks.

---

# 🏛️ Government Dashboard

The Government Dashboard provides an aggregated view of the blood ecosystem.

Government authorities can monitor:

- Blood availability
- Blood shortage
- Emergency requirements
- Blood donation activity
- Blood banks
- Hospitals
- NGOs
- Expiry trends
- Blood wastage
- Regional shortage hotspots
- Organization performance

### Government Analytics

The dashboard can provide:

- Blood shortage hotspots
- Blood group demand
- Blood inventory trends
- Expiry statistics
- Waste statistics
- Regional blood availability
- Emergency response information

This helps authorities make data-driven decisions.

---

# 📊 Blood Shortage Hotspots

HemoVite can identify regions where blood demand is significantly higher than availability.

Potential indicators include:

- Number of active requests
- Blood group demand
- Available inventory
- Emergency requests
- Donor availability
- Historical demand

This can help government authorities and NGOs prioritize emergency response.

---

# 🚨 Emergency Blood Requests

Users and hospitals can create emergency blood requests.

An emergency request can contain:

- Blood group
- Required quantity
- Hospital
- Location
- Priority
- Required time
- Request status

The system can help identify nearby resources and potential donors.

---

# 🔐 Authentication & Role-Based Access

HemoVite supports role-based access for different users.

### Roles

| Role | Main Responsibility |
|------|---------------------|
| Citizen | Donate/request blood |
| Hospital | Manage blood requirements |
| Blood Bank | Manage blood inventory |
| NGO | Coordinate donation/emergency activities |
| Government | Monitor and analyze ecosystem |

Authentication is designed so that users only access functionality permitted for their role.

---

# 🔑 Google Authentication

HemoVite supports Google authentication for user login where configured.

OAuth configuration uses environment variables and should never expose sensitive credentials in the frontend.

Example:

```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=your_callback_url

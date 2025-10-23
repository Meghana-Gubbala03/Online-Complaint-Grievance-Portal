# 🧾 Online Complaint & Grievance Portal

### 🚀 A Full-Stack Web Application to Manage Complaints Efficiently

The **Online Complaint and Grievance Portal** is a centralized platform designed to streamline the process of lodging, managing, and resolving complaints within an organization or institution.  
It ensures transparency, accountability, and quick redressal by enabling role-based access for **Users**, **Employees**, and **Admins**.

---

## 📸 Demo Video

🎥 [Click here to watch the demo]([https://your-demo-video-link.com](https://github.com/Meghana-Gubbala03/Online-Complaint-Grievance-Portal/blob/main/recording.mp4))


## 🧠 How It Works

### 👩‍🎓 Users

- Register or log in to submit a complaint.
- Provide category, description, and priority level.
- Track the complaint status — *New*, *Under Review*, *Resolved*, *Escalated*.
- Receive instant notifications when status changes.
- Access and update personal profile details.

### 👨‍🔧 Employees

- View and manage complaints assigned by the admin.
- Update complaint status or mark it as resolved.
- Add remarks or escalate unresolved complaints.

### 🧑‍💼 Admin

- Add, view, and manage employees.
- Assign complaints to employees.
- Monitor complaint progress and escalation levels.
- Generate analytical reports (PDF/Excel).
- View charts on complaint trends and resolution rates.

---

## 🧩 Features Summary

✅ Secure Authentication using JWT  
✅ Role-based Access (Admin / Employee / User)  
✅ Complaint Submission and Tracking  
✅ Employee Assignment & Escalation System  
✅ Real-time Notifications for Status Updates  
✅ Profile Management for Users  
✅ Analytics Dashboard with Charts  
✅ Export Reports as PDF & Excel  
✅ Clean, Responsive UI built with React  

---

## 🛠️ Tech Stack

| Layer | Technologies Used |
|-------|--------------------|
| **Frontend** | React.js, Axios, Recharts, jsPDF, XLSX |
| **Backend** | Node.js, Express.js, JWT Authentication |
| **Database** | MySQL (using mysql2 & promises) |
| **Other Tools** | bcryptjs, dotenv, cors, nodemon |

---

## ⚙️ Installation & Setup Guide

### 1️⃣ Clone the Repository

git clone https://github.com/your-username/grievance_portal.git
cd grievance_portal

### 2️⃣ Install Dependencies
Backend Setup
cd backend
npm install

Frontend Setup
cd ../frontend
npm install

### 3️⃣ Configure Environment Variables

- Create a .env file inside the backend/ folder based on .env.example.

PORT=5000

DB_HOST=localhost

DB_USER=root

DB_PASS="your_password"

DB_NAME=grievance_portal

JWT_SECRET=your_secret_key

### 4️⃣ Start the Application

- Run Backend Server

cd backend

npm run dev

- Run Frontend
  
cd ../frontend

npm start


Your application should now be running:

🌐 Frontend → http://localhost:3000

🖥️ Backend → http://localhost:5000

--- 

### 📊 Admin Dashboard Overview

- Section	Description
- Dashboard	View, update, or escalate complaints
- Employees	Add, list, and manage employees
- Reports	View analytics (Pie/Bar charts)
- Export	Download reports in CSV/PDF formats

### 👨‍💼 Employee Dashboard

- View complaints assigned to them.
- Change status (Under Review / Resolved).
- Add remarks or escalate to the admin.

### 👩‍🎓 User Dashboard

- Submit new complaints.
- Track current status and receive notifications.
- Access personal profile details and update password.

###📦 Folder Structure

grievance_portal/

│

├── backend/

│   ├── routes/

│   ├── middlewares/

│   ├── server.js

│   ├── db.js

│   ├── package.json

│   └── .env.example

│

├── frontend/

│   ├── src/

│   ├── public/

│   ├── package.json

│

├── .gitignore

└── README.md

---

### 💻 Packages Used

- Backend
  
npm install express mysql2 bcryptjs jsonwebtoken dotenv cors nodemon

- Frontend
  
npm install react axios recharts jspdf jspdf-autotable xlsx

### 🧰 Troubleshooting

Common Issues:

- ❌ MODULE_NOT_FOUND: Check your import/export syntax and file paths.
- ⚠️ ER_ACCESS_DENIED_ERROR: Verify your MySQL credentials in .env.
- 🔐 Invalid token: Ensure JWT_SECRET matches in both backend and frontend.

### 🪪 License

This project is licensed under the MIT License – free to use and modify.

### 👩‍💻 Author

👋 Meghana

📧 [meghana.gubbala@gmail.com]

🌐 [https://www.linkedin.com/in/meghana-g-43269935b]

💻 [GitHub Profile - https://github.com/Meghana-Gubbala03]

### 🌟 Show Your Support

If you like this project, please ⭐ star the repository on GitHub — it helps others discover it!


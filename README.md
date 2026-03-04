# VectorShift Frontend Technical Assessment
## Omkar Kandekar

This project is a full-stack Visual Pipeline Builder application built as part of the VectorShift Frontend Technical Assessment.

---

## 🚀 Project Overview

This application allows users to visually create a Directed Graph (pipeline) using drag-and-drop nodes.

Users can:
- Add different types of nodes (Input, Text, LLM, Output)
- Connect nodes visually
- Detect whether the pipeline is a valid DAG (Directed Acyclic Graph)
- Validate and analyze the structure

---

## 🏗️ Tech Stack

### Frontend
- React
- React Flow
- Tailwind CSS
- JavaScript (ES6)

### Backend
- FastAPI
- Python
- Uvicorn

---

## 📁 Project Structure

Omkar_Kandekar_technical_assessment/

│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   └── utils/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md

---

## 🧠 Features

- Drag and drop node creation
- Dynamic variable detection in TextNode using regex
- Custom reusable Node components
- DAG validation using DFS algorithm
- Clean and modular component architecture
- Separation of frontend and backend logic

---

## ⚙️ How to Run the Project

### 1️⃣ Clone the Repository

git clone https://github.com/Omkar1549/Omkar_Kandekar_technical_assessment.git

cd Omkar_Kandekar_technical_assessment

---

### 2️⃣ Run Backend

cd backend

pip install -r requirements.txt

uvicorn main:app --reload

Backend runs at:
http://127.0.0.1:8000

---

### 3️⃣ Run Frontend

cd frontend

npm install

npm start

Frontend runs at:
http://localhost:3000

---

## 🧪 DAG Validation Logic

The backend validates whether the pipeline is a Directed Acyclic Graph using Depth First Search (DFS) to detect cycles.

If a cycle is detected:
- The graph is invalid
- The user is notified

---

## 🎯 Design Decisions

- Reusable BaseNode component for consistent node styling
- Dedicated services layer for API communication
- Modular folder structure
- Clean UI layout
- Scalable architecture

---

## 📌 Notes

- node_modules, __pycache__, and .env files are excluded from the repository.
- Project follows clean and maintainable coding practices.

---

## 📬 Author

Omkar Kandekar  
VectorShift Frontend Technical Assessment Submission

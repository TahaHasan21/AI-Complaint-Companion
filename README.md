#  AI Complaint Companion  

**AI Complaint Companion** is an AI-powered complaint management system that allows users to log complaints, receive AI-based suggestions, and track their complaint status efficiently with AI-powered complaint prioritization.  

---

## **📜 Features**  
✅ AI-powered **complaint prioritization**  
✅ AI-generated **suggestions** to resolve complaints  
✅ **User authentication** with JWT  
✅ **Profile Management** with profile picture upload  
✅ **Real-time complaint tracking**  
✅ **Interactive UI** with Tailwind CSS  
✅ **Admin Panel (Optional, for future enhancements)**  

---
## **🛠️ Tech Stack**
### **Backend (Spring Boot)**  
- Java, Spring Boot  
- Spring Security (JWT Authentication)  
- PostgreSQL Database  
- Cohere API Integration  

### **Frontend (Angular 19)**  
- Angular, TypeScript  
- Tailwind CSS, ShadCN UI  
- JWT Interceptor for secure API calls  

---

## **⚡ Setup Instructions**  
Follow these steps to run the **backend** and **frontend**.

---

## **📦 Backend Setup (Spring Boot)**
```sh
# 1️⃣ Navigate to the backend folder
cd Backend

# 2️⃣ Set up Postgres DB, jwt secret key and your own API from Cohere API in application.properties

# spring.datasource.url=jdbc:postgresql://localhost:5432/complaint_db
# spring.datasource.username=postgres
# spring.datasource.password=yourpassword

# jwt.secret=your-secret-key

# cohere.api.token=your-cohere-key

# 3️⃣ Run the Spring Boot application
mvn spring-boot:run

# ✅ Backend will be available at http://localhost:8080
```
---

## **📦 Frontend Setup (Angular 19)**

```sh
# 1️⃣ Navigate to the frontend folder
cd Frontend

# 2️⃣ Install dependencies
npm install

# 3️⃣ Run the Angular development server
ng serve 

# ✅ Frontend will be available at http://localhost:4200
```




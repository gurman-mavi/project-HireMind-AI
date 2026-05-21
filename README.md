# HireMind AI 🚀

HireMind AI is a next-generation Mock Interview platform powered by Google Gemini. It conducts real-time, dynamic conversational interviews using your webcam and microphone, acting exactly like a real recruiter. It tracks your speech patterns, evaluates your technical accuracy, and provides a comprehensive feedback scorecard to help you land your dream job!

## 🌟 Features

- **Real-Time Voice AI:** Utilizes the Web Speech API to transcribe your voice seamlessly, allowing for natural back-and-forth conversational interviews.
- **Dynamic Context Generation:** Powered by **Google Gemini**, the AI dynamically asks follow-up questions based on your specific Resume and the ongoing context of the interview.
- **Hardware Tracking:** Actively monitors your webcam to ensure you are maintaining eye contact and tracks your speaking rate.
- **Detailed Scorecards:** Generates a post-interview breakdown of your Technical Accuracy, Communication, and Confidence, alongside personalized Strengths and Improvements.
- **Progress Tracking:** Securely saves all your interviews to a MongoDB database and visualizes your long-term growth using interactive Recharts on your Profile Dashboard.
- **Secure Authentication:** Full JWT token authentication and bcrypt password hashing.

## 💻 Tech Stack

### Frontend
- **Framework:** Next.js 14 (React)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Charting:** Recharts
- **Icons:** Lucide React
- **APIs:** Web Speech API, MediaDevices API

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB & Mongoose
- **AI Engine:** Google Gemini API (`@google/genai`)
- **Security:** JWT (JSON Web Tokens), bcrypt

## 🛠️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed, as well as a running instance of MongoDB (either locally or MongoDB Atlas), and a Google Gemini API Key.

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/hiremind-ai.git
cd hiremind-ai
```

### 2. Backend Setup
Navigate into the backend folder, install dependencies, and set up your environment variables.
```bash
cd backend
npm install
```
Create a `.env` file in the `/backend` directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
JWT_SECRET=your_super_secret_jwt_key
```
Start the backend server:
```bash
npm run dev
```
*The backend should now be running on `http://localhost:5000`.*

### 3. Frontend Setup
Open a new terminal window, navigate into the frontend folder, and install dependencies.
```bash
cd frontend
npm install
```
Start the Next.js development server:
```bash
npm run dev
```
*The frontend should now be running on `http://localhost:3000`.*

## 🚀 Usage
1. Open `http://localhost:3000` in your browser (Chrome or Edge recommended for full Speech API support).
2. Create an account and sign in.
3. Navigate to the **Setup** page, select your target role (e.g., Software Engineer, HR), paste your resume, and click Start!
4. **Important:** Allow Microphone and Camera permissions when prompted by your browser.
5. Answer the AI's questions verbally. Click the "End Interview" button when you are done to generate your personalized scorecard!
6. Visit your **Profile** to track your progress over time!

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).

# 🚀 DevHub — The Ultimate Developer Collaboration Platform

DevHub is a modern full-stack platform where developers can **connect**, **share projects**, **post bugs**, **get AI suggestions**, **pair up**, and **chat in real time** — all in one place.  

---

## ✨ **Key Features**

- 🔒 **Authentication**
  - JWT-based signup & login.
  - Supports profile images, bio, and tech stack.

- 📢 **Post Projects**
  - Share your projects and ideas.
  - React to posts & comment to discuss.

- 🐞 **Post Bugs**
  - Share bugs you’re stuck on.
  - Get help from other developers.
  - Receive AI suggestions using **Hugging Face**.

- 🤝 **PairUp Connections**
  - Send connection requests to developers.
  - Accept requests and connect instantly.

- 💬 **Real-Time Chat**
  - Secure Socket.IO-based real-time messaging.
  - Shows online/offline status.
  - Send text, images, or files (max 10MB).

- 📱 **Fully Responsive**
  - Built with **Tailwind CSS** for beautiful, clean UI.
  - **Framer Motion** for premium animations.
  - Works perfectly on mobile, tablet, and desktop.

---

## ⚙️ **Tech Stack**

- **Frontend:** React.js, Tailwind CSS, Framer Motion  
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)
- **Real-time:** Socket.IO
- **AI Integration:** Hugging Face API
- **Auth:** JWT
- **File Uploads:** Multer
- **Deployment:** Vercel (Frontend) & Render (Backend)

---

## 🚀 **Getting Started**

### 📦 1. Clone the repo


git clone https://github.com/YOUR_USERNAME/devhub.git
cd devhub

⚙️ 2. Install dependencies

# In root
npm install

# In frontend
cd client
npm install

🔑 3. Create .env files
Backend .env
env

MONGO_URI=YOUR_MONGODB_URI
JWT_SECRET=YOUR_SECRET_KEY
HUGGINGFACE_API_KEY=YOUR_HUGGINGFACE_API_KEY

📡 4. Run the app locally

# In backend root
npm run dev

# In client folder
npm run dev

✅ How to Use
Sign up & log in with your developer profile.

Post projects, ideas, or bugs — get help and feedback.

Pair up with other devs to collaborate.

Chat in real-time — stay connected with your dev circle.

Leverage AI for bug suggestions.

🧑‍💻 Contributing
Pull requests are welcome! If you’d like to fix bugs or add features, please fork the repo and open a PR.

🙌 Connect
Made with ❤️ by developers for developers.

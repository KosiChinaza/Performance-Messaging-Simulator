# 📊 Performance Messaging Simulator

A predictive modeling tool for WhatsApp and conversational messaging campaigns.

The Performance Messaging Simulator enables marketing teams to forecast campaign outcomes before launch by simulating the full engagement funnel — from delivered messages to projected revenue.



## 🚀 Live Demo

👉 https://performance-messaging-simulator.vercel.app/



## 🎯 Problem

Messaging campaigns are often planned using static spreadsheets and assumptions. Marketers struggle to confidently answer questions like:

- What happens if open rates drop by 5%?
- How much revenue can this campaign realistically generate?
- Is this campaign worth the budget?

Manual calculations are slow, rigid, and not scenario-driven.



## 💡 Solution

This simulator transforms campaign planning into a dynamic, data-driven experience.

Users can:

- Input audience size
- Adjust open rate
- Adjust reply rate
- Adjust conversion rate
- Set revenue per conversion
- Instantly simulate the full performance funnel
- View projected conversions and revenue
- Receive performance insights

With one click, the system calculates and visualizes:

Audience → Opens → Replies → Conversions → Revenue



## 🏗 Architecture

The application follows a modular and scalable structure:
src/
├── components/
├── engine/
│ ├── simulator.ts
│ ├── benchmark.ts
│ ├── scenario.ts
│ ├── insights.ts
│ └── types.ts
├── App.tsx
└── main.tsx


### Engine Responsibilities

- **simulator.ts** → Core funnel calculations
- **benchmark.ts** → Performance benchmarking logic
- **scenario.ts** → Scenario modeling
- **insights.ts** → Intelligent feedback generation
- **types.ts** → Strict TypeScript interfaces

Business logic is fully separated from UI rendering for maintainability and scalability.



## ⚙️ Tech Stack

- React
- TypeScript
- TailwindCSS
- Vite
- Vercel (Deployment)



## 🧠 Key Features

- Real-time funnel simulation
- Dynamic revenue projection
- Modular simulation engine
- Clean TypeScript modeling
- Responsive UI
- Scalable architecture



## 🛠 Installation

Clone the repository:
```git clone https://github.com/KosiChinaza/Performance-Messaging-Simulator
cd performance-messaging-simulator

Install Dependencies:
npm install

Run Locally:
npm run dev
```


## 🌍 Deployment

This project is deployed on Vercel.

To deploy your own version:

1. Push your project to GitHub
2. Import the repository into Vercel
3. Deploy



## 📈 Future Improvements

- AI-powered performance recommendations
- Campaign scenario comparison
- Exportable reports (PDF/CSV)
- API integration with messaging platforms
- Historical performance benchmarking



## 📌 Why This Project Matters

This project demonstrates:

- Strong frontend architecture
- Clean separation of business logic and UI
- Practical marketing performance modeling
- Type-safe engineering practices
- Product-focused development approach



## 👤 Author

Ugwu Kosisochukwu
Software Developer  
Focused on building scalable, data-driven web applications.

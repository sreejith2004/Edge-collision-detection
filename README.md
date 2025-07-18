# 🌐 Edge Collision Detection & Cache Optimization

**A Python‑powered network caching simulator** with a sleek web interface to analyze and mitigate cache collisions at edge servers.

---

## 🚀 Project Overview
- Simulates multiple **edge cache nodes** in a distributed network  
- Detects and resolves **collision events** (simultaneous data requests)  
- Measures hit‑rate improvements and latency reductions  

---

## 🏗️ Architecture
1. **Backend**  
   - Python Flask API  
   - Collision detection logic in \cache_manager.py\  
2. **Frontend**  
   - React.js dashboard  
   - Real‑time charts via Chart.js  
3. **Data Flow**  
   - Client events → API → collision detector → metrics returned  

---

## 📦 Dependencies
- Python 3.9+  
- Flask  
- Redis (for in‑memory cache simulation)  
- Node.js & npm  

---

## 🛠️ Installation
\\\ash
# Backend
pip install flask redis

# Frontend
cd web-ui && npm install
\\\

---

## ⚙️ Usage
1. Start Redis: \edis-server\  
2. Launch API: \python app.py\  
3. Launch UI:  
   \\\ash
   cd web-ui
   npm start
   \\\  
4. Open \http://localhost:3000\ to view live metrics  

---

## 📊 Demo
![Cache Dashboard](./docs/cache_dashboard.png)

---

## 🔮 Future Work
- Integrate real network traces  
- Add ML‑based eviction policies  
- Multi‑region simulation  

---

## 🤝 Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## 📄 License
Apache‑2.0 © Your Name

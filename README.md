python -m http.server 8000


hairdresser-matching-frontend/
│
├─ public/                     # Static assets (favicon, logo, etc.)
│   ├─ favicon.ico
│   └─ logo.png
│
├─ src/                        # Source code
│   ├─ assets/                 # Images, icons, and global styles
│   │   ├─ images/
│   │   └─ styles/
│   │       └─ global.css
│   │
│   ├─ components/             # Reusable UI components
│   │   ├─ Header.jsx
│   │   ├─ Footer.jsx
│   │   └─ Loader.jsx
│   │
│   ├─ pages/                  # Page-level components
│   │   ├─ Home.jsx
│   │   ├─ Profile.jsx
│   │   ├─ MatchList.jsx
│   │   └─ Chat.jsx
│   │
│   ├─ hooks/                  # Custom hooks
│   │   └─ useLiff.js
│   │
│   ├─ services/               # API calls
│   │   └─ apiClient.js
│   │
│   ├─ context/                # React Context for global state
│   │   └─ UserContext.jsx
│   │
│   ├─ App.jsx                  # Main app component
│   ├─ main.jsx                 # Entry point
│   └─ liff-init.js             # LIFF initialization logic
│
├─ .gitignore
├─ index.html
├─ package.json
├─ vite.config.js
└─ README.md

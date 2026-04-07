// data.js — Datos simulados para DevDrop

const SEED_FILES = [
  {
    id: 1, title: "Python Web Scraper Ultra",
    desc: "Scraper completo con BeautifulSoup4 y Selenium. Soporta paginación, proxies y exportación a CSV/JSON. Ideal para análisis de datos.",
    ext: "py", cat: "codigo", vis: "public",
    tags: ["python","scraping","automation","selenium"],
    author: "xX_DevGod_Xx", authorSeed: "alpha",
    size: "12 KB", likes: 47, downloads: 213, comments: 8,
    date: "2025-01-12", dateRel: "hace 2 días",
    content: `import requests\nfrom bs4 import BeautifulSoup\nimport csv, json, time\n\nclass UltraScraper:\n    def __init__(self, base_url, delay=1.5):\n        self.base_url = base_url\n        self.delay = delay\n        self.session = requests.Session()\n\n    def scrape(self, pages=5):\n        results = []\n        for page in range(1, pages+1):\n            r = self.session.get(f"{self.base_url}?page={page}")\n            soup = BeautifulSoup(r.text, "html.parser")\n            # ... parse logic\n            time.sleep(self.delay)\n        return results\n\nif __name__ == "__main__":\n    s = UltraScraper("https://example.com")\n    data = s.scrape(pages=10)\n    print(f"Scraped {len(data)} items")`
  },
  {
    id: 2, title: "WhatsApp Dark Mode Mod APK",
    desc: "Modificación de WhatsApp con modo oscuro puro AMOLED, sin anuncios, con todas las funciones premium desbloqueadas.",
    ext: "apk", cat: "apk", vis: "public",
    tags: ["whatsapp","mod","amoled","android"],
    author: "ModKing420", authorSeed: "bravo",
    size: "68.4 MB", likes: 312, downloads: 1847, comments: 23,
    date: "2025-01-10", dateRel: "hace 4 días",
    content: null
  },
  {
    id: 3, title: "README Template Profesional",
    desc: "Template completo de README.md con badges, tabla de contenidos, instalación, contribución y licencia. Copy & paste listo.",
    ext: "md", cat: "documento", vis: "public",
    tags: ["readme","markdown","github","template","docs"],
    author: "DocuPro", authorSeed: "charlie",
    size: "4 KB", likes: 89, downloads: 456, comments: 5,
    date: "2025-01-09", dateRel: "hace 5 días",
    content: `# 🚀 Project Name\n\n![License](https://img.shields.io/badge/license-MIT-blue)\n![Version](https://img.shields.io/badge/version-1.0.0-green)\n\n## 📋 Tabla de Contenidos\n- [Instalación](#instalación)\n- [Uso](#uso)\n- [Contribuir](#contribuir)\n- [Licencia](#licencia)\n\n## ⚙️ Instalación\n\`\`\`bash\ngit clone https://github.com/user/project\ncd project\nnpm install\n\`\`\`\n\n## 🎯 Uso\n\`\`\`bash\nnpm start\n\`\`\`\n\n## 🤝 Contribuir\nPull requests bienvenidos.\n\n## 📄 Licencia\nMIT`
  },
  {
    id: 4, title: "React Dashboard Component Kit",
    desc: "Kit de 20+ componentes para dashboards admin. Gráficas, tablas paginadas, cards de stats, sidebars responsivas. Zero dependencias externas.",
    ext: "jsx", cat: "codigo", vis: "public",
    tags: ["react","dashboard","components","ui","jsx"],
    author: "FrontendWitch", authorSeed: "delta",
    size: "38 KB", likes: 156, downloads: 734, comments: 14,
    date: "2025-01-08", dateRel: "hace 6 días",
    content: `// StatCard.jsx\nexport function StatCard({ title, value, icon, trend }) {\n  return (\n    <div className="stat-card">\n      <div className="stat-icon">{icon}</div>\n      <div className="stat-content">\n        <span className="stat-value">{value}</span>\n        <span className="stat-title">{title}</span>\n        {trend && (\n          <span className={\`trend \${trend > 0 ? "up" : "down"}\`}>\n            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%\n          </span>\n        )}\n      </div>\n    </div>\n  );\n}`
  },
  {
    id: 5, title: "Termux Setup Total 2025",
    desc: "Script de configuración automática de Termux. Instala Python, Node, Git, Neovim, ZSH + OhMyZsh y todas las herramientas esenciales.",
    ext: "sh", cat: "codigo", vis: "public",
    tags: ["termux","bash","android","linux","shell"],
    author: "RootMaster", authorSeed: "echo",
    size: "8 KB", likes: 203, downloads: 1102, comments: 19,
    date: "2025-01-07", dateRel: "hace 7 días",
    content: `#!/bin/bash\n# Termux Ultimate Setup 2025\necho "🔧 Starting Termux Setup..."\n\n# Update packages\npkg update -y && pkg upgrade -y\n\n# Core tools\npkg install -y git python nodejs neovim zsh curl wget\n\n# Oh My Zsh\nsh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"\n\n# Python packages\npip install requests beautifulsoup4 numpy pandas flask\n\n# Node global packages\nnpm i -g typescript ts-node nodemon\n\necho "✅ Setup complete!"`
  },
  {
    id: 6, title: "Valorant Config Ultra Low Ping",
    desc: "Archivo de configuración optimizado para Valorant. FPS máximo, latencia mínima, settings competitivos pro-level.",
    ext: "ini", cat: "otro", vis: "public",
    tags: ["valorant","config","gaming","fps","pro"],
    author: "FragGoat", authorSeed: "foxtrot",
    size: "3 KB", likes: 427, downloads: 2341, comments: 31,
    date: "2025-01-06", dateRel: "hace 8 días",
    content: `[General]\nLastSeenLeftMenuLegend=false\nbShowMouseCursor=0\nbFullscreen=1\nResolutionX=1920\nResolutionY=1080\nRefreshRate=144\n\n[SoundSettings]\nMasterVolume=70\nMusicVolume=0\nSoundFXVolume=80\nVoiceVolume=80\n\n[GameSettings]\nMaxFPS=999\nVSync=false\nGraphicsQuality=0\nMultisampling=0`
  },
  {
    id: 7, title: "API REST Express + JWT Boilerplate",
    desc: "Boilerplate completo para API REST con Express.js. Incluye autenticación JWT, middleware, validaciones, rate limiting y Swagger docs.",
    ext: "zip", cat: "codigo", vis: "public",
    tags: ["nodejs","express","jwt","api","boilerplate","typescript"],
    author: "BackendBoss", authorSeed: "golf",
    size: "22 KB", likes: 178, downloads: 892, comments: 11,
    date: "2025-01-05", dateRel: "hace 9 días",
    content: null
  },
  {
    id: 8, title: "Wallpapers 4K Pack Dark Aesthetic",
    desc: "Pack de 50 wallpapers 4K dark aesthetic. Cyberpunk, space, abstract, minimal. Formato JPG y PNG. Para PC y móvil.",
    ext: "zip", cat: "imagen", vis: "public",
    tags: ["wallpapers","4k","dark","aesthetic","cyberpunk"],
    author: "PixelDreamer", authorSeed: "hotel",
    size: "487 MB", likes: 891, downloads: 4203, comments: 44,
    date: "2025-01-04", dateRel: "hace 10 días",
    content: null
  },
  {
    id: 9, title: "Docker Compose Full Stack",
    desc: "docker-compose.yml para stack completo: Nginx, Node.js, PostgreSQL, Redis, PgAdmin. Un comando y todo listo.",
    ext: "yml", cat: "codigo", vis: "public",
    tags: ["docker","devops","nginx","postgres","redis"],
    author: "DevOpsNinja", authorSeed: "india",
    size: "2 KB", likes: 134, downloads: 678, comments: 9,
    date: "2025-01-03", dateRel: "hace 11 días",
    content: `version: '3.9'\nservices:\n  nginx:\n    image: nginx:alpine\n    ports: ["80:80", "443:443"]\n    volumes:\n      - ./nginx.conf:/etc/nginx/nginx.conf\n    depends_on: [api]\n\n  api:\n    build: .\n    environment:\n      - NODE_ENV=production\n      - DATABASE_URL=postgres://user:pass@db:5432/app\n    depends_on: [db, redis]\n\n  db:\n    image: postgres:15\n    environment:\n      POSTGRES_DB: app\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: pass\n    volumes:\n      - pgdata:/var/lib/postgresql/data\n\n  redis:\n    image: redis:7-alpine\n\nvolumes:\n  pgdata:`
  },
  {
    id: 10, title: "Spotify Premium Patcher Script",
    desc: "Script bash para patchear Spotify en Linux. Elimina anuncios, habilita skip ilimitado y calidad Very High.",
    ext: "sh", cat: "codigo", vis: "link",
    tags: ["spotify","bash","linux","patch","music"],
    author: "MusicFree", authorSeed: "juliet",
    size: "6 KB", likes: 567, downloads: 3120, comments: 28,
    date: "2025-01-02", dateRel: "hace 12 días",
    content: `#!/bin/bash\n# Spotify Premium Patcher for Linux\nSPOTIFY_PATH="/opt/spotify"\n\necho "🎵 Spotify Patcher v2.0"\necho "Checking installation..."\n\nif [ ! -d "$SPOTIFY_PATH" ]; then\n  echo "❌ Spotify not found at $SPOTIFY_PATH"\n  exit 1\nfi\n\n# Backup original\ncp "$SPOTIFY_PATH/spotify" "$SPOTIFY_PATH/spotify.bak"\n\n# Apply patch\npython3 patch.py --target "$SPOTIFY_PATH/spotify"\necho "✅ Patch applied successfully!"`
  },
  {
    id: 11, title: "Flutter App Template Clean Architecture",
    desc: "Template Flutter con clean architecture, BLoC, GetIt para DI, y Hive para storage local. Listo para producción.",
    ext: "zip", cat: "codigo", vis: "public",
    tags: ["flutter","dart","mobile","clean-arch","bloc"],
    author: "FlutterFly", authorSeed: "kilo",
    size: "54 KB", likes: 98, downloads: 445, comments: 7,
    date: "2025-01-01", dateRel: "hace 13 días",
    content: null
  },
  {
    id: 12, title: "Minecraft Texture Pack Ultra HD",
    desc: "Texture pack 128x128 para Minecraft Java. Realista pero manteniendo la esencia pixel. Compatible 1.19 a 1.21.",
    ext: "zip", cat: "otro", vis: "public",
    tags: ["minecraft","texture","hd","java","gaming"],
    author: "CraftKing", authorSeed: "lima",
    size: "224 MB", likes: 743, downloads: 5891, comments: 52,
    date: "2024-12-31", dateRel: "hace 14 días",
    content: null
  }
];

const SEED_CONVERSATIONS = [
  {
    id: 1, user: "xX_DevGod_Xx", seed: "alpha", unread: true,
    messages: [
      { from: "them", text: "Oye, ¿tienes la versión actualizada del scraper?", time: "10:23" },
      { from: "me",   text: "Sí, la subí hace un rato. Chécala en el feed.", time: "10:25" },
      { from: "them", text: "Genial, gracias! Ya la descargué 🔥", time: "10:26" }
    ]
  },
  {
    id: 2, user: "FrontendWitch", seed: "delta", unread: true,
    messages: [
      { from: "them", text: "¿Me puedes compartir el link del dashboard?", time: "ayer" },
      { from: "me",   text: "Claro, está en mis archivos públicos.", time: "ayer" }
    ]
  },
  {
    id: 3, user: "RootMaster", seed: "echo", unread: true,
    messages: [
      { from: "them", text: "Bro el script de Termux está caído, falta un pkg", time: "lun" },
      { from: "me",   text: "Ya lo arreglé, sube la nueva versión.", time: "lun" },
      { from: "them", text: "Ok lo reviso", time: "lun" }
    ]
  },
  {
    id: 4, user: "BackendBoss", seed: "golf", unread: false,
    messages: [
      { from: "me",   text: "El boilerplate está muy completo, buen trabajo.", time: "dom" },
      { from: "them", text: "Gracias! Cualquier PR es bienvenido.", time: "dom" }
    ]
  },
  {
    id: 5, user: "FlutterFly", seed: "kilo", unread: false,
    messages: [
      { from: "them", text: "¿Usas Flutter en producción?", time: "sáb" },
      { from: "me",   text: "Sí, 2 apps en Play Store. Funciona excelente.", time: "sáb" }
    ]
  }
];

const SEED_COMMENTS = {
  1: [
    { id: 1, user: "CodeMonkey", seed: "m1", text: "Excelente script, me ahorró horas de trabajo. ¿Tiene soporte para JS rendering?", time: "hace 1h", likes: 3 },
    { id: 2, user: "DataNerd99", seed: "m2", text: "Funciona perfecto. Le agregué soporte para CAPTCHA con 2captcha.", time: "hace 3h", likes: 7 },
    { id: 3, user: "xX_DevGod_Xx", seed: "alpha", text: "Gracias por el feedback. Próxima versión tendrá Playwright support.", time: "hace 5h", likes: 12, isAuthor: true }
  ],
  2: [
    { id: 1, user: "AndroidFan", seed: "a1", text: "Funciona en Android 14?", time: "hace 2h", likes: 2 },
    { id: 2, user: "ModKing420", seed: "bravo", text: "Sí, compatible hasta Android 14. Lo testeé en Pixel 8.", time: "hace 4h", likes: 8, isAuthor: true }
  ],
  3: [
    { id: 1, user: "GithubGuru", seed: "g1", text: "El mejor template de README que he visto. Lo uso en todos mis proyectos.", time: "hace 6h", likes: 15 }
  ]
};

const TRENDING_TAGS = ["#python", "#apk", "#flutter", "#bash", "#react", "#docker", "#gaming", "#android"];

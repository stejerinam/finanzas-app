# Finanzas · Estado de Cuenta BBVA

Analiza tu estado de cuenta BBVA México con categorización automática usando IA.

## Estructura

```
finanzas-app/
├── public/
│   └── index.html       ← toda la app frontend
├── api/
│   └── categorize.js    ← función serverless (proxy seguro a Anthropic)
├── vercel.json          ← configuración de deployment
└── .gitignore
```

## Deploy (primera vez)

### 1. Instalar Node.js
Descarga desde https://nodejs.org → versión LTS → instala normalmente.

### 2. Instalar Vercel CLI
Abre tu terminal (Terminal en Mac, CMD en Windows) y corre:
```bash
npm install -g vercel
```

### 3. Subir a GitHub
En GitHub.com → New repository → nombre: `finanzas-app` → Create.
Luego en tu terminal:
```bash
cd ruta/a/finanzas-app
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/finanzas-app.git
git push -u origin main
```

### 4. Deploy en Vercel
```bash
vercel
```
Sigue las instrucciones — conecta tu cuenta de GitHub cuando te lo pida.
Cuando pregunte "Link to existing project?" → No → crea uno nuevo.

### 5. Agregar tu API Key (una sola vez, de forma segura)
En vercel.com → tu proyecto → Settings → Environment Variables:
- Name: `ANTHROPIC_API_KEY`
- Value: tu key `sk-ant-api03-...`
- Environments: ✅ Production ✅ Preview

Luego haz re-deploy para que tome efecto:
```bash
vercel --prod
```

¡Listo! Vercel te da una URL pública que puedes compartir con amigos.

## Updates futuros
Cada vez que hagas cambios, solo corre:
```bash
git add .
git commit -m "descripción del cambio"
git push
vercel --prod
```

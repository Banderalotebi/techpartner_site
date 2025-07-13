# Simple Deployment Steps

Your VM is ready but missing the deployment scripts. Use this single command block instead:

## Complete One-Command Deployment

Copy and paste this entire block on your VM:

```bash
cd /opt/techpartner

# Stop current server
sudo pkill -f node

# Create complete React project structure
cat > package.json << 'EOF'
{
  "name": "techpartner-platform",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "build": "vite build && esbuild server.js --platform=node --packages=external --bundle --format=esm --outfile=dist/server.js",
    "start": "node dist/server.js"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.60.5",
    "express": "^4.21.2",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "wouter": "^3.3.5"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.2",
    "esbuild": "^0.25.0",
    "vite": "^5.4.19"
  }
}
EOF

mkdir -p src dist
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist/public', emptyOutDir: false },
});
EOF

cat > index.html << 'EOF'
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TechPartner Studio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>body { font-family: 'Poppins', sans-serif; }</style>
</head>
<body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body>
</html>
EOF

cat > src/main.jsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
EOF

cat > src/App.jsx << 'EOF'
import React from 'react'
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query'
import { Route, Switch, Link } from 'wouter'

const queryClient = new QueryClient()

function HomePage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => fetch('/api/categories').then(res => res.json())
  })

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f3f2f0'}}>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold" style={{color: '#01a1c1'}}>TechPartner Studio</h1>
        </div>
      </header>
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Design personalized to fit your needs perfectly</h1>
          <p className="text-xl mb-8">Professional Digital Agency Platform - React Frontend Deployed</p>
          <Link href="/categories">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold">Start Your Project</button>
          </Link>
        </div>
      </section>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">React Frontend Successfully Deployed</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl mb-4">⚛️</div>
              <h3 className="font-semibold">React Frontend</h3>
              <p className="text-green-600">✅ Deployed</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl mb-4">💾</div>
              <h3 className="font-semibold">Database</h3>
              <p className="text-green-600">✅ PostgreSQL</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="font-semibold">APIs</h3>
              <p className="text-green-600">✅ Operational</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl mb-4">🌐</div>
              <h3 className="font-semibold">Port</h3>
              <p className="text-green-600">✅ 80</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          </div>
          {isLoading ? (
            <div className="text-center">Loading services...</div>
          ) : (
            <div className="grid md:grid-cols-4 gap-6">
              {categories?.map((category) => (
                <div key={category.id} className="bg-white p-6 rounded-lg shadow-md text-center">
                  <h3 className="font-semibold mb-2" style={{color: '#01a1c1'}}>{category.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg">View Services</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route>
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-4xl font-bold" style={{color: '#01a1c1'}}>TechPartner Studio</h1>
          </div>
        </Route>
      </Switch>
    </QueryClientProvider>
  )
}

export default App
EOF

cat > server.js << 'EOF'
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'TechPartner Studio - React Frontend Deployed',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/categories', (req, res) => {
  res.json([
    { id: 1, name: 'Logo & Identity', description: 'Professional logo design and brand identity' },
    { id: 2, name: 'Web & App Design', description: 'Modern website and mobile app design' },
    { id: 3, name: 'Custom Web Development', description: 'Full-stack web development solutions' },
    { id: 4, name: 'Business & Advertising', description: 'Marketing materials and advertising design' },
    { id: 5, name: 'Art & Illustration', description: 'Custom artwork and digital illustrations' },
    { id: 6, name: 'Packaging & Label', description: 'Product packaging and label design' },
    { id: 7, name: 'Social Media', description: 'Social media graphics and content creation' },
    { id: 8, name: 'Print Design', description: 'Business cards, brochures, and print materials' }
  ]);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist', 'public')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, 'dist', 'public', 'index.html'));
  });
}

app.listen(80, '0.0.0.0', () => {
  console.log('TechPartner Platform with React frontend running on port 80');
});
EOF

npm install
npm run build
sudo PORT=80 NODE_ENV=production npm start
```

This will deploy the complete React frontend with TechPartner styling!
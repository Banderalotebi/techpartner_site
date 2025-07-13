#!/bin/bash
# Create React Frontend Files for TechPartner Platform

echo "=== Creating React Frontend Components ==="

cd /opt/techpartner

# Create HTML template
cat > client/index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>TechPartner Studio - Digital Agency Platform</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# Create main CSS with TechPartner styling
cat > client/src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

:root {
  font-family: 'Poppins', Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
  background-color: #f3f2f0;
}

body {
  margin: 0;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

.techpartner-primary {
  color: #01a1c1;
}

.techpartner-bg {
  background-color: #f3f2f0;
}

.techpartner-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.techpartner-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.hero-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
EOF

# Create React entry point
cat > client/src/main.tsx << 'EOF'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
EOF

# Create main App component with TechPartner design
cat > client/src/App.tsx << 'EOF'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, Switch } from 'wouter'
import { HomePage } from './pages/HomePage'
import { CategoriesPage } from './pages/CategoriesPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen techpartner-bg">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/categories" component={CategoriesPage} />
          <Route>
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold techpartner-primary mb-4">Page Not Found</h1>
                <p className="text-gray-600">The page you're looking for doesn't exist.</p>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    </QueryClientProvider>
  )
}

export default App
EOF

# Create HomePage with original TechPartner design
cat > client/src/pages/HomePage.tsx << 'EOF'
import { Link } from 'wouter'
import { useQuery } from '@tanstack/react-query'

export function HomePage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
  })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold techpartner-primary">TechPartner Studio</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link href="/categories" className="text-gray-700 hover:text-blue-600">Services</Link>
              <a href="/api/health" className="text-gray-700 hover:text-blue-600">API</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Design personalized to fit your needs perfectly
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Professional Digital Agency Platform with Complete Service Portfolio
          </p>
          <div className="space-x-4">
            <Link href="/categories">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors">
                Start Your Project
              </button>
            </Link>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors">
              View Portfolio
            </button>
          </div>
        </div>
      </section>

      {/* Platform Status Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Status</h2>
            <p className="text-gray-600">Your TechPartner platform is fully operational</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="techpartner-card p-6 text-center">
              <div className="text-3xl mb-4">✅</div>
              <h3 className="font-semibold text-lg mb-2">Platform Status</h3>
              <p className="text-green-600">Production Ready</p>
            </div>
            <div className="techpartner-card p-6 text-center">
              <div className="text-3xl mb-4">💾</div>
              <h3 className="font-semibold text-lg mb-2">Database</h3>
              <p className="text-green-600">PostgreSQL Connected</p>
            </div>
            <div className="techpartner-card p-6 text-center">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="font-semibold text-lg mb-2">APIs</h3>
              <p className="text-green-600">Operational</p>
            </div>
            <div className="techpartner-card p-6 text-center">
              <div className="text-3xl mb-4">🌐</div>
              <h3 className="font-semibrand text-lg mb-2">Port</h3>
              <p className="text-green-600">80 (Standard Web)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Design and Development Services</h2>
            <p className="text-gray-600">Professional services with complete questionnaire flows</p>
          </div>
          {isLoading ? (
            <div className="text-center">Loading services...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories?.map((category: any) => (
                <div key={category.id} className="techpartner-card p-6 text-center">
                  <h3 className="font-semibold text-lg mb-2 techpartner-primary">{category.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{category.description || 'Professional service'}</p>
                  <Link href="/categories">
                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                      View Services
                    </button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">TechPartner Studio</h3>
            <p className="text-gray-400 mb-6">Professional Digital Agency Platform</p>
            <div className="space-x-6">
              <a href="/api/health" className="text-gray-400 hover:text-white">API Health</a>
              <a href="/api/categories" className="text-gray-400 hover:text-white">Categories API</a>
              <Link href="/categories" className="text-gray-400 hover:text-white">Services</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
EOF

# Create Categories page
cat > client/src/pages/CategoriesPage.tsx << 'EOF'
import { Link } from 'wouter'
import { useQuery } from '@tanstack/react-query'

export function CategoriesPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['/api/categories'],
  })

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href="/">
              <h1 className="text-2xl font-bold techpartner-primary cursor-pointer">TechPartner Studio</h1>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link href="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link href="/categories" className="text-blue-600 font-semibold">Services</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Service Categories</h1>
            <p className="text-gray-600">Choose from our comprehensive range of digital services</p>
          </div>

          {isLoading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4">Loading categories...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {categories?.map((category: any) => (
                <div key={category.id} className="techpartner-card p-8 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 techpartner-primary">{category.name}</h3>
                  <p className="text-gray-600 mb-6">{category.description || 'Professional digital service'}</p>
                  <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                    Start Project
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
EOF

echo "React frontend components created successfully!"
echo "Next: Create server files and build the complete platform."
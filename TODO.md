# TechPartner Site — Task Tracker

## ✅ SEO Improvements (Completed)

- [x] Gather information and create plan
- [x] Create `client/src/hooks/useSEO.ts` — custom hook for dynamic meta tag management
- [x] Update `client/index.html` — base meta tags, favicon, JSON-LD structured data
- [x] Create `public/favicon.svg` — TechPartner branded favicon
- [x] Create `public/site.webmanifest` — PWA web manifest
- [x] Update `client/src/pages/home.tsx` — add bilingual SEO
- [x] Update `client/src/pages/about.tsx` — add bilingual SEO
- [x] Update `client/src/pages/contact.tsx` — add bilingual SEO
- [x] Update `client/src/pages/blog.tsx` — add bilingual SEO
- [x] Update `client/src/pages/portfolio.tsx` — add bilingual SEO
- [x] Update `client/src/pages/category.tsx` — add bilingual SEO (dynamic per sub-category)
- [x] Update `client/src/pages/logo-identity.tsx` — add bilingual SEO

---

## ✅ AWS EC2 Deployment (Completed)

- [x] Push all code to GitHub (`main` branch) — force push succeeded
- [x] SSH into AWS EC2 instance — `ec2-54-227-243-191.compute-1.amazonaws.com`
- [x] Pull latest `main` branch on EC2 (`/home/ubuntu/techpartner/`)
- [x] Restart PM2 process (`techpartner`, port 8080)
- [x] Update `README.md` with AWS deployment instructions

### Server Info
| Item | Value |
|------|-------|
| EC2 Host | `ec2-54-227-243-191.compute-1.amazonaws.com` |
| App Port | `8080` |
| App Dir | `/home/ubuntu/techpartner/` |
| PM2 Process | `techpartner` |
| Node Version | `v18.19.1` |
| Branch | `main` |
| GitHub Repo | `https://github.com/Banderalotebi/techpartner_site.git` |

### SSH Access
```bash
ssh -i ~/Downloads/kimi-key.pem ubuntu@ec2-54-227-243-191.compute-1.amazonaws.com
```

### Deploy Latest Changes
```bash
# From local machine — push to GitHub
cd "/Users/bander/techpartner_site-main "
git add -A && git commit -m "your message" && git push origin main

# On EC2 — pull and restart
cd /home/ubuntu/techpartner && git pull origin main && pm2 restart techpartner
```

---

## 🧪 Testing Results

### ✅ Passing
| Test | Status | Details |
|------|--------|---------|
| HTTP Health Check (localhost:8080) | ✅ 200 OK | App responding |
| HTTP Health Check (external) | ✅ 200 OK | Publicly accessible |
| `GET /api/categories` | ✅ 200 OK | Returns category list |
| `GET /api/auth/user` (no token) | ✅ 401 | Correctly rejects unauthenticated |
| `GET /api/orders` (no token) | ✅ 401 | Correctly rejects unauthenticated |
| `GET /sitemap.xml` | ✅ 200 OK | Sitemap accessible |
| `GET /robots.txt` | ✅ 200 OK | Robots file accessible |
| `GET /index.html` | ✅ 200 OK | Frontend served |
| PM2 Process Status | ✅ Online | pid: 54093, ~99.7mb |

### ⚠️ Known Issues
| Issue | Details | Priority |
|-------|---------|----------|
| `sharp` module not found | Image optimizer fails on startup — app still runs but image optimization disabled | Medium |
| `GET /api/blog` → 404 | Blog API endpoint not implemented in current server routes | Low |
| `GET /api/services` → 404 | Services API endpoint not implemented in current server routes | Low |

---

## 📋 Pending Tasks

- [x] Install `sharp` on EC2: `cd /home/ubuntu/techpartner && npm install sharp`
- [ ] Implement `/api/blog` route in `server/routes/`
- [ ] Implement `/api/services` route in `server/routes/`
- [ ] Set up HTTPS / SSL (Nginx reverse proxy + Let's Encrypt)
- [ ] Configure EC2 Security Group to expose port 80/443

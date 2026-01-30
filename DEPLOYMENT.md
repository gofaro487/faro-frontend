# FARO Issuer Dashboard - Deployment Guide

## 📦 Production Deployment

### Prerequisites
- Node.js 14+ installed
- Backend API deployed and accessible
- Domain name (optional)

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Build and Deploy**
   ```bash
   cd faro-issuer-dashboard
   vercel --prod
   ```

3. **Configure Environment**
   - Add environment variable in Vercel dashboard:
   - `REACT_APP_API_URL=https://your-api-domain.com/api`

### Option 2: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build**
   ```bash
   npm run build
   ```

3. **Deploy**
   ```bash
   netlify deploy --prod --dir=build
   ```

4. **Environment Variables**
   - Go to Site settings → Build & deploy → Environment
   - Add: `REACT_APP_API_URL=https://your-api-domain.com/api`

### Option 3: AWS S3 + CloudFront

1. **Build**
   ```bash
   npm run build
   ```

2. **Create S3 Bucket**
   - Enable static website hosting
   - Update bucket policy for public read

3. **Upload Files**
   ```bash
   aws s3 sync build/ s3://your-bucket-name
   ```

4. **Create CloudFront Distribution**
   - Origin: S3 bucket
   - Default root object: index.html
   - Error pages: Redirect 404 to /index.html (for React Router)

5. **Environment Variables**
   - Build with correct API URL before uploading:
   ```bash
   REACT_APP_API_URL=https://your-api.com/api npm run build
   ```

### Option 4: Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:16-alpine as build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   ARG REACT_APP_API_URL
   ENV REACT_APP_API_URL=$REACT_APP_API_URL
   RUN npm run build

   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

2. **Create nginx.conf**
   ```nginx
   server {
       listen 80;
       location / {
           root /usr/share/nginx/html;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
   }
   ```

3. **Build and Run**
   ```bash
   docker build -t faro-dashboard --build-arg REACT_APP_API_URL=https://api.example.com/api .
   docker run -p 80:80 faro-dashboard
   ```

### Option 5: Traditional Server (Apache/Nginx)

1. **Build**
   ```bash
   npm run build
   ```

2. **Upload build folder** to server

3. **Configure Apache (.htaccess)**
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

4. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/faro-dashboard;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

## 🔐 Security Best Practices

### 1. Environment Variables
- Never commit `.env` file
- Use environment-specific builds
- Store secrets securely

### 2. HTTPS
- Always use HTTPS in production
- Update API_URL to use https://
- Configure SSL certificates

### 3. API CORS
Update backend CORS to allow your production domain:
```javascript
cors({
  origin: 'https://your-dashboard-domain.com',
  credentials: true
})
```

### 4. Content Security Policy
Add CSP headers in your web server configuration

## 🔧 Build Configuration

### Production Build
```bash
npm run build
```

### Build with Environment Variables
```bash
REACT_APP_API_URL=https://api.production.com/api npm run build
```

### Optimize Build Size
- Already configured in Create React App
- Code splitting enabled
- Minification enabled
- Source maps generated

## 📊 Performance Optimization

### 1. Enable Gzip Compression
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

### 2. Browser Caching
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. CDN (Optional)
- Serve static assets from CDN
- CloudFlare, AWS CloudFront, etc.

## 🧪 Pre-Deployment Checklist

- [ ] Test all features locally
- [ ] Update API URL in environment
- [ ] Build without errors
- [ ] Test production build locally
- [ ] Check network requests in production
- [ ] Verify CORS configuration
- [ ] Test on multiple browsers
- [ ] Mobile responsiveness check
- [ ] SSL certificate configured
- [ ] Monitor setup (optional)

## 🔍 Monitoring & Analytics

### Setup Error Tracking
Integrate with services like:
- Sentry
- LogRocket
- Datadog

### Add Analytics
- Google Analytics
- Mixpanel
- Amplitude

## 🐛 Troubleshooting Production Issues

### Blank Page
- Check browser console for errors
- Verify build folder has files
- Check routing configuration

### API Errors
- Verify API URL is correct
- Check CORS configuration
- Test API endpoints directly

### 404 on Refresh
- Configure server to serve index.html for all routes
- Check .htaccess or nginx config

### Environment Variables Not Working
- Rebuild after changing .env
- Variables must start with REACT_APP_
- Use process.env.REACT_APP_* in code

## 📱 Mobile App (Future)

Consider wrapping in:
- React Native WebView
- Capacitor
- Ionic

## 🔄 CI/CD Setup

### GitHub Actions Example
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.API_URL }}
      - run: vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

## 📞 Support

For deployment issues:
- Check documentation above
- Review server logs
- Test API endpoints
- Verify network connectivity

---

**Ready to deploy! 🚀**

# 🚀 FinanceAI Deployment Guide

## Vercel Deployment

### Prerequisites
- GitHub repository with your code
- Vercel account
- PostgreSQL database (we recommend Neon, PlanetScale, or Supabase)

### Step 1: Prepare Your Database

1. **Create a PostgreSQL database** on your preferred provider:
   - **Neon** (Recommended): https://neon.tech
   - **Supabase**: https://supabase.com
   - **PlanetScale**: https://planetscale.com

2. **Get your database connection string**:
   ```
   postgresql://username:password@host:port/database?sslmode=require
   ```

### Step 2: Deploy to Vercel

1. **Connect Repository**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables**:
   Add these variables in Vercel's dashboard:

   ```bash
   # Database
   DATABASE_URL=your_postgresql_connection_string
   
   # Authentication
   JWT_SECRET=your_super_secure_jwt_secret_key_change_this_in_production
   
   # Email Configuration (Gmail SMTP)
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password  # Use App Password, not regular password
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   ```

3. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your application

### Step 3: Set Up Database Schema

After deployment, you need to push your database schema:

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Connect to your project**:
   ```bash
   vercel link
   ```

3. **Push database schema**:
   ```bash
   vercel env pull .env.local
   npm run db:push
   ```

### Step 4: Configure Email (Gmail)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → App passwords
   - Generate password for "Mail"
3. **Use the generated password** as `EMAIL_PASS` in Vercel

### Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Create a test account
3. Verify all features work:
   - User registration
   - Email verification
   - Login/logout
   - Transaction management
   - Budget tracking

## Alternative Deployment Options

### Railway

1. Create account at [railway.app](https://railway.app)
2. Connect GitHub repository
3. Add PostgreSQL service
4. Set environment variables
5. Deploy

### Render

1. Create account at [render.com](https://render.com)
2. Create PostgreSQL database
3. Create web service from GitHub
4. Set environment variables
5. Deploy

### DigitalOcean App Platform

1. Create account at [digitalocean.com](https://digitalocean.com)
2. Create managed PostgreSQL database
3. Create app from GitHub
4. Configure environment variables
5. Deploy

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `your-super-secure-secret-key` |
| `EMAIL_USER` | SMTP email address | `your-email@gmail.com` |
| `EMAIL_PASS` | SMTP password/app password | `your-app-password` |
| `SMTP_HOST` | SMTP server hostname | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `465` |

## Post-Deployment Checklist

- [ ] Database schema deployed successfully
- [ ] User registration works
- [ ] Email verification emails sent
- [ ] Password reset functionality works
- [ ] All API endpoints respond correctly
- [ ] Frontend loads and navigation works
- [ ] Authentication state persists
- [ ] Mobile responsive design verified

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Verify `DATABASE_URL` is correct
   - Ensure database allows connections from Vercel IPs
   - Check database is running and accessible

2. **Email Not Sending**:
   - Verify Gmail App Password is generated correctly
   - Check 2FA is enabled on Gmail account
   - Ensure `EMAIL_PASS` uses App Password, not regular password

3. **JWT Token Issues**:
   - Ensure `JWT_SECRET` is at least 32 characters
   - Use a cryptographically secure random string

4. **Build Failures**:
   - Check all dependencies are in `package.json`
   - Verify TypeScript compilation succeeds locally
   - Ensure environment variables are set correctly

### Getting Help

- Check Vercel deployment logs
- Test API endpoints directly
- Verify database connection
- Check email service logs

## Performance Optimization

1. **Database**:
   - Add indexes for frequently queried columns
   - Use connection pooling
   - Consider read replicas for high traffic

2. **Caching**:
   - Enable Vercel Edge Caching
   - Use Redis for session storage
   - Implement client-side caching

3. **Monitoring**:
   - Set up error tracking (Sentry)
   - Monitor API response times
   - Track user engagement metrics

## Security Considerations

1. **Environment Variables**:
   - Never commit secrets to repository
   - Use strong, unique JWT secrets
   - Rotate secrets regularly

2. **Database**:
   - Use SSL connections
   - Implement proper access controls
   - Regular security updates

3. **Email**:
   - Use App Passwords, not account passwords
   - Monitor for suspicious activity
   - Implement rate limiting

## Scaling Considerations

- **Database**: Consider upgrading to production-tier database
- **Email**: Switch to dedicated email service (SendGrid, Mailgun)
- **CDN**: Use Vercel's global CDN for static assets
- **Monitoring**: Implement comprehensive logging and monitoring

---

Your FinanceAI application is now ready for production! 🎉
# AWS Portfolio Website Deployment Guide

## Prerequisites

1. AWS CLI installed and configured
2. AWS account with appropriate permissions
3. Domain name (optional)

## Services Used

- **EC2**: Web server hosting
- **S3**: Static asset storage
- **CloudFront**: CDN for faster content delivery
- **Route 53**: DNS management (if using custom domain)
- **SES**: Email service for contact form
- **Application Load Balancer**: Load balancing and SSL termination
- **RDS**: Database (if needed for dynamic content)

## Deployment Steps

### 1. Create S3 Bucket for Static Assets

```bash
aws s3 mb s3://your-portfolio-assets
aws s3 website s3://your-portfolio-assets --index-document index.html --error-document 404.html
```

### 2. Upload Static Assets

```bash
aws s3 sync ./public s3://your-portfolio-assets/static --acl public-read
```

### 3. Launch EC2 Instance

- Choose Amazon Linux 2 AMI
- Instance type: t3.micro (free tier eligible)
- Configure security groups:
  - HTTP (80) from anywhere
  - HTTPS (443) from anywhere
  - SSH (22) from your IP

### 4. Setup EC2 Instance

```bash
# Connect to your EC2 instance
ssh -i your-key.pem ec2-user@your-ec2-ip

# Install Node.js and PM2
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
source ~/.bashrc
nvm install node
npm install -g pm2

# Install and start Nginx
sudo yum update -y
sudo amazon-linux-extras install nginx1
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 5. Deploy Application

```bash
# Clone your repository
git clone your-repo-url
cd portfolio_website2

# Install dependencies
npm install

# Start application with PM2
pm2 start server.js --name portfolio
pm2 startup
pm2 save
```

### 6. Configure Nginx

Create `/etc/nginx/conf.d/portfolio.conf`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /static {
        proxy_pass https://your-cloudfront-domain.cloudfront.net;
    }
}
```

### 7. Setup CloudFront Distribution

1. Create CloudFront distribution
2. Set S3 bucket as origin
3. Configure caching behaviors
4. Update URLs in your application

### 8. Configure SES for Email

1. Verify your email address in SES
2. Move out of sandbox mode (for production)
3. Update environment variables

### 9. Setup SSL Certificate

```bash
# Install Certbot
sudo yum install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com
```

### 10. Environment Variables

Create `/home/ec2-user/portfolio_website2/.env`:

```
NODE_ENV=production
PORT=3000
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-portfolio-assets
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=your-email@gmail.com
SITE_NAME=Your Portfolio
SITE_URL=https://your-domain.com
```

## Security Best Practices

1. Use IAM roles instead of access keys when possible
2. Enable CloudTrail for API logging
3. Configure security groups with minimal required access
4. Regular security updates
5. Use AWS Secrets Manager for sensitive data

## Monitoring and Maintenance

1. Setup CloudWatch alarms
2. Configure log aggregation
3. Regular backups
4. Performance monitoring

## Cost Optimization

1. Use t3.micro for small traffic
2. Enable S3 lifecycle policies
3. Configure CloudFront caching
4. Monitor AWS billing alerts

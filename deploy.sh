#!/bin/bash

# AWS Portfolio Deployment Script
# Make sure to configure AWS CLI first: aws configure

echo "Starting deployment to AWS..."

# Variables (Update these with your values)
BUCKET_NAME="your-portfolio-bucket"
CLOUDFRONT_DISTRIBUTION_ID="your-distribution-id"
EC2_INSTANCE_IP="your-ec2-ip"
KEY_PATH="path/to/your-key.pem"

# Build and prepare assets
echo "Building application..."
npm run build

# Upload static assets to S3
echo "Uploading static assets to S3..."
aws s3 sync ./public s3://$BUCKET_NAME/static --delete --acl public-read

# Invalidate CloudFront cache
if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "Invalidating CloudFront cache..."
    aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"
fi

# Deploy application code to EC2
echo "Deploying application to EC2..."
if [ ! -z "$EC2_INSTANCE_IP" ]; then
    # Create deployment archive
    tar -czf portfolio-deploy.tar.gz --exclude=node_modules --exclude=.git .
    
    # Upload to EC2
    scp -i $KEY_PATH portfolio-deploy.tar.gz ec2-user@$EC2_INSTANCE_IP:~/
    
    # Deploy on EC2
    ssh -i $KEY_PATH ec2-user@$EC2_INSTANCE_IP << 'ENDSSH'
        cd ~/
        
        # Backup current deployment
        if [ -d "portfolio_website2" ]; then
            mv portfolio_website2 portfolio_website2_backup_$(date +%Y%m%d_%H%M%S)
        fi
        
        # Extract new deployment
        mkdir portfolio_website2
        tar -xzf portfolio-deploy.tar.gz -C portfolio_website2
        cd portfolio_website2
        
        # Install dependencies
        npm install --production
        
        # Restart application
        pm2 restart portfolio || pm2 start server.js --name portfolio
        pm2 save
        
        # Clean up
        rm -f ~/portfolio-deploy.tar.gz
        
        echo "Deployment completed successfully!"
ENDSSH
    
    # Clean up local archive
    rm -f portfolio-deploy.tar.gz
fi

echo "Deployment completed!"
echo "Your portfolio is now live!"

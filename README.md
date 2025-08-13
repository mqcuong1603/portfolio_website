# Portfolio Website

A professional portfolio website built with Express.js and AWS services.

## Features

- **Responsive Design**: Mobile-first responsive design using Bootstrap
- **Performance Optimized**: Compressed assets, CDN integration, caching
- **SEO Friendly**: Meta tags, semantic HTML, clean URLs
- **Security**: Rate limiting, HTTPS, input validation, CSRF protection
- **Contact Form**: Working contact form with email notifications
- **AWS Integration**: S3 for assets, CloudFront for CDN, SES for emails
- **Modern Stack**: Express.js, EJS templates, modern JavaScript

## Tech Stack

### Frontend

- HTML5, CSS3, JavaScript (ES6+)
- Bootstrap 5 for responsive design
- Font Awesome icons
- EJS templating engine

### Backend

- Node.js with Express.js
- Security middleware (Helmet, CORS, Rate limiting)
- File upload handling with Multer
- Email sending with Nodemailer

### AWS Services

- **S3**: Static asset storage
- **CloudFront**: CDN for global content delivery
- **SES**: Email service for contact form
- **EC2**: Application hosting
- **Route 53**: DNS management

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd portfolio_website2
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment file:

```bash
copy .env.example .env
```

4. Configure environment variables in `.env`:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
AWS_REGION=us-east-1
AWS_S3_BUCKET_NAME=your-portfolio-bucket

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Application Settings
CONTACT_EMAIL=your-email@gmail.com
SITE_NAME=Your Portfolio
SITE_URL=http://localhost:3000
```

5. Start development server:

```bash
npm run dev
```

6. Open http://localhost:3000 in your browser

## Project Structure

```
portfolio_website2/
├── config/                 # Configuration files
│   └── aws.js             # AWS SDK configuration
├── middleware/            # Custom middleware
├── public/               # Static assets
│   ├── css/             # Stylesheets
│   ├── js/              # Client-side JavaScript
│   └── images/          # Images and media
├── routes/              # Express routes
│   ├── index.js         # Main page routes
│   └── api.js          # API endpoints
├── views/              # EJS templates
│   ├── layout.ejs      # Main layout template
│   ├── index.ejs       # Home page
│   ├── about.ejs       # About page
│   ├── projects.ejs    # Projects page
│   ├── contact.ejs     # Contact page
│   ├── 404.ejs         # 404 error page
│   └── error.ejs       # Error page
├── .env.example        # Environment variables template
├── .gitignore         # Git ignore file
├── server.js          # Main application file
├── package.json       # Dependencies and scripts
└── README.md         # This file
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run build` - Build for production
- `npm run deploy` - Deploy to AWS (configure first)

## Features in Detail

### Contact Form

- Form validation (client and server-side)
- Rate limiting to prevent spam
- Email notifications using SMTP
- Success/error feedback to users

### File Upload

- Secure file upload to AWS S3
- File type and size validation
- Public URL generation for uploaded files

### Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting on API endpoints
- Input validation and sanitization

### Performance

- Gzip compression
- Static asset caching
- CDN integration with CloudFront
- Image optimization

## Deployment to AWS

See [AWS_DEPLOYMENT.md](AWS_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deployment Steps:

1. Create AWS S3 bucket for static assets
2. Launch EC2 instance
3. Configure security groups and load balancer
4. Setup CloudFront distribution
5. Configure SES for email
6. Deploy application with PM2
7. Setup Nginx reverse proxy
8. Configure SSL certificate

## Customization

### Adding New Pages

1. Create new EJS template in `views/`
2. Add route in `routes/index.js`
3. Update navigation in `views/layout.ejs`

### Modifying Styles

- Edit `public/css/style.css` for custom styles
- CSS variables are defined in `:root` for easy theme customization

### Adding New Projects

- Update the projects array in `routes/index.js`
- Add project images to `public/images/`
- Customize `views/projects.ejs` as needed

### Email Configuration

- For Gmail: Enable 2FA and use App Password
- For other providers: Update SMTP settings in `.env`

## Environment Variables

| Variable                | Description           | Required                  |
| ----------------------- | --------------------- | ------------------------- |
| `PORT`                  | Server port           | No (default: 3000)        |
| `NODE_ENV`              | Environment           | No (default: development) |
| `AWS_ACCESS_KEY_ID`     | AWS access key        | Yes (for AWS features)    |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key        | Yes (for AWS features)    |
| `AWS_REGION`            | AWS region            | Yes (for AWS features)    |
| `AWS_S3_BUCKET_NAME`    | S3 bucket name        | Yes (for file uploads)    |
| `SMTP_HOST`             | SMTP server host      | Yes (for contact form)    |
| `SMTP_PORT`             | SMTP server port      | Yes (for contact form)    |
| `SMTP_USER`             | SMTP username         | Yes (for contact form)    |
| `SMTP_PASS`             | SMTP password         | Yes (for contact form)    |
| `CONTACT_EMAIL`         | Contact email address | Yes                       |
| `SITE_NAME`             | Website name          | No                        |
| `SITE_URL`              | Website URL           | Yes                       |

## Security Considerations

- Never commit `.env` file to version control
- Use strong, unique passwords for all services
- Regularly update dependencies
- Configure proper AWS IAM roles and policies
- Use HTTPS in production
- Implement proper backup strategies

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- IE11+ (with polyfills)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues:

- Create an issue in the repository
- Email: your-email@example.com

## Changelog

### v1.0.0

- Initial release
- Basic portfolio functionality
- AWS integration
- Responsive design
- Contact form
- Project showcase

import { Router } from "express";
import multer, { memoryStorage } from "multer";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import awsConfig from "../config/aws.js";
const { s3, ses } = awsConfig;
const router = Router();

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { error: "Too many API requests, please try again later." },
});

// Contact form rate limiting
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // limit each IP to 3 contact form submissions per hour
  message: {
    error: "Too many contact form submissions, please try again later.",
  },
});

// Multer configuration for file uploads
const upload = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
});

// Contact form submission
router.post("/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "All fields are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Please provide a valid email address",
      });
    }

    // Create transporter (using Gmail SMTP as example)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Thank you for your message! I'll get back to you soon.",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send message. Please try again later.",
    });
  }
});

// File upload to S3
router.post("/upload", apiLimiter, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file provided",
      });
    }

    const fileName = `uploads/${Date.now()}-${req.file.originalname}`;

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read",
    };

    const command = new PutObjectCommand(uploadParams);
    const result = await s3.send(command);

    const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    res.json({
      success: true,
      message: "File uploaded successfully",
      url: fileUrl,
      key: fileName,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upload file",
    });
  }
});

// Get projects data (example API endpoint)
router.get("/projects", (req, res) => {
  // In a real application, this would fetch from a database
  const projects = [
    {
      id: 1,
      title: "Portfolio Website",
      description:
        "A responsive portfolio website built with Express.js and AWS",
      technologies: ["Node.js", "Express.js", "AWS", "EJS"],
      image: "/images/portfolio-1.jpg",
      liveUrl: "https://yourportfolio.com",
      githubUrl: "https://github.com/yourusername/portfolio",
      slug: "portfolio-website",
    },
    // Add more projects here
  ];

  res.json({
    success: true,
    projects,
  });
});

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});

export default router;

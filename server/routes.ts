import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Admin, Scholarship, Blog, Country, Ad, Carousel, ContactMessage, Setting, Subscriber, Video, Service } from './models';

export const apiRouter = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey123';

// Safely wrap async functions to prevent unhandled promise rejections
const safe = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(err => {
    console.error('API Route Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  });
};

// Auth Middleware
const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// --- AUTHENTICATION ---
apiRouter.post('/auth/login', safe(async (req: any, res: any) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
}));

apiRouter.post('/auth/forgot-password', safe(async (req: any, res: any) => {
  const { email } = req.body;
  
  if (email !== 'techhub905@gmail.com') {
    return res.status(403).json({ error: 'Password reset is only allowed for the authorized admin email.' });
  }

  // Find admin account
  let admin = await Admin.findOne({ username: 'admin' });
  if (!admin) {
    admin = await Admin.findOne(); // if any admin exists
  }

  // Create a new random password
  const newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  const hashedPassword = bcrypt.hashSync(newPassword, 10);

  if (admin) {
    admin.password = hashedPassword;
    await admin.save();
  } else {
    // If no admin exists, create one
    await Admin.create({ username: 'admin', password: hashedPassword });
  }

  // Send the email
  try {
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      await transporter.sendMail({
        from: `"Admin System" <${process.env.SMTP_USER}>`,
        to: email, // techhub905@gmail.com
        subject: 'Admin Password Reset / Account Created',
        text: `Your new admin password is: ${newPassword}\n\nLogin at ${process.env.APP_URL || 'http://localhost:3000'}/admin`,
      });
      res.json({ message: 'A new password has been generated and sent to techhub905@gmail.com' });
    } else {
      // In case SMTP is not configured, we still set the password, and log it to the backend console for the developer
      console.log(`[DEV MODE] SMTP not configured. New admin password for ${email} is: ${newPassword}`);
      res.json({ message: 'Check the server logs for your password (SMTP not configured). In production, set SMTP variables to send emails.' });
    }
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).json({ error: 'Failed to send email. Check your SMTP configuration.' });
  }
}));

// Setup Initial Admin
apiRouter.get('/auth/setup', safe(async (req: any, res: any) => {
  const count = await Admin.countDocuments();
  if (count === 0) {
    const password = bcrypt.hashSync('admin', 10);
    await Admin.create({ username: 'admin', password });
    
    // Also init settings
    if (await Setting.countDocuments() === 0) {
      await Setting.create({ 
        siteName: 'GlobalOpportunity',
        email: 'techhub905@gmail.com',
        phone: '+92-346-3079238',
        address: 'Munda Qala, Dir Lower, KPK, Pakistan',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/mirishfaqahmad',
          github: 'https://github.com/Mirishfaqahmad905',
          portfolio: 'https://geekyskill.netlify.app'
        }
      });
    }
    return res.json({ message: 'Default admin (admin/admin) created.' });
  }
  res.json({ message: 'Admin already exists.' });
}));

// Update Password
apiRouter.post('/admin/password', authMiddleware, safe(async (req: any, res: any) => {
  const { newPassword } = req.body;
  const password = bcrypt.hashSync(newPassword, 10);
  await Admin.updateOne({}, { password });
  res.json({ message: 'Password updated' });
}));

// --- PUBLIC ROUTES ---
apiRouter.get('/', (req, res) => {
  res.json({ message: 'GlobalOpportunity API is running.' });
});

apiRouter.get('/public/scholarships', safe(async (req: any, res: any) => {
  const query: any = {};
  if (req.query.country) query.country = req.query.country;
  if (req.query.region && req.query.region !== 'all') query.region = req.query.region;
  if (req.query.level && req.query.level !== 'all') query.level = req.query.level;
  if (req.query.search) {
    query.$or = [
      { title: { $regex: req.query.search, $options: 'i' } },
      { university: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  
  let sortParam = '-createdAt';
  if (req.query.sort === 'trending') {
    sortParam = '-clicks';
  }
  
  res.json(await Scholarship.find(query).sort(sortParam));
}));

apiRouter.get('/public/scholarships/:id', safe(async (req: any, res: any) => {
  const doc = await Scholarship.findByIdAndUpdate(
    req.params.id,
    { $inc: { clicks: 1 } },
    { new: true }
  );
  if (!doc) return res.status(404).json({error: 'Not found'});
  res.json(doc);
}));

apiRouter.get('/public/blogs', safe(async (req: any, res: any) => res.json(await Blog.find().sort('-createdAt'))));
apiRouter.get('/public/blogs/:id', safe(async (req: any, res: any) => res.json(await Blog.findById(req.params.id))));

apiRouter.get('/public/countries', safe(async (req: any, res: any) => {
  const countries = await Country.find().lean();
  const withCounts = await Promise.all(countries.map(async (c: any) => {
    const count = await Scholarship.countDocuments({ country: c.name });
    return { ...c, scholarshipCount: count };
  }));
  res.json(withCounts);
}));
apiRouter.get('/public/ads', safe(async (req: any, res: any) => res.json(await Ad.find({ active: true }))));
apiRouter.get('/public/carousels', safe(async (req: any, res: any) => res.json(await Carousel.find().sort('order'))));
apiRouter.get('/public/videos', safe(async (req: any, res: any) => res.json(await Video.find().sort('order'))));
apiRouter.get('/public/services', safe(async (req: any, res: any) => res.json(await Service.find().sort('order'))));
apiRouter.get('/public/settings', safe(async (req: any, res: any) => {
  const settings = await Setting.findOne();
  res.json(settings || { siteName: 'GlobalOpportunity' });
}));

apiRouter.post('/public/contact', safe(async (req: any, res: any) => {
  res.json(await ContactMessage.create(req.body));
}));
apiRouter.post('/public/subscribe', safe(async (req: any, res: any) => {
  res.json(await Subscriber.create(req.body));
}));

// --- ADMIN CRUD ROUTES ---
const createCrudRoutes = (path: string, Model: any) => {
  apiRouter.get(`/admin${path}`, authMiddleware, safe(async (req: any, res: any) => res.json(await Model.find())));
  apiRouter.post(`/admin${path}`, authMiddleware, safe(async (req: any, res: any) => res.json(await Model.create(req.body))));
  apiRouter.put(`/admin${path}/:id`, authMiddleware, safe(async (req: any, res: any) => res.json(await Model.findByIdAndUpdate(req.params.id, req.body, {new: true}))));
  apiRouter.delete(`/admin${path}/:id`, authMiddleware, safe(async (req: any, res: any) => { await Model.findByIdAndDelete(req.params.id); res.json({success: true}); }));
};

createCrudRoutes('/scholarships', Scholarship);
createCrudRoutes('/blogs', Blog);
createCrudRoutes('/countries', Country);
createCrudRoutes('/ads', Ad);
createCrudRoutes('/carousels', Carousel);
createCrudRoutes('/videos', Video);
createCrudRoutes('/services', Service);
createCrudRoutes('/messages', ContactMessage);

// Single object admin update for Setting
apiRouter.get('/admin/settings', authMiddleware, safe(async (req: any, res: any) => res.json(await Setting.findOne())));
apiRouter.put('/admin/settings', authMiddleware, safe(async (req: any, res: any) => {
  let setting = await Setting.findOne();
  if (setting) {
    setting = await Setting.findByIdAndUpdate(setting._id, req.body, {new: true});
  } else {
    setting = await Setting.create(req.body);
  }
  res.json(setting);
}));

apiRouter.get('/admin/subscribers', authMiddleware, safe(async (req: any, res: any) => res.json(await Subscriber.find().sort('-createdAt'))));
apiRouter.delete('/admin/subscribers/:id', authMiddleware, safe(async (req: any, res: any) => { await Subscriber.findByIdAndDelete(req.params.id); res.json({success: true}); }));

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import mysql from 'mysql2';

const app = express();

// MySQL database connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Ayu@2005',
  database: 'agrisetu'
});

// Check database connection
db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173', // ✅ Allow frontend
  methods: ['GET', 'POST'],
  credentials: true
}));

// Routes
app.get("/", (req, res) => {
  res.send('Hello World! This is the backend server. 🌍');
});

// Register Route
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  console.log('🔍 Incoming registration:', { name, email });

  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, result) => {
      if (err) {
        console.error('❌ Database error during registration:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (result.length > 0) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      if (!password) {
        return res.status(400).json({ error: 'Password is required' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword],
        (err, result) => {
          if (err) {
            console.error('❌ Error inserting user into DB:', err);
            return res.status(500).json({ error: 'Database insertion error' });
          }
          console.log('✅ User registered successfully');
          res.status(201).json({ message: 'User registered successfully' });
        }
      );
    });
  } catch (err) {
    console.error('❌ Server error during registration:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('🔍 Login attempt for:', email);

  try {
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('❌ Database error during login:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        console.log('⚠️ No user found with email:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const user = results[0];
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        console.log('⚠️ Incorrect password for:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // ✅ Define safe user object without password
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email
      };

      console.log('✅ Successful login for:', email);
      res.status(200).json({ message: 'Login successful', user: userData });
    });
  } catch (err) {
    console.error('❌ Server error during login:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

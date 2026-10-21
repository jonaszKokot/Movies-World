/* global process */

import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { pool } from './db.js';
import jwt from "jsonwebtoken"
import { verifyToken } from './authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rejestracja
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'Wszystkie pola są wymagane.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO users (first_name, last_name, email, password_hash)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      firstName,
      lastName,
      email,
      hashedPassword
    ]);

    const tokenPayload = {
      id: result.insertId,
      email: email,
      firstName: firstName
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.status(201).json({
      message: 'Użytkownik zarejestrowany pomyślnie!',
      token: token,
      user: {
        id: result.insertId,
        firstName: firstName,
        lastName: lastName,
        email: email
      }
    });

  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Użytkownik o takim adresie email już istnieje.' });
    }

    console.error('Błąd bazy danych:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas rejestracji.' });
  }
});

// Logowanie
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email oraz hasło są wymagane.' });
    }

    const query = 'SELECT * FROM users WHERE email = ?';
    const [users] = await pool.execute(query, [email]);

    if (users.length === 0) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Nieprawidłowy email lub hasło.' });
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      firstName: user.first_name
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({
      message: 'Zalogowano pomyślnie!',
      token: token,
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Błąd logowania:', error);
    res.status(500).json({ error: 'Wystąpił błąd podczas logowania.' });
  }
});

// Pobieranie watchlist
app.get('/api/watchlist', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const query = 'SELECT movie_id FROM watchlist WHERE user_id = ? ORDER BY created_at DESC';
    const [rows] = await pool.execute(query, [userId]);

    const movieIds = rows.map(row => row.movie_id);

    res.json(movieIds);
  } catch (error) {
    console.error('Błąd pobierania watchlisty:', error);
    res.status(500).json({ error: 'Nie udało się pobrać listy.' });
  }
});

// Dodawanie filmu do watchlisty
app.post('/api/watchlist', verifyToken, async (req, res) => {
  try {
    const { movieId } = req.body;
    const userId = req.user.id;

    if (!movieId) {
      return res.status(400).json({ error: 'Wymagane jest podanie movieId.' });
    }

    const query = 'INSERT INTO watchlist (user_id, movie_id) VALUES (?, ?)';
    await pool.execute(query, [userId, movieId]);

    res.status(201).json({ message: 'Film dodany do obejrzenia!' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Film już znajduje się na Twojej liście do obejrzenia.' });
    }
    console.error('Błąd watchlisty:', error);
    res.status(500).json({ error: 'Wystąpił błąd serwera.' });
  }
});

// Usuwanie filmu z watchlisty
app.delete('/api/watchlist/:movieId', verifyToken, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;

    const query = 'DELETE FROM watchlist WHERE user_id = ? AND movie_id = ?';
    await pool.execute(query, [userId, movieId]);

    res.json({ message: 'Film usunięty z listy do obejrzenia.' });
  } catch (error) {
    console.error('Błąd usuwania z watchlisty:', error);
    res.status(500).json({ error: 'Wystąpił błąd serwera.' });
  }
});

app.listen(PORT, () => {
  console.log(`Serwer backendowy działa pod adresem http://localhost:${PORT}`);
});

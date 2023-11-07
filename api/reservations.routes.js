const express = require('express');
const router = express.Router();
const db = require('./db'); // Import the database connection

router.get('/getAll', async (req, res) => {
  try {
    const [rows, fields] = await db.execute('SELECT * FROM reservations_tbl');
    res.json(rows);
  } catch (error) {
    console.error('Error querying the database:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

router.post('/add', async (req, res) => {
    try {
      const {
        user_id,
        lastname,
        firstname,
        email,
        date,
        time,
        service
      } = req.body;
  
      // Check if any of the required fields is missing
      if (
        !user_id ||
        !email ||
        !date ||
        !time ||
        !service
      ) 
      {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      // Insert a new reservation into the database
      const sql =
        'INSERT INTO reservations_tbl (user_id, lastname, firstname, email, date, time, service) VALUES (?, ?, ?, ?, ?, ?, ?)';
      const values = [
        user_id,
        lastname,
        firstname,
        email,
        date,
        time,
        service
      ];
  
      const [result] = await db.execute(sql, values);
  
      res.status(201).json({ message: 'Reservation created', id: result.insertId });
    } catch (err) {
      console.error('Error creating reservation:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.delete('/delete/:id', async (req, res) => {
    const userId = req.params.id;
    const sql = 'DELETE FROM reservations_tbl WHERE id = ?';
  
    try {
      const [result] = await db.execute(sql, [userId]);
      
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Reservation not found' });
      } else {
        res.json({ message: 'Reservation deleted' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/update/:id', async (req, res) => {
    const { id } = req.params; // Extract user ID from the URL
    const { lastname, firstname, email, date, time, service } = req.body;
  
    // Update the user in the database
    const sql = 'UPDATE reservations_tbl SET lastname = ?, firstname = ?, email = ?, date = ?, time = ?, service = ? WHERE id = ?';
    const values = [lastname, firstname, email, date, time, service, id];
  
    try {
      const [result] = await db.execute(sql, values);
  
      if (result.affectedRows === 0) {
        // If no rows were affected, the user does not exist
        return res.status(404).json({ message: 'Reservation not found' });
      }
  
      res.status(200).json({ message: 'Reservation updated' });
    } catch (err) {
      console.error('Error updating Reservation:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  module.exports = router;
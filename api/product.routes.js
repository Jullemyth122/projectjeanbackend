const express = require('express');
const router = express.Router();
const db = require('./db'); // Import the database connection

router.get('/getAll', async (req, res) => {
    try {
      const [rows, fields] = await db.execute('SELECT * FROM product_tbl');
      res.json(rows);
    } catch (error) {
      console.error('Error querying the database:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.post('/add', async (req, res) => {
    const { product_name, quantity, price } = req.body;
  
    // Insert a new user into the database
    const sql = 'INSERT INTO product_tbl ( product_name, quantity, price) VALUES (?, ?, ? )';
    const values = [ product_name, quantity, price ];
  
    try {
      const [result] = await db.execute(sql, values);
  
      res.status(201).json({ message: 'product created', id: result.insertId });
    } catch (err) {
      console.error('Error creating product:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.delete('/delete/:id', async (req, res) => {
    const userId = req.params.id;
    const sql = 'DELETE FROM product_tbl WHERE id = ?';
  
    try {
      const [result] = await db.execute(sql, [userId]);
      
      if (result.affectedRows === 0) {
        res.status(404).json({ error: 'Product not found' });
      } else {
        res.json({ message: 'Product deleted' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.put('/update/:id', async (req, res) => {
    const { id } = req.params; // Extract user ID from the URL
    const {  product_name, quantity, price } = req.body;
  
    // Update the user in the database
    const sql = 'UPDATE product_tbl SET product_name = ?, quantity = ?, price = ? WHERE id = ?';
    const values = [ product_name, quantity, price, id];
  
    try {
      const [result] = await db.execute(sql, values);
  
      if (result.affectedRows === 0) {
        // If no rows were affected, the user does not exist
        return res.status(404).json({ message: 'Product not found' });
      }
  
      res.status(200).json({ message: 'Product updated' });
    } catch (err) {
      console.error('Error updating Product:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  module.exports = router;
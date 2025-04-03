const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/:folder/:filename', (req, res) => {
    try {
        const { folder, filename } = req.params;
        const imagePath = path.join(__dirname, `../uploads/${folder}`, filename);
        res.sendFile(imagePath);
    } catch (error) {
        res.status(404).send('Image not found');
    }
});

module.exports = router; 
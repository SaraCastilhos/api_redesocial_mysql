const express = require('express');
const router = express.Router();

// Rota de versão/status (pública)
router.get('/status', (req, res) => {
    res.json({ 
        versao: '2.0.0', 
        status: 'online',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;
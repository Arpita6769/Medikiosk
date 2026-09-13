// server/routes/auth.js
const express = require('express');
const { IdentityRecord } = require('../db/schema');

const router = express.Router();

router.post('/verify-identity', async (req, res) => {
  const { idType, idNumber } = req.body;

  if (!idType || !idNumber) {
    return res.status(400).json({ verified: false, error: 'idType and idNumber are required.' });
  }

  try {
    const record = await IdentityRecord.findOne({ idType, idNumber: idNumber.trim() });

    if (!record) {
      return res.status(404).json({
        verified: false,
        error: idType === 'aadhaar'
          ? 'This Aadhaar number was not found in records.'
          : 'This driving licence number was not found in records.',
      });
    }

    return res.json({ verified: true, name: record.name });
  } catch (err) {
    console.error('verify-identity failed:', err.message);
    return res.status(500).json({ verified: false, error: 'Could not verify identity right now.' });
  }
});

module.exports = router;
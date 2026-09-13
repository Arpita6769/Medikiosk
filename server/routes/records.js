const express = require('express');
const {
  getChronicAndAllergySummary,
  getMatchingNonChronicRecords,
} = require('../db/recordQueries');

const router = express.Router();

/** GET /api/records/:patientId/summary — chronic + allergy, always shown in full. */
router.get('/:patientId/summary', async (req, res) => {
  try {
    const summary = await getChronicAndAllergySummary(req.params.patientId);
    res.json(summary);
  } catch (err) {
    console.error('getChronicAndAllergySummary failed:', err.message);
    res.status(500).json({ error: 'Could not load summary.', details: err.message });
  }
});

/** POST /api/records/:patientId/query — body: { doctorId, queryText } */
router.post('/:patientId/query', express.json(), async (req, res) => {
  const { doctorId, queryText } = req.body;
  if (!doctorId || !queryText) {
    return res.status(400).json({ error: '"doctorId" and "queryText" are required.' });
  }
  try {
    const matches = await getMatchingNonChronicRecords({
      doctorId,
      patientId: req.params.patientId,
      queryText,
    });
    res.json({ matches });
  } catch (err) {
    console.error('getMatchingNonChronicRecords failed:', err.message);
    res.status(500).json({ error: 'Query failed.', details: err.message });
  }
});

module.exports = router;
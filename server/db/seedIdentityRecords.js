// server/db/seedIdentityRecords.js
require('dotenv').config();
const { connectDb } = require('./connect');
const { IdentityRecord } = require('./schema');

const SAMPLE_RECORDS = [
  { idType: 'aadhaar', idNumber: '234567890123', name: 'Anita Sharma', mobile: '9876543210' },
  { idType: 'aadhaar', idNumber: '345678901234', name: 'Ravi Kumar', mobile: '9876543211' },
  { idType: 'aadhaar', idNumber: '456789012345', name: 'Priya Singh', mobile: '9876543212' },
  { idType: 'licence', idNumber: 'KA0120241234567', name: 'Anita Sharma', mobile: '9876543210' },
  { idType: 'licence', idNumber: 'MH1220231112223', name: 'Ravi Kumar', mobile: '9876543211' },
];

async function seed() {
  await connectDb();

  for (const record of SAMPLE_RECORDS) {
    await IdentityRecord.updateOne(
      { idType: record.idType, idNumber: record.idNumber },
      { $set: record },
      { upsert: true }
    );
    console.log(`Seeded ${record.idType}: ${record.idNumber} (${record.name})`);
  }

  console.log(`Done — ${SAMPLE_RECORDS.length} records seeded.`);
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
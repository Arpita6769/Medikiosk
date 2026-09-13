const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * One medical record entry for a patient.
 *
 * category drives the summarization rule from your query helpers:
 *   'chronic' | 'allergy'  -> always shown to doctors in full, unconditionally
 *   'non_chronic'          -> only surfaced when it matches a doctor's query
 */
// server/db/schema.js
// ...your existing schemas (MedicalRecord, DoctorQuery, etc.) stay as-is...

const identityRecordSchema = new Schema(
  {
    idType: { type: String, enum: ['aadhaar', 'licence'], required: true },
    idNumber: { type: String, required: true },
    name: { type: String, required: true },
    dob: { type: String },
    mobile: { type: String },
  },
  { timestamps: true }
);

identityRecordSchema.index({ idType: 1, idNumber: 1 }, { unique: true });

const IdentityRecord = mongoose.model('IdentityRecord', identityRecordSchema);

// add IdentityRecord to your existing module.exports
module.exports = { /* ...your existing exports..., */ IdentityRecord };

const medicalRecordSchema = new Schema(
  {
    // String, not ObjectId — matches the HSP-###### Health Services ID used
    // elsewhere in this project (registration, healthRecordService), not a
    // separate Mongo Patient collection.
    patientId: { type: String, required: true, index: true },
    category: {
      type: String,
      enum: ['chronic', 'allergy', 'non_chronic'],
      required: true,
      index: true,
    },
    diseaseName: { type: String, required: true },
    summary: { type: String, default: '' },
    tags: { type: [String], default: [] },
    // Loose bucket for whatever else a record needs (dosage, prescribing
    // doctor, lab values...) — kept flexible since record shapes vary a lot
    // between a chronic-condition entry and, say, a one-off lab result.
    details: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true } // gives createdAt/updatedAt — your .sort({ createdAt: -1 }) relies on this
);

// Backs the $text search in getMatchingNonChronicRecords(). Without this
// index, that branch of the $or query returns nothing instead of erroring —
// it fails silently, so it's easy to miss if this index is ever dropped.
medicalRecordSchema.index({ diseaseName: 'text', summary: 'text' });

/**
 * Log of every question a doctor has asked about a patient, and which
 * records matched — an audit trail, and reusable if you ever want to show
 * "doctors previously asked about X" on the patient side.
 */
const doctorQuerySchema = new Schema(
  {
    // Also String for the same reason — swap to ObjectId + ref: 'Doctor' if
    // you add a real Doctor collection with Mongo-generated IDs later.
    doctorId: { type: String, required: true },
    patientId: { type: String, required: true, index: true },
    queryText: { type: String, required: true },
    extractedKeywords: { type: [String], default: [] },
    matchedRecordIds: [{ type: Schema.Types.ObjectId, ref: 'MedicalRecord' }],
  },
  { timestamps: true }
);

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);
const DoctorQuery = mongoose.model('DoctorQuery', doctorQuerySchema);

module.exports = { MedicalRecord, DoctorQuery };
module.exports.IdentityRecord = IdentityRecord;
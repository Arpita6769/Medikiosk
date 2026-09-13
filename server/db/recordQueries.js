/**
 * Example query helpers matching the summarization rules:
 *  - chronic & allergy: always return full summarized data
 *  - non_chronic: only return records matching keywords from the doctor's query
 */

const { MedicalRecord, DoctorQuery } = require("./schema");

async function getChronicAndAllergySummary(patientId) {
  const records = await MedicalRecord.find({
    patientId,
    category: { $in: ["chronic", "allergy"] },
  }).sort({ createdAt: -1 });

  return {
    chronic: records.filter((r) => r.category === "chronic"),
    allergy: records.filter((r) => r.category === "allergy"),
  };
}

function extractKeywords(queryText) {
  const stopWords = new Set([
    "the", "a", "an", "is", "are", "of", "and", "or", "to", "for",
    "any", "history", "does", "patient", "have", "had", "with",
  ]);
  return queryText
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w && !stopWords.has(w));
}

async function getMatchingNonChronicRecords({ doctorId, patientId, queryText }) {
  const keywords = extractKeywords(queryText);

  const matches = await MedicalRecord.find({
    patientId,
    category: "non_chronic",
    $or: [
      { tags: { $in: keywords } },
      { diseaseName: { $regex: keywords.join("|"), $options: "i" } },
      { $text: { $search: keywords.join(" ") } },
    ],
  }).sort({ createdAt: -1 });

  await DoctorQuery.create({
    doctorId,
    patientId,
    queryText,
    extractedKeywords: keywords,
    matchedRecordIds: matches.map((m) => m._id),
  });

  return matches;
}

module.exports = {
  getChronicAndAllergySummary,
  extractKeywords,
  getMatchingNonChronicRecords,
};
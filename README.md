# MediKiosk

**MediKiosk** is a multimodal digital intake assistant designed for healthcare settings. It streamlines the patient intake process by enabling natural voice interaction, audio output generation, and text extraction from physical medical documents.

---

## 📌 Context & Problem Statement

In busy Outpatient Departments (OPDs), capturing complete patient history and prior records can be challenging:
* **Limited Consultation Time:** Clinicians have short windows to gather history, clarify symptoms, and document visits.
* **Communication Barriers:** Patients may struggle with traditional digital forms, typing, or reading text-heavy interfaces.
* **Scattered Physical Records:** Prescriptions and medical reports often exist only on paper or as image files, making them hard to review quickly.

**MediKiosk** bridges this gap by facilitating multimodal interaction—making patient information easier to capture, listen to, and digitize prior to or during clinical consultations.

---

## ✨ Core Features

1. **🎙 Speech-to-Text (STT)**
   * Captures natural spoken input from patients.
   * Converts speech to editable, digital text to minimize typing effort.
   * *Powered by the Bhashini API.*

2. **🔊 Text-to-Speech (TTS)**
   * Converts written prompts and responses into clear spoken audio.
   * Enhances accessibility for users who prefer auditory interaction or have reading limitations.
   * *Powered by the Bhashini API.*

3. **▧ Image-to-Text (OCR)**
   * Accepts image uploads of physical documents (e.g., prescriptions, reports).
   * Extracts readable text to help digitize paper-based medical histories.

---

## 🛠 Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Node.js
* **Database:** MongoDB
* **APIs & Integrations:** Bhashini API (Speech Recognition & Speech Synthesis)

---

## 🔄 User Journey & Workflow

1. **Choose Input:** Patient/user provides input via voice, text prompt, or an uploaded document image.
2. **Process:** The system processes the input using the respective capability (STT, TTS, or Image Extraction).
3. **Review Output:** The generated text or audio output is presented back to the user for review.
4. **Store / Continue:** Processed data is sent to the backend and saved into MongoDB for downstream workflows.

---

### Planned Next Steps:
* **Multilingual & Accent Support:** Enhance recognition accuracy for regional Indian languages, accents, and noisy clinical environments.
* **Clinical Structuring:** Automatically format extracted text into structured EHR/EMR clinical summaries.
* **Security & Compliance:** Implement consent management, secure access controls, data retention policies, and compliance with ABDM / ABHA standards.
* **EHR/HIS Integration:** Connect seamlessly with existing Hospital Information Systems (HIS).
* **Usability Testing:** Perform real-world testing with diverse patient demographics and clinical staff.

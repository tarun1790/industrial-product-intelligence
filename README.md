# ProductIQ — Industrial Product Intelligence & Catalog Standardization Engine

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://reactjs.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-CUDA%20Accelerated-EE4C2C.svg)](https://pytorch.org)
[![Java](https://img.shields.io/badge/Java-Enterprise%2023-ED8B00.svg)](https://www.oracle.com/java/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Turn fragmented industrial product information into verified, standardized, commerce-ready product intelligence with evidence-backed AI.**

---

## 🏭 Executive Overview

Industrial commerce and MRO (Maintenance, Repair, and Operations) supply chains suffer from fragmented, inconsistent, and conflicting technical product specifications. A simple part number or PDF catalog can produce wildly divergent ratings across distributors, manufacturers, and legacy datasheets.

**ProductIQ** replaces traditional, fragile "PDF → JSON" extractors with an end-to-end **Industrial Product Intelligence Platform** built around four fundamental pillars:

```text
       ┌───────────┐       ┌───────────┐       ┌────────────┐       ┌───────────┐
       │ 1. EXTRACT│  ───► │ 2. ENRICH │  ───► │3. VALIDATE │  ───► │  4. PROVE │
       └───────────┘       └───────────┘       └────────────┘       └───────────┘
     "What does the       "What data is       "Is it physically     "Where did each
      source say?"          missing?"          & logically sane?"     spec come from?"
```

---

## 🏗️ Core Architecture & Pillars

```text
                       PRODUCT SOURCES
                              │
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
           Websites          PDFs       Nameplate Images
              │               │               │
              └───────────────┼───────────────┘
                              ↓
                    MULTIMODAL INGESTION
                              │
                    ┌─────────┴─────────┐
                    ↓                   ↓
             Document AI / OCR       Vision AI
                    │                   │
                    └─────────┬─────────┘
                              ↓
                 ONTOLOGY SCHEMA EXTRACTION
                              │
               ┌──────────────┼──────────────┐
               ↓              ↓              ↓
          Normalization   Entity Match   Missing Data
          (SI/Imperial)  (Part # & Var)  (Category-Aware)
               │              │              │
               └──────────────┼──────────────┘
                              ↓
                   PHYSICS VALIDATION ENGINE
                              │
                ┌─────────────┼─────────────┐
                ↓             ↓             ↓
             Ohm's &       Bearing &      Thermal &
           Power Laws     Load Ratios    IP Enclosures
                └─────────────┼─────────────┘
                              ↓
                    EVIDENCE PROVENANCE
                              │
                 (Line-Level Snippets & Bounding Boxes)
                              ↓
                    VERIFIED PRODUCT DATA
                              │
              ┌───────────────┼───────────────┐
              ↓               ↓               ↓
         Commerce PIM    Search Engine   Knowledge Graph
           (JSON-LD)      (Parametric)     (Vis Network)
```

---

## 🔥 Key Engineering Features

### 1. "Can I Trust This Spec?" — Granular Evidence & Provenance
For every single attribute (power, voltage, bearing bore, IP rating, weight), ProductIQ logs:
- Exact document source name and OEM authority weight (1.0 for OEM, 0.7 for Distributor).
- Page number and bounding box coordinates.
- Verbatim contextual quotation snippet and extraction confidence score.

### 2. Multi-Source Conflict Resolution Engine
When specifications disagree (e.g. *Datasheet 2021: 42 kg* vs *Technical Catalog 2024: 45 kg*):
- Scores authority by OEM hierarchy and publication revision date.
- Differentiates between physical revisions vs frame mounting configurations (e.g. Foot-mount B3 vs Flange-mount B5).
- Generates an auditable resolution reasoning trail.

### 3. Engineering Physics & Electrical Sanity Checker
- **3-Phase Motor Consistency**: Validates \( P \approx \sqrt{3} \times V \times I \times \cos\phi \times \eta \). Flags physical impossibilities and calculates tolerance discrepancies.
- **Slip vs Synchronous Speed**: Validates sub-synchronous rotor speed at 50Hz / 60Hz.
- **Bearing Load Limits**: Checks dynamic load rating \( C \) against static rating \( C_0 \) per ISO 281 / ISO 76 standards.
- **Centrifugal Pump Power Balance**: Verifies hydraulic power \( P_{\text{hyd}} = \frac{\rho \cdot g \cdot Q \cdot H}{3.6 \times 10^6} \) against rated motor power.

### 4. Interactive Industrial Knowledge Graph
Visualizes multi-relational graphs linking:
- Equipment models (`ABB M3BP 160MLA 4`, `SKF 6205-2RSH`, `Grundfos CR 10-06`)
- OEM Manufacturers, Product Lines, and Series Families
- Compatible Variable Frequency Drives (VFDs) and Starters
- Mating Bearings, Mechanical Seals, and Legacy Replaced Models

### 5. Natural Language Parametric Search & Side-by-Side Comparator
- Converts engineering queries like *"Find me a 5–10 kW three-phase motor suitable for continuous industrial operation at 415 V with IE3 efficiency"* into structured faceted filters.
- Multi-product comparison matrix with AI-generated trade-off analysis.

### 6. Commerce-Ready Schema & PIM Exporter
- Automated generation of SEO titles, bullet features, approved applications, and HSN/UNSPSC taxonomy codes.
- 1-Click `schema.org/Product` JSON-LD export, CSV engineering spec sheets, and JSON payloads.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **AI / Machine Learning** | PyTorch (CUDA GPU enabled), NLP Entity Extractors, Embeddings, Generative Schemas |
| **Backend & APIs** | Python 3.10+, FastAPI, Pydantic v2, PyMuPDF (PDF Parser), NumPy, Uvicorn |
| **Enterprise Validation** | Java 23 Enterprise Micro-Validator (`services/java-validator`) |
| **Frontend & Web** | React 18, Vite, TailwindCSS v4, Vis-Network (Knowledge Graph), Lucide Icons |
| **Automation & Data** | Deterministic SI/Imperial normalizers, ISO/IEC industrial ontologies, multi-source conflict reconciliation |

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+ (PyTorch with CUDA GPU supported)
- Node.js 18+ / npm
- Java JDK 17+ (optional, for standalone Java validator)

---

### 1. Start the FastAPI Backend
```bash
# In project root
pip install -r backend/requirements.txt

# Start backend server
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be live at: **http://localhost:8000/docs**

---

### 2. Start the React Frontend
```bash
# In project root
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173** in your browser.

---

### 3. Run the Java Enterprise Validator (Optional)
```bash
# Compile and run Java verification engine
javac -d bin services/java-validator/src/main/java/io/productiq/validator/IndustrialProductValidator.java
java -cp bin io.productiq.validator.IndustrialProductValidator
```

---

## 📊 Preloaded Benchmark Datasets

The platform includes preloaded realistic industrial equipment profiles:
1. **ABB M3BP 160MLA 4**: 7.5 kW IE3 Motor (featuring resolved 42kg vs 45kg multi-source conflict)
2. **Siemens SIMOTICS 1LE1003-1DB2**: 11 kW IE3 Severe Duty Motor
3. **SKF 6205-2RSH**: Deep Groove Ball Bearing with ISO 15 tolerances
4. **Timken 6205-2RS**: Industrial Rolling Bearing with contact seals
5. **Grundfos CR 10-06**: Vertical Multistage Centrifugal Pump (65m head, 3.0 kW)
6. **Siemens SIRIUS 3RV2011**: 3-Phase Motor Starter Circuit Breaker (50 kA Icu)
7. **Festo DNC-50-200**: ISO 15552 Standard Pneumatic Cylinder

---

## 📜 License
MIT License

# Specification

## Summary
**Goal:** Build MediClear, a mobile-first app that lets users paste pathological lab reports and doctor prescriptions, then receive a plain-language simplified summary organized into Key Findings, Medications, and What To Do Next sections.

**Planned changes:**
- Mobile-first UI with soft green/white medical theme, card-based layouts, and MediClear logo in the splash screen and top navigation bar
- Input screen with two labeled text areas (pathological report and prescription) and a "Simplify Report" button
- Rule-based/glossary simplification engine in the Motoko backend that translates medical jargon into plain language and structures output into three sections
- Results screen displaying the structured summary with large readable text and a language selector (English, Hindi, Spanish, French, Arabic, Bengali) that updates UI labels and section headings
- History screen listing all past reports in reverse-chronological order with timestamp and 100-character excerpt, tappable to view the full summary
- Backend Motoko actor storing report records (ID, timestamp, original report text, original prescription text, simplified summary) with save and retrieval functions persisted across upgrades

**User-visible outcome:** Users can paste a medical report and/or prescription, receive an easy-to-understand plain-language summary in their preferred language, and browse previously simplified reports from a history list.

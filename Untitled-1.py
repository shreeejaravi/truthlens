"""
medical_data_extractor.py

Usage:
    python medical_data_extractor.py --input file_or_folder_path

Dependencies (install with pip):
    pip install pdfplumber pandas python-dateutil

Notes:
 - PDF extraction uses pdfplumber (recommended). If unavailable, try using PyPDF2 (not implemented here).
 - This extractor uses rule-based regex heuristics; for higher accuracy integrate clinical NLP (e.g. medSpaCy, scispaCy).
"""

import re
import os
import argparse
from dateutil import parser as dateparser
from collections import defaultdict

# Optional dependencies - used when available
try:
    import pdfplumber
except Exception:
    pdfplumber = None

try:
    import pandas as pd
except Exception:
    pd = None

# -----------------------
# Regex patterns / helpers
# -----------------------
NAME_PATTERNS = [
    r"Patient Name[:\-\s]*([A-Z][A-Za-z ,.'-]{2,100})",
    r"Name[:\-\s]*([A-Z][A-Za-z ,.'-]{2,100})",
    r"Patient[:\-\s]*([A-Z][A-Za-z ,.'-]{2,100})",
]

DOB_PATTERNS = [
    r"(?:DOB|D\.O\.B|Date of Birth)[:\-\s]*([0-3]?\d[\/\-.][0-1]?\d[\/\-.](?:\d{2,4}))",
    r"(?:DOB|Date of Birth)[:\-\s]*([A-Za-z]{3,9}\s+\d{1,2},\s*\d{4})"
]

MRN_PATTERNS = [
    r"(?:MRN|Medical Record Number)[:\-\s]*([A-Z0-9\-]{4,20})",
    r"Hospital No[:\-\s]*([A-Z0-9\-]{4,20})"
]

GENDER_PATTERNS = [
    r"Gender[:\-\s]*(Male|Female|M|F|Other|male|female)",
    r"Sex[:\-\s]*(Male|Female|M|F|male|female)"
]

DIAGNOSIS_PATTERNS = [
    r"(?:Diagnosis|Dx)[:\-\s]*([A-Za-z0-9 ,\(\)\-\/]+)",
    r"Impression[:\-\s]*([A-Za-z0-9 ,\(\)\-\/]+)"
]

# Medications: rough heuristic: lines with drug names and doses (e.g. "Paracetamol 500 mg twice daily")
MED_PATTERN = re.compile(
    r"([A-Z][A-Za-z0-9\-]{2,}(?:\s+[A-Za-z0-9\-]+)*)\s+([0-9]+(?:\.[0-9]+)?\s*(?:mg|g|mcg|IU|units|ml))\s*(.*)",
    flags=re.IGNORECASE
)

# Labs: e.g., "Hb: 13.5 g/dL", "WBC 12.3 x10^9/L"
LAB_LINE_PATTERN = re.compile(
    r"([A-Za-z0-9\-/\s]{2,30})[:\s]{1,3}([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z/%\^\-0-9]*)"
)

# Generic helper to normalize date
def parse_date_guess(s):
    try:
        d = dateparser.parse(s, fuzzy=True, dayfirst=False)
        return d.date().isoformat() if d else None
    except Exception:
        return None

# -----------------------
# Text extraction helpers
# -----------------------
def extract_field_by_patterns(text, patterns):
    for pat in patterns:
        m = re.search(pat, text, flags=re.IGNORECASE)
        if m:
            return m.group(1).strip()
    return None

def extract_medications(text):
    meds = []
    for line in text.splitlines():
        line = line.strip()
        if not line: 
            continue
        m = MED_PATTERN.search(line)
        if m:
            name = m.group(1).strip()
            dose = m.group(2).strip()
            rest = m.group(3).strip()
            meds.append({"name": name, "dose": dose, "notes": rest})
    return meds

def extract_lab_results(text):
    labs = []
    # iterate lines for lab-style patterns
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        m = LAB_LINE_PATTERN.match(line)
        if m:
            test = m.group(1).strip()
            value = m.group(2).strip()
            unit = m.group(3).strip() or None
            # Heuristics: skip lines that are obviously not labs (e.g., "Name: John")
            if any(k.lower() in test.lower() for k in ["name", "gender", "dob", "mrn", "address"]):
                continue
            labs.append({"test": test, "value": value, "unit": unit})
    return labs

def extract_diagnoses(text):
    diags = []
    for pat in DIAGNOSIS_PATTERNS:
        for m in re.finditer(pat, text, flags=re.IGNORECASE):
            diag_text = m.group(1).strip()
            # split on ; or / or newline if multiple
            parts = re.split(r"[;/\n]", diag_text)
            for p in parts:
                p = p.strip()
                if p:
                    diags.append(p)
    # fallback: lines that start with Dx or Diagnosis
    if not diags:
        for line in text.splitlines():
            if line.lower().startswith(("dx:", "diagnosis:", "impression:")):
                diags.append(line.split(":",1)[1].strip())
    return diags

# -----------------------
# File readers
# -----------------------
def read_txt(path):
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()

def read_pdf(path):
    if pdfplumber:
        text = []
        with pdfplumber.open(path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                text.append(page_text)
        return "\n".join(text)
    else:
        raise RuntimeError("pdfplumber not installed. Install with `pip install pdfplumber`.")

def read_csv(path):
    if not pd:
        raise RuntimeError("pandas not installed. Install with `pip install pandas`.")
    df = pd.read_csv(path, dtype=str, keep_default_na=False)
    # naive: concatenate rows into simple text per row
    rows = []
    for _, r in df.iterrows():
        parts = [f"{c}: {r[c]}" for c in df.columns if str(r[c]).strip() != ""]
        rows.append(" | ".join(parts))
    return "\n".join(rows), df  # return both textual view and dataframe

# -----------------------
# Main extraction pipeline
# -----------------------
def extract_from_text(text):
    info = {}
    info['patient_name'] = extract_field_by_patterns(text, NAME_PATTERNS)
    dob_raw = extract_field_by_patterns(text, DOB_PATTERNS)
    info['dob'] = parse_date_guess(dob_raw) if dob_raw else None
    info['mrn'] = extract_field_by_patterns(text, MRN_PATTERNS)
    info['gender'] = extract_field_by_patterns(text, GENDER_PATTERNS)
    info['diagnoses'] = extract_diagnoses(text)
    info['medications'] = extract_medications(text)
    info['lab_results'] = extract_lab_results(text)
    # additional metadata
    info['text_snippet'] = (text[:200] + "...") if len(text) > 200 else text
    return info

def process_file(path):
    ext = os.path.splitext(path)[1].lower()
    if ext in [".txt", ".text"]:
        text = read_txt(path)
        return extract_from_text(text)
    elif ext in [".pdf"]:
        text = read_pdf(path)
        return extract_from_text(text)
    elif ext in [".csv"]:
        text, df = read_csv(path)
        return extract_from_text(text)
    else:
        # try reading as text
        try:
            text = read_txt(path)
            return extract_from_text(text)
        except Exception as e:
            return {"error": f"unsupported file type: {ext} - {e}"}

def process_input_path(path):
    results = {}
    if os.path.isdir(path):
        for fname in os.listdir(path):
            fpath = os.path.join(path, fname)
            if os.path.isfile(fpath):
                try:
                    results[fname] = process_file(fpath)
                except Exception as e:
                    results[fname] = {"error": str(e)}
    elif os.path.isfile(path):
        name = os.path.basename(path)
        results[name] = process_file(path)
    else:
        raise FileNotFoundError(path)
    return results

# -----------------------
# CLI
# -----------------------
def main():
    parser = argparse.ArgumentParser(description="Medical data extractor (rule-based).")
    parser.add_argument("--input", "-i", required=True, help="File or folder path to process (txt, pdf, csv).")
    parser.add_argument("--json", "-j", action="store_true", help="Output results as JSON.")
    args = parser.parse_args()

    results = process_input_path(args.input)

    # Pretty print results
    import json
    if args.json:
        print(json.dumps(results, indent=2, ensure_ascii=False))
    else:
        for fname, info in results.items():
            print("="*80)
            print(f"File: {fname}")
            if isinstance(info, dict) and "error" in info:
                print("Error:", info["error"])
                continue
            print("Patient Name:", info.get("patient_name"))
            print("DOB:", info.get("dob"))
            print("MRN:", info.get("mrn"))
            print("Gender:", info.get("gender"))
            print("Diagnoses:", "; ".join(info.get("diagnoses") or []))
            print("Medications:")
            for m in info.get("medications") or []:
                print("  -", m)
            print("Lab results:")
            for l in info.get("lab_results") or []:
                print("  -", l)
            print()

if __name__ == "__main__":
    main()

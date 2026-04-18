# Big Book Passages Feature — Progress Log

**Status:** Partially complete. Introduction + Steps 1, 2, 3 done. Step 4 barely started. Steps 5–12 not started.

---

## What we decided

**UX approach:** Inline tap-to-expand, not PDF page-jump.
- Each reference in the Big Book Passages screen is tappable
- Tap `▸` → passage text slides open inline below the reference
- Tap `▾` again → collapses
- Kept lightweight (no `react-native-pdf` native module)

**Content strategy:** Hybrid extraction.
- Claude reads `aa_big_book_accurate.pdf` page-by-page
- Claude transcribes passages into structured data
- User spot-checks for accuracy

**Source of truth:** `aa_big_book_accurate.pdf` (in repo root)

---

## What's built

### Files created/modified
- `src/data/passages.js` — new. Keyed by exact reference string from `content.js`.
- `src/screens/PassagesScreen.js` — rewritten. Tap-to-expand with `LayoutAnimation`.

### Passages extracted (22 so far)

**Introduction (2/2)** ✅
- Who are we? pg. xiii: 5 (1) and pg. xiv: 0 (1-6)
- What do we have to offer? pg. 17: 3 (1-6)

**Step 1 (9/9)** ✅
- Physical Craving / Allergy: pg. xxviii: 1 (1-10), pg. xxx: 5 (1-8)
- Mental Obsession: pg. xxviii: 4 (1-6), pg. xxix: 0 (1-9) pg. 30: 1 (4-10)
- Unmanageability / Spiritual Malady Symptoms: pg. 52: 2 (3-8)
- Spiritual Malady Cause: pg. 62: 2 (1-4)
- Psychic Change: pg. xxix: 1 (1-7)
- Qualifying Questions: Pg. 44: 1 (4-7)
- The Solution: pg. 44: 1 (7-9)
- First Step Question: pg. 30: 2 (1-4)

**Step 2 (6/6)** ✅
- Lack of Power
- Where do we find the Power?
- Look within
- What if the newcomer doesn't believe?
- Examples of This power
- Second Step question

**Step 3 (4/4)** ✅
- A life run on self-will
- Selfishness blocks us from God's will
- A life guided by the vision of God's will
- Third Step prayer

**Step 4 (1/12)** 🟡 started
- Resentment overview: pg. 63: 4 (1-2) ... pg. 64: 3 (1-7) — done
- Column 1, 2, 3, 4 summary, Spiritually sick realization, etc. — **TODO**

---

## What's left

### Step 4 remaining (11 references)
Big Book pages 64–71. Most complex section — lots of sub-references (Columns 1–4, resentment/fear/sex overlap). Target: quote main substantive passage per reference, annotate sub-page markers inline.
- Column 1, 2, 3, 4 summary
- Spiritually sick realization
- We overcome resentments with forgiveness
- Column 4 Instructions
- We overcome fear with faith
- Sex Conduct
- Future Sex Ideal
- We overcome harms with amends

### Step 5 (2 references)
Pages 72–75.

### Step 6 (1 reference)
Page 76.

### Step 7 (1 reference)
Page 76.

### Step 8 (1 reference)
Page 76.

### Step 9 (6 references)
Pages 76–84.

### Step 10 (2 references)
Pages 84–85.

### Step 11 (7 references)
Pages 85–88.

### Step 12 (3 references)
Pages 89, 164, 25.

**Total remaining: ~34 references**
Estimated extraction time: 30–45 minutes of Claude reading + transcribing.

---

## Known issues / things to verify

1. **Paragraph numbering discrepancies.** The guide sometimes says "pg. xxviii: 4" but the referenced text actually starts on pg. xxvii and continues. Where ambiguous, we quoted the content the user intends (verified from examples in their chat messages).

2. **User needs to spot-check** the 22 extracted passages against a physical Big Book before we trust the format.

3. **PDF page mapping** (`aa_big_book_accurate.pdf`):
   - PDF page 5 = printed xiii
   - PDF page 15 = printed 1
   - Formula for main body: `PDF_page = printed_page + 14`
   - Doctor's Opinion: PDF 7 = xviii, PDF 8 = xxiv, PDF 9 = xxv, etc. (this PDF skips pgs xv–xvii and xix–xxiii)

---

## How to resume

1. Open `src/data/passages.js`
2. Add new keys matching the exact reference strings from `src/data/content.js` (copy them verbatim — whitespace and punctuation matter)
3. Paste transcribed passage text as the value
4. When a reference spans multiple pages/paragraphs, prefix each chunk with `(pg. X: Y)` markers like:
   ```
   '(pg. 67: 3) ... paragraph 1 text ...\n\n(pg. 68: 1) ... paragraph 2 text ...'
   ```
5. Save — the Passages screen picks them up automatically

---

## Stretch ideas for later

- Jump-to-passage from step content screens (Step 1 screen → link to relevant Big Book passages)
- Search across all passages by keyword
- "Mark as read" persistence with AsyncStorage
- Side-by-side view in landscape mode (reference + passage text)

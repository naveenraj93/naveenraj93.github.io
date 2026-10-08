# Garment Costing & Pricing Web Application Plan (Pure HTML + JS + Tailwind CSS)

## 1. Architecture Overview
A lightweight, zero-build, standalone web application built with:
- **HTML5**: Semantic, clean markup in a single or modular structure (`index.html`).
- **Tailwind CSS**: Loaded via CDN (`cdn.tailwindcss.com`) with tailored textile color palette.
- **Lucide Icons**: Loaded via CDN (`unpkg.com/lucide@latest`) for clean UI iconography.
- **Vanilla JavaScript (`app.js`)**: Reactive state management, live two-way data binding, math engine, presets, and export utilities.
- **No Build Steps**: Can be run immediately by double-clicking `index.html` in any browser or serving via any local/web server.

---

## 2. File Structure
```
pricing app/
├── index.html          // Main UI layout (responsive cards, live displays, print layout)
├── app.js              // Pure JS calculation engine, state, presets, copy & print handlers
├── styles.css          // Custom styles, slider styling, print-media stylesheets
├── PLAN.md             // Implementation plan
└── docs/
    └── PRICEING EXCEL.xlsx
```

---

## 3. Calculation Engine (Exact Parity with Sheet 1)

### A. Fabric Consumption & Piece Weight (PC WT)
$$\text{Main Fabric (g)} = \frac{((\text{Chest} \times \text{Length}) + (\text{Sleeve Width} \times \text{Sleeve Length}) + (\text{Thigh}\times 2 \times \text{Length})) \times \text{GSM}}{5000}$$
- **Rib**: $8\text{ g}$
- **Fabric Wastage**: $8\%$
- **Piece Weight**: $\text{Total Grams} / 1000 = \mathbf{0.1107\text{ kg}}$

### B. Fabric Rate per Kg
$$\text{Total Fabric Rate} = \text{Yarn (₹256)} + \text{Knitting (₹12)} + \text{Dyeing (₹100)} + \text{Compacting (₹11)} + \dots = \mathbf{₹379.00/kg}$$

### C. Direct Manufacturing Cost
- $\text{Fabric Cost/pc} = \text{Piece Weight} \times \text{Fabric Rate} = 0.1107 \times 379 = \mathbf{₹41.955}$
- $\text{Subtotal} = \text{Fabric Cost} + \text{Printing} + \text{Embroidery} + \text{CMT} + \text{Accessories} + \text{Overhead} + \text{Others}$
- $\text{Garment Wastage (3\%)} = \text{Subtotal} \times 0.03 = \mathbf{₹1.259}$
- $\text{Actual Price} = \text{Subtotal} + \text{Wastage} = \mathbf{₹43.214}$

### D. Quotations & Multi-Currency
- **20% Margin**: Profit ₹8.64 $\rightarrow$ **₹51.86** / **$0.62** (USD @ 84)
- **25% Margin**: Profit ₹10.80 $\rightarrow$ **₹54.02** / **$0.64**
- **30% Margin**: Profit ₹12.96 $\rightarrow$ **₹56.18** / **$0.67**
- **Custom Margin**: Dynamic slider ($0\%$ to $50\%$)
- **Forex Conversion**: Configurable rates for USD ($) and EUR (€)

---

## 4. UI Components & Interactivity
1. **Header & Presets**:
   - Quick preset buttons: **Sheet 1 Excel Baseline (T-Shirt)**, **Polo T-Shirt**, **Shorts / Bottom Wear**, and **Reset to Default**.
2. **Measurement & Consumption Card**:
   - Number inputs with step controls for Chest, Length, Sleeve, Thigh, GSM, Rib, Fabric Wastage %.
   - Real-time display badge: **Main Fab (g)**, **Total (g)**, and **Piece Weight (kg)**.
3. **Fabric Processing Rates Card**:
   - Yarn, Knitting, Dyeing, Raising, Stentering, Compacting, AOP with live **Total Fabric Rate / kg**.
4. **Manufacturing Expenses Card**:
   - Fabric cost auto-filled + inputs for Printing, Embroidery, CMT, Trims/Accessories, Overheads, and Garment Wastage %.
   - Live **Actual Garment Price (₹)**.
5. **Interactive Quotation & Margin Card**:
   - 20%, 25%, 30% instant comparison pills.
   - Interactive custom margin slider ($0\% - 50\%$).
   - Live quotes in **INR (₹)**, **USD ($)**, and **EUR (€)**.
   - Editable USD and EUR forex rates.
6. **Visual Composition Bar**:
   - Colored breakdown bar showing percentage of Fabric vs. CMT/Trims vs. Wastage vs. Profit.
7. **Action Utilities**:
   - **Copy to Clipboard (WhatsApp format)**: Generates a neatly formatted text quotation ready to send to buyers.
   - **Print / PDF button**: Clean print stylesheet optimized for A4 quote export.
   - **Auto-save**: Remembers last entered values in browser `localStorage`.

---

## 5. Verification Plan
- Load `index.html` in browser.
- Verify default values match Excel Sheet 1 numbers exactly down to decimals.
- Test changing inputs (e.g. GSM to 200, Yarn to 270) and verify instant recalculation across all cards.
- Test copy quote button and print preview.

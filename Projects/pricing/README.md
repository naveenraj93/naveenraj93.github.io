# Tirupur Garment Costing & Export Pricing Web App

An interactive, responsive web application for knitwear manufacturers, merchandisers, and exporters, calibrated against **Sheet 1 of `docs/PRICEING EXCEL.xlsx`**.

Built with **pure HTML5, Vanilla JavaScript, Tailwind CSS, and Lucide Icons** — with zero build setup and zero external dependencies required.

---

## 🚀 How to Run

### Option 1: Open Directly (Easiest)
Simply double-click [`index.html`](./index.html) in Windows File Explorer or open it in Google Chrome, Microsoft Edge, or any modern browser.

### Option 2: Run via Local Server (Optional)
If you prefer running via a local web server:

**Using Python:**
```bash
python -m http.server 3000
```
Then visit `http://localhost:3000` in your browser.

**Using Node.js:**
```bash
npx serve .
```

---

## 📁 Preset Configuration (`data.json`)
Preset values (Default Crew Neck, Polo Shirt, Sweat Shorts) are stored in [`data.json`](./data.json). You can edit `data.json` directly to customize your standard styles, fabric rates, and measurements.

---

## 🧮 Costing Logic & Excel Parity

The application replicates the costing pipeline from Sheet 1:

1. **Fabric Consumption & Piece Weight (PC WT):**
   $$\text{Main Fabric (g)} = \frac{((\text{Chest} \times \text{Length}) + (\text{Sleeve Width} \times \text{Sleeve Length}) + (\text{Thigh}\times 2 \times \text{Length})) \times \text{GSM}}{5000}$$
   - Total Fabric (g) = $(\text{Main Fabric} + \text{Rib}) \times (1 + \text{Fabric Wastage \%})$
   - Piece Weight (kg) = $\text{Total Fabric (g)} / 1000$
   - *Baseline Example:* $25 \times 78$, $25 \times 27$, $180\text{ GSM}$, $8\text{g Rib}$, $8\%\text{ Wastage} \rightarrow \mathbf{0.1107\text{ kg}}$ ($110.7\text{ g}$).

2. **Fabric Rate per Kg:**
   $$\text{Rate/kg} = \text{Yarn} + \text{Knitting} + \text{Dyeing} + \text{Compacting} + \text{Raising} + \text{Stentering} + \text{AOP}$$
   - *Baseline Example:* $₹256 + ₹12 + ₹100 + ₹11 = \mathbf{₹379.00/kg}$.

3. **Garment Direct Production Cost:**
   - $\text{Fabric Cost/pc} = \text{Piece Weight (kg)} \times \text{Fabric Rate/kg} = 0.1107 \times 379 = \mathbf{₹41.955}$
   - $\text{Subtotal} = \text{Fabric Cost} + \text{Printing} + \text{Embroidery} + \text{CMT} + \text{Accessories} + \text{Overheads}$
   - $\text{Garment Wastage (3\%)} = \text{Subtotal} \times 0.03 = \mathbf{₹1.259}$
   - $\text{Actual Price} = \text{Subtotal} + \text{Garment Wastage} = \mathbf{₹43.214}$

4. **Commercial Quotes & Forex:**
   - **20% Margin:** $\mathbf{₹51.86}$ / $\mathbf{\$0.62}$ *(at USD 84)*
   - **25% Margin:** $\mathbf{₹54.02}$ / $\mathbf{\$0.64}$
   - **30% Margin:** $\mathbf{₹56.18}$ / $\mathbf{\$0.67}$
   - **Custom Margin Slider:** Interactive slider from $0\%$ to $50\%$.

---

## ✨ Features

- **⚡ Instant Real-Time Calculations:** Every number input and slider dynamically updates all cards and totals.
- **🎯 1-Click Garment Presets:**
  - *Excel Baseline:* Restores the exact default numbers from `PRICEING EXCEL.xlsx`.
  - *Polo Shirt:* Men's polo with collar and cuff rib weights.
  - *Sweat Shorts:* French terry bottom wear using Thigh $\times$ 2.
- **📊 Visual Cost Breakdown Bar:** Live color-coded split showing Fabric vs. CMT/Trims vs. Wastage vs. Profit %.
- **📋 One-Click Copy Quotation:** Formats and copies a clean WhatsApp-ready quotation with full breakdown.
- **🖨️ Print / PDF Ready:** Clean `@media print` layout without navigation clutter.
- **💾 Auto-Save:** Automatically persists your edits in browser `localStorage`.

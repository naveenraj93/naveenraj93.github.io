// Tirupur Garment Costing & Pricing Engine

// Fallback baseline state (synchronized with data.json)
let DEFAULT_STATE = {
  styleName: "Basic Crew Neck T-Shirt",
  color: "Solid Dyed",
  currencyUsd: 84,
  currencyEur: 92,
  gsm: 180,
  chest: 25,
  length: 78,
  sleeveChest: 25,
  sleeveLength: 27,
  thighX2: 0,
  bottomLength: 0,
  rib: 8,
  fabricWastage: 8,
  yarn: 256,
  knitting: 12,
  dyeing: 100,
  raising: 0,
  sentering: 0,
  compacting: 11,
  aop: 0,
  compacting2: 0,
  printing: 0,
  embroidery: 0,
  cmt: 0,
  accessories: 0,
  overhead: 0,
  others: 0,
  garmentWastage: 3,
  customMargin: 22
};

// Preset configurations container (loaded dynamically from data.json)
let PRESETS = {
  polo: {
    styleName: "Pique Polo Shirt",
    color: "Navy Blue",
    currencyUsd: 84,
    currencyEur: 92,
    gsm: 220,
    chest: 52,
    length: 74,
    sleeveChest: 20,
    sleeveLength: 24,
    thighX2: 0,
    bottomLength: 0,
    rib: 35,
    fabricWastage: 9,
    yarn: 280,
    knitting: 16,
    dyeing: 110,
    raising: 0,
    sentering: 0,
    compacting: 12,
    aop: 0,
    compacting2: 0,
    printing: 0,
    embroidery: 8,
    cmt: 28,
    accessories: 14,
    overhead: 7,
    others: 0,
    garmentWastage: 3,
    customMargin: 25
  },
  shorts: {
    styleName: "French Terry Sweat Shorts",
    color: "Melange Grey",
    currencyUsd: 84,
    currencyEur: 92,
    gsm: 240,
    chest: 0,
    length: 0,
    sleeveChest: 0,
    sleeveLength: 0,
    thighX2: 60,
    bottomLength: 50,
    rib: 20,
    fabricWastage: 8,
    yarn: 270,
    knitting: 15,
    dyeing: 105,
    raising: 0,
    sentering: 0,
    compacting: 12,
    aop: 0,
    compacting2: 0,
    printing: 6,
    embroidery: 0,
    cmt: 22,
    accessories: 15,
    overhead: 6,
    others: 0,
    garmentWastage: 3,
    customMargin: 20
  }
};

// Asynchronously load presets from data.json
async function fetchPresetsData() {
  try {
    const res = await fetch('data.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && typeof data === 'object') {
      PRESETS = data;
      if (data.default) {
        DEFAULT_STATE = { ...data.default };
      }
      renderPresetButtons();
      return data;
    }
  } catch (err) {
    console.info("Loaded default preset settings (fetch data.json note: " + err.message + ")");
    renderPresetButtons();
  }
  return null;
}

// Dynamically render preset buttons from PRESETS (data.json)
function renderPresetButtons() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('presetButtonsContainer');
  if (!container) return;

  container.innerHTML = '';
  const keys = Object.keys(PRESETS).filter(k => k !== 'default');

  keys.forEach(key => {
    const preset = PRESETS[key];
    const btn = document.createElement('button');
    btn.className = 'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer shadow-2xs';

    let iconName = 'tag';
    let iconColor = 'text-indigo-600';
    const lowerKey = key.toLowerCase();
    if (lowerKey.includes('polo') || lowerKey.includes('shirt') || lowerKey.includes('top')) {
      iconName = 'shirt';
      iconColor = 'text-blue-600';
    } else if (lowerKey.includes('short') || lowerKey.includes('pant') || lowerKey.includes('bottom') || lowerKey.includes('trouser')) {
      iconName = 'layers';
      iconColor = 'text-amber-600';
    }

    let label = preset.presetLabel;
    if (!label) {
      if (key === 'polo') label = 'Polo Shirt';
      else if (key === 'shorts') label = 'Shorts';
      else {
        label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      }
    }

    btn.innerHTML = `<i data-lucide="${iconName}" class="w-3.5 h-3.5 ${iconColor}"></i> <span>${label}</span>`;
    btn.addEventListener('click', () => loadPreset(key));
    container.appendChild(btn);
  });

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

let appState = { ...DEFAULT_STATE };


// Core calculation logic mirroring Sheet 1 of PRICEING EXCEL.xlsx
function calculate(state) {
  const gsm = Number(state.gsm) || 0;
  const chest = Number(state.chest) || 0;
  const length = Number(state.length) || 0;
  const sleeveChest = Number(state.sleeveChest) || 0;
  const sleeveLength = Number(state.sleeveLength) || 0;
  const thighX2 = Number(state.thighX2) || 0;
  const bottomLength = Number(state.bottomLength) || 0;

  // 1. Fabric Consumption Formula from Excel:
  // =((((J2*J3)+(J5*J6)+(J8*J9))*C5)/5000)
  const bodyArea = chest * length;
  const sleeveArea = sleeveChest * sleeveLength;
  const bottomArea = thighX2 * bottomLength;
  const mainFabGrams = ((bodyArea + sleeveArea + bottomArea) * gsm) / 5000;

  const ribGrams = Number(state.rib) || 0;
  const totalFabBeforeWastage = mainFabGrams + ribGrams;

  const fabricWastagePct = (Number(state.fabricWastage) || 0) / 100;
  const fabricWastageGrams = totalFabBeforeWastage * fabricWastagePct;
  const totalGrams = totalFabBeforeWastage + fabricWastageGrams;

  // PC WT in kg = Total grams / 1000
  const pcWtKg = totalGrams / 1000;

  // 2. Fabric Processing Rates per kg
  const yarn = Number(state.yarn) || 0;
  const knitting = Number(state.knitting) || 0;
  const dyeing = Number(state.dyeing) || 0;
  const raising = Number(state.raising) || 0;
  const sentering = Number(state.sentering) || 0;
  const compacting = Number(state.compacting) || 0;
  const aop = Number(state.aop) || 0;
  const compacting2 = Number(state.compacting2) || 0;

  const fabricRatePerKg = yarn + knitting + dyeing + raising + sentering + compacting + aop + compacting2;

  // 3. Garment Costing
  // Fabric cost per piece = PC WT * Fabric Rate / kg
  const fabricCostPerPc = pcWtKg * fabricRatePerKg;

  const printing = Number(state.printing) || 0;
  const embroidery = Number(state.embroidery) || 0;
  const cmt = Number(state.cmt) || 0;
  const accessories = Number(state.accessories) || 0;
  const overhead = Number(state.overhead) || 0;
  const others = Number(state.others) || 0;

  const otherDirectCosts = printing + embroidery + cmt + accessories + overhead + others;
  const subtotal = fabricCostPerPc + otherDirectCosts;

  const garmentWastagePct = (Number(state.garmentWastage) || 0) / 100;
  const garmentWastageCost = subtotal * garmentWastagePct;
  const actualPrice = subtotal + garmentWastageCost;

  // 4. Forex & Profit Margins
  const usdRate = Number(state.currencyUsd) || 84;
  const eurRate = Number(state.currencyEur) || 92;

  const getTier = (marginPercent) => {
    const profit = actualPrice * (marginPercent / 100);
    const inr = actualPrice + profit;
    const usd = usdRate > 0 ? inr / usdRate : 0;
    const eur = eurRate > 0 ? inr / eurRate : 0;
    return { marginPercent, profit, inr, usd, eur };
  };

  const tier20 = getTier(20);
  const tier25 = getTier(25);
  const tier30 = getTier(30);
  const tierCustom = getTier(Number(state.customMargin) || 0);

  return {
    bodyArea,
    sleeveArea,
    bottomArea,
    mainFabGrams,
    ribGrams,
    totalFabBeforeWastage,
    fabricWastageGrams,
    totalGrams,
    pcWtKg,
    fabricRatePerKg,
    fabricCostPerPc,
    otherDirectCosts,
    subtotal,
    garmentWastageCost,
    actualPrice,
    tier20,
    tier25,
    tier30,
    tierCustom,
    usdRate,
    eurRate
  };
}

// Format numbers nicely
function fmtINR(val, decimals = 2) {
  if (isNaN(val)) return "₹0.00";
  return "₹" + Number(val).toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
}

function fmtCurrency(val, symbol = "$", decimals = 2) {
  if (isNaN(val)) return `${symbol}0.00`;
  return `${symbol}` + Number(val).toFixed(decimals);
}

function fmtNum(val, decimals = 2) {
  if (isNaN(val)) return "0";
  return Number(val).toFixed(decimals);
}

// Update the DOM with calculated values
function render() {
  const calc = calculate(appState);

  // Sync inputs with state
  const inputIds = [
    'styleName', 'color', 'currencyUsd', 'currencyEur',
    'gsm', 'chest', 'length', 'sleeveChest', 'sleeveLength', 'thighX2', 'bottomLength', 'rib', 'fabricWastage',
    'yarn', 'knitting', 'dyeing', 'raising', 'sentering', 'compacting', 'aop', 'compacting2',
    'printing', 'embroidery', 'cmt', 'accessories', 'overhead', 'others', 'garmentWastage',
    'customMargin'
  ];

  inputIds.forEach(id => {
    const el = document.getElementById(id);
    if (el && document.activeElement !== el) {
      el.value = appState[id];
    }
  });

  // Display custom margin slider value
  const customMarginLabel = document.getElementById('customMarginLabel');
  if (customMarginLabel) {
    customMarginLabel.innerText = `${appState.customMargin}%`;
  }

  // Intermediate Fabric Consumption badges
  setText('dispMainFab', `${fmtNum(calc.mainFabGrams, 1)} g`);
  setText('dispRib', `${fmtNum(calc.ribGrams, 1)} g`);
  setText('dispFabWastage', `${fmtNum(calc.fabricWastageGrams, 2)} g (${appState.fabricWastage}%)`);
  setText('dispTotalGrams', `${fmtNum(calc.totalGrams, 1)} g`);
  
  // Piece Weight updates (Top KPI card, Card summary box, and top-right badge)
  setText('kpiPcWtKg', `${fmtNum(calc.pcWtKg, 4)} kg`);
  setText('cardPcWtKg', `${fmtNum(calc.pcWtKg, 4)} kg`);
  setText('badgePcWt', `${fmtNum(calc.pcWtKg, 4)} kg (${fmtNum(calc.totalGrams, 1)} g)`);

  // Fabric Rate per kg (Top KPI and Card)
  setText('kpiFabricRateKg', fmtINR(calc.fabricRatePerKg, 2));
  setText('cardFabricRateKg', fmtINR(calc.fabricRatePerKg, 2));

  // Manufacturing cost elements (Top KPI and Card)
  setText('kpiFabricCostPc', fmtINR(calc.fabricCostPerPc, 2));
  setText('cardFabricCostPc', fmtINR(calc.fabricCostPerPc, 2));
  setText('dispOtherDirectCosts', fmtINR(calc.otherDirectCosts, 2));
  setText('dispDirectSubtotal', fmtINR(calc.subtotal, 2));
  setText('dispGarmentWastage', fmtINR(calc.garmentWastageCost, 2));
  setText('kpiActualPrice', fmtINR(calc.actualPrice, 2));
  setText('cardActualPrice', fmtINR(calc.actualPrice, 2));

  // Profit Tiers Display (Profit on Left, Quoted Cost on Right)
  // 20%
  setText('tier20_inr', fmtINR(calc.tier20.inr));
  setText('tier20_usd', fmtCurrency(calc.tier20.usd, '$'));
  setText('tier20_eur', fmtCurrency(calc.tier20.eur, '€'));
  setText('tier20_profit', `+${fmtINR(calc.tier20.profit)}`);

  // 25%
  setText('tier25_inr', fmtINR(calc.tier25.inr));
  setText('tier25_usd', fmtCurrency(calc.tier25.usd, '$'));
  setText('tier25_eur', fmtCurrency(calc.tier25.eur, '€'));
  setText('tier25_profit', `+${fmtINR(calc.tier25.profit)}`);

  // 30%
  setText('tier30_inr', fmtINR(calc.tier30.inr));
  setText('tier30_usd', fmtCurrency(calc.tier30.usd, '$'));
  setText('tier30_eur', fmtCurrency(calc.tier30.eur, '€'));
  setText('tier30_profit', `+${fmtINR(calc.tier30.profit)}`);

  // Custom margin hero card (Profit on Left, Quoted Cost on Right)
  setText('custom_margin_title', `${calc.tierCustom.marginPercent}% Margin Quote`);
  setText('custom_profit_amount', `+${fmtINR(calc.tierCustom.profit)}`);
  setText('custom_base_cost', fmtINR(calc.actualPrice));
  setText('custom_inr', fmtINR(calc.tierCustom.inr));
  setText('custom_usd', fmtCurrency(calc.tierCustom.usd, '$'));
  setText('custom_eur', fmtCurrency(calc.tierCustom.eur, '€'));

  // Cost Composition Bar
  renderCostBar(calc);

  // Save to LocalStorage
  try {
    localStorage.setItem('tirupur_pricing_state', JSON.stringify(appState));
  } catch (e) {
    // ignore
  }
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.innerText = text;
}

// Render visual percentage split bar
function renderCostBar(calc) {
  // Profit percentage directly reflects the selected interactive margin percentage
  const profitPct = Math.max(0, Math.min(100, Number(appState.customMargin) || 0));
  const costBasePct = Math.max(0, 100 - profitPct);
  const actualCost = Math.max(0.0001, calc.actualPrice);

  const fabPct = (calc.fabricCostPerPc / actualCost) * costBasePct;
  const otherPct = (calc.otherDirectCosts / actualCost) * costBasePct;
  const wastePct = (calc.garmentWastageCost / actualCost) * costBasePct;

  const setBar = (id, pct, label) => {
    const el = document.getElementById(id);
    if (el) {
      el.style.width = `${pct}%`;
      el.setAttribute('title', `${label}: ${pct.toFixed(1)}%`);
    }
  };

  setBar('barFabric', fabPct, 'Fabric Cost');
  setBar('barOther', otherPct, 'CMT & Trims');
  setBar('barWastage', wastePct, 'Garment Wastage');
  setBar('barProfit', profitPct, 'Profit Margin');

  setText('legendFabric', `Fabric: ${fabPct.toFixed(0)}%`);
  setText('legendOther', `CMT/Trims: ${otherPct.toFixed(0)}%`);
  setText('legendWastage', `Wastage: ${wastePct.toFixed(0)}%`);
  setText('legendProfit', `Profit: ${profitPct.toFixed(0)}%`);
}

// Setup input event listeners
function bindEvents() {
  const inputFields = [
    'styleName', 'color', 'currencyUsd', 'currencyEur',
    'gsm', 'chest', 'length', 'sleeveChest', 'sleeveLength', 'thighX2', 'bottomLength', 'rib', 'fabricWastage',
    'yarn', 'knitting', 'dyeing', 'raising', 'sentering', 'compacting', 'aop', 'compacting2',
    'printing', 'embroidery', 'cmt', 'accessories', 'overhead', 'others', 'garmentWastage',
    'customMargin'
  ];

  inputFields.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.addEventListener('input', (e) => {
      appState[id] = e.target.value;
      render();
    });
  });

  // Reset to default preset
  const btnReset = document.getElementById('btnReset');
  if (btnReset) btnReset.addEventListener('click', () => loadPreset('default'));

  // Copy Quotation
  const btnCopy = document.getElementById('btnCopyQuote');
  if (btnCopy) btnCopy.addEventListener('click', copyQuotation);

  // Print button
  const btnPrint = document.getElementById('btnPrintQuote');
  if (btnPrint) btnPrint.addEventListener('click', () => window.print());
}

function loadPreset(name) {
  if (name === 'default' || name === 'reset') {
    appState = { ...(PRESETS['default'] || DEFAULT_STATE) };
    render();
    showToast("Reset to default style");
  } else if (PRESETS[name]) {
    appState = { ...PRESETS[name] };
    render();
    const label = PRESETS[name].presetLabel || (name === 'polo' ? 'Polo Shirt' : name === 'shorts' ? 'Shorts' : name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
    showToast(`Loaded preset: ${label}`);
  }
}

// Generate formatted quotation text for WhatsApp or Email
function copyQuotation() {
  const calc = calculate(appState);
  const text = `
👕 *GARMENT COSTING & EXPORT QUOTATION*
━━━━━━━━━━━━━━━━━━━━━━━━━━
• *Style:* ${appState.styleName || 'Custom Style'}
• *Fabric:* ${appState.color || 'Solid'} | ${appState.gsm} GSM
• *Measurements:* Chest ${appState.chest} × Len ${appState.length} | Sleeve ${appState.sleeveChest} × ${appState.sleeveLength}
• *Piece Wt (PC WT):* ${(calc.pcWtKg).toFixed(4)} kg (${calc.totalGrams.toFixed(1)} g)

💰 *FABRIC & PRODUCTION BREAKDOWN:*
• Fabric Rate / kg: ${fmtINR(calc.fabricRatePerKg)}
• Fabric Cost / pc: ${fmtINR(calc.fabricCostPerPc)}
• CMT / Trims / Extras: ${fmtINR(calc.otherDirectCosts)}
• Factory Wastage (${appState.garmentWastage}%): ${fmtINR(calc.garmentWastageCost)}
• *Net Actual Cost:* ${fmtINR(calc.actualPrice)}

🎯 *PRICE QUOTATIONS (Exchange: $1 = ₹${calc.usdRate} | €1 = ₹${calc.eurRate})*
1️⃣ *At 20% Margin:* ${fmtINR(calc.tier20.inr)} | ${fmtCurrency(calc.tier20.usd, '$')} | ${fmtCurrency(calc.tier20.eur, '€')}
2️⃣ *At 25% Margin:* ${fmtINR(calc.tier25.inr)} | ${fmtCurrency(calc.tier25.usd, '$')} | ${fmtCurrency(calc.tier25.eur, '€')}
3️⃣ *At 30% Margin:* ${fmtINR(calc.tier30.inr)} | ${fmtCurrency(calc.tier30.usd, '$')} | ${fmtCurrency(calc.tier30.eur, '€')}
⭐ *At Selected Margin (${appState.customMargin}%):*
   ➤ *${fmtINR(calc.tierCustom.inr)} / pc* (${fmtCurrency(calc.tierCustom.usd, '$')} / ${fmtCurrency(calc.tierCustom.eur, '€')})
━━━━━━━━━━━━━━━━━━━━━━━━━━
Generated via Tirupur Garment Costing Engine
`.trim();

  navigator.clipboard.writeText(text).then(() => {
    showToast("✅ Quotation copied to clipboard! Ready to paste into WhatsApp or Email.");
  }).catch(() => {
    showToast("Unable to copy automatically. Please copy manually.");
  });
}

function showToast(message) {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-medium toast-enter';
    document.body.appendChild(toast);
  }
  toast.innerText = message;
  toast.style.display = 'flex';

  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    if (toast) toast.style.display = 'none';
  }, 3200);
}

// Initialize on DOM load in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', async () => {
    // Load presets from data.json
    await fetchPresetsData();

    // Try loading saved state
    try {
      const saved = localStorage.getItem('tirupur_pricing_state');
      if (saved) {
        appState = { ...DEFAULT_STATE, ...JSON.parse(saved) };
      } else {
        appState = { ...(PRESETS['default'] || DEFAULT_STATE) };
      }
    } catch (e) {
      appState = { ...(PRESETS['default'] || DEFAULT_STATE) };
    }

    bindEvents();
    render();

    // Initialize Lucide icons
    if (window.lucide) {
      window.lucide.createIcons();
    }
  });
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  try {
    const dataJson = require('./data.json');
    PRESETS = dataJson;
    DEFAULT_STATE = dataJson.default;
  } catch (e) {}
  module.exports = { calculate, DEFAULT_STATE, PRESETS, fetchPresetsData };
}



import { Finance } from './finance-logic.js';

/**
 * IPFS Calculators Suite UI Controller
 */

export function initCalculators() {
    const tabs = document.querySelectorAll('.calc-tab-btn');
    const panels = document.querySelectorAll('.calc-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            tab.classList.add('active');
            const target = document.getElementById(tab.dataset.target);
            if (target) target.classList.add('active');
        });
    });

    // ATTACH CALCULATION TRIGGER TO BUTTONS
    document.querySelectorAll('.btn-calculate').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.calc;
            triggerCalculation(type);
        });
    });

    // EXPOSE WIZARD FUNCTIONS TO GLOBAL SCOPE
    window.wizNext = wizNext;
    window.wizBack = wizBack;
    window.wizReset = wizReset;
    window.wizCalcStep2 = wizCalcStep2;
    window.wizCalcStep3 = wizCalcStep3;
    window.wizCalcStep4 = wizCalcStep4;
    window.sumAA = sumAA;
    window.calculateAssetAllocation = calculateAssetAllocation;
}

// --- ASSET ALLOCATION (NEW LOGIC) ---

function sumAA() {
    let totalAlloc = 0;
    let totalWRet = 0;
    let totalWDebt = 0;
    let totalWEquity = 0;

    for (let i = 1; i <= 5; i++) {
        const alloc = parseFloat(document.getElementById(`aa-alloc-${i}`).value) || 0;
        const ret = parseFloat(document.getElementById(`aa-ret-${i}`).value) || 0;
        const dPct = parseFloat(document.getElementById(`aa-debt-${i}`).value) || 0;
        const ePct = parseFloat(document.getElementById(`aa-equity-${i}`).value) || 0;

        const wRet = (alloc / 100) * ret;
        const wDebt = (alloc / 100) * dPct;
        const wEquity = (alloc / 100) * ePct;

        document.getElementById(`aa-w-${i}`).textContent = wRet.toFixed(2) + '%';
        document.getElementById(`aa-wd-${i}`).textContent = wDebt.toFixed(2);
        document.getElementById(`aa-we-${i}`).textContent = wEquity.toFixed(2);

        totalAlloc += alloc;
        totalWRet += wRet;
        totalWDebt += wDebt;
        totalWEquity += wEquity;
    }

    document.getElementById('aa-alloc-total').textContent = totalAlloc + '%';
    document.getElementById('aa-w-total').textContent = totalWRet.toFixed(2) + '%';
    document.getElementById('aa-w-total').dataset.val = totalWRet;
    document.getElementById('aa-wd-total').textContent = totalWDebt.toFixed(2);
    document.getElementById('aa-we-total').textContent = totalWEquity.toFixed(2);

    if (totalAlloc !== 100) {
        document.getElementById('aa-alloc-total').style.color = '#ff6b6b';
    } else {
        document.getElementById('aa-alloc-total').style.color = '#fff';
    }
}

function calculateAssetAllocation() {
    const principal = parseFloat(document.getElementById('aa-principal').value) || 0;
    const yrs = parseFloat(document.getElementById('aa-yrs').value) || 0;
    const pfReturn = parseFloat(document.getElementById('aa-w-total').dataset.val || 10.65) / 100;

    // Standard FD: 7.5% Pre-tax, 30% Tax rate
    const fdReturnPostTax = 0.075 * (1 - 0.30);

    const pfValue = principal * Math.pow(1 + pfReturn, yrs);
    const fdValue = principal * Math.pow(1 + fdReturnPostTax, yrs);
    const alpha = pfValue - fdValue;

    document.getElementById('aa-comparison').style.display = 'block';
    document.getElementById('res-pf-val').textContent = formatINR(pfValue);
    document.getElementById('res-fd-val').textContent = formatINR(fdValue);
    document.getElementById('res-pf-ret').textContent = (pfReturn * 100).toFixed(2) + '%';
    document.getElementById('res-alpha-val').textContent = formatINR(alpha);

    // Populate the Debt/Equity breakdown
    document.getElementById('res-total-debt').textContent = document.getElementById('aa-wd-total').textContent + '%';
    document.getElementById('res-total-equity').textContent = document.getElementById('aa-we-total').textContent + '%';

    gsap.from('#aa-comparison', { opacity: 0, y: 30, duration: 0.8 });
}

// --- STANDARD CALCULATION SUITE ---

function wizNext(currentStep) {
    if (currentStep === 1) {
        const name = document.getElementById('wiz-name').value || 'Friend';
        document.getElementById('sum-name').textContent = name;
        wizCalcStep2();
    }
    if (currentStep === 2) wizCalcStep3();
    if (currentStep === 3) {
        const corpus = parseFloat(document.getElementById('wiz-corpus').dataset.raw || 0);
        document.getElementById('wiz-corpus-input').value = Math.round(corpus);
        wizCalcStep4();
    }
    if (currentStep === 4) generateSummary();

    const currentCard = document.getElementById(`wiz-${currentStep}`);
    const nextCard = document.getElementById(`wiz-${currentStep + 1}`);

    if (nextCard) {
        currentCard.classList.remove('wiz-active');
        nextCard.classList.add('wiz-active');
        updateProgress(currentStep + 1);
    }
}

function wizBack(currentStep) {
    const currentCard = document.getElementById(`wiz-${currentStep}`);
    const prevCard = document.getElementById(`wiz-${currentStep - 1}`);

    if (prevCard) {
        currentCard.classList.remove('wiz-active');
        prevCard.classList.add('wiz-active');
        updateProgress(currentStep - 1);
    }
}

function wizReset() {
    document.querySelectorAll('.wiz-card').forEach(c => c.classList.remove('wiz-active'));
    document.getElementById('wiz-1').classList.add('wiz-active');
    updateProgress(1);
}

function updateProgress(step) {
    document.querySelectorAll('.wiz-step').forEach(s => {
        const sNum = parseInt(s.dataset.step);
        s.classList.remove('active', 'complete');
        if (sNum === step) s.classList.add('active');
        if (sNum < step) s.classList.add('complete');
    });
}

function wizCalcStep2() {
    const age = parseFloat(document.getElementById('wiz-age').value) || 0;
    const retAge = parseFloat(document.getElementById('wiz-retire-age').value) || 0;
    const inflation = parseFloat(document.getElementById('wiz-inflation').value) / 100 || 0;
    const exp = parseFloat(document.getElementById('wiz-exp').value) || 0;

    const yrs = Math.max(0, retAge - age);
    const months = yrs * 12;
    const monthlyInflation = inflation / 12;

    document.getElementById('wiz-yrs-to-retire').textContent = yrs;
    document.getElementById('wiz-yrs-left').value = yrs;

    // Use monthly compounding for parity with Excel RMF model
    const fvExp = exp * Math.pow(1 + monthlyInflation, months);

    document.getElementById('wiz-future-exp').textContent = formatINR(fvExp);
    document.getElementById('wiz-future-exp').dataset.raw = fvExp;

    // Update the future expense display in Step 3
    if (document.getElementById('wiz-future-exp-val')) {
        document.getElementById('wiz-future-exp-val').textContent = formatINR(fvExp);
        document.getElementById('wiz-future-exp-val').dataset.raw = fvExp;
    }
}

function wizCalcStep3() {
    const annuity = parseFloat(document.getElementById('wiz-future-exp-val').dataset.raw || 0);
    const lifePost = parseFloat(document.getElementById('wiz-post-years').value) || 0;
    const roiPost = parseFloat(document.getElementById('wiz-roi-post').value) / 100 || 0;

    // Use monthly PVA formula: PV = PMT * [(1 - (1+r)^-n) / r]
    const monthlyRate = roiPost / 12;
    const months = lifePost * 12;

    let corpus = 0;
    if (monthlyRate > 0) {
        corpus = annuity * ((1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate);
    } else {
        corpus = annuity * months;
    }

    document.getElementById('wiz-corpus').textContent = formatINR(corpus);
    document.getElementById('wiz-corpus').dataset.raw = corpus;
}

function wizCalcStep4() {
    const corpus = parseFloat(document.getElementById('wiz-corpus-input').value) || 0;
    const yrs = parseFloat(document.getElementById('wiz-yrs-left').value) || 0;
    const lump = parseFloat(document.getElementById('wiz-lumpsum').value) || 0;
    const roiPre = parseFloat(document.getElementById('wiz-roi-pre').value) / 100 || 0;

    const fvLump = Finance.FV(roiPre / 12, yrs * 12, 0, -lump);
    const balanceCorpus = Math.max(0, corpus - fvLump);
    const sip = -Finance.PMT(roiPre / 12, yrs * 12, 0, balanceCorpus);

    document.getElementById('wiz-sip').textContent = formatINR(sip);
    document.getElementById('wiz-sip').dataset.raw = sip;
}

function generateSummary() {
    const age = document.getElementById('wiz-age').value;
    const retAge = document.getElementById('wiz-retire-age').value;
    const yrsLeft = document.getElementById('wiz-yrs-left').value;
    const annuityRaw = document.getElementById('wiz-future-exp').dataset.raw || 0;
    const corpus = document.getElementById('wiz-corpus-input').value;
    const lump = document.getElementById('wiz-lumpsum').value;
    const sip = document.getElementById('wiz-sip').dataset.raw || 0;

    const annuity = parseFloat(annuityRaw);

    document.getElementById('sum-yrs').textContent = yrsLeft;
    document.getElementById('sum-lump').textContent = formatINR(parseFloat(lump));
    document.getElementById('sum-sip').textContent = formatINR(parseFloat(sip));
    document.getElementById('sum-corpus').textContent = formatINR(parseFloat(corpus));

    document.getElementById('sum-age').textContent = age + ' Years';
    document.getElementById('sum-ret-age').textContent = retAge + ' Years';
    document.getElementById('sum-annuity').textContent = formatINR(annuity);
    document.getElementById('sum-corpus2').textContent = formatINR(parseFloat(corpus));
    document.getElementById('sum-lumps').textContent = formatINR(parseFloat(lump));
    document.getElementById('sum-monthly').textContent = formatINR(parseFloat(sip));
}

// --- STANDARD CALCULATION SUTIE ---

function triggerCalculation(type) {
    const loader = document.getElementById(type + '-loader');
    const content = document.getElementById(type + '-content');

    if (!loader || !content) return;

    loader.style.display = 'flex';
    content.style.opacity = '0';
    content.style.transform = 'translateY(20px)';

    setTimeout(() => {
        try {
            if (type === 'ret') calculateRetirement();
            if (type === 'allocation') calculateAllocation();
            if (type === 'wealth') calculateGoal();
            if (type === 'budget') calculateBudget();
        } catch (err) {
            console.error('Calculation Error:', err);
        }

        loader.style.display = 'none';

        gsap.to(content, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    }, 2500);
}

// Keep the standard calculation functions for other tabs
export function calculateRetirement() { /* Old version if needed, but wizard replaces it */ }

export function calculateAllocation() {
    const getVal = (id) => parseFloat(document.getElementById(id)?.value || 0);
    const amount = getVal('aa-amount');
    const tenure = getVal('aa-tenure');
    const eqW = getVal('aa-equity-w') / 100;
    const debtW = getVal('aa-debt-w') / 100;
    const eqReturn = 0.15, debtReturn = 0.08, fdReturn = 0.07, taxRate = 0.30;
    const portfolioReturn = (eqW * eqReturn) + (debtW * debtReturn);
    const mfValue = amount * Math.pow(1 + portfolioReturn, tenure);
    const fdValueFinal = amount * Math.pow(1 + fdReturn * (1 - taxRate), tenure);
    const alpha = mfValue - fdValueFinal;
    updateResults('aa', { 'res-mf-val': mfValue, 'res-fd-val': fdValueFinal, 'res-alpha': alpha });
}

export function calculateGoal() {
    const getVal = (id) => parseFloat(document.getElementById(id)?.value || 0);
    const target = getVal('goal-target');
    const yrs = getVal('goal-yrs');
    const roi = getVal('goal-roi') / 100;
    if (yrs <= 0) return;
    const sipNeeded = -Finance.PMT(roi / 12, yrs * 12, 0, target);
    const lumpsumNeeded = -Finance.PV(roi, yrs, 0, target);
    updateResults('goal', { 'res-goal-sip': sipNeeded, 'res-goal-lump': lumpsumNeeded });
}

export function calculateBudget() {
    const getVal = (id) => parseFloat(document.getElementById(id)?.value || 0);
    const totalInc = getVal('inc-salary') + getVal('inc-pension') + getVal('inc-interest') + getVal('inc-nontax') + getVal('inc-taxrefund') + getVal('inc-gifts') + getVal('inc-inherit') + getVal('inc-other');
    const totalExp = getVal('exp-house') + getVal('exp-food') + getVal('exp-transport') + getVal('exp-health') + getVal('exp-misc') + getVal('exp-edu') + getVal('exp-depend') + getVal('exp-util') + getVal('exp-insurance') + getVal('exp-entertainment') + getVal('exp-holidays') + getVal('exp-emergency');
    const surplus = totalInc - totalExp;
    const ratio = totalInc > 0 ? (totalExp / totalInc) * 100 : 0;
    updateResults('bud', { 'res-surplus': surplus, 'res-exp-ratio': ratio });
}

function updateResults(prefix, data) {
    for (const [id, val] of Object.entries(data)) {
        const el = document.getElementById(id);
        if (el) {
            if (id.includes('ratio')) el.textContent = val.toFixed(1) + '%';
            else el.textContent = formatINR(val);
        }
    }
}

function formatINR(val) {
    if (val >= 10000000) return '₹' + (val / 10000000).toFixed(2) + ' Cr';
    if (val >= 100000) return '₹' + (val / 100000).toFixed(2) + ' Lakh';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency', currency: 'INR', maximumFractionDigits: 0
    }).format(val);
}

document.addEventListener('DOMContentLoaded', initCalculators);

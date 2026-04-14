import { Finance } from './finance-logic.js';

/**
 * IPFS Calculators Suite UI Controller
 */

// EXPOSE FUNCTIONS TO GLOBAL SCOPE
window.initCalculators = initCalculators;
window.sumAA = sumAA;
window.calculateAssetAllocation = calculateAssetAllocation;
window.wizNext = wizNext;
window.wizBack = wizBack;
window.wizReset = wizReset;
window.wizCalcStep2 = wizCalcStep2;
window.wizCalcStep3 = wizCalcStep3;
window.wizCalcStep4 = wizCalcStep4;
window.triggerCalculation = triggerCalculation;
window.calculateGoal = calculateGoal;
window.calculateRetirement = calculateRetirement;
window.calculateBudget = calculateBudget;
window.calculateAllocation = calculateAllocation;
window.generateSummary = generateSummary;
window.calculateWealthProjection = calculateWealthProjection;
window.formatINR = formatINR;

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

    // HANDLE URL PARAMETERS FOR DEEP LINKING
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab');
    if (initialTab) {
        const targetTab = Array.from(tabs).find(t => t.dataset.target === initialTab);
        if (targetTab) {
            targetTab.click();
        }
    }


    // ATTACH CALCULATION TRIGGER TO BUTTONS
    document.querySelectorAll('.btn-calculate').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.dataset.calc;
            triggerCalculation(type);
        });
    });

    // Initialize all calculations
    setTimeout(() => {
        if (typeof sumAA === 'function') sumAA();
    }, 500);
}

function sumAA() {
    try {
        let totalAlloc = 0;
        let totalWRet = 0;
        let totalWDebt = 0;
        let totalWEquity = 0;

        for (let i = 1; i <= 5; i++) {
            const allocEl = document.getElementById(`aa-alloc-${i}`);
            const retEl = document.getElementById(`aa-ret-${i}`);
            const dPctEl = document.getElementById(`aa-debt-${i}`);
            const ePctEl = document.getElementById(`aa-equity-${i}`);

            if (!allocEl || !retEl || !dPctEl || !ePctEl) continue;

            const alloc = parseFloat(allocEl.value) || 0;
            const ret = parseFloat(retEl.value) || 0;
            const dPct = parseFloat(dPctEl.value) || 0;
            const ePct = parseFloat(ePctEl.value) || 0;

            const wRet = (alloc / 100) * ret;
            const wDebt = (alloc / 100) * dPct;
            const wEquity = (alloc / 100) * ePct;

            const wRetEl = document.getElementById(`aa-w-${i}`);
            const wDebtEl = document.getElementById(`aa-wd-${i}`);
            const wEquityEl = document.getElementById(`aa-we-${i}`);

            if (wRetEl) wRetEl.textContent = wRet.toFixed(2) + '%';
            if (wDebtEl) wDebtEl.textContent = wDebt.toFixed(2);
            if (wEquityEl) wEquityEl.textContent = wEquity.toFixed(2);

            totalAlloc += alloc;
            totalWRet += wRet;
            totalWDebt += wDebt;
            totalWEquity += wEquity;
        }

        const allocTotalEl = document.getElementById('aa-alloc-total');
        const wRetTotalEl = document.getElementById('aa-w-total');
        const wdTotalEl = document.getElementById('aa-wd-total');
        const weTotalEl = document.getElementById('aa-we-total');

        if (allocTotalEl) {
            allocTotalEl.textContent = totalAlloc + '%';
            allocTotalEl.style.color = totalAlloc !== 100 ? '#ff6b6b' : '#fff';
        }
        if (wRetTotalEl) {
            wRetTotalEl.textContent = totalWRet.toFixed(2) + '%';
            wRetTotalEl.dataset.val = totalWRet;
        }
        if (wdTotalEl) wdTotalEl.textContent = totalWDebt.toFixed(2);
        if (weTotalEl) weTotalEl.textContent = totalWEquity.toFixed(2);

        // Update relocated summary metrics
        const resTarget = document.getElementById('res-aa-target');
        const resDebt = document.getElementById('res-aa-debt');
        const resEquity = document.getElementById('res-aa-equity');
        const resTotal = document.getElementById('res-aa-total');
        const resName = document.getElementById('res-aa-name');
        const inputName = document.getElementById('aa-name');

        if (resTarget) resTarget.textContent = totalWRet.toFixed(2) + '%';
        if (resTotal) {
            resTotal.textContent = totalAlloc + '%';
            resTotal.style.color = totalAlloc !== 100 ? '#ff6b6b' : 'inherit';
        }

        if (totalAlloc > 0) {
            if (resDebt) resDebt.textContent = totalWDebt.toFixed(2) + '%';
            if (resEquity) resEquity.textContent = totalWEquity.toFixed(2) + '%';
        } else {
            if (resDebt) resDebt.textContent = '0%';
            if (resEquity) resEquity.textContent = '0%';
        }

        if (resName && inputName) resName.textContent = inputName.value || 'Client';

    } catch (e) {
        console.error('sumAA Error:', e);
    }
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
    const inflation = parseFloat(document.getElementById('wiz-inflation').value) / 100 || 0;

    // Use Real Rate of Return (r = (1+i)/(1+infl) - 1) to account for increasing expenses during retirement
    const realRateAnnual = ((1 + roiPost) / (1 + inflation)) - 1;
    const monthlyRate = realRateAnnual / 12;
    const months = lifePost * 12;

    let corpus = 0;
    if (monthlyRate !== 0) {
        // PV of Annuity Due (Payments at start of month): PV = PMT * [(1 - (1+r)^-n) / r] * (1+r)
        corpus = annuity * ((1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate) * (1 + monthlyRate);
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

    // MF Calculation (Annual Compounding)
    const mfValuePreTax = amount * Math.pow(1 + portfolioReturn, tenure);
    const mfProfit = mfValuePreTax - amount;
    // MF Tax: 12.5% on gains > 1.25L
    const mfTax = Math.max(0, (mfProfit - 125000) * 0.125);
    const mfValue = mfValuePreTax - mfTax;

    // FD Calculation (Annual Compounding, 30% Tax)
    const fdValuePreTax = amount * Math.pow(1 + fdReturn, tenure);
    const fdProfit = fdValuePreTax - amount;
    const fdTax = fdProfit * 0.30;
    const fdValueFinal = fdValuePreTax - fdTax;

    const alpha = mfValue - fdValueFinal;
    updateResults('aa', { 'res-mf-val': mfValue, 'res-fd-val': fdValueFinal, 'res-alpha': alpha });
}

export function calculateWealthProjection() {
    const getVal = (id) => parseFloat(document.getElementById(id)?.value || 0);
    const getText = (id) => document.getElementById(id)?.value || '';

    // General Info
    const age = getVal('wealth-age');
    const retAge = getVal('wealth-ret-age');
    const expPa = getVal('wealth-exp-pa');
    const inflation = getVal('wealth-inflation') / 100;
    const lifeExp = getVal('wealth-life');
    const roiPre = getVal('wealth-roi-pre') / 100;
    const roiPost = getVal('wealth-roi-post') / 100;

    // Future Value Growth Table (Lumpsum)
    const refTenure = getVal('goal1-target') || 10;
    const principal = getVal('goal1-cost') || 1000000;

    const fv = principal * Math.pow(1 + roiPre, refTenure);

    let htmlCompounding = `
        <tr style="border-bottom: 1px solid var(--border);">
            <td style="padding:10px; font-weight:500;">Annual Growth (Institutional Base)</td>
            <td style="text-align:right; padding:10px;">${(roiPre * 100).toFixed(2)}%</td>
            <td style="text-align:right; padding:10px; font-weight:700; color:var(--green-deep);">${formatINR(fv)}</td>
        </tr>
    `;
    const compBody = document.getElementById('wealth-compounding-body');
    if (compBody) compBody.innerHTML = htmlCompounding;

    // Retirement Logic
    const yrsToRet = Math.max(0, retAge - age);
    const yrsInRet = Math.max(1, lifeExp - retAge);

    // 1. Future Expense p.a at Retirement
    const fvExpPa = expPa * Math.pow(1 + inflation, yrsToRet);

    // 2. Corpus Required at Retirement (Inflation adjusted Annuity Due - Payments at START of month)
    const realRate = (1 + roiPost) / (1 + inflation) - 1;
    let corpusRequiredRet = 0;
    if (realRate !== 0) {
        corpusRequiredRet = fvExpPa * ((1 - Math.pow(1 + realRate, -yrsInRet)) / realRate) * (1 + realRate);
    } else {
        corpusRequiredRet = fvExpPa * yrsInRet;
    }

    // 3. Monthly SIP to reach Corpus
    const sipRet = (yrsToRet > 0)
        ? -Finance.PMT(roiPre / 12, yrsToRet * 12, 0, corpusRequiredRet)
        : 0;

    const retCorpusEl = document.getElementById('res-ret-corpus');
    const retSipEl = document.getElementById('res-ret-sip');
    if (retCorpusEl) retCorpusEl.textContent = formatINR(corpusRequiredRet);
    if (retSipEl) retSipEl.textContent = formatINR(sipRet);

    // Goal Logic
    const goals = [
        { id: 1, prefix: 'goal1', resPrefix: 'res-goal1' },
        { id: 2, prefix: 'goal2', resPrefix: 'res-goal2' }
    ];

    goals.forEach(goal => {
        const name = getText(goal.prefix + '-name');
        const tgtAge = getVal(goal.prefix + '-age');
        const presentCost = getVal(goal.prefix + '-cost');
        const yrsLeft = getVal(goal.prefix + '-target');

        if (yrsLeft > 0) {
            // Future Cost = Present Cost * (1 + inflation)^yrsLeft
            const corpusRequired = presentCost * Math.pow(1 + inflation, yrsLeft);
            // SIP = PMT(r/12, n*12, 0, -FV)
            const sip = -Finance.PMT(roiPre / 12, yrsLeft * 12, 0, corpusRequired);

            document.getElementById(goal.resPrefix + '-card').querySelector('.card-head').textContent = `${name || 'Goal ' + goal.id}: Results`;
            document.getElementById(goal.resPrefix + '-corpus').textContent = formatINR(corpusRequired);
            document.getElementById(goal.resPrefix + '-sip').textContent = formatINR(sip);
        }
    });

    // Animate results
    gsap.from('.res-card-elite', {
        opacity: 0,
        y: 20,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out'
    });
}

export function calculateGoal() {
    // Legacy goal calculator now redirects to new projection or kept for single goal tab
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

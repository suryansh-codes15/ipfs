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
}

function triggerCalculation(type) {
    const loader = document.getElementById(type + '-loader');
    const content = document.getElementById(type + '-content');

    if (!loader || !content) return;

    // 1. Show Loader, Hide Content
    loader.style.display = 'flex';
    content.style.opacity = '0';
    content.style.transform = 'translateY(20px)';

    // 2. Wait 2.5 seconds (Cinematic delay)
    setTimeout(() => {
        // 3. Perform Logic
        try {
            if (type === 'ret') calculateRetirement();
            if (type === 'allocation') calculateAllocation();
            if (type === 'wealth') calculateGoal();
            if (type === 'budget') calculateBudget();
        } catch (err) {
            console.error('Calculation Error:', err);
        }

        // 4. Hide Loader
        loader.style.display = 'none';

        // 5. Animate In Result
        gsap.to(content, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    }, 2500);
}

/** 1. RETIREMENT ENGINEER **/
export function calculateRetirement() {
    const getVal = (id) => parseFloat(document.getElementById(id)?.value || 0);

    const age = getVal('ret-age');
    const retireAge = getVal('ret-retire-age');
    const exp = getVal('ret-exp');
    const inflation = getVal('ret-inflation') / 100;
    const roiPre = getVal('ret-roi-pre') / 100 || 0.12;
    const roiPost = getVal('ret-roi-post') / 100 || 0.08;
    const life = getVal('ret-life');
    const lumpsum = getVal('ret-lumpsum');

    const yrsToRetire = retireAge - age;
    const yrsPostRetire = life - retireAge;

    if (yrsToRetire < 0 || yrsPostRetire < 0) return;

    const futureExp = exp * Math.pow(1 + inflation, yrsToRetire);
    const effectiveRatePost = (1 + roiPost) / (1 + inflation) - 1;
    const corpus = -Finance.PV(effectiveRatePost, yrsPostRetire, futureExp * 12, 0, 1);
    const fvLumpsum = Finance.FV(roiPre / 12, yrsToRetire * 12, 0, -lumpsum);
    const remainingCorpus = corpus - fvLumpsum;
    const monthlySIP = -Finance.PMT(roiPre / 12, yrsToRetire * 12, 0, remainingCorpus);

    updateResults('ret', {
        'res-future-exp': futureExp,
        'res-corpus': corpus,
        'res-sip': monthlySIP
    });
}

/** 2. ASSET ALLOCATION **/
export function calculateAllocation() {
    const getVal = (id) => parseFloat(document.getElementById(id)?.value || 0);

    const amount = getVal('aa-amount');
    const tenure = getVal('aa-tenure');
    const eqW = getVal('aa-equity-w') / 100;
    const debtW = getVal('aa-debt-w') / 100;

    const eqReturn = 0.15;
    const debtReturn = 0.08;
    const fdReturn = 0.07;
    const taxRate = 0.30;

    const portfolioReturn = (eqW * eqReturn) + (debtW * debtReturn);
    const mfValue = amount * Math.pow(1 + portfolioReturn, tenure);
    const fdValueFinal = amount * Math.pow(1 + fdReturn * (1 - taxRate), tenure);
    const alpha = mfValue - fdValueFinal;

    updateResults('aa', {
        'res-mf-val': mfValue,
        'res-fd-val': fdValueFinal,
        'res-alpha': alpha
    });
}

/** 3. WEALTH GOAL **/
export function calculateGoal() {
    const getVal = (id) => parseFloat(document.getElementById(id)?.value || 0);

    const target = getVal('goal-target');
    const yrs = getVal('goal-yrs');
    const roi = getVal('goal-roi') / 100;

    if (yrs <= 0) return;

    const sipNeeded = -Finance.PMT(roi / 12, yrs * 12, 0, target);
    const lumpsumNeeded = -Finance.PV(roi, yrs, 0, target);

    updateResults('goal', {
        'res-goal-sip': sipNeeded,
        'res-goal-lump': lumpsumNeeded
    });
}

/** 4. BUDGET TRACKER **/
export function calculateBudget() {
    const getVal = (id) => parseFloat(document.getElementById(id)?.value || 0);

    // All income fields from Excel
    const totalInc = getVal('inc-salary') + getVal('inc-pension') + getVal('inc-interest')
        + getVal('inc-nontax') + getVal('inc-taxrefund') + getVal('inc-gifts')
        + getVal('inc-inherit') + getVal('inc-other');

    // All expense fields from Excel
    const totalExp = getVal('exp-house') + getVal('exp-food') + getVal('exp-transport')
        + getVal('exp-health') + getVal('exp-misc') + getVal('exp-edu')
        + getVal('exp-depend') + getVal('exp-util') + getVal('exp-insurance')
        + getVal('exp-entertainment') + getVal('exp-holidays') + getVal('exp-emergency');

    const surplus = totalInc - totalExp;
    const ratio = totalInc > 0 ? (totalExp / totalInc) * 100 : 0;

    updateResults('bud', {
        'res-surplus': surplus,
        'res-exp-ratio': ratio
    });
}

function updateResults(prefix, data) {
    for (const [id, val] of Object.entries(data)) {
        const el = document.getElementById(id);
        if (el) {
            if (id.includes('ratio')) {
                el.textContent = val.toFixed(1) + '%';
            } else {
                el.textContent = formatINR(val);
            }
        }
    }
}

function formatINR(val) {
    if (val >= 10000000) return '₹' + (val / 10000000).toFixed(2) + ' Cr';
    if (val >= 100000) return '₹' + (val / 100000).toFixed(2) + ' Lakh';
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(val);
}

document.addEventListener('DOMContentLoaded', initCalculators);

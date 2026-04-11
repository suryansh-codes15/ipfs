/**
 * Standards-compliant financial functions matching Excel/Google Sheets behavior.
 */

export const Finance = {
    /**
     * Calculates the Future Value of an investment.
     * @param {number} rate - Interest rate per period.
     * @param {number} nper - Total number of payment periods.
     * @param {number} pmt - Payment made each period.
     * @param {number} pv - Present value / lumpsum.
     * @param {number} type - 0 (end of period) or 1 (beginning of period).
     */
    FV: (rate, nper, pmt, pv, type = 0) => {
        if (rate === 0) return -(pv + pmt * nper);
        const pow = Math.pow(1 + rate, nper);
        let fv;
        if (type === 1) {
            fv = (pmt * (1 + rate) * (1 - pow) / rate) - (pv * pow);
        } else {
            fv = (pmt * (1 - pow) / rate) - (pv * pow);
        }
        return fv;
    },

    /**
     * Calculates the Present Value of an investment.
     * @param {number} rate - Interest rate per period.
     * @param {number} nper - Total number of periods.
     * @param {number} pmt - Payment per period.
     * @param {number} fv - Future value.
     * @param {number} type - 0 or 1.
     */
    PV: (rate, nper, pmt, fv, type = 0) => {
        if (rate === 0) return -(fv + pmt * nper);
        const pow = Math.pow(1 + rate, nper);
        let pv;
        if (type === 1) {
            pv = (pmt * (1 + rate) * (1 - pow) / rate - fv) / pow;
        } else {
            pv = (pmt * (1 - pow) / rate - fv) / pow;
        }
        return pv;
    },

    /**
     * Calculates the Payment (PMT) for an investment/loan.
     * @param {number} rate - Interest rate per period.
     * @param {number} nper - Total number of periods.
     * @param {number} pv - Present value.
     * @param {number} fv - Future value.
     * @param {number} type - 0 or 1.
     */
    PMT: (rate, nper, pv, fv = 0, type = 0) => {
        if (rate === 0) return -(pv + fv) / nper;
        const pow = Math.pow(1 + rate, nper);
        let pmt;
        if (type === 1) {
            pmt = (rate * (pv * pow + fv)) / ((1 + rate) * (1 - pow));
        } else {
            pmt = (rate * (pv * pow + fv)) / (1 - pow);
        }
        return pmt;
    },

    /**
     * Calculates the effective annual interest rate.
     * @param {number} nominal_rate - The nominal interest rate.
     * @param {number} npery - Number of compounding periods per year.
     */
    EFFECT: (nominal_rate, npery) => {
        return Math.pow(1 + nominal_rate / npery, npery) - 1;
    }
};

/**
 * High-fidelity retirement corpus calculator matching Reliance MF (RMF) Excel model.
 */
export function calculateRetirementCorpus(monthlyExp, inflation, retAge, currentAge, lifeExp, postRetRet) {
    const yearsToRet = Math.max(0, retAge - currentAge);
    const monthsToRet = yearsToRet * 12;
    const monthlyInflation = (inflation / 100) / 12;

    // 1. Future Value of Expense at Retirement (Monthly Compounding Inflation)
    // Excel: FV(Rate/12, Yrs*12, 0, -MonthlyExp, 0)
    const expAtRet = monthlyExp * Math.pow(1 + monthlyInflation, monthsToRet);

    // 2. Retirement Corpus Required (Annuity PV)
    // Reliance MF Uses: PV(ROI_POST/12, LIFE_EXP*12, -EXP_AT_RET, 0, 0)
    const monthlyRatePost = (postRetRet / 100) / 12;
    const totalMonthsPost = lifeExp * 12;

    let corpus = 0;
    if (monthlyRatePost > 0) {
        corpus = expAtRet * ((1 - Math.pow(1 + monthlyRatePost, -totalMonthsPost)) / monthlyRatePost);
    } else {
        corpus = expAtRet * totalMonthsPost;
    }

    return {
        yearsToRet,
        expAtRet,
        corpus
    };
}

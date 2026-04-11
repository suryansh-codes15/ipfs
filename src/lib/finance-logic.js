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

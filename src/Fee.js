// Copyright (C) 2018, Zpalmtree
//
// Please see the included LICENSE file for more information.

import Config from './Config';

export function removeFee(amount) {
    const amountAtomic = toAtomic(amount);

    let tmp = amountAtomic - Config.minimumFee;

    /* Ensure it's an integer amount */
    const devFeeAtomic = Math.floor(tmp - tmp / (1 + (Config.feePercentage / 100)));

    const totalFeeAtomic = Config.minimumFee + devFeeAtomic;

    const remainingAtomic = amountAtomic - totalFeeAtomic;

    const result = {
        /* The network fee */
        networkFee: fromAtomic(Config.minimumFee),
        networkFeeAtomic: Config.minimumFee,

        /* The dev fee */
        devFee: fromAtomic(devFeeAtomic),
        devFeeAtomic: devFeeAtomic,

        /* The sum of the dev and network fee */
        totalFee: fromAtomic(totalFeeAtomic),
        totalFeeAtomic: totalFeeAtomic,
        
        /* The amount to be sent, minus fees */
        remaining: fromAtomic(remainingAtomic),
        remainingAtomic: remainingAtomic,

        /* The original amount */
        original: thousandSeparate(amount),
        originalAtomic: amountAtomic,
    }

    return result;
}

export function addFee(amount) {
    const amountAtomic = toAtomic(amount);

    /* Add the min fee */
    let tmp = amountAtomic + Config.minimumFee;

    /* Get the amount with the dev fee added */
    const devFeeAdded = Math.floor(tmp + ((tmp * Config.feePercentage) / 100));

    const nonAtomic = devFeeAdded / (10 ** Config.decimalPlaces);

    /* Then use our previous function to do the rest of the work */
    return removeFee(nonAtomic);
}

/**
 * Converts a human amount to an atomic amount, for use internally
 */
export function toAtomic(amount) {
    return amount * (10 ** Config.decimalPlaces);
}

/** 
 * Converts an atomic amount to a human amount, for display use
 */
export function fromAtomic(amount) {
    const nonAtomic = amount / (10 ** Config.decimalPlaces);

    return thousandSeparate(nonAtomic);
}

function thousandSeparate(amount) {
    /* Makes our numbers thousand separated. https://stackoverflow.com/a/2901298/8737306 */
    return amount.toFixed(Config.decimalPlaces).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

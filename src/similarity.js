'use strict';

let {
    getRules
} = require('./rule');

let getSimilarityDegree = (nodeInfo, source) => {
    let rets = getSimilarityMatrix(nodeInfo, source);

    let sum = 0,
        score = 0;
    for (let i = 0; i < rets.length; i++) {
        let ret = rets[i];
        sum += ret[0];
        score += ret[1] * ret[0];
    }

    return score / sum;
};

let getSimilarityMatrix = (nodeInfo, source) => {
    let rules = getRules(source);
    let rets = [];
    for (let i = 0; i < rules.length; i++) {
        rets.push(runRule(rules[i], nodeInfo, source));
    }

    return rets;
};

let runRule = (rule, nodeInfo, source) => {
    let [ruleName, coefficient, scaleRule] = rule;

    let scale = scaleRule(nodeInfo, source, getSimilarityDegree);

    if (isNaN(scale) || isNaN(coefficient)) {
        throw new Error(`computation error happened, got a nan for ${ruleName}`);
    }

    return [coefficient, scale, ruleName];
};

let getSupremum = (source, rules) => {
    let ret = 0;
    for (let i = 0; i < rules.length; i++) {
        let [ruleName, coefficient] = rules[i];

        if (isNaN(coefficient)) {
            throw new Error(`computation error happened, got a nan for ${ruleName}`);
        }

        ret += coefficient;
    }
    return ret;
};

module.exports = {
    getSupremum,
    getSimilarityDegree,
    getSimilarityMatrix,
    runRule
};

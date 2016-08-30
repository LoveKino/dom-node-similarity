'use strict';

let {
    runRule,
    getSupremum,
    getSimilarityDegree,
    getSimilarityMatrix
} = require('./similarity');

let {
    getRules
} = require('./rule');

let FilterByRules = require('./filterByRules');

let {
    map, reduce, filter
} = require('bolzano');

// TODO optimize
// 1. cache
// 2. find a good by common values

let getSample = (infoBox, sampleInfo, source) => {
    sampleInfo.degree = getSimilarityDegree(sampleInfo.nodeInfo, source);

    return sampleInfo;
};

let filterBySample = (infoBox, sample) => {
    return filter(infoBox, (info) => {
        return info.maxSuperBounce > sample.degree;
    });
};

let findMostSimilarNode = (nodeInfos, source) => {
    if (!nodeInfos.length) return null;

    let totalRules = getRules(source);

    let fastRules = filter(totalRules, (rule) => rule[3] !== 'slow');

    let slowRules = filter(totalRules, (rule) => rule[3] === 'slow');

    let infoBox = map(nodeInfos, (item, index) => {
        return {
            nodeInfo: item,
            index
        };
    });

    let filterByRules = FilterByRules({
        source,
        totalRules,
        runRule,
        getSupremum
    });

    // filter by fast rules
    infoBox = filterByRules(infoBox, fastRules, slowRules);

    let bestGuess = getBestGuess(infoBox);

    // filter by sample
    infoBox = filterBySample(infoBox, getSample(infoBox, bestGuess, source));

    // apply slow rules
    // bad case a lot slow nodes
    infoBox = reduce(slowRules, (prev, rule, index) => {
        return filterByRules(prev, [rule], slowRules.slice(index + 1));
    }, infoBox);

    let info = infoBox[0];

    let supremum = getSupremum(source, totalRules);

    return {
        degree: (supremum - info.lost) / supremum,
        index: info.index
    };
};

let getBestGuess = (infoBox) => {
    return reduce(infoBox, (prev, cur) => {
        if (!prev) return cur;
        if (prev.lost < cur.lost) return prev;
        return cur;
    }, null);
};

module.exports = {
    getSimilarityDegree,
    getSimilarityMatrix,
    findMostSimilarNode
};

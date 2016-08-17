'use strict';

let {
    rules,
    runRule,
    getSupremum,
    getSimilarityDegree,
    getSimilarityMatrix
} = require('./similarity');

let {
    map, reduce, filter, forEach
} = require('bolzano');

// TODO [opt] find a good one
// TODO cache

/*
let getRandomSample = (infoBox, source) => {
    // sample
    let sampleIndex = parseInt(Math.random() * infoBox.length);
    let sampleInfo = infoBox[sampleIndex];
    sampleInfo.degree = getSimilarityDegree(sampleInfo.nodeInfo, source);

    return sampleInfo;
};
*/

let filterByRules = (infoBox, source, totalRules, rules, restRules) => {
    infoBox = map(infoBox, (info) => {
        let {
            nodeInfo
        } = info;

        // calculate lost
        info.lost = info.lost || 0;
        info.lost += reduce(rules, (ret, rule) => {
            let [coefficient, scale] = runRule(rule, nodeInfo, source);
            ret += (1 - scale) * coefficient;
            return ret;
        }, 0);

        return info;
    });

    infoBox = bounceInfoBox(infoBox, source, rules, restRules);

    // filter
    return filterByBounce(infoBox);
};

let filterByBounce = (infoBox) => {
    // filter
    return reduce(infoBox, (prev, info) => {
        let ret = [];
        if (!prev.length) {
            ret.push(info);
        } else {
            forEach(prev, (item, index) => {
                if (isAbsLow(info, item)) {
                    ret = ret.concat(prev.slice(index));
                    return true; // break
                } else if (!isAbsLow(item, info)) {
                    ret.push(item);
                }
                if (index === prev.length - 1) {
                    ret.push(info);
                }
            });
        }

        return ret;
    }, []);
};

let bounceInfoBox = (infoBox, source, totalRules, restRules) => map(infoBox, (info) => {
    let {
        nodeInfo, lost
    } = info;

    let supremum = getSupremum(nodeInfo, source, totalRules);
    let rest = getSupremum(nodeInfo, source, restRules);
    let maxSuperBounce = (supremum - lost + rest) / supremum;

    let minSuperBounce = (supremum - lost - rest) / supremum;

    info.maxSuperBounce = maxSuperBounce;
    info.minSuperBounce = minSuperBounce;
    return info;
});

let isAbsLow = (info1, info2) => info1.maxSuperBounce < info2.minSuperBounce;

let fastRules = filter(rules, (rule) => rule.speed !== 'slow');

let slowRules = filter(rules, (rule) => rule.speed === 'slow');

//let filterBySample = (infoBox, sample) => filter(infoBox, (info) => info.maxSuperBounce > sample.degree);

let findMostSimilarNode = (nodeInfos, source) => {
    if (!nodeInfos.length) return null;

    let infoBox = map(nodeInfos, (item, index) => {
        return {
            nodeInfo: item,
            index
        };
    });

    // filter by fast rules
    infoBox = filterByRules(infoBox, source, rules, fastRules, slowRules);

    // apply slow rules
    infoBox = reduce(slowRules, (prev, rule, index) => {
        return filterByRules(prev, source, rules, [rule], slowRules.slice(index + 1));
    }, infoBox);

    let info = infoBox[0];

    let supremum = getSupremum(info.nodeInfo, source, rules);

    return {
        degree: (supremum - info.lost) / supremum,
        index: info.index
    };
};

module.exports = {
    getSimilarityDegree,
    getSimilarityMatrix,
    findMostSimilarNode
};

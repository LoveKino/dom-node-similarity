'use strict';

let {
    rules,
    runRule,
    getSupremum,
    getSimilarityDegree,
    getSimilarityMatrix
} = require('./similarity');

let findMostSimilarNode = (nodeInfos, source) => {
    if (!nodeInfos.length) return null;

    // sample
    let sampleIndex = parseInt(Math.random() * nodeInfos.length);
    let sampleNode = nodeInfos[sampleIndex];
    let sample = getSimilarityDegree(nodeInfos[sampleIndex], source);
    let index = sampleIndex;

    // calculate one node
    for (let i = 0; i < nodeInfos.length; i++) {
        if (i === sampleIndex) {
            continue;
        }
        let nodeInfo = nodeInfos[i];

        let supremum = getSupremum(nodeInfo, source);
        let lostRate = 0;
        for (let j = 0; j < rules.length; j++) {
            let rule = rules[j];
            let [coefficient, scale] = runRule(rule, nodeInfo, source);
            lostRate += (1 - scale) * coefficient / supremum;
            if (lostRate > 1 - sample) {
                break;
            }
        }
        if (lostRate < 1 - sample) {
            sample = 1 - lostRate;
            sampleNode = nodeInfo;
            index = i;
        }
    }

    return {
        nodeInfo: sampleNode,
        degree: sample,
        index
    };
};

module.exports = {
    getSimilarityDegree,
    getSimilarityMatrix,
    findMostSimilarNode
};

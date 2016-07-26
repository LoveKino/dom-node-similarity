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
    let sampleNode = nodeInfos[0];
    let sample = getSimilarityDegree(nodeInfos[0], source);
    let index = 0;

    // calculate one node
    for (let i = 1; i < nodeInfos.length; i++) {
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

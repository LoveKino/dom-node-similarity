'use strict';

/**
 * split text content match into three levels
 *
 * 1. cur node
 *
 * 2. parent node
 *
 * 3. grand node
 *
 * 4. bad case TODO
 */

let distance = require('levsimilarity');

module.exports = (nodeInfo, source) => {
    let nText = nodeInfo.node.textContent || '';
    let sText = source.node.textContent || '';

    let degree = contentMatchDegree(nText, sText);
    return degree;
};

let contentMatchDegree = (textContent, sourceText) => {
    if (!sourceText.length) {
        if (!textContent.length) {
            return 1;
        } else {
            return 0;
        }
    }

    // quick response
    let quickRate = quickSimilarRate(textContent, sourceText);
    if (quickRate < 0.3) {
        return quickRate;
    }

    // avoid big calculation
    if (textContent.length > 2000) {
        return quickRate;
    }

    let dis = distance(textContent, sourceText);

    return 1 - dis / Math.max(textContent.length, sourceText.length);
};

let quickSimilarRate = (a, b) => {
    return 1 - Math.abs(a.length - b.length) / Math.max(a.length, b.length);
};

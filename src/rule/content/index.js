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
let sift4 = require('./sift4');

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

    let dis = null;

    if (textContent.length * sourceText.length > 100 * 100) {
        dis = sift4(textContent, sourceText);
    } else {
        dis = distance(textContent, sourceText);
    }

    return 1 - dis / Math.max(textContent.length, sourceText.length);
};

'use strict';

let distance = require('../util/distance');

module.exports = (nodeInfo, source, runRule) => {
    let nPath = nodeInfo.path || [];
    let sPath = source.path || [];
    nPath = nPath.slice(0);
    sPath = sPath.slice(0);

    if (!nPath.length && !sPath.length) {
        return [0, 0, 'path'];
    }

    let dis = distance(nPath, sPath, (item1, item2) => {
        let similarity = runRule({
            node: item1
        }, {
            node: item2
        });

        // define the cost of converting item1 to item2 as the difference of item1 and item2
        return 1 - similarity;
    });

    let sum = Math.max(nPath.length, sPath.length);
    let sim = sum - dis;

    return [10, sim / sum, 'path'];
};

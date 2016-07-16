'use strict';

let {
    union, interset, mapToList
} = require('./util');

let contentRule = require('./rule/content');

let pathRule = require('./rule/path');

/**
 * rule: (nodeInfo, source, runRule) => [coefficient, scale]
 */
let rules = [];

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
    let rets = [];
    for (let i = 0; i < rules.length; i++) {
        let rule = rules[i];
        let ret = rule(nodeInfo, source, getSimilarityDegree);
        if (isNaN(ret[1])) {
            throw new Error(`computation error happened, got a nan for ${ret[2]}`);
        }
        rets.push(ret);
    }

    return rets;
};

// content
rules.push(contentRule);

// path
rules.push(pathRule);

// tagName
rules.push((nodeInfo, source) => {
    return [10, boolToNum(nodeInfo.node.tagName === source.node.tagName), 'tagName'];
});

// order of node
rules.push((nodeInfo, source) => {
    return [5, boolToNum(nodeInfo.node.index === source.node.index), 'order of node'];
});

// id
rules.push((nodeInfo, source) => {
    let nId = nodeInfo.node.attributes['id'];
    let sId = source.node.attributes['id'];
    if (!sId && !sId) {
        return [0, 0, 'id']; // ignore
    }
    return [8, boolToNum(nId === sId), 'id'];
});

// class
rules.push((nodeInfo, source) => {
    let nClz = nodeInfo.node.attributes['class'];
    let sClz = source.node.attributes['class'];
    if (!nClz && !sClz) {
        return [0, 0, 'class']; // ignore
    }

    return [4, matchList(getClasses(nClz), getClasses(sClz)), 'class'];
});

// attributes
rules.push((nodeInfo, source) => {
    let nAttr = nodeInfo.node.attributes;
    let sAttr = source.node.attributes;

    let nList = getAttributeList(nAttr);
    let sList = getAttributeList(sAttr);

    if (!nList.length && !sList.length) {
        return [0, 0, 'attributes'];
    }

    return [3, matchList(nList, sList), 'attributes'];
});

let getAttributeList = (attrs) => {
    return mapToList(attrs, (key, value) => {
        return `${key}=${value}`;
    });
};

let getClasses = (clz = '') => {
    let ret = [];
    let items = clz.split(' ');
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        item = item.trim();
        if (item) {
            ret.push(item);
        }
    }
    return ret;
};

let boolToNum = (boolV) => {
    if (boolV) {
        return 1;
    } else {
        return 0;
    }
};

/**
 * interset / union
 */
let matchList = (list1, list2) => {
    let set1 = interset(list1, list2);
    let set2 = union(list1, list2);
    return set1.length / set2.length;
};

module.exports = {
    getSimilarityDegree,
    getSimilarityMatrix
};

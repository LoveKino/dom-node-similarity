'use strict';

let {
    union, interset, map
} = require('bolzano');

let contentRule = require('./content');

let pathRule = require('./path');

let rules = [];

let addRule = (ruleName, coefficientRule, scaleRule) => {
    if (typeof coefficientRule === 'number') {
        let num = coefficientRule;
        coefficientRule = () => num;
    }
    rules.push({
        ruleName,
        coefficientRule,
        scaleRule
    });
};

// tagName
addRule('tagName', 10, (nodeInfo, source) => {
    return boolToNum(nodeInfo.node.tagName === source.node.tagName);
});

// order of node
addRule('order of node', 5, (nodeInfo, source) => {
    return boolToNum(nodeInfo.node.index === source.node.index);
});

// id
addRule('id', (nodeInfo, source) => {
    let nId = nodeInfo.node.attributes['id'];
    let sId = source.node.attributes['id'];
    if (!sId && !nId) {
        return 0; // ignore
    }
    return 8;
}, (nodeInfo, source) => {
    let nId = nodeInfo.node.attributes['id'];
    let sId = source.node.attributes['id'];
    if (!sId && !nId) {
        return 0;
    }
    return boolToNum(nId === sId);
});

// class
addRule('class', (nodeInfo, source) => {
    let nClz = nodeInfo.node.attributes['class'];
    let sClz = source.node.attributes['class'];
    if (!nClz && !sClz) {
        return 0; // ignore
    }

    return 4;
}, (nodeInfo, source) => {
    let nClz = nodeInfo.node.attributes['class'];
    let sClz = source.node.attributes['class'];
    if (!nClz && !sClz) {
        return 0; // ignore
    }
    return matchList(getClasses(nClz), getClasses(sClz));
});

// attributes
addRule('attributes', (nodeInfo, source) => {
    let nAttr = nodeInfo.node.attributes;
    let sAttr = source.node.attributes;

    let nList = getAttributeList(nAttr);
    let sList = getAttributeList(sAttr);

    if (!nList.length && !sList.length) {
        return 0;
    }

    return 3;
}, (nodeInfo, source) => {
    let nAttr = nodeInfo.node.attributes;
    let sAttr = source.node.attributes;

    let nList = getAttributeList(nAttr);
    let sList = getAttributeList(sAttr);

    if (!nList.length && !sList.length) {
        return 0;
    }

    return matchList(nList, sList);
});

// content
addRule.apply(undefined, contentRule);

// path
addRule.apply(undefined, pathRule);

let getAttributeList = (attrs) => map(attrs, (value, key) => `${key}=${value}`);

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

module.exports = rules;

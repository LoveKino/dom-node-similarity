'use strict';

/**
 * opt content rule, consider 3 level
 */

let {
    map
} = require('bolzano');

let contentRule = require('./content');

let pathRule = require('./path');

let {
    boolToNum, matchList
} = require('./util');

let {
    getClasses
} = require('doming');

let getAttributeList = (attrs) => map(attrs, (value, key) => `${key}=${value}`);

let getRules = (source) => {
    let {
        node
    } = source;

    let {
        attributes
    } = node;

    return [
        ['tagName', 10, (nodeInfo) => {
            return boolToNum(nodeInfo.node.tagName === node.tagName);
        }],

        ['order of node', 5, (nodeInfo) => {
            return boolToNum(nodeInfo.node.index === node.index);
        }],

        ['id', 8, (nodeInfo) => {
            let nId = nodeInfo.node.attributes['id'];
            let sId = attributes['id'];
            return boolToNum(nId === sId);
        }],

        ['class', 4, (nodeInfo) => {
            let nClz = nodeInfo.node.attributes['class'];
            let sClz = attributes['class'];
            return matchList(getClasses(nClz), getClasses(sClz));
        }],

        ['attributes', 5, (nodeInfo) => {
            let nAttr = nodeInfo.node.attributes;

            let nList = getAttributeList(nAttr);
            let sList = getAttributeList(attributes);

            return matchList(nList, sList);
        }],

        ['content', 10, contentRule],

        ['path', 5, pathRule, 'slow']
    ];
};

module.exports = {
    getRules
};

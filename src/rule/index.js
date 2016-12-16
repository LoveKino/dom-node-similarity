'use strict';

/**
 * opt content rule, consider 3 level
 */

let {
    map, compact
} = require('bolzano');

let contentRule = require('./content');

let pathRule = require('./path');

let {
    boolToNum, matchList, getRate
} = require('./util');

let {
    getClasses
} = require('doming');

let color = require('onecolor');

let getAttributeList = (attrs) => map(attrs, (value, key) => `${key}=${value}`);

let getRules = (source) => {
    let {
        node
    } = source;

    let {
        style
    } = node;

    let {
        attributes
    } = node;

    return compact(
        [
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

            style && ['backgroundColor', 3, (nodeInfo) => {
                if (!nodeInfo.node.style) return 0;
                return boolToNum(
                    getStyleColor(source, 'background-color') === getStyleColor(nodeInfo, 'background-color')
                );
            }],

            style && ['color', 2, (nodeInfo) => {
                if (!nodeInfo.node.style) return 0;
                return boolToNum(
                    getStyleColor(source, 'color') === getStyleColor(nodeInfo, 'color')
                );
            }],

            style && ['fontSize', 2, (nodeInfo) => {
                if (!nodeInfo.node.style) return 0;
                return boolToNum(
                    getStyleAttr(source, 'font-size') === getStyleAttr(nodeInfo, 'font-size')
                );
            }],

            style && ['display', 3, (nodeInfo) => {
                if (!nodeInfo.node.style) return 0;
                if (getStyleAttr(source, 'display') === 'none' &&
                    getStyleAttr(nodeInfo, 'display') !== 'none') {
                    return 0;
                }
                if (getStyleAttr(source, 'display') !== 'none' &&
                    getStyleAttr(nodeInfo, 'display') === 'none') {
                    return 0;
                }

                return 1;
            }],

            style && ['clientWidth', 2, (nodeInfo) => {
                if (!nodeInfo.node.style) return 0;
                return getRate(getShapeAttr(source, 'clientWidth'), getShapeAttr(nodeInfo, 'clientWidth'));
            }],

            style && ['clientHeight', 2, (nodeInfo) => {
                if (!nodeInfo.node.style) return 0;
                return getRate(getShapeAttr(source, 'clientHeight'), getShapeAttr(nodeInfo, 'clientHeight'));
            }],

            ['content', 10, contentRule],

            ['path', 10, pathRule, 'slow']
        ]
    );
};

let getShapeAttr = (info, name) => getShape(info)[name];

let getShape = (info) => info.node.style.shape;

let getStyleColor = (info, name) => color(getStyleAttr(info, name)).hex();

let getStyleAttr = (info, name) => info.node.style.style[name];

let runRule = (rule, nodeInfo, source) => {
    let [ruleName, coefficient, scaleRule] = rule;

    let scale = scaleRule(nodeInfo, source, getSimilarityDegree);

    if (isNaN(scale) || isNaN(coefficient)) {
        throw new Error(`computation error happened, got a nan for ${ruleName}`);
    }

    return [coefficient, scale, ruleName];
};

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
    let rules = getRules(source);
    let rets = [];
    for (let i = 0; i < rules.length; i++) {
        rets.push(runRule(rules[i], nodeInfo, source));
    }

    return rets;
};

module.exports = {
    getRules,
    runRule,
    getSimilarityMatrix,
    getSimilarityDegree
};

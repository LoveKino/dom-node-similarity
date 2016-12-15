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

module.exports = {
    getRules
};

'use strict';

let {
    getSimilarityDegree
} = require('../src');
let path = require('path');
let assert = require('assert');

let promisify = require('es6-promisify');
let fs = require('fs');
let readFile = promisify(fs.readFile);

describe('case', () => {
    it('daxiang', () => {
        return Promise.all([
            readFile(path.join(__dirname, './fixture/daxiang/2017.4.27/0/source.json')),
            readFile(path.join(__dirname, './fixture/daxiang/2017.4.27/0/node1.json')),
            readFile(path.join(__dirname, './fixture/daxiang/2017.4.27/0/node2.json'))
        ]).then(([
            sourceStr,
            node1Str,
            node2Str
        ]) => {
            let source = JSON.parse(sourceStr);
            let node1 = JSON.parse(node1Str);
            let node2 = JSON.parse(node2Str);

            assert.equal(getSimilarityDegree(node2, source) > getSimilarityDegree(node1, source), true);
            assert.equal(getSimilarityDegree(source, source), 1);
        });
    });

    it('naviBug', () => {
        return Promise.all([
            readFile(path.join(__dirname, './fixture/naviBug/source.json')),
            readFile(path.join(__dirname, './fixture/naviBug/node1.json')),
            readFile(path.join(__dirname, './fixture/naviBug/node2.json'))
        ]).then(([
            sourceStr,
            node1Str,
            node2Str
        ]) => {
            let source = JSON.parse(sourceStr);
            let node1 = JSON.parse(node1Str);
            let node2 = JSON.parse(node2Str);

            assert.equal(getSimilarityDegree(node2, source) > getSimilarityDegree(node1, source), true);
        });
    });
});

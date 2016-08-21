'use strict';

let assert = require('assert');

let distance = require('../src/rule/util/distance');

describe('distance', () => {
    it('base', () => {
        let ret = distance('1234', '2345');
        assert.equal(ret, 2);
    });

    it('contain', () => {
        let ret = distance('234', '2345');
        let ret2 = distance('2345', '234');
        assert.equal(ret, 1);
        assert.equal(ret2, 1);
    });

    it('contain', () => {
        let ret = distance('abc', `all\nabc\ndef\n`);
        assert.equal(ret, 9);
    });
});

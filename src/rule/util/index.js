'use strict';

let {
    union, interset
} = require('bolzano');

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
    if(!list1.length && !list2.length) return 1;
    let set1 = interset(list1, list2);
    let set2 = union(list1, list2);
    return set1.length / set2.length;
};

module.exports = {
    boolToNum,
    matchList
};

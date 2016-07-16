'use strict';

let contain = (list, item) => {
    for (let i = 0; i < list.length; i++) {
        if (item === list[i]) {
            return true;
        }
    }
    return false;
};

let shadowClone = (map = {}) => {
    let newMap = {};
    for (let name in map) {
        newMap[name] = map[name];
    }
    return newMap;
};

let interset = (list1, list2) => {
    let ret = [];
    for (let i = 0; i < list1.length; i++) {
        if (contain(list2, list1[i]) &&
            !contain(ret, list1[i])) {
            ret.push(list1[i]);
        }
    }
    return ret;
};

let union = (list1, list2) => {
    let ret = [];

    for (let i = 0; i < list1.length; i++) {
        if (!contain(ret, list1[i])) {
            ret.push(list1[i]);
        }
    }

    for (let i = 0; i < list2.length; i++) {
        if (!contain(ret, list2[i])) {
            ret.push(list2[i]);
        }
    }

    return ret;
};

let getKeys = (obj) => {
    if (Object.keys) {
        return Object.keys(obj);
    } else {
        let keys = [];
        for (let name in obj) {
            keys.push(name);
        }
        return keys;
    }
};

let getValues = (obj, keys) => {
    let values = [];
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        values.push(obj[key]);
    }
    return values;
};

let mapToList = (obj, join = defJoin) => {
    let ret = [];
    for (let name in obj) {
        ret.push(join(name, obj[name]));
    }
    return ret;
};

let defJoin = (key, value) => [key, value];

let maxItem = (list, compare = defCompare) => {
    if (!list || !list.length) return {
        index: -1
    };
    let cur = list[0],
        index = 0;
    for (let i = 1; i < list.length; i++) {
        let next = list[i];
        if (compare(next, cur)) {
            cur = next;
            index = i;
        }
    }
    return {
        item: cur,
        index
    };
};

let maxIndex = (list, compare) => maxItem(list, compare).index;

let defCompare = (a, b) => a > b;

module.exports = {
    maxIndex,
    mapToList,
    getKeys,
    getValues,
    contain,
    shadowClone,
    interset,
    union
};

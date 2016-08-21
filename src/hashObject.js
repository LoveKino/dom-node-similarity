'use strict';

let genId = (json) => {
    return JSON.stringify(json);
};

let cacheMap = {};

let addId = (json) => {
    let id = genId(json);
    json.__id = id;
    cacheMap[id] = json;
};

module.exports = (json) => {
    if (json && !json.__id) {
        addId(json);
    }
};

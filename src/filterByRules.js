'use strict';

let {
    map, reduce, forEach
} = require('bolzano');

module.exports = ({
    source,
    totalRules,
    runRule,
    getSupremum
}) => {
    let supremum = getSupremum(source, totalRules);

    let filterByRules = (infoBox, rules, restRules) => {
        infoBox = map(
            // initial lost
            map(infoBox, (info) => {
                info.lost = info.lost || 0;
                return info;
            }),

            (info) => {
                info.lost += getLost(info.nodeInfo, rules);
                return info;
            }
        );

        infoBox = bounceInfoBox(infoBox, restRules);

        // filter
        return filterByBounce(infoBox);
    };

    let getLost = (nodeInfo, rules) => {
        return reduce(rules, (ret, rule) => {
            let [coefficient, scale] = runRule(rule, nodeInfo, source);
            ret += (1 - scale) * coefficient;
            return ret;
        }, 0);
    };

    let filterByBounce = (infoBox) => {
        // filter
        return reduce(infoBox, (prev, info) => {
            let ret = [];
            if (!prev.length) {
                ret.push(info);
            } else {
                forEach(prev, (item, index) => {
                    if (isAbsLow(info, item)) {
                        ret = ret.concat(prev.slice(index));
                        return true; // break
                    } else if (!isAbsLow(item, info)) {
                        ret.push(item);
                    }
                    if (index === prev.length - 1) {
                        ret.push(info);
                    }
                });
            }
            return ret;
        }, []);
    };

    let bounceInfoBox = (infoBox, restRules) => map(infoBox, (info) => {
        let {
            lost
        } = info;

        let rest = getSupremum(source, restRules);

        info.maxSuperBounce = (supremum - lost + rest) / supremum;

        info.minSuperBounce = (supremum - lost - rest) / supremum;
        return info;
    });

    let isAbsLow = (info1, info2) => info1.maxSuperBounce < info2.minSuperBounce;

    return filterByRules;
};

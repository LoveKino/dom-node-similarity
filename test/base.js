'use strict';

let {
    getSimilarityDegree
} = require('..');

let assert = require('assert');

let source1 = {
    'node': {
        'tagName': 'A',
        'nodeType': 1,
        'index': 3,
        'attributes': {
            'href': '//list.jd.com/list.html?cat=1316,1381,1389',
            'target': '_blank',
            'title': '洁面',
            'clstag': 'channel|keycount|866|SDH1_2_2'
        },
        'textContent': '\n    洁面\n  '
    },
    'path': [{
        'tagName': 'DIV',
        'nodeType': 1,
        'index': 3,
        'attributes': {
            'class': 'item_link'
        },
        'textContent': '\n                        \n    面膜\n  \n  \n    洁面\n  \n  \n    防晒\n  \n  \n    套装\n  \n                    '
    }, {
        'tagName': 'DIV',
        'nodeType': 1,
        'index': 1,
        'attributes': {
            'class': 'item'
        },
        'textContent': '\n                    护肤\n                    \n                        \n    面膜\n  \n  \n    洁面\n  \n  \n    防晒\n  \n  \n    套装\n  \n                                  \n                '
    }, {
        'tagName': 'DIV',
        'nodeType': 1,
        'index': 1,
        'attributes': {
            'class': 'beauty_nav_ccmenu'
        }
    }, {
        'tagName': 'DIV',
        'nodeType': 1,
        'index': 3,
        'attributes': {
            'class': 'beauty_nav_ccategory'
        }
    }, {
        'tagName': 'DIV',
        'nodeType': 1,
        'index': 1,
        'attributes': {
            'class': 'beauty_nav_categorys'
        }
    }, {
        'tagName': 'DIV',
        'nodeType': 1,
        'index': 1,
        'attributes': {
            'class': 'mod_w beauty_nav clearfix'
        }
    }, {
        'tagName': 'DIV',
        'nodeType': 1,
        'index': 1,
        'attributes': {
            'class': 'beauty_navwrapper portal_floor1'
        }
    }, {
        'tagName': 'DIV',
        'nodeType': 1,
        'index': 9,
        'attributes': {
            'class': 'mod_container'
        }
    }, {
        'tagName': 'BODY',
        'nodeType': 1,
        'index': 2,
        'attributes': {
            'data-lazy-img-install': '1'
        }
    }, {
        'tagName': 'HTML',
        'nodeType': 1,
        'index': 1,
        'attributes': {
            'class': 'root61 csstransitions cssanimations o2_webkit o2_chrome o2_latest o2_wide beauty'
        }
    }, {
        'nodeType': 9,
        'index': 0,
        'attributes': {}
    }]
};

let source2 = {
    node: {
        'tagName': 'A',
        'nodeType': 1,
        'index': 1,
        'attributes': {
            'target': '_blank',
            'href': '//channel.jd.com/beautysale.html'
        },
        'textContent': '美妆馆'
    },
    path: [{
        'tagName': 'LI',
        'nodeType': 1,
        'index': 3,
        'attributes': {
            'clstag': 'h|keycount|2015|06b',
            'class': 'fore2'
        },
        'textContent': '\n\t\t\t\t美妆馆\n\t\t\t'
    }, {
        'tagName': 'UL',
        'nodeType': 1,
        'index': 1,
        'attributes': {
            'id': 'navitems-group1'
        },
        'textContent': '\n\t\t\t\n\t\t\t\t服装城\n\t\t\t\n\t\t\t\n\t\t\t\t美妆馆\n\t\t\t\n\t\t\t\n\t\t\t\t京东超市\n\t\t\t\n\t\t\t\n\t\t\t\t生鲜\n\t\t\t\n\t\t'
    }, {
        'tagName': 'DIV',
        'nodeType': 1,
        'index': 6,
        'attributes': {
            'id': 'navitems-2014'
        }
    }, {
        'tagName': 'DIV',
        'nodeType': 1,
        'index': 1,
        'attributes': {
            'class': 'w'
        }
    }, {
        'tagName': 'DIV',
        'nodeType': 1,
        'index': 6,
        'attributes': {
            'id': 'nav-2014'
        }
    }, {
        'tagName': 'BODY',
        'nodeType': 1,
        'index': 2,
        'attributes': {}
    }, {
        'tagName': 'HTML',
        'nodeType': 1,
        'index': 1,
        'attributes': {
            'class': 'root61'
        }
    }, {
        'nodeType': 9,
        'index': 0,
        'attributes': {}
    }]
};

describe('base', () => {
    it('same', () => {
        let ret1 = getSimilarityDegree(source1, source1);
        assert.equal(ret1, 1);

        let ret2 = getSimilarityDegree(source2, source2);
        assert.equal(ret2, 1);
    });
});

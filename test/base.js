'use strict';

let {
    getSimilarityDegree
} = require('..');

let assert = require('assert');

describe('base', () => {
    it('same', () => {
        let source = {
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

        let ret = getSimilarityDegree(source, source);
        assert.equal(ret, 1);
    });
});

var isList = require('../isList'),
    crel = require('crel');

module.exports = function(test){

    test('Array is list', function(t){
        t.plan(1);
        t.ok(isList([]));
    });

    test('Inherited from Array is list', function(t){

        function Thing(){}
        Thing.prototype = [];
        Thing.prototype.constructor = Thing;

        t.plan(1);
        t.ok(isList(new Thing));
    });

    test('QSA result is list', function(t){
        t.plan(1);
        t.ok(isList(document.querySelectorAll('*')));
    });

    test('childNodes is list', function(t){
        var parentElement = crel('div',
                crel('span'),
                crel('span'),
                crel('span'),
                crel('span'),
                crel('span')
            );

        t.plan(1);
        t.ok(isList(parentElement.childNodes));
    });

    test('children is list', function(t){
        var parentElement = crel('div',
                crel('span'),
                crel('span'),
                crel('span'),
                crel('span'),
                crel('span')
            );

        t.plan(1);
        t.ok(isList(parentElement.children));
    });

    test('form is not list', function(t){
        var form = crel('form');

        t.plan(1);
        t.notOk(isList(form));
    });

    test('window is not list', function(t){
        t.plan(1);
        t.notOk(isList(window));
    });
};
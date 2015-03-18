// THANKS PHANTOMJS
require('polyfill-function-prototype-bind');

var doc = require('../'),
    crel = require('crel'),
    test = require('grape');

function reset(){
    document.body.innerHTML = '';
}

var oldTest = test;

test = function(name, callback){
    oldTest(name, function(t){
        callback(t);
        reset();
    });
};

Element.prototype.toJSON = function(){
    return this.innerHTML || this.data;
};

require('./fluent')(test);
require('./legacy')(test);
require('./isList')(test);

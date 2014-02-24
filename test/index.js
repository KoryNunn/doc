var doc = require('../'),
    crel = require('crel'),
    test = require('grape');

function reset(){
    document.body.innerHTML = '';
}

var oldTest = test;

test = function(name, callback){
    oldTest(name, function(t){
        var oldEnd = t.end;
        t.end = function(){
            reset();
            oldEnd.apply(t);
        }
        callback(t);
    })
}

require('./fluent')(test);
require('./legacy')(test);
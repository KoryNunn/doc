var doc = require('./doc'),
    isList = require('./isList'),
    getTargets = require('./getTargets'),
    flocProto = [],
    supportsDunderProto = false;

// Test if this runtime supports dunderProto manipulation.
var testObj = {};
testObj.__proto__ = {
    a:true
};
supportsDunderProto = testObj.a;

function Floc(instance){
    for(var key in instance){
        this[key] = instance[key];
    }
}
Floc.prototype = flocProto;
flocProto.constructor = Floc;

function floc(target){
    var instance = getTargets(target);

    if(!isList(instance)){
        if(instance){
            instance = [instance];
        }else{
            instance = [];
        }
    }

    if(supportsDunderProto){
        // dodgy but fast
        // Works in browsers
        instance.__proto__ = flocProto;
    }else{
        // Works in IE.
        return new Floc(instance);
    }
    return instance;
}

for(var key in doc){
    if(typeof doc[key] === 'function'){
        floc[key] = doc[key];
        flocProto[key] = (function(key){
            // This is also extremely dodgy and fast
            return function(a,b,c,d,e,f){
                var result = doc[key](this, a,b,c,d,e,f);

                if(result !== doc && isList(result)){
                    return floc(result);
                }
                return result;
            };
        }(key));
    }
}
flocProto.on = function(events, target, callback){
    var proxy = this;
    if(typeof target === 'function'){
        callback = target;
        target = this;
        proxy = null;
    }
    doc.on(events, target, callback, proxy);
    return this;
};

flocProto.off = function(events, target, callback){
    var reference = this;
    if(typeof target === 'function'){
        callback = target;
        target = this;
        reference = null;
    }
    doc.off(events, target, callback, reference);
    return this;
};

module.exports = floc;
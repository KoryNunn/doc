var arrayProto = [],
    doc = require('./doc'),
    isList = require('./isList'),
    getTargets = require('./getTargets'),
    document = {};

if(typeof window !== 'undefined'){
    document = window.document;
}

function Floc(target){
    if(!(this instanceof Floc)){
        return new Floc(target);
    }
    var items = getTargets(target);

    if(!isList(items)){
        if(items){
            this.push(items);
        }
        return this;
    }

    for(var i = 0; i < items.length; i++) {
        this.push(items[i]);
    }
}
Floc.prototype = [];
Floc.prototype.constructor = Floc;

for(var key in doc){
    if(typeof doc[key] === 'function'){
        Floc[key] = doc[key];
        Floc.prototype[key] = (function(key){
            return function(a,b,c,d,e,f){
                var result = doc[key](this, a,b,c,d,e,f);

                if(result !== doc && isList(result)){
                    return new Floc(result);
                }
                return result;
            };
        }(key));
    }
}
Floc.prototype.on = function(events, target, callback){
    var proxy = this;
    if(typeof target === 'function'){
        callback = target;
        target = this;
        proxy = null;
    }
    doc.on(events, target, callback, proxy);
    return this;
};

Floc.prototype.off = function(events, target, callback){
    var reference = this;
    if(typeof target === 'function'){
        callback = target;
        target = this;
        reference = null;
    }
    doc.off(events, target, callback, reference);
    return this;
};

module.exports = window.doc = Floc;
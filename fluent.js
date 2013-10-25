(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(require('./doc'));
    } else if (typeof define === 'function' && define.amd) {
        define(factory, require('./doc'));
    } else {
        root.floc = factory(root.doc);
    }
}(this, function (doc) {
    var arrayProto = [],
        window = this.window,
        // Allows instantiation in node for libs that require() it.
        document = window && window.document;

    function getTargets(target){
        if(typeof target === 'string'){
            return document.querySelectorAll(target);
        }

        return target;
    }

    function floc(instance, target){
        var items = getTargets(target)

        if(!(items instanceof NodeList)){
            items = [items || document];
        }

        for(var i = 0; i < items.length; i++) {
            instance.push(items[i]);
        }
        return instance;
    }

    function Floc(target){
        if(!(this instanceof Floc)){
            return new Floc(target);
        }
        return floc(this, target);
    }
    Floc.prototype = [];
    Floc.prototype.constructor = Floc;

    for(var key in doc){
        if(typeof doc[key] === 'function'){
            Floc.prototype[key] = (function(key){
                return function(){
                    var args = arrayProto.slice.call(arguments);

                    args.unshift(this);

                    var result = doc[key].apply(this, args);

                    if(result !== this && result && result.length){
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

    return Floc;
}));
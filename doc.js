(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        define(factory);
    } else {
        root.crel = factory();
    }
}(this, function () {
    var document = window.document,
        arrayProto = [];

    function getTarget(target){        
        if(isString(target)){
            return document.querySelector(target);
        }

        return target;
    }

    function getTargets(target){        
        if(isString(target)){
            return document.querySelectorAll(target);
        }

        return target;
    }

    function addFluentFunction(instance, functionName){
        instance[functionName] = function(){
            this._query.push({
                fn: doc[functionName],
                args: arguments
            });
            return this;
        }
    }

    function addFluentFunctions(instance){

        // create fluent versions of doc functions.
        for (var key in doc) {
            if(doc.hasOwnProperty(key) && typeof doc[key] === 'function'){
                addFluentFunction(instance, key);
            }
        };

    }

    function doc(target){
        if(!(this instanceof doc)){
            return new doc(target);
        }

        var instance = function(){
                var target = isString(instance._target) ? doc.find(instance._target) : instance._target || document,
                    result = target;

                while (instance._query.length) {
                    var step = instance._query.shift();

                    result = step.fn.apply(instance, [target].concat(arrayProto.slice.call(step.args)));
                    if(result !== instance){
                        instance._target = result;
                    }
                }

                return target;
            };

        addFluentFunctions(instance);
        // custom .on()
        instance.on = function(events, target, callback){
            var proxy = instance._target;
            if(typeof target === 'function'){
                callback = target;
                target = instance._target;
                proxy = null;
            }
            doc.on(events, target, callback, proxy);
            return instance;
        }
        // custom .off()
        instance.off = function(events, target, callback){
            var reference = instance._target;
            if(typeof target === 'function'){
                callback = target;
                target = instance._target;
                reference = null;
            }
            doc.off(events, target, callback, reference);
            return instance;
        }

        instance.items = function(){
            return doc(instance._target)();
        };

        instance._target = target;
        instance._query = [];

        return instance;
    }

    function isString(thing){
        return typeof thing === 'string';
    }

    doc.find = function(target, query){
        if(query == null){
            query = target;
            target = document;
        }
        target = getTarget(target);

        if(target && target.length){
            var results = [];
            for (var i = 0; i < target.length; i++) {
                results = results.concat(arrayProto.slice.call(doc.find(target[i], query)));
            }
            for (var i = 0; i < results.length; i++) {
                if(results.lastIndexOf(results[i]) !== i){
                    results.splice(i--,1);
                }
            }
            return results;
        }
        
        return target ? target.querySelectorAll(query) : [];
    };

    doc.findOne = function(target, query){
        if(query == null){
            query = target;
            target = document;
        }
        target = getTarget(target);

        if(target && target.length){
            var result;
            for (var i = 0; i < target.length; i++) {
                result = doc.findOne(target[i], query);
                if(result){
                    break;
                }
            }
            return result;
        }

        return target ? target.querySelector(query) : null;
    };

    doc.closest = function(target, query){
        target = getTarget(target);

        if(target && target.length){
            target = target[0];
        }

        while(
            target && 
            target.ownerDocument && 
            !doc.is(target, query)
        ){
            target = target.parentNode;
        }

        return target === document && target !== query ? null : target;
    };

    doc.is = function(target, query){
        target = getTarget(target);

        if(target && target.length){
            target = target[0];
        }

        if(!target.ownerDocument || typeof query !== 'string'){
            return target === query;
        }
        return target === query || Array.prototype.slice.call(doc.find(target.parentNode, query)).indexOf(target) >= 0;
    };

    doc.addClass = function(target, classes){
        target = getTarget(target);

        if(target && target.length){
            for (var i = 0; i < target.length; i++) {
                doc.addClass(target[i], classes);
            }
            return this;
        }

        var classes = classes.split(' '),
            currentClasses = target.className.split(' ');

        for(var i = 0; i < classes.length; i++){
            var classToAdd = classes[i];
            if(target.classList){
                target.classList.add(classToAdd);
            } else if(!currentClasses.indexOf(classToAdd)>=0){
                currentClasses.push(classToAdd);
            }
        }
        if(!target.classList){
            target.className = currentClasses.join(' ');
        }
        return this;
    };

    doc.removeClass = function(target, classes){
        target = getTarget(target);

        if(target && target.length){
            for (var i = 0; i < target.length; i++) {
                doc.removeClass(target[i], classes);
            }
            return this;
        }

        var classes = classes.split(' '),
            currentClasses = target.className.split(' ');

        for(var i = 0; i < classes.length; i++){
            var classToRemove = classes[i];
            if(target.classList){
                target.classList.remove(classToRemove);
                continue;
            }
            var removeIndex = currentClasses.indexOf(classToRemove);
            if(removeIndex >= 0){
                currentClasses.splice(removeIndex, 1);
            }
        }
        if(!target.classList){
            target.className = currentClasses.join(' ');
        }
        return this;
    };

    function addEvent(settings){
        getTarget(settings.target).addEventListener(settings.event, settings.callback, false);
    }

    doc.on = function(events, target, callback, proxy){

        if(typeof target === 'object' && target.length){
            var multiRemoveCallbacks = [];
            for (var i = 0; i < target.length; i++) {
                multiRemoveCallbacks.push(doc.on(events, target[i], callback, proxy));
            }
            return function(){
                while(multiRemoveCallbacks.length){
                    multiRemoveCallbacks.pop()();
                }
            };
        }

        var removeCallbacks = [];
        
        if(typeof events === 'string'){
            events = events.split(' ');
        }

        for(var i = 0; i < events.length; i++){
            var eventSettings = {};
            if(proxy){
                if(proxy === true){
                    proxy = document;
                }
                eventSettings.target = proxy;
                eventSettings.callback = function(event){
                    var closestTarget = doc.closest(event.target, target);
                    if(closestTarget){
                        callback(event, closestTarget);
                    }
                };
            }else{
                eventSettings.target = target;
                eventSettings.callback = callback;
            }

            eventSettings.event = events[i];

            addEvent(eventSettings);

            removeCallbacks.push(eventSettings);
        }

        return function(){
            while(removeCallbacks.length){
                var removeCallback = removeCallbacks.pop();
                getTarget(removeCallback.target).removeEventListener(removeCallback.event, removeCallback.callback);
            }
        }
    };

    doc.off = function(events, target, callback, reference){
        if(target && target.length){
            for (var i = 0; i < target.length; i++) {
                doc.off(events, target[i], callback, proxy);
            }
            return this;
        }

        if(typeof events === 'string'){
            events = events.split(' ');
        }

        if(typeof callback !== 'function'){
            reference = callback;
            callback = null;
        }

        reference = reference ? getTarget(reference) : document;

        var targets = find(target, reference);

        for(var targetIndex = 0; targetIndex < targets.length; targetIndex++){
            var currentTarget = targets[targetIndex];

            for(var i = 0; i < events.length; i++){
                currentTarget.removeEventListener(events[i], callback);
            }
        }
        return this;
    };

    doc.append = function(target, children){
        var target = getTarget(target),
            children = getTarget(children);

        if(target && target.length){
            target = target[0];
        }

        if(children.length){
            children = arrayProto.slice.call(children);
            for (var i = 0; i < children.length; i++) {
                doc.append(target, children[i]);
            }
            return;
        }

        target.appendChild(children);
    };

    doc.isVisible = function(target){
        var target = getTarget(target);
        if(!target){
            return;
        }
        if(target.length){
            var result = true,
                i = -1;

            while (target[i++] && doc.isVisible(target[i])) {}
            return target.length >= i;
        }
        while(target.parentNode && target.style.display !== 'none'){
            target = target.parentNode;
        }

        return target === document;
    };

    return doc;
}));
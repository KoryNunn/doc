;(function(){
	var doc = window.doc = {},
        document = window.document;

    function isString(thing){
        return typeof thing === 'string';
    }

    function getTarget(target){        
        if(isString(target)){
            return doc.find(target)[0];
        }

        return target;
    }

    doc.find = function(target, query){
        if(query == null){
            query = target;
            target = document;
        }
        return getTarget(target).querySelectorAll(query);
    };

	doc.closest = function(target, selector){
        target = getTarget(target);

        while(
            target && 
            target.parentNode && 
            Array.prototype.slice.apply(isString(selector) ? doc.find(target.parentNode, selector) : selector.parentNode.childNodes).indexOf(target) < 0
        ){
            target = target.parentNode;
        }

        return target === document ? null : target;
    };

    doc.is = function(target, query){
        target = getTarget(target);
        return Array.prototype.slice.call(doc.find(target.parentNode, query)).indexOf(target) >= 0;
    };

    function addEvent(settings){
        getTarget(settings.target).addEventListener(settings.event, settings.callback, false);
    }

    doc.on = function(events, target, callback, proxy){
        var removeCallbacks = [];
        
        events = events.split(' ');

        for(var i = 0; i < events.length; i++){
            var eventSettings = [];
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

                getTarget(removeCallback.target).removeEventListener(removeCallback.event, getTarget(removeCallback.target));
            }
        }
    };
})();
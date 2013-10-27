
var singleClass = /^\.\w+$/,
    singleId = /^#\w+$/,
    singleTag = /^\w+$/,
    d = document; // aliased for minification

module.exports = function getTargets(target){
    if(typeof target === 'string'){
        if(singleId.exec(target)){
            // If you have more than 1 of the same id in your page,
            // thats your own stupid fault.
            return [d.getElementById(target.slice(1))];
        }
        if(singleTag.exec(target)){
            return d.getElementsByTagName(target);
        }
        if(singleClass.exec(target)){
            return d.getElementsByClassName(target.slice(1));
        }
        return d.querySelectorAll(target);
    }

    return target;
};
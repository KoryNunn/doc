var singleId = /^#\w+$/,
    d = document; // aliased for minification

module.exports = function getTarget(target){
    if(typeof target === 'string'){
        if(singleId.exec(target)){
            return d.getElementById(target.slice(1));
        }
        return d.querySelector(target);
    }

    return target;
}
module.exports = function isList(object){
    return object !== window && (
        object instanceof Array ||
        (typeof HTMLCollection === 'function' && object instanceof HTMLCollection) ||
        (typeof NodeList === 'function' && object instanceof NodeList) ||
        Array.isArray(object) ||
        ''+object === '[object StaticNodeList]' ||
        ''+object === '[object HTMLCollection]'
    );
}

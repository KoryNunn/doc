module.exports = function isList(object){
    return object !== window && (
        object instanceof Array ||
        (typeof HTMLCollection === 'function' && object instanceof HTMLCollection) ||
        (typeof NodeList === 'function' && object instanceof NodeList) ||
        // YMMV
        Array.isArray(object) ||
        ''+object === '[object StaticNodeList]' ||
        ''+object === '[object HTMLCollection]' ||
        (typeof NodeList === 'object' && object instanceof NodeList)
    );
}

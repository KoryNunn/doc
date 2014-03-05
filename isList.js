module.exports = function isList(object){
    return object !== window && (
        object instanceof Array ||
        (typeof HTMLCollection !== 'undefined' && object instanceof HTMLCollection) ||
        (typeof NodeList !== 'undefined' && object instanceof NodeList) ||
        Array.isArray(object)
    );
}

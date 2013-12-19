module.exports = function isList(object){
    return object !== window && (object instanceof Array || object && typeof object === 'object' && 'length' in object);
}
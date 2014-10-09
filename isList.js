module.exports = function isList(object){
    return object != null && typeof object === 'object' && 'length' in object && !('nodeType' in object);
}
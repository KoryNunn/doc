module.exports = function isList(object){
    return object instanceof Array || object && typeof object === 'object' && 'length' in object;
}
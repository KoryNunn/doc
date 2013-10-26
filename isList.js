module.exports = function isList(object){
    return object && typeof object === 'object' && 'length' in object;
}
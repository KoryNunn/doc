var floc = require('./fluent');

for(var i = 0; i < 100000; i++) {
    floc('.thing').find('.stuff');
}
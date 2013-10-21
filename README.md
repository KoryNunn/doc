# doc

# What #

a small, simple, and fast DOM helper library

# Why? #

A few commonly used dom traverstal and event binding techniques are not easy to write in pure DOM, this provides a simple way to do them.

# Usage #

    var doc = require('doc-js');

    doc('.things'); // NodeList


There are two versions of every function; a legacy way, and a fluent way.

Legacy way example:

    doc.is(target, selector);

Fluent way example:

    doc(target).is(selector)();

Note that the fluent way will build a list of opperations to perform, and won't execute them untill you call the returned function:

    var thingsToDo = doc(target).addClass('things').is('.things');

    // nothing touched yet...

    // execute the opperations.
    thingsToDo();

# Goals #

## Easy to use ##

## Tiny ##

less than 1k minified

## Fast ##

http://jsperf.com/closest-element

# License #

MIT

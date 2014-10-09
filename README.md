# doc

# What #

a small, simple, and fast DOM helper library

# Why? #

A few commonly used dom traverstal and event binding techniques are not easy to write in pure DOM, this provides a simple way to do them.

# Usage #

doc can be used very much like jQuery:

    var doc = require('doc-js');

    doc(target); // NodeList

where 'target' can be a CSS selector, a HTMLElement, or a list of elements, eg:

    doc('.things'); // List of nodes that have the class 'things'


There are two versions of every function; a legacy way, and a fluent way.

Legacy way example:

    doc.is(target, selector);

Fluent way example:

    doc(target).is(selector);

# Goals #

## Easy to use ##

## Tiny ##

~~less than 1k minified~~

about 1.3k min'd and gzipped (I added features..)

## Fast ##

http://jsperf.com/doc-vs-jquery/8

## Browser support

Works in browsers.

Also works in IE >= 8 when you include a polyfill script in your page, like this one: 

```html
    <script src="//cdn.polyfill.io/v1/polyfill.min.js"></script>
```

# License #

MIT

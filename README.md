doc
====

# What #

a small, simple, and fast DOM helper library

# Why? #

A few commonly used dom traverstal and event binding techniques are not easy to write in pure DOM, this provides a simple way to do them.

# Usage #

Find the 'closest' parent element to a target element:

	doc.closest(targetNode, parentNode/selector);

Check if an element matches a selector:

	doc.is(target, selector);

Add an event listener to an element:

	doc.on('click', selector/element, callback);

Delegate an event listener to a parent element:

	doc.on('click', selector/element, callback, parentNode/parentSelector);
    
# Goals #

## Easy to use ##

## Tiny ##

less than 1k minified

## Fast ##

# License #

MIT

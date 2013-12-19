var doc = require('../fluent'),
    crel = require('crel');

module.exports = function(test){

    test('find spans', function(t) {
        crel(document.body,
            crel('span'),
            crel('span'),
            crel('span')
        )

        t.plan(1);

        t.equal(
            doc.find('span').length,
            3,
            'found 3 spans'
        );
        t.end();
    });

    test('find nested spans', function(t) {
        crel(document.body,
            crel('span',
                crel('span',
                    crel('span')
                )
            )
        )

        t.plan(1);

        t.equal(
            doc.find('span').length,
            3,
            'found 3 spans'
        );
        t.end();
    });

    test('find nested spans after context', function(t) {
        crel(document.body,
            crel('span',
                crel('span',
                    crel('span')
                )
            )
        )

        t.plan(1);

        t.equal(
            doc.find('span', 'span').length,
            2,
            'found 2 nested spans'
        );
        t.end();
    });


    test('find by class', function(t) {
        crel(document.body,
            crel('div', {'class':'things'})
        )

        t.plan(1);

        t.equal(
            doc.find('.things').length,
            1,
            'found 1 .things'
        );
        t.end();
    });

    test('find by class with reference', function(t) {
        crel(document.body,
            crel('div', {'class':'things'})
        )

        t.plan(1);

        t.equal(
            doc.find('body', '.things').length,
            1,
            'found 1 .things'
        );
        t.end();
    });

    test('find with node reference', function(t) {
        crel(document.body,
            crel('div', {'class':'things'})
        )

        t.plan(1);

        t.equal(
            doc.find(document.body, '.things').length,
            1,
            'found 1 .things'
        );
        t.end();
    });

    test('is', function(t) {
        crel(document.body,
            crel('div', {'class':'things'})
        )

        t.plan(1);

        t.equal(
            doc.is('.things', '.things'),
            true,
            '.things is .things'
        );
        t.end();
    });

    test('isnt..', function(t) {
        crel(document.body,
            crel('div', {'class':'things'})
        )

        t.plan(1);

        t.equal(
            doc.is('.things', '.notThis'),
            false,
            '.things is not .notThis'
        );
        t.end();
    });

    test('closest', function(t) {
        crel(document.body,
            crel('div', {'class':'things'},
                crel('div', {'class':'stuff'})
            )
        )

        t.plan(1);

        var result = doc.closest('.stuff', '.things');

        t.equal(
            result.className,
            'things',
            'found closest stuff to things'
        );
        t.end();
    });

    test('closest via node', function(t) {
        crel(document.body,
            crel('div', {'class':'things'},
                crel('div', {'class':'stuff'})
            )
        )

        t.plan(1);

        var result = doc.closest(document.querySelector('.stuff'), '.things');

        t.equal(
            result.className,
            'things',
            'found closest stuff to things'
        );
        t.end();
    });

    test('closest document', function(t) {
        crel(document.body,
            crel('div', {'class':'things'},
                crel('div', {'class':'stuff'})
            )
        )

        t.plan(1);

        var result = doc.closest(document, document);

        t.equal(
            result,
            document,
            'found closest document'
        );
        t.end();
    });

    test('on click', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things'},
                crel('div', {'class':'stuff'})
            )
        )

        t.plan(1);

        doc.on('click', '.things', function(){
            t.pass('recieved click event');
        });

        targetElement.click();

        t.end();
    });

    test('on click null target', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things'},
                crel('div', {'class':'stuff'})
            )
        )

        t.plan(1);

        doc.on('click', 'nothing', function(){
            t.fail('recieved click event');
        });

        targetElement.click();

        t.pass('no click heard');

        t.end();
    });

    test('off click', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things'},
                crel('div', {'class':'stuff'})
            )
        )

        t.plan(2);

        var callback = function(){
            t.pass('recieved click event');
        };

        var off = doc.on('click', '.things', callback);

        targetElement.click();

        off();

        t.pass('no click heard');

        t.end();
    });

    test('on click delegated', function(t) {
        var delegateElement,
            targetElement;

        crel(document.body,
            delegateElement = crel('div', {'class':'things'},
                targetElement = crel('div', {'class':'stuff'})
            )
        )

        t.plan(1);

        doc.on('click', '.things', function(event){
            if(event.target === targetElement){
                t.pass('recieved click event');
            }else{
                t.fail('wrong target');
            }
        },'.stuff');

        targetElement.click();

        delegateElement.click();

        t.end();
    });

    test('add class', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things'})
        )

        t.plan(1);

        doc.addClass('.things', 'stuff');

        t.equal(
            targetElement.className,
            'things stuff',
            'target had new class'
        );

        t.end();
    });

    test('add classes', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things'})
        )

        t.plan(1);

        doc.addClass('.things','stuff majigger');

        t.equal(
            targetElement.className,
            'things stuff majigger',
            'target had new classes'
        );

        t.end();
    });

    test('add dupliacte class', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things'})
        )

        t.plan(1);

        doc.addClass('.things', 'stuff things');

        t.equal(
            targetElement.className,
            'things stuff',
            'target had only new classes added'
        );

        t.end();
    });

    test('remove class', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things stuff'})
        )

        t.plan(1);

        doc.removeClass('.things', 'things');

        t.equal(
            targetElement.className,
            'stuff',
            'target had class removed'
        );

        t.end();
    });

    test('remove classes', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things stuff'})
        )

        t.plan(1);

        doc.removeClass('.things', 'things stuff');

        t.equal(
            targetElement.className,
            '',
            'target had classes removed'
        );

        t.end();
    });

    test('append', function(t) {
        var targetElement,
            button = crel('button');

        crel(document.body,
            targetElement = crel('div', {'class':'things'})
        )

        t.plan(1);

        doc.append('.things', button);

        t.equal(
            targetElement.firstChild,
            button,
            'element appended'
        );

        t.end();
    });

    test('prepend', function(t) {
        var targetElement,
            button = crel('button');

        crel(document.body,
            targetElement = crel('div', {'class':'things'},
                crel('span')
            )
        )

        t.plan(1);

        doc.prepend('.things', button);

        t.equal(
            targetElement.firstChild,
            button,
            'element prepended'
        );

        t.end();
    });

    test('ready', function(t) {
        t.plan(1);

        doc.ready(function(){
            t.pass();
        });

        t.end();
    });
};
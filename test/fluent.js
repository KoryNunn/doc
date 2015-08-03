var doc = require('../fluent'),
    crel = require('crel');

module.exports = function(test){

    test('find spans', function(t) {
        crel(document.body,
            crel('span'),
            crel('span'),
            crel('span')
        );

        t.plan(1);

        t.equal(
            doc('span').length,
            3,
            'found 3 spans'
        );
    });

    test('find nested spans', function(t) {
        crel(document.body,
            crel('span',
                crel('span',
                    crel('span')
                )
            )
        );

        t.plan(1);

        t.equal(
            doc('span').length,
            3,
            'found 3 spans'
        );
    });

    test('find nested spans after context', function(t) {
        crel(document.body,
            crel('span',
                crel('span',
                    crel('span')
                )
            )
        );

        t.plan(1);

        t.equal(
            doc('span').find('span').length,
            2,
            'found 2 nested spans'
        );
    });


    test('find by class', function(t) {
        crel(document.body,
            crel('div', {'class':'things'})
        );

        t.plan(1);

        t.equal(
            doc('.things').length,
            1,
            'found 1 .things'
        );
    });

    test('find by class with reference', function(t) {
        crel(document.body,
            crel('div', {'class':'things'})
        );

        t.plan(1);

        t.equal(
            doc('body').find('.things').length,
            1,
            'found 1 .things'
        );
    });

    test('find with node reference', function(t) {
        crel(document.body,
            crel('div', {'class':'things'})
        );

        t.plan(1);

        t.equal(
            doc(document.body).find('.things').length,
            1,
            'found 1 .things'
        );
    });

    test('is', function(t) {
        crel(document.body,
            crel('div', {'class':'things'})
        );

        t.plan(1);

        t.equal(
            doc('.things').is('.things'),
            true,
            '.things is .things'
        );
    });

    test('parentless is', function(t) {
        var element = crel('div', {'class':'things'});

        t.plan(1);

        t.equal(
            doc(element).is('.things'),
            true,
            '.things is .things'
        );
    });

    test('isnt..', function(t) {
        crel(document.body,
            crel('div', {'class':'things'})
        );

        t.plan(1);

        t.equal(
            doc('.things').is('.notThis'),
            false,
            '.things is not .notThis'
        );
    });

    test('closest', function(t) {
        crel(document.body,
            crel('div', {'class':'things'},
                crel('div', {'class':'stuff'})
            )
        );

        t.plan(1);

        var result = doc('.stuff').closest('.things');

        t.equal(
            result.className,
            'things',
            'found closest stuff to things'
        );
    });

    test('closest via node', function(t) {
        crel(document.body,
            crel('div', {'class':'things'},
                crel('div', {'class':'stuff'})
            )
        );

        t.plan(1);

        var result = doc(document.querySelector('.stuff')).closest('.things');

        t.equal(
            result.className,
            'things',
            'found closest stuff to things'
        );
    });

    test('closest document', function(t) {
        crel(document.body,
            crel('div', {'class':'things'},
                crel('div', {'class':'stuff'})
            )
        );

        t.plan(1);

        var result = doc(document).closest(document);

        t.equal(
            result,
            document,
            'found closest document'
        );
    });

    test('on click', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things'},
                crel('div', {'class':'stuff'})
            )
        );

        t.plan(1);

        doc('.things').on('click', function(){
            t.pass('recieved click event');
        });

        targetElement.click();

    });

    test('on click null target', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things'},
                crel('div', {'class':'stuff'})
            )
        );

        t.plan(1);

        doc('nothing').on('click', function(){
            t.fail('recieved click event');
        });

        targetElement.click();

        t.pass('no click heard');

    });

    test('off click', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things'},
                crel('div', {'class':'stuff'})
            )
        );

        t.plan(2);

        var callback = function(){
            t.pass('recieved click event');
        };

        doc('.things').on('click', callback);

        targetElement.click();

        doc('.things').off(callback);

        t.pass('no click heard');

    });

    test('on click delegated', function(t) {
        var delegateElement,
            targetElement;

        crel(document.body,
            delegateElement = crel('div', {'class':'things'},
                targetElement = crel('div', {'class':'stuff'})
            )
        );

        t.plan(1);

        doc('.things').on('click', '.stuff', function(event){
            if(event.target === targetElement){
                t.pass('recieved click event');
            }else{
                t.fail('wrong target');
            }
        });

        targetElement.click();

        delegateElement.click();

    });

    test('on click delegated late-created target', function(t) {
        var delegateElement,
            targetElement = crel('div', {'class':'stuff'});

        crel(document.body,
            delegateElement = crel('div', {'class':'things'})
        );

        t.plan(1);

        doc('.things').on('click', '.stuff', function(event){
            if(event.target === targetElement){
                t.pass('recieved click event');
            }else{
                t.fail('wrong target');
            }
        });

        crel(delegateElement, targetElement);

        targetElement.click();

        delegateElement.click();

    });

    test('add class', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things'})
        );

        t.plan(1);

        doc('.things').addClass('stuff');

        t.equal(
            targetElement.className,
            'things stuff',
            'target had new class'
        );

    });

    test('add classes', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things'})
        );

        t.plan(1);

        doc('.things').addClass('stuff majigger');

        t.equal(
            targetElement.className,
            'things stuff majigger',
            'target had new classes'
        );

    });

    test('add array of classes', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things'})
        );

        t.plan(1);

        doc('.things').addClass(['stuff', 'majigger']);

        t.equal(
            targetElement.className,
            'things stuff majigger',
            'target had new classes'
        );

    });

    test('add dupliacte class', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things'})
        );

        t.plan(1);

        doc('.things').addClass('stuff things');

        t.equal(
            targetElement.className,
            'things stuff',
            'target had only new classes added'
        );

    });

    test('remove class', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things stuff'})
        );

        t.plan(1);

        doc('.things').removeClass('things');

        t.equal(
            targetElement.className,
            'stuff',
            'target had class removed'
        );

    });

    test('remove classes', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things stuff'})
        );

        t.plan(1);

        doc('.things').removeClass('things stuff');

        t.equal(
            targetElement.className,
            '',
            'target had classes removed'
        );

    });

    test('remove array of classes', function(t) {
        var targetElement;

        crel(document.body,
            targetElement = crel('div', {'class':'things stuff'})
        );

        t.plan(1);

        doc('.things').removeClass(['things', 'stuff']);

        t.equal(
            targetElement.className,
            '',
            'target had classes removed'
        );

    });

    test('append', function(t) {
        var targetElement,
            button = crel('button');

        crel(document.body,
            targetElement = crel('div', {'class':'things'})
        );

        t.plan(1);

        doc('.things').append(button);

        t.equal(
            targetElement.firstChild,
            button,
            'element appended'
        );

    });

    test('prepend', function(t) {
        var targetElement,
            button = crel('button');

        crel(document.body,
            targetElement = crel('div', {'class':'things'},
                crel('span')
            )
        );

        t.plan(1);

        doc('.things').prepend(button);

        t.equal(
            targetElement.firstChild,
            button,
            'element prepended'
        );

    });

    test('ready', function(t) {
        t.plan(1);

        doc().ready(function(){
            t.pass();
        });

    });
};
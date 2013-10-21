var doc = require('../'),
    crel = require('crel'),
    test = require('tape');

function reset(){
    document.body.innerHTML = '';
}

var oldTest = test;

test = function(name, callback){
    oldTest(name, function(t){
        var oldEnd = t.end;
        t.end = function(){
            reset();
            oldEnd.apply(t);
        }
        callback(t);
    })
}

test('find spans', function(t) {
    crel(document.body,
        crel('span'),
        crel('span'),
        crel('span')
    )

    t.plan(1);

    t.equal(
        doc('span')().length,
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
        doc('span')().length,
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
        doc('span').find('span')().length,
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
        doc('.things')().length,
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
        doc('body').find('.things')().length,
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
        doc(document.body).find('.things')().length,
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
        doc('.things').is('.things')(),
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
        doc('.things').is('.notThis')(),
        true,
        '.things is not .notThis'
    );
    t.end();
});

        {
            name: "closest with node",
            test: function(){
                testArea.appendChild(crel('div', {'class':'things'}));

                var result = doc.closest(doc.find('.things')[0], testArea);

                this.result = result;
            },
            expected: testArea
        },
        {
            name: "closest with query",
            test: function(){
                testArea.appendChild(crel('div', {'class':'things'}));

                var result = doc.closest(doc.find('.things')[0], '.testArea');

                this.result = result;
            },
            expected: testArea
        },
        {
            name: "closest document",
            test: function(){
                var result = doc.closest(document, document);

                this.result = result;
            },
            expected: document
        },
        {
            name: "on click",
            test: function(){
                var test = this;

                testArea.appendChild(crel('div', {'class':'things'}));

                var result = doc.on('click', '.things', function(){
                    test.result = true;
                });

                doc.find('.things')[0].click();
            },
            expected: true
        },
        {
            name: "'off' on click",
            test: function(){
                var test = this;

                testArea.appendChild(crel('div', {'class':'things'}));

                var off = doc.on('click', '.things', function(){
                    test.result++;
                });

                doc.find('.things')[0].click();

                off();

                doc.find('.things')[0].click();

            },
            expected: 1,
            result: 0
        },
        {
            name: "on click delegated",
            test: function(){
                var test = this;

                testArea.appendChild(
                    crel('div',
                        crel('div', {'class':'delegate'},
                            crel('div', {'class':'thing'})
                        ),
                        crel('div', {'class':'thing'})
                    )
                );

                this.result = 0;

                var result = doc.on('click', '.thing', function(){
                    test.result++;
                }, '.delegate');

                doc.find('.thing')[0].click();
                doc.find('.thing')[1].click();
            },
            expected: 1
        },
        {
            name: "add class",
            test: function(){
                var test = this;

                var testItem = crel('div');

                testArea.appendChild(
                    testItem
                );

                doc.addClass(testItem, 'hello');

                this.result = doc.is(testItem, '.hello');
            },
            expected: true
        },
        {
            name: "add classes",
            test: function(){
                var test = this;

                var testItem = crel('div');

                testArea.appendChild(
                    testItem
                );

                doc.addClass(testItem, 'hello world');

                this.result = doc.is(testItem, '.hello') && doc.is(testItem, '.world');
            },
            expected: true
        },
        {
            name: "add extra classes",
            test: function(){
                var test = this;

                var testItem = crel('div', {'class':'hello'});

                testArea.appendChild(
                    testItem
                );

                doc.addClass(testItem, 'world');

                this.result = doc.is(testItem, '.hello') && doc.is(testItem, '.world');
            },
            expected: true
        },
        {
            name: "remove class",
            test: function(){
                var test = this;

                var testItem = crel('div', {'class':'hello'});

                testArea.appendChild(
                    testItem
                );

                doc.removeClass(testItem, 'hello');

                this.result = doc.is(testItem, '.hello');
            },
            expected: false
        },
        {
            name: "remove classes",
            test: function(){
                var test = this;

                var testItem = crel('div', {'class':'hello world'});

                testArea.appendChild(
                    testItem
                );

                doc.removeClass(testItem, 'hello').removeClass(testItem, 'world');

                this.result = doc.is(testItem, '.hello') || doc.is(testItem, '.world');
            },
            expected: false
        },
        {
            name: "remove some classes",
            test: function(){
                var test = this;

                var testItem = crel('div', {'class':'hello world majigger'});

                testArea.appendChild(
                    testItem
                );

                doc.removeClass(testItem, 'hello').removeClass(testItem, 'world');

                this.result = doc.is(testItem, '.majigger') && !(doc.is(testItem, '.hello') || doc.is(testItem, '.world'));
            },
            expected: true
        },
        // fluent
        {
            name: "find",
            test: function(){
                testArea.appendChild(crel('div', {'class':'things'}));

                var result = doc('.things')();

                this.result = result.length;
            },
            expected: 1
        },
        {
            name: "find with query reference",
            test: function(){
                testArea.appendChild(crel('div', {'class':'things'}));

                var result = doc('.testArea .things')();

                this.result = result.length;
            },
            expected: 1
        },
        {
            name: "find with node reference",
            test: function(){
                testArea.appendChild(crel('div', {'class':'things'}));

                var result = doc(testArea).find('.things')();

                this.result = result.length;
            },
            expected: 1
        },
        {
            name: "is",
            test: function(){

                this.result = doc(testArea).is('.testArea')();
            },
            expected: true
        },
        {
            name: "isnt..",
            test: function(){

                this.result = doc(testArea).is('.something')();
            },
            expected: false
        },
        {
            name: "closest with node",
            test: function(){
                testArea.appendChild(crel('div', {'class':'things'}));

                var result = doc(doc.find('.things')[0]).closest(testArea)();

                this.result = result;
            },
            expected: testArea
        },
        {
            name: "closest with query",
            test: function(){
                testArea.appendChild(crel('div', {'class':'things'}));

                var result = doc('.things').closest('.testArea')();

                this.result = result;
            },
            expected: testArea
        },
        {
            name: "closest document",
            test: function(){
                var result = doc.closest(document, document);

                this.result = result;
            },
            expected: document
        },
        {
            name: "on click",
            test: function(){
                var test = this;

                testArea.appendChild(crel('div', {'class':'things'}));

                var result = doc.on('click', '.things', function(){
                    test.result = true;
                });

                doc.find('.things')[0].click();
            },
            expected: true
        },
        {
            name: "'off' on click",
            test: function(){
                var test = this;

                testArea.appendChild(crel('div', {'class':'things'}));

                var off = doc.on('click', '.things', function(){
                    test.result++;
                });

                doc.find('.things')[0].click();

                off();

                doc.find('.things')[0].click();

            },
            expected: 1,
            result: 0
        },
        {
            name: "on click delegated",
            test: function(){
                var test = this;

                testArea.appendChild(
                    crel('div',
                        crel('div', {'class':'delegate'},
                            crel('div', {'class':'thing'})
                        ),
                        crel('div', {'class':'thing'})
                    )
                );

                this.result = 0;

                var result = doc.on('click', '.thing', function(){
                    test.result++;
                }, '.delegate');

                doc.find('.thing')[0].click();
                doc.find('.thing')[1].click();
            },
            expected: 1
        },
        {
            name: "add class",
            test: function(){
                var test = this;

                var testItem = crel('div');

                testArea.appendChild(
                    testItem
                );

                doc.addClass(testItem, 'hello');

                this.result = doc.is(testItem, '.hello');
            },
            expected: true
        },
        {
            name: "add classes",
            test: function(){
                var test = this;

                var testItem = crel('div');

                testArea.appendChild(
                    testItem
                );

                doc.addClass(testItem, 'hello world');

                this.result = doc.is(testItem, '.hello') && doc.is(testItem, '.world');
            },
            expected: true
        },
        {
            name: "add extra classes",
            test: function(){
                var test = this;

                var testItem = crel('div', {'class':'hello'});

                testArea.appendChild(
                    testItem
                );

                doc.addClass(testItem, 'world');

                this.result = doc.is(testItem, '.hello') && doc.is(testItem, '.world');
            },
            expected: true
        },
        {
            name: "remove class",
            test: function(){
                var test = this;

                var testItem = crel('div', {'class':'hello'});

                testArea.appendChild(
                    testItem
                );

                doc.removeClass(testItem, 'hello');

                this.result = doc.is(testItem, '.hello');
            },
            expected: false
        },
        {
            name: "remove classes",
            test: function(){
                var test = this;

                var testItem = crel('div', {'class':'hello world'});

                testArea.appendChild(
                    testItem
                );

                doc.removeClass(testItem, 'hello').removeClass(testItem, 'world');

                this.result = doc.is(testItem, '.hello') || doc.is(testItem, '.world');
            },
            expected: false
        },
        {
            name: "remove some classes",
            test: function(){
                var test = this;

                var testItem = crel('div', {'class':'hello world majigger'});

                testArea.appendChild(
                    testItem
                );

                doc.removeClass(testItem, 'hello').removeClass(testItem, 'world');

                this.result = doc.is(testItem, '.majigger') && !(doc.is(testItem, '.hello') || doc.is(testItem, '.world'));
            },
            expected: true
        }
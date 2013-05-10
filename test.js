window.onload = function(){

    var doc = window.doc = require('./doc.js'),
        crel = require('crel');

    var testArea = document.querySelectorAll('.testArea')[0];

    var tests = [
        {
            name: "find",
            test: function(){
                testArea.appendChild(crel('div', {'class':'things'}));

                var result = doc.find('.things');
                
                this.result = result.length;
            },
            expected: 1
        },
        {
            name: "find with query reference",
            test: function(){
                testArea.appendChild(crel('div', {'class':'things'}));

                var result = doc.find('.testArea', '.things');
                
                this.result = result.length;
            },
            expected: 1
        },
        {
            name: "find with node reference",
            test: function(){
                testArea.appendChild(crel('div', {'class':'things'}));

                var result = doc.find(testArea, '.things');
                
                this.result = result.length;
            },
            expected: 1
        },
        {
            name: "is",
            test: function(){
                
                this.result = doc.is(testArea, '.testArea');
            },
            expected: true
        },
        {
            name: "isnt..",
            test: function(){
                
                this.result = doc.is(testArea, '.something');
            },
            expected: false
        },
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
    ];
    
    var resultsElement = document.getElementsByClassName('results')[0];

    function runTests(){
        var errors = [],
            passed = 0,
            startTime = new Date();
            
        for(var i = 0; i < tests.length; i++){
            var test = tests[i],
                resultElement,
                title,
                runBtn,
                result,
                description,
                hasError = false;
            
            try{
                test.test.call(test);
            }catch(error){
                errors.push(error.toString());
                hasError = true;
            }
            test.passed = test.result === test.expected && !hasError;
            
            test.passed && passed++;

            testArea.innerHTML = '';
            
            resultElement = crel('div', {'class':(test.passed && 'passed' || 'failed') + ' test'},
                (title = crel('h1', test.name + ' ' + (test.passed && 'passed' || 'failed'))),
                (result = crel('span', {'class':'result'}), 'output: ' + test.result + ', expected: ' + test.expected),
                (runBtn = crel('button', {type:'button'}, 'Run again')),
                (description = crel('pre', {'class':'description'}, test.test.toString()))
            );
            
            (function(test){
                runBtn.addEventListener('click', function(){
                    test.test.call(test);
                });
            })(test);
            
            resultsElement.appendChild(resultElement);
        }
        
        console.log('Runtime: ' + (new Date() - startTime));
        
        for(var i = 0; i < errors.length; i++){
            console.error(errors[i]);
        }
        
        return passed;
    }
    
    
    
    var summaryElement = document.getElementsByClassName('summary')[0],
        passed = runTests();
        failed = tests.length - passed;
    
    summaryElement.appendChild(crel('h1', passed + ' Tests passed, ' + failed + ' Tests failed'));
    summaryElement.setAttribute('class',(!failed?'passed':'failed') + ' summary');
};
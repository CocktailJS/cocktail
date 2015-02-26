'use strict';

var chai = require('chai'),
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    cocktail = require('../../lib/cocktail'),
    RestoreProcessors = require('../helper/RestoreProcessors');

var expect = chai.expect;
chai.use(sinonChai);

cocktail.mix(cocktail, {
    '@talents': [RestoreProcessors]
});

describe('cocktail Integration Test: annotations', function(){
    beforeEach(function(){
        cocktail.restoreDefaultProcessors();
    });

    afterEach(function(){
        cocktail.restoreDefaultProcessors();
    });

    describe('`@annotation` annotation and cocktail.use() to register a custom annotation', function(){
        var Custom = function(){},
            Subject,
            aProcess = sinon.spy(),
            aSetter = sinon.spy();

        beforeEach(function(){
            Custom = function(){};
            Subject = function(){};
        });

        it('adds custom annotation definition using cocktail.use()', function(){
            var annotationName = 'custom',
                customValue = 1;

            cocktail.mix(Custom, {
                '@annotation': annotationName,

                setParameter: aSetter,
                process: aProcess
            });


            expect(Custom.prototype).to.have.property('name');
            expect(Custom.prototype.name).to.be.equal('@' + annotationName);

            cocktail.use(Custom);

            cocktail.mix(Subject, {
                '@custom': customValue
            });

            expect(aSetter).to.have.been.calledWith(customValue);
            expect(aProcess).to.have.been.calledWith(Subject);

        });

        it('if annotation already exists it gets overriden by the current definition as a custom annotation', function(){
            var customValue = 1;

            cocktail.mix(Custom, {
                '@annotation': 'traits',

                setParameter: aSetter,
                process: aProcess
            });


            cocktail.use(Custom);

            cocktail.mix(Subject, {
                '@traits': customValue
            });

            expect(aSetter).to.have.been.calledWith(customValue);
            expect(aProcess).to.have.been.calledWith(Subject);

        });

        it('if the annotation process invokes mix() the processor queue should be independent.', function(){
            var customValue = 1;


            cocktail.mix(Custom, {
                '@annotation': 'custom',

                setParameter: aSetter,
                process: function(){
                    var proto = {};

                    cocktail.mix(proto, {
                        '@merge': 'mine',
                        a: 2
                    });
                }
            });

            cocktail.use(Custom);


            cocktail.mix(Subject, {
                '@custom': customValue
            });

            expect(aSetter).to.have.been.calledWith(customValue);
        });

    });

});

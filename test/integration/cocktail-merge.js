'use strict';

var chai = require('chai'),
    cocktail = require('../../lib/cocktail'),
    RestoreProcessors = require('../helper/RestoreProcessors');

var expect = chai.expect;

cocktail.mix(cocktail, {
    '@talents': [RestoreProcessors]
});

describe('cocktail Integration Test: merge', function(){

    beforeEach(function(){
        cocktail.restoreDefaultProcessors();
    });

    afterEach(function(){
        cocktail.restoreDefaultProcessors();
    });

    describe('`@merge` annotation adds the properties and methods in the options to the given subject', function(){
        var ClassA,
            ClassAA,
            anObject,
            aMethod = function aMethod(){},
            aProperty = 1;

        beforeEach(function(){
            ClassA  = function(){};
            ClassAA = function(){};
            anObject = {};
        });

        it('merges the properties and methods into the subject prototype when subject is a class', function(){
            cocktail.mix(ClassA, {
                method: aMethod,
                property: aProperty
            });

            expect(ClassA).to.respondTo('method');
            expect(ClassA.prototype).to.have.property('property').that.equal(aProperty);
        });

        it('merges the properties and methods into the subject when subject is an object', function(){
            cocktail.mix(anObject, {
                method: aMethod,
                property: aProperty
            });

            expect(anObject).to.respondTo('method');
            expect(anObject).to.have.property('property').that.equal(aProperty);
        });

        it('a `@merge` annotation is added by default if it is no specified', function(){
            cocktail.mix(ClassA, {
                method: aMethod,
                property: aProperty
            });

            cocktail.mix(ClassAA, {
                '@merge': 'single',
                method: aMethod,
                property: aProperty
            });

            expect(ClassA).to.respondTo('method');
            expect(ClassA.prototype).to.have.property('property').that.equal(aProperty);

            expect(ClassAA).to.respondTo('method');
            expect(ClassAA.prototype).to.have.property('property').that.equal(aProperty);

        });

        it('overrides properties/methods defined in the subject when `@merge` is `single`', function(){
            ClassA.prototype.oValue = 1;
            ClassA.prototype.oMethod = function o(){};

            cocktail.mix(ClassA, {
                //'@merge': 'single', //default value
                oValue  : aProperty,
                oMethod : aMethod
            });

            expect(ClassA).to.respondTo('oMethod');
            expect(ClassA.prototype).to.have.property('oValue').that.equal(aProperty);
            expect(ClassA.prototype.oMethod).to.be.equal(aMethod);
        });

    });

});

'use strict';

var chai = require('chai'),
    cocktail = require('../../lib/cocktail'),
    RestoreProcessors = require('../helper/RestoreProcessors');

var expect = chai.expect;

cocktail.mix(cocktail, {
    '@talents': [RestoreProcessors]
});

describe('cocktail Integration Test: static', function(){

    beforeEach(function(){
        cocktail.restoreDefaultProcessors();
    });

    afterEach(function(){
        cocktail.restoreDefaultProcessors();
    });

  describe('`@static` annotations defines methods and properties in the class', function(){
        it('adds static method to ClassA', function(){
            var method = function(){},
                ClassA, instance;

            ClassA = cocktail.mix({
                '@as'    : 'class',
                '@static': {
                    method: method
                }
            });

            expect(ClassA).to.be.a('function');
            expect(ClassA.method).to.be.a('function');

            instance = new ClassA();

            expect(instance).to.not.respondTo('method');

        });

        it('adds static property to ClassA', function(){
            var property = 'property',
                ClassA, instance;

            ClassA = cocktail.mix({
                '@as'    : 'class',
                '@static': {
                    property: property
                }
            });

            expect(ClassA).to.be.a('function');
            expect(ClassA.property).to.be.a('string');

            expect(ClassA.property).to.be.eql(property);

            instance = new ClassA();
            expect(instance.property).to.be.an('undefined');

        });
    });

});

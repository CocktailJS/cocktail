'use strict';

var chai = require("chai"),
    expect = chai.expect,
    Cocktail = require('../lib/Cocktail.js');

describe('Cocktail Integration Test', function(){

    describe('`@merge` annotation adds the properties and methods in the options to the given subject', function(){
        var ClassA,
            ClassAA,
            aMethod = function aMethod(){},
            aProperty = 1;

        beforeEach(function(){
            ClassA  = function(){};
            ClassAA = function(){};
        });

        it('a `@merge` annotation is added by default if it is no specified', function(){
            Cocktail.mix(ClassA, {
                method: aMethod,
                property: aProperty
            });

            Cocktail.mix(ClassAA, {
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

            Cocktail.mix(ClassA, {
                //'@merge': 'single', //default value
                oValue  : aProperty,
                oMethod : aMethod
            });

            expect(ClassA).to.respondTo('oMethod');
            expect(ClassA.prototype).to.have.property('oValue').that.equal(aProperty);
            expect(ClassA.prototype.oMethod).to.be.equal(aMethod);
        });

    });

    describe('`@properties` annotation adds getter and setter for the specified properties to the given subject ', function(){
        var ClassA,
            instanceA;         

        beforeEach(function(){
            ClassA = function(){};
            instanceA = undefined;
        });

        it('adds a getter/setter method and set the value for each property', function(){
            Cocktail.mix(ClassA, {
                '@properties': {
                    value: 1,
                    name : 'name'
                }
            });

            expect(ClassA).to.respondTo('setName');
            expect(ClassA).to.respondTo('getName');
            expect(ClassA).to.respondTo('setValue');
            expect(ClassA).to.respondTo('getValue');
            expect(ClassA.prototype).to.have.property('value').that.equal(1);
            expect(ClassA.prototype).to.have.property('name').that.equal('name');

            instanceA = new ClassA();

            expect(instanceA.getValue()).to.be.equal(1);
            expect(instanceA.getName()).to.be.equal('name');

        });

        it('if the property is a boolean a isXXX() method is created instead of the getter', function(){
            Cocktail.mix(ClassA, {
                '@properties': {
                    valid: false
                }
            });

            expect(ClassA).to.respondTo('setValid');
            expect(ClassA).to.respondTo('isValid');
            expect(ClassA).to.not.respondTo('getValid');
            expect(ClassA.prototype).to.have.property('valid').that.equal(false);

            instanceA = new ClassA();

            expect(instanceA.isValid()).to.be.equal(false);

        });

    });

});
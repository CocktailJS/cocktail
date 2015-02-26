'use strict';

var chai = require('chai'),
    sinonChai = require('sinon-chai'),
    cocktail = require('../../lib/cocktail'),
    RestoreProcessors = require('../helper/RestoreProcessors');

var expect = chai.expect;
chai.use(sinonChai);

cocktail.mix(cocktail, {
    '@talents': [RestoreProcessors]
});

describe('cocktail Integration Test: properties', function(){

    beforeEach(function(){
        cocktail.restoreDefaultProcessors();
    });

    afterEach(function(){
        cocktail.restoreDefaultProcessors();
    });

    describe('`@properties` annotation adds getter and setter for the specified properties to the given subject ', function(){
        var ClassA,
            anObject,
            instanceA;

        beforeEach(function(){
            ClassA = function(){};
            anObject = {};
            instanceA = undefined;
        });

        it('adds a getter/setter method and set the value for each property to the subject prototype when subject is a class', function(){
            cocktail.mix(ClassA, {
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

        it('adds a getter/setter method and set the value for each property to the subject when subject is an object', function(){
            cocktail.mix(anObject, {
                '@properties': {
                    value: 1,
                    name : 'name'
                }
            });

            expect(anObject).to.respondTo('setName');
            expect(anObject).to.respondTo('getName');
            expect(anObject).to.respondTo('setValue');
            expect(anObject).to.respondTo('getValue');
            expect(anObject).to.have.property('value').that.equal(1);
            expect(anObject).to.have.property('name').that.equal('name');

        });

        it('adds a getter/setter method but does not override value if property is already defined in the given object', function(){
            anObject.name = 'Defined';

            cocktail.mix(anObject, {
                '@properties': {
                    value: 1,
                    name : 'name'
                }
            });

            expect(anObject).to.respondTo('setName');
            expect(anObject).to.respondTo('getName');
            expect(anObject).to.respondTo('setValue');
            expect(anObject).to.respondTo('getValue');
            expect(anObject).to.have.property('value').that.equal(1);
            expect(anObject).to.have.property('name').that.equal('Defined');
        });


        it('if the property is a boolean a isXXX() method is created instead of the getter', function(){
            cocktail.mix(ClassA, {
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

        it('adds a getter/setter method and set the value for each property to the subject prototype when subject is a class definition', function(){
            var ClassA;

            ClassA = cocktail.mix({

                constructor: function(){
                    //do smth
                },

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

    });
});

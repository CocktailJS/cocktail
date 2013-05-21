'use strict';

var chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),
    expect = chai.expect,
    Cocktail = require('../../lib/Cocktail.js');

chai.use(sinonChai);

describe('Cocktail Integration Test', function(){

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
            Cocktail.mix(ClassA, {
                method: aMethod,
                property: aProperty
            });

            expect(ClassA).to.respondTo('method');
            expect(ClassA.prototype).to.have.property('property').that.equal(aProperty);
        });

        it('merges the properties and methods into the subject when subject is an object', function(){
            Cocktail.mix(anObject, {
                method: aMethod,
                property: aProperty
            });

            expect(anObject).to.respondTo('method');
            expect(anObject).to.have.property('property').that.equal(aProperty);
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
            anObject,
            instanceA;         

        beforeEach(function(){
            ClassA = function(){};
            anObject = {};
            instanceA = undefined;
        });

        it('adds a getter/setter method and set the value for each property to the subject prototype when subject is a class', function(){
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

        it('adds a getter/setter method and set the value for each property to the subject when subject is an object', function(){
            Cocktail.mix(anObject, {
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

    describe('`@extends` annotation makes the subject to inherit from the given base class ', function(){
        var Base = function(){},
            aMethod = sinon.spy(),
            ClassA,
            instanceA;         

        Base.prototype.aMethod = aMethod;
        Base.prototype.aProperty = 1;
        
        beforeEach(function(){
            ClassA = function(){};
            instanceA = undefined;
        });

        it('makes methods and properties from base available on the given subject', function(){
            Cocktail.mix(ClassA, {
                '@extends': Base
            });

            expect(ClassA).to.respondTo('aMethod');
            expect(ClassA.prototype).to.have.property('aProperty').that.equal(1);

            instanceA = new ClassA();

            expect(instanceA).to.be.an.instanceOf(ClassA);
            expect(instanceA).to.be.an.instanceOf(Base);
        });

        it('methods and properties can be overriden in the subject', function(){
            Cocktail.mix(ClassA, {
                '@extends': Base,

                aMethod: function(){}

            });

            expect(ClassA).to.respondTo('aMethod');
            expect(ClassA.prototype.aMethod).to.not.be.equal(aMethod);

            instanceA = new ClassA();

            instanceA.aMethod(1);

            expect(aMethod).to.not.have.been.calledWith(1);
        });

        it('throws an error if it is not called with a Class to extend from', function(){
            var anObject = {};
            
            expect(function(){
                Cocktail.mix(ClassA, {
                    '@extends': anObject
                });
            }).to.throw(Error);            

        });

        it('adds a `callSuper` method so an overriden method can be called', function(){
            Cocktail.mix(ClassA, {
                '@extends': Base,

                aMethod: function(param){
                    this.callSuper('aMethod', param);                    
                }

            });

            expect(ClassA).to.respondTo('aMethod');
            expect(ClassA.prototype.aMethod).to.not.be.equal(aMethod);
            
            instanceA = new ClassA();

            instanceA.aMethod(1);

            expect(aMethod).to.have.been.calledWith(1);
        });

        // TODO: The constructor is being called successfully, but cannot make the assertion to work properly
        // it('`callSuper` method in the constructor calls parent constructor', function(){
        //     var ClassB = function(param){
        //             this.callSuper('constructor', param);
        //         },
        //         Base = sinon.spy(function(){
        //             console.log('called!');
        //         }),
        //         param = 1;

        //     Cocktail.mix(ClassB, {
        //         '@extends': Base
        //     });

        //     instanceA = new ClassB(param);

        //     expect(Base).to.have.been.calledWith(param);
        // });

    });

    describe('`@annotation` annotation registers the current mix as a custom annotation', function(){
        var Custom = function(){},
            Subject,
            aProcess = sinon.spy(),
            aSetter = sinon.spy();


        beforeEach(function(){
            Cocktail.restoreDefaultProcessors();
            Subject = function(){};
        });

        it('adds the current definition as a custom annotation', function(){
            var customValue = 1;

            Cocktail.mix(Custom, {
                '@annotation': 'custom',

                setParameter: aSetter,
                process: aProcess
            });


            Cocktail.mix(Subject, {
                '@custom': customValue
            });

            expect(aSetter).to.have.been.calledWith(customValue);
            expect(aProcess).to.have.been.calledWith(Subject);

        });

        it('if annotation already exists it gets overriden by the current definition as a custom annotation', function(){
            var customValue = 1;

            Cocktail.mix(Custom, {
                '@annotation': 'traits',

                setParameter: aSetter,
                process: aProcess
            });

            Cocktail.mix(Subject, {
                '@traits': customValue
            });

            expect(aSetter).to.have.been.calledWith(customValue);
            expect(aProcess).to.have.been.calledWith(Subject);

        });

    });

    describe('`@exports` annotation registers the current mix as the specified value', function(){
        var Custom = function(){};

        it('exports the current mix in the specified value', function() {
            var module = {
                exports: undefined
            };

            Cocktail.mix(Custom, {
                '@exports': module,
                
                some: 'a',

                aMethod: function(){}
            });

            expect(module.exports).to.not.be.an('undefined');
            expect(module.exports).to.respondTo('aMethod');
        });
    
    }); 


});
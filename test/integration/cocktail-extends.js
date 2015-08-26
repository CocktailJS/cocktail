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

describe('cocktail Integration Test: extends', function(){

    beforeEach(function(){
        cocktail.restoreDefaultProcessors();
    });

    afterEach(function(){
        cocktail.restoreDefaultProcessors();
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
            cocktail.mix(ClassA, {
                '@extends': Base
            });

            expect(ClassA).to.respondTo('aMethod');
            expect(ClassA.prototype).to.have.property('aProperty').that.equal(1);

            instanceA = new ClassA();

            expect(instanceA).to.be.an.instanceOf(ClassA);
            expect(instanceA).to.be.an.instanceOf(Base);
        });

        it('methods and properties can be overriden in the subject', function(){
            cocktail.mix(ClassA, {
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
                cocktail.mix(ClassA, {
                    '@extends': anObject
                });
            }).to.throw(Error);

        });

        it('adds a `callSuper` method so an overriden method can be called', function(){
            cocktail.mix(ClassA, {
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

        it('`callSuper` method in the constructor calls parent constructor', function(){
            var ClassA, ClassB,
                constructorBase = sinon.spy(),
                param = 1;

            ClassA = function (param) {
                constructorBase(param);
            };

            ClassB = cocktail.mix({
                '@extends': ClassA,

                constructor: function(param){
                    this.callSuper('constructor', param);
                }
            });

            instanceA = new ClassB(param);

            expect(constructorBase).to.have.been.calledWith(param);
        });


        it('`callSuper` method with multiple inheritance level should call parent methods in order', function () {
            var ClassA, ClassB, ClassC,
                fooA, fooB, fooC,
                instance;

            fooA = sinon.spy();
            fooB = sinon.spy();
            fooC = sinon.spy();

            ClassA = cocktail.mix({
                
                constructor: function() {                    
                },

                foo: function() { 
                    fooA();
                }
            });

            ClassB = cocktail.mix({
                '@extends': ClassA,
                
                foo: function() { 
                    this.callSuper('foo');
                    fooB();
                }
            });

            ClassC = cocktail.mix({
                '@extends': ClassB,

                foo: function() { 
                    this.callSuper('foo');
                    fooC();
                }
            });

            instance = new ClassC();

            instance.foo();

            expect(fooA).to.have.been.called;
            expect(fooB).to.have.been.called;
            expect(fooC).to.have.been.called;

        });


        it('`callSuper` method with multiple inheritance level should call parent constructors in order', function () {
            var ClassA, ClassB, ClassC,
                constructorA, constructorB, constructorC;

            constructorA = sinon.spy();
            constructorB = sinon.spy();
            constructorC = sinon.spy();

            ClassA = cocktail.mix({
                
                constructor: function() {
                    constructorA();
                }
            });

            ClassB = cocktail.mix({
                '@extends': ClassA,
                
                constructor: function() {
                    this.callSuper('constructor');
                    constructorB();
                }
            });

            ClassC = cocktail.mix({
                '@extends': ClassB,

                constructor: function() {
                    this.callSuper('constructor');
                    constructorC();
                }
            });

            new ClassC();

            expect(constructorA).to.have.been.called;
            expect(constructorB).to.have.been.called;
            expect(constructorC).to.have.been.called;

        });

        it('makes methods and properties from base available on the given subject when subject is a class definition', function(){
            ClassA = cocktail.mix({
                '@extends': Base
            });

            expect(ClassA).to.respondTo('aMethod');
            expect(ClassA.prototype).to.have.property('aProperty').that.equal(1);

            instanceA = new ClassA();

            expect(instanceA).to.be.an.instanceOf(ClassA);
            expect(instanceA).to.be.an.instanceOf(Base);
        });

    });
});

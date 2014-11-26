'use strict';

var chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),
    expect = chai.expect,
    cocktail = require('../../../../lib/cocktail'),
    Extends = require('../../../../lib/processor/annotation/Extends.js');

chai.use(sinonChai);

describe('Annotation Processor @extends', function(){
    var sut = new Extends();

    it('has retain set false', function(){
        expect(sut.retain).to.equal(false);
    });

    it('has priority set to cocktail.SEQUENCE.EXTENDS', function(){
        expect(sut.priority).to.equal(cocktail.SEQUENCE.EXTENDS);
    });

    describe('Parameter for @extends annotation', function(){

        it('accepts {function|Class} as parameter', function(){
            var sut = new Extends(),
                Base = function(){};

            sut.setParameter(Base);

            expect(sut.getParameter()).to.be.equal(Base);
        });

        it('does not accept {Object} as parameter', function(){
            var sut = new Extends(),
                object = {};

            expect(function(){ sut.setParameter(object);}).to.throw(Error, /@extends/);
            expect(sut.getParameter()).to.be.an('undefined');
        });
    });

    describe('Extends process', function(){

        describe('Makes the subject to inherit from the given Parent passed as a parameter', function(){
            var sut = new Extends(),
                BaseClass = function(){},
                MyClass = function(){};

            BaseClass.prototype.foo = function foo(){};

            sut.setParameter(BaseClass);
            sut.process(MyClass);

            it('MyClass will respond to methods defined in BaseClass', function(){
                expect(MyClass).to.respondTo('foo');
            });

            it('An instance of MyClass must be an instance of BaseClass too.', function(){
                var instance = new MyClass();

                expect(instance).to.be.instanceOf(MyClass); 
                expect(instance).to.be.instanceOf(BaseClass);
            });
        });

        describe('Creates a method to call super class methods', function(){
            var sut = new Extends(),
                BaseClass = function(){},
                MyClass = function(){},
                foo = sinon.spy(function(val){return val;}),
                myInstance;

            BaseClass.prototype.foo = foo;

            sut.setParameter(BaseClass);
            sut.process(MyClass);

            it('MyClass should have a callSuper method', function(){
                expect(MyClass).to.respondTo('callSuper');
            });

            MyClass.prototype.foo = function(args){
                return this.callSuper('foo', args);
            };

            MyClass.prototype.noSuper = function(args){
                return this.callSuper('noSuper', args);
            };
            myInstance = new MyClass();

            it('Parent method is called when using this.callSuper(`methodName`)', function(){
                myInstance.foo();

                expect(foo).to.have.been.calledOn(myInstance);
            });

            it('Parent method is called with the specified parameters using this.callSuper(`methodName`, `params`)', function(){
                myInstance.foo('123');

                expect(foo).to.have.been.calledOn(myInstance);
                expect(foo).to.have.been.calledWith('123');
            });

            it('Parent method is called with the specified parameters using this.callSuper(`methodName`, `params`) and returns value', function(){
                var ret = myInstance.foo('123');

                expect(foo).to.have.been.calledOn(myInstance);
                expect(foo).to.have.been.calledWith('123');
                expect(foo).to.have.returned('123');
                expect(ret).to.be.equal('123');
            });

            it('should throw exception if parent class has no method', function(){
                expect(function(){myInstance.noSuper();}).to.throw(Error);
            });

        });
    });

});  

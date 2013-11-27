'use strict';

var chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),
    expect = chai.expect,
    cocktail = require('../../lib/cocktail'),
    RestoreProcessors = require('../helper/RestoreProcessors');

chai.use(sinonChai);

cocktail.mix(cocktail, {
    '@talents': [RestoreProcessors]
});


describe('cocktail Integration Test', function(){

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

        // TODO: The constructor is being called successfully, but cannot make the assertion to work properly
        // it('`callSuper` method in the constructor calls parent constructor', function(){
        //     var ClassB = function(param){
        //             this.callSuper('constructor', param);
        //         },
        //         Base = sinon.spy(function(){
        //             console.log('called!');
        //         }),
        //         param = 1;

        //     cocktail.mix(ClassB, {
        //         '@extends': Base
        //     });

        //     instanceA = new ClassB(param);

        //     expect(Base).to.have.been.calledWith(param);
        // });

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
            expect(Custom.prototype.name).to.be.equal('@'+annotationName);

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
                        a: 2,
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

    describe('`@exports` annotation registers the current mix as the specified value', function(){
        var Custom = function(){};

        it('exports the current mix in the specified value', function() {
            var module = {
                exports: undefined
            };

            cocktail.mix(Custom, {
                '@exports': module,
                
                some: 'a',

                aMethod: function(){}
            });

            expect(module.exports).to.not.be.an('undefined');
            expect(module.exports).to.respondTo('aMethod');
        });
    
        it('exports the current class definition in the specified value', function() {
            var module = {
                exports: undefined
            };

            cocktail.mix({
                '@exports': module,
                
                constructor: function() {/*Body*/},

                some: 'a',

                aMethod: function(){/*Body*/}
            });

            expect(module.exports).to.not.be.an('undefined');
            expect(module.exports).to.respondTo('aMethod');
        });

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

    describe('Single Argument Parameter Class Definition', function(){

        it('returns a class if one single argument is specified with an @extends annotation.', function(){
            var MyClass = function(){},
                method = function(){},
                value = 'value',
                sut;

            MyClass.prototype = {
                method: method,
                value : value
            };

            sut = cocktail.mix({
                '@extends': MyClass
            });

            expect(sut).to.be.a('function');
            expect(sut).to.respondTo('method');
            expect(sut.prototype.value).to.be.equal(value);
        });

        it('returns a class if one single argument is specified with a @traits annotation.', function(){
            var MyTrait = function(){},
                sut;

            MyTrait.prototype.method = function(){};

            sut = cocktail.mix({
                '@traits': [MyTrait]
            });

            expect(sut).to.be.a('function');

            expect(sut).to.respondTo('method');

        });

        it('returns a class if one single argument is specified with a @as annotation with a "class" value.', function(){
            var sut;

            sut = cocktail.mix({
                '@as': 'class',

                method: function() {}
            });

            expect(sut).to.be.a('function');

            expect(sut).to.respondTo('method');

        });

        it('did not return a class if one single argument is specified with a @as annotation with a value different of "class".', function(){
            var sut;

            sut = cocktail.mix({
                '@as': 'SomethingElse',

                method: function() {}
            });

            expect(sut).not.to.be.a('function');
            expect(sut).to.be.a('object');
            //even thou the Class is not returned, the object still responds to method
            expect(sut).to.respondTo('method');
            //@as pseudo-annotation is not processed, so it is not removed from sut
            expect(sut).to.have.property('@as');
        });

        it('chains constructors when extending and parent has a constructor defined', function(){
            var value = 1,
                Parent, Class, sut;

            Parent = cocktail.mix({
                '@as': 'class',

                constructor: function(option){
                    this.created = value;
                    this.option  = option;
                }
            });

            Class = cocktail.mix({
                '@as': 'class',
                '@extends': Parent                
            });

            sut = new Class(value);

            expect(sut).to.have.property('created');
            expect(sut.created).to.be.equal(value);
            expect(sut).to.have.property('option');
            expect(sut.option).to.be.equal(value);
        });

    });

});
'use strict';

var expect = require('chai').expect,
    cocktail = require('../../../../lib/cocktail'),
    Properties = require('../../../../lib/processor/annotation/Properties.js');

describe('Annotation Processor @properties', function(){
    var sut = new Properties();

    it('has retain set false', function(){
        expect(sut.retain).to.equal(false);
    });

    it('has priority set to cocktail.SEQUENCE.PROPERTIES', function(){
        expect(sut.priority).to.equal(cocktail.SEQUENCE.PROPERTIES);
    });

    describe('Parameter for @properties annotation', function(){

        it('accepts {} as parameter', function(){
            var sut = new Properties(),
                properties = {};

            sut.setParameter(properties);

            expect(sut.getParameter()).to.be.equal(properties);
        });

        it('throws an error if parameter is set to an Array', function(){
            var sut = new Properties();

            expect(function(){ sut.setParameter(['some']);}).to.throw(Error, /@properties parameter should be an Object/);
            expect(sut.getParameter()).to.be.an('undefined');
        });

        it('throws an error if parameter is set to a String', function(){
            var sut = new Properties();
                        
            expect(function(){ sut.setParameter('some');}).to.throw(Error, /@properties parameter should be an Object/);
            expect(sut.getParameter()).to.be.an('undefined');
        });

    });

    describe('Properties process', function(){

        describe('Creates getters and setters for the specified property', function(){
            var sut = new Properties(),
                MyClass = function(){};

            sut.setParameter({
                'undef': undefined,
                'nullVal': null,
                'name': 'My Name',
                'testBool': true,
                'falsyBool': false,
                'number': 1,
                'falsyNumber' : 0
            });
            sut.process(MyClass);

            it('creates the property in the subject and sets the given value', function(){
                expect(MyClass.prototype.undef).to.be.equal(undefined);
                expect(MyClass.prototype.nullVal).to.be.equal(null);
                expect(MyClass.prototype.name).to.be.equal('My Name');
                expect(MyClass.prototype.testBool).to.be.equal(true);
                expect(MyClass.prototype.falsyBool).to.be.equal(false);
                expect(MyClass.prototype.number).to.be.equal(1);
                expect(MyClass.prototype.falsyNumber).to.be.equal(0);

            });

            it('creates getter and setter with setXXX getXXX for String, Numbers, Array, `null`, and `undefined` properties', function(){
                expect(MyClass).to.respondTo('setUndef');
                expect(MyClass).to.respondTo('getUndef');

                expect(MyClass).to.respondTo('setNullVal');
                expect(MyClass).to.respondTo('getNullVal');

                expect(MyClass).to.respondTo('setName');
                expect(MyClass).to.respondTo('getName');

                expect(MyClass).to.respondTo('setNumber');
                expect(MyClass).to.respondTo('getNumber');

                expect(MyClass).to.respondTo('setFalsyNumber');
                expect(MyClass).to.respondTo('getFalsyNumber');

            });

            it('creates getter as isXXX for boolean properties', function(){
                expect(MyClass).to.respondTo('setTestBool');
                expect(MyClass).to.respondTo('isTestBool');

                expect(MyClass).to.respondTo('setFalsyBool');
                expect(MyClass).to.respondTo('isFalsyBool');

            });



        });
    });    

});
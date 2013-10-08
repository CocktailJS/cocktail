'use strict';

var expect = require('chai').expect,
    Cocktail = require('../../../../lib/Cocktail'),
    Static = require('../../../../lib/processor/annotation/Static.js');

describe('Annotation Processor @static', function(){
    var sut = new Static();

    it('has retain set false', function(){
        expect(sut.retain).to.equal(false);
    });

    it('has priority set to Cocktail.SEQUENCE.POST_MERGE', function(){
        expect(sut.priority).to.equal(Cocktail.SEQUENCE.POST_MERGE);
    });

    describe('Parameters for @static annotation', function(){

        it('accepts a literal object as parameter', function(){
            var sut = new Static(),
                param = {};

            sut.setParameter(param);

            expect(sut.getParameter()).to.be.equal(param);
        });

        it('throws an error if parameter is set to an Array', function(){
            var sut = new Static();

            expect(function(){ sut.setParameter(['some']);}).to.throw(Error, /@static parameter should be an Object/);
            expect(sut.getParameter()).to.be.an('undefined');
        });

        it('throws an error if parameter is set to a String', function(){
            var sut = new Static();

            expect(function(){ sut.setParameter('some');}).to.throw(Error, /@static parameter should be an Object/);
            expect(sut.getParameter()).to.be.an('undefined');
        });

    });

    describe('Static process', function(){

        it('adds a function as a static method on ClassA', function(){
            var sut = new Static(),
                method = function() {},
                MyClass = function(){};

            sut.setParameter({
                methodAsStatic: method
            });

            sut.process(MyClass);

            expect(MyClass.methodAsStatic).to.be.equal(method);
            expect(MyClass.prototype.methodAsStatic).to.be.equal(undefined);

        });

        it('adds a value as a static property on ClassA', function(){
            var sut = new Static(),
                property = 'someValue',
                MyClass = function(){};

            sut.setParameter({
                propertyAsStatic: property
            });

            sut.process(MyClass);

            expect(MyClass.propertyAsStatic).to.be.equal(property);
            expect(MyClass.prototype.propertyAsStatic).to.be.equal(undefined);

        });

    });


});
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

        it('returns a module if one single argument is specified with a @as annotation with a "module" value.', function(){
            var sut;

            sut = cocktail.mix({
                '@as': 'module',

                method: function() {}
            });

            expect(sut).to.be.an('object');

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

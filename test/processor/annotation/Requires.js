'use strict';

var expect = require('chai').expect,
    Cocktail = require('../../../lib/Cocktail'),
    Requires = require('../../../lib/processor/annotation/Requires.js');

describe('Annotation Processor @requires', function(){
    var sut = new Requires();


    it('has retain set false', function(){
        expect(sut.retain).to.equal(false);
    });

    it('has priority set to Cocktail.SEQUENCE.REQUIRES', function(){
        expect(sut.priority).to.equal(Cocktail.SEQUENCE.REQUIRES);
    });

    describe('Parameter for @properties annotation', function(){

        it('accepts [] as parameter', function(){
            var sut = new Requires(),
                requires = ['aRequired'];

            sut.setParameter(requires);

            expect(sut.getParameter()).to.contain('aRequired');
        });
    });

    describe('Requires process', function(){

        describe('Creates a required function for each method specified in parameters', function(){

            it('creates the method as part of the given subject as a required function', function(){
                var sut = new Requires(),
                    MyTrait = function(){};

                sut.setParameter([
                    'requiredMethod'
                ]);

                sut.process(MyTrait);

                expect(MyTrait).to.respondTo('requiredMethod');
                expect(MyTrait.prototype.requiredMethod).to.be.equal(Requires.requiredMethod);
            });

            it('does not create the method if it has been already defined', function(){
                var sut = new Requires(),
                    MyTrait = function(){},
                    requiredMethod = function(){ return 'required'; };

                MyTrait.prototype.requiredMethod = requiredMethod;

                sut.setParameter([
                    'requiredMethod'
                ]);

                sut.process(MyTrait);

                expect(MyTrait).to.respondTo('requiredMethod');
                expect(MyTrait.prototype.requiredMethod).to.be.equal(requiredMethod);
                expect(MyTrait.prototype.requiredMethod).to.not.be.equal(Requires.requiredMethod);
            });


        });
    }); 
});
'use strict';

var chai = require('chai'),
    cocktail = require('../../../../lib/cocktail'),
    Exports = require('../../../../lib/processor/annotation/Exports.js');

var expect = chai.expect;

describe('Annotation Processor @exports', function(){
    var sut = new Exports();

    it('has retain set false', function(){
        expect(sut.retain).to.equal(false);
    });

    it('has priority set to cocktail.SEQUENCE.EXPORTS', function(){
        expect(sut.priority).to.equal(cocktail.SEQUENCE.EXPORTS);
    });

    describe('Parameter for @exports annotation', function(){

        it('accepts {Object} as parameter', function(){
            var sut = new Exports(),
                param = {};

            sut.setParameter(param);

            expect(sut.getParameter()).to.be.equal(param);
        });
    });

    describe('Exports process', function(){

        describe('Exports the subject as `exports` property in the given parameter', function(){
            var sut = new Exports(),
                BaseClass = function(){},
                module = {};


            it('make the subject part of the given parameter as `exports` property', function(){

                sut.setParameter(module);

                sut.process(BaseClass);

                expect(module.exports).to.not.be.an('undefined');
                expect(module.exports).to.be.equal(BaseClass);

            });

        });

        describe('Do not exports the subject as `exports` property if the given parameter is not a module object', function(){
            var sut = new Exports(),
                BaseClass = function(){},
                module;


            it('does not exports the subject if the parameter is false', function(){
                module = false;

                sut.setParameter(module);

                sut.process(BaseClass);

                expect(module).to.not.have.property('exports');

            });

            it('does not exports the subject if the parameter is true', function(){
                module = true;

                sut.setParameter(module);

                sut.process(BaseClass);

                expect(module).to.not.have.property('exports');

            });

            it('does not exports the subject if the parameter is null', function(){
                module = null;

                sut.setParameter(module);

                sut.process(BaseClass);

                expect(module).to.be.equal(null);

            });

        });

    });
});

'use strict';

var chai = require("chai"),
    sinonChai = require("sinon-chai"),
    expect = chai.expect,
    cocktail = require('../../../../lib/cocktail'),
    Annotation = require('../../../../lib/processor/annotation/Annotation.js');

chai.use(sinonChai);

describe('Annotation Processor @annotation', function(){
    var sut;

    sut = new Annotation();

    it('has retain set false', function(){
        expect(sut.retain).to.equal(false);
    });

    it('has priority set to cocktail.SEQUENCE.ANNOTATION', function(){
        expect(sut.priority).to.equal(cocktail.SEQUENCE.ANNOTATION);
    });

    describe('Parameter for @annotation annotation', function(){

        it('accepts {String} as parameter', function(){
            var name = "single";

            sut.setParameter(name);

            expect(sut.getParameter()).to.be.equal(name);
        });
    });

    describe('Annotation process', function(){
        var name = 'custom';

        describe('registers the subject as a processor in cocktail', function(){

            it('adds a new processor in the form of `@`+parameter', function(){
                var Subject = function(){};

                sut.setParameter(name);
                sut.process(Subject, Subject.prototype);

                expect(Subject.prototype).to.have.property('name');
            });
        });

    });
});  

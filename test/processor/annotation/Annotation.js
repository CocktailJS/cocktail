'use strict';

var chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),
    expect = chai.expect,
    Cocktail = require('../../../lib/Cocktail'),
    proxyquire = require("proxyquire");

chai.use(sinonChai);

describe('Annotation Processor @annotation', function(){
    var Annotation,
        registerProcessors = sinon.spy(),
        sut;

    Annotation =  proxyquire('../../../lib/processor/annotation/Annotation.js', {
        '../../Cocktail': {registerProcessors: registerProcessors}
    });

    sut = new Annotation();

    it('has retain set false', function(){
        expect(sut.retain).to.equal(false);
    });

    it('has priority set to Cocktail.SEQUENCE.ANNOTATION', function(){
        expect(sut.priority).to.equal(Cocktail.SEQUENCE.ANNOTATION);
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

        describe('registers the subject as a processor in Cocktail', function(){

            it('adds a new processor in the form of `@`+parameter', function(){
                var Subject = function(){};

                sut.setParameter(name);
                sut.process(Subject);

                expect(registerProcessors).to.have.been.calledWith({'@custom': Subject});
            });

        });

    });
});  

'use strict';

var chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),
    expect = chai.expect,
    cocktail = require('../../../../lib/cocktail'),
    proxyquire = require("proxyquire");

chai.use(sinonChai);

describe('Annotation Processor @annotation', function(){
    var Annotation,
        registerProcessors = sinon.spy(),
        sut;

    Annotation =  proxyquire('../../../../lib/processor/annotation/Annotation.js', {
        '../../cocktail': {registerProcessors: registerProcessors}
    });

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
                sut.process(Subject);

                expect(registerProcessors).to.have.been.calledWith({'@custom': Subject});
            });
        });

    });
});  

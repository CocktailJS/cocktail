'use strict';

var expect = require('chai').expect,
    Cocktail = require('../../../lib/Cocktail'),
    NoOp = require('../../../lib/processor/NoOp');

describe('NoOp Processor', function(){
    var sut = new NoOp();

    it('has retain set false', function(){
        expect(sut.retain).to.equal(false);
    });

    it('has priority set to Cocktail.SEQUENCE.NO_OP', function(){
        expect(sut.priority).to.equal(Cocktail.SEQUENCE.NO_OP);
    });

    it('a NoOP processor instance has no process method', function(){
        expect(sut.process).to.be.an('undefined');
    });

    it('a NoOP processor instance setParameter does nothing', function(){
        sut.setParameter('Whatever');
        
        expect(sut.getParameter()).to.equal(undefined);
    });
});  

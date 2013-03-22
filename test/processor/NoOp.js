'use strict';

var expect = require('chai').expect,
    NoOp = require('../../lib/processor/NoOp.js');

describe('NoOp Processor', function(){
    var sut = new NoOp();

    it('has retain set false', function(){
        expect(sut.retain).to.equal(false);
    });

    it('has priority set to -1 so it is not picked up for the running queue', function(){
        expect(sut.priority).to.equal(-1);
    });

    it('a NoOP processor instance has no process method', function(){
        expect(sut.process).to.be.an('undefined');
    });
});  

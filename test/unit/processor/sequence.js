'use strict';

var expect = require('chai').expect,
    sequence = require('../../../lib/processor/sequence');

describe('sequence', function(){

    it('NO_OP should be -1', function(){
        expect(sequence.NO_OP).to.equal(-1);
    });

    it('EXTENDS, PROPERTIES, REQUIRES, MERGE, TRAITS and ANNOTATION priority should be defined and bigger than 0', function(){
        expect(sequence.EXTENDS).to.be.above(0);
        expect(sequence.PROPERTIES).to.be.above(0);
        expect(sequence.MERGE).to.be.above(0);
        expect(sequence.REQUIRES).to.be.above(0);
        expect(sequence.TRAITS).to.be.above(0);
        expect(sequence.ANNOTATION).to.be.above(0);
    });

    it('EXTENDS has priority over PROPERTIES, REQUIRES, MERGE, TRAITS and ANNOTATION', function(){
        expect(sequence.PROPERTIES).to.be.above(sequence.EXTENDS);
        expect(sequence.REQUIRES).to.be.above(sequence.EXTENDS);
        expect(sequence.MERGE).to.be.above(sequence.EXTENDS);
        expect(sequence.TRAITS).to.be.above(sequence.EXTENDS);
        expect(sequence.ANNOTATION).to.be.above(sequence.EXTENDS);
    });

    it('PROPERTIES has priority over REQUIRES, MERGE, TRAITS and ANNOTATION', function(){
        expect(sequence.REQUIRES).to.be.above(sequence.PROPERTIES);
        expect(sequence.MERGE).to.be.above(sequence.PROPERTIES);
        expect(sequence.TRAITS).to.be.above(sequence.PROPERTIES);
        expect(sequence.ANNOTATION).to.be.above(sequence.PROPERTIES);
    });

    it('REQUIRES has priority over MERGE, TRAITS and ANNOTATION', function(){
        expect(sequence.MERGE).to.be.above(sequence.REQUIRES);
        expect(sequence.TRAITS).to.be.above(sequence.REQUIRES);
        expect(sequence.ANNOTATION).to.be.above(sequence.REQUIRES);
    });

    it('MERGE has priority over TRAITS and ANNOTATION', function(){
        expect(sequence.TRAITS).to.be.above(sequence.MERGE);
        expect(sequence.ANNOTATION).to.be.above(sequence.MERGE);
    });

    it('TRAITS has priority over ANNOTATION', function(){
        expect(sequence.ANNOTATION).to.be.above(sequence.TRAITS);
    });

});
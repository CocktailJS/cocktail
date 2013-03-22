'use strict';

var expect = require('chai').expect,
    Merge = require('../../../lib/processor/annotation/Merge.js');

describe('Annotation Processor @merge', function(){
    var sut = new Merge();

    it('has retain set false', function(){
        expect(sut.retain).to.equal(false);
    });

    it('has priority set to 99 so it runs after inheritance processors', function(){
        expect(sut.priority).to.equal(99);
    });

    describe('Parameter for @merge annotation', function(){

        it('accepts {String} as parameter', function(){
            var sut = new Merge(),
                strategy = "single";

            sut.setParameter(strategy);

            expect(sut.getParameter()).to.be.equal(strategy);
        });
    });

    describe('Merge process', function(){
        var strategy;

        describe('`single` merge strategy', function(){
            strategy = "single";

            it('adds properties and/or methods defined in proto into subject object', function(){
                var subject = {},
                    proto = {
                        property: 1,
                        method: function(){}
                    };

                sut.setParameter(strategy);
                sut.process(subject, proto);

                expect(subject).to.have.property('property').that.equal(1);
                expect(subject).to.respondTo('method');
            });

            it('adds properties and/or methods defined in proto into Subject class', function(){
                var Subject = function(){},
                    proto = {
                        property: 1,
                        method: function(){}
                    };

                sut.setParameter(strategy);
                sut.process(Subject, proto);

                expect(Subject.prototype).to.have.property('property').that.equal(1);
                expect(Subject).to.respondTo('method');
            });

            it('overrides properties and/or methods defined in subject object if they have the same name', function(){
                var aMethod = function(){},
                    subject = {
                        property: 0,
                        override: function(){}
                    },
                    proto = {
                        property: 1,
                        method: function(){},
                        override: aMethod
                    };

                sut.setParameter(strategy);
                sut.process(subject, proto);

                expect(subject).to.have.property('property').that.equal(1);
                expect(subject).to.respondTo('method');
                expect(subject).to.respondTo('override');
                expect(subject.override).to.be.equal(aMethod);
            });

            it('overrides properties and/or methods defined in Subject class if they have the same name', function(){
                var aMethod = function(){},
                    Subject = function(){},
                    proto = {
                        property: 1,
                        method: function(){},
                        override: aMethod
                    };

                Subject.prototype.property = 0;
                Subject.prototype.override = function(){};    

                sut.setParameter(strategy);
                sut.process(Subject, proto);

                expect(Subject.prototype).to.have.property('property').that.equal(1);
                expect(Subject).to.respondTo('method');
                expect(Subject).to.respondTo('override');
                expect(Subject.prototype.override).to.be.equal(aMethod);
            });


        });

    });
});  

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

        describe('`single` merge strategy', function(){
            var strategy = "single";

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


        describe('`their` merge strategy', function(){
            var strategy = "their";

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

            it('does NOT override properties and/or methods defined in subject object if they have the same name', function(){
                var aMethod = function(){},
                    subject = {
                        property: 0,
                        override: aMethod
                    },
                    proto = {
                        property: 1,
                        method: function(){},
                        override: function(){}
                    };

                sut.setParameter(strategy);
                sut.process(subject, proto);

                expect(subject).to.have.property('property').that.equal(0);
                expect(subject).to.respondTo('method');
                expect(subject).to.respondTo('override');
                expect(subject.override).to.be.equal(aMethod);
            });

            it('does NOT override properties and/or methods defined in Subject class if they have the same name', function(){
                var aMethod = function(){},
                    Subject = function(){},
                    proto = {
                        property: 1,
                        method: function(){},
                        override: function(){}
                    };

                Subject.prototype.property = 0;
                Subject.prototype.override = aMethod;    

                sut.setParameter(strategy);
                sut.process(Subject, proto);

                expect(Subject.prototype).to.have.property('property').that.equal(0);
                expect(Subject).to.respondTo('method');
                expect(Subject).to.respondTo('override');
                expect(Subject.prototype.override).to.be.equal(aMethod);
            });

        });


        describe('`deep-mine` merge strategy', function(){
            var strategy = "deep-mine";

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

            it('overrides properties defined in subject object if they have the same name, if the target property is an object it merges the content using strategy mine', function(){
                var subject = {
                        property: {
                            sub1 : 0,
                            sub2: 1
                        }
                    },
                    proto = {
                        property: {
                            sub1: 1
                        }
                    };

                sut.setParameter(strategy);
                sut.process(subject, proto);

                expect(subject.property).to.have.property('sub1').that.equal(1);
                expect(subject.property).to.have.property('sub2').that.equal(1);
            });

            it('overrides properties defined in subject object if they have the same name, if the target property is an array it concatenates the content', function(){
                var subject = {
                        arr: [1,2,3]
                    },
                    proto = {
                        arr: [4,5,6]
                    };

                sut.setParameter(strategy);
                sut.process(subject, proto);
                expect(subject.arr).to.eql([1,2,3,4,5,6]);
            });
        });

        describe('`deep-their` merge strategy', function(){
            var strategy = "deep-their";

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

            it('overrides properties defined in subject object if they have the same name, if the target property is an object it merges the content using strategy their', function(){
                var subject = {
                        property: {
                            sub1 : 0
                            
                        }
                    },
                    proto = {
                        property: {
                            sub1: 1,
                            sub2: 1
                        }
                    };

                sut.setParameter(strategy);
                sut.process(subject, proto);

                expect(subject.property).to.have.property('sub1').that.equal(0);
                expect(subject.property).to.have.property('sub2').that.equal(1);
            });

            it('overrides properties defined in subject object if they have the same name, if the target property is an array it concatenates the content', function(){
                var subject = {
                        arr: [1,2,3]
                    },
                    proto = {
                        arr: [4,5,6]
                    };

                sut.setParameter(strategy);
                sut.process(subject, proto);
                expect(subject.arr).to.eql([1,2,3,4,5,6]);
            });
        });

    });
});  

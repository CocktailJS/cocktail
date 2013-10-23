'use strict';

var chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),
    expect = chai.expect,
    cocktail = require('../../lib/cocktail'),
    RestoreProcessors = require('../helper/RestoreProcessors');

chai.use(sinonChai);

cocktail.mix(cocktail, {
    '@talents': [RestoreProcessors]
});

describe('cocktail', function(){
    var Merge   = function Merge(){},
        mergeProcessSpy = sinon.spy(),
        mergeSetParameterSpy = sinon.spy(),
        MergeSpy;

    Merge.prototype.name = 'spyMerge';    
    Merge.prototype.priority = 99;
    Merge.prototype.process = mergeProcessSpy;
    Merge.prototype.setParameter = mergeSetParameterSpy;

    MergeSpy = sinon.spy(Merge);

    beforeEach(function(){
        cocktail.clearProcessors();
        cocktail.registerProcessors({
            '@merge': MergeSpy
        });
    });

    afterEach(function(){
        cocktail.restoreDefaultProcessors();
    });


    describe('Registering processors', function(){
        var Processor = function(){};    

        it('Adds new processor/s to registered processors list', function(){
            cocktail.registerProcessors({
                '@processor': Processor
            });

            expect(cocktail.getProcessors()).to.have.property('@processor');
        });

    });

    describe('Mix', function(){
        var MyClass = function(){},
            anObject = {};

        describe('mix()', function(){
            it('returns `undefined` if no args are passed.', function(){
                expect(cocktail.mix()).to.be.an('undefined');
            });
        });
        
        describe('mix({Class} MyClass)', function(){
            it('returns the same MyClass if no other arguments are specified.', function(){
                expect(cocktail.mix(MyClass)).to.be.equal(MyClass);
            });
        });

        describe('mix({Object} anObject)', function(){
            it('returns the same anObject if no other arguments are specified.', function(){
                expect(cocktail.mix(anObject)).to.be.equal(anObject);
            });
        });

        describe('mix({Object} classDefinition)', function(){

            it('returns the a class if one single argument is specified with constructor.', function(){
                var sut;

                sut = cocktail.mix({
                    constructor: function() {}
                });

                expect(sut).to.be.a('function');
            });

            it('returns a class if one single argument is specified with an @extends annotation.', function(){
                var MyClass = function(){},
                    sut;

                sut = cocktail.mix({
                    '@extends': MyClass
                });

                expect(sut).to.be.a('function');
            });

            it('returns a class if one single argument is specified with a @traits annotation.', function(){
                var MyTrait = function(){},
                    sut;

                MyTrait.prototype.method = function(){};

                sut = cocktail.mix({
                    '@traits': [MyTrait]
                });

                expect(sut).to.be.a('function');

            });

            it('constructor defined in the classDefinition should not be enumerable.', function(){
                var sut;

                sut = cocktail.mix({
                    constructor: function() {
                    }
                });

                expect(sut).to.be.a('function');

                expect(sut.prototype).to.not.contain.keys('constructor');
            });


        });

        describe('mix({Class} MyClass, {Object} prototype)', function(){
            var MyClass = function(){},
                aMethod = function method(){};
 

            it('calls merge processor with MyClass and proto', function(){
                var proto = {
                        method: aMethod,
                        property : 1
                    };

                expect(cocktail.mix(MyClass, proto)).to.be.a('function');

                expect(mergeSetParameterSpy).to.be.calledWith("single");
                expect(mergeProcessSpy).to.be.calledWith(MyClass, proto);

            });

        });

        describe('mix({Object} anObject, {Object} prototype)', function(){
            var anObject = {},
                aMethod = function method(){};

            it('calls merge processor with MyClass and proto', function(){
                 var proto = {
                        method: aMethod,
                        property : 1
                    };

                expect(cocktail.mix(anObject, proto)).to.be.an('object');

                expect(mergeSetParameterSpy).to.be.calledWith("single");
                expect(mergeProcessSpy).to.be.calledWith(anObject, proto);
            });

        });

        describe('mix({Class} MyClass, {Object} prototype {\'@merge\': \'strategy\'})', function(){
            var MyClass = function(){},
                strategy = 'strategy';
 
            it('calls merge processor with MyClass and proto and uses the merge strategy defined by `@merge`', function(){
                expect(
                    cocktail.mix(MyClass, {
                        '@merge': strategy,
                        property: 1
                    })
                ).to.be.a('function');

                expect(mergeSetParameterSpy).to.be.calledWith(strategy);
                expect(mergeProcessSpy).to.be.calledWith(MyClass, {property: 1});

            });
        });

    });
});

'use strict';

var chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),
    expect = chai.expect,
    Cocktail = require('../../lib/Cocktail.js');

chai.use(sinonChai);

describe('Cocktail', function(){
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
        Cocktail.clearProcessors();
        Cocktail.registerProcessors({
            '@merge': MergeSpy
        });
    });

    afterEach(function(){

    });


    describe('Registering processors', function(){
        var Processor = function(){};    

        it('Adds new processor/s to registered processors list', function(){
            Cocktail.registerProcessors({
                '@processor': Processor
            });

            expect(Cocktail.getProcessors()).to.have.property('@processor');
        });

    });

    describe('Mix', function(){
        var MyClass = function(){},
            anObject = {};

        describe('mix()', function(){
            it('returns `undefined` if no args are passed.', function(){
                expect(Cocktail.mix()).to.be.an('undefined');
            });
        });
        
        describe('mix({Class} MyClass)', function(){
            it('returns the same MyClass if no other arguments are specified.', function(){
                expect(Cocktail.mix(MyClass)).to.be.equal(MyClass);
            });
        });

        describe('mix({Object} anObject)', function(){
            it('returns the same anObject if no other arguments are specified.', function(){
                expect(Cocktail.mix(anObject)).to.be.equal(anObject);
            });
        });

        describe('mix({Object} classDefinition)', function(){

            it('returns the a class if one single argument is specified with constructor.', function(){
                var sut;

                sut = Cocktail.mix({
                    constructor: function() {}
                });

                expect(sut).to.be.a('function');
            });

            it('returns a class if one single argument is specified with an @extends annotation.', function(){
                var MyClass = function(){},
                    sut;

                sut = Cocktail.mix({
                    '@extends': MyClass
                });

                expect(sut).to.be.a('function');
            });

            it('returns a class if one single argument is specified with a @traits annotation.', function(){
                var MyTrait = function(){},
                    sut;

                MyTrait.prototype.method = function(){};

                sut = Cocktail.mix({
                    '@traits': [MyTrait]
                });

                expect(sut).to.be.a('function');

            });

            it('constructor defined in the classDefinition should not be enumerable.', function(){
                var sut;

                sut = Cocktail.mix({
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

                expect(Cocktail.mix(MyClass, proto)).to.be.a('function');

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

                expect(Cocktail.mix(anObject, proto)).to.be.an('object');

                expect(mergeSetParameterSpy).to.be.calledWith("single");
                expect(mergeProcessSpy).to.be.calledWith(anObject, proto);
            });

        });

        describe('mix({Class} MyClass, {Object} prototype {\'@merge\': \'strategy\'})', function(){
            var MyClass = function(){},
                strategy = 'strategy';
 
            it('calls merge processor with MyClass and proto and uses the merge strategy defined by `@merge`', function(){
                expect(
                    Cocktail.mix(MyClass, {
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

// describe('Cocktail Annotations', function(){

//     it('Annotations are not added to MyClass prototype', function(){
//         var MyClass = function(){},
//             annotatedProto = {'@annotation': true};

//         Cocktail.mix(MyClass, annotatedProto);
        
//         expect(MyClass.prototype).to.not.have.property('@annotation');    
//     });

//     it('Annotations are not added to anObject', function(){
//         var anObject = {},
//             annotatedProto = {'@annotation': true};

//         Cocktail.mix(anObject, annotatedProto);
        
//         expect(anObject).to.not.have.property('@annotation');
//     });

//     describe('Extending a class using `@extends`', function(){
//         var BaseClass = function(){},
//             aMethod = function method(){},
//             MyClass = function(){};

//         BaseClass.prototype.method = aMethod;
//         BaseClass.prototype.property = 1;
//         BaseClass.prototype.overrided = 1;


//         describe('mix({Class} MyClass, {Object} annotatedPrototype: {\'@extends\': BaseClass})', function(){
//             Cocktail.mix(MyClass, {
//                 '@extends': BaseClass,
//                 overrided : 2
//             });

//             it('returns MyClass that extends from BaseClass', function(){
//                 expect(MyClass).respondTo('method');
//                 expect(MyClass.prototype).to.have.property('property');
//                 expect(MyClass.prototype).to.have.property('overrided');
//             });

//             it('overrides properties and methods in the base class by defining them on its prototype', function(){
//                 expect(MyClass).to.respondTo('method');
//                 expect(MyClass.prototype).to.have.property('overrided').that.is.equal(2);
//             });

//             it('an instance of MyClass should be instance of `BaseClass` and `MyClass`', function(){
//                 var instance = new MyClass();

//                 expect(instance).to.be.instanceof(MyClass);
//                 expect(instance).to.be.instanceof(BaseClass);

//             });
//         });

//     });

//     describe('Declaring properties with `@properties`', function(){
//         var MyClass = function(){};

//         describe('mix({Class} MyClassm {Object} annotatedPrototype: {\'@properties\': [/*properties*/]})', function(){
//             Cocktail.mix(MyClass, {
//                 '@properties': {'property': 'value'}
//             });

//             it('creates getter and setter for `property` in the form getProperty/setProperty', function(){
//                 expect(MyClass.prototype).to.respondTo('getProperty');
//                 expect(MyClass).to.respondTo('setProperty');
//             });
//         });

//     });
// });

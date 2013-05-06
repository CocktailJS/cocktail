'use strict';

var chai = require("chai"),
    expect = chai.expect,
    Cocktail = require('../../../lib/Cocktail'),
    Requires = require('../../../lib/processor/annotation/Requires.js'),
    Traits = require('../../../lib/processor/annotation/Traits.js');

describe('Annotation Processor @traits', function(){
    var sut = new Traits();

    it('has retain set false', function(){
        expect(sut.retain).to.equal(false);
    });

    it('has priority set to Cocktail.SEQUENCE.TRAITS', function(){
        expect(sut.priority).to.equal(Cocktail.SEQUENCE.TRAITS);
    });

    describe('Parameter for @traits annotation', function(){

        it('accepts an array of Traits as parameter', function(){
            var sut = new Traits(),
                traitDef = {};

            sut.setParameter([traitDef]);

            expect(sut.getParameter()).to.contain(traitDef);
        });
    });

    describe('Traits process', function(){
        
        describe('Passing a Trait reference `@traits:[TraitA]`', function(){
            var sut = new Traits(),
                TraitA = function(){},
                MyClass = function(){},
                aMethod = function method(){};

            TraitA.prototype.aMethod = aMethod;
            MyClass.prototype.foo = 1;

            sut.setParameter([TraitA]);

            sut.process(MyClass);

            it('makes the TraitA methods part of the given MyClass', function(){
                expect(MyClass).to.respondTo('aMethod');
                expect(MyClass.prototype.aMethod).to.be.equal(aMethod);
            });
        });

        describe('Passing a Trait using options object `@traits: [{trait: TraitA}]`', function(){
            var sut = new Traits(),
                TraitA = function(){},
                MyClass = function(){},
                aMethod = function method(){};

            TraitA.prototype.aMethod = aMethod;
            MyClass.prototype.foo = 1;

            sut.setParameter([{trait: TraitA}]);

            sut.process(MyClass);

            it('makes the TraitA methods part of the given MyClass', function(){
                expect(MyClass).to.respondTo('aMethod');
                expect(MyClass.prototype.aMethod).to.be.equal(aMethod);
            });
        });

        describe('A Trait must not contain state', function(){
            var sut = new Traits(),
                TraitA = function(){},
                MyClass = function(){},
                aMethod = function method(){};

            TraitA.prototype.aMethod = aMethod;
            TraitA.prototype.state = '1';

            sut.setParameter([TraitA]);

            it('throws exception if there is any state in the Trait definition', function(){
                expect(function(){ sut.process(MyClass); }).to.throw(Error, /Trait MUST NOT contain any state/);
            });
        });

        describe('Traits are applied not matter the order they are listed', function(){
            var sut = new Traits(),
                TraitA = function(){},
                TraitB = function(){},
                MyClass = function(){},
                AnotherClass = function(){},
                aMethod = function method(){},
                anotherMethod = function anotherMethod(){};

            TraitA.prototype.aMethod = aMethod;

            TraitB.prototype.anotherMethod = anotherMethod;


            it('creates the same result no matter the order of traits', function(){
                sut.setParameter([TraitA, TraitB]);
                sut.process(MyClass);

                sut.setParameter([TraitB, TraitA]);
                sut.process(AnotherClass);

                expect(MyClass.prototype).to.be.eql(AnotherClass.prototype);

            });

        });


        describe('Traits are applied not matter the order they are created', function(){
            var sut = new Traits(),
                TraitA = function(){},
                TraitB = function(){},
                MyClass = function(){},
                AnotherClass = function(){},
                aMethod = function method(){},
                anotherMethod = function anotherMethod(){};

            TraitA.prototype.aMethod = aMethod;

            //TraitB contains TraitA
            TraitB.prototype.aMethod = aMethod;
            TraitB.prototype.anotherMethod = anotherMethod;


            it('creates the same result no matter the order of traits', function(){
                sut.setParameter([TraitA, TraitB]);
                sut.process(MyClass);

                sut.setParameter([TraitB, TraitA]);
                sut.process(AnotherClass);

                expect(MyClass.prototype).to.be.eql(AnotherClass.prototype);

            });

        });

        describe('Excluding method from TraitA `@traits: [{trait: TraitA, excludes:[\'anotherMethod\']}]`', function(){
            var sut = new Traits(),
                TraitA = function(){},
                MyClass = function(){},
                aMethod = function method(){},
                anotherMethod = function anotherMethod(){};

            TraitA.prototype.aMethod = aMethod;
            TraitA.prototype.anotherMethod = anotherMethod;

            MyClass.prototype.foo = 1;

            sut.setParameter([{trait: TraitA, excludes:['anotherMethod']}]);

            sut.process(MyClass);

            it('excludes anotherMethod from TraitA so it is not part of MyClass', function(){
                expect(MyClass).to.respondTo('aMethod');
                expect(MyClass.prototype.aMethod).to.be.equal(aMethod);
                expect(MyClass).to.not.respondTo('anotherMethod');
            });
        });

        describe('Aliasing methods from trait `@traits: [{trait: TraitA, alias:{\'anotherMethod\': \'myAnother\'}}]`', function(){
            var sut = new Traits(),
                TraitA = function(){},
                MyClass = function(){},
                aMethod = function method(){},
                anotherMethod = function anotherMethod(){};

            TraitA.prototype.aMethod = aMethod;
            TraitA.prototype.anotherMethod = anotherMethod;

            MyClass.prototype.foo = 1;

            sut.setParameter([
                {
                    trait: TraitA, 
                    alias:{'anotherMethod': 'myAnother'}
                }
            ]);

            sut.process(MyClass);

            it('creates alias myAnother in MyClass for TraitA method anotherMethod', function(){
                expect(MyClass).to.respondTo('aMethod');
                expect(MyClass.prototype.aMethod).to.be.equal(aMethod);
                expect(MyClass).to.not.respondTo('anotherMethod');
                expect(MyClass).to.respondTo('myAnother');
                expect(MyClass.prototype.myAnother).to.be.equal(anotherMethod);

            });
        });
    
        describe('Non Conflicts between TraitA and MyClass', function(){
            var sut = new Traits(),
                TraitA = function(){},
                MyClass = function(){},
                sameMethod = function(){},
                aMethod = function method(){},
                anotherMethod = function anotherMethod(){};

            TraitA.prototype.sameMethod = sameMethod;                
            TraitA.prototype.aMethod = Requires.requiredMethod;
            TraitA.prototype.aReqMethod = anotherMethod;

            MyClass.prototype.sameMethod = sameMethod;
            MyClass.prototype.aReqMethod = Requires.requiredMethod;
            MyClass.prototype.aMethod = aMethod;

            sut.setParameter([TraitA]);

            it('does not generate a conflict if both method are the same.', function(){
                expect(function(){sut.process(MyClass);}).not.to.throw(Error, /aMethod is defined in trait and Class/);
                expect(MyClass).to.respondTo('sameMethod');
                expect(MyClass.prototype.sameMethod).to.be.equal(sameMethod);
            });

            it('does not generate a conflict if the method is already defined by the class but it is a required one from trait.', function(){
                expect(function(){sut.process(MyClass);}).not.to.throw(Error, /aMethod is defined in trait and Class/);
                expect(MyClass).to.respondTo('aMethod');
                expect(MyClass.prototype.aMethod).to.not.be.equal(Requires.requiredMethod);
                expect(MyClass.prototype.aMethod).to.be.equal(aMethod);
            });

            it('does not generate a conflict if the method is already defined by the class and it is a required one from another trait.', function(){
                expect(function(){sut.process(MyClass);}).not.to.throw(Error, /aMethod is defined in trait and Class/);
                expect(MyClass).to.respondTo('aReqMethod');
                expect(MyClass.prototype.aReqMethod).to.not.be.equal(Requires.requiredMethod);
                expect(MyClass.prototype.aReqMethod).to.be.equal(anotherMethod);
            });
        });

        describe('Conflicts between TraitA and MyClass', function(){
            var sut = new Traits(),
                TraitA = function(){},
                MyClass = function(){},
                aMethod = function method(){},
                anotherMethod = function anotherMethod(){};
                
            TraitA.prototype.aMethod = aMethod;
            TraitA.prototype.anotherMethod = anotherMethod;

            MyClass.prototype.aMethod = function myMethod(){};

            sut.setParameter([TraitA]);

            it('generates a conflict if a method defined in TraitA is already defined by MyClass.', function(){
                expect(function(){sut.process(MyClass);}).to.throw(Error, /aMethod is defined in trait and Class/);
            });

        });

    }); 
});
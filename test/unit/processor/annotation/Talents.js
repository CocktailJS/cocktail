'use strict';

var chai = require('chai'),
	cocktail = require('../../../../lib/cocktail'),
	// Requires = require('../../../../lib/processor/annotation/Requires.js'),
	Talents = require('../../../../lib/processor/annotation/Talents.js');

var expect = chai.expect;

describe('Annotation Processor @talents', function(){
	var sut = new Talents();

	it('has retain set false', function(){
		expect(sut.retain).to.equal(false);
	});

	it('has priority set to cocktail.SEQUENCE.TRAITS', function(){
		expect(sut.priority).to.equal(cocktail.SEQUENCE.TRAITS);
	});

	describe('Parameter for @talents annotation', function(){

		it('accepts an array of Talents as parameter', function(){
			var sut = new Talents(),
				traitDef = {};

			sut.setParameter([traitDef]);

			expect(sut.getParameter()).to.contain(traitDef);
		});
	});

	describe('Talents process', function(){

		describe('Passing a Talent reference `@talents:[TalentA]`', function(){
			var sut = new Talents(),
				TalentA = function(){},
				myObj = {},
				aMethod = function method(){};

			TalentA.prototype.aMethod = aMethod;
			myObj.foo = 1;

			sut.setParameter([TalentA]);

			sut.process(myObj);

			it('makes the TalentA methods part of the given myObj', function(){
				expect(myObj).to.respondTo('aMethod');
				expect(myObj.aMethod).to.be.equal(aMethod);
			});
		});


		describe('Passing a Talent using options object `@talents: [{talent: TalentA}]`', function(){
			var sut = new Talents(),
				TalentA = function(){},
				myObj = {},
				aMethod = function method(){};

			TalentA.prototype.aMethod = aMethod;
			myObj.foo = 1;

			sut.setParameter([{talent: TalentA}]);

			sut.process(myObj);

			it('makes the TalentA methods part of the given myObj', function(){
				expect(myObj).to.respondTo('aMethod');
				expect(myObj.aMethod).to.be.equal(aMethod);
			});
		});

		describe('Passing a Talent reference `@talents:[TalentA]` to a Class', function(){
			var sut = new Talents(),
				TalentA = function(){},
				MyClass = function(){},
				aMethod = function method(){};

			TalentA.prototype.aMethod = aMethod;
			MyClass.prototype.foo = 1;

			sut.setParameter([TalentA]);

			sut.process(MyClass);

			it('makes the TalentA methods part of the given MyClass as static method', function(){
				expect(MyClass).to.not.respondTo('aMethod');
				expect(MyClass.aMethod).to.be.equal(aMethod);
			});
		});

	});
});

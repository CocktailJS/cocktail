'use strict';

var chai = require('chai'),
    cocktail = require('../../lib/cocktail'),
    RestoreProcessors = require('../helper/RestoreProcessors');

var expect = chai.expect;

cocktail.mix(cocktail, {
    '@talents': [RestoreProcessors]
});

describe('cocktail Integration Test: merge', function(){
    beforeEach(function(){
        cocktail.restoreDefaultProcessors();
    });

    afterEach(function(){
        cocktail.restoreDefaultProcessors();
    });

    describe('`@exports` annotation registers the current mix as the specified value', function(){
        var Custom = function(){};

        it('exports the current mix in the specified value', function() {
            var module = {
                exports: undefined
            };

            cocktail.mix(Custom, {
                '@exports': module,

                some: 'a',

                aMethod: function(){}
            });

            expect(module.exports).to.not.be.an('undefined');
            expect(module.exports).to.respondTo('aMethod');
        });

        it('exports the current class definition in the specified value', function() {
            var module = {
                exports: undefined
            };

            cocktail.mix({
                '@exports': module,

                constructor: function() {/*Body*/},

                some: 'a',

                aMethod: function(){/*Body*/}
            });

            expect(module.exports).to.not.be.an('undefined');
            expect(module.exports).to.respondTo('aMethod');
        });

    });
});

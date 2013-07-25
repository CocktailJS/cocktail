/*
 *
 * Copyright (c) 2013 Maximiliano Fierro
 * Licensed under the MIT license.
 */
 'use strict';

var Cocktail = require('../../lib/Cocktail');

/**
 * @Talent
 * @Trait
 * RestoreProcessors is a talent to provide Cocktail a way to restore the modified processors list
 * back to the default configuration.
 * We separate this behavior since it might be used ONLY for TESTS.
 */
Cocktail.mix({
	'@exports': module,

	'@requires': [
		'setProcessors',
		'getDefaultProcessors'
	],

	/**
	 * @method restoreDefaultProcessors
	 * Wipes out the current processor list and restore back the default one.
	 */
	restoreDefaultProcessors: function () {
        var key,
            defaultProcessors = this.getDefaultProcessors(),
            processors = {};

        for(key in defaultProcessors){
            if(defaultProcessors.hasOwnProperty(key)) {
                processors[key] = defaultProcessors[key];
            }
        }

        this.setProcessors(processors);
	},

	/**
	 * @method clearProcessors
	 * Removes all the processors but NO-OP to create a state of a clear instance for tests purposes.
	 */
    clearProcessors: function() {
        var processors = this.getProcessors(),
            key;
        for(key in processors){
            if(processors.hasOwnProperty(key) && key !== 'no-op'){
                delete processors[key];
            }        
        }
    }
});
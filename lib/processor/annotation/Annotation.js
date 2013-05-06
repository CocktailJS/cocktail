/*
 *
 * Copyright (c) 2013 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';


var Cocktail = require('../../Cocktail'),
    sequence = require('../sequence'),
    Annotation = function(){};

Annotation.prototype = {
    retain   : false,
    priority : sequence.ANNOTATION,
    name     : '@annotation',

    _value: undefined,

    setParameter: function(value){
        this._value = value;
    },

    getParameter: function() {
        return this._value;
    },

    process: function(subject /*, proto*/){
        var name = '@'+this.getParameter(),
            processor = {};

        processor[name] = subject;
            
        Cocktail.registerProcessors(processor);
    }

};

module.exports =  Annotation;


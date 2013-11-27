/*
 *
 * Copyright (c) 2013 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';


var sequence = require('../sequence'),
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

    process: function(subject){
        var name = '@'+this.getParameter();

        subject.prototype.name = name;
    }

};

module.exports =  Annotation;

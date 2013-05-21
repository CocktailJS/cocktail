/*
 *
 * Copyright (c) 2013 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';


var sequence = require('../sequence'),
    Exports = function(){};

Exports.prototype = {
    retain   : false,
    priority : sequence.EXPORTS,
    name     : '@extends',

    _value: undefined,


    setParameter: function(value) {
        this._value = value;
    },

    getParameter: function() {
        return this._value;
    },

    process: function(subject /*, proto*/){
        var value = this.getParameter();
        
        if(value){
            value['exports'] = subject;    
        }
        
    }
};

module.exports = Exports;
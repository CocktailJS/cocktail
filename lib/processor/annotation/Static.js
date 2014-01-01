/*
 *
 * Copyright (c) 2013 - 2014 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';


var sequence = require('../sequence'),
    Merge    = require('./Merge'),
    Static   = function(){};

Static.prototype = {
    retain   : false,
    priority : sequence.POST_MERGE,
    name     : '@static',

    _parameter: undefined,

    setParameter: function(value){
        if(Object.prototype.toString.call(value) !== '[object Object]'){
             throw new Error('@static parameter should be an Object');
        }
        this._parameter = value;
    },

    getParameter: function() {
        return this._parameter;
    },

    process: function(subject){
        var statics = this.getParameter(),
            merger  = new Merge({usePrototypeWhenSubjectIsClass: false});

        merger.setParameter('mine');

        merger.process(subject, statics);

    }

};

module.exports = Static;

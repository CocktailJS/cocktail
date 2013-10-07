/*
 *
 * Copyright (c) 2013 Maximiliano Fierro
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
        this._parameter = value;
    },

    getParameter: function() {
        return this._parameter;
    },

    process: function(subject){
        var statics = this.getParameter(),
            merger  = new Merge();

        merger.setParameter('mine');

        merger.process(subject, statics, true);

    }

};

module.exports = Static;

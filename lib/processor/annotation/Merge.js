/*
 *
 * Copyright (c) 2013 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';

var Merge = function(){};

Merge.prototype = {
    priority : 99,
    retain   : false,
    value    : undefined,
    name     : '@merge',

    _value: undefined,

    setParameter: function(value){
        this._value = value;
    },

    getParameter: function() {
        return this._value;
    },

    _merge : function(mine, their){
        var key;

        for(key in their){
            if(their.hasOwnProperty(key)){
                mine[key] = their[key];
            }
        }

        return mine;
    },

    process: function(subject, proto){
        var their = proto,
            mine = subject.prototype || subject;

        this._merge(mine, their);   
    }
};

module.exports = Merge;
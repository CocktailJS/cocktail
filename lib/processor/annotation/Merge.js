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
    name     : '@merge',

    _value   : undefined,

    _strategies: {
        'single' : '_mergeMine',
        'mine'   : '_mergeMine',
        'their'  : '_mergeTheir'
    },

    setParameter: function(value){
        this._value = value;
    },

    getParameter: function() {
        return this._value;
    },

    /**
     * mine merge strategy: mine params over their. If params is already defined it gets overriden.
     */
    _mergeMine : function(mine, their){
        var key;

        for(key in their){
            if(their.hasOwnProperty(key)){
                mine[key] = their[key];
            }
        }

        return mine;
    },

    /**
     * their merge strategy: their params over mine. If params is already defined it doesn't get overriden.
     */
    _mergeTheir : function(mine, their){
        var key;

        for(key in their){
            if(their.hasOwnProperty(key) && !their[key]){
                mine[key] = their[key];
            }
        }

        return mine;        
    },

    process: function(subject, proto){
        var their = proto,
            mine = subject.prototype || subject,
            strategy = this._strategies[this.getParameter()];

        this[strategy](mine, their);   
    }
};

module.exports = Merge;
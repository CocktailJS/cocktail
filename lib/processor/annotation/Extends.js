/*
 *
 * Copyright (c) 2013 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';


var sequence = require('../sequence'),
    Extends = function(){};

Extends.prototype = {
    retain   : false,
    priority : sequence.EXTENDS,
    name     : '@extends',

    _value: undefined,

    setParameter: function(value){
        if(typeof value !== 'function'){
            throw new Error("Object cannot be extended");
        }
        this._value = value;
    },

    getParameter: function() {
        return this._value;
    },

    process: function(subject){
        var parent = this.getParameter(),
            sp;

        if(parent && parent.prototype){
            sp = Object.create(parent.prototype);

            sp.$super = parent;

            sp.callSuper = function(methodName){
                var mthd = this.$super.prototype[methodName],
                    mthdArgs = Array.prototype.slice.call(arguments, 1);
                if(mthd){
                   return mthd.apply(this, mthdArgs);
                }
            };
            subject.prototype =  sp;
        }
    }

};

module.exports = Extends;
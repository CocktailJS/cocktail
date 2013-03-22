/*
 *
 * Copyright (c) 2013 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';


var Requires = function(){};

Requires.requiredMethod = function required(){ throw new Error('method is marked as required but it has not been defined');};

Requires.prototype = {
    retain   : false,
    priority : 30,
    name     : '@requires',

    _value: [],

    setParameter: function(value){
        //TODO: validate parameter
        this._value = [].concat(value);
    },

    getParameter: function() {
        return this._value;
    },

    process: function(subject){
        var reqs = this.getParameter(), // always an []
            l = reqs.length,
            i;

        for(i = 0; i < l; i++){
            this._createRequiredMethod(subject, reqs[i]);
        }
    },

    _createRequiredMethod: function(sub, methodName){
        var subject = (sub.prototype || sub);
        
        if(!subject[methodName]){
            subject[methodName] = Requires.requiredMethod;
        }
        
    }

};

module.exports = Requires;    
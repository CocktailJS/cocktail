/*
 *
 * Copyright (c) 2013 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';


var Properties = function(){};

Properties.prototype = {
    retain   : false,
    priority : 20,
    name     : '@properties',

    _value: undefined,

    setParameter: function(value){
        if( !(value instanceof Object) ){
            console.warn('@properties parameter should be an Object');
            return;
        }
        this._value = value;
    },

    getParameter: function() {
        return this._value;
    },

    _capitalizeName: function(name){
        return (name.charAt(0).toUpperCase() + name.slice(1));
    },

    _getterName: function(property, value){
        return (value !== false && value !== true ? 'get' : 'is') + this._capitalizeName(property);
    },

    _setterName: function(property){
        return 'set' + this._capitalizeName(property);
    },

    _createPropertyFor: function(subject, name, value){

        //is it better to use __defineGetter__ here???
        subject[name] = value;
        subject[this._getterName(name, value)] = function(){return this[name];};
        subject[this._setterName(name)] = function(value){this[name] = value;};
    },

    process: function(subject){
        var properties = this.getParameter(),
            key;

        for(key in properties){
            if(properties.hasOwnProperty(key)){
                this._createPropertyFor(subject.prototype || subject, key, properties[key]);
            }
                
        }
    }

};

module.exports = Properties;
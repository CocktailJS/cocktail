/*
 *
 * Copyright (c) 2013 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';


var Requires = require('./Requires'),
    Traits = function(){};

Traits.prototype = {
    retain   : false,
    priority : 100,
    name     : '@traits',

    _value: [],

    setParameter: function(value){
        //TODO: validate parameter
        this._value = [].concat(value);
    },

    getParameter: function() {
        return this._value;
    },

    process: function(subject){
        var traits = this.getParameter(), // always an []
            l = traits.length,
            i;

        for(i = 0; i < l; i++){
            this._applyTraitTo(subject.prototype || subject, traits[i]);
        }
    },

    _applyTraitTo: function(subject, options){
        var key, tp, excluded, aliases, alias;

        if(typeof options === 'function'){
           return this._applyTraitTo(subject, {trait: options});
        }

        //TODO: validate trait (a trait should have only methods)

        excluded = [].concat(options.excludes);
        aliases = options.alias || {};
        tp = options.trait.prototype;

        for(key in tp){

            this._raiseErrorIfItIsState(key, tp);
            this._raiseErrorIfConflict(key, subject, tp);
            
            if(excluded.indexOf(key) === -1){
                alias = aliases[key] || key;
                
                if(!subject[alias] || subject[alias] === Requires.requiredMethod){
                    subject[alias] = tp[key]; 
                }
                    
            }
        }
    },

    _raiseErrorIfItIsState: function(key, traitProto){
        if(typeof traitProto[key] !== 'function'){
            throw new Error('Trait MUST NOT contain any state. Found: ' + key + ' as state while processing trait');
        }
    },

    _raiseErrorIfConflict: function(methodName, subjectProto, traitProto){
        var subjectMethod = subjectProto[methodName],
            traitMethod = traitProto[methodName],
            sameMethodName = (subjectMethod && traitMethod),
            methodsAreNotTheSame = (subjectMethod !== traitMethod),
            traitMethodIsNotARequired = (traitMethod !== Requires.requiredMethod),
            subjecMethodIsNotARequired = (subjectMethod !== Requires.requiredMethod);


        if(sameMethodName && methodsAreNotTheSame && traitMethodIsNotARequired && subjecMethodIsNotARequired){
            throw new Error('Same method named: ' + methodName + ' is defined in trait and Class.' );
        }
    }
};

module.exports = Traits;
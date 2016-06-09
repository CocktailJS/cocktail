/*
 *
 * Copyright (c) 2013 - 2015 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';

var sequence = require('../sequence');
var Requires = require('./Requires');

function Traits () {}

Traits.prototype = {
    retain   : false,
    priority : sequence.TRAITS,
    name     : '@traits',

    _configName: 'trait',

    _parameter: [],

    setParameter: function (value) {
        //TODO: validate parameter
        this._parameter = [].concat(value);
    },

    getParameter: function () {
        return this._parameter;
    },

    process: function (subject) {
        var traits = this.getParameter(), // always an []
            l = traits.length,
            i;

        for (i = 0; i < l; i++) {
            this._applyTo(subject.prototype || subject, traits[i]);
        }
    },

    _isApplicable: function (option) {
        var type = this._configName;
        return (typeof option === 'function') || (option && !option[type]);
    },

    _applyTo: function (subject, options) {
        var me = this,
            type = me._configName,
            o = {},
            tp, excluded, aliases, t;

        if (me._isApplicable(options)) {
            o[type] = options;
           me._applyTo(subject, o);
           return;
        }

        excluded = [].concat(options.excludes);
        aliases = options.alias || {};
        t = options[type];
        tp = t.prototype || t;

        Object.getOwnPropertyNames(tp)
            .filter(function(key){
                return !key.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/);
            })
            .forEach(function(key){
                me._raiseErrorIfItIsState(key, tp);
                me._applyIfNotExcluded(key, excluded, aliases, subject, tp);
            });
    },

    _applyIfNotExcluded: function (key, excluded, aliases, subject, tp) {
        var alias;
        if (excluded.indexOf(key) === -1) {
            alias = aliases[key] || key;

            this._raiseErrorIfConflict(alias, subject, tp);

            if (!subject[alias] || subject[alias] === Requires.requiredMethod) {
               Object.defineProperty(subject, alias, Object.getOwnPropertyDescriptor(tp, key));
            }
        }
    },

    _raiseErrorIfItIsState: function (key, traitProto) {
        if (typeof traitProto[key] !== 'function') {
            throw new Error('Trait MUST NOT contain any state. Found: ' + key + ' as state while processing trait');
        }
    },

    _raiseErrorIfConflict: function (methodName, subjectProto, traitProto) {
        var requiredMethodName = Requires.requiredMethod.name,
            subjectMethod = subjectProto[methodName],
            traitMethod = traitProto[methodName],
            sameMethodName = (subjectMethod && traitMethod),
            methodsAreNotTheSame = sameMethodName && (subjectMethod.toString() !== traitMethod.toString()),
            traitMethodIsNotARequired = sameMethodName && (traitMethod.name !== requiredMethodName),
            subjecMethodIsNotARequired = sameMethodName && (subjectMethod.name !== requiredMethodName);


        if (sameMethodName && methodsAreNotTheSame && traitMethodIsNotARequired && subjecMethodIsNotARequired) {
            throw new Error('Same method named: ' + methodName + ' is defined in trait and Class.' );
        }
    }
};

module.exports = Traits;

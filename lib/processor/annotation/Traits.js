/*
 *
 * Copyright (c) 2013 - 2014 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';


var sequence = require('../sequence');
var Requires = require('./Requires');
var Traits = function () {};

Traits.prototype = {
    retain   : false,
    priority : sequence.TRAITS,
    name     : '@traits',

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
            this._applyTraitTo(subject.prototype || subject, traits[i]);
        }
    },

    _applyTraitTo: function (subject, options) {
        var key, tp, excluded, aliases, alias, t;

        if (typeof options === 'function') {
           return this._applyTraitTo(subject, {trait: options});
        }

        excluded = [].concat(options.excludes);
        aliases = options.alias || {};
        t = options.trait || options.talent;
        tp = t.prototype;

        for (key in tp) {

            this._raiseErrorIfItIsState(key, tp);

            if (excluded.indexOf(key) === -1) {
                alias = aliases[key] || key;

                this._raiseErrorIfConflict(alias, subject, tp);

                if (!subject[alias] || subject[alias] === Requires.requiredMethod) {
                    subject[alias] = tp[key];
                }
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

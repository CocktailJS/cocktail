/*
 *
 * Copyright (c) 2013 - 2014 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';


var sequence = require('../sequence');
var Requires = function (){};

function $$required$$ () {
    throw new Error('method is marked as required but it has not been defined');
}

Requires.requiredMethod = $$required$$;

Requires.prototype = {
    retain   : false,
    priority : sequence.REQUIRES,
    name     : '@requires',

    _parameter: [],

    setParameter: function (value) {
        //TODO: validate parameter
        this._parameter = [].concat(value);
    },

    getParameter: function () {
        return this._parameter;
    },

    process: function (subject) {
        var reqs = this.getParameter(), // always an []
            l = reqs.length,
            i;

        for (i = 0; i < l; i++) {
            this._createRequiredMethod(subject, reqs[i]);
        }
    },

    _createRequiredMethod: function(sub, methodName){
        var subject = (sub.prototype || sub);

        if (!subject[methodName]) {
            subject[methodName] = Requires.requiredMethod;
        }

    }

};

module.exports = Requires;

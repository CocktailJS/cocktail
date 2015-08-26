/*
 *
 * Copyright (c) 2013 - 2015 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';

var sequence = require('../sequence');

function Extends () {}

Extends.prototype = {
    retain   : false,
    priority : sequence.EXTENDS,
    name     : '@extends',

    _parameter: undefined,

    setParameter: function (value) {
        if (!(value && value.prototype)) {
            throw new Error('@extends parameter should have a prototype');
        }
        this._parameter = value;
    },

    getParameter: function () {
        return this._parameter;
    },

    process: function (subject) {
        var parent = this.getParameter(),
            sp;

        subject.prototype = sp = Object.create(parent.prototype);

        sp.constructor = sp.$super = parent;

        sp.callSuper =(function($super) {
            var _parent = $super,
                lookUp  = false,
                mthdArgs;
            
            return function(methodName){
                var mthd, ret;

                if (lookUp) {
                    _parent = _parent.prototype.$super;
                } else {
                    mthdArgs = Array.prototype.slice.call(arguments, 1);
                }

                mthd = (methodName === 'constructor' ? _parent : _parent.prototype[methodName]);

                if (!mthd) {
                   throw new Error('callSuper: There is no method named ' + mthd + ' in parent class.');
                }
                
                lookUp = true;
                
                ret = mthd.apply(this, mthdArgs);

                lookUp = false;
                _parent = this.$super;

                return ret;
            };
        })(parent);


    }

};

module.exports = Extends;

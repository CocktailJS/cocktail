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

        sp.callSuper =(function() {
            var _stack = [],
                _idx   = 0,
                mthdArgs;
            
            function _clear(){
                _stack = [];
                _idx = 0;
            }

            function _createStack(methodName, instance) {
                var hasProp = {}.hasOwnProperty,
                    isCtor = (methodName === 'constructor'),
                    next = isCtor ? Object.getPrototypeOf(instance) : instance,
                    mthd;
                
                while (next) {
                    if (hasProp.call(next, methodName)) {
                        mthd = (next[methodName]);
                        _stack.push(mthd);
                    }
                    next = Object.getPrototypeOf(next);
                }
            }

            return function(methodName){
                var mthd, ret;

                if (_idx === 0) {
                    mthdArgs = Array.prototype.slice.call(arguments, 1);
                    _createStack(methodName, this);
                } 
                mthd = _stack[_idx+1];

                if (!mthd) {
                   throw new Error('callSuper: There is no method named ' + mthd + ' in parent class.');
                }
                
                _idx++;
                
                ret = mthd.apply(this, mthdArgs);

                _clear();

                return ret;
            };
        })();

    }

};

module.exports = Extends;

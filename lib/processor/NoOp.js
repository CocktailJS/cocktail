/*
 *
 * Copyright (c) 2013 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';

var NoOp = function(){};

NoOp.prototype = {
    retain   : false,
    priority : -1,
    name     : 'noOp',

    setParameter: function(){},
    getParameter: function(){}
};

module.exports = NoOp;
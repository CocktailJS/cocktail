/*
 *
 * Copyright (c) 2013 - 2014 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';

var sequence = require('./sequence');

var NoOp = function () {};

NoOp.prototype = {
    retain   : false,
    priority : sequence.NO_OP,
    name     : 'noOp',

    setParameter: function(){},
    getParameter: function(){}
};

module.exports = NoOp;

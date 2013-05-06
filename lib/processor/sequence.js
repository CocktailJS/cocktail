/*
 *
 * Copyright (c) 2013 Maximiliano Fierro
 * Licensed under the MIT license.
 */
 "use strict";

var sequence;

sequence = {
    NO_OP           : -1,

    PRE_EXTENDS     : 9,
    EXTENDS         : 10,
    POST_EXTENDS    : 11,

    PRE_PROPERTIES  : 19,
    PROPERTIES      : 20,
    POST_PROPERTIES : 21,

    PRE_REQUIRES    : 29,
    REQUIRES        : 30,
    POST_REQUIRES   : 31,    

    PRE_MERGE       : 99,
    MERGE           : 100,
    POST_MERGE      : 101,

    PRE_TRAITS      : 109,
    TRAITS          : 110,
    POST_TRAITS     : 111,

    ANNOTATION      : 1000

};

module.exports = sequence;
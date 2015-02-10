/*
 *
 * Copyright (c) 2013 - 2014 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';
/**
 * sequence list
  The processors will use one of the defined priorities in this list

  The priorities are organized in groups:

  [-1]      No Op.
  [1..99)   Object/Class creation.
  [99..999) Merge - Traits and talents are considered merge stage since we copy the structure into the subject.
  [999..)   Miscelaneous - Annotation definition makes no changes over the Subject itself.

 */

module.exports = {
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

    PRE_ANNOTATION  : 999,
    ANNOTATION      : 1000,
    POST_ANNOTATION : 1001,

    PRE_EXPORTS     : 1009,
    EXPORTS         : 1010,
    POST_EXPORTS    : 1011

};

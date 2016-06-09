/*
 *
 * Copyright (c) 2013 - 2016 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';

module.exports = {
    'no-op'       : require('./NoOp'),
    '@as'         : undefined, /*pseudo-processor*/
    '@merge'      : require('./annotation/Merge'),
    '@extends'    : require('./annotation/Extends'),
    '@properties' : require('./annotation/Properties'),
    '@traits'     : require('./annotation/Traits'),
    '@requires'   : require('./annotation/Requires'),
    '@talents'    : require('./annotation/Talents'),
    '@annotation' : require('./annotation/Annotation'),
    '@exports'    : require('./annotation/Exports'),
    '@static'     : require('./annotation/Static')
};

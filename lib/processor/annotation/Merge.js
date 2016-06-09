/*
 *
 * Copyright (c) 2013 - 2015 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';

var sequence = require('../sequence');

var _STRATEGIES_ = {
    'single'     : '_mergeMine',
    'mine'       : '_mergeMine',
    'their'      : '_mergeTheir',
    'deep-mine'  : '_mergeDeepMine',
    'deep-their' : '_mergeDeepTheir',
    'properties' : '_mergeOnlyProperties'
};

/**
 * @constructor
 */
function Merge (options) {
    var useProto;
    if (options) {
        useProto = options.usePrototypeWhenSubjectIsClass;
        this._usePrototypeWhenSubjectIsClass = (useProto === false) ? useProto : true;
    }
}

Merge.prototype = {
    retain   : false,
    priority : sequence.MERGE,
    name     : '@merge',

    _parameter   : undefined,

    _usePrototypeWhenSubjectIsClass: true,


    setParameter: function (value) {
        this._parameter = value;
    },

    getParameter: function () {
        return this._parameter;
    },

    _doMerge : function (mine, their, method) {
        var key;

        for (key in their) {
            if (their.hasOwnProperty(key)) {
                method.call(this, key);
            }
        }
    },

    /**
     * mine merge strategy: mine params over their. If params is already defined it gets overriden.
     */
    _mergeMine : function (mine, their) {
        this._doMerge(mine, their, function(k){
            mine[k] = their[k];
        });

        return mine;
    },

    _mergeOnlyProperties : function (mine, their) {
        this._doMerge(mine, their, function(k){
            if (typeof their[k] !== 'function'){
                mine[k] = their[k];
            }
        });

        return mine;
    },

     /**
     * deepMine merge strategy: mine params over their.
     * If params is already defined and it is an object it is merged with strategy mine,
     * if params is already defined and it is an array it is concatenated,
     * otherwise it gets overriden with mine.
     */
     _mergeDeepMine : function (mine, their) {
        return this._mergeDeep(mine, their, '_mergeMine');
    },

    /**
     * their merge strategy: their params over mine. If params is already defined it doesn't get overriden.
     */
    _mergeTheir : function (mine, their) {
        this._doMerge(mine, their, function(k){
            if (mine[k] === undefined) {
                mine[k] = their[k];
            }
        });

        return mine;
    },


     /**
     * deepMine merge strategy: their params over mine.
     * If params is already defined and it is an object it is merged with strategy their,
     * if params is already defined and it is an array it is concatenated,
     * otherwise it gets overriden with mine.
     */
     _mergeDeepTheir : function (mine, their) {
        return this._mergeDeep(mine, their, '_mergeTheir');
    },

    /**
     * runs the deep merge using the given strategy
     */
    _mergeDeep: function (mine, their, strategy) {
        this._doMerge(mine, their, function(key){
            if (typeof their[key] === 'object') {
                if (their[key] instanceof Array) {
                    mine[key] = [].concat(mine[key], their[key]);
                } else {
                    mine[key] = this[strategy](mine[key], their[key]);
                }
            } else if (mine[key] === undefined ) {
                mine[key] = their[key];
            }
        });

        return mine;
    },

    _shouldUsePrototypeWhenSubjectIsClass: function () {
        return this._usePrototypeWhenSubjectIsClass;
    },

    process: function (subject, options) {
        var their = options,
            useProto = this._shouldUsePrototypeWhenSubjectIsClass(),
            mine = (useProto && subject.prototype) || subject,
            strategy = _STRATEGIES_[this.getParameter()];

        this[strategy](mine, their);
    }
};

module.exports = Merge;

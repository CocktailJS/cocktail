/*
 *
 * Copyright (c) 2013 - 2014 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';

var sequence = require('./processor/sequence'),
    cocktail,
    ANNOTATION_REG_EXP = /^@/;


cocktail = {
    /**
     * @private
     * Stack of _queues
     */
    _qStack: [],
    /**
     * @private
     * The queue of processors instances for the given mix
     */
    _queue: [],

    /**
     *@private
     * Current processor list map
     */
    _processors: {},

    /**
     * @protected
     * Returns the processor list map
     */
    getProcessors : function(){
        return this._processors;
    },

    /**
     * @protected
     * sets the processor object list. It is an Object used as a map
     */
    setProcessors: function (processor) {
        this._processors = processor;
    },

    /**
     * @protected
     * returns the list of default processors
     */
    getDefaultProcessors: function () {
        return cocktail._DEFAULT_PROCESSORS;
    },

    /**
     * @protected
     * registers a processor definition
     * @param processorsConfig {Object} a key-value pair of processors
     */
    registerProcessors: function(processorsConfig){
        var processors = this.getProcessors(),
            key;
        for(key in processorsConfig){
            if(processorsConfig.hasOwnProperty(key)){
                processors[key] =  processorsConfig[key];
            }
        }
    },

    /**
     * @public
     */
    use: function(annotation){
        var name = annotation.name || (annotation.prototype && annotation.prototype.name),
            processor = {};

        if(name && annotation.prototype){
            processor[name] = annotation;
            this.registerProcessors(processor);
        }
    },

    /**
     * @private
     * returns a processor instance for the given key or a NoOp instance if it is not found.
     */
    _getProcessorFor: function(key){
        var processors = this.getProcessors(),
            P;
        P = (processors[key] || processors['no-op']);
        return new P();
    },

    /**
     * @private
     * applies default options to the given options parameter.
     * As of today, the only default option is the configuration for the merge annotation
     */
    _applyDefaultsOptions: function(options){
        if(options && !('@merge' in options) ){
            options['@merge'] = "single";
        }
    },

    /**
     * @private
     * iterates over options to find annotations and adds processors to the queue.
     */
    _configureProcessorsWith: function(options){
        var key, value, processor;

        this._cleanQueue();

        if(options){
            for(key in options){
                if(options.hasOwnProperty(key) && ANNOTATION_REG_EXP.test(key)){
                    value = options[key];
                    //get the processor instance for this annotation
                    processor = this._getProcessorFor(key);
                    //configure the annotation parameter
                    processor.setParameter(value);
                    //check if the annotation should be removed
                    if(!processor.retain){
                        delete options[key];
                    }
                    //add the processor to the queue
                    this._addProcessorToQueue(processor);
                }
            }
        }
    },

    /**
     * @private
     * stacks current queue
     */
    _pushQueue: function() {
        this._qStack.push(this._queue);
        this._queue = [];
    },

    /**
     * @private
     * restore current queue
     */
    _popQueue: function() {
        this._queue = this._qStack.pop();
    },


    /**
     * @private
     * Cleans the processor queue
     */
    _cleanQueue: function(){
        this._queue.length = 0;
    },

    /**
     * @private
     * Adds the given processor to the queue
     */
    _addProcessorToQueue: function(processor){
        if(processor && processor.priority !== -1){
            this._queue.push(processor);
        }
    },

    /**
     * @private
     * Sorts the queue by its processor's priorities
     */
    _sortQueueByPriority: function(){
        this._queue.sort(function(a, b){
            return a.priority - b.priority;
        });
    },

    /**
     * @private
     * Runs all the processors in the queue over the given subject
     */
    _executeProcessorsOn: function(subject, options){
        var processors = this._queue,
            l = processors.length,
            i;

        this._sortQueueByPriority();

        for(i = 0; i < l; i++){
            processors[i].process(subject, options);
        }

    },

    /**
     * @private
     * returns true if the given subject has a pseudo annotation `@as` with the given value.
     */
    _isSubjectDefinedAs: function (subject, asType) {
        return (subject && subject['@as'] && subject['@as'].toLowerCase() === asType);
    },

    /**
     * @private
     * returns true if the given subject is a class definition object.
     */
    _isClassDefition: function (subject) {
        var isClassDef = this._isSubjectDefinedAs(subject, 'class'),
            definitionProps = ['constructor', '@extends', '@traits', '@requires', '@annotation'],
            key;

        if (!isClassDef) {
            for (key in subject) {
                if(definitionProps.indexOf(key) > -1){
                    isClassDef = true;
                    break;
                }
            }
        }

        return isClassDef;
    },

    /**
     * @private
     * returns true if the given subject is a module definition object.
     */
    _isModuleDefinition: function (subject) {
        return this._isSubjectDefinedAs(subject, 'module');
    },

    /**
     * @private
     * If the subject has a property construtor returns it,
     * if no constructor on subject but it extends then return a function() calling super constructor,
     * or a function definition otherwise.
     */
    _getDefaultClassConstructor: function (subject) {
        var ctor, parent;

        if (this._isPropertyDefinedIn('constructor', subject)) {
            ctor = subject.constructor;
        } else if (this._isPropertyDefinedIn('@extends', subject)) {
            parent = subject['@extends'];
            ctor = function(){
                parent.prototype.constructor.apply(this, arguments);
            };
        } else {
            ctor = function(){};
        }

        return ctor;
    },

    /**
     * @private
     * checks if the given property is enumerable and defined in the obj
     */
    _isPropertyDefinedIn: function (property, obj) {
        var k;

        for (k in obj) {
            if(property === k) {
                return true;
            }
        }

        return false;
    },

    /**
     * @private
     * returns a call to mix() with the subject constructor and options
     */
    _processClassDefition: function(subject) {
        var defaultConstructor, options;

        defaultConstructor = this._getDefaultClassConstructor(subject);
        if(this._isPropertyDefinedIn('constructor', subject)) {
            delete subject.constructor;
        }
        options = subject;
        return this.mix(defaultConstructor, options);
    },

    /**
     * @private
     * @experimental 0.5.1
     * returns a call to mix() with the subject module and options
     */
    _processModuleDefinition: function (subject) {
        var options = subject;
        return this.mix(subject, options);
    },

    /**
     * @public
     */
    mix: function(subject, options){
        if(!options){
            if (this._isClassDefition(subject)) {
                return this._processClassDefition(subject);
            }
            if (this._isModuleDefinition(subject)) {
                return this._processModuleDefinition(subject);
            }
        }

        if(subject){
            this._pushQueue();
            this._applyDefaultsOptions(options);
            this._configureProcessorsWith(options);
            this._executeProcessorsOn(subject, options);
            this._popQueue();
        }

        return subject;
    }

};

//export module
module.exports = cocktail;

/**
 * @private
 * The processors class list.
 */
cocktail._DEFAULT_PROCESSORS = {
    'no-op'       : require('./processor/NoOp'),
    '@as'         : undefined, /*pseudo-processor*/
    '@merge'      : require('./processor/annotation/Merge'),
    '@extends'    : require('./processor/annotation/Extends'),
    '@properties' : require('./processor/annotation/Properties'),
    '@traits'     : require('./processor/annotation/Traits'),
    '@requires'   : require('./processor/annotation/Requires'),
    '@talents'    : require('./processor/annotation/Talents'),
    '@annotation' : require('./processor/annotation/Annotation'),
    '@exports'    : require('./processor/annotation/Exports'),
    '@static'     : require('./processor/annotation/Static'),
};

//register processors
cocktail.registerProcessors(cocktail._DEFAULT_PROCESSORS);

/**
 * @public
 * SEQUENCE is used to define an enumeration of priorities for annotations
 */
 cocktail.SEQUENCE = sequence;

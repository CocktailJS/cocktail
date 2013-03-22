/*
 *
 * Copyright (c) 2013 Maximiliano Fierro
 * Licensed under the MIT license.
 */
'use strict';

var NoOpProcessor = require('./processor/NoOp'),
    MergeAnnotation = require('./processor/annotation/Merge'),
    ExtendsAnnotation = require('./processor/annotation/Extends'),
    PropertiesAnnotation = require('./processor/annotation/Properties'),
    RequiresAnnotation = require('./processor/annotation/Requires'),
    TraitsAnnotation = require('./processor/annotation/Traits'),
    Cocktail,
    ANNOTATION_REG_EXP = /^@/,
    DEFAULT_PROCESSORS = {},
    PROCESSORS_LIST = {};

/**
 * @private
 * The processors class list.
 */
DEFAULT_PROCESSORS = {
    'no-op'       : NoOpProcessor,
    '@merge'      : MergeAnnotation,
    '@extends'    : ExtendsAnnotation,
    '@properties' : PropertiesAnnotation,
    '@traits'     : TraitsAnnotation,
    '@requires'   : RequiresAnnotation,
    '@talents'    : TraitsAnnotation
};

PROCESSORS_LIST = DEFAULT_PROCESSORS;

Cocktail = function(){
    //NO-OP
};

Cocktail.prototype = {
    /**
     * @private
     * The queue of processors instances for the given mix
     */
    _queue: [],

    
    // -- >Experimental
    
    // --- This methods are used for testing, find a better desing to avoid them
    
    restoreDefaultProcessors: function() {
        PROCESSORS_LIST = DEFAULT_PROCESSORS;
    },

    clearProcessors: function() {
        var key;
        for(key in PROCESSORS_LIST){
            if(PROCESSORS_LIST.hasOwnProperty(key) && key !== 'no-op'){
                delete PROCESSORS_LIST[key];
            }        
        }
    },

    registerProcessors: function(processorObj){
        var key;
        for(key in processorObj){
            if(processorObj.hasOwnProperty(key)){
                PROCESSORS_LIST[key] =  processorObj[key];
            }        
        }
    },

    getProcessors : function(){
        return PROCESSORS_LIST;
    },

    // -- >End of Experimental

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

        return subject;
    },

    /**
     * @public
     */
    mix: function(subject, options){
        if(subject){
            this._applyDefaultsOptions(options);
            this._configureProcessorsWith(options);
            this._executeProcessorsOn(subject, options);
        }

        return subject;
    }

};


module.exports = new Cocktail();



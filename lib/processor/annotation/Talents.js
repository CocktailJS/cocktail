/*
*
* Copyright (c) 2013 - 2016 Maximiliano Fierro
* Licensed under the MIT license.
*/
'use strict';

var Traits = require('./Traits');

function Talents () {
	Traits.call(this);
}

Talents.prototype = Object.create(Traits.prototype);

Talents.prototype._configName = 'talent';

Talents.prototype.process = function (subject) {
   var talents = this.getParameter(), // always an []
       l = talents.length,
       i;

   for (i = 0; i < l; i++) {
       this._applyTo(subject, talents[i]);
   }
};

module.exports = Talents;

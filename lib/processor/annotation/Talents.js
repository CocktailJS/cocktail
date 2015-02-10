/*
*
* Copyright (c) 2013 - 2014 Maximiliano Fierro
* Licensed under the MIT license.
*/
'use strict';


var Traits = require('./Traits');
var Talents;

Talents = function () {
	Traits.call(this);
};

Talents.prototype = Object.create(Traits.prototype);

Talents.prototype._applyTalentTo = Traits.prototype._applyTraitTo;

Talents.prototype.process = function (subject) {
	var traits = this.getParameter(), // always an []
		l = traits.length,
		i;

	for (i = 0; i < l; i++) {
		this._applyTalentTo(subject, traits[i]);
	}
};

module.exports = Talents;

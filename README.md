# Cocktail JS

[![Build Status](https://travis-ci.org/CocktailJS/cocktail.svg?branch=master)](https://travis-ci.org/CocktailJS/cocktail)
[![npm version](https://badge.fury.io/js/cocktail.svg)](http://badge.fury.io/js/cocktail)
 [![bitHound Score](https://www.bithound.io/CocktailJS/cocktail/badges/score.svg)](https://www.bithound.io/CocktailJS/cocktail)
 [![Code Climate](https://codeclimate.com/github/CocktailJS/cocktail/badges/gpa.svg)](https://codeclimate.com/github/CocktailJS/cocktail)

Cocktail is a small but yet powerful library with very simple principles:

- Reuse code
- Keep it simple

## Reuse code
Cocktail explores three mechanisms to share/reuse/mix code:

- **Extends**: OOP inheritance implemented in Javascript.
- **Traits**: Traits are composable behavior units that can be added to a Class.
- **Talents**: Same idea as Traits but applied to instances of a Class.


## Keep it simple
Cocktail has only one public method `cocktail.mix()` but it relies on `annotations` to tag some meta-data that describe the mix.

## Annotations
Annotations are simple meta-data Cocktail uses to perform some tasks over the given mix. They become part of the process but usually they are not kept in the result of a mix.

```js
	var cocktail = require('cocktail'),
		MyClass  = function(){};

	cocktail.mix(MyClass, {
		'@properties': {
			name: 'default name'
		}
	});
```

In the example above we created a "Class" named _MyClass_, and we use the `@properties` annotation to create the property _name_ and the corresponding _setName_ and _getName_ methods.

As it was mentioned before, annotations are meta-data, which means that they are not part of _MyClass_ or its prototype.

## Defining a Class / Module
Using cocktail to define a class is easy and elegant.

```js
var cocktail = require('cocktail');

cocktail.mix({
	'@exports': module,
	'@as': 'class',

	'@properties': {
		name: 'default name'
	},

	constructor: function(name){
		this.setName(name);
	},

	sayHello: function() {
		return 'Hello, my name is ' + this.getName();
	}
});

```
In this example our class definition uses `@exports` to tell the mix we want to export the result in the `module.exports` and `@as` tells it is a class.

## Traits
_Traits_ are **Composable Units of Behaviour** (You can read more from [this paper](http://scg.unibe.ch/archive/papers/Scha03aTraits.pdf)).
Basically, a Trait is a Class, but a special type of Class that has only behaviour (methods) and no state.
Traits are an alternative to reuse behaviour in a more predictable manner. They are more robust than _Mixins_, or
_Multiple Inheritance_ since name collisions must be solved by the developer beforehand. If you compose your class
with one or more Traits and you have a method defined in more than one place, your program will fail giving no magic rule
or any kind of precedence definition.

> Enumerable.js

```js
var cocktail = require('cocktail');

cocktail.mix({
	'@exports': module,
	'@as': 'class',

	'@requires': ['getItems'],

	first: function() {
		var items = this.getItems();
		return items[0] || null;
	},

	last: function() {
		var items = this.getItems(),
			l = items.length;
		return items[l-1];
	}

});


```
The class above is a Trait declaration for an Enumerable functionality.
In this case we only defined `first` and `last` methods to retrieve the
corresponding elements from an array retrieved by `getItems` methods.

> List.js

```js
var cocktail = require('cocktail'),
	Enumerable = require('./Enumerable');

cocktail.mix({
	'@exports': module,
	'@as': 'class',
	'@traits': [Enumerable],

	'@properties': {
		items: undefined
	},

	'@static': {
		/* factory method*/
		create: function(options) {
			var List = this;
			return new List(options);
		}
	},

	constructor: function (options) {
		this.items = options.items || [];
	}
});


```

The List class uses the Enumerable Trait, the getItems is defined by the `@properties` annotation.

> index.js

```js
var List = require('./List'),
	myArr = ['one', 'two', 'three'],
	myList;

myList = List.create({items: myArr});

console.log(myList.first()); // 'one'
console.log(myList.last());  // 'three'


```


## Talents
_Talents_ are very similar to Traits, in fact a Trait can be applied as a Talent in CocktailJS.
 The main difference is that a Talent can be applied to an _object_ or _module_.
So we can define a Talent as a **Dynamically Composable Unit of Reuse**
(you can read more from [this paper](http://scg.unibe.ch/archive/papers/Ress11a-Talents.pdf)).

Using the _Enumerable_ example, we can use a Trait as a Talent.

> index.js

```js
var cocktail = require('cocktail'),
    enumerable = require('./Enumerable'),
	myArr;

myArr = ['one', 'two', 'three'];

cocktail.mix(myArr, {
    '@talents': [enumerable],

	/* glue code for enumerable talent*/
    getItems: function () {
        return this;
    }
});

console.log(myArr.first());  // 'one'
console.log(myArr.last());   // 'three'


```

We can also create a new Talent to define the getItems method for an Array to retrive the current instance.

> ArrayAsItems.js

```js
var cocktail = require('cocktail');

cocktail.mix({
    '@exports': module,
    '@as': 'class',

    getItems: function () {
        return this;
    }
});

```
And then use it with Enumerable:


```js
var cocktail     = require('cocktail'),
	enumerable   = require('./Enumerable'),
	arrayAsItems = require('./ArrayAsItems');

var myArr = ['one', 'two', 'three'];

cocktail.mix(myArr, { '@talents': [enumerable, arrayAsItems] });

console.log(myArr.first());  // 'one'
console.log(myArr.last());   // 'three'

```

## Getting Started

- Install the module with: `npm install cocktail` or add cocktail to your `package.json` and then `npm install`
- Start playing by just adding a `var cocktail = require('cocktail')` in your file.

## Guides
Guides can be found at [CocktailJS Guides](http://cocktailjs.github.io/guides/)

## Documentation
The latest documentation is published at [CocktailJS Documentation](http://cocktailjs.github.io/docs/)

## Examples
A Cocktail playground can be found in [cocktail recipes](https://github.com/CocktailJS/cocktail-recipes) repo.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. 

### Running Lint & Tests
Add your unit and/or integration tests and execute

    $ npm test


### Run unit tests

    $npm run unit


### Run integration tests

    $npm run integration 


### Lint your code

    $ npm run lint


### Before Commiting
Run `npm test` to check lint and execute tests

    $ npm test


### Check test code coverage with instanbul

    $ npm run coverage


## Release History

see [CHANGELOG](https://github.com/CocktailJS/cocktail/blob/master/CHANGELOG.md)

## License
Copyright (c) 2013 - 2016 Maximiliano Fierro  
Licensed under the MIT license.

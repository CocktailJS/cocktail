# Cocktail JS [![Build Status](https://travis-ci.org/CocktailJS/Cocktail.png?branch=master)](https://travis-ci.org/CocktailJS/Cocktail)

Cocktail is a small but yet powerful library with very simple principles:

- Reuse code
- Keep it simple 

##Reuse code
Cocktail explores three mechanisms to share/reuse/mix code:

- **Extends**: Classical OOP inheritance implemented in Javascript.
- **Traits**: Traits are composable behavior units that can be added to a Class.
- **Talents**: Same idea as Traits but applied to instances of a Class.


##Keep it simple
Cocktail has only one public method `Cocktail.mix()` but it relies on `annotations` to tag some meta-data that describe the mix.

###Annotations
Annotations are simple meta-data Cocktail uses to perform some tasks over the given mix. They become part of the process but usually they are not kept in the result of a mix.

	var Cocktail = require('Cocktail'),
		MyClass  = function(){};
		
	Cocktail.mix(MyClass, {
		'@properties': {
			name: 'default name'
		}
	});	

In the example above we created a "Class" named _MyClass_, and we use the `@properties` annotation to create the property _name_ and the corresponding _setName_ and _getName_ methods.
 
As it was mentioned before, annotations are meta-data, which means that they are not part of _MyClass_ or its prototype. 


## Getting Started
Guides will be soon posted on CocktailJS site.

- Install the module with: `npm install cocktail` or add cocktail to your `package.json` and then `npm install`
- Start playing by just adding a `var Cocktail = require('Cocktail')` in your file.


## Documentation
The latest documentation is published at [CocktailJS Documentation](http://cocktailjs.github.io/docs/)

## Examples
A Cocktail playground can be found in [cocktail recipes](https://github.com/CocktailJS/cocktail-recipes) repo.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

- 0.0.4 (current master)
    - status: Alpha
    - Added new merge strategies: mine (default -same as single), their, deep-mine and deep-their.
    - Test for Merge strategies.

- 0.0.3 
    - status: Alpha.
    - Annotation, traits, talents, extends, and properties features are stable and tested.
    - Adde custom Annotations definitions mechanism thru @annotation.
    - Added merge strategy: single.

- 0.0.2
    - status: Alpha.
    - Alpha version for traits, talents, extends, and properties features.
    - Tests.

- 0.0.1
    - status: Alpha.
    - First draft version

## License
Copyright (c) 2013 Maximiliano Fierro  
Licensed under the MIT license.

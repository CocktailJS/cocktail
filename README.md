# Cocktail JS 
[![Build Status](https://travis-ci.org/CocktailJS/cocktail.png?branch=master)](https://travis-ci.org/CocktailJS/Cocktail)
[![NPM version](https://badge.fury.io/js/cocktail.png)](http://badge.fury.io/js/cocktail)

Cocktail is a small but yet powerful library with very simple principles:

- Reuse code
- Keep it simple 

##Reuse code
Cocktail explores three mechanisms to share/reuse/mix code:

- **Extends**: Classical OOP inheritance implemented in Javascript.
- **Traits**: Traits are composable behavior units that can be added to a Class.
- **Talents**: Same idea as Traits but applied to instances of a Class.


##Keep it simple
Cocktail has only one public method `cocktail.mix()` but it relies on `annotations` to tag some meta-data that describe the mix.

###Annotations
Annotations are simple meta-data Cocktail uses to perform some tasks over the given mix. They become part of the process but usually they are not kept in the result of a mix.

	var cocktail = require('cocktail'),
		MyClass  = function(){};
		
	cocktail.mix(MyClass, {
		'@properties': {
			name: 'default name'
		}
	});	

In the example above we created a "Class" named _MyClass_, and we use the `@properties` annotation to create the property _name_ and the corresponding _setName_ and _getName_ methods.
 
As it was mentioned before, annotations are meta-data, which means that they are not part of _MyClass_ or its prototype. 

###Combine Annotations and single parameter to export your class definition
Since version 0.2.0 you can define a class or trait without passing the constructor as the first parameter, and you can
export the result of the mix with one annotation so you don't forget `module.exports = MyClass`:

MyClass.js

    var cocktail = require('cocktail'),
        MySuperClass = require('./MySuperClass');

    cocktail.mix({
        '@extends': MySuperClass,
        '@exports': module,
        '@properties' : {
            name: 'a default name'
        }
    });

###Even easier Single Parameter Class Definition  
Version 0.3 introduces a pseudo-annotation `@as` to help Single Parameter Class Definition. Now you can define
a Class using `@as` passing a value of `class`:

MySuperClass.js

    var cocktail = require('cocktail')

    cocktail.mix({
        '@exports' : module,
        '@as'      : 'class',

        '@properties' : {
            name: 'a default name'
        }
    });


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
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).
### Running Tests
Add your unit and/or integration tests and execute

    $ grunt test

### Before Commiting
Run grunt to check lint and execute tests

    $ grunt


### Check test code coverage with instanbul

Install instanbul from npm globally if you don't have it already installed

    $ npm install -g istanbul 

Run

    $ istanbul cover _mocha -- -u exports --recursive test

## Release History

see [CHANGELOG](https://github.com/CocktailJS/cocktail/blob/master/CHANGELOG.md)

## License
Copyright (c) 2013 Maximiliano Fierro  
Licensed under the MIT license.

## CHANGE LOG

- 0.7.2
    - Fixed issue #26: Recursive loop when nesting `callSuper`. 

- 0.7.1
    - `@traits` & `@talents` support for ES6 Classes defintion. 

- 0.7.0
    - status: Beta
    - `@traits` and `@talents` annotations accept Object definitions. See issue #23.
    - Improved code for Merge, Trait and Talent processors.
    - Removed grunt dependencies. Using npm scripts.
    - Implemented ESLint for code style.
    - Added coverage check using istanbul.

- 0.6.0
    - status: Beta
    - New `@merge` annotation parameter: `"properties"` to only apply properties in the mix.
    - Fixed issue with Traits / Talents same method detection not working properly when comparing methods in different modules.

- 0.5.3
    - status: Alpha
    - Fixed issue with `@talents` applied to a Class. See #19

- 0.5.2
    - status: Alpha
    - Fixed issue with `@properties` annotation to not override value when subject is an object and it has a property already defined with the same name. See #18.

- 0.5.1
    - status: Alpha
    - Added 'module' as parameter in `@as` pseudo-annotation to export module as single object

- 0.5.0
    - status: Alpha
    - Added new method to register custom annotations (cocktail.use())
    - Refactored `@annotation` processor.
    - Small code improvements and tests.

- 0.4.6
    - status: Alpha
    - Fixed issue with Traits/Talents throwing errors on excluded/aliased methods. See #13.

- 0.4.5
    - status: Alpha
    - Fixed issue with Traits/Talents required methods check with traits defined in different modules.

- 0.4.4
    - status: Alpha
    - Renamed file lib/Cocktail.js to lib/cocktail.js to agree on module name conventions.
    - Changed examples to use `require('cocktail')` to avoid issues on Case Sensitive File Systems (like Linux)

- 0.4.3
    - status: Alpha
    - Fixed issue with mix being called from an annotation process.
    - Test added.

- 0.4.2
    - status: Alpha
    - Fixed issue with constructor chain parameters.
    - Test added for constructor chain parameters.

- 0.4.1
    - status: Alpha
    - Fixed issue with constructor chain.
    - Test added for single parameter class definition constructor chain.

- 0.4.0
    - status: Alpha
    - Added `@static` annotation to define static members on class mix.
    - Tests for `@static` annotation.
    - Refactored Merge processor. Added constructor parameter to reuse functionality on Static processor.

- 0.3.0
    - status: Alpha
    - Introduced pseudo-annotation `@as` intended for single parameter class definition
    - Tests for pseudo-annotation `@as`

- 0.2.0
    - status: Alpha
    - Added single parameter class/trait definition. If the first parameter is an object literal and it contains a
    constructor definition, or the annotation '@extends', '@traits', '@requires' or '@annotation' it will be treated as
    a class definition.
    - Tests for single parameter definition.

- 0.1.1
    - status: Alpha
    - Added `@exports` annotation.
    - Documentation update.
    - Tests for @exports annotation.

- 0.1.0
    - status: Alpha
    - Added sequence to define custom annotations priorities.
    - Documentation update.
    - Tests for Sequence.

- 0.0.4
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

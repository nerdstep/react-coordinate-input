<a name="1.0.0-beta"></a>

### 1.0.0-beta (2020-05-15)

#### Summary

- This release is a pretty major refactor which replaces the unmaintained [Text Mask](https://github.com/text-mask/text-mask) library with [imaskjs](https://github.com/uNmAnNeR/imaskjs).
- Additionally, the component has been refactored to use React Hooks instead of Class Components.

#### Changed

- BREAKING CHANGE: The `onChange` callback signature has changed. Instead of receiving an event as the first argument it receives the masked input value. The second argument is still an object but the properties have changed. See the [docs](https://github.com/nerdstep/react-coordinate-input#onchange) for more info.

#### Removed

- BREAKING CHANGE: Removed `guide` prop
- BREAKING CHANGE: Removed `showMask` prop

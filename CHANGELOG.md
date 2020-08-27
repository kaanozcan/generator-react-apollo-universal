# Changelog
## [1.3.0](https://github.com/kaanozcan/generator-react-apollo-universal/compare/v1.2.0...v1.3.0)
### Changed
- Moved script tags to the bottom of the document removing them from head tag to prevent render blocking.

### Fixed
- Fixed "Did not expect server HTML to contain the text node" error by removing a carriage return.

## [1.2.0](https://github.com/kaanozcan/generator-react-apollo-universal/compare/v1.1.0...v1.2.0)
### Changed
- Updated to Apollo Client 3.0

### Removed
- Removed deprecated dependencies with Apollo Client 3.0

## [1.1.0](https://github.com/kaanozcan/generator-react-apollo-universal/compare/v1.0.1...v1.1.0)
### Added
- Unit test setup
- Unit test utilities
- Unit test examples
- Async syntax
- CHANGELOG.md
- Added "Unit Tests" section to README.md

### Changed
- Updated project dependencies
- Changed .babelrc to babel.config.js
- Removed public/dist from .gitignore and included the coverage folder

### Fixed
- Now displaying webpack output on watch mode too.
- Fixed an issue where task name was showing up as \<anonymous\> instead of webpackRunner
- Fixed task develop didn't finish message on exit

## [1.0.1](https://github.com/kaanozcan/generator-react-apollo-universal/compare/v1.0.0...v1.0.1)
### Fixed
- package-lock.json resolved repositories

## [1.0.0](https://github.com/kaanozcan/generator-react-apollo-universal/releases/tag/v1.0.0)
### Added
- Initial project structure

# [2.2.0](https://github.com/kirilenko/lib.react-render-log/compare/v2.1.1...v2.2.0) (2026-11-09)


### Features

* tell reference-only changes apart, forward refs and statics in withRenderLog ([c23b714](https://github.com/kirilenko/lib.react-render-log/commit/c23b714a5a89c764e39e8670e7c2d1b3c4d8deb9))

## [2.1.1](https://github.com/kirilenko/lib.react-render-log/compare/v2.1.0...v2.1.1) (2026-11-09)


### Bug Fixes

* use a regular arrow before changed keys ([ba81784](https://github.com/kirilenko/lib.react-render-log/commit/ba81784039f60d28ac0c6f86a5832ec8a336069d))

# [2.1.0](https://github.com/kirilenko/lib.react-render-log/compare/v2.0.0...v2.1.0) (2026-11-09)


### Bug Fixes

* color only suspicious re-renders orange ([f283cab](https://github.com/kirilenko/lib.react-render-log/commit/f283cab04fa4ec99d5336f135dcc7cf2da6c6355))
* compare details with the last logged render ([c2da124](https://github.com/kirilenko/lib.react-render-log/commit/c2da1240058a318da5665ba703efa5ebd21609db))


### Features

* log withRenderLog props as details ([bcc85d8](https://github.com/kirilenko/lib.react-render-log/commit/bcc85d866875244576a2995bde4475d2ea622fc1))

# [2.0.0](https://github.com/kirilenko/lib.react-render-log/compare/v1.3.1...v2.0.0) (2026-11-09)


* feat!: count committed renders per component instance ([18abc9c](https://github.com/kirilenko/lib.react-render-log/commit/18abc9cf2dd251dad8fca745029331edfc99b03e))


### BREAKING CHANGES

* new useRenderLog and withRenderLog signatures; RenderLogProvider
drops isStrictMode and timeToLive; colors keys are now mount and rerender; types
PropsWithRenderLog, OwnRenderLogProviderProps and RenderLogContextValue are
removed. See "Migrating from 1.x" in the README.

## [1.3.1](https://github.com/kirilenko/lib.react-render-log/compare/v1.3.0...v1.3.1) (2026-11-09)


### Bug Fixes

* avoid extra re-renders and leaks, pass log args to the console as is ([c949a39](https://github.com/kirilenko/lib.react-render-log/commit/c949a39a672a9cd519cc2a2481825e8826a93693))

# [1.3.0](https://github.com/kirilenko/lib.react-render-log/compare/v1.2.0...v1.3.0) (2026-06-11)


### Features

* add expected render count validation to useRenderLog ([418221e](https://github.com/kirilenko/lib.react-render-log/commit/418221ec621d01c3b304772ffaea575522f262b4))

# [1.2.0](https://github.com/kirilenko/lib.react-render-log/compare/v1.1.2...v1.2.0) (2026-05-28)


### Features

* restore react-render-log source from archive ([0be626a](https://github.com/kirilenko/lib.react-render-log/commit/0be626a6083bd70ed6b2ee5d0c64f8cadf88f801))

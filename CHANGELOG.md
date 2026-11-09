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

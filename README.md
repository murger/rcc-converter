# rcc-converter
Requires [node](http://nodejs.org) + [npm](https://npmjs.com) or [yarn](https://yarnpkg.com) to work.

```sh
git clone https://github.com/murger/rcc-converter.git
cd rcc-converter
yarn && yarn start
```

Tested on Chrome 77.0.3865.90

### If I had more time...
- Would break methods into being more atomic so they're more testable.
- Would use `useMemo` and alike to prevent re-renders (not a big issue for now though).
- Would add integration tests using [Puppeteer](https://pptr.dev/) where applicable.
- Would implement loading/error states.

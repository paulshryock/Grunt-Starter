# Grunt Starter documentation

## Grunt tasks

### Default

```bash
grunt build
```

Kicks off this workflow:

- Clean `/build` directory
- Lint
  - Lint CSS (`grunt-stylelint`)
    - Fix?
  - Lint JS (`grunt-standard`)
    - Fix (works?)
- HTML
  - Minify or Beautify HTML (`grunt-htmlmin`, `beautify`)
  - Copy to `/build`
- CSS
  - Process CSS (`grunt-postcss`)
    - @import files (`postcss-easy-import`)
    - Transpile Sass-like syntax (`precss`)
    - Polyfill modern CSS (`postcss-preset-env`)
    - Add vendor prefixes (`autoprefixer`)
  - Bundle and copy to `/build/css/bundle.css`
  - Minify or Beautify CSS (`grunt-postcss`, `cssnano`, `beautify`)
  - Maintain Sourcemaps
- JS
  - Compile ECMAScript 2015+ into a backwards compatible version of JavaScript (`babel`)
  - Bundle and copy to `/build/js/bundle.js`
  - Minify or Beautify JS (`uglify`, `beautify`)
  - Maintain Sourcemaps
- Fonts
  - Copy to `/build/fonts`
- Images
  - Copy to `/build/img`
- Favicons
  - Copy to `/build`
- Clean unminified CSS and JS bundle files

### Develop

```bash
grunt develop
```

Sets `NODE_ENV` to `'development'` and runs the build workflow without cleaning CSS and JS bundles.

### Serve

```bash
grunt serve
```

Sets `NODE_ENV` to `'development'` and runs the build workflow without cleaning CSS and JS bundles, serves `/build`, and watches for changes.

## npm scripts

- `npm start` runs `grunt build`
- `npm run build` runs `grunt build`
- `npm run develop` runs `grunt develop`
- `npm run serve` runs `grunt serve`
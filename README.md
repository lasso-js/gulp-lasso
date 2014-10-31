# gulp-optimizer

Gulp plugin for [RaptorJS Optimizer](https://github.com/raptorjs/optimizer).
Replaces references to non-optimized scripts or stylesheets into a set of HTML files.

## Usage

First, install `gulp-optimizer` as a development dependency:

```shell
npm install --save-dev gulp-optimizer
```

Then, add it to your `gulpfile.js`:

```javascript
var optimizer = require('gulp-optimizer')

gulp.task('optimizer', function(){
  gulp.src(['src/**/*.html'])
  .pipe(optimizer({
    "configFile": "./optimizer-config.json", //Path to a JSON optimizer configuration file
    "dependencies": [
      "./src/css/style.css",
      "./src/css/style.less",
      "./js/libs/react/react.js",
      "./src/jsx/main.jsx",
      "require-run: ./src/js/main"
    ],
    "plugins": [
      "optimizer-less",
      "optimizer-jsx"
    ],
    "mode": 'production'
  }))
  .pipe(gulp.dest('build'));
});

```
Create the optimizer config file:

__optimizer-config.json:__

```javascript
{
    "plugins": [], // plugins can be specified here, or can be overridden in the gulpfile.js
    "fileWriter": {
        "outputDir": "build/static",
        "fingerprintsEnabled": false,
        "urlPrefix": "static/"
    },
    "minify": true,
    "resolveCssUrls": true,
    "bundlingEnabled": true
}

```
Create the main Node.js JavaScript module file:

__main.js:__

```javascript
var changeCase = require('change-case');
console.log(changeCase.titleCase('hello world')); // Output: 'Hello World'
```

Create a StyleSheet for the page:

__style.css__

```css
body {
    background-color: #5B83AD;
}
```

Sample file under ```src/``` eg: ```src/index.html```

__src/index.html:__

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Optimizer Demo</title>
</head>
<body>
    <h1 id="header">Optimizer Demo</h1>
</body>
</html>
```

Run the following command to generate the concatenated, minifed css, js files inside static folder and references of those files are added into the html files:

```bash
gulp optimizer
```

This should generate the html file in ```build/```

__build/index.html:__

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Optimizer Demo</title>
<!-- <optimizer-head> --><link rel="stylesheet" type="text/css" href="static/default.css"><!-- </optimizer-head> --></head>
<body>
    <h1 id="header">Optimizer Demo</h1>
    <div id="main"></div>
<!-- <optimizer-body> --><script type="text/javascript" src="static/default.js"></script>
<script type="text/javascript">$rmod.ready();</script><!-- </optimizer-body> --></body>
</html>
```
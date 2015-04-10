# gulp-lasso

Gulp plugin for [Lasso.js](https://github.com/lasso-js/lasso).
Replaces references to scripts or stylesheets into a set of HTML files.

## Usage

First, install `gulp-lasso` as a development dependency:

```shell
npm install --save-dev gulp-lasso
```

Then, add it to your `gulpfile.js`:

```javascript
var lasso = require('gulp-lasso');

gulp.task('lasso', function(){
  gulp.src(['src/**/*.html'])
  .pipe(lasso({
    "configFile": "./lasso-config.json", //Path to a JSON lasso configuration file
    "dependencies": [
      "./src/css/style.css",
      "./src/css/style.less",
      "./js/libs/react/react.js",
      "./src/jsx/main.jsx",
      "require-run: ./src/js/main"
    ],
    "plugins": [
      "lasso-less",
      "lasso-jsx"
    ],
    "mode": 'production'
  }))
  .pipe(gulp.dest('build'));
});

```
Create the lasso config file:

__lasso-config.json:__

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
    <title>Lasso.js Demo</title>
</head>
<body>
    <h1 id="header">Lasso.js Demo</h1>
</body>
</html>
```

Run the following command to generate the concatenated, minifed css, js files inside static folder and references of those files are added into the html files:

```bash
gulp lasso
```

This should generate the html file in ```build/```

__build/index.html:__

```html
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Lasso.js Demo</title>
<!-- <lasso-head> --><link rel="stylesheet" type="text/css" href="static/default.css"><!-- </lasso-head> --></head>
<body>
    <h1 id="header">Lasso.js Demo</h1>
    <div id="main"></div>
<!-- <lasso-body> --><script type="text/javascript" src="static/default.js"></script>
<script type="text/javascript">$rmod.ready();</script><!-- </lasso-body> --></body>
</html>
```

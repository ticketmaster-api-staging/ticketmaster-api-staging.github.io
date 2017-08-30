# knockout-scrollbar
perfect-scrollbar binding for knockout.js

> knockout-scrollbar uses a custom Knockout binding for 
> <a href="https://github.com/noraesae/perfect-scrollbar">perfect-scrollbar</a>, and uses
> <a href="https://github.com/marcj/css-element-queries/">ResizeSensor.js</a>
> to performantly determine whenever the dimensions of the scroll target change.
> This means there is no need to programmatically call an update function.

## demo

https://derflatulator.github.io/knockout-scrollbar/demo/

## install

```sh
npm i -S knockout-scrollbar
```

## import

If you're using a bundler, just `require('knockout-scrollbar')`.

Otherwise you can include `node_modules/knockout-scrollbar/dist/knockout-scrollbar.js` with a script tag,
which bundles in `perfect-scrollbar` and `ResizeSensor.js`. `ko` is assumed to be a global.

You'll need to separately include `perfect-scrollbar.css` though:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery.perfect-scrollbar/0.6.12/css/perfect-scrollbar.min.css" />
```

## use

```html
<div data-bind="scroll: {x: false, y: true}">
  Some content...
</div>
```

Defaults for both `x` and `y` scrollbars is `true`.

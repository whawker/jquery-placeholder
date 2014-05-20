(Another) jQuery Placeholder
==================

jQuery placeholder polyfill plugin with a few handy features

## Usage
```
$('[placeholder]').placeholder();
```

For best results, use with [HTML conditional classes](http://www.paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/)

```
$('html.lte9 [placeholder]').placeholder();
```

## Support for password fields
Creates a text input field and hides original password field, so placeholders are displayed correctly rather than &bull;&bull;&bull;&bull;&bull;&bull;

When text input is received to the dummy password field, input is passed back to the original password field, so information is hidden.

When the form is submitted, the dummy password fields are removed.

## Blanking placeholder fields on submit
Any field that still holds the placeholder value on submit, will be blanked before the submit occurs. Ensuring placeholder values are not submitted to the back end.

You can disable this functionality using
```
$('form').off('submit', $.fn.placeholder.blankOnSubmit);
```

## Modified $.fn.val function
This plugin modifies the default jQuery val() function, so attempting to retrieve the value of an input field in any other plugin/code will not retrieve the placeholder text. If the value is equal to the placeholder text, empty string is returned.

## Emulated Firefox/Chrome focus functionality
Placeholder is displayed, until text input is recieved. Rather than blanking the input on focus.

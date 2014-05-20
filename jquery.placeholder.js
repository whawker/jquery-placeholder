/**
 * (Another) jQuery placeholder https://github.com/whawker/jquery-placeholder
 * 
 * Usage:
 *  <input type="text" placeholder="Hello" />
 *
 *  $('[placeholder]').placeholder();
 *
 * Best results, use with html conditional classes http://www.paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/
 *
 *  $('html.lte9 [placeholder]').placeholder();
 */
(function($) {
    function _inputToTextInput() {
        var newInput = $('<input type="text" />');
        newInput.attr({
            'id'         : this.attr('id'),
            'class'      : this.attr('class') + ' js-placeholder-faux-password',
            'name'       : this.attr('name'),
            'placeholder': this.attr('placeholder'),
            'value'      : this.attr('value'),
            'tabindex'   : this.attr('tabindex'),
            'style'      : this.attr('style')
        });
        this.addClass('js-placeholder-original-password');
        return newInput;
    }

    function _cursorToFront(input) {
        if (input.createTextRange) {
            var part = input.createTextRange();
            part.move('character', 0);
            part.select();
        } else if (input.setSelectionRange) {
            input.setSelectionRange(0, 0);
        }
    }

    // maintain a reference to the existing function
    var oldval = $.fn.val;

    //Rewrite jQuery val() function to ignore, when val() == placholder
    $.fn.val = function()
    {
        // Do original behaviour - use function.apply to preserve context
        var ret = oldval.apply(this, arguments);

        //If we have no arguments (so we're getting the val), now we override
        if (!arguments.length) {
            var elem = this[0],
                self = $(elem),
                placeholder = self.data('placeholder-text');
            //If we have a placeholder value, and current value == placeholder value, return empty string
            if (typeof placeholder !== "undefined" && ret === placeholder)
                ret = '';
        }

        return ret;
    };

    $.fn.placeholder = function(placeholder) {
        var $forms = $([]);
        this.each(function(index, elem){
            var $elem = $(elem),
                phText = placeholder || $elem.attr('placeholder'),
                type = $elem.attr('type');

            $elem.data('placeholder-text', phText);

            if (type === 'password') {
                var $faux = _inputToTextInput.call($elem);

                $faux.css({'color': '#969696'}).val(phText);
                $elem.hide().after($faux);

                $faux.focus(function() {
                    if (oldval.call($faux) === phText)
                        _cursorToFront(this);
                }).keypress(function() {
                    $faux.hide().prop('disabled', true);
                    $elem.show().prop('disabled', false).focus();
                });

                $elem.blur(function(){
                    if (oldval.call($elem) === '') { //Use oldval (default jQuery val()) to check if value REALLY is empty
                        $elem.hide().prop('disabled', true);
                        $faux.show().prop('disabled', false);
                    }
                }).trigger('blur');
            } else {
                //Overriden $.fn.val to return '' when val = placeholder, so we need to use oldval reference
                // oldval.call($elem)         = $elem.oldval()
                // oldval.call($elem, phText) = $elem.oldval(phText)
                $elem.focus(function() {
                    if (oldval.call($elem) === phText)
                        _cursorToFront(this);
                }).keypress(function() {
                    if (oldval.call($elem) === phText)
                        oldval.call($elem, '').change();
                }).change(function() {
                    var color = (oldval.call($elem) === phText) ? '#969696' : '#191919';
                    $elem.css({'color': color});
                }).blur(function(){
                    if (oldval.call($elem) === '')
                        oldval.call($elem, phText).change();
                }).trigger('blur');
            }
            $forms = $forms.add($elem.closest('form'));
        });

        $.fn.placeholder.blankOnSubmit = function() {
            var $form = $(this);
            $form.find('.js-placeholder-faux-password').remove(); //Remove faux password fields
            $form.find('.js-placeholder-original-password').prop('disabled', false).show(); //Enabled original password fields
            $form.find('[placeholder]').each(function(index, input) {
                //If form elems are blank (according to our modified val function)
                //make sure they are REALLY blank, so values aren't submitted
                if ($(input).val() === '')
                    input.value = '';
            });
        }
        $.unique($forms).one('submit', $.fn.placeholder.blankOnSubmit);
    };
}(jQuery));
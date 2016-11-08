import Frampton from 'frampton/namespace';
import addClass from 'frampton-style/add_class';
import applyStyles from 'frampton-style/apply_styles';
import closest from 'frampton-style/closest';
import contains from 'frampton-style/contains';
import current from 'frampton-style/current_value';
import hasClass from 'frampton-style/has_class';
import matches from 'frampton-style/matches';
import removeClass from 'frampton-style/remove_class';
import removeStyle from 'frampton-style/remove_style';
import removeStyles from 'frampton-style/remove_styles';
import selectorContains from 'frampton-style/selector_contains';
import setStyle from 'frampton-style/set_style';
import supported from 'frampton-style/supported';
import supportedProps from 'frampton-style/supported_props';

/**
 * @name Style
 * @namespace
 * @memberof Frampton
 */
Frampton.Style                  = {};
Frampton.Style.addClass         = addClass;
Frampton.Style.applyStyles      = applyStyles;
Frampton.Style.closest          = closest;
Frampton.Style.contains         = contains;
Frampton.Style.current          = current;
Frampton.Style.hasClass         = hasClass;
Frampton.Style.matches          = matches;
Frampton.Style.removeClass      = removeClass;
Frampton.Style.removeStyle      = removeStyle;
Frampton.Style.removeStyles     = removeStyles;
Frampton.Style.selectorContains = selectorContains;
Frampton.Style.setStyle         = setStyle;
Frampton.Style.supported        = supported;
Frampton.Style.supportedProps   = supportedProps;

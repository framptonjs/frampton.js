import Frampton from 'frampton/namespace';
import addClass from 'frampton-style/add_class';
import removeClass from 'frampton-style/remove_class';
import hasClass from 'frampton-style/has_class';
import current from 'frampton-style/current_value';
import applyStyles from 'frampton-style/apply_styles';
import removeStyles from 'frampton-style/remove_styles';

Frampton.Style = {};
Frampton.Style.addClass     = addClass;
Frampton.Style.removeClass  = removeClass;
Frampton.Style.hasClass     = hasClass;
Frampton.Style.current      = current;
Frampton.Style.applyStyles  = applyStyles;
Frampton.Style.removeStyles = removeStyles;
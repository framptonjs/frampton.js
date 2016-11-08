import Frampton from 'frampton/namespace';
import capitalize from 'frampton-string/capitalize';
import contains from 'frampton-string/contains';
import dashToCamel from 'frampton-string/dash_to_camel';
import endsWith from 'frampton-string/ends_with';
import isEmpty from 'frampton-string/is_empty';
import join from 'frampton-string/join';
import length from 'frampton-string/length';
import lines from 'frampton-string/lines';
import normalizeNewline from 'frampton-string/normalize_newline';
import replace from 'frampton-string/replace';
import split from 'frampton-string/split';
import startsWith from 'frampton-string/starts_with';
import trim from 'frampton-string/trim';
import words from 'frampton-string/words';


/**
 * @name String
 * @namespace
 * @memberof Frampton
 */
Frampton.String                  = {};
Frampton.String.capitalize       = capitalize;
Frampton.String.contains         = contains;
Frampton.String.dashToCamel      = dashToCamel;
Frampton.String.endsWith         = endsWith;
Frampton.String.isEmpty          = isEmpty;
Frampton.String.join             = join;
Frampton.String.length           = length;
Frampton.String.lines            = lines;
Frampton.String.normalizeNewline = normalizeNewline;
Frampton.String.replace          = replace;
Frampton.String.split            = split;
Frampton.String.startsWith       = startsWith;
Frampton.String.trim             = trim;
Frampton.String.words            = words;

import Frampton from 'frampton/namespace';
import join from 'frampton-string/join';
import split from 'frampton-string/split';
import lines from 'frampton-string/lines';
import words from 'frampton-string/words';
import startsWith from 'frampton-string/starts_with';
import endsWith from 'frampton-string/ends_with';
import contains from 'frampton-string/contains';

Frampton.String = {};
Frampton.String.join       = join;
Frampton.String.split      = split;
Frampton.String.lines      = lines;
Frampton.String.words      = words;
Frampton.String.startsWith = startsWith;
Frampton.String.endsWith   = endsWith;
Frampton.String.contains   = contains;
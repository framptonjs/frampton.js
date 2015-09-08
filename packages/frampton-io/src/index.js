import Frampton from 'frampton/namespace';

import Response from 'frampton-io/response';
import complete from 'frampton-io/complete';
import progress from 'frampton-io/progress';
import error from 'frampton-io/error';
import start from 'frampton-io/start';

import send from 'frampton-io/http/send';
import get from 'frampton-io/http/get';
import getNewest from 'frampton-io/http/get_newest';
import post from 'frampton-io/http/post';
import upload from 'frampton-io/http/upload';
import url from 'frampton-io/http/url';
import queryPair from 'frampton-io/http/query_pair';
import queryEscape from 'frampton-io/http/query_escape';
import uriEncode from 'frampton-io/http/uri_encode';
import uriDecode from 'frampton-io/http/uri_decode';

import read from 'frampton-io/file/read';
import dataUrl from 'frampton-io/file/data_url';
import binaryString from 'frampton-io/file/binary_string';
import arrayBuffer from 'frampton-io/file/array_buffer';
import text from 'frampton-io/file/text';

/**
 * @name IO
 * @namespace
 * @memberof Frampton
 */
Frampton.IO = {};

Frampton.IO.Response          = Response;
Frampton.IO.complete          = complete;
Frampton.IO.progress          = progress;
Frampton.IO.error             = error;
Frampton.IO.start             = start;

/**
 * @name Http
 * @memberof Frampton.IO
 * @namespace
 */
Frampton.IO.Http = {};
Frampton.IO.Http.send         = send;
Frampton.IO.Http.get          = get;
Frampton.IO.Http.post         = post;
Frampton.IO.Http.getNewest    = getNewest;
Frampton.IO.Http.upload       = upload;
Frampton.IO.Http.url          = url;
Frampton.IO.Http.queryPair    = queryPair;
Frampton.IO.Http.queryEscape  = queryEscape;
Frampton.IO.Http.uriEncode    = uriEncode;
Frampton.IO.Http.uriDecode    = uriDecode;

/**
 * @name File
 * @memberof Frampton.IO
 * @namespace
 */
Frampton.IO.File = {};
Frampton.IO.File.read         = read;
Frampton.IO.File.dataUrl      = dataUrl;
Frampton.IO.File.binaryString = binaryString;
Frampton.IO.File.arrayBuffer  = arrayBuffer;
Frampton.IO.File.text         = text;
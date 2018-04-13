(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.jsPDF = factory());
}(this, (function () { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};





var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();

/** @preserve
 * jsPDF - PDF Document creation from JavaScript
 * Version 0.0.3-rc.7 Built on 2017-12-17T14:20:14.547Z
 *                           CommitID caab08300d
 *
 * Copyright (c) 2010-2016 James Hall <james@parall.ax>, https://github.com/MrRio/jsPDF
 *               2010 Aaron Spike, https://github.com/acspike
 *               2012 Willow Systems Corporation, willow-systems.com
 *               2012 Pablo Hess, https://github.com/pablohess
 *               2012 Florian Jenett, https://github.com/fjenett
 *               2013 Warren Weckesser, https://github.com/warrenweckesser
 *               2013 Youssef Beddad, https://github.com/lifof
 *               2013 Lee Driscoll, https://github.com/lsdriscoll
 *               2013 Stefan Slonevskiy, https://github.com/stefslon
 *               2013 Jeremy Morel, https://github.com/jmorel
 *               2013 Christoph Hartmann, https://github.com/chris-rock
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 James Makes, https://github.com/dollaruw
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 Steven Spungin, https://github.com/Flamenco
 *               2014 Kenneth Glassey, https://github.com/Gavvers
 *
 * Licensed under the MIT License
 *
 * Contributor(s):
 *    siefkenj, ahwolf, rickygu, Midnith, saintclair, eaparango,
 *    kim3er, mfo, alnorth, Flamenco
 */

/**
 * Creates new jsPDF document object instance.
 * @name jsPDF
 * @class
 * @param orientation One of "portrait" or "landscape" (or shortcuts "p" (Default), "l") <br />
 * Can also be an options object.
 * @param unit        Measurement unit to be used when coordinates are specified.
 *                    One of "pt" (points), "mm" (Default), "cm", "in"
 * @param format      One of 'pageFormats' as shown below, default: a4
 * @returns {jsPDF}
 * @description
 * If the first parameter (orientation) is an object, it will be interpreted as an object of named parameters
 * ```
 * {
 *  orientation: 'p',
 *  unit: 'mm',
 *  format: 'a4',
 *  hotfixes: [] // an array of hotfix strings to enable
 * }
 * ```
 */
var jsPDF = function (global) {
  'use strict';

  var pdfVersion = '1.3',
      pageFormats = { // Size in pt of various paper formats
    'a0': [2383.94, 3370.39],
    'a1': [1683.78, 2383.94],
    'a2': [1190.55, 1683.78],
    'a3': [841.89, 1190.55],
    'a4': [595.28, 841.89],
    'a5': [419.53, 595.28],
    'a6': [297.64, 419.53],
    'a7': [209.76, 297.64],
    'a8': [147.40, 209.76],
    'a9': [104.88, 147.40],
    'a10': [73.70, 104.88],
    'b0': [2834.65, 4008.19],
    'b1': [2004.09, 2834.65],
    'b2': [1417.32, 2004.09],
    'b3': [1000.63, 1417.32],
    'b4': [708.66, 1000.63],
    'b5': [498.90, 708.66],
    'b6': [354.33, 498.90],
    'b7': [249.45, 354.33],
    'b8': [175.75, 249.45],
    'b9': [124.72, 175.75],
    'b10': [87.87, 124.72],
    'c0': [2599.37, 3676.54],
    'c1': [1836.85, 2599.37],
    'c2': [1298.27, 1836.85],
    'c3': [918.43, 1298.27],
    'c4': [649.13, 918.43],
    'c5': [459.21, 649.13],
    'c6': [323.15, 459.21],
    'c7': [229.61, 323.15],
    'c8': [161.57, 229.61],
    'c9': [113.39, 161.57],
    'c10': [79.37, 113.39],
    'dl': [311.81, 623.62],
    'letter': [612, 792],
    'government-letter': [576, 756],
    'legal': [612, 1008],
    'junior-legal': [576, 360],
    'ledger': [1224, 792],
    'tabloid': [792, 1224],
    'credit-card': [153, 243]
  };

  /**
   * jsPDF's Internal PubSub Implementation.
   * See mrrio.github.io/jsPDF/doc/symbols/PubSub.html
   * Backward compatible rewritten on 2014 by
   * Diego Casorran, https://github.com/diegocr
   *
   * @class
   * @name PubSub
   * @ignore This should not be in the public docs.
   */
  function PubSub(context) {
    var topics = {};

    this.subscribe = function (topic, callback, once) {
      if (typeof callback !== 'function') {
        return false;
      }

      if (!topics.hasOwnProperty(topic)) {
        topics[topic] = {};
      }

      var id = Math.random().toString(35);
      topics[topic][id] = [callback, !!once];

      return id;
    };

    this.unsubscribe = function (token) {
      for (var topic in topics) {
        if (topics[topic][token]) {
          delete topics[topic][token];
          return true;
        }
      }
      return false;
    };

    this.publish = function (topic) {
      if (topics.hasOwnProperty(topic)) {
        var args = Array.prototype.slice.call(arguments, 1),
            idr = [];

        for (var id in topics[topic]) {
          if (Object.prototype.hasOwnProperty.call(topics[topic], id)) {
            var sub = topics[topic][id];
            try {
              sub[0].apply(context, args);
            } catch (ex) {
              if (global.console) {
                console.error('jsPDF PubSub Error', ex.message, ex);
              }
            }
            if (sub[1]) idr.push(id);
          }
        }
        if (idr.length) idr.forEach(this.unsubscribe);
      }
    };
  }

  /**
   * @constructor
   * @private
   */
  function jsPDF(orientation, unit, format, compressPdf) {
    var options = {};

    if ((typeof orientation === 'undefined' ? 'undefined' : _typeof(orientation)) === 'object') {
      options = orientation;

      orientation = options.orientation;
      unit = options.unit || unit;
      format = options.format || format;
      compressPdf = options.compress || options.compressPdf || compressPdf;
    }

    // Default options
    unit = unit || 'mm';
    format = format || 'a4';
    orientation = ('' + (orientation || 'P')).toLowerCase();

    var format_as_string = ('' + format).toLowerCase(),
        compress = !!compressPdf && typeof Uint8Array === 'function',
        textColor = options.textColor || '0 g',
        drawColor = options.drawColor || '0 G',
        activeFontSize = options.fontSize || 16,
        activeCharSpace = options.charSpace || 0,
        R2L = options.R2L || false,
        lineHeightProportion = options.lineHeight || 1.15,
        lineWidth = options.lineWidth || 0.200025,
        // 2mm
    objectNumber = 2,
        // 'n' Current object number
    outToPages = !1,
        // switches where out() prints. outToPages true = push to pages obj. outToPages false = doc builder content
    offsets = [],
        // List of offsets. Activated and reset by buildDocument(). Pupulated by various calls buildDocument makes.
    fonts = {},
        // collection of font objects, where key is fontKey - a dynamically created label for a given font.
    fontmap = {},
        // mapping structure fontName > fontStyle > font key - performance layer. See addFont()
    activeFontKey,
        // will be string representing the KEY of the font as combination of fontName + fontStyle
    k,
        // Scale factor
    tmp,
        page = 0,
        currentPage,
        pages = [],
        pagesContext = [],
        // same index as pages and pagedim
    pagedim = [],
        content = [],
        additionalObjects = [],
        lineCapID = 0,
        lineJoinID = 0,
        content_length = 0,
        pageWidth,
        pageHeight,
        pageMode,
        zoomMode,
        layoutMode,
        documentProperties = {
      'title': '',
      'subject': '',
      'author': '',
      'keywords': '',
      'creator': ''
    },
        API = {},
        events = new PubSub(API),
        hotfixes = options.hotfixes || [],


    /////////////////////
    // Private functions
    /////////////////////
    f2 = function f2(number) {
      return number.toFixed(2); // Ie, %.2f
    },
        f3 = function f3(number) {
      return number.toFixed(3); // Ie, %.3f
    },
        padd2 = function padd2(number) {
      return ('0' + parseInt(number, 10)).slice(-2);
    },
        out = function out(string) {
      if (outToPages) {
        /* set by beginPage */
        pages[currentPage].push(string);
      } else {
        // +1 for '\n' that will be used to join 'content'
        content_length += string.length + 1;
        content.push(string);
      }
    },
        newObject = function newObject() {
      // Begin a new object
      objectNumber++;
      offsets[objectNumber] = content_length;
      out(objectNumber + ' 0 obj');
      return objectNumber;
    },

    // Does not output the object until after the pages have been output.
    // Returns an object containing the objectId and content.
    // All pages have been added so the object ID can be estimated to start right after.
    // This does not modify the current objectNumber;  It must be updated after the newObjects are output.
    newAdditionalObject = function newAdditionalObject() {
      var objId = pages.length * 2 + 1;
      objId += additionalObjects.length;
      var obj = {
        objId: objId,
        content: ''
      };
      additionalObjects.push(obj);
      return obj;
    },

    // Does not output the object.  The caller must call newObjectDeferredBegin(oid) before outputing any data
    newObjectDeferred = function newObjectDeferred() {
      objectNumber++;
      offsets[objectNumber] = function () {
        return content_length;
      };
      return objectNumber;
    },
        newObjectDeferredBegin = function newObjectDeferredBegin(oid) {
      offsets[oid] = content_length;
    },
        putStream = function putStream(str) {
      out('stream');
      out(str);
      out('endstream');
    },
        putPages = function putPages() {
      var n,
          p,
          arr,
          i,
          deflater,
          adler32,
          adler32cs,
          wPt,
          hPt,
          pageObjectNumbers = [];

      adler32cs = global.adler32cs || jsPDF.adler32cs;
      if (compress && typeof adler32cs === 'undefined') {
        compress = false;
      }

      // outToPages = false as set in endDocument(). out() writes to content.

      for (n = 1; n <= page; n++) {
        pageObjectNumbers.push(newObject());
        wPt = (pageWidth = pagedim[n].width) * k;
        hPt = (pageHeight = pagedim[n].height) * k;
        out('<</Type /Page');
        out('/Parent 1 0 R');
        out('/Resources 2 0 R');
        out('/MediaBox [0 0 ' + f2(wPt) + ' ' + f2(hPt) + ']');
        // Added for annotation plugin
        events.publish('putPage', {
          pageNumber: n,
          page: pages[n]
        });
        out('/Contents ' + (objectNumber + 1) + ' 0 R');
        out('>>');
        out('endobj');

        // Page content
        p = pages[n].join('\n');
        newObject();
        if (compress) {
          arr = [];
          i = p.length;
          while (i--) {
            arr[i] = p.charCodeAt(i);
          }
          adler32 = adler32cs.from(p);
          deflater = new Deflater(6);
          deflater.append(new Uint8Array(arr));
          p = deflater.flush();
          arr = new Uint8Array(p.length + 6);
          arr.set(new Uint8Array([120, 156]));
          arr.set(p, 2);
          arr.set(new Uint8Array([adler32 & 0xFF, adler32 >> 8 & 0xFF, adler32 >> 16 & 0xFF, adler32 >> 24 & 0xFF]), p.length + 2);
          p = String.fromCharCode.apply(null, arr);
          out('<</Length ' + p.length + ' /Filter [/FlateDecode]>>');
        } else {
          out('<</Length ' + p.length + '>>');
        }
        putStream(p);
        out('endobj');
      }
      offsets[1] = content_length;
      out('1 0 obj');
      out('<</Type /Pages');
      var kids = '/Kids [';
      for (i = 0; i < page; i++) {
        kids += pageObjectNumbers[i] + ' 0 R ';
      }
      out(kids + ']');
      out('/Count ' + page);
      out('>>');
      out('endobj');
      events.publish('postPutPages');
    },
        putFont = function putFont(font) {
      var noMetadata = Object.keys(font.metadata).length === 0 ? true : false;
      if (font.id.slice(1) >= 14 && !noMetadata) {
        var dictionary = font.metadata.embedTTF(font.encoding, newObject, out);
        dictionary ? font.objectNumber = dictionary : delete fonts[font.id];
      } else {
        font.objectNumber = newObject();
        out('<</BaseFont/' + font.postScriptName + '/Type/Font');
        if (typeof font.encoding === 'string') {
          out('/Encoding/' + font.encoding);
        }
        out('/Subtype/Type1>>');
        out('endobj');
      }
    },
        putFonts = function putFonts() {
      for (var fontKey in fonts) {
        if (fonts.hasOwnProperty(fontKey)) {
          putFont(fonts[fontKey]);
        }
      }
    },
        putXobjectDict = function putXobjectDict() {
      // Loop through images, or other data objects
      events.publish('putXobjectDict');
    },
        putResourceDictionary = function putResourceDictionary() {
      out('/ProcSet [/PDF /Text /ImageB /ImageC /ImageI]');
      out('/Font <<');

      // Do this for each font, the '1' bit is the index of the font
      for (var fontKey in fonts) {
        if (fonts.hasOwnProperty(fontKey)) {
          out('/' + fontKey + ' ' + fonts[fontKey].objectNumber + ' 0 R');
        }
      }
      out('>>');
      out('/XObject <<');
      putXobjectDict();
      out('>>');
    },
        putResources = function putResources() {
      putFonts();
      events.publish('putResources');
      // Resource dictionary
      offsets[2] = content_length;
      out('2 0 obj');
      out('<<');
      putResourceDictionary();
      out('>>');
      out('endobj');
      events.publish('postPutResources');
    },
        putAdditionalObjects = function putAdditionalObjects() {
      events.publish('putAdditionalObjects');
      for (var i = 0; i < additionalObjects.length; i++) {
        var obj = additionalObjects[i];
        offsets[obj.objId] = content_length;
        out(obj.objId + ' 0 obj');
        out(obj.content);
        out('endobj');
      }
      objectNumber += additionalObjects.length;
      events.publish('postPutAdditionalObjects');
    },
        addToFontDictionary = function addToFontDictionary(fontKey, fontName, fontStyle) {
      // this is mapping structure for quick font key lookup.
      // returns the KEY of the font (ex: "F1") for a given
      // pair of font name and type (ex: "Arial". "Italic")
      if (!fontmap.hasOwnProperty(fontName)) {
        fontmap[fontName] = {};
      }
      fontmap[fontName][fontStyle] = fontKey;
    },

    /**
     * FontObject describes a particular font as member of an instnace of jsPDF
     *
     * It's a collection of properties like 'id' (to be used in PDF stream),
     * 'fontName' (font's family name), 'fontStyle' (font's style variant label)
     *
     * @class
     * @public
     * @property id {String} PDF-document-instance-specific label assinged to the font.
     * @property postScriptName {String} PDF specification full name for the font
     * @property encoding {Object} Encoding_name-to-Font_metrics_object mapping.
     * @name FontObject
     * @ignore This should not be in the public docs.
     */
    addFont = function addFont(postScriptName, fontName, fontStyle, encoding) {
      var fontKey = 'F' + (Object.keys(fonts).length + 1).toString(10),

      // This is FontObject
      font = fonts[fontKey] = {
        'id': fontKey,
        'postScriptName': postScriptName,
        'fontName': fontName,
        'fontStyle': fontStyle,
        'encoding': encoding,
        'metadata': {}
      };
      addToFontDictionary(fontKey, fontName, fontStyle);
      events.publish('addFont', font);

      return fontKey;
    },
        addFonts = function addFonts() {

      var HELVETICA = "helvetica",
          TIMES = "times",
          COURIER = "courier",
          NORMAL = "normal",
          BOLD = "bold",
          ITALIC = "italic",
          BOLD_ITALIC = "bolditalic",
          encoding = 'StandardEncoding',
          ZAPF = "zapfdingbats",
          standardFonts = [['Helvetica', HELVETICA, NORMAL, 'WinAnsiEncoding'], ['Helvetica-Bold', HELVETICA, BOLD, 'WinAnsiEncoding'], ['Helvetica-Oblique', HELVETICA, ITALIC, 'WinAnsiEncoding'], ['Helvetica-BoldOblique', HELVETICA, BOLD_ITALIC, 'WinAnsiEncoding'], ['Courier', COURIER, NORMAL, 'WinAnsiEncoding'], ['Courier-Bold', COURIER, BOLD, 'WinAnsiEncoding'], ['Courier-Oblique', COURIER, ITALIC, 'WinAnsiEncoding'], ['Courier-BoldOblique', COURIER, BOLD_ITALIC, 'WinAnsiEncoding'], ['Times-Roman', TIMES, NORMAL, 'WinAnsiEncoding'], ['Times-Bold', TIMES, BOLD, 'WinAnsiEncoding'], ['Times-Italic', TIMES, ITALIC, 'WinAnsiEncoding'], ['Times-BoldItalic', TIMES, BOLD_ITALIC, 'WinAnsiEncoding'], ['ZapfDingbats', ZAPF, undefined, 'StandardEncoding']];

      for (var i = 0, l = standardFonts.length; i < l; i++) {
        var fontKey = addFont(standardFonts[i][0], standardFonts[i][1], standardFonts[i][2], standardFonts[i][3]);

        // adding aliases for standard fonts, this time matching the capitalization
        var parts = standardFonts[i][0].split('-');
        addToFontDictionary(fontKey, parts[0], parts[1] || '');
      }
      events.publish('addFonts', {
        fonts: fonts,
        dictionary: fontmap
      });
    },
        SAFE = function __safeCall(fn) {
      fn.foo = function __safeCallWrapper() {
        try {
          return fn.apply(this, arguments);
        } catch (e) {
          var stack = e.stack || '';
          if (~stack.indexOf(' at ')) stack = stack.split(" at ")[1];
          var m = "Error in function " + stack.split("\n")[0].split('<')[0] + ": " + e.message;
          if (global.console) {
            global.console.error(m, e);
            if (global.alert) alert(m);
          } else {
            throw new Error(m);
          }
        }
      };
      fn.foo.bar = fn;
      return fn.foo;
    },
        to8bitStream = function to8bitStream(text, flags) {
      /**
       * PDF 1.3 spec:
       * "For text strings encoded in Unicode, the first two bytes must be 254 followed by
       * 255, representing the Unicode byte order marker, U+FEFF. (This sequence conflicts
       * with the PDFDocEncoding character sequence thorn ydieresis, which is unlikely
       * to be a meaningful beginning of a word or phrase.) The remainder of the
       * string consists of Unicode character codes, according to the UTF-16 encoding
       * specified in the Unicode standard, version 2.0. Commonly used Unicode values
       * are represented as 2 bytes per character, with the high-order byte appearing first
       * in the string."
       *
       * In other words, if there are chars in a string with char code above 255, we
       * recode the string to UCS2 BE - string doubles in length and BOM is prepended.
       *
       * HOWEVER!
       * Actual *content* (body) text (as opposed to strings used in document properties etc)
       * does NOT expect BOM. There, it is treated as a literal GID (Glyph ID)
       *
       * Because of Adobe's focus on "you subset your fonts!" you are not supposed to have
       * a font that maps directly Unicode (UCS2 / UTF16BE) code to font GID, but you could
       * fudge it with "Identity-H" encoding and custom CIDtoGID map that mimics Unicode
       * code page. There, however, all characters in the stream are treated as GIDs,
       * including BOM, which is the reason we need to skip BOM in content text (i.e. that
       * that is tied to a font).
       *
       * To signal this "special" PDFEscape / to8bitStream handling mode,
       * API.text() function sets (unless you overwrite it with manual values
       * given to API.text(.., flags) )
       * flags.autoencode = true
       * flags.noBOM = true
       *
       * ===================================================================================
       * `flags` properties relied upon:
       *   .sourceEncoding = string with encoding label.
       *                     "Unicode" by default. = encoding of the incoming text.
       *                     pass some non-existing encoding name
       *                     (ex: 'Do not touch my strings! I know what I am doing.')
       *                     to make encoding code skip the encoding step.
       *   .outputEncoding = Either valid PDF encoding name
       *                     (must be supported by jsPDF font metrics, otherwise no encoding)
       *                     or a JS object, where key = sourceCharCode, value = outputCharCode
       *                     missing keys will be treated as: sourceCharCode === outputCharCode
       *   .noBOM
       *       See comment higher above for explanation for why this is important
       *   .autoencode
       *       See comment higher above for explanation for why this is important
       */

      var i, l, sourceEncoding, encodingBlock, outputEncoding, newtext, isUnicode, ch, bch;

      flags = flags || {};
      sourceEncoding = flags.sourceEncoding || 'Unicode';
      outputEncoding = flags.outputEncoding;

      // This 'encoding' section relies on font metrics format
      // attached to font objects by, among others,
      // "Willow Systems' standard_font_metrics plugin"
      // see jspdf.plugin.standard_font_metrics.js for format
      // of the font.metadata.encoding Object.
      // It should be something like
      //   .encoding = {'codePages':['WinANSI....'], 'WinANSI...':{code:code, ...}}
      //   .widths = {0:width, code:width, ..., 'fof':divisor}
      //   .kerning = {code:{previous_char_code:shift, ..., 'fof':-divisor},...}
      if ((flags.autoencode || outputEncoding) && fonts[activeFontKey].metadata && fonts[activeFontKey].metadata[sourceEncoding] && fonts[activeFontKey].metadata[sourceEncoding].encoding) {
        encodingBlock = fonts[activeFontKey].metadata[sourceEncoding].encoding;

        // each font has default encoding. Some have it clearly defined.
        if (!outputEncoding && fonts[activeFontKey].encoding) {
          outputEncoding = fonts[activeFontKey].encoding;
        }

        // Hmmm, the above did not work? Let's try again, in different place.
        if (!outputEncoding && encodingBlock.codePages) {
          outputEncoding = encodingBlock.codePages[0]; // let's say, first one is the default
        }

        if (typeof outputEncoding === 'string') {
          outputEncoding = encodingBlock[outputEncoding];
        }
        // we want output encoding to be a JS Object, where
        // key = sourceEncoding's character code and
        // value = outputEncoding's character code.
        if (outputEncoding) {
          isUnicode = false;
          newtext = [];
          for (i = 0, l = text.length; i < l; i++) {
            ch = outputEncoding[text.charCodeAt(i)];
            if (ch) {
              newtext.push(String.fromCharCode(ch));
            } else {
              newtext.push(text[i]);
            }

            // since we are looping over chars anyway, might as well
            // check for residual unicodeness
            if (newtext[i].charCodeAt(0) >> 8) {
              /* more than 255 */
              isUnicode = true;
            }
          }
          text = newtext.join('');
        }
      }

      i = text.length;
      // isUnicode may be set to false above. Hence the triple-equal to undefined
      while (isUnicode === undefined && i !== 0) {
        if (text.charCodeAt(i - 1) >> 8) {
          /* more than 255 */
          isUnicode = true;
        }
        i--;
      }
      if (!isUnicode) {
        return text;
      }

      newtext = flags.noBOM ? [] : [254, 255];
      for (i = 0, l = text.length; i < l; i++) {
        ch = text.charCodeAt(i);
        bch = ch >> 8; // divide by 256
        if (bch >> 8) {
          /* something left after dividing by 256 second time */
          throw new Error("Character at position " + i + " of string '" + text + "' exceeds 16bits. Cannot be encoded into UCS-2 BE");
        }
        newtext.push(bch);
        newtext.push(ch - (bch << 8));
      }
      return String.fromCharCode.apply(undefined, newtext);
    },
        pdfEscape = function pdfEscape(text, flags) {
      /**
       * Replace '/', '(', and ')' with pdf-safe versions
       *
       * Doing to8bitStream does NOT make this PDF display unicode text. For that
       * we also need to reference a unicode font and embed it - royal pain in the rear.
       *
       * There is still a benefit to to8bitStream - PDF simply cannot handle 16bit chars,
       * which JavaScript Strings are happy to provide. So, while we still cannot display
       * 2-byte characters property, at least CONDITIONALLY converting (entire string containing)
       * 16bit chars to (USC-2-BE) 2-bytes per char + BOM streams we ensure that entire PDF
       * is still parseable.
       * This will allow immediate support for unicode in document properties strings.
       */
      return to8bitStream(text, flags).replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
    },
        putInfo = function putInfo() {
      out('/Producer (jsPDF ' + jsPDF.version + ')');
      for (var key in documentProperties) {
        if (documentProperties.hasOwnProperty(key) && documentProperties[key]) {
          out('/' + key.substr(0, 1).toUpperCase() + key.substr(1) + ' (' + pdfEscape(documentProperties[key]) + ')');
        }
      }
      var created = new Date(),
          tzoffset = created.getTimezoneOffset(),
          tzsign = tzoffset < 0 ? '+' : '-',
          tzhour = Math.floor(Math.abs(tzoffset / 60)),
          tzmin = Math.abs(tzoffset % 60),
          tzstr = [tzsign, padd2(tzhour), "'", padd2(tzmin), "'"].join('');
      out(['/CreationDate (D:', created.getFullYear(), padd2(created.getMonth() + 1), padd2(created.getDate()), padd2(created.getHours()), padd2(created.getMinutes()), padd2(created.getSeconds()), tzstr, ')'].join(''));
    },
        putCatalog = function putCatalog() {
      out('/Type /Catalog');
      out('/Pages 1 0 R');
      // PDF13ref Section 7.2.1
      if (!zoomMode) zoomMode = 'fullwidth';
      switch (zoomMode) {
        case 'fullwidth':
          out('/OpenAction [3 0 R /FitH null]');
          break;
        case 'fullheight':
          out('/OpenAction [3 0 R /FitV null]');
          break;
        case 'fullpage':
          out('/OpenAction [3 0 R /Fit]');
          break;
        case 'original':
          out('/OpenAction [3 0 R /XYZ null null 1]');
          break;
        default:
          var pcn = '' + zoomMode;
          if (pcn.substr(pcn.length - 1) === '%') zoomMode = parseInt(zoomMode, 10) / 100;
          if (typeof zoomMode === 'number') {
            out('/OpenAction [3 0 R /XYZ null null ' + f2(zoomMode) + ']');
          }
      }
      if (!layoutMode) layoutMode = 'continuous';
      switch (layoutMode) {
        case 'continuous':
          out('/PageLayout /OneColumn');
          break;
        case 'single':
          out('/PageLayout /SinglePage');
          break;
        case 'two':
        case 'twoleft':
          out('/PageLayout /TwoColumnLeft');
          break;
        case 'tworight':
          out('/PageLayout /TwoColumnRight');
          break;
      }
      if (pageMode) {
        /**
         * A name object specifying how the document should be displayed when opened:
         * UseNone      : Neither document outline nor thumbnail images visible -- DEFAULT
         * UseOutlines  : Document outline visible
         * UseThumbs    : Thumbnail images visible
         * FullScreen   : Full-screen mode, with no menu bar, window controls, or any other window visible
         */
        out('/PageMode /' + pageMode);
      }
      events.publish('putCatalog');
    },
        putTrailer = function putTrailer() {
      out('/Size ' + (objectNumber + 1));
      out('/Root ' + objectNumber + ' 0 R');
      out('/Info ' + (objectNumber - 1) + ' 0 R');
    },
        beginPage = function beginPage(width, height) {
      // Dimensions are stored as user units and converted to points on output
      var orientation = typeof height === 'string' && height.toLowerCase();
      if (typeof width === 'string') {
        var format = width.toLowerCase();
        if (pageFormats.hasOwnProperty(format)) {
          width = pageFormats[format][0] / k;
          height = pageFormats[format][1] / k;
        }
      }
      if (Array.isArray(width)) {
        height = width[1];
        width = width[0];
      }
      if (orientation) {
        switch (orientation.substr(0, 1)) {
          case 'l':
            if (height > width) orientation = 's';
            break;
          case 'p':
            if (width > height) orientation = 's';
            break;
        }
        if (orientation === 's') {
          tmp = width;
          width = height;
          height = tmp;
        }
      }
      outToPages = true;
      pages[++page] = [];
      pagedim[page] = {
        width: Number(width) || pageWidth,
        height: Number(height) || pageHeight
      };
      pagesContext[page] = {};
      _setPage(page);
    },
        _addPage = function _addPage() {
      beginPage.apply(this, arguments);
      // Set line width
      out(f2(lineWidth * k) + ' w');
      // Set draw color
      out(drawColor);
      // resurrecting non-default line caps, joins
      if (lineCapID !== 0) {
        out(lineCapID + ' J');
      }
      if (lineJoinID !== 0) {
        out(lineJoinID + ' j');
      }
      events.publish('addPage', {
        pageNumber: page
      });
    },
        _deletePage = function _deletePage(n) {
      if (n > 0 && n <= page) {
        pages.splice(n, 1);
        pagedim.splice(n, 1);
        page--;
        if (currentPage > page) {
          currentPage = page;
        }
        this.setPage(currentPage);
      }
    },
        _setPage = function _setPage(n) {
      if (n > 0 && n <= page) {
        currentPage = n;
        pageWidth = pagedim[n].width;
        pageHeight = pagedim[n].height;
      }
    },

    /**
     * Returns a document-specific font key - a label assigned to a
     * font name + font type combination at the time the font was added
     * to the font inventory.
     *
     * Font key is used as label for the desired font for a block of text
     * to be added to the PDF document stream.
     * @private
     * @function
     * @param fontName {String} can be undefined on "falthy" to indicate "use current"
     * @param fontStyle {String} can be undefined on "falthy" to indicate "use current"
     * @returns {String} Font key.
     */
    _getFont = function _getFont(fontName, fontStyle) {
      var key, originalFontName;

      fontName = fontName !== undefined ? fontName : fonts[activeFontKey].fontName;
      fontStyle = fontStyle !== undefined ? fontStyle : fonts[activeFontKey].fontStyle;

      originalFontName = fontName;

      if (fontName !== undefined) {
        fontName = fontName.toLowerCase();
      }
      switch (fontName) {
        case 'sans-serif':
        case 'verdana':
        case 'arial':
        case 'helvetica':
          fontName = 'helvetica';
          break;
        case 'fixed':
        case 'monospace':
        case 'terminal':
        case 'courier':
          fontName = 'courier';
          break;
        case 'serif':
        case 'cursive':
        case 'fantasy':
          fontName = 'times';
          break;
        default:
          fontName = originalFontName;
          break;
      }

      try {
        // get a string like 'F3' - the KEY corresponding tot he font + type combination.
        key = fontmap[fontName][fontStyle];
      } catch (e) {
        //error
      }

      if (!key) {
        //throw new Error("Unable to look up font label for font '" + fontName + "', '"
        //+ fontStyle + "'. Refer to getFontList() for available fonts.");
        key = fontmap['times'][fontStyle];
        if (key === undefined) {
          key = fontmap['times']['normal'];
        }
      }
      return key;
    },
        buildDocument = function buildDocument() {
      outToPages = false; // switches out() to content

      objectNumber = 2;
      content_length = 0;
      content = [];
      offsets = [];
      additionalObjects = [];
      // Added for AcroForm
      events.publish('buildDocument');

      // putHeader()
      out('%PDF-' + pdfVersion);

      putPages();

      // Must happen after putPages
      // Modifies current object Id
      putAdditionalObjects();

      putResources();

      // Info
      newObject();
      out('<<');
      putInfo();
      out('>>');
      out('endobj');

      // Catalog
      newObject();
      out('<<');
      putCatalog();
      out('>>');
      out('endobj');

      // Cross-ref
      var o = content_length,
          i,
          p = "0000000000";
      out('xref');
      out('0 ' + (objectNumber + 1));
      out(p + ' 65535 f ');
      for (i = 1; i <= objectNumber; i++) {
        var offset = offsets[i];
        if (typeof offset === 'function') {
          out((p + offsets[i]()).slice(-10) + ' 00000 n ');
        } else {
          out((p + offsets[i]).slice(-10) + ' 00000 n ');
        }
      }
      // Trailer
      out('trailer');
      out('<<');
      putTrailer();
      out('>>');
      out('startxref');
      out('' + o);
      out('%%EOF');

      outToPages = true;

      return content.join('\n');
    },
        getStyle = function getStyle(style) {
      // see path-painting operators in PDF spec
      var op = 'S'; // stroke
      if (style === 'F') {
        op = 'f'; // fill
      } else if (style === 'FD' || style === 'DF') {
        op = 'B'; // both
      } else if (style === 'f' || style === 'f*' || style === 'B' || style === 'B*') {
        /*
         Allow direct use of these PDF path-painting operators:
         - f	fill using nonzero winding number rule
         - f*	fill using even-odd rule
         - B	fill then stroke with fill using non-zero winding number rule
         - B*	fill then stroke with fill using even-odd rule
         */
        op = style;
      }
      return op;
    },
        getArrayBuffer = function getArrayBuffer() {
      var data = buildDocument(),
          len = data.length,
          ab = new ArrayBuffer(len),
          u8 = new Uint8Array(ab);

      while (len--) {
        u8[len] = data.charCodeAt(len);
      }return ab;
    },
        getBlob = function getBlob() {
      return new Blob([getArrayBuffer()], {
        type: "application/pdf"
      });
    },

    /**
     * Generates the PDF document.
     *
     * If `type` argument is undefined, output is raw body of resulting PDF returned as a string.
     *
     * @param {String} type A string identifying one of the possible output types.
     * @param {Object} options An object providing some additional signalling to PDF generator.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name output
     */
    _output = SAFE(function (type, options) {
      var datauri = ('' + type).substr(0, 6) === 'dataur' ? 'data:application/pdf;base64,' + btoa(buildDocument()) : 0;

      switch (type) {
        case undefined:
          return buildDocument();
        case 'save':
          if (navigator.getUserMedia) {
            if (global.URL === undefined || global.URL.createObjectURL === undefined) {
              return API.output('dataurlnewwindow');
            }
          }
          saveAs(getBlob(), options);
          if (typeof saveAs.unload === 'function') {
            if (global.setTimeout) {
              setTimeout(saveAs.unload, 911);
            }
          }
          break;
        case 'arraybuffer':
          return getArrayBuffer();
        case 'blob':
          return getBlob();
        case 'bloburi':
        case 'bloburl':
          // User is responsible of calling revokeObjectURL
          return global.URL && global.URL.createObjectURL(getBlob()) || undefined;
        case 'datauristring':
        case 'dataurlstring':
          return datauri;
        case 'dataurlnewwindow':
          var nW = global.open(datauri);
          if (nW || typeof safari === "undefined") return nW;
        /* pass through */
        case 'datauri':
        case 'dataurl':
          return global.document.location.href = datauri;
        default:
          throw new Error('Output type "' + type + '" is not supported.');
      }
      // @TODO: Add different output options
    }),


    /**
     * Used to see if a supplied hotfix was requested when the pdf instance was created.
     * @param {String} hotfixName - The name of the hotfix to check.
     * @returns {boolean}
     */
    hasHotfix = function hasHotfix(hotfixName) {
      return Array.isArray(hotfixes) === true && hotfixes.indexOf(hotfixName) > -1;
    };

    switch (unit) {
      case 'pt':
        k = 1;
        break;
      case 'mm':
        k = 72 / 25.4000508;
        break;
      case 'cm':
        k = 72 / 2.54000508;
        break;
      case 'in':
        k = 72;
        break;
      case 'px':
        if (hasHotfix('px_scaling') === true) {
          k = 72 / 96;
        } else {
          k = 96 / 72;
        }
        break;
      case 'pc':
        k = 12;
        break;
      case 'em':
        k = 12;
        break;
      case 'ex':
        k = 6;
        break;
      default:
        throw 'Invalid unit: ' + unit;
    }

    //---------------------------------------
    // Public API

    /**
     * Object exposing internal API to plugins
     * @public
     */
    API.internal = {
      'pdfEscape': pdfEscape,
      'getStyle': getStyle,
      /**
       * Returns {FontObject} describing a particular font.
       * @public
       * @function
       * @param fontName {String} (Optional) Font's family name
       * @param fontStyle {String} (Optional) Font's style variation name (Example:"Italic")
       * @returns {FontObject}
       */
      'getFont': function getFont() {
        return fonts[_getFont.apply(API, arguments)];
      },
      'getFontSize': function getFontSize() {
        return activeFontSize;
      },
      'getCharSpace': function getCharSpace() {
        return activeCharSpace;
      },
      'getLineHeight': function getLineHeight() {
        return activeFontSize * lineHeightProportion;
      },
      'write': function write(string1 /*, string2, string3, etc */) {
        out(arguments.length === 1 ? string1 : Array.prototype.join.call(arguments, ' '));
      },
      'getCoordinateString': function getCoordinateString(value) {
        return f2(value * k);
      },
      'getVerticalCoordinateString': function getVerticalCoordinateString(value) {
        return f2((pageHeight - value) * k);
      },
      'collections': {},
      'newObject': newObject,
      'newAdditionalObject': newAdditionalObject,
      'newObjectDeferred': newObjectDeferred,
      'newObjectDeferredBegin': newObjectDeferredBegin,
      'putStream': putStream,
      'events': events,
      // ratio that you use in multiplication of a given "size" number to arrive to 'point'
      // units of measurement.
      // scaleFactor is set at initialization of the document and calculated against the stated
      // default measurement units for the document.
      // If default is "mm", k is the number that will turn number in 'mm' into 'points' number.
      // through multiplication.
      'scaleFactor': k,
      'pageSize': {
        get width() {
          return pageWidth;
        },
        get height() {
          return pageHeight;
        }
      },
      'output': function output(type, options) {
        return _output(type, options);
      },
      'getNumberOfPages': function getNumberOfPages() {
        return pages.length - 1;
      },
      'pages': pages,
      'out': out,
      'f2': f2,
      'getPageInfo': function getPageInfo(pageNumberOneBased) {
        var objId = (pageNumberOneBased - 1) * 2 + 3;
        return {
          objId: objId,
          pageNumber: pageNumberOneBased,
          pageContext: pagesContext[pageNumberOneBased]
        };
      },
      'getCurrentPageInfo': function getCurrentPageInfo() {
        var objId = (currentPage - 1) * 2 + 3;
        return {
          objId: objId,
          pageNumber: currentPage,
          pageContext: pagesContext[currentPage]
        };
      },
      'getPDFVersion': function getPDFVersion() {
        return pdfVersion;
      },
      'hasHotfix': hasHotfix //Expose the hasHotfix check so plugins can also check them.
    };

    /**
     * Adds (and transfers the focus to) new page to the PDF document.
     * @function
     * @returns {jsPDF}
     *
     * @methodOf jsPDF#
     * @name addPage
     */
    API.addPage = function () {
      _addPage.apply(this, arguments);
      return this;
    };
    /**
     * Adds (and transfers the focus to) new page to the PDF document.
     * @function
     * @returns {jsPDF}
     *
     * @methodOf jsPDF#
     * @name setPage
     * @param {Number} page Switch the active page to the page number specified
     * @example
     * doc = jsPDF()
     * doc.addPage()
     * doc.addPage()
     * doc.text('I am on page 3', 10, 10)
     * doc.setPage(1)
     * doc.text('I am on page 1', 10, 10)
     */
    API.setPage = function () {
      _setPage.apply(this, arguments);
      return this;
    };
    API.insertPage = function (beforePage) {
      this.addPage();
      this.movePage(currentPage, beforePage);
      return this;
    };
    API.movePage = function (targetPage, beforePage) {
      var tmpPages, tmpPagedim, tmpPagesContext, i;
      if (targetPage > beforePage) {
        tmpPages = pages[targetPage];
        tmpPagedim = pagedim[targetPage];
        tmpPagesContext = pagesContext[targetPage];
        for (i = targetPage; i > beforePage; i--) {
          pages[i] = pages[i - 1];
          pagedim[i] = pagedim[i - 1];
          pagesContext[i] = pagesContext[i - 1];
        }
        pages[beforePage] = tmpPages;
        pagedim[beforePage] = tmpPagedim;
        pagesContext[beforePage] = tmpPagesContext;
        this.setPage(beforePage);
      } else if (targetPage < beforePage) {
        tmpPages = pages[targetPage];
        tmpPagedim = pagedim[targetPage];
        tmpPagesContext = pagesContext[targetPage];
        for (i = targetPage; i < beforePage; i++) {
          pages[i] = pages[i + 1];
          pagedim[i] = pagedim[i + 1];
          pagesContext[i] = pagesContext[i + 1];
        }
        pages[beforePage] = tmpPages;
        pagedim[beforePage] = tmpPagedim;
        pagesContext[beforePage] = tmpPagesContext;
        this.setPage(beforePage);
      }
      return this;
    };

    API.deletePage = function () {
      _deletePage.apply(this, arguments);
      return this;
    };

    /**
     * Set the display mode options of the page like zoom and layout.
     *
     * @param {integer|String} zoom   You can pass an integer or percentage as
     * a string. 2 will scale the document up 2x, '200%' will scale up by the
     * same amount. You can also set it to 'fullwidth', 'fullheight',
     * 'fullpage', or 'original'.
     *
     * Only certain PDF readers support this, such as Adobe Acrobat
     *
     * @param {String} layout Layout mode can be: 'continuous' - this is the
     * default continuous scroll. 'single' - the single page mode only shows one
     * page at a time. 'twoleft' - two column left mode, first page starts on
     * the left, and 'tworight' - pages are laid out in two columns, with the
     * first page on the right. This would be used for books.
     * @param {String} pmode 'UseOutlines' - it shows the
     * outline of the document on the left. 'UseThumbs' - shows thumbnails along
     * the left. 'FullScreen' - prompts the user to enter fullscreen mode.
     *
     * @function
     * @returns {jsPDF}
     * @name setDisplayMode
     */
    API.setDisplayMode = function (zoom, layout, pmode) {
      zoomMode = zoom;
      layoutMode = layout;
      pageMode = pmode;

      var validPageModes = [undefined, null, 'UseNone', 'UseOutlines', 'UseThumbs', 'FullScreen'];
      if (validPageModes.indexOf(pmode) === -1) {
        throw new Error('Page mode must be one of UseNone, UseOutlines, UseThumbs, or FullScreen. "' + pmode + '" is not recognized.');
      }
      return this;
    };

    /**
     * Adds text to page. Supports adding multiline text when 'text' argument is an Array of Strings.
     *
     * @function
     * @param {String|Array} text String or array of strings to be added to the page. Each line is shifted one line down per font, spacing settings declared before this call.
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Object} options Collection of settings signalling how the text must be encoded. Defaults are sane. If you think you want to pass some flags, you likely can read the source.
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name text
     */
    API.text = function (text, x, y, options) {
      /**
       * Inserts something like this into PDF
       *   BT
       *    /F1 16 Tf  % Font name + size
       *    16 TL % How many units down for next line in multiline text
       *    0 g % color
       *    28.35 813.54 Td % position
       *    (line one) Tj
       *    T* (line two) Tj
       *    T* (line three) Tj
       *   ET
       */
      var xtra = '';
      var transformationMatrix = [];
      var flags = arguments[3];
      var angle = arguments[4];
      var align = arguments[5];
      var tmp;

      function f2(number) {
        return number.toFixed(2);
      }

      function ESC(s) {
        s = s.split("\t").join(Array(options.TabLen || 9).join(" "));
        return pdfEscape(s, flags);
      }

      // Pre-August-2012 the order of arguments was function(x, y, text, flags)
      // in effort to make all calls have similar signature like
      //   function(data, coordinates... , miscellaneous)
      // this method had its args flipped.
      // code below allows backward compatibility with old arg order.
      if (typeof text === 'number') {
        tmp = y;
        y = x;
        x = text;
        text = tmp;
      }

      // If there are any newlines in text, we assume
      // the user wanted to print multiple lines, so break the
      // text up into an array.  If the text is already an array,
      // we assume the user knows what they are doing.
      // Convert text into an array anyway to simplify
      // later code.
      if (typeof text === 'string') {
        if (text.match(/[\n\r]/)) {
          text = text.split(/\r\n|\r|\n/g);
        } else {
          text = [text];
        }
      }

      if ((typeof flags === 'undefined' ? 'undefined' : _typeof(flags)) !== "object" || flags === null) {
        if (typeof angle === 'string') {
          align = angle;
          angle = null;
        }
        if (typeof flags === 'string') {
          align = flags;
          flags = null;
        }
        if (typeof flags === 'number') {
          angle = flags;
          flags = null;
        }
        options = {
          flags: flags,
          angle: angle,
          align: align
        };
      }

      if (angle) {
        angle *= Math.PI / 180;
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        transformationMatrix = [f2(c), f2(s), f2(s * -1), f2(c)];
      }

      if (activeCharSpace) xtra += activeCharSpace + ' Tc\n';

      //renderingMode
      var tmpRenderingMode = -1;
      var parmRenderingMode = options.renderingMode || options.stroke;
      var pageContext = this.internal.getCurrentPageInfo().pageContext;
      var usedRenderingMode = pageContext.usedRenderingMode || -1;

      switch (parmRenderingMode) {
        case 0:
        case false:
        case 'fill':
          tmpRenderingMode = 0;
          break;
        case 1:
        case true:
        case 'stroke':
          tmpRenderingMode = 1;
          break;
        case 2:
        case 'fillThenStroke':
          tmpRenderingMode = 2;
          break;
        case 3:
        case 'invisible':
          tmpRenderingMode = 3;
          break;
        case 4:
        case 'fillAndAddForClipping':
          tmpRenderingMode = 4;
          break;
        case 5:
        case 'strokeAndAddPathForClipping':
          tmpRenderingMode = 5;
          break;
        case 6:
        case 'fillThenStrokeAndAddToPathForClipping':
          tmpRenderingMode = 6;
          break;
        case 7:
        case 'addToPathForClipping':
          tmpRenderingMode = 7;
          break;
      }

      //if the coder wrote it explicitly to use a specific 
      //renderingMode, then use it
      if (tmpRenderingMode !== -1) {
        xtra += tmpRenderingMode + " Tr\n";
        //otherwise check if we used the rendering Mode already
        //if so then set the rendering Mode...
      } else if (usedRenderingMode !== -1) {
        xtra += "0 Tr\n";
      }

      if (Object.prototype.toString.call(text) === '[object Array]') {
        // we don't want to destroy  original text array, so cloning it
        var sa = text.concat();
        var da = [];
        var len = sa.length;
        var activeFont = fonts[activeFontKey];
        var isHex = activeFont.encoding === "MacRomanEncoding";
        var isCustom = activeFontKey.slice(1) > 13;
        // we do array.join('text that must not be PDFescaped")
        // thus, pdfEscape each component separately

        while (len--) {
          da.push(isHex ? activeFont.metadata.encode(activeFont.metadata.subset, sa.shift(), R2L) : ESC(sa.shift()));
        }

        //align

        align = align || options.align || 'left';
        var leading = activeFontSize * lineHeightProportion;
        var option = isCustom ? {
          font: activeFont.metadata,
          fontSize: activeFontSize,
          charSpace: activeCharSpace
        } : {};
        var lineWidths = text.map(function (v) {
          return this.getStringUnitWidth(v, option) * activeFontSize / k;
        }, this);
        var maxLineLength = Math.max.apply(Math, lineWidths);
        var bracketOpen = isHex ? '<' : '(';
        var bracketClose = isHex ? '>' : ')';
        var left;
        var prevX;
        var delta;
        var i;

        if (align) {
          if (align === "left") {
            prevX = x;
          } else if (align === "center") {
            left = x - maxLineLength / 2;
            x -= lineWidths[0] / 2;
          } else if (align === "right") {
            left = x - maxLineLength;
            x -= lineWidths[0];
          } else {
            throw new Error('Unrecognized alignment option, use "left", "center", "right".');
          }
          text = da[0];
          for (i = 1, len = da.length; i < len; i++) {
            delta = maxLineLength - lineWidths[i];
            if (align === "center") delta /= 2;
            text += bracketClose + "Tj\n" + (left - prevX + delta) + " -" + leading + " Td " + bracketOpen + da[i];
            prevX = left + delta;
          }
        }
        text = bracketOpen + da.join(bracketClose + " Tj\nT* " + bracketOpen) + bracketClose;
      } else {
        throw new Error('Type of text must be string or Array. "' + text + '" is not recognized.');
      }
      // Using "'" ("go next line and render text" mark) would save space but would complicate our rendering code, templates

      // BT .. ET does NOT have default settings for Tf. You must state that explicitely every time for BT .. ET
      // if you want text transformation matrix (+ multiline) to work reliably (which reads sizes of things from font declarations)
      // Thus, there is NO useful, *reliable* concept of "default" font for a page.
      // The fact that "default" (reuse font used before) font worked before in basic cases is an accident
      // - readers dealing smartly with brokenness of jsPDF's markup.

      out('BT\n/' + activeFontKey + ' ' + activeFontSize + ' Tf\n' + // font face, style, size
      activeFontSize * lineHeightProportion + ' TL\n' + // line spacing
      textColor + '\n' + xtra + f2(x * k) + ' ' + f2((pageHeight - y) * k) + ' Td\n' + text + ' Tj\nET');

      return this;
    };

    /**
     * Letter spacing method to print text with gaps
     *
     * @function
     * @param {String|Array} text String to be added to the page.
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} spacing Spacing (in units declared at inception)
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name lstext
     * @deprecated We'll be removing this function. It doesn't take character width into account.
     */
    API.lstext = function (text, x, y, spacing) {
      console.warn('jsPDF.lstext is deprecated');
      for (var i = 0, len = text.length; i < len; i++, x += spacing) {
        this.text(text[i], x, y);
      }return this;
    };

    API.line = function (x1, y1, x2, y2) {
      return this.lines([[x2 - x1, y2 - y1]], x1, y1);
    };

    API.clip = function () {
      // By patrick-roberts, github.com/MrRio/jsPDF/issues/328
      // Call .clip() after calling .rect() with a style argument of null
      out('W'); // clip
      out('S'); // stroke path; necessary for clip to work
    };

    /**
     * This fixes the previous function clip(). Perhaps the 'stroke path' hack was due to the missing 'n' instruction?
     * We introduce the fixed version so as to not break API.
     * @param fillRule
     */
    API.clip_fixed = function (fillRule) {
      // Call .clip() after calling drawing ops with a style argument of null
      // W is the PDF clipping op
      if ('evenodd' === fillRule) {
        out('W*');
      } else {
        out('W');
      }
      // End the path object without filling or stroking it.
      // This operator is a path-painting no-op, used primarily for the side effect of changing the current clipping path
      // (see Section 4.4.3, “Clipping Path Operators”)
      out('n');
    };

    /**
     * Adds series of curves (straight lines or cubic bezier curves) to canvas, starting at `x`, `y` coordinates.
     * All data points in `lines` are relative to last line origin.
     * `x`, `y` become x1,y1 for first line / curve in the set.
     * For lines you only need to specify [x2, y2] - (ending point) vector against x1, y1 starting point.
     * For bezier curves you need to specify [x2,y2,x3,y3,x4,y4] - vectors to control points 1, 2, ending point. All vectors are against the start of the curve - x1,y1.
     *
     * @example .lines([[2,2],[-2,2],[1,1,2,2,3,3],[2,1]], 212,110, 10) // line, line, bezier curve, line
     * @param {Array} lines Array of *vector* shifts as pairs (lines) or sextets (cubic bezier curves).
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} scale (Defaults to [1.0,1.0]) x,y Scaling factor for all vectors. Elements can be any floating number Sub-one makes drawing smaller. Over-one grows the drawing. Negative flips the direction.
     * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @param {Boolean} closed If true, the path is closed with a straight line from the end of the last curve to the starting point.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name lines
     */
    API.lines = function (lines, x, y, scale, style, closed) {
      var scalex, scaley, i, l, leg, x2, y2, x3, y3, x4, y4;

      // Pre-August-2012 the order of arguments was function(x, y, lines, scale, style)
      // in effort to make all calls have similar signature like
      //   function(content, coordinateX, coordinateY , miscellaneous)
      // this method had its args flipped.
      // code below allows backward compatibility with old arg order.
      if (typeof lines === 'number') {
        tmp = y;
        y = x;
        x = lines;
        lines = tmp;
      }

      scale = scale || [1, 1];

      // starting point
      out(f3(x * k) + ' ' + f3((pageHeight - y) * k) + ' m ');

      scalex = scale[0];
      scaley = scale[1];
      l = lines.length;
      //, x2, y2 // bezier only. In page default measurement "units", *after* scaling
      //, x3, y3 // bezier only. In page default measurement "units", *after* scaling
      // ending point for all, lines and bezier. . In page default measurement "units", *after* scaling
      x4 = x; // last / ending point = starting point for first item.
      y4 = y; // last / ending point = starting point for first item.

      for (i = 0; i < l; i++) {
        leg = lines[i];
        if (leg.length === 2) {
          // simple line
          x4 = leg[0] * scalex + x4; // here last x4 was prior ending point
          y4 = leg[1] * scaley + y4; // here last y4 was prior ending point
          out(f3(x4 * k) + ' ' + f3((pageHeight - y4) * k) + ' l');
        } else {
          // bezier curve
          x2 = leg[0] * scalex + x4; // here last x4 is prior ending point
          y2 = leg[1] * scaley + y4; // here last y4 is prior ending point
          x3 = leg[2] * scalex + x4; // here last x4 is prior ending point
          y3 = leg[3] * scaley + y4; // here last y4 is prior ending point
          x4 = leg[4] * scalex + x4; // here last x4 was prior ending point
          y4 = leg[5] * scaley + y4; // here last y4 was prior ending point
          out(f3(x2 * k) + ' ' + f3((pageHeight - y2) * k) + ' ' + f3(x3 * k) + ' ' + f3((pageHeight - y3) * k) + ' ' + f3(x4 * k) + ' ' + f3((pageHeight - y4) * k) + ' c');
        }
      }

      if (closed) {
        out(' h');
      }

      // stroking / filling / both the path
      if (style !== null) {
        out(getStyle(style));
      }
      return this;
    };

    /**
     * Adds a rectangle to PDF
     *
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} w Width (in units declared at inception of PDF document)
     * @param {Number} h Height (in units declared at inception of PDF document)
     * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name rect
     */
    API.rect = function (x, y, w, h, style) {
      var op = getStyle(style);
      out([f2(x * k), f2((pageHeight - y) * k), f2(w * k), f2(-h * k), 're'].join(' '));

      if (style !== null) {
        out(getStyle(style));
      }

      return this;
    };

    /**
     * Adds a triangle to PDF
     *
     * @param {Number} x1 Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y1 Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} x2 Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y2 Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} x3 Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y3 Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name triangle
     */
    API.triangle = function (x1, y1, x2, y2, x3, y3, style) {
      this.lines([[x2 - x1, y2 - y1], // vector to point 2
      [x3 - x2, y3 - y2], // vector to point 3
      [x1 - x3, y1 - y3] // closing vector back to point 1
      ], x1, y1, // start of path
      [1, 1], style, true);
      return this;
    };

    /**
     * Adds a rectangle with rounded corners to PDF
     *
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} w Width (in units declared at inception of PDF document)
     * @param {Number} h Height (in units declared at inception of PDF document)
     * @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
     * @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
     * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name roundedRect
     */
    API.roundedRect = function (x, y, w, h, rx, ry, style) {
      var MyArc = 4 / 3 * (Math.SQRT2 - 1);
      this.lines([[w - 2 * rx, 0], [rx * MyArc, 0, rx, ry - ry * MyArc, rx, ry], [0, h - 2 * ry], [0, ry * MyArc, -(rx * MyArc), ry, -rx, ry], [-w + 2 * rx, 0], [-(rx * MyArc), 0, -rx, -(ry * MyArc), -rx, -ry], [0, -h + 2 * ry], [0, -(ry * MyArc), rx * MyArc, -ry, rx, -ry]], x + rx, y, // start of path
      [1, 1], style);
      return this;
    };

    /**
     * Adds an ellipse to PDF
     *
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} rx Radius along x axis (in units declared at inception of PDF document)
     * @param {Number} rx Radius along y axis (in units declared at inception of PDF document)
     * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name ellipse
     */
    API.ellipse = function (x, y, rx, ry, style) {
      var lx = 4 / 3 * (Math.SQRT2 - 1) * rx,
          ly = 4 / 3 * (Math.SQRT2 - 1) * ry;

      out([f2((x + rx) * k), f2((pageHeight - y) * k), 'm', f2((x + rx) * k), f2((pageHeight - (y - ly)) * k), f2((x + lx) * k), f2((pageHeight - (y - ry)) * k), f2(x * k), f2((pageHeight - (y - ry)) * k), 'c'].join(' '));
      out([f2((x - lx) * k), f2((pageHeight - (y - ry)) * k), f2((x - rx) * k), f2((pageHeight - (y - ly)) * k), f2((x - rx) * k), f2((pageHeight - y) * k), 'c'].join(' '));
      out([f2((x - rx) * k), f2((pageHeight - (y + ly)) * k), f2((x - lx) * k), f2((pageHeight - (y + ry)) * k), f2(x * k), f2((pageHeight - (y + ry)) * k), 'c'].join(' '));
      out([f2((x + lx) * k), f2((pageHeight - (y + ry)) * k), f2((x + rx) * k), f2((pageHeight - (y + ly)) * k), f2((x + rx) * k), f2((pageHeight - y) * k), 'c'].join(' '));

      if (style !== null) {
        out(getStyle(style));
      }

      return this;
    };

    /**
     * Adds an circle to PDF
     *
     * @param {Number} x Coordinate (in units declared at inception of PDF document) against left edge of the page
     * @param {Number} y Coordinate (in units declared at inception of PDF document) against upper edge of the page
     * @param {Number} r Radius (in units declared at inception of PDF document)
     * @param {String} style A string specifying the painting style or null.  Valid styles include: 'S' [default] - stroke, 'F' - fill,  and 'DF' (or 'FD') -  fill then stroke. A null value postpones setting the style so that a shape may be composed using multiple method calls. The last drawing method call used to define the shape should not have a null style argument.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name circle
     */
    API.circle = function (x, y, r, style) {
      return this.ellipse(x, y, r, r, style);
    };

    /**
     * Adds a properties to the PDF document
     *
     * @param {Object} A property_name-to-property_value object structure.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setProperties
     */
    API.setProperties = function (properties) {
      // copying only those properties we can render.
      for (var property in documentProperties) {
        if (documentProperties.hasOwnProperty(property) && properties[property]) {
          documentProperties[property] = properties[property];
        }
      }
      return this;
    };

    /**
     * Sets font size for upcoming text elements.
     *
     * @param {Number} size Font size in points.
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setFontSize
     */
    API.setFontSize = function (size) {
      activeFontSize = size;
      return this;
    };

    /**
     * Sets text font face, variant for upcoming text elements.
     * See output of jsPDF.getFontList() for possible font names, styles.
     *
     * @param {String} fontName Font name or family. Example: "times"
     * @param {String} fontStyle Font style or variant. Example: "italic"
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setFont
     */
    API.setFont = function (fontName, fontStyle) {
      activeFontKey = _getFont(fontName, fontStyle);
      // if font is not found, the above line blows up and we never go further
      return this;
    };

    /**
     * Switches font style or variant for upcoming text elements,
     * while keeping the font face or family same.
     * See output of jsPDF.getFontList() for possible font names, styles.
     *
     * @param {String} style Font style or variant. Example: "italic"
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setFontStyle
     */
    API.setFontStyle = API.setFontType = function (style) {
      activeFontKey = _getFont(undefined, style);
      // if font is not found, the above line blows up and we never go further
      return this;
    };

    /**
     * Returns an object - a tree of fontName to fontStyle relationships available to
     * active PDF document.
     *
     * @public
     * @function
     * @returns {Object} Like {'times':['normal', 'italic', ... ], 'arial':['normal', 'bold', ... ], ... }
     * @methodOf jsPDF#
     * @name getFontList
     */
    API.getFontList = function () {
      // TODO: iterate over fonts array or return copy of fontmap instead in case more are ever added.
      var list = {},
          fontName,
          fontStyle,
          tmp;

      for (fontName in fontmap) {
        if (fontmap.hasOwnProperty(fontName)) {
          list[fontName] = tmp = [];
          for (fontStyle in fontmap[fontName]) {
            if (fontmap[fontName].hasOwnProperty(fontStyle)) {
              tmp.push(fontStyle);
            }
          }
        }
      }

      return list;
    };

    /**
     * Add a custom font.
     *
     * @param {String} Postscript name of the Font.  Example: "Menlo-Regular"
     * @param {String} Name of font-family from @font-face definition.  Example: "Menlo Regular"
     * @param {String} Font style.  Example: "normal"
     * @function
     * @returns the {fontKey} (same as the internal method)
     * @methodOf jsPDF#
     * @name addFont
     */
    API.addFont = function (postScriptName, fontName, fontStyle, encoding) {
      addFont(postScriptName, fontName, fontStyle, encoding);
    };

    /**
     * Sets line width for upcoming lines.
     *
     * @param {Number} width Line width (in units declared at inception of PDF document)
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setLineWidth
     */
    API.setLineWidth = function (width) {
      out((width * k).toFixed(2) + ' w');
      return this;
    };

    /**
     * Sets the stroke color for upcoming elements.
     *
     * Depending on the number of arguments given, Gray, RGB, or CMYK
     * color space is implied.
     *
     * When only ch1 is given, "Gray" color space is implied and it
     * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
     * if values are communicated as String types, or in range from 0 (black)
     * to 255 (white) if communicated as Number type.
     * The RGB-like 0-255 range is provided for backward compatibility.
     *
     * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
     * value must be in the range from 0.00 (minimum intensity) to to 1.00
     * (max intensity) if values are communicated as String types, or
     * from 0 (min intensity) to to 255 (max intensity) if values are communicated
     * as Number types.
     * The RGB-like 0-255 range is provided for backward compatibility.
     *
     * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
     * value must be a in the range from 0.00 (0% concentration) to to
     * 1.00 (100% concentration)
     *
     * Because JavaScript treats fixed point numbers badly (rounds to
     * floating point nearest to binary representation) it is highly advised to
     * communicate the fractional numbers as String types, not JavaScript Number type.
     *
     * @param {Number|String} ch1 Color channel value
     * @param {Number|String} ch2 Color channel value
     * @param {Number|String} ch3 Color channel value
     * @param {Number|String} ch4 Color channel value
     *
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setDrawColor
     */
    API.setDrawColor = function (ch1, ch2, ch3, ch4) {
      var color;
      if (ch2 === undefined || ch4 === undefined && ch1 === ch2 === ch3) {
        // Gray color space.
        if (typeof ch1 === 'string') {
          color = ch1 + ' G';
        } else {
          color = f2(ch1 / 255) + ' G';
        }
      } else if (ch4 === undefined) {
        // RGB
        if (typeof ch1 === 'string') {
          color = [ch1, ch2, ch3, 'RG'].join(' ');
        } else {
          color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'RG'].join(' ');
        }
      } else {
        // CMYK
        if (typeof ch1 === 'string') {
          color = [ch1, ch2, ch3, ch4, 'K'].join(' ');
        } else {
          color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'K'].join(' ');
        }
      }

      out(color);
      return this;
    };

    /**
     * Sets the fill color for upcoming elements.
     *
     * Depending on the number of arguments given, Gray, RGB, or CMYK
     * color space is implied.
     *
     * When only ch1 is given, "Gray" color space is implied and it
     * must be a value in the range from 0.00 (solid black) to to 1.00 (white)
     * if values are communicated as String types, or in range from 0 (black)
     * to 255 (white) if communicated as Number type.
     * The RGB-like 0-255 range is provided for backward compatibility.
     *
     * When only ch1,ch2,ch3 are given, "RGB" color space is implied and each
     * value must be in the range from 0.00 (minimum intensity) to to 1.00
     * (max intensity) if values are communicated as String types, or
     * from 0 (min intensity) to to 255 (max intensity) if values are communicated
     * as Number types.
     * The RGB-like 0-255 range is provided for backward compatibility.
     *
     * When ch1,ch2,ch3,ch4 are given, "CMYK" color space is implied and each
     * value must be a in the range from 0.00 (0% concentration) to to
     * 1.00 (100% concentration)
     *
     * Because JavaScript treats fixed point numbers badly (rounds to
     * floating point nearest to binary representation) it is highly advised to
     * communicate the fractional numbers as String types, not JavaScript Number type.
     *
     * @param {Number|String} ch1 Color channel value
     * @param {Number|String} ch2 Color channel value
     * @param {Number|String} ch3 Color channel value
     * @param {Number|String} ch4 Color channel value
     *
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setFillColor
     */
    API.setFillColor = function (ch1, ch2, ch3, ch4) {
      var color;

      if (ch2 === undefined || ch4 === undefined && ch1 === ch2 === ch3) {
        // Gray color space.
        if (typeof ch1 === 'string') {
          color = ch1 + ' g';
        } else {
          color = f2(ch1 / 255) + ' g';
        }
      } else if (ch4 === undefined || (typeof ch4 === 'undefined' ? 'undefined' : _typeof(ch4)) === 'object') {
        // RGB
        if (typeof ch1 === 'string') {
          color = [ch1, ch2, ch3, 'rg'].join(' ');
        } else {
          color = [f2(ch1 / 255), f2(ch2 / 255), f2(ch3 / 255), 'rg'].join(' ');
        }
        if (ch4 && ch4.a === 0) {
          //TODO Implement transparency.
          //WORKAROUND use white for now
          color = ['255', '255', '255', 'rg'].join(' ');
        }
      } else {
        // CMYK
        if (typeof ch1 === 'string') {
          color = [ch1, ch2, ch3, ch4, 'k'].join(' ');
        } else {
          color = [f2(ch1), f2(ch2), f2(ch3), f2(ch4), 'k'].join(' ');
        }
      }

      out(color);
      return this;
    };

    /**
     * Sets the text color for upcoming elements.
     * If only one, first argument is given,
     * treats the value as gray-scale color value.
     *
     * @param {Number} r Red channel color value in range 0-255 or {String} r color value in hexadecimal, example: '#FFFFFF'
     * @param {Number} g Green channel color value in range 0-255
     * @param {Number} b Blue channel color value in range 0-255
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setTextColor
     */
    API.setTextColor = function (r, g, b) {
      if (typeof r === 'string' && /^#[0-9A-Fa-f]{6}$/.test(r)) {
        var hex = parseInt(r.substr(1), 16);
        r = hex >> 16 & 255;
        g = hex >> 8 & 255;
        b = hex & 255;
      }

      if (r === 0 && g === 0 && b === 0 || typeof g === 'undefined') {
        textColor = f3(r / 255) + ' g';
      } else {
        textColor = [f3(r / 255), f3(g / 255), f3(b / 255), 'rg'].join(' ');
      }
      return this;
    };

    /**
     * Initializes the default character set that the user wants to be global..
     *
     * @param {Number} charSpace
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setCharSpace
     */

    API.setCharSpace = function (charSpace) {
      activeCharSpace = charSpace;
      return this;
    };

    /**
     * Initializes the default character set that the user wants to be global..
     *
     * @param {Boolean} boolean
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setR2L
     */

    API.setR2L = function (boolean) {
      R2L = boolean;
      return this;
    };

    /**
     * Is an Object providing a mapping from human-readable to
     * integer flag values designating the varieties of line cap
     * and join styles.
     *
     * @returns {Object}
     * @fieldOf jsPDF#
     * @name CapJoinStyles
     */
    API.CapJoinStyles = {
      0: 0,
      'butt': 0,
      'but': 0,
      'miter': 0,
      1: 1,
      'round': 1,
      'rounded': 1,
      'circle': 1,
      2: 2,
      'projecting': 2,
      'project': 2,
      'square': 2,
      'bevel': 2
    };

    /**
     * Sets the line cap styles
     * See {jsPDF.CapJoinStyles} for variants
     *
     * @param {String|Number} style A string or number identifying the type of line cap
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setLineCap
     */
    API.setLineCap = function (style) {
      var id = this.CapJoinStyles[style];
      if (id === undefined) {
        throw new Error("Line cap style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
      }
      lineCapID = id;
      out(id + ' J');

      return this;
    };

    /**
     * Sets the line join styles
     * See {jsPDF.CapJoinStyles} for variants
     *
     * @param {String|Number} style A string or number identifying the type of line join
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name setLineJoin
     */
    API.setLineJoin = function (style) {
      var id = this.CapJoinStyles[style];
      if (id === undefined) {
        throw new Error("Line join style of '" + style + "' is not recognized. See or extend .CapJoinStyles property for valid styles");
      }
      lineJoinID = id;
      out(id + ' j');

      return this;
    };

    // Output is both an internal (for plugins) and external function
    API.output = _output;

    /**
     * Saves as PDF document. An alias of jsPDF.output('save', 'filename.pdf')
     * @param  {String} filename The filename including extension.
     *
     * @function
     * @returns {jsPDF}
     * @methodOf jsPDF#
     * @name save
     */
    API.save = function (filename) {
      API.output('save', filename);
    };

    // applying plugins (more methods) ON TOP of built-in API.
    // this is intentional as we allow plugins to override
    // built-ins
    for (var plugin in jsPDF.API) {
      if (jsPDF.API.hasOwnProperty(plugin)) {
        if (plugin === 'events' && jsPDF.API.events.length) {
          (function (events, newEvents) {

            // jsPDF.API.events is a JS Array of Arrays
            // where each Array is a pair of event name, handler
            // Events were added by plugins to the jsPDF instantiator.
            // These are always added to the new instance and some ran
            // during instantiation.
            var eventname, handler_and_args, i;

            for (i = newEvents.length - 1; i !== -1; i--) {
              // subscribe takes 3 args: 'topic', function, runonce_flag
              // if undefined, runonce is false.
              // users can attach callback directly,
              // or they can attach an array with [callback, runonce_flag]
              // that's what the "apply" magic is for below.
              eventname = newEvents[i][0];
              handler_and_args = newEvents[i][1];
              events.subscribe.apply(events, [eventname].concat(typeof handler_and_args === 'function' ? [handler_and_args] : handler_and_args));
            }
          })(events, jsPDF.API.events);
        } else {
          API[plugin] = jsPDF.API[plugin];
        }
      }
    }

    //////////////////////////////////////////////////////
    // continuing initialization of jsPDF Document object
    //////////////////////////////////////////////////////
    // Add the first page automatically
    addFonts();
    activeFontKey = 'F1';
    _addPage(format, orientation);

    events.publish('initialized');
    return API;
  }

  /**
   * jsPDF.API is a STATIC property of jsPDF class.
   * jsPDF.API is an object you can add methods and properties to.
   * The methods / properties you add will show up in new jsPDF objects.
   *
   * One property is prepopulated. It is the 'events' Object. Plugin authors can add topics,
   * callbacks to this object. These will be reassigned to all new instances of jsPDF.
   * Examples:
   * jsPDF.API.events['initialized'] = function(){ 'this' is API object }
   * jsPDF.API.events['addFont'] = function(added_font_object){ 'this' is API object }
   *
   * @static
   * @public
   * @memberOf jsPDF
   * @name API
   *
   * @example
   * jsPDF.API.mymethod = function(){
   *   // 'this' will be ref to internal API object. see jsPDF source
   *   // , so you can refer to built-in methods like so:
   *   //     this.line(....)
   *   //     this.text(....)
   * }
   * var pdfdoc = new jsPDF()
   * pdfdoc.mymethod() // <- !!!!!!
   */
  jsPDF.API = {
    events: []
  };
  jsPDF.version = "1.x-master";

  if (typeof define === 'function' && define.amd) {
    define('jsPDF', function () {
      return jsPDF;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = jsPDF;
  } else {
    global.jsPDF = jsPDF;
  }
  return jsPDF;
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || window);

/**
 * jsPDF AcroForm Plugin
 * Copyright (c) 2016 Alexander Weidt, https://github.com/BiggA94
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

(window.AcroForm = function (jsPDFAPI) {
    'use strict';

    var AcroForm = window.AcroForm;

    AcroForm.scale = function (x) {
        return x * (acroformPlugin.internal.scaleFactor / 1); // 1 = (96 / 72)
    };
    AcroForm.antiScale = function (x) {
        return 1 / acroformPlugin.internal.scaleFactor * x;
    };

    var acroformPlugin = {
        fields: [],
        xForms: [],
        /**
         * acroFormDictionaryRoot contains information about the AcroForm Dictionary
         * 0: The Event-Token, the AcroFormDictionaryCallback has
         * 1: The Object ID of the Root
         */
        acroFormDictionaryRoot: null,
        /**
         * After the PDF gets evaluated, the reference to the root has to be reset,
         * this indicates, whether the root has already been printed out
         */
        printedOut: false,
        internal: null
    };

    jsPDF.API.acroformPlugin = acroformPlugin;

    var annotReferenceCallback = function annotReferenceCallback() {
        for (var i in this.acroformPlugin.acroFormDictionaryRoot.Fields) {
            var formObject = this.acroformPlugin.acroFormDictionaryRoot.Fields[i];
            // add Annot Reference!
            if (formObject.hasAnnotation) {
                // If theres an Annotation Widget in the Form Object, put the Reference in the /Annot array
                createAnnotationReference.call(this, formObject);
            }
        }
    };

    var createAcroForm = function createAcroForm() {
        if (this.acroformPlugin.acroFormDictionaryRoot) {
            //return;
            throw new Error("Exception while creating AcroformDictionary");
        }

        // The Object Number of the AcroForm Dictionary
        this.acroformPlugin.acroFormDictionaryRoot = new AcroForm.AcroFormDictionary();

        this.acroformPlugin.internal = this.internal;

        // add Callback for creating the AcroForm Dictionary
        this.acroformPlugin.acroFormDictionaryRoot._eventID = this.internal.events.subscribe('postPutResources', AcroFormDictionaryCallback);

        this.internal.events.subscribe('buildDocument', annotReferenceCallback); //buildDocument

        // Register event, that is triggered when the DocumentCatalog is written, in order to add /AcroForm
        this.internal.events.subscribe('putCatalog', putCatalogCallback);

        // Register event, that creates all Fields
        this.internal.events.subscribe('postPutPages', createFieldCallback);
    };

    /**
     * Create the Reference to the widgetAnnotation, so that it gets referenced in the Annot[] int the+
     * (Requires the Annotation Plugin)
     */
    var createAnnotationReference = function createAnnotationReference(object) {
        var options = {
            type: 'reference',
            object: object
        };
        jsPDF.API.annotationPlugin.annotations[this.internal.getPageInfo(object.page).pageNumber].push(options);
    };

    var putForm = function putForm(formObject) {
        if (this.acroformPlugin.printedOut) {
            this.acroformPlugin.printedOut = false;
            this.acroformPlugin.acroFormDictionaryRoot = null;
        }
        if (!this.acroformPlugin.acroFormDictionaryRoot) {
            createAcroForm.call(this);
        }
        this.acroformPlugin.acroFormDictionaryRoot.Fields.push(formObject);
    };

    // Callbacks

    var putCatalogCallback = function putCatalogCallback() {
        //Put reference to AcroForm to DocumentCatalog
        if (typeof this.acroformPlugin.acroFormDictionaryRoot != 'undefined') {
            // for safety, shouldn't normally be the case
            this.internal.write('/AcroForm ' + this.acroformPlugin.acroFormDictionaryRoot.objId + ' ' + 0 + ' R');
        } else {
            console.log('Root missing...');
        }
    };

    /**
     * Adds /Acroform X 0 R to Document Catalog,
     * and creates the AcroForm Dictionary
     */
    var AcroFormDictionaryCallback = function AcroFormDictionaryCallback() {
        // Remove event
        this.internal.events.unsubscribe(this.acroformPlugin.acroFormDictionaryRoot._eventID);

        delete this.acroformPlugin.acroFormDictionaryRoot._eventID;

        this.acroformPlugin.printedOut = true;
    };

    /**
     * Creates the single Fields and writes them into the Document
     *
     * If fieldArray is set, use the fields that are inside it instead of the fields from the AcroRoot
     * (for the FormXObjects...)
     */
    var createFieldCallback = function createFieldCallback(fieldArray) {
        var standardFields = !fieldArray;

        if (!fieldArray) {
            // in case there is no fieldArray specified, we want to print out the Fields of the AcroForm
            // Print out Root
            this.internal.newObjectDeferredBegin(this.acroformPlugin.acroFormDictionaryRoot.objId);
            this.internal.out(this.acroformPlugin.acroFormDictionaryRoot.getString());
        }

        var fieldArray = fieldArray || this.acroformPlugin.acroFormDictionaryRoot.Kids;

        for (var i in fieldArray) {
            var form = fieldArray[i];

            var oldRect = form.Rect;

            if (form.Rect) {
                form.Rect = AcroForm.internal.calculateCoordinates.call(this, form.Rect);
            }

            // Start Writing the Object
            this.internal.newObjectDeferredBegin(form.objId);

            var content = "";
            content += form.objId + " 0 obj\n";

            content += "<<\n" + form.getContent();

            form.Rect = oldRect;

            if (form.hasAppearanceStream && !form.appearanceStreamContent) {
                // Calculate Appearance
                var appearance = AcroForm.internal.calculateAppearanceStream.call(this, form);
                content += "/AP << /N " + appearance + " >>\n";

                this.acroformPlugin.xForms.push(appearance);
            }

            // Assume AppearanceStreamContent is a Array with N,R,D (at least one of them!)
            if (form.appearanceStreamContent) {
                content += "/AP << ";
                // Iterate over N,R and D
                for (var k in form.appearanceStreamContent) {
                    var value = form.appearanceStreamContent[k];
                    content += "/" + k + " ";
                    content += "<< ";
                    if (Object.keys(value).length >= 1 || Array.isArray(value)) {
                        // appearanceStream is an Array or Object!
                        for (var i in value) {
                            var obj = value[i];
                            if (typeof obj === 'function') {
                                // if Function is referenced, call it in order to get the FormXObject
                                obj = obj.call(this, form);
                            }
                            content += "/" + i + " " + obj + " ";

                            // In case the XForm is already used, e.g. OffState of CheckBoxes, don't add it
                            if (!(this.acroformPlugin.xForms.indexOf(obj) >= 0)) this.acroformPlugin.xForms.push(obj);
                        }
                    } else {
                        var obj = value;
                        if (typeof obj === 'function') {
                            // if Function is referenced, call it in order to get the FormXObject
                            obj = obj.call(this, form);
                        }
                        content += "/" + i + " " + obj + " \n";
                        if (!(this.acroformPlugin.xForms.indexOf(obj) >= 0)) this.acroformPlugin.xForms.push(obj);
                    }
                    content += " >>\n";
                }

                // appearance stream is a normal Object..
                content += ">>\n";
            }

            content += ">>\nendobj\n";

            this.internal.out(content);
        }
        if (standardFields) {
            createXFormObjectCallback.call(this, this.acroformPlugin.xForms);
        }
    };

    var createXFormObjectCallback = function createXFormObjectCallback(fieldArray) {
        for (var i in fieldArray) {
            var key = i;
            var form = fieldArray[i];
            // Start Writing the Object
            this.internal.newObjectDeferredBegin(form && form.objId);

            var content = "";
            content += form ? form.getString() : '';
            this.internal.out(content);

            delete fieldArray[key];
        }
    };

    // Public:

    jsPDFAPI.addField = function (fieldObject) {
        //var opt = parseOptions(fieldObject);
        if (fieldObject instanceof AcroForm.TextField) {
            addTextField.call(this, fieldObject);
        } else if (fieldObject instanceof AcroForm.ChoiceField) {
            addChoiceField.call(this, fieldObject);
        } else if (fieldObject instanceof AcroForm.Button) {
            addButton.call(this, fieldObject);
        } else if (fieldObject instanceof AcroForm.ChildClass) {
            putForm.call(this, fieldObject);
        } else if (fieldObject) {
            // try to put..
            putForm.call(this, fieldObject);
        }
        fieldObject.page = this.acroformPlugin.internal.getCurrentPageInfo().pageNumber;
        return this;
    };

    // ############### sort in:

    /**
     * Button
     * FT = Btn
     */
    var addButton = function addButton(options) {
        var options = options || new AcroForm.Field();

        options.FT = '/Btn';

        /**
         * Calculating the Ff entry:
         *
         * The Ff entry contains flags, that have to be set bitwise
         * In the Following the number in the Comment is the BitPosition
         */
        var flags = options.Ff || 0;

        // 17, Pushbutton
        if (options.pushbutton) {
            // Options.pushbutton should be 1 or 0
            flags = AcroForm.internal.setBitPosition(flags, 17);
            delete options.pushbutton;
        }

        //16, Radio
        if (options.radio) {
            //flags = options.Ff | options.radio << 15;
            flags = AcroForm.internal.setBitPosition(flags, 16);
            delete options.radio;
        }

        // 15, NoToggleToOff (Radio buttons only
        if (options.noToggleToOff) {
            //flags = options.Ff | options.noToggleToOff << 14;
            flags = AcroForm.internal.setBitPosition(flags, 15);
            //delete options.noToggleToOff;
        }

        // In case, there is no Flag set, it is a check-box
        options.Ff = flags;

        putForm.call(this, options);
    };

    var addTextField = function addTextField(options) {
        var options = options || new AcroForm.Field();

        options.FT = '/Tx';

        /**
         * Calculating the Ff entry:
         *
         * The Ff entry contains flags, that have to be set bitwise
         * In the Following the number in the Comment is the BitPosition
         */

        var flags = options.Ff || 0;

        // 13, multiline
        if (options.multiline) {
            // Set Flag
            flags = flags | 1 << 12;
            // Remove multiline from FieldObject
            //delete options.multiline;
        }

        // 14, Password
        if (options.password) {
            flags = flags | 1 << 13;
            //delete options.password;
        }

        // 21, FileSelect, PDF 1.4...
        if (options.fileSelect) {
            flags = flags | 1 << 20;
            //delete options.fileSelect;
        }

        // 23, DoNotSpellCheck, PDF 1.4...
        if (options.doNotSpellCheck) {
            flags = flags | 1 << 22;
            //delete options.doNotSpellCheck;
        }

        // 24, DoNotScroll, PDF 1.4...
        if (options.doNotScroll) {
            flags = flags | 1 << 23;
            //delete options.doNotScroll;
        }

        options.Ff = options.Ff || flags;

        // Add field
        putForm.call(this, options);
    };

    var addChoiceField = function addChoiceField(opt) {
        var options = opt || new AcroForm.Field();

        options.FT = '/Ch';

        /**
         * Calculating the Ff entry:
         *
         * The Ff entry contains flags, that have to be set bitwise
         * In the Following the number in the Comment is the BitPosition
         */

        var flags = options.Ff || 0;

        // 18, Combo (If not set, the choiceField is a listBox!!)
        if (options.combo) {
            // Set Flag
            flags = AcroForm.internal.setBitPosition(flags, 18);
            // Remove combo from FieldObject
            delete options.combo;
        }

        // 19, Edit
        if (options.edit) {
            flags = AcroForm.internal.setBitPosition(flags, 19);
            delete options.edit;
        }

        // 20, Sort
        if (options.sort) {
            flags = AcroForm.internal.setBitPosition(flags, 20);
            delete options.sort;
        }

        // 22, MultiSelect (PDF 1.4)
        if (options.multiSelect && this.internal.getPDFVersion() >= 1.4) {
            flags = AcroForm.internal.setBitPosition(flags, 22);
            delete options.multiSelect;
        }

        // 23, DoNotSpellCheck (PDF 1.4)
        if (options.doNotSpellCheck && this.internal.getPDFVersion() >= 1.4) {
            flags = AcroForm.internal.setBitPosition(flags, 23);
            delete options.doNotSpellCheck;
        }

        options.Ff = flags;

        //options.hasAnnotation = true;

        // Add field
        putForm.call(this, options);
    };
})(jsPDF.API);

var AcroForm = window.AcroForm;

AcroForm.internal = {};

AcroForm.createFormXObject = function (formObject) {
    var xobj = new AcroForm.FormXObject();
    var height = AcroForm.Appearance.internal.getHeight(formObject) || 0;
    var width = AcroForm.Appearance.internal.getWidth(formObject) || 0;
    xobj.BBox = [0, 0, width, height];
    return xobj;
};

// Contains Methods for creating standard appearances
AcroForm.Appearance = {
    CheckBox: {
        createAppearanceStream: function createAppearanceStream() {
            var appearance = {
                N: {
                    On: AcroForm.Appearance.CheckBox.YesNormal
                },
                D: {
                    On: AcroForm.Appearance.CheckBox.YesPushDown,
                    Off: AcroForm.Appearance.CheckBox.OffPushDown
                }
            };

            return appearance;
        },
        /**
         * If any other icons are needed, the number between the brackets can be changed
         * @returns {string}
         */
        createMK: function createMK() {
            // 3-> Hook
            return "<< /CA (3)>>";
        },
        /**
         * Returns the standard On Appearance for a CheckBox
         * @returns {AcroForm.FormXObject}
         */
        YesPushDown: function YesPushDown(formObject) {
            var xobj = AcroForm.createFormXObject(formObject);
            var stream = "";
            // F13 is ZapfDingbats (Symbolic)
            formObject.Q = 1; // set text-alignment as centered
            var calcRes = AcroForm.internal.calculateX(formObject, "3", "ZapfDingbats", 50);
            stream += "0.749023 g\n\
             0 0 " + AcroForm.Appearance.internal.getWidth(formObject) + " " + AcroForm.Appearance.internal.getHeight(formObject) + " re\n\
             f\n\
             BMC\n\
             q\n\
             0 0 1 rg\n\
             /F13 " + calcRes.fontSize + " Tf 0 g\n\
             BT\n";
            stream += calcRes.text;
            stream += "ET\n\
             Q\n\
             EMC\n";
            xobj.stream = stream;
            return xobj;
        },

        YesNormal: function YesNormal(formObject) {
            var xobj = AcroForm.createFormXObject(formObject);
            var stream = "";
            formObject.Q = 1; // set text-alignment as centered
            var calcRes = AcroForm.internal.calculateX(formObject, "3", "ZapfDingbats", AcroForm.Appearance.internal.getHeight(formObject) * 0.9);
            stream += "1 g\n\
0 0 " + AcroForm.Appearance.internal.getWidth(formObject) + " " + AcroForm.Appearance.internal.getHeight(formObject) + " re\n\
f\n\
q\n\
0 0 1 rg\n\
0 0 " + (AcroForm.Appearance.internal.getWidth(formObject) - 1) + " " + (AcroForm.Appearance.internal.getHeight(formObject) - 1) + " re\n\
W\n\
n\n\
0 g\n\
BT\n\
/F13 " + calcRes.fontSize + " Tf 0 g\n";
            stream += calcRes.text;
            stream += "ET\n\
             Q\n";
            xobj.stream = stream;
            return xobj;
        },

        /**
         * Returns the standard Off Appearance for a CheckBox
         * @returns {AcroForm.FormXObject}
         */
        OffPushDown: function OffPushDown(formObject) {
            var xobj = AcroForm.createFormXObject(formObject);
            var stream = "";
            stream += "0.749023 g\n\
            0 0 " + AcroForm.Appearance.internal.getWidth(formObject) + " " + AcroForm.Appearance.internal.getHeight(formObject) + " re\n\
            f\n";
            xobj.stream = stream;
            return xobj;
        }
    },

    RadioButton: {
        Circle: {
            createAppearanceStream: function createAppearanceStream(name) {
                var appearanceStreamContent = {
                    D: {
                        'Off': AcroForm.Appearance.RadioButton.Circle.OffPushDown
                    },
                    N: {}
                };
                appearanceStreamContent.N[name] = AcroForm.Appearance.RadioButton.Circle.YesNormal;
                appearanceStreamContent.D[name] = AcroForm.Appearance.RadioButton.Circle.YesPushDown;
                return appearanceStreamContent;
            },
            createMK: function createMK() {
                return "<< /CA (l)>>";
            },

            YesNormal: function YesNormal(formObject) {
                var xobj = AcroForm.createFormXObject(formObject);
                var stream = "";
                // Make the Radius of the Circle relative to min(height, width) of formObject
                var DotRadius = AcroForm.Appearance.internal.getWidth(formObject) <= AcroForm.Appearance.internal.getHeight(formObject) ? AcroForm.Appearance.internal.getWidth(formObject) / 4 : AcroForm.Appearance.internal.getHeight(formObject) / 4;
                // The Borderpadding...
                DotRadius *= 0.9;
                var c = AcroForm.Appearance.internal.Bezier_C;
                /*
                 The Following is a Circle created with Bezier-Curves.
                 */
                stream += "q\n\
1 0 0 1 " + AcroForm.Appearance.internal.getWidth(formObject) / 2 + " " + AcroForm.Appearance.internal.getHeight(formObject) / 2 + " cm\n\
" + DotRadius + " 0 m\n\
" + DotRadius + " " + DotRadius * c + " " + DotRadius * c + " " + DotRadius + " 0 " + DotRadius + " c\n\
-" + DotRadius * c + " " + DotRadius + " -" + DotRadius + " " + DotRadius * c + " -" + DotRadius + " 0 c\n\
-" + DotRadius + " -" + DotRadius * c + " -" + DotRadius * c + " -" + DotRadius + " 0 -" + DotRadius + " c\n\
" + DotRadius * c + " -" + DotRadius + " " + DotRadius + " -" + DotRadius * c + " " + DotRadius + " 0 c\n\
f\n\
Q\n";
                xobj.stream = stream;
                return xobj;
            },
            YesPushDown: function YesPushDown(formObject) {
                var xobj = AcroForm.createFormXObject(formObject);
                var stream = "";
                var DotRadius = AcroForm.Appearance.internal.getWidth(formObject) <= AcroForm.Appearance.internal.getHeight(formObject) ? AcroForm.Appearance.internal.getWidth(formObject) / 4 : AcroForm.Appearance.internal.getHeight(formObject) / 4;
                // The Borderpadding...
                DotRadius *= 0.9;
                // Save results for later use; no need to waste processor ticks on doing math
                var k = DotRadius * 2;
                // var c = AcroForm.Appearance.internal.Bezier_C;
                var kc = k * AcroForm.Appearance.internal.Bezier_C;
                var dc = DotRadius * AcroForm.Appearance.internal.Bezier_C;
                //                 stream += "0.749023 g\n\
                //             q\n\
                //           1 0 0 1 " + AcroForm.Appearance.internal.getWidth(formObject) / 2 + " " + AcroForm.Appearance.internal.getHeight(formObject) / 2 + " cm\n\
                // " + DotRadius * 2 + " 0 m\n\
                // " + DotRadius * 2 + " " + DotRadius * 2 * c + " " + DotRadius * 2 * c + " " + DotRadius * 2 + " 0 " + DotRadius * 2 + " c\n\
                // -" + DotRadius * 2 * c + " " + DotRadius * 2 + " -" + DotRadius * 2 + " " + DotRadius * 2 * c + " -" + DotRadius * 2 + " 0 c\n\
                // -" + DotRadius * 2 + " -" + DotRadius * 2 * c + " -" + DotRadius * 2 * c + " -" + DotRadius * 2 + " 0 -" + DotRadius * 2 + " c\n\
                // " + DotRadius * 2 * c + " -" + DotRadius * 2 + " " + DotRadius * 2 + " -" + DotRadius * 2 * c + " " + DotRadius * 2 + " 0 c\n\
                //             f\n\
                //             Q\n\
                //             0 g\n\
                //             q\n\
                //             1 0 0 1 " + AcroForm.Appearance.internal.getWidth(formObject) / 2 + " " + AcroForm.Appearance.internal.getHeight(formObject) / 2 + " cm\n\
                // " + DotRadius + " 0 m\n\
                // " + DotRadius + " " + DotRadius * c + " " + DotRadius * c + " " + DotRadius + " 0 " + DotRadius + " c\n\
                // -" + DotRadius * c + " " + DotRadius + " -" + DotRadius + " " + DotRadius * c + " -" + DotRadius + " 0 c\n\
                // -" + DotRadius + " -" + DotRadius * c + " -" + DotRadius * c + " -" + DotRadius + " 0 -" + DotRadius + " c\n\
                // " + DotRadius * c + " -" + DotRadius + " " + DotRadius + " -" + DotRadius * c + " " + DotRadius + " 0 c\n\
                //             f\n\
                //             Q\n";

                //  FASTER VERSION with less processor ticks spent on math operations
                stream += "0.749023 g\n\
            q\n\
           1 0 0 1 " + AcroForm.Appearance.internal.getWidth(formObject) / 2 + " " + AcroForm.Appearance.internal.getHeight(formObject) / 2 + " cm\n\
" + k + " 0 m\n\
" + k + " " + kc + " " + kc + " " + k + " 0 " + k + " c\n\
-" + kc + " " + k + " -" + k + " " + kc + " -" + k + " 0 c\n\
-" + k + " -" + kc + " -" + kc + " -" + k + " 0 -" + k + " c\n\
" + kc + " -" + k + " " + k + " -" + kc + " " + k + " 0 c\n\
            f\n\
            Q\n\
            0 g\n\
            q\n\
            1 0 0 1 " + AcroForm.Appearance.internal.getWidth(formObject) / 2 + " " + AcroForm.Appearance.internal.getHeight(formObject) / 2 + " cm\n\
" + DotRadius + " 0 m\n\
" + DotRadius + " " + dc + " " + dc + " " + DotRadius + " 0 " + DotRadius + " c\n\
-" + dc + " " + DotRadius + " -" + DotRadius + " " + dc + " -" + DotRadius + " 0 c\n\
-" + DotRadius + " -" + dc + " -" + dc + " -" + DotRadius + " 0 -" + DotRadius + " c\n\
" + dc + " -" + DotRadius + " " + DotRadius + " -" + dc + " " + DotRadius + " 0 c\n\
            f\n\
            Q\n";
                xobj.stream = stream;
                return xobj;
            },
            OffPushDown: function OffPushDown(formObject) {
                var xobj = AcroForm.createFormXObject(formObject);
                var stream = "";
                var DotRadius = AcroForm.Appearance.internal.getWidth(formObject) <= AcroForm.Appearance.internal.getHeight(formObject) ? AcroForm.Appearance.internal.getWidth(formObject) / 4 : AcroForm.Appearance.internal.getHeight(formObject) / 4;
                // The Borderpadding...
                DotRadius *= 0.9;
                // Save results for later use; no need to waste processor ticks on doing math
                var k = DotRadius * 2;
                // var c = AcroForm.Appearance.internal.Bezier_C;
                var kc = k * AcroForm.Appearance.internal.Bezier_C;
                //                 stream += "0.749023 g\n\
                //             q\n\
                //  1 0 0 1 " + AcroForm.Appearance.internal.getWidth(formObject) / 2 + " " + AcroForm.Appearance.internal.getHeight(formObject) / 2 + " cm\n\
                // " + DotRadius * 2 + " 0 m\n\
                // " + DotRadius * 2 + " " + DotRadius * 2 * c + " " + DotRadius * 2 * c + " " + DotRadius * 2 + " 0 " + DotRadius * 2 + " c\n\
                // -" + DotRadius * 2 * c + " " + DotRadius * 2 + " -" + DotRadius * 2 + " " + DotRadius * 2 * c + " -" + DotRadius * 2 + " 0 c\n\
                // -" + DotRadius * 2 + " -" + DotRadius * 2 * c + " -" + DotRadius * 2 * c + " -" + DotRadius * 2 + " 0 -" + DotRadius * 2 + " c\n\
                // " + DotRadius * 2 * c + " -" + DotRadius * 2 + " " + DotRadius * 2 + " -" + DotRadius * 2 * c + " " + DotRadius * 2 + " 0 c\n\
                //             f\n\
                //             Q\n";

                //  FASTER VERSION with less processor ticks spent on math operations
                stream += "0.749023 g\n\
            q\n\
 1 0 0 1 " + AcroForm.Appearance.internal.getWidth(formObject) / 2 + " " + AcroForm.Appearance.internal.getHeight(formObject) / 2 + " cm\n\
" + k + " 0 m\n\
" + k + " " + kc + " " + kc + " " + k + " 0 " + k + " c\n\
-" + kc + " " + k + " -" + k + " " + kc + " -" + k + " 0 c\n\
-" + k + " -" + kc + " -" + kc + " -" + k + " 0 -" + k + " c\n\
" + kc + " -" + k + " " + k + " -" + kc + " " + k + " 0 c\n\
            f\n\
            Q\n";
                xobj.stream = stream;
                return xobj;
            }
        },

        Cross: {
            /**
             * Creates the Actual AppearanceDictionary-References
             * @param name
             * @returns
             */
            createAppearanceStream: function createAppearanceStream(name) {
                var appearanceStreamContent = {
                    D: {
                        'Off': AcroForm.Appearance.RadioButton.Cross.OffPushDown
                    },
                    N: {}
                };
                appearanceStreamContent.N[name] = AcroForm.Appearance.RadioButton.Cross.YesNormal;
                appearanceStreamContent.D[name] = AcroForm.Appearance.RadioButton.Cross.YesPushDown;
                return appearanceStreamContent;
            },
            createMK: function createMK() {
                return "<< /CA (8)>>";
            },

            YesNormal: function YesNormal(formObject) {
                var xobj = AcroForm.createFormXObject(formObject);
                var stream = "";
                var cross = AcroForm.Appearance.internal.calculateCross(formObject);
                stream += "q\n\
            1 1 " + (AcroForm.Appearance.internal.getWidth(formObject) - 2) + " " + (AcroForm.Appearance.internal.getHeight(formObject) - 2) + " re\n\
            W\n\
            n\n\
            " + cross.x1.x + " " + cross.x1.y + " m\n\
            " + cross.x2.x + " " + cross.x2.y + " l\n\
            " + cross.x4.x + " " + cross.x4.y + " m\n\
            " + cross.x3.x + " " + cross.x3.y + " l\n\
            s\n\
            Q\n";
                xobj.stream = stream;
                return xobj;
            },
            YesPushDown: function YesPushDown(formObject) {
                var xobj = AcroForm.createFormXObject(formObject);
                var cross = AcroForm.Appearance.internal.calculateCross(formObject);
                var stream = "";
                stream += "0.749023 g\n\
            0 0 " + AcroForm.Appearance.internal.getWidth(formObject) + " " + AcroForm.Appearance.internal.getHeight(formObject) + " re\n\
            f\n\
            q\n\
            1 1 " + (AcroForm.Appearance.internal.getWidth(formObject) - 2) + " " + (AcroForm.Appearance.internal.getHeight(formObject) - 2) + " re\n\
            W\n\
            n\n\
            " + cross.x1.x + " " + cross.x1.y + " m\n\
            " + cross.x2.x + " " + cross.x2.y + " l\n\
            " + cross.x4.x + " " + cross.x4.y + " m\n\
            " + cross.x3.x + " " + cross.x3.y + " l\n\
            s\n\
            Q\n";
                xobj.stream = stream;
                return xobj;
            },
            OffPushDown: function OffPushDown(formObject) {
                var xobj = AcroForm.createFormXObject(formObject);
                var stream = "";
                stream += "0.749023 g\n\
            0 0 " + AcroForm.Appearance.internal.getWidth(formObject) + " " + AcroForm.Appearance.internal.getHeight(formObject) + " re\n\
            f\n";
                xobj.stream = stream;
                return xobj;
            }
        }
    },

    /**
     * Returns the standard Appearance
     * @returns {AcroForm.FormXObject}
     */
    createDefaultAppearanceStream: function createDefaultAppearanceStream(formObject) {
        var stream = "";
        // Set Helvetica to Standard Font (size: auto)
        // Color: Black
        stream += "/Helv 0 Tf 0 g";
        return stream;
    }
};

AcroForm.Appearance.internal = {
    Bezier_C: 0.551915024494,

    calculateCross: function calculateCross(formObject) {
        var min = function min(x, y) {
            return x > y ? y : x;
        };

        var width = AcroForm.Appearance.internal.getWidth(formObject);
        var height = AcroForm.Appearance.internal.getHeight(formObject);
        var a = min(width, height);
        var cross = {
            x1: { // upperLeft
                x: (width - a) / 2,
                y: (height - a) / 2 + a //height - borderPadding
            },
            x2: { // lowerRight
                x: (width - a) / 2 + a,
                y: (height - a) / 2 //borderPadding
            },
            x3: { // lowerLeft
                x: (width - a) / 2,
                y: (height - a) / 2 //borderPadding
            },
            x4: { // upperRight
                x: (width - a) / 2 + a,
                y: (height - a) / 2 + a //height - borderPadding
            }
        };

        return cross;
    }
};
AcroForm.Appearance.internal.getWidth = function (formObject) {
    return formObject.Rect[2]; //(formObject.Rect[2] - formObject.Rect[0]) || 0;
};
AcroForm.Appearance.internal.getHeight = function (formObject) {
    return formObject.Rect[3]; //(formObject.Rect[1] - formObject.Rect[3]) || 0;
};

// ##########################

//### For inheritance:
AcroForm.internal.inherit = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
};

// ### Handy Functions:

AcroForm.internal.arrayToPdfArray = function (array) {
    if (Array.isArray(array)) {
        var content = ' [';
        for (var i in array) {
            var element = array[i].toString();
            content += element;
            content += i < array.length - 1 ? ' ' : '';
        }
        content += ']';

        return content;
    }
};

AcroForm.internal.toPdfString = function (string) {
    string = string || "";

    // put Bracket at the Beginning of the String
    if (string.indexOf('(') !== 0) {
        string = '(' + string;
    }

    if (string.substring(string.length - 1) != ')') {
        string += '(';
    }
    return string;
};

// ##########################
//          Classes
// ##########################


AcroForm.PDFObject = function () {
    // The Object ID in the PDF Object Model
    // todo
    var _objId;
    Object.defineProperty(this, 'objId', {
        get: function get() {
            if (!_objId) {
                if (this.internal) {
                    _objId = this.internal.newObjectDeferred();
                } else if (jsPDF.API.acroformPlugin.internal) {
                    // todo - find better option, that doesn't rely on a Global Static var
                    _objId = jsPDF.API.acroformPlugin.internal.newObjectDeferred();
                }
            }
            if (!_objId) {
                console.log("Couldn't create Object ID");
            }
            return _objId;
        },
        configurable: false
    });
};

AcroForm.PDFObject.prototype.toString = function () {
    return this.objId + " 0 R";
};

AcroForm.PDFObject.prototype.getString = function () {
    var res = this.objId + " 0 obj\n<<";
    var content = this.getContent();

    res += content + ">>\n";
    if (this.stream) {
        res += "stream\n";
        res += this.stream;
        res += "endstream\n";
    }
    res += "endobj\n";
    return res;
};

AcroForm.PDFObject.prototype.getContent = function () {
    /**
     * Prints out all enumerable Variables from the Object
     * @param fieldObject
     * @returns {string}
     */
    var createContentFromFieldObject = function createContentFromFieldObject(fieldObject) {
        var content = '';

        var keys = Object.keys(fieldObject).filter(function (key) {
            return key != 'content' && key != 'appearanceStreamContent' && key.substring(0, 1) != "_";
        });

        for (var i in keys) {
            var key = keys[i];
            var value = fieldObject[key];

            /*if (key == 'Rect' && value) {
             value = AcroForm.internal.calculateCoordinates.call(jsPDF.API.acroformPlugin.internal, value);
             }*/

            if (value) {
                if (Array.isArray(value)) {
                    content += '/' + key + ' ' + AcroForm.internal.arrayToPdfArray(value) + "\n";
                } else if (value instanceof AcroForm.PDFObject) {
                    // In case it is a reference to another PDFObject, take the referennce number
                    content += '/' + key + ' ' + value.objId + " 0 R" + "\n";
                } else {
                    content += '/' + key + ' ' + value + '\n';
                }
            }
        }
        return content;
    };

    var object = "";

    object += createContentFromFieldObject(this);
    return object;
};

AcroForm.FormXObject = function () {
    AcroForm.PDFObject.call(this);
    this.Type = "/XObject";
    this.Subtype = "/Form";
    this.FormType = 1;
    this.BBox;
    this.Matrix;
    this.Resources = "2 0 R";
    this.PieceInfo;
    var _stream;
    Object.defineProperty(this, 'Length', {
        enumerable: true,
        get: function get() {
            return _stream !== undefined ? _stream.length : 0;
        }
    });
    Object.defineProperty(this, 'stream', {
        enumerable: false,
        set: function set(val) {
            _stream = val;
        },
        get: function get() {
            if (_stream) {
                return _stream;
            } else {
                return null;
            }
        }
    });
};

AcroForm.internal.inherit(AcroForm.FormXObject, AcroForm.PDFObject);

AcroForm.AcroFormDictionary = function () {
    AcroForm.PDFObject.call(this);
    var _Kids = [];
    Object.defineProperty(this, 'Kids', {
        enumerable: false,
        configurable: true,
        get: function get() {
            if (_Kids.length > 0) {
                return _Kids;
            } else {
                return;
            }
        }
    });
    Object.defineProperty(this, 'Fields', {
        enumerable: true,
        configurable: true,
        get: function get() {
            return _Kids;
        }
    });
    // Default Appearance
    this.DA;
};

AcroForm.internal.inherit(AcroForm.AcroFormDictionary, AcroForm.PDFObject);

// ##### The Objects, the User can Create:


// The Field Object contains the Variables, that every Field needs
// Rectangle for Appearance: lower_left_X, lower_left_Y, width, height
AcroForm.Field = function () {
    'use strict';

    AcroForm.PDFObject.call(this);

    var _Rect;
    Object.defineProperty(this, 'Rect', {
        enumerable: true,
        configurable: false,
        get: function get() {
            if (!_Rect) {
                return;
            }
            var tmp = _Rect;
            //var calculatedRes = AcroForm.internal.calculateCoordinates(_Rect); // do later!
            return tmp;
        },
        set: function set(val) {
            _Rect = val;
        }
    });

    var _FT = "";
    Object.defineProperty(this, 'FT', {
        enumerable: true,
        set: function set(val) {
            _FT = val;
        },
        get: function get() {
            return _FT;
        }
    });
    /**
     * The Partial name of the Field Object.
     * It has to be unique.
     */
    var _T;

    Object.defineProperty(this, 'T', {
        enumerable: true,
        configurable: false,
        set: function set(val) {
            _T = val;
        },
        get: function get() {
            if (!_T || _T.length < 1) {
                if (this instanceof AcroForm.ChildClass) {
                    // In case of a Child from a Radio´Group, you don't need a FieldName!!!
                    return;
                }
                return "(FieldObject" + AcroForm.Field.FieldNum++ + ")";
            }
            if (_T.substring(0, 1) == "(" && _T.substring(_T.length - 1)) {
                return _T;
            }
            return "(" + _T + ")";
        }
    });

    var _DA;
    // Defines the default appearance (Needed for variable Text)
    Object.defineProperty(this, 'DA', {
        enumerable: true,
        get: function get() {
            if (!_DA) {
                return;
            }
            return '(' + _DA + ')';
        },
        set: function set(val) {
            _DA = val;
        }
    });

    var _DV;
    // Defines the default value
    Object.defineProperty(this, 'DV', {
        enumerable: true,
        configurable: true,
        get: function get() {
            if (!_DV) {
                return;
            }
            return _DV;
        },
        set: function set(val) {
            _DV = val;
        }
    });

    //this.Type = "/Annot";
    //this.Subtype = "/Widget";
    Object.defineProperty(this, 'Type', {
        enumerable: true,
        get: function get() {
            return this.hasAnnotation ? "/Annot" : null;
        }
    });

    Object.defineProperty(this, 'Subtype', {
        enumerable: true,
        get: function get() {
            return this.hasAnnotation ? "/Widget" : null;
        }
    });

    /**
     *
     * @type {Array}
     */
    this.BG;

    Object.defineProperty(this, 'hasAnnotation', {
        enumerable: false,
        get: function get() {
            if (this.Rect || this.BC || this.BG) {
                return true;
            }
            return false;
        }
    });

    Object.defineProperty(this, 'hasAppearanceStream', {
        enumerable: false,
        configurable: true,
        writable: true
    });

    Object.defineProperty(this, 'page', {
        enumerable: false,
        configurable: true,
        writable: true
    });
};
AcroForm.Field.FieldNum = 0;

AcroForm.internal.inherit(AcroForm.Field, AcroForm.PDFObject);

AcroForm.ChoiceField = function () {
    AcroForm.Field.call(this);
    // Field Type = Choice Field
    this.FT = "/Ch";
    // options
    this.Opt = [];
    this.V = '()';
    // Top Index
    this.TI = 0;
    /**
     * Defines, whether the
     * @type {boolean}
     */
    this.combo = false;
    /**
     * Defines, whether the Choice Field is an Edit Field.
     * An Edit Field is automatically an Combo Field.
     */
    Object.defineProperty(this, 'edit', {
        enumerable: true,
        set: function set(val) {
            if (val == true) {
                this._edit = true;
                // ComboBox has to be true
                this.combo = true;
            } else {
                this._edit = false;
            }
        },
        get: function get() {
            if (!this._edit) {
                return false;
            }
            return this._edit;
        },
        configurable: false
    });
    this.hasAppearanceStream = true;
    Object.defineProperty(this, 'V', {
        get: function get() {
            AcroForm.internal.toPdfString();
        }
    });
};
AcroForm.internal.inherit(AcroForm.ChoiceField, AcroForm.Field);
window["ChoiceField"] = AcroForm.ChoiceField;

AcroForm.ListBox = function () {
    AcroForm.ChoiceField.call(this);
    //var combo = true;
};
AcroForm.internal.inherit(AcroForm.ListBox, AcroForm.ChoiceField);
window["ListBox"] = AcroForm.ListBox;

AcroForm.ComboBox = function () {
    AcroForm.ListBox.call(this);
    this.combo = true;
};
AcroForm.internal.inherit(AcroForm.ComboBox, AcroForm.ListBox);
window["ComboBox"] = AcroForm.ComboBox;

AcroForm.EditBox = function () {
    AcroForm.ComboBox.call(this);
    this.edit = true;
};
AcroForm.internal.inherit(AcroForm.EditBox, AcroForm.ComboBox);
window["EditBox"] = AcroForm.EditBox;

AcroForm.Button = function () {
    AcroForm.Field.call(this);
    this.FT = "/Btn";
    //this.hasAnnotation = true;
};
AcroForm.internal.inherit(AcroForm.Button, AcroForm.Field);
window["Button"] = AcroForm.Button;

AcroForm.PushButton = function () {
    AcroForm.Button.call(this);
    this.pushbutton = true;
};
AcroForm.internal.inherit(AcroForm.PushButton, AcroForm.Button);
window["PushButton"] = AcroForm.PushButton;

AcroForm.RadioButton = function () {
    AcroForm.Button.call(this);
    this.radio = true;
    var _Kids = [];
    Object.defineProperty(this, 'Kids', {
        enumerable: true,
        get: function get() {
            if (_Kids.length > 0) {
                return _Kids;
            }
        }
    });

    Object.defineProperty(this, '__Kids', {
        get: function get() {
            return _Kids;
        }
    });

    var _noToggleToOff;

    Object.defineProperty(this, 'noToggleToOff', {
        enumerable: false,
        get: function get() {
            return _noToggleToOff;
        },
        set: function set(val) {
            _noToggleToOff = val;
        }
    });

    //this.hasAnnotation = false;
};
AcroForm.internal.inherit(AcroForm.RadioButton, AcroForm.Button);
window["RadioButton"] = AcroForm.RadioButton;

/*
 * The Child classs of a RadioButton (the radioGroup)
 * -> The single Buttons
 */
AcroForm.ChildClass = function (parent, name) {
    AcroForm.Field.call(this);
    this.Parent = parent;

    // todo: set AppearanceType as variable that can be set from the outside...
    this._AppearanceType = AcroForm.Appearance.RadioButton.Circle; // The Default appearanceType is the Circle
    this.appearanceStreamContent = this._AppearanceType.createAppearanceStream(name);

    // Set Print in the Annot Flag
    this.F = AcroForm.internal.setBitPosition(this.F, 3, 1);

    // Set AppearanceCharacteristicsDictionary with default appearance if field is not interacting with user
    this.MK = this._AppearanceType.createMK(); // (8) -> Cross, (1)-> Circle, ()-> nothing

    // Default Appearance is Off
    this.AS = "/Off"; // + name;

    this._Name = name;
};
AcroForm.internal.inherit(AcroForm.ChildClass, AcroForm.Field);

AcroForm.RadioButton.prototype.setAppearance = function (appearance) {
    if (!('createAppearanceStream' in appearance && 'createMK' in appearance)) {
        console.log("Couldn't assign Appearance to RadioButton. Appearance was Invalid!");
        return;
    }
    for (var i in this.__Kids) {
        var child = this.__Kids[i];

        child.appearanceStreamContent = appearance.createAppearanceStream(child._Name);
        child.MK = appearance.createMK();
    }
};

AcroForm.RadioButton.prototype.createOption = function (name) {
    var parent = this;
    var child = new AcroForm.ChildClass(parent, name);
    // Add to Parent
    this.__Kids.push(child);

    jsPDF.API.addField(child);

    return child;
};

AcroForm.CheckBox = function () {
    Button.call(this);
    this.appearanceStreamContent = AcroForm.Appearance.CheckBox.createAppearanceStream();
    this.MK = AcroForm.Appearance.CheckBox.createMK();
    this.AS = "/On";
    this.V = "/On";
};
AcroForm.internal.inherit(AcroForm.CheckBox, AcroForm.Button);
window["CheckBox"] = AcroForm.CheckBox;

AcroForm.TextField = function () {
    AcroForm.Field.call(this);
    this.DA = AcroForm.Appearance.createDefaultAppearanceStream();
    this.F = 4;
    var _V;
    Object.defineProperty(this, 'V', {
        get: function get() {
            if (_V) {
                return "(" + _V + ")";
            } else {
                return _V;
            }
        },
        enumerable: true,
        set: function set(val) {
            _V = val;
        }
    });

    var _DV;
    Object.defineProperty(this, 'DV', {
        get: function get() {
            if (_DV) {
                return "(" + _DV + ")";
            } else {
                return _DV;
            }
        },
        enumerable: true,
        set: function set(val) {
            _DV = val;
        }
    });

    var _multiline = false;
    Object.defineProperty(this, 'multiline', {
        enumerable: false,
        get: function get() {
            return _multiline;
        },
        set: function set(val) {
            _multiline = val;
        }
    });

    //this.multiline = false;
    //this.password = false;
    /**
     * For PDF 1.4
     * @type {boolean}
     */
    //this.fileSelect = false;
    /**
     * For PDF 1.4
     * @type {boolean}
     */
    //this.doNotSpellCheck = false;
    /**
     * For PDF 1.4
     * @type {boolean}
     */
    //this.doNotScroll = false;

    var _MaxLen = false;
    Object.defineProperty(this, 'MaxLen', {
        enumerable: true,
        get: function get() {
            return _MaxLen;
        },
        set: function set(val) {
            _MaxLen = val;
        }
    });

    Object.defineProperty(this, 'hasAppearanceStream', {
        enumerable: false,
        get: function get() {
            return this.V || this.DV;
        }
    });
};
AcroForm.internal.inherit(AcroForm.TextField, AcroForm.Field);
window["TextField"] = AcroForm.TextField;

AcroForm.PasswordField = function () {
    TextField.call(this);
    Object.defineProperty(this, 'password', {
        value: true,
        enumerable: false,
        configurable: false,
        writable: false
    });
};
AcroForm.internal.inherit(AcroForm.PasswordField, AcroForm.TextField);
window["PasswordField"] = AcroForm.PasswordField;

// ############ internal functions

/*
 * small workaround for calculating the TextMetric approximately
 * @param text
 * @param fontsize
 * @returns {TextMetrics} (Has Height and Width)
 */
AcroForm.internal.calculateFontSpace = function (text, fontsize, fonttype) {
    var fonttype = fonttype || "helvetica";
    //re-use canvas object for speed improvements
    var canvas = AcroForm.internal.calculateFontSpace.canvas || (AcroForm.internal.calculateFontSpace.canvas = document.createElement('canvas'));

    var context = canvas.getContext('2d');
    context.save();
    var newFont = fontsize + " " + fonttype;
    context.font = newFont;
    var res = context.measureText(text);
    context.fontcolor = 'black';
    // Calculate height:
    var context = canvas.getContext('2d');
    res.height = context.measureText("3").width * 1.5; // 3 because in ZapfDingbats its a Hook and a 3 in normal fonts
    context.restore();

    return res;
};

AcroForm.internal.calculateX = function (formObject, text, font, maxFontSize) {
    var maxFontSize = maxFontSize || 12;
    var font = font || "helvetica";
    var returnValue = {
        text: "",
        fontSize: ""
    };
    // Remove Brackets
    text = text.substr(0, 1) == '(' ? text.substr(1) : text;
    text = text.substr(text.length - 1) == ')' ? text.substr(0, text.length - 1) : text;
    // split into array of words
    var textSplit = text.split(' ');

    /**
     * the color could be ((alpha)||(r,g,b)||(c,m,y,k))
     * @type {string}
     */
    var fontSize = maxFontSize; // The Starting fontSize (The Maximum)
    var lineSpacing = 2;
    var borderPadding = 2;

    var height = AcroForm.Appearance.internal.getHeight(formObject) || 0;
    height = height < 0 ? -height : height;
    var width = AcroForm.Appearance.internal.getWidth(formObject) || 0;
    width = width < 0 ? -width : width;

    var isSmallerThanWidth = function isSmallerThanWidth(i, lastLine, fontSize) {
        if (i + 1 < textSplit.length) {
            var tmp = lastLine + " " + textSplit[i + 1];
            var TextWidth = AcroForm.internal.calculateFontSpace(tmp, fontSize + "px", font).width;
            var FieldWidth = width - 2 * borderPadding;
            return TextWidth <= FieldWidth;
        } else {
            return false;
        }
    };

    fontSize++;
    FontSize: while (true) {
        var text = "";
        fontSize--;
        var textHeight = AcroForm.internal.calculateFontSpace("3", fontSize + "px", font).height;
        var startY = formObject.multiline ? height - fontSize : (height - textHeight) / 2;
        startY += lineSpacing;
        var startX = -borderPadding;

        var lastX = startX,
            lastY = startY;
        var firstWordInLine = 0,
            lastWordInLine = 0;
        var lastLength = 0;

        if (fontSize == 0) {
            // In case, the Text doesn't fit at all
            fontSize = 12;
            text = "(...) Tj\n";
            text += "% Width of Text: " + AcroForm.internal.calculateFontSpace(text, "1px").width + ", FieldWidth:" + width + "\n";
            break;
        }

        lastLength = AcroForm.internal.calculateFontSpace(textSplit[0] + " ", fontSize + "px", font).width;

        var lastLine = "";
        var lineCount = 0;
        Line: for (var i in textSplit) {
            lastLine += textSplit[i] + " ";
            // Remove last blank
            lastLine = lastLine.substr(lastLine.length - 1) == " " ? lastLine.substr(0, lastLine.length - 1) : lastLine;
            var key = parseInt(i);
            lastLength = AcroForm.internal.calculateFontSpace(lastLine + " ", fontSize + "px", font).width;
            var nextLineIsSmaller = isSmallerThanWidth(key, lastLine, fontSize);
            var isLastWord = i >= textSplit.length - 1;
            if (nextLineIsSmaller && !isLastWord) {
                lastLine += " ";
                continue; // Line
            } else if (!nextLineIsSmaller && !isLastWord) {
                if (!formObject.multiline) {
                    continue FontSize;
                } else {
                    if ((textHeight + lineSpacing) * (lineCount + 2) + lineSpacing > height) {
                        // If the Text is higher than the FieldObject
                        continue FontSize;
                    }
                    lastWordInLine = key;
                    // go on
                }
            } else if (isLastWord) {
                lastWordInLine = key;
            } else {
                if (formObject.multiline && (textHeight + lineSpacing) * (lineCount + 2) + lineSpacing > height) {
                    // If the Text is higher than the FieldObject
                    continue FontSize;
                }
            }

            var line = '';

            for (var x = firstWordInLine; x <= lastWordInLine; x++) {
                line += textSplit[x] + ' ';
            }

            // Remove last blank
            line = line.substr(line.length - 1) == " " ? line.substr(0, line.length - 1) : line;
            //lastLength -= blankSpace.width;
            lastLength = AcroForm.internal.calculateFontSpace(line, fontSize + "px", font).width;

            // Calculate startX
            switch (formObject.Q) {
                case 2:
                    // Right justified
                    startX = width - lastLength - borderPadding;
                    break;
                case 1:
                    // Q = 1 := Text-Alignment: Center
                    startX = (width - lastLength) / 2;
                    break;
                case 0:
                default:
                    startX = borderPadding;
                    break;
            }
            text += startX + ' ' + lastY + ' Td\n';
            text += '(' + line + ') Tj\n';
            // reset X in PDF
            text += -startX + ' 0 Td\n';

            // After a Line, adjust y position
            lastY = -(fontSize + lineSpacing);
            lastLength = 0;
            firstWordInLine = lastWordInLine + 1;
            lineCount++;

            lastLine = "";
            continue Line;
        }
        break;
    }

    returnValue.text = text;
    returnValue.fontSize = fontSize;

    return returnValue;
};

AcroForm.internal.calculateAppearanceStream = function (formObject) {
    if (formObject.appearanceStreamContent) {
        // If appearanceStream is already set, use it
        return formObject.appearanceStreamContent;
    }

    if (!formObject.V && !formObject.DV) {
        return;
    }

    // else calculate it

    var stream = '';

    var text = formObject.V || formObject.DV;

    var calcRes = AcroForm.internal.calculateX(formObject, text);

    stream += '/Tx BMC\n' + 'q\n' +
    //color + '\n' +
    '/F1 ' + calcRes.fontSize + ' Tf\n' +
    // Text Matrix
    '1 0 0 1 0 0 Tm\n';
    // Begin Text
    stream += 'BT\n';
    stream += calcRes.text;
    // End Text
    stream += 'ET\n';
    stream += 'Q\n' + 'EMC\n';

    var appearanceStreamContent = new AcroForm.createFormXObject(formObject);

    appearanceStreamContent.stream = stream;

    return appearanceStreamContent;
};

/*
 * Converts the Parameters from x,y,w,h to lowerLeftX, lowerLeftY, upperRightX, upperRightY
 * @param x
 * @param y
 * @param w
 * @param h
 * @returns {*[]}
 */
AcroForm.internal.calculateCoordinates = function (x, y, w, h) {
    var coordinates = {};

    if (this.internal) {
        var mmtopx = function mmtopx(x) {
            return x * this.internal.scaleFactor;
        };

        if (Array.isArray(x)) {
            x[0] = AcroForm.scale(x[0]);
            x[1] = AcroForm.scale(x[1]);
            x[2] = AcroForm.scale(x[2]);
            x[3] = AcroForm.scale(x[3]);

            coordinates.lowerLeft_X = x[0] || 0;
            coordinates.lowerLeft_Y = mmtopx.call(this, this.internal.pageSize.height) - x[3] - x[1] || 0;
            coordinates.upperRight_X = x[0] + x[2] || 0;
            coordinates.upperRight_Y = mmtopx.call(this, this.internal.pageSize.height) - x[1] || 0;
        } else {
            x = AcroForm.scale(x);
            y = AcroForm.scale(y);
            w = AcroForm.scale(w);
            h = AcroForm.scale(h);
            coordinates.lowerLeft_X = x || 0;
            coordinates.lowerLeft_Y = this.internal.pageSize.height - y || 0;
            coordinates.upperRight_X = x + w || 0;
            coordinates.upperRight_Y = this.internal.pageSize.height - y + h || 0;
        }
    } else {
        // old method, that is fallback, if we can't get the pageheight, the coordinate-system starts from lower left
        if (Array.isArray(x)) {
            coordinates.lowerLeft_X = x[0] || 0;
            coordinates.lowerLeft_Y = x[1] || 0;
            coordinates.upperRight_X = x[0] + x[2] || 0;
            coordinates.upperRight_Y = x[1] + x[3] || 0;
        } else {
            coordinates.lowerLeft_X = x || 0;
            coordinates.lowerLeft_Y = y || 0;
            coordinates.upperRight_X = x + w || 0;
            coordinates.upperRight_Y = y + h || 0;
        }
    }

    return [coordinates.lowerLeft_X, coordinates.lowerLeft_Y, coordinates.upperRight_X, coordinates.upperRight_Y];
};

AcroForm.internal.calculateColor = function (r, g, b) {
    var color = new Array(3);
    color.r = r | 0;
    color.g = g | 0;
    color.b = b | 0;
    return color;
};

AcroForm.internal.getBitPosition = function (variable, position) {
    variable = variable || 0;
    var bitMask = 1;
    bitMask = bitMask << position - 1;
    return variable | bitMask;
};

AcroForm.internal.setBitPosition = function (variable, position, value) {
    variable = variable || 0;
    value = value || 1;

    var bitMask = 1;
    bitMask = bitMask << position - 1;

    if (value == 1) {
        // Set the Bit to 1
        var variable = variable | bitMask;
    } else {
        // Set the Bit to 0
        var variable = variable & ~bitMask;
    }

    return variable;
};

/**
 * jsPDF addHTML PlugIn
 * Copyright (c) 2014 Diego Casorran
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

(function (jsPDFAPI) {
	'use strict';

	/**
  * Renders an HTML element to canvas object which added to the PDF
  *
  * This feature requires [html2canvas](https://github.com/niklasvh/html2canvas)
  * or [rasterizeHTML](https://github.com/cburgmer/rasterizeHTML.js)
  *
  * @returns {jsPDF}
  * @name addHTML
  * @param element {Mixed} HTML Element, or anything supported by html2canvas.
  * @param x {Number} starting X coordinate in jsPDF instance's declared units.
  * @param y {Number} starting Y coordinate in jsPDF instance's declared units.
  * @param options {Object} Additional options, check the code below.
  * @param callback {Function} to call when the rendering has finished.
  * NOTE: Every parameter is optional except 'element' and 'callback', in such
  *       case the image is positioned at 0x0 covering the whole PDF document
  *       size. Ie, to easily take screenshots of webpages saving them to PDF.
  * @deprecated This is being replace with a vector-supporting API. See
  * [this link](https://cdn.rawgit.com/MrRio/jsPDF/master/examples/html2pdf/showcase_supported_html.html)
  */

	jsPDFAPI.addHTML = function (element, x, y, options, callback) {
		'use strict';

		if (typeof html2canvas === 'undefined' && typeof rasterizeHTML === 'undefined') throw new Error('You need either ' + 'https://github.com/niklasvh/html2canvas' + ' or https://github.com/cburgmer/rasterizeHTML.js');

		if (typeof x !== 'number') {
			options = x;
			callback = y;
		}

		if (typeof options === 'function') {
			callback = options;
			options = null;
		}

		var I = this.internal,
		    K = I.scaleFactor,
		    W = I.pageSize.width,
		    H = I.pageSize.height;

		options = options || {};
		options.onrendered = function (obj) {
			x = parseInt(x) || 0;
			y = parseInt(y) || 0;
			var dim = options.dim || {};
			var h = dim.h || 0;
			var w = dim.w || Math.min(W, obj.width / K) - x;

			var format = 'JPEG';
			if (options.format) format = options.format;

			if (obj.height > H && options.pagesplit) {
				var crop = function () {
					var cy = 0;
					while (1) {
						var canvas = document.createElement('canvas');
						canvas.width = Math.min(W * K, obj.width);
						canvas.height = Math.min(H * K, obj.height - cy);
						var ctx = canvas.getContext('2d');
						ctx.drawImage(obj, 0, cy, obj.width, canvas.height, 0, 0, canvas.width, canvas.height);
						var args = [canvas, x, cy ? 0 : y, canvas.width / K, canvas.height / K, format, null, 'SLOW'];
						this.addImage.apply(this, args);
						cy += canvas.height;
						if (cy >= obj.height) break;
						this.addPage();
					}
					callback(w, cy, null, args);
				}.bind(this);
				if (obj.nodeName === 'CANVAS') {
					var img = new Image();
					img.onload = crop;
					img.src = obj.toDataURL("image/png");
					obj = img;
				} else {
					crop();
				}
			} else {
				var alias = Math.random().toString(35);
				var args = [obj, x, y, w, h, format, alias, 'SLOW'];

				this.addImage.apply(this, args);

				callback(w, h, alias, args);
			}
		}.bind(this);

		if (typeof html2canvas !== 'undefined' && !options.rstz) {
			return html2canvas(element, options);
		}

		if (typeof rasterizeHTML !== 'undefined') {
			var meth = 'drawDocument';
			if (typeof element === 'string') {
				meth = /^http/.test(element) ? 'drawURL' : 'drawHTML';
			}
			options.width = options.width || W * K;
			return rasterizeHTML[meth](element, void 0, options).then(function (r) {
				options.onrendered(r.image);
			}, function (e) {
				callback(null, e);
			});
		}

		return null;
	};
})(jsPDF.API);

/** @preserve
 * jsPDF addImage plugin
 * Copyright (c) 2012 Jason Siefken, https://github.com/siefkenj/
 *               2013 Chris Dowling, https://github.com/gingerchris
 *               2013 Trinh Ho, https://github.com/ineedfat
 *               2013 Edwin Alejandro Perez, https://github.com/eaparango
 *               2013 Norah Smith, https://github.com/burnburnrocket
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 James Robb, https://github.com/jamesbrobb
 *
 * 
 */

(function (jsPDFAPI) {
	'use strict';

	var namespace = 'addImage_',
	    supported_image_types = ['jpeg', 'jpg', 'png'];

	// Image functionality ported from pdf.js
	var putImage = function putImage(img) {

		var objectNumber = this.internal.newObject(),
		    out = this.internal.write,
		    putStream = this.internal.putStream;

		img['n'] = objectNumber;

		out('<</Type /XObject');
		out('/Subtype /Image');
		out('/Width ' + img['w']);
		out('/Height ' + img['h']);
		if (img['cs'] === this.color_spaces.INDEXED) {
			out('/ColorSpace [/Indexed /DeviceRGB '
			// if an indexed png defines more than one colour with transparency, we've created a smask
			+ (img['pal'].length / 3 - 1) + ' ' + ('smask' in img ? objectNumber + 2 : objectNumber + 1) + ' 0 R]');
		} else {
			out('/ColorSpace /' + img['cs']);
			if (img['cs'] === this.color_spaces.DEVICE_CMYK) {
				out('/Decode [1 0 1 0 1 0 1 0]');
			}
		}
		out('/BitsPerComponent ' + img['bpc']);
		if ('f' in img) {
			out('/Filter /' + img['f']);
		}
		if ('dp' in img) {
			out('/DecodeParms <<' + img['dp'] + '>>');
		}
		if ('trns' in img && img['trns'].constructor == Array) {
			var trns = '',
			    i = 0,
			    len = img['trns'].length;
			for (; i < len; i++) {
				trns += img['trns'][i] + ' ' + img['trns'][i] + ' ';
			}out('/Mask [' + trns + ']');
		}
		if ('smask' in img) {
			out('/SMask ' + (objectNumber + 1) + ' 0 R');
		}
		out('/Length ' + img['data'].length + '>>');

		putStream(img['data']);

		out('endobj');

		// Soft mask
		if ('smask' in img) {
			var dp = '/Predictor ' + img['p'] + ' /Colors 1 /BitsPerComponent ' + img['bpc'] + ' /Columns ' + img['w'];
			var smask = { 'w': img['w'], 'h': img['h'], 'cs': 'DeviceGray', 'bpc': img['bpc'], 'dp': dp, 'data': img['smask'] };
			if ('f' in img) smask.f = img['f'];
			putImage.call(this, smask);
		}

		//Palette
		if (img['cs'] === this.color_spaces.INDEXED) {

			this.internal.newObject();
			//out('<< /Filter / ' + img['f'] +' /Length ' + img['pal'].length + '>>');
			//putStream(zlib.compress(img['pal']));
			out('<< /Length ' + img['pal'].length + '>>');
			putStream(this.arrayBufferToBinaryString(new Uint8Array(img['pal'])));
			out('endobj');
		}
	},
	    putResourcesCallback = function putResourcesCallback() {
		var images = this.internal.collections[namespace + 'images'];
		for (var i in images) {
			putImage.call(this, images[i]);
		}
	},
	    putXObjectsDictCallback = function putXObjectsDictCallback() {
		var images = this.internal.collections[namespace + 'images'],
		    out = this.internal.write,
		    image;
		for (var i in images) {
			image = images[i];
			out('/I' + image['i'], image['n'], '0', 'R');
		}
	},
	    checkCompressValue = function checkCompressValue(value) {
		if (value && typeof value === 'string') value = value.toUpperCase();
		return value in jsPDFAPI.image_compression ? value : jsPDFAPI.image_compression.NONE;
	},
	    getImages = function getImages() {
		var images = this.internal.collections[namespace + 'images'];
		//first run, so initialise stuff
		if (!images) {
			this.internal.collections[namespace + 'images'] = images = {};
			this.internal.events.subscribe('putResources', putResourcesCallback);
			this.internal.events.subscribe('putXobjectDict', putXObjectsDictCallback);
		}

		return images;
	},
	    getImageIndex = function getImageIndex(images) {
		var imageIndex = 0;

		if (images) {
			// this is NOT the first time this method is ran on this instance of jsPDF object.
			imageIndex = Object.keys ? Object.keys(images).length : function (o) {
				var i = 0;
				for (var e in o) {
					if (o.hasOwnProperty(e)) {
						i++;
					}
				}
				return i;
			}(images);
		}

		return imageIndex;
	},
	    notDefined = function notDefined(value) {
		return typeof value === 'undefined' || value === null;
	},
	    generateAliasFromData = function generateAliasFromData(data) {
		return typeof data === 'string' && jsPDFAPI.sHashCode(data);
	},
	    doesNotSupportImageType = function doesNotSupportImageType(type) {
		return supported_image_types.indexOf(type) === -1;
	},
	    processMethodNotEnabled = function processMethodNotEnabled(type) {
		return typeof jsPDFAPI['process' + type.toUpperCase()] !== 'function';
	},
	    isDOMElement = function isDOMElement(object) {
		return (typeof object === 'undefined' ? 'undefined' : _typeof(object)) === 'object' && object.nodeType === 1;
	},
	    createDataURIFromElement = function createDataURIFromElement(element, format, angle) {

		//if element is an image which uses data url definition, just return the dataurl
		if (element.nodeName === 'IMG' && element.hasAttribute('src')) {
			var src = '' + element.getAttribute('src');
			if (!angle && src.indexOf('data:image/') === 0) return src;

			// only if the user doesn't care about a format
			if (!format && /\.png(?:[?#].*)?$/i.test(src)) format = 'png';
		}

		if (element.nodeName === 'CANVAS') {
			var canvas = element;
		} else {
			var canvas = document.createElement('canvas');
			canvas.width = element.clientWidth || element.width;
			canvas.height = element.clientHeight || element.height;

			var ctx = canvas.getContext('2d');
			if (!ctx) {
				throw 'addImage requires canvas to be supported by browser.';
			}
			if (angle) {
				var x,
				    y,
				    b,
				    c,
				    s,
				    w,
				    h,
				    to_radians = Math.PI / 180,
				    angleInRadians;

				if ((typeof angle === 'undefined' ? 'undefined' : _typeof(angle)) === 'object') {
					x = angle.x;
					y = angle.y;
					b = angle.bg;
					angle = angle.angle;
				}
				angleInRadians = angle * to_radians;
				c = Math.abs(Math.cos(angleInRadians));
				s = Math.abs(Math.sin(angleInRadians));
				w = canvas.width;
				h = canvas.height;
				canvas.width = h * s + w * c;
				canvas.height = h * c + w * s;

				if (isNaN(x)) x = canvas.width / 2;
				if (isNaN(y)) y = canvas.height / 2;

				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.fillStyle = b || 'white';
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctx.save();
				ctx.translate(x, y);
				ctx.rotate(angleInRadians);
				ctx.drawImage(element, -(w / 2), -(h / 2));
				ctx.rotate(-angleInRadians);
				ctx.translate(-x, -y);
				ctx.restore();
			} else {
				ctx.drawImage(element, 0, 0, canvas.width, canvas.height);
			}
		}
		return canvas.toDataURL(('' + format).toLowerCase() == 'png' ? 'image/png' : 'image/jpeg');
	},
	    checkImagesForAlias = function checkImagesForAlias(alias, images) {
		var cached_info;
		if (images) {
			for (var e in images) {
				if (alias === images[e].alias) {
					cached_info = images[e];
					break;
				}
			}
		}
		return cached_info;
	},
	    determineWidthAndHeight = function determineWidthAndHeight(w, h, info) {
		if (!w && !h) {
			w = -96;
			h = -96;
		}
		if (w < 0) {
			w = -1 * info['w'] * 72 / w / this.internal.scaleFactor;
		}
		if (h < 0) {
			h = -1 * info['h'] * 72 / h / this.internal.scaleFactor;
		}
		if (w === 0) {
			w = h * info['w'] / info['h'];
		}
		if (h === 0) {
			h = w * info['h'] / info['w'];
		}

		return [w, h];
	},
	    writeImageToPDF = function writeImageToPDF(x, y, w, h, info, index, images) {
		var dims = determineWidthAndHeight.call(this, w, h, info),
		    coord = this.internal.getCoordinateString,
		    vcoord = this.internal.getVerticalCoordinateString;

		w = dims[0];
		h = dims[1];

		images[index] = info;

		this.internal.write('q', coord(w), '0 0', coord(h) // TODO: check if this should be shifted by vcoord
		, coord(x), vcoord(y + h), 'cm /I' + info['i'], 'Do Q');
	};

	/**
  * COLOR SPACES
  */
	jsPDFAPI.color_spaces = {
		DEVICE_RGB: 'DeviceRGB',
		DEVICE_GRAY: 'DeviceGray',
		DEVICE_CMYK: 'DeviceCMYK',
		CAL_GREY: 'CalGray',
		CAL_RGB: 'CalRGB',
		LAB: 'Lab',
		ICC_BASED: 'ICCBased',
		INDEXED: 'Indexed',
		PATTERN: 'Pattern',
		SEPARATION: 'Separation',
		DEVICE_N: 'DeviceN'
	};

	/**
  * DECODE METHODS
  */
	jsPDFAPI.decode = {
		DCT_DECODE: 'DCTDecode',
		FLATE_DECODE: 'FlateDecode',
		LZW_DECODE: 'LZWDecode',
		JPX_DECODE: 'JPXDecode',
		JBIG2_DECODE: 'JBIG2Decode',
		ASCII85_DECODE: 'ASCII85Decode',
		ASCII_HEX_DECODE: 'ASCIIHexDecode',
		RUN_LENGTH_DECODE: 'RunLengthDecode',
		CCITT_FAX_DECODE: 'CCITTFaxDecode'
	};

	/**
  * IMAGE COMPRESSION TYPES
  */
	jsPDFAPI.image_compression = {
		NONE: 'NONE',
		FAST: 'FAST',
		MEDIUM: 'MEDIUM',
		SLOW: 'SLOW'
	};

	jsPDFAPI.sHashCode = function (str) {
		return Array.prototype.reduce && str.split("").reduce(function (a, b) {
			a = (a << 5) - a + b.charCodeAt(0);return a & a;
		}, 0);
	};

	jsPDFAPI.isString = function (object) {
		return typeof object === 'string';
	};

	/**
  * Strips out and returns info from a valid base64 data URI
  * @param {String[dataURI]} a valid data URI of format 'data:[<MIME-type>][;base64],<data>'
  * @returns an Array containing the following
  * [0] the complete data URI
  * [1] <MIME-type>
  * [2] format - the second part of the mime-type i.e 'png' in 'image/png'
  * [4] <data>
  */
	jsPDFAPI.extractInfoFromBase64DataURI = function (dataURI) {
		return (/^data:([\w]+?\/([\w]+?));base64,(.+?)$/g.exec(dataURI)
		);
	};

	/**
  * Check to see if ArrayBuffer is supported
  */
	jsPDFAPI.supportsArrayBuffer = function () {
		return typeof ArrayBuffer !== 'undefined' && typeof Uint8Array !== 'undefined';
	};

	/**
  * Tests supplied object to determine if ArrayBuffer
  * @param {Object[object]}
  */
	jsPDFAPI.isArrayBuffer = function (object) {
		if (!this.supportsArrayBuffer()) return false;
		return object instanceof ArrayBuffer;
	};

	/**
  * Tests supplied object to determine if it implements the ArrayBufferView (TypedArray) interface
  * @param {Object[object]}
  */
	jsPDFAPI.isArrayBufferView = function (object) {
		if (!this.supportsArrayBuffer()) return false;
		if (typeof Uint32Array === 'undefined') return false;
		return object instanceof Int8Array || object instanceof Uint8Array || typeof Uint8ClampedArray !== 'undefined' && object instanceof Uint8ClampedArray || object instanceof Int16Array || object instanceof Uint16Array || object instanceof Int32Array || object instanceof Uint32Array || object instanceof Float32Array || object instanceof Float64Array;
	};

	/**
  * Exactly what it says on the tin
  */
	jsPDFAPI.binaryStringToUint8Array = function (binary_string) {
		/*
   * not sure how efficient this will be will bigger files. Is there a native method?
   */
		var len = binary_string.length;
		var bytes = new Uint8Array(len);
		for (var i = 0; i < len; i++) {
			bytes[i] = binary_string.charCodeAt(i);
		}
		return bytes;
	};

	/**
  * Convert the Buffer to a Binary String
  */
	jsPDFAPI.arrayBufferToBinaryString = function (buffer) {
		if (typeof window.atob === "function") {
			return atob(this.arrayBufferToBase64(buffer));
		} else {
			var data = this.isArrayBuffer(buffer) ? buffer : new Uint8Array(buffer);
			var chunkSizeForSlice = 0x5000;
			var binary_string = '';
			var slicesCount = Math.round(data.byteLength / chunkSizeForSlice);
			for (var i = 0; i < slicesCount; i++) {
				binary_string += String.fromCharCode.apply(null, data.slice(i * chunkSizeForSlice, i * chunkSizeForSlice + chunkSizeForSlice));
			}
			return binary_string;
		}
	};

	/**
  * Converts an ArrayBuffer directly to base64
  *
  * Taken from here
  *
  * http://jsperf.com/encoding-xhr-image-data/31
  *
  * Need to test if this is a better solution for larger files
  *
  */
	jsPDFAPI.arrayBufferToBase64 = function (arrayBuffer) {
		var base64 = '';
		var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

		var bytes = new Uint8Array(arrayBuffer);
		var byteLength = bytes.byteLength;
		var byteRemainder = byteLength % 3;
		var mainLength = byteLength - byteRemainder;

		var a, b, c, d;
		var chunk;

		// Main loop deals with bytes in chunks of 3
		for (var i = 0; i < mainLength; i = i + 3) {
			// Combine the three bytes into a single integer
			chunk = bytes[i] << 16 | bytes[i + 1] << 8 | bytes[i + 2];

			// Use bitmasks to extract 6-bit segments from the triplet
			a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
			b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
			c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
			d = chunk & 63; // 63       = 2^6 - 1

			// Convert the raw binary segments to the appropriate ASCII encoding
			base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
		}

		// Deal with the remaining bytes and padding
		if (byteRemainder == 1) {
			chunk = bytes[mainLength];

			a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2

			// Set the 4 least significant bits to zero
			b = (chunk & 3) << 4; // 3   = 2^2 - 1

			base64 += encodings[a] + encodings[b] + '==';
		} else if (byteRemainder == 2) {
			chunk = bytes[mainLength] << 8 | bytes[mainLength + 1];

			a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
			b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4

			// Set the 2 least significant bits to zero
			c = (chunk & 15) << 2; // 15    = 2^4 - 1

			base64 += encodings[a] + encodings[b] + encodings[c] + '=';
		}

		return base64;
	};

	jsPDFAPI.createImageInfo = function (data, wd, ht, cs, bpc, f, imageIndex, alias, dp, trns, pal, smask, p) {
		var info = {
			alias: alias,
			w: wd,
			h: ht,
			cs: cs,
			bpc: bpc,
			i: imageIndex,
			data: data
			// n: objectNumber will be added by putImage code
		};

		if (f) info.f = f;
		if (dp) info.dp = dp;
		if (trns) info.trns = trns;
		if (pal) info.pal = pal;
		if (smask) info.smask = smask;
		if (p) info.p = p; // predictor parameter for PNG compression

		return info;
	};

	jsPDFAPI.addImage = function (imageData, format, x, y, w, h, alias, compression, rotation) {
		'use strict';

		if (typeof format !== 'string') {
			var tmp = h;
			h = w;
			w = y;
			y = x;
			x = format;
			format = tmp;
		}

		if ((typeof imageData === 'undefined' ? 'undefined' : _typeof(imageData)) === 'object' && !isDOMElement(imageData) && "imageData" in imageData) {
			var options = imageData;

			imageData = options.imageData;
			format = options.format || format;
			x = options.x || x || 0;
			y = options.y || y || 0;
			w = options.w || w;
			h = options.h || h;
			alias = options.alias || alias;
			compression = options.compression || compression;
			rotation = options.rotation || options.angle || rotation;
		}

		if (isNaN(x) || isNaN(y)) {
			console.error('jsPDF.addImage: Invalid coordinates', arguments);
			throw new Error('Invalid coordinates passed to jsPDF.addImage');
		}

		var images = getImages.call(this),
		    info;

		if (!(info = checkImagesForAlias(imageData, images))) {
			var dataAsBinaryString;

			if (isDOMElement(imageData)) imageData = createDataURIFromElement(imageData, format, rotation);

			if (notDefined(alias)) alias = generateAliasFromData(imageData);

			if (!(info = checkImagesForAlias(alias, images))) {

				if (this.isString(imageData)) {

					var base64Info = this.extractInfoFromBase64DataURI(imageData);

					if (base64Info) {

						format = base64Info[2];
						imageData = atob(base64Info[3]); //convert to binary string
					} else {

						if (imageData.charCodeAt(0) === 0x89 && imageData.charCodeAt(1) === 0x50 && imageData.charCodeAt(2) === 0x4e && imageData.charCodeAt(3) === 0x47) format = 'png';
					}
				}
				format = (format || 'JPEG').toLowerCase();

				if (doesNotSupportImageType(format)) throw new Error('addImage currently only supports formats ' + supported_image_types + ', not \'' + format + '\'');

				if (processMethodNotEnabled(format)) throw new Error('please ensure that the plugin for \'' + format + '\' support is added');

				/**
     * need to test if it's more efficient to convert all binary strings
     * to TypedArray - or should we just leave and process as string?
     */
				if (this.supportsArrayBuffer()) {
					// no need to convert if imageData is already uint8array
					if (!(imageData instanceof Uint8Array)) {
						dataAsBinaryString = imageData;
						imageData = this.binaryStringToUint8Array(imageData);
					}
				}

				info = this['process' + format.toUpperCase()](imageData, getImageIndex(images), alias, checkCompressValue(compression), dataAsBinaryString);

				if (!info) throw new Error('An unkwown error occurred whilst processing the image');
			}
		}

		writeImageToPDF.call(this, x, y, w, h, info, info.i, images);

		return this;
	};

	/**
  * JPEG SUPPORT
  **/

	//takes a string imgData containing the raw bytes of
	//a jpeg image and returns [width, height]
	//Algorithm from: http://www.64lines.com/jpeg-width-height
	var getJpegSize = function getJpegSize(imgData) {
		'use strict';

		var width, height, numcomponents;
		// Verify we have a valid jpeg header 0xff,0xd8,0xff,0xe0,?,?,'J','F','I','F',0x00
		if (!imgData.charCodeAt(0) === 0xff || !imgData.charCodeAt(1) === 0xd8 || !imgData.charCodeAt(2) === 0xff || !imgData.charCodeAt(3) === 0xe0 || !imgData.charCodeAt(6) === 'J'.charCodeAt(0) || !imgData.charCodeAt(7) === 'F'.charCodeAt(0) || !imgData.charCodeAt(8) === 'I'.charCodeAt(0) || !imgData.charCodeAt(9) === 'F'.charCodeAt(0) || !imgData.charCodeAt(10) === 0x00) {
			throw new Error('getJpegSize requires a binary string jpeg file');
		}
		var blockLength = imgData.charCodeAt(4) * 256 + imgData.charCodeAt(5);
		var i = 4,
		    len = imgData.length;
		while (i < len) {
			i += blockLength;
			if (imgData.charCodeAt(i) !== 0xff) {
				throw new Error('getJpegSize could not find the size of the image');
			}
			if (imgData.charCodeAt(i + 1) === 0xc0 || //(SOF) Huffman  - Baseline DCT
			imgData.charCodeAt(i + 1) === 0xc1 || //(SOF) Huffman  - Extended sequential DCT
			imgData.charCodeAt(i + 1) === 0xc2 || // Progressive DCT (SOF2)
			imgData.charCodeAt(i + 1) === 0xc3 || // Spatial (sequential) lossless (SOF3)
			imgData.charCodeAt(i + 1) === 0xc4 || // Differential sequential DCT (SOF5)
			imgData.charCodeAt(i + 1) === 0xc5 || // Differential progressive DCT (SOF6)
			imgData.charCodeAt(i + 1) === 0xc6 || // Differential spatial (SOF7)
			imgData.charCodeAt(i + 1) === 0xc7) {
				height = imgData.charCodeAt(i + 5) * 256 + imgData.charCodeAt(i + 6);
				width = imgData.charCodeAt(i + 7) * 256 + imgData.charCodeAt(i + 8);
				numcomponents = imgData.charCodeAt(i + 9);
				return [width, height, numcomponents];
			} else {
				i += 2;
				blockLength = imgData.charCodeAt(i) * 256 + imgData.charCodeAt(i + 1);
			}
		}
	},
	    getJpegSizeFromBytes = function getJpegSizeFromBytes(data) {

		var hdr = data[0] << 8 | data[1];

		if (hdr !== 0xFFD8) throw new Error('Supplied data is not a JPEG');

		var len = data.length,
		    block = (data[4] << 8) + data[5],
		    pos = 4,
		    bytes,
		    width,
		    height,
		    numcomponents;

		while (pos < len) {
			pos += block;
			bytes = readBytes(data, pos);
			block = (bytes[2] << 8) + bytes[3];
			if ((bytes[1] === 0xC0 || bytes[1] === 0xC2) && bytes[0] === 0xFF && block > 7) {
				bytes = readBytes(data, pos + 5);
				width = (bytes[2] << 8) + bytes[3];
				height = (bytes[0] << 8) + bytes[1];
				numcomponents = bytes[4];
				return { width: width, height: height, numcomponents: numcomponents };
			}

			pos += 2;
		}

		throw new Error('getJpegSizeFromBytes could not find the size of the image');
	},
	    readBytes = function readBytes(data, offset) {
		return data.subarray(offset, offset + 5);
	};

	jsPDFAPI.processJPEG = function (data, index, alias, compression, dataAsBinaryString) {
		'use strict';

		var colorSpace = this.color_spaces.DEVICE_RGB,
		    filter = this.decode.DCT_DECODE,
		    bpc = 8,
		    dims;

		if (this.isString(data)) {
			dims = getJpegSize(data);
			return this.createImageInfo(data, dims[0], dims[1], dims[3] == 1 ? this.color_spaces.DEVICE_GRAY : colorSpace, bpc, filter, index, alias);
		}

		if (this.isArrayBuffer(data)) data = new Uint8Array(data);

		if (this.isArrayBufferView(data)) {

			dims = getJpegSizeFromBytes(data);

			// if we already have a stored binary string rep use that
			data = dataAsBinaryString || this.arrayBufferToBinaryString(data);

			return this.createImageInfo(data, dims.width, dims.height, dims.numcomponents == 1 ? this.color_spaces.DEVICE_GRAY : colorSpace, bpc, filter, index, alias);
		}

		return null;
	};

	jsPDFAPI.processJPG = function () /*data, index, alias, compression, dataAsBinaryString*/{
		return this.processJPEG.apply(this, arguments);
	};
})(jsPDF.API);

/**
 * jsPDF Annotations PlugIn
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * There are many types of annotations in a PDF document. Annotations are placed
 * on a page at a particular location. They are not 'attached' to an object.
 * <br />
 * This plugin current supports <br />
 * <li> Goto Page (set pageNumber and top in options)
 * <li> Goto Name (set name and top in options)
 * <li> Goto URL (set url in options)
 * <p>
 * 	The destination magnification factor can also be specified when goto is a page number or a named destination. (see documentation below)
 *  (set magFactor in options).  XYZ is the default.
 * </p>
 * <p>
 *  Links, Text, Popup, and FreeText are supported.
 * </p>
 * <p>
 * Options In PDF spec Not Implemented Yet
 * <li> link border
 * <li> named target
 * <li> page coordinates
 * <li> destination page scaling and layout
 * <li> actions other than URL and GotoPage
 * <li> background / hover actions
 * </p>
 */

/*
    Destination Magnification Factors
    See PDF 1.3 Page 386 for meanings and options

    [supported]
	XYZ (options; left top zoom)
	Fit (no options)
	FitH (options: top)
	FitV (options: left)

	[not supported]
	FitR
	FitB
	FitBH
	FitBV
 */

(function (jsPDFAPI) {
	'use strict';

	var annotationPlugin = {

		/**
   * An array of arrays, indexed by <em>pageNumber</em>.
   */
		annotations: [],

		f2: function f2(number) {
			return number.toFixed(2);
		},

		notEmpty: function notEmpty(obj) {
			if (typeof obj != 'undefined') {
				if (obj != '') {
					return true;
				}
			}
		}
	};

	jsPDF.API.annotationPlugin = annotationPlugin;

	jsPDF.API.events.push(['addPage', function (info) {
		this.annotationPlugin.annotations[info.pageNumber] = [];
	}]);

	jsPDFAPI.events.push(['putPage', function (info) {
		//TODO store annotations in pageContext so reorder/remove will not affect them.
		var pageAnnos = this.annotationPlugin.annotations[info.pageNumber];

		var found = false;
		for (var a = 0; a < pageAnnos.length && !found; a++) {
			var anno = pageAnnos[a];
			switch (anno.type) {
				case 'link':
					if (annotationPlugin.notEmpty(anno.options.url) || annotationPlugin.notEmpty(anno.options.pageNumber)) {
						found = true;
						break;
					}
				case 'reference':
				case 'text':
				case 'freetext':
					found = true;
					break;
			}
		}
		if (found == false) {
			return;
		}

		this.internal.write("/Annots [");
		var f2 = this.annotationPlugin.f2;
		var k = this.internal.scaleFactor;
		var pageHeight = this.internal.pageSize.height;
		var pageInfo = this.internal.getPageInfo(info.pageNumber);
		for (var a = 0; a < pageAnnos.length; a++) {
			var anno = pageAnnos[a];

			switch (anno.type) {
				case 'reference':
					// References to Widget Anotations (for AcroForm Fields)
					this.internal.write(' ' + anno.object.objId + ' 0 R ');
					break;
				case 'text':
					// Create a an object for both the text and the popup
					var objText = this.internal.newAdditionalObject();
					var objPopup = this.internal.newAdditionalObject();

					var title = anno.title || 'Note';
					var rect = "/Rect [" + f2(anno.bounds.x * k) + " " + f2(pageHeight - (anno.bounds.y + anno.bounds.h) * k) + " " + f2((anno.bounds.x + anno.bounds.w) * k) + " " + f2((pageHeight - anno.bounds.y) * k) + "] ";
					line = '<</Type /Annot /Subtype /' + 'Text' + ' ' + rect + '/Contents (' + anno.contents + ')';
					line += ' /Popup ' + objPopup.objId + " 0 R";
					line += ' /P ' + pageInfo.objId + " 0 R";
					line += ' /T (' + title + ') >>';
					objText.content = line;

					var parent = objText.objId + ' 0 R';
					var popoff = 30;
					var rect = "/Rect [" + f2((anno.bounds.x + popoff) * k) + " " + f2(pageHeight - (anno.bounds.y + anno.bounds.h) * k) + " " + f2((anno.bounds.x + anno.bounds.w + popoff) * k) + " " + f2((pageHeight - anno.bounds.y) * k) + "] ";
					//var rect2 = "/Rect [" + f2(anno.bounds.x * k) + " " + f2((pageHeight - anno.bounds.y) * k) + " " + f2(anno.bounds.x + anno.bounds.w * k) + " " + f2(pageHeight - (anno.bounds.y + anno.bounds.h) * k) + "] ";
					line = '<</Type /Annot /Subtype /' + 'Popup' + ' ' + rect + ' /Parent ' + parent;
					if (anno.open) {
						line += ' /Open true';
					}
					line += ' >>';
					objPopup.content = line;

					this.internal.write(objText.objId, '0 R', objPopup.objId, '0 R');

					break;
				case 'freetext':
					var rect = "/Rect [" + f2(anno.bounds.x * k) + " " + f2((pageHeight - anno.bounds.y) * k) + " " + f2(anno.bounds.x + anno.bounds.w * k) + " " + f2(pageHeight - (anno.bounds.y + anno.bounds.h) * k) + "] ";
					var color = anno.color || '#000000';
					line = '<</Type /Annot /Subtype /' + 'FreeText' + ' ' + rect + '/Contents (' + anno.contents + ')';
					line += ' /DS(font: Helvetica,sans-serif 12.0pt; text-align:left; color:#' + color + ')';
					line += ' /Border [0 0 0]';
					line += ' >>';
					this.internal.write(line);
					break;
				case 'link':
					if (anno.options.name) {
						var loc = this.annotations._nameMap[anno.options.name];
						anno.options.pageNumber = loc.page;
						anno.options.top = loc.y;
					} else {
						if (!anno.options.top) {
							anno.options.top = 0;
						}
					}

					var rect = "/Rect [" + f2(anno.x * k) + " " + f2((pageHeight - anno.y) * k) + " " + f2((anno.x + anno.w) * k) + " " + f2((pageHeight - (anno.y + anno.h)) * k) + "] ";

					var line = '';
					if (anno.options.url) {
						line = '<</Type /Annot /Subtype /Link ' + rect + '/Border [0 0 0] /A <</S /URI /URI (' + anno.options.url + ') >>';
					} else if (anno.options.pageNumber) {
						// first page is 0
						var info = this.internal.getPageInfo(anno.options.pageNumber);
						line = '<</Type /Annot /Subtype /Link ' + rect + '/Border [0 0 0] /Dest [' + info.objId + " 0 R";
						anno.options.magFactor = anno.options.magFactor || "XYZ";
						switch (anno.options.magFactor) {
							case 'Fit':
								line += ' /Fit]';
								break;
							case 'FitH':
								//anno.options.top = anno.options.top || f2(pageHeight * k);
								line += ' /FitH ' + anno.options.top + ']';
								break;
							case 'FitV':
								anno.options.left = anno.options.left || 0;
								line += ' /FitV ' + anno.options.left + ']';
								break;
							case 'XYZ':
							default:
								var top = f2((pageHeight - anno.options.top) * k); // || f2(pageHeight * k);
								anno.options.left = anno.options.left || 0;
								// 0 or null zoom will not change zoom factor
								if (typeof anno.options.zoom === 'undefined') {
									anno.options.zoom = 0;
								}
								line += ' /XYZ ' + anno.options.left + ' ' + top + ' ' + anno.options.zoom + ']';
								break;
						}
					} else {
						// TODO error - should not be here
					}
					if (line != '') {
						line += " >>";
						this.internal.write(line);
					}
					break;
			}
		}
		this.internal.write("]");
	}]);

	jsPDFAPI.createAnnotation = function (options) {
		switch (options.type) {
			case 'link':
				this.link(options.bounds.x, options.bounds.y, options.bounds.w, options.bounds.h, options);
				break;
			case 'text':
			case 'freetext':
				this.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push(options);
				break;
		}
	};

	/**
  * valid options
  * <li> pageNumber or url [required]
  * <p>If pageNumber is specified, top and zoom may also be specified</p>
  */
	jsPDFAPI.link = function (x, y, w, h, options) {
		'use strict';

		this.annotationPlugin.annotations[this.internal.getCurrentPageInfo().pageNumber].push({
			x: x,
			y: y,
			w: w,
			h: h,
			options: options,
			type: 'link'
		});
	};

	/**
  * Currently only supports single line text.
  * Returns the width of the text/link
  */
	jsPDFAPI.textWithLink = function (text, x, y, options) {
		'use strict';

		var width = this.getTextWidth(text);
		var height = this.internal.getLineHeight() / this.internal.scaleFactor;
		this.text(text, x, y);
		//TODO We really need the text baseline height to do this correctly.
		// Or ability to draw text on top, bottom, center, or baseline.
		y += height * .2;
		this.link(x, y - height, width, height, options);
		return width;
	};

	//TODO move into external library
	jsPDFAPI.getTextWidth = function (text) {
		'use strict';

		var fontSize = this.internal.getFontSize();
		var txtWidth = this.getStringUnitWidth(text) * fontSize / this.internal.scaleFactor;
		return txtWidth;
	};

	//TODO move into external library
	jsPDFAPI.getLineHeight = function () {
		return this.internal.getLineHeight();
	};

	return this;
})(jsPDF.API);

/**
 * jsPDF Autoprint Plugin
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
* Makes the PDF automatically print. This works in Chrome, Firefox, Acrobat
* Reader.
*
* @returns {jsPDF}
* @name autoPrint
* @example
* var doc = new jsPDF()
* doc.text(10, 10, 'This is a test')
* doc.autoPrint()
* doc.save('autoprint.pdf')
*/

(function (jsPDFAPI) {
  'use strict';

  jsPDFAPI.autoPrint = function () {
    'use strict';

    var refAutoPrintTag;

    this.internal.events.subscribe('postPutResources', function () {
      refAutoPrintTag = this.internal.newObject();
      this.internal.write("<< /S/Named /Type/Action /N/Print >>", "endobj");
    });

    this.internal.events.subscribe("putCatalog", function () {
      this.internal.write("/OpenAction " + refAutoPrintTag + " 0" + " R");
    });
    return this;
  };
})(jsPDF.API);

/**
 * jsPDF Canvas PlugIn
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * This plugin mimics the HTML5 Canvas
 * 
 * The goal is to provide a way for current canvas users to print directly to a PDF.
 */

(function (jsPDFAPI) {
	'use strict';

	jsPDFAPI.events.push(['initialized', function () {
		this.canvas.pdf = this;
	}]);

	jsPDFAPI.canvas = {
		getContext: function getContext(name) {
			this.pdf.context2d._canvas = this;
			return this.pdf.context2d;
		},
		style: {}
	};

	Object.defineProperty(jsPDFAPI.canvas, 'width', {
		get: function get() {
			return this._width;
		},
		set: function set(value) {
			this._width = value;
			this.getContext('2d').pageWrapX = value + 1;
		}
	});

	Object.defineProperty(jsPDFAPI.canvas, 'height', {
		get: function get() {
			return this._height;
		},
		set: function set(value) {
			this._height = value;
			this.getContext('2d').pageWrapY = value + 1;
		}
	});

	return this;
})(jsPDF.API);

/** ====================================================================
 * jsPDF Cell plugin
 * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
 *               2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
 *               2013 Lee Driscoll, https://github.com/lsdriscoll
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 James Hall, james@parall.ax
 *               2014 Diego Casorran, https://github.com/diegocr
 *
 * 
 * ====================================================================
 */

(function (jsPDFAPI) {
    'use strict';
    /*jslint browser:true */
    /*global document: false, jsPDF */

    var fontName,
        fontSize,
        fontStyle,
        padding = 3,
        margin = 13,
        headerFunction,
        lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined },
        pages = 1,
        setLastCellPosition = function setLastCellPosition(x, y, w, h, ln) {
        lastCellPos = { 'x': x, 'y': y, 'w': w, 'h': h, 'ln': ln };
    },
        getLastCellPosition = function getLastCellPosition() {
        return lastCellPos;
    },
        NO_MARGINS = { left: 0, top: 0, bottom: 0 };

    jsPDFAPI.setHeaderFunction = function (func) {
        headerFunction = func;
    };

    jsPDFAPI.getTextDimensions = function (txt) {
        fontName = this.internal.getFont().fontName;
        fontSize = this.table_font_size || this.internal.getFontSize();
        fontStyle = this.internal.getFont().fontStyle;
        // 1 pixel = 0.264583 mm and 1 mm = 72/25.4 point
        var px2pt = 0.264583 * 72 / 25.4,
            dimensions,
            text;

        text = document.createElement('font');
        text.id = "jsPDFCell";

        try {
            text.style.fontStyle = fontStyle;
        } catch (e) {
            text.style.fontWeight = fontStyle;
        }

        text.style.fontName = fontName;
        text.style.fontSize = fontSize + 'pt';
        try {
            text.textContent = txt;
        } catch (e) {
            text.innerText = txt;
        }

        document.body.appendChild(text);

        dimensions = { w: (text.offsetWidth + 1) * px2pt, h: (text.offsetHeight + 1) * px2pt };

        document.body.removeChild(text);

        return dimensions;
    };

    jsPDFAPI.cellAddPage = function () {
        var margins = this.margins || NO_MARGINS;

        this.addPage();

        setLastCellPosition(margins.left, margins.top, undefined, undefined);
        //setLastCellPosition(undefined, undefined, undefined, undefined, undefined);
        pages += 1;
    };

    jsPDFAPI.cellInitialize = function () {
        lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined };
        pages = 1;
    };

    jsPDFAPI.cell = function (x, y, w, h, txt, ln, align) {
        var curCell = getLastCellPosition();
        var pgAdded = false;

        // If this is not the first cell, we must change its position
        if (curCell.ln !== undefined) {
            if (curCell.ln === ln) {
                //Same line
                x = curCell.x + curCell.w;
                y = curCell.y;
            } else {
                //New line
                var margins = this.margins || NO_MARGINS;
                if (curCell.y + curCell.h + h + margin >= this.internal.pageSize.height - margins.bottom) {
                    this.cellAddPage();
                    pgAdded = true;
                    if (this.printHeaders && this.tableHeaderRow) {
                        this.printHeaderRow(ln, true);
                    }
                }
                //We ignore the passed y: the lines may have different heights
                y = getLastCellPosition().y + getLastCellPosition().h;
                if (pgAdded) y = margin + 10;
            }
        }

        if (txt[0] !== undefined) {
            if (this.printingHeaderRow) {
                this.rect(x, y, w, h, 'FD');
            } else {
                this.rect(x, y, w, h);
            }
            if (align === 'right') {
                if (!(txt instanceof Array)) {
                    txt = [txt];
                }
                for (var i = 0; i < txt.length; i++) {
                    var currentLine = txt[i];
                    var textSize = this.getStringUnitWidth(currentLine) * this.internal.getFontSize();
                    this.text(currentLine, x + w - textSize - padding, y + this.internal.getLineHeight() * (i + 1));
                }
            } else {
                this.text(txt, x + padding, y + this.internal.getLineHeight());
            }
        }
        setLastCellPosition(x, y, w, h, ln);
        return this;
    };

    /**
     * Return the maximum value from an array
     * @param array
     * @param comparisonFn
     * @returns {*}
     */
    jsPDFAPI.arrayMax = function (array, comparisonFn) {
        var max = array[0],
            i,
            ln,
            item;

        for (i = 0, ln = array.length; i < ln; i += 1) {
            item = array[i];

            if (comparisonFn) {
                if (comparisonFn(max, item) === -1) {
                    max = item;
                }
            } else {
                if (item > max) {
                    max = item;
                }
            }
        }

        return max;
    };

    /**
     * Create a table from a set of data.
     * @param {Integer} [x] : left-position for top-left corner of table
     * @param {Integer} [y] top-position for top-left corner of table
     * @param {Object[]} [data] As array of objects containing key-value pairs corresponding to a row of data.
     * @param {String[]} [headers] Omit or null to auto-generate headers at a performance cost
       * @param {Object} [config.printHeaders] True to print column headers at the top of every page
     * @param {Object} [config.autoSize] True to dynamically set the column widths to match the widest cell value
     * @param {Object} [config.margins] margin values for left, top, bottom, and width
     * @param {Object} [config.fontSize] Integer fontSize to use (optional)
     */

    jsPDFAPI.table = function (x, y, data, headers, config) {
        if (!data) {
            throw 'No data for PDF table';
        }

        var headerNames = [],
            headerPrompts = [],
            header,
            i,
            ln,
            cln,
            columnMatrix = {},
            columnWidths = {},
            columnData,
            column,
            columnMinWidths = [],
            j,
            tableHeaderConfigs = [],
            model,
            jln,
            func,


        //set up defaults. If a value is provided in config, defaults will be overwritten:
        autoSize = false,
            printHeaders = true,
            fontSize = 12,
            margins = NO_MARGINS;

        margins.width = this.internal.pageSize.width;

        if (config) {
            //override config defaults if the user has specified non-default behavior:
            if (config.autoSize === true) {
                autoSize = true;
            }
            if (config.printHeaders === false) {
                printHeaders = false;
            }
            if (config.fontSize) {
                fontSize = config.fontSize;
            }
            if (config.css && typeof config.css['font-size'] !== "undefined") {
                fontSize = config.css['font-size'] * 16;
            }
            if (config.margins) {
                margins = config.margins;
            }
        }

        /**
         * @property {Number} lnMod
         * Keep track of the current line number modifier used when creating cells
         */
        this.lnMod = 0;
        lastCellPos = { x: undefined, y: undefined, w: undefined, h: undefined, ln: undefined }, pages = 1;

        this.printHeaders = printHeaders;
        this.margins = margins;
        this.setFontSize(fontSize);
        this.table_font_size = fontSize;

        // Set header values
        if (headers === undefined || headers === null) {
            // No headers defined so we derive from data
            headerNames = Object.keys(data[0]);
        } else if (headers[0] && typeof headers[0] !== 'string') {
            var px2pt = 0.264583 * 72 / 25.4;

            // Split header configs into names and prompts
            for (i = 0, ln = headers.length; i < ln; i += 1) {
                header = headers[i];
                headerNames.push(header.name);
                headerPrompts.push(header.prompt);
                columnWidths[header.name] = header.width * px2pt;
            }
        } else {
            headerNames = headers;
        }

        if (autoSize) {
            // Create a matrix of columns e.g., {column_title: [row1_Record, row2_Record]}
            func = function func(rec) {
                return rec[header];
            };

            for (i = 0, ln = headerNames.length; i < ln; i += 1) {
                header = headerNames[i];

                columnMatrix[header] = data.map(func);

                // get header width
                columnMinWidths.push(this.getTextDimensions(headerPrompts[i] || header).w);
                column = columnMatrix[header];

                // get cell widths
                for (j = 0, cln = column.length; j < cln; j += 1) {
                    columnData = column[j];
                    columnMinWidths.push(this.getTextDimensions(columnData).w);
                }

                // get final column width
                columnWidths[header] = jsPDFAPI.arrayMax(columnMinWidths);

                //have to reset
                columnMinWidths = [];
            }
        }

        // -- Construct the table

        if (printHeaders) {
            var lineHeight = this.calculateLineHeight(headerNames, columnWidths, headerPrompts.length ? headerPrompts : headerNames);

            // Construct the header row
            for (i = 0, ln = headerNames.length; i < ln; i += 1) {
                header = headerNames[i];
                tableHeaderConfigs.push([x, y, columnWidths[header], lineHeight, String(headerPrompts.length ? headerPrompts[i] : header)]);
            }

            // Store the table header config
            this.setTableHeaderRow(tableHeaderConfigs);

            // Print the header for the start of the table
            this.printHeaderRow(1, false);
        }

        // Construct the data rows
        for (i = 0, ln = data.length; i < ln; i += 1) {
            var lineHeight;
            model = data[i];
            lineHeight = this.calculateLineHeight(headerNames, columnWidths, model);

            for (j = 0, jln = headerNames.length; j < jln; j += 1) {
                header = headerNames[j];
                this.cell(x, y, columnWidths[header], lineHeight, model[header], i + 2, header.align);
            }
        }
        this.lastCellPos = lastCellPos;
        this.table_x = x;
        this.table_y = y;
        return this;
    };
    /**
     * Calculate the height for containing the highest column
     * @param {String[]} headerNames is the header, used as keys to the data
     * @param {Integer[]} columnWidths is size of each column
     * @param {Object[]} model is the line of data we want to calculate the height of
     */
    jsPDFAPI.calculateLineHeight = function (headerNames, columnWidths, model) {
        var header,
            lineHeight = 0;
        for (var j = 0; j < headerNames.length; j++) {
            header = headerNames[j];
            model[header] = this.splitTextToSize(String(model[header]), columnWidths[header] - padding);
            var h = this.internal.getLineHeight() * model[header].length + padding;
            if (h > lineHeight) lineHeight = h;
        }
        return lineHeight;
    };

    /**
     * Store the config for outputting a table header
     * @param {Object[]} config
     * An array of cell configs that would define a header row: Each config matches the config used by jsPDFAPI.cell
     * except the ln parameter is excluded
     */
    jsPDFAPI.setTableHeaderRow = function (config) {
        this.tableHeaderRow = config;
    };

    /**
     * Output the store header row
     * @param lineNumber The line number to output the header at
     */
    jsPDFAPI.printHeaderRow = function (lineNumber, new_page) {
        if (!this.tableHeaderRow) {
            throw 'Property tableHeaderRow does not exist.';
        }

        var tableHeaderCell, tmpArray, i, ln;

        this.printingHeaderRow = true;
        if (headerFunction !== undefined) {
            var position = headerFunction(this, pages);
            setLastCellPosition(position[0], position[1], position[2], position[3], -1);
        }
        this.setFontStyle('bold');
        var tempHeaderConf = [];
        for (i = 0, ln = this.tableHeaderRow.length; i < ln; i += 1) {
            this.setFillColor(200, 200, 200);

            tableHeaderCell = this.tableHeaderRow[i];
            if (new_page) {
                this.margins.top = margin;
                tableHeaderCell[1] = this.margins && this.margins.top || 0;
                tempHeaderConf.push(tableHeaderCell);
            }
            tmpArray = [].concat(tableHeaderCell);
            this.cell.apply(this, tmpArray.concat(lineNumber));
        }
        if (tempHeaderConf.length > 0) {
            this.setTableHeaderRow(tempHeaderConf);
        }
        this.setFontStyle('normal');
        this.printingHeaderRow = false;
    };
})(jsPDF.API);

/**
 * jsPDF Context2D PlugIn Copyright (c) 2014 Steven Spungin (TwelveTone LLC) steven@twelvetone.tv
 *
 * Licensed under the MIT License. http://opensource.org/licenses/mit-license
 */

/**
 * This plugin mimics the HTML5 Canvas's context2d.
 *
 * The goal is to provide a way for current canvas implementations to print directly to a PDF.
 */

/**
 * TODO implement stroke opacity (refactor from fill() method )
 * TODO transform angle and radii parameters
 */

/**
 * require('jspdf.js'); require('lib/css_colors.js');
 */

(function (jsPDFAPI) {
    'use strict';

    jsPDFAPI.events.push(['initialized', function () {
        this.context2d.pdf = this;
        this.context2d.internal.pdf = this;
        this.context2d.ctx = new context();
        this.context2d.ctxStack = [];
        this.context2d.path = [];
    }]);

    jsPDFAPI.context2d = {
        pageWrapXEnabled: false,
        pageWrapYEnabled: false,
        pageWrapX: 9999999,
        pageWrapY: 9999999,
        ctx: new context(),
        f2: function f2(number) {
            return number.toFixed(2);
        },

        fillRect: function fillRect(x, y, w, h) {
            if (this._isFillTransparent()) {
                return;
            }
            x = this._wrapX(x);
            y = this._wrapY(y);

            var xRect = this._matrix_map_rect(this.ctx._transform, { x: x, y: y, w: w, h: h });
            this.pdf.rect(xRect.x, xRect.y, xRect.w, xRect.h, "f");
        },

        strokeRect: function strokeRect(x, y, w, h) {
            if (this._isStrokeTransparent()) {
                return;
            }
            x = this._wrapX(x);
            y = this._wrapY(y);

            var xRect = this._matrix_map_rect(this.ctx._transform, { x: x, y: y, w: w, h: h });
            this.pdf.rect(xRect.x, xRect.y, xRect.w, xRect.h, "s");
        },

        /**
         * We cannot clear PDF commands that were already written to PDF, so we use white instead. <br />
         * As a special case, read a special flag (ignoreClearRect) and do nothing if it is set.
         * This results in all calls to clearRect() to do nothing, and keep the canvas transparent.
         * This flag is stored in the save/restore context and is managed the same way as other drawing states.
         * @param x
         * @param y
         * @param w
         * @param h
         */
        clearRect: function clearRect(x, y, w, h) {
            if (this.ctx.ignoreClearRect) {
                return;
            }

            x = this._wrapX(x);
            y = this._wrapY(y);

            var xRect = this._matrix_map_rect(this.ctx._transform, { x: x, y: y, w: w, h: h });
            this.save();
            this.setFillStyle('#ffffff');
            //TODO This is hack to fill with white.
            this.pdf.rect(xRect.x, xRect.y, xRect.w, xRect.h, "f");
            this.restore();
        },

        save: function save() {
            this.ctx._fontSize = this.pdf.internal.getFontSize();
            var ctx = new context();
            ctx.copy(this.ctx);
            this.ctxStack.push(this.ctx);
            this.ctx = ctx;
        },

        restore: function restore() {
            this.ctx = this.ctxStack.pop();
            this.setFillStyle(this.ctx.fillStyle);
            this.setStrokeStyle(this.ctx.strokeStyle);
            this.setFont(this.ctx.font);
            this.pdf.setFontSize(this.ctx._fontSize);
            this.setLineCap(this.ctx.lineCap);
            this.setLineWidth(this.ctx.lineWidth);
            this.setLineJoin(this.ctx.lineJoin);
        },

        rect: function rect(x, y, w, h) {
            this.moveTo(x, y);
            this.lineTo(x + w, y);
            this.lineTo(x + w, y + h);
            this.lineTo(x, y + h);
            this.lineTo(x, y); //TODO not needed
            this.closePath();
        },

        beginPath: function beginPath() {
            this.path = [];
        },

        closePath: function closePath() {
            this.path.push({
                type: 'close'
            });
        },

        _getRGBA: function _getRGBA(style) {
            // get the decimal values of r, g, and b;
            var r, g, b, a;
            if (!style) {
                return { r: 0, g: 0, b: 0, a: 0, style: style };
            }

            if (this.internal.rxTransparent.test(style)) {
                r = 0;
                g = 0;
                b = 0;
                a = 0;
            } else {
                var m = this.internal.rxRgb.exec(style);
                if (m != null) {
                    r = parseInt(m[1]);
                    g = parseInt(m[2]);
                    b = parseInt(m[3]);
                    a = 1;
                } else {
                    m = this.internal.rxRgba.exec(style);
                    if (m != null) {
                        r = parseInt(m[1]);
                        g = parseInt(m[2]);
                        b = parseInt(m[3]);
                        a = parseFloat(m[4]);
                    } else {
                        a = 1;
                        if (style.charAt(0) != '#') {
                            style = CssColors.colorNameToHex(style);
                            if (!style) {
                                style = '#000000';
                            }
                        } else {}

                        if (style.length === 4) {
                            r = style.substring(1, 2);
                            r += r;
                            g = style.substring(2, 3);
                            g += g;
                            b = style.substring(3, 4);
                            b += b;
                        } else {
                            r = style.substring(1, 3);
                            g = style.substring(3, 5);
                            b = style.substring(5, 7);
                        }
                        r = parseInt(r, 16);
                        g = parseInt(g, 16);
                        b = parseInt(b, 16);
                    }
                }
            }
            return { r: r, g: g, b: b, a: a, style: style };
        },

        setFillStyle: function setFillStyle(style) {
            var rgba = this._getRGBA(style);

            this.ctx.fillStyle = style;
            this.ctx._isFillTransparent = rgba.a === 0;
            this.ctx._fillOpacity = rgba.a;

            this.pdf.setFillColor(rgba.r, rgba.g, rgba.b, {
                a: rgba.a
            });
            this.pdf.setTextColor(rgba.r, rgba.g, rgba.b, {
                a: rgba.a
            });
        },

        setStrokeStyle: function setStrokeStyle(style) {
            var rgba = this._getRGBA(style);

            this.ctx.strokeStyle = rgba.style;
            this.ctx._isStrokeTransparent = rgba.a === 0;
            this.ctx._strokeOpacity = rgba.a;

            //TODO jsPDF to handle rgba
            if (rgba.a === 0) {
                this.pdf.setDrawColor(255, 255, 255);
            } else if (rgba.a === 1) {
                this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b);
            } else {
                //this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b, {a: rgba.a});
                this.pdf.setDrawColor(rgba.r, rgba.g, rgba.b);
            }
        },

        fillText: function fillText(text, x, y, maxWidth) {
            if (this._isFillTransparent()) {
                return;
            }
            x = this._wrapX(x);
            y = this._wrapY(y);

            var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
            x = xpt[0];
            y = xpt[1];
            var rads = this._matrix_rotation(this.ctx._transform);
            var degs = rads * 57.2958;

            //TODO only push the clip if it has not been applied to the current PDF context
            if (this.ctx._clip_path.length > 0) {
                var lines;
                if (window.outIntercept) {
                    lines = window.outIntercept.type === 'group' ? window.outIntercept.stream : window.outIntercept;
                } else {
                    lines = this.internal.getCurrentPage();
                }
                lines.push("q");
                var origPath = this.path;
                this.path = this.ctx._clip_path;
                this.ctx._clip_path = [];
                this._fill(null, true);
                this.ctx._clip_path = this.path;
                this.path = origPath;
            }

            // We only use X axis as scale hint 
            var scale = 1;
            try {
                scale = this._matrix_decompose(this._getTransform()).scale[0];
            } catch (e) {
                console.warn(e);
            }

            // In some cases the transform was very small (5.715760606202283e-17).  Most likely a canvg rounding error.
            if (scale < .01) {
                this.pdf.text(text, x, this._getBaseline(y), null, degs);
            } else {
                var oldSize = this.pdf.internal.getFontSize();
                this.pdf.setFontSize(oldSize * scale);
                this.pdf.text(text, x, this._getBaseline(y), null, degs);
                this.pdf.setFontSize(oldSize);
            }

            if (this.ctx._clip_path.length > 0) {
                lines.push('Q');
            }
        },

        strokeText: function strokeText(text, x, y, maxWidth) {
            if (this._isStrokeTransparent()) {
                return;
            }
            x = this._wrapX(x);
            y = this._wrapY(y);

            var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
            x = xpt[0];
            y = xpt[1];
            var rads = this._matrix_rotation(this.ctx._transform);
            var degs = rads * 57.2958;

            //TODO only push the clip if it has not been applied to the current PDF context
            if (this.ctx._clip_path.length > 0) {
                var lines;
                if (window.outIntercept) {
                    lines = window.outIntercept.type === 'group' ? window.outIntercept.stream : window.outIntercept;
                } else {
                    lines = this.internal.getCurrentPage();
                }
                lines.push("q");
                var origPath = this.path;
                this.path = this.ctx._clip_path;
                this.ctx._clip_path = [];
                this._fill(null, true);
                this.ctx._clip_path = this.path;
                this.path = origPath;
            }

            var scale = 1;
            // We only use the X axis as scale hint 
            try {
                scale = this._matrix_decompose(this._getTransform()).scale[0];
            } catch (e) {
                console.warn(e);
            }

            if (scale === 1) {
                this.pdf.text(text, x, this._getBaseline(y), {
                    stroke: true
                }, degs);
            } else {
                var oldSize = this.pdf.internal.getFontSize();
                this.pdf.setFontSize(oldSize * scale);
                this.pdf.text(text, x, this._getBaseline(y), {
                    stroke: true
                }, degs);
                this.pdf.setFontSize(oldSize);
            }

            if (this.ctx._clip_path.length > 0) {
                lines.push('Q');
            }
        },

        setFont: function setFont(font) {
            this.ctx.font = font;

            //var rx = /\s*(\w+)\s+(\w+)\s+(\w+)\s+([\d\.]+)(px|pt|em)\s+["']?(\w+)['"]?/;
            var rx = /\s*(\w+)\s+(\w+)\s+(\w+)\s+([\d\.]+)(px|pt|em)\s+(.*)?/;
            m = rx.exec(font);
            if (m != null) {
                var fontStyle = m[1];
                var fontWeight = m[3];
                var fontSize = m[4];
                var fontSizeUnit = m[5];
                var fontFamily = m[6];

                if ('px' === fontSizeUnit) {
                    fontSize = Math.floor(parseFloat(fontSize));
                    // fontSize = fontSize * 1.25;
                } else if ('em' === fontSizeUnit) {
                    fontSize = Math.floor(parseFloat(fontSize) * this.pdf.getFontSize());
                } else {
                    fontSize = Math.floor(parseFloat(fontSize));
                }

                this.pdf.setFontSize(fontSize);

                if (fontWeight === 'bold' || fontWeight === '700') {
                    this.pdf.setFontStyle('bold');
                } else {
                    if (fontStyle === 'italic') {
                        this.pdf.setFontStyle('italic');
                    } else {
                        this.pdf.setFontStyle('normal');
                    }
                }

                var name = fontFamily;
                var parts = name.toLowerCase().split(/\s*,\s*/);
                var jsPdfFontName;

                if (parts.indexOf('arial') != -1) {
                    jsPdfFontName = 'Arial';
                } else if (parts.indexOf('verdana') != -1) {
                    jsPdfFontName = 'Verdana';
                } else if (parts.indexOf('helvetica') != -1) {
                    jsPdfFontName = 'Helvetica';
                } else if (parts.indexOf('sans-serif') != -1) {
                    jsPdfFontName = 'sans-serif';
                } else if (parts.indexOf('fixed') != -1) {
                    jsPdfFontName = 'Fixed';
                } else if (parts.indexOf('monospace') != -1) {
                    jsPdfFontName = 'Monospace';
                } else if (parts.indexOf('terminal') != -1) {
                    jsPdfFontName = 'Terminal';
                } else if (parts.indexOf('courier') != -1) {
                    jsPdfFontName = 'Courier';
                } else if (parts.indexOf('times') != -1) {
                    jsPdfFontName = 'Times';
                } else if (parts.indexOf('cursive') != -1) {
                    jsPdfFontName = 'Cursive';
                } else if (parts.indexOf('fantasy') != -1) {
                    jsPdfFontName = 'Fantasy';
                } else if (parts.indexOf('serif') != -1) {
                    jsPdfFontName = 'Serif';
                } else {
                    jsPdfFontName = 'Serif';
                }

                //TODO check more cases
                var style;
                if ('bold' === fontWeight) {
                    style = 'bold';
                } else {
                    style = 'normal';
                }

                this.pdf.setFont(jsPdfFontName, style);
            } else {
                var rx = /\s*(\d+)(pt|px|em)\s+([\w "]+)\s*([\w "]+)?/;
                var m = rx.exec(font);
                if (m != null) {
                    var size = m[1];
                    var name = m[3];
                    var style = m[4];
                    if (!style) {
                        style = 'normal';
                    }
                    if ('em' === fontSizeUnit) {
                        size = Math.floor(parseFloat(fontSize) * this.pdf.getFontSize());
                    } else {
                        size = Math.floor(parseFloat(size));
                    }
                    this.pdf.setFontSize(size);
                    this.pdf.setFont(name, style);
                }
            }
        },

        setTextBaseline: function setTextBaseline(baseline) {
            this.ctx.textBaseline = baseline;
        },

        getTextBaseline: function getTextBaseline() {
            return this.ctx.textBaseline;
        },

        //TODO implement textAlign
        setTextAlign: function setTextAlign(align) {
            this.ctx.textAlign = align;
        },

        getTextAlign: function getTextAlign() {
            return this.ctx.textAlign;
        },

        setLineWidth: function setLineWidth(width) {
            this.ctx.lineWidth = width;
            this.pdf.setLineWidth(width);
        },

        setLineCap: function setLineCap(style) {
            this.ctx.lineCap = style;
            this.pdf.setLineCap(style);
        },

        setLineJoin: function setLineJoin(style) {
            this.ctx.lineJoin = style;
            this.pdf.setLineJoin(style);
        },

        moveTo: function moveTo(x, y) {
            x = this._wrapX(x);
            y = this._wrapY(y);

            var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
            x = xpt[0];
            y = xpt[1];

            var obj = {
                type: 'mt',
                x: x,
                y: y
            };
            this.path.push(obj);
        },

        _wrapX: function _wrapX(x) {
            if (this.pageWrapXEnabled) {
                return x % this.pageWrapX;
            } else {
                return x;
            }
        },

        _wrapY: function _wrapY(y) {
            if (this.pageWrapYEnabled) {
                this._gotoPage(this._page(y));
                return (y - this.lastBreak) % this.pageWrapY;
            } else {
                return y;
            }
        },

        transform: function transform(a, b, c, d, e, f) {
            //TODO apply to current transformation instead of replacing
            this.ctx._transform = [a, b, c, d, e, f];
        },

        setTransform: function setTransform(a, b, c, d, e, f) {
            this.ctx._transform = [a, b, c, d, e, f];
        },

        _getTransform: function _getTransform() {
            return this.ctx._transform;
        },

        lastBreak: 0,
        // Y Position of page breaks.
        pageBreaks: [],
        // returns: One-based Page Number
        // Should only be used if pageWrapYEnabled is true
        _page: function _page(y) {
            if (this.pageWrapYEnabled) {
                this.lastBreak = 0;
                var manualBreaks = 0;
                var autoBreaks = 0;
                for (var i = 0; i < this.pageBreaks.length; i++) {
                    if (y >= this.pageBreaks[i]) {
                        manualBreaks++;
                        if (this.lastBreak === 0) {
                            autoBreaks++;
                        }
                        var spaceBetweenLastBreak = this.pageBreaks[i] - this.lastBreak;
                        this.lastBreak = this.pageBreaks[i];
                        var pagesSinceLastBreak = Math.floor(spaceBetweenLastBreak / this.pageWrapY);
                        autoBreaks += pagesSinceLastBreak;
                    }
                }
                if (this.lastBreak === 0) {
                    var pagesSinceLastBreak = Math.floor(y / this.pageWrapY) + 1;
                    autoBreaks += pagesSinceLastBreak;
                }
                return autoBreaks + manualBreaks;
            } else {
                return this.pdf.internal.getCurrentPageInfo().pageNumber;
            }
        },

        _gotoPage: function _gotoPage(pageOneBased) {
            // This is a stub to be overriden if needed
        },

        lineTo: function lineTo(x, y) {
            x = this._wrapX(x);
            y = this._wrapY(y);

            var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
            x = xpt[0];
            y = xpt[1];

            var obj = {
                type: 'lt',
                x: x,
                y: y
            };
            this.path.push(obj);
        },

        bezierCurveTo: function bezierCurveTo(x1, y1, x2, y2, x, y) {
            x1 = this._wrapX(x1);
            y1 = this._wrapY(y1);
            x2 = this._wrapX(x2);
            y2 = this._wrapY(y2);
            x = this._wrapX(x);
            y = this._wrapY(y);

            var xpt;
            xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
            x = xpt[0];
            y = xpt[1];
            xpt = this._matrix_map_point(this.ctx._transform, [x1, y1]);
            x1 = xpt[0];
            y1 = xpt[1];
            xpt = this._matrix_map_point(this.ctx._transform, [x2, y2]);
            x2 = xpt[0];
            y2 = xpt[1];

            var obj = {
                type: 'bct',
                x1: x1,
                y1: y1,
                x2: x2,
                y2: y2,
                x: x,
                y: y
            };
            this.path.push(obj);
        },

        quadraticCurveTo: function quadraticCurveTo(x1, y1, x, y) {
            x1 = this._wrapX(x1);
            y1 = this._wrapY(y1);
            x = this._wrapX(x);
            y = this._wrapY(y);

            var xpt;
            xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
            x = xpt[0];
            y = xpt[1];
            xpt = this._matrix_map_point(this.ctx._transform, [x1, y1]);
            x1 = xpt[0];
            y1 = xpt[1];

            var obj = {
                type: 'qct',
                x1: x1,
                y1: y1,
                x: x,
                y: y
            };
            this.path.push(obj);
        },

        arc: function arc(x, y, radius, startAngle, endAngle, anticlockwise) {
            x = this._wrapX(x);
            y = this._wrapY(y);

            if (!this._matrix_is_identity(this.ctx._transform)) {
                var xpt = this._matrix_map_point(this.ctx._transform, [x, y]);
                x = xpt[0];
                y = xpt[1];

                var x_radPt0 = this._matrix_map_point(this.ctx._transform, [0, 0]);
                var x_radPt = this._matrix_map_point(this.ctx._transform, [0, radius]);
                radius = Math.sqrt(Math.pow(x_radPt[0] - x_radPt0[0], 2) + Math.pow(x_radPt[1] - x_radPt0[1], 2));

                //TODO angles need to be transformed
            }

            var obj = {
                type: 'arc',
                x: x,
                y: y,
                radius: radius,
                startAngle: startAngle,
                endAngle: endAngle,
                anticlockwise: anticlockwise
            };
            this.path.push(obj);
        },

        drawImage: function drawImage(img, x, y, w, h, x2, y2, w2, h2) {
            if (x2 !== undefined) {
                x = x2;
                y = y2;
                w = w2;
                h = h2;
            }
            x = this._wrapX(x);
            y = this._wrapY(y);

            var xRect = this._matrix_map_rect(this.ctx._transform, { x: x, y: y, w: w, h: h });
            var xRect2 = this._matrix_map_rect(this.ctx._transform, { x: x2, y: y2, w: w2, h: h2 });

            // TODO implement source clipping and image scaling
            var format;
            var rx = /data:image\/(\w+).*/i;
            var m = rx.exec(img);
            if (m != null) {
                format = m[1];
            } else {
                // format = "jpeg";
                format = "png";
            }

            this.pdf.addImage(img, format, xRect.x, xRect.y, xRect.w, xRect.h);
        },

        /**
         * Multiply the first matrix by the second
         * @param m1
         * @param m2
         * @returns {*[]}
         * @private
         */
        _matrix_multiply: function _matrix_multiply(m2, m1) {
            var sx = m1[0];
            var shy = m1[1];
            var shx = m1[2];
            var sy = m1[3];
            var tx = m1[4];
            var ty = m1[5];

            var t0 = sx * m2[0] + shy * m2[2];
            var t2 = shx * m2[0] + sy * m2[2];
            var t4 = tx * m2[0] + ty * m2[2] + m2[4];
            shy = sx * m2[1] + shy * m2[3];
            sy = shx * m2[1] + sy * m2[3];
            ty = tx * m2[1] + ty * m2[3] + m2[5];
            sx = t0;
            shx = t2;
            tx = t4;

            return [sx, shy, shx, sy, tx, ty];
        },

        _matrix_rotation: function _matrix_rotation(m) {
            return Math.atan2(m[2], m[0]);
        },

        _matrix_decompose: function _matrix_decompose(matrix) {

            var a = matrix[0];
            var b = matrix[1];
            var c = matrix[2];
            var d = matrix[3];

            var scaleX = Math.sqrt(a * a + b * b);
            a /= scaleX;
            b /= scaleX;

            var shear = a * c + b * d;
            c -= a * shear;
            d -= b * shear;

            var scaleY = Math.sqrt(c * c + d * d);
            c /= scaleY;
            d /= scaleY;
            shear /= scaleY;

            if (a * d < b * c) {
                a = -a;
                b = -b;
                shear = -shear;
                scaleX = -scaleX;
            }

            return {
                scale: [scaleX, 0, 0, scaleY, 0, 0],
                translate: [1, 0, 0, 1, matrix[4], matrix[5]],
                rotate: [a, b, -b, a, 0, 0],
                skew: [1, 0, shear, 1, 0, 0]
            };
        },

        _matrix_map_point: function _matrix_map_point(m1, pt) {
            var sx = m1[0];
            var shy = m1[1];
            var shx = m1[2];
            var sy = m1[3];
            var tx = m1[4];
            var ty = m1[5];

            var px = pt[0];
            var py = pt[1];

            var x = px * sx + py * shx + tx;
            var y = px * shy + py * sy + ty;
            return [x, y];
        },

        _matrix_map_point_obj: function _matrix_map_point_obj(m1, pt) {
            var xpt = this._matrix_map_point(m1, [pt.x, pt.y]);
            return { x: xpt[0], y: xpt[1] };
        },

        _matrix_map_rect: function _matrix_map_rect(m1, rect) {
            var p1 = this._matrix_map_point(m1, [rect.x, rect.y]);
            var p2 = this._matrix_map_point(m1, [rect.x + rect.w, rect.y + rect.h]);
            return { x: p1[0], y: p1[1], w: p2[0] - p1[0], h: p2[1] - p1[1] };
        },

        _matrix_is_identity: function _matrix_is_identity(m1) {
            if (m1[0] != 1) {
                return false;
            }
            if (m1[1] != 0) {
                return false;
            }
            if (m1[2] != 0) {
                return false;
            }
            if (m1[3] != 1) {
                return false;
            }
            if (m1[4] != 0) {
                return false;
            }
            if (m1[5] != 0) {
                return false;
            }
            return true;
        },

        rotate: function rotate(angle) {
            var matrix = [Math.cos(angle), Math.sin(angle), -Math.sin(angle), Math.cos(angle), 0.0, 0.0];
            this.ctx._transform = this._matrix_multiply(this.ctx._transform, matrix);
        },

        scale: function scale(sx, sy) {
            var matrix = [sx, 0.0, 0.0, sy, 0.0, 0.0];
            this.ctx._transform = this._matrix_multiply(this.ctx._transform, matrix);
        },

        translate: function translate(x, y) {
            var matrix = [1.0, 0.0, 0.0, 1.0, x, y];
            this.ctx._transform = this._matrix_multiply(this.ctx._transform, matrix);
        },

        stroke: function stroke() {
            if (this.ctx._clip_path.length > 0) {

                var lines;
                if (window.outIntercept) {
                    lines = window.outIntercept.type === 'group' ? window.outIntercept.stream : window.outIntercept;
                } else {
                    lines = this.internal.getCurrentPage();
                }
                lines.push("q");

                var origPath = this.path;
                this.path = this.ctx._clip_path;
                this.ctx._clip_path = [];
                this._stroke(true);

                this.ctx._clip_path = this.path;
                this.path = origPath;
                this._stroke(false);

                lines.push("Q");
            } else {
                this._stroke(false);
            }
        },

        _stroke: function _stroke(isClip) {
            if (!isClip && this._isStrokeTransparent()) {
                return;
            }

            //TODO opacity

            var moves = [];
            var xPath = this.path;

            for (var i = 0; i < xPath.length; i++) {
                var pt = xPath[i];
                switch (pt.type) {
                    case 'mt':
                        moves.push({ start: pt, deltas: [], abs: [] });
                        break;
                    case 'lt':
                        var delta = [pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
                        moves[moves.length - 1].deltas.push(delta);
                        moves[moves.length - 1].abs.push(pt);
                        break;
                    case 'bct':
                        var delta = [pt.x1 - xPath[i - 1].x, pt.y1 - xPath[i - 1].y, pt.x2 - xPath[i - 1].x, pt.y2 - xPath[i - 1].y, pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
                        moves[moves.length - 1].deltas.push(delta);
                        break;
                    case 'qct':
                        // convert to bezier
                        var x1 = xPath[i - 1].x + 2.0 / 3.0 * (pt.x1 - xPath[i - 1].x);
                        var y1 = xPath[i - 1].y + 2.0 / 3.0 * (pt.y1 - xPath[i - 1].y);
                        var x2 = pt.x + 2.0 / 3.0 * (pt.x1 - pt.x);
                        var y2 = pt.y + 2.0 / 3.0 * (pt.y1 - pt.y);
                        var x3 = pt.x;
                        var y3 = pt.y;
                        var delta = [x1 - xPath[i - 1].x, y1 - xPath[i - 1].y, x2 - xPath[i - 1].x, y2 - xPath[i - 1].y, x3 - xPath[i - 1].x, y3 - xPath[i - 1].y];
                        moves[moves.length - 1].deltas.push(delta);
                        break;
                    case 'arc':
                        //TODO this was hack to avoid out-of-bounds issue
                        // No move-to before drawing the arc
                        if (moves.length == 0) {
                            moves.push({ start: { x: 0, y: 0 }, deltas: [], abs: [] });
                        }
                        moves[moves.length - 1].arc = true;
                        moves[moves.length - 1].abs.push(pt);
                        break;
                    case 'close':
                        
                        break;
                }
            }

            for (var i = 0; i < moves.length; i++) {
                var style;
                if (i == moves.length - 1) {
                    style = 's';
                } else {
                    style = null;
                }
                if (moves[i].arc) {
                    var arcs = moves[i].abs;
                    for (var ii = 0; ii < arcs.length; ii++) {
                        var arc = arcs[ii];
                        var start = arc.startAngle * 360 / (2 * Math.PI);
                        var end = arc.endAngle * 360 / (2 * Math.PI);
                        var x = arc.x;
                        var y = arc.y;
                        this.internal.arc2(this, x, y, arc.radius, start, end, arc.anticlockwise, style, isClip);
                    }
                } else {
                    var x = moves[i].start.x;
                    var y = moves[i].start.y;
                    if (!isClip) {
                        this.pdf.lines(moves[i].deltas, x, y, null, style);
                    } else {
                        this.pdf.lines(moves[i].deltas, x, y, null, null);
                        this.pdf.clip_fixed();
                    }
                }
            }
        },

        _isFillTransparent: function _isFillTransparent() {
            return this.ctx._isFillTransparent || this.globalAlpha == 0;
        },

        _isStrokeTransparent: function _isStrokeTransparent() {
            return this.ctx._isStrokeTransparent || this.globalAlpha == 0;
        },

        fill: function fill(fillRule) {
            //evenodd or nonzero (default)
            if (this.ctx._clip_path.length > 0) {

                var lines;
                if (window.outIntercept) {
                    lines = window.outIntercept.type === 'group' ? window.outIntercept.stream : window.outIntercept;
                } else {
                    lines = this.internal.getCurrentPage();
                }
                lines.push("q");

                var origPath = this.path;
                this.path = this.ctx._clip_path;
                this.ctx._clip_path = [];
                this._fill(fillRule, true);

                this.ctx._clip_path = this.path;
                this.path = origPath;
                this._fill(fillRule, false);

                lines.push('Q');
            } else {
                this._fill(fillRule, false);
            }
        },

        _fill: function _fill(fillRule, isClip) {
            if (this._isFillTransparent()) {
                return;
            }
            var v2Support = typeof this.pdf.internal.newObject2 === 'function';

            var lines;
            if (window.outIntercept) {
                lines = window.outIntercept.type === 'group' ? window.outIntercept.stream : window.outIntercept;
            } else {
                lines = this.internal.getCurrentPage();
            }

            // if (this.ctx._clip_path.length > 0) {
            //     lines.push('q');
            //     var oldPath = this.path;
            //     this.path = this.ctx._clip_path;
            //     this.ctx._clip_path = [];
            //     this._fill(fillRule, true);
            //     this.ctx._clip_path = this.path;
            //     this.path = oldPath;
            // }

            var moves = [];
            var outInterceptOld = window.outIntercept;

            if (v2Support) {
                // Blend and Mask
                switch (this.ctx.globalCompositeOperation) {
                    case 'normal':
                    case 'source-over':
                        break;
                    case 'destination-in':
                    case 'destination-out':
                        //TODO this need to be added to the current group or page
                        // define a mask stream
                        var obj = this.pdf.internal.newStreamObject();

                        // define a mask state
                        var obj2 = this.pdf.internal.newObject2();
                        obj2.push('<</Type /ExtGState');
                        obj2.push('/SMask <</S /Alpha /G ' + obj.objId + ' 0 R>>'); // /S /Luminosity will need to define color space
                        obj2.push('>>');

                        // add mask to page resources
                        var gsName = 'MASK' + obj2.objId;
                        this.pdf.internal.addGraphicsState(gsName, obj2.objId);

                        var instruction = '/' + gsName + ' gs';
                        // add mask to page, group, or stream
                        lines.splice(0, 0, 'q');
                        lines.splice(1, 0, instruction);
                        lines.push('Q');

                        window.outIntercept = obj;
                        break;
                    default:
                        var dictionaryEntry = '/' + this.pdf.internal.blendModeMap[this.ctx.globalCompositeOperation.toUpperCase()];
                        if (dictionaryEntry) {
                            this.pdf.internal.out(dictionaryEntry + ' gs');
                        }
                        break;
                }
            }

            var alpha = this.ctx.globalAlpha;
            if (this.ctx._fillOpacity < 1) {
                // TODO combine this with global opacity
                alpha = this.ctx._fillOpacity;
            }

            //TODO check for an opacity graphics state that was already created
            //TODO do not set opacity if current value is already active
            if (v2Support) {
                var objOpac = this.pdf.internal.newObject2();
                objOpac.push('<</Type /ExtGState');
                //objOpac.push(this.ctx.globalAlpha + " CA"); // Stroke
                //objOpac.push(this.ctx.globalAlpha + " ca"); // Not Stroke
                objOpac.push('/CA ' + alpha); // Stroke
                objOpac.push('/ca ' + alpha); // Not Stroke
                objOpac.push('>>');
                var gsName = 'GS_O_' + objOpac.objId;
                this.pdf.internal.addGraphicsState(gsName, objOpac.objId);
                this.pdf.internal.out('/' + gsName + ' gs');
            }

            var xPath = this.path;

            for (var i = 0; i < xPath.length; i++) {
                var pt = xPath[i];
                switch (pt.type) {
                    case 'mt':
                        moves.push({ start: pt, deltas: [], abs: [] });
                        break;
                    case 'lt':
                        var delta = [pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
                        moves[moves.length - 1].deltas.push(delta);
                        moves[moves.length - 1].abs.push(pt);
                        break;
                    case 'bct':
                        var delta = [pt.x1 - xPath[i - 1].x, pt.y1 - xPath[i - 1].y, pt.x2 - xPath[i - 1].x, pt.y2 - xPath[i - 1].y, pt.x - xPath[i - 1].x, pt.y - xPath[i - 1].y];
                        moves[moves.length - 1].deltas.push(delta);
                        break;
                    case 'qct':
                        // convert to bezier
                        var x1 = xPath[i - 1].x + 2.0 / 3.0 * (pt.x1 - xPath[i - 1].x);
                        var y1 = xPath[i - 1].y + 2.0 / 3.0 * (pt.y1 - xPath[i - 1].y);
                        var x2 = pt.x + 2.0 / 3.0 * (pt.x1 - pt.x);
                        var y2 = pt.y + 2.0 / 3.0 * (pt.y1 - pt.y);
                        var x3 = pt.x;
                        var y3 = pt.y;
                        var delta = [x1 - xPath[i - 1].x, y1 - xPath[i - 1].y, x2 - xPath[i - 1].x, y2 - xPath[i - 1].y, x3 - xPath[i - 1].x, y3 - xPath[i - 1].y];
                        moves[moves.length - 1].deltas.push(delta);
                        break;
                    case 'arc':
                        //TODO this was hack to avoid out-of-bounds issue when drawing circle
                        // No move-to before drawing the arc
                        if (moves.length === 0) {
                            moves.push({ deltas: [], abs: [] });
                        }
                        moves[moves.length - 1].arc = true;
                        moves[moves.length - 1].abs.push(pt);
                        break;
                    case 'close':
                        moves.push({ close: true });
                        break;
                }
            }

            for (var i = 0; i < moves.length; i++) {
                var style;
                if (i == moves.length - 1) {
                    style = 'f';
                    if (fillRule === 'evenodd') {
                        style += '*';
                    }
                } else {
                    style = null;
                }

                if (moves[i].close) {
                    this.pdf.internal.out('h');
                    this.pdf.internal.out('f');
                } else if (moves[i].arc) {
                    if (moves[i].start) {
                        this.internal.move2(this, moves[i].start.x, moves[i].start.y);
                    }
                    var arcs = moves[i].abs;
                    for (var ii = 0; ii < arcs.length; ii++) {
                        var arc = arcs[ii];
                        //TODO lines deltas were getting in here
                        if (typeof arc.startAngle !== 'undefined') {
                            var start = arc.startAngle * 360 / (2 * Math.PI);
                            var end = arc.endAngle * 360 / (2 * Math.PI);
                            var x = arc.x;
                            var y = arc.y;
                            if (ii === 0) {
                                this.internal.move2(this, x, y);
                            }
                            this.internal.arc2(this, x, y, arc.radius, start, end, arc.anticlockwise, null, isClip);
                            if (ii === arcs.length - 1) {
                                // The original arc move did not occur because of the algorithm
                                if (moves[i].start) {
                                    var x = moves[i].start.x;
                                    var y = moves[i].start.y;
                                    this.internal.line2(c2d, x, y);
                                }
                            }
                        } else {
                            this.internal.line2(c2d, arc.x, arc.y);
                        }
                    }
                } else {
                    var x = moves[i].start.x;
                    var y = moves[i].start.y;
                    if (!isClip) {
                        this.pdf.lines(moves[i].deltas, x, y, null, style);
                    } else {
                        this.pdf.lines(moves[i].deltas, x, y, null, null);
                        this.pdf.clip_fixed();
                    }
                }
            }

            window.outIntercept = outInterceptOld;

            // if (this.ctx._clip_path.length > 0) {
            //     lines.push('Q');
            // }
        },

        pushMask: function pushMask() {
            var v2Support = typeof this.pdf.internal.newObject2 === 'function';

            if (!v2Support) {
                console.log('jsPDF v2 not enabled');
                return;
            }

            // define a mask stream
            var obj = this.pdf.internal.newStreamObject();

            // define a mask state
            var obj2 = this.pdf.internal.newObject2();
            obj2.push('<</Type /ExtGState');
            obj2.push('/SMask <</S /Alpha /G ' + obj.objId + ' 0 R>>'); // /S /Luminosity will need to define color space
            obj2.push('>>');

            // add mask to page resources
            var gsName = 'MASK' + obj2.objId;
            this.pdf.internal.addGraphicsState(gsName, obj2.objId);

            var instruction = '/' + gsName + ' gs';
            this.pdf.internal.out(instruction);
        },

        clip: function clip() {
            //TODO do we reset the path, or just copy it?
            if (this.ctx._clip_path.length > 0) {
                for (var i = 0; i < this.path.length; i++) {
                    this.ctx._clip_path.push(this.path[i]);
                }
            } else {
                this.ctx._clip_path = this.path;
            }
            this.path = [];
        },

        measureText: function measureText(text) {
            var pdf = this.pdf;
            return {
                getWidth: function getWidth() {
                    var fontSize = pdf.internal.getFontSize();
                    var txtWidth = pdf.getStringUnitWidth(text) * fontSize / pdf.internal.scaleFactor;
                    // Convert points to pixels
                    txtWidth *= 1.3333;
                    return txtWidth;
                },

                get width() {
                    return this.getWidth(text);
                }
            };
        },
        _getBaseline: function _getBaseline(y) {
            var height = parseInt(this.pdf.internal.getFontSize());
            // TODO Get descent from font descriptor
            var descent = height * .25;
            switch (this.ctx.textBaseline) {
                case 'bottom':
                    return y - descent;
                case 'top':
                    return y + height;
                case 'hanging':
                    return y + height - descent;
                case 'middle':
                    return y + height / 2 - descent;
                case 'ideographic':
                    // TODO not implemented
                    return y;
                case 'alphabetic':
                default:
                    return y;
            }
        }
    };

    var c2d = jsPDFAPI.context2d;

    // accessor methods
    Object.defineProperty(c2d, 'fillStyle', {
        set: function set(value) {
            this.setFillStyle(value);
        },
        get: function get() {
            return this.ctx.fillStyle;
        }
    });
    Object.defineProperty(c2d, 'strokeStyle', {
        set: function set(value) {
            this.setStrokeStyle(value);
        },
        get: function get() {
            return this.ctx.strokeStyle;
        }
    });
    Object.defineProperty(c2d, 'lineWidth', {
        set: function set(value) {
            this.setLineWidth(value);
        },
        get: function get() {
            return this.ctx.lineWidth;
        }
    });
    Object.defineProperty(c2d, 'lineCap', {
        set: function set(val) {
            this.setLineCap(val);
        },
        get: function get() {
            return this.ctx.lineCap;
        }
    });
    Object.defineProperty(c2d, 'lineJoin', {
        set: function set(val) {
            this.setLineJoin(val);
        },
        get: function get() {
            return this.ctx.lineJoin;
        }
    });
    Object.defineProperty(c2d, 'miterLimit', {
        set: function set(val) {
            this.ctx.miterLimit = val;
        },
        get: function get() {
            return this.ctx.miterLimit;
        }
    });
    Object.defineProperty(c2d, 'textBaseline', {
        set: function set(value) {
            this.setTextBaseline(value);
        },
        get: function get() {
            return this.getTextBaseline();
        }
    });
    Object.defineProperty(c2d, 'textAlign', {
        set: function set(value) {
            this.setTextAlign(value);
        },
        get: function get() {
            return this.getTextAlign();
        }
    });
    Object.defineProperty(c2d, 'font', {
        set: function set(value) {
            this.setFont(value);
        },
        get: function get() {
            return this.ctx.font;
        }
    });
    Object.defineProperty(c2d, 'globalCompositeOperation', {
        set: function set(value) {
            this.ctx.globalCompositeOperation = value;
        },
        get: function get() {
            return this.ctx.globalCompositeOperation;
        }
    });
    Object.defineProperty(c2d, 'globalAlpha', {
        set: function set(value) {
            this.ctx.globalAlpha = value;
        },
        get: function get() {
            return this.ctx.globalAlpha;
        }
    });
    // Not HTML API
    Object.defineProperty(c2d, 'ignoreClearRect', {
        set: function set(value) {
            this.ctx.ignoreClearRect = value;
        },
        get: function get() {
            return this.ctx.ignoreClearRect;
        }
    });
    // End Not HTML API

    c2d.internal = {};

    c2d.internal.rxRgb = /rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/;
    c2d.internal.rxRgba = /rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d\.]+)\s*\)/;
    c2d.internal.rxTransparent = /transparent|rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*0+\s*\)/;

    // http://hansmuller-flex.blogspot.com/2011/10/more-about-approximating-circular-arcs.html
    c2d.internal.arc = function (c2d, xc, yc, r, a1, a2, anticlockwise, style) {
        var includeMove = true;

        var k = this.pdf.internal.scaleFactor;
        var pageHeight = this.pdf.internal.pageSize.height;
        var f2 = this.pdf.internal.f2;

        var a1r = a1 * (Math.PI / 180);
        var a2r = a2 * (Math.PI / 180);
        var curves = this.createArc(r, a1r, a2r, anticlockwise);
        for (var i = 0; i < curves.length; i++) {
            var curve = curves[i];
            if (includeMove && i === 0) {
                this.pdf.internal.out([f2((curve.x1 + xc) * k), f2((pageHeight - (curve.y1 + yc)) * k), 'm', f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), 'c'].join(' '));
            } else {
                this.pdf.internal.out([f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), 'c'].join(' '));
            }

            //c2d._lastPoint = {x: curve.x1 + xc, y: curve.y1 + yc};
            c2d._lastPoint = { x: xc, y: yc };
            // f2((curve.x1 + xc) * k), f2((pageHeight - (curve.y1 + yc)) * k), 'm', f2((curve.x2 + xc) * k), f2((pageHeight - (curve.y2 + yc)) * k), f2((curve.x3 + xc) * k), f2((pageHeight - (curve.y3 + yc)) * k), f2((curve.x4 + xc) * k), f2((pageHeight - (curve.y4 + yc)) * k), 'c'
        }

        if (style !== null) {
            this.pdf.internal.out(this.pdf.internal.getStyle(style));
        }
    };

    /**
     *
     * @param x Edge point X
     * @param y Edge point Y
     * @param r Radius
     * @param a1 start angle
     * @param a2 end angle
     * @param anticlockwise
     * @param style
     * @param isClip
     */
    c2d.internal.arc2 = function (c2d, x, y, r, a1, a2, anticlockwise, style, isClip) {
        // we need to convert from cartesian to polar here methinks.
        var centerX = x; // + r;
        var centerY = y;

        if (!isClip) {
            this.arc(c2d, centerX, centerY, r, a1, a2, anticlockwise, style);
        } else {
            this.arc(c2d, centerX, centerY, r, a1, a2, anticlockwise, null);
            this.pdf.clip_fixed();
        }
    };

    c2d.internal.move2 = function (c2d, x, y) {
        var k = this.pdf.internal.scaleFactor;
        var pageHeight = this.pdf.internal.pageSize.height;
        var f2 = this.pdf.internal.f2;

        this.pdf.internal.out([f2(x * k), f2((pageHeight - y) * k), 'm'].join(' '));
        c2d._lastPoint = { x: x, y: y };
    };

    c2d.internal.line2 = function (c2d, dx, dy) {
        var k = this.pdf.internal.scaleFactor;
        var pageHeight = this.pdf.internal.pageSize.height;
        var f2 = this.pdf.internal.f2;

        //var pt = {x: c2d._lastPoint.x + dx, y: c2d._lastPoint.y + dy};
        var pt = { x: dx, y: dy };

        this.pdf.internal.out([f2(pt.x * k), f2((pageHeight - pt.y) * k), 'l'].join(' '));
        //this.pdf.internal.out('f');
        c2d._lastPoint = pt;
    };

    /**
     * Return a array of objects that represent bezier curves which approximate the circular arc centered at the origin, from startAngle to endAngle (radians) with the specified radius.
     *
     * Each bezier curve is an object with four points, where x1,y1 and x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's control points.
     */

    c2d.internal.createArc = function (radius, startAngle, endAngle, anticlockwise) {
        var EPSILON = 0.00001; // Roughly 1/1000th of a degree, see below
        var twoPI = Math.PI * 2;
        var piOverTwo = Math.PI / 2.0;

        // normalize startAngle, endAngle to [0, 2PI]
        var startAngleN = startAngle;
        if (startAngleN < twoPI || startAngleN > twoPI) {
            startAngleN = startAngleN % twoPI;
        }
        if (startAngleN < 0) {
            startAngleN = twoPI + startAngleN;
        }

        while (startAngle > endAngle) {
            startAngle = startAngle - twoPI;
        }
        var totalAngle = Math.abs(endAngle - startAngle);
        if (totalAngle < twoPI) {
            if (anticlockwise) {
                totalAngle = twoPI - totalAngle;
            }
        }

        // Compute the sequence of arc curves, up to PI/2 at a time.
        var curves = [];
        var sgn = anticlockwise ? -1 : +1;

        var a1 = startAngleN;
        for (; totalAngle > EPSILON;) {
            var remain = sgn * Math.min(totalAngle, piOverTwo);
            var a2 = a1 + remain;
            curves.push(this.createSmallArc(radius, a1, a2));
            totalAngle -= Math.abs(a2 - a1);
            a1 = a2;
        }

        return curves;
    };

    c2d.internal.getCurrentPage = function () {
        return this.pdf.internal.pages[this.pdf.internal.getCurrentPageInfo().pageNumber];
    };

    /**
     * Cubic bezier approximation of a circular arc centered at the origin, from (radians) a1 to a2, where a2-a1 < pi/2. The arc's radius is r.
     *
     * Returns an object with four points, where x1,y1 and x4,y4 are the arc's end points and x2,y2 and x3,y3 are the cubic bezier's control points.
     *
     * This algorithm is based on the approach described in: A. Riškus, "Approximation of a Cubic Bezier Curve by Circular Arcs and Vice Versa," Information Technology and Control, 35(4), 2006 pp. 371-378.
     */

    c2d.internal.createSmallArc = function (r, a1, a2) {
        // Compute all four points for an arc that subtends the same total angle
        // but is centered on the X-axis

        var a = (a2 - a1) / 2.0;

        var x4 = r * Math.cos(a);
        var y4 = r * Math.sin(a);
        var x1 = x4;
        var y1 = -y4;

        var q1 = x1 * x1 + y1 * y1;
        var q2 = q1 + x1 * x4 + y1 * y4;
        var k2 = 4 / 3 * (Math.sqrt(2 * q1 * q2) - q2) / (x1 * y4 - y1 * x4);

        var x2 = x1 - k2 * y1;
        var y2 = y1 + k2 * x1;
        var x3 = x2;
        var y3 = -y2;

        // Find the arc points' actual locations by computing x1,y1 and x4,y4
        // and rotating the control points by a + a1

        var ar = a + a1;
        var cos_ar = Math.cos(ar);
        var sin_ar = Math.sin(ar);

        return {
            x1: r * Math.cos(a1),
            y1: r * Math.sin(a1),
            x2: x2 * cos_ar - y2 * sin_ar,
            y2: x2 * sin_ar + y2 * cos_ar,
            x3: x3 * cos_ar - y3 * sin_ar,
            y3: x3 * sin_ar + y3 * cos_ar,
            x4: r * Math.cos(a2),
            y4: r * Math.sin(a2)
        };
    };

    function context() {
        this._isStrokeTransparent = false;
        this._strokeOpacity = 1;
        this.strokeStyle = '#000000';
        this.fillStyle = '#000000';
        this._isFillTransparent = false;
        this._fillOpacity = 1;
        this.font = "12pt times";
        this.textBaseline = 'alphabetic'; // top,bottom,middle,ideographic,alphabetic,hanging
        this.textAlign = 'start';
        this.lineWidth = 1;
        this.lineJoin = 'miter'; // round, bevel, miter
        this.lineCap = 'butt'; // butt, round, square
        this._transform = [1, 0, 0, 1, 0, 0]; // sx, shy, shx, sy, tx, ty
        this.globalCompositeOperation = 'normal';
        this.globalAlpha = 1.0;
        this._clip_path = [];
        // TODO miter limit //default 10

        // Not HTML API
        this.ignoreClearRect = false;

        this.copy = function (ctx) {
            this._isStrokeTransparent = ctx._isStrokeTransparent;
            this._strokeOpacity = ctx._strokeOpacity;
            this.strokeStyle = ctx.strokeStyle;
            this._isFillTransparent = ctx._isFillTransparent;
            this._fillOpacity = ctx._fillOpacity;
            this.fillStyle = ctx.fillStyle;
            this.font = ctx.font;
            this.lineWidth = ctx.lineWidth;
            this.lineJoin = ctx.lineJoin;
            this.lineCap = ctx.lineCap;
            this.textBaseline = ctx.textBaseline;
            this.textAlign = ctx.textAlign;
            this._fontSize = ctx._fontSize;
            this._transform = ctx._transform.slice(0);
            this.globalCompositeOperation = ctx.globalCompositeOperation;
            this.globalAlpha = ctx.globalAlpha;
            this._clip_path = ctx._clip_path.slice(0); //TODO deep copy?

            // Not HTML API
            this.ignoreClearRect = ctx.ignoreClearRect;
        };
    }

    return this;
})(jsPDF.API);

/** @preserve
 * jsPDF fromHTML plugin. BETA stage. API subject to change. Needs browser
 * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
 *               2014 Juan Pablo Gaviria, https://github.com/juanpgaviria
 *               2014 Diego Casorran, https://github.com/diegocr
 *               2014 Daniel Husar, https://github.com/danielhusar
 *               2014 Wolfgang Gassler, https://github.com/woolfg
 *               2014 Steven Spungin, https://github.com/flamenco
 *
 * 
 * ====================================================================
 */

(function (jsPDFAPI) {
	var clone, _DrillForContent, FontNameDB, FontStyleMap, TextAlignMap, FontWeightMap, FloatMap, ClearMap, GetCSS, PurgeWhiteSpace, Renderer, ResolveFont, ResolveUnitedNumber, UnitedNumberMap, elementHandledElsewhere, images, loadImgs, checkForFooter, process, tableToJson;
	clone = function () {
		return function (obj) {
			Clone.prototype = obj;
			return new Clone();
		};
		function Clone() {}
	}();
	PurgeWhiteSpace = function PurgeWhiteSpace(array) {
		var fragment, i, l, lTrimmed, r, rTrimmed, trailingSpace;
		i = 0;
		l = array.length;
		fragment = void 0;
		lTrimmed = false;
		rTrimmed = false;
		while (!lTrimmed && i !== l) {
			fragment = array[i] = array[i].trimLeft();
			if (fragment) {
				lTrimmed = true;
			}
			i++;
		}
		i = l - 1;
		while (l && !rTrimmed && i !== -1) {
			fragment = array[i] = array[i].trimRight();
			if (fragment) {
				rTrimmed = true;
			}
			i--;
		}
		r = /\s+$/g;
		trailingSpace = true;
		i = 0;
		while (i !== l) {
			// Leave the line breaks intact
			if (array[i] != "\u2028") {
				fragment = array[i].replace(/\s+/g, " ");
				if (trailingSpace) {
					fragment = fragment.trimLeft();
				}
				if (fragment) {
					trailingSpace = r.test(fragment);
				}
				array[i] = fragment;
			}
			i++;
		}
		return array;
	};
	Renderer = function Renderer(pdf, x, y, settings) {
		this.pdf = pdf;
		this.x = x;
		this.y = y;
		this.settings = settings;
		//list of functions which are called after each element-rendering process
		this.watchFunctions = [];
		this.init();
		return this;
	};
	ResolveFont = function ResolveFont(css_font_family_string) {
		var name, part, parts;
		name = void 0;
		parts = css_font_family_string.split(",");
		part = parts.shift();
		while (!name && part) {
			name = FontNameDB[part.trim().toLowerCase()];
			part = parts.shift();
		}
		return name;
	};
	ResolveUnitedNumber = function ResolveUnitedNumber(css_line_height_string) {

		//IE8 issues
		css_line_height_string = css_line_height_string === "auto" ? "0px" : css_line_height_string;
		if (css_line_height_string.indexOf("em") > -1 && !isNaN(Number(css_line_height_string.replace("em", "")))) {
			css_line_height_string = Number(css_line_height_string.replace("em", "")) * 18.719 + "px";
		}
		if (css_line_height_string.indexOf("pt") > -1 && !isNaN(Number(css_line_height_string.replace("pt", "")))) {
			css_line_height_string = Number(css_line_height_string.replace("pt", "")) * 1.333 + "px";
		}

		var normal, undef, value;
		undef = void 0;
		normal = 16.00;
		value = UnitedNumberMap[css_line_height_string];
		if (value) {
			return value;
		}
		value = {
			"xx-small": 9,
			"x-small": 11,
			small: 13,
			medium: 16,
			large: 19,
			"x-large": 23,
			"xx-large": 28,
			auto: 0
		}[{ css_line_height_string: css_line_height_string }];

		if (value !== undef) {
			return UnitedNumberMap[css_line_height_string] = value / normal;
		}
		if (value = parseFloat(css_line_height_string)) {
			return UnitedNumberMap[css_line_height_string] = value / normal;
		}
		value = css_line_height_string.match(/([\d\.]+)(px)/);
		if (value.length === 3) {
			return UnitedNumberMap[css_line_height_string] = parseFloat(value[1]) / normal;
		}
		return UnitedNumberMap[css_line_height_string] = 1;
	};
	GetCSS = function GetCSS(element) {
		var css, tmp, computedCSSElement;
		computedCSSElement = function (el) {
			var compCSS;
			compCSS = function (el) {
				if (document.defaultView && document.defaultView.getComputedStyle) {
					return document.defaultView.getComputedStyle(el, null);
				} else if (el.currentStyle) {
					return el.currentStyle;
				} else {
					return el.style;
				}
			}(el);
			return function (prop) {
				prop = prop.replace(/-\D/g, function (match) {
					return match.charAt(1).toUpperCase();
				});
				return compCSS[prop];
			};
		}(element);
		css = {};
		tmp = void 0;
		css["font-family"] = ResolveFont(computedCSSElement("font-family")) || "times";
		css["font-style"] = FontStyleMap[computedCSSElement("font-style")] || "normal";
		css["text-align"] = TextAlignMap[computedCSSElement("text-align")] || "left";
		tmp = FontWeightMap[computedCSSElement("font-weight")] || "normal";
		if (tmp === "bold") {
			if (css["font-style"] === "normal") {
				css["font-style"] = tmp;
			} else {
				css["font-style"] = tmp + css["font-style"];
			}
		}
		css["font-size"] = ResolveUnitedNumber(computedCSSElement("font-size")) || 1;
		css["line-height"] = ResolveUnitedNumber(computedCSSElement("line-height")) || 1;
		css["display"] = computedCSSElement("display") === "inline" ? "inline" : "block";

		tmp = css["display"] === "block";
		css["margin-top"] = tmp && ResolveUnitedNumber(computedCSSElement("margin-top")) || 0;
		css["margin-bottom"] = tmp && ResolveUnitedNumber(computedCSSElement("margin-bottom")) || 0;
		css["padding-top"] = tmp && ResolveUnitedNumber(computedCSSElement("padding-top")) || 0;
		css["padding-bottom"] = tmp && ResolveUnitedNumber(computedCSSElement("padding-bottom")) || 0;
		css["margin-left"] = tmp && ResolveUnitedNumber(computedCSSElement("margin-left")) || 0;
		css["margin-right"] = tmp && ResolveUnitedNumber(computedCSSElement("margin-right")) || 0;
		css["padding-left"] = tmp && ResolveUnitedNumber(computedCSSElement("padding-left")) || 0;
		css["padding-right"] = tmp && ResolveUnitedNumber(computedCSSElement("padding-right")) || 0;

		css["page-break-before"] = computedCSSElement("page-break-before") || "auto";

		//float and clearing of floats
		css["float"] = FloatMap[computedCSSElement("cssFloat")] || "none";
		css["clear"] = ClearMap[computedCSSElement("clear")] || "none";

		css["color"] = computedCSSElement("color");

		return css;
	};
	elementHandledElsewhere = function elementHandledElsewhere(element, renderer, elementHandlers) {
		var handlers, i, isHandledElsewhere, l, classNames;
		isHandledElsewhere = false;
		i = void 0;
		l = void 0;
		handlers = elementHandlers["#" + element.id];
		if (handlers) {
			if (typeof handlers === "function") {
				isHandledElsewhere = handlers(element, renderer);
			} else {
				i = 0;
				l = handlers.length;
				while (!isHandledElsewhere && i !== l) {
					isHandledElsewhere = handlers[i](element, renderer);
					i++;
				}
			}
		}
		handlers = elementHandlers[element.nodeName];
		if (!isHandledElsewhere && handlers) {
			if (typeof handlers === "function") {
				isHandledElsewhere = handlers(element, renderer);
			} else {
				i = 0;
				l = handlers.length;
				while (!isHandledElsewhere && i !== l) {
					isHandledElsewhere = handlers[i](element, renderer);
					i++;
				}
			}
		}

		// Try class names
		classNames = element.className ? element.className.split(' ') : [];
		for (i = 0; i < classNames.length; i++) {
			handlers = elementHandlers['.' + classNames[i]];
			if (!isHandledElsewhere && handlers) {
				if (typeof handlers === "function") {
					isHandledElsewhere = handlers(element, renderer);
				} else {
					i = 0;
					l = handlers.length;
					while (!isHandledElsewhere && i !== l) {
						isHandledElsewhere = handlers[i](element, renderer);
						i++;
					}
				}
			}
		}

		return isHandledElsewhere;
	};
	tableToJson = function tableToJson(table, renderer) {
		var data, headers, i, j, rowData, tableRow, table_obj, table_with, cell, l;
		data = [];
		headers = [];
		i = 0;
		l = table.rows[0].cells.length;
		table_with = table.clientWidth;
		while (i < l) {
			cell = table.rows[0].cells[i];
			headers[i] = {
				name: cell.textContent.toLowerCase().replace(/\s+/g, ''),
				prompt: cell.textContent.replace(/\r?\n/g, ''),
				width: cell.clientWidth / table_with * renderer.pdf.internal.pageSize.width
			};
			i++;
		}
		i = 1;
		while (i < table.rows.length) {
			tableRow = table.rows[i];
			rowData = {};
			j = 0;
			while (j < tableRow.cells.length) {
				rowData[headers[j].name] = tableRow.cells[j].textContent.replace(/\r?\n/g, '');
				j++;
			}
			data.push(rowData);
			i++;
		}
		return table_obj = {
			rows: data,
			headers: headers
		};
	};
	var SkipNode = {
		SCRIPT: 1,
		STYLE: 1,
		NOSCRIPT: 1,
		OBJECT: 1,
		EMBED: 1,
		SELECT: 1
	};
	var listCount = 1;
	_DrillForContent = function DrillForContent(element, renderer, elementHandlers) {
		var cn, cns, fragmentCSS, i, isBlock, l, px2pt, table2json, cb;
		cns = element.childNodes;
		cn = void 0;
		fragmentCSS = GetCSS(element);
		isBlock = fragmentCSS.display === "block";
		if (isBlock) {
			renderer.setBlockBoundary();
			renderer.setBlockStyle(fragmentCSS);
		}
		i = 0;
		l = cns.length;
		while (i < l) {
			cn = cns[i];
			if ((typeof cn === "undefined" ? "undefined" : _typeof(cn)) === "object") {

				//execute all watcher functions to e.g. reset floating
				renderer.executeWatchFunctions(cn);

				/*** HEADER rendering **/
				if (cn.nodeType === 1 && cn.nodeName === 'HEADER') {
					var header = cn;
					//store old top margin
					var oldMarginTop = renderer.pdf.margins_doc.top;
					//subscribe for new page event and render header first on every page
					renderer.pdf.internal.events.subscribe('addPage', function (pageInfo) {
						//set current y position to old margin
						renderer.y = oldMarginTop;
						//render all child nodes of the header element
						_DrillForContent(header, renderer, elementHandlers);
						//set margin to old margin + rendered header + 10 space to prevent overlapping
						//important for other plugins (e.g. table) to start rendering at correct position after header
						renderer.pdf.margins_doc.top = renderer.y + 10;
						renderer.y += 10;
					}, false);
				}

				if (cn.nodeType === 8 && cn.nodeName === "#comment") {
					if (~cn.textContent.indexOf("ADD_PAGE")) {
						renderer.pdf.addPage();
						renderer.y = renderer.pdf.margins_doc.top;
					}
				} else if (cn.nodeType === 1 && !SkipNode[cn.nodeName]) {
					/*** IMAGE RENDERING ***/
					var cached_image;
					if (cn.nodeName === "IMG") {
						var url = cn.getAttribute("src");
						cached_image = images[renderer.pdf.sHashCode(url) || url];
					}
					if (cached_image) {
						if (renderer.pdf.internal.pageSize.height - renderer.pdf.margins_doc.bottom < renderer.y + cn.height && renderer.y > renderer.pdf.margins_doc.top) {
							renderer.pdf.addPage();
							renderer.y = renderer.pdf.margins_doc.top;
							//check if we have to set back some values due to e.g. header rendering for new page
							renderer.executeWatchFunctions(cn);
						}

						var imagesCSS = GetCSS(cn);
						var imageX = renderer.x;
						var fontToUnitRatio = 12 / renderer.pdf.internal.scaleFactor;

						//define additional paddings, margins which have to be taken into account for margin calculations
						var additionalSpaceLeft = (imagesCSS["margin-left"] + imagesCSS["padding-left"]) * fontToUnitRatio;
						var additionalSpaceRight = (imagesCSS["margin-right"] + imagesCSS["padding-right"]) * fontToUnitRatio;
						var additionalSpaceTop = (imagesCSS["margin-top"] + imagesCSS["padding-top"]) * fontToUnitRatio;
						var additionalSpaceBottom = (imagesCSS["margin-bottom"] + imagesCSS["padding-bottom"]) * fontToUnitRatio;

						//if float is set to right, move the image to the right border
						//add space if margin is set
						if (imagesCSS['float'] !== undefined && imagesCSS['float'] === 'right') {
							imageX += renderer.settings.width - cn.width - additionalSpaceRight;
						} else {
							imageX += additionalSpaceLeft;
						}

						renderer.pdf.addImage(cached_image, imageX, renderer.y + additionalSpaceTop, cn.width, cn.height);
						cached_image = undefined;
						//if the float prop is specified we have to float the text around the image
						if (imagesCSS['float'] === 'right' || imagesCSS['float'] === 'left') {
							//add functiont to set back coordinates after image rendering
							renderer.watchFunctions.push(function (diffX, thresholdY, diffWidth, el) {
								//undo drawing box adaptions which were set by floating
								if (renderer.y >= thresholdY) {
									renderer.x += diffX;
									renderer.settings.width += diffWidth;
									return true;
								} else if (el && el.nodeType === 1 && !SkipNode[el.nodeName] && renderer.x + el.width > renderer.pdf.margins_doc.left + renderer.pdf.margins_doc.width) {
									renderer.x += diffX;
									renderer.y = thresholdY;
									renderer.settings.width += diffWidth;
									return true;
								} else {
									return false;
								}
							}.bind(this, imagesCSS['float'] === 'left' ? -cn.width - additionalSpaceLeft - additionalSpaceRight : 0, renderer.y + cn.height + additionalSpaceTop + additionalSpaceBottom, cn.width));
							//reset floating by clear:both divs
							//just set cursorY after the floating element
							renderer.watchFunctions.push(function (yPositionAfterFloating, pages, el) {
								if (renderer.y < yPositionAfterFloating && pages === renderer.pdf.internal.getNumberOfPages()) {
									if (el.nodeType === 1 && GetCSS(el).clear === 'both') {
										renderer.y = yPositionAfterFloating;
										return true;
									} else {
										return false;
									}
								} else {
									return true;
								}
							}.bind(this, renderer.y + cn.height, renderer.pdf.internal.getNumberOfPages()));

							//if floating is set we decrease the available width by the image width
							renderer.settings.width -= cn.width + additionalSpaceLeft + additionalSpaceRight;
							//if left just add the image width to the X coordinate
							if (imagesCSS['float'] === 'left') {
								renderer.x += cn.width + additionalSpaceLeft + additionalSpaceRight;
							}
						} else {
							//if no floating is set, move the rendering cursor after the image height
							renderer.y += cn.height + additionalSpaceTop + additionalSpaceBottom;
						}

						/*** TABLE RENDERING ***/
					} else if (cn.nodeName === "TABLE") {
						table2json = tableToJson(cn, renderer);
						renderer.y += 10;
						renderer.pdf.table(renderer.x, renderer.y, table2json.rows, table2json.headers, {
							autoSize: false,
							printHeaders: elementHandlers.printHeaders,
							margins: renderer.pdf.margins_doc,
							css: GetCSS(cn)
						});
						renderer.y = renderer.pdf.lastCellPos.y + renderer.pdf.lastCellPos.h + 20;
					} else if (cn.nodeName === "OL" || cn.nodeName === "UL") {
						listCount = 1;
						if (!elementHandledElsewhere(cn, renderer, elementHandlers)) {
							_DrillForContent(cn, renderer, elementHandlers);
						}
						renderer.y += 10;
					} else if (cn.nodeName === "LI") {
						var temp = renderer.x;
						renderer.x += 20 / renderer.pdf.internal.scaleFactor;
						renderer.y += 3;
						if (!elementHandledElsewhere(cn, renderer, elementHandlers)) {
							_DrillForContent(cn, renderer, elementHandlers);
						}
						renderer.x = temp;
					} else if (cn.nodeName === "BR") {
						renderer.y += fragmentCSS["font-size"] * renderer.pdf.internal.scaleFactor;
						renderer.addText("\u2028", clone(fragmentCSS));
					} else {
						if (!elementHandledElsewhere(cn, renderer, elementHandlers)) {
							_DrillForContent(cn, renderer, elementHandlers);
						}
					}
				} else if (cn.nodeType === 3) {
					var value = cn.nodeValue;
					if (cn.nodeValue && cn.parentNode.nodeName === "LI") {
						if (cn.parentNode.parentNode.nodeName === "OL") {
							value = listCount++ + '. ' + value;
						} else {
							var fontSize = fragmentCSS["font-size"];
							var offsetX = (3 - fontSize * 0.75) * renderer.pdf.internal.scaleFactor;
							var offsetY = fontSize * 0.75 * renderer.pdf.internal.scaleFactor;
							var radius = fontSize * 1.74 / renderer.pdf.internal.scaleFactor;
							cb = function cb(x, y) {
								this.pdf.circle(x + offsetX, y + offsetY, radius, 'FD');
							};
						}
					}
					// Only add the text if the text node is in the body element
					// Add compatibility with IE11
					if (!!(cn.ownerDocument.body.compareDocumentPosition(cn) & 16)) {
						renderer.addText(value, fragmentCSS);
					}
				} else if (typeof cn === "string") {
					renderer.addText(cn, fragmentCSS);
				}
			}
			i++;
		}
		elementHandlers.outY = renderer.y;

		if (isBlock) {
			return renderer.setBlockBoundary(cb);
		}
	};
	images = {};
	loadImgs = function loadImgs(element, renderer, elementHandlers, cb) {
		var imgs = element.getElementsByTagName('img'),
		    l = imgs.length,
		    found_images,
		    x = 0;
		function done() {
			renderer.pdf.internal.events.publish('imagesLoaded');
			cb(found_images);
		}
		function loadImage(url, width, height) {
			if (!url) return;
			var img = new Image();
			found_images = ++x;
			img.crossOrigin = '';
			img.onerror = img.onload = function () {
				if (img.complete) {
					//to support data urls in images, set width and height
					//as those values are not recognized automatically
					if (img.src.indexOf('data:image/') === 0) {
						img.width = width || img.width || 0;
						img.height = height || img.height || 0;
					}
					//if valid image add to known images array
					if (img.width + img.height) {
						var hash = renderer.pdf.sHashCode(url) || url;
						images[hash] = images[hash] || img;
					}
				}
				if (! --x) {
					done();
				}
			};
			img.src = url;
		}
		while (l--) {
			loadImage(imgs[l].getAttribute("src"), imgs[l].width, imgs[l].height);
		}return x || done();
	};
	checkForFooter = function checkForFooter(elem, renderer, elementHandlers) {
		//check if we can found a <footer> element
		var footer = elem.getElementsByTagName("footer");
		if (footer.length > 0) {

			footer = footer[0];

			//bad hack to get height of footer
			//creat dummy out and check new y after fake rendering
			var oldOut = renderer.pdf.internal.write;
			var oldY = renderer.y;
			renderer.pdf.internal.write = function () {};
			_DrillForContent(footer, renderer, elementHandlers);
			var footerHeight = Math.ceil(renderer.y - oldY) + 5;
			renderer.y = oldY;
			renderer.pdf.internal.write = oldOut;

			//add 20% to prevent overlapping
			renderer.pdf.margins_doc.bottom += footerHeight;

			//Create function render header on every page
			var renderFooter = function renderFooter(pageInfo) {
				var pageNumber = pageInfo !== undefined ? pageInfo.pageNumber : 1;
				//set current y position to old margin
				var oldPosition = renderer.y;
				//render all child nodes of the header element
				renderer.y = renderer.pdf.internal.pageSize.height - renderer.pdf.margins_doc.bottom;
				renderer.pdf.margins_doc.bottom -= footerHeight;

				//check if we have to add page numbers
				var spans = footer.getElementsByTagName('span');
				for (var i = 0; i < spans.length; ++i) {
					//if we find some span element with class pageCounter, set the page
					if ((" " + spans[i].className + " ").replace(/[\n\t]/g, " ").indexOf(" pageCounter ") > -1) {
						spans[i].innerHTML = pageNumber;
					}
					//if we find some span element with class totalPages, set a variable which is replaced after rendering of all pages
					if ((" " + spans[i].className + " ").replace(/[\n\t]/g, " ").indexOf(" totalPages ") > -1) {
						spans[i].innerHTML = '###jsPDFVarTotalPages###';
					}
				}

				//render footer content
				_DrillForContent(footer, renderer, elementHandlers);
				//set bottom margin to previous height including the footer height
				renderer.pdf.margins_doc.bottom += footerHeight;
				//important for other plugins (e.g. table) to start rendering at correct position after header
				renderer.y = oldPosition;
			};

			//check if footer contains totalPages which should be replace at the disoposal of the document
			var spans = footer.getElementsByTagName('span');
			for (var i = 0; i < spans.length; ++i) {
				if ((" " + spans[i].className + " ").replace(/[\n\t]/g, " ").indexOf(" totalPages ") > -1) {
					renderer.pdf.internal.events.subscribe('htmlRenderingFinished', renderer.pdf.putTotalPages.bind(renderer.pdf, '###jsPDFVarTotalPages###'), true);
				}
			}

			//register event to render footer on every new page
			renderer.pdf.internal.events.subscribe('addPage', renderFooter, false);
			//render footer on first page
			renderFooter();

			//prevent footer rendering
			SkipNode['FOOTER'] = 1;
		}
	};
	process = function process(pdf, element, x, y, settings, callback) {
		if (!element) return false;
		if (typeof element !== "string" && !element.parentNode) element = '' + element.innerHTML;
		if (typeof element === "string") {
			element = function (element) {
				var $frame, $hiddendiv, framename, visuallyhidden;
				framename = "jsPDFhtmlText" + Date.now().toString() + (Math.random() * 1000).toFixed(0);
				visuallyhidden = "position: absolute !important;" + "clip: rect(1px 1px 1px 1px); /* IE6, IE7 */" + "clip: rect(1px, 1px, 1px, 1px);" + "padding:0 !important;" + "border:0 !important;" + "height: 1px !important;" + "width: 1px !important; " + "top:auto;" + "left:-100px;" + "overflow: hidden;";
				$hiddendiv = document.createElement('div');
				$hiddendiv.style.cssText = visuallyhidden;
				$hiddendiv.innerHTML = "<iframe style=\"height:1px;width:1px\" name=\"" + framename + "\" />";
				document.body.appendChild($hiddendiv);
				$frame = window.frames[framename];
				$frame.document.open();
				$frame.document.writeln(element);
				$frame.document.close();
				return $frame.document.body;
			}(element.replace(/<\/?script[^>]*?>/gi, ''));
		}
		var r = new Renderer(pdf, x, y, settings),
		    out;

		// 1. load images
		// 2. prepare optional footer elements
		// 3. render content
		loadImgs.call(this, element, r, settings.elementHandlers, function (found_images) {
			checkForFooter(element, r, settings.elementHandlers);
			_DrillForContent(element, r, settings.elementHandlers);
			//send event dispose for final taks (e.g. footer totalpage replacement)
			r.pdf.internal.events.publish('htmlRenderingFinished');
			out = r.dispose();
			if (typeof callback === 'function') callback(out);else if (found_images) console.error('jsPDF Warning: rendering issues? provide a callback to fromHTML!');
		});
		return out || { x: r.x, y: r.y };
	};
	Renderer.prototype.init = function () {
		this.paragraph = {
			text: [],
			style: []
		};
		return this.pdf.internal.write("q");
	};
	Renderer.prototype.dispose = function () {
		this.pdf.internal.write("Q");
		return {
			x: this.x,
			y: this.y,
			ready: true
		};
	};

	//Checks if we have to execute some watcher functions
	//e.g. to end text floating around an image
	Renderer.prototype.executeWatchFunctions = function (el) {
		var ret = false;
		var narray = [];
		if (this.watchFunctions.length > 0) {
			for (var i = 0; i < this.watchFunctions.length; ++i) {
				if (this.watchFunctions[i](el) === true) {
					ret = true;
				} else {
					narray.push(this.watchFunctions[i]);
				}
			}
			this.watchFunctions = narray;
		}
		return ret;
	};

	Renderer.prototype.splitFragmentsIntoLines = function (fragments, styles) {
		var currentLineLength, defaultFontSize, ff, fontMetrics, fontMetricsCache, fragment, fragmentChopped, fragmentLength, fragmentSpecificMetrics, fs, k, line, lines, maxLineLength, style;
		defaultFontSize = 12;
		k = this.pdf.internal.scaleFactor;
		fontMetricsCache = {};
		ff = void 0;
		fs = void 0;
		fontMetrics = void 0;
		fragment = void 0;
		style = void 0;
		fragmentSpecificMetrics = void 0;
		fragmentLength = void 0;
		fragmentChopped = void 0;
		line = [];
		lines = [line];
		currentLineLength = 0;
		maxLineLength = this.settings.width;
		while (fragments.length) {
			fragment = fragments.shift();
			style = styles.shift();
			if (fragment) {
				ff = style["font-family"];
				fs = style["font-style"];
				fontMetrics = fontMetricsCache[ff + fs];
				if (!fontMetrics) {
					fontMetrics = this.pdf.internal.getFont(ff, fs).metadata.Unicode;
					fontMetricsCache[ff + fs] = fontMetrics;
				}
				fragmentSpecificMetrics = {
					widths: fontMetrics.widths,
					kerning: fontMetrics.kerning,
					fontSize: style["font-size"] * defaultFontSize,
					textIndent: currentLineLength
				};
				fragmentLength = this.pdf.getStringUnitWidth(fragment, fragmentSpecificMetrics) * fragmentSpecificMetrics.fontSize / k;
				if (fragment == "\u2028") {
					line = [];
					lines.push(line);
				} else if (currentLineLength + fragmentLength > maxLineLength) {
					fragmentChopped = this.pdf.splitTextToSize(fragment, maxLineLength, fragmentSpecificMetrics);
					line.push([fragmentChopped.shift(), style]);
					while (fragmentChopped.length) {
						line = [[fragmentChopped.shift(), style]];
						lines.push(line);
					}
					currentLineLength = this.pdf.getStringUnitWidth(line[0][0], fragmentSpecificMetrics) * fragmentSpecificMetrics.fontSize / k;
				} else {
					line.push([fragment, style]);
					currentLineLength += fragmentLength;
				}
			}
		}

		//if text alignment was set, set margin/indent of each line
		if (style['text-align'] !== undefined && (style['text-align'] === 'center' || style['text-align'] === 'right' || style['text-align'] === 'justify')) {
			for (var i = 0; i < lines.length; ++i) {
				var length = this.pdf.getStringUnitWidth(lines[i][0][0], fragmentSpecificMetrics) * fragmentSpecificMetrics.fontSize / k;
				//if there is more than on line we have to clone the style object as all lines hold a reference on this object
				if (i > 0) {
					lines[i][0][1] = clone(lines[i][0][1]);
				}
				var space = maxLineLength - length;

				if (style['text-align'] === 'right') {
					lines[i][0][1]['margin-left'] = space;
					//if alignment is not right, it has to be center so split the space to the left and the right
				} else if (style['text-align'] === 'center') {
					lines[i][0][1]['margin-left'] = space / 2;
					//if justify was set, calculate the word spacing and define in by using the css property
				} else if (style['text-align'] === 'justify') {
					var countSpaces = lines[i][0][0].split(' ').length - 1;
					lines[i][0][1]['word-spacing'] = space / countSpaces;
					//ignore the last line in justify mode
					if (i === lines.length - 1) {
						lines[i][0][1]['word-spacing'] = 0;
					}
				}
			}
		}

		return lines;
	};
	Renderer.prototype.RenderTextFragment = function (text, style) {
		var defaultFontSize, font, maxLineHeight;

		maxLineHeight = 0;
		defaultFontSize = 12;

		if (this.pdf.internal.pageSize.height - this.pdf.margins_doc.bottom < this.y + this.pdf.internal.getFontSize()) {
			this.pdf.internal.write("ET", "Q");
			this.pdf.addPage();
			this.y = this.pdf.margins_doc.top;
			this.pdf.internal.write("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), style.color, "Td");
			//move cursor by one line on new page
			maxLineHeight = Math.max(maxLineHeight, style["line-height"], style["font-size"]);
			this.pdf.internal.write(0, (-1 * defaultFontSize * maxLineHeight).toFixed(2), "Td");
		}

		font = this.pdf.internal.getFont(style["font-family"], style["font-style"]);

		// text color
		var pdfTextColor = this.getPdfColor(style["color"]);
		if (pdfTextColor !== this.lastTextColor) {
			this.pdf.internal.write(pdfTextColor);
			this.lastTextColor = pdfTextColor;
		}

		//set the word spacing for e.g. justify style
		if (style['word-spacing'] !== undefined && style['word-spacing'] > 0) {
			this.pdf.internal.write(style['word-spacing'].toFixed(2), "Tw");
		}

		this.pdf.internal.write("/" + font.id, (defaultFontSize * style["font-size"]).toFixed(2), "Tf", "(" + this.pdf.internal.pdfEscape(text) + ") Tj");

		//set the word spacing back to neutral => 0
		if (style['word-spacing'] !== undefined) {
			this.pdf.internal.write(0, "Tw");
		}
	};

	// Accepts #FFFFFF, rgb(int,int,int), or CSS Color Name
	Renderer.prototype.getPdfColor = function (style) {
		var textColor;
		var r, g, b;

		var rx = /rgb\s*\(\s*(\d+),\s*(\d+),\s*(\d+\s*)\)/;
		var m = rx.exec(style);
		if (m != null) {
			r = parseInt(m[1]);
			g = parseInt(m[2]);
			b = parseInt(m[3]);
		} else {
			if (style.charAt(0) != '#') {
				style = CssColors.colorNameToHex(style);
				if (!style) {
					style = '#000000';
				}
			}
			r = style.substring(1, 3);
			r = parseInt(r, 16);
			g = style.substring(3, 5);
			g = parseInt(g, 16);
			b = style.substring(5, 7);
			b = parseInt(b, 16);
		}

		if (typeof r === 'string' && /^#[0-9A-Fa-f]{6}$/.test(r)) {
			var hex = parseInt(r.substr(1), 16);
			r = hex >> 16 & 255;
			g = hex >> 8 & 255;
			b = hex & 255;
		}

		var f3 = this.f3;
		if (r === 0 && g === 0 && b === 0 || typeof g === 'undefined') {
			textColor = f3(r / 255) + ' g';
		} else {
			textColor = [f3(r / 255), f3(g / 255), f3(b / 255), 'rg'].join(' ');
		}
		return textColor;
	};

	Renderer.prototype.f3 = function (number) {
		return number.toFixed(3); // Ie, %.3f
	}, Renderer.prototype.renderParagraph = function (cb) {
		var blockstyle, defaultFontSize, fontToUnitRatio, fragments, i, l, line, lines, maxLineHeight, out, paragraphspacing_after, paragraphspacing_before, priorblockstyle, styles, fontSize;
		fragments = PurgeWhiteSpace(this.paragraph.text);
		styles = this.paragraph.style;
		blockstyle = this.paragraph.blockstyle;
		this.paragraph = {
			text: [],
			style: [],
			blockstyle: {},
			priorblockstyle: blockstyle
		};
		if (!fragments.join("").trim()) {
			return;
		}
		lines = this.splitFragmentsIntoLines(fragments, styles);
		line = void 0;
		maxLineHeight = void 0;
		defaultFontSize = 12;
		fontToUnitRatio = defaultFontSize / this.pdf.internal.scaleFactor;
		this.priorMarginBottom = this.priorMarginBottom || 0;
		paragraphspacing_before = (Math.max((blockstyle["margin-top"] || 0) - this.priorMarginBottom, 0) + (blockstyle["padding-top"] || 0)) * fontToUnitRatio;
		paragraphspacing_after = ((blockstyle["margin-bottom"] || 0) + (blockstyle["padding-bottom"] || 0)) * fontToUnitRatio;
		this.priorMarginBottom = blockstyle["margin-bottom"] || 0;

		if (blockstyle['page-break-before'] === 'always') {
			this.pdf.addPage();
			this.y = 0;
			paragraphspacing_before = ((blockstyle["margin-top"] || 0) + (blockstyle["padding-top"] || 0)) * fontToUnitRatio;
		}

		out = this.pdf.internal.write;
		i = void 0;
		l = void 0;
		this.y += paragraphspacing_before;
		out("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), "Td");

		//stores the current indent of cursor position
		var currentIndent = 0;

		while (lines.length) {
			line = lines.shift();
			maxLineHeight = 0;
			i = 0;
			l = line.length;
			while (i !== l) {
				if (line[i][0].trim()) {
					maxLineHeight = Math.max(maxLineHeight, line[i][1]["line-height"], line[i][1]["font-size"]);
					fontSize = line[i][1]["font-size"] * 7;
				}
				i++;
			}
			//if we have to move the cursor to adapt the indent
			var indentMove = 0;
			var wantedIndent = 0;
			//if a margin was added (by e.g. a text-alignment), move the cursor
			if (line[0][1]["margin-left"] !== undefined && line[0][1]["margin-left"] > 0) {
				wantedIndent = this.pdf.internal.getCoordinateString(line[0][1]["margin-left"]);
				indentMove = wantedIndent - currentIndent;
				currentIndent = wantedIndent;
			}
			var indentMore = Math.max(blockstyle["margin-left"] || 0, 0) * fontToUnitRatio;
			//move the cursor
			out(indentMove + indentMore, (-1 * defaultFontSize * maxLineHeight).toFixed(2), "Td");
			i = 0;
			l = line.length;
			while (i !== l) {
				if (line[i][0]) {
					this.RenderTextFragment(line[i][0], line[i][1]);
				}
				i++;
			}
			this.y += maxLineHeight * fontToUnitRatio;

			//if some watcher function was executed successful, so e.g. margin and widths were changed,
			//reset line drawing and calculate position and lines again
			//e.g. to stop text floating around an image
			if (this.executeWatchFunctions(line[0][1]) && lines.length > 0) {
				var localFragments = [];
				var localStyles = [];
				//create fragment array of
				lines.forEach(function (localLine) {
					var i = 0;
					var l = localLine.length;
					while (i !== l) {
						if (localLine[i][0]) {
							localFragments.push(localLine[i][0] + ' ');
							localStyles.push(localLine[i][1]);
						}
						++i;
					}
				});
				//split lines again due to possible coordinate changes
				lines = this.splitFragmentsIntoLines(PurgeWhiteSpace(localFragments), localStyles);
				//reposition the current cursor
				out("ET", "Q");
				out("q", "BT 0 g", this.pdf.internal.getCoordinateString(this.x), this.pdf.internal.getVerticalCoordinateString(this.y), "Td");
			}
		}
		if (cb && typeof cb === "function") {
			cb.call(this, this.x - 9, this.y - fontSize / 2);
		}
		out("ET", "Q");
		return this.y += paragraphspacing_after;
	};
	Renderer.prototype.setBlockBoundary = function (cb) {
		return this.renderParagraph(cb);
	};
	Renderer.prototype.setBlockStyle = function (css) {
		return this.paragraph.blockstyle = css;
	};
	Renderer.prototype.addText = function (text, css) {
		this.paragraph.text.push(text);
		return this.paragraph.style.push(css);
	};
	FontNameDB = {
		helvetica: "helvetica",
		"sans-serif": "helvetica",
		"times new roman": "times",
		serif: "times",
		times: "times",
		monospace: "courier",
		courier: "courier"
	};
	FontWeightMap = {
		100: "normal",
		200: "normal",
		300: "normal",
		400: "normal",
		500: "bold",
		600: "bold",
		700: "bold",
		800: "bold",
		900: "bold",
		normal: "normal",
		bold: "bold",
		bolder: "bold",
		lighter: "normal"
	};
	FontStyleMap = {
		normal: "normal",
		italic: "italic",
		oblique: "italic"
	};
	TextAlignMap = {
		left: "left",
		right: "right",
		center: "center",
		justify: "justify"
	};
	FloatMap = {
		none: 'none',
		right: 'right',
		left: 'left'
	};
	ClearMap = {
		none: 'none',
		both: 'both'
	};
	UnitedNumberMap = {
		normal: 1
	};
	/**
  * Converts HTML-formatted text into formatted PDF text.
  *
  * Notes:
  * 2012-07-18
  * Plugin relies on having browser, DOM around. The HTML is pushed into dom and traversed.
  * Plugin relies on jQuery for CSS extraction.
  * Targeting HTML output from Markdown templating, which is a very simple
  * markup - div, span, em, strong, p. No br-based paragraph separation supported explicitly (but still may work.)
  * Images, tables are NOT supported.
  *
  * @public
  * @function
  * @param HTML {String or DOM Element} HTML-formatted text, or pointer to DOM element that is to be rendered into PDF.
  * @param x {Number} starting X coordinate in jsPDF instance's declared units.
  * @param y {Number} starting Y coordinate in jsPDF instance's declared units.
  * @param settings {Object} Additional / optional variables controlling parsing, rendering.
  * @returns {Object} jsPDF instance
  */
	jsPDFAPI.fromHTML = function (HTML, x, y, settings, callback, margins) {
		"use strict";

		this.margins_doc = margins || {
			top: 0,
			bottom: 0
		};
		if (!settings) settings = {};
		if (!settings.elementHandlers) settings.elementHandlers = {};

		return process(this, HTML, isNaN(x) ? 4 : x, isNaN(y) ? 4 : y, settings, callback);
	};
})(jsPDF.API);

/** ==================================================================== 
 * jsPDF JavaScript plugin
 * Copyright (c) 2013 Youssef Beddad, youssef.beddad@gmail.com
 * 
 * 
 * ====================================================================
 */

/*global jsPDF */

(function (jsPDFAPI) {
    'use strict';

    var jsNamesObj, jsJsObj, text;
    jsPDFAPI.addJS = function (txt) {
        text = txt;
        this.internal.events.subscribe('postPutResources', function (txt) {
            jsNamesObj = this.internal.newObject();
            this.internal.write('<< /Names [(EmbeddedJS) ' + (jsNamesObj + 1) + ' 0 R] >>', 'endobj');
            jsJsObj = this.internal.newObject();
            this.internal.write('<< /S /JavaScript /JS (', text, ') >>', 'endobj');
        });
        this.internal.events.subscribe('putCatalog', function () {
            if (jsNamesObj !== undefined && jsJsObj !== undefined) {
                this.internal.write('/Names <</JavaScript ' + jsNamesObj + ' 0 R>>');
            }
        });
        return this;
    };
})(jsPDF.API);

/**
 * jsPDF Outline PlugIn
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * Generates a PDF Outline
 */

(function (jsPDFAPI) {
	'use strict';

	jsPDFAPI.events.push(['postPutResources', function () {
		var pdf = this;
		var rx = /^(\d+) 0 obj$/;

		// Write action goto objects for each page
		// this.outline.destsGoto = [];
		// for (var i = 0; i < totalPages; i++) {
		// var id = pdf.internal.newObject();
		// this.outline.destsGoto.push(id);
		// pdf.internal.write("<</D[" + (i * 2 + 3) + " 0 R /XYZ null
		// null null]/S/GoTo>> endobj");
		// }
		//
		// for (var i = 0; i < dests.length; i++) {
		// pdf.internal.write("(page_" + (i + 1) + ")" + dests[i] + " 0
		// R");
		// }
		//				
		if (this.outline.root.children.length > 0) {
			var lines = pdf.outline.render().split(/\r\n/);
			for (var i = 0; i < lines.length; i++) {
				var line = lines[i];
				var m = rx.exec(line);
				if (m != null) {
					var oid = m[1];
					pdf.internal.newObjectDeferredBegin(oid);
				}
				pdf.internal.write(line);
			}
		}

		// This code will write named destination for each page reference
		// (page_1, etc)
		if (this.outline.createNamedDestinations) {
			var totalPages = this.internal.pages.length;
			// WARNING: this assumes jsPDF starts on page 3 and pageIDs
			// follow 5, 7, 9, etc
			// Write destination objects for each page
			var dests = [];
			for (var i = 0; i < totalPages; i++) {
				var id = pdf.internal.newObject();
				dests.push(id);
				var info = pdf.internal.getPageInfo(i + 1);
				pdf.internal.write("<< /D[" + info.objId + " 0 R /XYZ null null null]>> endobj");
			}

			// assign a name for each destination
			var names2Oid = pdf.internal.newObject();
			pdf.internal.write('<< /Names [ ');
			for (var i = 0; i < dests.length; i++) {
				pdf.internal.write("(page_" + (i + 1) + ")" + dests[i] + " 0 R");
			}
			pdf.internal.write(' ] >>', 'endobj');

			// var kids = pdf.internal.newObject();
			// pdf.internal.write('<< /Kids [ ' + names2Oid + ' 0 R');
			// pdf.internal.write(' ] >>', 'endobj');

			var namesOid = pdf.internal.newObject();
			pdf.internal.write('<< /Dests ' + names2Oid + " 0 R");
			pdf.internal.write('>>', 'endobj');
		}
	}]);

	jsPDFAPI.events.push(['putCatalog', function () {
		var pdf = this;
		if (pdf.outline.root.children.length > 0) {
			pdf.internal.write("/Outlines", this.outline.makeRef(this.outline.root));
			if (this.outline.createNamedDestinations) {
				pdf.internal.write("/Names " + namesOid + " 0 R");
			}
			// Open with Bookmarks showing
			// pdf.internal.write("/PageMode /UseOutlines");
		}
	}]);

	jsPDFAPI.events.push(['initialized', function () {
		var pdf = this;

		pdf.outline = {
			createNamedDestinations: false,
			root: {
				children: []
			}
		};

		pdf.outline.add = function (parent, title, options) {
			var item = {
				title: title,
				options: options,
				children: []
			};
			if (parent == null) {
				parent = this.root;
			}
			parent.children.push(item);
			return item;
		};

		pdf.outline.render = function () {
			this.ctx = {};
			this.ctx.val = '';
			this.ctx.pdf = pdf;

			this.genIds_r(this.root);
			this.renderRoot(this.root);
			this.renderItems(this.root);

			return this.ctx.val;
		};

		pdf.outline.genIds_r = function (node) {
			node.id = pdf.internal.newObjectDeferred();
			for (var i = 0; i < node.children.length; i++) {
				this.genIds_r(node.children[i]);
			}
		};

		pdf.outline.renderRoot = function (node) {
			this.objStart(node);
			this.line('/Type /Outlines');
			if (node.children.length > 0) {
				this.line('/First ' + this.makeRef(node.children[0]));
				this.line('/Last ' + this.makeRef(node.children[node.children.length - 1]));
			}
			this.line('/Count ' + this.count_r({
				count: 0
			}, node));
			this.objEnd();
		};

		pdf.outline.renderItems = function (node) {
			for (var i = 0; i < node.children.length; i++) {
				var item = node.children[i];
				this.objStart(item);

				this.line('/Title ' + this.makeString(item.title));

				this.line('/Parent ' + this.makeRef(node));
				if (i > 0) {
					this.line('/Prev ' + this.makeRef(node.children[i - 1]));
				}
				if (i < node.children.length - 1) {
					this.line('/Next ' + this.makeRef(node.children[i + 1]));
				}
				if (item.children.length > 0) {
					this.line('/First ' + this.makeRef(item.children[0]));
					this.line('/Last ' + this.makeRef(item.children[item.children.length - 1]));
				}

				var count = this.count = this.count_r({
					count: 0
				}, item);
				if (count > 0) {
					this.line('/Count ' + count);
				}

				if (item.options) {
					if (item.options.pageNumber) {
						// Explicit Destination
						//WARNING this assumes page ids are 3,5,7, etc.
						var info = pdf.internal.getPageInfo(item.options.pageNumber);
						this.line('/Dest ' + '[' + info.objId + ' 0 R /XYZ 0 ' + this.ctx.pdf.internal.pageSize.height + ' 0]');
						// this line does not work on all clients (pageNumber instead of page ref)
						//this.line('/Dest ' + '[' + (item.options.pageNumber - 1) + ' /XYZ 0 ' + this.ctx.pdf.internal.pageSize.height + ' 0]');

						// Named Destination
						// this.line('/Dest (page_' + (item.options.pageNumber) + ')');

						// Action Destination
						// var id = pdf.internal.newObject();
						// pdf.internal.write('<</D[' + (item.options.pageNumber - 1) + ' /XYZ null null null]/S/GoTo>> endobj');
						// this.line('/A ' + id + ' 0 R' );
					}
				}
				this.objEnd();
			}
			for (var i = 0; i < node.children.length; i++) {
				var item = node.children[i];
				this.renderItems(item);
			}
		};

		pdf.outline.line = function (text) {
			this.ctx.val += text + '\r\n';
		};

		pdf.outline.makeRef = function (node) {
			return node.id + ' 0 R';
		};

		pdf.outline.makeString = function (val) {
			return '(' + pdf.internal.pdfEscape(val) + ')';
		};

		pdf.outline.objStart = function (node) {
			this.ctx.val += '\r\n' + node.id + ' 0 obj' + '\r\n<<\r\n';
		};

		pdf.outline.objEnd = function (node) {
			this.ctx.val += '>> \r\n' + 'endobj' + '\r\n';
		};

		pdf.outline.count_r = function (ctx, node) {
			for (var i = 0; i < node.children.length; i++) {
				ctx.count++;
				this.count_r(ctx, node.children[i]);
			}
			return ctx.count;
		};
	}]);

	return this;
})(jsPDF.API);

/**@preserve
 *  ====================================================================
 * jsPDF PNG PlugIn
 * Copyright (c) 2014 James Robb, https://github.com/jamesbrobb
 *
 * 
 * ====================================================================
 */

(function (jsPDFAPI) {
	'use strict';

	/*
  * @see http://www.w3.org/TR/PNG-Chunks.html
  *
  Color    Allowed      Interpretation
  Type     Bit Depths
 
    0       1,2,4,8,16  Each pixel is a grayscale sample.
 
    2       8,16        Each pixel is an R,G,B triple.
 
    3       1,2,4,8     Each pixel is a palette index;
                        a PLTE chunk must appear.
 
    4       8,16        Each pixel is a grayscale sample,
                        followed by an alpha sample.
 
    6       8,16        Each pixel is an R,G,B triple,
                        followed by an alpha sample.
 */

	/*
  * PNG filter method types
  *
  * @see http://www.w3.org/TR/PNG-Filters.html
  * @see http://www.libpng.org/pub/png/book/chapter09.html
  *
  * This is what the value 'Predictor' in decode params relates to
  *
  * 15 is "optimal prediction", which means the prediction algorithm can change from line to line.
  * In that case, you actually have to read the first byte off each line for the prediction algorthim (which should be 0-4, corresponding to PDF 10-14) and select the appropriate unprediction algorithm based on that byte.
  *
    0       None
    1       Sub
    2       Up
    3       Average
    4       Paeth
  */

	var doesNotHavePngJS = function doesNotHavePngJS() {
		return typeof PNG !== 'function' || typeof FlateStream !== 'function';
	},
	    canCompress = function canCompress(value) {
		return value !== jsPDFAPI.image_compression.NONE && hasCompressionJS();
	},
	    hasCompressionJS = function hasCompressionJS() {
		var inst = typeof Deflater === 'function';
		if (!inst) throw new Error("requires deflate.js for compression");
		return inst;
	},
	    compressBytes = function compressBytes(bytes, lineLength, colorsPerPixel, compression) {

		var level = 5,
		    filter_method = filterUp;

		switch (compression) {

			case jsPDFAPI.image_compression.FAST:

				level = 3;
				filter_method = filterSub;
				break;

			case jsPDFAPI.image_compression.MEDIUM:

				level = 6;
				filter_method = filterAverage;
				break;

			case jsPDFAPI.image_compression.SLOW:

				level = 9;
				filter_method = filterPaeth; //uses to sum to choose best filter for each line
				break;
		}

		bytes = applyPngFilterMethod(bytes, lineLength, colorsPerPixel, filter_method);

		var header = new Uint8Array(createZlibHeader(level));
		var checksum = adler32(bytes);

		var deflate = new Deflater(level);
		var a = deflate.append(bytes);
		var cBytes = deflate.flush();

		var len = header.length + a.length + cBytes.length;

		var cmpd = new Uint8Array(len + 4);
		cmpd.set(header);
		cmpd.set(a, header.length);
		cmpd.set(cBytes, header.length + a.length);

		cmpd[len++] = checksum >>> 24 & 0xff;
		cmpd[len++] = checksum >>> 16 & 0xff;
		cmpd[len++] = checksum >>> 8 & 0xff;
		cmpd[len++] = checksum & 0xff;

		return jsPDFAPI.arrayBufferToBinaryString(cmpd);
	},
	    createZlibHeader = function createZlibHeader(bytes, level) {
		/*
   * @see http://www.ietf.org/rfc/rfc1950.txt for zlib header
   */
		var cm = 8;
		var cinfo = Math.LOG2E * Math.log(0x8000) - 8;
		var cmf = cinfo << 4 | cm;

		var hdr = cmf << 8;
		var flevel = Math.min(3, (level - 1 & 0xff) >> 1);

		hdr |= flevel << 6;
		hdr |= 0; //FDICT
		hdr += 31 - hdr % 31;

		return [cmf, hdr & 0xff & 0xff];
	},
	    adler32 = function adler32(array, param) {
		var adler = 1;
		var s1 = adler & 0xffff,
		    s2 = adler >>> 16 & 0xffff;
		var len = array.length;
		var tlen;
		var i = 0;

		while (len > 0) {
			tlen = len > param ? param : len;
			len -= tlen;
			do {
				s1 += array[i++];
				s2 += s1;
			} while (--tlen);

			s1 %= 65521;
			s2 %= 65521;
		}

		return (s2 << 16 | s1) >>> 0;
	},
	    applyPngFilterMethod = function applyPngFilterMethod(bytes, lineLength, colorsPerPixel, filter_method) {
		var lines = bytes.length / lineLength,
		    result = new Uint8Array(bytes.length + lines),
		    filter_methods = getFilterMethods(),
		    i = 0,
		    line,
		    prevLine,
		    offset;

		for (; i < lines; i++) {
			offset = i * lineLength;
			line = bytes.subarray(offset, offset + lineLength);

			if (filter_method) {
				result.set(filter_method(line, colorsPerPixel, prevLine), offset + i);
			} else {

				var j = 0,
				    len = filter_methods.length,
				    results = [];

				for (; j < len; j++) {
					results[j] = filter_methods[j](line, colorsPerPixel, prevLine);
				}var ind = getIndexOfSmallestSum(results.concat());

				result.set(results[ind], offset + i);
			}

			prevLine = line;
		}

		return result;
	},
	    filterNone = function filterNone(line, colorsPerPixel, prevLine) {
		/*var result = new Uint8Array(line.length + 1);
  result[0] = 0;
  result.set(line, 1);*/

		var result = Array.apply([], line);
		result.unshift(0);

		return result;
	},
	    filterSub = function filterSub(line, colorsPerPixel, prevLine) {
		var result = [],
		    i = 0,
		    len = line.length,
		    left;

		result[0] = 1;

		for (; i < len; i++) {
			left = line[i - colorsPerPixel] || 0;
			result[i + 1] = line[i] - left + 0x0100 & 0xff;
		}

		return result;
	},
	    filterUp = function filterUp(line, colorsPerPixel, prevLine) {
		var result = [],
		    i = 0,
		    len = line.length,
		    up;

		result[0] = 2;

		for (; i < len; i++) {
			up = prevLine && prevLine[i] || 0;
			result[i + 1] = line[i] - up + 0x0100 & 0xff;
		}

		return result;
	},
	    filterAverage = function filterAverage(line, colorsPerPixel, prevLine) {
		var result = [],
		    i = 0,
		    len = line.length,
		    left,
		    up;

		result[0] = 3;

		for (; i < len; i++) {
			left = line[i - colorsPerPixel] || 0;
			up = prevLine && prevLine[i] || 0;
			result[i + 1] = line[i] + 0x0100 - (left + up >>> 1) & 0xff;
		}

		return result;
	},
	    filterPaeth = function filterPaeth(line, colorsPerPixel, prevLine) {
		var result = [],
		    i = 0,
		    len = line.length,
		    left,
		    up,
		    upLeft,
		    paeth;

		result[0] = 4;

		for (; i < len; i++) {
			left = line[i - colorsPerPixel] || 0;
			up = prevLine && prevLine[i] || 0;
			upLeft = prevLine && prevLine[i - colorsPerPixel] || 0;
			paeth = paethPredictor(left, up, upLeft);
			result[i + 1] = line[i] - paeth + 0x0100 & 0xff;
		}

		return result;
	},
	    paethPredictor = function paethPredictor(left, up, upLeft) {

		var p = left + up - upLeft,
		    pLeft = Math.abs(p - left),
		    pUp = Math.abs(p - up),
		    pUpLeft = Math.abs(p - upLeft);

		return pLeft <= pUp && pLeft <= pUpLeft ? left : pUp <= pUpLeft ? up : upLeft;
	},
	    getFilterMethods = function getFilterMethods() {
		return [filterNone, filterSub, filterUp, filterAverage, filterPaeth];
	},
	    getIndexOfSmallestSum = function getIndexOfSmallestSum(arrays) {
		var i = 0,
		    len = arrays.length,
		    sum,
		    min,
		    ind;

		while (i < len) {
			sum = absSum(arrays[i].slice(1));

			if (sum < min || !min) {
				min = sum;
				ind = i;
			}

			i++;
		}

		return ind;
	},
	    absSum = function absSum(array) {
		var i = 0,
		    len = array.length,
		    sum = 0;

		while (i < len) {
			sum += Math.abs(array[i++]);
		}return sum;
	},
	    getPredictorFromCompression = function getPredictorFromCompression(compression) {
		var predictor;
		switch (compression) {
			case jsPDFAPI.image_compression.FAST:
				predictor = 11;
				break;

			case jsPDFAPI.image_compression.MEDIUM:
				predictor = 13;
				break;

			case jsPDFAPI.image_compression.SLOW:
				predictor = 14;
				break;

			default:
				predictor = 12;
				break;
		}
		return predictor;
	};

	jsPDFAPI.processPNG = function (imageData, imageIndex, alias, compression, dataAsBinaryString) {
		'use strict';

		var colorSpace = this.color_spaces.DEVICE_RGB,
		    decode = this.decode.FLATE_DECODE,
		    bpc = 8,
		    img,
		    dp,
		    trns,
		    colors,
		    pal,
		    smask;

		/*	if(this.isString(imageData)) {
  
  	}*/

		if (this.isArrayBuffer(imageData)) imageData = new Uint8Array(imageData);

		if (this.isArrayBufferView(imageData)) {

			if (doesNotHavePngJS()) throw new Error("PNG support requires png.js and zlib.js");

			img = new PNG(imageData);
			imageData = img.imgData;
			bpc = img.bits;
			colorSpace = img.colorSpace;
			colors = img.colors;

			//logImg(img);

			/*
    * colorType 6 - Each pixel is an R,G,B triple, followed by an alpha sample.
    *
    * colorType 4 - Each pixel is a grayscale sample, followed by an alpha sample.
    *
    * Extract alpha to create two separate images, using the alpha as a sMask
    */
			if ([4, 6].indexOf(img.colorType) !== -1) {

				/*
     * processes 8 bit RGBA and grayscale + alpha images
     */
				if (img.bits === 8) {

					var pixels = img.pixelBitlength == 32 ? new Uint32Array(img.decodePixels().buffer) : img.pixelBitlength == 16 ? new Uint16Array(img.decodePixels().buffer) : new Uint8Array(img.decodePixels().buffer),
					    len = pixels.length,
					    imgData = new Uint8Array(len * img.colors),
					    alphaData = new Uint8Array(len),
					    pDiff = img.pixelBitlength - img.bits,
					    i = 0,
					    n = 0,
					    pixel,
					    pbl;

					for (; i < len; i++) {
						pixel = pixels[i];
						pbl = 0;

						while (pbl < pDiff) {

							imgData[n++] = pixel >>> pbl & 0xff;
							pbl = pbl + img.bits;
						}

						alphaData[i] = pixel >>> pbl & 0xff;
					}
				}

				/*
     * processes 16 bit RGBA and grayscale + alpha images
     */
				if (img.bits === 16) {

					var pixels = new Uint32Array(img.decodePixels().buffer),
					    len = pixels.length,
					    imgData = new Uint8Array(len * (32 / img.pixelBitlength) * img.colors),
					    alphaData = new Uint8Array(len * (32 / img.pixelBitlength)),
					    hasColors = img.colors > 1,
					    i = 0,
					    n = 0,
					    a = 0,
					    pixel;

					while (i < len) {
						pixel = pixels[i++];

						imgData[n++] = pixel >>> 0 & 0xFF;

						if (hasColors) {
							imgData[n++] = pixel >>> 16 & 0xFF;

							pixel = pixels[i++];
							imgData[n++] = pixel >>> 0 & 0xFF;
						}

						alphaData[a++] = pixel >>> 16 & 0xFF;
					}

					bpc = 8;
				}

				if (canCompress(compression)) {

					imageData = compressBytes(imgData, img.width * img.colors, img.colors, compression);
					smask = compressBytes(alphaData, img.width, 1, compression);
				} else {

					imageData = imgData;
					smask = alphaData;
					decode = null;
				}
			}

			/*
    * Indexed png. Each pixel is a palette index.
    */
			if (img.colorType === 3) {

				colorSpace = this.color_spaces.INDEXED;
				pal = img.palette;

				if (img.transparency.indexed) {

					var trans = img.transparency.indexed;

					var total = 0,
					    i = 0,
					    len = trans.length;

					for (; i < len; ++i) {
						total += trans[i];
					}total = total / 255;

					/*
      * a single color is specified as 100% transparent (0),
      * so we set trns to use a /Mask with that index
      */
					if (total === len - 1 && trans.indexOf(0) !== -1) {
						trns = [trans.indexOf(0)];

						/*
       * there's more than one colour within the palette that specifies
       * a transparency value less than 255, so we unroll the pixels to create an image sMask
       */
					} else if (total !== len) {

						var pixels = img.decodePixels(),
						    alphaData = new Uint8Array(pixels.length),
						    i = 0,
						    len = pixels.length;

						for (; i < len; i++) {
							alphaData[i] = trans[pixels[i]];
						}smask = compressBytes(alphaData, img.width, 1);
					}
				}
			}

			var predictor = getPredictorFromCompression(compression);

			if (decode === this.decode.FLATE_DECODE) dp = '/Predictor ' + predictor + ' /Colors ' + colors + ' /BitsPerComponent ' + bpc + ' /Columns ' + img.width;else
				//remove 'Predictor' as it applies to the type of png filter applied to its IDAT - we only apply with compression
				dp = '/Colors ' + colors + ' /BitsPerComponent ' + bpc + ' /Columns ' + img.width;

			if (this.isArrayBuffer(imageData) || this.isArrayBufferView(imageData)) imageData = this.arrayBufferToBinaryString(imageData);

			if (smask && this.isArrayBuffer(smask) || this.isArrayBufferView(smask)) smask = this.arrayBufferToBinaryString(smask);

			return this.createImageInfo(imageData, img.width, img.height, colorSpace, bpc, decode, imageIndex, alias, dp, trns, pal, smask, predictor);
		}

		throw new Error("Unsupported PNG image data, try using JPEG instead.");
	};
})(jsPDF.API);

/**
 * jsPDF Autoprint Plugin
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

(function (jsPDFAPI) {
  'use strict';

  jsPDFAPI.autoPrint = function () {
    'use strict';

    var refAutoPrintTag;

    this.internal.events.subscribe('postPutResources', function () {
      refAutoPrintTag = this.internal.newObject();
      this.internal.write("<< /S/Named /Type/Action /N/Print >>", "endobj");
    });

    this.internal.events.subscribe("putCatalog", function () {
      this.internal.write("/OpenAction " + refAutoPrintTag + " 0" + " R");
    });
    return this;
  };
})(jsPDF.API);

/** @preserve
 * jsPDF split_text_to_size plugin - MIT license.
 * Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
 *               2014 Diego Casorran, https://github.com/diegocr
 */
/**
 * 
 * ====================================================================
 */

(function (API) {
	'use strict';

	/**
 Returns an array of length matching length of the 'word' string, with each
 cell ocupied by the width of the char in that position.
 
 @function
 @param word {String}
 @param widths {Object}
 @param kerning {Object}
 @returns {Array}
 */

	var getCharWidthsArray = API.getCharWidthsArray = function (text, options) {

		if (!options) {
			options = {};
		}

		var isMetadata = Object.keys(this.internal.getFont().metadata).length !== 0 ? true : false;
		var l = text.length;
		var output = [];
		var i;

		if (this.internal.getFont().id.slice(1) >= 14 && isMetadata) {
			var fontSize = this.internal.getFontSize();
			var charSpace = this.internal.getCharSpace();
			for (i = 0; i < l; i++) {
				output.push(this.internal.getFont().metadata.widthOfString(text[i], fontSize, charSpace) / fontSize);
			}
		} else {
			var widths = options.widths ? options.widths : this.internal.getFont().metadata.Unicode.widths;
			var widthsFractionOf = widths.fof ? widths.fof : 1;
			var kerning = options.kerning ? options.kerning : this.internal.getFont().metadata.Unicode.kerning;
			var kerningFractionOf = kerning.fof ? kerning.fof : 1;

			var char_code = 0;
			var prior_char_code = 0; // for kerning
			var default_char_width = widths[0] || widthsFractionOf;

			for (i = 0; i < l; i++) {
				char_code = text.charCodeAt(i);
				output.push((widths[char_code] || default_char_width) / widthsFractionOf + (kerning[char_code] && kerning[char_code][prior_char_code] || 0) / kerningFractionOf);
				prior_char_code = char_code;
			}
		}

		return output;
	};
	var getArraySum = function getArraySum(array) {
		var i = array.length,
		    output = 0;
		while (i) {
			i--;
			output += array[i];
		}
		return output;
	};
	/**
 Returns a widths of string in a given font, if the font size is set as 1 point.
 
 In other words, this is "proportional" value. For 1 unit of font size, the length
 of the string will be that much.
 
 Multiply by font size to get actual width in *points*
 Then divide by 72 to get inches or divide by (72/25.6) to get 'mm' etc.
 
 @public
 @function
 @param
 @returns {Type}
 */
	var getStringUnitWidth = API.getStringUnitWidth = function (text, options) {
		return getArraySum(getCharWidthsArray.call(this, text, options));
	};

	/**
 returns array of lines
 */
	var splitLongWord = function splitLongWord(word, widths_array, firstLineMaxLen, maxLen) {
		var answer = [];

		// 1st, chop off the piece that can fit on the hanging line.
		var i = 0,
		    l = word.length,
		    workingLen = 0;
		while (i !== l && workingLen + widths_array[i] < firstLineMaxLen) {
			workingLen += widths_array[i];
			i++;
		}
		// this is first line.
		answer.push(word.slice(0, i));

		// 2nd. Split the rest into maxLen pieces.
		var startOfLine = i;
		workingLen = 0;
		while (i !== l) {
			if (workingLen + widths_array[i] > maxLen) {
				answer.push(word.slice(startOfLine, i));
				workingLen = 0;
				startOfLine = i;
			}
			workingLen += widths_array[i];
			i++;
		}
		if (startOfLine !== i) {
			answer.push(word.slice(startOfLine, i));
		}

		return answer;
	};

	// Note, all sizing inputs for this function must be in "font measurement units"
	// By default, for PDF, it's "point".
	var splitParagraphIntoLines = function splitParagraphIntoLines(text, maxlen, options) {
		// at this time works only on Western scripts, ones with space char
		// separating the words. Feel free to expand.

		if (!options) {
			options = {};
		}

		var line = [],
		    lines = [line],
		    line_length = options.textIndent || 0,
		    separator_length = 0,
		    current_word_length = 0,
		    word,
		    widths_array,
		    words = text.split(' '),
		    spaceCharWidth = getCharWidthsArray.call(this, ' ', options)[0],
		    i,
		    l,
		    tmp,
		    lineIndent,
		    postProcess;

		if (options.lineIndent === -1) {
			lineIndent = words[0].length + 2;
		} else {
			lineIndent = options.lineIndent || 0;
		}
		if (lineIndent) {
			var pad = Array(lineIndent).join(" "),
			    wrds = [];
			words.map(function (wrd) {
				wrd = wrd.split(/\s*\n/);
				if (wrd.length > 1) {
					wrds = wrds.concat(wrd.map(function (wrd, idx) {
						return (idx && wrd.length ? "\n" : "") + wrd;
					}));
				} else {
					wrds.push(wrd[0]);
				}
			});
			words = wrds;
			lineIndent = getStringUnitWidth(pad, options);
		}

		for (i = 0, l = words.length; i < l; i++) {
			var force = 0;

			word = words[i];
			if (lineIndent && word[0] === "\n") {
				word = word.substr(1);
				force = 1;
			}
			widths_array = getCharWidthsArray.call(this, word, options);
			current_word_length = getArraySum(widths_array);

			if (line_length + separator_length + current_word_length > maxlen || force) {
				if (current_word_length > maxlen) {
					// this happens when you have space-less long URLs for example.
					// we just chop these to size. We do NOT insert hiphens
					tmp = splitLongWord(word, widths_array, maxlen - (line_length + separator_length), maxlen);
					// first line we add to existing line object
					line.push(tmp.shift()); // it's ok to have extra space indicator there
					// last line we make into new line object
					line = [tmp.pop()];
					// lines in the middle we apped to lines object as whole lines
					while (tmp.length) {
						lines.push([tmp.shift()]); // single fragment occupies whole line
					}
					current_word_length = getArraySum(widths_array.slice(word.length - line[0].length));
				} else {
					// just put it on a new line
					line = [word];
				}

				// now we attach new line to lines
				lines.push(line);
				line_length = current_word_length + lineIndent;
				separator_length = spaceCharWidth;
			} else {
				line.push(word);

				line_length += separator_length + current_word_length;
				separator_length = spaceCharWidth;
			}
		}

		if (lineIndent) {
			postProcess = function postProcess(ln, idx) {
				return (idx ? pad : '') + ln.join(" ");
			};
		} else {
			postProcess = function postProcess(ln) {
				return ln.join(" ");
			};
		}

		return lines.map(postProcess);
	};

	/**
 Splits a given string into an array of strings. Uses 'size' value
 (in measurement units declared as default for the jsPDF instance)
 and the font's "widths" and "Kerning" tables, where available, to
 determine display length of a given string for a given font.
 
 We use character's 100% of unit size (height) as width when Width
 table or other default width is not available.
 
 @public
 @function
 @param text {String} Unencoded, regular JavaScript (Unicode, UTF-16 / UCS-2) string.
 @param size {Number} Nominal number, measured in units default to this instance of jsPDF.
 @param options {Object} Optional flags needed for chopper to do the right thing.
 @returns {Array} with strings chopped to size.
 */
	API.splitTextToSize = function (text, maxlen, options) {
		'use strict';

		if (!options) {
			options = {};
		}

		var fsize = options.fontSize || this.internal.getFontSize(),
		    newOptions = function (options) {
			var widths = {
				0: 1
			},
			    kerning = {};

			if (!options.widths || !options.kerning) {
				var f = this.internal.getFont(options.fontName, options.fontStyle),
				    encoding = 'Unicode';
				// NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE
				// Actual JavaScript-native String's 16bit char codes used.
				// no multi-byte logic here

				if (f.metadata[encoding]) {
					return {
						widths: f.metadata[encoding].widths || widths,
						kerning: f.metadata[encoding].kerning || kerning
					};
				}
			} else {
				return {
					widths: options.widths,
					kerning: options.kerning
				};
			}

			// then use default values
			return {
				widths: widths,
				kerning: kerning
			};
		}.call(this, options);

		// first we split on end-of-line chars
		var paragraphs;
		if (Array.isArray(text)) {
			paragraphs = text;
		} else {
			paragraphs = text.split(/\r?\n/);
		}

		// now we convert size (max length of line) into "font size units"
		// at present time, the "font size unit" is always 'point'
		// 'proportional' means, "in proportion to font size"
		var fontUnit_maxLen = 1.0 * this.internal.scaleFactor * maxlen / fsize;
		// at this time, fsize is always in "points" regardless of the default measurement unit of the doc.
		// this may change in the future?
		// until then, proportional_maxlen is likely to be in 'points'

		// If first line is to be indented (shorter or longer) than maxLen
		// we indicate that by using CSS-style "text-indent" option.
		// here it's in font units too (which is likely 'points')
		// it can be negative (which makes the first line longer than maxLen)
		newOptions.textIndent = options.textIndent ? options.textIndent * 1.0 * this.internal.scaleFactor / fsize : 0;
		newOptions.lineIndent = options.lineIndent;

		var i,
		    l,
		    output = [];
		for (i = 0, l = paragraphs.length; i < l; i++) {
			output = output.concat(splitParagraphIntoLines.call(this, paragraphs[i], fontUnit_maxLen, newOptions));
		}

		return output;
	};
})(jsPDF.API);

/** @preserve 
jsPDF standard_fonts_metrics plugin
Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
MIT license.
*/
/**
 * 
 * ====================================================================
 */

(function (API) {
	'use strict';

	/*
 # reference (Python) versions of 'compress' and 'uncompress'
 # only 'uncompress' function is featured lower as JavaScript
 # if you want to unit test "roundtrip", just transcribe the reference
 # 'compress' function from Python into JavaScript
 
 def compress(data):
 
 	keys =   '0123456789abcdef'
 	values = 'klmnopqrstuvwxyz'
 	mapping = dict(zip(keys, values))
 	vals = []
 	for key in data.keys():
 		value = data[key]
 		try:
 			keystring = hex(key)[2:]
 			keystring = keystring[:-1] + mapping[keystring[-1:]]
 		except:
 			keystring = key.join(["'","'"])
 			#print('Keystring is %s' % keystring)
 
 		try:
 			if value < 0:
 				valuestring = hex(value)[3:]
 				numberprefix = '-'
 			else:
 				valuestring = hex(value)[2:]
 				numberprefix = ''
 			valuestring = numberprefix + valuestring[:-1] + mapping[valuestring[-1:]]
 		except:
 			if type(value) == dict:
 				valuestring = compress(value)
 			else:
 				raise Exception("Don't know what to do with value type %s" % type(value))
 
 		vals.append(keystring+valuestring)
 	
 	return '{' + ''.join(vals) + '}'
 
 def uncompress(data):
 
 	decoded = '0123456789abcdef'
 	encoded = 'klmnopqrstuvwxyz'
 	mapping = dict(zip(encoded, decoded))
 
 	sign = +1
 	stringmode = False
 	stringparts = []
 
 	output = {}
 
 	activeobject = output
 	parentchain = []
 
 	keyparts = ''
 	valueparts = ''
 
 	key = None
 
 	ending = set(encoded)
 
 	i = 1
 	l = len(data) - 1 # stripping starting, ending {}
 	while i != l: # stripping {}
 		# -, {, }, ' are special.
 
 		ch = data[i]
 		i += 1
 
 		if ch == "'":
 			if stringmode:
 				# end of string mode
 				stringmode = False
 				key = ''.join(stringparts)
 			else:
 				# start of string mode
 				stringmode = True
 				stringparts = []
 		elif stringmode == True:
 			#print("Adding %s to stringpart" % ch)
 			stringparts.append(ch)
 
 		elif ch == '{':
 			# start of object
 			parentchain.append( [activeobject, key] )
 			activeobject = {}
 			key = None
 			#DEBUG = True
 		elif ch == '}':
 			# end of object
 			parent, key = parentchain.pop()
 			parent[key] = activeobject
 			key = None
 			activeobject = parent
 			#DEBUG = False
 
 		elif ch == '-':
 			sign = -1
 		else:
 			# must be number
 			if key == None:
 				#debug("In Key. It is '%s', ch is '%s'" % (keyparts, ch))
 				if ch in ending:
 					#debug("End of key")
 					keyparts += mapping[ch]
 					key = int(keyparts, 16) * sign
 					sign = +1
 					keyparts = ''
 				else:
 					keyparts += ch
 			else:
 				#debug("In value. It is '%s', ch is '%s'" % (valueparts, ch))
 				if ch in ending:
 					#debug("End of value")
 					valueparts += mapping[ch]
 					activeobject[key] = int(valueparts, 16) * sign
 					sign = +1
 					key = None
 					valueparts = ''
 				else:
 					valueparts += ch
 
 			#debug(activeobject)
 
 	return output
 
 */

	/**
 Uncompresses data compressed into custom, base16-like format. 
 @public
 @function
 @param
 @returns {Type}
 */

	var uncompress = function uncompress(data) {

		var decoded = '0123456789abcdef',
		    encoded = 'klmnopqrstuvwxyz',
		    mapping = {};

		for (var i = 0; i < encoded.length; i++) {
			mapping[encoded[i]] = decoded[i];
		}

		var undef,
		    output = {},
		    sign = 1,
		    stringparts // undef. will be [] in string mode

		,
		    activeobject = output,
		    parentchain = [],
		    parent_key_pair,
		    keyparts = '',
		    valueparts = '',
		    key // undef. will be Truthy when Key is resolved.
		,
		    datalen = data.length - 1 // stripping ending }
		,
		    ch;

		i = 1; // stripping starting {

		while (i != datalen) {
			// - { } ' are special.

			ch = data[i];
			i += 1;

			if (ch == "'") {
				if (stringparts) {
					// end of string mode
					key = stringparts.join('');
					stringparts = undef;
				} else {
					// start of string mode
					stringparts = [];
				}
			} else if (stringparts) {
				stringparts.push(ch);
			} else if (ch == '{') {
				// start of object
				parentchain.push([activeobject, key]);
				activeobject = {};
				key = undef;
			} else if (ch == '}') {
				// end of object
				parent_key_pair = parentchain.pop();
				parent_key_pair[0][parent_key_pair[1]] = activeobject;
				key = undef;
				activeobject = parent_key_pair[0];
			} else if (ch == '-') {
				sign = -1;
			} else {
				// must be number
				if (key === undef) {
					if (mapping.hasOwnProperty(ch)) {
						keyparts += mapping[ch];
						key = parseInt(keyparts, 16) * sign;
						sign = +1;
						keyparts = '';
					} else {
						keyparts += ch;
					}
				} else {
					if (mapping.hasOwnProperty(ch)) {
						valueparts += mapping[ch];
						activeobject[key] = parseInt(valueparts, 16) * sign;
						sign = +1;
						key = undef;
						valueparts = '';
					} else {
						valueparts += ch;
					}
				}
			}
		} // end while

		return output;
	};

	// encoding = 'Unicode' 
	// NOT UTF8, NOT UTF16BE/LE, NOT UCS2BE/LE. NO clever BOM behavior
	// Actual 16bit char codes used.
	// no multi-byte logic here

	// Unicode characters to WinAnsiEncoding:
	// {402: 131, 8211: 150, 8212: 151, 8216: 145, 8217: 146, 8218: 130, 8220: 147, 8221: 148, 8222: 132, 8224: 134, 8225: 135, 8226: 149, 8230: 133, 8364: 128, 8240:137, 8249: 139, 8250: 155, 710: 136, 8482: 153, 338: 140, 339: 156, 732: 152, 352: 138, 353: 154, 376: 159, 381: 142, 382: 158}
	// as you can see, all Unicode chars are outside of 0-255 range. No char code conflicts.
	// this means that you can give Win cp1252 encoded strings to jsPDF for rendering directly
	// as well as give strings with some (supported by these fonts) Unicode characters and 
	// these will be mapped to win cp1252 
	// for example, you can send char code (cp1252) 0x80 or (unicode) 0x20AC, getting "Euro" glyph displayed in both cases.

	var encodingBlock = {
		'codePages': ['WinAnsiEncoding'],
		'WinAnsiEncoding': uncompress("{19m8n201n9q201o9r201s9l201t9m201u8m201w9n201x9o201y8o202k8q202l8r202m9p202q8p20aw8k203k8t203t8v203u9v2cq8s212m9t15m8w15n9w2dw9s16k8u16l9u17s9z17x8y17y9y}")
	},
	    encodings = { 'Unicode': {
			'Courier': encodingBlock,
			'Courier-Bold': encodingBlock,
			'Courier-BoldOblique': encodingBlock,
			'Courier-Oblique': encodingBlock,
			'Helvetica': encodingBlock,
			'Helvetica-Bold': encodingBlock,
			'Helvetica-BoldOblique': encodingBlock,
			'Helvetica-Oblique': encodingBlock,
			'Times-Roman': encodingBlock,
			'Times-Bold': encodingBlock,
			'Times-BoldItalic': encodingBlock,
			'Times-Italic': encodingBlock
			//	, 'Symbol'
			//	, 'ZapfDingbats'
		}
		/** 
  Resources:
  Font metrics data is reprocessed derivative of contents of
  "Font Metrics for PDF Core 14 Fonts" package, which exhibits the following copyright and license:
  
  Copyright (c) 1989, 1990, 1991, 1992, 1993, 1997 Adobe Systems Incorporated. All Rights Reserved.
  
  This file and the 14 PostScript(R) AFM files it accompanies may be used,
  copied, and distributed for any purpose and without charge, with or without
  modification, provided that all copyright notices are retained; that the AFM
  files are not distributed without this file; that all modifications to this
  file or any of the AFM files are prominently noted in the modified file(s);
  and that this paragraph is not modified. Adobe Systems has no responsibility
  or obligation to support the use of the AFM files.
  
  */
	},
	    fontMetrics = { 'Unicode': {
			// all sizing numbers are n/fontMetricsFractionOf = one font size unit
			// this means that if fontMetricsFractionOf = 1000, and letter A's width is 476, it's
			// width is 476/1000 or 47.6% of its height (regardless of font size)
			// At this time this value applies to "widths" and "kerning" numbers.

			// char code 0 represents "default" (average) width - use it for chars missing in this table.
			// key 'fof' represents the "fontMetricsFractionOf" value

			'Courier-Oblique': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
			'Times-BoldItalic': uncompress("{'widths'{k3o2q4ycx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2r202m2n2n3m2o3m2p5n202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5n4l4m4m4m4n4m4o4s4p4m4q4m4r4s4s4y4t2r4u3m4v4m4w3x4x5t4y4s4z4s5k3x5l4s5m4m5n3r5o3x5p4s5q4m5r5t5s4m5t3x5u3x5v2l5w1w5x2l5y3t5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q2l6r3m6s3r6t1w6u1w6v3m6w1w6x4y6y3r6z3m7k3m7l3m7m2r7n2r7o1w7p3r7q2w7r4m7s3m7t2w7u2r7v2n7w1q7x2n7y3t202l3mcl4mal2ram3man3mao3map3mar3mas2lat4uau1uav3maw3way4uaz2lbk2sbl3t'fof'6obo2lbp3tbq3mbr1tbs2lbu1ybv3mbz3mck4m202k3mcm4mcn4mco4mcp4mcq5ycr4mcs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz2w203k6o212m6o2dw2l2cq2l3t3m3u2l17s3x19m3m}'kerning'{cl{4qu5kt5qt5rs17ss5ts}201s{201ss}201t{cks4lscmscnscoscpscls2wu2yu201ts}201x{2wu2yu}2k{201ts}2w{4qx5kx5ou5qx5rs17su5tu}2x{17su5tu5ou}2y{4qx5kx5ou5qx5rs17ss5ts}'fof'-6ofn{17sw5tw5ou5qw5rs}7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qs}3v{17su5tu5os5qs}7p{17su5tu}ck{4qu5kt5qt5rs17ss5ts}4l{4qu5kt5qt5rs17ss5ts}cm{4qu5kt5qt5rs17ss5ts}cn{4qu5kt5qt5rs17ss5ts}co{4qu5kt5qt5rs17ss5ts}cp{4qu5kt5qt5rs17ss5ts}6l{4qu5ou5qw5rt17su5tu}5q{ckuclucmucnucoucpu4lu}5r{ckuclucmucnucoucpu4lu}7q{cksclscmscnscoscps4ls}6p{4qu5ou5qw5rt17sw5tw}ek{4qu5ou5qw5rt17su5tu}el{4qu5ou5qw5rt17su5tu}em{4qu5ou5qw5rt17su5tu}en{4qu5ou5qw5rt17su5tu}eo{4qu5ou5qw5rt17su5tu}ep{4qu5ou5qw5rt17su5tu}es{17ss5ts5qs4qu}et{4qu5ou5qw5rt17sw5tw}eu{4qu5ou5qw5rt17ss5ts}ev{17ss5ts5qs4qu}6z{17sw5tw5ou5qw5rs}fm{17sw5tw5ou5qw5rs}7n{201ts}fo{17sw5tw5ou5qw5rs}fp{17sw5tw5ou5qw5rs}fq{17sw5tw5ou5qw5rs}7r{cksclscmscnscoscps4ls}fs{17sw5tw5ou5qw5rs}ft{17su5tu}fu{17su5tu}fv{17su5tu}fw{17su5tu}fz{cksclscmscnscoscps4ls}}}"),
			'Helvetica-Bold': uncompress("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}"),
			'Courier': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
			'Courier-BoldOblique': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
			'Times-Bold': uncompress("{'widths'{k3q2q5ncx2r201n3m201o6o201s2l201t2l201u2l201w3m201x3m201y3m2k1t2l2l202m2n2n3m2o3m2p6o202q6o2r1w2s2l2t2l2u3m2v3t2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w3t3x3t3y3t3z3m4k5x4l4s4m4m4n4s4o4s4p4m4q3x4r4y4s4y4t2r4u3m4v4y4w4m4x5y4y4s4z4y5k3x5l4y5m4s5n3r5o4m5p4s5q4s5r6o5s4s5t4s5u4m5v2l5w1w5x2l5y3u5z3m6k2l6l3m6m3r6n2w6o3r6p2w6q2l6r3m6s3r6t1w6u2l6v3r6w1w6x5n6y3r6z3m7k3r7l3r7m2w7n2r7o2l7p3r7q3m7r4s7s3m7t3m7u2w7v2r7w1q7x2r7y3o202l3mcl4sal2lam3man3mao3map3mar3mas2lat4uau1yav3maw3tay4uaz2lbk2sbl3t'fof'6obo2lbp3rbr1tbs2lbu2lbv3mbz3mck4s202k3mcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw2r2m3rcy2rcz2rdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3rek3mel3mem3men3meo3mep3meq4ser2wes2wet2weu2wev2wew1wex1wey1wez1wfl3rfm3mfn3mfo3mfp3mfq3mfr3tfs3mft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3m3u2l17s4s19m3m}'kerning'{cl{4qt5ks5ot5qy5rw17sv5tv}201t{cks4lscmscnscoscpscls4wv}2k{201ts}2w{4qu5ku7mu5os5qx5ru17su5tu}2x{17su5tu5ou5qs}2y{4qv5kv7mu5ot5qz5ru17su5tu}'fof'-6o7t{cksclscmscnscoscps4ls}3u{17su5tu5os5qu}3v{17su5tu5os5qu}fu{17su5tu5ou5qu}7p{17su5tu5ou5qu}ck{4qt5ks5ot5qy5rw17sv5tv}4l{4qt5ks5ot5qy5rw17sv5tv}cm{4qt5ks5ot5qy5rw17sv5tv}cn{4qt5ks5ot5qy5rw17sv5tv}co{4qt5ks5ot5qy5rw17sv5tv}cp{4qt5ks5ot5qy5rw17sv5tv}6l{17st5tt5ou5qu}17s{ckuclucmucnucoucpu4lu4wu}5o{ckuclucmucnucoucpu4lu4wu}5q{ckzclzcmzcnzcozcpz4lz4wu}5r{ckxclxcmxcnxcoxcpx4lx4wu}5t{ckuclucmucnucoucpu4lu4wu}7q{ckuclucmucnucoucpu4lu}6p{17sw5tw5ou5qu}ek{17st5tt5qu}el{17st5tt5ou5qu}em{17st5tt5qu}en{17st5tt5qu}eo{17st5tt5qu}ep{17st5tt5ou5qu}es{17ss5ts5qu}et{17sw5tw5ou5qu}eu{17sw5tw5ou5qu}ev{17ss5ts5qu}6z{17sw5tw5ou5qu5rs}fm{17sw5tw5ou5qu5rs}fn{17sw5tw5ou5qu5rs}fo{17sw5tw5ou5qu5rs}fp{17sw5tw5ou5qu5rs}fq{17sw5tw5ou5qu5rs}7r{cktcltcmtcntcotcpt4lt5os}fs{17sw5tw5ou5qu5rs}ft{17su5tu5ou5qu}7m{5os}fv{17su5tu5ou5qu}fw{17su5tu5ou5qu}fz{cksclscmscnscoscps4ls}}}")
			//, 'Symbol': uncompress("{'widths'{k3uaw4r19m3m2k1t2l2l202m2y2n3m2p5n202q6o3k3m2s2l2t2l2v3r2w1t3m3m2y1t2z1wbk2sbl3r'fof'6o3n3m3o3m3p3m3q3m3r3m3s3m3t3m3u1w3v1w3w3r3x3r3y3r3z2wbp3t3l3m5v2l5x2l5z3m2q4yfr3r7v3k7w1o7x3k}'kerning'{'fof'-6o}}")
			, 'Helvetica': uncompress("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}"),
			'Helvetica-BoldOblique': uncompress("{'widths'{k3s2q4scx1w201n3r201o6o201s1w201t1w201u1w201w3m201x3m201y3m2k1w2l2l202m2n2n3r2o3r2p5t202q6o2r1s2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v2l3w3u3x3u3y3u3z3x4k6l4l4s4m4s4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3r4v4s4w3x4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v2l5w1w5x2l5y3u5z3r6k2l6l3r6m3x6n3r6o3x6p3r6q2l6r3x6s3x6t1w6u1w6v3r6w1w6x5t6y3x6z3x7k3x7l3x7m2r7n3r7o2l7p3x7q3r7r4y7s3r7t3r7u3m7v2r7w1w7x2r7y3u202l3rcl4sal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3xbq3rbr1wbs2lbu2obv3rbz3xck4s202k3rcm4scn4sco4scp4scq6ocr4scs4mct4mcu4mcv4mcw1w2m2zcy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3res3ret3reu3rev3rew1wex1wey1wez1wfl3xfm3xfn3xfo3xfp3xfq3xfr3ufs3xft3xfu3xfv3xfw3xfz3r203k6o212m6o2dw2l2cq2l3t3r3u2l17s4m19m3r}'kerning'{cl{4qs5ku5ot5qs17sv5tv}201t{2ww4wy2yw}201w{2ks}201x{2ww4wy2yw}2k{201ts201xs}2w{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}2x{5ow5qs}2y{7qs4qu5kw5os5qw5rs17su5tu7tsfzs}'fof'-6o7p{17su5tu5ot}ck{4qs5ku5ot5qs17sv5tv}4l{4qs5ku5ot5qs17sv5tv}cm{4qs5ku5ot5qs17sv5tv}cn{4qs5ku5ot5qs17sv5tv}co{4qs5ku5ot5qs17sv5tv}cp{4qs5ku5ot5qs17sv5tv}6l{17st5tt5os}17s{2kwclvcmvcnvcovcpv4lv4wwckv}5o{2kucltcmtcntcotcpt4lt4wtckt}5q{2ksclscmscnscoscps4ls4wvcks}5r{2ks4ws}5t{2kwclvcmvcnvcovcpv4lv4wwckv}eo{17st5tt5os}fu{17su5tu5ot}6p{17ss5ts}ek{17st5tt5os}el{17st5tt5os}em{17st5tt5os}en{17st5tt5os}6o{201ts}ep{17st5tt5os}es{17ss5ts}et{17ss5ts}eu{17ss5ts}ev{17ss5ts}6z{17su5tu5os5qt}fm{17su5tu5os5qt}fn{17su5tu5os5qt}fo{17su5tu5os5qt}fp{17su5tu5os5qt}fq{17su5tu5os5qt}fs{17su5tu5os5qt}ft{17su5tu5ot}7m{5os}fv{17su5tu5ot}fw{17su5tu5ot}}}")
			//, 'ZapfDingbats': uncompress("{'widths'{k4u2k1w'fof'6o}'kerning'{'fof'-6o}}")
			, 'Courier-Bold': uncompress("{'widths'{k3w'fof'6o}'kerning'{'fof'-6o}}"),
			'Times-Italic': uncompress("{'widths'{k3n2q4ycx2l201n3m201o5t201s2l201t2l201u2l201w3r201x3r201y3r2k1t2l2l202m2n2n3m2o3m2p5n202q5t2r1p2s2l2t2l2u3m2v4n2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v2l3w4n3x4n3y4n3z3m4k5w4l3x4m3x4n4m4o4s4p3x4q3x4r4s4s4s4t2l4u2w4v4m4w3r4x5n4y4m4z4s5k3x5l4s5m3x5n3m5o3r5p4s5q3x5r5n5s3x5t3r5u3r5v2r5w1w5x2r5y2u5z3m6k2l6l3m6m3m6n2w6o3m6p2w6q1w6r3m6s3m6t1w6u1w6v2w6w1w6x4s6y3m6z3m7k3m7l3m7m2r7n2r7o1w7p3m7q2w7r4m7s2w7t2w7u2r7v2s7w1v7x2s7y3q202l3mcl3xal2ram3man3mao3map3mar3mas2lat4wau1vav3maw4nay4waz2lbk2sbl4n'fof'6obo2lbp3mbq3obr1tbs2lbu1zbv3mbz3mck3x202k3mcm3xcn3xco3xcp3xcq5tcr4mcs3xct3xcu3xcv3xcw2l2m2ucy2lcz2ldl4mdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek3mel3mem3men3meo3mep3meq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr4nfs3mft3mfu3mfv3mfw3mfz2w203k6o212m6m2dw2l2cq2l3t3m3u2l17s3r19m3m}'kerning'{cl{5kt4qw}201s{201sw}201t{201tw2wy2yy6q-t}201x{2wy2yy}2k{201tw}2w{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}2x{17ss5ts5os}2y{7qs4qy7rs5ky7mw5os5qx5ru17su5tu}'fof'-6o6t{17ss5ts5qs}7t{5os}3v{5qs}7p{17su5tu5qs}ck{5kt4qw}4l{5kt4qw}cm{5kt4qw}cn{5kt4qw}co{5kt4qw}cp{5kt4qw}6l{4qs5ks5ou5qw5ru17su5tu}17s{2ks}5q{ckvclvcmvcnvcovcpv4lv}5r{ckuclucmucnucoucpu4lu}5t{2ks}6p{4qs5ks5ou5qw5ru17su5tu}ek{4qs5ks5ou5qw5ru17su5tu}el{4qs5ks5ou5qw5ru17su5tu}em{4qs5ks5ou5qw5ru17su5tu}en{4qs5ks5ou5qw5ru17su5tu}eo{4qs5ks5ou5qw5ru17su5tu}ep{4qs5ks5ou5qw5ru17su5tu}es{5ks5qs4qs}et{4qs5ks5ou5qw5ru17su5tu}eu{4qs5ks5qw5ru17su5tu}ev{5ks5qs4qs}ex{17ss5ts5qs}6z{4qv5ks5ou5qw5ru17su5tu}fm{4qv5ks5ou5qw5ru17su5tu}fn{4qv5ks5ou5qw5ru17su5tu}fo{4qv5ks5ou5qw5ru17su5tu}fp{4qv5ks5ou5qw5ru17su5tu}fq{4qv5ks5ou5qw5ru17su5tu}7r{5os}fs{4qv5ks5ou5qw5ru17su5tu}ft{17su5tu5qs}fu{17su5tu5qs}fv{17su5tu5qs}fw{17su5tu5qs}}}"),
			'Times-Roman': uncompress("{'widths'{k3n2q4ycx2l201n3m201o6o201s2l201t2l201u2l201w2w201x2w201y2w2k1t2l2l202m2n2n3m2o3m2p5n202q6o2r1m2s2l2t2l2u3m2v3s2w1t2x2l2y1t2z1w3k3m3l3m3m3m3n3m3o3m3p3m3q3m3r3m3s3m203t2l203u2l3v1w3w3s3x3s3y3s3z2w4k5w4l4s4m4m4n4m4o4s4p3x4q3r4r4s4s4s4t2l4u2r4v4s4w3x4x5t4y4s4z4s5k3r5l4s5m4m5n3r5o3x5p4s5q4s5r5y5s4s5t4s5u3x5v2l5w1w5x2l5y2z5z3m6k2l6l2w6m3m6n2w6o3m6p2w6q2l6r3m6s3m6t1w6u1w6v3m6w1w6x4y6y3m6z3m7k3m7l3m7m2l7n2r7o1w7p3m7q3m7r4s7s3m7t3m7u2w7v3k7w1o7x3k7y3q202l3mcl4sal2lam3man3mao3map3mar3mas2lat4wau1vav3maw3say4waz2lbk2sbl3s'fof'6obo2lbp3mbq2xbr1tbs2lbu1zbv3mbz2wck4s202k3mcm4scn4sco4scp4scq5tcr4mcs3xct3xcu3xcv3xcw2l2m2tcy2lcz2ldl4sdm4sdn4sdo4sdp4sdq4sds4sdt4sdu4sdv4sdw4sdz3mek2wel2wem2wen2weo2wep2weq4mer2wes2wet2weu2wev2wew1wex1wey1wez1wfl3mfm3mfn3mfo3mfp3mfq3mfr3sfs3mft3mfu3mfv3mfw3mfz3m203k6o212m6m2dw2l2cq2l3t3m3u1w17s4s19m3m}'kerning'{cl{4qs5ku17sw5ou5qy5rw201ss5tw201ws}201s{201ss}201t{ckw4lwcmwcnwcowcpwclw4wu201ts}2k{201ts}2w{4qs5kw5os5qx5ru17sx5tx}2x{17sw5tw5ou5qu}2y{4qs5kw5os5qx5ru17sx5tx}'fof'-6o7t{ckuclucmucnucoucpu4lu5os5rs}3u{17su5tu5qs}3v{17su5tu5qs}7p{17sw5tw5qs}ck{4qs5ku17sw5ou5qy5rw201ss5tw201ws}4l{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cm{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cn{4qs5ku17sw5ou5qy5rw201ss5tw201ws}co{4qs5ku17sw5ou5qy5rw201ss5tw201ws}cp{4qs5ku17sw5ou5qy5rw201ss5tw201ws}6l{17su5tu5os5qw5rs}17s{2ktclvcmvcnvcovcpv4lv4wuckv}5o{ckwclwcmwcnwcowcpw4lw4wu}5q{ckyclycmycnycoycpy4ly4wu5ms}5r{cktcltcmtcntcotcpt4lt4ws}5t{2ktclvcmvcnvcovcpv4lv4wuckv}7q{cksclscmscnscoscps4ls}6p{17su5tu5qw5rs}ek{5qs5rs}el{17su5tu5os5qw5rs}em{17su5tu5os5qs5rs}en{17su5qs5rs}eo{5qs5rs}ep{17su5tu5os5qw5rs}es{5qs}et{17su5tu5qw5rs}eu{17su5tu5qs5rs}ev{5qs}6z{17sv5tv5os5qx5rs}fm{5os5qt5rs}fn{17sv5tv5os5qx5rs}fo{17sv5tv5os5qx5rs}fp{5os5qt5rs}fq{5os5qt5rs}7r{ckuclucmucnucoucpu4lu5os}fs{17sv5tv5os5qx5rs}ft{17ss5ts5qs}fu{17sw5tw5qs}fv{17sw5tw5qs}fw{17ss5ts5qs}fz{ckuclucmucnucoucpu4lu5os5rs}}}"),
			'Helvetica-Oblique': uncompress("{'widths'{k3p2q4mcx1w201n3r201o6o201s1q201t1q201u1q201w2l201x2l201y2l2k1w2l1w202m2n2n3r2o3r2p5t202q6o2r1n2s2l2t2l2u2r2v3u2w1w2x2l2y1w2z1w3k3r3l3r3m3r3n3r3o3r3p3r3q3r3r3r3s3r203t2l203u2l3v1w3w3u3x3u3y3u3z3r4k6p4l4m4m4m4n4s4o4s4p4m4q3x4r4y4s4s4t1w4u3m4v4m4w3r4x5n4y4s4z4y5k4m5l4y5m4s5n4m5o3x5p4s5q4m5r5y5s4m5t4m5u3x5v1w5w1w5x1w5y2z5z3r6k2l6l3r6m3r6n3m6o3r6p3r6q1w6r3r6s3r6t1q6u1q6v3m6w1q6x5n6y3r6z3r7k3r7l3r7m2l7n3m7o1w7p3r7q3m7r4s7s3m7t3m7u3m7v2l7w1u7x2l7y3u202l3rcl4mal2lam3ran3rao3rap3rar3ras2lat4tau2pav3raw3uay4taz2lbk2sbl3u'fof'6obo2lbp3rbr1wbs2lbu2obv3rbz3xck4m202k3rcm4mcn4mco4mcp4mcq6ocr4scs4mct4mcu4mcv4mcw1w2m2ncy1wcz1wdl4sdm4ydn4ydo4ydp4ydq4yds4ydt4sdu4sdv4sdw4sdz3xek3rel3rem3ren3reo3rep3req5ter3mes3ret3reu3rev3rew1wex1wey1wez1wfl3rfm3rfn3rfo3rfp3rfq3rfr3ufs3xft3rfu3rfv3rfw3rfz3m203k6o212m6o2dw2l2cq2l3t3r3u1w17s4m19m3r}'kerning'{5q{4wv}cl{4qs5kw5ow5qs17sv5tv}201t{2wu4w1k2yu}201x{2wu4wy2yu}17s{2ktclucmucnu4otcpu4lu4wycoucku}2w{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}2x{17sy5ty5oy5qs}2y{7qs4qz5k1m17sy5ow5qx5rsfsu5ty7tufzu}'fof'-6o7p{17sv5tv5ow}ck{4qs5kw5ow5qs17sv5tv}4l{4qs5kw5ow5qs17sv5tv}cm{4qs5kw5ow5qs17sv5tv}cn{4qs5kw5ow5qs17sv5tv}co{4qs5kw5ow5qs17sv5tv}cp{4qs5kw5ow5qs17sv5tv}6l{17sy5ty5ow}do{17st5tt}4z{17st5tt}7s{fst}dm{17st5tt}dn{17st5tt}5o{ckwclwcmwcnwcowcpw4lw4wv}dp{17st5tt}dq{17st5tt}7t{5ow}ds{17st5tt}5t{2ktclucmucnu4otcpu4lu4wycoucku}fu{17sv5tv5ow}6p{17sy5ty5ow5qs}ek{17sy5ty5ow}el{17sy5ty5ow}em{17sy5ty5ow}en{5ty}eo{17sy5ty5ow}ep{17sy5ty5ow}es{17sy5ty5qs}et{17sy5ty5ow5qs}eu{17sy5ty5ow5qs}ev{17sy5ty5ow5qs}6z{17sy5ty5ow5qs}fm{17sy5ty5ow5qs}fn{17sy5ty5ow5qs}fo{17sy5ty5ow5qs}fp{17sy5ty5qs}fq{17sy5ty5ow5qs}7r{5ow}fs{17sy5ty5ow5qs}ft{17sv5tv5ow}7m{5ow}fv{17sv5tv5ow}fw{17sv5tv5ow}}}")
		} };

	/*
 This event handler is fired when a new jsPDF object is initialized
 This event handler appends metrics data to standard fonts within
 that jsPDF instance. The metrics are mapped over Unicode character
 codes, NOT CIDs or other codes matching the StandardEncoding table of the
 standard PDF fonts.
 Future:
 Also included is the encoding maping table, converting Unicode (UCS-2, UTF-16)
 char codes to StandardEncoding character codes. The encoding table is to be used
 somewhere around "pdfEscape" call.
 */

	API.events.push(['addFont', function (font) {
		var metrics,
		    unicode_section,
		    encoding = 'Unicode',
		    encodingBlock;

		metrics = fontMetrics[encoding][font.postScriptName];
		if (metrics) {
			if (font.metadata[encoding]) {
				unicode_section = font.metadata[encoding];
			} else {
				unicode_section = font.metadata[encoding] = {};
			}

			unicode_section.widths = metrics.widths;
			unicode_section.kerning = metrics.kerning;
		}

		encodingBlock = encodings[encoding][font.postScriptName];
		if (encodingBlock) {
			if (font.metadata[encoding]) {
				unicode_section = font.metadata[encoding];
			} else {
				unicode_section = font.metadata[encoding] = {};
			}

			unicode_section.encoding = encodingBlock;
			if (encodingBlock.codePages && encodingBlock.codePages.length) {
				font.encoding = encodingBlock.codePages[0];
			}
		}
	}]); // end of adding event handler
})(jsPDF.API);

/** @preserve
jsPDF SVG plugin
Copyright (c) 2012 Willow Systems Corporation, willow-systems.com
*/
/**
 * 
 * ====================================================================
 */

(function (jsPDFAPI) {
	'use strict';

	/**
 Parses SVG XML and converts only some of the SVG elements into
 PDF elements.
 
 Supports:
  paths
 
 @public
 @function
 @param
 @returns {Type}
 */

	jsPDFAPI.addSVG = function (svgtext, x, y, w, h) {
		// 'this' is _jsPDF object returned when jsPDF is inited (new jsPDF())

		var undef;

		if (x === undef || y === undef) {
			throw new Error("addSVG needs values for 'x' and 'y'");
		}

		function InjectCSS(cssbody, document) {
			var styletag = document.createElement('style');
			styletag.type = 'text/css';
			if (styletag.styleSheet) {
				// ie
				styletag.styleSheet.cssText = cssbody;
			} else {
				// others
				styletag.appendChild(document.createTextNode(cssbody));
			}
			document.getElementsByTagName("head")[0].appendChild(styletag);
		}

		function createWorkerNode(document) {

			var frameID = 'childframe' // Date.now().toString() + '_' + (Math.random() * 100).toString()
			,
			    frame = document.createElement('iframe');

			InjectCSS('.jsPDF_sillysvg_iframe {display:none;position:absolute;}', document);

			frame.name = frameID;
			frame.setAttribute("width", 0);
			frame.setAttribute("height", 0);
			frame.setAttribute("frameborder", "0");
			frame.setAttribute("scrolling", "no");
			frame.setAttribute("seamless", "seamless");
			frame.setAttribute("class", "jsPDF_sillysvg_iframe");

			document.body.appendChild(frame);

			return frame;
		}

		function attachSVGToWorkerNode(svgtext, frame) {
			var framedoc = (frame.contentWindow || frame.contentDocument).document;
			framedoc.write(svgtext);
			framedoc.close();
			return framedoc.getElementsByTagName('svg')[0];
		}

		function convertPathToPDFLinesArgs(path) {
			'use strict';
			// we will use 'lines' method call. it needs:
			// - starting coordinate pair
			// - array of arrays of vector shifts (2-len for line, 6 len for bezier)
			// - scale array [horizontal, vertical] ratios
			// - style (stroke, fill, both)

			var x = parseFloat(path[1]),
			    y = parseFloat(path[2]),
			    vectors = [],
			    position = 3,
			    len = path.length;

			while (position < len) {
				if (path[position] === 'c') {
					vectors.push([parseFloat(path[position + 1]), parseFloat(path[position + 2]), parseFloat(path[position + 3]), parseFloat(path[position + 4]), parseFloat(path[position + 5]), parseFloat(path[position + 6])]);
					position += 7;
				} else if (path[position] === 'l') {
					vectors.push([parseFloat(path[position + 1]), parseFloat(path[position + 2])]);
					position += 3;
				} else {
					position += 1;
				}
			}
			return [x, y, vectors];
		}

		var workernode = createWorkerNode(document),
		    svgnode = attachSVGToWorkerNode(svgtext, workernode),
		    scale = [1, 1],
		    svgw = parseFloat(svgnode.getAttribute('width')),
		    svgh = parseFloat(svgnode.getAttribute('height'));

		if (svgw && svgh) {
			// setting both w and h makes image stretch to size.
			// this may distort the image, but fits your demanded size
			if (w && h) {
				scale = [w / svgw, h / svgh];
			}
			// if only one is set, that value is set as max and SVG
			// is scaled proportionately.
			else if (w) {
					scale = [w / svgw, w / svgw];
				} else if (h) {
					scale = [h / svgh, h / svgh];
				}
		}

		var i,
		    l,
		    tmp,
		    linesargs,
		    items = svgnode.childNodes;
		for (i = 0, l = items.length; i < l; i++) {
			tmp = items[i];
			if (tmp.tagName && tmp.tagName.toUpperCase() === 'PATH') {
				linesargs = convertPathToPDFLinesArgs(tmp.getAttribute("d").split(' '));
				// path start x coordinate
				linesargs[0] = linesargs[0] * scale[0] + x; // where x is upper left X of image
				// path start y coordinate
				linesargs[1] = linesargs[1] * scale[1] + y; // where y is upper left Y of image
				// the rest of lines are vectors. these will adjust with scale value auto.
				this.lines.call(this, linesargs[2] // lines
				, linesargs[0] // starting x
				, linesargs[1] // starting y
				, scale);
			}
		}

		// clean up
		// workernode.parentNode.removeChild(workernode)

		return this;
	};
})(jsPDF.API);

/** ==================================================================== 
 * jsPDF total_pages plugin
 * Copyright (c) 2013 Eduardo Menezes de Morais, eduardo.morais@usp.br
 * 
 * 
 * ====================================================================
 */

(function (jsPDFAPI) {
  'use strict';

  jsPDFAPI.putTotalPages = function (pageExpression) {
    'use strict';

    var replaceExpression = new RegExp(pageExpression, 'g');
    for (var n = 1; n <= this.internal.getNumberOfPages(); n++) {
      for (var i = 0; i < this.internal.pages[n].length; i++) {
        this.internal.pages[n][i] = this.internal.pages[n][i].replace(replaceExpression, this.internal.getNumberOfPages());
      }
    }
    return this;
  };
})(jsPDF.API);

/**
 * jsPDF viewerPreferences Plugin
 * @author Aras Abbasi (github.com/arasabbasi)
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
* Adds the ability to set ViewerPreferences and by thus
* controlling the way the document is to be presented on the
* screen or in print.
*/

(function (jsPDFAPI) {
    "use strict";
    /**
     * Set the ViewerPreferences of the generated PDF
     *
     * @param {Object} options Array with the ViewPreferences<br />
     * Example: doc.viewerPreferences({"FitWindow":true});<br />
     * <br />
     * You can set following preferences:<br />
     * <br/>
     * <b>HideToolbar</b> <i>(boolean)</i><br />
     * Default value: false<br />
     * <br />
     * <b>HideMenubar</b> <i>(boolean)</i><br />
     * Default value: false.<br />
     * <br />
     * <b>HideWindowUI</b> <i>(boolean)</i><br />
     * Default value: false.<br />
     * <br />
     * <b>FitWindow</b> <i>(boolean)</i><br />
     * Default value: false.<br />
     * <br />
     * <b>CenterWindow</b> <i>(boolean)</i><br />
     * Default value: false<br />
     * <br />
     * <b>DisplayDocTitle</b> <i>(boolean)</i><br />
     * Default value: false.<br />
     * <br />
     * <b>NonFullScreenPageMode</b> <i>(String)</i><br />
     * Possible values: UseNone, UseOutlines, UseThumbs, UseOC<br />
     * Default value: UseNone<br/>
     * <br />
     * <b>Direction</b> <i>(String)</i><br />
     * Possible values: L2R, R2L<br />
     * Default value: L2R.<br />
     * <br />
     * <b>ViewArea</b> <i>(String)</i><br />
     * Possible values: MediaBox, CropBox, TrimBox, BleedBox, ArtBox<br />
     * Default value: CropBox.<br />
     * <br />
     * <b>ViewClip</b> <i>(String)</i><br />
     * Possible values: MediaBox, CropBox, TrimBox, BleedBox, ArtBox<br />
     * Default value: CropBox<br />
     * <br />
     * <b>PrintArea</b> <i>(String)</i><br />
     * Possible values: MediaBox, CropBox, TrimBox, BleedBox, ArtBox<br />
     * Default value: CropBox<br />
     * <br />
     * <b>PrintClip</b> <i>(String)</i><br />
     * Possible values: MediaBox, CropBox, TrimBox, BleedBox, ArtBox<br />
     * Default value: CropBox.<br />
     * <br />
     * <b>PrintScaling</b> <i>(String)</i><br />
     * Possible values: AppDefault, None<br />
     * Default value: AppDefault.<br />
     * <br />
     * <b>Duplex</b> <i>(String)</i><br />
     * Possible values: Simplex, DuplexFlipLongEdge, DuplexFlipShortEdge
     * Default value: none<br />
     * <br />
     * <b>PickTrayByPDFSize</b> <i>(boolean)</i><br />
     * Default value: false<br />
     * <br />
     * <b>PrintPageRange</b> <i>(Array)</i><br />
     * Example: [[1,5], [7,9]]<br />
     * Default value: as defined by PDF viewer application<br />
     * <br />
     * <b>NumCopies</b> <i>(Number)</i><br />
     * Possible values: 1, 2, 3, 4, 5<br />
     * Default value: 1<br />
     * <br />
     * For more information see the PDF Reference, sixth edition on Page 577
     * @param {boolean} doReset True to reset the settings
     * @function
     * @returns jsPDF
     * @methodOf jsPDF#
     * @example
     * var doc = new jsPDF()
     * doc.text('This is a test', 10, 10)
     * doc.viewerPreferences({'FitWindow': true}, true)
     * doc.save("viewerPreferences.pdf")
     *
     * // Example printing 10 copies, using cropbox, and hiding UI.
     * doc.viewerPreferences({
     *   'HideWindowUI': true,
     *   'PrintArea': 'CropBox',
     *   'NumCopies': 10
     * })
     * @name viewerPreferences
     */

    jsPDFAPI.viewerPreferences = function (options, doReset) {
        options = options || {};
        doReset = doReset || false;

        var configuration;
        var configurationTemplate = {
            "HideToolbar": { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3 },
            "HideMenubar": { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3 },
            "HideWindowUI": { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3 },
            "FitWindow": { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3 },
            "CenterWindow": { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.3 },
            "DisplayDocTitle": { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.4 },
            "NonFullScreenPageMode": { defaultValue: "UseNone", value: "UseNone", type: "name", explicitSet: false, valueSet: ["UseNone", "UseOutlines", "UseThumbs", "UseOC"], pdfVersion: 1.3 },
            "Direction": { defaultValue: "L2R", value: "L2R", type: "name", explicitSet: false, valueSet: ["L2R", "R2L"], pdfVersion: 1.3 },
            "ViewArea": { defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: false, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4 },
            "ViewClip": { defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: false, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4 },
            "PrintArea": { defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: false, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4 },
            "PrintClip": { defaultValue: "CropBox", value: "CropBox", type: "name", explicitSet: false, valueSet: ["MediaBox", "CropBox", "TrimBox", "BleedBox", "ArtBox"], pdfVersion: 1.4 },
            "PrintScaling": { defaultValue: "AppDefault", value: "AppDefault", type: "name", explicitSet: false, valueSet: ["AppDefault", "None"], pdfVersion: 1.6 },
            "Duplex": { defaultValue: "", value: "none", type: "name", explicitSet: false, valueSet: ["Simplex", "DuplexFlipShortEdge", "DuplexFlipLongEdge", "none"], pdfVersion: 1.7 },
            "PickTrayByPDFSize": { defaultValue: false, value: false, type: "boolean", explicitSet: false, valueSet: [true, false], pdfVersion: 1.7 },
            "PrintPageRange": { defaultValue: "", value: "", type: "array", explicitSet: false, valueSet: null, pdfVersion: 1.7 },
            "NumCopies": { defaultValue: 1, value: 1, type: "integer", explicitSet: false, valueSet: null, pdfVersion: 1.7 }
        };

        var configurationKeys = Object.keys(configurationTemplate);

        var rangeArray = [];
        var i = 0;
        var j = 0;
        var k = 0;
        var isValid = true;

        var method;
        var value;

        function arrayContainsElement(array, element) {
            var iterator;
            var result = false;

            for (iterator = 0; iterator < array.length; iterator += 1) {
                if (array[iterator] === element) {
                    result = true;
                }
            }
            return result;
        }

        if (this.internal.viewerpreferences === undefined) {
            this.internal.viewerpreferences = {};
            this.internal.viewerpreferences.configuration = JSON.parse(JSON.stringify(configurationTemplate));
            this.internal.viewerpreferences.isSubscribed = false;
        }
        configuration = this.internal.viewerpreferences.configuration;

        if (options === "reset" || doReset === true) {
            var len = configurationKeys.length;

            for (k = 0; k < len; k += 1) {
                configuration[configurationKeys[k]].value = configuration[configurationKeys[k]].defaultValue;
                configuration[configurationKeys[k]].explicitSet = false;
            }
        }

        if ((typeof options === "undefined" ? "undefined" : _typeof(options)) === "object") {
            for (method in options) {
                value = options[method];
                if (arrayContainsElement(configurationKeys, method) && value !== undefined) {

                    if (configuration[method].type === "boolean" && typeof value === "boolean") {
                        configuration[method].value = value;
                    } else if (configuration[method].type === "name" && arrayContainsElement(configuration[method].valueSet, value)) {
                        configuration[method].value = value;
                    } else if (configuration[method].type === "integer" && Number.isInteger(value)) {
                        configuration[method].value = value;
                    } else if (configuration[method].type === "array") {

                        for (i = 0; i < value.length; i += 1) {
                            isValid = true;
                            if (value[i].length === 1 && typeof value[i][0] === "number") {
                                rangeArray.push(String(value[i]));
                            } else if (value[i].length > 1) {
                                for (j = 0; j < value[i].length; j += 1) {
                                    if (typeof value[i][j] !== "number") {
                                        isValid = false;
                                    }
                                }
                                if (isValid === true) {
                                    rangeArray.push(String(value[i].join("-")));
                                }
                            }
                        }
                        configuration[method].value = String(rangeArray);
                    } else {
                        configuration[method].value = configuration[method].defaultValue;
                    }

                    configuration[method].explicitSet = true;
                }
            }
        }

        if (this.internal.viewerpreferences.isSubscribed === false) {
            this.internal.events.subscribe("putCatalog", function () {
                var pdfDict = [];
                var vPref;
                for (vPref in configuration) {
                    if (configuration[vPref].explicitSet === true) {
                        if (configuration[vPref].type === "name") {
                            pdfDict.push("/" + vPref + " /" + configuration[vPref].value);
                        } else {
                            pdfDict.push("/" + vPref + " " + configuration[vPref].value);
                        }
                    }
                }
                if (pdfDict.length !== 0) {
                    this.internal.write("/ViewerPreferences" + "<<\n" + pdfDict.join("\n") + "\n>>");
                }
            });
            this.internal.viewerpreferences.isSubscribed = true;
        }

        this.internal.viewerpreferences.configuration = configuration;
        return this;
    };
})(jsPDF.API);

/** ==================================================================== 
 * jsPDF XMP metadata plugin
 * Copyright (c) 2016 Jussi Utunen, u-jussi@suomi24.fi
 * 
 * 
 * ====================================================================
 */

/*global jsPDF */

/**
* Adds XMP formatted metadata to PDF
*
* @param {String} metadata The actual metadata to be added. The metadata shall be stored as XMP simple value. Note that if the metadata string contains XML markup characters "<", ">" or "&", those characters should be written using XML entities.
* @param {String} namespaceuri Sets the namespace URI for the metadata. Last character should be slash or hash.
* @function
* @returns {jsPDF}
* @methodOf jsPDF#
* @name addMetadata
*/

(function (jsPDFAPI) {
    'use strict';

    var xmpmetadata = "";
    var xmpnamespaceuri = "";
    var metadata_object_number = "";

    jsPDFAPI.addMetadata = function (metadata, namespaceuri) {
        xmpnamespaceuri = namespaceuri || "http://jspdf.default.namespaceuri/"; //The namespace URI for an XMP name shall not be empty
        xmpmetadata = metadata;
        this.internal.events.subscribe('postPutResources', function () {
            if (!xmpmetadata) {
                metadata_object_number = "";
            } else {
                var xmpmeta_beginning = '<x:xmpmeta xmlns:x="adobe:ns:meta/">';
                var rdf_beginning = '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:jspdf="' + xmpnamespaceuri + '"><jspdf:metadata>';
                var rdf_ending = '</jspdf:metadata></rdf:Description></rdf:RDF>';
                var xmpmeta_ending = '</x:xmpmeta>';
                var utf8_xmpmeta_beginning = unescape(encodeURIComponent(xmpmeta_beginning));
                var utf8_rdf_beginning = unescape(encodeURIComponent(rdf_beginning));
                var utf8_metadata = unescape(encodeURIComponent(xmpmetadata));
                var utf8_rdf_ending = unescape(encodeURIComponent(rdf_ending));
                var utf8_xmpmeta_ending = unescape(encodeURIComponent(xmpmeta_ending));

                var total_len = utf8_rdf_beginning.length + utf8_metadata.length + utf8_rdf_ending.length + utf8_xmpmeta_beginning.length + utf8_xmpmeta_ending.length;

                metadata_object_number = this.internal.newObject();
                this.internal.write('<< /Type /Metadata /Subtype /XML /Length ' + total_len + ' >>');
                this.internal.write('stream');
                this.internal.write(utf8_xmpmeta_beginning + utf8_rdf_beginning + utf8_metadata + utf8_rdf_ending + utf8_xmpmeta_ending);
                this.internal.write('endstream');
                this.internal.write('endobj');
            }
        });
        this.internal.events.subscribe('putCatalog', function () {
            if (metadata_object_number) {
                this.internal.write('/Metadata ' + metadata_object_number + ' 0 R');
            }
        });
        return this;
    };
})(jsPDF.API);

(function (jsPDFAPI) {
    'use strict';

    var TTFFont = function () {
        TTFFont.open = function (filename, name, vfs, encoding) {
            var contents;
            contents = b64ToByteArray(vfs);
            return new TTFFont(contents, name, encoding);
        };

        function TTFFont(rawData, name, encoding) {
            var data;
            this.rawData = rawData;
            data = this.contents = new Data(rawData);
            this.contents.pos = 4;
            if (data.readString(4) === 'ttcf') {
                if (!name) {
                    throw new Error("Must specify a font name for TTC files.");
                }
                throw new Error("Font " + name + " not found in TTC file.");
            } else {
                data.pos = 0;
                this.parse();
                this.subset = new Subset(this);
                this.registerTTF();
            }
        }
        TTFFont.prototype.parse = function () {
            this.directory = new Directory(this.contents);
            this.head = new HeadTable(this);
            this.name = new NameTable(this);
            this.cmap = new CmapTable(this);
            this.hhea = new HheaTable(this);
            this.maxp = new MaxpTable(this);
            this.hmtx = new HmtxTable(this);
            this.post = new PostTable(this);
            this.os2 = new OS2Table(this);
            this.loca = new LocaTable(this);
            this.glyf = new GlyfTable(this);
            this.ascender = this.os2.exists && this.os2.ascender || this.hhea.ascender;
            this.decender = this.os2.exists && this.os2.decender || this.hhea.decender;
            this.lineGap = this.os2.exists && this.os2.lineGap || this.hhea.lineGap;
            this.bbox = [this.head.xMin, this.head.yMin, this.head.xMax, this.head.yMax];
            return this;
        };
        TTFFont.prototype.registerTTF = function () {
            var e, hi, low, raw, _ref;
            this.scaleFactor = 1000.0 / this.head.unitsPerEm;
            this.bbox = function () {
                var _i, _len, _ref, _results;
                _ref = this.bbox;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    e = _ref[_i];
                    _results.push(Math.round(e * this.scaleFactor));
                }
                return _results;
            }.call(this);
            this.stemV = 0;
            if (this.post.exists) {
                raw = this.post.italic_angle;
                hi = raw >> 16;
                low = raw & 0xFF;
                if (hi & 0x8000 !== 0) {
                    hi = -((hi ^ 0xFFFF) + 1);
                }
                this.italicAngle = +("" + hi + "." + low);
            } else {
                this.italicAngle = 0;
            }
            this.ascender = Math.round(this.ascender * this.scaleFactor);
            this.decender = Math.round(this.decender * this.scaleFactor);
            this.lineGap = Math.round(this.lineGap * this.scaleFactor);
            this.capHeight = this.os2.exists && this.os2.capHeight || this.ascender;
            this.xHeight = this.os2.exists && this.os2.xHeight || 0;
            this.familyClass = (this.os2.exists && this.os2.familyClass || 0) >> 8;
            this.isSerif = (_ref = this.familyClass) === 1 || _ref === 2 || _ref === 3 || _ref === 4 || _ref === 5 || _ref === 7;
            this.isScript = this.familyClass === 10;
            this.flags = 0;
            if (this.post.isFixedPitch) {
                this.flags |= 1 << 0;
            }
            if (this.isSerif) {
                this.flags |= 1 << 1;
            }
            if (this.isScript) {
                this.flags |= 1 << 3;
            }
            if (this.italicAngle !== 0) {
                this.flags |= 1 << 6;
            }
            this.flags |= 1 << 5;
            if (!this.cmap.unicode) {
                throw new Error('No unicode cmap for font');
            }
        };
        TTFFont.prototype.characterToGlyph = function (character) {
            var _ref;
            return ((_ref = this.cmap.unicode) !== undefined ? _ref.codeMap[character] : undefined) || 0;
        };
        TTFFont.prototype.widthOfGlyph = function (glyph) {
            var scale;
            scale = 1000.0 / this.head.unitsPerEm;
            return this.hmtx.forGlyph(glyph).advance * scale;
        };
        TTFFont.prototype.widthOfString = function (string, size, charSpace) {
            var charCode, i, scale, width, _i, _ref;
            string = '' + string;
            width = 0;
            for (i = _i = 0, _ref = string.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                charCode = string.charCodeAt(i);
                width += this.widthOfGlyph(this.characterToGlyph(charCode)) + charSpace * (1000 / size) || 0;
            }
            scale = size / 1000;
            return width * scale;
        };
        TTFFont.prototype.lineHeight = function (size, includeGap) {
            var gap;
            if (includeGap === undefined) {
                includeGap = false;
            }
            gap = includeGap ? this.lineGap : 0;
            return (this.ascender + gap - this.decender) / 1000 * size;
        };
        TTFFont.prototype.encode = function (font, text, reverse) {
            font.use(text);

            text = reverse ? reverseString(font.encodeText(text)) : font.encodeText(text);

            text = function () {
                var _results = [];

                for (var i = 0, _ref2 = text.length; 0 <= _ref2 ? i < _ref2 : i > _ref2; 0 <= _ref2 ? i++ : i--) {
                    _results.push(text.charCodeAt(i).toString(16));
                }
                return _results;
            }().join('');

            return text;
        };
        TTFFont.prototype.embedTTF = function (encoding, newObject, out) {

            /**
             * It is a function to extract a table to make a custom font.
             * Returns the object number.
            @function
            @param {Object} dictionary
            @returns {Number} objectNumber
            */
            function makeFontTable(data) {
                var tableNumber;
                if (data.Type === "Font") {
                    if (isHex) data.ToUnicode = makeFontTable(data.ToUnicode) + ' 0 R';
                    data.FontDescriptor = makeFontTable(data.FontDescriptor) + ' 0 R';
                    tableNumber = newObject();
                    out(PDFObject.convert(data));
                } else if (data.Type === "FontDescriptor") {
                    data.FontFile2 = makeFontTable(data.FontFile2) + ' 0 R';
                    tableNumber = newObject();
                    out(PDFObject.convert(data));
                } else {
                    tableNumber = newObject();
                    out('<</Length1 ' + data.length + '>>');
                    out('stream');
                    Array.isArray(data) || data.constructor === Uint8Array ? out(toString(data)) : out(data);
                    out('endstream');
                }
                out('endobj');
                return tableNumber;
            }

            var charWidths, cmap, code, data, descriptor, firstChar, fontfile, glyph;
            var isHex = encoding === 'MacRomanEncoding' ? true : false;
            data = this.subset.encode();
            fontfile = {};
            fontfile = isHex ? data : this.rawData;
            descriptor = {
                Type: 'FontDescriptor',
                FontName: this.subset.postscriptName,
                FontFile2: fontfile,
                FontBBox: this.bbox,
                Flags: this.flags,
                StemV: this.stemV,
                ItalicAngle: this.italicAngle,
                Ascent: this.ascender,
                Descent: this.decender,
                CapHeight: this.capHeight,
                XHeight: this.xHeight
            };
            firstChar = +Object.keys(this.subset.cmap)[0];
            if (firstChar !== 33 && isHex) return false;
            charWidths = function () {
                var _ref, _results;
                _ref = this.subset.cmap;
                _results = [];
                for (code in _ref) {
                    if (Object.prototype.hasOwnProperty.call(_ref, code)) {
                        glyph = _ref[code];
                        _results.push(Math.round(this.widthOfGlyph(glyph)));
                    }
                }
                return _results;
            }.call(this);
            cmap = toUnicodeCmap(this.subset.subset);
            var dictionary = isHex ? {
                Type: 'Font',
                BaseFont: this.subset.postscriptName,
                Subtype: 'TrueType',
                FontDescriptor: descriptor,
                FirstChar: firstChar,
                LastChar: firstChar + charWidths.length - 1,
                Widths: charWidths,
                Encoding: encoding,
                ToUnicode: cmap
            } : {
                Type: 'Font',
                BaseFont: this.subset.postscriptName,
                Subtype: 'TrueType',
                FontDescriptor: descriptor,
                FirstChar: 0,
                LastChar: 255,
                Widths: makeWidths(this),
                Encoding: encoding
            };
            return makeFontTable(dictionary);
        };

        var b64ToByteArray = function b64ToByteArray(b64) {
            var i, j, l, tmp, placeHolders, arr;
            if (b64.length % 4 > 0) {
                throw new Error('Invalid string. Length must be a multiple of 4');
            }
            // the number of equal signs (place holders)
            // if there are two placeholders, than the two characters before it
            // represent one byte
            // if there is only one, then the three characters before it represent 2 bytes
            // this is just a cheap hack to not do indexOf twice
            var len = b64.length;
            placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0;
            // base64 is 4/3 + up to two characters of the original data
            arr = new Uint8Array(b64.length * 3 / 4 - placeHolders);
            // if there are placeholders, only get up to the last complete 4 chars
            l = placeHolders > 0 ? b64.length - 4 : b64.length;
            var L = 0;

            function push(v) {
                arr[L++] = v;
            }
            for (i = 0, j = 0; i < l; i += 4, j += 3) {
                tmp = decode(b64.charAt(i)) << 18 | decode(b64.charAt(i + 1)) << 12 | decode(b64.charAt(i + 2)) << 6 | decode(b64.charAt(i + 3));
                push((tmp & 0xFF0000) >> 16);
                push((tmp & 0xFF00) >> 8);
                push(tmp & 0xFF);
            }
            if (placeHolders === 2) {
                tmp = decode(b64.charAt(i)) << 2 | decode(b64.charAt(i + 1)) >> 4;
                push(tmp & 0xFF);
            } else if (placeHolders === 1) {
                tmp = decode(b64.charAt(i)) << 10 | decode(b64.charAt(i + 1)) << 4 | decode(b64.charAt(i + 2)) >> 2;
                push(tmp >> 8 & 0xFF);
                push(tmp & 0xFF);
            }
            return arr;
        };

        var decode = function decode(elt) {
            var PLUS = '+'.charCodeAt(0);
            var SLASH = '/'.charCodeAt(0);
            var NUMBER = '0'.charCodeAt(0);
            var LOWER = 'a'.charCodeAt(0);
            var UPPER = 'A'.charCodeAt(0);
            var PLUS_URL_SAFE = '-'.charCodeAt(0);
            var SLASH_URL_SAFE = '_'.charCodeAt(0);

            var code = elt.charCodeAt(0);
            if (code === PLUS || code === PLUS_URL_SAFE) return 62; // '+'
            if (code === SLASH || code === SLASH_URL_SAFE) return 63; // '/'
            if (code < NUMBER) return -1; //no match
            if (code < NUMBER + 10) return code - NUMBER + 26 + 26;
            if (code < UPPER + 26) return code - UPPER;
            if (code < LOWER + 26) return code - LOWER + 26;
        };

        var toString = function toString(fontfile) {
            var strings = [];
            for (var i = 0, length = fontfile.length; i < length; i++) {
                strings.push(String.fromCharCode(fontfile[i]));
            }
            return strings.join('');
        };

        var makeWidths = function makeWidths(font) {
            var widths = [];
            for (var i = 0; i < 256; i++) {
                widths[i] = 0;
            }
            var scale = 1000.0 / font.head.unitsPerEm;
            var codeMap = font.cmap.unicode.codeMap;
            var WinAnsiEncoding = {
                402: 131,
                8211: 150,
                8212: 151,
                8216: 145,
                8217: 146,
                8218: 130,
                8220: 147,
                8221: 148,
                8222: 132,
                8224: 134,
                8225: 135,
                8226: 149,
                8230: 133,
                8364: 128,
                8240: 137,
                8249: 139,
                8250: 155,
                710: 136,
                8482: 153,
                338: 140,
                339: 156,
                732: 152,
                352: 138,
                353: 154,
                376: 159,
                381: 142,
                382: 158
            };

            Object.keys(codeMap).map(function (key) {
                var WinAnsiEncodingValue = WinAnsiEncoding[key];
                var AssignedValue = Math.round(font.hmtx.metrics[codeMap[key]].advance * scale);
                if (WinAnsiEncodingValue) {
                    widths[WinAnsiEncodingValue] = AssignedValue;
                } else if (key < 256) {
                    widths[key] = AssignedValue;
                }
            });
            return widths;
        };

        var toUnicodeCmap = function toUnicodeCmap(map) {
            var code, codes, range, unicode, unicodeMap, _i, _len;
            unicodeMap = '/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo <<\n  /Registry (Adobe)\n  /Ordering (UCS)\n  /Supplement 0\n>> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<00><ff>\nendcodespacerange';
            codes = Object.keys(map).sort(function (a, b) {
                return a - b;
            });
            range = [];
            for (_i = 0, _len = codes.length; _i < _len; _i++) {
                code = codes[_i];
                if (range.length >= 100) {
                    unicodeMap += "\n" + range.length + " beginbfchar\n" + range.join('\n') + "\nendbfchar";
                    range = [];
                }
                unicode = ('0000' + map[code].toString(16)).slice(-4);
                code = (+code).toString(16);
                range.push("<" + code + "><" + unicode + ">");
            }
            if (range.length) {
                unicodeMap += "\n" + range.length + " beginbfchar\n" + range.join('\n') + "\nendbfchar\n";
            }
            unicodeMap += 'endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend';
            return unicodeMap;
        };

        var reverseString = function reverseString(s) {
            return s.split("").reverse().join("");
        };

        return TTFFont;
    }();

    var Data = function () {
        function Data(data) {
            this.data = data !== undefined ? data : [];
            this.pos = 0;
            this.length = this.data.length;
        }
        Data.prototype.readByte = function () {
            return this.data[this.pos++];
        };
        Data.prototype.writeByte = function (byte) {
            this.data[this.pos++] = byte;
            return this;
        };
        Data.prototype.readUInt32 = function () {
            var b1, b2, b3, b4;
            b1 = this.readByte() * 0x1000000;
            b2 = this.readByte() << 16;
            b3 = this.readByte() << 8;
            b4 = this.readByte();
            return b1 + b2 + b3 + b4;
        };
        Data.prototype.writeUInt32 = function (val) {
            this.writeByte(val >>> 24 & 0xff);
            this.writeByte(val >> 16 & 0xff);
            this.writeByte(val >> 8 & 0xff);
            return this.writeByte(val & 0xff);
        };
        Data.prototype.readInt32 = function () {
            var int;
            int = this.readUInt32();
            if (int >= 0x80000000) {
                return int - 0x100000000;
            } else {
                return int;
            }
        };
        Data.prototype.writeInt32 = function (val) {
            if (val < 0) {
                val += 0x100000000;
            }
            return this.writeUInt32(val);
        };
        Data.prototype.readUInt16 = function () {
            var b1, b2;
            b1 = this.readByte() << 8;
            b2 = this.readByte();
            return b1 | b2;
        };
        Data.prototype.writeUInt16 = function (val) {
            this.writeByte(val >> 8 & 0xff);
            return this.writeByte(val & 0xff);
        };
        Data.prototype.readInt16 = function () {
            var int;
            int = this.readUInt16();
            if (int >= 0x8000) {
                return int - 0x10000;
            } else {
                return int;
            }
        };
        Data.prototype.writeInt16 = function (val) {
            if (val < 0) {
                val += 0x10000;
            }
            return this.writeUInt16(val);
        };
        Data.prototype.readString = function (length) {
            var i, ret, _i;
            ret = [];
            for (i = _i = 0; 0 <= length ? _i < length : _i > length; i = 0 <= length ? ++_i : --_i) {
                ret[i] = String.fromCharCode(this.readByte());
            }
            return ret.join('');
        };
        Data.prototype.writeString = function (val) {
            var i, _i, _ref, _results;
            _results = [];
            for (i = _i = 0, _ref = val.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                _results.push(this.writeByte(val.charCodeAt(i)));
            }
            return _results;
        };
        Data.prototype.stringAt = function (pos, length) {
            this.pos = pos;
            return this.readString(length);
        };
        Data.prototype.readShort = function () {
            return this.readInt16();
        };
        Data.prototype.writeShort = function (val) {
            return this.writeInt16(val);
        };
        Data.prototype.readLongLong = function () {
            var b1, b2, b3, b4, b5, b6, b7, b8;
            b1 = this.readByte();
            b2 = this.readByte();
            b3 = this.readByte();
            b4 = this.readByte();
            b5 = this.readByte();
            b6 = this.readByte();
            b7 = this.readByte();
            b8 = this.readByte();
            if (b1 & 0x80) {
                return ((b1 ^ 0xff) * 0x100000000000000 + (b2 ^ 0xff) * 0x1000000000000 + (b3 ^ 0xff) * 0x10000000000 + (b4 ^ 0xff) * 0x100000000 + (b5 ^ 0xff) * 0x1000000 + (b6 ^ 0xff) * 0x10000 + (b7 ^ 0xff) * 0x100 + (b8 ^ 0xff) + 1) * -1;
            }
            return b1 * 0x100000000000000 + b2 * 0x1000000000000 + b3 * 0x10000000000 + b4 * 0x100000000 + b5 * 0x1000000 + b6 * 0x10000 + b7 * 0x100 + b8;
        };
        Data.prototype.writeLongLong = function (val) {
            var high, low;
            high = Math.floor(val / 0x100000000);
            low = val & 0xffffffff;
            this.writeByte(high >> 24 & 0xff);
            this.writeByte(high >> 16 & 0xff);
            this.writeByte(high >> 8 & 0xff);
            this.writeByte(high & 0xff);
            this.writeByte(low >> 24 & 0xff);
            this.writeByte(low >> 16 & 0xff);
            this.writeByte(low >> 8 & 0xff);
            return this.writeByte(low & 0xff);
        };
        Data.prototype.readInt = function () {
            return this.readInt32();
        };
        Data.prototype.writeInt = function (val) {
            return this.writeInt32(val);
        };
        Data.prototype.slice = function (start, end) {
            return this.data.slice(start, end);
        };
        Data.prototype.read = function (bytes) {
            var buf, i, _i;
            buf = [];
            for (i = _i = 0; 0 <= bytes ? _i < bytes : _i > bytes; i = 0 <= bytes ? ++_i : --_i) {
                buf.push(this.readByte());
            }
            return buf;
        };
        Data.prototype.write = function (bytes) {
            var byte, _i, _len, _results;
            _results = [];
            for (_i = 0, _len = bytes.length; _i < _len; _i++) {
                byte = bytes[_i];
                _results.push(this.writeByte(byte));
            }
            return _results;
        };
        return Data;
    }();

    var Directory = function () {
        var checksum;

        function Directory(data) {
            var entry, i, _i, _ref;
            this.scalarType = data.readInt();
            this.tableCount = data.readShort();
            this.searchRange = data.readShort();
            this.entrySelector = data.readShort();
            this.rangeShift = data.readShort();
            this.tables = {};
            for (i = _i = 0, _ref = this.tableCount; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                entry = {
                    tag: data.readString(4),
                    checksum: data.readInt(),
                    offset: data.readInt(),
                    length: data.readInt()
                };
                this.tables[entry.tag] = entry;
            }
        }
        Directory.prototype.encode = function (tables) {
            var adjustment, directory, directoryLength, entrySelector, headOffset, log2, offset, rangeShift, searchRange, sum, table, tableCount, tableData, tag;
            tableCount = Object.keys(tables).length;
            log2 = Math.log(2);
            searchRange = Math.floor(Math.log(tableCount) / log2) * 16;
            entrySelector = Math.floor(searchRange / log2);
            rangeShift = tableCount * 16 - searchRange;
            directory = new Data();
            directory.writeInt(this.scalarType);
            directory.writeShort(tableCount);
            directory.writeShort(searchRange);
            directory.writeShort(entrySelector);
            directory.writeShort(rangeShift);
            directoryLength = tableCount * 16;
            offset = directory.pos + directoryLength;
            headOffset = null;
            tableData = [];
            for (tag in tables) {
                if (Object.prototype.hasOwnProperty.call(tables, tag)) {
                    table = tables[tag];
                    directory.writeString(tag);
                    directory.writeInt(checksum(table));
                    directory.writeInt(offset);
                    directory.writeInt(table.length);
                    tableData = tableData.concat(table);
                    if (tag === 'head') {
                        headOffset = offset;
                    }
                    offset += table.length;
                    while (offset % 4) {
                        tableData.push(0);
                        offset++;
                    }
                }
            }
            directory.write(tableData);
            sum = checksum(directory.data);
            adjustment = 0xB1B0AFBA - sum;
            directory.pos = headOffset + 8;
            directory.writeUInt32(adjustment);
            return directory.data;
        };
        checksum = function checksum(data) {
            var i, sum, tmp, _i, _ref;
            data = __slice.call(data);
            while (data.length % 4) {
                data.push(0);
            }
            tmp = new Data(data);
            sum = 0;
            for (i = _i = 0, _ref = data.length; _i < _ref; i = _i += 4) {
                sum += tmp.readUInt32();
            }
            return sum & 0xFFFFFFFF;
        };
        return Directory;
    }();

    var __slice = [].slice;

    var __extends = function __extends(child, parent) {
        for (var key in parent) {
            if ({}.hasOwnProperty.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };

    var Table = function () {
        function Table(file) {
            var info;
            this.file = file;
            info = this.file.directory.tables[this.tag];
            this.exists = !!info;
            if (info) {
                this.offset = info.offset;
                this.length = info.length;
                this.parse(this.file.contents);
            }
        }
        Table.prototype.parse = function () {};
        Table.prototype.encode = function () {};
        Table.prototype.raw = function () {
            if (!this.exists) {
                return null;
            }
            this.file.contents.pos = this.offset;
            return this.file.contents.read(this.length);
        };
        return Table;
    }();

    var HeadTable = function (_super) {
        __extends(HeadTable, _super);

        function HeadTable() {
            return HeadTable.__super__.constructor.apply(this, arguments);
        }

        HeadTable.prototype.tag = 'head';

        HeadTable.prototype.parse = function (data) {
            data.pos = this.offset;
            this.version = data.readInt();
            this.revision = data.readInt();
            this.checkSumAdjustment = data.readInt();
            this.magicNumber = data.readInt();
            this.flags = data.readShort();
            this.unitsPerEm = data.readShort();
            this.created = data.readLongLong();
            this.modified = data.readLongLong();
            this.xMin = data.readShort();
            this.yMin = data.readShort();
            this.xMax = data.readShort();
            this.yMax = data.readShort();
            this.macStyle = data.readShort();
            this.lowestRecPPEM = data.readShort();
            this.fontDirectionHint = data.readShort();
            this.indexToLocFormat = data.readShort();
            this.glyphDataFormat = data.readShort();
            return this;
        };

        HeadTable.prototype.encode = function (loca) {
            var table;
            table = new Data();
            table.writeInt(this.version);
            table.writeInt(this.revision);
            table.writeInt(this.checkSumAdjustment);
            table.writeInt(this.magicNumber);
            table.writeShort(this.flags);
            table.writeShort(this.unitsPerEm);
            table.writeLongLong(this.created);
            table.writeLongLong(this.modified);
            table.writeShort(this.xMin);
            table.writeShort(this.yMin);
            table.writeShort(this.xMax);
            table.writeShort(this.yMax);
            table.writeShort(this.macStyle);
            table.writeShort(this.lowestRecPPEM);
            table.writeShort(this.fontDirectionHint);
            table.writeShort(loca.type);
            table.writeShort(this.glyphDataFormat);
            return table.data;
        };

        return HeadTable;
    }(Table);

    var CmapTable = function (_super) {
        __extends(CmapTable, _super);

        function CmapTable() {
            return CmapTable.__super__.constructor.apply(this, arguments);
        }

        CmapTable.prototype.tag = 'cmap';

        CmapTable.prototype.parse = function (data) {
            var entry, i, tableCount, _i;
            data.pos = this.offset;
            this.version = data.readUInt16();
            tableCount = data.readUInt16();
            this.tables = [];
            for (i = _i = 0; 0 <= tableCount ? _i < tableCount : _i > tableCount; i = 0 <= tableCount ? ++_i : --_i) {
                entry = new CmapEntry(data, this.offset);
                this.tables.push(entry);
                if (entry.isUnicode) {
                    if (this.unicode === undefined) {
                        this.unicode = entry;
                    }
                }
            }
            return true;
        };

        CmapTable.encode = function (charmap, encoding) {
            var result, table;
            if (encoding === undefined) {
                encoding = 'macroman';
            }
            result = CmapEntry.encode(charmap, encoding);
            table = new Data();
            table.writeUInt16(0);
            table.writeUInt16(1);
            result.table = table.data.concat(result.subtable);
            return result;
        };

        return CmapTable;
    }(Table);

    var CmapEntry = function () {
        function CmapEntry(data, offset) {
            var code, count, endCode, glyphId, glyphIds, i, idDelta, idRangeOffset, index, saveOffset, segCount, segCountX2, start, startCode, tail, _i, _j, _k, _len;
            this.platformID = data.readUInt16();
            this.encodingID = data.readShort();
            this.offset = offset + data.readInt();
            saveOffset = data.pos;
            data.pos = this.offset;
            this.format = data.readUInt16();
            this.length = data.readUInt16();
            this.language = data.readUInt16();
            this.isUnicode = this.platformID === 3 && this.encodingID === 1 && this.format === 4 || this.platformID === 0 && this.format === 4;
            this.codeMap = {};
            switch (this.format) {
                case 0:
                    for (i = _i = 0; _i < 256; i = ++_i) {
                        this.codeMap[i] = data.readByte();
                    }
                    break;
                case 4:
                    segCountX2 = data.readUInt16();
                    segCount = segCountX2 / 2;
                    data.pos += 6;
                    endCode = function () {
                        var _j, _results;
                        _results = [];
                        for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
                            _results.push(data.readUInt16());
                        }
                        return _results;
                    }();
                    data.pos += 2;
                    startCode = function () {
                        var _j, _results;
                        _results = [];
                        for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
                            _results.push(data.readUInt16());
                        }
                        return _results;
                    }();
                    idDelta = function () {
                        var _j, _results;
                        _results = [];
                        for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
                            _results.push(data.readUInt16());
                        }
                        return _results;
                    }();
                    idRangeOffset = function () {
                        var _j, _results;
                        _results = [];
                        for (i = _j = 0; 0 <= segCount ? _j < segCount : _j > segCount; i = 0 <= segCount ? ++_j : --_j) {
                            _results.push(data.readUInt16());
                        }
                        return _results;
                    }();
                    count = (this.length - data.pos + this.offset) / 2;
                    glyphIds = function () {
                        var _j, _results;
                        _results = [];
                        for (i = _j = 0; 0 <= count ? _j < count : _j > count; i = 0 <= count ? ++_j : --_j) {
                            _results.push(data.readUInt16());
                        }
                        return _results;
                    }();
                    for (i = _j = 0, _len = endCode.length; _j < _len; i = ++_j) {
                        tail = endCode[i];
                        start = startCode[i];
                        for (code = _k = start; start <= tail ? _k <= tail : _k >= tail; code = start <= tail ? ++_k : --_k) {
                            if (idRangeOffset[i] === 0) {
                                glyphId = code + idDelta[i];
                            } else {
                                index = idRangeOffset[i] / 2 + (code - start) - (segCount - i);
                                glyphId = glyphIds[index] || 0;
                                if (glyphId !== 0) {
                                    glyphId += idDelta[i];
                                }
                            }
                            this.codeMap[code] = glyphId & 0xFFFF;
                        }
                    }
            }
            data.pos = saveOffset;
        }

        CmapEntry.encode = function (charmap, encoding) {
            var charMap, code, codeMap, codes, delta, deltas, diff, endCode, endCodes, entrySelector, glyphIDs, i, id, indexes, last, map, nextID, offset, old, rangeOffsets, rangeShift, result, searchRange, segCount, segCountX2, startCode, startCodes, startGlyph, subtable, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _len5, _len6, _len7, _m, _n, _name, _o, _p, _q;
            subtable = new Data();
            codes = Object.keys(charmap).sort(function (a, b) {
                return a - b;
            });
            switch (encoding) {
                case 'macroman':
                    id = 0;
                    indexes = function () {
                        var _i, _results;
                        _results = [];
                        for (i = _i = 0; _i < 256; i = ++_i) {
                            _results.push(0);
                        }
                        return _results;
                    }();
                    map = {
                        0: 0
                    };
                    codeMap = {};
                    for (_i = 0, _len = codes.length; _i < _len; _i++) {
                        code = codes[_i];
                        if (map[_name = charmap[code]] === undefined) {
                            map[_name] = ++id;
                        }
                        codeMap[code] = {
                            old: charmap[code],
                            "new": map[charmap[code]]
                        };
                        indexes[code] = map[charmap[code]];
                    }
                    subtable.writeUInt16(1);
                    subtable.writeUInt16(0);
                    subtable.writeUInt32(12);
                    subtable.writeUInt16(0);
                    subtable.writeUInt16(262);
                    subtable.writeUInt16(0);
                    subtable.write(indexes);
                    result = {
                        charMap: codeMap,
                        subtable: subtable.data,
                        maxGlyphID: id + 1
                    };
                    return result;
                case 'unicode':
                    startCodes = [];
                    endCodes = [];
                    nextID = 0;
                    map = {};
                    charMap = {};
                    for (_j = 0, _len1 = codes.length; _j < _len1; _j++) {
                        code = codes[_j];
                        old = charmap[code];
                        if (map[old] === undefined) {
                            map[old] = ++nextID;
                        }
                        charMap[code] = {
                            old: old,
                            "new": map[old]
                        };
                        delta = map[old] - code;
                        if (last === undefined || delta !== diff) {
                            if (last) {
                                endCodes.push(last);
                            }
                            startCodes.push(code);
                            diff = delta;
                        }
                        last = code;
                    }
                    if (last) {
                        endCodes.push(last);
                    }
                    endCodes.push(0xFFFF);
                    startCodes.push(0xFFFF);
                    segCount = startCodes.length;
                    segCountX2 = segCount * 2;
                    searchRange = 2 * Math.pow(Math.log(segCount) / Math.LN2, 2);
                    entrySelector = Math.log(searchRange / 2) / Math.LN2;
                    rangeShift = 2 * segCount - searchRange;
                    deltas = [];
                    rangeOffsets = [];
                    glyphIDs = [];
                    for (i = _k = 0, _len2 = startCodes.length; _k < _len2; i = ++_k) {
                        startCode = startCodes[i];
                        endCode = endCodes[i];
                        if (startCode === 0xFFFF) {
                            deltas.push(0);
                            rangeOffsets.push(0);
                            break;
                        }
                        startGlyph = charMap[startCode]["new"];
                        if (startCode - startGlyph >= 0x8000) {
                            deltas.push(0);
                            rangeOffsets.push(2 * (glyphIDs.length + segCount - i));
                            for (code = _l = startCode; startCode <= endCode ? _l <= endCode : _l >= endCode; code = startCode <= endCode ? ++_l : --_l) {
                                glyphIDs.push(charMap[code]["new"]);
                            }
                        } else {
                            deltas.push(startGlyph - startCode);
                            rangeOffsets.push(0);
                        }
                    }
                    subtable.writeUInt16(3);
                    subtable.writeUInt16(1);
                    subtable.writeUInt32(12);
                    subtable.writeUInt16(4);
                    subtable.writeUInt16(16 + segCount * 8 + glyphIDs.length * 2);
                    subtable.writeUInt16(0);
                    subtable.writeUInt16(segCountX2);
                    subtable.writeUInt16(searchRange);
                    subtable.writeUInt16(entrySelector);
                    subtable.writeUInt16(rangeShift);
                    for (_m = 0, _len3 = endCodes.length; _m < _len3; _m++) {
                        code = endCodes[_m];
                        subtable.writeUInt16(code);
                    }
                    subtable.writeUInt16(0);
                    for (_n = 0, _len4 = startCodes.length; _n < _len4; _n++) {
                        code = startCodes[_n];
                        subtable.writeUInt16(code);
                    }
                    for (_o = 0, _len5 = deltas.length; _o < _len5; _o++) {
                        delta = deltas[_o];
                        subtable.writeUInt16(delta);
                    }
                    for (_p = 0, _len6 = rangeOffsets.length; _p < _len6; _p++) {
                        offset = rangeOffsets[_p];
                        subtable.writeUInt16(offset);
                    }
                    for (_q = 0, _len7 = glyphIDs.length; _q < _len7; _q++) {
                        id = glyphIDs[_q];
                        subtable.writeUInt16(id);
                    }
                    result = {
                        charMap: charMap,
                        subtable: subtable.data,
                        maxGlyphID: nextID + 1
                    };
                    return result;
            }
        };

        return CmapEntry;
    }();

    var HheaTable = function (_super) {
        __extends(HheaTable, _super);

        function HheaTable() {
            return HheaTable.__super__.constructor.apply(this, arguments);
        }

        HheaTable.prototype.tag = 'hhea';

        HheaTable.prototype.parse = function (data) {
            data.pos = this.offset;
            this.version = data.readInt();
            this.ascender = data.readShort();
            this.decender = data.readShort();
            this.lineGap = data.readShort();
            this.advanceWidthMax = data.readShort();
            this.minLeftSideBearing = data.readShort();
            this.minRightSideBearing = data.readShort();
            this.xMaxExtent = data.readShort();
            this.caretSlopeRise = data.readShort();
            this.caretSlopeRun = data.readShort();
            this.caretOffset = data.readShort();
            data.pos += 4 * 2;
            this.metricDataFormat = data.readShort();
            this.numberOfMetrics = data.readUInt16();
            return this;
        };

        HheaTable.prototype.encode = function (ids) {
            var i, table, _i, _ref;
            table = new Data();
            table.writeInt(this.version);
            table.writeShort(this.ascender);
            table.writeShort(this.decender);
            table.writeShort(this.lineGap);
            table.writeShort(this.advanceWidthMax);
            table.writeShort(this.minLeftSideBearing);
            table.writeShort(this.minRightSideBearing);
            table.writeShort(this.xMaxExtent);
            table.writeShort(this.caretSlopeRise);
            table.writeShort(this.caretSlopeRun);
            table.writeShort(this.caretOffset);
            for (i = _i = 0, _ref = 4 * 2; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                table.writeByte(0);
            }
            table.writeShort(this.metricDataFormat);
            table.writeUInt16(ids.length);
            return table.data;
        };

        return HheaTable;
    }(Table);

    var OS2Table = function (_super) {
        __extends(OS2Table, _super);

        function OS2Table() {
            return OS2Table.__super__.constructor.apply(this, arguments);
        }

        OS2Table.prototype.tag = 'OS/2';

        OS2Table.prototype.parse = function (data) {
            var i;
            data.pos = this.offset;
            this.version = data.readUInt16();
            this.averageCharWidth = data.readShort();
            this.weightClass = data.readUInt16();
            this.widthClass = data.readUInt16();
            this.type = data.readShort();
            this.ySubscriptXSize = data.readShort();
            this.ySubscriptYSize = data.readShort();
            this.ySubscriptXOffset = data.readShort();
            this.ySubscriptYOffset = data.readShort();
            this.ySuperscriptXSize = data.readShort();
            this.ySuperscriptYSize = data.readShort();
            this.ySuperscriptXOffset = data.readShort();
            this.ySuperscriptYOffset = data.readShort();
            this.yStrikeoutSize = data.readShort();
            this.yStrikeoutPosition = data.readShort();
            this.familyClass = data.readShort();
            this.panose = function () {
                var _i, _results;
                _results = [];
                for (i = _i = 0; _i < 10; i = ++_i) {
                    _results.push(data.readByte());
                }
                return _results;
            }();
            this.charRange = function () {
                var _i, _results;
                _results = [];
                for (i = _i = 0; _i < 4; i = ++_i) {
                    _results.push(data.readInt());
                }
                return _results;
            }();
            this.vendorID = data.readString(4);
            this.selection = data.readShort();
            this.firstCharIndex = data.readShort();
            this.lastCharIndex = data.readShort();
            if (this.version > 0) {
                this.ascent = data.readShort();
                this.descent = data.readShort();
                this.lineGap = data.readShort();
                this.winAscent = data.readShort();
                this.winDescent = data.readShort();
                this.codePageRange = function () {
                    var _i, _results;
                    _results = [];
                    for (i = _i = 0; _i < 2; i = ++_i) {
                        _results.push(data.readInt());
                    }
                    return _results;
                }();
                if (this.version > 1) {
                    this.xHeight = data.readShort();
                    this.capHeight = data.readShort();
                    this.defaultChar = data.readShort();
                    this.breakChar = data.readShort();
                    this.maxContext = data.readShort();
                    return this;
                }
            }
        };

        OS2Table.prototype.encode = function () {
            return this.raw();
        };

        return OS2Table;
    }(Table);

    var PostTable = function (_super) {
        var POSTSCRIPT_GLYPHS;

        __extends(PostTable, _super);

        function PostTable() {
            return PostTable.__super__.constructor.apply(this, arguments);
        }

        PostTable.prototype.tag = 'post';

        PostTable.prototype.parse = function (data) {
            var i, length, numberOfGlyphs, _i, _results;
            data.pos = this.offset;
            this.format = data.readInt();
            this.italicAngle = data.readInt();
            this.underlinePosition = data.readShort();
            this.underlineThickness = data.readShort();
            this.isFixedPitch = data.readInt();
            this.minMemType42 = data.readInt();
            this.maxMemType42 = data.readInt();
            this.minMemType1 = data.readInt();
            this.maxMemType1 = data.readInt();
            switch (this.format) {
                case 0x00010000:
                    break;
                case 0x00020000:
                    numberOfGlyphs = data.readUInt16();
                    this.glyphNameIndex = [];
                    for (i = _i = 0; 0 <= numberOfGlyphs ? _i < numberOfGlyphs : _i > numberOfGlyphs; i = 0 <= numberOfGlyphs ? ++_i : --_i) {
                        this.glyphNameIndex.push(data.readUInt16());
                    }
                    this.names = [];
                    _results = [];
                    while (data.pos < this.offset + this.length) {
                        length = data.readByte();
                        _results.push(this.names.push(data.readString(length)));
                    }
                    return _results;
                case 0x00025000:
                    numberOfGlyphs = data.readUInt16();
                    this.offsets = data.read(numberOfGlyphs);
                    return this.offsets;
                case 0x00030000:
                    break;
                case 0x00040000:
                    this.map = function () {
                        var _j, _ref, _results1;
                        _results1 = [];
                        for (i = _j = 0, _ref = this.file.maxp.numGlyphs; 0 <= _ref ? _j < _ref : _j > _ref; i = 0 <= _ref ? ++_j : --_j) {
                            _results1.push(data.readUInt32());
                        }
                        return _results1;
                    }.call(this);
                    return this.map;
            }
        };

        PostTable.prototype.glyphFor = function (code) {
            var index;
            switch (this.format) {
                case 0x00010000:
                    return POSTSCRIPT_GLYPHS[code] || '.notdef';
                case 0x00020000:
                    index = this.glyphNameIndex[code];
                    return index <= 257 ? POSTSCRIPT_GLYPHS[index] : this.names[index - 258] || '.notdef';
                case 0x00025000:
                    return POSTSCRIPT_GLYPHS[code + this.offsets[code]] || '.notdef';
                case 0x00030000:
                    return '.notdef';
                case 0x00040000:
                    return this.map[code] || 0xFFFF;
            }
        };

        PostTable.prototype.encode = function (mapping) {
            var id, index, indexes, position, post, raw, string, strings, table, _i, _j, _k, _len, _len1, _len2;
            if (!this.exists) {
                return null;
            }
            raw = this.raw();
            if (this.format === 0x00030000) {
                return raw;
            }
            table = new Data(raw.slice(0, 32));
            table.writeUInt32(0x00020000);
            table.pos = 32;
            indexes = [];
            strings = [];
            for (_i = 0, _len = mapping.length; _i < _len; _i++) {
                id = mapping[_i];
                post = this.glyphFor(id);
                position = POSTSCRIPT_GLYPHS.indexOf(post);
                if (position !== -1) {
                    indexes.push(position);
                } else {
                    indexes.push(257 + strings.length);
                    strings.push(post);
                }
            }
            table.writeUInt16(Object.keys(mapping).length);
            for (_j = 0, _len1 = indexes.length; _j < _len1; _j++) {
                index = indexes[_j];
                table.writeUInt16(index);
            }
            for (_k = 0, _len2 = strings.length; _k < _len2; _k++) {
                string = strings[_k];
                table.writeByte(string.length);
                table.writeString(string);
            }
            return table.data;
        };

        POSTSCRIPT_GLYPHS = '.notdef .null nonmarkingreturn space exclam quotedbl numbersign dollar percent\nampersand quotesingle parenleft parenright asterisk plus comma hyphen period slash\nzero one two three four five six seven eight nine colon semicolon less equal greater\nquestion at A B C D E F G H I J K L M N O P Q R S T U V W X Y Z\nbracketleft backslash bracketright asciicircum underscore grave\na b c d e f g h i j k l m n o p q r s t u v w x y z\nbraceleft bar braceright asciitilde Adieresis Aring Ccedilla Eacute Ntilde Odieresis\nUdieresis aacute agrave acircumflex adieresis atilde aring ccedilla eacute egrave\necircumflex edieresis iacute igrave icircumflex idieresis ntilde oacute ograve\nocircumflex odieresis otilde uacute ugrave ucircumflex udieresis dagger degree cent\nsterling section bullet paragraph germandbls registered copyright trademark acute\ndieresis notequal AE Oslash infinity plusminus lessequal greaterequal yen mu\npartialdiff summation product pi integral ordfeminine ordmasculine Omega ae oslash\nquestiondown exclamdown logicalnot radical florin approxequal Delta guillemotleft\nguillemotright ellipsis nonbreakingspace Agrave Atilde Otilde OE oe endash emdash\nquotedblleft quotedblright quoteleft quoteright divide lozenge ydieresis Ydieresis\nfraction currency guilsinglleft guilsinglright fi fl daggerdbl periodcentered\nquotesinglbase quotedblbase perthousand Acircumflex Ecircumflex Aacute Edieresis\nEgrave Iacute Icircumflex Idieresis Igrave Oacute Ocircumflex apple Ograve Uacute\nUcircumflex Ugrave dotlessi circumflex tilde macron breve dotaccent ring cedilla\nhungarumlaut ogonek caron Lslash lslash Scaron scaron Zcaron zcaron brokenbar Eth\neth Yacute yacute Thorn thorn minus multiply onesuperior twosuperior threesuperior\nonehalf onequarter threequarters franc Gbreve gbreve Idotaccent Scedilla scedilla\nCacute cacute Ccaron ccaron dcroat'.split(/\s+/g);

        return PostTable;
    }(Table);

    var NameEntry = function () {
        function NameEntry(raw, entry) {
            this.raw = raw;
            this.length = raw.length;
            this.platformID = entry.platformID;
            this.encodingID = entry.encodingID;
            this.languageID = entry.languageID;
        }

        return NameEntry;
    }();

    var NameTable = function (_super) {
        var subsetTag;

        __extends(NameTable, _super);

        function NameTable() {
            return NameTable.__super__.constructor.apply(this, arguments);
        }

        NameTable.prototype.tag = 'name';

        NameTable.prototype.parse = function (data) {
            var count, entries, entry, format, i, name, stringOffset, strings, text, _i, _j, _len, _name;
            data.pos = this.offset;
            format = data.readShort();
            count = data.readShort();
            stringOffset = data.readShort();
            entries = [];
            for (i = _i = 0; 0 <= count ? _i < count : _i > count; i = 0 <= count ? ++_i : --_i) {
                entries.push({
                    platformID: data.readShort(),
                    encodingID: data.readShort(),
                    languageID: data.readShort(),
                    nameID: data.readShort(),
                    length: data.readShort(),
                    offset: this.offset + stringOffset + data.readShort()
                });
            }
            strings = {};
            for (i = _j = 0, _len = entries.length; _j < _len; i = ++_j) {
                entry = entries[i];
                data.pos = entry.offset;
                text = data.readString(entry.length);
                name = new NameEntry(text, entry);
                if (strings[_name = entry.nameID] === undefined) {
                    strings[_name] = [];
                }
                strings[entry.nameID].push(name);
            }
            this.strings = strings;
            this.copyright = strings[0];
            this.fontFamily = strings[1];
            this.fontSubfamily = strings[2];
            this.uniqueSubfamily = strings[3];
            this.fontName = strings[4];
            this.version = strings[5];
            this.postscriptName = strings[6][0].raw.replace(/[\x00-\x19\x80-\xff]/g, "");
            this.trademark = strings[7];
            this.manufacturer = strings[8];
            this.designer = strings[9];
            this.description = strings[10];
            this.vendorUrl = strings[11];
            this.designerUrl = strings[12];
            this.license = strings[13];
            this.licenseUrl = strings[14];
            this.preferredFamily = strings[15];
            this.preferredSubfamily = strings[17];
            this.compatibleFull = strings[18];
            this.sampleText = strings[19];
            return this;
        };

        subsetTag = "AAAAAA";

        NameTable.prototype.encode = function () {
            var id, list, nameID, nameTable, postscriptName, strCount, strTable, string, strings, table, val, _i, _len, _ref;
            strings = {};
            _ref = this.strings;
            for (id in _ref) {
                if (Object.prototype.hasOwnProperty.call(_ref, id)) {
                    val = _ref[id];
                    strings[id] = val;
                }
            }
            postscriptName = new NameEntry("" + subsetTag + "+" + this.postscriptName, {
                platformID: 1,
                encodingID: 0,
                languageID: 0
            });
            strings[6] = [postscriptName];
            subsetTag = successorOf(subsetTag);
            strCount = 0;
            for (id in strings) {
                if (Object.prototype.hasOwnProperty.call(strings, id)) {
                    list = strings[id];
                    if (list !== null) {
                        strCount += list.length;
                    }
                }
            }
            table = new Data();
            strTable = new Data();
            table.writeShort(0);
            table.writeShort(strCount);
            table.writeShort(6 + 12 * strCount);
            for (nameID in strings) {
                if (Object.prototype.hasOwnProperty.call(strings, nameID)) {
                    list = strings[nameID];
                    if (list !== null) {
                        for (_i = 0, _len = list.length; _i < _len; _i++) {
                            string = list[_i];
                            table.writeShort(string.platformID);
                            table.writeShort(string.encodingID);
                            table.writeShort(string.languageID);
                            table.writeShort(nameID);
                            table.writeShort(string.length);
                            table.writeShort(strTable.pos);
                            strTable.writeString(string.raw);
                        }
                    }
                }
            }
            nameTable = {
                postscriptName: postscriptName.raw,
                table: table.data.concat(strTable.data)
            };
            return nameTable;
        };

        return NameTable;
    }(Table);

    var successorOf = function successorOf(input) {
        var added, alphabet, carry, i, index, isUpperCase, last, length, next, result;
        alphabet = 'abcdefghijklmnopqrstuvwxyz';
        length = alphabet.length;
        result = input;
        i = input.length;
        while (i >= 0) {
            last = input.charAt(--i);
            if (isNaN(last)) {
                index = alphabet.indexOf(last.toLowerCase());
                if (index === -1) {
                    next = last;
                    carry = true;
                } else {
                    next = alphabet.charAt((index + 1) % length);
                    isUpperCase = last === last.toUpperCase();
                    if (isUpperCase) {
                        next = next.toUpperCase();
                    }
                    carry = index + 1 >= length;
                    if (carry && i === 0) {
                        added = isUpperCase ? 'A' : 'a';
                        result = added + next + result.slice(1);
                        break;
                    }
                }
            } else {
                next = +last + 1;
                carry = next > 9;
                if (carry) {
                    next = 0;
                }
                if (carry && i === 0) {
                    result = '1' + next + result.slice(1);
                    break;
                }
            }
            result = result.slice(0, i) + next + result.slice(i + 1);
            if (!carry) {
                break;
            }
        }
        return result;
    };

    var MaxpTable = function (_super) {
        __extends(MaxpTable, _super);

        function MaxpTable() {
            return MaxpTable.__super__.constructor.apply(this, arguments);
        }

        MaxpTable.prototype.tag = 'maxp';

        MaxpTable.prototype.parse = function (data) {
            data.pos = this.offset;
            this.version = data.readInt();
            this.numGlyphs = data.readUInt16();
            this.maxPoints = data.readUInt16();
            this.maxContours = data.readUInt16();
            this.maxCompositePoints = data.readUInt16();
            this.maxComponentContours = data.readUInt16();
            this.maxZones = data.readUInt16();
            this.maxTwilightPoints = data.readUInt16();
            this.maxStorage = data.readUInt16();
            this.maxFunctionDefs = data.readUInt16();
            this.maxInstructionDefs = data.readUInt16();
            this.maxStackElements = data.readUInt16();
            this.maxSizeOfInstructions = data.readUInt16();
            this.maxComponentElements = data.readUInt16();
            this.maxComponentDepth = data.readUInt16();
            return this;
        };

        MaxpTable.prototype.encode = function (ids) {
            var table;
            table = new Data();
            table.writeInt(this.version);
            table.writeUInt16(ids.length);
            table.writeUInt16(this.maxPoints);
            table.writeUInt16(this.maxContours);
            table.writeUInt16(this.maxCompositePoints);
            table.writeUInt16(this.maxComponentContours);
            table.writeUInt16(this.maxZones);
            table.writeUInt16(this.maxTwilightPoints);
            table.writeUInt16(this.maxStorage);
            table.writeUInt16(this.maxFunctionDefs);
            table.writeUInt16(this.maxInstructionDefs);
            table.writeUInt16(this.maxStackElements);
            table.writeUInt16(this.maxSizeOfInstructions);
            table.writeUInt16(this.maxComponentElements);
            table.writeUInt16(this.maxComponentDepth);
            return table.data;
        };

        return MaxpTable;
    }(Table);

    var HmtxTable = function (_super) {
        __extends(HmtxTable, _super);

        function HmtxTable() {
            return HmtxTable.__super__.constructor.apply(this, arguments);
        }

        HmtxTable.prototype.tag = 'hmtx';

        HmtxTable.prototype.parse = function (data) {
            var i, last, lsbCount, m, _i, _j, _ref, _results;
            data.pos = this.offset;
            this.metrics = [];
            for (i = _i = 0, _ref = this.file.hhea.numberOfMetrics; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                this.metrics.push({
                    advance: data.readUInt16(),
                    lsb: data.readInt16()
                });
            }
            lsbCount = this.file.maxp.numGlyphs - this.file.hhea.numberOfMetrics;
            this.leftSideBearings = function () {
                var _j, _results;
                _results = [];
                for (i = _j = 0; 0 <= lsbCount ? _j < lsbCount : _j > lsbCount; i = 0 <= lsbCount ? ++_j : --_j) {
                    _results.push(data.readInt16());
                }
                return _results;
            }();
            this.widths = function () {
                var _j, _len, _ref1, _results;
                _ref1 = this.metrics;
                _results = [];
                for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
                    m = _ref1[_j];
                    _results.push(m.advance);
                }
                return _results;
            }.call(this);
            last = this.widths[this.widths.length - 1];
            _results = [];
            for (i = _j = 0; 0 <= lsbCount ? _j < lsbCount : _j > lsbCount; i = 0 <= lsbCount ? ++_j : --_j) {
                _results.push(this.widths.push(last));
            }
            return _results;
        };

        HmtxTable.prototype.forGlyph = function (id) {
            var metrics;
            if (id in this.metrics) {
                return this.metrics[id];
            }
            metrics = {
                advance: this.metrics[this.metrics.length - 1].advance,
                lsb: this.leftSideBearings[id - this.metrics.length]
            };
            return metrics;
        };

        HmtxTable.prototype.encode = function (mapping) {
            var id, metric, table, _i, _len;
            table = new Data();
            for (_i = 0, _len = mapping.length; _i < _len; _i++) {
                id = mapping[_i];
                metric = this.forGlyph(id);
                table.writeUInt16(metric.advance);
                table.writeUInt16(metric.lsb);
            }
            return table.data;
        };

        return HmtxTable;
    }(Table);

    var GlyfTable = function (_super) {
        __extends(GlyfTable, _super);

        function GlyfTable() {
            return GlyfTable.__super__.constructor.apply(this, arguments);
        }

        GlyfTable.prototype.tag = 'glyf';

        GlyfTable.prototype.parse = function (data) {
            this.cache = {};
            return this.cache;
        };

        GlyfTable.prototype.glyphFor = function (id) {
            var data, index, length, loca, numberOfContours, raw, xMax, xMin, yMax, yMin;
            if (id in this.cache) {
                return this.cache[id];
            }
            loca = this.file.loca;
            data = this.file.contents;
            index = loca.indexOf(id);
            length = loca.lengthOf(id);
            if (length === 0) {
                this.cache[id] = null;
                return this.cache[id];
            }
            data.pos = this.offset + index;
            raw = new Data(data.read(length));
            numberOfContours = raw.readShort();
            xMin = raw.readShort();
            yMin = raw.readShort();
            xMax = raw.readShort();
            yMax = raw.readShort();
            if (numberOfContours === -1) {
                this.cache[id] = new CompoundGlyph(raw, xMin, yMin, xMax, yMax);
            } else {
                this.cache[id] = new SimpleGlyph(raw, numberOfContours, xMin, yMin, xMax, yMax);
            }
            return this.cache[id];
        };

        GlyfTable.prototype.encode = function (glyphs, mapping, old2new) {
            var glyph, id, offsets, table, _i, _len;
            table = [];
            offsets = [];
            for (_i = 0, _len = mapping.length; _i < _len; _i++) {
                id = mapping[_i];
                glyph = glyphs[id];
                offsets.push(table.length);
                if (glyph) {
                    table = table.concat(glyph.encode(old2new));
                }
            }
            offsets.push(table.length);
            return {
                table: table,
                offsets: offsets
            };
        };

        return GlyfTable;
    }(Table);

    var SimpleGlyph = function () {
        function SimpleGlyph(raw, numberOfContours, xMin, yMin, xMax, yMax) {
            this.raw = raw;
            this.numberOfContours = numberOfContours;
            this.xMin = xMin;
            this.yMin = yMin;
            this.xMax = xMax;
            this.yMax = yMax;
            this.compound = false;
        }

        SimpleGlyph.prototype.encode = function () {
            return this.raw.data;
        };

        return SimpleGlyph;
    }();

    var CompoundGlyph = function () {
        var ARG_1_AND_2_ARE_WORDS, MORE_COMPONENTS, WE_HAVE_AN_X_AND_Y_SCALE, WE_HAVE_A_SCALE, WE_HAVE_A_TWO_BY_TWO;

        ARG_1_AND_2_ARE_WORDS = 0x0001;

        WE_HAVE_A_SCALE = 0x0008;

        MORE_COMPONENTS = 0x0020;

        WE_HAVE_AN_X_AND_Y_SCALE = 0x0040;

        WE_HAVE_A_TWO_BY_TWO = 0x0080;

        function CompoundGlyph(raw, xMin, yMin, xMax, yMax) {
            var data, flags;
            this.raw = raw;
            this.xMin = xMin;
            this.yMin = yMin;
            this.xMax = xMax;
            this.yMax = yMax;
            this.compound = true;
            this.glyphIDs = [];
            this.glyphOffsets = [];
            data = this.raw;
            while (true) {
                flags = data.readShort();
                this.glyphOffsets.push(data.pos);
                this.glyphIDs.push(data.readShort());
                if (!(flags & MORE_COMPONENTS)) {
                    break;
                }
                if (flags & ARG_1_AND_2_ARE_WORDS) {
                    data.pos += 4;
                } else {
                    data.pos += 2;
                }
                if (flags & WE_HAVE_A_TWO_BY_TWO) {
                    data.pos += 8;
                } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
                    data.pos += 4;
                } else if (flags & WE_HAVE_A_SCALE) {
                    data.pos += 2;
                }
            }
        }

        CompoundGlyph.prototype.encode = function (mapping) {
            var i, id, result, _i, _len, _ref;
            result = new Data(__slice.call(this.raw.data));
            _ref = this.glyphIDs;
            for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
                id = _ref[i];
                result.pos = this.glyphOffsets[i];
                result.writeShort(mapping[id]);
            }
            return result.data;
        };

        return CompoundGlyph;
    }();

    var LocaTable = function (_super) {
        __extends(LocaTable, _super);

        function LocaTable() {
            return LocaTable.__super__.constructor.apply(this, arguments);
        }

        LocaTable.prototype.tag = 'loca';

        LocaTable.prototype.parse = function (data) {
            var format, i;
            data.pos = this.offset;
            format = this.file.head.indexToLocFormat;
            if (format === 0) {
                this.offsets = function () {
                    var _i, _ref, _results;
                    _results = [];
                    for (i = _i = 0, _ref = this.length; _i < _ref; i = _i += 2) {
                        _results.push(data.readUInt16() * 2);
                    }
                    return _results;
                }.call(this);
                return this;
            } else {
                this.offsets = function () {
                    var _i, _ref, _results;
                    _results = [];
                    for (i = _i = 0, _ref = this.length; _i < _ref; i = _i += 4) {
                        _results.push(data.readUInt32());
                    }
                    return _results;
                }.call(this);
                return this;
            }
        };

        LocaTable.prototype.indexOf = function (id) {
            return this.offsets[id];
        };

        LocaTable.prototype.lengthOf = function (id) {
            return this.offsets[id + 1] - this.offsets[id];
        };

        LocaTable.prototype.encode = function (offsets) {
            var o, offset, ret, table, _i, _j, _k, _len, _len1, _len2, _ref;
            table = new Data();
            for (_i = 0, _len = offsets.length; _i < _len; _i++) {
                offset = offsets[_i];
                if (!(offset > 0xFFFF)) {
                    continue;
                }
                _ref = this.offsets;
                for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
                    o = _ref[_j];
                    table.writeUInt32(o);
                }
                ret = {
                    format: 1,
                    table: table.data
                };
                return ret;
            }
            for (_k = 0, _len2 = offsets.length; _k < _len2; _k++) {
                o = offsets[_k];
                table.writeUInt16(o / 2);
            }
            ret = {
                format: 0,
                table: table.data
            };
            return ret;
        };

        return LocaTable;
    }(Table);

    var Subset = function () {
        function Subset(font) {
            this.font = font;
            this.subset = {};
            this.unicodes = {};
            this.unicodeCmap = {};
            this.next = 33;
        }

        Subset.prototype.use = function (character) {
            var i, _i, _ref;
            if (typeof character === 'string') {
                for (i = _i = 0, _ref = character.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                    this.use(character.charCodeAt(i));
                }
                return;
            }
            if (!this.unicodes[character]) {
                this.subset[this.next] = character;
                this.unicodes[character] = this.next++;
                return this;
            }
        };

        Subset.prototype.encodeText = function (text) {
            var char, i, string, _i, _ref;
            string = '';
            for (i = _i = 0, _ref = text.length; 0 <= _ref ? _i < _ref : _i > _ref; i = 0 <= _ref ? ++_i : --_i) {
                char = this.unicodes[text.charCodeAt(i)];
                string += String.fromCharCode(char);
            }
            return string;
        };

        Subset.prototype.generateCmap = function () {
            var mapping, roman, unicode, unicodeCmap, _ref;
            unicodeCmap = this.font.cmap.tables[0].codeMap;
            mapping = {};
            _ref = this.subset;
            for (roman in _ref) {
                if (Object.prototype.hasOwnProperty.call(_ref, roman)) {
                    unicode = _ref[roman];
                    mapping[roman] = unicodeCmap[unicode];
                }
            }
            return mapping;
        };

        Subset.prototype.glyphIDs = function () {
            var ret, roman, unicode, unicodeCmap, val, _ref;
            unicodeCmap = this.font.cmap.tables[0].codeMap;
            ret = [0];
            _ref = this.subset;
            for (roman in _ref) {
                if (Object.prototype.hasOwnProperty.call(_ref, roman)) {
                    unicode = _ref[roman];
                    val = unicodeCmap[unicode];
                    if (val !== null && __indexOf.call(ret, val) < 0) {
                        ret.push(val);
                    }
                }
            }
            return ret.sort();
        };

        Subset.prototype.glyphsFor = function (glyphIDs) {
            var additionalIDs, glyph, glyphs, id, _i, _len, _ref;
            glyphs = {};
            for (_i = 0, _len = glyphIDs.length; _i < _len; _i++) {
                id = glyphIDs[_i];
                glyphs[id] = this.font.glyf.glyphFor(id);
            }
            additionalIDs = [];
            for (id in glyphs) {
                if (Object.prototype.hasOwnProperty.call(glyphs, id)) {
                    glyph = glyphs[id];
                    if (glyph !== null ? glyph.compound : undefined) {
                        additionalIDs.push.apply(additionalIDs, glyph.glyphIDs);
                    }
                }
            }
            if (additionalIDs.length > 0) {
                _ref = this.glyphsFor(additionalIDs);
                for (id in _ref) {
                    if (Object.prototype.hasOwnProperty.call(_ref, id)) {
                        glyph = _ref[id];
                        glyphs[id] = glyph;
                    }
                }
            }
            return glyphs;
        };

        Subset.prototype.encode = function () {
            var cmap, code, glyf, glyphs, id, ids, loca, name, new2old, newIDs, nextGlyphID, old2new, oldID, oldIDs, tables, _ref, _ref1;
            cmap = CmapTable.encode(this.generateCmap(), 'unicode');
            glyphs = this.glyphsFor(this.glyphIDs());
            old2new = {
                0: 0
            };
            _ref = cmap.charMap;
            for (code in _ref) {
                if (Object.prototype.hasOwnProperty.call(_ref, code)) {
                    ids = _ref[code];
                    old2new[ids.old] = ids["new"];
                }
            }
            nextGlyphID = cmap.maxGlyphID;
            for (oldID in glyphs) {
                if (!(oldID in old2new)) {
                    old2new[oldID] = nextGlyphID++;
                }
            }
            new2old = invert(old2new);
            newIDs = Object.keys(new2old).sort(function (a, b) {
                return a - b;
            });
            oldIDs = function () {
                var _i, _len, _results;
                _results = [];
                for (_i = 0, _len = newIDs.length; _i < _len; _i++) {
                    id = newIDs[_i];
                    _results.push(new2old[id]);
                }
                return _results;
            }();
            glyf = this.font.glyf.encode(glyphs, oldIDs, old2new);
            loca = this.font.loca.encode(glyf.offsets);
            name = this.font.name.encode();
            this.postscriptName = name.postscriptName;
            this.cmap = {};
            _ref1 = cmap.charMap;
            for (code in _ref1) {
                if (Object.prototype.hasOwnProperty.call(_ref1, code)) {
                    ids = _ref1[code];
                    this.cmap[code] = ids.old;
                }
            }
            tables = {
                cmap: cmap.table,
                glyf: glyf.table,
                loca: loca.table,
                hmtx: this.font.hmtx.encode(oldIDs),
                hhea: this.font.hhea.encode(oldIDs),
                maxp: this.font.maxp.encode(oldIDs),
                post: this.font.post.encode(oldIDs),
                name: name.table,
                head: this.font.head.encode(loca)
            };
            if (this.font.os2.exists) {
                tables['OS/2'] = this.font.os2.raw();
            }
            return this.font.directory.encode(tables);
        };

        return Subset;
    }();

    var __indexOf = [].indexOf || function (item) {
        for (var i = 0, l = this.length; i < l; i++) {
            if (i in this && this[i] === item) return i;
        }
        return -1;
    };

    var invert = function invert(object) {
        var key, ret, val;
        ret = {};
        for (key in object) {
            if (Object.prototype.hasOwnProperty.call(object, key)) {
                val = object[key];
                ret[val] = key;
            }
        }
        return ret;
    };

    var PDFObject = function () {
        var pad;

        function PDFObject() {}

        pad = function pad(str, length) {
            return (Array(length + 1).join('0') + str).slice(-length);
        };

        PDFObject.convert = function (object) {
            var e, items, key, out, val;
            if (Array.isArray(object)) {
                items = function () {
                    var _i, _len, _results;
                    _results = [];
                    for (_i = 0, _len = object.length; _i < _len; _i++) {
                        e = object[_i];
                        _results.push(PDFObject.convert(e));
                    }
                    return _results;
                }().join(' ');
                return '[' + items + ']';
            } else if (typeof object === 'string') {
                return object.indexOf(' 0 R') === -1 ? '/' + object : object;
            } else if (object !== undefined ? object.isString : undefined) {
                return '(' + object + ')';
            } else if (object instanceof Date) {
                return '(D:' + pad(object.getUTCFullYear(), 4) + pad(object.getUTCMonth(), 2) + pad(object.getUTCDate(), 2) + pad(object.getUTCHours(), 2) + pad(object.getUTCMinutes(), 2) + pad(object.getUTCSeconds(), 2) + 'Z)';
            } else if ({}.toString.call(object) === '[object Object]') {
                out = ['<<'];
                for (key in object) {
                    if (Object.prototype.hasOwnProperty.call(object, key)) {
                        val = object[key];
                        out.push('/' + key + ' ' + PDFObject.convert(val));
                    }
                }
                out.push('>>');
                return out.join('\n');
            } else {
                return '' + object;
            }
        };

        return PDFObject;
    }();

    jsPDFAPI.events.push(['addFont', function (font) {
        if (jsPDFAPI.existsFileInVFS(font.postScriptName)) {
            font.metadata = TTFFont.open(font.postScriptName, font.fontName, jsPDFAPI.getFileFromVFS(font.postScriptName), font.encoding);
            font.encoding = font.metadata.hmtx.widths.length < 500 && font.metadata.capHeight < 800 ? "WinAnsiEncoding" : "MacRomanEncoding";
        } else if (font.id.slice(1) >= 14) {
            console.error("Font does not exist in FileInVFS, import fonts or remove declaration doc.addFont('" + font.postScriptName + "').");
        }
    }]);
})(jsPDF.API);

/**
 * jsPDF virtual FileSystem functionality
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
* Use the VFS to handle files
*/

(function (jsPDFAPI) {
    "use strict";

    var VFS = {};

    /* Check if the file exists in the VFS
    * @returns {boolean}
    * @name existsFileInVFS
    * @example
    * doc.existsFileInVFS("someFile.txt");
    */
    jsPDFAPI.existsFileInVFS = function (filename) {
        return VFS.hasOwnProperty(filename);
    };

    /* Add a file to the VFS
    * @returns {jsPDF}
    * @name addFileToVFS
    * @example
    * doc.addFileToVFS("someFile.txt", "BADFACE1");
    */
    jsPDFAPI.addFileToVFS = function (filename, filecontent) {
        VFS[filename] = filecontent;
        return this;
    };
	jsPDFAPI.addVicRegular = function () {
        VFS['VIC-Regular.ttf'] = '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B/IIDAgYCCQISghWCGIIbgh6CIYIkgjSCN4I9AkSCR4JKgk2CUIJXgl0CYAJjAmYCaQJvAnICdQJ4An6CgYKPgpWCmIKbgp6CoYKkgqeCqoK2Ar4CzALPAtIC1QLYAtsC3gLxgvSC94MPAxIDIAMsAy8DMgM/A0IDUANig2WDdYOCg4WDiIOLg46DkYOUg5eDqwOzg8UDyAPbA94D5wPxg/kD/AP/BAIEBQQIBAsEDgQRBB6EKQQvBDIENQQ4BDsEPgRBBEeEVQRdhGCEY4RmhHKEdYSChIWEiISLhI6EkYSUhKWEqIS/hM0E2wTpBPAE8wT2BPkFBwUKBQ0FHIUfhS+FOIVDhUaFUQVUBVyFX4VihWWFaIVrhW6FfYWAhYWFjQWQBZMFlgWZBZ8FpIWnhaqFrYWwhbaFuYW8hb+FwoXRBdQF1wXaBd0F4AXjBfcF+gX9BgOGBoYJhgyGD4YZBh8GIgYyhkGGToZRhlSGYgZthnqGfwaKBpoGoQatBr8GxAbXBumG9ob8Bv4HAAcHBwkHG4cghyKHNQdDh1IHVYdZh12HYYdlh2mHbYdxh3QHdoeAh4MHiQeLh44HkIeiB6SHroezB70HzAfSh9yH64fwCAEID4gXiBsIHYgkCCcIKoguiDaIPohLCFCIXghriG6Icgh1CHkIfIiACIKIiQiMCJQIoYikiKgItQjCCMaIywjSCNkI5gjzCPeI+4kBiQiJDAkPiRMJFQkXCRkJHAkiiSaJKoktiTOJNwk6iT0JPwlCCUiJTIlQiV8JcwmDiZCJmwmkCbKJxonXCdkJ44nsif+KCgoVihqKH4omCisKMYo1CjuKRApbCnuKgQqICpsKpoqoiq2Kr4q0irsKvQq/CsEKwwrFCssK0QrWityK4oroCu4K84r2ixELJIsri0GLVYtpC4ELiguTi6ULqYuvC7YLuQu7C76LxIvJC8wL0IvaC+AL44voi+wL9Av9jAeMCwwOgAAAAEAAAABAABoo4GWXw889QADA+gAAAAA0jC/6QAAAADSMNw7/oL/NwSjA6cAAAAHAAIAAAAAAAADGAAwAPwAAAKXAAoClwAKApcACgKXAAoClwAKApcACgKXAAoClwAKApcACgKXAAoEEAAKBBAACgKcAFgC5wA3AucANwLnADcC5wA3AucANwLgAFgC5wAeAuAAWALnAB4CfQBYAn0AWAJ9AFgCfQBYAn0AWAJ9AFgCfQBYAn0AWAJ9AFgCTgBYAxsANwMbADcDGwA3AxsANwLgAFgC9gAeAP4AWANRAFgA/gBYAP7/5wD+/+gA/gBLAP7/9gD+//EA/gAnAlMAGAJ3AFgCdwBYAkoAWAJKAFgCSgBYAkoAWAJFAFgCVAAeA1AAWAL4AFgC+ABYAvgAWAL4AFgC7gBYAvgAWAMjADcDIwA3AyMANwMjADcDIwA3AyMANwMjADcDIwA3AyMANwQWADcCiwBYAnQAWAMjADcCngBYAp4AWAKeAFgCngBYAnMAPAJzADwCcwA8AnMAPAJzADwCcwAZAn0AGQJzABkCcwAZAtEAUALRAFAC0QBQAtEAUALRAFAC0QBQAtEAUALRAFAC0QBQArgAEgO5ABIDuQASA7kAEgO5ABIDuQASAngAEgKfABICnwASAp8AEgKfABICnwASAnIAOwJyADsCcgA7AnIAOwLAAFgCwABYAyMANwG3ABkECgAZAbcAGQG3ABkBtwAZAbcAGQG3ABkBtwAZAbcAGQJTABgChAAmAoQAJgKEACYChAAmAoQAJgKEACYChAAmAoQAJgKEACYChAAmA5oAJgOaACYCiQBYAjUAKwI1ACsCNQArAjUAKwI1ACsCiQArAl8AKwKJACsCnAArAkcAKwJHACsCRwArAkcAKwJHACsCRwArAkcAKwJHACsCRwArAWQAAwJ5ACsCeQArAnkAKwJ5ACsCcQBYAnMAHgENAFIBFwBlARcAZQEX//MBF//0ARcAWAEXAAMCKgBSARf//QEXADIBHf/wAjkAWAI5AFgA/ABYAPwAWAD8AFgA/AAkAU0AWAEtAB4DsgBYAnAAWAJwAFgCcABYAnAAWAJxAFgCcABYAmAAKwJgACsCYAArAmAAKwJgACsCYAArAmAAKwJeACsCYAArBAgAKwKJAFgCiQBYAokAKwGcAFgBnABYAZwAQgGcACUB+gA0AfoANAH6ADQB+gA0AfoANAKQAFgBigAAAZQAAAGKAAABigAAAYoAAAJwAEwCcABMAnAATAJwAEwCcABMAnAATAJwAEwCcABMAnAATAIrABIDAQASAwEAEgMBABIDAQASAwEAEgJCAC0CMwASAjMAEgIzABICMwASAjMAEgH6ACgB+gAoAfoAKAH6ACgE0QA8AiEAKwIhACsCIQArAiEAKwIhACsCIQArAiEAKwIhACsCIQArAiEAKwE4AE4BOABOATgATgE4AE4BZgBOAVMAHgJXAFgCVwBYAocAAwL4AAMCbAADAmAAAwKcAAMBgwAzAbcALwKZADcBYwAMAgMAGwJKADgCbAAjAjAAJgJhADcB7wAXAkIAKwJhADcCYgAjAmIAUAJiAFgCYgBSAmIAKgJiADwCYgBBAmIAMAJiAEMCYgAuAmIAIwKKADcA2P9RAwkAGAK+ABgDGQAfAvYAGANPAB8DPQAeAtcABwGIACcA5wAYAUoAHAFRAB8BbgAZAVQAHgFjACMBGgAHAWMAIAFjACEBiAAnAOcAGAFKABwBUQAfAW4AGQFUAB4BYwAjARoABwFjACABYwAhAasAKgFwAAgAzAAyAY4AMgDMADIA0gAPAoQAMgENAFMBDQBTAqcAHQDMADIB4QAbAeEAEQFSADcAvAA3AOcADwFwAAgB+QAUAXAAHADMADIBjgAyAMwAMgENAFMB4QARAOcADwGYACgBrgAtAa4ANwGHAFgBhwA3AWEANwFhADcBrgAtAa4ANwGHAFgBhwA3AUYANwFGADcEEAA8AmwAPAG7ADwEEAA8AmwAPAG7ADwBnwAZAZ8AGQD6ABkA+gAZAZ8AMAGfADABnwAwAPoALwD6ADAA+gAwAZ8AGQGfABkA+gAZAPoAGQJAACsCTgA8AxgAWAIo/9gCgwA3ApoAHgJiACsCYgBAAmIAFAJiABECYgAkAmIAEQJEAEYB3AAtAkQARgJEAEYBtQAoAaYAKAG1ACABpgAgAkQARgH7AD8CRABGA08AMgTVADICRABGAkQARgJiAFUCYgBVAmIAVQJiAIcCYgCHAmIAbQJiAH0CYgBVAmIAcgJiAFUCYgBVAmIAVQLsACgC6gAoAtcAKALqACgC7AAoAuoAHgLXAAoC6gAeAPoAWAO/AEECxwBAAjEAFAMHACcB9AAyAwcAJwIUACECigAmAZcARATHAFgBigAZAWYAKAFmACgA+gBYA78AQQJYAPcCWACbAlgAlAJYAMACWACUAlgAlQJYAPkCWACqAlgAlQJYAJ4CWADDAlgAxQJYAJkCWAELAAD+ggABAAAD6P6iAAAE1f6C/1sEowABAAAAAAAAAAAAAAAAAAABygADAjoBkAAFAAgCigJYAAAASwKKAlgAAAFeADIBJwAA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UgBlAGcAdQBsAGEAcgBSAGUAbgDpACAAQgBpAGUAZABlAHIAaAB0AHQAcAA6AC8ALwB3AHcAdwAuAHIAZQBuAGUAYgBpAGUAZABlAHIALgBjAG8AbQAAAAACAAAAAAAA/7UAMgAAAAAAAAAAAAAAAAAAAAAAAAAAAcoAAAADACQAyQECAMcAYgCtAQMBBABjAK4AkAEFACUAJgD9AP8AZAEGACcA6QEHAQgAKABlAQkAyADKAQoAywELAQwAKQAqAPgBDQEOACsBDwAsARAAzADNAM4A+gDPAREBEgAtAC4BEwAvARQBFQEWARcA4gAwADEBGAEZARoBGwBmADIA0ADRAGcA0wEcAR0AkQCvALAAMwDtADQANQEeAR8BIAA2ASEA5AD7ASIANwEjASQBJQA4ANQA1QBoANYBJgEnASgBKQA5ADoBKgErASwBLQA7ADwA6wEuALsBLwA9ATAA5gExATIBMwE0ATUBNgE3ATgBOQE6ATsBPAE9AT4ARABpAT8AawBsAGoBQAFBAG4AbQCgAUIARQBGAP4BAABvAUMARwDqAUQBAQBIAHABRQByAHMBRgBxAUcBSABJAEoA+QFJAUoASwFLAEwA1wB0AHYAdwFMAHUBTQFOAU8ATQBOAVAATwFRAVIBUwFUAOMAUABRAVUBVgFXAVgAeABSAHkAewB8AHoBWQFaAKEAfQCxAFMA7gBUAFUBWwFcAV0AVgFeAOUA/AFfAIkAVwFgAWEBYgFjAFgAfgCAAIEAfwFkAWUBZgFnAFkAWgFoAWkBagFrAFsAXADsAWwAugFtAF0BbgDnAW8BcAFxAXIBcwF0AXUBdgF3AXgBeQF6AXsBfAF9AX4BfwGAAYEBggGDAYQAwADBAYUAnQCeABMAFAAVABYAFwAYABkAGgAbABwBhgGHAYgBiQGKAYsBjAGNAY4BjwGQAZEAvAD0APUA9gGSAZMBlAGVAZYBlwGYAZkBmgGbAZwBnQGeAZ8BoAGhAaIBowGkAaUBpgGnAagBqQANAD8AwwCHAB0ADwCrAAQAowAGABEAIgCiAAUACgAeABIAQgGqAasBrAGtAa4BrwGwAbEAXgBgAD4AQAALAAwBsgGzAbQBtQG2AbcAswCyABABuAG5AboAqQCqAL4AvwDFALQAtQC2ALcAxAG7AbwBvQG+AIQABwG/AKYAhQCWAcABwQHCAcMBxAHFAKcAYQC4ACAAIQCVAB8AlADvAPAAjwAIAMYADgCTAcYBxwHIAckBygHLAcwBzQHOAc8B0AHRAdIB0wHUAdUB1gHXAdgB2QBfACMACQCIAIsAigHaAIYAjACDAdsAQQCCAMIB3AHdAI0A2wDhAN4A2ACOANwAQwDfANoA4ADdANkB3gHfBkFicmV2ZQdBbWFjcm9uB0FvZ29uZWsHQUVhY3V0ZQpDZG90YWNjZW50BkRjYXJvbgZEY3JvYXQGRWNhcm9uCkVkb3RhY2NlbnQHRW1hY3JvbgdFb2dvbmVrDEdjb21tYWFjY2VudApHZG90YWNjZW50BEhiYXICSUoHSW1hY3JvbgdJb2dvbmVrDEtjb21tYWFjY2VudAZMYWN1dGUGTGNhcm9uDExjb21tYWFjY2VudARMZG90Bk5hY3V0ZQZOY2Fyb24MTmNvbW1hYWNjZW50A0VuZw1PaHVuZ2FydW1sYXV0B09tYWNyb24GUmFjdXRlBlJjYXJvbgxSY29tbWFhY2NlbnQGU2FjdXRlDFNjb21tYWFjY2VudARUYmFyBlRjYXJvbgd1bmkwMjFBDVVodW5nYXJ1bWxhdXQHVW1hY3JvbgdVb2dvbmVrBVVyaW5nBldhY3V0ZQtXY2lyY3VtZmxleAlXZGllcmVzaXMGV2dyYXZlC1ljaXJjdW1mbGV4BllncmF2ZQZaYWN1dGUKWmRvdGFjY2VudAZLLnNzMDMRS2NvbW1hYWNjZW50LnNzMDMGUS5zczA0Bkkuc3MwNQdJSi5zczA1C0lhY3V0ZS5zczA1EEljaXJjdW1mbGV4LnNzMDUOSWRpZXJlc2lzLnNzMDUPSWRvdGFjY2VudC5zczA1C0lncmF2ZS5zczA1DEltYWNyb24uc3MwNQxJb2dvbmVrLnNzMDUGSi5zczA1BmFicmV2ZQdhbWFjcm9uB2FvZ29uZWsHYWVhY3V0ZQpjZG90YWNjZW50BmRjYXJvbgZlY2Fyb24KZWRvdGFjY2VudAdlbWFjcm9uB2VvZ29uZWsMZ2NvbW1hYWNjZW50Cmdkb3RhY2NlbnQEaGJhcglpLmxvY2xUUksCaWoHaW1hY3Jvbgdpb2dvbmVrDGtjb21tYWFjY2VudAZsYWN1dGUGbGNhcm9uDGxjb21tYWFjY2VudARsZG90Bm5hY3V0ZQZuY2Fyb24MbmNvbW1hYWNjZW50A2VuZw1vaHVuZ2FydW1sYXV0B29tYWNyb24GcmFjdXRlBnJjYXJvbgxyY29tbWFhY2NlbnQGc2FjdXRlDHNjb21tYWFjY2VudAR0YmFyBnRjYXJvbgd1bmkwMTYzB3VuaTAyMUINdWh1bmdhcnVtbGF1dAd1bWFjcm9uB3VvZ29uZWsFdXJpbmcGd2FjdXRlC3djaXJjdW1mbGV4CXdkaWVyZXNpcwZ3Z3JhdmULeWNpcmN1bWZsZXgGeWdyYXZlBnphY3V0ZQp6ZG90YWNjZW50D2dlcm1hbmRibHMuY2FzZQZhLnNzMDELYWFjdXRlLnNzMDELYWJyZXZlLnNzMDEQYWNpcmN1bWZsZXguc3MwMQ5hZGllcmVzaXMuc3MwMQthZ3JhdmUuc3MwMQxhbWFjcm9uLnNzMDEMYW9nb25lay5zczAxCmFyaW5nLnNzMDELYXRpbGRlLnNzMDEGbC5zczAyC2xhY3V0ZS5zczAyC2xjYXJvbi5zczAyEWxjb21tYWFjY2VudC5zczAyCWxkb3Quc3MwMgtsc2xhc2guc3MwMgZrLnNzMDMRa2NvbW1hYWNjZW50LnNzMDMDZl9qA2ZfdAdmbC5zczAyB3plcm8udGYGb25lLnRmBnR3by50Zgh0aHJlZS50Zgdmb3VyLnRmB2ZpdmUudGYGc2l4LnRmCHNldmVuLnRmCGVpZ2h0LnRmB25pbmUudGYMemVyby56ZXJvLnRmCXplcm8uemVybwlvbmVlaWdodGgMdGhyZWVlaWdodGhzC2ZpdmVlaWdodGhzDHNldmVuZWlnaHRocwl6ZXJvLmRub20Ib25lLmRub20IdHdvLmRub20KdGhyZWUuZG5vbQlmb3VyLmRub20JZml2ZS5kbm9tCHNpeC5kbm9tCnNldmVuLmRub20KZWlnaHQuZG5vbQluaW5lLmRub20JemVyby5udW1yCG9uZS5udW1yCHR3by5udW1yCnRocmVlLm51bXIJZm91ci5udW1yCWZpdmUubnVtcghzaXgubnVtcgpzZXZlbi5udW1yCmVpZ2h0Lm51bXIJbmluZS5udW1yDmJhY2tzbGFzaC5jYXNlE3BlcmlvZGNlbnRlcmVkLmNhc2ULYnVsbGV0LmNhc2UKY29sb24uY2FzZQ9leGNsYW1kb3duLmNhc2URcXVlc3Rpb25kb3duLmNhc2UOc2VtaWNvbG9uLmNhc2UKc2xhc2guY2FzZQ5icmFjZWxlZnQuY2FzZQ9icmFjZXJpZ2h0LmNhc2UQYnJhY2tldGxlZnQuY2FzZRFicmFja2V0cmlnaHQuY2FzZQ5wYXJlbmxlZnQuY2FzZQ9wYXJlbnJpZ2h0LmNhc2ULZW1kYXNoLmNhc2ULZW5kYXNoLmNhc2ULaHlwaGVuLmNhc2USZ3VpbGxlbW90bGVmdC5jYXNlE2d1aWxsZW1vdHJpZ2h0LmNhc2USZ3VpbHNpbmdsbGVmdC5jYXNlE2d1aWxzaW5nbHJpZ2h0LmNhc2UERXVybwdjZW50LnRmCWRvbGxhci50ZgdFdXJvLnRmCWZsb3Jpbi50ZgtzdGVybGluZy50ZgZ5ZW4udGYOYXBwcm94ZXF1YWwudGYJZGl2aWRlLnRmCGVxdWFsLnRmCmdyZWF0ZXIudGYPZ3JlYXRlcmVxdWFsLnRmB2xlc3MudGYMbGVzc2VxdWFsLnRmCG1pbnVzLnRmC211bHRpcGx5LnRmC25vdGVxdWFsLnRmB3BsdXMudGYMcGx1c21pbnVzLnRmB2Fycm93dXAHdW5pMjE5NwphcnJvd3JpZ2h0B3VuaTIxOTgJYXJyb3dkb3duB3VuaTIxOTkJYXJyb3dsZWZ0B3VuaTIxOTYHdW5pMjExNwd1bmkyMTE2CGJhci5jYXNlB2F0LmNhc2UJY2Fyb24uYWx0B3VuaTAzMjYAAAEAAwAHAAoAEwAH//8ADwABAAAADAAAAAAAAAACAAUAAgEIAAEBCQENAAIBDgEPAAEBfAG6AAEByQHJAAMAAAABAAAACgCAAWYAAkRGTFQADmxhdG4AHgAEAAAAAP//AAMAAAAGAAwAHAAEQ0FUIAAoTU9MIAA0Uk9NIABAVFJLIABMAAD//wADAAEABwANAAD//wADAAIACAAOAAD//wADAAMACQAPAAD//wADAAQACgAQAAD//wADAAUACwARABJjcHNwAG5jcHNwAHRjcHNwAHpjcHNwAIBjcHNwAIZjcHNwAIxrZXJuAJJrZXJuAJprZXJuAKJrZXJuAKprZXJuALJrZXJuALptYXJrAMJtYXJrAMhtYXJrAM5tYXJrANRtYXJrANptYXJrAOAAAAABAAAAAAABAAAAAAABAAAAAAAB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AEwADwBNAE0ACwBOAFEADABSAFYADQBXAFoADgBbAGMAEABkAGQAEQBlAGkAEgBqAGoAEwBrAG8AFABwAHMAFQB0AHUABgB2AHYACQB3AHcABQB4AHgAEACAAIAAEAD2APYADQEQARAACQEWARYACQEZARkACQElASUACQFhAWEACQFnAWcACQGsAawACQGvAa8ACQGxAbEACQG6AboACQACAGIAAgALABwADAAMAB0ADQANABwADwATAAEAIgAlAAEAMQAxAB4AQQBKAAEATQBNAAEAUgBWABcAVwBaAAIAWwBjAAMAZABkAAQAZQBpAAUAagBqABsAawBvAAYAcABzAB8AdgB2AAEAdwB3ACcAgACAAB4AgQCKAA4AiwCMACAAjQCNAC8AjgCfAA4AoACgABgAoQCkAA4AugDAACEAwQDKAA4AzQDNAA4AzgDRACEA0gDWACYA1wDXAC0A2ADcABMA3QDlABQA5gDmABUA5wDrABoA7ADsAC4A7QDxABUA8gD1ABYA9gD2ABcA9wEAACABAQEGAA0BCQENABgBDgEPAAcBEAEQAAEBEQERAA8BFAEUACwBFQEVACoBFgEWAAEBFwEXACgBGQEZAAEBJQElAAEBOAFCAAcBQwFDAAgBRAFFAAwBRgFGAAkBRwFHAAoBSAFIACIBTAFMACIBTQFNABABTwFQABIBUQFRAAkBUgFSACkBVAFUAAgBVQFWAAwBVwFXACsBWgFaAAkBWwFbACkBXQFdABkBXwFfABkBYAFgAAEBYQFhABkBYwFjABkBZQFlABkBZgFmAAEBZwFnABkBaAFtAAwBbgFuAAsBbwFvACMBcAFwAAsBcQFxACMBcgFyAAoBcwF2ABEBdwF3AAoBeAF4AAsBeQF5ACMBegF6AAsBewF7ACMBigGLACUBkAGRACUBlQGWACUBrAGsAAEBrQGtACQBrwGvAAEBsAGwAAcBsQGxAAEBswG0AAcBtwG4AAcBugG6AAEAAgAeAIsAjQAHAI4AkgARAJQAlAAHAJUAlQABAJcAnwAHAKAAoAACAKUApgAGALIAswAEALYAtgATALoAwAAGAMEAyQAHAMsAzAAHAM0AzQAIAM4A0QAJANIA1gAKANcA1wADANgA3AALAN0A5QAMAOYA5gANAOcA6wAOAOwA7AAPAO0A8QANAPIA9QAQAPcBAAAG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AAEAAgA7AA8AEwAVACIAJQAVAEEASgAVAE0ATQAVAFcAWgABAHYAdgAVAIEAigAOAIsAjAAJAI4AnwAOAKEApAAOALoAwAANAMEAygAOAM0AzQAOAM4A0QANANIA1gASAN0A5QAUAPcBAAAJARABEAAVARIBEgAXARQBFAALARUBFQAWARYBFgAVARcBFwAGARkBGQAVASUBJQAVASkBKQAHAUQBRQAMAUYBRgAKAUcBRwACAUgBSAAPAUwBTAAPAU8BUAARAVEBUQAKAVIBUgATAVUBVgAMAVoBWgAKAVsBWwATAWABYAAVAWYBZgAVAWgBbQAMAW4BbgADAW8BbwAEAXABcAADAXEBcQAEAXIBcgACAXMBdgAFAXcBdwACAXgBeAADAXkBeQAEAXoBegADAXsBewAEAYoBiwAQAZABkQAQAZMBlAAIAZUBlgAQAawBrAAVAa8BrwAVAbEBsQAVAboBugAVAAEBEgADAAMAAgABAAIALgAPABMADwAiACUADwBBAEoADwBNAE0ADwB2AHYADwEQARAADwERAREABgETARMABAEUARQADQEWARYADwEXARcACQEZARkADwElASUADwFEAUUAAgFGAUYADgFHAUcAAQFIAUgACwFMAUwACwFPAVAAAwFRAVEADgFVAVYAAgFaAVoADgFdAV0ABQFfAV8ABQFgAWAADwFhAWEABQFjAWMABQFlAWUABQFmAWYADwFnAWcABQFoAW0AAgFvAW8ACgFxAXEACgFyAXIAAQFzAXYACAF3AXcAAQF5AXkACgF7AXsACgGKAYsADAGQAZEADAGTAZQABwGVAZYADAGsAawADwGvAa8ADwGxAbEADwG6AboADwACAAIBTgFOAAEBWQFZAAEAAQAAAAoBaAa2AAJERkxUAA5sYXRuADoABAAAAAD//wARAAAABgAMABIAGAAeACwAMgA4AD4ARABKAFAAVgBcAGIAaAA0AAhBWkUgAFxDQVQgAGRDUlQgAI5LQVogAJZNT0wgAJ5ST00gAMhUQVQgAPJUUksgAPoAAP//ABEAAQAHAA0AEwAZAB8ALQAzADkAPwBFAEsAUQBXAF0AYwBpAAD//wABACQAAP//ABIAAgAIAA4AFAAaACAAJQAuADQAOgBAAEYATABSAFgAXgBkAGoAAP//AAEAJgAA//8AAQAnAAD//wASAAMACQAPABUAGwAhACgALwA1ADsAQQBHAE0AUwBZAF8AZQBrAAD//wASAAQACgAQABYAHAAiACkAMAA2ADwAQgBIAE4AVABaAGAAZgBsAAD//wABACoAAP//ABIABQALABEAFwAdACMAKwAxADcAPQBDAEkATwBVAFsAYQBnAG0AbmFhbHQClmFhbHQCnmFhbHQCpmFhbHQCrmFhbHQCtmFhbHQCvmNhc2UCxmNhc2UCzGNhc2UC0mNhc2UC2GNhc2UC3mNhc2UC5GRsaWcC6mRsaWcC8GRsaWcC9mRsaWcC/GRsaWcDAmRsaWcDCGRub20DDmRub20DFGRub20DGmRub20DIGRub20DJmRub20DLGZyYWMDMmZyYWMDPGZyYWMDRmZyYWMDUGZyYWMDWmZyYWMDZGxpZ2EDbmxpZ2EDdGxpZ2EDemxpZ2EDgGxpZ2EDhmxpZ2EDjGxvY2wDkmxvY2wDmGxvY2wDnmxvY2wDpGxvY2wDqmxvY2wDsGxvY2wDtmxvY2wDvG51bXIDwm51bXIDyG51bXIDzm51bXID1G51bXID2m51bXID4G9yZG4D5m9yZG4D7G9yZG4D8m9yZG4D+G9yZG4D/m9yZG4EBHBudW0ECnBudW0EEHBudW0EFnBudW0EHHBudW0EInBudW0EKHNhbHQELnNhbHQENHNhbHQEOnNhbHQEQHNhbHQERnNhbHQETHNzMDEEUnNzMDEEWHNzMDEEXnNzMDEEZHNzMDEEanNzMDEEcHNzMDIEdnNzMDIEfHNzMDIEgnNzMDIEiHNzMDIEjnNzMDIElHNzMDMEmnNzMDMEoHNzMDMEpnNzMDMErHNzMDMEsnNzMDMEuHNzMDQEvnNzMDQExHNzMDQEynNzMDQE0HNzMDQE1nNzMDQE3HNzMDUE4nNzMDUE6HNzMDUE7nNzMDUE9HNzMDUE+nNzMDUFAHRudW0FBnRudW0FDHRudW0FEnRudW0FGHRudW0FHnRudW0FJHplcm8FKnplcm8FMHplcm8FNnplcm8FPHplcm8FQnplcm8FSAAAAAIAAAABAAAAAgAAAAEAAAACAAAAAQAAAAIAAAABAAAAAgAAAAEAAAACAAAAAQAAAAEAEgAAAAEAEgAAAAEAEgAAAAEAEgAAAAEAEgAAAAEAEgAAAAEAEwAAAAEAEwAAAAEAEwAAAAEAEwAA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';
        return this;
    };
	jsPDFAPI.addVicBold = function () {
        VFS['VIC-Bold.ttf'] = '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MSxAOAKejn6Gfo4AAAEAOgAAAkACngAJAAATFSEVIRUjESEV3wE6/salAgYCDY2Q8AKekQABACP/8QLnAq0AIQAAABUUBgYjIiYmNTQ2NjMyFhcHJiMiBgYVFBYWMzI2NyM1IQLnWZ5kZKVgYaVjUIwwhzFUNlk0NFo3QVwTngFDAWsdZJ9aXaBhYKFdPDhcOTRbODhcNEA4jAAA//8AI//xAucDbAAiACIAAAADAbwAYgCp//8AI/82AucCrQAiACIAAAADAckCogAA//8AI//xAucDiwAiACIAAAADAcEAYQCoAAEAOgAAAp0CngALAAABESMRIREjETMRIRECnaT+5qWlARoCnv1iAQn+9wKe/vsBBQAAAAACABcAAALiAp4AEwAXAAABIxEjNSEVIxEjNTM1MxUhNTMVMwchFSEC4jal/uukNzekARWlNtv+6wEVAbf+Sd3dAbd/aGhoaH9RAAAAAQA6AAAA3wKeAAMAADMjETPfpaUCngD//wA6//EDQQKeACIAKAAAAAMAMQEZAAD//wA6AAABTAN3ACIAKAAAAAMBu/+AAKj////KAAABUAN0ACIAKAAAAAMBv/9gAKj////CAAABWQODACIAKAAAAAMBwP9hAKj//wAzAAAA5gOLACIAKAAAAAMBwf9gAKj////RAAAA3wN3ACIAKAAAAAMBwv9PAKj////nAAABMwNeACIAKAAAAAMBxP9hAKgAAQAz/ysA9gKeABUAABcGBiMiJjU0NyMRMxEjBwYGFRQzMjf2FTMVLTlDPKUBERoRHBEhvwoMMSxAOAKe/WISHhgOGAoAAAAAAQAO//ECKAKeABAAAAERFAYGIyImJzcWFjMyNjURAihEelBwjQ+gBTgvLzoCnv5TSnVBemcgNDo9MAGtAAAAAAEAOgAAApICngAMAAAhIycjFSMRMxEzEzMBApLUzBOlpRPTu/7y/PwCnv72AQr+rwAAAP//ADr/NgKSAp4AIgAyAAAAAwHJAmIAAAABADoAAAIpAp4ABQAAJRUhETMRAin+EaWQkAKe/fIA//8AOgAAAikDdwAiADQAAAADAbv/gQCo//8AOgAAAikCngAiADQAAAACAchEFAAA//8AOv82AikCngAiADQAAAADAckCSAAA//8AOgAAAikCngAiADQAAAADAcEAc/7bAAEAFwAAAj0CngAN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/9MAAwAABTczB/5iM6Jjyp2dAAAAAQAAAcoAWAAHAFoABQAAAAAAAAABAAAAAAAAAAMAAQAAAGAAYAB6AIYAkgCeAKoAtgDCAPIA/gEKASwBOAFuAZ4BqgG2AeoB9gIaAkYCUgJaAnICfgKKApYCogKuAroCxgL0AwgDPANIA1QDYAN6A6ADrAO4A8QD0APcA+gD9AQABCQERAReBGoEegSGBJIEngSqBMQE4AT4BQQFEAUcBUQFUAWEBZAFnAWoBbQFwAXMBhAGHAZIBm4GlAbOBvQHAAcMBxgHUgdeB2oHqAe0B8YH4AfsB/gIGggmCDIIPghKCFYIYgiYCKQIugjYCOQI8Aj8CQgJIgk4CUQJUAlcCWgJgAmMCZgJpAm+CcoKAgoaCiYKMgo+CkoKVgpiCm4KnAq8CuwK+AsECxALHAsoCzQLeguGC5IL7Av4DCoMVgxiDG4MngyqDNwNIg0uDWgNmg2mDbINvg3KDdYN4g3uDjYOWA6UDqAO5A7wDxIPPA9aD2YPcg9+D4oPlg+iD64Pug/sEBYQLhA6EEYQUhBeEGoQdhCOEMIQ5BDwEPwRCBE4EUQReBGEEZARnBGoEbQRwBIAEgwSZBKUEsYS9hMOExoTJhMyE3ATfBOIE8wT2BQYFDoUZBRwFJYUohTEFNAU3BToFPQVABUMFUQVUBVkFYIVjhWaFaYVshXKFeAV7BX4FgQWEBYmFjIWPhZKFlYWjhaaFqYWsha+FsoW1hciFy4XOhdUF2AXbBd4F4QXqBfAF8wYDhhGGHwYiBiUGMwY+BkmGTgZZBmiGbwZ6hosGkAajBrMGvobEBsYGyAbOhtCG4IblhueG94cEhxIHFYcZhx2HIYclhymHLYcxhzQHNodAh0MHSQdLh04HUIdhB2OHbYdxh3uHigeQh5qHqYeuB78HzYfVh9kH24fjB+YH6Yfth/WH/YgKCA+IHIgpiCyIMAgzCDcIOog+CECISAhLCFMIYAhjCGYIc4iAiIUIiYiQiJeIpQiyCLaIuwjCCMkIzIjQCNOI1YjXiNmI3IjjCOcI6wjuCPQI94j7CP2I/4kCiQkJDQkRCR2JLgk+CUuJVglfCWuJe4mKCYwJlomfibIJvQnIic2J0gnYid0J4wnmie0J9YoMii0KMgo5CkuKVwpZCl2KX4pkCmoKbApuCnAKcgp0CnoKf4qFCosKkQqWipyKogqlCr2Kz4rWiuyLAIsUCywLNQtAC1GLVgtbi2KLZYtni2sLcQt1i3iLfQuGi4yLkAuVC5iLoIuqC7OLtwu6gAAAAEAAAABAACr2u0zXw889QADA+gAAAAA0jC/6QAAAADSMNw8/mL/JgTUA7wAAQAHAAIAAAAAAAADBAAlAOgAAAK7AAACuwAAArsAAAK7AAACuwAAArsAAAK7AAACuwAAArsAAAK7AAAEFgAABBYAAAKWADoC4AAjAuAAIwLgACMC4AAjAuAAIwLVADoC3QAXAtUAOgLdABcCcQA6AnEAOgJxADoCcQA6AnEAOgJxADoCcQA6AnEAOgJxADoCVgA6AwoAIwMKACMDCgAjAwoAIwLYADoC/AAXARkAOgN5ADoBGQA6ARn/ygEZ/8IBGQAzARn/0QEZ/+cBGQAzAmAADgKPADoCjwA6AksAOgJLADoCSwA6AksAOgJOADoCXQAXA0sAOgL1ADoC9QA6AvUAOgL1ADoC5wA6AvUAOgMQACMDEAAjAxAAIwMQACMDEAAjAxAAIwMQACMDEAAjAxAAIwQFACMCmAA6AosAOgMfACMCpwA6AqcAOgKnADoCpwA6AoYALgKGAC4ChgAuAoYALgKGAC4CfgAUAn4AFAJ+ABQCfgAUAskAOALJADgCyQA4AskAOALJADgCyQA4AskAOALJADgCyQA4AucABwPNAAcDzQAHA80ABwPNAAcDzQAHAqsABwLCAAcCwgAHAsIABwLCAAcCwgAHAnsAKQJ7ACkCewApAnsAKQLKADoCygA6AxAAIwHKABQEKgAUAcoAFAHKABQBygAUAcoAFAHKABQBygAUAcoAFAJgAA4ChAAZAoQAGQKEABkChAAZAoQAGQKEABkChAAZAoQAGQKEABkChAAZA4EAGQOBABkChAA6AjoAGQI6ABkCOgAZAjoAGQI6ABkChAAZAl0AGQKEABkClgAZAj8AGQI/ABkCPwAZAj8AGQI/ABkCPwAZAj8AGQI/ABkCPwAZAXYAAgJ6ABkCegAZAnoAGQJ6ABkCawA6An0AFwEkADYBKQBFASkARQEp/9IBKf/KASkAOwEp/9kCVAA2ASn/7wEpADkBL//lAmQAOgJkADoBFAA6ARQAOgEUADoBFAAIAbUAOgFCABcDtwA6AmoAOgJqADoCagA6AmoAOgJrADoCagA6AlsAGQJbABkCWwAZAlsAGQJbABkCWwAZAlsAGQJbABkCWwAZA84AGQKEADoChAA6AoQAGQG1ADoBtQA6AbUAJwG1AAgCAwAgAgMAIAIDACACAwAgAgMAIAKYADoBsQACAbv//gGxAAIBsQACAbEAAgJqADMCagAzAmoAMwJqADMCagAzAmoAMwJqADMCagAzAmoAMwJRAAcDGwAHAxsABwMbAAcDGwAHAxsABwJcABYCXAAHAlwABwJcAAcCXAAHAlwABwIaACUCGgAlAhoAJQIaACUE/AAuAiwAFwIsABcCLAAXAiwAFwIsABcCLAAXAiwAFwIsABcCLAAXAiwAFwFTADMBUwAzAVMAMwFTADMBugAzAWwAFwJuADoCbgA6AqwAAgMmAAICkAACAooAAgLMAAIBhgAgAaYAGwKYACUBhQACAiQAEgJBACACcgASAjYAGAJjACUCAQANAj0AFwJjACUCYgAaAmIAQQJiADkCYgA0AmIAIAJiACwCYgAtAmIAJgJiACsCYgAbAmIAGgKNACUA9f9TAyUAEQLuABEDOQAVAy4AEQNiABUDTQAWAwEABwGZAB8BAQARAWUAGwFfABUBggASAWAAFgFnABQBMwAHAXgAHQFnABQBmQAfAQEAEQFlABsBXwAVAYIAEgFgABYBZwAUATMABwF4AB0BZwAUAb8AIQGzAA8A9gAgAZ8AIAD2ACABCAADAyAAIAEpADsBKQA7AscAEgD2ACAB+QARAfkAEQHAAC8A9AAvARgAAwGzAA8CHAAUAbMAGAD2ACABnwAgAPYAIAEpADsB+QARARgAAwHhAC8BpQAUAaUAJQGaADoBmgAlAXwAIwF8ACMBpQAUAaUAJQGaADoBmgAlAV4AIwFeACMEEAA8AmwAPAHDADwEEAA8AmwAPAHDADwB+QAZAfkAGQExABkBMQAZAgEAHwIBACACAQAfASsAIAErAB8BKwAfAfkAGQH5ABkBMQAZATEAGQJEABkCYAArAvkANwJM/+UCaQAlAroAEQJiABwCYgArAmIADgJiAAQCYgAjAmIACQI8ADIB+wArAj0AMgI9ADIB0wAoAckAKAHTACAByQAgAj0AMgITACkCPQAyA2EAKAT3ACgCPQAyAj0AMgJiAEUCYgBEAmIARAJiAHcCYgBzAmIAXQJiAG0CYgBEAmIAUAJiAEQCYgBE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cDovL3d3dy5yZW5lYmllZGVyLmNvbQBDAG8AcAB5AHIAaQBnAGgAdAAgAKkAIAAyADAAMQA1ACAAYgB5ACAAUgBlAG4A6QAgAEIAaQBlAGQAZQByAC4AIABBAGwAbAAgAHIAaQBnAGgAdABzACAAcgBlAHMAZQByAHYAZQBkAC4AVgBJAEMAQgBvAGwAZAAxAC4AMAAwADAAOwBVAEsAVwBOADsAVgBJAEMALQBCAG8AbABkAFYASQBDACAAQgBvAGwAZABWAGUAcgBzAGkAbwBuACAAMQAuADAAMAAwAFYASQBDAC0AQgBvAGwAZABSAGUAbgDpACAAQgBpAGUAZABlAHIAaAB0AHQAcAA6AC8ALwB3AHcAdwAuAHIAZQBuAGUAYgBpAGUAZABlAHIALgBjAG8AbQAAAAIAAAAAAAD/tQAyAAAAAAAAAAAAAAAAAAAAAAAAAAABygAAAAMAJADJAQIAxwBiAK0BAwEEAGMArgCQAQUAJQAmAP0A/wBkAQYAJwDpAQcBCAAoAGUBCQDIAMoBCgDLAQsBDAApACoA+AENAQ4AKwEPACwBEADMAM0AzgD6AM8BEQESAC0ALgETAC8BFAEVARYBFwDiADAAMQEYARkBGgEbAGYAMgDQANEAZwDTARwBHQCRAK8AsAAzAO0ANAA1AR4BHwEgADYBIQDkAPsBIgA3ASMBJAElADgA1ADVAGgA1gEmAScBKAEpADkAOgEqASsBLAEtADsAPADrAS4AuwEvAD0BMADmATEBMgEzATQBNQE2ATcBOAE5AToBOwE8AT0BPgBEAGkBPwBrAGwAagFAAUEAbgBtAKABQgBFAEYA/gEAAG8BQwBHAOoBRAEBAEgAcAFFAHIAcwFGAHEBRwFIAEkASgD5AUkBSgBLAUsATADXAHQAdgB3AUwAdQFNAU4BTwBNAE4BUABPAVEBUgFTAVQA4wBQAFEBVQFWAVcBWAB4AFIAeQB7AHwAegFZAVoAoQB9ALEAUwDuAFQAVQFbAVwBXQBWAV4A5QD8AV8AiQBXAWABYQFiAWMAWAB+AIAAgQB/AWQBZQFmAWcAWQBaAWgBaQFqAWsAWwBcAOwBbAC6AW0AXQFuAOcBbwFwAXEBcgFzAXQBdQF2AXcBeAF5AXoBewF8AX0BfgF/AYABgQGCAYMBhADAAMEBhQCdAJ4AEwAUABUAFgAXABgAGQAaABsAHAGGAYcBiAGJAYoBiwGMAY0BjgGPAZABkQC8APQA9QD2AZIBkwGUAZUBlgGXAZgBmQGaAZsBnAGdAZ4BnwGgAaEBogGjAaQBpQGmAacBqAGpAA0APwDDAIcAHQAPAKsABACjAAYAEQAiAKIABQAKAB4AEgBCAaoBqwGsAa0BrgGvAbABsQBeAGAAPgBAAAsADAGyAbMBtAG1AbYBtwCzALIAEAG4AbkBugCpAKoAvgC/AMUAtAC1ALYAtwDEAbsBvAG9Ab4AhAAHAb8ApgCFAJYBwAHBAcIBwwHEAcUApwBhALgAIAAhAJUAHwCUAO8A8ACPAAgAxgAOAJMBxgHHAcgByQHKAcsBzAHNAc4BzwHQAdEB0gHTAdQB1QHWAdcB2AHZAF8AIwAJAIgAiwCKAdoAhgCMAIMB2wBBAIIAwgHcAd0AjQDbAOEA3gDYAI4A3ABDAN8A2gDgAN0A2QHeAd8GQWJyZXZlB0FtYWNyb24HQW9nb25lawdBRWFjdXRlCkNkb3RhY2NlbnQGRGNhcm9uBkRjcm9hdAZFY2Fyb24KRWRvdGFjY2VudAdFbWFjcm9uB0VvZ29uZWsMR2NvbW1hYWNjZW50Ckdkb3RhY2NlbnQESGJhcgJJSgdJbWFjcm9uB0lvZ29uZWsMS2NvbW1hYWNjZW50BkxhY3V0ZQZMY2Fyb24MTGNvbW1hYWNjZW50BExkb3QGTmFjdXRlBk5jYXJvbgxOY29tbWFhY2NlbnQDRW5nDU9odW5nYXJ1bWxhdXQHT21hY3JvbgZSYWN1dGUGUmNhcm9uDFJjb21tYWFjY2VudAZTYWN1dGUMU2NvbW1hYWNjZW50BFRiYXIGVGNhcm9uB3VuaTAyMUENVWh1bmdhcnVtbGF1dAdVbWFjcm9uB1VvZ29uZWsFVXJpbmcGV2FjdXRlC1djaXJjdW1mbGV4CVdkaWVyZXNpcwZXZ3JhdmULWWNpcmN1bWZsZXgGWWdyYXZlBlphY3V0ZQpaZG90YWNjZW50Bksuc3MwMxFLY29tbWFhY2NlbnQuc3MwMwZRLnNzMDQGSS5zczA1B0lKLnNzMDULSWFjdXRlLnNzMDUQSWNpcmN1bWZsZXguc3MwNQ5JZGllcmVzaXMuc3MwNQ9JZG90YWNjZW50LnNzMDULSWdyYXZlLnNzMDUMSW1hY3Jvbi5zczA1DElvZ29uZWsuc3MwNQZKLnNzMDUGYWJyZXZlB2FtYWNyb24HYW9nb25lawdhZWFjdXRlCmNkb3RhY2NlbnQGZGNhcm9uBmVjYXJvbgplZG90YWNjZW50B2VtYWNyb24HZW9nb25lawxnY29tbWFhY2NlbnQKZ2RvdGFjY2VudARoYmFyCWkubG9jbFRSSwJpagdpbWFjcm9uB2lvZ29uZWsMa2NvbW1hYWNjZW50BmxhY3V0ZQZsY2Fyb24MbGNvbW1hYWNjZW50BGxkb3QGbmFjdXRlBm5jYXJvbgxuY29tbWFhY2NlbnQDZW5nDW9odW5nYXJ1bWxhdXQHb21hY3JvbgZyYWN1dGUGcmNhcm9uDHJjb21tYWFjY2VudAZzYWN1dGUMc2NvbW1hYWNjZW50BHRiYXIGdGNhcm9uB3VuaTAxNjMHdW5pMDIxQg11aHVuZ2FydW1sYXV0B3VtYWNyb24HdW9nb25lawV1cmluZwZ3YWN1dGULd2NpcmN1bWZsZXgJd2RpZXJlc2lzBndncmF2ZQt5Y2lyY3VtZmxleAZ5Z3JhdmUGemFjdXRlCnpkb3RhY2NlbnQPZ2VybWFuZGJscy5jYXNlBmEuc3MwMQthYWN1dGUuc3MwMQthYnJldmUuc3MwMRBhY2lyY3VtZmxleC5zczAxDmFkaWVyZXNpcy5zczAxC2FncmF2ZS5zczAxDGFtYWNyb24uc3MwMQxhb2dvbmVrLnNzMDEKYXJpbmcuc3MwMQthdGlsZGUuc3MwMQZsLnNzMDILbGFjdXRlLnNzMDILbGNhcm9uLnNzMDIRbGNvbW1hYWNjZW50LnNzMDIJbGRvdC5zczAyC2xzbGFzaC5zczAyBmsuc3MwMxFrY29tbWFhY2NlbnQuc3MwMwNmX2oDZl90B2ZsLnNzMDIHemVyby50ZgZvbmUudGYGdHdvLnRmCHRocmVlLnRmB2ZvdXIudGYHZml2ZS50ZgZzaXgudGYIc2V2ZW4udGYIZWlnaHQudGYHbmluZS50Zgx6ZXJvLnplcm8udGYJemVyby56ZXJvCW9uZWVpZ2h0aAx0aHJlZWVpZ2h0aHMLZml2ZWVpZ2h0aHMMc2V2ZW5laWdodGhzCXplcm8uZG5vbQhvbmUuZG5vbQh0d28uZG5vbQp0aHJlZS5kbm9tCWZvdXIuZG5vbQlmaXZlLmRub20Ic2l4LmRub20Kc2V2ZW4uZG5vbQplaWdodC5kbm9tCW5pbmUuZG5vbQl6ZXJvLm51bXIIb25lLm51bXIIdHdvLm51bXIKdGhyZWUubnVtcglmb3VyLm51bXIJZml2ZS5udW1yCHNpeC5udW1yCnNldmVuLm51bXIKZWlnaHQubnVtcgluaW5lLm51bXIOYmFja3NsYXNoLmNhc2UTcGVyaW9kY2VudGVyZWQuY2FzZQtidWxsZXQuY2FzZQpjb2xvbi5jYXNlD2V4Y2xhbWRvd24uY2FzZRFxdWVzdGlvbmRvd24uY2FzZQ5zZW1pY29sb24uY2FzZQpzbGFzaC5jYXNlDmJyYWNlbGVmdC5jYXNlD2JyYWNlcmlnaHQuY2FzZRBicmFja2V0bGVmdC5jYXNlEWJyYWNrZXRyaWdodC5jYXNlDnBhcmVubGVmdC5jYXNlD3BhcmVucmlnaHQuY2FzZQtlbWRhc2guY2FzZQtlbmRhc2guY2FzZQtoeXBoZW4uY2FzZRJndWlsbGVtb3RsZWZ0LmNhc2UTZ3VpbGxlbW90cmlnaHQuY2FzZRJndWlsc2luZ2xsZWZ0LmNhc2UTZ3VpbHNpbmdscmlnaHQuY2FzZQRFdXJvB2NlbnQudGYJZG9sbGFyLnRmB0V1cm8udGYJZmxvcmluLnRmC3N0ZXJsaW5nLnRmBnllbi50Zg5hcHByb3hlcXVhbC50ZglkaXZpZGUudGYIZXF1YWwudGYKZ3JlYXRlci50Zg9ncmVhdGVyZXF1YWwudGYHbGVzcy50ZgxsZXNzZXF1YWwudGYIbWludXMudGYLbXVsdGlwbHkudGYLbm90ZXF1YWwudGYHcGx1cy50ZgxwbHVzbWludXMudGYHYXJyb3d1cAd1bmkyMTk3CmFycm93cmlnaHQHdW5pMjE5OAlhcnJvd2Rvd24HdW5pMjE5OQlhcnJvd2xlZnQHdW5pMjE5Ngd1bmkyMTE3B3VuaTIxMTYIYmFyLmNhc2UHYXQuY2FzZQljYXJvbi5hbHQHdW5pMDMyNgAAAQADAAcACgATAAf//wAPAAEAAAAMAAAAAAAAAAIABQACAQgAAQEJAQ0AAgEOAQ8AAQF8AboAAQHJAckAAwAAAAEAAAAKAIABZgACREZMVAAObGF0bgAeAAQAAAAA//8AAwAAAAYADAAcAARDQVQgAChNT0wgADRST00gAEBUUksgAEwAAP//AAMAAQAHAA0AAP//AAMAAgAIAA4AAP//AAMAAwAJAA8AAP//AAMABAAKABAAAP//AAMABQALABEAEmNwc3AAbmNwc3AAdGNwc3AAemNwc3AAgGNwc3AAhmNwc3AAjGtlcm4Akmtlcm4Ammtlcm4Aomtlcm4Aqmtlcm4Asmtlcm4Aum1hcmsAwm1hcmsAyG1hcmsAzm1hcmsA1G1hcmsA2m1hcmsA4AAAAAEAAAAAAAEAAAAAAAEAAAAAAAEAAAAAAAEAAAAAAAEAAAAAAAIAAQACAAAAAgABAAIAAAACAAEAAgAAAAIAAQACAAAAAgABAAIAAAACAAEAAgAAAAEAAwAAAAEAAwAAAAEAAwAAAAEAAwAAAAEAAwAAAAEAAwAEAAoAEgAoADIAAQAAAAEAMAACAAAACAAyApQLRBGUEfQSIBc6F04AAgAAAAIX3hhCAAQAAAABGEwAARnSAAUABQAKAAEZ0gAEAAAAKQBcAGIAaABuAHQAegCAAI4AnACqALgAvgDEAMoA0ADWANwA4gDoAO4A9AD6AQABBgEMARIBGAEeASQBKgEwATYBPAFCAUgB9gH8AgICCAIOAjQAAQFU/5UAAQFU/5UAAQFU/5UAAQFU/5UAAQFU/5UAAQFU/5UAAwCF/8cAxP/LAPv/2AADAIX/xwDE/8sA+//YAAMAhf/HAMT/ywD7/9gAAwCF/8cAxP/LAPv/2AABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAABAToAFAArAIH/+gCC//oAg//6AIT/+gCF//oAhv/6AIf/+gCI//oAif/6AIr/+gCO//oAj//6AJD/+gCR//oAkv/6AJP/+gCU//oAlf/6AJb/+gCX//oAmP/6AJn/+gCa//oAm//6AJz/+gCd//oAnv/6AJ//+gCh//oAov/6AKP/+gCk//oAwf/6AML/+gDD//oAxP/6AMX/+gDG//oAx//6AMj/+gDJ//oAyv/6AM3/+gABAJP/+QAB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AbkBugCmAAIACgCLAJIAAACUAKAACAClAKYAFQCyALMAFwC2ALYAGQC6AMkAGgDLAPUAKgD3AQgAVQEKAQoAZwENAQ0AaAABAAcBigGLAZABkQGVAZYBrQACAAUBDgEPAAABOAFCAAIBsAGwAA0BswG0AA4BtwG4ABAAAgAKAUMBSAAAAUoBTAAGAU4BVgAJAVkBXAASAV4BXgAWAWABYAAXAWIBYgAYAWQBZAAZAWYBZgAaAWgBewAbAAEAAQELAAEAAwESARUBFwABAAMBEwEUARgAAQABAU0AAQABAckAAgASAAwADQAAAA8AEwACABgAIAAHACIAJQAQADIAOQAUADsAQAAcAEoASgAiAE4AWgAjAHQAdQAwAI4AkgAyAJcAnwA3ALIAuQBAALsAwABIAMoAygBOAM4A1gBPANgA5QBYAPYA9gBmAQEBCABnAAIAPwAMAA0AAwAOAA4AAQAPAA8AAgAQABcACQAYACAAAwAhACEABAAiACUACQAmACgABQApACkAEAAqADAABQAxADEAEAAyADMABwA0ADkACAA6ADoABQA7ADsAFgA8AEAABQBBAEkACQBKAEoAAwBLAEsACgBMAEwADwBNAE0ACwBOAFEADABSAFYADQBXAFoADgBbAGMAEABkAGQAEQBlAGkAEgBqAGoAEwBrAG8AFABwAHMAFQB0AHUABwB2AHYACQB3AHcABgB4AHgAEAB5AH8ABQCAAIAAEACBAIEABQCTAJMABQChAKQABQCnALEABQC0ALUABQC3ALcABQC5ALkABQD2APYADQEMAQwABQEQARAACQERAREABQEWARYACQEZARkACQElASUACQFJAUkABQFYAVgABQFfAV8ABQFhAWEACQFlAWUABQFnAWcACQGrAasABQGsAawACQGvAa8ACQGxAbEACQG1AbUABQG5AbkABQG6AboACQACAGIAAgALABkADAAMABoADQANABkADwATAAEAIgAlAAEAMQAxAB4AQQBKAAEATQBNAAEAUgBWAAIAVwBaAAMAWwBjAAQAZABkAAUAZQBpAAYAagBqAB0AawBvAAcAcABzAB8AdgB2AAEAdwB3ACcAgACAAB4AgQCKABAAiwCMACAAjQCNAC8AjgCfABAAoACgAAwAoQCkABAAsQCxACsAugDAACEAwQDKABAAzQDNABAAzgDR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';
        return this;
    };

    /* Get the file from the VFS
    * @returns {string}
    * @name addFileToVFS
    * @example
    * doc.getFileFromVFS("someFile.txt");
    */
    jsPDFAPI.getFileFromVFS = function (filename) {
        if (VFS.hasOwnProperty(filename)) {
            return VFS[filename];
        }
        return null;
    };
})(jsPDF.API);

/* Blob.js
 * A Blob implementation.
 * 2014-07-24
 *
 * By Eli Grey, http://eligrey.com
 * By Devin Samarin, https://github.com/dsamarin
 * License: X11/MIT
 *   See https://github.com/eligrey/Blob.js/blob/master/LICENSE.md
 */

/*global self, unescape */
/*jslint bitwise: true, regexp: true, confusion: true, es5: true, vars: true, white: true,
  plusplus: true */

/*! @source http://purl.eligrey.com/github/Blob.js/blob/master/Blob.js */

(function (view) {
	"use strict";

	view.URL = view.URL || view.webkitURL;

	if (view.Blob && view.URL) {
		try {
			new Blob;
			return;
		} catch (e) {}
	}

	// Internally we use a BlobBuilder implementation to base Blob off of
	// in order to support older browsers that only have BlobBuilder
	var BlobBuilder = view.BlobBuilder || view.WebKitBlobBuilder || view.MozBlobBuilder || (function(view) {
		var
			  get_class = function(object) {
				return Object.prototype.toString.call(object).match(/^\[object\s(.*)\]$/)[1];
			}
			, FakeBlobBuilder = function BlobBuilder() {
				this.data = [];
			}
			, FakeBlob = function Blob(data, type, encoding) {
				this.data = data;
				this.size = data.length;
				this.type = type;
				this.encoding = encoding;
			}
			, FBB_proto = FakeBlobBuilder.prototype
			, FB_proto = FakeBlob.prototype
			, FileReaderSync = view.FileReaderSync
			, FileException = function(type) {
				this.code = this[this.name = type];
			}
			, file_ex_codes = (
				  "NOT_FOUND_ERR SECURITY_ERR ABORT_ERR NOT_READABLE_ERR ENCODING_ERR "
				+ "NO_MODIFICATION_ALLOWED_ERR INVALID_STATE_ERR SYNTAX_ERR"
			).split(" ")
			, file_ex_code = file_ex_codes.length
			, real_URL = view.URL || view.webkitURL || view
			, real_create_object_URL = real_URL.createObjectURL
			, real_revoke_object_URL = real_URL.revokeObjectURL
			, URL = real_URL
			, btoa = view.btoa
			, atob = view.atob

			, ArrayBuffer = view.ArrayBuffer
			, Uint8Array = view.Uint8Array

			, origin = /^[\w-]+:\/*\[?[\w\.:-]+\]?(?::[0-9]+)?/;
		FakeBlob.fake = FB_proto.fake = true;
		while (file_ex_code--) {
			FileException.prototype[file_ex_codes[file_ex_code]] = file_ex_code + 1;
		}
		// Polyfill URL
		if (!real_URL.createObjectURL) {
			URL = view.URL = function(uri) {
				var
					  uri_info = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
					, uri_origin;
				uri_info.href = uri;
				if (!("origin" in uri_info)) {
					if (uri_info.protocol.toLowerCase() === "data:") {
						uri_info.origin = null;
					} else {
						uri_origin = uri.match(origin);
						uri_info.origin = uri_origin && uri_origin[1];
					}
				}
				return uri_info;
			};
		}
		URL.createObjectURL = function(blob) {
			var
				  type = blob.type
				, data_URI_header;
			if (type === null) {
				type = "application/octet-stream";
			}
			if (blob instanceof FakeBlob) {
				data_URI_header = "data:" + type;
				if (blob.encoding === "base64") {
					return data_URI_header + ";base64," + blob.data;
				} else if (blob.encoding === "URI") {
					return data_URI_header + "," + decodeURIComponent(blob.data);
				} if (btoa) {
					return data_URI_header + ";base64," + btoa(blob.data);
				} else {
					return data_URI_header + "," + encodeURIComponent(blob.data);
				}
			} else if (real_create_object_URL) {
				return real_create_object_URL.call(real_URL, blob);
			}
		};
		URL.revokeObjectURL = function(object_URL) {
			if (object_URL.substring(0, 5) !== "data:" && real_revoke_object_URL) {
				real_revoke_object_URL.call(real_URL, object_URL);
			}
		};
		FBB_proto.append = function(data/*, endings*/) {
			var bb = this.data;
			// decode data to a binary string
			if (Uint8Array && (data instanceof ArrayBuffer || data instanceof Uint8Array)) {
				var
					  str = ""
					, buf = new Uint8Array(data)
					, i = 0
					, buf_len = buf.length;
				for (; i < buf_len; i++) {
					str += String.fromCharCode(buf[i]);
				}
				bb.push(str);
			} else if (get_class(data) === "Blob" || get_class(data) === "File") {
				if (FileReaderSync) {
					var fr = new FileReaderSync;
					bb.push(fr.readAsBinaryString(data));
				} else {
					// async FileReader won't work as BlobBuilder is sync
					throw new FileException("NOT_READABLE_ERR");
				}
			} else if (data instanceof FakeBlob) {
				if (data.encoding === "base64" && atob) {
					bb.push(atob(data.data));
				} else if (data.encoding === "URI") {
					bb.push(decodeURIComponent(data.data));
				} else if (data.encoding === "raw") {
					bb.push(data.data);
				}
			} else {
				if (typeof data !== "string") {
					data += ""; // convert unsupported types to strings
				}
				// decode UTF-16 to binary string
				bb.push(unescape(encodeURIComponent(data)));
			}
		};
		FBB_proto.getBlob = function(type) {
			if (!arguments.length) {
				type = null;
			}
			return new FakeBlob(this.data.join(""), type, "raw");
		};
		FBB_proto.toString = function() {
			return "[object BlobBuilder]";
		};
		FB_proto.slice = function(start, end, type) {
			var args = arguments.length;
			if (args < 3) {
				type = null;
			}
			return new FakeBlob(
				  this.data.slice(start, args > 1 ? end : this.data.length)
				, type
				, this.encoding
			);
		};
		FB_proto.toString = function() {
			return "[object Blob]";
		};
		FB_proto.close = function() {
			this.size = 0;
			delete this.data;
		};
		return FakeBlobBuilder;
	}(view));

	view.Blob = function(blobParts, options) {
		var type = options ? (options.type || "") : "";
		var builder = new BlobBuilder();
		if (blobParts) {
			for (var i = 0, len = blobParts.length; i < len; i++) {
				if (Uint8Array && blobParts[i] instanceof Uint8Array) {
					builder.append(blobParts[i].buffer);
				}
				else {
					builder.append(blobParts[i]);
				}
			}
		}
		var blob = builder.getBlob(type);
		if (!blob.slice && blob.webkitSlice) {
			blob.slice = blob.webkitSlice;
		}
		return blob;
	};

	var getPrototypeOf = Object.getPrototypeOf || function(object) {
		return object.__proto__;
	};
	view.Blob.prototype = getPrototypeOf(new view.Blob());
}(typeof self !== "undefined" && self || typeof window !== "undefined" && window || window.content || window));

/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				};
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		};
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| window.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
  define("FileSaver.js", function() {
    return saveAs;
  });
}

/*
 * Copyright (c) 2012 chick307 <chick307@gmail.com>
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

void function(global, callback) {
	if (typeof module === 'object') {
		module.exports = callback();
	} else if (typeof define === 'function') {
		define(callback);
	} else {
		global.adler32cs = callback();
	}
}(window, function() {
	var _hasArrayBuffer = typeof ArrayBuffer === 'function' &&
		typeof Uint8Array === 'function';

	var _Buffer = null, _isBuffer = (function() {
		if (!_hasArrayBuffer)
			return function _isBuffer() { return false };

		try {
			var buffer = require('buffer');
			if (typeof buffer.Buffer === 'function')
				_Buffer = buffer.Buffer;
		} catch (error) {}

		return function _isBuffer(value) {
			return value instanceof ArrayBuffer ||
				_Buffer !== null && value instanceof _Buffer;
		};
	}());

	var _utf8ToBinary = (function() {
		if (_Buffer !== null) {
			return function _utf8ToBinary(utf8String) {
				return new _Buffer(utf8String, 'utf8').toString('binary');
			};
		} else {
			return function _utf8ToBinary(utf8String) {
				return unescape(encodeURIComponent(utf8String));
			};
		}
	}());

	var MOD = 65521;

	var _update = function _update(checksum, binaryString) {
		var a = checksum & 0xFFFF, b = checksum >>> 16;
		for (var i = 0, length = binaryString.length; i < length; i++) {
			a = (a + (binaryString.charCodeAt(i) & 0xFF)) % MOD;
			b = (b + a) % MOD;
		}
		return (b << 16 | a) >>> 0;
	};

	var _updateUint8Array = function _updateUint8Array(checksum, uint8Array) {
		var a = checksum & 0xFFFF, b = checksum >>> 16;
		for (var i = 0, length = uint8Array.length; i < length; i++) {
			a = (a + uint8Array[i]) % MOD;
			b = (b + a) % MOD;
		}
		return (b << 16 | a) >>> 0
	};

	var exports = {};

	var Adler32 = exports.Adler32 = (function() {
		var ctor = function Adler32(checksum) {
			if (!(this instanceof ctor)) {
				throw new TypeError(
					'Constructor cannot called be as a function.');
			}
			if (!isFinite(checksum = checksum == null ? 1 : +checksum)) {
				throw new Error(
					'First arguments needs to be a finite number.');
			}
			this.checksum = checksum >>> 0;
		};

		var proto = ctor.prototype = {};
		proto.constructor = ctor;

		ctor.from = function(from) {
			from.prototype = proto;
			return from;
		}(function from(binaryString) {
			if (!(this instanceof ctor)) {
				throw new TypeError(
					'Constructor cannot called be as a function.');
			}
			if (binaryString == null)
				throw new Error('First argument needs to be a string.');
			this.checksum = _update(1, binaryString.toString());
		});

		ctor.fromUtf8 = function(fromUtf8) {
			fromUtf8.prototype = proto;
			return fromUtf8;
		}(function fromUtf8(utf8String) {
			if (!(this instanceof ctor)) {
				throw new TypeError(
					'Constructor cannot called be as a function.');
			}
			if (utf8String == null)
				throw new Error('First argument needs to be a string.');
			var binaryString = _utf8ToBinary(utf8String.toString());
			this.checksum = _update(1, binaryString);
		});

		if (_hasArrayBuffer) {
			ctor.fromBuffer = function(fromBuffer) {
				fromBuffer.prototype = proto;
				return fromBuffer;
			}(function fromBuffer(buffer) {
				if (!(this instanceof ctor)) {
					throw new TypeError(
						'Constructor cannot called be as a function.');
				}
				if (!_isBuffer(buffer))
					throw new Error('First argument needs to be ArrayBuffer.');
				var array = new Uint8Array(buffer);
				return this.checksum = _updateUint8Array(1, array);
			});
		}

		proto.update = function update(binaryString) {
			if (binaryString == null)
				throw new Error('First argument needs to be a string.');
			binaryString = binaryString.toString();
			return this.checksum = _update(this.checksum, binaryString);
		};

		proto.updateUtf8 = function updateUtf8(utf8String) {
			if (utf8String == null)
				throw new Error('First argument needs to be a string.');
			var binaryString = _utf8ToBinary(utf8String.toString());
			return this.checksum = _update(this.checksum, binaryString);
		};

		if (_hasArrayBuffer) {
			proto.updateBuffer = function updateBuffer(buffer) {
				if (!_isBuffer(buffer))
					throw new Error('First argument needs to be ArrayBuffer.');
				var array = new Uint8Array(buffer);
				return this.checksum = _updateUint8Array(this.checksum, array);
			};
		}

		proto.clone = function clone() {
			return new Adler32(this.checksum);
		};

		return ctor;
	}());

	exports.from = function from(binaryString) {
		if (binaryString == null)
			throw new Error('First argument needs to be a string.');
		return _update(1, binaryString.toString());
	};

	exports.fromUtf8 = function fromUtf8(utf8String) {
		if (utf8String == null)
			throw new Error('First argument needs to be a string.');
		var binaryString = _utf8ToBinary(utf8String.toString());
		return _update(1, binaryString);
	};

	if (_hasArrayBuffer) {
		exports.fromBuffer = function fromBuffer(buffer) {
			if (!_isBuffer(buffer))
				throw new Error('First argument need to be ArrayBuffer.');
			var array = new Uint8Array(buffer);
			return _updateUint8Array(1, array);
		};
	}

	return exports;
});

/**
 * CssColors
 * Copyright (c) 2014 Steven Spungin (TwelveTone LLC)  steven@twelvetone.tv
 *
 * Licensed under the MIT License.
 * http://opensource.org/licenses/mit-license
 */

/**
 * Usage CssColors('red');
 * Returns RGB hex color with '#' prefix
 */

/*
 Deflate.js - https://github.com/gildas-lormeau/zip.js
 Copyright (c) 2013 Gildas Lormeau. All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions are met:

 1. Redistributions of source code must retain the above copyright notice,
 this list of conditions and the following disclaimer.

 2. Redistributions in binary form must reproduce the above copyright 
 notice, this list of conditions and the following disclaimer in 
 the documentation and/or other materials provided with the distribution.

 3. The names of the authors may not be used to endorse or promote products
 derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED WARRANTIES,
 INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL JCRAFT,
 INC. OR ANY CONTRIBUTORS TO THIS SOFTWARE BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
 OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
 LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/*
 * This program is based on JZlib 1.0.2 ymnk, JCraft,Inc.
 * JZlib is based on zlib-1.1.3, so all credit should go authors
 * Jean-loup Gailly(jloup@gzip.org) and Mark Adler(madler@alumni.caltech.edu)
 * and contributors of zlib.
 */

/*
  html2canvas 0.5.0-beta3 <http://html2canvas.hertzen.com>
  Copyright (c) 2016 Niklas von Hertzen

  Released under  License
*/

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.html2canvas=e();}}(function(){var define;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
(function (global){
/*! http://mths.be/punycode v1.2.4 by @mathias */
(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports;
	var freeModule = typeof module == 'object' && module &&
		module.exports == freeExports && module;
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^ -~]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /\x2E|\u3002|\uFF0E|\uFF61/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		while (length--) {
			array[length] = fn(array[length]);
		}
		return array;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings.
	 * @private
	 * @param {String} domain The domain name.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		return map(string.split(regexSeparators), fn).join('.');
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <http://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * http://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols to a Punycode string of ASCII-only
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name to Unicode. Only the
	 * Punycoded parts of the domain name will be converted, i.e. it doesn't
	 * matter if you call it on a string that has already been converted to
	 * Unicode.
	 * @memberOf punycode
	 * @param {String} domain The Punycode domain name to convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(domain) {
		return mapDomain(domain, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name to Punycode. Only the
	 * non-ASCII parts of the domain name will be converted, i.e. it doesn't
	 * matter if you call it with a domain that's already in ASCII.
	 * @memberOf punycode
	 * @param {String} domain The domain name to convert, as a Unicode string.
	 * @returns {String} The Punycode representation of the given domain name.
	 */
	function toASCII(domain) {
		return mapDomain(domain, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.2.4',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <http://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		typeof define == 'function' &&
		typeof define.amd == 'object' &&
		define.amd
	) {
		
	} else if (freeExports && !freeExports.nodeType) {
		if (freeModule) { // in Node.js or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else { // in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else { // in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
},{}],2:[function(_dereq_,module,exports){
var log = _dereq_('./log');

function restoreOwnerScroll(ownerDocument, x, y) {
    if (ownerDocument.defaultView && (x !== ownerDocument.defaultView.pageXOffset || y !== ownerDocument.defaultView.pageYOffset)) {
        ownerDocument.defaultView.scrollTo(x, y);
    }
}

function cloneCanvasContents(canvas, clonedCanvas) {
    try {
        if (clonedCanvas) {
            clonedCanvas.width = canvas.width;
            clonedCanvas.height = canvas.height;
            clonedCanvas.getContext("2d").putImageData(canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height), 0, 0);
        }
    } catch(e) {
        log("Unable to copy canvas content from", canvas, e);
    }
}

function cloneNode(node, javascriptEnabled) {
    var clone = node.nodeType === 3 ? document.createTextNode(node.nodeValue) : node.cloneNode(false);

    var child = node.firstChild;
    while(child) {
        if (javascriptEnabled === true || child.nodeType !== 1 || child.nodeName !== 'SCRIPT') {
            clone.appendChild(cloneNode(child, javascriptEnabled));
        }
        child = child.nextSibling;
    }

    if (node.nodeType === 1) {
        clone._scrollTop = node.scrollTop;
        clone._scrollLeft = node.scrollLeft;
        if (node.nodeName === "CANVAS") {
            cloneCanvasContents(node, clone);
        } else if (node.nodeName === "TEXTAREA" || node.nodeName === "SELECT") {
            clone.value = node.value;
        }
    }

    return clone;
}

function initNode(node) {
    if (node.nodeType === 1) {
        node.scrollTop = node._scrollTop;
        node.scrollLeft = node._scrollLeft;

        var child = node.firstChild;
        while(child) {
            initNode(child);
            child = child.nextSibling;
        }
    }
}

module.exports = function(ownerDocument, containerDocument, width, height, options, x ,y) {
    var documentElement = cloneNode(ownerDocument.documentElement, options.javascriptEnabled);
    var container = containerDocument.createElement("iframe");

    container.className = "html2canvas-container";
    container.style.visibility = "hidden";
    container.style.position = "fixed";
    container.style.left = "-10000px";
    container.style.top = "0px";
    container.style.border = "0";
    container.width = width;
    container.height = height;
    container.scrolling = "no"; // ios won't scroll without it
    containerDocument.body.appendChild(container);

    return new Promise(function(resolve) {
        var documentClone = container.contentWindow.document;

        /* Chrome doesn't detect relative background-images assigned in inline <style> sheets when fetched through getComputedStyle
         if window url is about:blank, we can assign the url to current by writing onto the document
         */
        container.contentWindow.onload = container.onload = function() {
            var interval = setInterval(function() {
                if (documentClone.body.childNodes.length > 0) {
                    initNode(documentClone.documentElement);
                    clearInterval(interval);
                    if (options.type === "view") {
                        container.contentWindow.scrollTo(x, y);
                        if ((/(iPad|iPhone|iPod)/g).test(navigator.userAgent) && (container.contentWindow.scrollY !== y || container.contentWindow.scrollX !== x)) {
                            documentClone.documentElement.style.top = (-y) + "px";
                            documentClone.documentElement.style.left = (-x) + "px";
                            documentClone.documentElement.style.position = 'absolute';
                        }
                    }
                    resolve(container);
                }
            }, 50);
        };

        documentClone.open();
        documentClone.write("<!DOCTYPE html><html></html>");
        // Chrome scrolls the parent document for some reason after the write to the cloned window???
        restoreOwnerScroll(ownerDocument, x, y);
        documentClone.replaceChild(documentClone.adoptNode(documentElement), documentClone.documentElement);
        documentClone.close();
    });
};

},{"./log":13}],3:[function(_dereq_,module,exports){
// http://dev.w3.org/csswg/css-color/

function Color(value) {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = null;
    var result = this.fromArray(value) ||
        this.namedColor(value) ||
        this.rgb(value) ||
        this.rgba(value) ||
        this.hex6(value) ||
        this.hex3(value);
}

Color.prototype.darken = function(amount) {
    var a = 1 - amount;
    return  new Color([
        Math.round(this.r * a),
        Math.round(this.g * a),
        Math.round(this.b * a),
        this.a
    ]);
};

Color.prototype.isTransparent = function() {
    return this.a === 0;
};

Color.prototype.isBlack = function() {
    return this.r === 0 && this.g === 0 && this.b === 0;
};

Color.prototype.fromArray = function(array) {
    if (Array.isArray(array)) {
        this.r = Math.min(array[0], 255);
        this.g = Math.min(array[1], 255);
        this.b = Math.min(array[2], 255);
        if (array.length > 3) {
            this.a = array[3];
        }
    }

    return (Array.isArray(array));
};

var _hex3 = /^#([a-f0-9]{3})$/i;

Color.prototype.hex3 = function(value) {
    var match = null;
    if ((match = value.match(_hex3)) !== null) {
        this.r = parseInt(match[1][0] + match[1][0], 16);
        this.g = parseInt(match[1][1] + match[1][1], 16);
        this.b = parseInt(match[1][2] + match[1][2], 16);
    }
    return match !== null;
};

var _hex6 = /^#([a-f0-9]{6})$/i;

Color.prototype.hex6 = function(value) {
    var match = null;
    if ((match = value.match(_hex6)) !== null) {
        this.r = parseInt(match[1].substring(0, 2), 16);
        this.g = parseInt(match[1].substring(2, 4), 16);
        this.b = parseInt(match[1].substring(4, 6), 16);
    }
    return match !== null;
};


var _rgb = /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/;

Color.prototype.rgb = function(value) {
    var match = null;
    if ((match = value.match(_rgb)) !== null) {
        this.r = Number(match[1]);
        this.g = Number(match[2]);
        this.b = Number(match[3]);
    }
    return match !== null;
};

var _rgba = /^rgba\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d?\.?\d+)\s*\)$/;

Color.prototype.rgba = function(value) {
    var match = null;
    if ((match = value.match(_rgba)) !== null) {
        this.r = Number(match[1]);
        this.g = Number(match[2]);
        this.b = Number(match[3]);
        this.a = Number(match[4]);
    }
    return match !== null;
};

Color.prototype.toString = function() {
    return this.a !== null && this.a !== 1 ?
    "rgba(" + [this.r, this.g, this.b, this.a].join(",") + ")" :
    "rgb(" + [this.r, this.g, this.b].join(",") + ")";
};

Color.prototype.namedColor = function(value) {
    value = value.toLowerCase();
    var color = colors[value];
    if (color) {
        this.r = color[0];
        this.g = color[1];
        this.b = color[2];
    } else if (value === "transparent") {
        this.r = this.g = this.b = this.a = 0;
        return true;
    }

    return !!color;
};

Color.prototype.isColor = true;

// JSON.stringify([].slice.call($$('.named-color-table tr'), 1).map(function(row) { return [row.childNodes[3].textContent, row.childNodes[5].textContent.trim().split(",").map(Number)] }).reduce(function(data, row) {data[row[0]] = row[1]; return data}, {}))
var colors = {
    "aliceblue": [240, 248, 255],
    "antiquewhite": [250, 235, 215],
    "aqua": [0, 255, 255],
    "aquamarine": [127, 255, 212],
    "azure": [240, 255, 255],
    "beige": [245, 245, 220],
    "bisque": [255, 228, 196],
    "black": [0, 0, 0],
    "blanchedalmond": [255, 235, 205],
    "blue": [0, 0, 255],
    "blueviolet": [138, 43, 226],
    "brown": [165, 42, 42],
    "burlywood": [222, 184, 135],
    "cadetblue": [95, 158, 160],
    "chartreuse": [127, 255, 0],
    "chocolate": [210, 105, 30],
    "coral": [255, 127, 80],
    "cornflowerblue": [100, 149, 237],
    "cornsilk": [255, 248, 220],
    "crimson": [220, 20, 60],
    "cyan": [0, 255, 255],
    "darkblue": [0, 0, 139],
    "darkcyan": [0, 139, 139],
    "darkgoldenrod": [184, 134, 11],
    "darkgray": [169, 169, 169],
    "darkgreen": [0, 100, 0],
    "darkgrey": [169, 169, 169],
    "darkkhaki": [189, 183, 107],
    "darkmagenta": [139, 0, 139],
    "darkolivegreen": [85, 107, 47],
    "darkorange": [255, 140, 0],
    "darkorchid": [153, 50, 204],
    "darkred": [139, 0, 0],
    "darksalmon": [233, 150, 122],
    "darkseagreen": [143, 188, 143],
    "darkslateblue": [72, 61, 139],
    "darkslategray": [47, 79, 79],
    "darkslategrey": [47, 79, 79],
    "darkturquoise": [0, 206, 209],
    "darkviolet": [148, 0, 211],
    "deeppink": [255, 20, 147],
    "deepskyblue": [0, 191, 255],
    "dimgray": [105, 105, 105],
    "dimgrey": [105, 105, 105],
    "dodgerblue": [30, 144, 255],
    "firebrick": [178, 34, 34],
    "floralwhite": [255, 250, 240],
    "forestgreen": [34, 139, 34],
    "fuchsia": [255, 0, 255],
    "gainsboro": [220, 220, 220],
    "ghostwhite": [248, 248, 255],
    "gold": [255, 215, 0],
    "goldenrod": [218, 165, 32],
    "gray": [128, 128, 128],
    "green": [0, 128, 0],
    "greenyellow": [173, 255, 47],
    "grey": [128, 128, 128],
    "honeydew": [240, 255, 240],
    "hotpink": [255, 105, 180],
    "indianred": [205, 92, 92],
    "indigo": [75, 0, 130],
    "ivory": [255, 255, 240],
    "khaki": [240, 230, 140],
    "lavender": [230, 230, 250],
    "lavenderblush": [255, 240, 245],
    "lawngreen": [124, 252, 0],
    "lemonchiffon": [255, 250, 205],
    "lightblue": [173, 216, 230],
    "lightcoral": [240, 128, 128],
    "lightcyan": [224, 255, 255],
    "lightgoldenrodyellow": [250, 250, 210],
    "lightgray": [211, 211, 211],
    "lightgreen": [144, 238, 144],
    "lightgrey": [211, 211, 211],
    "lightpink": [255, 182, 193],
    "lightsalmon": [255, 160, 122],
    "lightseagreen": [32, 178, 170],
    "lightskyblue": [135, 206, 250],
    "lightslategray": [119, 136, 153],
    "lightslategrey": [119, 136, 153],
    "lightsteelblue": [176, 196, 222],
    "lightyellow": [255, 255, 224],
    "lime": [0, 255, 0],
    "limegreen": [50, 205, 50],
    "linen": [250, 240, 230],
    "magenta": [255, 0, 255],
    "maroon": [128, 0, 0],
    "mediumaquamarine": [102, 205, 170],
    "mediumblue": [0, 0, 205],
    "mediumorchid": [186, 85, 211],
    "mediumpurple": [147, 112, 219],
    "mediumseagreen": [60, 179, 113],
    "mediumslateblue": [123, 104, 238],
    "mediumspringgreen": [0, 250, 154],
    "mediumturquoise": [72, 209, 204],
    "mediumvioletred": [199, 21, 133],
    "midnightblue": [25, 25, 112],
    "mintcream": [245, 255, 250],
    "mistyrose": [255, 228, 225],
    "moccasin": [255, 228, 181],
    "navajowhite": [255, 222, 173],
    "navy": [0, 0, 128],
    "oldlace": [253, 245, 230],
    "olive": [128, 128, 0],
    "olivedrab": [107, 142, 35],
    "orange": [255, 165, 0],
    "orangered": [255, 69, 0],
    "orchid": [218, 112, 214],
    "palegoldenrod": [238, 232, 170],
    "palegreen": [152, 251, 152],
    "paleturquoise": [175, 238, 238],
    "palevioletred": [219, 112, 147],
    "papayawhip": [255, 239, 213],
    "peachpuff": [255, 218, 185],
    "peru": [205, 133, 63],
    "pink": [255, 192, 203],
    "plum": [221, 160, 221],
    "powderblue": [176, 224, 230],
    "purple": [128, 0, 128],
    "rebeccapurple": [102, 51, 153],
    "red": [255, 0, 0],
    "rosybrown": [188, 143, 143],
    "royalblue": [65, 105, 225],
    "saddlebrown": [139, 69, 19],
    "salmon": [250, 128, 114],
    "sandybrown": [244, 164, 96],
    "seagreen": [46, 139, 87],
    "seashell": [255, 245, 238],
    "sienna": [160, 82, 45],
    "silver": [192, 192, 192],
    "skyblue": [135, 206, 235],
    "slateblue": [106, 90, 205],
    "slategray": [112, 128, 144],
    "slategrey": [112, 128, 144],
    "snow": [255, 250, 250],
    "springgreen": [0, 255, 127],
    "steelblue": [70, 130, 180],
    "tan": [210, 180, 140],
    "teal": [0, 128, 128],
    "thistle": [216, 191, 216],
    "tomato": [255, 99, 71],
    "turquoise": [64, 224, 208],
    "violet": [238, 130, 238],
    "wheat": [245, 222, 179],
    "white": [255, 255, 255],
    "whitesmoke": [245, 245, 245],
    "yellow": [255, 255, 0],
    "yellowgreen": [154, 205, 50]
};

module.exports = Color;

},{}],4:[function(_dereq_,module,exports){
var Support = _dereq_('./support');
var CanvasRenderer = _dereq_('./renderers/canvas');
var ImageLoader = _dereq_('./imageloader');
var NodeParser = _dereq_('./nodeparser');
var NodeContainer = _dereq_('./nodecontainer');
var log = _dereq_('./log');
var utils = _dereq_('./utils');
var createWindowClone = _dereq_('./clone');
var loadUrlDocument = _dereq_('./proxy').loadUrlDocument;
var getBounds = utils.getBounds;

var html2canvasNodeAttribute = "data-html2canvas-node";
var html2canvasCloneIndex = 0;

function html2canvas(nodeList, options) {
    var index = html2canvasCloneIndex++;
    options = options || {};
    if (options.logging) {
        log.options.logging = true;
        log.options.start = Date.now();
    }

    options.async = typeof(options.async) === "undefined" ? true : options.async;
    options.allowTaint = typeof(options.allowTaint) === "undefined" ? false : options.allowTaint;
    options.removeContainer = typeof(options.removeContainer) === "undefined" ? true : options.removeContainer;
    options.javascriptEnabled = typeof(options.javascriptEnabled) === "undefined" ? false : options.javascriptEnabled;
    options.imageTimeout = typeof(options.imageTimeout) === "undefined" ? 10000 : options.imageTimeout;
    options.renderer = typeof(options.renderer) === "function" ? options.renderer : CanvasRenderer;
    options.strict = !!options.strict;

    if (typeof(nodeList) === "string") {
        if (typeof(options.proxy) !== "string") {
            return Promise.reject("Proxy must be used when rendering url");
        }
        var width = options.width != null ? options.width : window.innerWidth;
        var height = options.height != null ? options.height : window.innerHeight;
        return loadUrlDocument(absoluteUrl(nodeList), options.proxy, document, width, height, options).then(function(container) {
            return renderWindow(container.contentWindow.document.documentElement, container, options, width, height);
        });
    }

    var node = ((nodeList === undefined) ? [document.documentElement] : ((nodeList.length) ? nodeList : [nodeList]))[0];
    node.setAttribute(html2canvasNodeAttribute + index, index);
    return renderDocument(node.ownerDocument, options, node.ownerDocument.defaultView.innerWidth, node.ownerDocument.defaultView.innerHeight, index).then(function(canvas) {
        if (typeof(options.onrendered) === "function") {
            log("options.onrendered is deprecated, html2canvas returns a Promise containing the canvas");
            options.onrendered(canvas);
        }
        return canvas;
    });
}

html2canvas.CanvasRenderer = CanvasRenderer;
html2canvas.NodeContainer = NodeContainer;
html2canvas.log = log;
html2canvas.utils = utils;

var html2canvasExport = (typeof(document) === "undefined" || typeof(Object.create) !== "function" || typeof(document.createElement("canvas").getContext) !== "function") ? function() {
    return Promise.reject("No canvas support");
} : html2canvas;

module.exports = html2canvasExport;

function renderDocument(document, options, windowWidth, windowHeight, html2canvasIndex) {
    return createWindowClone(document, document, windowWidth, windowHeight, options, document.defaultView.pageXOffset, document.defaultView.pageYOffset).then(function(container) {
        log("Document cloned");
        var attributeName = html2canvasNodeAttribute + html2canvasIndex;
        var selector = "[" + attributeName + "='" + html2canvasIndex + "']";
        document.querySelector(selector).removeAttribute(attributeName);
        var clonedWindow = container.contentWindow;
        var node = clonedWindow.document.querySelector(selector);
        var oncloneHandler = (typeof(options.onclone) === "function") ? Promise.resolve(options.onclone(clonedWindow.document)) : Promise.resolve(true);
        return oncloneHandler.then(function() {
            return renderWindow(node, container, options, windowWidth, windowHeight);
        });
    });
}

function renderWindow(node, container, options, windowWidth, windowHeight) {
    var clonedWindow = container.contentWindow;
    var support = new Support(clonedWindow.document);
    var imageLoader = new ImageLoader(options, support);
    var bounds = getBounds(node);
    var width = options.type === "view" ? windowWidth : documentWidth(clonedWindow.document);
    var height = options.type === "view" ? windowHeight : documentHeight(clonedWindow.document);
    var renderer = new options.renderer(width, height, imageLoader, options, document);
    var parser = new NodeParser(node, renderer, support, imageLoader, options);
    return parser.ready.then(function() {
        log("Finished rendering");
        var canvas;

        if (options.type === "view") {
            canvas = crop(renderer.canvas, {width: renderer.canvas.width, height: renderer.canvas.height, top: 0, left: 0, x: 0, y: 0});
        } else if (node === clonedWindow.document.body || node === clonedWindow.document.documentElement || options.canvas != null) {
            canvas = renderer.canvas;
        } else {
            canvas = crop(renderer.canvas, {width:  options.width != null ? options.width : bounds.width, height: options.height != null ? options.height : bounds.height, top: bounds.top, left: bounds.left, x: 0, y: 0});
        }

        cleanupContainer(container, options);
        return canvas;
    });
}

function cleanupContainer(container, options) {
    if (options.removeContainer) {
        container.parentNode.removeChild(container);
        log("Cleaned up container");
    }
}

function crop(canvas, bounds) {
    var croppedCanvas = document.createElement("canvas");
    var x1 = Math.min(canvas.width - 1, Math.max(0, bounds.left));
    var x2 = Math.min(canvas.width, Math.max(1, bounds.left + bounds.width));
    var y1 = Math.min(canvas.height - 1, Math.max(0, bounds.top));
    var y2 = Math.min(canvas.height, Math.max(1, bounds.top + bounds.height));
    croppedCanvas.width = bounds.width;
    croppedCanvas.height =  bounds.height;
    var width = x2-x1;
    var height = y2-y1;
    log("Cropping canvas at:", "left:", bounds.left, "top:", bounds.top, "width:", width, "height:", height);
    log("Resulting crop with width", bounds.width, "and height", bounds.height, "with x", x1, "and y", y1);
    croppedCanvas.getContext("2d").drawImage(canvas, x1, y1, width, height, bounds.x, bounds.y, width, height);
    return croppedCanvas;
}

function documentWidth (doc) {
    return Math.max(
        Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth),
        Math.max(doc.body.offsetWidth, doc.documentElement.offsetWidth),
        Math.max(doc.body.clientWidth, doc.documentElement.clientWidth)
    );
}

function documentHeight (doc) {
    return Math.max(
        Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight),
        Math.max(doc.body.offsetHeight, doc.documentElement.offsetHeight),
        Math.max(doc.body.clientHeight, doc.documentElement.clientHeight)
    );
}

function absoluteUrl(url) {
    var link = document.createElement("a");
    link.href = url;
    link.href = link.href;
    return link;
}

},{"./clone":2,"./imageloader":11,"./log":13,"./nodecontainer":14,"./nodeparser":15,"./proxy":16,"./renderers/canvas":20,"./support":22,"./utils":26}],5:[function(_dereq_,module,exports){
var log = _dereq_('./log');
var smallImage = _dereq_('./utils').smallImage;

function DummyImageContainer(src) {
    this.src = src;
    log("DummyImageContainer for", src);
    if (!this.promise || !this.image) {
        log("Initiating DummyImageContainer");
        DummyImageContainer.prototype.image = new Image();
        var image = this.image;
        DummyImageContainer.prototype.promise = new Promise(function(resolve, reject) {
            image.onload = resolve;
            image.onerror = reject;
            image.src = smallImage();
            if (image.complete === true) {
                resolve(image);
            }
        });
    }
}

module.exports = DummyImageContainer;

},{"./log":13,"./utils":26}],6:[function(_dereq_,module,exports){
var smallImage = _dereq_('./utils').smallImage;

function Font(family, size) {
    var container = document.createElement('div'),
        img = document.createElement('img'),
        span = document.createElement('span'),
        sampleText = 'Hidden Text',
        baseline,
        middle;

    container.style.visibility = "hidden";
    container.style.fontFamily = family;
    container.style.fontSize = size;
    container.style.margin = 0;
    container.style.padding = 0;

    document.body.appendChild(container);

    img.src = smallImage();
    img.width = 1;
    img.height = 1;

    img.style.margin = 0;
    img.style.padding = 0;
    img.style.verticalAlign = "baseline";

    span.style.fontFamily = family;
    span.style.fontSize = size;
    span.style.margin = 0;
    span.style.padding = 0;

    span.appendChild(document.createTextNode(sampleText));
    container.appendChild(span);
    container.appendChild(img);
    baseline = (img.offsetTop - span.offsetTop) + 1;

    container.removeChild(span);
    container.appendChild(document.createTextNode(sampleText));

    container.style.lineHeight = "normal";
    img.style.verticalAlign = "super";

    middle = (img.offsetTop-container.offsetTop) + 1;

    document.body.removeChild(container);

    this.baseline = baseline;
    this.lineWidth = 1;
    this.middle = middle;
}

module.exports = Font;

},{"./utils":26}],7:[function(_dereq_,module,exports){
var Font = _dereq_('./font');

function FontMetrics() {
    this.data = {};
}

FontMetrics.prototype.getMetrics = function(family, size) {
    if (this.data[family + "-" + size] === undefined) {
        this.data[family + "-" + size] = new Font(family, size);
    }
    return this.data[family + "-" + size];
};

module.exports = FontMetrics;

},{"./font":6}],8:[function(_dereq_,module,exports){
var utils = _dereq_('./utils');
var getBounds = utils.getBounds;
var loadUrlDocument = _dereq_('./proxy').loadUrlDocument;

function FrameContainer(container, sameOrigin, options) {
    this.image = null;
    this.src = container;
    var self = this;
    var bounds = getBounds(container);
    this.promise = (!sameOrigin ? this.proxyLoad(options.proxy, bounds, options) : new Promise(function(resolve) {
        if (container.contentWindow.document.URL === "about:blank" || container.contentWindow.document.documentElement == null) {
            container.contentWindow.onload = container.onload = function() {
                resolve(container);
            };
        } else {
            resolve(container);
        }
    })).then(function(container) {
        var html2canvas = _dereq_('./core');
        return html2canvas(container.contentWindow.document.documentElement, {type: 'view', width: container.width, height: container.height, proxy: options.proxy, javascriptEnabled: options.javascriptEnabled, removeContainer: options.removeContainer, allowTaint: options.allowTaint, imageTimeout: options.imageTimeout / 2});
    }).then(function(canvas) {
        return self.image = canvas;
    });
}

FrameContainer.prototype.proxyLoad = function(proxy, bounds, options) {
    var container = this.src;
    return loadUrlDocument(container.src, proxy, container.ownerDocument, bounds.width, bounds.height, options);
};

module.exports = FrameContainer;

},{"./core":4,"./proxy":16,"./utils":26}],9:[function(_dereq_,module,exports){
function GradientContainer(imageData) {
    this.src = imageData.value;
    this.colorStops = [];
    this.type = null;
    this.x0 = 0.5;
    this.y0 = 0.5;
    this.x1 = 0.5;
    this.y1 = 0.5;
    this.promise = Promise.resolve(true);
}

GradientContainer.TYPES = {
    LINEAR: 1,
    RADIAL: 2
};

// TODO: support hsl[a], negative %/length values
// TODO: support <angle> (e.g. -?\d{1,3}(?:\.\d+)deg, etc. : https://developer.mozilla.org/docs/Web/CSS/angle )
GradientContainer.REGEXP_COLORSTOP = /^\s*(rgba?\(\s*\d{1,3},\s*\d{1,3},\s*\d{1,3}(?:,\s*[0-9\.]+)?\s*\)|[a-z]{3,20}|#[a-f0-9]{3,6})(?:\s+(\d{1,3}(?:\.\d+)?)(%|px)?)?(?:\s|$)/i;

module.exports = GradientContainer;

},{}],10:[function(_dereq_,module,exports){
function ImageContainer(src, cors) {
    this.src = src;
    this.image = new Image();
    var self = this;
    this.tainted = null;
    this.promise = new Promise(function(resolve, reject) {
        self.image.onload = resolve;
        self.image.onerror = reject;
        if (cors) {
            self.image.crossOrigin = "anonymous";
        }
        self.image.src = src;
        if (self.image.complete === true) {
            resolve(self.image);
        }
    });
}

module.exports = ImageContainer;

},{}],11:[function(_dereq_,module,exports){
var log = _dereq_('./log');
var ImageContainer = _dereq_('./imagecontainer');
var DummyImageContainer = _dereq_('./dummyimagecontainer');
var ProxyImageContainer = _dereq_('./proxyimagecontainer');
var FrameContainer = _dereq_('./framecontainer');
var SVGContainer = _dereq_('./svgcontainer');
var SVGNodeContainer = _dereq_('./svgnodecontainer');
var LinearGradientContainer = _dereq_('./lineargradientcontainer');
var WebkitGradientContainer = _dereq_('./webkitgradientcontainer');
var bind = _dereq_('./utils').bind;

function ImageLoader(options, support) {
    this.link = null;
    this.options = options;
    this.support = support;
    this.origin = this.getOrigin(window.location.href);
}

ImageLoader.prototype.findImages = function(nodes) {
    var images = [];
    nodes.reduce(function(imageNodes, container) {
        switch(container.node.nodeName) {
        case "IMG":
            return imageNodes.concat([{
                args: [container.node.src],
                method: "url"
            }]);
        case "svg":
        case "IFRAME":
            return imageNodes.concat([{
                args: [container.node],
                method: container.node.nodeName
            }]);
        }
        return imageNodes;
    }, []).forEach(this.addImage(images, this.loadImage), this);
    return images;
};

ImageLoader.prototype.findBackgroundImage = function(images, container) {
    container.parseBackgroundImages().filter(this.hasImageBackground).forEach(this.addImage(images, this.loadImage), this);
    return images;
};

ImageLoader.prototype.addImage = function(images, callback) {
    return function(newImage) {
        newImage.args.forEach(function(image) {
            if (!this.imageExists(images, image)) {
                images.splice(0, 0, callback.call(this, newImage));
                log('Added image #' + (images.length), typeof(image) === "string" ? image.substring(0, 100) : image);
            }
        }, this);
    };
};

ImageLoader.prototype.hasImageBackground = function(imageData) {
    return imageData.method !== "none";
};

ImageLoader.prototype.loadImage = function(imageData) {
    if (imageData.method === "url") {
        var src = imageData.args[0];
        if (this.isSVG(src) && !this.support.svg && !this.options.allowTaint) {
            return new SVGContainer(src);
        } else if (src.match(/data:image\/.*;base64,/i)) {
            return new ImageContainer(src.replace(/url\(['"]{0,}|['"]{0,}\)$/ig, ''), false);
        } else if (this.isSameOrigin(src) || this.options.allowTaint === true || this.isSVG(src)) {
            return new ImageContainer(src, false);
        } else if (this.support.cors && !this.options.allowTaint && this.options.useCORS) {
            return new ImageContainer(src, true);
        } else if (this.options.proxy) {
            return new ProxyImageContainer(src, this.options.proxy);
        } else {
            return new DummyImageContainer(src);
        }
    } else if (imageData.method === "linear-gradient") {
        return new LinearGradientContainer(imageData);
    } else if (imageData.method === "gradient") {
        return new WebkitGradientContainer(imageData);
    } else if (imageData.method === "svg") {
        return new SVGNodeContainer(imageData.args[0], this.support.svg);
    } else if (imageData.method === "IFRAME") {
        return new FrameContainer(imageData.args[0], this.isSameOrigin(imageData.args[0].src), this.options);
    } else {
        return new DummyImageContainer(imageData);
    }
};

ImageLoader.prototype.isSVG = function(src) {
    return src.substring(src.length - 3).toLowerCase() === "svg" || SVGContainer.prototype.isInline(src);
};

ImageLoader.prototype.imageExists = function(images, src) {
    return images.some(function(image) {
        return image.src === src;
    });
};

ImageLoader.prototype.isSameOrigin = function(url) {
    return (this.getOrigin(url) === this.origin);
};

ImageLoader.prototype.getOrigin = function(url) {
    var link = this.link || (this.link = document.createElement("a"));
    link.href = url;
    link.href = link.href; // IE9, LOL! - http://jsfiddle.net/niklasvh/2e48b/
    return link.protocol + link.hostname + link.port;
};

ImageLoader.prototype.getPromise = function(container) {
    return this.timeout(container, this.options.imageTimeout)['catch'](function() {
        var dummy = new DummyImageContainer(container.src);
        return dummy.promise.then(function(image) {
            container.image = image;
        });
    });
};

ImageLoader.prototype.get = function(src) {
    var found = null;
    return this.images.some(function(img) {
        return (found = img).src === src;
    }) ? found : null;
};

ImageLoader.prototype.fetch = function(nodes) {
    this.images = nodes.reduce(bind(this.findBackgroundImage, this), this.findImages(nodes));
    this.images.forEach(function(image, index) {
        image.promise.then(function() {
            log("Succesfully loaded image #"+ (index+1), image);
        }, function(e) {
            log("Failed loading image #"+ (index+1), image, e);
        });
    });
    this.ready = Promise.all(this.images.map(this.getPromise, this));
    log("Finished searching images");
    return this;
};

ImageLoader.prototype.timeout = function(container, timeout) {
    var timer;
    var promise = Promise.race([container.promise, new Promise(function(res, reject) {
        timer = setTimeout(function() {
            log("Timed out loading image", container);
            reject(container);
        }, timeout);
    })]).then(function(container) {
        clearTimeout(timer);
        return container;
    });
    promise['catch'](function() {
        clearTimeout(timer);
    });
    return promise;
};

module.exports = ImageLoader;

},{"./dummyimagecontainer":5,"./framecontainer":8,"./imagecontainer":10,"./lineargradientcontainer":12,"./log":13,"./proxyimagecontainer":17,"./svgcontainer":23,"./svgnodecontainer":24,"./utils":26,"./webkitgradientcontainer":27}],12:[function(_dereq_,module,exports){
var GradientContainer = _dereq_('./gradientcontainer');
var Color = _dereq_('./color');

function LinearGradientContainer(imageData) {
    GradientContainer.apply(this, arguments);
    this.type = GradientContainer.TYPES.LINEAR;

    var hasDirection = LinearGradientContainer.REGEXP_DIRECTION.test( imageData.args[0] ) ||
        !GradientContainer.REGEXP_COLORSTOP.test( imageData.args[0] );

    if (hasDirection) {
        imageData.args[0].split(/\s+/).reverse().forEach(function(position, index) {
            switch(position) {
            case "left":
                this.x0 = 0;
                this.x1 = 1;
                break;
            case "top":
                this.y0 = 0;
                this.y1 = 1;
                break;
            case "right":
                this.x0 = 1;
                this.x1 = 0;
                break;
            case "bottom":
                this.y0 = 1;
                this.y1 = 0;
                break;
            case "to":
                var y0 = this.y0;
                var x0 = this.x0;
                this.y0 = this.y1;
                this.x0 = this.x1;
                this.x1 = x0;
                this.y1 = y0;
                break;
            case "center":
                break; // centered by default
            // Firefox internally converts position keywords to percentages:
            // http://www.w3.org/TR/2010/WD-CSS2-20101207/colors.html#propdef-background-position
            default: // percentage or absolute length
                // TODO: support absolute start point positions (e.g., use bounds to convert px to a ratio)
                var ratio = parseFloat(position, 10) * 1e-2;
                if (isNaN(ratio)) { // invalid or unhandled value
                    break;
                }
                if (index === 0) {
                    this.y0 = ratio;
                    this.y1 = 1 - this.y0;
                } else {
                    this.x0 = ratio;
                    this.x1 = 1 - this.x0;
                }
                break;
            }
        }, this);
    } else {
        this.y0 = 0;
        this.y1 = 1;
    }

    this.colorStops = imageData.args.slice(hasDirection ? 1 : 0).map(function(colorStop) {
        var colorStopMatch = colorStop.match(GradientContainer.REGEXP_COLORSTOP);
        var value = +colorStopMatch[2];
        var unit = value === 0 ? "%" : colorStopMatch[3]; // treat "0" as "0%"
        return {
            color: new Color(colorStopMatch[1]),
            // TODO: support absolute stop positions (e.g., compute gradient line length & convert px to ratio)
            stop: unit === "%" ? value / 100 : null
        };
    });

    if (this.colorStops[0].stop === null) {
        this.colorStops[0].stop = 0;
    }

    if (this.colorStops[this.colorStops.length - 1].stop === null) {
        this.colorStops[this.colorStops.length - 1].stop = 1;
    }

    // calculates and fills-in explicit stop positions when omitted from rule
    this.colorStops.forEach(function(colorStop, index) {
        if (colorStop.stop === null) {
            this.colorStops.slice(index).some(function(find, count) {
                if (find.stop !== null) {
                    colorStop.stop = ((find.stop - this.colorStops[index - 1].stop) / (count + 1)) + this.colorStops[index - 1].stop;
                    return true;
                } else {
                    return false;
                }
            }, this);
        }
    }, this);
}

LinearGradientContainer.prototype = Object.create(GradientContainer.prototype);

// TODO: support <angle> (e.g. -?\d{1,3}(?:\.\d+)deg, etc. : https://developer.mozilla.org/docs/Web/CSS/angle )
LinearGradientContainer.REGEXP_DIRECTION = /^\s*(?:to|left|right|top|bottom|center|\d{1,3}(?:\.\d+)?%?)(?:\s|$)/i;

module.exports = LinearGradientContainer;

},{"./color":3,"./gradientcontainer":9}],13:[function(_dereq_,module,exports){
var logger = function() {
    if (logger.options.logging && window.console && window.console.log) {
        Function.prototype.bind.call(window.console.log, (window.console)).apply(window.console, [(Date.now() - logger.options.start) + "ms", "html2canvas:"].concat([].slice.call(arguments, 0)));
    }
};

logger.options = {logging: false};
module.exports = logger;

},{}],14:[function(_dereq_,module,exports){
var Color = _dereq_('./color');
var utils = _dereq_('./utils');
var getBounds = utils.getBounds;
var parseBackgrounds = utils.parseBackgrounds;
var offsetBounds = utils.offsetBounds;

function NodeContainer(node, parent) {
    this.node = node;
    this.parent = parent;
    this.stack = null;
    this.bounds = null;
    this.borders = null;
    this.clip = [];
    this.backgroundClip = [];
    this.offsetBounds = null;
    this.visible = null;
    this.computedStyles = null;
    this.colors = {};
    this.styles = {};
    this.backgroundImages = null;
    this.transformData = null;
    this.transformMatrix = null;
    this.isPseudoElement = false;
    this.opacity = null;
}

NodeContainer.prototype.cloneTo = function(stack) {
    stack.visible = this.visible;
    stack.borders = this.borders;
    stack.bounds = this.bounds;
    stack.clip = this.clip;
    stack.backgroundClip = this.backgroundClip;
    stack.computedStyles = this.computedStyles;
    stack.styles = this.styles;
    stack.backgroundImages = this.backgroundImages;
    stack.opacity = this.opacity;
};

NodeContainer.prototype.getOpacity = function() {
    return this.opacity === null ? (this.opacity = this.cssFloat('opacity')) : this.opacity;
};

NodeContainer.prototype.assignStack = function(stack) {
    this.stack = stack;
    stack.children.push(this);
};

NodeContainer.prototype.isElementVisible = function() {
    return this.node.nodeType === Node.TEXT_NODE ? this.parent.visible : (
        this.css('display') !== "none" &&
        this.css('visibility') !== "hidden" &&
        !this.node.hasAttribute("data-html2canvas-ignore") &&
        (this.node.nodeName !== "INPUT" || this.node.getAttribute("type") !== "hidden")
    );
};

NodeContainer.prototype.css = function(attribute) {
    if (!this.computedStyles) {
        this.computedStyles = this.isPseudoElement ? this.parent.computedStyle(this.before ? ":before" : ":after") : this.computedStyle(null);
    }

    return this.styles[attribute] || (this.styles[attribute] = this.computedStyles[attribute]);
};

NodeContainer.prototype.prefixedCss = function(attribute) {
    var prefixes = ["webkit", "moz", "ms", "o"];
    var value = this.css(attribute);
    if (value === undefined) {
        prefixes.some(function(prefix) {
            value = this.css(prefix + attribute.substr(0, 1).toUpperCase() + attribute.substr(1));
            return value !== undefined;
        }, this);
    }
    return value === undefined ? null : value;
};

NodeContainer.prototype.computedStyle = function(type) {
    return this.node.ownerDocument.defaultView.getComputedStyle(this.node, type);
};

NodeContainer.prototype.cssInt = function(attribute) {
    var value = parseInt(this.css(attribute), 10);
    return (isNaN(value)) ? 0 : value; // borders in old IE are throwing 'medium' for demo.html
};

NodeContainer.prototype.color = function(attribute) {
    return this.colors[attribute] || (this.colors[attribute] = new Color(this.css(attribute)));
};

NodeContainer.prototype.cssFloat = function(attribute) {
    var value = parseFloat(this.css(attribute));
    return (isNaN(value)) ? 0 : value;
};

NodeContainer.prototype.fontWeight = function() {
    var weight = this.css("fontWeight");
    switch(parseInt(weight, 10)){
    case 401:
        weight = "bold";
        break;
    case 400:
        weight = "normal";
        break;
    }
    return weight;
};

NodeContainer.prototype.parseClip = function() {
    var matches = this.css('clip').match(this.CLIP);
    if (matches) {
        return {
            top: parseInt(matches[1], 10),
            right: parseInt(matches[2], 10),
            bottom: parseInt(matches[3], 10),
            left: parseInt(matches[4], 10)
        };
    }
    return null;
};

NodeContainer.prototype.parseBackgroundImages = function() {
    return this.backgroundImages || (this.backgroundImages = parseBackgrounds(this.css("backgroundImage")));
};

NodeContainer.prototype.cssList = function(property, index) {
    var value = (this.css(property) || '').split(',');
    value = value[index || 0] || value[0] || 'auto';
    value = value.trim().split(' ');
    if (value.length === 1) {
        value = [value[0], isPercentage(value[0]) ? 'auto' : value[0]];
    }
    return value;
};

NodeContainer.prototype.parseBackgroundSize = function(bounds, image, index) {
    var size = this.cssList("backgroundSize", index);
    var width, height;

    if (isPercentage(size[0])) {
        width = bounds.width * parseFloat(size[0]) / 100;
    } else if (/contain|cover/.test(size[0])) {
        var targetRatio = bounds.width / bounds.height, currentRatio = image.width / image.height;
        return (targetRatio < currentRatio ^ size[0] === 'contain') ?  {width: bounds.height * currentRatio, height: bounds.height} : {width: bounds.width, height: bounds.width / currentRatio};
    } else {
        width = parseInt(size[0], 10);
    }

    if (size[0] === 'auto' && size[1] === 'auto') {
        height = image.height;
    } else if (size[1] === 'auto') {
        height = width / image.width * image.height;
    } else if (isPercentage(size[1])) {
        height =  bounds.height * parseFloat(size[1]) / 100;
    } else {
        height = parseInt(size[1], 10);
    }

    if (size[0] === 'auto') {
        width = height / image.height * image.width;
    }

    return {width: width, height: height};
};

NodeContainer.prototype.parseBackgroundPosition = function(bounds, image, index, backgroundSize) {
    var position = this.cssList('backgroundPosition', index);
    var left, top;

    if (isPercentage(position[0])){
        left = (bounds.width - (backgroundSize || image).width) * (parseFloat(position[0]) / 100);
    } else {
        left = parseInt(position[0], 10);
    }

    if (position[1] === 'auto') {
        top = left / image.width * image.height;
    } else if (isPercentage(position[1])){
        top =  (bounds.height - (backgroundSize || image).height) * parseFloat(position[1]) / 100;
    } else {
        top = parseInt(position[1], 10);
    }

    if (position[0] === 'auto') {
        left = top / image.height * image.width;
    }

    return {left: left, top: top};
};

NodeContainer.prototype.parseBackgroundRepeat = function(index) {
    return this.cssList("backgroundRepeat", index)[0];
};

NodeContainer.prototype.parseTextShadows = function() {
    var textShadow = this.css("textShadow");
    var results = [];

    if (textShadow && textShadow !== 'none') {
        var shadows = textShadow.match(this.TEXT_SHADOW_PROPERTY);
        for (var i = 0; shadows && (i < shadows.length); i++) {
            var s = shadows[i].match(this.TEXT_SHADOW_VALUES);
            results.push({
                color: new Color(s[0]),
                offsetX: s[1] ? parseFloat(s[1].replace('px', '')) : 0,
                offsetY: s[2] ? parseFloat(s[2].replace('px', '')) : 0,
                blur: s[3] ? s[3].replace('px', '') : 0
            });
        }
    }
    return results;
};

NodeContainer.prototype.parseTransform = function() {
    if (!this.transformData) {
        if (this.hasTransform()) {
            var offset = this.parseBounds();
            var origin = this.prefixedCss("transformOrigin").split(" ").map(removePx).map(asFloat);
            origin[0] += offset.left;
            origin[1] += offset.top;
            this.transformData = {
                origin: origin,
                matrix: this.parseTransformMatrix()
            };
        } else {
            this.transformData = {
                origin: [0, 0],
                matrix: [1, 0, 0, 1, 0, 0]
            };
        }
    }
    return this.transformData;
};

NodeContainer.prototype.parseTransformMatrix = function() {
    if (!this.transformMatrix) {
        var transform = this.prefixedCss("transform");
        var matrix = transform ? parseMatrix(transform.match(this.MATRIX_PROPERTY)) : null;
        this.transformMatrix = matrix ? matrix : [1, 0, 0, 1, 0, 0];
    }
    return this.transformMatrix;
};

NodeContainer.prototype.parseBounds = function() {
    return this.bounds || (this.bounds = this.hasTransform() ? offsetBounds(this.node) : getBounds(this.node));
};

NodeContainer.prototype.hasTransform = function() {
    return this.parseTransformMatrix().join(",") !== "1,0,0,1,0,0" || (this.parent && this.parent.hasTransform());
};

NodeContainer.prototype.getValue = function() {
    var value = this.node.value || "";
    if (this.node.tagName === "SELECT") {
        value = selectionValue(this.node);
    } else if (this.node.type === "password") {
        value = Array(value.length + 1).join('\u2022'); // jshint ignore:line
    }
    return value.length === 0 ? (this.node.placeholder || "") : value;
};

NodeContainer.prototype.MATRIX_PROPERTY = /(matrix|matrix3d)\((.+)\)/;
NodeContainer.prototype.TEXT_SHADOW_PROPERTY = /((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g;
NodeContainer.prototype.TEXT_SHADOW_VALUES = /(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g;
NodeContainer.prototype.CLIP = /^rect\((\d+)px,? (\d+)px,? (\d+)px,? (\d+)px\)$/;

function selectionValue(node) {
    var option = node.options[node.selectedIndex || 0];
    return option ? (option.text || "") : "";
}

function parseMatrix(match) {
    if (match && match[1] === "matrix") {
        return match[2].split(",").map(function(s) {
            return parseFloat(s.trim());
        });
    } else if (match && match[1] === "matrix3d") {
        var matrix3d = match[2].split(",").map(function(s) {
          return parseFloat(s.trim());
        });
        return [matrix3d[0], matrix3d[1], matrix3d[4], matrix3d[5], matrix3d[12], matrix3d[13]];
    }
}

function isPercentage(value) {
    return value.toString().indexOf("%") !== -1;
}

function removePx(str) {
    return str.replace("px", "");
}

function asFloat(str) {
    return parseFloat(str);
}

module.exports = NodeContainer;

},{"./color":3,"./utils":26}],15:[function(_dereq_,module,exports){
var log = _dereq_('./log');
var punycode = _dereq_('punycode');
var NodeContainer = _dereq_('./nodecontainer');
var TextContainer = _dereq_('./textcontainer');
var PseudoElementContainer = _dereq_('./pseudoelementcontainer');
var FontMetrics = _dereq_('./fontmetrics');
var Color = _dereq_('./color');
var StackingContext = _dereq_('./stackingcontext');
var utils = _dereq_('./utils');
var bind = utils.bind;
var getBounds = utils.getBounds;
var parseBackgrounds = utils.parseBackgrounds;
var offsetBounds = utils.offsetBounds;

function NodeParser(element, renderer, support, imageLoader, options) {
    log("Starting NodeParser");
    this.renderer = renderer;
    this.options = options;
    this.range = null;
    this.support = support;
    this.renderQueue = [];
    this.stack = new StackingContext(true, 1, element.ownerDocument, null);
    var parent = new NodeContainer(element, null);
    if (options.background) {
        renderer.rectangle(0, 0, renderer.width, renderer.height, new Color(options.background));
    }
    if (element === element.ownerDocument.documentElement) {
        // http://www.w3.org/TR/css3-background/#special-backgrounds
        var canvasBackground = new NodeContainer(parent.color('backgroundColor').isTransparent() ? element.ownerDocument.body : element.ownerDocument.documentElement, null);
        renderer.rectangle(0, 0, renderer.width, renderer.height, canvasBackground.color('backgroundColor'));
    }
    parent.visibile = parent.isElementVisible();
    this.createPseudoHideStyles(element.ownerDocument);
    this.disableAnimations(element.ownerDocument);
    this.nodes = flatten([parent].concat(this.getChildren(parent)).filter(function(container) {
        return container.visible = container.isElementVisible();
    }).map(this.getPseudoElements, this));
    this.fontMetrics = new FontMetrics();
    log("Fetched nodes, total:", this.nodes.length);
    log("Calculate overflow clips");
    this.calculateOverflowClips();
    log("Start fetching images");
    this.images = imageLoader.fetch(this.nodes.filter(isElement));
    this.ready = this.images.ready.then(bind(function() {
        log("Images loaded, starting parsing");
        log("Creating stacking contexts");
        this.createStackingContexts();
        log("Sorting stacking contexts");
        this.sortStackingContexts(this.stack);
        this.parse(this.stack);
        log("Render queue created with " + this.renderQueue.length + " items");
        return new Promise(bind(function(resolve) {
            if (!options.async) {
                this.renderQueue.forEach(this.paint, this);
                resolve();
            } else if (typeof(options.async) === "function") {
                options.async.call(this, this.renderQueue, resolve);
            } else if (this.renderQueue.length > 0){
                this.renderIndex = 0;
                this.asyncRenderer(this.renderQueue, resolve);
            } else {
                resolve();
            }
        }, this));
    }, this));
}

NodeParser.prototype.calculateOverflowClips = function() {
    this.nodes.forEach(function(container) {
        if (isElement(container)) {
            if (isPseudoElement(container)) {
                container.appendToDOM();
            }
            container.borders = this.parseBorders(container);
            var clip = (container.css('overflow') === "hidden") ? [container.borders.clip] : [];
            var cssClip = container.parseClip();
            if (cssClip && ["absolute", "fixed"].indexOf(container.css('position')) !== -1) {
                clip.push([["rect",
                        container.bounds.left + cssClip.left,
                        container.bounds.top + cssClip.top,
                        cssClip.right - cssClip.left,
                        cssClip.bottom - cssClip.top
                ]]);
            }
            container.clip = hasParentClip(container) ? container.parent.clip.concat(clip) : clip;
            container.backgroundClip = (container.css('overflow') !== "hidden") ? container.clip.concat([container.borders.clip]) : container.clip;
            if (isPseudoElement(container)) {
                container.cleanDOM();
            }
        } else if (isTextNode(container)) {
            container.clip = hasParentClip(container) ? container.parent.clip : [];
        }
        if (!isPseudoElement(container)) {
            container.bounds = null;
        }
    }, this);
};

function hasParentClip(container) {
    return container.parent && container.parent.clip.length;
}

NodeParser.prototype.asyncRenderer = function(queue, resolve, asyncTimer) {
    asyncTimer = asyncTimer || Date.now();
    this.paint(queue[this.renderIndex++]);
    if (queue.length === this.renderIndex) {
        resolve();
    } else if (asyncTimer + 20 > Date.now()) {
        this.asyncRenderer(queue, resolve, asyncTimer);
    } else {
        setTimeout(bind(function() {
            this.asyncRenderer(queue, resolve);
        }, this), 0);
    }
};

NodeParser.prototype.createPseudoHideStyles = function(document) {
    this.createStyles(document, '.' + PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + ':before { content: "" !important; display: none !important; }' +
        '.' + PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER + ':after { content: "" !important; display: none !important; }');
};

NodeParser.prototype.disableAnimations = function(document) {
    this.createStyles(document, '* { -webkit-animation: none !important; -moz-animation: none !important; -o-animation: none !important; animation: none !important; ' +
        '-webkit-transition: none !important; -moz-transition: none !important; -o-transition: none !important; transition: none !important;}');
};

NodeParser.prototype.createStyles = function(document, styles) {
    var hidePseudoElements = document.createElement('style');
    hidePseudoElements.innerHTML = styles;
    document.body.appendChild(hidePseudoElements);
};

NodeParser.prototype.getPseudoElements = function(container) {
    var nodes = [[container]];
    if (container.node.nodeType === Node.ELEMENT_NODE) {
        var before = this.getPseudoElement(container, ":before");
        var after = this.getPseudoElement(container, ":after");

        if (before) {
            nodes.push(before);
        }

        if (after) {
            nodes.push(after);
        }
    }
    return flatten(nodes);
};

function toCamelCase(str) {
    return str.replace(/(\-[a-z])/g, function(match){
        return match.toUpperCase().replace('-','');
    });
}

NodeParser.prototype.getPseudoElement = function(container, type) {
    var style = container.computedStyle(type);
    if(!style || !style.content || style.content === "none" || style.content === "-moz-alt-content" || style.display === "none") {
        return null;
    }

    var content = stripQuotes(style.content);
    var isImage = content.substr(0, 3) === 'url';
    var pseudoNode = document.createElement(isImage ? 'img' : 'html2canvaspseudoelement');
    var pseudoContainer = new PseudoElementContainer(pseudoNode, container, type);

    for (var i = style.length-1; i >= 0; i--) {
        var property = toCamelCase(style.item(i));
        pseudoNode.style[property] = style[property];
    }

    pseudoNode.className = PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE + " " + PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER;

    if (isImage) {
        pseudoNode.src = parseBackgrounds(content)[0].args[0];
        return [pseudoContainer];
    } else {
        var text = document.createTextNode(content);
        pseudoNode.appendChild(text);
        return [pseudoContainer, new TextContainer(text, pseudoContainer)];
    }
};


NodeParser.prototype.getChildren = function(parentContainer) {
    return flatten([].filter.call(parentContainer.node.childNodes, renderableNode).map(function(node) {
        var container = [node.nodeType === Node.TEXT_NODE ? new TextContainer(node, parentContainer) : new NodeContainer(node, parentContainer)].filter(nonIgnoredElement);
        return node.nodeType === Node.ELEMENT_NODE && container.length && node.tagName !== "TEXTAREA" ? (container[0].isElementVisible() ? container.concat(this.getChildren(container[0])) : []) : container;
    }, this));
};

NodeParser.prototype.newStackingContext = function(container, hasOwnStacking) {
    var stack = new StackingContext(hasOwnStacking, container.getOpacity(), container.node, container.parent);
    container.cloneTo(stack);
    var parentStack = hasOwnStacking ? stack.getParentStack(this) : stack.parent.stack;
    parentStack.contexts.push(stack);
    container.stack = stack;
};

NodeParser.prototype.createStackingContexts = function() {
    this.nodes.forEach(function(container) {
        if (isElement(container) && (this.isRootElement(container) || hasOpacity(container) || isPositionedForStacking(container) || this.isBodyWithTransparentRoot(container) || container.hasTransform())) {
            this.newStackingContext(container, true);
        } else if (isElement(container) && ((isPositioned(container) && zIndex0(container)) || isInlineBlock(container) || isFloating(container))) {
            this.newStackingContext(container, false);
        } else {
            container.assignStack(container.parent.stack);
        }
    }, this);
};

NodeParser.prototype.isBodyWithTransparentRoot = function(container) {
    return container.node.nodeName === "BODY" && container.parent.color('backgroundColor').isTransparent();
};

NodeParser.prototype.isRootElement = function(container) {
    return container.parent === null;
};

NodeParser.prototype.sortStackingContexts = function(stack) {
    stack.contexts.sort(zIndexSort(stack.contexts.slice(0)));
    stack.contexts.forEach(this.sortStackingContexts, this);
};

NodeParser.prototype.parseTextBounds = function(container) {
    return function(text, index, textList) {
        if (container.parent.css("textDecoration").substr(0, 4) !== "none" || text.trim().length !== 0) {
            if (this.support.rangeBounds && !container.parent.hasTransform()) {
                var offset = textList.slice(0, index).join("").length;
                return this.getRangeBounds(container.node, offset, text.length);
            } else if (container.node && typeof(container.node.data) === "string") {
                var replacementNode = container.node.splitText(text.length);
                var bounds = this.getWrapperBounds(container.node, container.parent.hasTransform());
                container.node = replacementNode;
                return bounds;
            }
        } else if(!this.support.rangeBounds || container.parent.hasTransform()){
            container.node = container.node.splitText(text.length);
        }
        return {};
    };
};

NodeParser.prototype.getWrapperBounds = function(node, transform) {
    var wrapper = node.ownerDocument.createElement('html2canvaswrapper');
    var parent = node.parentNode,
        backupText = node.cloneNode(true);

    wrapper.appendChild(node.cloneNode(true));
    parent.replaceChild(wrapper, node);
    var bounds = transform ? offsetBounds(wrapper) : getBounds(wrapper);
    parent.replaceChild(backupText, wrapper);
    return bounds;
};

NodeParser.prototype.getRangeBounds = function(node, offset, length) {
    var range = this.range || (this.range = node.ownerDocument.createRange());
    range.setStart(node, offset);
    range.setEnd(node, offset + length);
    return range.getBoundingClientRect();
};

function ClearTransform() {}

NodeParser.prototype.parse = function(stack) {
    // http://www.w3.org/TR/CSS21/visuren.html#z-index
    var negativeZindex = stack.contexts.filter(negativeZIndex); // 2. the child stacking contexts with negative stack levels (most negative first).
    var descendantElements = stack.children.filter(isElement);
    var descendantNonFloats = descendantElements.filter(not(isFloating));
    var nonInlineNonPositionedDescendants = descendantNonFloats.filter(not(isPositioned)).filter(not(inlineLevel)); // 3 the in-flow, non-inline-level, non-positioned descendants.
    var nonPositionedFloats = descendantElements.filter(not(isPositioned)).filter(isFloating); // 4. the non-positioned floats.
    var inFlow = descendantNonFloats.filter(not(isPositioned)).filter(inlineLevel); // 5. the in-flow, inline-level, non-positioned descendants, including inline tables and inline blocks.
    var stackLevel0 = stack.contexts.concat(descendantNonFloats.filter(isPositioned)).filter(zIndex0); // 6. the child stacking contexts with stack level 0 and the positioned descendants with stack level 0.
    var text = stack.children.filter(isTextNode).filter(hasText);
    var positiveZindex = stack.contexts.filter(positiveZIndex); // 7. the child stacking contexts with positive stack levels (least positive first).
    negativeZindex.concat(nonInlineNonPositionedDescendants).concat(nonPositionedFloats)
        .concat(inFlow).concat(stackLevel0).concat(text).concat(positiveZindex).forEach(function(container) {
            this.renderQueue.push(container);
            if (isStackingContext(container)) {
                this.parse(container);
                this.renderQueue.push(new ClearTransform());
            }
        }, this);
};

NodeParser.prototype.paint = function(container) {
    try {
        if (container instanceof ClearTransform) {
            this.renderer.ctx.restore();
        } else if (isTextNode(container)) {
            if (isPseudoElement(container.parent)) {
                container.parent.appendToDOM();
            }
            this.paintText(container);
            if (isPseudoElement(container.parent)) {
                container.parent.cleanDOM();
            }
        } else {
            this.paintNode(container);
        }
    } catch(e) {
        log(e);
        if (this.options.strict) {
            throw e;
        }
    }
};

NodeParser.prototype.paintNode = function(container) {
    if (isStackingContext(container)) {
        this.renderer.setOpacity(container.opacity);
        this.renderer.ctx.save();
        if (container.hasTransform()) {
            this.renderer.setTransform(container.parseTransform());
        }
    }

    if (container.node.nodeName === "INPUT" && container.node.type === "checkbox") {
        this.paintCheckbox(container);
    } else if (container.node.nodeName === "INPUT" && container.node.type === "radio") {
        this.paintRadio(container);
    } else {
        this.paintElement(container);
    }
};

NodeParser.prototype.paintElement = function(container) {
    var bounds = container.parseBounds();
    this.renderer.clip(container.backgroundClip, function() {
        this.renderer.renderBackground(container, bounds, container.borders.borders.map(getWidth));
    }, this);

    this.renderer.clip(container.clip, function() {
        this.renderer.renderBorders(container.borders.borders);
    }, this);

    this.renderer.clip(container.backgroundClip, function() {
        switch (container.node.nodeName) {
        case "svg":
        case "IFRAME":
            var imgContainer = this.images.get(container.node);
            if (imgContainer) {
                this.renderer.renderImage(container, bounds, container.borders, imgContainer);
            } else {
                log("Error loading <" + container.node.nodeName + ">", container.node);
            }
            break;
        case "IMG":
            var imageContainer = this.images.get(container.node.src);
            if (imageContainer) {
                this.renderer.renderImage(container, bounds, container.borders, imageContainer);
            } else {
                log("Error loading <img>", container.node.src);
            }
            break;
        case "CANVAS":
            this.renderer.renderImage(container, bounds, container.borders, {image: container.node});
            break;
        case "SELECT":
        case "INPUT":
        case "TEXTAREA":
            this.paintFormValue(container);
            break;
        }
    }, this);
};

NodeParser.prototype.paintCheckbox = function(container) {
    var b = container.parseBounds();

    var size = Math.min(b.width, b.height);
    var bounds = {width: size - 1, height: size - 1, top: b.top, left: b.left};
    var r = [3, 3];
    var radius = [r, r, r, r];
    var borders = [1,1,1,1].map(function(w) {
        return {color: new Color('#A5A5A5'), width: w};
    });

    var borderPoints = calculateCurvePoints(bounds, radius, borders);

    this.renderer.clip(container.backgroundClip, function() {
        this.renderer.rectangle(bounds.left + 1, bounds.top + 1, bounds.width - 2, bounds.height - 2, new Color("#DEDEDE"));
        this.renderer.renderBorders(calculateBorders(borders, bounds, borderPoints, radius));
        if (container.node.checked) {
            this.renderer.font(new Color('#424242'), 'normal', 'normal', 'bold', (size - 3) + "px", 'arial');
            this.renderer.text("\u2714", bounds.left + size / 6, bounds.top + size - 1);
        }
    }, this);
};

NodeParser.prototype.paintRadio = function(container) {
    var bounds = container.parseBounds();

    var size = Math.min(bounds.width, bounds.height) - 2;

    this.renderer.clip(container.backgroundClip, function() {
        this.renderer.circleStroke(bounds.left + 1, bounds.top + 1, size, new Color('#DEDEDE'), 1, new Color('#A5A5A5'));
        if (container.node.checked) {
            this.renderer.circle(Math.ceil(bounds.left + size / 4) + 1, Math.ceil(bounds.top + size / 4) + 1, Math.floor(size / 2), new Color('#424242'));
        }
    }, this);
};

NodeParser.prototype.paintFormValue = function(container) {
    var value = container.getValue();
    if (value.length > 0) {
        var document = container.node.ownerDocument;
        var wrapper = document.createElement('html2canvaswrapper');
        var properties = ['lineHeight', 'textAlign', 'fontFamily', 'fontWeight', 'fontSize', 'color',
            'paddingLeft', 'paddingTop', 'paddingRight', 'paddingBottom',
            'width', 'height', 'borderLeftStyle', 'borderTopStyle', 'borderLeftWidth', 'borderTopWidth',
            'boxSizing', 'whiteSpace', 'wordWrap'];

        properties.forEach(function(property) {
            try {
                wrapper.style[property] = container.css(property);
            } catch(e) {
                // Older IE has issues with "border"
                log("html2canvas: Parse: Exception caught in renderFormValue: " + e.message);
            }
        });
        var bounds = container.parseBounds();
        wrapper.style.position = "fixed";
        wrapper.style.left = bounds.left + "px";
        wrapper.style.top = bounds.top + "px";
        wrapper.textContent = value;
        document.body.appendChild(wrapper);
        this.paintText(new TextContainer(wrapper.firstChild, container));
        document.body.removeChild(wrapper);
    }
};

NodeParser.prototype.paintText = function(container) {
    container.applyTextTransform();
    var characters = punycode.ucs2.decode(container.node.data);
    var textList = (!this.options.letterRendering || noLetterSpacing(container)) && !hasUnicode(container.node.data) ? getWords(characters) : characters.map(function(character) {
        return punycode.ucs2.encode([character]);
    });

    var weight = container.parent.fontWeight();
    var size = container.parent.css('fontSize');
    var family = container.parent.css('fontFamily');
    var shadows = container.parent.parseTextShadows();

    this.renderer.font(container.parent.color('color'), container.parent.css('fontStyle'), container.parent.css('fontVariant'), weight, size, family);
    if (shadows.length) {
        // TODO: support multiple text shadows
        this.renderer.fontShadow(shadows[0].color, shadows[0].offsetX, shadows[0].offsetY, shadows[0].blur);
    } else {
        this.renderer.clearShadow();
    }

    this.renderer.clip(container.parent.clip, function() {
        textList.map(this.parseTextBounds(container), this).forEach(function(bounds, index) {
            if (bounds) {
                this.renderer.text(textList[index], bounds.left, bounds.bottom);
                this.renderTextDecoration(container.parent, bounds, this.fontMetrics.getMetrics(family, size));
            }
        }, this);
    }, this);
};

NodeParser.prototype.renderTextDecoration = function(container, bounds, metrics) {
    switch(container.css("textDecoration").split(" ")[0]) {
    case "underline":
        // Draws a line at the baseline of the font
        // TODO As some browsers display the line as more than 1px if the font-size is big, need to take that into account both in position and size
        this.renderer.rectangle(bounds.left, Math.round(bounds.top + metrics.baseline + metrics.lineWidth), bounds.width, 1, container.color("color"));
        break;
    case "overline":
        this.renderer.rectangle(bounds.left, Math.round(bounds.top), bounds.width, 1, container.color("color"));
        break;
    case "line-through":
        // TODO try and find exact position for line-through
        this.renderer.rectangle(bounds.left, Math.ceil(bounds.top + metrics.middle + metrics.lineWidth), bounds.width, 1, container.color("color"));
        break;
    }
};

var borderColorTransforms = {
    inset: [
        ["darken", 0.60],
        ["darken", 0.10],
        ["darken", 0.10],
        ["darken", 0.60]
    ]
};

NodeParser.prototype.parseBorders = function(container) {
    var nodeBounds = container.parseBounds();
    var radius = getBorderRadiusData(container);
    var borders = ["Top", "Right", "Bottom", "Left"].map(function(side, index) {
        var style = container.css('border' + side + 'Style');
        var color = container.color('border' + side + 'Color');
        if (style === "inset" && color.isBlack()) {
            color = new Color([255, 255, 255, color.a]); // this is wrong, but
        }
        var colorTransform = borderColorTransforms[style] ? borderColorTransforms[style][index] : null;
        return {
            width: container.cssInt('border' + side + 'Width'),
            color: colorTransform ? color[colorTransform[0]](colorTransform[1]) : color,
            args: null
        };
    });
    var borderPoints = calculateCurvePoints(nodeBounds, radius, borders);

    return {
        clip: this.parseBackgroundClip(container, borderPoints, borders, radius, nodeBounds),
        borders: calculateBorders(borders, nodeBounds, borderPoints, radius)
    };
};

function calculateBorders(borders, nodeBounds, borderPoints, radius) {
    return borders.map(function(border, borderSide) {
        if (border.width > 0) {
            var bx = nodeBounds.left;
            var by = nodeBounds.top;
            var bw = nodeBounds.width;
            var bh = nodeBounds.height - (borders[2].width);

            switch(borderSide) {
            case 0:
                // top border
                bh = borders[0].width;
                border.args = drawSide({
                        c1: [bx, by],
                        c2: [bx + bw, by],
                        c3: [bx + bw - borders[1].width, by + bh],
                        c4: [bx + borders[3].width, by + bh]
                    }, radius[0], radius[1],
                    borderPoints.topLeftOuter, borderPoints.topLeftInner, borderPoints.topRightOuter, borderPoints.topRightInner);
                break;
            case 1:
                // right border
                bx = nodeBounds.left + nodeBounds.width - (borders[1].width);
                bw = borders[1].width;

                border.args = drawSide({
                        c1: [bx + bw, by],
                        c2: [bx + bw, by + bh + borders[2].width],
                        c3: [bx, by + bh],
                        c4: [bx, by + borders[0].width]
                    }, radius[1], radius[2],
                    borderPoints.topRightOuter, borderPoints.topRightInner, borderPoints.bottomRightOuter, borderPoints.bottomRightInner);
                break;
            case 2:
                // bottom border
                by = (by + nodeBounds.height) - (borders[2].width);
                bh = borders[2].width;
                border.args = drawSide({
                        c1: [bx + bw, by + bh],
                        c2: [bx, by + bh],
                        c3: [bx + borders[3].width, by],
                        c4: [bx + bw - borders[3].width, by]
                    }, radius[2], radius[3],
                    borderPoints.bottomRightOuter, borderPoints.bottomRightInner, borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner);
                break;
            case 3:
                // left border
                bw = borders[3].width;
                border.args = drawSide({
                        c1: [bx, by + bh + borders[2].width],
                        c2: [bx, by],
                        c3: [bx + bw, by + borders[0].width],
                        c4: [bx + bw, by + bh]
                    }, radius[3], radius[0],
                    borderPoints.bottomLeftOuter, borderPoints.bottomLeftInner, borderPoints.topLeftOuter, borderPoints.topLeftInner);
                break;
            }
        }
        return border;
    });
}

NodeParser.prototype.parseBackgroundClip = function(container, borderPoints, borders, radius, bounds) {
    var backgroundClip = container.css('backgroundClip'),
        borderArgs = [];

    switch(backgroundClip) {
    case "content-box":
    case "padding-box":
        parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftInner, borderPoints.topRightInner, bounds.left + borders[3].width, bounds.top + borders[0].width);
        parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightInner, borderPoints.bottomRightInner, bounds.left + bounds.width - borders[1].width, bounds.top + borders[0].width);
        parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightInner, borderPoints.bottomLeftInner, bounds.left + bounds.width - borders[1].width, bounds.top + bounds.height - borders[2].width);
        parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftInner, borderPoints.topLeftInner, bounds.left + borders[3].width, bounds.top + bounds.height - borders[2].width);
        break;

    default:
        parseCorner(borderArgs, radius[0], radius[1], borderPoints.topLeftOuter, borderPoints.topRightOuter, bounds.left, bounds.top);
        parseCorner(borderArgs, radius[1], radius[2], borderPoints.topRightOuter, borderPoints.bottomRightOuter, bounds.left + bounds.width, bounds.top);
        parseCorner(borderArgs, radius[2], radius[3], borderPoints.bottomRightOuter, borderPoints.bottomLeftOuter, bounds.left + bounds.width, bounds.top + bounds.height);
        parseCorner(borderArgs, radius[3], radius[0], borderPoints.bottomLeftOuter, borderPoints.topLeftOuter, bounds.left, bounds.top + bounds.height);
        break;
    }

    return borderArgs;
};

function getCurvePoints(x, y, r1, r2) {
    var kappa = 4 * ((Math.sqrt(2) - 1) / 3);
    var ox = (r1) * kappa, // control point offset horizontal
        oy = (r2) * kappa, // control point offset vertical
        xm = x + r1, // x-middle
        ym = y + r2; // y-middle
    return {
        topLeft: bezierCurve({x: x, y: ym}, {x: x, y: ym - oy}, {x: xm - ox, y: y}, {x: xm, y: y}),
        topRight: bezierCurve({x: x, y: y}, {x: x + ox,y: y}, {x: xm, y: ym - oy}, {x: xm, y: ym}),
        bottomRight: bezierCurve({x: xm, y: y}, {x: xm, y: y + oy}, {x: x + ox, y: ym}, {x: x, y: ym}),
        bottomLeft: bezierCurve({x: xm, y: ym}, {x: xm - ox, y: ym}, {x: x, y: y + oy}, {x: x, y:y})
    };
}

function calculateCurvePoints(bounds, borderRadius, borders) {
    var x = bounds.left,
        y = bounds.top,
        width = bounds.width,
        height = bounds.height,

        tlh = borderRadius[0][0] < width / 2 ? borderRadius[0][0] : width / 2,
        tlv = borderRadius[0][1] < height / 2 ? borderRadius[0][1] : height / 2,
        trh = borderRadius[1][0] < width / 2 ? borderRadius[1][0] : width / 2,
        trv = borderRadius[1][1] < height / 2 ? borderRadius[1][1] : height / 2,
        brh = borderRadius[2][0] < width / 2 ? borderRadius[2][0] : width / 2,
        brv = borderRadius[2][1] < height / 2 ? borderRadius[2][1] : height / 2,
        blh = borderRadius[3][0] < width / 2 ? borderRadius[3][0] : width / 2,
        blv = borderRadius[3][1] < height / 2 ? borderRadius[3][1] : height / 2;

    var topWidth = width - trh,
        rightHeight = height - brv,
        bottomWidth = width - brh,
        leftHeight = height - blv;

    return {
        topLeftOuter: getCurvePoints(x, y, tlh, tlv).topLeft.subdivide(0.5),
        topLeftInner: getCurvePoints(x + borders[3].width, y + borders[0].width, Math.max(0, tlh - borders[3].width), Math.max(0, tlv - borders[0].width)).topLeft.subdivide(0.5),
        topRightOuter: getCurvePoints(x + topWidth, y, trh, trv).topRight.subdivide(0.5),
        topRightInner: getCurvePoints(x + Math.min(topWidth, width + borders[3].width), y + borders[0].width, (topWidth > width + borders[3].width) ? 0 :trh - borders[3].width, trv - borders[0].width).topRight.subdivide(0.5),
        bottomRightOuter: getCurvePoints(x + bottomWidth, y + rightHeight, brh, brv).bottomRight.subdivide(0.5),
        bottomRightInner: getCurvePoints(x + Math.min(bottomWidth, width - borders[3].width), y + Math.min(rightHeight, height + borders[0].width), Math.max(0, brh - borders[1].width),  brv - borders[2].width).bottomRight.subdivide(0.5),
        bottomLeftOuter: getCurvePoints(x, y + leftHeight, blh, blv).bottomLeft.subdivide(0.5),
        bottomLeftInner: getCurvePoints(x + borders[3].width, y + leftHeight, Math.max(0, blh - borders[3].width), blv - borders[2].width).bottomLeft.subdivide(0.5)
    };
}

function bezierCurve(start, startControl, endControl, end) {
    var lerp = function (a, b, t) {
        return {
            x: a.x + (b.x - a.x) * t,
            y: a.y + (b.y - a.y) * t
        };
    };

    return {
        start: start,
        startControl: startControl,
        endControl: endControl,
        end: end,
        subdivide: function(t) {
            var ab = lerp(start, startControl, t),
                bc = lerp(startControl, endControl, t),
                cd = lerp(endControl, end, t),
                abbc = lerp(ab, bc, t),
                bccd = lerp(bc, cd, t),
                dest = lerp(abbc, bccd, t);
            return [bezierCurve(start, ab, abbc, dest), bezierCurve(dest, bccd, cd, end)];
        },
        curveTo: function(borderArgs) {
            borderArgs.push(["bezierCurve", startControl.x, startControl.y, endControl.x, endControl.y, end.x, end.y]);
        },
        curveToReversed: function(borderArgs) {
            borderArgs.push(["bezierCurve", endControl.x, endControl.y, startControl.x, startControl.y, start.x, start.y]);
        }
    };
}

function drawSide(borderData, radius1, radius2, outer1, inner1, outer2, inner2) {
    var borderArgs = [];

    if (radius1[0] > 0 || radius1[1] > 0) {
        borderArgs.push(["line", outer1[1].start.x, outer1[1].start.y]);
        outer1[1].curveTo(borderArgs);
    } else {
        borderArgs.push([ "line", borderData.c1[0], borderData.c1[1]]);
    }

    if (radius2[0] > 0 || radius2[1] > 0) {
        borderArgs.push(["line", outer2[0].start.x, outer2[0].start.y]);
        outer2[0].curveTo(borderArgs);
        borderArgs.push(["line", inner2[0].end.x, inner2[0].end.y]);
        inner2[0].curveToReversed(borderArgs);
    } else {
        borderArgs.push(["line", borderData.c2[0], borderData.c2[1]]);
        borderArgs.push(["line", borderData.c3[0], borderData.c3[1]]);
    }

    if (radius1[0] > 0 || radius1[1] > 0) {
        borderArgs.push(["line", inner1[1].end.x, inner1[1].end.y]);
        inner1[1].curveToReversed(borderArgs);
    } else {
        borderArgs.push(["line", borderData.c4[0], borderData.c4[1]]);
    }

    return borderArgs;
}

function parseCorner(borderArgs, radius1, radius2, corner1, corner2, x, y) {
    if (radius1[0] > 0 || radius1[1] > 0) {
        borderArgs.push(["line", corner1[0].start.x, corner1[0].start.y]);
        corner1[0].curveTo(borderArgs);
        corner1[1].curveTo(borderArgs);
    } else {
        borderArgs.push(["line", x, y]);
    }

    if (radius2[0] > 0 || radius2[1] > 0) {
        borderArgs.push(["line", corner2[0].start.x, corner2[0].start.y]);
    }
}

function negativeZIndex(container) {
    return container.cssInt("zIndex") < 0;
}

function positiveZIndex(container) {
    return container.cssInt("zIndex") > 0;
}

function zIndex0(container) {
    return container.cssInt("zIndex") === 0;
}

function inlineLevel(container) {
    return ["inline", "inline-block", "inline-table"].indexOf(container.css("display")) !== -1;
}

function isStackingContext(container) {
    return (container instanceof StackingContext);
}

function hasText(container) {
    return container.node.data.trim().length > 0;
}

function noLetterSpacing(container) {
    return (/^(normal|none|0px)$/.test(container.parent.css("letterSpacing")));
}

function getBorderRadiusData(container) {
    return ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map(function(side) {
        var value = container.css('border' + side + 'Radius');
        var arr = value.split(" ");
        if (arr.length <= 1) {
            arr[1] = arr[0];
        }
        return arr.map(asInt);
    });
}

function renderableNode(node) {
    return (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE);
}

function isPositionedForStacking(container) {
    var position = container.css("position");
    var zIndex = (["absolute", "relative", "fixed"].indexOf(position) !== -1) ? container.css("zIndex") : "auto";
    return zIndex !== "auto";
}

function isPositioned(container) {
    return container.css("position") !== "static";
}

function isFloating(container) {
    return container.css("float") !== "none";
}

function isInlineBlock(container) {
    return ["inline-block", "inline-table"].indexOf(container.css("display")) !== -1;
}

function not(callback) {
    var context = this;
    return function() {
        return !callback.apply(context, arguments);
    };
}

function isElement(container) {
    return container.node.nodeType === Node.ELEMENT_NODE;
}

function isPseudoElement(container) {
    return container.isPseudoElement === true;
}

function isTextNode(container) {
    return container.node.nodeType === Node.TEXT_NODE;
}

function zIndexSort(contexts) {
    return function(a, b) {
        return (a.cssInt("zIndex") + (contexts.indexOf(a) / contexts.length)) - (b.cssInt("zIndex") + (contexts.indexOf(b) / contexts.length));
    };
}

function hasOpacity(container) {
    return container.getOpacity() < 1;
}

function asInt(value) {
    return parseInt(value, 10);
}

function getWidth(border) {
    return border.width;
}

function nonIgnoredElement(nodeContainer) {
    return (nodeContainer.node.nodeType !== Node.ELEMENT_NODE || ["SCRIPT", "HEAD", "TITLE", "OBJECT", "BR", "OPTION"].indexOf(nodeContainer.node.nodeName) === -1);
}

function flatten(arrays) {
    return [].concat.apply([], arrays);
}

function stripQuotes(content) {
    var first = content.substr(0, 1);
    return (first === content.substr(content.length - 1) && first.match(/'|"/)) ? content.substr(1, content.length - 2) : content;
}

function getWords(characters) {
    var words = [], i = 0, onWordBoundary = false, word;
    while(characters.length) {
        if (isWordBoundary(characters[i]) === onWordBoundary) {
            word = characters.splice(0, i);
            if (word.length) {
                words.push(punycode.ucs2.encode(word));
            }
            onWordBoundary =! onWordBoundary;
            i = 0;
        } else {
            i++;
        }

        if (i >= characters.length) {
            word = characters.splice(0, i);
            if (word.length) {
                words.push(punycode.ucs2.encode(word));
            }
        }
    }
    return words;
}

function isWordBoundary(characterCode) {
    return [
        32, // <space>
        13, // \r
        10, // \n
        9, // \t
        45 // -
    ].indexOf(characterCode) !== -1;
}

function hasUnicode(string) {
    return (/[^\u0000-\u00ff]/).test(string);
}

module.exports = NodeParser;

},{"./color":3,"./fontmetrics":7,"./log":13,"./nodecontainer":14,"./pseudoelementcontainer":18,"./stackingcontext":21,"./textcontainer":25,"./utils":26,"punycode":1}],16:[function(_dereq_,module,exports){
var XHR = _dereq_('./xhr');
var utils = _dereq_('./utils');
var log = _dereq_('./log');
var createWindowClone = _dereq_('./clone');
var decode64 = utils.decode64;

function Proxy(src, proxyUrl, document) {
    var supportsCORS = ('withCredentials' in new XMLHttpRequest());
    if (!proxyUrl) {
        return Promise.reject("No proxy configured");
    }
    var callback = createCallback(supportsCORS);
    var url = createProxyUrl(proxyUrl, src, callback);

    return supportsCORS ? XHR(url) : (jsonp(document, url, callback).then(function(response) {
        return decode64(response.content);
    }));
}
var proxyCount = 0;

function ProxyURL(src, proxyUrl, document) {
    var supportsCORSImage = ('crossOrigin' in new Image());
    var callback = createCallback(supportsCORSImage);
    var url = createProxyUrl(proxyUrl, src, callback);
    return (supportsCORSImage ? Promise.resolve(url) : jsonp(document, url, callback).then(function(response) {
        return "data:" + response.type + ";base64," + response.content;
    }));
}

function jsonp(document, url, callback) {
    return new Promise(function(resolve, reject) {
        var s = document.createElement("script");
        var cleanup = function() {
            delete window.html2canvas.proxy[callback];
            document.body.removeChild(s);
        };
        window.html2canvas.proxy[callback] = function(response) {
            cleanup();
            resolve(response);
        };
        s.src = url;
        s.onerror = function(e) {
            cleanup();
            reject(e);
        };
        document.body.appendChild(s);
    });
}

function createCallback(useCORS) {
    return !useCORS ? "html2canvas_" + Date.now() + "_" + (++proxyCount) + "_" + Math.round(Math.random() * 100000) : "";
}

function createProxyUrl(proxyUrl, src, callback) {
    return proxyUrl + "?url=" + encodeURIComponent(src) + (callback.length ? "&callback=html2canvas.proxy." + callback : "");
}

function documentFromHTML(src) {
    return function(html) {
        var parser = new DOMParser(), doc;
        try {
            doc = parser.parseFromString(html, "text/html");
        } catch(e) {
            log("DOMParser not supported, falling back to createHTMLDocument");
            doc = document.implementation.createHTMLDocument("");
            try {
                doc.open();
                doc.write(html);
                doc.close();
            } catch(ee) {
                log("createHTMLDocument write not supported, falling back to document.body.innerHTML");
                doc.body.innerHTML = html; // ie9 doesnt support writing to documentElement
            }
        }

        var b = doc.querySelector("base");
        if (!b || !b.href.host) {
            var base = doc.createElement("base");
            base.href = src;
            doc.head.insertBefore(base, doc.head.firstChild);
        }

        return doc;
    };
}

function loadUrlDocument(src, proxy, document, width, height, options) {
    return new Proxy(src, proxy, window.document).then(documentFromHTML(src)).then(function(doc) {
        return createWindowClone(doc, document, width, height, options, 0, 0);
    });
}

exports.Proxy = Proxy;
exports.ProxyURL = ProxyURL;
exports.loadUrlDocument = loadUrlDocument;

},{"./clone":2,"./log":13,"./utils":26,"./xhr":28}],17:[function(_dereq_,module,exports){
var ProxyURL = _dereq_('./proxy').ProxyURL;

function ProxyImageContainer(src, proxy) {
    var link = document.createElement("a");
    link.href = src;
    src = link.href;
    this.src = src;
    this.image = new Image();
    var self = this;
    this.promise = new Promise(function(resolve, reject) {
        self.image.crossOrigin = "Anonymous";
        self.image.onload = resolve;
        self.image.onerror = reject;

        new ProxyURL(src, proxy, document).then(function(url) {
            self.image.src = url;
        })['catch'](reject);
    });
}

module.exports = ProxyImageContainer;

},{"./proxy":16}],18:[function(_dereq_,module,exports){
var NodeContainer = _dereq_('./nodecontainer');

function PseudoElementContainer(node, parent, type) {
    NodeContainer.call(this, node, parent);
    this.isPseudoElement = true;
    this.before = type === ":before";
}

PseudoElementContainer.prototype.cloneTo = function(stack) {
    PseudoElementContainer.prototype.cloneTo.call(this, stack);
    stack.isPseudoElement = true;
    stack.before = this.before;
};

PseudoElementContainer.prototype = Object.create(NodeContainer.prototype);

PseudoElementContainer.prototype.appendToDOM = function() {
    if (this.before) {
        this.parent.node.insertBefore(this.node, this.parent.node.firstChild);
    } else {
        this.parent.node.appendChild(this.node);
    }
    this.parent.node.className += " " + this.getHideClass();
};

PseudoElementContainer.prototype.cleanDOM = function() {
    this.node.parentNode.removeChild(this.node);
    this.parent.node.className = this.parent.node.className.replace(this.getHideClass(), "");
};

PseudoElementContainer.prototype.getHideClass = function() {
    return this["PSEUDO_HIDE_ELEMENT_CLASS_" + (this.before ? "BEFORE" : "AFTER")];
};

PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_BEFORE = "___html2canvas___pseudoelement_before";
PseudoElementContainer.prototype.PSEUDO_HIDE_ELEMENT_CLASS_AFTER = "___html2canvas___pseudoelement_after";

module.exports = PseudoElementContainer;

},{"./nodecontainer":14}],19:[function(_dereq_,module,exports){
var log = _dereq_('./log');

function Renderer(width, height, images, options, document) {
    this.width = width;
    this.height = height;
    this.images = images;
    this.options = options;
    this.document = document;
}

Renderer.prototype.renderImage = function(container, bounds, borderData, imageContainer) {
    var paddingLeft = container.cssInt('paddingLeft'),
        paddingTop = container.cssInt('paddingTop'),
        paddingRight = container.cssInt('paddingRight'),
        paddingBottom = container.cssInt('paddingBottom'),
        borders = borderData.borders;

    var width = bounds.width - (borders[1].width + borders[3].width + paddingLeft + paddingRight);
    var height = bounds.height - (borders[0].width + borders[2].width + paddingTop + paddingBottom);
    this.drawImage(
        imageContainer,
        0,
        0,
        imageContainer.image.width || width,
        imageContainer.image.height || height,
        bounds.left + paddingLeft + borders[3].width,
        bounds.top + paddingTop + borders[0].width,
        width,
        height
    );
};

Renderer.prototype.renderBackground = function(container, bounds, borderData) {
    if (bounds.height > 0 && bounds.width > 0) {
        this.renderBackgroundColor(container, bounds);
        this.renderBackgroundImage(container, bounds, borderData);
    }
};

Renderer.prototype.renderBackgroundColor = function(container, bounds) {
    var color = container.color("backgroundColor");
    if (!color.isTransparent()) {
        this.rectangle(bounds.left, bounds.top, bounds.width, bounds.height, color);
    }
};

Renderer.prototype.renderBorders = function(borders) {
    borders.forEach(this.renderBorder, this);
};

Renderer.prototype.renderBorder = function(data) {
    if (!data.color.isTransparent() && data.args !== null) {
        this.drawShape(data.args, data.color);
    }
};

Renderer.prototype.renderBackgroundImage = function(container, bounds, borderData) {
    var backgroundImages = container.parseBackgroundImages();
    backgroundImages.reverse().forEach(function(backgroundImage, index, arr) {
        switch(backgroundImage.method) {
        case "url":
            var image = this.images.get(backgroundImage.args[0]);
            if (image) {
                this.renderBackgroundRepeating(container, bounds, image, arr.length - (index+1), borderData);
            } else {
                log("Error loading background-image", backgroundImage.args[0]);
            }
            break;
        case "linear-gradient":
        case "gradient":
            var gradientImage = this.images.get(backgroundImage.value);
            if (gradientImage) {
                this.renderBackgroundGradient(gradientImage, bounds, borderData);
            } else {
                log("Error loading background-image", backgroundImage.args[0]);
            }
            break;
        case "none":
            break;
        default:
            log("Unknown background-image type", backgroundImage.args[0]);
        }
    }, this);
};

Renderer.prototype.renderBackgroundRepeating = function(container, bounds, imageContainer, index, borderData) {
    var size = container.parseBackgroundSize(bounds, imageContainer.image, index);
    var position = container.parseBackgroundPosition(bounds, imageContainer.image, index, size);
    var repeat = container.parseBackgroundRepeat(index);
    switch (repeat) {
    case "repeat-x":
    case "repeat no-repeat":
        this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + borderData[3], bounds.top + position.top + borderData[0], 99999, size.height, borderData);
        break;
    case "repeat-y":
    case "no-repeat repeat":
        this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + position.left + borderData[3], bounds.top + borderData[0], size.width, 99999, borderData);
        break;
    case "no-repeat":
        this.backgroundRepeatShape(imageContainer, position, size, bounds, bounds.left + position.left + borderData[3], bounds.top + position.top + borderData[0], size.width, size.height, borderData);
        break;
    default:
        this.renderBackgroundRepeat(imageContainer, position, size, {top: bounds.top, left: bounds.left}, borderData[3], borderData[0]);
        break;
    }
};

module.exports = Renderer;

},{"./log":13}],20:[function(_dereq_,module,exports){
var Renderer = _dereq_('../renderer');
var LinearGradientContainer = _dereq_('../lineargradientcontainer');
var log = _dereq_('../log');

function CanvasRenderer(width, height) {
    Renderer.apply(this, arguments);
    this.canvas = this.options.canvas || this.document.createElement("canvas");
    if (!this.options.canvas) {
        this.canvas.width = width;
        this.canvas.height = height;
    }
    this.ctx = this.canvas.getContext("2d");
    this.taintCtx = this.document.createElement("canvas").getContext("2d");
    this.ctx.textBaseline = "bottom";
    this.variables = {};
    log("Initialized CanvasRenderer with size", width, "x", height);
}

CanvasRenderer.prototype = Object.create(Renderer.prototype);

CanvasRenderer.prototype.setFillStyle = function(fillStyle) {
    this.ctx.fillStyle = typeof(fillStyle) === "object" && !!fillStyle.isColor ? fillStyle.toString() : fillStyle;
    return this.ctx;
};

CanvasRenderer.prototype.rectangle = function(left, top, width, height, color) {
    this.setFillStyle(color).fillRect(left, top, width, height);
};

CanvasRenderer.prototype.circle = function(left, top, size, color) {
    this.setFillStyle(color);
    this.ctx.beginPath();
    this.ctx.arc(left + size / 2, top + size / 2, size / 2, 0, Math.PI*2, true);
    this.ctx.closePath();
    this.ctx.fill();
};

CanvasRenderer.prototype.circleStroke = function(left, top, size, color, stroke, strokeColor) {
    this.circle(left, top, size, color);
    this.ctx.strokeStyle = strokeColor.toString();
    this.ctx.stroke();
};

CanvasRenderer.prototype.drawShape = function(shape, color) {
    this.shape(shape);
    this.setFillStyle(color).fill();
};

CanvasRenderer.prototype.taints = function(imageContainer) {
    if (imageContainer.tainted === null) {
        this.taintCtx.drawImage(imageContainer.image, 0, 0);
        try {
            this.taintCtx.getImageData(0, 0, 1, 1);
            imageContainer.tainted = false;
        } catch(e) {
            this.taintCtx = document.createElement("canvas").getContext("2d");
            imageContainer.tainted = true;
        }
    }

    return imageContainer.tainted;
};

CanvasRenderer.prototype.drawImage = function(imageContainer, sx, sy, sw, sh, dx, dy, dw, dh) {
    if (!this.taints(imageContainer) || this.options.allowTaint) {
        this.ctx.drawImage(imageContainer.image, sx, sy, sw, sh, dx, dy, dw, dh);
    }
};

CanvasRenderer.prototype.clip = function(shapes, callback, context) {
    this.ctx.save();
    shapes.filter(hasEntries).forEach(function(shape) {
        this.shape(shape).clip();
    }, this);
    callback.call(context);
    this.ctx.restore();
};

CanvasRenderer.prototype.shape = function(shape) {
    this.ctx.beginPath();
    shape.forEach(function(point, index) {
        if (point[0] === "rect") {
            this.ctx.rect.apply(this.ctx, point.slice(1));
        } else {
            this.ctx[(index === 0) ? "moveTo" : point[0] + "To" ].apply(this.ctx, point.slice(1));
        }
    }, this);
    this.ctx.closePath();
    return this.ctx;
};

CanvasRenderer.prototype.font = function(color, style, variant, weight, size, family) {
    this.setFillStyle(color).font = [style, variant, weight, size, family].join(" ").split(",")[0];
};

CanvasRenderer.prototype.fontShadow = function(color, offsetX, offsetY, blur) {
    this.setVariable("shadowColor", color.toString())
        .setVariable("shadowOffsetY", offsetX)
        .setVariable("shadowOffsetX", offsetY)
        .setVariable("shadowBlur", blur);
};

CanvasRenderer.prototype.clearShadow = function() {
    this.setVariable("shadowColor", "rgba(0,0,0,0)");
};

CanvasRenderer.prototype.setOpacity = function(opacity) {
    this.ctx.globalAlpha = opacity;
};

CanvasRenderer.prototype.setTransform = function(transform) {
    this.ctx.translate(transform.origin[0], transform.origin[1]);
    this.ctx.transform.apply(this.ctx, transform.matrix);
    this.ctx.translate(-transform.origin[0], -transform.origin[1]);
};

CanvasRenderer.prototype.setVariable = function(property, value) {
    if (this.variables[property] !== value) {
        this.variables[property] = this.ctx[property] = value;
    }

    return this;
};

CanvasRenderer.prototype.text = function(text, left, bottom) {
    this.ctx.fillText(text, left, bottom);
};

CanvasRenderer.prototype.backgroundRepeatShape = function(imageContainer, backgroundPosition, size, bounds, left, top, width, height, borderData) {
    var shape = [
        ["line", Math.round(left), Math.round(top)],
        ["line", Math.round(left + width), Math.round(top)],
        ["line", Math.round(left + width), Math.round(height + top)],
        ["line", Math.round(left), Math.round(height + top)]
    ];
    this.clip([shape], function() {
        this.renderBackgroundRepeat(imageContainer, backgroundPosition, size, bounds, borderData[3], borderData[0]);
    }, this);
};

CanvasRenderer.prototype.renderBackgroundRepeat = function(imageContainer, backgroundPosition, size, bounds, borderLeft, borderTop) {
    var offsetX = Math.round(bounds.left + backgroundPosition.left + borderLeft), offsetY = Math.round(bounds.top + backgroundPosition.top + borderTop);
    this.setFillStyle(this.ctx.createPattern(this.resizeImage(imageContainer, size), "repeat"));
    this.ctx.translate(offsetX, offsetY);
    this.ctx.fill();
    this.ctx.translate(-offsetX, -offsetY);
};

CanvasRenderer.prototype.renderBackgroundGradient = function(gradientImage, bounds) {
    if (gradientImage instanceof LinearGradientContainer) {
        var gradient = this.ctx.createLinearGradient(
            bounds.left + bounds.width * gradientImage.x0,
            bounds.top + bounds.height * gradientImage.y0,
            bounds.left +  bounds.width * gradientImage.x1,
            bounds.top +  bounds.height * gradientImage.y1);
        gradientImage.colorStops.forEach(function(colorStop) {
            gradient.addColorStop(colorStop.stop, colorStop.color.toString());
        });
        this.rectangle(bounds.left, bounds.top, bounds.width, bounds.height, gradient);
    }
};

CanvasRenderer.prototype.resizeImage = function(imageContainer, size) {
    var image = imageContainer.image;
    if(image.width === size.width && image.height === size.height) {
        return image;
    }

    var ctx, canvas = document.createElement('canvas');
    canvas.width = size.width;
    canvas.height = size.height;
    ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, size.width, size.height );
    return canvas;
};

function hasEntries(array) {
    return array.length > 0;
}

module.exports = CanvasRenderer;

},{"../lineargradientcontainer":12,"../log":13,"../renderer":19}],21:[function(_dereq_,module,exports){
var NodeContainer = _dereq_('./nodecontainer');

function StackingContext(hasOwnStacking, opacity, element, parent) {
    NodeContainer.call(this, element, parent);
    this.ownStacking = hasOwnStacking;
    this.contexts = [];
    this.children = [];
    this.opacity = (this.parent ? this.parent.stack.opacity : 1) * opacity;
}

StackingContext.prototype = Object.create(NodeContainer.prototype);

StackingContext.prototype.getParentStack = function(context) {
    var parentStack = (this.parent) ? this.parent.stack : null;
    return parentStack ? (parentStack.ownStacking ? parentStack : parentStack.getParentStack(context)) : context.stack;
};

module.exports = StackingContext;

},{"./nodecontainer":14}],22:[function(_dereq_,module,exports){
function Support(document) {
    this.rangeBounds = this.testRangeBounds(document);
    this.cors = this.testCORS();
    this.svg = this.testSVG();
}

Support.prototype.testRangeBounds = function(document) {
    var range, testElement, rangeBounds, rangeHeight, support = false;

    if (document.createRange) {
        range = document.createRange();
        if (range.getBoundingClientRect) {
            testElement = document.createElement('boundtest');
            testElement.style.height = "123px";
            testElement.style.display = "block";
            document.body.appendChild(testElement);

            range.selectNode(testElement);
            rangeBounds = range.getBoundingClientRect();
            rangeHeight = rangeBounds.height;

            if (rangeHeight === 123) {
                support = true;
            }
            document.body.removeChild(testElement);
        }
    }

    return support;
};

Support.prototype.testCORS = function() {
    return typeof((new Image()).crossOrigin) !== "undefined";
};

Support.prototype.testSVG = function() {
    var img = new Image();
    var canvas = document.createElement("canvas");
    var ctx =  canvas.getContext("2d");
    img.src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'></svg>";

    try {
        ctx.drawImage(img, 0, 0);
        canvas.toDataURL();
    } catch(e) {
        return false;
    }
    return true;
};

module.exports = Support;

},{}],23:[function(_dereq_,module,exports){
var XHR = _dereq_('./xhr');
var decode64 = _dereq_('./utils').decode64;

function SVGContainer(src) {
    this.src = src;
    this.image = null;
    var self = this;

    this.promise = this.hasFabric().then(function() {
        return (self.isInline(src) ? Promise.resolve(self.inlineFormatting(src)) : XHR(src));
    }).then(function(svg) {
        return new Promise(function(resolve) {
            window.html2canvas.svg.fabric.loadSVGFromString(svg, self.createCanvas.call(self, resolve));
        });
    });
}

SVGContainer.prototype.hasFabric = function() {
    return !window.html2canvas.svg || !window.html2canvas.svg.fabric ? Promise.reject(new Error("html2canvas.svg.js is not loaded, cannot render svg")) : Promise.resolve();
};

SVGContainer.prototype.inlineFormatting = function(src) {
    return (/^data:image\/svg\+xml;base64,/.test(src)) ? this.decode64(this.removeContentType(src)) : this.removeContentType(src);
};

SVGContainer.prototype.removeContentType = function(src) {
    return src.replace(/^data:image\/svg\+xml(;base64)?,/,'');
};

SVGContainer.prototype.isInline = function(src) {
    return (/^data:image\/svg\+xml/i.test(src));
};

SVGContainer.prototype.createCanvas = function(resolve) {
    var self = this;
    return function (objects, options) {
        var canvas = new window.html2canvas.svg.fabric.StaticCanvas('c');
        self.image = canvas.lowerCanvasEl;
        canvas
            .setWidth(options.width)
            .setHeight(options.height)
            .add(window.html2canvas.svg.fabric.util.groupSVGElements(objects, options))
            .renderAll();
        resolve(canvas.lowerCanvasEl);
    };
};

SVGContainer.prototype.decode64 = function(str) {
    return (typeof(window.atob) === "function") ? window.atob(str) : decode64(str);
};

module.exports = SVGContainer;

},{"./utils":26,"./xhr":28}],24:[function(_dereq_,module,exports){
var SVGContainer = _dereq_('./svgcontainer');

function SVGNodeContainer(node, _native) {
    this.src = node;
    this.image = null;
    var self = this;

    this.promise = _native ? new Promise(function(resolve, reject) {
        self.image = new Image();
        self.image.onload = resolve;
        self.image.onerror = reject;
        self.image.src = "data:image/svg+xml," + (new XMLSerializer()).serializeToString(node);
        if (self.image.complete === true) {
            resolve(self.image);
        }
    }) : this.hasFabric().then(function() {
        return new Promise(function(resolve) {
            window.html2canvas.svg.fabric.parseSVGDocument(node, self.createCanvas.call(self, resolve));
        });
    });
}

SVGNodeContainer.prototype = Object.create(SVGContainer.prototype);

module.exports = SVGNodeContainer;

},{"./svgcontainer":23}],25:[function(_dereq_,module,exports){
var NodeContainer = _dereq_('./nodecontainer');

function TextContainer(node, parent) {
    NodeContainer.call(this, node, parent);
}

TextContainer.prototype = Object.create(NodeContainer.prototype);

TextContainer.prototype.applyTextTransform = function() {
    this.node.data = this.transform(this.parent.css("textTransform"));
};

TextContainer.prototype.transform = function(transform) {
    var text = this.node.data;
    switch(transform){
        case "lowercase":
            return text.toLowerCase();
        case "capitalize":
            return text.replace(/(^|\s|:|-|\(|\))([a-z])/g, capitalize);
        case "uppercase":
            return text.toUpperCase();
        default:
            return text;
    }
};

function capitalize(m, p1, p2) {
    if (m.length > 0) {
        return p1 + p2.toUpperCase();
    }
}

module.exports = TextContainer;

},{"./nodecontainer":14}],26:[function(_dereq_,module,exports){
exports.smallImage = function smallImage() {
    return "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
};

exports.bind = function(callback, context) {
    return function() {
        return callback.apply(context, arguments);
    };
};

/*
 * base64-arraybuffer
 * https://github.com/niklasvh/base64-arraybuffer
 *
 * Copyright (c) 2012 Niklas von Hertzen
 * Licensed under the MIT license.
 */

exports.decode64 = function(base64) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var len = base64.length, i, encoded1, encoded2, encoded3, encoded4, byte1, byte2, byte3;

    var output = "";

    for (i = 0; i < len; i+=4) {
        encoded1 = chars.indexOf(base64[i]);
        encoded2 = chars.indexOf(base64[i+1]);
        encoded3 = chars.indexOf(base64[i+2]);
        encoded4 = chars.indexOf(base64[i+3]);

        byte1 = (encoded1 << 2) | (encoded2 >> 4);
        byte2 = ((encoded2 & 15) << 4) | (encoded3 >> 2);
        byte3 = ((encoded3 & 3) << 6) | encoded4;
        if (encoded3 === 64) {
            output += String.fromCharCode(byte1);
        } else if (encoded4 === 64 || encoded4 === -1) {
            output += String.fromCharCode(byte1, byte2);
        } else{
            output += String.fromCharCode(byte1, byte2, byte3);
        }
    }

    return output;
};

exports.getBounds = function(node) {
    if (node.getBoundingClientRect) {
        var clientRect = node.getBoundingClientRect();
        var width = node.offsetWidth == null ? clientRect.width : node.offsetWidth;
        return {
            top: clientRect.top,
            bottom: clientRect.bottom || (clientRect.top + clientRect.height),
            right: clientRect.left + width,
            left: clientRect.left,
            width:  width,
            height: node.offsetHeight == null ? clientRect.height : node.offsetHeight
        };
    }
    return {};
};

exports.offsetBounds = function(node) {
    var parent = node.offsetParent ? exports.offsetBounds(node.offsetParent) : {top: 0, left: 0};

    return {
        top: node.offsetTop + parent.top,
        bottom: node.offsetTop + node.offsetHeight + parent.top,
        right: node.offsetLeft + parent.left + node.offsetWidth,
        left: node.offsetLeft + parent.left,
        width: node.offsetWidth,
        height: node.offsetHeight
    };
};

exports.parseBackgrounds = function(backgroundImage) {
    var whitespace = ' \r\n\t',
        method, definition, prefix, prefix_i, block, results = [],
        mode = 0, numParen = 0, quote, args;
    var appendResult = function() {
        if(method) {
            if (definition.substr(0, 1) === '"') {
                definition = definition.substr(1, definition.length - 2);
            }
            if (definition) {
                args.push(definition);
            }
            if (method.substr(0, 1) === '-' && (prefix_i = method.indexOf('-', 1 ) + 1) > 0) {
                prefix = method.substr(0, prefix_i);
                method = method.substr(prefix_i);
            }
            results.push({
                prefix: prefix,
                method: method.toLowerCase(),
                value: block,
                args: args,
                image: null
            });
        }
        args = [];
        method = prefix = definition = block = '';
    };
    args = [];
    method = prefix = definition = block = '';
    backgroundImage.split("").forEach(function(c) {
        if (mode === 0 && whitespace.indexOf(c) > -1) {
            return;
        }
        switch(c) {
        case '"':
            if(!quote) {
                quote = c;
            } else if(quote === c) {
                quote = null;
            }
            break;
        case '(':
            if(quote) {
                break;
            } else if(mode === 0) {
                mode = 1;
                block += c;
                return;
            } else {
                numParen++;
            }
            break;
        case ')':
            if (quote) {
                break;
            } else if(mode === 1) {
                if(numParen === 0) {
                    mode = 0;
                    block += c;
                    appendResult();
                    return;
                } else {
                    numParen--;
                }
            }
            break;

        case ',':
            if (quote) {
                break;
            } else if(mode === 0) {
                appendResult();
                return;
            } else if (mode === 1) {
                if (numParen === 0 && !method.match(/^url$/i)) {
                    args.push(definition);
                    definition = '';
                    block += c;
                    return;
                }
            }
            break;
        }

        block += c;
        if (mode === 0) {
            method += c;
        } else {
            definition += c;
        }
    });

    appendResult();
    return results;
};

},{}],27:[function(_dereq_,module,exports){
var GradientContainer = _dereq_('./gradientcontainer');

function WebkitGradientContainer(imageData) {
    GradientContainer.apply(this, arguments);
    this.type = imageData.args[0] === "linear" ? GradientContainer.TYPES.LINEAR : GradientContainer.TYPES.RADIAL;
}

WebkitGradientContainer.prototype = Object.create(GradientContainer.prototype);

module.exports = WebkitGradientContainer;

},{"./gradientcontainer":9}],28:[function(_dereq_,module,exports){
function XHR(url) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);

        xhr.onload = function() {
            if (xhr.status === 200) {
                resolve(xhr.responseText);
            } else {
                reject(new Error(xhr.statusText));
            }
        };

        xhr.onerror = function() {
            reject(new Error("Network Error"));
        };

        xhr.send();
    });
}

module.exports = XHR;

},{}]},{},[4])(4)
});

// Generated by CoffeeScript 1.4.0

/*
# PNG.js
# Copyright (c) 2011 Devon Govett
# MIT LICENSE
# 
# 
*/


(function(global) {
  var PNG;

  PNG = (function() {
    var APNG_BLEND_OP_OVER, APNG_BLEND_OP_SOURCE, APNG_DISPOSE_OP_BACKGROUND, APNG_DISPOSE_OP_NONE, APNG_DISPOSE_OP_PREVIOUS, makeImage, scratchCanvas, scratchCtx;

    PNG.load = function(url, canvas, callback) {
      var xhr;
      if (typeof canvas === 'function') {
        callback = canvas;
      }
      xhr = new XMLHttpRequest;
      xhr.open("GET", url, true);
      xhr.responseType = "arraybuffer";
      xhr.onload = function() {
        var data, png;
        data = new Uint8Array(xhr.response || xhr.mozResponseArrayBuffer);
        png = new PNG(data);
        if (typeof (canvas != null ? canvas.getContext : void 0) === 'function') {
          png.render(canvas);
        }
        return typeof callback === "function" ? callback(png) : void 0;
      };
      return xhr.send(null);
    };

    APNG_DISPOSE_OP_BACKGROUND = 1;

    APNG_DISPOSE_OP_PREVIOUS = 2;

    APNG_BLEND_OP_SOURCE = 0;

    function PNG(data) {
      var chunkSize, colors, palLen, delayDen, delayNum, frame, i, index, key, section, palShort, text, _i, _j, _ref;
      this.data = data;
      this.pos = 8;
      this.palette = [];
      this.imgData = [];
      this.transparency = {};
      this.animation = null;
      this.text = {};
      frame = null;
      while (true) {
        chunkSize = this.readUInt32();
        section = ((function() {
          var _i, _results;
          _results = [];
          for (i = _i = 0; _i < 4; i = ++_i) {
            _results.push(String.fromCharCode(this.data[this.pos++]));
          }
          return _results;
        }).call(this)).join('');
        switch (section) {
          case 'IHDR':
            this.width = this.readUInt32();
            this.height = this.readUInt32();
            this.bits = this.data[this.pos++];
            this.colorType = this.data[this.pos++];
            this.compressionMethod = this.data[this.pos++];
            this.filterMethod = this.data[this.pos++];
            this.interlaceMethod = this.data[this.pos++];
            break;
          case 'acTL':
            this.animation = {
              numFrames: this.readUInt32(),
              numPlays: this.readUInt32() || Infinity,
              frames: []
            };
            break;
          case 'PLTE':
            this.palette = this.read(chunkSize);
            break;
          case 'fcTL':
            if (frame) {
              this.animation.frames.push(frame);
            }
            this.pos += 4;
            frame = {
              width: this.readUInt32(),
              height: this.readUInt32(),
              xOffset: this.readUInt32(),
              yOffset: this.readUInt32()
            };
            delayNum = this.readUInt16();
            delayDen = this.readUInt16() || 100;
            frame.delay = 1000 * delayNum / delayDen;
            frame.disposeOp = this.data[this.pos++];
            frame.blendOp = this.data[this.pos++];
            frame.data = [];
            break;
          case 'IDAT':
          case 'fdAT':
            if (section === 'fdAT') {
              this.pos += 4;
              chunkSize -= 4;
            }
            data = (frame != null ? frame.data : void 0) || this.imgData;
            for (i = _i = 0; 0 <= chunkSize ? _i < chunkSize : _i > chunkSize; i = 0 <= chunkSize ? ++_i : --_i) {
              data.push(this.data[this.pos++]);
            }
            break;
          case 'tRNS':
            this.transparency = {};
            switch (this.colorType) {
              case 3:
            	palLen = this.palette.length/3;
                this.transparency.indexed = this.read(chunkSize);
                if(this.transparency.indexed.length > palLen)
                	throw new Error('More transparent colors than palette size');
                /*
                 * According to the PNG spec trns should be increased to the same size as palette if shorter
                 */
                //palShort = 255 - this.transparency.indexed.length;
                palShort = palLen - this.transparency.indexed.length;
                if (palShort > 0) {
                  for (i = _j = 0; 0 <= palShort ? _j < palShort : _j > palShort; i = 0 <= palShort ? ++_j : --_j) {
                    this.transparency.indexed.push(255);
                  }
                }
                break;
              case 0:
                this.transparency.grayscale = this.read(chunkSize)[0];
                break;
              case 2:
                this.transparency.rgb = this.read(chunkSize);
            }
            break;
          case 'tEXt':
            text = this.read(chunkSize);
            index = text.indexOf(0);
            key = String.fromCharCode.apply(String, text.slice(0, index));
            this.text[key] = String.fromCharCode.apply(String, text.slice(index + 1));
            break;
          case 'IEND':
            if (frame) {
              this.animation.frames.push(frame);
            }
            this.colors = (function() {
              switch (this.colorType) {
                case 0:
                case 3:
                case 4:
                  return 1;
                case 2:
                case 6:
                  return 3;
              }
            }).call(this);
            this.hasAlphaChannel = (_ref = this.colorType) === 4 || _ref === 6;
            colors = this.colors + (this.hasAlphaChannel ? 1 : 0);
            this.pixelBitlength = this.bits * colors;
            this.colorSpace = (function() {
              switch (this.colors) {
                case 1:
                  return 'DeviceGray';
                case 3:
                  return 'DeviceRGB';
              }
            }).call(this);
            this.imgData = new Uint8Array(this.imgData);
            return;
          default:
            this.pos += chunkSize;
        }
        this.pos += 4;
        if (this.pos > this.data.length) {
          throw new Error("Incomplete or corrupt PNG file");
        }
      }
      return;
    }

    PNG.prototype.read = function(bytes) {
      var i, _i, _results;
      _results = [];
      for (i = _i = 0; 0 <= bytes ? _i < bytes : _i > bytes; i = 0 <= bytes ? ++_i : --_i) {
        _results.push(this.data[this.pos++]);
      }
      return _results;
    };

    PNG.prototype.readUInt32 = function() {
      var b1, b2, b3, b4;
      b1 = this.data[this.pos++] << 24;
      b2 = this.data[this.pos++] << 16;
      b3 = this.data[this.pos++] << 8;
      b4 = this.data[this.pos++];
      return b1 | b2 | b3 | b4;
    };

    PNG.prototype.readUInt16 = function() {
      var b1, b2;
      b1 = this.data[this.pos++] << 8;
      b2 = this.data[this.pos++];
      return b1 | b2;
    };

    PNG.prototype.decodePixels = function(data) {
      var abyte, c, col, i, left, length, p, pa, paeth, pb, pc, pixelBytes, pixels, pos, row, scanlineLength, upper, upperLeft, _i, _j, _k, _l, _m;
      if (data == null) {
        data = this.imgData;
      }
      if (data.length === 0) {
        return new Uint8Array(0);
      }
      data = new FlateStream(data);
      data = data.getBytes();
      pixelBytes = this.pixelBitlength / 8;
      scanlineLength = pixelBytes * this.width;
      pixels = new Uint8Array(scanlineLength * this.height);
      length = data.length;
      row = 0;
      pos = 0;
      c = 0;
      while (pos < length) {
        switch (data[pos++]) {
          case 0:
            for (i = _i = 0; _i < scanlineLength; i = _i += 1) {
              pixels[c++] = data[pos++];
            }
            break;
          case 1:
            for (i = _j = 0; _j < scanlineLength; i = _j += 1) {
              abyte = data[pos++];
              left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
              pixels[c++] = (abyte + left) % 256;
            }
            break;
          case 2:
            for (i = _k = 0; _k < scanlineLength; i = _k += 1) {
              abyte = data[pos++];
              col = (i - (i % pixelBytes)) / pixelBytes;
              upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
              pixels[c++] = (upper + abyte) % 256;
            }
            break;
          case 3:
            for (i = _l = 0; _l < scanlineLength; i = _l += 1) {
              abyte = data[pos++];
              col = (i - (i % pixelBytes)) / pixelBytes;
              left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
              upper = row && pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
              pixels[c++] = (abyte + Math.floor((left + upper) / 2)) % 256;
            }
            break;
          case 4:
            for (i = _m = 0; _m < scanlineLength; i = _m += 1) {
              abyte = data[pos++];
              col = (i - (i % pixelBytes)) / pixelBytes;
              left = i < pixelBytes ? 0 : pixels[c - pixelBytes];
              if (row === 0) {
                upper = upperLeft = 0;
              } else {
                upper = pixels[(row - 1) * scanlineLength + col * pixelBytes + (i % pixelBytes)];
                upperLeft = col && pixels[(row - 1) * scanlineLength + (col - 1) * pixelBytes + (i % pixelBytes)];
              }
              p = left + upper - upperLeft;
              pa = Math.abs(p - left);
              pb = Math.abs(p - upper);
              pc = Math.abs(p - upperLeft);
              if (pa <= pb && pa <= pc) {
                paeth = left;
              } else if (pb <= pc) {
                paeth = upper;
              } else {
                paeth = upperLeft;
              }
              pixels[c++] = (abyte + paeth) % 256;
            }
            break;
          default:
            throw new Error("Invalid filter algorithm: " + data[pos - 1]);
        }
        row++;
      }
      return pixels;
    };

    PNG.prototype.decodePalette = function() {
      var c, i, length, palette, pos, ret, transparency, _i, _ref, _ref1;
      palette = this.palette;
      transparency = this.transparency.indexed || [];
      ret = new Uint8Array((transparency.length || 0) + palette.length);
      pos = 0;
      c = 0;
      for (i = _i = 0, _ref = palette.length; _i < _ref; i = _i += 3) {
        ret[pos++] = palette[i];
        ret[pos++] = palette[i + 1];
        ret[pos++] = palette[i + 2];
        ret[pos++] = (_ref1 = transparency[c++]) != null ? _ref1 : 255;
      }
      return ret;
    };

    PNG.prototype.copyToImageData = function(imageData, pixels) {
      var alpha, colors, data, i, input, j, k, length, palette, v, _ref;
      colors = this.colors;
      palette = null;
      alpha = this.hasAlphaChannel;
      if (this.palette.length) {
        palette = (_ref = this._decodedPalette) != null ? _ref : this._decodedPalette = this.decodePalette();
        colors = 4;
        alpha = true;
      }
      data = imageData.data || imageData;
      length = data.length;
      input = palette || pixels;
      i = j = 0;
      if (colors === 1) {
        while (i < length) {
          k = palette ? pixels[i / 4] * 4 : j;
          v = input[k++];
          data[i++] = v;
          data[i++] = v;
          data[i++] = v;
          data[i++] = alpha ? input[k++] : 255;
          j = k;
        }
      } else {
        while (i < length) {
          k = palette ? pixels[i / 4] * 4 : j;
          data[i++] = input[k++];
          data[i++] = input[k++];
          data[i++] = input[k++];
          data[i++] = alpha ? input[k++] : 255;
          j = k;
        }
      }
    };

    PNG.prototype.decode = function() {
      var ret;
      ret = new Uint8Array(this.width * this.height * 4);
      this.copyToImageData(ret, this.decodePixels());
      return ret;
    };

    try {
        scratchCanvas = global.document.createElement('canvas');
        scratchCtx = scratchCanvas.getContext('2d');
    } catch(e) {
        return -1;
    }

    makeImage = function(imageData) {
      var img;
      scratchCtx.width = imageData.width;
      scratchCtx.height = imageData.height;
      scratchCtx.clearRect(0, 0, imageData.width, imageData.height);
      scratchCtx.putImageData(imageData, 0, 0);
      img = new Image;
      img.src = scratchCanvas.toDataURL();
      return img;
    };

    PNG.prototype.decodeFrames = function(ctx) {
      var frame, i, imageData, pixels, _i, _len, _ref, _results;
      if (!this.animation) {
        return;
      }
      _ref = this.animation.frames;
      _results = [];
      for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
        frame = _ref[i];
        imageData = ctx.createImageData(frame.width, frame.height);
        pixels = this.decodePixels(new Uint8Array(frame.data));
        this.copyToImageData(imageData, pixels);
        frame.imageData = imageData;
        _results.push(frame.image = makeImage(imageData));
      }
      return _results;
    };

    PNG.prototype.renderFrame = function(ctx, number) {
      var frame, frames, prev;
      frames = this.animation.frames;
      frame = frames[number];
      prev = frames[number - 1];
      if (number === 0) {
        ctx.clearRect(0, 0, this.width, this.height);
      }
      if ((prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_BACKGROUND) {
        ctx.clearRect(prev.xOffset, prev.yOffset, prev.width, prev.height);
      } else if ((prev != null ? prev.disposeOp : void 0) === APNG_DISPOSE_OP_PREVIOUS) {
        ctx.putImageData(prev.imageData, prev.xOffset, prev.yOffset);
      }
      if (frame.blendOp === APNG_BLEND_OP_SOURCE) {
        ctx.clearRect(frame.xOffset, frame.yOffset, frame.width, frame.height);
      }
      return ctx.drawImage(frame.image, frame.xOffset, frame.yOffset);
    };

    PNG.prototype.animate = function(ctx) {
      var doFrame, frameNumber, frames, numFrames, numPlays, _ref,
        _this = this;
      frameNumber = 0;
      _ref = this.animation, numFrames = _ref.numFrames, frames = _ref.frames, numPlays = _ref.numPlays;
      return (doFrame = function() {
        var f, frame;
        f = frameNumber++ % numFrames;
        frame = frames[f];
        _this.renderFrame(ctx, f);
        if (numFrames > 1 && frameNumber / numFrames < numPlays) {
          return _this.animation._timeout = setTimeout(doFrame, frame.delay);
        }
      })();
    };

    PNG.prototype.stopAnimation = function() {
      var _ref;
      return clearTimeout((_ref = this.animation) != null ? _ref._timeout : void 0);
    };

    PNG.prototype.render = function(canvas) {
      var ctx, data;
      if (canvas._png) {
        canvas._png.stopAnimation();
      }
      canvas._png = this;
      canvas.width = this.width;
      canvas.height = this.height;
      ctx = canvas.getContext("2d");
      if (this.animation) {
        this.decodeFrames(ctx);
        return this.animate(ctx);
      } else {
        data = ctx.createImageData(this.width, this.height);
        this.copyToImageData(data, this.decodePixels());
        return ctx.putImageData(data, 0, 0);
      }
    };

    return PNG;

  })();

  global.PNG = PNG;

})(typeof window !== "undefined" && window || window);

/*
 * Extracted from pdf.js
 * https://github.com/andreasgal/pdf.js
 *
 * Copyright (c) 2011 Mozilla Foundation
 *
 * Contributors: Andreas Gal <gal@mozilla.com>
 *               Chris G Jones <cjones@mozilla.com>
 *               Shaon Barman <shaon.barman@gmail.com>
 *               Vivien Nicolas <21@vingtetun.org>
 *               Justin D'Arcangelo <justindarc@gmail.com>
 *               Yury Delendik
 *
 * 
 */

var DecodeStream = (function() {
  function constructor() {
    this.pos = 0;
    this.bufferLength = 0;
    this.eof = false;
    this.buffer = null;
  }

  constructor.prototype = {
    ensureBuffer: function decodestream_ensureBuffer(requested) {
      var buffer = this.buffer;
      var current = buffer ? buffer.byteLength : 0;
      if (requested < current)
        return buffer;
      var size = 512;
      while (size < requested)
        size <<= 1;
      var buffer2 = new Uint8Array(size);
      for (var i = 0; i < current; ++i)
        buffer2[i] = buffer[i];
      return this.buffer = buffer2;
    },
    getByte: function decodestream_getByte() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return this.buffer[this.pos++];
    },
    getBytes: function decodestream_getBytes(length) {
      var pos = this.pos;

      if (length) {
        this.ensureBuffer(pos + length);
        var end = pos + length;

        while (!this.eof && this.bufferLength < end)
          this.readBlock();

        var bufEnd = this.bufferLength;
        if (end > bufEnd)
          end = bufEnd;
      } else {
        while (!this.eof)
          this.readBlock();

        var end = this.bufferLength;
      }

      this.pos = end;
      return this.buffer.subarray(pos, end);
    },
    lookChar: function decodestream_lookChar() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return String.fromCharCode(this.buffer[this.pos]);
    },
    getChar: function decodestream_getChar() {
      var pos = this.pos;
      while (this.bufferLength <= pos) {
        if (this.eof)
          return null;
        this.readBlock();
      }
      return String.fromCharCode(this.buffer[this.pos++]);
    },
    makeSubStream: function decodestream_makeSubstream(start, length, dict) {
      var end = start + length;
      while (this.bufferLength <= end && !this.eof)
        this.readBlock();
      return new Stream(this.buffer, start, length, dict);
    },
    skip: function decodestream_skip(n) {
      if (!n)
        n = 1;
      this.pos += n;
    },
    reset: function decodestream_reset() {
      this.pos = 0;
    }
  };

  return constructor;
})();

var FlateStream = (function() {
  if (typeof Uint32Array === 'undefined') {
    return undefined;
  }
  var codeLenCodeMap = new Uint32Array([
    16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15
  ]);

  var lengthDecode = new Uint32Array([
    0x00003, 0x00004, 0x00005, 0x00006, 0x00007, 0x00008, 0x00009, 0x0000a,
    0x1000b, 0x1000d, 0x1000f, 0x10011, 0x20013, 0x20017, 0x2001b, 0x2001f,
    0x30023, 0x3002b, 0x30033, 0x3003b, 0x40043, 0x40053, 0x40063, 0x40073,
    0x50083, 0x500a3, 0x500c3, 0x500e3, 0x00102, 0x00102, 0x00102
  ]);

  var distDecode = new Uint32Array([
    0x00001, 0x00002, 0x00003, 0x00004, 0x10005, 0x10007, 0x20009, 0x2000d,
    0x30011, 0x30019, 0x40021, 0x40031, 0x50041, 0x50061, 0x60081, 0x600c1,
    0x70101, 0x70181, 0x80201, 0x80301, 0x90401, 0x90601, 0xa0801, 0xa0c01,
    0xb1001, 0xb1801, 0xc2001, 0xc3001, 0xd4001, 0xd6001
  ]);

  var fixedLitCodeTab = [new Uint32Array([
    0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c0,
    0x70108, 0x80060, 0x80020, 0x900a0, 0x80000, 0x80080, 0x80040, 0x900e0,
    0x70104, 0x80058, 0x80018, 0x90090, 0x70114, 0x80078, 0x80038, 0x900d0,
    0x7010c, 0x80068, 0x80028, 0x900b0, 0x80008, 0x80088, 0x80048, 0x900f0,
    0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c8,
    0x7010a, 0x80064, 0x80024, 0x900a8, 0x80004, 0x80084, 0x80044, 0x900e8,
    0x70106, 0x8005c, 0x8001c, 0x90098, 0x70116, 0x8007c, 0x8003c, 0x900d8,
    0x7010e, 0x8006c, 0x8002c, 0x900b8, 0x8000c, 0x8008c, 0x8004c, 0x900f8,
    0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c4,
    0x70109, 0x80062, 0x80022, 0x900a4, 0x80002, 0x80082, 0x80042, 0x900e4,
    0x70105, 0x8005a, 0x8001a, 0x90094, 0x70115, 0x8007a, 0x8003a, 0x900d4,
    0x7010d, 0x8006a, 0x8002a, 0x900b4, 0x8000a, 0x8008a, 0x8004a, 0x900f4,
    0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cc,
    0x7010b, 0x80066, 0x80026, 0x900ac, 0x80006, 0x80086, 0x80046, 0x900ec,
    0x70107, 0x8005e, 0x8001e, 0x9009c, 0x70117, 0x8007e, 0x8003e, 0x900dc,
    0x7010f, 0x8006e, 0x8002e, 0x900bc, 0x8000e, 0x8008e, 0x8004e, 0x900fc,
    0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c2,
    0x70108, 0x80061, 0x80021, 0x900a2, 0x80001, 0x80081, 0x80041, 0x900e2,
    0x70104, 0x80059, 0x80019, 0x90092, 0x70114, 0x80079, 0x80039, 0x900d2,
    0x7010c, 0x80069, 0x80029, 0x900b2, 0x80009, 0x80089, 0x80049, 0x900f2,
    0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900ca,
    0x7010a, 0x80065, 0x80025, 0x900aa, 0x80005, 0x80085, 0x80045, 0x900ea,
    0x70106, 0x8005d, 0x8001d, 0x9009a, 0x70116, 0x8007d, 0x8003d, 0x900da,
    0x7010e, 0x8006d, 0x8002d, 0x900ba, 0x8000d, 0x8008d, 0x8004d, 0x900fa,
    0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c6,
    0x70109, 0x80063, 0x80023, 0x900a6, 0x80003, 0x80083, 0x80043, 0x900e6,
    0x70105, 0x8005b, 0x8001b, 0x90096, 0x70115, 0x8007b, 0x8003b, 0x900d6,
    0x7010d, 0x8006b, 0x8002b, 0x900b6, 0x8000b, 0x8008b, 0x8004b, 0x900f6,
    0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900ce,
    0x7010b, 0x80067, 0x80027, 0x900ae, 0x80007, 0x80087, 0x80047, 0x900ee,
    0x70107, 0x8005f, 0x8001f, 0x9009e, 0x70117, 0x8007f, 0x8003f, 0x900de,
    0x7010f, 0x8006f, 0x8002f, 0x900be, 0x8000f, 0x8008f, 0x8004f, 0x900fe,
    0x70100, 0x80050, 0x80010, 0x80118, 0x70110, 0x80070, 0x80030, 0x900c1,
    0x70108, 0x80060, 0x80020, 0x900a1, 0x80000, 0x80080, 0x80040, 0x900e1,
    0x70104, 0x80058, 0x80018, 0x90091, 0x70114, 0x80078, 0x80038, 0x900d1,
    0x7010c, 0x80068, 0x80028, 0x900b1, 0x80008, 0x80088, 0x80048, 0x900f1,
    0x70102, 0x80054, 0x80014, 0x8011c, 0x70112, 0x80074, 0x80034, 0x900c9,
    0x7010a, 0x80064, 0x80024, 0x900a9, 0x80004, 0x80084, 0x80044, 0x900e9,
    0x70106, 0x8005c, 0x8001c, 0x90099, 0x70116, 0x8007c, 0x8003c, 0x900d9,
    0x7010e, 0x8006c, 0x8002c, 0x900b9, 0x8000c, 0x8008c, 0x8004c, 0x900f9,
    0x70101, 0x80052, 0x80012, 0x8011a, 0x70111, 0x80072, 0x80032, 0x900c5,
    0x70109, 0x80062, 0x80022, 0x900a5, 0x80002, 0x80082, 0x80042, 0x900e5,
    0x70105, 0x8005a, 0x8001a, 0x90095, 0x70115, 0x8007a, 0x8003a, 0x900d5,
    0x7010d, 0x8006a, 0x8002a, 0x900b5, 0x8000a, 0x8008a, 0x8004a, 0x900f5,
    0x70103, 0x80056, 0x80016, 0x8011e, 0x70113, 0x80076, 0x80036, 0x900cd,
    0x7010b, 0x80066, 0x80026, 0x900ad, 0x80006, 0x80086, 0x80046, 0x900ed,
    0x70107, 0x8005e, 0x8001e, 0x9009d, 0x70117, 0x8007e, 0x8003e, 0x900dd,
    0x7010f, 0x8006e, 0x8002e, 0x900bd, 0x8000e, 0x8008e, 0x8004e, 0x900fd,
    0x70100, 0x80051, 0x80011, 0x80119, 0x70110, 0x80071, 0x80031, 0x900c3,
    0x70108, 0x80061, 0x80021, 0x900a3, 0x80001, 0x80081, 0x80041, 0x900e3,
    0x70104, 0x80059, 0x80019, 0x90093, 0x70114, 0x80079, 0x80039, 0x900d3,
    0x7010c, 0x80069, 0x80029, 0x900b3, 0x80009, 0x80089, 0x80049, 0x900f3,
    0x70102, 0x80055, 0x80015, 0x8011d, 0x70112, 0x80075, 0x80035, 0x900cb,
    0x7010a, 0x80065, 0x80025, 0x900ab, 0x80005, 0x80085, 0x80045, 0x900eb,
    0x70106, 0x8005d, 0x8001d, 0x9009b, 0x70116, 0x8007d, 0x8003d, 0x900db,
    0x7010e, 0x8006d, 0x8002d, 0x900bb, 0x8000d, 0x8008d, 0x8004d, 0x900fb,
    0x70101, 0x80053, 0x80013, 0x8011b, 0x70111, 0x80073, 0x80033, 0x900c7,
    0x70109, 0x80063, 0x80023, 0x900a7, 0x80003, 0x80083, 0x80043, 0x900e7,
    0x70105, 0x8005b, 0x8001b, 0x90097, 0x70115, 0x8007b, 0x8003b, 0x900d7,
    0x7010d, 0x8006b, 0x8002b, 0x900b7, 0x8000b, 0x8008b, 0x8004b, 0x900f7,
    0x70103, 0x80057, 0x80017, 0x8011f, 0x70113, 0x80077, 0x80037, 0x900cf,
    0x7010b, 0x80067, 0x80027, 0x900af, 0x80007, 0x80087, 0x80047, 0x900ef,
    0x70107, 0x8005f, 0x8001f, 0x9009f, 0x70117, 0x8007f, 0x8003f, 0x900df,
    0x7010f, 0x8006f, 0x8002f, 0x900bf, 0x8000f, 0x8008f, 0x8004f, 0x900ff
  ]), 9];

  var fixedDistCodeTab = [new Uint32Array([
    0x50000, 0x50010, 0x50008, 0x50018, 0x50004, 0x50014, 0x5000c, 0x5001c,
    0x50002, 0x50012, 0x5000a, 0x5001a, 0x50006, 0x50016, 0x5000e, 0x00000,
    0x50001, 0x50011, 0x50009, 0x50019, 0x50005, 0x50015, 0x5000d, 0x5001d,
    0x50003, 0x50013, 0x5000b, 0x5001b, 0x50007, 0x50017, 0x5000f, 0x00000
  ]), 5];
  
  function error(e) {
      throw new Error(e)
  }

  function constructor(bytes) {
    //var bytes = stream.getBytes();
    var bytesPos = 0;

    var cmf = bytes[bytesPos++];
    var flg = bytes[bytesPos++];
    if (cmf == -1 || flg == -1)
      error('Invalid header in flate stream');
    if ((cmf & 0x0f) != 0x08)
      error('Unknown compression method in flate stream');
    if ((((cmf << 8) + flg) % 31) != 0)
      error('Bad FCHECK in flate stream');
    if (flg & 0x20)
      error('FDICT bit set in flate stream');

    this.bytes = bytes;
    this.bytesPos = bytesPos;

    this.codeSize = 0;
    this.codeBuf = 0;

    DecodeStream.call(this);
  }

  constructor.prototype = Object.create(DecodeStream.prototype);

  constructor.prototype.getBits = function(bits) {
    var codeSize = this.codeSize;
    var codeBuf = this.codeBuf;
    var bytes = this.bytes;
    var bytesPos = this.bytesPos;

    var b;
    while (codeSize < bits) {
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad encoding in flate stream');
      codeBuf |= b << codeSize;
      codeSize += 8;
    }
    b = codeBuf & ((1 << bits) - 1);
    this.codeBuf = codeBuf >> bits;
    this.codeSize = codeSize -= bits;
    this.bytesPos = bytesPos;
    return b;
  };

  constructor.prototype.getCode = function(table) {
    var codes = table[0];
    var maxLen = table[1];
    var codeSize = this.codeSize;
    var codeBuf = this.codeBuf;
    var bytes = this.bytes;
    var bytesPos = this.bytesPos;

    while (codeSize < maxLen) {
      var b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad encoding in flate stream');
      codeBuf |= (b << codeSize);
      codeSize += 8;
    }
    var code = codes[codeBuf & ((1 << maxLen) - 1)];
    var codeLen = code >> 16;
    var codeVal = code & 0xffff;
    if (codeSize == 0 || codeSize < codeLen || codeLen == 0)
      error('Bad encoding in flate stream');
    this.codeBuf = (codeBuf >> codeLen);
    this.codeSize = (codeSize - codeLen);
    this.bytesPos = bytesPos;
    return codeVal;
  };

  constructor.prototype.generateHuffmanTable = function(lengths) {
    var n = lengths.length;

    // find max code length
    var maxLen = 0;
    for (var i = 0; i < n; ++i) {
      if (lengths[i] > maxLen)
        maxLen = lengths[i];
    }

    // build the table
    var size = 1 << maxLen;
    var codes = new Uint32Array(size);
    for (var len = 1, code = 0, skip = 2;
         len <= maxLen;
         ++len, code <<= 1, skip <<= 1) {
      for (var val = 0; val < n; ++val) {
        if (lengths[val] == len) {
          // bit-reverse the code
          var code2 = 0;
          var t = code;
          for (var i = 0; i < len; ++i) {
            code2 = (code2 << 1) | (t & 1);
            t >>= 1;
          }

          // fill the table entries
          for (var i = code2; i < size; i += skip)
            codes[i] = (len << 16) | val;

          ++code;
        }
      }
    }

    return [codes, maxLen];
  };

  constructor.prototype.readBlock = function() {
    function repeat(stream, array, len, offset, what) {
      var repeat = stream.getBits(len) + offset;
      while (repeat-- > 0)
        array[i++] = what;
    }

    // read block header
    var hdr = this.getBits(3);
    if (hdr & 1)
      this.eof = true;
    hdr >>= 1;

    if (hdr == 0) { // uncompressed block
      var bytes = this.bytes;
      var bytesPos = this.bytesPos;
      var b;

      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      var blockLen = b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      blockLen |= (b << 8);
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      var check = b;
      if (typeof (b = bytes[bytesPos++]) == 'undefined')
        error('Bad block header in flate stream');
      check |= (b << 8);
      if (check != (~blockLen & 0xffff))
        error('Bad uncompressed block length in flate stream');

      this.codeBuf = 0;
      this.codeSize = 0;

      var bufferLength = this.bufferLength;
      var buffer = this.ensureBuffer(bufferLength + blockLen);
      var end = bufferLength + blockLen;
      this.bufferLength = end;
      for (var n = bufferLength; n < end; ++n) {
        if (typeof (b = bytes[bytesPos++]) == 'undefined') {
          this.eof = true;
          break;
        }
        buffer[n] = b;
      }
      this.bytesPos = bytesPos;
      return;
    }

    var litCodeTable;
    var distCodeTable;
    if (hdr == 1) { // compressed block, fixed codes
      litCodeTable = fixedLitCodeTab;
      distCodeTable = fixedDistCodeTab;
    } else if (hdr == 2) { // compressed block, dynamic codes
      var numLitCodes = this.getBits(5) + 257;
      var numDistCodes = this.getBits(5) + 1;
      var numCodeLenCodes = this.getBits(4) + 4;

      // build the code lengths code table
      var codeLenCodeLengths = Array(codeLenCodeMap.length);
      var i = 0;
      while (i < numCodeLenCodes)
        codeLenCodeLengths[codeLenCodeMap[i++]] = this.getBits(3);
      var codeLenCodeTab = this.generateHuffmanTable(codeLenCodeLengths);

      // build the literal and distance code tables
      var len = 0;
      var i = 0;
      var codes = numLitCodes + numDistCodes;
      var codeLengths = new Array(codes);
      while (i < codes) {
        var code = this.getCode(codeLenCodeTab);
        if (code == 16) {
          repeat(this, codeLengths, 2, 3, len);
        } else if (code == 17) {
          repeat(this, codeLengths, 3, 3, len = 0);
        } else if (code == 18) {
          repeat(this, codeLengths, 7, 11, len = 0);
        } else {
          codeLengths[i++] = len = code;
        }
      }

      litCodeTable =
        this.generateHuffmanTable(codeLengths.slice(0, numLitCodes));
      distCodeTable =
        this.generateHuffmanTable(codeLengths.slice(numLitCodes, codes));
    } else {
      error('Unknown block type in flate stream');
    }

    var buffer = this.buffer;
    var limit = buffer ? buffer.length : 0;
    var pos = this.bufferLength;
    while (true) {
      var code1 = this.getCode(litCodeTable);
      if (code1 < 256) {
        if (pos + 1 >= limit) {
          buffer = this.ensureBuffer(pos + 1);
          limit = buffer.length;
        }
        buffer[pos++] = code1;
        continue;
      }
      if (code1 == 256) {
        this.bufferLength = pos;
        return;
      }
      code1 -= 257;
      code1 = lengthDecode[code1];
      var code2 = code1 >> 16;
      if (code2 > 0)
        code2 = this.getBits(code2);
      var len = (code1 & 0xffff) + code2;
      code1 = this.getCode(distCodeTable);
      code1 = distDecode[code1];
      code2 = code1 >> 16;
      if (code2 > 0)
        code2 = this.getBits(code2);
      var dist = (code1 & 0xffff) + code2;
      if (pos + len >= limit) {
        buffer = this.ensureBuffer(pos + len);
        limit = buffer.length;
      }
      for (var k = 0; k < len; ++k, ++pos)
        buffer[pos] = buffer[pos - dist];
    }
  };

  return constructor;
})();

/**
 * JavaScript Polyfill functions for jsPDF
 * Collected from public resources by
 * https://github.com/diegocr
 */

(function (global) {
	var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

	if (typeof global.btoa === 'undefined') {
		global.btoa = function(data) {
			//  discuss at: http://phpjs.org/functions/base64_encode/
			// original by: Tyler Akins (http://rumkin.com)
			// improved by: Bayron Guevara
			// improved by: Thunder.m
			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// improved by: Rafal Kukawski (http://kukawski.pl)
			// bugfixed by: Pellentesque Malesuada
			//   example 1: base64_encode('Kevin van Zonneveld');
			//   returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='

			var o1,o2,o3,h1,h2,h3,h4,bits,i = 0,ac = 0,enc = '',tmp_arr = [];

			if (!data) {
				return data;
			}

			do { // pack three octets into four hexets
				o1 = data.charCodeAt(i++);
				o2 = data.charCodeAt(i++);
				o3 = data.charCodeAt(i++);

				bits = o1 << 16 | o2 << 8 | o3;

				h1 = bits >> 18 & 0x3f;
				h2 = bits >> 12 & 0x3f;
				h3 = bits >> 6 & 0x3f;
				h4 = bits & 0x3f;

				// use hexets to index into b64, and append result to encoded string
				tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
			} while (i < data.length);

			enc = tmp_arr.join('');

			var r = data.length % 3;

			return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
		};
	}

	if (typeof global.atob === 'undefined') {
		global.atob = function(data) {
			//  discuss at: http://phpjs.org/functions/base64_decode/
			// original by: Tyler Akins (http://rumkin.com)
			// improved by: Thunder.m
			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			//    input by: Aman Gupta
			//    input by: Brett Zamir (http://brett-zamir.me)
			// bugfixed by: Onno Marsman
			// bugfixed by: Pellentesque Malesuada
			// bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			//   example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
			//   returns 1: 'Kevin van Zonneveld'

			var o1,o2,o3,h1,h2,h3,h4,bits,i = 0,ac = 0,dec = '',tmp_arr = [];

			if (!data) {
				return data;
			}

			data += '';

			do { // unpack four hexets into three octets using index points in b64
				h1 = b64.indexOf(data.charAt(i++));
				h2 = b64.indexOf(data.charAt(i++));
				h3 = b64.indexOf(data.charAt(i++));
				h4 = b64.indexOf(data.charAt(i++));

				bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

				o1 = bits >> 16 & 0xff;
				o2 = bits >> 8 & 0xff;
				o3 = bits & 0xff;

				if (h3 == 64) {
					tmp_arr[ac++] = String.fromCharCode(o1);
				} else if (h4 == 64) {
					tmp_arr[ac++] = String.fromCharCode(o1, o2);
				} else {
					tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
				}
			} while (i < data.length);

			dec = tmp_arr.join('');

			return dec;
		};
	}

	if (!Array.prototype.map) {
		Array.prototype.map = function(fun /*, thisArg */) {
			if (this === void 0 || this === null || typeof fun !== "function")
				throw new TypeError();

			var t = Object(this), len = t.length >>> 0, res = new Array(len);
			var thisArg = arguments.length > 1 ? arguments[1] : void 0;
			for (var i = 0; i < len; i++) {
				// NOTE: Absolute correctness would demand Object.defineProperty
				//       be used.  But this method is fairly new, and failure is
				//       possible only if Object.prototype or Array.prototype
				//       has a property |i| (very unlikely), so use a less-correct
				//       but more portable alternative.
				if (i in t)
					res[i] = fun.call(thisArg, t[i], i, t);
			}

			return res;
		};
	}


	if(!Array.isArray) {
		Array.isArray = function(arg) {
			return Object.prototype.toString.call(arg) === '[object Array]';
		};
	}

	if (!Array.prototype.forEach) {
		Array.prototype.forEach = function(fun, thisArg) {
			"use strict";

			if (this === void 0 || this === null || typeof fun !== "function")
				throw new TypeError();

			var t = Object(this), len = t.length >>> 0;
			for (var i = 0; i < len; i++) {
				if (i in t)
					fun.call(thisArg, t[i], i, t);
			}
		};
	}

	if (!Object.keys) {
		Object.keys = (function () {
			'use strict';

			var hasOwnProperty = Object.prototype.hasOwnProperty,
				hasDontEnumBug = !({toString: null}).propertyIsEnumerable('toString'),
				dontEnums = ['toString','toLocaleString','valueOf','hasOwnProperty',
					'isPrototypeOf','propertyIsEnumerable','constructor'],
				dontEnumsLength = dontEnums.length;

			return function (obj) {
				if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
					throw new TypeError();
				}
				var result = [], prop, i;

				for (prop in obj) {
					if (hasOwnProperty.call(obj, prop)) {
						result.push(prop);
					}
				}

				if (hasDontEnumBug) {
					for (i = 0; i < dontEnumsLength; i++) {
						if (hasOwnProperty.call(obj, dontEnums[i])) {
							result.push(dontEnums[i]);
						}
					}
				}
				return result;
			};
		}());
	}

	if (!String.prototype.trim) {
		String.prototype.trim = function () {
			return this.replace(/^\s+|\s+$/g, '');
		};
	}
	if (!String.prototype.trimLeft) {
		String.prototype.trimLeft = function() {
			return this.replace(/^\s+/g, "");
		};
	}
	if (!String.prototype.trimRight) {
		String.prototype.trimRight = function() {
			return this.replace(/\s+$/g, "");
		};
	}

})(typeof self !== "undefined" && self || typeof window !== "undefined" && window || window);

return jsPDF;

})));

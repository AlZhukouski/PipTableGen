"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

jQuery(document).ready(function () {
  var accordionsMenu = $('.accordion');

  if (accordionsMenu.length > 0) {
    accordionsMenu.each(function () {
      var accordion = $(this); //detect change in the input[type="checkbox"] value

      accordion.on('change', '.accordion__toggler', function () {
        var checkbox = $(this);
        checkbox.prop('checked') ? checkbox.siblings('.accordion__item-content').attr('style', 'display:none;').slideDown(300) : checkbox.siblings('.accordion__item-content').attr('style', 'display:block;').slideUp(300);
      });
    });
  }
}); // Скрипт добавления файлов в форму

(function ($, window, document, undefined) {
  $('.form__fileinput').each(function () {
    var $input = $(this),
        $label = $input.next('label'),
        labelVal = $label.html();
    $input.on('change', function (e) {
      var fileName = '';
      $(this).siblings('.form__fileinput-close').addClass('form__fileinput-close--active');
      if (this.files && this.files.length > 1) fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);else if (e.target.value.length > 30) {
        fileName = e.target.value.split('\\').pop().slice(0, 30) + '...';
      } else {
        fileName = e.target.value.split('\\').pop();
      }
      if (fileName) $label.find('span').html(fileName);else $label.html(labelVal);
    }); // Firefox bug fix

    $input.on('focus', function () {
      $input.addClass('js_has-focus');
    }).on('blur', function () {
      $input.removeClass('js_has-focus');
    });
  });
  $('.form__fileinput-close').click(function () {
    $(this).siblings('.form__fileinput').val('');
    $(this).prev().find('span').html('Прикрепить файл');
    $(this).removeClass('form__fileinput-close--active');
  });
})(jQuery, window, document);
/*! Magnific Popup - v1.1.0 - 2016-02-20
 * http://dimsemenov.com/plugins/magnific-popup/
 * Copyright (c) 2016 Dmitry Semenov; */


;

(function (factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object') {
    // Node/CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(window.jQuery || window.Zepto);
  }
})(function ($) {
  /*>>core*/

  /**
   *
   * Magnific Popup Core JS file
   *
   */

  /**
   * Private static constants
   */
  var CLOSE_EVENT = 'Close',
      BEFORE_CLOSE_EVENT = 'BeforeClose',
      AFTER_CLOSE_EVENT = 'AfterClose',
      BEFORE_APPEND_EVENT = 'BeforeAppend',
      MARKUP_PARSE_EVENT = 'MarkupParse',
      OPEN_EVENT = 'Open',
      CHANGE_EVENT = 'Change',
      NS = 'mfp',
      EVENT_NS = '.' + NS,
      READY_CLASS = 'mfp-ready',
      REMOVING_CLASS = 'mfp-removing',
      PREVENT_CLOSE_CLASS = 'mfp-prevent-close';
  /**
   * Private vars
   */

  /*jshint -W079 */

  var mfp,
      // As we have only one instance of MagnificPopup object, we define it locally to not to use 'this'
  MagnificPopup = function MagnificPopup() {},
      _isJQ = !!window.jQuery,
      _prevStatus,
      _window = $(window),
      _document,
      _prevContentType,
      _wrapClasses,
      _currPopupType;
  /**
   * Private functions
   */


  var _mfpOn = function _mfpOn(name, f) {
    mfp.ev.on(NS + name + EVENT_NS, f);
  },
      _getEl = function _getEl(className, appendTo, html, raw) {
    var el = document.createElement('div');
    el.className = 'mfp-' + className;

    if (html) {
      el.innerHTML = html;
    }

    if (!raw) {
      el = $(el);

      if (appendTo) {
        el.appendTo(appendTo);
      }
    } else if (appendTo) {
      appendTo.appendChild(el);
    }

    return el;
  },
      _mfpTrigger = function _mfpTrigger(e, data) {
    mfp.ev.triggerHandler(NS + e, data);

    if (mfp.st.callbacks) {
      // converts "mfpEventName" to "eventName" callback and triggers it if it's present
      e = e.charAt(0).toLowerCase() + e.slice(1);

      if (mfp.st.callbacks[e]) {
        mfp.st.callbacks[e].apply(mfp, $.isArray(data) ? data : [data]);
      }
    }
  },
      _getCloseBtn = function _getCloseBtn(type) {
    if (type !== _currPopupType || !mfp.currTemplate.closeBtn) {
      mfp.currTemplate.closeBtn = $(mfp.st.closeMarkup.replace('%title%', mfp.st.tClose));
      _currPopupType = type;
    }

    return mfp.currTemplate.closeBtn;
  },
      // Initialize Magnific Popup only when called at least once
  _checkInstance = function _checkInstance() {
    if (!$.magnificPopup.instance) {
      /*jshint -W020 */
      mfp = new MagnificPopup();
      mfp.init();
      $.magnificPopup.instance = mfp;
    }
  },
      // CSS transition detection, http://stackoverflow.com/questions/7264899/detect-css-transitions-using-javascript-and-without-modernizr
  supportsTransitions = function supportsTransitions() {
    var s = document.createElement('p').style,
        // 's' for style. better to create an element if body yet to exist
    v = ['ms', 'O', 'Moz', 'Webkit']; // 'v' for vendor

    if (s['transition'] !== undefined) {
      return true;
    }

    while (v.length) {
      if (v.pop() + 'Transition' in s) {
        return true;
      }
    }

    return false;
  };
  /**
   * Public functions
   */


  MagnificPopup.prototype = {
    constructor: MagnificPopup,

    /**
     * Initializes Magnific Popup plugin.
     * This function is triggered only once when $.fn.magnificPopup or $.magnificPopup is executed
     */
    init: function init() {
      var appVersion = navigator.appVersion;
      mfp.isLowIE = mfp.isIE8 = document.all && !document.addEventListener;
      mfp.isAndroid = /android/gi.test(appVersion);
      mfp.isIOS = /iphone|ipad|ipod/gi.test(appVersion);
      mfp.supportsTransition = supportsTransitions(); // We disable fixed positioned lightbox on devices that don't handle it nicely.
      // If you know a better way of detecting this - let me know.

      mfp.probablyMobile = mfp.isAndroid || mfp.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent);
      _document = $(document);
      mfp.popupsCache = {};
    },

    /**
     * Opens popup
     * @param  data [description]
     */
    open: function open(data) {
      var i;

      if (data.isObj === false) {
        // convert jQuery collection to array to avoid conflicts later
        mfp.items = data.items.toArray();
        mfp.index = 0;
        var items = data.items,
            item;

        for (i = 0; i < items.length; i++) {
          item = items[i];

          if (item.parsed) {
            item = item.el[0];
          }

          if (item === data.el[0]) {
            mfp.index = i;
            break;
          }
        }
      } else {
        mfp.items = $.isArray(data.items) ? data.items : [data.items];
        mfp.index = data.index || 0;
      } // if popup is already opened - we just update the content


      if (mfp.isOpen) {
        mfp.updateItemHTML();
        return;
      }

      mfp.types = [];
      _wrapClasses = '';

      if (data.mainEl && data.mainEl.length) {
        mfp.ev = data.mainEl.eq(0);
      } else {
        mfp.ev = _document;
      }

      if (data.key) {
        if (!mfp.popupsCache[data.key]) {
          mfp.popupsCache[data.key] = {};
        }

        mfp.currTemplate = mfp.popupsCache[data.key];
      } else {
        mfp.currTemplate = {};
      }

      mfp.st = $.extend(true, {}, $.magnificPopup.defaults, data);
      mfp.fixedContentPos = mfp.st.fixedContentPos === 'auto' ? !mfp.probablyMobile : mfp.st.fixedContentPos;

      if (mfp.st.modal) {
        mfp.st.closeOnContentClick = false;
        mfp.st.closeOnBgClick = false;
        mfp.st.showCloseBtn = false;
        mfp.st.enableEscapeKey = false;
      } // Building markup
      // main containers are created only once


      if (!mfp.bgOverlay) {
        // Dark overlay
        mfp.bgOverlay = _getEl('bg').on('click' + EVENT_NS, function () {
          mfp.close();
        });
        mfp.wrap = _getEl('wrap').attr('tabindex', -1).on('click' + EVENT_NS, function (e) {
          if (mfp._checkIfClose(e.target)) {
            mfp.close();
          }
        });
        mfp.container = _getEl('container', mfp.wrap);
      }

      mfp.contentContainer = _getEl('content');

      if (mfp.st.preloader) {
        mfp.preloader = _getEl('preloader', mfp.container, mfp.st.tLoading);
      } // Initializing modules


      var modules = $.magnificPopup.modules;

      for (i = 0; i < modules.length; i++) {
        var n = modules[i];
        n = n.charAt(0).toUpperCase() + n.slice(1);
        mfp['init' + n].call(mfp);
      }

      _mfpTrigger('BeforeOpen');

      if (mfp.st.showCloseBtn) {
        // Close button
        if (!mfp.st.closeBtnInside) {
          mfp.wrap.append(_getCloseBtn());
        } else {
          _mfpOn(MARKUP_PARSE_EVENT, function (e, template, values, item) {
            values.close_replaceWith = _getCloseBtn(item.type);
          });

          _wrapClasses += ' mfp-close-btn-in';
        }
      }

      if (mfp.st.alignTop) {
        _wrapClasses += ' mfp-align-top';
      }

      if (mfp.fixedContentPos) {
        mfp.wrap.css({
          overflow: mfp.st.overflowY,
          overflowX: 'hidden',
          overflowY: mfp.st.overflowY
        });
      } else {
        mfp.wrap.css({
          top: _window.scrollTop(),
          position: 'absolute'
        });
      }

      if (mfp.st.fixedBgPos === false || mfp.st.fixedBgPos === 'auto' && !mfp.fixedContentPos) {
        mfp.bgOverlay.css({
          height: _document.height(),
          position: 'absolute'
        });
      }

      if (mfp.st.enableEscapeKey) {
        // Close on ESC key
        _document.on('keyup' + EVENT_NS, function (e) {
          if (e.keyCode === 27) {
            mfp.close();
          }
        });
      }

      _window.on('resize' + EVENT_NS, function () {
        mfp.updateSize();
      });

      if (!mfp.st.closeOnContentClick) {
        _wrapClasses += ' mfp-auto-cursor';
      }

      if (_wrapClasses) mfp.wrap.addClass(_wrapClasses); // this triggers recalculation of layout, so we get it once to not to trigger twice

      var windowHeight = mfp.wH = _window.height();

      var windowStyles = {};

      if (mfp.fixedContentPos) {
        if (mfp._hasScrollBar(windowHeight)) {
          var s = mfp._getScrollbarSize();

          if (s) {
            windowStyles.marginRight = s;
          }
        }
      }

      if (mfp.fixedContentPos) {
        if (!mfp.isIE7) {
          windowStyles.overflow = 'hidden';
        } else {
          // ie7 double-scroll bug
          $('body, html').css('overflow', 'hidden');
        }
      }

      var classesToadd = mfp.st.mainClass;

      if (mfp.isIE7) {
        classesToadd += ' mfp-ie7';
      }

      if (classesToadd) {
        mfp._addClassToMFP(classesToadd);
      } // add content


      mfp.updateItemHTML();

      _mfpTrigger('BuildControls'); // remove scrollbar, add margin e.t.c


      $('html').css(windowStyles); // add everything to DOM

      mfp.bgOverlay.add(mfp.wrap).prependTo(mfp.st.prependTo || $(document.body)); // Save last focused element

      mfp._lastFocusedEl = document.activeElement; // Wait for next cycle to allow CSS transition

      setTimeout(function () {
        if (mfp.content) {
          mfp._addClassToMFP(READY_CLASS);

          mfp._setFocus();
        } else {
          // if content is not defined (not loaded e.t.c) we add class only for BG
          mfp.bgOverlay.addClass(READY_CLASS);
        } // Trap the focus in popup


        _document.on('focusin' + EVENT_NS, mfp._onFocusIn);
      }, 16);
      mfp.isOpen = true;
      mfp.updateSize(windowHeight);

      _mfpTrigger(OPEN_EVENT);

      return data;
    },

    /**
     * Closes the popup
     */
    close: function close() {
      if (!mfp.isOpen) return;

      _mfpTrigger(BEFORE_CLOSE_EVENT);

      mfp.isOpen = false; // for CSS3 animation

      if (mfp.st.removalDelay && !mfp.isLowIE && mfp.supportsTransition) {
        mfp._addClassToMFP(REMOVING_CLASS);

        setTimeout(function () {
          mfp._close();
        }, mfp.st.removalDelay);
      } else {
        mfp._close();
      }
    },

    /**
     * Helper for close() function
     */
    _close: function _close() {
      _mfpTrigger(CLOSE_EVENT);

      var classesToRemove = REMOVING_CLASS + ' ' + READY_CLASS + ' ';
      mfp.bgOverlay.detach();
      mfp.wrap.detach();
      mfp.container.empty();

      if (mfp.st.mainClass) {
        classesToRemove += mfp.st.mainClass + ' ';
      }

      mfp._removeClassFromMFP(classesToRemove);

      if (mfp.fixedContentPos) {
        var windowStyles = {
          marginRight: ''
        };

        if (mfp.isIE7) {
          $('body, html').css('overflow', '');
        } else {
          windowStyles.overflow = '';
        }

        $('html').css(windowStyles);
      }

      _document.off('keyup' + EVENT_NS + ' focusin' + EVENT_NS);

      mfp.ev.off(EVENT_NS); // clean up DOM elements that aren't removed

      mfp.wrap.attr('class', 'mfp-wrap').removeAttr('style');
      mfp.bgOverlay.attr('class', 'mfp-bg');
      mfp.container.attr('class', 'mfp-container'); // remove close button from target element

      if (mfp.st.showCloseBtn && (!mfp.st.closeBtnInside || mfp.currTemplate[mfp.currItem.type] === true)) {
        if (mfp.currTemplate.closeBtn) mfp.currTemplate.closeBtn.detach();
      }

      if (mfp.st.autoFocusLast && mfp._lastFocusedEl) {
        $(mfp._lastFocusedEl).focus(); // put tab focus back
      }

      mfp.currItem = null;
      mfp.content = null;
      mfp.currTemplate = null;
      mfp.prevHeight = 0;

      _mfpTrigger(AFTER_CLOSE_EVENT);
    },
    updateSize: function updateSize(winHeight) {
      if (mfp.isIOS) {
        // fixes iOS nav bars https://github.com/dimsemenov/Magnific-Popup/issues/2
        var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
        var height = window.innerHeight * zoomLevel;
        mfp.wrap.css('height', height);
        mfp.wH = height;
      } else {
        mfp.wH = winHeight || _window.height();
      } // Fixes #84: popup incorrectly positioned with position:relative on body


      if (!mfp.fixedContentPos) {
        mfp.wrap.css('height', mfp.wH);
      }

      _mfpTrigger('Resize');
    },

    /**
     * Set content of popup based on current index
     */
    updateItemHTML: function updateItemHTML() {
      var item = mfp.items[mfp.index]; // Detach and perform modifications

      mfp.contentContainer.detach();
      if (mfp.content) mfp.content.detach();

      if (!item.parsed) {
        item = mfp.parseEl(mfp.index);
      }

      var type = item.type;

      _mfpTrigger('BeforeChange', [mfp.currItem ? mfp.currItem.type : '', type]); // BeforeChange event works like so:
      // _mfpOn('BeforeChange', function(e, prevType, newType) { });


      mfp.currItem = item;

      if (!mfp.currTemplate[type]) {
        var markup = mfp.st[type] ? mfp.st[type].markup : false; // allows to modify markup

        _mfpTrigger('FirstMarkupParse', markup);

        if (markup) {
          mfp.currTemplate[type] = $(markup);
        } else {
          // if there is no markup found we just define that template is parsed
          mfp.currTemplate[type] = true;
        }
      }

      if (_prevContentType && _prevContentType !== item.type) {
        mfp.container.removeClass('mfp-' + _prevContentType + '-holder');
      }

      var newContent = mfp['get' + type.charAt(0).toUpperCase() + type.slice(1)](item, mfp.currTemplate[type]);
      mfp.appendContent(newContent, type);
      item.preloaded = true;

      _mfpTrigger(CHANGE_EVENT, item);

      _prevContentType = item.type; // Append container back after its content changed

      mfp.container.prepend(mfp.contentContainer);

      _mfpTrigger('AfterChange');
    },

    /**
     * Set HTML content of popup
     */
    appendContent: function appendContent(newContent, type) {
      mfp.content = newContent;

      if (newContent) {
        if (mfp.st.showCloseBtn && mfp.st.closeBtnInside && mfp.currTemplate[type] === true) {
          // if there is no markup, we just append close button element inside
          if (!mfp.content.find('.mfp-close').length) {
            mfp.content.append(_getCloseBtn());
          }
        } else {
          mfp.content = newContent;
        }
      } else {
        mfp.content = '';
      }

      _mfpTrigger(BEFORE_APPEND_EVENT);

      mfp.container.addClass('mfp-' + type + '-holder');
      mfp.contentContainer.append(mfp.content);
    },

    /**
     * Creates Magnific Popup data object based on given data
     * @param  {int} index Index of item to parse
     */
    parseEl: function parseEl(index) {
      var item = mfp.items[index],
          type;

      if (item.tagName) {
        item = {
          el: $(item)
        };
      } else {
        type = item.type;
        item = {
          data: item,
          src: item.src
        };
      }

      if (item.el) {
        var types = mfp.types; // check for 'mfp-TYPE' class

        for (var i = 0; i < types.length; i++) {
          if (item.el.hasClass('mfp-' + types[i])) {
            type = types[i];
            break;
          }
        }

        item.src = item.el.attr('data-mfp-src');

        if (!item.src) {
          item.src = item.el.attr('href');
        }
      }

      item.type = type || mfp.st.type || 'inline';
      item.index = index;
      item.parsed = true;
      mfp.items[index] = item;

      _mfpTrigger('ElementParse', item);

      return mfp.items[index];
    },

    /**
     * Initializes single popup or a group of popups
     */
    addGroup: function addGroup(el, options) {
      var eHandler = function eHandler(e) {
        e.mfpEl = this;

        mfp._openClick(e, el, options);
      };

      if (!options) {
        options = {};
      }

      var eName = 'click.magnificPopup';
      options.mainEl = el;

      if (options.items) {
        options.isObj = true;
        el.off(eName).on(eName, eHandler);
      } else {
        options.isObj = false;

        if (options.delegate) {
          el.off(eName).on(eName, options.delegate, eHandler);
        } else {
          options.items = el;
          el.off(eName).on(eName, eHandler);
        }
      }
    },
    _openClick: function _openClick(e, el, options) {
      var midClick = options.midClick !== undefined ? options.midClick : $.magnificPopup.defaults.midClick;

      if (!midClick && (e.which === 2 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey)) {
        return;
      }

      var disableOn = options.disableOn !== undefined ? options.disableOn : $.magnificPopup.defaults.disableOn;

      if (disableOn) {
        if ($.isFunction(disableOn)) {
          if (!disableOn.call(mfp)) {
            return true;
          }
        } else {
          // else it's number
          if (_window.width() < disableOn) {
            return true;
          }
        }
      }

      if (e.type) {
        e.preventDefault(); // This will prevent popup from closing if element is inside and popup is already opened

        if (mfp.isOpen) {
          e.stopPropagation();
        }
      }

      options.el = $(e.mfpEl);

      if (options.delegate) {
        options.items = el.find(options.delegate);
      }

      mfp.open(options);
    },

    /**
     * Updates text on preloader
     */
    updateStatus: function updateStatus(status, text) {
      if (mfp.preloader) {
        if (_prevStatus !== status) {
          mfp.container.removeClass('mfp-s-' + _prevStatus);
        }

        if (!text && status === 'loading') {
          text = mfp.st.tLoading;
        }

        var data = {
          status: status,
          text: text
        }; // allows to modify status

        _mfpTrigger('UpdateStatus', data);

        status = data.status;
        text = data.text;
        mfp.preloader.html(text);
        mfp.preloader.find('a').on('click', function (e) {
          e.stopImmediatePropagation();
        });
        mfp.container.addClass('mfp-s-' + status);
        _prevStatus = status;
      }
    },

    /*
     "Private" helpers that aren't private at all
     */
    // Check to close popup or not
    // "target" is an element that was clicked
    _checkIfClose: function _checkIfClose(target) {
      if ($(target).hasClass(PREVENT_CLOSE_CLASS)) {
        return;
      }

      var closeOnContent = mfp.st.closeOnContentClick;
      var closeOnBg = mfp.st.closeOnBgClick;

      if (closeOnContent && closeOnBg) {
        return true;
      } else {
        // We close the popup if click is on close button or on preloader. Or if there is no content.
        if (!mfp.content || $(target).hasClass('mfp-close') || mfp.preloader && target === mfp.preloader[0]) {
          return true;
        } // if click is outside the content


        if (target !== mfp.content[0] && !$.contains(mfp.content[0], target)) {
          if (closeOnBg) {
            // last check, if the clicked element is in DOM, (in case it's removed onclick)
            if ($.contains(document, target)) {
              return true;
            }
          }
        } else if (closeOnContent) {
          return true;
        }
      }

      return false;
    },
    _addClassToMFP: function _addClassToMFP(cName) {
      mfp.bgOverlay.addClass(cName);
      mfp.wrap.addClass(cName);
    },
    _removeClassFromMFP: function _removeClassFromMFP(cName) {
      this.bgOverlay.removeClass(cName);
      mfp.wrap.removeClass(cName);
    },
    _hasScrollBar: function _hasScrollBar(winHeight) {
      return (mfp.isIE7 ? _document.height() : document.body.scrollHeight) > (winHeight || _window.height());
    },
    _setFocus: function _setFocus() {
      (mfp.st.focus ? mfp.content.find(mfp.st.focus).eq(0) : mfp.wrap).focus();
    },
    _onFocusIn: function _onFocusIn(e) {
      if (e.target !== mfp.wrap[0] && !$.contains(mfp.wrap[0], e.target)) {
        mfp._setFocus();

        return false;
      }
    },
    _parseMarkup: function _parseMarkup(template, values, item) {
      var arr;

      if (item.data) {
        values = $.extend(item.data, values);
      }

      _mfpTrigger(MARKUP_PARSE_EVENT, [template, values, item]);

      $.each(values, function (key, value) {
        if (value === undefined || value === false) {
          return true;
        }

        arr = key.split('_');

        if (arr.length > 1) {
          var el = template.find(EVENT_NS + '-' + arr[0]);

          if (el.length > 0) {
            var attr = arr[1];

            if (attr === 'replaceWith') {
              if (el[0] !== value[0]) {
                el.replaceWith(value);
              }
            } else if (attr === 'img') {
              if (el.is('img')) {
                el.attr('src', value);
              } else {
                el.replaceWith($('<img>').attr('src', value).attr('class', el.attr('class')));
              }
            } else {
              el.attr(arr[1], value);
            }
          }
        } else {
          template.find(EVENT_NS + '-' + key).html(value);
        }
      });
    },
    _getScrollbarSize: function _getScrollbarSize() {
      // thx David
      if (mfp.scrollbarSize === undefined) {
        var scrollDiv = document.createElement("div");
        scrollDiv.style.cssText = 'width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';
        document.body.appendChild(scrollDiv);
        mfp.scrollbarSize = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
      }

      return mfp.scrollbarSize;
    }
  };
  /* MagnificPopup core prototype end */

  /**
   * Public static functions
   */

  $.magnificPopup = {
    instance: null,
    proto: MagnificPopup.prototype,
    modules: [],
    open: function open(options, index) {
      _checkInstance();

      if (!options) {
        options = {};
      } else {
        options = $.extend(true, {}, options);
      }

      options.isObj = true;
      options.index = index || 0;
      return this.instance.open(options);
    },
    close: function close() {
      return $.magnificPopup.instance && $.magnificPopup.instance.close();
    },
    registerModule: function registerModule(name, module) {
      if (module.options) {
        $.magnificPopup.defaults[name] = module.options;
      }

      $.extend(this.proto, module.proto);
      this.modules.push(name);
    },
    defaults: {
      // Info about options is in docs:
      // http://dimsemenov.com/plugins/magnific-popup/documentation.html#options
      disableOn: 0,
      key: null,
      midClick: false,
      mainClass: '',
      preloader: true,
      focus: '',
      // CSS selector of input to focus after popup is opened
      closeOnContentClick: false,
      closeOnBgClick: true,
      closeBtnInside: true,
      showCloseBtn: true,
      enableEscapeKey: true,
      modal: false,
      alignTop: false,
      removalDelay: 0,
      prependTo: null,
      fixedContentPos: 'auto',
      fixedBgPos: 'auto',
      overflowY: 'auto',
      closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',
      tClose: 'Close (Esc)',
      tLoading: 'Loading...',
      autoFocusLast: true
    }
  };

  $.fn.magnificPopup = function (options) {
    _checkInstance();

    var jqEl = $(this); // We call some API method of first param is a string

    if (typeof options === "string") {
      if (options === 'open') {
        var items,
            itemOpts = _isJQ ? jqEl.data('magnificPopup') : jqEl[0].magnificPopup,
            index = parseInt(arguments[1], 10) || 0;

        if (itemOpts.items) {
          items = itemOpts.items[index];
        } else {
          items = jqEl;

          if (itemOpts.delegate) {
            items = items.find(itemOpts.delegate);
          }

          items = items.eq(index);
        }

        mfp._openClick({
          mfpEl: items
        }, jqEl, itemOpts);
      } else {
        if (mfp.isOpen) mfp[options].apply(mfp, Array.prototype.slice.call(arguments, 1));
      }
    } else {
      // clone options obj
      options = $.extend(true, {}, options);
      /*
       * As Zepto doesn't support .data() method for objects
       * and it works only in normal browsers
       * we assign "options" object directly to the DOM element. FTW!
       */

      if (_isJQ) {
        jqEl.data('magnificPopup', options);
      } else {
        jqEl[0].magnificPopup = options;
      }

      mfp.addGroup(jqEl, options);
    }

    return jqEl;
  };
  /*>>core*/

  /*>>inline*/


  var INLINE_NS = 'inline',
      _hiddenClass,
      _inlinePlaceholder,
      _lastInlineElement,
      _putInlineElementsBack = function _putInlineElementsBack() {
    if (_lastInlineElement) {
      _inlinePlaceholder.after(_lastInlineElement.addClass(_hiddenClass)).detach();

      _lastInlineElement = null;
    }
  };

  $.magnificPopup.registerModule(INLINE_NS, {
    options: {
      hiddenClass: 'hide',
      // will be appended with `mfp-` prefix
      markup: '',
      tNotFound: 'Content not found'
    },
    proto: {
      initInline: function initInline() {
        mfp.types.push(INLINE_NS);

        _mfpOn(CLOSE_EVENT + '.' + INLINE_NS, function () {
          _putInlineElementsBack();
        });
      },
      getInline: function getInline(item, template) {
        _putInlineElementsBack();

        if (item.src) {
          var inlineSt = mfp.st.inline,
              el = $(item.src);

          if (el.length) {
            // If target element has parent - we replace it with placeholder and put it back after popup is closed
            var parent = el[0].parentNode;

            if (parent && parent.tagName) {
              if (!_inlinePlaceholder) {
                _hiddenClass = inlineSt.hiddenClass;
                _inlinePlaceholder = _getEl(_hiddenClass);
                _hiddenClass = 'mfp-' + _hiddenClass;
              } // replace target inline element with placeholder


              _lastInlineElement = el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);
            }

            mfp.updateStatus('ready');
          } else {
            mfp.updateStatus('error', inlineSt.tNotFound);
            el = $('<div>');
          }

          item.inlineElement = el;
          return el;
        }

        mfp.updateStatus('ready');

        mfp._parseMarkup(template, {}, item);

        return template;
      }
    }
  });
  /*>>inline*/

  /*>>ajax*/

  var AJAX_NS = 'ajax',
      _ajaxCur,
      _removeAjaxCursor = function _removeAjaxCursor() {
    if (_ajaxCur) {
      $(document.body).removeClass(_ajaxCur);
    }
  },
      _destroyAjaxRequest = function _destroyAjaxRequest() {
    _removeAjaxCursor();

    if (mfp.req) {
      mfp.req.abort();
    }
  };

  $.magnificPopup.registerModule(AJAX_NS, {
    options: {
      settings: null,
      cursor: 'mfp-ajax-cur',
      tError: '<a href="%url%">The content</a> could not be loaded.'
    },
    proto: {
      initAjax: function initAjax() {
        mfp.types.push(AJAX_NS);
        _ajaxCur = mfp.st.ajax.cursor;

        _mfpOn(CLOSE_EVENT + '.' + AJAX_NS, _destroyAjaxRequest);

        _mfpOn('BeforeChange.' + AJAX_NS, _destroyAjaxRequest);
      },
      getAjax: function getAjax(item) {
        if (_ajaxCur) {
          $(document.body).addClass(_ajaxCur);
        }

        mfp.updateStatus('loading');
        var opts = $.extend({
          url: item.src,
          success: function success(data, textStatus, jqXHR) {
            var temp = {
              data: data,
              xhr: jqXHR
            };

            _mfpTrigger('ParseAjax', temp);

            mfp.appendContent($(temp.data), AJAX_NS);
            item.finished = true;

            _removeAjaxCursor();

            mfp._setFocus();

            setTimeout(function () {
              mfp.wrap.addClass(READY_CLASS);
            }, 16);
            mfp.updateStatus('ready');

            _mfpTrigger('AjaxContentAdded');
          },
          error: function error() {
            _removeAjaxCursor();

            item.finished = item.loadError = true;
            mfp.updateStatus('error', mfp.st.ajax.tError.replace('%url%', item.src));
          }
        }, mfp.st.ajax.settings);
        mfp.req = $.ajax(opts);
        return '';
      }
    }
  });
  /*>>ajax*/

  /*>>image*/

  var _imgInterval,
      _getTitle = function _getTitle(item) {
    if (item.data && item.data.title !== undefined) return item.data.title;
    var src = mfp.st.image.titleSrc;

    if (src) {
      if ($.isFunction(src)) {
        return src.call(mfp, item);
      } else if (item.el) {
        return item.el.attr(src) || '';
      }
    }

    return '';
  };

  $.magnificPopup.registerModule('image', {
    options: {
      markup: '<div class="mfp-figure">' + '<div class="mfp-close"></div>' + '<figure>' + '<div class="mfp-img"></div>' + '<figcaption>' + '<div class="mfp-bottom-bar">' + '<div class="mfp-title"></div>' + '<div class="mfp-counter"></div>' + '</div>' + '</figcaption>' + '</figure>' + '</div>',
      cursor: 'mfp-zoom-out-cur',
      titleSrc: 'title',
      verticalFit: true,
      tError: '<a href="%url%">The image</a> could not be loaded.'
    },
    proto: {
      initImage: function initImage() {
        var imgSt = mfp.st.image,
            ns = '.image';
        mfp.types.push('image');

        _mfpOn(OPEN_EVENT + ns, function () {
          if (mfp.currItem.type === 'image' && imgSt.cursor) {
            $(document.body).addClass(imgSt.cursor);
          }
        });

        _mfpOn(CLOSE_EVENT + ns, function () {
          if (imgSt.cursor) {
            $(document.body).removeClass(imgSt.cursor);
          }

          _window.off('resize' + EVENT_NS);
        });

        _mfpOn('Resize' + ns, mfp.resizeImage);

        if (mfp.isLowIE) {
          _mfpOn('AfterChange', mfp.resizeImage);
        }
      },
      resizeImage: function resizeImage() {
        var item = mfp.currItem;
        if (!item || !item.img) return;

        if (mfp.st.image.verticalFit) {
          var decr = 0; // fix box-sizing in ie7/8

          if (mfp.isLowIE) {
            decr = parseInt(item.img.css('padding-top'), 10) + parseInt(item.img.css('padding-bottom'), 10);
          }

          item.img.css('max-height', mfp.wH - decr);
        }
      },
      _onImageHasSize: function _onImageHasSize(item) {
        if (item.img) {
          item.hasSize = true;

          if (_imgInterval) {
            clearInterval(_imgInterval);
          }

          item.isCheckingImgSize = false;

          _mfpTrigger('ImageHasSize', item);

          if (item.imgHidden) {
            if (mfp.content) mfp.content.removeClass('mfp-loading');
            item.imgHidden = false;
          }
        }
      },

      /**
       * Function that loops until the image has size to display elements that rely on it asap
       */
      findImageSize: function findImageSize(item) {
        var counter = 0,
            img = item.img[0],
            mfpSetInterval = function mfpSetInterval(delay) {
          if (_imgInterval) {
            clearInterval(_imgInterval);
          } // decelerating interval that checks for size of an image


          _imgInterval = setInterval(function () {
            if (img.naturalWidth > 0) {
              mfp._onImageHasSize(item);

              return;
            }

            if (counter > 200) {
              clearInterval(_imgInterval);
            }

            counter++;

            if (counter === 3) {
              mfpSetInterval(10);
            } else if (counter === 40) {
              mfpSetInterval(50);
            } else if (counter === 100) {
              mfpSetInterval(500);
            }
          }, delay);
        };

        mfpSetInterval(1);
      },
      getImage: function getImage(item, template) {
        var guard = 0,
            // image load complete handler
        onLoadComplete = function onLoadComplete() {
          if (item) {
            if (item.img[0].complete) {
              item.img.off('.mfploader');

              if (item === mfp.currItem) {
                mfp._onImageHasSize(item);

                mfp.updateStatus('ready');
              }

              item.hasSize = true;
              item.loaded = true;

              _mfpTrigger('ImageLoadComplete');
            } else {
              // if image complete check fails 200 times (20 sec), we assume that there was an error.
              guard++;

              if (guard < 200) {
                setTimeout(onLoadComplete, 100);
              } else {
                onLoadError();
              }
            }
          }
        },
            // image error handler
        onLoadError = function onLoadError() {
          if (item) {
            item.img.off('.mfploader');

            if (item === mfp.currItem) {
              mfp._onImageHasSize(item);

              mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src));
            }

            item.hasSize = true;
            item.loaded = true;
            item.loadError = true;
          }
        },
            imgSt = mfp.st.image;

        var el = template.find('.mfp-img');

        if (el.length) {
          var img = document.createElement('img');
          img.className = 'mfp-img';

          if (item.el && item.el.find('img').length) {
            img.alt = item.el.find('img').attr('alt');
          }

          item.img = $(img).on('load.mfploader', onLoadComplete).on('error.mfploader', onLoadError);
          img.src = item.src; // without clone() "error" event is not firing when IMG is replaced by new IMG
          // TODO: find a way to avoid such cloning

          if (el.is('img')) {
            item.img = item.img.clone();
          }

          img = item.img[0];

          if (img.naturalWidth > 0) {
            item.hasSize = true;
          } else if (!img.width) {
            item.hasSize = false;
          }
        }

        mfp._parseMarkup(template, {
          title: _getTitle(item),
          img_replaceWith: item.img
        }, item);

        mfp.resizeImage();

        if (item.hasSize) {
          if (_imgInterval) clearInterval(_imgInterval);

          if (item.loadError) {
            template.addClass('mfp-loading');
            mfp.updateStatus('error', imgSt.tError.replace('%url%', item.src));
          } else {
            template.removeClass('mfp-loading');
            mfp.updateStatus('ready');
          }

          return template;
        }

        mfp.updateStatus('loading');
        item.loading = true;

        if (!item.hasSize) {
          item.imgHidden = true;
          template.addClass('mfp-loading');
          mfp.findImageSize(item);
        }

        return template;
      }
    }
  });
  /*>>image*/

  /*>>zoom*/

  var hasMozTransform,
      getHasMozTransform = function getHasMozTransform() {
    if (hasMozTransform === undefined) {
      hasMozTransform = document.createElement('p').style.MozTransform !== undefined;
    }

    return hasMozTransform;
  };

  $.magnificPopup.registerModule('zoom', {
    options: {
      enabled: false,
      easing: 'ease-in-out',
      duration: 300,
      opener: function opener(element) {
        return element.is('img') ? element : element.find('img');
      }
    },
    proto: {
      initZoom: function initZoom() {
        var zoomSt = mfp.st.zoom,
            ns = '.zoom',
            image;

        if (!zoomSt.enabled || !mfp.supportsTransition) {
          return;
        }

        var duration = zoomSt.duration,
            getElToAnimate = function getElToAnimate(image) {
          var newImg = image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),
              transition = 'all ' + zoomSt.duration / 1000 + 's ' + zoomSt.easing,
              cssObj = {
            position: 'fixed',
            zIndex: 9999,
            left: 0,
            top: 0,
            '-webkit-backface-visibility': 'hidden'
          },
              t = 'transition';
          cssObj['-webkit-' + t] = cssObj['-moz-' + t] = cssObj['-o-' + t] = cssObj[t] = transition;
          newImg.css(cssObj);
          return newImg;
        },
            showMainContent = function showMainContent() {
          mfp.content.css('visibility', 'visible');
        },
            openTimeout,
            animatedImg;

        _mfpOn('BuildControls' + ns, function () {
          if (mfp._allowZoom()) {
            clearTimeout(openTimeout);
            mfp.content.css('visibility', 'hidden'); // Basically, all code below does is clones existing image, puts in on top of the current one and animated it

            image = mfp._getItemToZoom();

            if (!image) {
              showMainContent();
              return;
            }

            animatedImg = getElToAnimate(image);
            animatedImg.css(mfp._getOffset());
            mfp.wrap.append(animatedImg);
            openTimeout = setTimeout(function () {
              animatedImg.css(mfp._getOffset(true));
              openTimeout = setTimeout(function () {
                showMainContent();
                setTimeout(function () {
                  animatedImg.remove();
                  image = animatedImg = null;

                  _mfpTrigger('ZoomAnimationEnded');
                }, 16); // avoid blink when switching images
              }, duration); // this timeout equals animation duration
            }, 16); // by adding this timeout we avoid short glitch at the beginning of animation
            // Lots of timeouts...
          }
        });

        _mfpOn(BEFORE_CLOSE_EVENT + ns, function () {
          if (mfp._allowZoom()) {
            clearTimeout(openTimeout);
            mfp.st.removalDelay = duration;

            if (!image) {
              image = mfp._getItemToZoom();

              if (!image) {
                return;
              }

              animatedImg = getElToAnimate(image);
            }

            animatedImg.css(mfp._getOffset(true));
            mfp.wrap.append(animatedImg);
            mfp.content.css('visibility', 'hidden');
            setTimeout(function () {
              animatedImg.css(mfp._getOffset());
            }, 16);
          }
        });

        _mfpOn(CLOSE_EVENT + ns, function () {
          if (mfp._allowZoom()) {
            showMainContent();

            if (animatedImg) {
              animatedImg.remove();
            }

            image = null;
          }
        });
      },
      _allowZoom: function _allowZoom() {
        return mfp.currItem.type === 'image';
      },
      _getItemToZoom: function _getItemToZoom() {
        if (mfp.currItem.hasSize) {
          return mfp.currItem.img;
        } else {
          return false;
        }
      },
      // Get element postion relative to viewport
      _getOffset: function _getOffset(isLarge) {
        var el;

        if (isLarge) {
          el = mfp.currItem.img;
        } else {
          el = mfp.st.zoom.opener(mfp.currItem.el || mfp.currItem);
        }

        var offset = el.offset();
        var paddingTop = parseInt(el.css('padding-top'), 10);
        var paddingBottom = parseInt(el.css('padding-bottom'), 10);
        offset.top -= $(window).scrollTop() - paddingTop;
        /*
        		 Animating left + top + width/height looks glitchy in Firefox, but perfect in Chrome. And vice-versa.
        		 */

        var obj = {
          width: el.width(),
          // fix Zepto height+padding issue
          height: (_isJQ ? el.innerHeight() : el[0].offsetHeight) - paddingBottom - paddingTop
        }; // I hate to do this, but there is no another option

        if (getHasMozTransform()) {
          obj['-moz-transform'] = obj['transform'] = 'translate(' + offset.left + 'px,' + offset.top + 'px)';
        } else {
          obj.left = offset.left;
          obj.top = offset.top;
        }

        return obj;
      }
    }
  });
  /*>>zoom*/

  /*>>iframe*/

  var IFRAME_NS = 'iframe',
      _emptyPage = '//about:blank',
      _fixIframeBugs = function _fixIframeBugs(isShowing) {
    if (mfp.currTemplate[IFRAME_NS]) {
      var el = mfp.currTemplate[IFRAME_NS].find('iframe');

      if (el.length) {
        // reset src after the popup is closed to avoid "video keeps playing after popup is closed" bug
        if (!isShowing) {
          el[0].src = _emptyPage;
        } // IE8 black screen bug fix


        if (mfp.isIE8) {
          el.css('display', isShowing ? 'block' : 'none');
        }
      }
    }
  };

  $.magnificPopup.registerModule(IFRAME_NS, {
    options: {
      markup: '<div class="mfp-iframe-scaler">' + '<div class="mfp-close"></div>' + '<iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe>' + '</div>',
      srcAction: 'iframe_src',
      // we don't care and support only one default type of URL by default
      patterns: {
        youtube: {
          index: 'youtube.com',
          id: 'v=',
          src: '//www.youtube.com/embed/%id%?autoplay=1'
        },
        vimeo: {
          index: 'vimeo.com/',
          id: '/',
          src: '//player.vimeo.com/video/%id%?autoplay=1'
        },
        gmaps: {
          index: '//maps.google.',
          src: '%id%&output=embed'
        }
      }
    },
    proto: {
      initIframe: function initIframe() {
        mfp.types.push(IFRAME_NS);

        _mfpOn('BeforeChange', function (e, prevType, newType) {
          if (prevType !== newType) {
            if (prevType === IFRAME_NS) {
              _fixIframeBugs(); // iframe if removed

            } else if (newType === IFRAME_NS) {
              _fixIframeBugs(true); // iframe is showing

            }
          } // else {
          // iframe source is switched, don't do anything
          //}

        });

        _mfpOn(CLOSE_EVENT + '.' + IFRAME_NS, function () {
          _fixIframeBugs();
        });
      },
      getIframe: function getIframe(item, template) {
        var embedSrc = item.src;
        var iframeSt = mfp.st.iframe;
        $.each(iframeSt.patterns, function () {
          if (embedSrc.indexOf(this.index) > -1) {
            if (this.id) {
              if (typeof this.id === 'string') {
                embedSrc = embedSrc.substr(embedSrc.lastIndexOf(this.id) + this.id.length, embedSrc.length);
              } else {
                embedSrc = this.id.call(this, embedSrc);
              }
            }

            embedSrc = this.src.replace('%id%', embedSrc);
            return false; // break;
          }
        });
        var dataObj = {};

        if (iframeSt.srcAction) {
          dataObj[iframeSt.srcAction] = embedSrc;
        }

        mfp._parseMarkup(template, dataObj, item);

        mfp.updateStatus('ready');
        return template;
      }
    }
  });
  /*>>iframe*/

  /*>>gallery*/

  /**
   * Get looped index depending on number of slides
   */

  var _getLoopedId = function _getLoopedId(index) {
    var numSlides = mfp.items.length;

    if (index > numSlides - 1) {
      return index - numSlides;
    } else if (index < 0) {
      return numSlides + index;
    }

    return index;
  },
      _replaceCurrTotal = function _replaceCurrTotal(text, curr, total) {
    return text.replace(/%curr%/gi, curr + 1).replace(/%total%/gi, total);
  };

  $.magnificPopup.registerModule('gallery', {
    options: {
      enabled: false,
      arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
      preload: [0, 2],
      navigateByImgClick: true,
      arrows: true,
      tPrev: 'Previous (Left arrow key)',
      tNext: 'Next (Right arrow key)',
      tCounter: '%curr% of %total%'
    },
    proto: {
      initGallery: function initGallery() {
        var gSt = mfp.st.gallery,
            ns = '.mfp-gallery';
        mfp.direction = true; // true - next, false - prev

        if (!gSt || !gSt.enabled) return false;
        _wrapClasses += ' mfp-gallery';

        _mfpOn(OPEN_EVENT + ns, function () {
          if (gSt.navigateByImgClick) {
            mfp.wrap.on('click' + ns, '.mfp-img', function () {
              if (mfp.items.length > 1) {
                mfp.next();
                return false;
              }
            });
          }

          _document.on('keydown' + ns, function (e) {
            if (e.keyCode === 37) {
              mfp.prev();
            } else if (e.keyCode === 39) {
              mfp.next();
            }
          });
        });

        _mfpOn('UpdateStatus' + ns, function (e, data) {
          if (data.text) {
            data.text = _replaceCurrTotal(data.text, mfp.currItem.index, mfp.items.length);
          }
        });

        _mfpOn(MARKUP_PARSE_EVENT + ns, function (e, element, values, item) {
          var l = mfp.items.length;
          values.counter = l > 1 ? _replaceCurrTotal(gSt.tCounter, item.index, l) : '';
        });

        _mfpOn('BuildControls' + ns, function () {
          if (mfp.items.length > 1 && gSt.arrows && !mfp.arrowLeft) {
            var markup = gSt.arrowMarkup,
                arrowLeft = mfp.arrowLeft = $(markup.replace(/%title%/gi, gSt.tPrev).replace(/%dir%/gi, 'left')).addClass(PREVENT_CLOSE_CLASS),
                arrowRight = mfp.arrowRight = $(markup.replace(/%title%/gi, gSt.tNext).replace(/%dir%/gi, 'right')).addClass(PREVENT_CLOSE_CLASS);
            arrowLeft.click(function () {
              mfp.prev();
            });
            arrowRight.click(function () {
              mfp.next();
            });
            mfp.container.append(arrowLeft.add(arrowRight));
          }
        });

        _mfpOn(CHANGE_EVENT + ns, function () {
          if (mfp._preloadTimeout) clearTimeout(mfp._preloadTimeout);
          mfp._preloadTimeout = setTimeout(function () {
            mfp.preloadNearbyImages();
            mfp._preloadTimeout = null;
          }, 16);
        });

        _mfpOn(CLOSE_EVENT + ns, function () {
          _document.off(ns);

          mfp.wrap.off('click' + ns);
          mfp.arrowRight = mfp.arrowLeft = null;
        });
      },
      next: function next() {
        mfp.direction = true;
        mfp.index = _getLoopedId(mfp.index + 1);
        mfp.updateItemHTML();
      },
      prev: function prev() {
        mfp.direction = false;
        mfp.index = _getLoopedId(mfp.index - 1);
        mfp.updateItemHTML();
      },
      goTo: function goTo(newIndex) {
        mfp.direction = newIndex >= mfp.index;
        mfp.index = newIndex;
        mfp.updateItemHTML();
      },
      preloadNearbyImages: function preloadNearbyImages() {
        var p = mfp.st.gallery.preload,
            preloadBefore = Math.min(p[0], mfp.items.length),
            preloadAfter = Math.min(p[1], mfp.items.length),
            i;

        for (i = 1; i <= (mfp.direction ? preloadAfter : preloadBefore); i++) {
          mfp._preloadItem(mfp.index + i);
        }

        for (i = 1; i <= (mfp.direction ? preloadBefore : preloadAfter); i++) {
          mfp._preloadItem(mfp.index - i);
        }
      },
      _preloadItem: function _preloadItem(index) {
        index = _getLoopedId(index);

        if (mfp.items[index].preloaded) {
          return;
        }

        var item = mfp.items[index];

        if (!item.parsed) {
          item = mfp.parseEl(index);
        }

        _mfpTrigger('LazyLoad', item);

        if (item.type === 'image') {
          item.img = $('<img class="mfp-img" />').on('load.mfploader', function () {
            item.hasSize = true;
          }).on('error.mfploader', function () {
            item.hasSize = true;
            item.loadError = true;

            _mfpTrigger('LazyLoadError', item);
          }).attr('src', item.src);
        }

        item.preloaded = true;
      }
    }
  });
  /*>>gallery*/

  /*>>retina*/

  var RETINA_NS = 'retina';
  $.magnificPopup.registerModule(RETINA_NS, {
    options: {
      replaceSrc: function replaceSrc(item) {
        return item.src.replace(/\.\w+$/, function (m) {
          return '@2x' + m;
        });
      },
      ratio: 1 // Function or number.  Set to 1 to disable.

    },
    proto: {
      initRetina: function initRetina() {
        if (window.devicePixelRatio > 1) {
          var st = mfp.st.retina,
              ratio = st.ratio;
          ratio = !isNaN(ratio) ? ratio : ratio();

          if (ratio > 1) {
            _mfpOn('ImageHasSize' + '.' + RETINA_NS, function (e, item) {
              item.img.css({
                'max-width': item.img[0].naturalWidth / ratio,
                'width': '100%'
              });
            });

            _mfpOn('ElementParse' + '.' + RETINA_NS, function (e, item) {
              item.src = st.replaceSrc(item, ratio);
            });
          }
        }
      }
    }
  });
  /*>>retina*/

  _checkInstance();
});

$(document).ready(function () {
  if ($('.js_modal-trigger-zoom')) {
    $('.js_modal-trigger-zoom').each(function () {
      var zoomModalTrigger = $(this);
      var triggerDataHref = zoomModalTrigger.attr('data-href');
      zoomModalTrigger.attr('href', triggerDataHref);
      $(this).magnificPopup({
        type: 'inline',
        fixedContentPos: false,
        fixedBgPos: true,
        overflowY: 'auto',
        showCloseBtn: false,
        preloader: false,
        midClick: true,
        removalDelay: 300,
        mainClass: 'mfp-zoom-in'
      });
    });
  }

  function closePopup() {
    $.magnificPopup.close();
  }
}); //Генерация таблицы Полотно с ячейками

function tableGenerator(row, column, bgColor, borderColor, cellWidth, cellHeight) {
  var quotes = '';
  var content = ''; //переменная в которую сгенерируется код таблицы

  var cellContents = 0; //переменная содержимое ячейки
  //части таблиц из которых она собирается

  var tableStart = '',
      tableEnd = '',
      tableRowStart = '',
      tableRowEnd = '',
      tableDataStart = '',
      tableDataEnd = ''; //Выбираем по парраметру  какую таблицу построить

  if (quotes == '-q') {
    tableStart = '"<table cellpadding="+""10""+" border="+""1""+" bordercolor="+""#' + borderColor + '""+" rules="+""all">';
    tableEnd = '</table>"';
    tableRowStart = '<tr>';
    tableRowEnd = '</tr>';
    tableDataStart = '<td align="+""center""+" valign="+""center""+" bgcolor="+""#' + bgColor + '""+" height="+""150""+" width="+""80">';
    tableDataEnd = '</td>'; //без кавычек таблица
  } else {
    tableStart = '<table cellpadding="10" border="1" bordercolor="#' + borderColor + '" rules="all">';
    tableEnd = '</table>';
    tableRowStart = '<tr>';
    tableRowEnd = '</tr>';
    tableDataStart = '<td align="center" valign="center" bgcolor="#' + bgColor + '" height="' + cellHeight + '" width="' + cellWidth + '">';
    tableDataEnd = '</td>';
  } //собираем таблицу по правилам выше


  content += tableStart;

  for (var i = 0; i < row; i++) {
    // выведет 0, затем 1, затем 2
    content += tableRowStart;

    for (var y = 0; y < column; y++) {
      cellContents++;
      content += tableDataStart;
      content += cellContents;
      content += tableDataEnd;
    }

    content += tableRowEnd;
  }

  content += tableEnd;
  return content;
} //по проверка на возможность построения таблицы по парраметрам холста и ячейки


function checkingValues(w1, h1, w2, h2) {
  //Счётчик верно введенных парраметров
  var count = 0; //Серия условий проверки введённых парраметров и вывода сообщений если парраметр не является положительным числом

  if (isNaN(w1) === false && Math.sign(w1) == 1) {
    $('#errorCanW').empty();
    count++;
  } else {
    $('#errorCanW').empty().append('Введите положительное число.');
  }

  if (isNaN(h1) === false && Math.sign(h1) == 1) {
    $('#errorCanH').empty();
    count++;
  } else {
    $('#errorCanH').empty().append('Введите положительное число.');
  }

  if (isNaN(w2) === false && Math.sign(w2) == 1) {
    $('#errorCellW').empty();
    count++;
  } else {
    $('#errorCellW').empty().append('Введите положительное число.');
  }

  if (isNaN(h2) === false && Math.sign(h2) == 1) {
    $('#errorCellH').empty();
    count++;
  } else {
    $('#errorCellH').empty().append('Введите положительное число.');
  }

  console.log(count); //проверим если парраметры введены верные, высота и ширина полотна больше либо равны высоте  и ширине ячейки, то таблицу можно строить

  if (+w1 >= +w2 && +h1 >= +h2 && count == 4) {
    $('.settings__error').empty();
    return true;
  } else {
    if (count == 4) {
      $('.settings__error').empty().append('Холст меньше ячейки.'); //Очистим предыдущую таблицу

      $('.pipTableGen__build-wrap').empty();
    }
  }
} //функция построение нужной таблицы с проверками


var tableCode;

function tableResult() {
  //запустим функцию очистки данных
  dataСleaning(); //получим значение форм для генерации таблицы

  var canvasHeight, canvasWidth, cellHeight, cellWidth, bgColor, borderColor;
  canvasWidth = $('#canvas-width').val();
  canvasHeight = $('#canvas-height').val();
  cellWidth = $('#cell-width').val();
  cellHeight = $('#cell-height').val();
  bgColor = $('#cell-color').val();
  borderColor = $('#border-color').val(); //проверим корректность значений и если все верно запустим генерацию таблицы

  if (checkingValues(canvasWidth, canvasHeight, cellWidth, cellHeight)) {
    //рассчитываем таблицу
    var row, col;
    row = Math.floor(+canvasWidth / +cellWidth);
    col = Math.floor(+canvasHeight / +cellHeight); //добавим данные о таблице

    $('.pipTableGen__col').empty().append(col);
    $('.pipTableGen__row').empty().append(row);
    $('.pipTableGen__amount').empty().append(row * col); //Сгенерируем таблицу по парраметрам

    tableCode = tableGenerator(row, col, bgColor, borderColor, cellWidth, cellHeight);
    $('.pipTableGen__build-wrap').empty().append(tableCode); //Контейнеру в который закинем таблицу определим минимальную ширину равную ширине полотна что бы ячейки не сжимались

    $('.pipTableGen__build-wrap').css('min-width', canvasWidth + 'px'); //Активируем кнопку Скопировать

    $('.pipTableGen__copy-btn').removeAttr("disabled");
  }
} // функция в которой хранится очистка данных перед построением таблицы


function dataСleaning() {
  //очистим от инлайн стилией контейнер таблицы
  $('.pipTableGen__build-wrap').removeAttr("style"); // деактивируем кнопку Скопировать

  $('.pipTableGen__copy-btn').attr("disabled", true); //очистим значение переменной

  tableCode = '';
} //по триггеру генерируем таблицу


$('.trigger').on('click', tableResult); //копируем в буфер обмена

$('.pipTableGen__copy-btn').on('click', function () {
  navigator.clipboard.writeText(tableCode).then(function () {
    console.log('Async: Copying to clipboard was successful!');
  }, function (err) {
    console.error('Async: Could not copy text: ', err);
  });
});
jQuery(document).ready(function ($) {
  var tabs = $('.tabs');
  tabs.each(function () {
    var tab = $(this),
        tabItems = tab.find('ul.tabs__navigation'),
        tabContentWrapper = tab.children('ul.tabs__content'),
        tabNavigation = tab.find('nav');
    tabItems.on('click', 'a', function (event) {
      event.preventDefault();
      var selectedItem = $(this);

      if (!selectedItem.hasClass('selected')) {
        var selectedTab = selectedItem.data('content'),
            selectedContent = tabContentWrapper.find('li[data-content="' + selectedTab + '"]'),
            selectedContentHeight = selectedContent.innerHeight();
        tabItems.find('a.selected').removeClass('selected');
        selectedItem.addClass('selected');
        selectedContent.addClass('selected').siblings('li').removeClass('selected');
      }
    }); //hide the .tabs::after element when tabbed navigation has scrolled to the end (mobile version)

    checkScrolling(tabNavigation);
    tabNavigation.on('scroll', function () {
      checkScrolling($(this));
    });
  });
  $(window).on('resize', function () {
    tabs.each(function () {
      var tab = $(this);
      checkScrolling(tab.find('nav'));
      tab.find('.tabs__content').css('height', 'auto');
    });
  });

  function checkScrolling(tabs) {
    var totalTabWidth = parseInt(tabs.children('.tabs__navigation').width()),
        tabsViewport = parseInt(tabs.width());

    if (tabs.scrollLeft() >= totalTabWidth - tabsViewport) {
      tabs.parent('.tabs').addClass('is-ended');
    } else {
      tabs.parent('.tabs').removeClass('is-ended');
    }
  }
});
"use strict";

$(document).ready(function () {
  // Иницализация Fancybox без дополнительных кнопок
  $('[data-fancybox]').fancybox({
    buttons: ["close"]
  }); // Дополнительный класс для корневого элемента, если браузер - IE или Edge

  if (/MSIE 9/i.test(navigator.userAgent) || /MSIE 10/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) {
    document.documentElement.className += ' old-browser';
  } else if (/Edge\/\d./i.test(navigator.userAgent)) {
    document.documentElement.className += ' edge-browser';
  } // Инициализация lazy load для изображений


  $(document).ready(function () {
    $('.lazy').lazy({
      effect: "fadeIn",
      effectTime: 300,
      threshold: 500
    });
  }); // Инициализация плавного появления

  new WOW().init(); // Скрипт плавной прокрутки до якорей

  $(function () {
    $("a[href^='#']").click(function () {
      var _href = $(this).attr("href");

      $("html, body").animate({
        scrollTop: $(_href).offset().top - 70 + "px"
      });
      return false;
    });
  });
});
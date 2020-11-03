(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["MobileBridge"] = factory();
	else
		root["MobileBridge"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 666:
/***/ ((module) => {

"use strict";


var has = Object.prototype.hasOwnProperty
  , prefix = '~';

/**
 * Constructor to create a storage for our `EE` objects.
 * An `Events` instance is a plain object whose properties are event names.
 *
 * @constructor
 * @private
 */
function Events() {}

//
// We try to not inherit from `Object.prototype`. In some engines creating an
// instance in this way is faster than calling `Object.create(null)` directly.
// If `Object.create(null)` is not supported we prefix the event names with a
// character to make sure that the built-in object properties are not
// overridden or used as an attack vector.
//
if (Object.create) {
  Events.prototype = Object.create(null);

  //
  // This hack is needed because the `__proto__` property is still inherited in
  // some old browsers like Android 4, iPhone 5.1, Opera 11 and Safari 5.
  //
  if (!new Events().__proto__) prefix = false;
}

/**
 * Representation of a single event listener.
 *
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} [once=false] Specify if the listener is a one-time listener.
 * @constructor
 * @private
 */
function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

/**
 * Add a listener for a given event.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} context The context to invoke the listener with.
 * @param {Boolean} once Specify if the listener is a one-time listener.
 * @returns {EventEmitter}
 * @private
 */
function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once)
    , evt = prefix ? prefix + event : event;

  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
  else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
  else emitter._events[evt] = [emitter._events[evt], listener];

  return emitter;
}

/**
 * Clear event by name.
 *
 * @param {EventEmitter} emitter Reference to the `EventEmitter` instance.
 * @param {(String|Symbol)} evt The Event name.
 * @private
 */
function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();
  else delete emitter._events[evt];
}

/**
 * Minimal `EventEmitter` interface that is molded against the Node.js
 * `EventEmitter` interface.
 *
 * @constructor
 * @public
 */
function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

/**
 * Return an array listing the events for which the emitter has registered
 * listeners.
 *
 * @returns {Array}
 * @public
 */
EventEmitter.prototype.eventNames = function eventNames() {
  var names = []
    , events
    , name;

  if (this._eventsCount === 0) return names;

  for (name in (events = this._events)) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

/**
 * Return the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Array} The registered listeners.
 * @public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event
    , handlers = this._events[evt];

  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

/**
 * Return the number of listeners listening to a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Number} The number of listeners.
 * @public
 */
EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event
    , listeners = this._events[evt];

  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

/**
 * Calls each of the listeners registered for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @returns {Boolean} `true` if the event had listeners, else `false`.
 * @public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return false;

  var listeners = this._events[evt]
    , len = arguments.length
    , args
    , i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1: return listeners.fn.call(listeners.context), true;
      case 2: return listeners.fn.call(listeners.context, a1), true;
      case 3: return listeners.fn.call(listeners.context, a1, a2), true;
      case 4: return listeners.fn.call(listeners.context, a1, a2, a3), true;
      case 5: return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
      case 6: return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length
      , j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1: listeners[i].fn.call(listeners[i].context); break;
        case 2: listeners[i].fn.call(listeners[i].context, a1); break;
        case 3: listeners[i].fn.call(listeners[i].context, a1, a2); break;
        case 4: listeners[i].fn.call(listeners[i].context, a1, a2, a3); break;
        default:
          if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
            args[j - 1] = arguments[j];
          }

          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

/**
 * Add a listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

/**
 * Add a one-time listener for a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn The listener function.
 * @param {*} [context=this] The context to invoke the listener with.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

/**
 * Remove the listeners of a given event.
 *
 * @param {(String|Symbol)} event The event name.
 * @param {Function} fn Only remove the listeners that match this function.
 * @param {*} context Only remove the listeners that have this context.
 * @param {Boolean} once Only remove one-time listeners.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;

  if (!this._events[evt]) return this;
  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (
      listeners.fn === fn &&
      (!once || listeners.once) &&
      (!context || listeners.context === context)
    ) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (
        listeners[i].fn !== fn ||
        (once && !listeners[i].once) ||
        (context && listeners[i].context !== context)
      ) {
        events.push(listeners[i]);
      }
    }

    //
    // Reset the array, or remove it completely if we have no more listeners.
    //
    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
    else clearEvent(this, evt);
  }

  return this;
};

/**
 * Remove all listeners, or those of the specified event.
 *
 * @param {(String|Symbol)} [event] The event name.
 * @returns {EventEmitter} `this`.
 * @public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// Expose the prefix.
//
EventEmitter.prefixed = prefix;

//
// Allow `EventEmitter` to be imported as module namespace.
//
EventEmitter.EventEmitter = EventEmitter;

//
// Expose the module.
//
if (true) {
  module.exports = EventEmitter;
}


/***/ }),

/***/ 970:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to generate unique IDs. */
var idCounter = 0;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Built-in value references. */
var Symbol = root.Symbol;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString(prefix) + id;
}

module.exports = uniqueId;


/***/ }),

/***/ 4:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var EventEmitter = __webpack_require__(666);
var IframeChannel_1 = __webpack_require__(312);
var helper_1 = __webpack_require__(275);
var constant_1 = __webpack_require__(807);
var rescode_1 = __webpack_require__(803);
var NativeChannel_1 = __webpack_require__(6);
var pkg = __webpack_require__(306);
var uniqueId = __webpack_require__(970);
var MobileBridge = /** @class */ (function (_super) {
    __extends(MobileBridge, _super);
    function MobileBridge(apiDict) {
        var _this = _super.call(this) || this;
        _this.logger = window.console;
        _this.version = pkg.version;
        _this._promises = new Map();
        window[constant_1.SDK_NAME] = _this;
        _this.apiDict = apiDict ? apiDict : {};
        // 初始化信道
        if (helper_1.isIframeEnv()) {
            console.debug(constant_1.SDK_NAME + ".init: use IframeChannel");
            // 发消息
            _this._channel = new IframeChannel_1.IframeChannel();
            // 接收消息
            window.onmessage = function (event) {
                _this.logger.debug(constant_1.SDK_NAME + "-iframe-receive message, ready to handle", event);
                // 确认消息格式
                if (event.data
                    && typeof event.data === 'string'
                    && event.data.includes("\"" + constant_1.JSON_RPC_KEY + "\":\"" + constant_1.JSON_RPC_VERSION + "\"")) {
                    // todo: 收到消息后，处理消息
                    _this.response(event.data);
                }
            };
        }
        else {
            console.debug(constant_1.SDK_NAME + ".init: use NativeChannel");
            // 使用 native channel 封装 各平台的 webview postMessage 的api
            _this._channel = new NativeChannel_1.NativeChannel(constant_1.NativeSDKGlobalKey, console);
        }
        // 绑定 API_DICT 实例到 Bridge 上
        for (var _i = 0, _a = Object.keys(_this.apiDict); _i < _a.length; _i++) {
            var key = _a[_i];
            // 实例化api, 并使用 MobileBridge 作为信道，并绑定到全局
            _this[key] = new _this.apiDict[key](_this);
        }
        // 添加请求 RTT 过长警告  todo: 清理计时器
        _this._roundTripTimer = setInterval(function () {
            for (var _i = 0, _a = _this._promises.entries(); _i < _a.length; _i++) {
                var _b = _a[_i], msgId = _b[0], callbackPromise = _b[1];
                var RTT = new Date().getTime() - callbackPromise.createdAt.getTime();
                if (RTT) {
                    _this.logger.warn(constant_1.SDK_NAME + "-checking: request RTT is over " + constant_1.EXPIRE_DURATION + ", method: ", callbackPromise.method);
                }
            }
        }, constant_1.HEARTBEAT_DURATION);
        return _this;
    }
    /**
     * response 起到的是 handleRequest 的作用, 可以是内部自动调用，也可以是使用者调用
     * @param data 信道传输过来的 string 消息，期望是 IRequest 格式的 JSON_STRING
     */
    MobileBridge.prototype.response = function (data) {
        // 尝试转换为 JSON 格式消息
        var message;
        try {
            message = JSON.parse(data);
            this.logger.debug(constant_1.SDK_NAME + "-response receive:", data);
        }
        catch (err) {
            this.logger.error(constant_1.SDK_NAME + "-response parse data error.", data);
            return;
        }
        if (helper_1.isNotify(message)) {
            var id = message.id, data_1 = message.data;
            this.logger.debug(constant_1.SDK_NAME + ": receive notify", id);
            // 收到请求，使用事件机制对外暴露
            this.emit("" + constant_1.NOTIFY_PREFIX, data_1);
            return;
        }
        // 该消息为 请求类型 的消息
        if (helper_1.isRequest(message)) {
            var id = message.id, method = message.method, params = message.params;
            this.logger.debug(constant_1.SDK_NAME + ": receive request", id);
            // 收到请求，使用事件机制对外暴露
            this.emit(constant_1.NOTIFY_PREFIX + ":" + method, params);
            return;
        }
        // 该消息为 响应类型 的消息
        if (helper_1.isResponse(message)) {
            var id = message.id, errCode = message.errCode, data_2 = message.data, errMsg = message.errMsg;
            // 从请求记录中，找到请求时设定的promise处理
            var callbackPromise = this._promises.get(id);
            if (callbackPromise) {
                // 判断是否超时,给出警告
                var RTT = new Date().getTime() - callbackPromise.createdAt.getTime();
                if (RTT > constant_1.EXPIRE_DURATION) {
                    this.logger.warn(constant_1.SDK_NAME + "-response: receive response more than " + constant_1.EXPIRE_DURATION + "s");
                }
                // 移除对对应的promise
                this._promises.delete(id);
                this.logger.debug(constant_1.SDK_NAME + "-response, remove callback promise, id = " + id);
                // 执行对应的callback promise
                if (errCode === rescode_1.RES_CODE.success) {
                    this.logger.debug(constant_1.SDK_NAME + "-response: response data", data_2);
                    // 调用 reject 方法处理异常回复
                    callbackPromise.resolve.call(this, data_2);
                }
                else {
                    this.logger.debug(constant_1.SDK_NAME + "-response: received error", errMsg);
                    // 调用 resolve 方法处理正常回复
                    callbackPromise.reject.call(this, errMsg);
                }
            }
            else {
                // 发现是 response 消息，但本地没有找到 对应请求 promise 记录
                this.logger.error(constant_1.SDK_NAME + "-response, no promise for this message", message);
                return;
            }
        }
    };
    /**
     * 发送消息
     * @param payload 发送的数据体
     * @param isNotify
     */
    MobileBridge.prototype.request = function (payload, isNotify) {
        var _this = this;
        if (isNotify === void 0) { isNotify = false; }
        return new Promise(function (resolve, reject) {
            var _a;
            // 包装请求
            payload = Object.assign(payload, (_a = {
                    id: isNotify ? constant_1.NOTIFY_PREFIX : uniqueId(constant_1.SDK_NAME + "-")
                },
                _a[constant_1.JSON_RPC_KEY] = constant_1.JSON_RPC_VERSION,
                _a));
            // 若发送的不是一个 通知类型 的消息，则需要记录其处理方式
            if (!isNotify) {
                _this.logger.debug(constant_1.SDK_NAME + "-request add callback promise, id =", payload.id);
                // 使用 Map 保存请求对应的处理promise
                _this._promises.set(payload.id, {
                    resolve: resolve,
                    reject: reject,
                    method: payload.method,
                    createdAt: new Date(),
                });
            }
            _this.logger.debug(constant_1.SDK_NAME + "-request message send, payload =", payload);
            _this._channel.postMessage(payload);
        });
    };
    return MobileBridge;
}(EventEmitter));
exports.default = MobileBridge;


/***/ }),

/***/ 347:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseAPI = void 0;
var BaseAPI = /** @class */ (function () {
    function BaseAPI(bridge) {
        this._bridge = bridge;
    }
    BaseAPI.prototype._request = function (payload, isNotify) {
        if (isNotify === void 0) { isNotify = false; }
        return this._bridge.request(payload, isNotify);
    };
    return BaseAPI;
}());
exports.BaseAPI = BaseAPI;


/***/ }),

/***/ 601:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var BaseAPI_1 = __webpack_require__(347);
var TestModule = /** @class */ (function (_super) {
    __extends(TestModule, _super);
    function TestModule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TestModule.prototype.sendTestMessage = function () {
        return this._request({
            method: 'test_method',
            params: {}
        });
    };
    TestModule.prototype.getAddressFromAddressBook = function () {
        return this._request({
            method: 'getAddressFromAddressBook',
            params: {}
        });
    };
    return TestModule;
}(BaseAPI_1.BaseAPI));
exports.default = TestModule;


/***/ }),

/***/ 49:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var TestModule_1 = __webpack_require__(601);
var API = {
    testApi: TestModule_1.default
};
exports.default = API;


/***/ }),

/***/ 312:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IframeChannel = void 0;
var IframeChannel = /** @class */ (function () {
    function IframeChannel() {
    }
    IframeChannel.prototype.postMessage = function (data) {
        window.parent.postMessage(data, '*'); // 不限制接收源
    };
    return IframeChannel;
}());
exports.IframeChannel = IframeChannel;


/***/ }),

/***/ 6:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NativeChannel = void 0;
var helper_1 = __webpack_require__(275);
var constant_1 = __webpack_require__(807);
var NativeChannel = /** @class */ (function () {
    /**
     *
     * @param useChannelName 当前用于通信的信道对象，在window上的key值
     * @param logger
     */
    function NativeChannel(useChannelName, logger) {
        this.isIOS = false;
        this.isAndroid = false;
        var UAInfo = helper_1.getAllUserAgent();
        this.logger = logger;
        this.useChannelName = useChannelName;
        this.isIOS = UAInfo.ios;
        this.isAndroid = UAInfo.android;
    }
    NativeChannel.prototype.postMessage = function (data) {
        var _a, _b, _c;
        this.logger.debug(constant_1.SDK_NAME + "-NativeChannel send message", data);
        if (this.isAndroid) {
            this.logger.debug(constant_1.SDK_NAME + "-NativeChannel Android send message", data);
            var bridge = window[this.useChannelName];
            if (bridge && bridge.postMessage) {
                bridge.postMessage(data);
            }
            else {
                this.logger.error(constant_1.SDK_NAME + "-NativeChannel Android: bridge not found in window, name =", this.useChannelName);
            }
        }
        else if (this.isIOS) {
            this.logger.debug(constant_1.SDK_NAME + "-NativeChannel iOS send message", data);
            if ((_c = (_b = (_a = window.webkit) === null || _a === void 0 ? void 0 : _a.messageHandlers) === null || _b === void 0 ? void 0 : _b[this.useChannelName]) === null || _c === void 0 ? void 0 : _c.postMessage) {
                window.webkit.messageHandlers[this.useChannelName].postMessage(data);
            }
            else {
                this.logger.error(constant_1.SDK_NAME + "-NativeChannel iOS: bridge not found in messageHandlers, name =", this.useChannelName);
            }
        }
        else {
            this.logger.error(constant_1.SDK_NAME + "-NativeChannel platform not supported, userAgent = ", window.navigator.userAgent);
        }
    };
    NativeChannel.dataToString = function (data) {
        return typeof data === 'string' ? data : JSON.stringify(data);
    };
    return NativeChannel;
}());
exports.NativeChannel = NativeChannel;


/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HEARTBEAT_DURATION = exports.NOTIFY_PREFIX = exports.EXPIRE_DURATION = exports.JSON_RPC_KEY = exports.JSON_RPC_VERSION = exports.NativeSDKGlobalKey = exports.TEST_API_KEY = exports.SDK_NAME = void 0;
exports.SDK_NAME = 'MobileBridge';
exports.TEST_API_KEY = 'API_TEST';
exports.NativeSDKGlobalKey = 'MobileBridgeNative';
exports.JSON_RPC_VERSION = '2.0';
exports.JSON_RPC_KEY = 'jsonrpc';
// 通信超时时间
exports.EXPIRE_DURATION = 3000;
exports.NOTIFY_PREFIX = 'notify';
// 检测通路的时隔
exports.HEARTBEAT_DURATION = 1000;


/***/ }),

/***/ 803:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RES_CODE = void 0;
exports.RES_CODE = {
    success: 0
};


/***/ }),

/***/ 275:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAllUserAgent = exports.isIframeEnv = exports.isResponse = exports.isNotify = exports.isRequest = void 0;
var constant_1 = __webpack_require__(807);
function isRequest(msgObj) {
    var requestKeys = ['jsonrpc', 'id', 'method', 'params'];
    // 检查是否符合所有的 IRequest Key
    return requestKeys.every(function (requestKey) {
        return msgObj.hasOwnProperty(requestKey);
    });
}
exports.isRequest = isRequest;
function isNotify(msgObj) {
    var notifyKeys = ['jsonrpc', 'id', 'data'];
    // 检查是否符合所有的 IRequest Key
    var allKeys = notifyKeys.every(function (requestKey) {
        return msgObj.hasOwnProperty(requestKey);
    });
    return allKeys && msgObj.id === constant_1.NOTIFY_PREFIX;
}
exports.isNotify = isNotify;
function isResponse(msgObj) {
    var responseKeys = ['jsonrpc', 'id', 'errCode'];
    // 检查是否符合所有的 IRequest Key
    return responseKeys.every(function (requestKey) {
        return msgObj.hasOwnProperty(requestKey);
    });
}
exports.isResponse = isResponse;
function isIframeEnv() {
    return window.self !== window.top;
}
exports.isIframeEnv = isIframeEnv;
/**
 * 获取当前平台以及应用信息
 */
function getAllUserAgent() {
    var ua = window.navigator.userAgent.toLowerCase();
    return {
        // 平台UA
        android: ua.includes('android'),
        ios: ua.includes('iphone') || ua.includes('ipad'),
        windows: ua.includes('windows'),
        ubuntu: ua.includes('ubuntu'),
        mac: ua.includes('mac'),
    };
}
exports.getAllUserAgent = getAllUserAgent;


/***/ }),

/***/ 109:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
var MobileBridge_1 = __webpack_require__(4);
var constant_1 = __webpack_require__(807);
var api_1 = __webpack_require__(49);
// 绑定到全局
window[constant_1.SDK_NAME] = MobileBridge_1.default;
window[constant_1.TEST_API_KEY] = api_1.default;
exports.default = MobileBridge_1.default;


/***/ }),

/***/ 306:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse("{\"name\":\"mobile_bridge_js\",\"version\":\"0.0.4\",\"description\":\"\",\"main\":\"./dist/cjs/index.js\",\"module\":\"./dist/esm/index.js\",\"dependencies\":{\"eventemitter3\":\"^4.0.7\",\"lodash.uniqueid\":\"^4.0.1\",\"loglevel\":\"^1.7.0\",\"webpack\":\"^5.3.2\"},\"devDependencies\":{\"eventemitter3\":\"^4.0.7\",\"html-webpack-plugin\":\"^4.5.0\",\"lodash.uniqueid\":\"^4.0.1\",\"open-browser-webpack-plugin\":\"^0.0.5\",\"ts-loader\":\"^8.0.7\",\"typescript\":\"^4.0.5\",\"webpack\":\"^5.3.0\",\"webpack-bundle-analyzer\":\"^3.9.0\",\"webpack-cli\":\"^4.1.0\",\"webpack-dev-server\":\"^3.11.0\",\"webpack-merge\":\"^5.3.0\"},\"scripts\":{\"test\":\"echo \\\"Error: no test specified\\\" && exit 1\",\"build\":\"npm run build:cjs && npm run build:esm && npm run build:umd\",\"build:umd\":\"webpack --mode=production --config webpack.config.js\",\"build:cjs\":\"tsc -p tsconfig.cjs.json\",\"build:esm\":\"tsc -p tsconfig.esm.json\",\"dev:test\":\"webpack serve --mode=development --config webpack.config.js --port=1024\"},\"repository\":{\"type\":\"git\",\"url\":\"git+https://github.com/HXWfromDJTU/mobile_bridge_js.git\"},\"author\":\"\",\"license\":\"ISC\",\"bugs\":{\"url\":\"https://github.com/HXWfromDJTU/mobile_bridge_js/issues\"},\"homepage\":\"https://github.com/HXWfromDJTU/mobile_bridge_js#readme\"}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// module exports must be returned from runtime so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(109);
/******/ })()
.default;
});
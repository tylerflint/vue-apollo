import gql from 'graphql-tag';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function isDataFilled(data) {
  return Object.keys(data).length > 0;
}

var CApolloQuery = {
  name: 'ApolloQuery',
  provide: function provide() {
    return {
      getDollarApollo: this.getDollarApollo,
      getApolloQuery: this.getApolloQuery
    };
  },
  props: {
    query: {
      type: [Function, Object],
      required: true
    },
    variables: {
      type: Object,
      "default": undefined
    },
    fetchPolicy: {
      type: String,
      "default": undefined
    },
    pollInterval: {
      type: Number,
      "default": undefined
    },
    notifyOnNetworkStatusChange: {
      type: Boolean,
      "default": undefined
    },
    context: {
      type: Object,
      "default": undefined
    },
    update: {
      type: Function,
      "default": function _default(data) {
        return data;
      }
    },
    skip: {
      type: Boolean,
      "default": false
    },
    debounce: {
      type: Number,
      "default": 0
    },
    throttle: {
      type: Number,
      "default": 0
    },
    clientId: {
      type: String,
      "default": undefined
    },
    deep: {
      type: Boolean,
      "default": undefined
    },
    tag: {
      type: String,
      "default": 'div'
    },
    prefetch: {
      type: Boolean,
      "default": true
    },
    options: {
      type: Object,
      "default": function _default() {
        return {};
      }
    }
  },
  data: function data() {
    return {
      result: {
        data: null,
        loading: false,
        networkStatus: 7,
        error: null
      },
      times: 0
    };
  },
  watch: {
    fetchPolicy: function fetchPolicy(value) {
      this.$apollo.queries.query.setOptions({
        fetchPolicy: value
      });
    },
    pollInterval: function pollInterval(value) {
      this.$apollo.queries.query.setOptions({
        pollInterval: value
      });
    },
    notifyOnNetworkStatusChange: function notifyOnNetworkStatusChange(value) {
      this.$apollo.queries.query.setOptions({
        notifyOnNetworkStatusChange: value
      });
    },
    '$data.$apolloData.loading': function $data$apolloDataLoading(value) {
      this.$emit('loading', !!value);
    }
  },
  apollo: {
    $client: function $client() {
      return this.clientId;
    },
    query: function query() {
      return _objectSpread2(_objectSpread2({
        query: function query() {
          if (typeof this.query === 'function') {
            return this.query(gql);
          }

          return this.query;
        },
        variables: function variables() {
          return this.variables;
        },
        fetchPolicy: this.fetchPolicy,
        pollInterval: this.pollInterval,
        debounce: this.debounce,
        throttle: this.throttle,
        notifyOnNetworkStatusChange: this.notifyOnNetworkStatusChange,
        context: function context() {
          return this.context;
        },
        skip: function skip() {
          return this.skip;
        },
        deep: this.deep,
        prefetch: this.prefetch
      }, this.options), {}, {
        manual: true,
        result: function result(_result) {
          var _result2 = _result,
              errors = _result2.errors,
              loading = _result2.loading,
              networkStatus = _result2.networkStatus;
          var _result3 = _result,
              error = _result3.error;
          _result = Object.assign({}, _result);

          if (errors && errors.length) {
            error = new Error("Apollo errors occurred (".concat(errors.length, ")"));
            error.graphQLErrors = errors;
          }

          var data = {};

          if (loading) {
            Object.assign(data, this.$_previousData, _result.data);
          } else if (error) {
            Object.assign(data, this.$apollo.queries.query.observer.getLastResult() || {}, _result.data);
          } else {
            data = _result.data;
            this.$_previousData = _result.data;
          }

          var dataNotEmpty = isDataFilled(data);
          this.result = {
            data: dataNotEmpty ? this.update(data) : undefined,
            fullData: dataNotEmpty ? data : undefined,
            loading: loading,
            error: error,
            networkStatus: networkStatus
          };
          this.times = ++this.$_times;
          this.$emit('result', this.result);
        },
        error: function error(_error) {
          this.result.loading = false;
          this.result.error = _error;
          this.$emit('error', _error);
        }
      });
    }
  },
  created: function created() {
    this.$_times = 0;
  },
  methods: {
    getDollarApollo: function getDollarApollo() {
      return this.$apollo;
    },
    getApolloQuery: function getApolloQuery() {
      return this.$apollo.queries.query;
    }
  },
  render: function render(h) {
    var result = this.$scopedSlots["default"]({
      result: this.result,
      times: this.times,
      query: this.$apollo.queries.query,
      isLoading: this.$apolloData.loading,
      gqlError: this.result && this.result.error && this.result.error.gqlError
    });

    if (Array.isArray(result)) {
      result = result.concat(this.$slots["default"]);
    } else {
      result = [result].concat(this.$slots["default"]);
    }

    return this.tag ? h(this.tag, result) : result[0];
  }
};

var uid = 0;
var CApolloSubscribeToMore = {
  name: 'ApolloSubscribeToMore',
  inject: ['getDollarApollo', 'getApolloQuery'],
  props: {
    document: {
      type: [Function, Object],
      required: true
    },
    variables: {
      type: Object,
      "default": undefined
    },
    updateQuery: {
      type: Function,
      "default": undefined
    }
  },
  watch: {
    document: 'refresh',
    variables: 'refresh'
  },
  created: function created() {
    this.$_key = "sub_component_".concat(uid++);
  },
  mounted: function mounted() {
    this.refresh();
  },
  beforeDestroy: function beforeDestroy() {
    this.destroy();
  },
  methods: {
    destroy: function destroy() {
      if (this.$_sub) {
        this.$_sub.destroy();
      }
    },
    refresh: function refresh() {
      this.destroy();
      var document = this.document;

      if (typeof document === 'function') {
        document = document(gql);
      }

      this.$_sub = this.getDollarApollo().addSmartSubscription(this.$_key, {
        document: document,
        variables: this.variables,
        updateQuery: this.updateQuery,
        linkedQuery: this.getApolloQuery()
      });
    }
  },
  render: function render(h) {
    return null;
  }
};

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var index_umd = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
     factory(exports) ;
  })(commonjsGlobal, function (exports) {
    /* eslint-disable no-undefined,no-param-reassign,no-shadow */

    /**
     * Throttle execution of a function. Especially useful for rate limiting
     * execution of handlers on events like resize and scroll.
     *
     * @param  {number}    delay -          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
     * @param  {boolean}   [noTrailing] -   Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
     *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
     *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
     *                                    the internal counter is reset).
     * @param  {Function}  callback -       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
     *                                    to `callback` when the throttled-function is executed.
     * @param  {boolean}   [debounceMode] - If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
     *                                    schedule `callback` to execute after `delay` ms.
     *
     * @returns {Function}  A new, throttled, function.
     */

    function throttle(delay, noTrailing, callback, debounceMode) {
      /*
       * After wrapper has stopped being called, this timeout ensures that
       * `callback` is executed at the proper times in `throttle` and `end`
       * debounce modes.
       */
      var timeoutID;
      var cancelled = false; // Keep track of the last time `callback` was executed.

      var lastExec = 0; // Function to clear existing timeout

      function clearExistingTimeout() {
        if (timeoutID) {
          clearTimeout(timeoutID);
        }
      } // Function to cancel next exec


      function cancel() {
        clearExistingTimeout();
        cancelled = true;
      } // `noTrailing` defaults to falsy.


      if (typeof noTrailing !== 'boolean') {
        debounceMode = callback;
        callback = noTrailing;
        noTrailing = undefined;
      }
      /*
       * The `wrapper` function encapsulates all of the throttling / debouncing
       * functionality and when executed will limit the rate at which `callback`
       * is executed.
       */


      function wrapper() {
        for (var _len = arguments.length, arguments_ = new Array(_len), _key = 0; _key < _len; _key++) {
          arguments_[_key] = arguments[_key];
        }

        var self = this;
        var elapsed = Date.now() - lastExec;

        if (cancelled) {
          return;
        } // Execute `callback` and update the `lastExec` timestamp.


        function exec() {
          lastExec = Date.now();
          callback.apply(self, arguments_);
        }
        /*
         * If `debounceMode` is true (at begin) this is used to clear the flag
         * to allow future `callback` executions.
         */


        function clear() {
          timeoutID = undefined;
        }

        if (debounceMode && !timeoutID) {
          /*
           * Since `wrapper` is being called for the first time and
           * `debounceMode` is true (at begin), execute `callback`.
           */
          exec();
        }

        clearExistingTimeout();

        if (debounceMode === undefined && elapsed > delay) {
          /*
           * In throttle mode, if `delay` time has been exceeded, execute
           * `callback`.
           */
          exec();
        } else if (noTrailing !== true) {
          /*
           * In trailing throttle mode, since `delay` time has not been
           * exceeded, schedule `callback` to execute `delay` ms after most
           * recent execution.
           *
           * If `debounceMode` is true (at begin), schedule `clear` to execute
           * after `delay` ms.
           *
           * If `debounceMode` is false (at end), schedule `callback` to
           * execute after `delay` ms.
           */
          timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
        }
      }

      wrapper.cancel = cancel; // Return the wrapper function.

      return wrapper;
    }
    /* eslint-disable no-undefined */

    /**
     * Debounce execution of a function. Debouncing, unlike throttling,
     * guarantees that a function is only executed a single time, either at the
     * very beginning of a series of calls, or at the very end.
     *
     * @param  {number}   delay -         A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
     * @param  {boolean}  [atBegin] -     Optional, defaults to false. If atBegin is false or unspecified, callback will only be executed `delay` milliseconds
     *                                  after the last debounced-function call. If atBegin is true, callback will be executed only at the first debounced-function call.
     *                                  (After the throttled-function has not been called for `delay` milliseconds, the internal counter is reset).
     * @param  {Function} callback -      A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
     *                                  to `callback` when the debounced-function is executed.
     *
     * @returns {Function} A new, debounced function.
     */


    function debounce(delay, atBegin, callback) {
      return callback === undefined ? throttle(delay, atBegin, false) : throttle(delay, callback, atBegin !== false);
    }

    exports.debounce = debounce;
    exports.throttle = throttle;
    Object.defineProperty(exports, '__esModule', {
      value: true
    });
  });
});
unwrapExports(index_umd);

var utils = createCommonjsModule(function (module, exports) {
  var Globals = exports.Globals = {};

  function factory(action) {
    return function (cb, time) {
      return action(time, cb);
    };
  }

  exports.throttle = factory(index_umd.throttle);
  exports.debounce = factory(index_umd.debounce);

  exports.getMergedDefinition = function (def) {
    return Globals.Vue.util.mergeOptions({}, def);
  };

  exports.reapply = function (options, context) {
    while (typeof options === 'function') {
      options = options.call(context);
    }

    return options;
  };

  exports.omit = function (obj, properties) {
    return Object.entries(obj).filter(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 1),
          key = _ref2[0];

      return !properties.includes(key);
    }).reduce(function (c, _ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          val = _ref4[1];

      c[key] = val;
      return c;
    }, {});
  };

  exports.addGqlError = function (error) {
    if (error.graphQLErrors && error.graphQLErrors.length) {
      error.gqlError = error.graphQLErrors[0];
    }
  };

  exports.noop = function () {};
});
var utils_1 = utils.Globals;
var utils_2 = utils.throttle;
var utils_3 = utils.debounce;
var utils_4 = utils.getMergedDefinition;
var utils_5 = utils.reapply;
var utils_6 = utils.omit;
var utils_7 = utils.addGqlError;
var utils_8 = utils.noop;

var CApolloMutation = {
  props: {
    mutation: {
      type: [Function, Object],
      required: true
    },
    variables: {
      type: Object,
      "default": undefined
    },
    optimisticResponse: {
      type: Object,
      "default": undefined
    },
    update: {
      type: Function,
      "default": undefined
    },
    refetchQueries: {
      type: Function,
      "default": undefined
    },
    clientId: {
      type: String,
      "default": undefined
    },
    tag: {
      type: String,
      "default": 'div'
    }
  },
  data: function data() {
    return {
      loading: false,
      error: null
    };
  },
  watch: {
    loading: function loading(value) {
      this.$emit('loading', value);
    }
  },
  methods: {
    mutate: function mutate(options) {
      var _this = this;

      this.loading = true;
      this.error = null;
      var mutation = this.mutation;

      if (typeof mutation === 'function') {
        mutation = mutation(gql);
      }

      this.$apollo.mutate(_objectSpread2({
        mutation: mutation,
        client: this.clientId,
        variables: this.variables,
        optimisticResponse: this.optimisticResponse,
        update: this.update,
        refetchQueries: this.refetchQueries
      }, options)).then(function (result) {
        _this.$emit('done', result);

        _this.loading = false;
      })["catch"](function (e) {
        utils_7(e);
        _this.error = e;

        _this.$emit('error', e);

        _this.loading = false;
      });
    }
  },
  render: function render(h) {
    var result = this.$scopedSlots["default"]({
      mutate: this.mutate,
      loading: this.loading,
      error: this.error,
      gqlError: this.error && this.error.gqlError
    });

    if (Array.isArray(result)) {
      result = result.concat(this.$slots["default"]);
    } else {
      result = [result].concat(this.$slots["default"]);
    }

    return this.tag ? h(this.tag, result) : result[0];
  }
};

var plugin = {};
function install(Vue, options) {
  if (install.installed) return;
  install.installed = true;
  Vue.component('apollo-query', CApolloQuery);
  Vue.component('ApolloQuery', CApolloQuery);
  Vue.component('apollo-subscribe-to-more', CApolloSubscribeToMore);
  Vue.component('ApolloSubscribeToMore', CApolloSubscribeToMore);
  Vue.component('apollo-mutation', CApolloMutation);
  Vue.component('ApolloMutation', CApolloMutation);
}
plugin.install = install; // eslint-disable-next-line no-undef

plugin.version = "4.0.0-alpha.11"; // Apollo provider

var ApolloProvider = plugin; // Components

var ApolloQuery = CApolloQuery;
var ApolloSubscribeToMore = CApolloSubscribeToMore;
var ApolloMutation = CApolloMutation; // Auto-install

var GlobalVue = null;

if (typeof window !== 'undefined') {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
  GlobalVue = global.Vue;
}

if (GlobalVue) {
  GlobalVue.use(plugin);
}

export default plugin;
export { ApolloMutation, ApolloProvider, ApolloQuery, ApolloSubscribeToMore, install };

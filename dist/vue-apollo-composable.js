var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define("useApolloClient", ["require", "exports", "vue-demi"], function (require, exports, vue_demi_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.provideApolloClient = exports.useApolloClient = exports.ApolloClients = exports.DefaultApolloClient = void 0;
    exports.DefaultApolloClient = Symbol('default-apollo-client');
    exports.ApolloClients = Symbol('apollo-clients');
    function resolveDefaultClient(providedApolloClients, providedApolloClient) {
        var resolvedClient = providedApolloClients
            ? providedApolloClients.default
            : providedApolloClient;
        return resolvedClient;
    }
    function resolveClientWithId(providedApolloClients, clientId) {
        if (!providedApolloClients) {
            throw new Error("No apolloClients injection found, tried to resolve '" + clientId + "' clientId");
        }
        return providedApolloClients[clientId];
    }
    function useApolloClient(clientId) {
        var resolveImpl;
        if (!vue_demi_1.getCurrentInstance()) {
            resolveImpl = function () { return currentApolloClient; };
        }
        else {
            var providedApolloClients_1 = vue_demi_1.inject(exports.ApolloClients, null);
            var providedApolloClient_1 = vue_demi_1.inject(exports.DefaultApolloClient, null);
            resolveImpl = function (id) {
                if (currentApolloClient) {
                    return currentApolloClient;
                }
                else if (id) {
                    return resolveClientWithId(providedApolloClients_1, id);
                }
                return resolveDefaultClient(providedApolloClients_1, providedApolloClient_1);
            };
        }
        function resolveClient(id) {
            if (id === void 0) { id = clientId; }
            var client = resolveImpl(id);
            if (!client) {
                throw new Error("Apollo client with id " + (id || 'default') + " not found. Use provideApolloClient() if you are outside of a component setup.");
            }
            return client;
        }
        return {
            resolveClient: resolveClient,
            get client() {
                return resolveClient();
            },
        };
    }
    exports.useApolloClient = useApolloClient;
    var currentApolloClient;
    function provideApolloClient(client) {
        currentApolloClient = client;
        return function (fn) {
            var result = fn();
            currentApolloClient = null;
            return result;
        };
    }
    exports.provideApolloClient = provideApolloClient;
});
define("util/ReactiveFunction", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("util/paramToRef", ["require", "exports", "vue-demi"], function (require, exports, vue_demi_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.paramToRef = void 0;
    function paramToRef(param) {
        if (vue_demi_2.isRef(param)) {
            return param;
        }
        else if (typeof param === 'function') {
            return vue_demi_2.computed(param);
        }
        else {
            return vue_demi_2.ref(param);
        }
    }
    exports.paramToRef = paramToRef;
});
define("util/paramToReactive", ["require", "exports", "vue-demi"], function (require, exports, vue_demi_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.paramToReactive = void 0;
    function paramToReactive(param) {
        if (vue_demi_3.isRef(param)) {
            return param;
        }
        else if (typeof param === 'function') {
            return vue_demi_3.computed(param);
        }
        else if (param) {
            return vue_demi_3.reactive(param);
        }
        else {
            return param;
        }
    }
    exports.paramToReactive = paramToReactive;
});
define("util/useEventHook", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useEventHook = void 0;
    function useEventHook() {
        var fns = [];
        function on(fn) {
            fns.push(fn);
            return {
                off: function () { return off(fn); },
            };
        }
        function off(fn) {
            var index = fns.indexOf(fn);
            if (index !== -1) {
                fns.splice(index, 1);
            }
        }
        function trigger(param) {
            for (var _i = 0, fns_1 = fns; _i < fns_1.length; _i++) {
                var fn = fns_1[_i];
                fn(param);
            }
        }
        return {
            on: on,
            off: off,
            trigger: trigger,
        };
    }
    exports.useEventHook = useEventHook;
});
define("util/loadingTracking", ["require", "exports", "vue-demi"], function (require, exports, vue_demi_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.trackSubscription = exports.trackMutation = exports.trackQuery = exports.getCurrentTracking = exports.getAppTracking = void 0;
    function getAppTracking() {
        var vm = vue_demi_4.getCurrentInstance();
        var root = vm.$root || vm.root;
        var appTracking;
        if (!root._apolloAppTracking) {
            // Add per Vue tracking
            appTracking = root._apolloAppTracking = {
                queries: vue_demi_4.ref(0),
                mutations: vue_demi_4.ref(0),
                subscriptions: vue_demi_4.ref(0),
                components: new Map(),
            };
        }
        else {
            appTracking = root._apolloAppTracking;
        }
        return {
            appTracking: appTracking,
        };
    }
    exports.getAppTracking = getAppTracking;
    function getCurrentTracking() {
        var vm = vue_demi_4.getCurrentInstance();
        if (!vm) {
            throw new Error('getCurrentTracking must be used during a component setup');
        }
        var appTracking = getAppTracking().appTracking;
        var tracking;
        if (!appTracking.components.has(vm)) {
            // Add per-component tracking
            appTracking.components.set(vm, tracking = {
                queries: vue_demi_4.ref(0),
                mutations: vue_demi_4.ref(0),
                subscriptions: vue_demi_4.ref(0),
            });
            // Cleanup
            vue_demi_4.onUnmounted(function () {
                appTracking.components.delete(vm);
            });
        }
        else {
            tracking = appTracking.components.get(vm);
        }
        return {
            appTracking: appTracking,
            tracking: tracking,
        };
    }
    exports.getCurrentTracking = getCurrentTracking;
    function track(loading, type) {
        var _a = getCurrentTracking(), appTracking = _a.appTracking, tracking = _a.tracking;
        vue_demi_4.watch(loading, function (value, oldValue) {
            if (oldValue != null && value !== oldValue) {
                var mod = value ? 1 : -1;
                tracking[type].value += mod;
                appTracking[type].value += mod;
            }
        }, {
            immediate: true,
        });
        vue_demi_4.onBeforeUnmount(function () {
            if (loading.value) {
                tracking[type].value--;
                appTracking[type].value--;
            }
        });
    }
    function trackQuery(loading) {
        track(loading, 'queries');
    }
    exports.trackQuery = trackQuery;
    function trackMutation(loading) {
        track(loading, 'mutations');
    }
    exports.trackMutation = trackMutation;
    function trackSubscription(loading) {
        track(loading, 'subscriptions');
    }
    exports.trackSubscription = trackSubscription;
});
define("useQuery", ["require", "exports", "vue-demi", "throttle-debounce", "useApolloClient", "util/paramToRef", "util/paramToReactive", "util/useEventHook", "util/loadingTracking"], function (require, exports, vue_demi_5, throttle_debounce_1, useApolloClient_1, paramToRef_1, paramToReactive_1, useEventHook_1, loadingTracking_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useQueryImpl = exports.useQuery = void 0;
    function useQuery(document, variables, options) {
        return useQueryImpl(document, variables, options);
    }
    exports.useQuery = useQuery;
    function useQueryImpl(document, variables, options, lazy) {
        if (lazy === void 0) { lazy = false; }
        // Is on server?
        var vm = vue_demi_5.getCurrentInstance();
        var isServer = vm === null || vm === void 0 ? void 0 : vm.$isServer;
        if (variables == null)
            variables = vue_demi_5.ref();
        if (options == null)
            options = {};
        var documentRef = paramToRef_1.paramToRef(document);
        var variablesRef = paramToRef_1.paramToRef(variables);
        var optionsRef = paramToReactive_1.paramToReactive(options);
        // Result
        /**
         * Result from the query
         */
        var result = vue_demi_5.ref();
        var resultEvent = useEventHook_1.useEventHook();
        var error = vue_demi_5.ref(null);
        var errorEvent = useEventHook_1.useEventHook();
        // Loading
        /**
         * Indicates if a network request is pending
         */
        var loading = vue_demi_5.ref(false);
        vm && loadingTracking_1.trackQuery(loading);
        var networkStatus = vue_demi_5.ref();
        // SSR
        var firstResolve;
        var firstReject;
        // Apollo Client
        var resolveClient = useApolloClient_1.useApolloClient().resolveClient;
        // Query
        var query = vue_demi_5.ref();
        var observer;
        var started = false;
        /**
         * Starts watching the query
         */
        function start() {
            if (started || !isEnabled.value ||
                (isServer && currentOptions.value.prefetch === false)) {
                if (firstResolve)
                    firstResolve();
                return;
            }
            started = true;
            loading.value = true;
            var client = resolveClient(currentOptions.value.clientId);
            query.value = client.watchQuery(__assign(__assign({ query: currentDocument, variables: currentVariables }, currentOptions.value), isServer ? {
                fetchPolicy: 'network-only',
            } : {}));
            startQuerySubscription();
            if (!isServer && (currentOptions.value.fetchPolicy !== 'no-cache' || currentOptions.value.notifyOnNetworkStatusChange)) {
                var currentResult = query.value.getCurrentResult();
                if (!currentResult.loading || currentOptions.value.notifyOnNetworkStatusChange) {
                    onNextResult(currentResult);
                }
            }
            if (!isServer) {
                for (var _i = 0, subscribeToMoreItems_1 = subscribeToMoreItems; _i < subscribeToMoreItems_1.length; _i++) {
                    var item = subscribeToMoreItems_1[_i];
                    addSubscribeToMore(item);
                }
            }
        }
        function startQuerySubscription() {
            if (observer && !observer.closed)
                return;
            if (!query.value)
                return;
            // Create subscription
            observer = query.value.subscribe({
                next: onNextResult,
                error: onError,
            });
        }
        function onNextResult(queryResult) {
            var _a;
            processNextResult(queryResult);
            // Result errors
            // This is set when `errorPolicy` is `all`
            if ((_a = queryResult.errors) === null || _a === void 0 ? void 0 : _a.length) {
                var e = new Error("GraphQL error: " + queryResult.errors.map(function (e) { return e.message; }).join(' | '));
                Object.assign(e, {
                    graphQLErrors: queryResult.errors,
                    networkError: null,
                });
                processError(e);
            }
            else {
                if (firstResolve) {
                    firstResolve();
                    stop();
                }
            }
        }
        function processNextResult(queryResult) {
            result.value = queryResult.data && Object.keys(queryResult.data).length === 0 ? null : queryResult.data;
            loading.value = queryResult.loading;
            networkStatus.value = queryResult.networkStatus;
            resultEvent.trigger(queryResult);
        }
        function onError(queryError) {
            processNextResult(query.value.getCurrentResult());
            processError(queryError);
            if (firstReject) {
                firstReject(queryError);
                stop();
            }
            // The observable closes the sub if an error occurs
            resubscribeToQuery();
        }
        function processError(queryError) {
            error.value = queryError;
            loading.value = false;
            networkStatus.value = 8;
            errorEvent.trigger(queryError);
        }
        function resubscribeToQuery() {
            if (!query.value)
                return;
            var lastError = query.value.getLastError();
            var lastResult = query.value.getLastResult();
            query.value.resetLastResults();
            startQuerySubscription();
            Object.assign(query.value, { lastError: lastError, lastResult: lastResult });
        }
        var onStopHandlers = [];
        /**
         * Stop watching the query
         */
        function stop() {
            if (firstResolve)
                firstResolve();
            if (!started)
                return;
            started = false;
            loading.value = false;
            onStopHandlers.forEach(function (handler) { return handler(); });
            onStopHandlers = [];
            if (query.value) {
                query.value.stopPolling();
                query.value = null;
            }
            if (observer) {
                observer.unsubscribe();
                observer = null;
            }
        }
        // Restart
        var restarting = false;
        /**
         * Queue a restart of the query (on next tick) if it is already active
         */
        function baseRestart() {
            if (!started || restarting)
                return;
            restarting = true;
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            vue_demi_5.nextTick(function () {
                if (started) {
                    stop();
                    start();
                }
                restarting = false;
            });
        }
        var debouncedRestart;
        var isRestartDebounceSetup = false;
        function updateRestartFn() {
            // On server, will be called before currentOptions is initialized
            // @TODO investigate
            if (!currentOptions) {
                debouncedRestart = baseRestart;
            }
            else {
                if (currentOptions.value.throttle) {
                    debouncedRestart = throttle_debounce_1.throttle(currentOptions.value.throttle, baseRestart);
                }
                else if (currentOptions.value.debounce) {
                    debouncedRestart = throttle_debounce_1.debounce(currentOptions.value.debounce, baseRestart);
                }
                else {
                    debouncedRestart = baseRestart;
                }
                isRestartDebounceSetup = true;
            }
        }
        function restart() {
            if (!isRestartDebounceSetup)
                updateRestartFn();
            debouncedRestart();
        }
        // Applying document
        var currentDocument;
        vue_demi_5.watch(documentRef, function (value) {
            currentDocument = value;
            restart();
        }, {
            immediate: true,
        });
        // Applying variables
        var currentVariables;
        var currentVariablesSerialized;
        vue_demi_5.watch(variablesRef, function (value, oldValue) {
            var serialized = JSON.stringify(value);
            if (serialized !== currentVariablesSerialized) {
                currentVariables = value;
                restart();
            }
            currentVariablesSerialized = serialized;
        }, {
            deep: true,
            immediate: true,
        });
        // Applying options
        var currentOptions = vue_demi_5.ref();
        vue_demi_5.watch(function () { return vue_demi_5.isRef(optionsRef) ? optionsRef.value : optionsRef; }, function (value) {
            if (currentOptions.value && (currentOptions.value.throttle !== value.throttle ||
                currentOptions.value.debounce !== value.debounce)) {
                updateRestartFn();
            }
            currentOptions.value = value;
            restart();
        }, {
            deep: true,
            immediate: true,
        });
        // Fefetch
        function refetch(variables) {
            if (variables === void 0) { variables = null; }
            if (query.value) {
                if (variables) {
                    currentVariables = variables;
                }
                return query.value.refetch(variables);
            }
        }
        // Fetch more
        function fetchMore(options) {
            if (query.value) {
                return query.value.fetchMore(options);
            }
        }
        // Subscribe to more
        var subscribeToMoreItems = [];
        function subscribeToMore(options) {
            if (isServer)
                return;
            var optionsRef = paramToRef_1.paramToRef(options);
            vue_demi_5.watch(optionsRef, function (value, oldValue, onCleanup) {
                var index = subscribeToMoreItems.findIndex(function (item) { return item.options === oldValue; });
                if (index !== -1) {
                    subscribeToMoreItems.splice(index, 1);
                }
                var item = {
                    options: value,
                    unsubscribeFns: [],
                };
                subscribeToMoreItems.push(item);
                addSubscribeToMore(item);
                onCleanup(function () {
                    item.unsubscribeFns.forEach(function (fn) { return fn(); });
                    item.unsubscribeFns = [];
                });
            }, {
                immediate: true,
            });
        }
        function addSubscribeToMore(item) {
            if (!started)
                return;
            var unsubscribe = query.value.subscribeToMore(item.options);
            onStopHandlers.push(unsubscribe);
            item.unsubscribeFns.push(unsubscribe);
        }
        // Enabled state
        var forceDisabled = vue_demi_5.ref(lazy);
        var enabledOption = vue_demi_5.computed(function () { return !currentOptions.value || currentOptions.value.enabled == null || currentOptions.value.enabled; });
        var isEnabled = vue_demi_5.computed(function () { return enabledOption.value && !forceDisabled.value; });
        // Auto start & stop
        vue_demi_5.watch(isEnabled, function (value) {
            if (value) {
                start();
            }
            else {
                stop();
            }
        }, {
            immediate: true,
        });
        // Teardown
        vm && vue_demi_5.onBeforeUnmount(function () {
            stop();
            subscribeToMoreItems.length = 0;
        });
        return {
            result: result,
            loading: loading,
            networkStatus: networkStatus,
            error: error,
            start: start,
            stop: stop,
            restart: restart,
            forceDisabled: forceDisabled,
            document: documentRef,
            variables: variablesRef,
            options: optionsRef,
            query: query,
            refetch: refetch,
            fetchMore: fetchMore,
            subscribeToMore: subscribeToMore,
            onResult: resultEvent.on,
            onError: errorEvent.on,
        };
    }
    exports.useQueryImpl = useQueryImpl;
});
define("useLazyQuery", ["require", "exports", "vue-demi", "useQuery"], function (require, exports, vue_demi_6, useQuery_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useLazyQuery = void 0;
    function useLazyQuery(document, variables, options) {
        var query = useQuery_1.useQueryImpl(document, variables, options, true);
        function load(document, variables, options) {
            if (document) {
                query.document.value = document;
            }
            if (variables) {
                query.variables.value = variables;
            }
            if (options) {
                Object.assign(vue_demi_6.isRef(query.options) ? query.options.value : query.options, options);
            }
            query.forceDisabled.value = false;
        }
        return __assign(__assign({}, query), { load: load });
    }
    exports.useLazyQuery = useLazyQuery;
});
define("useMutation", ["require", "exports", "vue-demi", "useApolloClient", "util/useEventHook", "util/loadingTracking"], function (require, exports, vue_demi_7, useApolloClient_2, useEventHook_2, loadingTracking_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useMutation = void 0;
    ;
    function useMutation(document, options) {
        if (!options)
            options = {};
        var loading = vue_demi_7.ref(false);
        loadingTracking_2.trackMutation(loading);
        var error = vue_demi_7.ref(null);
        var called = vue_demi_7.ref(false);
        var doneEvent = useEventHook_2.useEventHook();
        var errorEvent = useEventHook_2.useEventHook();
        // Apollo Client
        var resolveClient = useApolloClient_2.useApolloClient().resolveClient;
        function mutate(variables, overrideOptions) {
            if (overrideOptions === void 0) { overrideOptions = {}; }
            return __awaiter(this, void 0, void 0, function () {
                var currentDocument, currentOptions, client, result, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (typeof document === 'function') {
                                currentDocument = document();
                            }
                            else if (vue_demi_7.isRef(document)) {
                                currentDocument = document.value;
                            }
                            else {
                                currentDocument = document;
                            }
                            if (typeof options === 'function') {
                                currentOptions = options();
                            }
                            else if (vue_demi_7.isRef(options)) {
                                currentOptions = options.value;
                            }
                            else {
                                currentOptions = options;
                            }
                            client = resolveClient(currentOptions.clientId);
                            error.value = null;
                            loading.value = true;
                            called.value = true;
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, client.mutate(__assign(__assign(__assign({ mutation: currentDocument }, currentOptions), overrideOptions), { variables: __assign(__assign({}, currentOptions.variables || {}), variables || {}) }))];
                        case 2:
                            result = _a.sent();
                            loading.value = false;
                            doneEvent.trigger(result);
                            return [2 /*return*/, result];
                        case 3:
                            e_1 = _a.sent();
                            error.value = e_1;
                            loading.value = false;
                            errorEvent.trigger(e_1);
                            throw e_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        }
        vue_demi_7.onBeforeUnmount(function () {
            loading.value = false;
        });
        return {
            mutate: mutate,
            loading: loading,
            error: error,
            called: called,
            onDone: doneEvent.on,
            onError: errorEvent.on,
        };
    }
    exports.useMutation = useMutation;
});
define("useSubscription", ["require", "exports", "vue-demi", "throttle-debounce", "util/paramToRef", "util/paramToReactive", "useApolloClient", "util/useEventHook", "util/loadingTracking"], function (require, exports, vue_demi_8, throttle_debounce_2, paramToRef_2, paramToReactive_2, useApolloClient_3, useEventHook_3, loadingTracking_3) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useSubscription = void 0;
    function useSubscription(document, variables, options) {
        if (variables === void 0) { variables = null; }
        if (options === void 0) { options = null; }
        // Is on server?
        var vm = vue_demi_8.getCurrentInstance();
        var isServer = vm === null || vm === void 0 ? void 0 : vm.$isServer;
        if (variables == null)
            variables = vue_demi_8.ref();
        if (!options)
            options = {};
        var documentRef = paramToRef_2.paramToRef(document);
        var variablesRef = paramToRef_2.paramToRef(variables);
        var optionsRef = paramToReactive_2.paramToReactive(options);
        var result = vue_demi_8.ref();
        var resultEvent = useEventHook_3.useEventHook();
        var error = vue_demi_8.ref(null);
        var errorEvent = useEventHook_3.useEventHook();
        var loading = vue_demi_8.ref(false);
        loadingTracking_3.trackSubscription(loading);
        // Apollo Client
        var resolveClient = useApolloClient_3.useApolloClient().resolveClient;
        var subscription = vue_demi_8.ref();
        var observer;
        var started = false;
        function start() {
            if (started || !isEnabled.value || isServer)
                return;
            started = true;
            loading.value = true;
            var client = resolveClient(currentOptions.value.clientId);
            subscription.value = client.subscribe(__assign({ query: currentDocument, variables: currentVariables }, currentOptions.value));
            observer = subscription.value.subscribe({
                next: onNextResult,
                error: onError,
            });
        }
        function onNextResult(fetchResult) {
            result.value = fetchResult.data;
            loading.value = false;
            resultEvent.trigger(fetchResult);
        }
        function onError(fetchError) {
            error.value = fetchError;
            loading.value = false;
            errorEvent.trigger(fetchError);
        }
        function stop() {
            if (!started)
                return;
            started = false;
            loading.value = false;
            if (subscription.value) {
                subscription.value = null;
            }
            if (observer) {
                observer.unsubscribe();
                observer = null;
            }
        }
        // Restart
        var restarting = false;
        /**
         * Queue a restart of the query (on next tick) if it is already active
         */
        function baseRestart() {
            if (!started || restarting)
                return;
            restarting = true;
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            vue_demi_8.nextTick(function () {
                if (started) {
                    stop();
                    start();
                }
                restarting = false;
            });
        }
        var debouncedRestart;
        function updateRestartFn() {
            if (currentOptions.value.throttle) {
                debouncedRestart = throttle_debounce_2.throttle(currentOptions.value.throttle, baseRestart);
            }
            else if (currentOptions.value.debounce) {
                debouncedRestart = throttle_debounce_2.debounce(currentOptions.value.debounce, baseRestart);
            }
            else {
                debouncedRestart = baseRestart;
            }
        }
        function restart() {
            if (!debouncedRestart)
                updateRestartFn();
            debouncedRestart();
        }
        // Applying options
        var currentOptions = vue_demi_8.ref();
        vue_demi_8.watch(function () { return vue_demi_8.isRef(optionsRef) ? optionsRef.value : optionsRef; }, function (value) {
            if (currentOptions.value && (currentOptions.value.throttle !== value.throttle ||
                currentOptions.value.debounce !== value.debounce)) {
                updateRestartFn();
            }
            currentOptions.value = value;
            restart();
        }, {
            deep: true,
            immediate: true,
        });
        // Applying document
        var currentDocument;
        vue_demi_8.watch(documentRef, function (value) {
            currentDocument = value;
            restart();
        }, {
            immediate: true,
        });
        // Applying variables
        var currentVariables;
        var currentVariablesSerialized;
        vue_demi_8.watch(variablesRef, function (value, oldValue) {
            var serialized = JSON.stringify(value);
            if (serialized !== currentVariablesSerialized) {
                currentVariables = value;
                restart();
            }
            currentVariablesSerialized = serialized;
        }, {
            deep: true,
            immediate: true,
        });
        // Internal enabled returned to user
        // @TODO Doesn't fully work yet, need to initialize with option
        // const enabled = ref<boolean>()
        var enabledOption = vue_demi_8.computed(function () { return !currentOptions.value || currentOptions.value.enabled == null || currentOptions.value.enabled; });
        // const isEnabled = computed(() => !!((typeof enabled.value === 'boolean' && enabled.value) && enabledOption.value))
        var isEnabled = enabledOption;
        // watch(enabled, value => {
        //   if (value == null) {
        //     enabled.value = enabledOption.value
        //   }
        // })
        // Auto start & stop
        vue_demi_8.watch(isEnabled, function (value) {
            if (value) {
                start();
            }
            else {
                stop();
            }
        }, {
            immediate: true,
        });
        // Teardown
        vue_demi_8.onBeforeUnmount(stop);
        return {
            result: result,
            loading: loading,
            error: error,
            // @TODO doesn't fully work yet
            // enabled,
            start: start,
            stop: stop,
            restart: restart,
            document: documentRef,
            variables: variablesRef,
            options: optionsRef,
            subscription: subscription,
            onResult: resultEvent.on,
            onError: errorEvent.on,
        };
    }
    exports.useSubscription = useSubscription;
});
define("util/ExtractSingleKey", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("useResult", ["require", "exports", "vue-demi"], function (require, exports, vue_demi_9) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useResult = void 0;
    function useResult(result, defaultValue, pick) {
        return vue_demi_9.computed(function () {
            var value = result.value;
            if (value) {
                if (pick) {
                    try {
                        return pick(value);
                    }
                    catch (e) {
                        // Silent error
                    }
                }
                else {
                    var keys = Object.keys(value);
                    if (keys.length === 1) {
                        // Automatically take the only key in result data
                        return value[keys[0]];
                    }
                    else {
                        // Return entire result data
                        return value;
                    }
                }
            }
            return defaultValue;
        });
    }
    exports.useResult = useResult;
});
define("useLoading", ["require", "exports", "util/loadingTracking", "vue-demi"], function (require, exports, loadingTracking_4, vue_demi_10) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.useGlobalSubscriptionLoading = exports.useGlobalMutationLoading = exports.useGlobalQueryLoading = exports.useSubscriptionLoading = exports.useMutationLoading = exports.useQueryLoading = void 0;
    function useQueryLoading() {
        var tracking = loadingTracking_4.getCurrentTracking().tracking;
        return vue_demi_10.computed(function () { return tracking.queries.value > 0; });
    }
    exports.useQueryLoading = useQueryLoading;
    function useMutationLoading() {
        var tracking = loadingTracking_4.getCurrentTracking().tracking;
        return vue_demi_10.computed(function () { return tracking.mutations.value > 0; });
    }
    exports.useMutationLoading = useMutationLoading;
    function useSubscriptionLoading() {
        var tracking = loadingTracking_4.getCurrentTracking().tracking;
        return vue_demi_10.computed(function () { return tracking.subscriptions.value > 0; });
    }
    exports.useSubscriptionLoading = useSubscriptionLoading;
    function useGlobalQueryLoading() {
        var appTracking = loadingTracking_4.getAppTracking().appTracking;
        return vue_demi_10.computed(function () { return appTracking.queries.value > 0; });
    }
    exports.useGlobalQueryLoading = useGlobalQueryLoading;
    function useGlobalMutationLoading() {
        var appTracking = loadingTracking_4.getAppTracking().appTracking;
        return vue_demi_10.computed(function () { return appTracking.mutations.value > 0; });
    }
    exports.useGlobalMutationLoading = useGlobalMutationLoading;
    function useGlobalSubscriptionLoading() {
        var appTracking = loadingTracking_4.getAppTracking().appTracking;
        return vue_demi_10.computed(function () { return appTracking.subscriptions.value > 0; });
    }
    exports.useGlobalSubscriptionLoading = useGlobalSubscriptionLoading;
});
define("index", ["require", "exports", "useQuery", "useLazyQuery", "useMutation", "useSubscription", "useResult", "useLoading", "useApolloClient"], function (require, exports, useQuery_2, useLazyQuery_1, useMutation_1, useSubscription_1, useResult_1, useLoading_1, useApolloClient_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.provideApolloClient = exports.useApolloClient = exports.ApolloClients = exports.DefaultApolloClient = exports.useGlobalSubscriptionLoading = exports.useSubscriptionLoading = exports.useGlobalMutationLoading = exports.useMutationLoading = exports.useGlobalQueryLoading = exports.useQueryLoading = exports.useResult = exports.useSubscription = exports.useMutation = exports.useLazyQuery = exports.useQuery = void 0;
    Object.defineProperty(exports, "useQuery", { enumerable: true, get: function () { return useQuery_2.useQuery; } });
    Object.defineProperty(exports, "useLazyQuery", { enumerable: true, get: function () { return useLazyQuery_1.useLazyQuery; } });
    Object.defineProperty(exports, "useMutation", { enumerable: true, get: function () { return useMutation_1.useMutation; } });
    Object.defineProperty(exports, "useSubscription", { enumerable: true, get: function () { return useSubscription_1.useSubscription; } });
    Object.defineProperty(exports, "useResult", { enumerable: true, get: function () { return useResult_1.useResult; } });
    Object.defineProperty(exports, "useQueryLoading", { enumerable: true, get: function () { return useLoading_1.useQueryLoading; } });
    Object.defineProperty(exports, "useGlobalQueryLoading", { enumerable: true, get: function () { return useLoading_1.useGlobalQueryLoading; } });
    Object.defineProperty(exports, "useMutationLoading", { enumerable: true, get: function () { return useLoading_1.useMutationLoading; } });
    Object.defineProperty(exports, "useGlobalMutationLoading", { enumerable: true, get: function () { return useLoading_1.useGlobalMutationLoading; } });
    Object.defineProperty(exports, "useSubscriptionLoading", { enumerable: true, get: function () { return useLoading_1.useSubscriptionLoading; } });
    Object.defineProperty(exports, "useGlobalSubscriptionLoading", { enumerable: true, get: function () { return useLoading_1.useGlobalSubscriptionLoading; } });
    Object.defineProperty(exports, "DefaultApolloClient", { enumerable: true, get: function () { return useApolloClient_4.DefaultApolloClient; } });
    Object.defineProperty(exports, "ApolloClients", { enumerable: true, get: function () { return useApolloClient_4.ApolloClients; } });
    Object.defineProperty(exports, "useApolloClient", { enumerable: true, get: function () { return useApolloClient_4.useApolloClient; } });
    Object.defineProperty(exports, "provideApolloClient", { enumerable: true, get: function () { return useApolloClient_4.provideApolloClient; } });
});
//# sourceMappingURL=vue-apollo-composable.js.map
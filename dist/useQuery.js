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
import { ref, isRef, computed, watch, getCurrentInstance, onBeforeUnmount, nextTick, } from 'vue-demi';
import { throttle, debounce } from 'throttle-debounce';
import { useApolloClient } from './useApolloClient';
import { paramToRef } from './util/paramToRef';
import { paramToReactive } from './util/paramToReactive';
import { useEventHook } from './util/useEventHook';
import { trackQuery } from './util/loadingTracking';
export function useQuery(document, variables, options) {
    return useQueryImpl(document, variables, options);
}
export function useQueryImpl(document, variables, options, lazy) {
    if (lazy === void 0) { lazy = false; }
    // Is on server?
    var vm = getCurrentInstance();
    var isServer = vm === null || vm === void 0 ? void 0 : vm.$isServer;
    if (variables == null)
        variables = ref();
    if (options == null)
        options = {};
    var documentRef = paramToRef(document);
    var variablesRef = paramToRef(variables);
    var optionsRef = paramToReactive(options);
    // Result
    /**
     * Result from the query
     */
    var result = ref();
    var resultEvent = useEventHook();
    var error = ref(null);
    var errorEvent = useEventHook();
    // Loading
    /**
     * Indicates if a network request is pending
     */
    var loading = ref(false);
    vm && trackQuery(loading);
    var networkStatus = ref();
    // SSR
    var firstResolve;
    var firstReject;
    // Apollo Client
    var resolveClient = useApolloClient().resolveClient;
    // Query
    var query = ref();
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
        nextTick(function () {
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
                debouncedRestart = throttle(currentOptions.value.throttle, baseRestart);
            }
            else if (currentOptions.value.debounce) {
                debouncedRestart = debounce(currentOptions.value.debounce, baseRestart);
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
    watch(documentRef, function (value) {
        currentDocument = value;
        restart();
    }, {
        immediate: true,
    });
    // Applying variables
    var currentVariables;
    var currentVariablesSerialized;
    watch(variablesRef, function (value, oldValue) {
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
    var currentOptions = ref();
    watch(function () { return isRef(optionsRef) ? optionsRef.value : optionsRef; }, function (value) {
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
        var optionsRef = paramToRef(options);
        watch(optionsRef, function (value, oldValue, onCleanup) {
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
    var forceDisabled = ref(lazy);
    var enabledOption = computed(function () { return !currentOptions.value || currentOptions.value.enabled == null || currentOptions.value.enabled; });
    var isEnabled = computed(function () { return enabledOption.value && !forceDisabled.value; });
    // Auto start & stop
    watch(isEnabled, function (value) {
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
    vm && onBeforeUnmount(function () {
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
//# sourceMappingURL=useQuery.js.map
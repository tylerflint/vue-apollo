// src/useQuery.ts
import {
  ref as ref3,
  isRef as isRef3,
  computed as computed3,
  watch as watch2,
  onServerPrefetch,
  getCurrentInstance as getCurrentInstance3,
  onBeforeUnmount as onBeforeUnmount2,
  nextTick
} from "vue-demi";
import {throttle, debounce} from "throttle-debounce";

// src/useApolloClient.ts
import {getCurrentInstance, inject} from "vue-demi";
var DefaultApolloClient = Symbol("default-apollo-client");
var ApolloClients = Symbol("apollo-clients");
function resolveDefaultClient(providedApolloClients, providedApolloClient) {
  const resolvedClient = providedApolloClients ? providedApolloClients.default : providedApolloClient ?? void 0;
  return resolvedClient;
}
function resolveClientWithId(providedApolloClients, clientId) {
  if (!providedApolloClients) {
    throw new Error(`No apolloClients injection found, tried to resolve '${clientId}' clientId`);
  }
  return providedApolloClients[clientId];
}
function useApolloClient(clientId) {
  let resolveImpl;
  if (!getCurrentInstance()) {
    resolveImpl = () => currentApolloClient;
  } else {
    const providedApolloClients = inject(ApolloClients, null);
    const providedApolloClient = inject(DefaultApolloClient, null);
    resolveImpl = (id) => {
      if (currentApolloClient) {
        return currentApolloClient;
      } else if (id) {
        return resolveClientWithId(providedApolloClients, id);
      }
      return resolveDefaultClient(providedApolloClients, providedApolloClient);
    };
  }
  function resolveClient(id = clientId) {
    const client = resolveImpl(id);
    if (!client) {
      throw new Error(`Apollo client with id ${id ?? "default"} not found. Use provideApolloClient() if you are outside of a component setup.`);
    }
    return client;
  }
  return {
    resolveClient,
    get client() {
      return resolveClient();
    }
  };
}
var currentApolloClient;
function provideApolloClient(client) {
  currentApolloClient = client;
  return function(fn) {
    const result = fn();
    currentApolloClient = void 0;
    return result;
  };
}

// src/util/paramToRef.ts
import {isRef, computed, ref} from "vue-demi";
function paramToRef(param) {
  if (isRef(param)) {
    return param;
  } else if (typeof param === "function") {
    return computed(param);
  } else {
    return ref(param);
  }
}

// src/util/paramToReactive.ts
import {isRef as isRef2, reactive, computed as computed2} from "vue-demi";
function paramToReactive(param) {
  if (isRef2(param)) {
    return param;
  } else if (typeof param === "function") {
    return computed2(param);
  } else if (param) {
    return reactive(param);
  } else {
    return param;
  }
}

// src/util/useEventHook.ts
function useEventHook() {
  const fns = [];
  function on(fn) {
    fns.push(fn);
    return {
      off: () => off(fn)
    };
  }
  function off(fn) {
    const index = fns.indexOf(fn);
    if (index !== -1) {
      fns.splice(index, 1);
    }
  }
  function trigger(param) {
    for (const fn of fns) {
      fn(param);
    }
  }
  return {
    on,
    off,
    trigger
  };
}

// src/util/loadingTracking.ts
import {watch, onUnmounted, ref as ref2, getCurrentInstance as getCurrentInstance2, onBeforeUnmount} from "vue-demi";
function getAppTracking() {
  const vm = getCurrentInstance2();
  const root = vm?.$root ?? vm?.root;
  if (!root) {
    throw new Error("Instance $root not found");
  }
  let appTracking;
  if (!root._apolloAppTracking) {
    appTracking = root._apolloAppTracking = {
      queries: ref2(0),
      mutations: ref2(0),
      subscriptions: ref2(0),
      components: new Map()
    };
  } else {
    appTracking = root._apolloAppTracking;
  }
  return {
    appTracking
  };
}
function getCurrentTracking() {
  const vm = getCurrentInstance2();
  if (!vm) {
    throw new Error("getCurrentTracking must be used during a component setup");
  }
  const {appTracking} = getAppTracking();
  let tracking;
  if (!appTracking.components.has(vm)) {
    appTracking.components.set(vm, tracking = {
      queries: ref2(0),
      mutations: ref2(0),
      subscriptions: ref2(0)
    });
    onUnmounted(() => {
      appTracking.components.delete(vm);
    });
  } else {
    tracking = appTracking.components.get(vm);
  }
  return {
    appTracking,
    tracking
  };
}
function track(loading, type) {
  const {appTracking, tracking} = getCurrentTracking();
  watch(loading, (value, oldValue) => {
    if (oldValue != null && value !== oldValue) {
      const mod = value ? 1 : -1;
      tracking[type].value += mod;
      appTracking[type].value += mod;
    }
  }, {
    immediate: true
  });
  onBeforeUnmount(() => {
    if (loading.value) {
      tracking[type].value--;
      appTracking[type].value--;
    }
  });
}
function trackQuery(loading) {
  track(loading, "queries");
}
function trackMutation(loading) {
  track(loading, "mutations");
}
function trackSubscription(loading) {
  track(loading, "subscriptions");
}

// src/useQuery.ts
function useQuery(document, variables, options) {
  return useQueryImpl(document, variables, options);
}
function useQueryImpl(document, variables, options = {}, lazy = false) {
  const vm = getCurrentInstance3();
  const isServer = vm?.$isServer ?? false;
  const documentRef = paramToRef(document);
  const variablesRef = paramToRef(variables);
  const optionsRef = paramToReactive(options);
  const result = ref3();
  const resultEvent = useEventHook();
  const error = ref3(null);
  const errorEvent = useEventHook();
  const loading = ref3(false);
  vm && trackQuery(loading);
  const networkStatus = ref3();
  let firstResolve;
  let firstReject;
  onServerPrefetch?.(() => {
    if (!isEnabled.value || isServer && currentOptions.value?.prefetch === false)
      return;
    return new Promise((resolve, reject) => {
      firstResolve = () => {
        resolve();
        firstResolve = void 0;
        firstReject = void 0;
      };
      firstReject = (error2) => {
        reject(error2);
        firstResolve = void 0;
        firstReject = void 0;
      };
    }).then(stop).catch(stop);
  });
  const {resolveClient} = useApolloClient();
  const query = ref3();
  let observer;
  let started = false;
  function start() {
    if (started || !isEnabled.value || isServer && currentOptions.value?.prefetch === false) {
      if (firstResolve)
        firstResolve();
      return;
    }
    started = true;
    loading.value = true;
    const client = resolveClient(currentOptions.value?.clientId);
    query.value = client.watchQuery({
      query: currentDocument,
      variables: currentVariables,
      ...currentOptions.value,
      ...isServer ? {
        fetchPolicy: "network-only"
      } : {}
    });
    startQuerySubscription();
    if (!isServer && (currentOptions.value?.fetchPolicy !== "no-cache" || currentOptions.value.notifyOnNetworkStatusChange)) {
      const currentResult = query.value.getCurrentResult();
      if (!currentResult.loading || currentOptions.value?.notifyOnNetworkStatusChange) {
        onNextResult(currentResult);
      }
    }
    if (!isServer) {
      for (const item of subscribeToMoreItems) {
        addSubscribeToMore(item);
      }
    }
  }
  function startQuerySubscription() {
    if (observer && !observer.closed)
      return;
    if (!query.value)
      return;
    observer = query.value.subscribe({
      next: onNextResult,
      error: onError
    });
  }
  function onNextResult(queryResult) {
    processNextResult(queryResult);
    if (queryResult.errors?.length) {
      const e = new Error(`GraphQL error: ${queryResult.errors.map((e2) => e2.message).join(" | ")}`);
      Object.assign(e, {
        graphQLErrors: queryResult.errors,
        networkError: null
      });
      processError(e);
    } else {
      if (firstResolve) {
        firstResolve();
        stop();
      }
    }
  }
  function processNextResult(queryResult) {
    result.value = queryResult.data && Object.keys(queryResult.data).length === 0 ? void 0 : queryResult.data;
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
    const lastError = query.value.getLastError();
    const lastResult = query.value.getLastResult();
    query.value.resetLastResults();
    startQuerySubscription();
    Object.assign(query.value, {lastError, lastResult});
  }
  let onStopHandlers = [];
  function stop() {
    if (firstResolve)
      firstResolve();
    if (!started)
      return;
    started = false;
    loading.value = false;
    onStopHandlers.forEach((handler) => handler());
    onStopHandlers = [];
    if (query.value) {
      query.value.stopPolling();
      query.value = null;
    }
    if (observer) {
      observer.unsubscribe();
      observer = void 0;
    }
  }
  let restarting = false;
  function baseRestart() {
    if (!started || restarting)
      return;
    restarting = true;
    nextTick(() => {
      if (started) {
        stop();
        start();
      }
      restarting = false;
    });
  }
  let debouncedRestart;
  let isRestartDebounceSetup = false;
  function updateRestartFn() {
    if (!currentOptions) {
      debouncedRestart = baseRestart;
    } else {
      if (currentOptions.value?.throttle) {
        debouncedRestart = throttle(currentOptions.value.throttle, baseRestart);
      } else if (currentOptions.value?.debounce) {
        debouncedRestart = debounce(currentOptions.value.debounce, baseRestart);
      } else {
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
  let currentDocument;
  watch2(documentRef, (value) => {
    currentDocument = value;
    restart();
  }, {
    immediate: true
  });
  let currentVariables;
  let currentVariablesSerialized;
  watch2(variablesRef, (value, oldValue) => {
    const serialized = JSON.stringify(value);
    if (serialized !== currentVariablesSerialized) {
      currentVariables = value;
      restart();
    }
    currentVariablesSerialized = serialized;
  }, {
    deep: true,
    immediate: true
  });
  const currentOptions = ref3();
  watch2(() => isRef3(optionsRef) ? optionsRef.value : optionsRef, (value) => {
    if (currentOptions.value && (currentOptions.value.throttle !== value.throttle || currentOptions.value.debounce !== value.debounce)) {
      updateRestartFn();
    }
    currentOptions.value = value;
    restart();
  }, {
    deep: true,
    immediate: true
  });
  function refetch(variables2 = void 0) {
    if (query.value) {
      if (variables2) {
        currentVariables = variables2;
      }
      return query.value.refetch(variables2);
    }
  }
  function fetchMore(options2) {
    if (query.value) {
      return query.value.fetchMore(options2);
    }
  }
  const subscribeToMoreItems = [];
  function subscribeToMore(options2) {
    if (isServer)
      return;
    const optionsRef2 = paramToRef(options2);
    watch2(optionsRef2, (value, oldValue, onCleanup) => {
      const index = subscribeToMoreItems.findIndex((item2) => item2.options === oldValue);
      if (index !== -1) {
        subscribeToMoreItems.splice(index, 1);
      }
      const item = {
        options: value,
        unsubscribeFns: []
      };
      subscribeToMoreItems.push(item);
      addSubscribeToMore(item);
      onCleanup(() => {
        item.unsubscribeFns.forEach((fn) => fn());
        item.unsubscribeFns = [];
      });
    }, {
      immediate: true
    });
  }
  function addSubscribeToMore(item) {
    if (!started)
      return;
    if (!query.value) {
      throw new Error("Query is not defined");
    }
    const unsubscribe = query.value.subscribeToMore(item.options);
    onStopHandlers.push(unsubscribe);
    item.unsubscribeFns.push(unsubscribe);
  }
  const forceDisabled = ref3(lazy);
  const enabledOption = computed3(() => !currentOptions.value || currentOptions.value.enabled == null || currentOptions.value.enabled);
  const isEnabled = computed3(() => enabledOption.value && !forceDisabled.value);
  watch2(isEnabled, (value) => {
    if (value) {
      start();
    } else {
      stop();
    }
  }, {
    immediate: true
  });
  vm && onBeforeUnmount2(() => {
    stop();
    subscribeToMoreItems.length = 0;
  });
  return {
    result,
    loading,
    networkStatus,
    error,
    start,
    stop,
    restart,
    forceDisabled,
    document: documentRef,
    variables: variablesRef,
    options: optionsRef,
    query,
    refetch,
    fetchMore,
    subscribeToMore,
    onResult: resultEvent.on,
    onError: errorEvent.on
  };
}

// src/useLazyQuery.ts
import {isRef as isRef4} from "vue-demi";
function useLazyQuery(document, variables, options) {
  const query = useQueryImpl(document, variables, options, true);
  function load(document2, variables2, options2) {
    if (document2) {
      query.document.value = document2;
    }
    if (variables2) {
      query.variables.value = variables2;
    }
    if (options2) {
      Object.assign(isRef4(query.options) ? query.options.value : query.options, options2);
    }
    query.forceDisabled.value = false;
  }
  return {
    ...query,
    load
  };
}

// src/useMutation.ts
import {ref as ref4, onBeforeUnmount as onBeforeUnmount3, isRef as isRef5} from "vue-demi";
function useMutation(document, options = {}) {
  const loading = ref4(false);
  trackMutation(loading);
  const error = ref4(null);
  const called = ref4(false);
  const doneEvent = useEventHook();
  const errorEvent = useEventHook();
  const {resolveClient} = useApolloClient();
  async function mutate(variables, overrideOptions = {}) {
    let currentDocument;
    if (typeof document === "function") {
      currentDocument = document();
    } else if (isRef5(document)) {
      currentDocument = document.value;
    } else {
      currentDocument = document;
    }
    let currentOptions;
    if (typeof options === "function") {
      currentOptions = options();
    } else if (isRef5(options)) {
      currentOptions = options.value;
    } else {
      currentOptions = options;
    }
    const client = resolveClient(currentOptions.clientId);
    error.value = null;
    loading.value = true;
    called.value = true;
    try {
      const result = await client.mutate({
        mutation: currentDocument,
        ...currentOptions,
        ...overrideOptions,
        variables: variables ?? currentOptions.variables ? {
          ...currentOptions.variables,
          ...variables
        } : void 0
      });
      loading.value = false;
      doneEvent.trigger(result);
      return result;
    } catch (e) {
      error.value = e;
      loading.value = false;
      errorEvent.trigger(e);
      throw e;
    }
  }
  onBeforeUnmount3(() => {
    loading.value = false;
  });
  return {
    mutate,
    loading,
    error,
    called,
    onDone: doneEvent.on,
    onError: errorEvent.on
  };
}

// src/useSubscription.ts
import {
  ref as ref5,
  watch as watch3,
  isRef as isRef6,
  computed as computed4,
  getCurrentInstance as getCurrentInstance4,
  onBeforeUnmount as onBeforeUnmount4,
  nextTick as nextTick2
} from "vue-demi";
import {throttle as throttle2, debounce as debounce2} from "throttle-debounce";
function useSubscription(document, variables = void 0, options = {}) {
  const vm = getCurrentInstance4();
  const isServer = vm?.$isServer ?? false;
  const documentRef = paramToRef(document);
  const variablesRef = paramToRef(variables);
  const optionsRef = paramToReactive(options);
  const result = ref5();
  const resultEvent = useEventHook();
  const error = ref5(null);
  const errorEvent = useEventHook();
  const loading = ref5(false);
  trackSubscription(loading);
  const {resolveClient} = useApolloClient();
  const subscription = ref5(null);
  let observer = null;
  let started = false;
  function start() {
    if (started || !isEnabled.value || isServer)
      return;
    started = true;
    loading.value = true;
    const client = resolveClient(currentOptions.value?.clientId);
    subscription.value = client.subscribe({
      query: currentDocument,
      variables: currentVariables,
      ...currentOptions.value
    });
    observer = subscription.value.subscribe({
      next: onNextResult,
      error: onError
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
  let restarting = false;
  function baseRestart() {
    if (!started || restarting)
      return;
    restarting = true;
    nextTick2(() => {
      if (started) {
        stop();
        start();
      }
      restarting = false;
    });
  }
  let debouncedRestart;
  function updateRestartFn() {
    if (currentOptions.value?.throttle) {
      debouncedRestart = throttle2(currentOptions.value.throttle, baseRestart);
    } else if (currentOptions.value?.debounce) {
      debouncedRestart = debounce2(currentOptions.value.debounce, baseRestart);
    } else {
      debouncedRestart = baseRestart;
    }
  }
  function restart() {
    if (!debouncedRestart)
      updateRestartFn();
    debouncedRestart();
  }
  const currentOptions = ref5();
  watch3(() => isRef6(optionsRef) ? optionsRef.value : optionsRef, (value) => {
    if (currentOptions.value && (currentOptions.value.throttle !== value.throttle || currentOptions.value.debounce !== value.debounce)) {
      updateRestartFn();
    }
    currentOptions.value = value;
    restart();
  }, {
    deep: true,
    immediate: true
  });
  let currentDocument;
  watch3(documentRef, (value) => {
    currentDocument = value;
    restart();
  }, {
    immediate: true
  });
  let currentVariables;
  let currentVariablesSerialized;
  watch3(variablesRef, (value, oldValue) => {
    const serialized = JSON.stringify(value);
    if (serialized !== currentVariablesSerialized) {
      currentVariables = value;
      restart();
    }
    currentVariablesSerialized = serialized;
  }, {
    deep: true,
    immediate: true
  });
  const enabledOption = computed4(() => !currentOptions.value || currentOptions.value.enabled == null || currentOptions.value.enabled);
  const isEnabled = enabledOption;
  watch3(isEnabled, (value) => {
    if (value) {
      start();
    } else {
      stop();
    }
  }, {
    immediate: true
  });
  onBeforeUnmount4(stop);
  return {
    result,
    loading,
    error,
    start,
    stop,
    restart,
    document: documentRef,
    variables: variablesRef,
    options: optionsRef,
    subscription,
    onResult: resultEvent.on,
    onError: errorEvent.on
  };
}

// src/useResult.ts
import {computed as computed5} from "vue-demi";
function useResult(result, defaultValue, pick) {
  return computed5(() => {
    const value = result.value;
    if (value) {
      if (pick) {
        try {
          return pick(value);
        } catch (e) {
        }
      } else {
        const keys = Object.keys(value);
        if (keys.length === 1) {
          return value[keys[0]];
        } else {
          return value;
        }
      }
    }
    return defaultValue;
  });
}

// src/useLoading.ts
import {computed as computed6} from "vue-demi";
function useQueryLoading() {
  const {tracking} = getCurrentTracking();
  return computed6(() => tracking.queries.value > 0);
}
function useMutationLoading() {
  const {tracking} = getCurrentTracking();
  return computed6(() => tracking.mutations.value > 0);
}
function useSubscriptionLoading() {
  const {tracking} = getCurrentTracking();
  return computed6(() => tracking.subscriptions.value > 0);
}
function useGlobalQueryLoading() {
  const {appTracking} = getAppTracking();
  return computed6(() => appTracking.queries.value > 0);
}
function useGlobalMutationLoading() {
  const {appTracking} = getAppTracking();
  return computed6(() => appTracking.mutations.value > 0);
}
function useGlobalSubscriptionLoading() {
  const {appTracking} = getAppTracking();
  return computed6(() => appTracking.subscriptions.value > 0);
}
export {
  ApolloClients,
  DefaultApolloClient,
  provideApolloClient,
  useApolloClient,
  useGlobalMutationLoading,
  useGlobalQueryLoading,
  useGlobalSubscriptionLoading,
  useLazyQuery,
  useMutation,
  useMutationLoading,
  useQuery,
  useQueryLoading,
  useResult,
  useSubscription,
  useSubscriptionLoading
};
//# sourceMappingURL=index.esm.js.map

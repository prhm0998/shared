import { ref, toValue, watch, nextTick, isRef, shallowRef, effectScope, onScopeDispose, computed, readonly } from 'vue';

function useDragDrop(options) {
  const startIndex = ref(null);
  const endIndex = ref(null);
  const dragLeaveEnterCounter = ref(0);
  const dragLeaveCounter = ref(0);
  const start = (index) => {
    startIndex.value = index;
  };
  const drop = (index) => {
    if (startIndex.value === null) return;
    if (startIndex.value === index) return;
    endIndex.value = index;
  };
  const end = () => {
    if (startIndex.value === null) return;
    if (dragLeaveEnterCounter.value === 0 && dragLeaveCounter.value > 1) {
      options?.onRemove?.(startIndex.value);
    } else {
      if (endIndex.value !== null) {
        options?.onSwap?.(startIndex.value, endIndex.value);
      }
    }
    reset();
  };
  const dragLeaveParent = () => {
    dragLeaveEnterCounter.value--;
    dragLeaveCounter.value++;
  };
  const dragEnterParent = () => {
    dragLeaveEnterCounter.value++;
  };
  const reset = () => {
    startIndex.value = null;
    endIndex.value = null;
    dragLeaveEnterCounter.value = 0;
    dragLeaveCounter.value = 0;
  };
  return {
    // 状態
    startIndex,
    endIndex,
    dragLeaveEnterCounter,
    dragLeaveCounter,
    // イベントハンドラ
    start,
    drop,
    end,
    dragLeaveParent,
    dragEnterParent,
    reset
  };
}

typeof WorkerGlobalScope !== "undefined" && globalThis instanceof WorkerGlobalScope;
const noop = () => {};

//#endregion
//#region utils/filters.ts
/**
* @internal
*/
function createFilterWrapper(filter, fn) {
	function wrapper(...args) {
		return new Promise((resolve, reject) => {
			Promise.resolve(filter(() => fn.apply(this, args), {
				fn,
				thisArg: this,
				args
			})).then(resolve).catch(reject);
		});
	}
	return wrapper;
}
/**
* Create an EventFilter that debounce the events
*/
function debounceFilter(ms, options = {}) {
	let timer;
	let maxTimer;
	let lastRejector = noop;
	const _clearTimeout = (timer$1) => {
		clearTimeout(timer$1);
		lastRejector();
		lastRejector = noop;
	};
	let lastInvoker;
	const filter = (invoke$1) => {
		const duration = toValue(ms);
		const maxDuration = toValue(options.maxWait);
		if (timer) _clearTimeout(timer);
		if (duration <= 0 || maxDuration !== void 0 && maxDuration <= 0) {
			if (maxTimer) {
				_clearTimeout(maxTimer);
				maxTimer = void 0;
			}
			return Promise.resolve(invoke$1());
		}
		return new Promise((resolve, reject) => {
			lastRejector = options.rejectOnCancel ? reject : resolve;
			lastInvoker = invoke$1;
			if (maxDuration && !maxTimer) maxTimer = setTimeout(() => {
				if (timer) _clearTimeout(timer);
				maxTimer = void 0;
				resolve(lastInvoker());
			}, maxDuration);
			timer = setTimeout(() => {
				if (maxTimer) _clearTimeout(maxTimer);
				maxTimer = void 0;
				resolve(invoke$1());
			}, duration);
		});
	};
	return filter;
}

//#endregion
//#region utils/general.ts
function promiseTimeout(ms, throwOnTimeout = false, reason = "Timeout") {
	return new Promise((resolve, reject) => {
		if (throwOnTimeout) setTimeout(() => reject(reason), ms);
		else setTimeout(resolve, ms);
	});
}

//#endregion
//#region useDebounceFn/index.ts
/**
* Debounce execution of a function.
*
* @see https://vueuse.org/useDebounceFn
* @param  fn          A function to be executed after delay milliseconds debounced.
* @param  ms          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
* @param  options     Options
*
* @return A new, debounce, function.
*
* @__NO_SIDE_EFFECTS__
*/
function useDebounceFn(fn, ms = 200, options = {}) {
	return createFilterWrapper(debounceFilter(ms, options), fn);
}

//#endregion
//#region until/index.ts
function createUntil(r, isNot = false) {
	function toMatch(condition, { flush = "sync", deep = false, timeout, throwOnTimeout } = {}) {
		let stop = null;
		const promises = [new Promise((resolve) => {
			stop = watch(r, (v) => {
				if (condition(v) !== isNot) {
					if (stop) stop();
					else nextTick(() => stop === null || stop === void 0 ? void 0 : stop());
					resolve(v);
				}
			}, {
				flush,
				deep,
				immediate: true
			});
		})];
		if (timeout != null) promises.push(promiseTimeout(timeout, throwOnTimeout).then(() => toValue(r)).finally(() => stop === null || stop === void 0 ? void 0 : stop()));
		return Promise.race(promises);
	}
	function toBe(value, options) {
		if (!isRef(value)) return toMatch((v) => v === value, options);
		const { flush = "sync", deep = false, timeout, throwOnTimeout } = options !== null && options !== void 0 ? options : {};
		let stop = null;
		const promises = [new Promise((resolve) => {
			stop = watch([r, value], ([v1, v2]) => {
				if (isNot !== (v1 === v2)) {
					if (stop) stop();
					else nextTick(() => stop === null || stop === void 0 ? void 0 : stop());
					resolve(v1);
				}
			}, {
				flush,
				deep,
				immediate: true
			});
		})];
		if (timeout != null) promises.push(promiseTimeout(timeout, throwOnTimeout).then(() => toValue(r)).finally(() => {
			stop === null || stop === void 0 || stop();
			return toValue(r);
		}));
		return Promise.race(promises);
	}
	function toBeTruthy(options) {
		return toMatch((v) => Boolean(v), options);
	}
	function toBeNull(options) {
		return toBe(null, options);
	}
	function toBeUndefined(options) {
		return toBe(void 0, options);
	}
	function toBeNaN(options) {
		return toMatch(Number.isNaN, options);
	}
	function toContains(value, options) {
		return toMatch((v) => {
			const array = Array.from(v);
			return array.includes(value) || array.includes(toValue(value));
		}, options);
	}
	function changed(options) {
		return changedTimes(1, options);
	}
	function changedTimes(n = 1, options) {
		let count = -1;
		return toMatch(() => {
			count += 1;
			return count >= n;
		}, options);
	}
	if (Array.isArray(toValue(r))) return {
		toMatch,
		toContains,
		changed,
		changedTimes,
		get not() {
			return createUntil(r, !isNot);
		}
	};
	else return {
		toMatch,
		toBe,
		toBeTruthy,
		toBeNull,
		toBeNaN,
		toBeUndefined,
		changed,
		changedTimes,
		get not() {
			return createUntil(r, !isNot);
		}
	};
}
function until(r) {
	return createUntil(r);
}

//#endregion
//#region useAsyncState/index.ts
/**
* Reactive async state. Will not block your setup function and will trigger changes once
* the promise is ready.
*
* @see https://vueuse.org/useAsyncState
* @param promise         The promise / async function to be resolved
* @param initialState    The initial state, used until the first evaluation finishes
* @param options
*/
function useAsyncState(promise, initialState, options) {
	var _globalThis$reportErr;
	const { immediate = true, delay = 0, onError = (_globalThis$reportErr = globalThis.reportError) !== null && _globalThis$reportErr !== void 0 ? _globalThis$reportErr : noop, onSuccess = noop, resetOnExecute = true, shallow = true, throwError } = options !== null && options !== void 0 ? options : {};
	const state = shallow ? shallowRef(initialState) : ref(initialState);
	const isReady = shallowRef(false);
	const isLoading = shallowRef(false);
	const error = shallowRef(void 0);
	let executionsCount = 0;
	async function execute(delay$1 = 0, ...args) {
		const executionId = executionsCount += 1;
		if (resetOnExecute) state.value = toValue(initialState);
		error.value = void 0;
		isReady.value = false;
		isLoading.value = true;
		if (delay$1 > 0) await promiseTimeout(delay$1);
		const _promise = typeof promise === "function" ? promise(...args) : promise;
		try {
			const data = await _promise;
			if (executionId === executionsCount) {
				state.value = data;
				isReady.value = true;
			}
			onSuccess(data);
		} catch (e) {
			if (executionId === executionsCount) error.value = e;
			onError(e);
			if (throwError) throw e;
		} finally {
			if (executionId === executionsCount) isLoading.value = false;
		}
		return state.value;
	}
	if (immediate) execute(delay);
	const shell = {
		state,
		isReady,
		isLoading,
		error,
		execute,
		executeImmediate: (...args) => execute(0, ...args)
	};
	function waitUntilIsLoaded() {
		return new Promise((resolve, reject) => {
			until(isLoading).toBe(false).then(() => resolve(shell)).catch(reject);
		});
	}
	return {
		...shell,
		then(onFulfilled, onRejected) {
			return waitUntilIsLoaded().then(onFulfilled, onRejected);
		}
	};
}

var has = Object.prototype.hasOwnProperty;

function dequal(foo, bar) {
	var ctor, len;
	if (foo === bar) return true;

	if (foo && bar && (ctor=foo.constructor) === bar.constructor) {
		if (ctor === Date) return foo.getTime() === bar.getTime();
		if (ctor === RegExp) return foo.toString() === bar.toString();

		if (ctor === Array) {
			if ((len=foo.length) === bar.length) {
				while (len-- && dequal(foo[len], bar[len]));
			}
			return len === -1;
		}

		if (!ctor || typeof foo === 'object') {
			len = 0;
			for (ctor in foo) {
				if (has.call(foo, ctor) && ++len && !has.call(bar, ctor)) return false;
				if (!(ctor in bar) || !dequal(foo[ctor], bar[ctor])) return false;
			}
			return Object.keys(bar).length === len;
		}
	}

	return foo !== foo && bar !== bar;
}

const E_CANCELED = new Error('request for lock canceled');

var __awaiter$2 = function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Semaphore {
    constructor(_value, _cancelError = E_CANCELED) {
        this._value = _value;
        this._cancelError = _cancelError;
        this._queue = [];
        this._weightedWaiters = [];
    }
    acquire(weight = 1, priority = 0) {
        if (weight <= 0)
            throw new Error(`invalid weight ${weight}: must be positive`);
        return new Promise((resolve, reject) => {
            const task = { resolve, reject, weight, priority };
            const i = findIndexFromEnd(this._queue, (other) => priority <= other.priority);
            if (i === -1 && weight <= this._value) {
                // Needs immediate dispatch, skip the queue
                this._dispatchItem(task);
            }
            else {
                this._queue.splice(i + 1, 0, task);
            }
        });
    }
    runExclusive(callback_1) {
        return __awaiter$2(this, arguments, void 0, function* (callback, weight = 1, priority = 0) {
            const [value, release] = yield this.acquire(weight, priority);
            try {
                return yield callback(value);
            }
            finally {
                release();
            }
        });
    }
    waitForUnlock(weight = 1, priority = 0) {
        if (weight <= 0)
            throw new Error(`invalid weight ${weight}: must be positive`);
        if (this._couldLockImmediately(weight, priority)) {
            return Promise.resolve();
        }
        else {
            return new Promise((resolve) => {
                if (!this._weightedWaiters[weight - 1])
                    this._weightedWaiters[weight - 1] = [];
                insertSorted(this._weightedWaiters[weight - 1], { resolve, priority });
            });
        }
    }
    isLocked() {
        return this._value <= 0;
    }
    getValue() {
        return this._value;
    }
    setValue(value) {
        this._value = value;
        this._dispatchQueue();
    }
    release(weight = 1) {
        if (weight <= 0)
            throw new Error(`invalid weight ${weight}: must be positive`);
        this._value += weight;
        this._dispatchQueue();
    }
    cancel() {
        this._queue.forEach((entry) => entry.reject(this._cancelError));
        this._queue = [];
    }
    _dispatchQueue() {
        this._drainUnlockWaiters();
        while (this._queue.length > 0 && this._queue[0].weight <= this._value) {
            this._dispatchItem(this._queue.shift());
            this._drainUnlockWaiters();
        }
    }
    _dispatchItem(item) {
        const previousValue = this._value;
        this._value -= item.weight;
        item.resolve([previousValue, this._newReleaser(item.weight)]);
    }
    _newReleaser(weight) {
        let called = false;
        return () => {
            if (called)
                return;
            called = true;
            this.release(weight);
        };
    }
    _drainUnlockWaiters() {
        if (this._queue.length === 0) {
            for (let weight = this._value; weight > 0; weight--) {
                const waiters = this._weightedWaiters[weight - 1];
                if (!waiters)
                    continue;
                waiters.forEach((waiter) => waiter.resolve());
                this._weightedWaiters[weight - 1] = [];
            }
        }
        else {
            const queuedPriority = this._queue[0].priority;
            for (let weight = this._value; weight > 0; weight--) {
                const waiters = this._weightedWaiters[weight - 1];
                if (!waiters)
                    continue;
                const i = waiters.findIndex((waiter) => waiter.priority <= queuedPriority);
                (i === -1 ? waiters : waiters.splice(0, i))
                    .forEach((waiter => waiter.resolve()));
            }
        }
    }
    _couldLockImmediately(weight, priority) {
        return (this._queue.length === 0 || this._queue[0].priority < priority) &&
            weight <= this._value;
    }
}
function insertSorted(a, v) {
    const i = findIndexFromEnd(a, (other) => v.priority <= other.priority);
    a.splice(i + 1, 0, v);
}
function findIndexFromEnd(a, predicate) {
    for (let i = a.length - 1; i >= 0; i--) {
        if (predicate(a[i])) {
            return i;
        }
    }
    return -1;
}

var __awaiter$1 = function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Mutex {
    constructor(cancelError) {
        this._semaphore = new Semaphore(1, cancelError);
    }
    acquire() {
        return __awaiter$1(this, arguments, void 0, function* (priority = 0) {
            const [, releaser] = yield this._semaphore.acquire(1, priority);
            return releaser;
        });
    }
    runExclusive(callback, priority = 0) {
        return this._semaphore.runExclusive(() => callback(), 1, priority);
    }
    isLocked() {
        return this._semaphore.isLocked();
    }
    waitForUnlock(priority = 0) {
        return this._semaphore.waitForUnlock(1, priority);
    }
    release() {
        if (this._semaphore.isLocked())
            this._semaphore.release();
    }
    cancel() {
        return this._semaphore.cancel();
    }
}

// #region snippet
const browser = globalThis.browser?.runtime?.id
  ? globalThis.browser
  : globalThis.chrome;
// #endregion snippet

const storage = createStorage();
function createStorage() {
  const drivers = {
    local: createDriver("local"),
    session: createDriver("session"),
    sync: createDriver("sync"),
    managed: createDriver("managed")
  };
  const getDriver = (area) => {
    const driver = drivers[area];
    if (driver == null) {
      const areaNames = Object.keys(drivers).join(", ");
      throw Error(`Invalid area "${area}". Options: ${areaNames}`);
    }
    return driver;
  };
  const resolveKey = (key) => {
    const deliminatorIndex = key.indexOf(":");
    const driverArea = key.substring(0, deliminatorIndex);
    const driverKey = key.substring(deliminatorIndex + 1);
    if (driverKey == null)
      throw Error(
        `Storage key should be in the form of "area:key", but received "${key}"`
      );
    return {
      driverArea,
      driverKey,
      driver: getDriver(driverArea)
    };
  };
  const getMetaKey = (key) => key + "$";
  const mergeMeta = (oldMeta, newMeta) => {
    const newFields = { ...oldMeta };
    Object.entries(newMeta).forEach(([key, value]) => {
      if (value == null) delete newFields[key];
      else newFields[key] = value;
    });
    return newFields;
  };
  const getValueOrFallback = (value, fallback) => value ?? fallback ?? null;
  const getMetaValue = (properties) => typeof properties === "object" && !Array.isArray(properties) ? properties : {};
  const getItem = async (driver, driverKey, opts) => {
    const res = await driver.getItem(driverKey);
    return getValueOrFallback(res, opts?.fallback ?? opts?.defaultValue);
  };
  const getMeta = async (driver, driverKey) => {
    const metaKey = getMetaKey(driverKey);
    const res = await driver.getItem(metaKey);
    return getMetaValue(res);
  };
  const setItem = async (driver, driverKey, value) => {
    await driver.setItem(driverKey, value ?? null);
  };
  const setMeta = async (driver, driverKey, properties) => {
    const metaKey = getMetaKey(driverKey);
    const existingFields = getMetaValue(await driver.getItem(metaKey));
    await driver.setItem(metaKey, mergeMeta(existingFields, properties));
  };
  const removeItem = async (driver, driverKey, opts) => {
    await driver.removeItem(driverKey);
    if (opts?.removeMeta) {
      const metaKey = getMetaKey(driverKey);
      await driver.removeItem(metaKey);
    }
  };
  const removeMeta = async (driver, driverKey, properties) => {
    const metaKey = getMetaKey(driverKey);
    if (properties == null) {
      await driver.removeItem(metaKey);
    } else {
      const newFields = getMetaValue(await driver.getItem(metaKey));
      [properties].flat().forEach((field) => delete newFields[field]);
      await driver.setItem(metaKey, newFields);
    }
  };
  const watch = (driver, driverKey, cb) => {
    return driver.watch(driverKey, cb);
  };
  const storage2 = {
    getItem: async (key, opts) => {
      const { driver, driverKey } = resolveKey(key);
      return await getItem(driver, driverKey, opts);
    },
    getItems: async (keys) => {
      const areaToKeyMap = /* @__PURE__ */ new Map();
      const keyToOptsMap = /* @__PURE__ */ new Map();
      const orderedKeys = [];
      keys.forEach((key) => {
        let keyStr;
        let opts;
        if (typeof key === "string") {
          keyStr = key;
        } else if ("getValue" in key) {
          keyStr = key.key;
          opts = { fallback: key.fallback };
        } else {
          keyStr = key.key;
          opts = key.options;
        }
        orderedKeys.push(keyStr);
        const { driverArea, driverKey } = resolveKey(keyStr);
        const areaKeys = areaToKeyMap.get(driverArea) ?? [];
        areaToKeyMap.set(driverArea, areaKeys.concat(driverKey));
        keyToOptsMap.set(keyStr, opts);
      });
      const resultsMap = /* @__PURE__ */ new Map();
      await Promise.all(
        Array.from(areaToKeyMap.entries()).map(async ([driverArea, keys2]) => {
          const driverResults = await drivers[driverArea].getItems(keys2);
          driverResults.forEach((driverResult) => {
            const key = `${driverArea}:${driverResult.key}`;
            const opts = keyToOptsMap.get(key);
            const value = getValueOrFallback(
              driverResult.value,
              opts?.fallback ?? opts?.defaultValue
            );
            resultsMap.set(key, value);
          });
        })
      );
      return orderedKeys.map((key) => ({
        key,
        value: resultsMap.get(key)
      }));
    },
    getMeta: async (key) => {
      const { driver, driverKey } = resolveKey(key);
      return await getMeta(driver, driverKey);
    },
    getMetas: async (args) => {
      const keys = args.map((arg) => {
        const key = typeof arg === "string" ? arg : arg.key;
        const { driverArea, driverKey } = resolveKey(key);
        return {
          key,
          driverArea,
          driverKey,
          driverMetaKey: getMetaKey(driverKey)
        };
      });
      const areaToDriverMetaKeysMap = keys.reduce((map, key) => {
        map[key.driverArea] ??= [];
        map[key.driverArea].push(key);
        return map;
      }, {});
      const resultsMap = {};
      await Promise.all(
        Object.entries(areaToDriverMetaKeysMap).map(async ([area, keys2]) => {
          const areaRes = await browser.storage[area].get(
            keys2.map((key) => key.driverMetaKey)
          );
          keys2.forEach((key) => {
            resultsMap[key.key] = areaRes[key.driverMetaKey] ?? {};
          });
        })
      );
      return keys.map((key) => ({
        key: key.key,
        meta: resultsMap[key.key]
      }));
    },
    setItem: async (key, value) => {
      const { driver, driverKey } = resolveKey(key);
      await setItem(driver, driverKey, value);
    },
    setItems: async (items) => {
      const areaToKeyValueMap = {};
      items.forEach((item) => {
        const { driverArea, driverKey } = resolveKey(
          "key" in item ? item.key : item.item.key
        );
        areaToKeyValueMap[driverArea] ??= [];
        areaToKeyValueMap[driverArea].push({
          key: driverKey,
          value: item.value
        });
      });
      await Promise.all(
        Object.entries(areaToKeyValueMap).map(async ([driverArea, values]) => {
          const driver = getDriver(driverArea);
          await driver.setItems(values);
        })
      );
    },
    setMeta: async (key, properties) => {
      const { driver, driverKey } = resolveKey(key);
      await setMeta(driver, driverKey, properties);
    },
    setMetas: async (items) => {
      const areaToMetaUpdatesMap = {};
      items.forEach((item) => {
        const { driverArea, driverKey } = resolveKey(
          "key" in item ? item.key : item.item.key
        );
        areaToMetaUpdatesMap[driverArea] ??= [];
        areaToMetaUpdatesMap[driverArea].push({
          key: driverKey,
          properties: item.meta
        });
      });
      await Promise.all(
        Object.entries(areaToMetaUpdatesMap).map(
          async ([storageArea, updates]) => {
            const driver = getDriver(storageArea);
            const metaKeys = updates.map(({ key }) => getMetaKey(key));
            const existingMetas = await driver.getItems(metaKeys);
            const existingMetaMap = Object.fromEntries(
              existingMetas.map(({ key, value }) => [key, getMetaValue(value)])
            );
            const metaUpdates = updates.map(({ key, properties }) => {
              const metaKey = getMetaKey(key);
              return {
                key: metaKey,
                value: mergeMeta(existingMetaMap[metaKey] ?? {}, properties)
              };
            });
            await driver.setItems(metaUpdates);
          }
        )
      );
    },
    removeItem: async (key, opts) => {
      const { driver, driverKey } = resolveKey(key);
      await removeItem(driver, driverKey, opts);
    },
    removeItems: async (keys) => {
      const areaToKeysMap = {};
      keys.forEach((key) => {
        let keyStr;
        let opts;
        if (typeof key === "string") {
          keyStr = key;
        } else if ("getValue" in key) {
          keyStr = key.key;
        } else if ("item" in key) {
          keyStr = key.item.key;
          opts = key.options;
        } else {
          keyStr = key.key;
          opts = key.options;
        }
        const { driverArea, driverKey } = resolveKey(keyStr);
        areaToKeysMap[driverArea] ??= [];
        areaToKeysMap[driverArea].push(driverKey);
        if (opts?.removeMeta) {
          areaToKeysMap[driverArea].push(getMetaKey(driverKey));
        }
      });
      await Promise.all(
        Object.entries(areaToKeysMap).map(async ([driverArea, keys2]) => {
          const driver = getDriver(driverArea);
          await driver.removeItems(keys2);
        })
      );
    },
    clear: async (base) => {
      const driver = getDriver(base);
      await driver.clear();
    },
    removeMeta: async (key, properties) => {
      const { driver, driverKey } = resolveKey(key);
      await removeMeta(driver, driverKey, properties);
    },
    snapshot: async (base, opts) => {
      const driver = getDriver(base);
      const data = await driver.snapshot();
      opts?.excludeKeys?.forEach((key) => {
        delete data[key];
        delete data[getMetaKey(key)];
      });
      return data;
    },
    restoreSnapshot: async (base, data) => {
      const driver = getDriver(base);
      await driver.restoreSnapshot(data);
    },
    watch: (key, cb) => {
      const { driver, driverKey } = resolveKey(key);
      return watch(driver, driverKey, cb);
    },
    unwatch() {
      Object.values(drivers).forEach((driver) => {
        driver.unwatch();
      });
    },
    defineItem: (key, opts) => {
      const { driver, driverKey } = resolveKey(key);
      const {
        version: targetVersion = 1,
        migrations = {},
        onMigrationComplete,
        debug = false
      } = opts ?? {};
      if (targetVersion < 1) {
        throw Error(
          "Storage item version cannot be less than 1. Initial versions should be set to 1, not 0."
        );
      }
      const migrate = async () => {
        const driverMetaKey = getMetaKey(driverKey);
        const [{ value }, { value: meta }] = await driver.getItems([
          driverKey,
          driverMetaKey
        ]);
        if (value == null) return;
        const currentVersion = meta?.v ?? 1;
        if (currentVersion > targetVersion) {
          throw Error(
            `Version downgrade detected (v${currentVersion} -> v${targetVersion}) for "${key}"`
          );
        }
        if (currentVersion === targetVersion) {
          return;
        }
        if (debug === true) {
          console.debug(
            `[@wxt-dev/storage] Running storage migration for ${key}: v${currentVersion} -> v${targetVersion}`
          );
        }
        const migrationsToRun = Array.from(
          { length: targetVersion - currentVersion },
          (_, i) => currentVersion + i + 1
        );
        let migratedValue = value;
        for (const migrateToVersion of migrationsToRun) {
          try {
            migratedValue = await migrations?.[migrateToVersion]?.(migratedValue) ?? migratedValue;
            if (debug === true) {
              console.debug(
                `[@wxt-dev/storage] Storage migration processed for version: v${migrateToVersion}`
              );
            }
          } catch (err) {
            throw new MigrationError(key, migrateToVersion, {
              cause: err
            });
          }
        }
        await driver.setItems([
          { key: driverKey, value: migratedValue },
          { key: driverMetaKey, value: { ...meta, v: targetVersion } }
        ]);
        if (debug === true) {
          console.debug(
            `[@wxt-dev/storage] Storage migration completed for ${key} v${targetVersion}`,
            { migratedValue }
          );
        }
        onMigrationComplete?.(migratedValue, targetVersion);
      };
      const migrationsDone = opts?.migrations == null ? Promise.resolve() : migrate().catch((err) => {
        console.error(
          `[@wxt-dev/storage] Migration failed for ${key}`,
          err
        );
      });
      const initMutex = new Mutex();
      const getFallback = () => opts?.fallback ?? opts?.defaultValue ?? null;
      const getOrInitValue = () => initMutex.runExclusive(async () => {
        const value = await driver.getItem(driverKey);
        if (value != null || opts?.init == null) return value;
        const newValue = await opts.init();
        await driver.setItem(driverKey, newValue);
        return newValue;
      });
      migrationsDone.then(getOrInitValue);
      return {
        key,
        get defaultValue() {
          return getFallback();
        },
        get fallback() {
          return getFallback();
        },
        getValue: async () => {
          await migrationsDone;
          if (opts?.init) {
            return await getOrInitValue();
          } else {
            return await getItem(driver, driverKey, opts);
          }
        },
        getMeta: async () => {
          await migrationsDone;
          return await getMeta(driver, driverKey);
        },
        setValue: async (value) => {
          await migrationsDone;
          return await setItem(driver, driverKey, value);
        },
        setMeta: async (properties) => {
          await migrationsDone;
          return await setMeta(driver, driverKey, properties);
        },
        removeValue: async (opts2) => {
          await migrationsDone;
          return await removeItem(driver, driverKey, opts2);
        },
        removeMeta: async (properties) => {
          await migrationsDone;
          return await removeMeta(driver, driverKey, properties);
        },
        watch: (cb) => watch(
          driver,
          driverKey,
          (newValue, oldValue) => cb(newValue ?? getFallback(), oldValue ?? getFallback())
        ),
        migrate
      };
    }
  };
  return storage2;
}
function createDriver(storageArea) {
  const getStorageArea = () => {
    if (browser.runtime == null) {
      throw Error(
        [
          "'wxt/storage' must be loaded in a web extension environment",
          "\n - If thrown during a build, see https://github.com/wxt-dev/wxt/issues/371",
          " - If thrown during tests, mock 'wxt/browser' correctly. See https://wxt.dev/guide/go-further/testing.html\n"
        ].join("\n")
      );
    }
    if (browser.storage == null) {
      throw Error(
        "You must add the 'storage' permission to your manifest to use 'wxt/storage'"
      );
    }
    const area = browser.storage[storageArea];
    if (area == null)
      throw Error(`"browser.storage.${storageArea}" is undefined`);
    return area;
  };
  const watchListeners = /* @__PURE__ */ new Set();
  return {
    getItem: async (key) => {
      const res = await getStorageArea().get(key);
      return res[key];
    },
    getItems: async (keys) => {
      const result = await getStorageArea().get(keys);
      return keys.map((key) => ({ key, value: result[key] ?? null }));
    },
    setItem: async (key, value) => {
      if (value == null) {
        await getStorageArea().remove(key);
      } else {
        await getStorageArea().set({ [key]: value });
      }
    },
    setItems: async (values) => {
      const map = values.reduce(
        (map2, { key, value }) => {
          map2[key] = value;
          return map2;
        },
        {}
      );
      await getStorageArea().set(map);
    },
    removeItem: async (key) => {
      await getStorageArea().remove(key);
    },
    removeItems: async (keys) => {
      await getStorageArea().remove(keys);
    },
    clear: async () => {
      await getStorageArea().clear();
    },
    snapshot: async () => {
      return await getStorageArea().get();
    },
    restoreSnapshot: async (data) => {
      await getStorageArea().set(data);
    },
    watch(key, cb) {
      const listener = (changes) => {
        const change = changes[key];
        if (change == null) return;
        if (dequal(change.newValue, change.oldValue)) return;
        cb(change.newValue ?? null, change.oldValue ?? null);
      };
      getStorageArea().onChanged.addListener(listener);
      watchListeners.add(listener);
      return () => {
        getStorageArea().onChanged.removeListener(listener);
        watchListeners.delete(listener);
      };
    },
    unwatch() {
      watchListeners.forEach((listener) => {
        getStorageArea().onChanged.removeListener(listener);
      });
      watchListeners.clear();
    }
  };
}
class MigrationError extends Error {
  constructor(key, version, options) {
    super(`v${version} migration failed for "${key}"`, options);
    this.key = key;
    this.version = version;
  }
}

function useStoredValue(key, initialValue, opts) {
  const scope = effectScope(true);
  const result = scope.run(() => {
    const {
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      execute: _,
      ...asyncState
    } = useAsyncState(
      async () => await storage.getItem(key, { fallback: initialValue }) ?? initialValue,
      initialValue,
      opts
    );
    const unwatch = storage.watch(key, (newValue) => {
      state.value = newValue ?? initialValue;
    });
    onScopeDispose(() => {
      unwatch();
    });
    const wrapped = computed({
      get() {
        return state.value;
      },
      set(newValue) {
        void storage.setItem(key, newValue);
        state.value = newValue;
      }
    });
    return {
      state: wrapped,
      ...asyncState
    };
  });
  const stop = () => {
    scope.stop();
  };
  return {
    ...result,
    stop
  };
}

function useGenericStore(key, getDefaultState, deserialize, serialize, updateStateLogic) {
  const { state: storedJson } = useStoredValue(key, serialize(getDefaultState()));
  const memoryCache = ref(deserialize(storedJson.value));
  watch(storedJson, (newVal) => {
    memoryCache.value = deserialize(newVal);
  });
  const saveToStorage = useDebounceFn(() => {
    storedJson.value = serialize(memoryCache.value);
  }, 300, { maxWait: 1e3 });
  watch(memoryCache, () => saveToStorage(), { deep: true });
  const updateState = (event) => {
    updateStateLogic(memoryCache, event);
  };
  return {
    // 外部からの直接的な変更を防ぐため、状態は readonly として返します
    state: readonly(memoryCache),
    // 外部に公開する状態更新関数
    updateState
  };
}

export { useDragDrop, useGenericStore, useStoredValue };
//# sourceMappingURL=index.js.map

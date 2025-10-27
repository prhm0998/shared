function applyDefaultProperties(obj, defaultObj) {
  return Object.assign({}, defaultObj, obj);
}

function isPlainObject(value) {
  if (value === null || typeof value !== "object") {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) {
    return false;
  }
  if (Symbol.iterator in value) {
    return false;
  }
  if (Symbol.toStringTag in value) {
    return Object.prototype.toString.call(value) === "[object Module]";
  }
  return true;
}

function _defu(baseObject, defaults, namespace = ".", merger) {
  if (!isPlainObject(defaults)) {
    return _defu(baseObject, {}, namespace, merger);
  }
  const object = Object.assign({}, defaults);
  for (const key in baseObject) {
    if (key === "__proto__" || key === "constructor") {
      continue;
    }
    const value = baseObject[key];
    if (value === null || value === void 0) {
      continue;
    }
    if (merger && merger(object, key, value, namespace)) {
      continue;
    }
    if (Array.isArray(value) && Array.isArray(object[key])) {
      object[key] = [...value, ...object[key]];
    } else if (isPlainObject(value) && isPlainObject(object[key])) {
      object[key] = _defu(
        value,
        object[key],
        (namespace ? `${namespace}.` : "") + key.toString(),
        merger
      );
    } else {
      object[key] = value;
    }
  }
  return object;
}
function createDefu(merger) {
  return (...arguments_) => (
    // eslint-disable-next-line unicorn/no-array-reduce
    arguments_.reduce((p, c) => _defu(p, c, "", merger), {})
  );
}
const defu = createDefu();

function elementWatch(targetElement, query, callback, options = null) {
  const defaultOptions = {
    childList: true,
    subtree: true
  };
  const observerOptions = defu(options ?? {}, defaultOptions);
  targetElement.querySelectorAll(query).forEach(callback);
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        if (node.matches(query)) callback(node);
        if (observerOptions.subtree) {
          node.querySelectorAll(query).forEach(callback);
        }
      }
    }
  });
  observer.observe(targetElement, observerOptions);
  return observer;
}

function filterProperties(obj, defaultObj) {
  return Object.keys(defaultObj).reduce((acc, key) => {
    if (key in obj) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
}

function getCurrentUrlMatchText() {
  return `*://${location.hostname}/*`;
}

function hiraToKana(str) {
  return str.replace(/[\u3041-\u3096\u30FC]/g, (m) => String.fromCharCode(m.charCodeAt(0) + 96));
}

function isValidRegex(input) {
  try {
    new RegExp(input);
    return true;
  } catch (e) {
    if (e instanceof SyntaxError) {
      return false;
    } else {
      throw e;
    }
  }
}

function isValidSelector(selector) {
  try {
    document.createDocumentFragment().querySelector(selector);
    return true;
  } catch {
    return false;
  }
}

function kanaToFullWidth(str) {
  const D_MUD = "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴヷヺ";
  const S_MUD = "ｶﾞｷﾞｸﾞｹﾞｺﾞｻﾞｼﾞｽﾞｾﾞｿﾞﾀﾞﾁﾞﾂﾞﾃﾞﾄﾞﾊﾞﾋﾞﾌﾞﾍﾞﾎﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟｳﾞﾜﾞｦﾞ";
  const D_KIY = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョ。、ー「」・";
  const S_KIY = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮ｡､ｰ｢｣･";
  const map = {};
  for (let i = 0, len = D_MUD.length; i < len; i++) {
    map[S_MUD.slice(i * 2, i * 2 + 2)] = D_MUD.slice(i, i + 1);
  }
  for (let i = 0, len = D_KIY.length; i < len; i++) {
    map[S_KIY.slice(i, i + 1)] = D_KIY.slice(i, i + 1);
  }
  const re = new RegExp(Object.keys(map).join("|"), "g");
  return str.replace(re, (x) => map[x]);
}

function kanaToHalfWidth(str) {
  const D_MUD = "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴヷヺ";
  const S_MUD = "ｶﾞｷﾞｸﾞｹﾞｺﾞｻﾞｼﾞｽﾞｾﾞｿﾞﾀﾞﾁﾞﾂﾞﾃﾞﾄﾞﾊﾞﾋﾞﾌﾞﾍﾞﾎﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟｳﾞﾜﾞｦﾞ";
  const D_KIY = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョ。、ー「」・";
  const S_KIY = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮ｡､ｰ｢｣･";
  const map = {};
  for (let i = 0, len = D_MUD.length; i < len; i++) {
    map[D_MUD.slice(i, i + 1)] = S_MUD.slice(i * 2, i * 2 + 2);
  }
  for (let i = 0, len = D_KIY.length; i < len; i++) {
    map[D_KIY.slice(i, i + 1)] = S_KIY.slice(i, i + 1);
  }
  const re = new RegExp(Object.keys(map).join("|"), "g");
  return str.replace(re, (x) => map[x]);
}

function latinToZenkaku(text) {
  return text.replace(/[0-9A-Za-z]/g, (s) => {
    return String.fromCharCode(s.charCodeAt(0) + 65248);
  });
}

const normalizedWord = (key = "") => kanaToFullWidth(hiraToKana(key));

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

function traverseTextNodes(element, callback) {
  const iterator = document.createNodeIterator(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );
  let node;
  while (node = iterator.nextNode()) {
    node.textContent = callback(node.textContent ?? "");
  }
}

const watchElementRemoval = (element, callback, interval = 1e3) => {
  if (!element.isConnected) {
    console.warn("Element is not connected to the document, it might already be removed.");
    callback();
    return;
  }
  const checkInterval = setInterval(() => {
    if (!element.isConnected) {
      clearInterval(checkInterval);
      callback();
    }
  }, interval);
  return () => clearInterval(checkInterval);
};

export { applyDefaultProperties, elementWatch, filterProperties, getCurrentUrlMatchText, hiraToKana, isValidRegex, isValidSelector, kanaToFullWidth, kanaToHalfWidth, latinToZenkaku, normalizedWord, sleep, traverseTextNodes, watchElementRemoval };
//# sourceMappingURL=index.js.map

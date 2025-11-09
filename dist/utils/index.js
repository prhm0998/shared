function applyDefaultProperties(obj, defaultObj) {
  return Object.assign({}, defaultObj, obj);
}

async function copyToClipboardText(text) {
  if (!text) return false;
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    console.error("Copy failed:", e);
    return false;
  }
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

function flexibleClamp(value, option = {}) {
  const {
    min = Number.NEGATIVE_INFINITY,
    max = Number.POSITIVE_INFINITY
  } = option;
  return Math.min(Math.max(value, min), max);
}

function getCurrentUrlMatchText() {
  return `*://${location.hostname}/*`;
}

function getFixedElementsTotalHeight() {
  return Array.from(document.querySelectorAll("*")).filter((el) => {
    const style = getComputedStyle(el);
    return style.position === "fixed" && style.top === "0px";
  }).reduce((sum, el) => sum + el.offsetHeight, 0);
}

function hiraToKana(str) {
  return str.replace(/[\u3041-\u3096\u30FC]/g, (m) => String.fromCharCode(m.charCodeAt(0) + 96));
}

var dist$1 = {};

var matchPattern = {};

var config = {};

var hasRequiredConfig;

function requireConfig () {
	if (hasRequiredConfig) return config;
	hasRequiredConfig = 1;

	Object.defineProperty(config, "__esModule", {
	  value: true
	});
	config.presets = config.defaultOptions = void 0;
	const presets = {
	  chrome: {
	    supportedSchemes: ['http', 'https', 'file', 'ftp'
	    // 'urn',
	    ],
	    schemeStarMatchesWs: false
	  },
	  firefox: {
	    supportedSchemes: ['http', 'https', 'ws', 'wss', 'ftp', 'file'
	    // 'ftps',
	    // 'data',
	    ],
	    schemeStarMatchesWs: true
	  }
	};
	config.presets = presets;
	const defaultOptions = Object.assign(Object.assign({}, presets.chrome), {
	  strict: true
	});
	config.defaultOptions = defaultOptions;
	return config;
}

var getExampleUrls = {};

var getDummyUrl = {};

var dist = {};

var regex = {};

var escaping = {};

var hasRequiredEscaping;

function requireEscaping () {
	if (hasRequiredEscaping) return escaping;
	hasRequiredEscaping = 1;

	Object.defineProperty(escaping, "__esModule", {
	  value: true
	});
	escaping.regexEscape = regexEscape;
	escaping.exact = exact;
	escaping.regexLength = regexLength;
	escaping.getContextAgnosticMap = void 0;

	var _regex = requireRegex();

	const asciis = Array.from({
	  length: 0x80
	}, (_, i) => String.fromCodePoint(i));

	const getChars = flags => {
	  // delete 'i' as it doesn't affect escaping and messes up matching logic
	  const flagSet = new Set(flags);
	  flagSet.delete('i');
	  flags = [...flagSet].join('');
	  return asciis.map(ch => {
	    const escaped = `\\x${ch.codePointAt(0).toString(16).padStart(2, '0')}`;
	    let inClass = escaped;
	    let outsideClass = escaped;
	    let agnostic = escaped;

	    try {
	      const inClassRe = new RegExp(`[${ch}]`, flags);
	      new RegExp(`[${ch}${ch}]`, flags);
	      new RegExp(`[${ch}${ch}\0]`, flags);

	      if (inClassRe.test(ch) && !asciis.filter(x => x !== ch).some(x => inClassRe.test(x))) {
	        inClass = ch;
	      } else {
	        new RegExp(`[\\${ch}]`, flags);
	        inClass = `\\${ch}`;
	      }
	    } catch (_a) {
	      try {
	        new RegExp(`[\\${ch}]`, flags);
	        inClass = `\\${ch}`;
	      } catch (_b) {}
	    }

	    try {
	      const outsideClassRe = new RegExp(`^${ch}$`, flags);

	      if (outsideClassRe.test(ch) && !asciis.filter(x => x !== ch).some(x => outsideClassRe.test(x))) {
	        outsideClass = ch;
	      } else {
	        new RegExp(`\\${ch}`, flags);
	        outsideClass = `\\${ch}`;
	      }
	    } catch (_c) {
	      try {
	        new RegExp(`\\${ch}`, flags);
	        outsideClass = `\\${ch}`;
	      } catch (_d) {}
	    }

	    if (inClass !== outsideClass) {
	      try {
	        new RegExp(`\\${ch}`, flags);
	        new RegExp(`\\${ch}`, flags);
	        agnostic = `\\${ch}`;
	      } catch (_e) {}
	    } else {
	      agnostic = [inClass, outsideClass].sort((a, b) => b.length - a.length)[0];
	    }

	    return {
	      ch,
	      agnostic,
	      inClass,
	      outsideClass
	    };
	  }).filter(x => x.inClass !== x.ch || x.outsideClass !== x.ch);
	};

	const cache = new Map();

	const getContextAgnosticMap = flags => {
	  const cached = cache.get(flags);

	  if (cached) {
	    return cached;
	  }

	  const obj = Object.fromEntries(getChars(flags).map(x => [x.ch, x.agnostic]));
	  cache.set(flags, obj);
	  return obj;
	};

	escaping.getContextAgnosticMap = getContextAgnosticMap;

	function regexEscape(input, flags = 'u') {
	  const contextAgnosticMap = getContextAgnosticMap(flags);
	  const chars = Object.values(contextAgnosticMap);

	  const replacer = str => str.replace(new RegExp(`[${chars.join('')}]`, [...new Set([...flags, ...'g'])].join('')), m => contextAgnosticMap[m]);

	  return new _regex.RegexFragment(replacer(input));
	}

	function exact(input, flags) {
	  return (0, _regex.regex)(flags)`${input}`;
	}
	/**
	 * Gives approximate logical "length" of a string, regex, or regex fragment, for
	 * use in sorting arrays to be used in alternation groups. Doesn't cover various
	 * edge cases or variable-length regexes (e.g. /a+/, /b{1,5}/, etc).
	 */


	function regexLength(input) {
	  return (// TODO?
	    // .replace(/\[[^\]]+\]/g, '.')
	    input // TODO?
	    // .replace(/(?<=[^\\](\\{2})*)\\b|[^$]/g, '')
	    .replace(/\\(?:\w\{[^}]+\}|u[0-9a-f]{4}|x[0-9a-f]{2}|[0-8]{3}|c[A-Z]|.)/gi, '.').length
	  );
	} // TODO?
	// export function regexUnescape(input: RegexFragment | string) {
	// 	return input.replace(/s/g)
	// }
	return escaping;
}

var hasRequiredRegex;

function requireRegex () {
	if (hasRequiredRegex) return regex;
	hasRequiredRegex = 1;

	Object.defineProperty(regex, "__esModule", {
	  value: true
	});
	regex.regex = regex$1;
	regex.LazyAlternation = regex.RegexFragment = void 0;

	var _escaping = requireEscaping();

	class RegexFragment extends String {}

	regex.RegexFragment = RegexFragment;

	class LazyAlternation extends Array {
	  constructor(...args) {
	    super(...(Array.isArray(args[0]) ? args[0] : args));
	  }

	}

	regex.LazyAlternation = LazyAlternation;
	const flagMap = {
	  global: 'g',
	  ignoreCase: 'i',
	  multiline: 'm',
	  dotAll: 's',
	  sticky: 'y',
	  unicode: 'u'
	};
	const commentRegex = /(\\*)#(.*)/g;

	const isContentful = x => x !== false && x != null;

	const commentReplacer = (_m, slashes, after) => {
	  /* If odd number of backslashes, one of them is esc char */
	  if (slashes.length % 2) {
	    return slashes.slice(1)
	    /* Consumes esc char */
	    + '#' + after.replace(commentRegex, commentReplacer);
	  }

	  return slashes;
	};

	const processSub = flags => sub => {
	  if (sub instanceof RegExp) {
	    if (sub.flags === flags) {
	      return sub.source;
	    } else {
	      const mapIn = (0, _escaping.getContextAgnosticMap)(sub.flags);
	      const mapOut = (0, _escaping.getContextAgnosticMap)(flags);
	      const diff = [];

	      for (const ch of Object.keys(mapIn)) {
	        // console.log({ mapIn, ch }, mapIn[ch])
	        if (mapIn[ch] !== mapOut[ch]) {
	          diff.push(mapIn[ch]);
	        }
	      }

	      for (const ch of Object.keys(mapOut)) {
	        if (mapIn[ch] !== mapOut[ch]) {
	          diff.push(ch);
	        }
	      }

	      const re = new RegExp(`(?:${diff.map(x => (0, _escaping.regexEscape)(x, 'i')).join('|')})`, 'gi');
	      return !diff.length ? sub.source : sub.source.replace(re, m => {
	        var _a;

	        return (_a = mapOut[m.startsWith('\\') ? m.slice(1) : m]) !== null && _a !== void 0 ? _a : m;
	      });
	    }
	  } else if (typeof sub === 'string') {
	    return (0, _escaping.regexEscape)(sub, flags);
	  } else {
	    return String(isContentful(sub) ? sub : '');
	  }
	};

	const _regex = (options = {}) => (template, ...substitutions) => {
	  let source = '';
	  let flagArr = [];

	  if (typeof options === 'string') {
	    flagArr = [...options];
	  } else {
	    Object.entries(flagMap).forEach(([k, v]) => {
	      if (options[k]) {
	        flagArr.push(v);
	      }
	    });
	  }

	  const flags = flagArr.sort((a, b) => a.localeCompare(b)).join('');
	  template.raw.forEach((segment, idx) => {
	    source += segment
	    /* Remove comments following unescaped # */
	    .replace(commentRegex, commentReplacer)
	    /*
	        Replace escaped ` with literal.
	        Must be odd number of backslashes
	        because otherwise would terminate the template string.
	    */
	    .replace(/\\`/g, '`')
	    /*
	        Escaped ${ is a no-op.
	        We use literal $ rather than regex $ (end-of-string)
	        because followed by {, thus cannot be end-of-string.
	    */
	    // .replace(/\\\${/g, '$&') // no-op

	    /* Collapse whitespace */
	    .replace(/(\\*)(\s+)/g, (_m, slashes, space) => {
	      /* If odd number of backslashes, one of them is esc char */
	      if (space[0] === ' ' && slashes.length % 2) {
	        /* Consumes esc char and escapes a single space char */

	        /* Escaping Tab, CR, LF not supported */

	        /* Use \t, \r, \n instead */
	        return slashes.slice(1) + space[0];
	      }

	      return slashes;
	    });
	    const sub = substitutions[idx];

	    if (Array.isArray(sub)) {
	      const mult = sub instanceof LazyAlternation ? -1 : 1;
	      source += `(?:${[...new Set([...sub.filter(isContentful).map(x => String(processSub(flags)(x)))])].sort((a, b) => mult * ((0, _escaping.regexLength)(b) - (0, _escaping.regexLength)(a))).join('|')})`;
	    } else {
	      source += processSub(flags)(sub);
	    }
	  });
	  return new RegExp(source, flags);
	};

	function regex$1(...args) {
	  if (Array.isArray(args[0])) {
	    const [template, ...substitutions] = args;
	    return _regex('')(template, ...substitutions);
	  } else {
	    const [flags] = args;
	    return _regex(flags);
	  }
	}
	return regex;
}

var unwrap = {};

var hasRequiredUnwrap;

function requireUnwrap () {
	if (hasRequiredUnwrap) return unwrap;
	hasRequiredUnwrap = 1;

	Object.defineProperty(unwrap, "__esModule", {
	  value: true
	});
	unwrap.unwrap = unwrap$1;

	var _regex = requireRegex();

	function unwrap$1(re, flags) {
	  const fragment = re.source.replace(/^\^?([\s\S]*?)\$?$/, '$1');
	  return (0, _regex.regex)(flags !== null && flags !== void 0 ? flags : re.flags)`${new _regex.RegexFragment(fragment)}`;
	}
	return unwrap;
}

var proxy = {};

var hasRequiredProxy;

function requireProxy () {
	if (hasRequiredProxy) return proxy;
	hasRequiredProxy = 1;

	Object.defineProperty(proxy, "__esModule", {
	  value: true
	});
	proxy.proxy = void 0;

	var _regex = requireRegex();

	const proxy$1 = new Proxy(_regex.regex, {
	  get(target, flags) {
	    return target(flags === '_' ? '' : flags);
	  },

	  apply(target, _thisArg, args) {
	    return target(...args);
	  }

	});
	proxy.proxy = proxy$1;
	return proxy;
}

var hasRequiredDist$1;

function requireDist$1 () {
	if (hasRequiredDist$1) return dist;
	hasRequiredDist$1 = 1;
	(function (exports$1) {

		Object.defineProperty(exports$1, "__esModule", {
		  value: true
		});
		Object.defineProperty(exports$1, "regex", {
		  enumerable: true,
		  get: function () {
		    return _regex.regex;
		  }
		});
		Object.defineProperty(exports$1, "RegexFragment", {
		  enumerable: true,
		  get: function () {
		    return _regex.RegexFragment;
		  }
		});
		Object.defineProperty(exports$1, "LazyAlternation", {
		  enumerable: true,
		  get: function () {
		    return _regex.LazyAlternation;
		  }
		});
		Object.defineProperty(exports$1, "exact", {
		  enumerable: true,
		  get: function () {
		    return _escaping.exact;
		  }
		});
		Object.defineProperty(exports$1, "regexEscape", {
		  enumerable: true,
		  get: function () {
		    return _escaping.regexEscape;
		  }
		});
		Object.defineProperty(exports$1, "unwrap", {
		  enumerable: true,
		  get: function () {
		    return _unwrap.unwrap;
		  }
		});
		Object.defineProperty(exports$1, "proxy", {
		  enumerable: true,
		  get: function () {
		    return _proxy.proxy;
		  }
		});

		var _regex = requireRegex();

		var _escaping = requireEscaping();

		var _unwrap = requireUnwrap();

		var _proxy = requireProxy(); 
	} (dist));
	return dist;
}

var hasRequiredGetDummyUrl;

function requireGetDummyUrl () {
	if (hasRequiredGetDummyUrl) return getDummyUrl;
	hasRequiredGetDummyUrl = 1;

	Object.defineProperty(getDummyUrl, "__esModule", {
	  value: true
	});
	getDummyUrl.getDummyUrl = getDummyUrl$1;
	var _fancyRegex = requireDist$1();
	const DELIMS = /^|$|[/?=&\-]/;
	function getDummyUrl$1(patternSegments, replacements = {}) {
	  const {
	    rawHost,
	    rawPathAndQuery
	  } = patternSegments;
	  const {
	    defaultScheme = 'https',
	    subdomain = '',
	    pathAndQueryReplacer = '',
	    rootDomain = 'example.com',
	    strict = true
	  } = replacements;
	  let host;
	  const scheme = patternSegments.scheme === '*' ? defaultScheme : patternSegments.scheme;
	  if (scheme === 'file') {
	    host = '';
	  } else if (rawHost === '*') {
	    host = [subdomain, rootDomain].filter(Boolean).join('.');
	  } else {
	    host = rawHost.replace(/^\*./, subdomain ? `${subdomain}.` : '');
	  }
	  const pathAndQuery = (strict ? rawPathAndQuery : '/*'
	  // start with hyphen-delimited
	  ).replace(/\*/g, `-${pathAndQueryReplacer}-`)
	  // remove consecutive hyphens and hyphens adjacent to delimiters
	  .replace((0, _fancyRegex.regex)('g')`-+(${DELIMS})`, '$1').replace((0, _fancyRegex.regex)('g')`(${DELIMS})-+`, '$1')
	  // remove consecutive slashes
	  .replace(/\/+/g, '/');
	  try {
	    return new URL(`${scheme}://${host}${pathAndQuery}`);
	  } catch (_e) {
	    return null;
	  }
	}
	return getDummyUrl;
}

var getPatternSegments = {};

var constants = {};

var hasRequiredConstants;

function requireConstants () {
	if (hasRequiredConstants) return constants;
	hasRequiredConstants = 1;

	Object.defineProperty(constants, "__esModule", {
	  value: true
	});
	constants.ALL_URLS = void 0;
	const ALL_URLS = '<all_urls>';
	constants.ALL_URLS = ALL_URLS;
	return constants;
}

var hasRequiredGetPatternSegments;

function requireGetPatternSegments () {
	if (hasRequiredGetPatternSegments) return getPatternSegments;
	hasRequiredGetPatternSegments = 1;

	Object.defineProperty(getPatternSegments, "__esModule", {
	  value: true
	});
	getPatternSegments.getPatternSegments = getPatternSegments$1;
	var _fancyRegex = requireDist$1();
	var _constants = requireConstants();
	const patternRegex = (0, _fancyRegex.regex)()`
	^
		(\*|\w+)      # scheme
		://
		(
			\*     |  # Any host
			[^/\#]*     # Only the given host (optional only if scheme is file)
		)
		(/[^\r\n\#]*) # path
	$
`;
	function getPatternSegments$1(pattern) {
	  if (pattern === _constants.ALL_URLS) {
	    return {
	      pattern,
	      scheme: '*',
	      rawHost: '*',
	      rawPathAndQuery: '/*'
	    };
	  }
	  const m = pattern.match(patternRegex);
	  if (!m) return null;
	  const [, /* fullMatch */scheme, rawHost, rawPathAndQuery] = m;
	  return {
	    pattern,
	    scheme,
	    rawHost,
	    rawPathAndQuery
	  };
	}
	return getPatternSegments;
}

var hasRequiredGetExampleUrls;

function requireGetExampleUrls () {
	if (hasRequiredGetExampleUrls) return getExampleUrls;
	hasRequiredGetExampleUrls = 1;

	Object.defineProperty(getExampleUrls, "__esModule", {
	  value: true
	});
	getExampleUrls.getExampleUrls = getExampleUrls$1;
	var _getDummyUrl = requireGetDummyUrl();
	var _getPatternSegments = requireGetPatternSegments();
	function getExampleUrls$1(pattern, options) {
	  const patternSegments = (0, _getPatternSegments.getPatternSegments)(pattern);
	  const {
	    supportedSchemes,
	    strict
	  } = options;
	  const subdomains = ['', 'www', 'foo.bar'];
	  const rootDomains = ['example.com'];
	  const pathAndQueryReplacers = ['', 'foo', '/bar/baz/'];
	  const all = supportedSchemes.flatMap(defaultScheme => subdomains.flatMap(subdomain => rootDomains.flatMap(rootDomain => pathAndQueryReplacers.flatMap(pathAndQueryReplacer => (0, _getDummyUrl.getDummyUrl)(patternSegments, {
	    defaultScheme,
	    subdomain,
	    rootDomain,
	    pathAndQueryReplacer,
	    strict
	  })))));
	  return [...new Set(all.filter(Boolean).map(url => url.href))];
	}
	return getExampleUrls;
}

var toMatcherOrError = {};

var getHostRegex = {};

var hasRequiredGetHostRegex;

function requireGetHostRegex () {
	if (hasRequiredGetHostRegex) return getHostRegex;
	hasRequiredGetHostRegex = 1;

	Object.defineProperty(getHostRegex, "__esModule", {
	  value: true
	});
	getHostRegex.getHostRegex = getHostRegex$1;
	var _fancyRegex = requireDist$1();
	var _getDummyUrl = requireGetDummyUrl();
	function getHostRegex$1(patternSegments) {
	  const {
	    pattern,
	    scheme,
	    rawHost
	  } = patternSegments;
	  if (!rawHost && scheme !== 'file') {
	    return new TypeError('Host is optional only if the scheme is "file".');
	  }
	  const isStarHost = rawHost.includes('*');
	  if (isStarHost) {
	    const segments = rawHost.split('*.');
	    if (rawHost.length > 1 && (segments.length !== 2 || segments[0] || !segments[1])) {
	      return new TypeError('Host can contain only one wildcard at the start, in the form "*.<host segments>"');
	    }
	  }
	  const dummyUrl = (0, _getDummyUrl.getDummyUrl)(patternSegments, {
	    subdomain: ''
	  });
	  if (!dummyUrl) {
	    return new TypeError(`Pattern "${pattern}" cannot be used to construct a valid URL.`);
	  }
	  const dummyHost = dummyUrl.host;
	  if (/:\d+$/.test(dummyHost)) {
	    return new TypeError(`Host "${rawHost}" cannot include a port number. All ports are matched by default.`);
	  }
	  if (/[^.a-z0-9\-]/.test(dummyHost)) {
	    return new TypeError(`Host "${rawHost}" contains invalid characters.`);
	  }
	  const host = isStarHost ? '*.' + dummyHost : dummyHost;
	  if (rawHost === '*') {
	    return /.+/;
	  } else if (host.startsWith('*.')) {
	    return (0, _fancyRegex.regex)()`
			^
				(?:[^.]+\.)*     # any number of dot-terminated segments
				${host.slice(2)}   # rest after leading *.
			$
		`;
	  } else {
	    return (0, _fancyRegex.regex)()`^${host}$`;
	  }
	}
	return getHostRegex;
}

var utils = {};

var hasRequiredUtils;

function requireUtils () {
	if (hasRequiredUtils) return utils;
	hasRequiredUtils = 1;

	Object.defineProperty(utils, "__esModule", {
	  value: true
	});
	utils.createMatchFn = createMatchFn;
	utils.normalizeUrlFragment = void 0;
	const normalizeUrlFragment = urlFragent => {
	  try {
	    return encodeURI(decodeURI(urlFragent));
	  } catch (e) {
	    return e;
	  }
	};
	utils.normalizeUrlFragment = normalizeUrlFragment;
	function createMatchFn(fn) {
	  return url => {
	    let normalizedUrl;
	    try {
	      const urlStr = url instanceof URL ? url.href : url;
	      normalizedUrl = new URL(urlStr);
	      const normalizedPathname = normalizeUrlFragment(normalizedUrl.pathname);
	      const normalizedSearch = normalizeUrlFragment(normalizedUrl.search);
	      if (normalizedPathname instanceof Error || normalizedSearch instanceof Error) {
	        return false;
	      }
	      normalizedUrl.pathname = normalizedPathname;
	      if (!normalizedUrl.href.endsWith('?')) {
	        // avoid nuking zero-search-string
	        normalizedUrl.search = normalizedSearch;
	      }
	    } catch (_e) {
	      return false;
	    }
	    return fn(normalizedUrl);
	  };
	}
	return utils;
}

var hasRequiredToMatcherOrError;

function requireToMatcherOrError () {
	if (hasRequiredToMatcherOrError) return toMatcherOrError;
	hasRequiredToMatcherOrError = 1;

	Object.defineProperty(toMatcherOrError, "__esModule", {
	  value: true
	});
	toMatcherOrError.toMatchFnOrError = toMatchFnOrError;
	var _fancyRegex = requireDist$1();
	var _constants = requireConstants();
	var _getHostRegex = requireGetHostRegex();
	var _getPatternSegments = requireGetPatternSegments();
	var _utils = requireUtils();
	function toMatchFnOrError(pattern, options) {
	  var _a;
	  const {
	    supportedSchemes,
	    schemeStarMatchesWs,
	    strict
	  } = options;
	  if (pattern === _constants.ALL_URLS) {
	    return (0, _utils.createMatchFn)(url => {
	      return (0, _fancyRegex.regex)()`
				^
					(?:${supportedSchemes})
					:
				$
			`.test(url.protocol);
	    });
	  }
	  const unsupportedScheme = (_a = pattern.match(/^(urn|data):/)) === null || _a === void 0 ? void 0 : _a[1];
	  if (unsupportedScheme) {
	    return new TypeError(`browser-extension-url-match does not currently support scheme "${unsupportedScheme}"`);
	  }
	  const patternSegments = (0, _getPatternSegments.getPatternSegments)(pattern);
	  if (!patternSegments) {
	    try {
	      const url = new URL(pattern);
	      if (url.hash || url.href.endsWith('#')) {
	        return new TypeError(`Pattern cannot contain a hash: "${pattern}" contains hash "${url.hash || '#'}"`);
	      }
	      if (!pattern.slice(url.origin.length).startsWith('/')) {
	        return new TypeError(`Pattern "${pattern}" does not contain a path. Use "${pattern}/*" to match any paths with that origin or "${pattern}/" to match that URL alone`);
	      }
	    } catch (_b) {
	      /* fall back to generic err */
	    }
	    return new TypeError(`Pattern "${pattern}" is invalid`);
	  }
	  const {
	    scheme,
	    rawPathAndQuery
	  } = patternSegments;
	  /* Scheme */
	  if (scheme !== '*' && !supportedSchemes.includes(scheme)) {
	    return new TypeError(`Scheme "${scheme}" is not supported`);
	  }
	  const schemeRegex = (0, _fancyRegex.regex)()`${scheme === '*' ? new _fancyRegex.RegexFragment(['https?', schemeStarMatchesWs && 'wss?'].filter(Boolean).join('|')) : scheme}:`;
	  /* Host */
	  const hostRegex = (0, _getHostRegex.getHostRegex)(patternSegments);
	  if (hostRegex instanceof Error) {
	    return hostRegex;
	  }
	  /* Path and query string */
	  // Non-strict used for host permissions.
	  // "The path must be present in a host permission, but is always treated as /*."
	  // See https://developer.chrome.com/docs/extensions/mv3/match_patterns/
	  const pathAndQuery = strict ? (0, _utils.normalizeUrlFragment)(rawPathAndQuery) : '/*';
	  if (pathAndQuery instanceof Error) {
	    return pathAndQuery;
	  }
	  const pathAndQueryRegex = (0, _fancyRegex.regex)()`^${new _fancyRegex.RegexFragment(pathAndQuery.split('*').map(x => (0, _fancyRegex.regexEscape)(x)).join('.*'))}$`;
	  return (0, _utils.createMatchFn)(url => {
	    // respect zero-search-string
	    const pathAndQuery = url.pathname + (url.href.endsWith('?') ? '?' : url.search);
	    return schemeRegex.test(url.protocol) &&
	    // test against `url.hostname`, not `url.host`, as port is ignored
	    hostRegex.test(url.hostname) && pathAndQueryRegex.test(pathAndQuery);
	  });
	}
	return toMatcherOrError;
}

var hasRequiredMatchPattern;

function requireMatchPattern () {
	if (hasRequiredMatchPattern) return matchPattern;
	hasRequiredMatchPattern = 1;

	Object.defineProperty(matchPattern, "__esModule", {
	  value: true
	});
	matchPattern.matchPattern = matchPattern$1;
	var _config = requireConfig();
	var _getExampleUrls = requireGetExampleUrls();
	var _toMatcherOrError = requireToMatcherOrError();
	function assertValid() {
	  if (!this.valid) {
	    throw new TypeError(this.error.message);
	  }
	  return this;
	}
	function _matchPattern(options) {
	  return pattern => {
	    const combinedOptions = Object.assign(Object.assign({}, _config.defaultOptions), options);
	    const val = (0, _toMatcherOrError.toMatchFnOrError)(pattern, combinedOptions);
	    return val instanceof Error ? {
	      valid: false,
	      error: val,
	      assertValid
	    } : {
	      valid: true,
	      match: val,
	      get examples() {
	        return (0, _getExampleUrls.getExampleUrls)(pattern, combinedOptions)
	        // sanity check - examples should all match
	        .filter(url => val(url))
	        // prevent example list from getting too long
	        .slice(0, 100);
	      },
	      patterns: [pattern],
	      config: combinedOptions,
	      assertValid
	    };
	  };
	}
	function allValid(matchers) {
	  return matchers.every(m => m.valid);
	}
	function matchPattern$1(pattern, options = {}) {
	  const patterns = typeof pattern === 'string' ? [pattern] : [...new Set(pattern)];
	  if (patterns.length === 1) return _matchPattern(options)(patterns[0]);
	  const matchers = patterns.map(_matchPattern(options));
	  if (allValid(matchers)) {
	    return {
	      valid: true,
	      get examples() {
	        return [...new Set(matchers.flatMap(m => m.examples))];
	      },
	      match: url => matchers.some(m => m.match(url)),
	      patterns,
	      config: options,
	      assertValid
	    };
	  } else {
	    const invalid = matchers.find(m => !m.valid);
	    return {
	      valid: false,
	      error: invalid.error,
	      assertValid
	    };
	  }
	}
	return matchPattern;
}

var hasRequiredDist;

function requireDist () {
	if (hasRequiredDist) return dist$1;
	hasRequiredDist = 1;
	(function (exports$1) {

		Object.defineProperty(exports$1, "__esModule", {
		  value: true
		});
		Object.defineProperty(exports$1, "matchPattern", {
		  enumerable: true,
		  get: function () {
		    return _matchPattern.matchPattern;
		  }
		});
		Object.defineProperty(exports$1, "presets", {
		  enumerable: true,
		  get: function () {
		    return _config.presets;
		  }
		});
		var _matchPattern = requireMatchPattern();
		var _config = requireConfig(); 
	} (dist$1));
	return dist$1;
}

var distExports = requireDist();

function withTrailingSlash(input = "", respectQueryAndFragment) {
  {
    return input.endsWith("/") ? input : input + "/";
  }
}
function parsePath(input = "") {
  const [pathname = "", search = "", hash = ""] = (input.match(/([^#?]*)(\?[^#]*)?(#.*)?/) || []).splice(1);
  return {
    pathname,
    search,
    hash
  };
}

function isValidPattern(pattern) {
  return distExports.matchPattern(pattern).valid;
}

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

function isMatchPattern(pattern, url = location.href, options = {}) {
  if (!isValidPattern(pattern)) return false;
  if (!isValidUrl(url)) return false;
  const { match } = distExports.matchPattern(pattern).assertValid();
  const targetUrl = options.processUrl ? withTrailingSlash(parsePath(url).pathname) : url;
  return match(targetUrl);
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

function scrollWithFixedOffset(el, offset) {
  const rect = el.getBoundingClientRect();
  const scrollTop = window.scrollY + rect.top - offset;
  window.scrollTo({ top: scrollTop, behavior: "smooth" });
}

const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));

const smoothScroll = (el, amount, options) => {
  return new Promise((resolve) => {
    let animationId;
    let timeoutId;
    let finalResult = null;
    const { timeout, onStart, onFinish } = options;
    const originalResolve = resolve;
    resolve = ((result) => {
      onFinish?.(result);
      originalResolve(result);
    });
    const finishScroll = (reason) => {
      if (animationId !== void 0) {
        cancelAnimationFrame(animationId);
      }
      if (timeoutId !== void 0) {
        clearTimeout(timeoutId);
      }
      finalResult = { reason };
    };
    if (timeout && timeout > 0) {
      timeoutId = setTimeout(() => {
        finishScroll("Timeout");
        if (finalResult) {
          resolve(finalResult);
        }
      }, timeout);
    }
    const direction = options.direction ?? "vertical";
    const isVertical = direction === "vertical";
    const mode = options.mode;
    const totalTargetDistance = amount;
    let absSpeedPerMs;
    if (mode === "duration") {
      const opts = options;
      const { duration, minSpeedPerMs, maxSpeedPerMs } = opts;
      absSpeedPerMs = flexibleClamp(
        Math.abs(totalTargetDistance / duration),
        { min: minSpeedPerMs, max: maxSpeedPerMs }
      );
      if (duration === 0) {
        if (isVertical) {
          el.scrollTop += totalTargetDistance;
        } else {
          el.scrollLeft += totalTargetDistance;
        }
        return finishScroll("Error");
      }
    } else if (mode === "speed") {
      const opts = options;
      const { speedPerMs } = opts;
      absSpeedPerMs = Math.abs(speedPerMs);
    } else {
      console.error("未定義のスクロールモードです。");
      return finishScroll("Error");
    }
    const sign = totalTargetDistance >= 0 ? 1 : -1;
    const plannedSpeedPerMs = absSpeedPerMs * sign;
    const getPosition = () => isVertical ? el.scrollTop : el.scrollLeft;
    let startTime = null;
    let previousTime = null;
    let previousFrameTime = null;
    const INTERVAL_MS = 1;
    const startPosition = getPosition();
    let previousPosition = startPosition;
    let totalActualMoved = 0;
    onStart?.();
    const animateFrame = (currentTime) => {
      if (startTime === null) {
        startTime = currentTime;
        previousTime = currentTime;
        previousFrameTime = currentTime;
        animationId = requestAnimationFrame(animateFrame);
        return;
      }
      const elapsed = currentTime - previousTime;
      if (previousFrameTime !== null && elapsed < INTERVAL_MS) {
        animationId = requestAnimationFrame(animateFrame);
        return;
      }
      previousFrameTime = currentTime;
      const remainingDistance = totalTargetDistance - totalActualMoved;
      let distanceToMove = plannedSpeedPerMs;
      if (sign === 1 && remainingDistance < plannedSpeedPerMs) {
        distanceToMove = remainingDistance;
      } else if (sign === -1 && remainingDistance > plannedSpeedPerMs) {
        distanceToMove = remainingDistance;
      } else if (remainingDistance === 0) {
        distanceToMove = 0;
      }
      if (isVertical) {
        el.scrollTop += distanceToMove;
      } else {
        el.scrollLeft += distanceToMove;
      }
      const currentPosition = getPosition();
      const actualMove = currentPosition - previousPosition;
      if (actualMove === 0) {
        finishScroll("ScrollStagnated");
        if (finalResult) resolve(finalResult);
        return;
      }
      totalActualMoved += actualMove;
      previousPosition = currentPosition;
      const isOverActualTarget = sign === -1 ? totalActualMoved <= totalTargetDistance : totalActualMoved >= totalTargetDistance;
      if (isOverActualTarget) {
        finishScroll("TargetReached");
        if (finalResult) resolve(finalResult);
        return;
      }
      previousTime = currentTime;
      animationId = requestAnimationFrame(animateFrame);
    };
    animationId = requestAnimationFrame(animateFrame);
  });
};

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

export { applyDefaultProperties, copyToClipboardText, elementWatch, filterProperties, flexibleClamp, getCurrentUrlMatchText, getFixedElementsTotalHeight, hiraToKana, isMatchPattern, isValidPattern, isValidRegex, isValidSelector, isValidUrl, kanaToFullWidth, kanaToHalfWidth, latinToZenkaku, normalizedWord, scrollWithFixedOffset, sleep, smoothScroll, traverseTextNodes, watchElementRemoval };
//# sourceMappingURL=index.js.map

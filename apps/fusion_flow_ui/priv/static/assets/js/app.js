(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // vendor/topbar.js
  var require_topbar = __commonJS({
    "vendor/topbar.js"(exports, module) {
      (function(window2, document2) {
        "use strict";
        var canvas, currentProgress, showing, progressTimerId = null, fadeTimerId = null, delayTimerId = null, addEvent = function(elem, type, handler) {
          if (elem.addEventListener) elem.addEventListener(type, handler, false);
          else if (elem.attachEvent) elem.attachEvent("on" + type, handler);
          else elem["on" + type] = handler;
        }, options = {
          autoRun: true,
          barThickness: 3,
          barColors: {
            0: "rgba(26,  188, 156, .9)",
            ".25": "rgba(52,  152, 219, .9)",
            ".50": "rgba(241, 196, 15,  .9)",
            ".75": "rgba(230, 126, 34,  .9)",
            "1.0": "rgba(211, 84,  0,   .9)"
          },
          shadowBlur: 10,
          shadowColor: "rgba(0,   0,   0,   .6)",
          className: null
        }, repaint = function() {
          canvas.width = window2.innerWidth;
          canvas.height = options.barThickness * 5;
          var ctx = canvas.getContext("2d");
          ctx.shadowBlur = options.shadowBlur;
          ctx.shadowColor = options.shadowColor;
          var lineGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          for (var stop in options.barColors)
            lineGradient.addColorStop(stop, options.barColors[stop]);
          ctx.lineWidth = options.barThickness;
          ctx.beginPath();
          ctx.moveTo(0, options.barThickness / 2);
          ctx.lineTo(
            Math.ceil(currentProgress * canvas.width),
            options.barThickness / 2
          );
          ctx.strokeStyle = lineGradient;
          ctx.stroke();
        }, createCanvas = function() {
          canvas = document2.createElement("canvas");
          var style = canvas.style;
          style.position = "fixed";
          style.top = style.left = style.right = style.margin = style.padding = 0;
          style.zIndex = 100001;
          style.display = "none";
          if (options.className) canvas.classList.add(options.className);
          addEvent(window2, "resize", repaint);
        }, topbar2 = {
          config: function(opts) {
            for (var key in opts)
              if (options.hasOwnProperty(key)) options[key] = opts[key];
          },
          show: function(delay) {
            if (showing) return;
            if (delay) {
              if (delayTimerId) return;
              delayTimerId = setTimeout(() => topbar2.show(), delay);
            } else {
              showing = true;
              if (fadeTimerId !== null) window2.cancelAnimationFrame(fadeTimerId);
              if (!canvas) createCanvas();
              if (!canvas.parentElement) document2.body.appendChild(canvas);
              canvas.style.opacity = 1;
              canvas.style.display = "block";
              topbar2.progress(0);
              if (options.autoRun) {
                (function loop() {
                  progressTimerId = window2.requestAnimationFrame(loop);
                  topbar2.progress(
                    "+" + 0.05 * Math.pow(1 - Math.sqrt(currentProgress), 2)
                  );
                })();
              }
            }
          },
          progress: function(to) {
            if (typeof to === "undefined") return currentProgress;
            if (typeof to === "string") {
              to = (to.indexOf("+") >= 0 || to.indexOf("-") >= 0 ? currentProgress : 0) + parseFloat(to);
            }
            currentProgress = to > 1 ? 1 : to;
            repaint();
            return currentProgress;
          },
          hide: function() {
            clearTimeout(delayTimerId);
            delayTimerId = null;
            if (!showing) return;
            showing = false;
            if (progressTimerId != null) {
              window2.cancelAnimationFrame(progressTimerId);
              progressTimerId = null;
            }
            (function loop() {
              if (topbar2.progress("+.1") >= 1) {
                canvas.style.opacity -= 0.05;
                if (canvas.style.opacity <= 0.05) {
                  canvas.style.display = "none";
                  fadeTimerId = null;
                  return;
                }
              }
              fadeTimerId = window2.requestAnimationFrame(loop);
            })();
          }
        };
        if (typeof module === "object" && typeof module.exports === "object") {
          module.exports = topbar2;
        } else if (typeof define === "function" && define.amd) {
          define(function() {
            return topbar2;
          });
        } else {
          this.topbar = topbar2;
        }
      }).call(exports, window, document);
    }
  });

  // node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js
  function asyncGeneratorStep(n5, t5, e7, r6, o6, a3, c5) {
    try {
      var i7 = n5[a3](c5), u5 = i7.value;
    } catch (n6) {
      return void e7(n6);
    }
    i7.done ? t5(u5) : Promise.resolve(u5).then(r6, o6);
  }
  function _asyncToGenerator(n5) {
    return function() {
      var t5 = this, e7 = arguments;
      return new Promise(function(r6, o6) {
        var a3 = n5.apply(t5, e7);
        function _next(n6) {
          asyncGeneratorStep(a3, r6, o6, _next, _throw, "next", n6);
        }
        function _throw(n6) {
          asyncGeneratorStep(a3, r6, o6, _next, _throw, "throw", n6);
        }
        _next(void 0);
      });
    };
  }
  var init_asyncToGenerator = __esm({
    "node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js"() {
    }
  });

  // node_modules/@babel/runtime/helpers/esm/classCallCheck.js
  function _classCallCheck(a3, n5) {
    if (!(a3 instanceof n5)) throw new TypeError("Cannot call a class as a function");
  }
  var init_classCallCheck = __esm({
    "node_modules/@babel/runtime/helpers/esm/classCallCheck.js"() {
    }
  });

  // node_modules/@babel/runtime/helpers/esm/typeof.js
  function _typeof(o6) {
    "@babel/helpers - typeof";
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o7) {
      return typeof o7;
    } : function(o7) {
      return o7 && "function" == typeof Symbol && o7.constructor === Symbol && o7 !== Symbol.prototype ? "symbol" : typeof o7;
    }, _typeof(o6);
  }
  var init_typeof = __esm({
    "node_modules/@babel/runtime/helpers/esm/typeof.js"() {
    }
  });

  // node_modules/@babel/runtime/helpers/esm/toPrimitive.js
  function toPrimitive(t5, r6) {
    if ("object" != _typeof(t5) || !t5) return t5;
    var e7 = t5[Symbol.toPrimitive];
    if (void 0 !== e7) {
      var i7 = e7.call(t5, r6 || "default");
      if ("object" != _typeof(i7)) return i7;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r6 ? String : Number)(t5);
  }
  var init_toPrimitive = __esm({
    "node_modules/@babel/runtime/helpers/esm/toPrimitive.js"() {
      init_typeof();
    }
  });

  // node_modules/@babel/runtime/helpers/esm/toPropertyKey.js
  function toPropertyKey(t5) {
    var i7 = toPrimitive(t5, "string");
    return "symbol" == _typeof(i7) ? i7 : i7 + "";
  }
  var init_toPropertyKey = __esm({
    "node_modules/@babel/runtime/helpers/esm/toPropertyKey.js"() {
      init_typeof();
      init_toPrimitive();
    }
  });

  // node_modules/@babel/runtime/helpers/esm/createClass.js
  function _defineProperties(e7, r6) {
    for (var t5 = 0; t5 < r6.length; t5++) {
      var o6 = r6[t5];
      o6.enumerable = o6.enumerable || false, o6.configurable = true, "value" in o6 && (o6.writable = true), Object.defineProperty(e7, toPropertyKey(o6.key), o6);
    }
  }
  function _createClass(e7, r6, t5) {
    return r6 && _defineProperties(e7.prototype, r6), t5 && _defineProperties(e7, t5), Object.defineProperty(e7, "prototype", {
      writable: false
    }), e7;
  }
  var init_createClass = __esm({
    "node_modules/@babel/runtime/helpers/esm/createClass.js"() {
      init_toPropertyKey();
    }
  });

  // node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
  function _assertThisInitialized(e7) {
    if (void 0 === e7) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    return e7;
  }
  var init_assertThisInitialized = __esm({
    "node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js"() {
    }
  });

  // node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js
  function _possibleConstructorReturn(t5, e7) {
    if (e7 && ("object" == _typeof(e7) || "function" == typeof e7)) return e7;
    if (void 0 !== e7) throw new TypeError("Derived constructors may only return object or undefined");
    return _assertThisInitialized(t5);
  }
  var init_possibleConstructorReturn = __esm({
    "node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js"() {
      init_typeof();
      init_assertThisInitialized();
    }
  });

  // node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js
  function _getPrototypeOf(t5) {
    return _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(t6) {
      return t6.__proto__ || Object.getPrototypeOf(t6);
    }, _getPrototypeOf(t5);
  }
  var init_getPrototypeOf = __esm({
    "node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js"() {
    }
  });

  // node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
  function _setPrototypeOf(t5, e7) {
    return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(t6, e8) {
      return t6.__proto__ = e8, t6;
    }, _setPrototypeOf(t5, e7);
  }
  var init_setPrototypeOf = __esm({
    "node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js"() {
    }
  });

  // node_modules/@babel/runtime/helpers/esm/inherits.js
  function _inherits(t5, e7) {
    if ("function" != typeof e7 && null !== e7) throw new TypeError("Super expression must either be null or a function");
    t5.prototype = Object.create(e7 && e7.prototype, {
      constructor: {
        value: t5,
        writable: true,
        configurable: true
      }
    }), Object.defineProperty(t5, "prototype", {
      writable: false
    }), e7 && _setPrototypeOf(t5, e7);
  }
  var init_inherits = __esm({
    "node_modules/@babel/runtime/helpers/esm/inherits.js"() {
      init_setPrototypeOf();
    }
  });

  // node_modules/@babel/runtime/helpers/esm/defineProperty.js
  function _defineProperty(e7, r6, t5) {
    return (r6 = toPropertyKey(r6)) in e7 ? Object.defineProperty(e7, r6, {
      value: t5,
      enumerable: true,
      configurable: true,
      writable: true
    }) : e7[r6] = t5, e7;
  }
  var init_defineProperty = __esm({
    "node_modules/@babel/runtime/helpers/esm/defineProperty.js"() {
      init_toPropertyKey();
    }
  });

  // node_modules/@babel/runtime/helpers/OverloadYield.js
  var require_OverloadYield = __commonJS({
    "node_modules/@babel/runtime/helpers/OverloadYield.js"(exports, module) {
      function _OverloadYield(e7, d3) {
        this.v = e7, this.k = d3;
      }
      module.exports = _OverloadYield, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/@babel/runtime/helpers/regeneratorDefine.js
  var require_regeneratorDefine = __commonJS({
    "node_modules/@babel/runtime/helpers/regeneratorDefine.js"(exports, module) {
      function _regeneratorDefine(e7, r6, n5, t5) {
        var i7 = Object.defineProperty;
        try {
          i7({}, "", {});
        } catch (e8) {
          i7 = 0;
        }
        module.exports = _regeneratorDefine = function regeneratorDefine(e8, r7, n6, t6) {
          function o6(r8, n7) {
            _regeneratorDefine(e8, r8, function(e9) {
              return this._invoke(r8, n7, e9);
            });
          }
          r7 ? i7 ? i7(e8, r7, {
            value: n6,
            enumerable: !t6,
            configurable: !t6,
            writable: !t6
          }) : e8[r7] = n6 : (o6("next", 0), o6("throw", 1), o6("return", 2));
        }, module.exports.__esModule = true, module.exports["default"] = module.exports, _regeneratorDefine(e7, r6, n5, t5);
      }
      module.exports = _regeneratorDefine, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/@babel/runtime/helpers/regenerator.js
  var require_regenerator = __commonJS({
    "node_modules/@babel/runtime/helpers/regenerator.js"(exports, module) {
      var regeneratorDefine = require_regeneratorDefine();
      function _regenerator() {
        var e7, t5, r6 = "function" == typeof Symbol ? Symbol : {}, n5 = r6.iterator || "@@iterator", o6 = r6.toStringTag || "@@toStringTag";
        function i7(r7, n6, o7, i8) {
          var c6 = n6 && n6.prototype instanceof Generator ? n6 : Generator, u6 = Object.create(c6.prototype);
          return regeneratorDefine(u6, "_invoke", function(r8, n7, o8) {
            var i9, c7, u7, f4 = 0, p4 = o8 || [], y3 = false, G = {
              p: 0,
              n: 0,
              v: e7,
              a: d3,
              f: d3.bind(e7, 4),
              d: function d4(t6, r9) {
                return i9 = t6, c7 = 0, u7 = e7, G.n = r9, a3;
              }
            };
            function d3(r9, n8) {
              for (c7 = r9, u7 = n8, t5 = 0; !y3 && f4 && !o9 && t5 < p4.length; t5++) {
                var o9, i10 = p4[t5], d4 = G.p, l3 = i10[2];
                r9 > 3 ? (o9 = l3 === n8) && (u7 = i10[(c7 = i10[4]) ? 5 : (c7 = 3, 3)], i10[4] = i10[5] = e7) : i10[0] <= d4 && ((o9 = r9 < 2 && d4 < i10[1]) ? (c7 = 0, G.v = n8, G.n = i10[1]) : d4 < l3 && (o9 = r9 < 3 || i10[0] > n8 || n8 > l3) && (i10[4] = r9, i10[5] = n8, G.n = l3, c7 = 0));
              }
              if (o9 || r9 > 1) return a3;
              throw y3 = true, n8;
            }
            return function(o9, p5, l3) {
              if (f4 > 1) throw TypeError("Generator is already running");
              for (y3 && 1 === p5 && d3(p5, l3), c7 = p5, u7 = l3; (t5 = c7 < 2 ? e7 : u7) || !y3; ) {
                i9 || (c7 ? c7 < 3 ? (c7 > 1 && (G.n = -1), d3(c7, u7)) : G.n = u7 : G.v = u7);
                try {
                  if (f4 = 2, i9) {
                    if (c7 || (o9 = "next"), t5 = i9[o9]) {
                      if (!(t5 = t5.call(i9, u7))) throw TypeError("iterator result is not an object");
                      if (!t5.done) return t5;
                      u7 = t5.value, c7 < 2 && (c7 = 0);
                    } else 1 === c7 && (t5 = i9["return"]) && t5.call(i9), c7 < 2 && (u7 = TypeError("The iterator does not provide a '" + o9 + "' method"), c7 = 1);
                    i9 = e7;
                  } else if ((t5 = (y3 = G.n < 0) ? u7 : r8.call(n7, G)) !== a3) break;
                } catch (t6) {
                  i9 = e7, c7 = 1, u7 = t6;
                } finally {
                  f4 = 1;
                }
              }
              return {
                value: t5,
                done: y3
              };
            };
          }(r7, o7, i8), true), u6;
        }
        var a3 = {};
        function Generator() {
        }
        function GeneratorFunction() {
        }
        function GeneratorFunctionPrototype() {
        }
        t5 = Object.getPrototypeOf;
        var c5 = [][n5] ? t5(t5([][n5]())) : (regeneratorDefine(t5 = {}, n5, function() {
          return this;
        }), t5), u5 = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c5);
        function f3(e8) {
          return Object.setPrototypeOf ? Object.setPrototypeOf(e8, GeneratorFunctionPrototype) : (e8.__proto__ = GeneratorFunctionPrototype, regeneratorDefine(e8, o6, "GeneratorFunction")), e8.prototype = Object.create(u5), e8;
        }
        return GeneratorFunction.prototype = GeneratorFunctionPrototype, regeneratorDefine(u5, "constructor", GeneratorFunctionPrototype), regeneratorDefine(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", regeneratorDefine(GeneratorFunctionPrototype, o6, "GeneratorFunction"), regeneratorDefine(u5), regeneratorDefine(u5, o6, "Generator"), regeneratorDefine(u5, n5, function() {
          return this;
        }), regeneratorDefine(u5, "toString", function() {
          return "[object Generator]";
        }), (module.exports = _regenerator = function _regenerator2() {
          return {
            w: i7,
            m: f3
          };
        }, module.exports.__esModule = true, module.exports["default"] = module.exports)();
      }
      module.exports = _regenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/@babel/runtime/helpers/regeneratorAsyncIterator.js
  var require_regeneratorAsyncIterator = __commonJS({
    "node_modules/@babel/runtime/helpers/regeneratorAsyncIterator.js"(exports, module) {
      var OverloadYield = require_OverloadYield();
      var regeneratorDefine = require_regeneratorDefine();
      function AsyncIterator(t5, e7) {
        function n5(r7, o6, i7, f3) {
          try {
            var c5 = t5[r7](o6), u5 = c5.value;
            return u5 instanceof OverloadYield ? e7.resolve(u5.v).then(function(t6) {
              n5("next", t6, i7, f3);
            }, function(t6) {
              n5("throw", t6, i7, f3);
            }) : e7.resolve(u5).then(function(t6) {
              c5.value = t6, i7(c5);
            }, function(t6) {
              return n5("throw", t6, i7, f3);
            });
          } catch (t6) {
            f3(t6);
          }
        }
        var r6;
        this.next || (regeneratorDefine(AsyncIterator.prototype), regeneratorDefine(AsyncIterator.prototype, "function" == typeof Symbol && Symbol.asyncIterator || "@asyncIterator", function() {
          return this;
        })), regeneratorDefine(this, "_invoke", function(t6, o6, i7) {
          function f3() {
            return new e7(function(e8, r7) {
              n5(t6, i7, e8, r7);
            });
          }
          return r6 = r6 ? r6.then(f3, f3) : f3();
        }, true);
      }
      module.exports = AsyncIterator, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/@babel/runtime/helpers/regeneratorAsyncGen.js
  var require_regeneratorAsyncGen = __commonJS({
    "node_modules/@babel/runtime/helpers/regeneratorAsyncGen.js"(exports, module) {
      var regenerator = require_regenerator();
      var regeneratorAsyncIterator = require_regeneratorAsyncIterator();
      function _regeneratorAsyncGen(r6, e7, t5, o6, n5) {
        return new regeneratorAsyncIterator(regenerator().w(r6, e7, t5, o6), n5 || Promise);
      }
      module.exports = _regeneratorAsyncGen, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/@babel/runtime/helpers/regeneratorAsync.js
  var require_regeneratorAsync = __commonJS({
    "node_modules/@babel/runtime/helpers/regeneratorAsync.js"(exports, module) {
      var regeneratorAsyncGen = require_regeneratorAsyncGen();
      function _regeneratorAsync(n5, e7, r6, t5, o6) {
        var a3 = regeneratorAsyncGen(n5, e7, r6, t5, o6);
        return a3.next().then(function(n6) {
          return n6.done ? n6.value : a3.next();
        });
      }
      module.exports = _regeneratorAsync, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/@babel/runtime/helpers/regeneratorKeys.js
  var require_regeneratorKeys = __commonJS({
    "node_modules/@babel/runtime/helpers/regeneratorKeys.js"(exports, module) {
      function _regeneratorKeys(e7) {
        var n5 = Object(e7), r6 = [];
        for (var t5 in n5) r6.unshift(t5);
        return function e8() {
          for (; r6.length; ) if ((t5 = r6.pop()) in n5) return e8.value = t5, e8.done = false, e8;
          return e8.done = true, e8;
        };
      }
      module.exports = _regeneratorKeys, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/@babel/runtime/helpers/typeof.js
  var require_typeof = __commonJS({
    "node_modules/@babel/runtime/helpers/typeof.js"(exports, module) {
      function _typeof2(o6) {
        "@babel/helpers - typeof";
        return module.exports = _typeof2 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o7) {
          return typeof o7;
        } : function(o7) {
          return o7 && "function" == typeof Symbol && o7.constructor === Symbol && o7 !== Symbol.prototype ? "symbol" : typeof o7;
        }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof2(o6);
      }
      module.exports = _typeof2, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/@babel/runtime/helpers/regeneratorValues.js
  var require_regeneratorValues = __commonJS({
    "node_modules/@babel/runtime/helpers/regeneratorValues.js"(exports, module) {
      var _typeof2 = require_typeof()["default"];
      function _regeneratorValues(e7) {
        if (null != e7) {
          var t5 = e7["function" == typeof Symbol && Symbol.iterator || "@@iterator"], r6 = 0;
          if (t5) return t5.call(e7);
          if ("function" == typeof e7.next) return e7;
          if (!isNaN(e7.length)) return {
            next: function next() {
              return e7 && r6 >= e7.length && (e7 = void 0), {
                value: e7 && e7[r6++],
                done: !e7
              };
            }
          };
        }
        throw new TypeError(_typeof2(e7) + " is not iterable");
      }
      module.exports = _regeneratorValues, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/@babel/runtime/helpers/regeneratorRuntime.js
  var require_regeneratorRuntime = __commonJS({
    "node_modules/@babel/runtime/helpers/regeneratorRuntime.js"(exports, module) {
      var OverloadYield = require_OverloadYield();
      var regenerator = require_regenerator();
      var regeneratorAsync = require_regeneratorAsync();
      var regeneratorAsyncGen = require_regeneratorAsyncGen();
      var regeneratorAsyncIterator = require_regeneratorAsyncIterator();
      var regeneratorKeys = require_regeneratorKeys();
      var regeneratorValues = require_regeneratorValues();
      function _regeneratorRuntime6() {
        "use strict";
        var r6 = regenerator(), e7 = r6.m(_regeneratorRuntime6), t5 = (Object.getPrototypeOf ? Object.getPrototypeOf(e7) : e7.__proto__).constructor;
        function n5(r7) {
          var e8 = "function" == typeof r7 && r7.constructor;
          return !!e8 && (e8 === t5 || "GeneratorFunction" === (e8.displayName || e8.name));
        }
        var o6 = {
          "throw": 1,
          "return": 2,
          "break": 3,
          "continue": 3
        };
        function a3(r7) {
          var e8, t6;
          return function(n6) {
            e8 || (e8 = {
              stop: function stop() {
                return t6(n6.a, 2);
              },
              "catch": function _catch() {
                return n6.v;
              },
              abrupt: function abrupt(r8, e9) {
                return t6(n6.a, o6[r8], e9);
              },
              delegateYield: function delegateYield(r8, o7, a4) {
                return e8.resultName = o7, t6(n6.d, regeneratorValues(r8), a4);
              },
              finish: function finish(r8) {
                return t6(n6.f, r8);
              }
            }, t6 = function t7(r8, _t, o7) {
              n6.p = e8.prev, n6.n = e8.next;
              try {
                return r8(_t, o7);
              } finally {
                e8.next = n6.n;
              }
            }), e8.resultName && (e8[e8.resultName] = n6.v, e8.resultName = void 0), e8.sent = n6.v, e8.next = n6.n;
            try {
              return r7.call(this, e8);
            } finally {
              n6.p = e8.prev, n6.n = e8.next;
            }
          };
        }
        return (module.exports = _regeneratorRuntime6 = function _regeneratorRuntime7() {
          return {
            wrap: function wrap(e8, t6, n6, o7) {
              return r6.w(a3(e8), t6, n6, o7 && o7.reverse());
            },
            isGeneratorFunction: n5,
            mark: r6.m,
            awrap: function awrap(r7, e8) {
              return new OverloadYield(r7, e8);
            },
            AsyncIterator: regeneratorAsyncIterator,
            async: function async(r7, e8, t6, o7, u5) {
              return (n5(e8) ? regeneratorAsyncGen : regeneratorAsync)(a3(r7), e8, t6, o7, u5);
            },
            keys: regeneratorKeys,
            values: regeneratorValues
          };
        }, module.exports.__esModule = true, module.exports["default"] = module.exports)();
      }
      module.exports = _regeneratorRuntime6, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
  });

  // node_modules/@babel/runtime/regenerator/index.js
  var require_regenerator2 = __commonJS({
    "node_modules/@babel/runtime/regenerator/index.js"(exports, module) {
      var runtime = require_regeneratorRuntime()();
      module.exports = runtime;
      try {
        regeneratorRuntime = runtime;
      } catch (accidentalStrictMode) {
        if (typeof globalThis === "object") {
          globalThis.regeneratorRuntime = runtime;
        } else {
          Function("r", "regeneratorRuntime = r")(runtime);
        }
      }
    }
  });

  // node_modules/rete/rete.esm.js
  function _createForOfIteratorHelper$1(r6, e7) {
    var t5 = "undefined" != typeof Symbol && r6[Symbol.iterator] || r6["@@iterator"];
    if (!t5) {
      if (Array.isArray(r6) || (t5 = _unsupportedIterableToArray$1(r6)) || e7 && r6 && "number" == typeof r6.length) {
        t5 && (r6 = t5);
        var _n = 0, F = function F2() {
        };
        return { s: F, n: function n5() {
          return _n >= r6.length ? { done: true } : { done: false, value: r6[_n++] };
        }, e: function e8(r7) {
          throw r7;
        }, f: F };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var o6, a3 = true, u5 = false;
    return { s: function s5() {
      t5 = t5.call(r6);
    }, n: function n5() {
      var r7 = t5.next();
      return a3 = r7.done, r7;
    }, e: function e8(r7) {
      u5 = true, o6 = r7;
    }, f: function f3() {
      try {
        a3 || null == t5["return"] || t5["return"]();
      } finally {
        if (u5) throw o6;
      }
    } };
  }
  function _unsupportedIterableToArray$1(r6, a3) {
    if (r6) {
      if ("string" == typeof r6) return _arrayLikeToArray$1(r6, a3);
      var t5 = {}.toString.call(r6).slice(8, -1);
      return "Object" === t5 && r6.constructor && (t5 = r6.constructor.name), "Map" === t5 || "Set" === t5 ? Array.from(r6) : "Arguments" === t5 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t5) ? _arrayLikeToArray$1(r6, a3) : void 0;
    }
  }
  function _arrayLikeToArray$1(r6, a3) {
    (null == a3 || a3 > r6.length) && (a3 = r6.length);
    for (var e7 = 0, n5 = Array(a3); e7 < a3; e7++) n5[e7] = r6[e7];
    return n5;
  }
  function useHelper() {
    return {
      debug: function debug2(_f) {
      }
    };
  }
  function _createForOfIteratorHelper(r6, e7) {
    var t5 = "undefined" != typeof Symbol && r6[Symbol.iterator] || r6["@@iterator"];
    if (!t5) {
      if (Array.isArray(r6) || (t5 = _unsupportedIterableToArray(r6)) || e7 && r6 && "number" == typeof r6.length) {
        t5 && (r6 = t5);
        var _n = 0, F = function F2() {
        };
        return { s: F, n: function n5() {
          return _n >= r6.length ? { done: true } : { done: false, value: r6[_n++] };
        }, e: function e8(r7) {
          throw r7;
        }, f: F };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var o6, a3 = true, u5 = false;
    return { s: function s5() {
      t5 = t5.call(r6);
    }, n: function n5() {
      var r7 = t5.next();
      return a3 = r7.done, r7;
    }, e: function e8(r7) {
      u5 = true, o6 = r7;
    }, f: function f3() {
      try {
        a3 || null == t5["return"] || t5["return"]();
      } finally {
        if (u5) throw o6;
      }
    } };
  }
  function _unsupportedIterableToArray(r6, a3) {
    if (r6) {
      if ("string" == typeof r6) return _arrayLikeToArray(r6, a3);
      var t5 = {}.toString.call(r6).slice(8, -1);
      return "Object" === t5 && r6.constructor && (t5 = r6.constructor.name), "Map" === t5 || "Set" === t5 ? Array.from(r6) : "Arguments" === t5 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t5) ? _arrayLikeToArray(r6, a3) : void 0;
    }
  }
  function _arrayLikeToArray(r6, a3) {
    (null == a3 || a3 > r6.length) && (a3 = r6.length);
    for (var e7 = 0, n5 = Array(a3); e7 < a3; e7++) n5[e7] = r6[e7];
    return n5;
  }
  function _callSuper$1(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$1() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$1() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$1 = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function getUID() {
    if ("randomBytes" in crypto) {
      return crypto.randomBytes(8).toString("hex");
    }
    var bytes = crypto.getRandomValues(new Uint8Array(8));
    var array = Array.from(bytes);
    var hexPairs = array.map(function(b3) {
      return b3.toString(16).padStart(2, "0");
    });
    return hexPairs.join("");
  }
  function _callSuper(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  var import_regenerator, Signal, Scope, NodeEditor, crypto, Socket2, Port, Input, Output, Control, InputControl, Node2, Connection, classic;
  var init_rete_esm = __esm({
    "node_modules/rete/rete.esm.js"() {
      init_asyncToGenerator();
      init_classCallCheck();
      init_createClass();
      init_possibleConstructorReturn();
      init_getPrototypeOf();
      init_inherits();
      init_defineProperty();
      import_regenerator = __toESM(require_regenerator2());
      Signal = /* @__PURE__ */ function() {
        function Signal2() {
          _classCallCheck(this, Signal2);
          _defineProperty(this, "pipes", []);
        }
        return _createClass(Signal2, [{
          key: "addPipe",
          value: function addPipe(pipe) {
            this.pipes.push(pipe);
          }
        }, {
          key: "emit",
          value: function() {
            var _emit = _asyncToGenerator(/* @__PURE__ */ import_regenerator.default.mark(function _callee(context) {
              var current, _iterator, _step, pipe;
              return import_regenerator.default.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    current = context;
                    _iterator = _createForOfIteratorHelper$1(this.pipes);
                    _context.prev = 2;
                    _iterator.s();
                  case 4:
                    if ((_step = _iterator.n()).done) {
                      _context.next = 13;
                      break;
                    }
                    pipe = _step.value;
                    _context.next = 8;
                    return pipe(current);
                  case 8:
                    current = _context.sent;
                    if (!(typeof current === "undefined")) {
                      _context.next = 11;
                      break;
                    }
                    return _context.abrupt("return");
                  case 11:
                    _context.next = 4;
                    break;
                  case 13:
                    _context.next = 18;
                    break;
                  case 15:
                    _context.prev = 15;
                    _context.t0 = _context["catch"](2);
                    _iterator.e(_context.t0);
                  case 18:
                    _context.prev = 18;
                    _iterator.f();
                    return _context.finish(18);
                  case 21:
                    return _context.abrupt("return", current);
                  case 22:
                  case "end":
                    return _context.stop();
                }
              }, _callee, this, [[2, 15, 18, 21]]);
            }));
            function emit(_x) {
              return _emit.apply(this, arguments);
            }
            return emit;
          }()
        }]);
      }();
      Scope = /* @__PURE__ */ function() {
        function Scope2(name) {
          _classCallCheck(this, Scope2);
          _defineProperty(this, "signal", new Signal());
          this.name = name;
        }
        return _createClass(Scope2, [{
          key: "addPipe",
          value: function addPipe(middleware) {
            this.signal.addPipe(middleware);
          }
        }, {
          key: "use",
          value: function use(scope) {
            if (!(scope instanceof Scope2)) throw new Error("cannot use non-Scope instance");
            scope.setParent(this);
            this.addPipe(function(context) {
              return scope.signal.emit(context);
            });
            return useHelper();
          }
        }, {
          key: "setParent",
          value: function setParent(scope) {
            this.parent = scope;
          }
        }, {
          key: "emit",
          value: function emit(context) {
            return this.signal.emit(context);
          }
        }, {
          key: "hasParent",
          value: function hasParent() {
            return Boolean(this.parent);
          }
        }, {
          key: "parentScope",
          value: function parentScope(type) {
            if (!this.parent) throw new Error("cannot find parent");
            if (type && this.parent instanceof type) return this.parent;
            if (type) throw new Error("actual parent is not instance of type");
            return this.parent;
          }
        }]);
      }();
      NodeEditor = /* @__PURE__ */ function(_Scope) {
        function NodeEditor2() {
          var _this;
          _classCallCheck(this, NodeEditor2);
          _this = _callSuper$1(this, NodeEditor2, ["NodeEditor"]);
          _defineProperty(_this, "nodes", []);
          _defineProperty(_this, "connections", []);
          return _this;
        }
        _inherits(NodeEditor2, _Scope);
        return _createClass(NodeEditor2, [{
          key: "getNode",
          value: function getNode(id) {
            return this.nodes.find(function(node) {
              return node.id === id;
            });
          }
          /**
           * Get all nodes
           * @returns Copy of array with nodes
           */
        }, {
          key: "getNodes",
          value: function getNodes() {
            return this.nodes.slice();
          }
          /**
           * Get all connections
           * @returns Copy of array with onnections
           */
        }, {
          key: "getConnections",
          value: function getConnections() {
            return this.connections.slice();
          }
          /**
           * Get a connection by id
           * @param id - The connection id
           * @returns The connection or undefined
           */
        }, {
          key: "getConnection",
          value: function getConnection(id) {
            return this.connections.find(function(connection) {
              return connection.id === id;
            });
          }
          /**
           * Add a node
           * @param data - The node data
           * @returns Whether the node was added
           * @throws If the node has already been added
           * @emits nodecreate
           * @emits nodecreated
           */
        }, {
          key: "addNode",
          value: function() {
            var _addNode = _asyncToGenerator(/* @__PURE__ */ import_regenerator.default.mark(function _callee(data) {
              return import_regenerator.default.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    if (!this.getNode(data.id)) {
                      _context.next = 2;
                      break;
                    }
                    throw new Error("node has already been added");
                  case 2:
                    _context.next = 4;
                    return this.emit({
                      type: "nodecreate",
                      data
                    });
                  case 4:
                    if (_context.sent) {
                      _context.next = 6;
                      break;
                    }
                    return _context.abrupt("return", false);
                  case 6:
                    this.nodes.push(data);
                    _context.next = 9;
                    return this.emit({
                      type: "nodecreated",
                      data
                    });
                  case 9:
                    return _context.abrupt("return", true);
                  case 10:
                  case "end":
                    return _context.stop();
                }
              }, _callee, this);
            }));
            function addNode(_x) {
              return _addNode.apply(this, arguments);
            }
            return addNode;
          }()
        }, {
          key: "addConnection",
          value: function() {
            var _addConnection = _asyncToGenerator(/* @__PURE__ */ import_regenerator.default.mark(function _callee2(data) {
              return import_regenerator.default.wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!this.getConnection(data.id)) {
                      _context2.next = 2;
                      break;
                    }
                    throw new Error("connection has already been added");
                  case 2:
                    _context2.next = 4;
                    return this.emit({
                      type: "connectioncreate",
                      data
                    });
                  case 4:
                    if (_context2.sent) {
                      _context2.next = 6;
                      break;
                    }
                    return _context2.abrupt("return", false);
                  case 6:
                    this.connections.push(data);
                    _context2.next = 9;
                    return this.emit({
                      type: "connectioncreated",
                      data
                    });
                  case 9:
                    return _context2.abrupt("return", true);
                  case 10:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2, this);
            }));
            function addConnection(_x2) {
              return _addConnection.apply(this, arguments);
            }
            return addConnection;
          }()
        }, {
          key: "removeNode",
          value: function() {
            var _removeNode = _asyncToGenerator(/* @__PURE__ */ import_regenerator.default.mark(function _callee3(id) {
              var node, index4;
              return import_regenerator.default.wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    node = this.nodes.find(function(n5) {
                      return n5.id === id;
                    });
                    if (node) {
                      _context3.next = 3;
                      break;
                    }
                    throw new Error("cannot find node");
                  case 3:
                    _context3.next = 5;
                    return this.emit({
                      type: "noderemove",
                      data: node
                    });
                  case 5:
                    if (_context3.sent) {
                      _context3.next = 7;
                      break;
                    }
                    return _context3.abrupt("return", false);
                  case 7:
                    index4 = this.nodes.indexOf(node);
                    this.nodes.splice(index4, 1);
                    _context3.next = 11;
                    return this.emit({
                      type: "noderemoved",
                      data: node
                    });
                  case 11:
                    return _context3.abrupt("return", true);
                  case 12:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3, this);
            }));
            function removeNode(_x3) {
              return _removeNode.apply(this, arguments);
            }
            return removeNode;
          }()
        }, {
          key: "removeConnection",
          value: function() {
            var _removeConnection = _asyncToGenerator(/* @__PURE__ */ import_regenerator.default.mark(function _callee4(id) {
              var connection, index4;
              return import_regenerator.default.wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    connection = this.connections.find(function(c5) {
                      return c5.id === id;
                    });
                    if (connection) {
                      _context4.next = 3;
                      break;
                    }
                    throw new Error("cannot find connection");
                  case 3:
                    _context4.next = 5;
                    return this.emit({
                      type: "connectionremove",
                      data: connection
                    });
                  case 5:
                    if (_context4.sent) {
                      _context4.next = 7;
                      break;
                    }
                    return _context4.abrupt("return", false);
                  case 7:
                    index4 = this.connections.indexOf(connection);
                    this.connections.splice(index4, 1);
                    _context4.next = 11;
                    return this.emit({
                      type: "connectionremoved",
                      data: connection
                    });
                  case 11:
                    return _context4.abrupt("return", true);
                  case 12:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4, this);
            }));
            function removeConnection(_x4) {
              return _removeConnection.apply(this, arguments);
            }
            return removeConnection;
          }()
        }, {
          key: "clear",
          value: function() {
            var _clear = _asyncToGenerator(/* @__PURE__ */ import_regenerator.default.mark(function _callee5() {
              var _iterator, _step, connection, _iterator2, _step2, node;
              return import_regenerator.default.wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return this.emit({
                      type: "clear"
                    });
                  case 2:
                    if (_context5.sent) {
                      _context5.next = 6;
                      break;
                    }
                    _context5.next = 5;
                    return this.emit({
                      type: "clearcancelled"
                    });
                  case 5:
                    return _context5.abrupt("return", false);
                  case 6:
                    _iterator = _createForOfIteratorHelper(this.connections.slice());
                    _context5.prev = 7;
                    _iterator.s();
                  case 9:
                    if ((_step = _iterator.n()).done) {
                      _context5.next = 15;
                      break;
                    }
                    connection = _step.value;
                    _context5.next = 13;
                    return this.removeConnection(connection.id);
                  case 13:
                    _context5.next = 9;
                    break;
                  case 15:
                    _context5.next = 20;
                    break;
                  case 17:
                    _context5.prev = 17;
                    _context5.t0 = _context5["catch"](7);
                    _iterator.e(_context5.t0);
                  case 20:
                    _context5.prev = 20;
                    _iterator.f();
                    return _context5.finish(20);
                  case 23:
                    _iterator2 = _createForOfIteratorHelper(this.nodes.slice());
                    _context5.prev = 24;
                    _iterator2.s();
                  case 26:
                    if ((_step2 = _iterator2.n()).done) {
                      _context5.next = 32;
                      break;
                    }
                    node = _step2.value;
                    _context5.next = 30;
                    return this.removeNode(node.id);
                  case 30:
                    _context5.next = 26;
                    break;
                  case 32:
                    _context5.next = 37;
                    break;
                  case 34:
                    _context5.prev = 34;
                    _context5.t1 = _context5["catch"](24);
                    _iterator2.e(_context5.t1);
                  case 37:
                    _context5.prev = 37;
                    _iterator2.f();
                    return _context5.finish(37);
                  case 40:
                    _context5.next = 42;
                    return this.emit({
                      type: "cleared"
                    });
                  case 42:
                    return _context5.abrupt("return", true);
                  case 43:
                  case "end":
                    return _context5.stop();
                }
              }, _callee5, this, [[7, 17, 20, 23], [24, 34, 37, 40]]);
            }));
            function clear() {
              return _clear.apply(this, arguments);
            }
            return clear;
          }()
        }]);
      }(Scope);
      crypto = globalThis.crypto;
      Socket2 = /* @__PURE__ */ _createClass(
        /**
         * @constructor
         * @param name Name of the socket
         */
        function Socket3(name) {
          _classCallCheck(this, Socket3);
          this.name = name;
        }
      );
      Port = /* @__PURE__ */ _createClass(
        /**
         * Port id, unique string generated by `getUID` function
         */
        /**
         * Port index, used for sorting ports. Default is `0`
         */
        /**
         * @constructor
         * @param socket Socket instance
         * @param label Label of the port
         * @param multipleConnections Whether the output port can have multiple connections
         */
        function Port2(socket, label, multipleConnections) {
          _classCallCheck(this, Port2);
          this.socket = socket;
          this.label = label;
          this.multipleConnections = multipleConnections;
          this.id = getUID();
        }
      );
      Input = /* @__PURE__ */ function(_Port) {
        function Input2(socket, label, multipleConnections) {
          var _this;
          _classCallCheck(this, Input2);
          _this = _callSuper(this, Input2, [socket, label, multipleConnections]);
          _defineProperty(_this, "control", null);
          _defineProperty(_this, "showControl", true);
          _this.socket = socket;
          _this.label = label;
          _this.multipleConnections = multipleConnections;
          return _this;
        }
        _inherits(Input2, _Port);
        return _createClass(Input2, [{
          key: "addControl",
          value: function addControl(control) {
            if (this.control) throw new Error("control already added for this input");
            this.control = control;
          }
          /**
           * Remove control from the input port
           */
        }, {
          key: "removeControl",
          value: function removeControl() {
            this.control = null;
          }
        }]);
      }(Port);
      Output = /* @__PURE__ */ function(_Port2) {
        function Output2(socket, label, multipleConnections) {
          _classCallCheck(this, Output2);
          return _callSuper(this, Output2, [socket, label, multipleConnections !== false]);
        }
        _inherits(Output2, _Port2);
        return _createClass(Output2);
      }(Port);
      Control = /* @__PURE__ */ _createClass(
        /**
         * Control id, unique string generated by `getUID` function
         */
        /**
         * Control index, used for sorting controls. Default is `0`
         */
        function Control2() {
          _classCallCheck(this, Control2);
          this.id = getUID();
        }
      );
      InputControl = /* @__PURE__ */ function(_Control) {
        function InputControl2(type, options) {
          var _options$readonly;
          var _this2;
          _classCallCheck(this, InputControl2);
          _this2 = _callSuper(this, InputControl2);
          _this2.type = type;
          _this2.options = options;
          _this2.id = getUID();
          _this2.readonly = (_options$readonly = options === null || options === void 0 ? void 0 : options.readonly) !== null && _options$readonly !== void 0 ? _options$readonly : false;
          if (typeof (options === null || options === void 0 ? void 0 : options.initial) !== "undefined") _this2.value = options.initial;
          return _this2;
        }
        _inherits(InputControl2, _Control);
        return _createClass(InputControl2, [{
          key: "setValue",
          value: function setValue(value) {
            var _this$options;
            this.value = value;
            if ((_this$options = this.options) !== null && _this$options !== void 0 && _this$options.change) this.options.change(value);
          }
        }]);
      }(Control);
      Node2 = /* @__PURE__ */ function() {
        function Node3(label) {
          _classCallCheck(this, Node3);
          _defineProperty(this, "inputs", {});
          _defineProperty(this, "outputs", {});
          _defineProperty(this, "controls", {});
          this.label = label;
          this.id = getUID();
        }
        return _createClass(Node3, [{
          key: "hasInput",
          value: function hasInput(key) {
            return Object.prototype.hasOwnProperty.call(this.inputs, key);
          }
        }, {
          key: "addInput",
          value: function addInput(key, input) {
            if (this.hasInput(key)) throw new Error("input with key '".concat(String(key), "' already added"));
            Object.defineProperty(this.inputs, key, {
              value: input,
              enumerable: true,
              configurable: true
            });
          }
        }, {
          key: "removeInput",
          value: function removeInput(key) {
            delete this.inputs[key];
          }
        }, {
          key: "hasOutput",
          value: function hasOutput(key) {
            return Object.prototype.hasOwnProperty.call(this.outputs, key);
          }
        }, {
          key: "addOutput",
          value: function addOutput(key, output) {
            if (this.hasOutput(key)) throw new Error("output with key '".concat(String(key), "' already added"));
            Object.defineProperty(this.outputs, key, {
              value: output,
              enumerable: true,
              configurable: true
            });
          }
        }, {
          key: "removeOutput",
          value: function removeOutput(key) {
            delete this.outputs[key];
          }
        }, {
          key: "hasControl",
          value: function hasControl(key) {
            return Object.prototype.hasOwnProperty.call(this.controls, key);
          }
        }, {
          key: "addControl",
          value: function addControl(key, control) {
            if (this.hasControl(key)) throw new Error("control with key '".concat(String(key), "' already added"));
            Object.defineProperty(this.controls, key, {
              value: control,
              enumerable: true,
              configurable: true
            });
          }
        }, {
          key: "removeControl",
          value: function removeControl(key) {
            delete this.controls[key];
          }
        }]);
      }();
      Connection = /* @__PURE__ */ _createClass(
        /**
         * Connection id, unique string generated by `getUID` function
         */
        /**
         * Source node id
         */
        /**
         * Target node id
         */
        /**
         * @constructor
         * @param source Source node instance
         * @param sourceOutput Source node output key
         * @param target Target node instance
         * @param targetInput Target node input key
         */
        function Connection2(source, sourceOutput, target, targetInput) {
          _classCallCheck(this, Connection2);
          this.sourceOutput = sourceOutput;
          this.targetInput = targetInput;
          if (!source.outputs[sourceOutput]) {
            throw new Error("source node doesn't have output with a key ".concat(String(sourceOutput)));
          }
          if (!target.inputs[targetInput]) {
            throw new Error("target node doesn't have input with a key ".concat(String(targetInput)));
          }
          this.id = getUID();
          this.source = source.id;
          this.target = target.id;
        }
      );
      classic = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        Socket: Socket2,
        Port,
        Input,
        Output,
        Control,
        InputControl,
        Node: Node2,
        Connection
      });
    }
  });

  // node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js
  function _arrayLikeToArray2(r6, a3) {
    (null == a3 || a3 > r6.length) && (a3 = r6.length);
    for (var e7 = 0, n5 = Array(a3); e7 < a3; e7++) n5[e7] = r6[e7];
    return n5;
  }
  var init_arrayLikeToArray = __esm({
    "node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js"() {
    }
  });

  // node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js
  function _arrayWithoutHoles(r6) {
    if (Array.isArray(r6)) return _arrayLikeToArray2(r6);
  }
  var init_arrayWithoutHoles = __esm({
    "node_modules/@babel/runtime/helpers/esm/arrayWithoutHoles.js"() {
      init_arrayLikeToArray();
    }
  });

  // node_modules/@babel/runtime/helpers/esm/iterableToArray.js
  function _iterableToArray(r6) {
    if ("undefined" != typeof Symbol && null != r6[Symbol.iterator] || null != r6["@@iterator"]) return Array.from(r6);
  }
  var init_iterableToArray = __esm({
    "node_modules/@babel/runtime/helpers/esm/iterableToArray.js"() {
    }
  });

  // node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js
  function _unsupportedIterableToArray2(r6, a3) {
    if (r6) {
      if ("string" == typeof r6) return _arrayLikeToArray2(r6, a3);
      var t5 = {}.toString.call(r6).slice(8, -1);
      return "Object" === t5 && r6.constructor && (t5 = r6.constructor.name), "Map" === t5 || "Set" === t5 ? Array.from(r6) : "Arguments" === t5 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t5) ? _arrayLikeToArray2(r6, a3) : void 0;
    }
  }
  var init_unsupportedIterableToArray = __esm({
    "node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js"() {
      init_arrayLikeToArray();
    }
  });

  // node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var init_nonIterableSpread = __esm({
    "node_modules/@babel/runtime/helpers/esm/nonIterableSpread.js"() {
    }
  });

  // node_modules/@babel/runtime/helpers/esm/toConsumableArray.js
  function _toConsumableArray(r6) {
    return _arrayWithoutHoles(r6) || _iterableToArray(r6) || _unsupportedIterableToArray2(r6) || _nonIterableSpread();
  }
  var init_toConsumableArray = __esm({
    "node_modules/@babel/runtime/helpers/esm/toConsumableArray.js"() {
      init_arrayWithoutHoles();
      init_iterableToArray();
      init_unsupportedIterableToArray();
      init_nonIterableSpread();
    }
  });

  // node_modules/rete-area-plugin/rete-area-plugin.esm.js
  function usePointerListener(element, handlers) {
    var move = function move2(event) {
      handlers.move(event);
    };
    var _up = function up(event) {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", _up);
      window.removeEventListener("pointercancel", _up);
      handlers.up(event);
    };
    var down = function down2(event) {
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", _up);
      window.addEventListener("pointercancel", _up);
      handlers.down(event);
    };
    element.addEventListener("pointerdown", down);
    return {
      destroy: function destroy() {
        element.removeEventListener("pointerdown", down);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", _up);
        window.removeEventListener("pointercancel", _up);
      }
    };
  }
  function getBoundingBox$1(rects) {
    var left = min(rects.map(function(rect) {
      return rect.position.x;
    }));
    var top2 = min(rects.map(function(rect) {
      return rect.position.y;
    }));
    var right = max(rects.map(function(rect) {
      return rect.position.x + rect.width;
    }));
    var bottom2 = max(rects.map(function(rect) {
      return rect.position.y + rect.height;
    }));
    return {
      left,
      right,
      top: top2,
      bottom: bottom2,
      width: Math.abs(left - right),
      height: Math.abs(top2 - bottom2),
      center: {
        x: (left + right) / 2,
        y: (top2 + bottom2) / 2
      }
    };
  }
  function ownKeys$4(e7, r6) {
    var t5 = Object.keys(e7);
    if (Object.getOwnPropertySymbols) {
      var o6 = Object.getOwnPropertySymbols(e7);
      r6 && (o6 = o6.filter(function(r7) {
        return Object.getOwnPropertyDescriptor(e7, r7).enumerable;
      })), t5.push.apply(t5, o6);
    }
    return t5;
  }
  function _objectSpread$4(e7) {
    for (var r6 = 1; r6 < arguments.length; r6++) {
      var t5 = null != arguments[r6] ? arguments[r6] : {};
      r6 % 2 ? ownKeys$4(Object(t5), true).forEach(function(r7) {
        _defineProperty(e7, r7, t5[r7]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e7, Object.getOwnPropertyDescriptors(t5)) : ownKeys$4(Object(t5)).forEach(function(r7) {
        Object.defineProperty(e7, r7, Object.getOwnPropertyDescriptor(t5, r7));
      });
    }
    return e7;
  }
  function _callSuper$12(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$12() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$12() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$12 = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function ownKeys$3(e7, r6) {
    var t5 = Object.keys(e7);
    if (Object.getOwnPropertySymbols) {
      var o6 = Object.getOwnPropertySymbols(e7);
      r6 && (o6 = o6.filter(function(r7) {
        return Object.getOwnPropertyDescriptor(e7, r7).enumerable;
      })), t5.push.apply(t5, o6);
    }
    return t5;
  }
  function _objectSpread$3(e7) {
    for (var r6 = 1; r6 < arguments.length; r6++) {
      var t5 = null != arguments[r6] ? arguments[r6] : {};
      r6 % 2 ? ownKeys$3(Object(t5), true).forEach(function(r7) {
        _defineProperty(e7, r7, t5[r7]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e7, Object.getOwnPropertyDescriptors(t5)) : ownKeys$3(Object(t5)).forEach(function(r7) {
        Object.defineProperty(e7, r7, Object.getOwnPropertyDescriptor(t5, r7));
      });
    }
    return e7;
  }
  function getNodesRect(nodes, views) {
    return nodes.map(function(node) {
      return {
        view: views.get(node.id),
        node
      };
    }).filter(function(item) {
      return item.view;
    }).map(function(_ref2) {
      var view = _ref2.view, node = _ref2.node;
      var width = node.width, height = node.height;
      if (typeof width !== "undefined" && typeof height !== "undefined") {
        return {
          position: view.position,
          width,
          height
        };
      }
      return {
        position: view.position,
        width: view.element.clientWidth,
        height: view.element.clientHeight
      };
    });
  }
  function getBoundingBox(plugin, nodes) {
    var editor = plugin.parentScope(NodeEditor);
    var list = nodes.map(function(node) {
      return _typeof(node) === "object" ? node : editor.getNode(node);
    });
    var rects = getNodesRect(list, plugin.nodeViews);
    return getBoundingBox$1(rects);
  }
  function simpleNodesOrder(base) {
    var area = base;
    area.addPipe(function(context) {
      if (!context || _typeof(context) !== "object" || !("type" in context)) return context;
      if (context.type === "nodepicked") {
        var view = area.nodeViews.get(context.data.id);
        var content = area.area.content;
        if (view) {
          content.reorder(view.element, null);
        }
      }
      if (context.type === "connectioncreated") {
        var _view = area.connectionViews.get(context.data.id);
        var _content = area.area.content;
        if (_view) {
          _content.reorder(_view.element, _content.holder.firstChild);
        }
      }
      return context;
    });
  }
  function ownKeys$2(e7, r6) {
    var t5 = Object.keys(e7);
    if (Object.getOwnPropertySymbols) {
      var o6 = Object.getOwnPropertySymbols(e7);
      r6 && (o6 = o6.filter(function(r7) {
        return Object.getOwnPropertyDescriptor(e7, r7).enumerable;
      })), t5.push.apply(t5, o6);
    }
    return t5;
  }
  function _objectSpread$2(e7) {
    for (var r6 = 1; r6 < arguments.length; r6++) {
      var t5 = null != arguments[r6] ? arguments[r6] : {};
      r6 % 2 ? ownKeys$2(Object(t5), true).forEach(function(r7) {
        _defineProperty(e7, r7, t5[r7]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e7, Object.getOwnPropertyDescriptors(t5)) : ownKeys$2(Object(t5)).forEach(function(r7) {
        Object.defineProperty(e7, r7, Object.getOwnPropertyDescriptor(t5, r7));
      });
    }
    return e7;
  }
  function restrictor(plugin, params) {
    var scaling = params !== null && params !== void 0 && params.scaling ? params.scaling === true ? {
      min: 0.1,
      max: 1
    } : params.scaling : false;
    var translation = params !== null && params !== void 0 && params.translation ? params.translation === true ? {
      left: 0,
      top: 0,
      right: 1e3,
      bottom: 1e3
    } : params.translation : false;
    function restrictZoom(zoom) {
      if (!scaling) throw new Error("scaling param isnt defined");
      var _ref2 = typeof scaling === "function" ? scaling() : scaling, min3 = _ref2.min, max3 = _ref2.max;
      if (zoom < min3) {
        return min3;
      } else if (zoom > max3) {
        return max3;
      }
      return zoom;
    }
    function restrictPosition(position) {
      if (!translation) throw new Error("translation param isnt defined");
      var nextPosition = _objectSpread$2({}, position);
      var _ref2 = typeof translation === "function" ? translation() : translation, left = _ref2.left, top2 = _ref2.top, right = _ref2.right, bottom2 = _ref2.bottom;
      if (nextPosition.x < left) {
        nextPosition.x = left;
      }
      if (nextPosition.x > right) {
        nextPosition.x = right;
      }
      if (nextPosition.y < top2) {
        nextPosition.y = top2;
      }
      if (nextPosition.y > bottom2) {
        nextPosition.y = bottom2;
      }
      return nextPosition;
    }
    plugin.addPipe(function(context) {
      if (!context || _typeof(context) !== "object" || !("type" in context)) return context;
      if (scaling && context.type === "zoom") {
        return _objectSpread$2(_objectSpread$2({}, context), {}, {
          data: _objectSpread$2(_objectSpread$2({}, context.data), {}, {
            zoom: restrictZoom(context.data.zoom)
          })
        });
      }
      if (translation && context.type === "zoomed") {
        var position = restrictPosition(plugin.area.transform);
        void plugin.area.translate(position.x, position.y);
      }
      if (translation && context.type === "translate") {
        return _objectSpread$2(_objectSpread$2({}, context), {}, {
          data: _objectSpread$2(_objectSpread$2({}, context.data), {}, {
            position: restrictPosition(context.data.position)
          })
        });
      }
      return context;
    });
  }
  function accumulateOnCtrl() {
    var pressed = false;
    function keydown(e7) {
      if (e7.key === "Control" || e7.key === "Meta") pressed = true;
    }
    function keyup(e7) {
      if (e7.key === "Control" || e7.key === "Meta") pressed = false;
    }
    document.addEventListener("keydown", keydown);
    document.addEventListener("keyup", keyup);
    return {
      active: function active() {
        return pressed;
      },
      destroy: function destroy() {
        document.removeEventListener("keydown", keydown);
        document.removeEventListener("keyup", keyup);
      }
    };
  }
  function selector() {
    return new Selector();
  }
  function selectableNodes(base, core, options) {
    var editor = null;
    var area = base;
    var getEditor = function getEditor2() {
      return editor || (editor = area.parentScope(NodeEditor));
    };
    var twitch = 0;
    function selectNode(node) {
      if (!node.selected) {
        node.selected = true;
        void area.update("node", node.id);
      }
    }
    function unselectNode(node) {
      if (node.selected) {
        node.selected = false;
        void area.update("node", node.id);
      }
    }
    function add(_x6, _x7) {
      return _add2.apply(this, arguments);
    }
    function _add2() {
      _add2 = _asyncToGenerator(/* @__PURE__ */ import_regenerator2.default.mark(function _callee7(nodeId, accumulate) {
        var node;
        return import_regenerator2.default.wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              node = getEditor().getNode(nodeId);
              if (node) {
                _context7.next = 3;
                break;
              }
              return _context7.abrupt("return");
            case 3:
              _context7.next = 5;
              return core.add({
                label: "node",
                id: node.id,
                translate: function translate(dx, dy) {
                  return _asyncToGenerator(/* @__PURE__ */ import_regenerator2.default.mark(function _callee6() {
                    var view, current;
                    return import_regenerator2.default.wrap(function _callee6$(_context6) {
                      while (1) switch (_context6.prev = _context6.next) {
                        case 0:
                          view = area.nodeViews.get(node.id);
                          current = view === null || view === void 0 ? void 0 : view.position;
                          if (!current) {
                            _context6.next = 5;
                            break;
                          }
                          _context6.next = 5;
                          return view.translate(current.x + dx, current.y + dy);
                        case 5:
                        case "end":
                          return _context6.stop();
                      }
                    }, _callee6);
                  }))();
                },
                unselect: function unselect() {
                  unselectNode(node);
                }
              }, accumulate);
            case 5:
              selectNode(node);
            case 6:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      return _add2.apply(this, arguments);
    }
    function remove(_x8) {
      return _remove2.apply(this, arguments);
    }
    function _remove2() {
      _remove2 = _asyncToGenerator(/* @__PURE__ */ import_regenerator2.default.mark(function _callee8(nodeId) {
        return import_regenerator2.default.wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return core.remove({
                id: nodeId,
                label: "node"
              });
            case 2:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }));
      return _remove2.apply(this, arguments);
    }
    area.addPipe(/* @__PURE__ */ function() {
      var _ref2 = _asyncToGenerator(/* @__PURE__ */ import_regenerator2.default.mark(function _callee5(context) {
        var pickedId, accumulate, _context$data, id, position, previous, _dx, _dy;
        return import_regenerator2.default.wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              if (!(!context || _typeof(context) !== "object" || !("type" in context))) {
                _context5.next = 2;
                break;
              }
              return _context5.abrupt("return", context);
            case 2:
              if (!(context.type === "nodepicked")) {
                _context5.next = 11;
                break;
              }
              pickedId = context.data.id;
              accumulate = options.accumulating.active();
              core.pick({
                id: pickedId,
                label: "node"
              });
              twitch = null;
              _context5.next = 9;
              return add(pickedId, accumulate);
            case 9:
              _context5.next = 33;
              break;
            case 11:
              if (!(context.type === "nodetranslated")) {
                _context5.next = 20;
                break;
              }
              _context$data = context.data, id = _context$data.id, position = _context$data.position, previous = _context$data.previous;
              _dx = position.x - previous.x;
              _dy = position.y - previous.y;
              if (!core.isPicked({
                id,
                label: "node"
              })) {
                _context5.next = 18;
                break;
              }
              _context5.next = 18;
              return core.translate(_dx, _dy);
            case 18:
              _context5.next = 33;
              break;
            case 20:
              if (!(context.type === "pointerdown")) {
                _context5.next = 24;
                break;
              }
              twitch = 0;
              _context5.next = 33;
              break;
            case 24:
              if (!(context.type === "pointermove")) {
                _context5.next = 28;
                break;
              }
              if (twitch !== null) twitch++;
              _context5.next = 33;
              break;
            case 28:
              if (!(context.type === "pointerup")) {
                _context5.next = 33;
                break;
              }
              if (!(twitch !== null && twitch < 4)) {
                _context5.next = 32;
                break;
              }
              _context5.next = 32;
              return core.unselectAll();
            case 32:
              twitch = null;
            case 33:
              return _context5.abrupt("return", context);
            case 34:
            case "end":
              return _context5.stop();
          }
        }, _callee5);
      }));
      return function(_x9) {
        return _ref2.apply(this, arguments);
      };
    }());
    return {
      select: add,
      unselect: remove
    };
  }
  function showInputControl(area, visible) {
    var editor = null;
    var getEditor = function getEditor2() {
      return editor || (editor = area.parentScope(NodeEditor));
    };
    function updateInputControlVisibility(target, targetInput) {
      var node = getEditor().getNode(target);
      if (!node) return;
      var input = node.inputs[targetInput];
      if (!input) throw new Error("cannot find input");
      var previous = input.showControl;
      var connections = getEditor().getConnections();
      var hasAnyConnection = Boolean(connections.find(function(connection) {
        return connection.target === target && connection.targetInput === targetInput;
      }));
      input.showControl = visible ? visible({
        hasAnyConnection,
        input
      }) : !hasAnyConnection;
      if (input.showControl !== previous) {
        void area.update("node", node.id);
      }
    }
    area.addPipe(function(context) {
      if (context.type === "connectioncreated" || context.type === "connectionremoved") {
        updateInputControlVisibility(context.data.target, context.data.targetInput);
      }
      return context;
    });
  }
  function ownKeys$1(e7, r6) {
    var t5 = Object.keys(e7);
    if (Object.getOwnPropertySymbols) {
      var o6 = Object.getOwnPropertySymbols(e7);
      r6 && (o6 = o6.filter(function(r7) {
        return Object.getOwnPropertyDescriptor(e7, r7).enumerable;
      })), t5.push.apply(t5, o6);
    }
    return t5;
  }
  function _objectSpread$1(e7) {
    for (var r6 = 1; r6 < arguments.length; r6++) {
      var t5 = null != arguments[r6] ? arguments[r6] : {};
      r6 % 2 ? ownKeys$1(Object(t5), true).forEach(function(r7) {
        _defineProperty(e7, r7, t5[r7]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e7, Object.getOwnPropertyDescriptors(t5)) : ownKeys$1(Object(t5)).forEach(function(r7) {
        Object.defineProperty(e7, r7, Object.getOwnPropertyDescriptor(t5, r7));
      });
    }
    return e7;
  }
  function snapGrid(base, params) {
    var area = base;
    var size = typeof (params === null || params === void 0 ? void 0 : params.size) === "undefined" ? 16 : params.size;
    var dynamic = typeof (params === null || params === void 0 ? void 0 : params.dynamic) === "undefined" ? true : params.dynamic;
    function snap(value) {
      return Math.round(value / size) * size;
    }
    area.addPipe(function(context) {
      if (!context || _typeof(context) !== "object" || !("type" in context)) return context;
      if (dynamic && context.type === "nodetranslate") {
        var position = context.data.position;
        var x2 = snap(position.x);
        var y3 = snap(position.y);
        return _objectSpread$1(_objectSpread$1({}, context), {}, {
          data: _objectSpread$1(_objectSpread$1({}, context.data), {}, {
            position: {
              x: x2,
              y: y3
            }
          })
        });
      }
      if (!dynamic && context.type === "nodedragged") {
        var view = area.nodeViews.get(context.data.id);
        if (view) {
          var _view$position = view.position, _x = _view$position.x, _y = _view$position.y;
          void view.translate(snap(_x), snap(_y));
        }
      }
      return context;
    });
  }
  function zoomAt(_x, _x2, _x3) {
    return _zoomAt.apply(this, arguments);
  }
  function _zoomAt() {
    _zoomAt = _asyncToGenerator(/* @__PURE__ */ import_regenerator2.default.mark(function _callee(plugin, nodes, params) {
      var _ref2, _ref$scale, scale, editor, list, rects, boundingBox, _ref22, w2, h4, kw, kh, k2;
      return import_regenerator2.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _ref2 = params || {}, _ref$scale = _ref2.scale, scale = _ref$scale === void 0 ? 0.9 : _ref$scale;
            editor = plugin.parentScope(NodeEditor);
            list = nodes.map(function(node) {
              return _typeof(node) === "object" ? node : editor.getNode(node);
            });
            rects = getNodesRect(list, plugin.nodeViews);
            boundingBox = getBoundingBox$1(rects);
            _ref22 = [plugin.container.clientWidth, plugin.container.clientHeight], w2 = _ref22[0], h4 = _ref22[1];
            kw = w2 / boundingBox.width, kh = h4 / boundingBox.height;
            k2 = Math.min(kh * scale, kw * scale, 1);
            plugin.area.transform.x = w2 / 2 - boundingBox.center.x * k2;
            plugin.area.transform.y = h4 / 2 - boundingBox.center.y * k2;
            _context.next = 12;
            return plugin.area.zoom(k2, 0, 0);
          case 12:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return _zoomAt.apply(this, arguments);
  }
  function ownKeys(e7, r6) {
    var t5 = Object.keys(e7);
    if (Object.getOwnPropertySymbols) {
      var o6 = Object.getOwnPropertySymbols(e7);
      r6 && (o6 = o6.filter(function(r7) {
        return Object.getOwnPropertyDescriptor(e7, r7).enumerable;
      })), t5.push.apply(t5, o6);
    }
    return t5;
  }
  function _objectSpread(e7) {
    for (var r6 = 1; r6 < arguments.length; r6++) {
      var t5 = null != arguments[r6] ? arguments[r6] : {};
      r6 % 2 ? ownKeys(Object(t5), true).forEach(function(r7) {
        _defineProperty(e7, r7, t5[r7]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e7, Object.getOwnPropertyDescriptors(t5)) : ownKeys(Object(t5)).forEach(function(r7) {
        Object.defineProperty(e7, r7, Object.getOwnPropertyDescriptor(t5, r7));
      });
    }
    return e7;
  }
  function _callSuper2(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct2() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct2() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct2 = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  var import_regenerator2, Content, min, max, Drag, Zoom, Area, BaseAreaPlugin, ConnectionView, ElementsHolder, NodeView, Selector, index, AreaPlugin;
  var init_rete_area_plugin_esm = __esm({
    "node_modules/rete-area-plugin/rete-area-plugin.esm.js"() {
      init_asyncToGenerator();
      init_typeof();
      init_classCallCheck();
      init_createClass();
      init_possibleConstructorReturn();
      init_getPrototypeOf();
      init_inherits();
      init_defineProperty();
      import_regenerator2 = __toESM(require_regenerator2());
      init_toConsumableArray();
      init_rete_esm();
      Content = /* @__PURE__ */ function() {
        function Content2(reordered) {
          _classCallCheck(this, Content2);
          this.reordered = reordered;
          this.holder = document.createElement("div");
          this.holder.style.transformOrigin = "0 0";
        }
        return _createClass(Content2, [{
          key: "getPointerFrom",
          value: function getPointerFrom(event) {
            var _this$holder$getBound = this.holder.getBoundingClientRect(), left = _this$holder$getBound.left, top2 = _this$holder$getBound.top;
            var x2 = event.clientX - left;
            var y3 = event.clientY - top2;
            return {
              x: x2,
              y: y3
            };
          }
        }, {
          key: "add",
          value: function add(element) {
            this.holder.appendChild(element);
          }
          // eslint-disable-next-line no-undef
        }, {
          key: "reorder",
          value: function() {
            var _reorder = _asyncToGenerator(/* @__PURE__ */ import_regenerator2.default.mark(function _callee(target, next) {
              return import_regenerator2.default.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    if (this.holder.contains(target)) {
                      _context.next = 2;
                      break;
                    }
                    throw new Error("content doesn't have 'target' for reordering");
                  case 2:
                    if (!(next !== null && !this.holder.contains(next))) {
                      _context.next = 4;
                      break;
                    }
                    throw new Error("content doesn't have 'next' for reordering");
                  case 4:
                    this.holder.insertBefore(target, next);
                    _context.next = 7;
                    return this.reordered(target);
                  case 7:
                  case "end":
                    return _context.stop();
                }
              }, _callee, this);
            }));
            function reorder(_x, _x2) {
              return _reorder.apply(this, arguments);
            }
            return reorder;
          }()
        }, {
          key: "remove",
          value: function remove(element) {
            if (this.holder.contains(element)) {
              this.holder.removeChild(element);
            }
          }
        }]);
      }();
      min = function min2(arr) {
        return arr.length === 0 ? 0 : Math.min.apply(Math, _toConsumableArray(arr));
      };
      max = function max2(arr) {
        return arr.length === 0 ? 0 : Math.max.apply(Math, _toConsumableArray(arr));
      };
      Drag = /* @__PURE__ */ function() {
        function Drag2(guards) {
          var _this = this;
          _classCallCheck(this, Drag2);
          _defineProperty(this, "down", function(e7) {
            if (!_this.guards.down(e7)) return;
            e7.stopPropagation();
            _this.pointerStart = {
              x: e7.pageX,
              y: e7.pageY
            };
            _this.startPosition = _objectSpread$4({}, _this.config.getCurrentPosition());
            _this.events.start(e7);
          });
          _defineProperty(this, "move", function(e7) {
            if (!_this.pointerStart || !_this.startPosition) return;
            if (!_this.guards.move(e7)) return;
            e7.preventDefault();
            var delta = {
              x: e7.pageX - _this.pointerStart.x,
              y: e7.pageY - _this.pointerStart.y
            };
            var zoom = _this.config.getZoom();
            var x2 = _this.startPosition.x + delta.x / zoom;
            var y3 = _this.startPosition.y + delta.y / zoom;
            void _this.events.translate(x2, y3, e7);
          });
          _defineProperty(this, "up", function(e7) {
            if (!_this.pointerStart) return;
            delete _this.pointerStart;
            _this.events.drag(e7);
          });
          this.guards = guards || {
            down: function down(e7) {
              return !(e7.pointerType === "mouse" && e7.button !== 0);
            },
            move: function move() {
              return true;
            }
          };
        }
        return _createClass(Drag2, [{
          key: "initialize",
          value: function initialize(element, config, events) {
            this.config = config;
            this.events = events;
            element.style.touchAction = "none";
            this.pointerListener = usePointerListener(element, {
              down: this.down,
              move: this.move,
              up: this.up
            });
          }
        }, {
          key: "destroy",
          value: function destroy() {
            this.pointerListener.destroy();
          }
        }]);
      }();
      Zoom = /* @__PURE__ */ function() {
        function Zoom2(intensity) {
          var _this = this;
          _classCallCheck(this, Zoom2);
          _defineProperty(this, "previous", null);
          _defineProperty(this, "pointers", []);
          _defineProperty(this, "wheel", function(e7) {
            e7.preventDefault();
            var _this$element$getBoun = _this.element.getBoundingClientRect(), left = _this$element$getBoun.left, top2 = _this$element$getBoun.top;
            var isNegative = e7.deltaY < 0;
            var delta = isNegative ? _this.intensity : -_this.intensity;
            var ox = (left - e7.clientX) * delta;
            var oy = (top2 - e7.clientY) * delta;
            _this.onzoom(delta, ox, oy, "wheel");
          });
          _defineProperty(this, "down", function(e7) {
            _this.pointers.push(e7);
          });
          _defineProperty(this, "move", function(e7) {
            _this.pointers = _this.pointers.map(function(p4) {
              return p4.pointerId === e7.pointerId ? e7 : p4;
            });
            if (!_this.isTranslating()) return;
            var _this$element$getBoun2 = _this.element.getBoundingClientRect(), left = _this$element$getBoun2.left, top2 = _this$element$getBoun2.top;
            var _this$getTouches = _this.getTouches(), cx = _this$getTouches.cx, cy = _this$getTouches.cy, distance = _this$getTouches.distance;
            if (_this.previous !== null && _this.previous.distance > 0) {
              var _delta = distance / _this.previous.distance - 1;
              var _ox = (left - cx) * _delta;
              var _oy = (top2 - cy) * _delta;
              _this.onzoom(_delta, _ox - (_this.previous.cx - cx), _oy - (_this.previous.cy - cy), "touch");
            }
            _this.previous = {
              cx,
              cy,
              distance
            };
          });
          _defineProperty(this, "contextmenu", function() {
            _this.pointers = [];
          });
          _defineProperty(this, "up", function(e7) {
            _this.previous = null;
            _this.pointers = _this.pointers.filter(function(p4) {
              return p4.pointerId !== e7.pointerId;
            });
          });
          _defineProperty(this, "dblclick", function(e7) {
            e7.preventDefault();
            var _this$element$getBoun3 = _this.element.getBoundingClientRect(), left = _this$element$getBoun3.left, top2 = _this$element$getBoun3.top;
            var delta = 4 * _this.intensity;
            var ox = (left - e7.clientX) * delta;
            var oy = (top2 - e7.clientY) * delta;
            _this.onzoom(delta, ox, oy, "dblclick");
          });
          this.intensity = intensity;
        }
        return _createClass(Zoom2, [{
          key: "initialize",
          value: function initialize(container, element, onzoom) {
            this.container = container;
            this.element = element;
            this.onzoom = onzoom;
            this.container.addEventListener("wheel", this.wheel);
            this.container.addEventListener("pointerdown", this.down);
            this.container.addEventListener("dblclick", this.dblclick);
            window.addEventListener("pointermove", this.move);
            window.addEventListener("pointerup", this.up);
            window.addEventListener("pointercancel", this.up);
            window.addEventListener("contextmenu", this.contextmenu);
          }
        }, {
          key: "getTouches",
          value: function getTouches() {
            var e7 = {
              touches: this.pointers
            };
            var _ref2 = [e7.touches[0].clientX, e7.touches[0].clientY], x1 = _ref2[0], y1 = _ref2[1];
            var _ref22 = [e7.touches[1].clientX, e7.touches[1].clientY], x2 = _ref22[0], y22 = _ref22[1];
            var distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y22, 2));
            return {
              cx: (x1 + x2) / 2,
              cy: (y1 + y22) / 2,
              distance
            };
          }
        }, {
          key: "isTranslating",
          value: function isTranslating() {
            return this.pointers.length >= 2;
          }
        }, {
          key: "destroy",
          value: function destroy() {
            this.container.removeEventListener("wheel", this.wheel);
            this.container.removeEventListener("pointerdown", this.down);
            this.container.removeEventListener("dblclick", this.dblclick);
            window.removeEventListener("pointermove", this.move);
            window.removeEventListener("pointerup", this.up);
            window.removeEventListener("pointercancel", this.up);
            window.removeEventListener("contextmenu", this.contextmenu);
          }
        }]);
      }();
      Area = /* @__PURE__ */ function() {
        function Area2(container, events, guards) {
          var _this = this;
          _classCallCheck(this, Area2);
          _defineProperty(this, "transform", {
            k: 1,
            x: 0,
            y: 0
          });
          _defineProperty(this, "pointer", {
            x: 0,
            y: 0
          });
          _defineProperty(this, "zoomHandler", null);
          _defineProperty(this, "dragHandler", null);
          _defineProperty(this, "pointerdown", function(event) {
            _this.setPointerFrom(event);
            _this.events.pointerDown(_this.pointer, event);
          });
          _defineProperty(this, "pointermove", function(event) {
            _this.setPointerFrom(event);
            _this.events.pointerMove(_this.pointer, event);
          });
          _defineProperty(this, "pointerup", function(event) {
            _this.setPointerFrom(event);
            _this.events.pointerUp(_this.pointer, event);
          });
          _defineProperty(this, "resize", function(event) {
            _this.events.resize(event);
          });
          _defineProperty(this, "onTranslate", function(x2, y3) {
            var _this$zoomHandler;
            if ((_this$zoomHandler = _this.zoomHandler) !== null && _this$zoomHandler !== void 0 && _this$zoomHandler.isTranslating()) return;
            void _this.translate(x2, y3);
          });
          _defineProperty(this, "onZoom", function(delta, ox, oy, source) {
            void _this.zoom(_this.transform.k * (1 + delta), ox, oy, source);
            _this.update();
          });
          this.container = container;
          this.events = events;
          this.guards = guards;
          this.content = new Content(function(element) {
            return _this.events.reordered(element);
          });
          this.content.holder.style.transformOrigin = "0 0";
          this.setZoomHandler(new Zoom(0.1));
          this.setDragHandler(new Drag());
          this.container.addEventListener("pointerdown", this.pointerdown);
          this.container.addEventListener("pointermove", this.pointermove);
          window.addEventListener("pointerup", this.pointerup);
          window.addEventListener("resize", this.resize);
          container.appendChild(this.content.holder);
          this.update();
        }
        return _createClass(Area2, [{
          key: "update",
          value: function update() {
            var _this$transform = this.transform, x2 = _this$transform.x, y3 = _this$transform.y, k2 = _this$transform.k;
            this.content.holder.style.transform = "translate(".concat(x2, "px, ").concat(y3, "px) scale(").concat(k2, ")");
          }
          /**
           * Drag handler. Destroy previous drag handler if exists.
           * @param drag drag handler
           * @example area.area.setDragHandler(null) // disable drag
           */
        }, {
          key: "setDragHandler",
          value: function setDragHandler(drag) {
            var _this2 = this;
            if (this.dragHandler) this.dragHandler.destroy();
            this.dragHandler = drag;
            if (this.dragHandler) this.dragHandler.initialize(this.container, {
              getCurrentPosition: function getCurrentPosition() {
                return _this2.transform;
              },
              getZoom: function getZoom() {
                return 1;
              }
            }, {
              start: function start() {
                return null;
              },
              translate: this.onTranslate,
              drag: function drag2() {
                return null;
              }
            });
          }
          /**
           * Set zoom handler. Destroy previous zoom handler if exists.
           * @param zoom zoom handler
           * @example area.area.setZoomHandler(null) // disable zoom
           */
        }, {
          key: "setZoomHandler",
          value: function setZoomHandler(zoom) {
            if (this.zoomHandler) this.zoomHandler.destroy();
            this.zoomHandler = zoom;
            if (this.zoomHandler) this.zoomHandler.initialize(this.container, this.content.holder, this.onZoom);
          }
        }, {
          key: "setPointerFrom",
          value: function setPointerFrom(event) {
            var _this$content$getPoin = this.content.getPointerFrom(event), x2 = _this$content$getPoin.x, y3 = _this$content$getPoin.y;
            var k2 = this.transform.k;
            this.pointer = {
              x: x2 / k2,
              y: y3 / k2
            };
          }
        }, {
          key: "translate",
          value: (
            /**
             * Change position of the area
             * @param x desired x coordinate
             * @param y desired y coordinate
             * @returns true if the translation was successful, false otherwise
             * @emits translate
             * @emits translated
             */
            function() {
              var _translate = _asyncToGenerator(/* @__PURE__ */ import_regenerator2.default.mark(function _callee(x2, y3) {
                var position, result;
                return import_regenerator2.default.wrap(function _callee$(_context) {
                  while (1) switch (_context.prev = _context.next) {
                    case 0:
                      position = {
                        x: x2,
                        y: y3
                      };
                      _context.next = 3;
                      return this.guards.translate({
                        previous: this.transform,
                        position
                      });
                    case 3:
                      result = _context.sent;
                      if (result) {
                        _context.next = 6;
                        break;
                      }
                      return _context.abrupt("return", false);
                    case 6:
                      this.transform.x = result.data.position.x;
                      this.transform.y = result.data.position.y;
                      this.update();
                      _context.next = 11;
                      return this.events.translated(result.data);
                    case 11:
                      return _context.abrupt("return", true);
                    case 12:
                    case "end":
                      return _context.stop();
                  }
                }, _callee, this);
              }));
              function translate(_x, _x2) {
                return _translate.apply(this, arguments);
              }
              return translate;
            }()
          )
        }, {
          key: "zoom",
          value: function() {
            var _zoom2 = _asyncToGenerator(/* @__PURE__ */ import_regenerator2.default.mark(function _callee2(_zoom) {
              var ox, oy, source, k2, result, d3, _args2 = arguments;
              return import_regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    ox = _args2.length > 1 && _args2[1] !== void 0 ? _args2[1] : 0;
                    oy = _args2.length > 2 && _args2[2] !== void 0 ? _args2[2] : 0;
                    source = _args2.length > 3 ? _args2[3] : void 0;
                    k2 = this.transform.k;
                    _context2.next = 6;
                    return this.guards.zoom({
                      previous: this.transform,
                      zoom: _zoom,
                      source
                    });
                  case 6:
                    result = _context2.sent;
                    if (result) {
                      _context2.next = 9;
                      break;
                    }
                    return _context2.abrupt("return", true);
                  case 9:
                    d3 = (k2 - result.data.zoom) / (k2 - _zoom || 1);
                    this.transform.k = result.data.zoom || 1;
                    this.transform.x += ox * d3;
                    this.transform.y += oy * d3;
                    this.update();
                    _context2.next = 16;
                    return this.events.zoomed(result.data);
                  case 16:
                    return _context2.abrupt("return", false);
                  case 17:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2, this);
            }));
            function zoom(_x3) {
              return _zoom2.apply(this, arguments);
            }
            return zoom;
          }()
        }, {
          key: "destroy",
          value: function destroy() {
            this.container.removeEventListener("pointerdown", this.pointerdown);
            this.container.removeEventListener("pointermove", this.pointermove);
            window.removeEventListener("pointerup", this.pointerup);
            window.removeEventListener("resize", this.resize);
            if (this.dragHandler) this.dragHandler.destroy();
            if (this.zoomHandler) this.zoomHandler.destroy();
            this.content.holder.innerHTML = "";
          }
        }]);
      }();
      BaseAreaPlugin = /* @__PURE__ */ function(_Scope) {
        function BaseAreaPlugin2() {
          _classCallCheck(this, BaseAreaPlugin2);
          return _callSuper$12(this, BaseAreaPlugin2, arguments);
        }
        _inherits(BaseAreaPlugin2, _Scope);
        return _createClass(BaseAreaPlugin2);
      }(Scope);
      ConnectionView = /* @__PURE__ */ _createClass(function ConnectionView2(events) {
        _classCallCheck(this, ConnectionView2);
        this.element = document.createElement("div");
        this.element.style.position = "absolute";
        this.element.style.left = "0";
        this.element.style.top = "0";
        this.element.addEventListener("contextmenu", function(event) {
          return events.contextmenu(event);
        });
      });
      ElementsHolder = /* @__PURE__ */ function() {
        function ElementsHolder2() {
          _classCallCheck(this, ElementsHolder2);
          _defineProperty(this, "views", /* @__PURE__ */ new WeakMap());
          _defineProperty(this, "viewsElements", /* @__PURE__ */ new Map());
        }
        return _createClass(ElementsHolder2, [{
          key: "set",
          value: function set(context) {
            var element = context.element, type = context.type, payload = context.payload;
            if (payload !== null && payload !== void 0 && payload.id) {
              this.views.set(element, context);
              this.viewsElements.set("".concat(type, "_").concat(payload.id), element);
            }
          }
        }, {
          key: "get",
          value: function get(type, id) {
            var element = this.viewsElements.get("".concat(type, "_").concat(id));
            return element && this.views.get(element);
          }
        }, {
          key: "delete",
          value: function _delete(element) {
            var _view$payload;
            var view = this.views.get(element);
            if (view && (_view$payload = view.payload) !== null && _view$payload !== void 0 && _view$payload.id) {
              this.views["delete"](element);
              this.viewsElements["delete"]("".concat(view.type, "_").concat(view.payload.id));
            }
          }
        }]);
      }();
      NodeView = /* @__PURE__ */ function() {
        function NodeView2(getZoom, events, guards) {
          var _this = this;
          _classCallCheck(this, NodeView2);
          _defineProperty(this, "translate", /* @__PURE__ */ function() {
            var _ref2 = _asyncToGenerator(/* @__PURE__ */ import_regenerator2.default.mark(function _callee(x2, y3) {
              var previous, translation;
              return import_regenerator2.default.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    previous = _objectSpread$3({}, _this.position);
                    _context.next = 3;
                    return _this.guards.translate({
                      previous,
                      position: {
                        x: x2,
                        y: y3
                      }
                    });
                  case 3:
                    translation = _context.sent;
                    if (translation) {
                      _context.next = 6;
                      break;
                    }
                    return _context.abrupt("return", false);
                  case 6:
                    _this.position = _objectSpread$3({}, translation.data.position);
                    _this.element.style.transform = "translate(".concat(_this.position.x, "px, ").concat(_this.position.y, "px)");
                    _context.next = 10;
                    return _this.events.translated({
                      position: _this.position,
                      previous
                    });
                  case 10:
                    return _context.abrupt("return", true);
                  case 11:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function(_x, _x2) {
              return _ref2.apply(this, arguments);
            };
          }());
          _defineProperty(this, "resize", /* @__PURE__ */ function() {
            var _ref2 = _asyncToGenerator(/* @__PURE__ */ import_regenerator2.default.mark(function _callee2(width, height) {
              var size, el;
              return import_regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    size = {
                      width,
                      height
                    };
                    _context2.next = 3;
                    return _this.guards.resize({
                      size
                    });
                  case 3:
                    if (_context2.sent) {
                      _context2.next = 5;
                      break;
                    }
                    return _context2.abrupt("return", false);
                  case 5:
                    el = _this.element.querySelector("*:not(span):not([fragment])");
                    if (!(!el || !(el instanceof HTMLElement))) {
                      _context2.next = 8;
                      break;
                    }
                    return _context2.abrupt("return", false);
                  case 8:
                    el.style.width = "".concat(width, "px");
                    el.style.height = "".concat(height, "px");
                    _context2.next = 12;
                    return _this.events.resized({
                      size
                    });
                  case 12:
                    return _context2.abrupt("return", true);
                  case 13:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2);
            }));
            return function(_x3, _x4) {
              return _ref2.apply(this, arguments);
            };
          }());
          this.getZoom = getZoom;
          this.events = events;
          this.guards = guards;
          this.element = document.createElement("div");
          this.element.style.position = "absolute";
          this.position = {
            x: 0,
            y: 0
          };
          void this.translate(0, 0);
          this.element.addEventListener("contextmenu", function(event) {
            return _this.events.contextmenu(event);
          });
          this.dragHandler = new Drag();
          this.dragHandler.initialize(this.element, {
            getCurrentPosition: function getCurrentPosition() {
              return _this.position;
            },
            getZoom: function getZoom2() {
              return _this.getZoom();
            }
          }, {
            start: this.events.picked,
            translate: this.translate,
            drag: this.events.dragged
          });
        }
        return _createClass(NodeView2, [{
          key: "destroy",
          value: function destroy() {
            this.dragHandler.destroy();
          }
        }]);
      }();
      Selector = /* @__PURE__ */ function() {
        function Selector2() {
          _classCallCheck(this, Selector2);
          _defineProperty(this, "entities", /* @__PURE__ */ new Map());
          _defineProperty(this, "pickId", null);
        }
        return _createClass(Selector2, [{
          key: "isSelected",
          value: function isSelected(entity) {
            return this.entities.has("".concat(entity.label, "_").concat(entity.id));
          }
        }, {
          key: "add",
          value: function() {
            var _add = _asyncToGenerator(/* @__PURE__ */ import_regenerator2.default.mark(function _callee(entity, accumulate) {
              return import_regenerator2.default.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    if (accumulate) {
                      _context.next = 3;
                      break;
                    }
                    _context.next = 3;
                    return this.unselectAll();
                  case 3:
                    this.entities.set("".concat(entity.label, "_").concat(entity.id), entity);
                  case 4:
                  case "end":
                    return _context.stop();
                }
              }, _callee, this);
            }));
            function add(_x, _x2) {
              return _add.apply(this, arguments);
            }
            return add;
          }()
        }, {
          key: "remove",
          value: function() {
            var _remove = _asyncToGenerator(/* @__PURE__ */ import_regenerator2.default.mark(function _callee2(entity) {
              var id, item;
              return import_regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    id = "".concat(entity.label, "_").concat(entity.id);
                    item = this.entities.get(id);
                    if (!item) {
                      _context2.next = 6;
                      break;
                    }
                    this.entities["delete"](id);
                    _context2.next = 6;
                    return item.unselect();
                  case 6:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2, this);
            }));
            function remove(_x3) {
              return _remove.apply(this, arguments);
            }
            return remove;
          }()
        }, {
          key: "unselectAll",
          value: function() {
            var _unselectAll = _asyncToGenerator(/* @__PURE__ */ import_regenerator2.default.mark(function _callee3() {
              var _this = this;
              return import_regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    _context3.next = 2;
                    return Promise.all(_toConsumableArray(Array.from(this.entities.values())).map(function(item) {
                      return _this.remove(item);
                    }));
                  case 2:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3, this);
            }));
            function unselectAll() {
              return _unselectAll.apply(this, arguments);
            }
            return unselectAll;
          }()
        }, {
          key: "translate",
          value: function() {
            var _translate = _asyncToGenerator(/* @__PURE__ */ import_regenerator2.default.mark(function _callee4(dx, dy) {
              var _this2 = this;
              return import_regenerator2.default.wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    _context4.next = 2;
                    return Promise.all(Array.from(this.entities.values()).map(function(item) {
                      return !_this2.isPicked(item) && item.translate(dx, dy);
                    }));
                  case 2:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4, this);
            }));
            function translate(_x4, _x5) {
              return _translate.apply(this, arguments);
            }
            return translate;
          }()
        }, {
          key: "pick",
          value: function pick(entity) {
            this.pickId = "".concat(entity.label, "_").concat(entity.id);
          }
        }, {
          key: "release",
          value: function release() {
            this.pickId = null;
          }
        }, {
          key: "isPicked",
          value: function isPicked(entity) {
            return this.pickId === "".concat(entity.label, "_").concat(entity.id);
          }
        }]);
      }();
      index = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        getBoundingBox,
        simpleNodesOrder,
        restrictor,
        accumulateOnCtrl,
        selectableNodes,
        Selector,
        selector,
        showInputControl,
        snapGrid,
        zoomAt
      });
      AreaPlugin = /* @__PURE__ */ function(_BaseAreaPlugin) {
        function AreaPlugin2(container) {
          var _this;
          _classCallCheck(this, AreaPlugin2);
          _this = _callSuper2(this, AreaPlugin2, ["area"]);
          _defineProperty(_this, "nodeViews", /* @__PURE__ */ new Map());
          _defineProperty(_this, "connectionViews", /* @__PURE__ */ new Map());
          _defineProperty(_this, "elements", new ElementsHolder());
          _defineProperty(_this, "onContextMenu", function(event) {
            void _this.emit({
              type: "contextmenu",
              data: {
                event,
                context: "root"
              }
            });
          });
          _this.container = container;
          container.style.overflow = "hidden";
          container.addEventListener("contextmenu", _this.onContextMenu);
          _this.addPipe(function(context) {
            if (!context || !(_typeof(context) === "object" && "type" in context)) return context;
            if (context.type === "nodecreated") {
              _this.addNodeView(context.data);
            }
            if (context.type === "noderemoved") {
              _this.removeNodeView(context.data.id);
            }
            if (context.type === "connectioncreated") {
              _this.addConnectionView(context.data);
            }
            if (context.type === "connectionremoved") {
              _this.removeConnectionView(context.data.id);
            }
            if (context.type === "render") {
              _this.elements.set(context.data);
            }
            if (context.type === "unmount") {
              _this.elements["delete"](context.data.element);
            }
            return context;
          });
          _this.area = new Area(container, {
            zoomed: function zoomed(params) {
              return _this.emit({
                type: "zoomed",
                data: params
              });
            },
            pointerDown: function pointerDown(position, event) {
              return void _this.emit({
                type: "pointerdown",
                data: {
                  position,
                  event
                }
              });
            },
            pointerMove: function pointerMove(position, event) {
              return void _this.emit({
                type: "pointermove",
                data: {
                  position,
                  event
                }
              });
            },
            pointerUp: function pointerUp(position, event) {
              return void _this.emit({
                type: "pointerup",
                data: {
                  position,
                  event
                }
              });
            },
            resize: function resize(event) {
              return void _this.emit({
                type: "resized",
                data: {
                  event
                }
              });
            },
            translated: function translated(params) {
              return _this.emit({
                type: "translated",
                data: params
              });
            },
            reordered: function reordered(element) {
              return _this.emit({
                type: "reordered",
                data: {
                  element
                }
              });
            }
          }, {
            translate: function translate(params) {
              return _this.emit({
                type: "translate",
                data: params
              });
            },
            zoom: function zoom(params) {
              return _this.emit({
                type: "zoom",
                data: params
              });
            }
          });
          return _this;
        }
        _inherits(AreaPlugin2, _BaseAreaPlugin);
        return _createClass(AreaPlugin2, [{
          key: "addNodeView",
          value: function addNodeView(node) {
            var _this2 = this;
            var id = node.id;
            var view = new NodeView(function() {
              return _this2.area.transform.k;
            }, {
              picked: function picked() {
                return void _this2.emit({
                  type: "nodepicked",
                  data: {
                    id
                  }
                });
              },
              translated: function translated(data) {
                return _this2.emit({
                  type: "nodetranslated",
                  data: _objectSpread({
                    id
                  }, data)
                });
              },
              dragged: function dragged() {
                return void _this2.emit({
                  type: "nodedragged",
                  data: node
                });
              },
              contextmenu: function contextmenu(event) {
                return void _this2.emit({
                  type: "contextmenu",
                  data: {
                    event,
                    context: node
                  }
                });
              },
              resized: function resized(_ref2) {
                var size = _ref2.size;
                return _this2.emit({
                  type: "noderesized",
                  data: {
                    id: node.id,
                    size
                  }
                });
              }
            }, {
              translate: function translate(data) {
                return _this2.emit({
                  type: "nodetranslate",
                  data: _objectSpread({
                    id
                  }, data)
                });
              },
              resize: function resize(_ref2) {
                var size = _ref2.size;
                return _this2.emit({
                  type: "noderesize",
                  data: {
                    id: node.id,
                    size
                  }
                });
              }
            });
            this.nodeViews.set(id, view);
            this.area.content.add(view.element);
            void this.emit({
              type: "render",
              data: {
                element: view.element,
                type: "node",
                payload: node
              }
            });
            return view;
          }
        }, {
          key: "removeNodeView",
          value: function removeNodeView(id) {
            var view = this.nodeViews.get(id);
            if (view) {
              void this.emit({
                type: "unmount",
                data: {
                  element: view.element
                }
              });
              this.nodeViews["delete"](id);
              this.area.content.remove(view.element);
            }
          }
        }, {
          key: "addConnectionView",
          value: function addConnectionView(connection) {
            var _this3 = this;
            var view = new ConnectionView({
              contextmenu: function contextmenu(event) {
                return void _this3.emit({
                  type: "contextmenu",
                  data: {
                    event,
                    context: connection
                  }
                });
              }
            });
            this.connectionViews.set(connection.id, view);
            this.area.content.add(view.element);
            void this.emit({
              type: "render",
              data: {
                element: view.element,
                type: "connection",
                payload: connection
              }
            });
            return view;
          }
        }, {
          key: "removeConnectionView",
          value: function removeConnectionView(id) {
            var view = this.connectionViews.get(id);
            if (view) {
              void this.emit({
                type: "unmount",
                data: {
                  element: view.element
                }
              });
              this.connectionViews["delete"](id);
              this.area.content.remove(view.element);
            }
          }
          /**
           * Force update rendered element by id (node, connection, etc.)
           * @param type Element type
           * @param id Element id
           * @emits render
           */
        }, {
          key: "update",
          value: function() {
            var _update = _asyncToGenerator(/* @__PURE__ */ import_regenerator2.default.mark(function _callee(type, id) {
              var data;
              return import_regenerator2.default.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    data = this.elements.get(type, id);
                    if (!data) {
                      _context.next = 4;
                      break;
                    }
                    _context.next = 4;
                    return this.emit({
                      type: "render",
                      data
                    });
                  case 4:
                  case "end":
                    return _context.stop();
                }
              }, _callee, this);
            }));
            function update(_x, _x2) {
              return _update.apply(this, arguments);
            }
            return update;
          }()
        }, {
          key: "resize",
          value: function() {
            var _resize = _asyncToGenerator(/* @__PURE__ */ import_regenerator2.default.mark(function _callee2(id, width, height) {
              var view;
              return import_regenerator2.default.wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    view = this.nodeViews.get(id);
                    if (!view) {
                      _context2.next = 5;
                      break;
                    }
                    _context2.next = 4;
                    return view.resize(width, height);
                  case 4:
                    return _context2.abrupt("return", _context2.sent);
                  case 5:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2, this);
            }));
            function resize(_x3, _x4, _x5) {
              return _resize.apply(this, arguments);
            }
            return resize;
          }()
        }, {
          key: "translate",
          value: function() {
            var _translate = _asyncToGenerator(/* @__PURE__ */ import_regenerator2.default.mark(function _callee3(id, _ref3) {
              var x2, y3, view;
              return import_regenerator2.default.wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    x2 = _ref3.x, y3 = _ref3.y;
                    view = this.nodeViews.get(id);
                    if (!view) {
                      _context3.next = 6;
                      break;
                    }
                    _context3.next = 5;
                    return view.translate(x2, y3);
                  case 5:
                    return _context3.abrupt("return", _context3.sent);
                  case 6:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3, this);
            }));
            function translate(_x6, _x7) {
              return _translate.apply(this, arguments);
            }
            return translate;
          }()
        }, {
          key: "destroy",
          value: function destroy() {
            var _this4 = this;
            this.container.removeEventListener("contextmenu", this.onContextMenu);
            Array.from(this.connectionViews.keys()).forEach(function(id) {
              return _this4.removeConnectionView(id);
            });
            Array.from(this.nodeViews.keys()).forEach(function(id) {
              return _this4.removeNodeView(id);
            });
            this.area.destroy();
          }
        }]);
      }(BaseAreaPlugin);
    }
  });

  // node_modules/@babel/runtime/helpers/esm/superPropBase.js
  function _superPropBase(t5, o6) {
    for (; !{}.hasOwnProperty.call(t5, o6) && null !== (t5 = _getPrototypeOf(t5)); ) ;
    return t5;
  }
  var init_superPropBase = __esm({
    "node_modules/@babel/runtime/helpers/esm/superPropBase.js"() {
      init_getPrototypeOf();
    }
  });

  // node_modules/@babel/runtime/helpers/esm/get.js
  function _get() {
    return _get = "undefined" != typeof Reflect && Reflect.get ? Reflect.get.bind() : function(e7, t5, r6) {
      var p4 = _superPropBase(e7, t5);
      if (p4) {
        var n5 = Object.getOwnPropertyDescriptor(p4, t5);
        return n5.get ? n5.get.call(arguments.length < 3 ? e7 : r6) : n5.value;
      }
    }, _get.apply(null, arguments);
  }
  var init_get = __esm({
    "node_modules/@babel/runtime/helpers/esm/get.js"() {
      init_superPropBase();
    }
  });

  // node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js
  function _arrayWithHoles(r6) {
    if (Array.isArray(r6)) return r6;
  }
  var init_arrayWithHoles = __esm({
    "node_modules/@babel/runtime/helpers/esm/arrayWithHoles.js"() {
    }
  });

  // node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js
  function _iterableToArrayLimit(r6, l3) {
    var t5 = null == r6 ? null : "undefined" != typeof Symbol && r6[Symbol.iterator] || r6["@@iterator"];
    if (null != t5) {
      var e7, n5, i7, u5, a3 = [], f3 = true, o6 = false;
      try {
        if (i7 = (t5 = t5.call(r6)).next, 0 === l3) {
          if (Object(t5) !== t5) return;
          f3 = false;
        } else for (; !(f3 = (e7 = i7.call(t5)).done) && (a3.push(e7.value), a3.length !== l3); f3 = true) ;
      } catch (r7) {
        o6 = true, n5 = r7;
      } finally {
        try {
          if (!f3 && null != t5["return"] && (u5 = t5["return"](), Object(u5) !== u5)) return;
        } finally {
          if (o6) throw n5;
        }
      }
      return a3;
    }
  }
  var init_iterableToArrayLimit = __esm({
    "node_modules/@babel/runtime/helpers/esm/iterableToArrayLimit.js"() {
    }
  });

  // node_modules/@babel/runtime/helpers/esm/nonIterableRest.js
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var init_nonIterableRest = __esm({
    "node_modules/@babel/runtime/helpers/esm/nonIterableRest.js"() {
    }
  });

  // node_modules/@babel/runtime/helpers/esm/slicedToArray.js
  function _slicedToArray(r6, e7) {
    return _arrayWithHoles(r6) || _iterableToArrayLimit(r6, e7) || _unsupportedIterableToArray2(r6, e7) || _nonIterableRest();
  }
  var init_slicedToArray = __esm({
    "node_modules/@babel/runtime/helpers/esm/slicedToArray.js"() {
      init_arrayWithHoles();
      init_iterableToArrayLimit();
      init_unsupportedIterableToArray();
      init_nonIterableRest();
    }
  });

  // node_modules/rete-connection-plugin/rete-connection-plugin.esm.js
  function ownKeys2(e7, r6) {
    var t5 = Object.keys(e7);
    if (Object.getOwnPropertySymbols) {
      var o6 = Object.getOwnPropertySymbols(e7);
      r6 && (o6 = o6.filter(function(r7) {
        return Object.getOwnPropertyDescriptor(e7, r7).enumerable;
      })), t5.push.apply(t5, o6);
    }
    return t5;
  }
  function _objectSpread2(e7) {
    for (var r6 = 1; r6 < arguments.length; r6++) {
      var t5 = null != arguments[r6] ? arguments[r6] : {};
      r6 % 2 ? ownKeys2(Object(t5), true).forEach(function(r7) {
        _defineProperty(e7, r7, t5[r7]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e7, Object.getOwnPropertyDescriptors(t5)) : ownKeys2(Object(t5)).forEach(function(r7) {
        Object.defineProperty(e7, r7, Object.getOwnPropertyDescriptor(t5, r7));
      });
    }
    return e7;
  }
  function createPseudoconnection(extra) {
    var element = null;
    var id = null;
    function unmount(areaPlugin) {
      if (id) {
        areaPlugin.removeConnectionView(id);
      }
      element = null;
      id = null;
    }
    function mount(areaPlugin) {
      unmount(areaPlugin);
      id = "pseudo_".concat(getUID());
    }
    return {
      isMounted: function isMounted() {
        return Boolean(id);
      },
      mount,
      render: function render(areaPlugin, _ref2, data) {
        var x2 = _ref2.x, y3 = _ref2.y;
        var isOutput = data.side === "output";
        var pointer = {
          x: x2 + (isOutput ? -3 : 3),
          y: y3
        };
        if (!id) throw new Error("pseudo connection id wasn't generated");
        var payload = isOutput ? _objectSpread2({
          id,
          source: data.nodeId,
          sourceOutput: data.key,
          target: "",
          targetInput: ""
        }, extra !== null && extra !== void 0 ? extra : {}) : _objectSpread2({
          id,
          target: data.nodeId,
          targetInput: data.key,
          source: "",
          sourceOutput: ""
        }, extra !== null && extra !== void 0 ? extra : {});
        if (!element) {
          var view = areaPlugin.addConnectionView(payload);
          element = view.element;
        }
        if (!element) return;
        void areaPlugin.emit({
          type: "render",
          data: _objectSpread2({
            element,
            type: "connection",
            payload
          }, isOutput ? {
            end: pointer
          } : {
            start: pointer
          })
        });
      },
      unmount
    };
  }
  function _createForOfIteratorHelper$12(r6, e7) {
    var t5 = "undefined" != typeof Symbol && r6[Symbol.iterator] || r6["@@iterator"];
    if (!t5) {
      if (Array.isArray(r6) || (t5 = _unsupportedIterableToArray$12(r6)) || e7 && r6 && "number" == typeof r6.length) {
        t5 && (r6 = t5);
        var _n = 0, F = function F2() {
        };
        return { s: F, n: function n5() {
          return _n >= r6.length ? { done: true } : { done: false, value: r6[_n++] };
        }, e: function e8(r7) {
          throw r7;
        }, f: F };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var o6, a3 = true, u5 = false;
    return { s: function s5() {
      t5 = t5.call(r6);
    }, n: function n5() {
      var r7 = t5.next();
      return a3 = r7.done, r7;
    }, e: function e8(r7) {
      u5 = true, o6 = r7;
    }, f: function f3() {
      try {
        a3 || null == t5["return"] || t5["return"]();
      } finally {
        if (u5) throw o6;
      }
    } };
  }
  function _unsupportedIterableToArray$12(r6, a3) {
    if (r6) {
      if ("string" == typeof r6) return _arrayLikeToArray$12(r6, a3);
      var t5 = {}.toString.call(r6).slice(8, -1);
      return "Object" === t5 && r6.constructor && (t5 = r6.constructor.name), "Map" === t5 || "Set" === t5 ? Array.from(r6) : "Arguments" === t5 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t5) ? _arrayLikeToArray$12(r6, a3) : void 0;
    }
  }
  function _arrayLikeToArray$12(r6, a3) {
    (null == a3 || a3 > r6.length) && (a3 = r6.length);
    for (var e7 = 0, n5 = Array(a3); e7 < a3; e7++) n5[e7] = r6[e7];
    return n5;
  }
  function findSocket(socketsCache, elements) {
    var _iterator = _createForOfIteratorHelper$12(elements), _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done; ) {
        var element = _step.value;
        var found = socketsCache.get(element);
        if (found) {
          return found;
        }
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
  }
  function elementsFromPoint(x2, y3) {
    var _elements$;
    var root = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : document;
    var elements = root.elementsFromPoint(x2, y3);
    var shadowRoot = (_elements$ = elements[0]) === null || _elements$ === void 0 ? void 0 : _elements$.shadowRoot;
    if (shadowRoot && shadowRoot !== root) {
      elements.unshift.apply(elements, _toConsumableArray(elementsFromPoint(x2, y3, shadowRoot)));
    }
    return elements;
  }
  function getSourceTarget(initial, socket) {
    var forward = initial.side === "output" && socket.side === "input";
    var backward = initial.side === "input" && socket.side === "output";
    var _ref2 = forward ? [initial, socket] : backward ? [socket, initial] : [], _ref22 = _slicedToArray(_ref2, 2), source = _ref22[0], target = _ref22[1];
    if (source && target) return [source, target];
  }
  function canMakeConnection(initial, socket) {
    return Boolean(getSourceTarget(initial, socket));
  }
  function makeConnection(initial, socket, context) {
    var _ref3 = getSourceTarget(initial, socket) || [null, null], _ref4 = _slicedToArray(_ref3, 2), source = _ref4[0], target = _ref4[1];
    if (source && target) {
      void context.editor.addConnection({
        id: getUID(),
        source: source.nodeId,
        sourceOutput: source.key,
        target: target.nodeId,
        targetInput: target.key
      });
      return true;
    }
  }
  function findPort(socket, editor) {
    var node = editor.getNode(socket.nodeId);
    if (!node) throw new Error("cannot find node");
    var list = socket.side === "input" ? node.inputs : node.outputs;
    return list[socket.key];
  }
  function findConnections(socket, editor) {
    var nodeId = socket.nodeId, side = socket.side, key = socket.key;
    return editor.getConnections().filter(function(connection) {
      if (side === "input") {
        return connection.target === nodeId && connection.targetInput === key;
      }
      if (side === "output") {
        return connection.source === nodeId && connection.sourceOutput === key;
      }
    });
  }
  function syncConnections(sockets, editor) {
    var connections = sockets.map(function(socket) {
      var port = findPort(socket, editor);
      var multiple = port === null || port === void 0 ? void 0 : port.multipleConnections;
      if (multiple) return [];
      return findConnections(socket, editor);
    }).flat();
    return {
      commit: function commit() {
        var uniqueIds = Array.from(new Set(connections.map(function(_ref2) {
          var id = _ref2.id;
          return id;
        })));
        uniqueIds.forEach(function(id) {
          return void editor.removeConnection(id);
        });
      }
    };
  }
  function _callSuper$13(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$13() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$13() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$13 = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function setup() {
    return function() {
      return new ClassicFlow();
    };
  }
  function _createForOfIteratorHelper2(r6, e7) {
    var t5 = "undefined" != typeof Symbol && r6[Symbol.iterator] || r6["@@iterator"];
    if (!t5) {
      if (Array.isArray(r6) || (t5 = _unsupportedIterableToArray3(r6)) || e7 && r6 && "number" == typeof r6.length) {
        t5 && (r6 = t5);
        var _n = 0, F = function F2() {
        };
        return { s: F, n: function n5() {
          return _n >= r6.length ? { done: true } : { done: false, value: r6[_n++] };
        }, e: function e8(r7) {
          throw r7;
        }, f: F };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var o6, a3 = true, u5 = false;
    return { s: function s5() {
      t5 = t5.call(r6);
    }, n: function n5() {
      var r7 = t5.next();
      return a3 = r7.done, r7;
    }, e: function e8(r7) {
      u5 = true, o6 = r7;
    }, f: function f3() {
      try {
        a3 || null == t5["return"] || t5["return"]();
      } finally {
        if (u5) throw o6;
      }
    } };
  }
  function _unsupportedIterableToArray3(r6, a3) {
    if (r6) {
      if ("string" == typeof r6) return _arrayLikeToArray3(r6, a3);
      var t5 = {}.toString.call(r6).slice(8, -1);
      return "Object" === t5 && r6.constructor && (t5 = r6.constructor.name), "Map" === t5 || "Set" === t5 ? Array.from(r6) : "Arguments" === t5 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t5) ? _arrayLikeToArray3(r6, a3) : void 0;
    }
  }
  function _arrayLikeToArray3(r6, a3) {
    (null == a3 || a3 > r6.length) && (a3 = r6.length);
    for (var e7 = 0, n5 = Array(a3); e7 < a3; e7++) n5[e7] = r6[e7];
    return n5;
  }
  function _callSuper3(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct3() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct3() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct3 = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _superPropGet(t5, e7, o6, r6) {
    var p4 = _get(_getPrototypeOf(1 & r6 ? t5.prototype : t5), e7, o6);
    return 2 & r6 && "function" == typeof p4 ? function(t6) {
      return p4.apply(o6, t6);
    } : p4;
  }
  var import_regenerator3, State, Picked, PickedExisting, Idle, ClassicFlow, classic2, index2, ConnectionPlugin;
  var init_rete_connection_plugin_esm = __esm({
    "node_modules/rete-connection-plugin/rete-connection-plugin.esm.js"() {
      init_typeof();
      init_asyncToGenerator();
      init_classCallCheck();
      init_createClass();
      init_possibleConstructorReturn();
      init_getPrototypeOf();
      init_get();
      init_inherits();
      init_defineProperty();
      import_regenerator3 = __toESM(require_regenerator2());
      init_rete_esm();
      init_rete_area_plugin_esm();
      init_toConsumableArray();
      init_slicedToArray();
      State = /* @__PURE__ */ function() {
        function State2() {
          _classCallCheck(this, State2);
        }
        return _createClass(State2, [{
          key: "setContext",
          value: function setContext(context) {
            this.context = context;
          }
        }]);
      }();
      Picked = /* @__PURE__ */ function(_State) {
        function Picked2(initial, params) {
          var _this;
          _classCallCheck(this, Picked2);
          _this = _callSuper$13(this, Picked2);
          _this.initial = initial;
          _this.params = params;
          return _this;
        }
        _inherits(Picked2, _State);
        return _createClass(Picked2, [{
          key: "pick",
          value: function() {
            var _pick = _asyncToGenerator(/* @__PURE__ */ import_regenerator3.default.mark(function _callee(_ref2, context) {
              var socket, created;
              return import_regenerator3.default.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    socket = _ref2.socket;
                    if (this.params.canMakeConnection(this.initial, socket)) {
                      syncConnections([this.initial, socket], context.editor).commit();
                      created = this.params.makeConnection(this.initial, socket, context);
                      this.drop(context, created ? socket : null, created);
                    }
                  case 2:
                  case "end":
                    return _context.stop();
                }
              }, _callee, this);
            }));
            function pick(_x, _x2) {
              return _pick.apply(this, arguments);
            }
            return pick;
          }()
        }, {
          key: "drop",
          value: function drop(context) {
            var socket = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
            var created = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
            if (this.initial) {
              void context.scope.emit({
                type: "connectiondrop",
                data: {
                  initial: this.initial,
                  socket,
                  created
                }
              });
            }
            this.context.switchTo(new Idle(this.params));
          }
        }]);
      }(State);
      PickedExisting = /* @__PURE__ */ function(_State2) {
        function PickedExisting2(connection, params, context) {
          var _this2;
          _classCallCheck(this, PickedExisting2);
          _this2 = _callSuper$13(this, PickedExisting2);
          _this2.connection = connection;
          _this2.params = params;
          var outputSocket = Array.from(context.socketsCache.values()).find(function(data) {
            return data.nodeId === _this2.connection.source && data.side === "output" && data.key === _this2.connection.sourceOutput;
          });
          if (!outputSocket) throw new Error("cannot find output socket");
          _this2.outputSocket = outputSocket;
          return _this2;
        }
        _inherits(PickedExisting2, _State2);
        return _createClass(PickedExisting2, [{
          key: "init",
          value: function() {
            var _init = _asyncToGenerator(/* @__PURE__ */ import_regenerator3.default.mark(function _callee2(context) {
              var _this3 = this;
              return import_regenerator3.default.wrap(function _callee2$(_context2) {
                while (1) switch (_context2.prev = _context2.next) {
                  case 0:
                    void context.scope.emit({
                      type: "connectionpick",
                      data: {
                        socket: this.outputSocket
                      }
                    }).then(function(response) {
                      if (response) {
                        void context.editor.removeConnection(_this3.connection.id);
                        _this3.initial = _this3.outputSocket;
                      } else {
                        _this3.drop(context);
                      }
                    });
                  case 1:
                  case "end":
                    return _context2.stop();
                }
              }, _callee2, this);
            }));
            function init(_x3) {
              return _init.apply(this, arguments);
            }
            return init;
          }()
        }, {
          key: "pick",
          value: function() {
            var _pick2 = _asyncToGenerator(/* @__PURE__ */ import_regenerator3.default.mark(function _callee3(_ref2, context) {
              var socket, event, created, droppedSocket, _created, _droppedSocket;
              return import_regenerator3.default.wrap(function _callee3$(_context3) {
                while (1) switch (_context3.prev = _context3.next) {
                  case 0:
                    socket = _ref2.socket, event = _ref2.event;
                    if (this.initial && !(socket.side === "input" && this.connection.target === socket.nodeId && this.connection.targetInput === socket.key)) {
                      if (this.params.canMakeConnection(this.initial, socket)) {
                        syncConnections([this.initial, socket], context.editor).commit();
                        created = this.params.makeConnection(this.initial, socket, context);
                        droppedSocket = created ? socket : null;
                        this.drop(context, droppedSocket, created);
                      }
                    } else if (event === "down") {
                      if (this.initial) {
                        syncConnections([this.initial, socket], context.editor).commit();
                        _created = this.params.makeConnection(this.initial, socket, context);
                        _droppedSocket = _created ? null : socket;
                        this.drop(context, _droppedSocket, _created);
                      }
                    }
                  case 2:
                  case "end":
                    return _context3.stop();
                }
              }, _callee3, this);
            }));
            function pick(_x4, _x5) {
              return _pick2.apply(this, arguments);
            }
            return pick;
          }()
        }, {
          key: "drop",
          value: function drop(context) {
            var socket = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
            var created = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
            if (this.initial) {
              void context.scope.emit({
                type: "connectiondrop",
                data: {
                  initial: this.initial,
                  socket,
                  created
                }
              });
            }
            this.context.switchTo(new Idle(this.params));
          }
        }]);
      }(State);
      Idle = /* @__PURE__ */ function(_State3) {
        function Idle2(params) {
          var _this4;
          _classCallCheck(this, Idle2);
          _this4 = _callSuper$13(this, Idle2);
          _this4.params = params;
          return _this4;
        }
        _inherits(Idle2, _State3);
        return _createClass(Idle2, [{
          key: "pick",
          value: function() {
            var _pick3 = _asyncToGenerator(/* @__PURE__ */ import_regenerator3.default.mark(function _callee4(_ref3, context) {
              var socket, event, _connection, state;
              return import_regenerator3.default.wrap(function _callee4$(_context4) {
                while (1) switch (_context4.prev = _context4.next) {
                  case 0:
                    socket = _ref3.socket, event = _ref3.event;
                    if (!(event !== "down")) {
                      _context4.next = 3;
                      break;
                    }
                    return _context4.abrupt("return");
                  case 3:
                    if (!(socket.side === "input")) {
                      _context4.next = 11;
                      break;
                    }
                    _connection = context.editor.getConnections().find(function(item) {
                      return item.target === socket.nodeId && item.targetInput === socket.key;
                    });
                    if (!_connection) {
                      _context4.next = 11;
                      break;
                    }
                    state = new PickedExisting(_connection, this.params, context);
                    _context4.next = 9;
                    return state.init(context);
                  case 9:
                    this.context.switchTo(state);
                    return _context4.abrupt("return");
                  case 11:
                    _context4.next = 13;
                    return context.scope.emit({
                      type: "connectionpick",
                      data: {
                        socket
                      }
                    });
                  case 13:
                    if (!_context4.sent) {
                      _context4.next = 17;
                      break;
                    }
                    this.context.switchTo(new Picked(socket, this.params));
                    _context4.next = 18;
                    break;
                  case 17:
                    this.drop(context);
                  case 18:
                  case "end":
                    return _context4.stop();
                }
              }, _callee4, this);
            }));
            function pick(_x6, _x7) {
              return _pick3.apply(this, arguments);
            }
            return pick;
          }()
        }, {
          key: "drop",
          value: function drop(context) {
            var socket = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
            var created = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : false;
            if (this.initial) {
              void context.scope.emit({
                type: "connectiondrop",
                data: {
                  initial: this.initial,
                  socket,
                  created
                }
              });
            }
            delete this.initial;
          }
        }]);
      }(State);
      ClassicFlow = /* @__PURE__ */ function() {
        function ClassicFlow2(params) {
          _classCallCheck(this, ClassicFlow2);
          var canMakeConnection$1 = (params === null || params === void 0 ? void 0 : params.canMakeConnection) || canMakeConnection;
          var makeConnection$1 = (params === null || params === void 0 ? void 0 : params.makeConnection) || makeConnection;
          this.switchTo(new Idle({
            canMakeConnection: canMakeConnection$1,
            makeConnection: makeConnection$1
          }));
        }
        return _createClass(ClassicFlow2, [{
          key: "pick",
          value: function() {
            var _pick4 = _asyncToGenerator(/* @__PURE__ */ import_regenerator3.default.mark(function _callee5(params, context) {
              return import_regenerator3.default.wrap(function _callee5$(_context5) {
                while (1) switch (_context5.prev = _context5.next) {
                  case 0:
                    _context5.next = 2;
                    return this.currentState.pick(params, context);
                  case 2:
                  case "end":
                    return _context5.stop();
                }
              }, _callee5, this);
            }));
            function pick(_x8, _x9) {
              return _pick4.apply(this, arguments);
            }
            return pick;
          }()
        }, {
          key: "getPickedSocket",
          value: function getPickedSocket() {
            return this.currentState.initial;
          }
        }, {
          key: "switchTo",
          value: function switchTo(state) {
            state.setContext(this);
            this.currentState = state;
          }
        }, {
          key: "drop",
          value: function drop(context) {
            this.currentState.drop(context);
          }
        }]);
      }();
      classic2 = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        setup
      });
      index2 = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        classic: classic2
      });
      ConnectionPlugin = /* @__PURE__ */ function(_Scope) {
        function ConnectionPlugin2() {
          var _this;
          _classCallCheck(this, ConnectionPlugin2);
          _this = _callSuper3(this, ConnectionPlugin2, ["connection"]);
          _defineProperty(_this, "presets", []);
          _defineProperty(_this, "currentFlow", null);
          _defineProperty(_this, "preudoconnection", createPseudoconnection({
            isPseudo: true
          }));
          _defineProperty(_this, "socketsCache", /* @__PURE__ */ new Map());
          return _this;
        }
        _inherits(ConnectionPlugin2, _Scope);
        return _createClass(ConnectionPlugin2, [{
          key: "addPreset",
          value: function addPreset(preset) {
            this.presets.push(preset);
          }
        }, {
          key: "findPreset",
          value: function findPreset(data) {
            var _iterator = _createForOfIteratorHelper2(this.presets), _step;
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                var preset = _step.value;
                var flow = preset(data);
                if (flow) return flow;
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
            return null;
          }
        }, {
          key: "update",
          value: function update() {
            if (!this.currentFlow) return;
            var socket = this.currentFlow.getPickedSocket();
            if (socket) {
              this.preudoconnection.render(this.areaPlugin, this.areaPlugin.area.pointer, socket);
            }
          }
          /**
           * Drop pseudo-connection if exists
           * @emits connectiondrop
           */
        }, {
          key: "drop",
          value: function drop() {
            var flowContext = {
              editor: this.editor,
              scope: this,
              socketsCache: this.socketsCache
            };
            if (this.currentFlow) {
              this.currentFlow.drop(flowContext);
              this.preudoconnection.unmount(this.areaPlugin);
              this.currentFlow = null;
            }
          }
          // eslint-disable-next-line max-statements
        }, {
          key: "pick",
          value: function() {
            var _pick = _asyncToGenerator(/* @__PURE__ */ import_regenerator3.default.mark(function _callee(event, type) {
              var flowContext, pointedElements, pickedSocket;
              return import_regenerator3.default.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    flowContext = {
                      editor: this.editor,
                      scope: this,
                      socketsCache: this.socketsCache
                    };
                    pointedElements = elementsFromPoint(event.clientX, event.clientY);
                    pickedSocket = findSocket(this.socketsCache, pointedElements);
                    if (!pickedSocket) {
                      _context.next = 13;
                      break;
                    }
                    event.preventDefault();
                    event.stopPropagation();
                    this.currentFlow = this.currentFlow || this.findPreset(pickedSocket);
                    if (!this.currentFlow) {
                      _context.next = 11;
                      break;
                    }
                    _context.next = 10;
                    return this.currentFlow.pick({
                      socket: pickedSocket,
                      event: type
                    }, flowContext);
                  case 10:
                    this.preudoconnection.mount(this.areaPlugin);
                  case 11:
                    _context.next = 14;
                    break;
                  case 13:
                    if (this.currentFlow) {
                      this.currentFlow.drop(flowContext);
                    }
                  case 14:
                    if (this.currentFlow && !this.currentFlow.getPickedSocket()) {
                      this.preudoconnection.unmount(this.areaPlugin);
                      this.currentFlow = null;
                    }
                    this.update();
                  case 16:
                  case "end":
                    return _context.stop();
                }
              }, _callee, this);
            }));
            function pick(_x, _x2) {
              return _pick.apply(this, arguments);
            }
            return pick;
          }()
        }, {
          key: "setParent",
          value: function setParent(scope) {
            var _this2 = this;
            _superPropGet(ConnectionPlugin2, "setParent", this, 3)([scope]);
            this.areaPlugin = this.parentScope(BaseAreaPlugin);
            this.editor = this.areaPlugin.parentScope(NodeEditor);
            var pointerdownSocket = function pointerdownSocket2(e7) {
              void _this2.pick(e7, "down");
            };
            this.addPipe(function(context) {
              if (!context || _typeof(context) !== "object" || !("type" in context)) return context;
              if (context.type === "pointermove") {
                _this2.update();
              } else if (context.type === "pointerup") {
                void _this2.pick(context.data.event, "up");
              } else if (context.type === "render") {
                if (context.data.type === "socket") {
                  var element = context.data.element;
                  element.addEventListener("pointerdown", pointerdownSocket);
                  _this2.socketsCache.set(element, context.data);
                }
              } else if (context.type === "unmount") {
                var _element = context.data.element;
                _element.removeEventListener("pointerdown", pointerdownSocket);
                _this2.socketsCache["delete"](_element);
              }
              return context;
            });
          }
        }]);
      }(Scope);
    }
  });

  // node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js
  function _taggedTemplateLiteral(e7, t5) {
    return t5 || (t5 = e7.slice(0)), Object.freeze(Object.defineProperties(e7, {
      raw: {
        value: Object.freeze(t5)
      }
    }));
  }
  var init_taggedTemplateLiteral = __esm({
    "node_modules/@babel/runtime/helpers/esm/taggedTemplateLiteral.js"() {
    }
  });

  // node_modules/@lit/reactive-element/css-tag.js
  var t, e, s, o, n, r, i, S, c;
  var init_css_tag = __esm({
    "node_modules/@lit/reactive-element/css-tag.js"() {
      t = globalThis;
      e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
      s = Symbol();
      o = /* @__PURE__ */ new WeakMap();
      n = class {
        constructor(t5, e7, o6) {
          if (this._$cssResult$ = true, o6 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
          this.cssText = t5, this.t = e7;
        }
        get styleSheet() {
          let t5 = this.o;
          const s5 = this.t;
          if (e && void 0 === t5) {
            const e7 = void 0 !== s5 && 1 === s5.length;
            e7 && (t5 = o.get(s5)), void 0 === t5 && ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText), e7 && o.set(s5, t5));
          }
          return t5;
        }
        toString() {
          return this.cssText;
        }
      };
      r = (t5) => new n("string" == typeof t5 ? t5 : t5 + "", void 0, s);
      i = (t5, ...e7) => {
        const o6 = 1 === t5.length ? t5[0] : e7.reduce((e8, s5, o7) => e8 + ((t6) => {
          if (true === t6._$cssResult$) return t6.cssText;
          if ("number" == typeof t6) return t6;
          throw Error("Value passed to 'css' function must be a 'css' function result: " + t6 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
        })(s5) + t5[o7 + 1], t5[0]);
        return new n(o6, t5, s);
      };
      S = (s5, o6) => {
        if (e) s5.adoptedStyleSheets = o6.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet);
        else for (const e7 of o6) {
          const o7 = document.createElement("style"), n5 = t.litNonce;
          void 0 !== n5 && o7.setAttribute("nonce", n5), o7.textContent = e7.cssText, s5.appendChild(o7);
        }
      };
      c = e ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
        let e7 = "";
        for (const s5 of t6.cssRules) e7 += s5.cssText;
        return r(e7);
      })(t5) : t5;
    }
  });

  // node_modules/@lit/reactive-element/reactive-element.js
  var i2, e2, h, r2, o2, n2, a, c2, l, p, d, u, f, b, y;
  var init_reactive_element = __esm({
    "node_modules/@lit/reactive-element/reactive-element.js"() {
      init_css_tag();
      init_css_tag();
      ({ is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object);
      a = globalThis;
      c2 = a.trustedTypes;
      l = c2 ? c2.emptyScript : "";
      p = a.reactiveElementPolyfillSupport;
      d = (t5, s5) => t5;
      u = { toAttribute(t5, s5) {
        switch (s5) {
          case Boolean:
            t5 = t5 ? l : null;
            break;
          case Object:
          case Array:
            t5 = null == t5 ? t5 : JSON.stringify(t5);
        }
        return t5;
      }, fromAttribute(t5, s5) {
        let i7 = t5;
        switch (s5) {
          case Boolean:
            i7 = null !== t5;
            break;
          case Number:
            i7 = null === t5 ? null : Number(t5);
            break;
          case Object:
          case Array:
            try {
              i7 = JSON.parse(t5);
            } catch (t6) {
              i7 = null;
            }
        }
        return i7;
      } };
      f = (t5, s5) => !i2(t5, s5);
      b = { attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f };
      Symbol.metadata ??= Symbol("metadata"), a.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
      y = class extends HTMLElement {
        static addInitializer(t5) {
          this._$Ei(), (this.l ??= []).push(t5);
        }
        static get observedAttributes() {
          return this.finalize(), this._$Eh && [...this._$Eh.keys()];
        }
        static createProperty(t5, s5 = b) {
          if (s5.state && (s5.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t5) && ((s5 = Object.create(s5)).wrapped = true), this.elementProperties.set(t5, s5), !s5.noAccessor) {
            const i7 = Symbol(), h4 = this.getPropertyDescriptor(t5, i7, s5);
            void 0 !== h4 && e2(this.prototype, t5, h4);
          }
        }
        static getPropertyDescriptor(t5, s5, i7) {
          const { get: e7, set: r6 } = h(this.prototype, t5) ?? { get() {
            return this[s5];
          }, set(t6) {
            this[s5] = t6;
          } };
          return { get: e7, set(s6) {
            const h4 = e7?.call(this);
            r6?.call(this, s6), this.requestUpdate(t5, h4, i7);
          }, configurable: true, enumerable: true };
        }
        static getPropertyOptions(t5) {
          return this.elementProperties.get(t5) ?? b;
        }
        static _$Ei() {
          if (this.hasOwnProperty(d("elementProperties"))) return;
          const t5 = n2(this);
          t5.finalize(), void 0 !== t5.l && (this.l = [...t5.l]), this.elementProperties = new Map(t5.elementProperties);
        }
        static finalize() {
          if (this.hasOwnProperty(d("finalized"))) return;
          if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
            const t6 = this.properties, s5 = [...r2(t6), ...o2(t6)];
            for (const i7 of s5) this.createProperty(i7, t6[i7]);
          }
          const t5 = this[Symbol.metadata];
          if (null !== t5) {
            const s5 = litPropertyMetadata.get(t5);
            if (void 0 !== s5) for (const [t6, i7] of s5) this.elementProperties.set(t6, i7);
          }
          this._$Eh = /* @__PURE__ */ new Map();
          for (const [t6, s5] of this.elementProperties) {
            const i7 = this._$Eu(t6, s5);
            void 0 !== i7 && this._$Eh.set(i7, t6);
          }
          this.elementStyles = this.finalizeStyles(this.styles);
        }
        static finalizeStyles(s5) {
          const i7 = [];
          if (Array.isArray(s5)) {
            const e7 = new Set(s5.flat(1 / 0).reverse());
            for (const s6 of e7) i7.unshift(c(s6));
          } else void 0 !== s5 && i7.push(c(s5));
          return i7;
        }
        static _$Eu(t5, s5) {
          const i7 = s5.attribute;
          return false === i7 ? void 0 : "string" == typeof i7 ? i7 : "string" == typeof t5 ? t5.toLowerCase() : void 0;
        }
        constructor() {
          super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
        }
        _$Ev() {
          this._$ES = new Promise((t5) => this.enableUpdating = t5), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t5) => t5(this));
        }
        addController(t5) {
          (this._$EO ??= /* @__PURE__ */ new Set()).add(t5), void 0 !== this.renderRoot && this.isConnected && t5.hostConnected?.();
        }
        removeController(t5) {
          this._$EO?.delete(t5);
        }
        _$E_() {
          const t5 = /* @__PURE__ */ new Map(), s5 = this.constructor.elementProperties;
          for (const i7 of s5.keys()) this.hasOwnProperty(i7) && (t5.set(i7, this[i7]), delete this[i7]);
          t5.size > 0 && (this._$Ep = t5);
        }
        createRenderRoot() {
          const t5 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
          return S(t5, this.constructor.elementStyles), t5;
        }
        connectedCallback() {
          this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t5) => t5.hostConnected?.());
        }
        enableUpdating(t5) {
        }
        disconnectedCallback() {
          this._$EO?.forEach((t5) => t5.hostDisconnected?.());
        }
        attributeChangedCallback(t5, s5, i7) {
          this._$AK(t5, i7);
        }
        _$ET(t5, s5) {
          const i7 = this.constructor.elementProperties.get(t5), e7 = this.constructor._$Eu(t5, i7);
          if (void 0 !== e7 && true === i7.reflect) {
            const h4 = (void 0 !== i7.converter?.toAttribute ? i7.converter : u).toAttribute(s5, i7.type);
            this._$Em = t5, null == h4 ? this.removeAttribute(e7) : this.setAttribute(e7, h4), this._$Em = null;
          }
        }
        _$AK(t5, s5) {
          const i7 = this.constructor, e7 = i7._$Eh.get(t5);
          if (void 0 !== e7 && this._$Em !== e7) {
            const t6 = i7.getPropertyOptions(e7), h4 = "function" == typeof t6.converter ? { fromAttribute: t6.converter } : void 0 !== t6.converter?.fromAttribute ? t6.converter : u;
            this._$Em = e7;
            const r6 = h4.fromAttribute(s5, t6.type);
            this[e7] = r6 ?? this._$Ej?.get(e7) ?? r6, this._$Em = null;
          }
        }
        requestUpdate(t5, s5, i7, e7 = false, h4) {
          if (void 0 !== t5) {
            const r6 = this.constructor;
            if (false === e7 && (h4 = this[t5]), i7 ??= r6.getPropertyOptions(t5), !((i7.hasChanged ?? f)(h4, s5) || i7.useDefault && i7.reflect && h4 === this._$Ej?.get(t5) && !this.hasAttribute(r6._$Eu(t5, i7)))) return;
            this.C(t5, s5, i7);
          }
          false === this.isUpdatePending && (this._$ES = this._$EP());
        }
        C(t5, s5, { useDefault: i7, reflect: e7, wrapped: h4 }, r6) {
          i7 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t5) && (this._$Ej.set(t5, r6 ?? s5 ?? this[t5]), true !== h4 || void 0 !== r6) || (this._$AL.has(t5) || (this.hasUpdated || i7 || (s5 = void 0), this._$AL.set(t5, s5)), true === e7 && this._$Em !== t5 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t5));
        }
        async _$EP() {
          this.isUpdatePending = true;
          try {
            await this._$ES;
          } catch (t6) {
            Promise.reject(t6);
          }
          const t5 = this.scheduleUpdate();
          return null != t5 && await t5, !this.isUpdatePending;
        }
        scheduleUpdate() {
          return this.performUpdate();
        }
        performUpdate() {
          if (!this.isUpdatePending) return;
          if (!this.hasUpdated) {
            if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
              for (const [t7, s6] of this._$Ep) this[t7] = s6;
              this._$Ep = void 0;
            }
            const t6 = this.constructor.elementProperties;
            if (t6.size > 0) for (const [s6, i7] of t6) {
              const { wrapped: t7 } = i7, e7 = this[s6];
              true !== t7 || this._$AL.has(s6) || void 0 === e7 || this.C(s6, void 0, i7, e7);
            }
          }
          let t5 = false;
          const s5 = this._$AL;
          try {
            t5 = this.shouldUpdate(s5), t5 ? (this.willUpdate(s5), this._$EO?.forEach((t6) => t6.hostUpdate?.()), this.update(s5)) : this._$EM();
          } catch (s6) {
            throw t5 = false, this._$EM(), s6;
          }
          t5 && this._$AE(s5);
        }
        willUpdate(t5) {
        }
        _$AE(t5) {
          this._$EO?.forEach((t6) => t6.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
        }
        _$EM() {
          this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
        }
        get updateComplete() {
          return this.getUpdateComplete();
        }
        getUpdateComplete() {
          return this._$ES;
        }
        shouldUpdate(t5) {
          return true;
        }
        update(t5) {
          this._$Eq &&= this._$Eq.forEach((t6) => this._$ET(t6, this[t6])), this._$EM();
        }
        updated(t5) {
        }
        firstUpdated(t5) {
        }
      };
      y.elementStyles = [], y.shadowRootOptions = { mode: "open" }, y[d("elementProperties")] = /* @__PURE__ */ new Map(), y[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: y }), (a.reactiveElementVersions ??= []).push("2.1.2");
    }
  });

  // node_modules/lit-html/lit-html.js
  function V(t5, i7) {
    if (!u2(t5) || !t5.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== e3 ? e3.createHTML(i7) : i7;
  }
  function M(t5, i7, s5 = t5, e7) {
    if (i7 === E) return i7;
    let h4 = void 0 !== e7 ? s5._$Co?.[e7] : s5._$Cl;
    const o6 = a2(i7) ? void 0 : i7._$litDirective$;
    return h4?.constructor !== o6 && (h4?._$AO?.(false), void 0 === o6 ? h4 = void 0 : (h4 = new o6(t5), h4._$AT(t5, s5, e7)), void 0 !== e7 ? (s5._$Co ??= [])[e7] = h4 : s5._$Cl = h4), void 0 !== h4 && (i7 = M(t5, h4._$AS(t5, i7.values), h4, e7)), i7;
  }
  var t2, i3, s2, e3, h2, o3, n3, r3, l2, c3, a2, u2, d2, f2, v, _, m, p2, g, $, y2, x, b2, w, T, E, A, C, P, N, S2, R, k, H, I, L, z, Z, j, B, D;
  var init_lit_html = __esm({
    "node_modules/lit-html/lit-html.js"() {
      t2 = globalThis;
      i3 = (t5) => t5;
      s2 = t2.trustedTypes;
      e3 = s2 ? s2.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
      h2 = "$lit$";
      o3 = `lit$${Math.random().toFixed(9).slice(2)}$`;
      n3 = "?" + o3;
      r3 = `<${n3}>`;
      l2 = document;
      c3 = () => l2.createComment("");
      a2 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
      u2 = Array.isArray;
      d2 = (t5) => u2(t5) || "function" == typeof t5?.[Symbol.iterator];
      f2 = "[ 	\n\f\r]";
      v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
      _ = /-->/g;
      m = />/g;
      p2 = RegExp(`>|${f2}(?:([^\\s"'>=/]+)(${f2}*=${f2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
      g = /'/g;
      $ = /"/g;
      y2 = /^(?:script|style|textarea|title)$/i;
      x = (t5) => (i7, ...s5) => ({ _$litType$: t5, strings: i7, values: s5 });
      b2 = x(1);
      w = x(2);
      T = x(3);
      E = Symbol.for("lit-noChange");
      A = Symbol.for("lit-nothing");
      C = /* @__PURE__ */ new WeakMap();
      P = l2.createTreeWalker(l2, 129);
      N = (t5, i7) => {
        const s5 = t5.length - 1, e7 = [];
        let n5, l3 = 2 === i7 ? "<svg>" : 3 === i7 ? "<math>" : "", c5 = v;
        for (let i8 = 0; i8 < s5; i8++) {
          const s6 = t5[i8];
          let a3, u5, d3 = -1, f3 = 0;
          for (; f3 < s6.length && (c5.lastIndex = f3, u5 = c5.exec(s6), null !== u5); ) f3 = c5.lastIndex, c5 === v ? "!--" === u5[1] ? c5 = _ : void 0 !== u5[1] ? c5 = m : void 0 !== u5[2] ? (y2.test(u5[2]) && (n5 = RegExp("</" + u5[2], "g")), c5 = p2) : void 0 !== u5[3] && (c5 = p2) : c5 === p2 ? ">" === u5[0] ? (c5 = n5 ?? v, d3 = -1) : void 0 === u5[1] ? d3 = -2 : (d3 = c5.lastIndex - u5[2].length, a3 = u5[1], c5 = void 0 === u5[3] ? p2 : '"' === u5[3] ? $ : g) : c5 === $ || c5 === g ? c5 = p2 : c5 === _ || c5 === m ? c5 = v : (c5 = p2, n5 = void 0);
          const x2 = c5 === p2 && t5[i8 + 1].startsWith("/>") ? " " : "";
          l3 += c5 === v ? s6 + r3 : d3 >= 0 ? (e7.push(a3), s6.slice(0, d3) + h2 + s6.slice(d3) + o3 + x2) : s6 + o3 + (-2 === d3 ? i8 : x2);
        }
        return [V(t5, l3 + (t5[s5] || "<?>") + (2 === i7 ? "</svg>" : 3 === i7 ? "</math>" : "")), e7];
      };
      S2 = class _S {
        constructor({ strings: t5, _$litType$: i7 }, e7) {
          let r6;
          this.parts = [];
          let l3 = 0, a3 = 0;
          const u5 = t5.length - 1, d3 = this.parts, [f3, v3] = N(t5, i7);
          if (this.el = _S.createElement(f3, e7), P.currentNode = this.el.content, 2 === i7 || 3 === i7) {
            const t6 = this.el.content.firstChild;
            t6.replaceWith(...t6.childNodes);
          }
          for (; null !== (r6 = P.nextNode()) && d3.length < u5; ) {
            if (1 === r6.nodeType) {
              if (r6.hasAttributes()) for (const t6 of r6.getAttributeNames()) if (t6.endsWith(h2)) {
                const i8 = v3[a3++], s5 = r6.getAttribute(t6).split(o3), e8 = /([.?@])?(.*)/.exec(i8);
                d3.push({ type: 1, index: l3, name: e8[2], strings: s5, ctor: "." === e8[1] ? I : "?" === e8[1] ? L : "@" === e8[1] ? z : H }), r6.removeAttribute(t6);
              } else t6.startsWith(o3) && (d3.push({ type: 6, index: l3 }), r6.removeAttribute(t6));
              if (y2.test(r6.tagName)) {
                const t6 = r6.textContent.split(o3), i8 = t6.length - 1;
                if (i8 > 0) {
                  r6.textContent = s2 ? s2.emptyScript : "";
                  for (let s5 = 0; s5 < i8; s5++) r6.append(t6[s5], c3()), P.nextNode(), d3.push({ type: 2, index: ++l3 });
                  r6.append(t6[i8], c3());
                }
              }
            } else if (8 === r6.nodeType) if (r6.data === n3) d3.push({ type: 2, index: l3 });
            else {
              let t6 = -1;
              for (; -1 !== (t6 = r6.data.indexOf(o3, t6 + 1)); ) d3.push({ type: 7, index: l3 }), t6 += o3.length - 1;
            }
            l3++;
          }
        }
        static createElement(t5, i7) {
          const s5 = l2.createElement("template");
          return s5.innerHTML = t5, s5;
        }
      };
      R = class {
        constructor(t5, i7) {
          this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i7;
        }
        get parentNode() {
          return this._$AM.parentNode;
        }
        get _$AU() {
          return this._$AM._$AU;
        }
        u(t5) {
          const { el: { content: i7 }, parts: s5 } = this._$AD, e7 = (t5?.creationScope ?? l2).importNode(i7, true);
          P.currentNode = e7;
          let h4 = P.nextNode(), o6 = 0, n5 = 0, r6 = s5[0];
          for (; void 0 !== r6; ) {
            if (o6 === r6.index) {
              let i8;
              2 === r6.type ? i8 = new k(h4, h4.nextSibling, this, t5) : 1 === r6.type ? i8 = new r6.ctor(h4, r6.name, r6.strings, this, t5) : 6 === r6.type && (i8 = new Z(h4, this, t5)), this._$AV.push(i8), r6 = s5[++n5];
            }
            o6 !== r6?.index && (h4 = P.nextNode(), o6++);
          }
          return P.currentNode = l2, e7;
        }
        p(t5) {
          let i7 = 0;
          for (const s5 of this._$AV) void 0 !== s5 && (void 0 !== s5.strings ? (s5._$AI(t5, s5, i7), i7 += s5.strings.length - 2) : s5._$AI(t5[i7])), i7++;
        }
      };
      k = class _k {
        get _$AU() {
          return this._$AM?._$AU ?? this._$Cv;
        }
        constructor(t5, i7, s5, e7) {
          this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t5, this._$AB = i7, this._$AM = s5, this.options = e7, this._$Cv = e7?.isConnected ?? true;
        }
        get parentNode() {
          let t5 = this._$AA.parentNode;
          const i7 = this._$AM;
          return void 0 !== i7 && 11 === t5?.nodeType && (t5 = i7.parentNode), t5;
        }
        get startNode() {
          return this._$AA;
        }
        get endNode() {
          return this._$AB;
        }
        _$AI(t5, i7 = this) {
          t5 = M(this, t5, i7), a2(t5) ? t5 === A || null == t5 || "" === t5 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t5 !== this._$AH && t5 !== E && this._(t5) : void 0 !== t5._$litType$ ? this.$(t5) : void 0 !== t5.nodeType ? this.T(t5) : d2(t5) ? this.k(t5) : this._(t5);
        }
        O(t5) {
          return this._$AA.parentNode.insertBefore(t5, this._$AB);
        }
        T(t5) {
          this._$AH !== t5 && (this._$AR(), this._$AH = this.O(t5));
        }
        _(t5) {
          this._$AH !== A && a2(this._$AH) ? this._$AA.nextSibling.data = t5 : this.T(l2.createTextNode(t5)), this._$AH = t5;
        }
        $(t5) {
          const { values: i7, _$litType$: s5 } = t5, e7 = "number" == typeof s5 ? this._$AC(t5) : (void 0 === s5.el && (s5.el = S2.createElement(V(s5.h, s5.h[0]), this.options)), s5);
          if (this._$AH?._$AD === e7) this._$AH.p(i7);
          else {
            const t6 = new R(e7, this), s6 = t6.u(this.options);
            t6.p(i7), this.T(s6), this._$AH = t6;
          }
        }
        _$AC(t5) {
          let i7 = C.get(t5.strings);
          return void 0 === i7 && C.set(t5.strings, i7 = new S2(t5)), i7;
        }
        k(t5) {
          u2(this._$AH) || (this._$AH = [], this._$AR());
          const i7 = this._$AH;
          let s5, e7 = 0;
          for (const h4 of t5) e7 === i7.length ? i7.push(s5 = new _k(this.O(c3()), this.O(c3()), this, this.options)) : s5 = i7[e7], s5._$AI(h4), e7++;
          e7 < i7.length && (this._$AR(s5 && s5._$AB.nextSibling, e7), i7.length = e7);
        }
        _$AR(t5 = this._$AA.nextSibling, s5) {
          for (this._$AP?.(false, true, s5); t5 !== this._$AB; ) {
            const s6 = i3(t5).nextSibling;
            i3(t5).remove(), t5 = s6;
          }
        }
        setConnected(t5) {
          void 0 === this._$AM && (this._$Cv = t5, this._$AP?.(t5));
        }
      };
      H = class {
        get tagName() {
          return this.element.tagName;
        }
        get _$AU() {
          return this._$AM._$AU;
        }
        constructor(t5, i7, s5, e7, h4) {
          this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t5, this.name = i7, this._$AM = e7, this.options = h4, s5.length > 2 || "" !== s5[0] || "" !== s5[1] ? (this._$AH = Array(s5.length - 1).fill(new String()), this.strings = s5) : this._$AH = A;
        }
        _$AI(t5, i7 = this, s5, e7) {
          const h4 = this.strings;
          let o6 = false;
          if (void 0 === h4) t5 = M(this, t5, i7, 0), o6 = !a2(t5) || t5 !== this._$AH && t5 !== E, o6 && (this._$AH = t5);
          else {
            const e8 = t5;
            let n5, r6;
            for (t5 = h4[0], n5 = 0; n5 < h4.length - 1; n5++) r6 = M(this, e8[s5 + n5], i7, n5), r6 === E && (r6 = this._$AH[n5]), o6 ||= !a2(r6) || r6 !== this._$AH[n5], r6 === A ? t5 = A : t5 !== A && (t5 += (r6 ?? "") + h4[n5 + 1]), this._$AH[n5] = r6;
          }
          o6 && !e7 && this.j(t5);
        }
        j(t5) {
          t5 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t5 ?? "");
        }
      };
      I = class extends H {
        constructor() {
          super(...arguments), this.type = 3;
        }
        j(t5) {
          this.element[this.name] = t5 === A ? void 0 : t5;
        }
      };
      L = class extends H {
        constructor() {
          super(...arguments), this.type = 4;
        }
        j(t5) {
          this.element.toggleAttribute(this.name, !!t5 && t5 !== A);
        }
      };
      z = class extends H {
        constructor(t5, i7, s5, e7, h4) {
          super(t5, i7, s5, e7, h4), this.type = 5;
        }
        _$AI(t5, i7 = this) {
          if ((t5 = M(this, t5, i7, 0) ?? A) === E) return;
          const s5 = this._$AH, e7 = t5 === A && s5 !== A || t5.capture !== s5.capture || t5.once !== s5.once || t5.passive !== s5.passive, h4 = t5 !== A && (s5 === A || e7);
          e7 && this.element.removeEventListener(this.name, this, s5), h4 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
        }
        handleEvent(t5) {
          "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t5) : this._$AH.handleEvent(t5);
        }
      };
      Z = class {
        constructor(t5, i7, s5) {
          this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i7, this.options = s5;
        }
        get _$AU() {
          return this._$AM._$AU;
        }
        _$AI(t5) {
          M(this, t5);
        }
      };
      j = { M: h2, P: o3, A: n3, C: 1, L: N, R, D: d2, V: M, I: k, H, N: L, U: z, B: I, F: Z };
      B = t2.litHtmlPolyfillSupport;
      B?.(S2, k), (t2.litHtmlVersions ??= []).push("3.3.2");
      D = (t5, i7, s5) => {
        const e7 = s5?.renderBefore ?? i7;
        let h4 = e7._$litPart$;
        if (void 0 === h4) {
          const t6 = s5?.renderBefore ?? null;
          e7._$litPart$ = h4 = new k(i7.insertBefore(c3(), t6), t6, void 0, s5 ?? {});
        }
        return h4._$AI(t5), h4;
      };
    }
  });

  // node_modules/lit-element/lit-element.js
  var s3, i4, o4;
  var init_lit_element = __esm({
    "node_modules/lit-element/lit-element.js"() {
      init_reactive_element();
      init_reactive_element();
      init_lit_html();
      init_lit_html();
      s3 = globalThis;
      i4 = class extends y {
        constructor() {
          super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
        }
        createRenderRoot() {
          const t5 = super.createRenderRoot();
          return this.renderOptions.renderBefore ??= t5.firstChild, t5;
        }
        update(t5) {
          const r6 = this.render();
          this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t5), this._$Do = D(r6, this.renderRoot, this.renderOptions);
        }
        connectedCallback() {
          super.connectedCallback(), this._$Do?.setConnected(true);
        }
        disconnectedCallback() {
          super.disconnectedCallback(), this._$Do?.setConnected(false);
        }
        render() {
          return E;
        }
      };
      i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({ LitElement: i4 });
      o4 = s3.litElementPolyfillSupport;
      o4?.({ LitElement: i4 });
      (s3.litElementVersions ??= []).push("4.2.2");
    }
  });

  // node_modules/lit-html/is-server.js
  var init_is_server = __esm({
    "node_modules/lit-html/is-server.js"() {
    }
  });

  // node_modules/lit/index.js
  var init_lit = __esm({
    "node_modules/lit/index.js"() {
      init_reactive_element();
      init_lit_html();
      init_lit_element();
      init_is_server();
    }
  });

  // node_modules/@lit/reactive-element/decorators/custom-element.js
  var init_custom_element = __esm({
    "node_modules/@lit/reactive-element/decorators/custom-element.js"() {
    }
  });

  // node_modules/@lit/reactive-element/decorators/property.js
  function n4(t5) {
    return (e7, o6) => "object" == typeof o6 ? r4(t5, e7, o6) : ((t6, e8, o7) => {
      const r6 = e8.hasOwnProperty(o7);
      return e8.constructor.createProperty(o7, t6), r6 ? Object.getOwnPropertyDescriptor(e8, o7) : void 0;
    })(t5, e7, o6);
  }
  var o5, r4;
  var init_property = __esm({
    "node_modules/@lit/reactive-element/decorators/property.js"() {
      init_reactive_element();
      o5 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
      r4 = (t5 = o5, e7, r6) => {
        const { kind: n5, metadata: i7 } = r6;
        let s5 = globalThis.litPropertyMetadata.get(i7);
        if (void 0 === s5 && globalThis.litPropertyMetadata.set(i7, s5 = /* @__PURE__ */ new Map()), "setter" === n5 && ((t5 = Object.create(t5)).wrapped = true), s5.set(r6.name, t5), "accessor" === n5) {
          const { name: o6 } = r6;
          return { set(r7) {
            const n6 = e7.get.call(this);
            e7.set.call(this, r7), this.requestUpdate(o6, n6, t5, true, r7);
          }, init(e8) {
            return void 0 !== e8 && this.C(o6, void 0, t5, e8), e8;
          } };
        }
        if ("setter" === n5) {
          const { name: o6 } = r6;
          return function(r7) {
            const n6 = this[o6];
            e7.call(this, r7), this.requestUpdate(o6, n6, t5, true, r7);
          };
        }
        throw Error("Unsupported decorator location: " + n5);
      };
    }
  });

  // node_modules/@lit/reactive-element/decorators/state.js
  function r5(r6) {
    return n4({ ...r6, state: true, attribute: false });
  }
  var init_state = __esm({
    "node_modules/@lit/reactive-element/decorators/state.js"() {
      init_property();
    }
  });

  // node_modules/@lit/reactive-element/decorators/event-options.js
  var init_event_options = __esm({
    "node_modules/@lit/reactive-element/decorators/event-options.js"() {
    }
  });

  // node_modules/@lit/reactive-element/decorators/base.js
  var e4;
  var init_base = __esm({
    "node_modules/@lit/reactive-element/decorators/base.js"() {
      e4 = (e7, t5, c5) => (c5.configurable = true, c5.enumerable = true, Reflect.decorate && "object" != typeof t5 && Object.defineProperty(e7, t5, c5), c5);
    }
  });

  // node_modules/@lit/reactive-element/decorators/query.js
  function e5(e7, r6) {
    return (n5, s5, i7) => {
      const o6 = (t5) => t5.renderRoot?.querySelector(e7) ?? null;
      if (r6) {
        const { get: e8, set: r7 } = "object" == typeof s5 ? n5 : i7 ?? (() => {
          const t5 = Symbol();
          return { get() {
            return this[t5];
          }, set(e9) {
            this[t5] = e9;
          } };
        })();
        return e4(n5, s5, { get() {
          let t5 = e8.call(this);
          return void 0 === t5 && (t5 = o6(this), (null !== t5 || this.hasUpdated) && r7.call(this, t5)), t5;
        } });
      }
      return e4(n5, s5, { get() {
        return o6(this);
      } });
    };
  }
  var init_query = __esm({
    "node_modules/@lit/reactive-element/decorators/query.js"() {
      init_base();
    }
  });

  // node_modules/@lit/reactive-element/decorators/query-all.js
  var init_query_all = __esm({
    "node_modules/@lit/reactive-element/decorators/query-all.js"() {
      init_base();
    }
  });

  // node_modules/@lit/reactive-element/decorators/query-async.js
  var init_query_async = __esm({
    "node_modules/@lit/reactive-element/decorators/query-async.js"() {
      init_base();
    }
  });

  // node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
  var init_query_assigned_elements = __esm({
    "node_modules/@lit/reactive-element/decorators/query-assigned-elements.js"() {
      init_base();
    }
  });

  // node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js
  var init_query_assigned_nodes = __esm({
    "node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js"() {
      init_base();
    }
  });

  // node_modules/lit/decorators.js
  var init_decorators = __esm({
    "node_modules/lit/decorators.js"() {
      init_custom_element();
      init_property();
      init_state();
      init_event_options();
      init_query();
      init_query_all();
      init_query_async();
      init_query_assigned_elements();
      init_query_assigned_nodes();
    }
  });

  // node_modules/rete-render-utils/rete-render-utils.esm.js
  function classicConnectionPath(points, curvature) {
    var _points = _slicedToArray(points, 2), _points$ = _points[0], x1 = _points$.x, y1 = _points$.y, _points$2 = _points[1], x2 = _points$2.x, y22 = _points$2.y;
    var vertical = Math.abs(y1 - y22);
    var hx1 = x1 + Math.max(vertical / 2, Math.abs(x2 - x1)) * curvature;
    var hx2 = x2 - Math.max(vertical / 2, Math.abs(x2 - x1)) * curvature;
    return "M ".concat(x1, " ").concat(y1, " C ").concat(hx1, " ").concat(y1, " ").concat(hx2, " ").concat(y22, " ").concat(x2, " ").concat(y22);
  }
  function loopConnectionPath(points, curvature, size) {
    var _points2 = _slicedToArray(points, 2), _points2$ = _points2[0], x1 = _points2$.x, y1 = _points2$.y, _points2$2 = _points2[1], x2 = _points2$2.x, y22 = _points2$2.y;
    var k2 = y22 > y1 ? 1 : -1;
    var scale = size + Math.abs(x1 - x2) / (size / 2);
    var middleX = (x1 + x2) / 2;
    var middleY = y1 - k2 * scale;
    var vertical = (y22 - y1) * curvature;
    return "\n        M ".concat(x1, " ").concat(y1, "\n        C ").concat(x1 + scale, " ").concat(y1, "\n        ").concat(x1 + scale, " ").concat(middleY - vertical, "\n        ").concat(middleX, " ").concat(middleY, "\n        C ").concat(x2 - scale, " ").concat(middleY + vertical, "\n        ").concat(x2 - scale, " ").concat(y22, "\n        ").concat(x2, " ").concat(y22, "\n    ");
  }
  function getElementCenter(_x, _x2) {
    return _getElementCenter.apply(this, arguments);
  }
  function _getElementCenter() {
    _getElementCenter = _asyncToGenerator(/* @__PURE__ */ import_regenerator4.default.mark(function _callee(child, parent) {
      var x2, y3, currentElement, width, height;
      return import_regenerator4.default.wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (child.offsetParent) {
              _context.next = 5;
              break;
            }
            _context.next = 3;
            return new Promise(function(res) {
              return setTimeout(res, 0);
            });
          case 3:
            _context.next = 0;
            break;
          case 5:
            x2 = child.offsetLeft;
            y3 = child.offsetTop;
            currentElement = child.offsetParent;
            if (currentElement) {
              _context.next = 10;
              break;
            }
            throw new Error("child has null offsetParent");
          case 10:
            while (currentElement !== null && currentElement !== parent) {
              x2 += currentElement.offsetLeft + currentElement.clientLeft;
              y3 += currentElement.offsetTop + currentElement.clientTop;
              currentElement = currentElement.offsetParent;
            }
            width = child.offsetWidth;
            height = child.offsetHeight;
            return _context.abrupt("return", {
              x: x2 + width / 2,
              y: y3 + height / 2
            });
          case 14:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }));
    return _getElementCenter.apply(this, arguments);
  }
  function _callSuper4(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct4() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct4() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct4 = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function getDOMSocketPosition(props) {
    return new DOMSocketPosition(props);
  }
  var import_regenerator4, EventEmitter, SocketsPositionsStorage, BaseSocketPosition, DOMSocketPosition;
  var init_rete_render_utils_esm = __esm({
    "node_modules/rete-render-utils/rete-render-utils.esm.js"() {
      init_slicedToArray();
      init_asyncToGenerator();
      init_classCallCheck();
      init_createClass();
      init_defineProperty();
      import_regenerator4 = __toESM(require_regenerator2());
      init_rete_area_plugin_esm();
      init_toConsumableArray();
      init_possibleConstructorReturn();
      init_getPrototypeOf();
      init_inherits();
      EventEmitter = /* @__PURE__ */ function() {
        function EventEmitter2() {
          _classCallCheck(this, EventEmitter2);
          _defineProperty(this, "listeners", /* @__PURE__ */ new Set());
        }
        return _createClass(EventEmitter2, [{
          key: "emit",
          value: function emit(data) {
            this.listeners.forEach(function(listener) {
              listener(data);
            });
          }
        }, {
          key: "listen",
          value: function listen(handler) {
            var _this = this;
            this.listeners.add(handler);
            return function() {
              _this.listeners["delete"](handler);
            };
          }
        }]);
      }();
      SocketsPositionsStorage = /* @__PURE__ */ function() {
        function SocketsPositionsStorage2() {
          _classCallCheck(this, SocketsPositionsStorage2);
          _defineProperty(this, "elements", /* @__PURE__ */ new Map());
        }
        return _createClass(SocketsPositionsStorage2, [{
          key: "getPosition",
          value: function getPosition(data) {
            var _found$pop$position, _found$pop;
            var list = Array.from(this.elements.values()).flat();
            var found = list.filter(function(item) {
              return item.side === data.side && item.nodeId === data.nodeId && item.key === data.key;
            });
            if (found.length > 1) console.warn(["Found more than one element for socket with same key and side.", "Probably it was not unmounted correctly"].join(" "), data);
            return (_found$pop$position = (_found$pop = found.pop()) === null || _found$pop === void 0 ? void 0 : _found$pop.position) !== null && _found$pop$position !== void 0 ? _found$pop$position : null;
          }
        }, {
          key: "add",
          value: function add(data) {
            var existing = this.elements.get(data.element);
            this.elements.set(data.element, existing ? [].concat(_toConsumableArray(existing.filter(function(n5) {
              return !(n5.nodeId === data.nodeId && n5.key === data.key && n5.side === data.side);
            })), [data]) : [data]);
          }
        }, {
          key: "remove",
          value: function remove(element) {
            this.elements["delete"](element);
          }
        }, {
          key: "snapshot",
          value: function snapshot() {
            return Array.from(this.elements.values()).flat();
          }
        }]);
      }();
      BaseSocketPosition = /* @__PURE__ */ function() {
        function BaseSocketPosition2() {
          _classCallCheck(this, BaseSocketPosition2);
          _defineProperty(this, "sockets", new SocketsPositionsStorage());
          _defineProperty(this, "emitter", new EventEmitter());
          _defineProperty(this, "area", null);
        }
        return _createClass(BaseSocketPosition2, [{
          key: "attach",
          value: (
            /**
             * Attach the watcher to the area's child scope.
             * @param scope Scope of the watcher that should be a child of `BaseAreaPlugin`
             */
            function attach(scope) {
              var _this = this;
              if (this.area) return;
              if (!scope.hasParent()) return;
              this.area = scope.parentScope(BaseAreaPlugin);
              this.area.addPipe(/* @__PURE__ */ function() {
                var _ref2 = _asyncToGenerator(/* @__PURE__ */ import_regenerator4.default.mark(function _callee2(context) {
                  var _context$data, _nodeId, _key, _side, _element, position, _nodeId2, _context$data$payload, source, target, _nodeId3;
                  return import_regenerator4.default.wrap(function _callee2$(_context2) {
                    while (1) switch (_context2.prev = _context2.next) {
                      case 0:
                        if (!(context.type === "rendered" && context.data.type === "socket")) {
                          _context2.next = 8;
                          break;
                        }
                        _context$data = context.data, _nodeId = _context$data.nodeId, _key = _context$data.key, _side = _context$data.side, _element = _context$data.element;
                        _context2.next = 4;
                        return _this.calculatePosition(_nodeId, _side, _key, _element);
                      case 4:
                        position = _context2.sent;
                        if (position) {
                          _this.sockets.add({
                            nodeId: _nodeId,
                            key: _key,
                            side: _side,
                            element: _element,
                            position
                          });
                          _this.emitter.emit({
                            nodeId: _nodeId,
                            key: _key,
                            side: _side
                          });
                        }
                        _context2.next = 24;
                        break;
                      case 8:
                        if (!(context.type === "unmount")) {
                          _context2.next = 12;
                          break;
                        }
                        _this.sockets.remove(context.data.element);
                        _context2.next = 24;
                        break;
                      case 12:
                        if (!(context.type === "nodetranslated")) {
                          _context2.next = 16;
                          break;
                        }
                        _this.emitter.emit({
                          nodeId: context.data.id
                        });
                        _context2.next = 24;
                        break;
                      case 16:
                        if (!(context.type === "noderesized")) {
                          _context2.next = 23;
                          break;
                        }
                        _nodeId2 = context.data.id;
                        _context2.next = 20;
                        return Promise.all(_this.sockets.snapshot().filter(function(item) {
                          return item.nodeId === context.data.id && item.side === "output";
                        }).map(/* @__PURE__ */ function() {
                          var _ref22 = _asyncToGenerator(/* @__PURE__ */ import_regenerator4.default.mark(function _callee(item) {
                            var side, key, element, position2;
                            return import_regenerator4.default.wrap(function _callee$(_context) {
                              while (1) switch (_context.prev = _context.next) {
                                case 0:
                                  side = item.side, key = item.key, element = item.element;
                                  _context.next = 3;
                                  return _this.calculatePosition(_nodeId2, side, key, element);
                                case 3:
                                  position2 = _context.sent;
                                  if (position2) {
                                    item.position = position2;
                                  }
                                case 5:
                                case "end":
                                  return _context.stop();
                              }
                            }, _callee);
                          }));
                          return function(_x2) {
                            return _ref22.apply(this, arguments);
                          };
                        }()));
                      case 20:
                        _this.emitter.emit({
                          nodeId: _nodeId2
                        });
                        _context2.next = 24;
                        break;
                      case 23:
                        if (context.type === "render" && context.data.type === "connection") {
                          _context$data$payload = context.data.payload, source = _context$data$payload.source, target = _context$data$payload.target;
                          _nodeId3 = source || target;
                          _this.emitter.emit({
                            nodeId: _nodeId3
                          });
                        }
                      case 24:
                        return _context2.abrupt("return", context);
                      case 25:
                      case "end":
                        return _context2.stop();
                    }
                  }, _callee2);
                }));
                return function(_x) {
                  return _ref2.apply(this, arguments);
                };
              }());
            }
          )
          /**
           * Listen to socket position changes. Usually used by rendering plugins to update the start/end of the connection.
           * @internal
           * @param nodeId Node ID
           * @param side Side of the socket, 'input' or 'output'
           * @param key Socket key
           * @param change Callback function that is called when the socket position changes
           */
        }, {
          key: "listen",
          value: function listen(nodeId, side, key, change) {
            var _this2 = this;
            var unlisten = this.emitter.listen(function(data) {
              if (data.nodeId !== nodeId) return;
              if ((!data.key || data.side === side) && (!data.side || data.key === key)) {
                var _this2$area;
                var position = _this2.sockets.getPosition({
                  side,
                  nodeId,
                  key
                });
                if (!position) return;
                var x2 = position.x, y3 = position.y;
                var nodeView = (_this2$area = _this2.area) === null || _this2$area === void 0 ? void 0 : _this2$area.nodeViews.get(nodeId);
                if (nodeView) change({
                  x: x2 + nodeView.position.x,
                  y: y3 + nodeView.position.y
                });
              }
            });
            this.sockets.snapshot().forEach(function(data) {
              if (data.nodeId === nodeId) _this2.emitter.emit(data);
            });
            return unlisten;
          }
        }]);
      }();
      DOMSocketPosition = /* @__PURE__ */ function(_BaseSocketPosition) {
        function DOMSocketPosition2(props) {
          var _this;
          _classCallCheck(this, DOMSocketPosition2);
          _this = _callSuper4(this, DOMSocketPosition2);
          _this.props = props;
          return _this;
        }
        _inherits(DOMSocketPosition2, _BaseSocketPosition);
        return _createClass(DOMSocketPosition2, [{
          key: "calculatePosition",
          value: function() {
            var _calculatePosition = _asyncToGenerator(/* @__PURE__ */ import_regenerator4.default.mark(function _callee(nodeId, side, key, element) {
              var _this$area, _this$props;
              var view, position;
              return import_regenerator4.default.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    view = (_this$area = this.area) === null || _this$area === void 0 ? void 0 : _this$area.nodeViews.get(nodeId);
                    if (view !== null && view !== void 0 && view.element) {
                      _context.next = 3;
                      break;
                    }
                    return _context.abrupt("return", null);
                  case 3:
                    _context.next = 5;
                    return getElementCenter(element, view.element);
                  case 5:
                    position = _context.sent;
                    if (!((_this$props = this.props) !== null && _this$props !== void 0 && _this$props.offset)) {
                      _context.next = 8;
                      break;
                    }
                    return _context.abrupt("return", this.props.offset(position, nodeId, side, key));
                  case 8:
                    return _context.abrupt("return", {
                      x: position.x + 12 * (side === "input" ? -1 : 1),
                      y: position.y
                    });
                  case 9:
                  case "end":
                    return _context.stop();
                }
              }, _callee, this);
            }));
            function calculatePosition(_x, _x2, _x3, _x4) {
              return _calculatePosition.apply(this, arguments);
            }
            return calculatePosition;
          }()
        }]);
      }(BaseSocketPosition);
    }
  });

  // node_modules/@retejs/lit-plugin/lit-plugin.esm.js
  function getRenderer() {
    var instances = /* @__PURE__ */ new Map();
    return {
      get: function get(element) {
        return instances.get(element);
      },
      mount: function mount(element, slot, onRendered) {
        D(b2(_templateObject$h || (_templateObject$h = _taggedTemplateLiteral(["\n        <rete-root\n          fragment\n          .rendered=", "\n        >\n          ", "\n        </rete-root>\n      "])), onRendered, slot), element);
        var app = element.children[0].children[0];
        if (!app) throw new Error("no instance found");
        instances.set(element, app);
      },
      update: function update(app, payload) {
        Object.keys(payload).forEach(function(key) {
          app[key] = payload[key];
        });
        app.requestUpdate();
      },
      unmount: function unmount(element) {
        var app = instances.get(element);
        if (app) {
          D(A, element);
          instances["delete"](element);
        }
      }
    };
  }
  function _callSuper$h(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$h() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$h() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$h = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _superPropGet$6(t5, e7, o6, r6) {
    var p4 = _get(_getPrototypeOf(1 & r6 ? t5.prototype : t5), e7, o6);
    return 2 & r6 && "function" == typeof p4 ? function(t6) {
      return p4.apply(o6, t6);
    } : p4;
  }
  function _classPrivateFieldInitSpec$e(e7, t5, a3) {
    _checkPrivateRedeclaration$e(e7, t5), t5.set(e7, a3);
  }
  function _checkPrivateRedeclaration$e(e7, t5) {
    if (t5.has(e7)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classPrivateFieldSet$e(s5, a3, r6) {
    return s5.set(_assertClassBrand$e(s5, a3), r6), r6;
  }
  function _classPrivateFieldGet$e(s5, a3) {
    return s5.get(_assertClassBrand$e(s5, a3));
  }
  function _assertClassBrand$e(e7, t5, n5) {
    if ("function" == typeof e7 ? e7 === t5 : e7.has(t5)) return arguments.length < 3 ? t5 : n5;
    throw new TypeError("Private element is not present on this object");
  }
  function _applyDecs$f(e7, t5, r6, n5, o6, a3) {
    function i7(e8, t6, r7) {
      return function(n6, o7) {
        return r7 && r7(n6), e8[t6].call(n6, o7);
      };
    }
    function c5(e8, t6) {
      for (var r7 = 0; r7 < e8.length; r7++) e8[r7].call(t6);
      return t6;
    }
    function s5(e8, t6, r7, n6) {
      if ("function" != typeof e8 && (n6 || void 0 !== e8)) throw new TypeError(t6 + " must " + (r7 || "be") + " a function" + (n6 ? "" : " or undefined"));
      return e8;
    }
    function applyDec(e8, t6, r7, n6, o7, a4, c6, u6, l4, f4, p5, d3, h4) {
      function m3(e9) {
        if (!h4(e9)) throw new TypeError("Attempted to access private element on non-instance");
      }
      var y3, v3 = t6[0], g2 = t6[3], b3 = !u6;
      if (!b3) {
        r7 || Array.isArray(v3) || (v3 = [v3]);
        var w2 = {}, S3 = [], A2 = 3 === o7 ? "get" : 4 === o7 || d3 ? "set" : "value";
        f4 ? (p5 || d3 ? w2 = { get: _setFunctionName$e(function() {
          return g2(this);
        }, n6, "get"), set: function set(e9) {
          t6[4](this, e9);
        } } : w2[A2] = g2, p5 || _setFunctionName$e(w2[A2], n6, 2 === o7 ? "" : A2)) : p5 || (w2 = Object.getOwnPropertyDescriptor(e8, n6));
      }
      for (var P2 = e8, j2 = v3.length - 1; j2 >= 0; j2 -= r7 ? 2 : 1) {
        var D2 = v3[j2], E2 = r7 ? v3[j2 - 1] : void 0, I2 = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o7], name: n6, metadata: a4, addInitializer: function(e9, t7) {
          if (e9.v) throw Error("attempted to call addInitializer after decoration was finished");
          s5(t7, "An initializer", "be", true), c6.push(t7);
        }.bind(null, I2) };
        try {
          if (b3) (y3 = s5(D2.call(E2, P2, O), "class decorators", "return")) && (P2 = y3);
          else {
            var k2, F;
            O["static"] = l4, O["private"] = f4, f4 ? 2 === o7 ? k2 = function k3(e9) {
              return m3(e9), w2.value;
            } : (o7 < 4 && (k2 = i7(w2, "get", m3)), 3 !== o7 && (F = i7(w2, "set", m3))) : (k2 = function k3(e9) {
              return e9[n6];
            }, (o7 < 2 || 4 === o7) && (F = function F2(e9, t7) {
              e9[n6] = t7;
            }));
            var N2 = O.access = { has: f4 ? h4.bind() : function(e9) {
              return n6 in e9;
            } };
            if (k2 && (N2.get = k2), F && (N2.set = F), P2 = D2.call(E2, d3 ? { get: w2.get, set: w2.set } : w2[A2], O), d3) {
              if ("object" == _typeof(P2) && P2) (y3 = s5(P2.get, "accessor.get")) && (w2.get = y3), (y3 = s5(P2.set, "accessor.set")) && (w2.set = y3), (y3 = s5(P2.init, "accessor.init")) && S3.push(y3);
              else if (void 0 !== P2) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            } else s5(P2, (p5 ? "field" : "method") + " decorators", "return") && (p5 ? S3.push(P2) : w2[A2] = P2);
          }
        } finally {
          I2.v = true;
        }
      }
      return (p5 || d3) && u6.push(function(e9, t7) {
        for (var r8 = S3.length - 1; r8 >= 0; r8--) t7 = S3[r8].call(e9, t7);
        return t7;
      }), p5 || b3 || (f4 ? d3 ? u6.push(i7(w2, "get"), i7(w2, "set")) : u6.push(2 === o7 ? w2[A2] : i7.call.bind(w2[A2])) : Object.defineProperty(e8, n6, w2)), P2;
    }
    function u5(e8, t6) {
      return Object.defineProperty(e8, Symbol.metadata || Symbol["for"]("Symbol.metadata"), { configurable: true, enumerable: true, value: t6 });
    }
    if (arguments.length >= 6) var l3 = a3[Symbol.metadata || Symbol["for"]("Symbol.metadata")];
    var f3 = Object.create(null == l3 ? null : l3), p4 = function(e8, t6, r7, n6) {
      var o7, a4, i8 = [], s6 = function s7(t7) {
        return _checkInRHS$e(t7) === e8;
      }, u6 = /* @__PURE__ */ new Map();
      function l4(e9) {
        e9 && i8.push(c5.bind(null, e9));
      }
      for (var f4 = 0; f4 < t6.length; f4++) {
        var p5 = t6[f4];
        if (Array.isArray(p5)) {
          var d3 = p5[1], h4 = p5[2], m3 = p5.length > 3, y3 = 16 & d3, v3 = !!(8 & d3), g2 = 0 == (d3 &= 7), b3 = h4 + "/" + v3;
          if (!g2 && !m3) {
            var w2 = u6.get(b3);
            if (true === w2 || 3 === w2 && 4 !== d3 || 4 === w2 && 3 !== d3) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h4);
            u6.set(b3, !(d3 > 2) || d3);
          }
          applyDec(v3 ? e8 : e8.prototype, p5, y3, m3 ? "#" + h4 : _toPropertyKey$e(h4), d3, n6, v3 ? a4 = a4 || [] : o7 = o7 || [], i8, v3, m3, g2, 1 === d3, v3 && m3 ? s6 : r7);
        }
      }
      return l4(o7), l4(a4), i8;
    }(e7, t5, o6, f3);
    return r6.length || u5(e7, f3), { e: p4, get c() {
      var t6 = [];
      return r6.length && [u5(applyDec(e7, [r6], n5, e7.name, 5, f3, t6), f3), c5.bind(null, t6, e7)];
    } };
  }
  function _toPropertyKey$e(t5) {
    var i7 = _toPrimitive$e(t5, "string");
    return "symbol" == _typeof(i7) ? i7 : i7 + "";
  }
  function _toPrimitive$e(t5, r6) {
    if ("object" != _typeof(t5) || !t5) return t5;
    var e7 = t5[Symbol.toPrimitive];
    if (void 0 !== e7) {
      var i7 = e7.call(t5, r6 || "default");
      if ("object" != _typeof(i7)) return i7;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r6 ? String : Number)(t5);
  }
  function _setFunctionName$e(e7, t5, n5) {
    "symbol" == _typeof(t5) && (t5 = (t5 = t5.description) ? "[" + t5 + "]" : "");
    try {
      Object.defineProperty(e7, "name", { configurable: true, value: n5 ? n5 + " " + t5 : t5 });
    } catch (e8) {
    }
    return e7;
  }
  function _checkInRHS$e(e7) {
    if (Object(e7) !== e7) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e7 ? _typeof(e7) : "null"));
    return e7;
  }
  function _callSuper$g(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$g() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$g() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$g = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _superPropGet$5(t5, e7, o6, r6) {
    var p4 = _get(_getPrototypeOf(1 & r6 ? t5.prototype : t5), e7, o6);
    return 2 & r6 && "function" == typeof p4 ? function(t6) {
      return p4.apply(o6, t6);
    } : p4;
  }
  function ownKeys$32(e7, r6) {
    var t5 = Object.keys(e7);
    if (Object.getOwnPropertySymbols) {
      var o6 = Object.getOwnPropertySymbols(e7);
      r6 && (o6 = o6.filter(function(r7) {
        return Object.getOwnPropertyDescriptor(e7, r7).enumerable;
      })), t5.push.apply(t5, o6);
    }
    return t5;
  }
  function _objectSpread$32(e7) {
    for (var r6 = 1; r6 < arguments.length; r6++) {
      var t5 = null != arguments[r6] ? arguments[r6] : {};
      r6 % 2 ? ownKeys$32(Object(t5), true).forEach(function(r7) {
        _defineProperty(e7, r7, t5[r7]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e7, Object.getOwnPropertyDescriptors(t5)) : ownKeys$32(Object(t5)).forEach(function(r7) {
        Object.defineProperty(e7, r7, Object.getOwnPropertyDescriptor(t5, r7));
      });
    }
    return e7;
  }
  function _callSuper$f(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$f() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$f() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$f = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _classPrivateFieldInitSpec$d(e7, t5, a3) {
    _checkPrivateRedeclaration$d(e7, t5), t5.set(e7, a3);
  }
  function _checkPrivateRedeclaration$d(e7, t5) {
    if (t5.has(e7)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classPrivateFieldSet$d(s5, a3, r6) {
    return s5.set(_assertClassBrand$d(s5, a3), r6), r6;
  }
  function _classPrivateFieldGet$d(s5, a3) {
    return s5.get(_assertClassBrand$d(s5, a3));
  }
  function _assertClassBrand$d(e7, t5, n5) {
    if ("function" == typeof e7 ? e7 === t5 : e7.has(t5)) return arguments.length < 3 ? t5 : n5;
    throw new TypeError("Private element is not present on this object");
  }
  function _applyDecs$d(e7, t5, r6, n5, o6, a3) {
    function i7(e8, t6, r7) {
      return function(n6, o7) {
        return r7 && r7(n6), e8[t6].call(n6, o7);
      };
    }
    function c5(e8, t6) {
      for (var r7 = 0; r7 < e8.length; r7++) e8[r7].call(t6);
      return t6;
    }
    function s5(e8, t6, r7, n6) {
      if ("function" != typeof e8 && (n6 || void 0 !== e8)) throw new TypeError(t6 + " must " + (r7 || "be") + " a function" + (n6 ? "" : " or undefined"));
      return e8;
    }
    function applyDec(e8, t6, r7, n6, o7, a4, c6, u6, l4, f4, p5, d3, h4) {
      function m3(e9) {
        if (!h4(e9)) throw new TypeError("Attempted to access private element on non-instance");
      }
      var y3, v3 = t6[0], g2 = t6[3], b3 = !u6;
      if (!b3) {
        r7 || Array.isArray(v3) || (v3 = [v3]);
        var w2 = {}, S3 = [], A2 = 3 === o7 ? "get" : 4 === o7 || d3 ? "set" : "value";
        f4 ? (p5 || d3 ? w2 = { get: _setFunctionName$d(function() {
          return g2(this);
        }, n6, "get"), set: function set(e9) {
          t6[4](this, e9);
        } } : w2[A2] = g2, p5 || _setFunctionName$d(w2[A2], n6, 2 === o7 ? "" : A2)) : p5 || (w2 = Object.getOwnPropertyDescriptor(e8, n6));
      }
      for (var P2 = e8, j2 = v3.length - 1; j2 >= 0; j2 -= r7 ? 2 : 1) {
        var D2 = v3[j2], E2 = r7 ? v3[j2 - 1] : void 0, I2 = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o7], name: n6, metadata: a4, addInitializer: function(e9, t7) {
          if (e9.v) throw Error("attempted to call addInitializer after decoration was finished");
          s5(t7, "An initializer", "be", true), c6.push(t7);
        }.bind(null, I2) };
        try {
          if (b3) (y3 = s5(D2.call(E2, P2, O), "class decorators", "return")) && (P2 = y3);
          else {
            var k2, F;
            O["static"] = l4, O["private"] = f4, f4 ? 2 === o7 ? k2 = function k3(e9) {
              return m3(e9), w2.value;
            } : (o7 < 4 && (k2 = i7(w2, "get", m3)), 3 !== o7 && (F = i7(w2, "set", m3))) : (k2 = function k3(e9) {
              return e9[n6];
            }, (o7 < 2 || 4 === o7) && (F = function F2(e9, t7) {
              e9[n6] = t7;
            }));
            var N2 = O.access = { has: f4 ? h4.bind() : function(e9) {
              return n6 in e9;
            } };
            if (k2 && (N2.get = k2), F && (N2.set = F), P2 = D2.call(E2, d3 ? { get: w2.get, set: w2.set } : w2[A2], O), d3) {
              if ("object" == _typeof(P2) && P2) (y3 = s5(P2.get, "accessor.get")) && (w2.get = y3), (y3 = s5(P2.set, "accessor.set")) && (w2.set = y3), (y3 = s5(P2.init, "accessor.init")) && S3.push(y3);
              else if (void 0 !== P2) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            } else s5(P2, (p5 ? "field" : "method") + " decorators", "return") && (p5 ? S3.push(P2) : w2[A2] = P2);
          }
        } finally {
          I2.v = true;
        }
      }
      return (p5 || d3) && u6.push(function(e9, t7) {
        for (var r8 = S3.length - 1; r8 >= 0; r8--) t7 = S3[r8].call(e9, t7);
        return t7;
      }), p5 || b3 || (f4 ? d3 ? u6.push(i7(w2, "get"), i7(w2, "set")) : u6.push(2 === o7 ? w2[A2] : i7.call.bind(w2[A2])) : Object.defineProperty(e8, n6, w2)), P2;
    }
    function u5(e8, t6) {
      return Object.defineProperty(e8, Symbol.metadata || Symbol["for"]("Symbol.metadata"), { configurable: true, enumerable: true, value: t6 });
    }
    if (arguments.length >= 6) var l3 = a3[Symbol.metadata || Symbol["for"]("Symbol.metadata")];
    var f3 = Object.create(null == l3 ? null : l3), p4 = function(e8, t6, r7, n6) {
      var o7, a4, i8 = [], s6 = function s7(t7) {
        return _checkInRHS$d(t7) === e8;
      }, u6 = /* @__PURE__ */ new Map();
      function l4(e9) {
        e9 && i8.push(c5.bind(null, e9));
      }
      for (var f4 = 0; f4 < t6.length; f4++) {
        var p5 = t6[f4];
        if (Array.isArray(p5)) {
          var d3 = p5[1], h4 = p5[2], m3 = p5.length > 3, y3 = 16 & d3, v3 = !!(8 & d3), g2 = 0 == (d3 &= 7), b3 = h4 + "/" + v3;
          if (!g2 && !m3) {
            var w2 = u6.get(b3);
            if (true === w2 || 3 === w2 && 4 !== d3 || 4 === w2 && 3 !== d3) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h4);
            u6.set(b3, !(d3 > 2) || d3);
          }
          applyDec(v3 ? e8 : e8.prototype, p5, y3, m3 ? "#" + h4 : _toPropertyKey$d(h4), d3, n6, v3 ? a4 = a4 || [] : o7 = o7 || [], i8, v3, m3, g2, 1 === d3, v3 && m3 ? s6 : r7);
        }
      }
      return l4(o7), l4(a4), i8;
    }(e7, t5, o6, f3);
    return r6.length || u5(e7, f3), { e: p4, get c() {
      var t6 = [];
      return r6.length && [u5(applyDec(e7, [r6], n5, e7.name, 5, f3, t6), f3), c5.bind(null, t6, e7)];
    } };
  }
  function _toPropertyKey$d(t5) {
    var i7 = _toPrimitive$d(t5, "string");
    return "symbol" == _typeof(i7) ? i7 : i7 + "";
  }
  function _toPrimitive$d(t5, r6) {
    if ("object" != _typeof(t5) || !t5) return t5;
    var e7 = t5[Symbol.toPrimitive];
    if (void 0 !== e7) {
      var i7 = e7.call(t5, r6 || "default");
      if ("object" != _typeof(i7)) return i7;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r6 ? String : Number)(t5);
  }
  function _setFunctionName$d(e7, t5, n5) {
    "symbol" == _typeof(t5) && (t5 = (t5 = t5.description) ? "[" + t5 + "]" : "");
    try {
      Object.defineProperty(e7, "name", { configurable: true, value: n5 ? n5 + " " + t5 : t5 });
    } catch (e8) {
    }
    return e7;
  }
  function _checkInRHS$d(e7) {
    if (Object(e7) !== e7) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e7 ? _typeof(e7) : "null"));
    return e7;
  }
  function _callSuper$e(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$e() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$e() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$e = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _classPrivateFieldInitSpec$c(e7, t5, a3) {
    _checkPrivateRedeclaration$c(e7, t5), t5.set(e7, a3);
  }
  function _checkPrivateRedeclaration$c(e7, t5) {
    if (t5.has(e7)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classPrivateFieldSet$c(s5, a3, r6) {
    return s5.set(_assertClassBrand$c(s5, a3), r6), r6;
  }
  function _classPrivateFieldGet$c(s5, a3) {
    return s5.get(_assertClassBrand$c(s5, a3));
  }
  function _assertClassBrand$c(e7, t5, n5) {
    if ("function" == typeof e7 ? e7 === t5 : e7.has(t5)) return arguments.length < 3 ? t5 : n5;
    throw new TypeError("Private element is not present on this object");
  }
  function _applyDecs$c(e7, t5, r6, n5, o6, a3) {
    function i7(e8, t6, r7) {
      return function(n6, o7) {
        return r7 && r7(n6), e8[t6].call(n6, o7);
      };
    }
    function c5(e8, t6) {
      for (var r7 = 0; r7 < e8.length; r7++) e8[r7].call(t6);
      return t6;
    }
    function s5(e8, t6, r7, n6) {
      if ("function" != typeof e8 && (n6 || void 0 !== e8)) throw new TypeError(t6 + " must " + (r7 || "be") + " a function" + (n6 ? "" : " or undefined"));
      return e8;
    }
    function applyDec(e8, t6, r7, n6, o7, a4, c6, u6, l4, f4, p5, d3, h4) {
      function m3(e9) {
        if (!h4(e9)) throw new TypeError("Attempted to access private element on non-instance");
      }
      var y3, v3 = t6[0], g2 = t6[3], b3 = !u6;
      if (!b3) {
        r7 || Array.isArray(v3) || (v3 = [v3]);
        var w2 = {}, S3 = [], A2 = 3 === o7 ? "get" : 4 === o7 || d3 ? "set" : "value";
        f4 ? (p5 || d3 ? w2 = { get: _setFunctionName$c(function() {
          return g2(this);
        }, n6, "get"), set: function set(e9) {
          t6[4](this, e9);
        } } : w2[A2] = g2, p5 || _setFunctionName$c(w2[A2], n6, 2 === o7 ? "" : A2)) : p5 || (w2 = Object.getOwnPropertyDescriptor(e8, n6));
      }
      for (var P2 = e8, j2 = v3.length - 1; j2 >= 0; j2 -= r7 ? 2 : 1) {
        var D2 = v3[j2], E2 = r7 ? v3[j2 - 1] : void 0, I2 = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o7], name: n6, metadata: a4, addInitializer: function(e9, t7) {
          if (e9.v) throw Error("attempted to call addInitializer after decoration was finished");
          s5(t7, "An initializer", "be", true), c6.push(t7);
        }.bind(null, I2) };
        try {
          if (b3) (y3 = s5(D2.call(E2, P2, O), "class decorators", "return")) && (P2 = y3);
          else {
            var k2, F;
            O["static"] = l4, O["private"] = f4, f4 ? 2 === o7 ? k2 = function k3(e9) {
              return m3(e9), w2.value;
            } : (o7 < 4 && (k2 = i7(w2, "get", m3)), 3 !== o7 && (F = i7(w2, "set", m3))) : (k2 = function k3(e9) {
              return e9[n6];
            }, (o7 < 2 || 4 === o7) && (F = function F2(e9, t7) {
              e9[n6] = t7;
            }));
            var N2 = O.access = { has: f4 ? h4.bind() : function(e9) {
              return n6 in e9;
            } };
            if (k2 && (N2.get = k2), F && (N2.set = F), P2 = D2.call(E2, d3 ? { get: w2.get, set: w2.set } : w2[A2], O), d3) {
              if ("object" == _typeof(P2) && P2) (y3 = s5(P2.get, "accessor.get")) && (w2.get = y3), (y3 = s5(P2.set, "accessor.set")) && (w2.set = y3), (y3 = s5(P2.init, "accessor.init")) && S3.push(y3);
              else if (void 0 !== P2) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            } else s5(P2, (p5 ? "field" : "method") + " decorators", "return") && (p5 ? S3.push(P2) : w2[A2] = P2);
          }
        } finally {
          I2.v = true;
        }
      }
      return (p5 || d3) && u6.push(function(e9, t7) {
        for (var r8 = S3.length - 1; r8 >= 0; r8--) t7 = S3[r8].call(e9, t7);
        return t7;
      }), p5 || b3 || (f4 ? d3 ? u6.push(i7(w2, "get"), i7(w2, "set")) : u6.push(2 === o7 ? w2[A2] : i7.call.bind(w2[A2])) : Object.defineProperty(e8, n6, w2)), P2;
    }
    function u5(e8, t6) {
      return Object.defineProperty(e8, Symbol.metadata || Symbol["for"]("Symbol.metadata"), { configurable: true, enumerable: true, value: t6 });
    }
    if (arguments.length >= 6) var l3 = a3[Symbol.metadata || Symbol["for"]("Symbol.metadata")];
    var f3 = Object.create(null == l3 ? null : l3), p4 = function(e8, t6, r7, n6) {
      var o7, a4, i8 = [], s6 = function s7(t7) {
        return _checkInRHS$c(t7) === e8;
      }, u6 = /* @__PURE__ */ new Map();
      function l4(e9) {
        e9 && i8.push(c5.bind(null, e9));
      }
      for (var f4 = 0; f4 < t6.length; f4++) {
        var p5 = t6[f4];
        if (Array.isArray(p5)) {
          var d3 = p5[1], h4 = p5[2], m3 = p5.length > 3, y3 = 16 & d3, v3 = !!(8 & d3), g2 = 0 == (d3 &= 7), b3 = h4 + "/" + v3;
          if (!g2 && !m3) {
            var w2 = u6.get(b3);
            if (true === w2 || 3 === w2 && 4 !== d3 || 4 === w2 && 3 !== d3) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h4);
            u6.set(b3, !(d3 > 2) || d3);
          }
          applyDec(v3 ? e8 : e8.prototype, p5, y3, m3 ? "#" + h4 : _toPropertyKey$c(h4), d3, n6, v3 ? a4 = a4 || [] : o7 = o7 || [], i8, v3, m3, g2, 1 === d3, v3 && m3 ? s6 : r7);
        }
      }
      return l4(o7), l4(a4), i8;
    }(e7, t5, o6, f3);
    return r6.length || u5(e7, f3), { e: p4, get c() {
      var t6 = [];
      return r6.length && [u5(applyDec(e7, [r6], n5, e7.name, 5, f3, t6), f3), c5.bind(null, t6, e7)];
    } };
  }
  function _toPropertyKey$c(t5) {
    var i7 = _toPrimitive$c(t5, "string");
    return "symbol" == _typeof(i7) ? i7 : i7 + "";
  }
  function _toPrimitive$c(t5, r6) {
    if ("object" != _typeof(t5) || !t5) return t5;
    var e7 = t5[Symbol.toPrimitive];
    if (void 0 !== e7) {
      var i7 = e7.call(t5, r6 || "default");
      if ("object" != _typeof(i7)) return i7;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r6 ? String : Number)(t5);
  }
  function _setFunctionName$c(e7, t5, n5) {
    "symbol" == _typeof(t5) && (t5 = (t5 = t5.description) ? "[" + t5 + "]" : "");
    try {
      Object.defineProperty(e7, "name", { configurable: true, value: n5 ? n5 + " " + t5 : t5 });
    } catch (e8) {
    }
    return e7;
  }
  function _checkInRHS$c(e7) {
    if (Object(e7) !== e7) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e7 ? _typeof(e7) : "null"));
    return e7;
  }
  function _callSuper$d(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$d() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$d() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$d = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _superPropGet$4(t5, e7, o6, r6) {
    var p4 = _get(_getPrototypeOf(1 & r6 ? t5.prototype : t5), e7, o6);
    return 2 & r6 && "function" == typeof p4 ? function(t6) {
      return p4.apply(o6, t6);
    } : p4;
  }
  function _classPrivateFieldInitSpec$b(e7, t5, a3) {
    _checkPrivateRedeclaration$b(e7, t5), t5.set(e7, a3);
  }
  function _checkPrivateRedeclaration$b(e7, t5) {
    if (t5.has(e7)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classPrivateFieldSet$b(s5, a3, r6) {
    return s5.set(_assertClassBrand$b(s5, a3), r6), r6;
  }
  function _classPrivateFieldGet$b(s5, a3) {
    return s5.get(_assertClassBrand$b(s5, a3));
  }
  function _assertClassBrand$b(e7, t5, n5) {
    if ("function" == typeof e7 ? e7 === t5 : e7.has(t5)) return arguments.length < 3 ? t5 : n5;
    throw new TypeError("Private element is not present on this object");
  }
  function _applyDecs$b(e7, t5, r6, n5, o6, a3) {
    function i7(e8, t6, r7) {
      return function(n6, o7) {
        return r7 && r7(n6), e8[t6].call(n6, o7);
      };
    }
    function c5(e8, t6) {
      for (var r7 = 0; r7 < e8.length; r7++) e8[r7].call(t6);
      return t6;
    }
    function s5(e8, t6, r7, n6) {
      if ("function" != typeof e8 && (n6 || void 0 !== e8)) throw new TypeError(t6 + " must " + (r7 || "be") + " a function" + (n6 ? "" : " or undefined"));
      return e8;
    }
    function applyDec(e8, t6, r7, n6, o7, a4, c6, u6, l4, f4, p5, d3, h4) {
      function m3(e9) {
        if (!h4(e9)) throw new TypeError("Attempted to access private element on non-instance");
      }
      var y3, v3 = t6[0], g2 = t6[3], b3 = !u6;
      if (!b3) {
        r7 || Array.isArray(v3) || (v3 = [v3]);
        var w2 = {}, S3 = [], A2 = 3 === o7 ? "get" : 4 === o7 || d3 ? "set" : "value";
        f4 ? (p5 || d3 ? w2 = { get: _setFunctionName$b(function() {
          return g2(this);
        }, n6, "get"), set: function set(e9) {
          t6[4](this, e9);
        } } : w2[A2] = g2, p5 || _setFunctionName$b(w2[A2], n6, 2 === o7 ? "" : A2)) : p5 || (w2 = Object.getOwnPropertyDescriptor(e8, n6));
      }
      for (var P2 = e8, j2 = v3.length - 1; j2 >= 0; j2 -= r7 ? 2 : 1) {
        var D2 = v3[j2], E2 = r7 ? v3[j2 - 1] : void 0, I2 = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o7], name: n6, metadata: a4, addInitializer: function(e9, t7) {
          if (e9.v) throw Error("attempted to call addInitializer after decoration was finished");
          s5(t7, "An initializer", "be", true), c6.push(t7);
        }.bind(null, I2) };
        try {
          if (b3) (y3 = s5(D2.call(E2, P2, O), "class decorators", "return")) && (P2 = y3);
          else {
            var k2, F;
            O["static"] = l4, O["private"] = f4, f4 ? 2 === o7 ? k2 = function k3(e9) {
              return m3(e9), w2.value;
            } : (o7 < 4 && (k2 = i7(w2, "get", m3)), 3 !== o7 && (F = i7(w2, "set", m3))) : (k2 = function k3(e9) {
              return e9[n6];
            }, (o7 < 2 || 4 === o7) && (F = function F2(e9, t7) {
              e9[n6] = t7;
            }));
            var N2 = O.access = { has: f4 ? h4.bind() : function(e9) {
              return n6 in e9;
            } };
            if (k2 && (N2.get = k2), F && (N2.set = F), P2 = D2.call(E2, d3 ? { get: w2.get, set: w2.set } : w2[A2], O), d3) {
              if ("object" == _typeof(P2) && P2) (y3 = s5(P2.get, "accessor.get")) && (w2.get = y3), (y3 = s5(P2.set, "accessor.set")) && (w2.set = y3), (y3 = s5(P2.init, "accessor.init")) && S3.push(y3);
              else if (void 0 !== P2) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            } else s5(P2, (p5 ? "field" : "method") + " decorators", "return") && (p5 ? S3.push(P2) : w2[A2] = P2);
          }
        } finally {
          I2.v = true;
        }
      }
      return (p5 || d3) && u6.push(function(e9, t7) {
        for (var r8 = S3.length - 1; r8 >= 0; r8--) t7 = S3[r8].call(e9, t7);
        return t7;
      }), p5 || b3 || (f4 ? d3 ? u6.push(i7(w2, "get"), i7(w2, "set")) : u6.push(2 === o7 ? w2[A2] : i7.call.bind(w2[A2])) : Object.defineProperty(e8, n6, w2)), P2;
    }
    function u5(e8, t6) {
      return Object.defineProperty(e8, Symbol.metadata || Symbol["for"]("Symbol.metadata"), { configurable: true, enumerable: true, value: t6 });
    }
    if (arguments.length >= 6) var l3 = a3[Symbol.metadata || Symbol["for"]("Symbol.metadata")];
    var f3 = Object.create(null == l3 ? null : l3), p4 = function(e8, t6, r7, n6) {
      var o7, a4, i8 = [], s6 = function s7(t7) {
        return _checkInRHS$b(t7) === e8;
      }, u6 = /* @__PURE__ */ new Map();
      function l4(e9) {
        e9 && i8.push(c5.bind(null, e9));
      }
      for (var f4 = 0; f4 < t6.length; f4++) {
        var p5 = t6[f4];
        if (Array.isArray(p5)) {
          var d3 = p5[1], h4 = p5[2], m3 = p5.length > 3, y3 = 16 & d3, v3 = !!(8 & d3), g2 = 0 == (d3 &= 7), b3 = h4 + "/" + v3;
          if (!g2 && !m3) {
            var w2 = u6.get(b3);
            if (true === w2 || 3 === w2 && 4 !== d3 || 4 === w2 && 3 !== d3) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h4);
            u6.set(b3, !(d3 > 2) || d3);
          }
          applyDec(v3 ? e8 : e8.prototype, p5, y3, m3 ? "#" + h4 : _toPropertyKey$b(h4), d3, n6, v3 ? a4 = a4 || [] : o7 = o7 || [], i8, v3, m3, g2, 1 === d3, v3 && m3 ? s6 : r7);
        }
      }
      return l4(o7), l4(a4), i8;
    }(e7, t5, o6, f3);
    return r6.length || u5(e7, f3), { e: p4, get c() {
      var t6 = [];
      return r6.length && [u5(applyDec(e7, [r6], n5, e7.name, 5, f3, t6), f3), c5.bind(null, t6, e7)];
    } };
  }
  function _toPropertyKey$b(t5) {
    var i7 = _toPrimitive$b(t5, "string");
    return "symbol" == _typeof(i7) ? i7 : i7 + "";
  }
  function _toPrimitive$b(t5, r6) {
    if ("object" != _typeof(t5) || !t5) return t5;
    var e7 = t5[Symbol.toPrimitive];
    if (void 0 !== e7) {
      var i7 = e7.call(t5, r6 || "default");
      if ("object" != _typeof(i7)) return i7;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r6 ? String : Number)(t5);
  }
  function _setFunctionName$b(e7, t5, n5) {
    "symbol" == _typeof(t5) && (t5 = (t5 = t5.description) ? "[" + t5 + "]" : "");
    try {
      Object.defineProperty(e7, "name", { configurable: true, value: n5 ? n5 + " " + t5 : t5 });
    } catch (e8) {
    }
    return e7;
  }
  function _checkInRHS$b(e7) {
    if (Object(e7) !== e7) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e7 ? _typeof(e7) : "null"));
    return e7;
  }
  function _callSuper$c(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$c() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$c() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$c = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _classPrivateFieldInitSpec$a(e7, t5, a3) {
    _checkPrivateRedeclaration$a(e7, t5), t5.set(e7, a3);
  }
  function _checkPrivateRedeclaration$a(e7, t5) {
    if (t5.has(e7)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classPrivateFieldSet$a(s5, a3, r6) {
    return s5.set(_assertClassBrand$a(s5, a3), r6), r6;
  }
  function _classPrivateFieldGet$a(s5, a3) {
    return s5.get(_assertClassBrand$a(s5, a3));
  }
  function _assertClassBrand$a(e7, t5, n5) {
    if ("function" == typeof e7 ? e7 === t5 : e7.has(t5)) return arguments.length < 3 ? t5 : n5;
    throw new TypeError("Private element is not present on this object");
  }
  function _applyDecs$a(e7, t5, r6, n5, o6, a3) {
    function i7(e8, t6, r7) {
      return function(n6, o7) {
        return r7 && r7(n6), e8[t6].call(n6, o7);
      };
    }
    function c5(e8, t6) {
      for (var r7 = 0; r7 < e8.length; r7++) e8[r7].call(t6);
      return t6;
    }
    function s5(e8, t6, r7, n6) {
      if ("function" != typeof e8 && (n6 || void 0 !== e8)) throw new TypeError(t6 + " must " + (r7 || "be") + " a function" + (n6 ? "" : " or undefined"));
      return e8;
    }
    function applyDec(e8, t6, r7, n6, o7, a4, c6, u6, l4, f4, p5, d3, h4) {
      function m3(e9) {
        if (!h4(e9)) throw new TypeError("Attempted to access private element on non-instance");
      }
      var y3, v3 = t6[0], g2 = t6[3], b3 = !u6;
      if (!b3) {
        r7 || Array.isArray(v3) || (v3 = [v3]);
        var w2 = {}, S3 = [], A2 = 3 === o7 ? "get" : 4 === o7 || d3 ? "set" : "value";
        f4 ? (p5 || d3 ? w2 = { get: _setFunctionName$a(function() {
          return g2(this);
        }, n6, "get"), set: function set(e9) {
          t6[4](this, e9);
        } } : w2[A2] = g2, p5 || _setFunctionName$a(w2[A2], n6, 2 === o7 ? "" : A2)) : p5 || (w2 = Object.getOwnPropertyDescriptor(e8, n6));
      }
      for (var P2 = e8, j2 = v3.length - 1; j2 >= 0; j2 -= r7 ? 2 : 1) {
        var D2 = v3[j2], E2 = r7 ? v3[j2 - 1] : void 0, I2 = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o7], name: n6, metadata: a4, addInitializer: function(e9, t7) {
          if (e9.v) throw Error("attempted to call addInitializer after decoration was finished");
          s5(t7, "An initializer", "be", true), c6.push(t7);
        }.bind(null, I2) };
        try {
          if (b3) (y3 = s5(D2.call(E2, P2, O), "class decorators", "return")) && (P2 = y3);
          else {
            var k2, F;
            O["static"] = l4, O["private"] = f4, f4 ? 2 === o7 ? k2 = function k3(e9) {
              return m3(e9), w2.value;
            } : (o7 < 4 && (k2 = i7(w2, "get", m3)), 3 !== o7 && (F = i7(w2, "set", m3))) : (k2 = function k3(e9) {
              return e9[n6];
            }, (o7 < 2 || 4 === o7) && (F = function F2(e9, t7) {
              e9[n6] = t7;
            }));
            var N2 = O.access = { has: f4 ? h4.bind() : function(e9) {
              return n6 in e9;
            } };
            if (k2 && (N2.get = k2), F && (N2.set = F), P2 = D2.call(E2, d3 ? { get: w2.get, set: w2.set } : w2[A2], O), d3) {
              if ("object" == _typeof(P2) && P2) (y3 = s5(P2.get, "accessor.get")) && (w2.get = y3), (y3 = s5(P2.set, "accessor.set")) && (w2.set = y3), (y3 = s5(P2.init, "accessor.init")) && S3.push(y3);
              else if (void 0 !== P2) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            } else s5(P2, (p5 ? "field" : "method") + " decorators", "return") && (p5 ? S3.push(P2) : w2[A2] = P2);
          }
        } finally {
          I2.v = true;
        }
      }
      return (p5 || d3) && u6.push(function(e9, t7) {
        for (var r8 = S3.length - 1; r8 >= 0; r8--) t7 = S3[r8].call(e9, t7);
        return t7;
      }), p5 || b3 || (f4 ? d3 ? u6.push(i7(w2, "get"), i7(w2, "set")) : u6.push(2 === o7 ? w2[A2] : i7.call.bind(w2[A2])) : Object.defineProperty(e8, n6, w2)), P2;
    }
    function u5(e8, t6) {
      return Object.defineProperty(e8, Symbol.metadata || Symbol["for"]("Symbol.metadata"), { configurable: true, enumerable: true, value: t6 });
    }
    if (arguments.length >= 6) var l3 = a3[Symbol.metadata || Symbol["for"]("Symbol.metadata")];
    var f3 = Object.create(null == l3 ? null : l3), p4 = function(e8, t6, r7, n6) {
      var o7, a4, i8 = [], s6 = function s7(t7) {
        return _checkInRHS$a(t7) === e8;
      }, u6 = /* @__PURE__ */ new Map();
      function l4(e9) {
        e9 && i8.push(c5.bind(null, e9));
      }
      for (var f4 = 0; f4 < t6.length; f4++) {
        var p5 = t6[f4];
        if (Array.isArray(p5)) {
          var d3 = p5[1], h4 = p5[2], m3 = p5.length > 3, y3 = 16 & d3, v3 = !!(8 & d3), g2 = 0 == (d3 &= 7), b3 = h4 + "/" + v3;
          if (!g2 && !m3) {
            var w2 = u6.get(b3);
            if (true === w2 || 3 === w2 && 4 !== d3 || 4 === w2 && 3 !== d3) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h4);
            u6.set(b3, !(d3 > 2) || d3);
          }
          applyDec(v3 ? e8 : e8.prototype, p5, y3, m3 ? "#" + h4 : _toPropertyKey$a(h4), d3, n6, v3 ? a4 = a4 || [] : o7 = o7 || [], i8, v3, m3, g2, 1 === d3, v3 && m3 ? s6 : r7);
        }
      }
      return l4(o7), l4(a4), i8;
    }(e7, t5, o6, f3);
    return r6.length || u5(e7, f3), { e: p4, get c() {
      var t6 = [];
      return r6.length && [u5(applyDec(e7, [r6], n5, e7.name, 5, f3, t6), f3), c5.bind(null, t6, e7)];
    } };
  }
  function _toPropertyKey$a(t5) {
    var i7 = _toPrimitive$a(t5, "string");
    return "symbol" == _typeof(i7) ? i7 : i7 + "";
  }
  function _toPrimitive$a(t5, r6) {
    if ("object" != _typeof(t5) || !t5) return t5;
    var e7 = t5[Symbol.toPrimitive];
    if (void 0 !== e7) {
      var i7 = e7.call(t5, r6 || "default");
      if ("object" != _typeof(i7)) return i7;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r6 ? String : Number)(t5);
  }
  function _setFunctionName$a(e7, t5, n5) {
    "symbol" == _typeof(t5) && (t5 = (t5 = t5.description) ? "[" + t5 + "]" : "");
    try {
      Object.defineProperty(e7, "name", { configurable: true, value: n5 ? n5 + " " + t5 : t5 });
    } catch (e8) {
    }
    return e7;
  }
  function _checkInRHS$a(e7) {
    if (Object(e7) !== e7) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e7 ? _typeof(e7) : "null"));
    return e7;
  }
  function _callSuper$b(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$b() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$b() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$b = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _classPrivateFieldInitSpec$9(e7, t5, a3) {
    _checkPrivateRedeclaration$9(e7, t5), t5.set(e7, a3);
  }
  function _checkPrivateRedeclaration$9(e7, t5) {
    if (t5.has(e7)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classPrivateFieldSet$9(s5, a3, r6) {
    return s5.set(_assertClassBrand$9(s5, a3), r6), r6;
  }
  function _classPrivateFieldGet$9(s5, a3) {
    return s5.get(_assertClassBrand$9(s5, a3));
  }
  function _assertClassBrand$9(e7, t5, n5) {
    if ("function" == typeof e7 ? e7 === t5 : e7.has(t5)) return arguments.length < 3 ? t5 : n5;
    throw new TypeError("Private element is not present on this object");
  }
  function _applyDecs$9(e7, t5, r6, n5, o6, a3) {
    function i7(e8, t6, r7) {
      return function(n6, o7) {
        return r7 && r7(n6), e8[t6].call(n6, o7);
      };
    }
    function c5(e8, t6) {
      for (var r7 = 0; r7 < e8.length; r7++) e8[r7].call(t6);
      return t6;
    }
    function s5(e8, t6, r7, n6) {
      if ("function" != typeof e8 && (n6 || void 0 !== e8)) throw new TypeError(t6 + " must " + (r7 || "be") + " a function" + (n6 ? "" : " or undefined"));
      return e8;
    }
    function applyDec(e8, t6, r7, n6, o7, a4, c6, u6, l4, f4, p5, d3, h4) {
      function m3(e9) {
        if (!h4(e9)) throw new TypeError("Attempted to access private element on non-instance");
      }
      var y3, v3 = t6[0], g2 = t6[3], b3 = !u6;
      if (!b3) {
        r7 || Array.isArray(v3) || (v3 = [v3]);
        var w2 = {}, S3 = [], A2 = 3 === o7 ? "get" : 4 === o7 || d3 ? "set" : "value";
        f4 ? (p5 || d3 ? w2 = { get: _setFunctionName$9(function() {
          return g2(this);
        }, n6, "get"), set: function set(e9) {
          t6[4](this, e9);
        } } : w2[A2] = g2, p5 || _setFunctionName$9(w2[A2], n6, 2 === o7 ? "" : A2)) : p5 || (w2 = Object.getOwnPropertyDescriptor(e8, n6));
      }
      for (var P2 = e8, j2 = v3.length - 1; j2 >= 0; j2 -= r7 ? 2 : 1) {
        var D2 = v3[j2], E2 = r7 ? v3[j2 - 1] : void 0, I2 = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o7], name: n6, metadata: a4, addInitializer: function(e9, t7) {
          if (e9.v) throw Error("attempted to call addInitializer after decoration was finished");
          s5(t7, "An initializer", "be", true), c6.push(t7);
        }.bind(null, I2) };
        try {
          if (b3) (y3 = s5(D2.call(E2, P2, O), "class decorators", "return")) && (P2 = y3);
          else {
            var k2, F;
            O["static"] = l4, O["private"] = f4, f4 ? 2 === o7 ? k2 = function k3(e9) {
              return m3(e9), w2.value;
            } : (o7 < 4 && (k2 = i7(w2, "get", m3)), 3 !== o7 && (F = i7(w2, "set", m3))) : (k2 = function k3(e9) {
              return e9[n6];
            }, (o7 < 2 || 4 === o7) && (F = function F2(e9, t7) {
              e9[n6] = t7;
            }));
            var N2 = O.access = { has: f4 ? h4.bind() : function(e9) {
              return n6 in e9;
            } };
            if (k2 && (N2.get = k2), F && (N2.set = F), P2 = D2.call(E2, d3 ? { get: w2.get, set: w2.set } : w2[A2], O), d3) {
              if ("object" == _typeof(P2) && P2) (y3 = s5(P2.get, "accessor.get")) && (w2.get = y3), (y3 = s5(P2.set, "accessor.set")) && (w2.set = y3), (y3 = s5(P2.init, "accessor.init")) && S3.push(y3);
              else if (void 0 !== P2) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            } else s5(P2, (p5 ? "field" : "method") + " decorators", "return") && (p5 ? S3.push(P2) : w2[A2] = P2);
          }
        } finally {
          I2.v = true;
        }
      }
      return (p5 || d3) && u6.push(function(e9, t7) {
        for (var r8 = S3.length - 1; r8 >= 0; r8--) t7 = S3[r8].call(e9, t7);
        return t7;
      }), p5 || b3 || (f4 ? d3 ? u6.push(i7(w2, "get"), i7(w2, "set")) : u6.push(2 === o7 ? w2[A2] : i7.call.bind(w2[A2])) : Object.defineProperty(e8, n6, w2)), P2;
    }
    function u5(e8, t6) {
      return Object.defineProperty(e8, Symbol.metadata || Symbol["for"]("Symbol.metadata"), { configurable: true, enumerable: true, value: t6 });
    }
    if (arguments.length >= 6) var l3 = a3[Symbol.metadata || Symbol["for"]("Symbol.metadata")];
    var f3 = Object.create(null == l3 ? null : l3), p4 = function(e8, t6, r7, n6) {
      var o7, a4, i8 = [], s6 = function s7(t7) {
        return _checkInRHS$9(t7) === e8;
      }, u6 = /* @__PURE__ */ new Map();
      function l4(e9) {
        e9 && i8.push(c5.bind(null, e9));
      }
      for (var f4 = 0; f4 < t6.length; f4++) {
        var p5 = t6[f4];
        if (Array.isArray(p5)) {
          var d3 = p5[1], h4 = p5[2], m3 = p5.length > 3, y3 = 16 & d3, v3 = !!(8 & d3), g2 = 0 == (d3 &= 7), b3 = h4 + "/" + v3;
          if (!g2 && !m3) {
            var w2 = u6.get(b3);
            if (true === w2 || 3 === w2 && 4 !== d3 || 4 === w2 && 3 !== d3) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h4);
            u6.set(b3, !(d3 > 2) || d3);
          }
          applyDec(v3 ? e8 : e8.prototype, p5, y3, m3 ? "#" + h4 : _toPropertyKey$9(h4), d3, n6, v3 ? a4 = a4 || [] : o7 = o7 || [], i8, v3, m3, g2, 1 === d3, v3 && m3 ? s6 : r7);
        }
      }
      return l4(o7), l4(a4), i8;
    }(e7, t5, o6, f3);
    return r6.length || u5(e7, f3), { e: p4, get c() {
      var t6 = [];
      return r6.length && [u5(applyDec(e7, [r6], n5, e7.name, 5, f3, t6), f3), c5.bind(null, t6, e7)];
    } };
  }
  function _toPropertyKey$9(t5) {
    var i7 = _toPrimitive$9(t5, "string");
    return "symbol" == _typeof(i7) ? i7 : i7 + "";
  }
  function _toPrimitive$9(t5, r6) {
    if ("object" != _typeof(t5) || !t5) return t5;
    var e7 = t5[Symbol.toPrimitive];
    if (void 0 !== e7) {
      var i7 = e7.call(t5, r6 || "default");
      if ("object" != _typeof(i7)) return i7;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r6 ? String : Number)(t5);
  }
  function _setFunctionName$9(e7, t5, n5) {
    "symbol" == _typeof(t5) && (t5 = (t5 = t5.description) ? "[" + t5 + "]" : "");
    try {
      Object.defineProperty(e7, "name", { configurable: true, value: n5 ? n5 + " " + t5 : t5 });
    } catch (e8) {
    }
    return e7;
  }
  function _checkInRHS$9(e7) {
    if (Object(e7) !== e7) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e7 ? _typeof(e7) : "null"));
    return e7;
  }
  function _callSuper$a(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$a() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$a() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$a = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _classPrivateFieldInitSpec$8(e7, t5, a3) {
    _checkPrivateRedeclaration$8(e7, t5), t5.set(e7, a3);
  }
  function _checkPrivateRedeclaration$8(e7, t5) {
    if (t5.has(e7)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classPrivateFieldSet$8(s5, a3, r6) {
    return s5.set(_assertClassBrand$8(s5, a3), r6), r6;
  }
  function _classPrivateFieldGet$8(s5, a3) {
    return s5.get(_assertClassBrand$8(s5, a3));
  }
  function _assertClassBrand$8(e7, t5, n5) {
    if ("function" == typeof e7 ? e7 === t5 : e7.has(t5)) return arguments.length < 3 ? t5 : n5;
    throw new TypeError("Private element is not present on this object");
  }
  function _applyDecs$8(e7, t5, r6, n5, o6, a3) {
    function i7(e8, t6, r7) {
      return function(n6, o7) {
        return r7 && r7(n6), e8[t6].call(n6, o7);
      };
    }
    function c5(e8, t6) {
      for (var r7 = 0; r7 < e8.length; r7++) e8[r7].call(t6);
      return t6;
    }
    function s5(e8, t6, r7, n6) {
      if ("function" != typeof e8 && (n6 || void 0 !== e8)) throw new TypeError(t6 + " must " + (r7 || "be") + " a function" + (n6 ? "" : " or undefined"));
      return e8;
    }
    function applyDec(e8, t6, r7, n6, o7, a4, c6, u6, l4, f4, p5, d3, h4) {
      function m3(e9) {
        if (!h4(e9)) throw new TypeError("Attempted to access private element on non-instance");
      }
      var y3, v3 = t6[0], g2 = t6[3], b3 = !u6;
      if (!b3) {
        r7 || Array.isArray(v3) || (v3 = [v3]);
        var w2 = {}, S3 = [], A2 = 3 === o7 ? "get" : 4 === o7 || d3 ? "set" : "value";
        f4 ? (p5 || d3 ? w2 = { get: _setFunctionName$8(function() {
          return g2(this);
        }, n6, "get"), set: function set(e9) {
          t6[4](this, e9);
        } } : w2[A2] = g2, p5 || _setFunctionName$8(w2[A2], n6, 2 === o7 ? "" : A2)) : p5 || (w2 = Object.getOwnPropertyDescriptor(e8, n6));
      }
      for (var P2 = e8, j2 = v3.length - 1; j2 >= 0; j2 -= r7 ? 2 : 1) {
        var D2 = v3[j2], E2 = r7 ? v3[j2 - 1] : void 0, I2 = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o7], name: n6, metadata: a4, addInitializer: function(e9, t7) {
          if (e9.v) throw Error("attempted to call addInitializer after decoration was finished");
          s5(t7, "An initializer", "be", true), c6.push(t7);
        }.bind(null, I2) };
        try {
          if (b3) (y3 = s5(D2.call(E2, P2, O), "class decorators", "return")) && (P2 = y3);
          else {
            var k2, F;
            O["static"] = l4, O["private"] = f4, f4 ? 2 === o7 ? k2 = function k3(e9) {
              return m3(e9), w2.value;
            } : (o7 < 4 && (k2 = i7(w2, "get", m3)), 3 !== o7 && (F = i7(w2, "set", m3))) : (k2 = function k3(e9) {
              return e9[n6];
            }, (o7 < 2 || 4 === o7) && (F = function F2(e9, t7) {
              e9[n6] = t7;
            }));
            var N2 = O.access = { has: f4 ? h4.bind() : function(e9) {
              return n6 in e9;
            } };
            if (k2 && (N2.get = k2), F && (N2.set = F), P2 = D2.call(E2, d3 ? { get: w2.get, set: w2.set } : w2[A2], O), d3) {
              if ("object" == _typeof(P2) && P2) (y3 = s5(P2.get, "accessor.get")) && (w2.get = y3), (y3 = s5(P2.set, "accessor.set")) && (w2.set = y3), (y3 = s5(P2.init, "accessor.init")) && S3.push(y3);
              else if (void 0 !== P2) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            } else s5(P2, (p5 ? "field" : "method") + " decorators", "return") && (p5 ? S3.push(P2) : w2[A2] = P2);
          }
        } finally {
          I2.v = true;
        }
      }
      return (p5 || d3) && u6.push(function(e9, t7) {
        for (var r8 = S3.length - 1; r8 >= 0; r8--) t7 = S3[r8].call(e9, t7);
        return t7;
      }), p5 || b3 || (f4 ? d3 ? u6.push(i7(w2, "get"), i7(w2, "set")) : u6.push(2 === o7 ? w2[A2] : i7.call.bind(w2[A2])) : Object.defineProperty(e8, n6, w2)), P2;
    }
    function u5(e8, t6) {
      return Object.defineProperty(e8, Symbol.metadata || Symbol["for"]("Symbol.metadata"), { configurable: true, enumerable: true, value: t6 });
    }
    if (arguments.length >= 6) var l3 = a3[Symbol.metadata || Symbol["for"]("Symbol.metadata")];
    var f3 = Object.create(null == l3 ? null : l3), p4 = function(e8, t6, r7, n6) {
      var o7, a4, i8 = [], s6 = function s7(t7) {
        return _checkInRHS$8(t7) === e8;
      }, u6 = /* @__PURE__ */ new Map();
      function l4(e9) {
        e9 && i8.push(c5.bind(null, e9));
      }
      for (var f4 = 0; f4 < t6.length; f4++) {
        var p5 = t6[f4];
        if (Array.isArray(p5)) {
          var d3 = p5[1], h4 = p5[2], m3 = p5.length > 3, y3 = 16 & d3, v3 = !!(8 & d3), g2 = 0 == (d3 &= 7), b3 = h4 + "/" + v3;
          if (!g2 && !m3) {
            var w2 = u6.get(b3);
            if (true === w2 || 3 === w2 && 4 !== d3 || 4 === w2 && 3 !== d3) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h4);
            u6.set(b3, !(d3 > 2) || d3);
          }
          applyDec(v3 ? e8 : e8.prototype, p5, y3, m3 ? "#" + h4 : _toPropertyKey$8(h4), d3, n6, v3 ? a4 = a4 || [] : o7 = o7 || [], i8, v3, m3, g2, 1 === d3, v3 && m3 ? s6 : r7);
        }
      }
      return l4(o7), l4(a4), i8;
    }(e7, t5, o6, f3);
    return r6.length || u5(e7, f3), { e: p4, get c() {
      var t6 = [];
      return r6.length && [u5(applyDec(e7, [r6], n5, e7.name, 5, f3, t6), f3), c5.bind(null, t6, e7)];
    } };
  }
  function _toPropertyKey$8(t5) {
    var i7 = _toPrimitive$8(t5, "string");
    return "symbol" == _typeof(i7) ? i7 : i7 + "";
  }
  function _toPrimitive$8(t5, r6) {
    if ("object" != _typeof(t5) || !t5) return t5;
    var e7 = t5[Symbol.toPrimitive];
    if (void 0 !== e7) {
      var i7 = e7.call(t5, r6 || "default");
      if ("object" != _typeof(i7)) return i7;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r6 ? String : Number)(t5);
  }
  function _setFunctionName$8(e7, t5, n5) {
    "symbol" == _typeof(t5) && (t5 = (t5 = t5.description) ? "[" + t5 + "]" : "");
    try {
      Object.defineProperty(e7, "name", { configurable: true, value: n5 ? n5 + " " + t5 : t5 });
    } catch (e8) {
    }
    return e7;
  }
  function _checkInRHS$8(e7) {
    if (Object(e7) !== e7) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e7 ? _typeof(e7) : "null"));
    return e7;
  }
  function ownKeys$22(e7, r6) {
    var t5 = Object.keys(e7);
    if (Object.getOwnPropertySymbols) {
      var o6 = Object.getOwnPropertySymbols(e7);
      r6 && (o6 = o6.filter(function(r7) {
        return Object.getOwnPropertyDescriptor(e7, r7).enumerable;
      })), t5.push.apply(t5, o6);
    }
    return t5;
  }
  function _objectSpread$22(e7) {
    for (var r6 = 1; r6 < arguments.length; r6++) {
      var t5 = null != arguments[r6] ? arguments[r6] : {};
      r6 % 2 ? ownKeys$22(Object(t5), true).forEach(function(r7) {
        _defineProperty(e7, r7, t5[r7]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e7, Object.getOwnPropertyDescriptors(t5)) : ownKeys$22(Object(t5)).forEach(function(r7) {
        Object.defineProperty(e7, r7, Object.getOwnPropertyDescriptor(t5, r7));
      });
    }
    return e7;
  }
  function setup$3(props) {
    var positionWatcher = typeof (props === null || props === void 0 ? void 0 : props.socketPositionWatcher) === "undefined" ? getDOMSocketPosition() : props.socketPositionWatcher;
    var _ref2 = (props === null || props === void 0 ? void 0 : props.customize) || {}, node = _ref2.node, connection = _ref2.connection, socket = _ref2.socket, control = _ref2.control;
    return {
      attach: function attach(plugin) {
        positionWatcher.attach(plugin);
      },
      update: function update(context, plugin) {
        var payload = context.data.payload;
        var parent = plugin.parentScope();
        if (!parent) throw new Error("parent");
        var emit = parent.emit.bind(parent);
        if (context.data.type === "node") {
          return {
            data: payload,
            emit
          };
        } else if (context.data.type === "connection") {
          var _context$data = context.data, start = _context$data.start, end = _context$data.end;
          return _objectSpread$22(_objectSpread$22({
            data: payload
          }, start ? {
            start
          } : {}), end ? {
            end
          } : {});
        }
        return {
          data: payload
        };
      },
      // eslint-disable-next-line max-statements
      render: function render(context, plugin) {
        if (context.data.type === "node") {
          var parent = plugin.parentScope();
          var emit = function emit2(data) {
            return void parent.emit(data);
          };
          return node ? node(context.data)({
            emit
          }) : b2(_templateObject$c || (_templateObject$c = _taggedTemplateLiteral(["<rete-node .data=", " .emit=", "></rete-node>"])), context.data.payload, emit);
        }
        if (context.data.type === "connection") {
          var _data = context.data;
          var payload = _data.payload;
          var sourceOutput = payload.sourceOutput, targetInput = payload.targetInput, source = payload.source, target = payload.target;
          var component = function component2(path, start, end) {
            return connection ? connection(_data)({
              path,
              start,
              end
            }) : b2(_templateObject2$9 || (_templateObject2$9 = _taggedTemplateLiteral(["<rete-connection .path=", " .start=", " .end=", "></rete-connection>"])), path, start, end);
          };
          return b2(_templateObject3$4 || (_templateObject3$4 = _taggedTemplateLiteral(["<rete-connection-wrapper\n          .start=", "\n          .end=", "\n          .path=", "\n  .component=", "\n  ></rete-connection>"])), context.data.start || function(change) {
            return positionWatcher.listen(source, "output", sourceOutput, change);
          }, context.data.end || function(change) {
            return positionWatcher.listen(target, "input", targetInput, change);
          }, /* @__PURE__ */ function() {
            var _ref22 = _asyncToGenerator(/* @__PURE__ */ import_regenerator5.default.mark(function _callee(start, end) {
              var response, _response$data, path, points, curvature;
              return import_regenerator5.default.wrap(function _callee$(_context) {
                while (1) switch (_context.prev = _context.next) {
                  case 0:
                    _context.next = 2;
                    return plugin.emit({
                      type: "connectionpath",
                      data: {
                        payload,
                        points: [start, end]
                      }
                    });
                  case 2:
                    response = _context.sent;
                    if (response) {
                      _context.next = 5;
                      break;
                    }
                    return _context.abrupt("return", "");
                  case 5:
                    _response$data = response.data, path = _response$data.path, points = _response$data.points;
                    curvature = 0.3;
                    if (!(!path && points.length !== 2)) {
                      _context.next = 9;
                      break;
                    }
                    throw new Error("cannot render connection with a custom number of points");
                  case 9:
                    if (path) {
                      _context.next = 11;
                      break;
                    }
                    return _context.abrupt("return", payload.isLoop ? loopConnectionPath(points, curvature, 120) : classicConnectionPath(points, curvature));
                  case 11:
                    return _context.abrupt("return", path);
                  case 12:
                  case "end":
                    return _context.stop();
                }
              }, _callee);
            }));
            return function(_x, _x2) {
              return _ref22.apply(this, arguments);
            };
          }(), component);
        } else if (context.data.type === "socket") {
          return socket ? socket(context.data)() : b2(_templateObject4$2 || (_templateObject4$2 = _taggedTemplateLiteral(["<rete-socket .data=", "></rete-socket>"])), context.data.payload);
        } else if (context.data.type === "control") {
          return control ? control(context.data)() : b2(_templateObject5 || (_templateObject5 = _taggedTemplateLiteral(["<rete-control .data=", "></rete-control>"])), context.data.payload);
        }
        return null;
      }
    };
  }
  function _callSuper$9(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$9() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$9() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$9 = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function debounce(delay, cb) {
    return {
      timeout: null,
      cancel: function cancel() {
        if (this.timeout) {
          window.clearTimeout(this.timeout);
          this.timeout = null;
        }
      },
      call: function call() {
        this.timeout = window.setTimeout(function() {
          cb();
        }, delay);
      }
    };
  }
  function _callSuper$8(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$8() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$8() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$8 = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _superPropGet$3(t5, e7, o6, r6) {
    var p4 = _get(_getPrototypeOf(1 & r6 ? t5.prototype : t5), e7, o6);
    return 2 & r6 && "function" == typeof p4 ? function(t6) {
      return p4.apply(o6, t6);
    } : p4;
  }
  function _classPrivateFieldInitSpec$7(e7, t5, a3) {
    _checkPrivateRedeclaration$7(e7, t5), t5.set(e7, a3);
  }
  function _checkPrivateRedeclaration$7(e7, t5) {
    if (t5.has(e7)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classPrivateFieldSet$7(s5, a3, r6) {
    return s5.set(_assertClassBrand$7(s5, a3), r6), r6;
  }
  function _classPrivateFieldGet$7(s5, a3) {
    return s5.get(_assertClassBrand$7(s5, a3));
  }
  function _assertClassBrand$7(e7, t5, n5) {
    if ("function" == typeof e7 ? e7 === t5 : e7.has(t5)) return arguments.length < 3 ? t5 : n5;
    throw new TypeError("Private element is not present on this object");
  }
  function _applyDecs$7(e7, t5, r6, n5, o6, a3) {
    function i7(e8, t6, r7) {
      return function(n6, o7) {
        return r7 && r7(n6), e8[t6].call(n6, o7);
      };
    }
    function c5(e8, t6) {
      for (var r7 = 0; r7 < e8.length; r7++) e8[r7].call(t6);
      return t6;
    }
    function s5(e8, t6, r7, n6) {
      if ("function" != typeof e8 && (n6 || void 0 !== e8)) throw new TypeError(t6 + " must " + (r7 || "be") + " a function" + (n6 ? "" : " or undefined"));
      return e8;
    }
    function applyDec(e8, t6, r7, n6, o7, a4, c6, u6, l4, f4, p5, d3, h4) {
      function m3(e9) {
        if (!h4(e9)) throw new TypeError("Attempted to access private element on non-instance");
      }
      var y3, v3 = t6[0], g2 = t6[3], b3 = !u6;
      if (!b3) {
        r7 || Array.isArray(v3) || (v3 = [v3]);
        var w2 = {}, S3 = [], A2 = 3 === o7 ? "get" : 4 === o7 || d3 ? "set" : "value";
        f4 ? (p5 || d3 ? w2 = { get: _setFunctionName$7(function() {
          return g2(this);
        }, n6, "get"), set: function set(e9) {
          t6[4](this, e9);
        } } : w2[A2] = g2, p5 || _setFunctionName$7(w2[A2], n6, 2 === o7 ? "" : A2)) : p5 || (w2 = Object.getOwnPropertyDescriptor(e8, n6));
      }
      for (var P2 = e8, j2 = v3.length - 1; j2 >= 0; j2 -= r7 ? 2 : 1) {
        var D2 = v3[j2], E2 = r7 ? v3[j2 - 1] : void 0, I2 = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o7], name: n6, metadata: a4, addInitializer: function(e9, t7) {
          if (e9.v) throw Error("attempted to call addInitializer after decoration was finished");
          s5(t7, "An initializer", "be", true), c6.push(t7);
        }.bind(null, I2) };
        try {
          if (b3) (y3 = s5(D2.call(E2, P2, O), "class decorators", "return")) && (P2 = y3);
          else {
            var k2, F;
            O["static"] = l4, O["private"] = f4, f4 ? 2 === o7 ? k2 = function k3(e9) {
              return m3(e9), w2.value;
            } : (o7 < 4 && (k2 = i7(w2, "get", m3)), 3 !== o7 && (F = i7(w2, "set", m3))) : (k2 = function k3(e9) {
              return e9[n6];
            }, (o7 < 2 || 4 === o7) && (F = function F2(e9, t7) {
              e9[n6] = t7;
            }));
            var N2 = O.access = { has: f4 ? h4.bind() : function(e9) {
              return n6 in e9;
            } };
            if (k2 && (N2.get = k2), F && (N2.set = F), P2 = D2.call(E2, d3 ? { get: w2.get, set: w2.set } : w2[A2], O), d3) {
              if ("object" == _typeof(P2) && P2) (y3 = s5(P2.get, "accessor.get")) && (w2.get = y3), (y3 = s5(P2.set, "accessor.set")) && (w2.set = y3), (y3 = s5(P2.init, "accessor.init")) && S3.push(y3);
              else if (void 0 !== P2) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            } else s5(P2, (p5 ? "field" : "method") + " decorators", "return") && (p5 ? S3.push(P2) : w2[A2] = P2);
          }
        } finally {
          I2.v = true;
        }
      }
      return (p5 || d3) && u6.push(function(e9, t7) {
        for (var r8 = S3.length - 1; r8 >= 0; r8--) t7 = S3[r8].call(e9, t7);
        return t7;
      }), p5 || b3 || (f4 ? d3 ? u6.push(i7(w2, "get"), i7(w2, "set")) : u6.push(2 === o7 ? w2[A2] : i7.call.bind(w2[A2])) : Object.defineProperty(e8, n6, w2)), P2;
    }
    function u5(e8, t6) {
      return Object.defineProperty(e8, Symbol.metadata || Symbol["for"]("Symbol.metadata"), { configurable: true, enumerable: true, value: t6 });
    }
    if (arguments.length >= 6) var l3 = a3[Symbol.metadata || Symbol["for"]("Symbol.metadata")];
    var f3 = Object.create(null == l3 ? null : l3), p4 = function(e8, t6, r7, n6) {
      var o7, a4, i8 = [], s6 = function s7(t7) {
        return _checkInRHS$7(t7) === e8;
      }, u6 = /* @__PURE__ */ new Map();
      function l4(e9) {
        e9 && i8.push(c5.bind(null, e9));
      }
      for (var f4 = 0; f4 < t6.length; f4++) {
        var p5 = t6[f4];
        if (Array.isArray(p5)) {
          var d3 = p5[1], h4 = p5[2], m3 = p5.length > 3, y3 = 16 & d3, v3 = !!(8 & d3), g2 = 0 == (d3 &= 7), b3 = h4 + "/" + v3;
          if (!g2 && !m3) {
            var w2 = u6.get(b3);
            if (true === w2 || 3 === w2 && 4 !== d3 || 4 === w2 && 3 !== d3) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h4);
            u6.set(b3, !(d3 > 2) || d3);
          }
          applyDec(v3 ? e8 : e8.prototype, p5, y3, m3 ? "#" + h4 : _toPropertyKey$7(h4), d3, n6, v3 ? a4 = a4 || [] : o7 = o7 || [], i8, v3, m3, g2, 1 === d3, v3 && m3 ? s6 : r7);
        }
      }
      return l4(o7), l4(a4), i8;
    }(e7, t5, o6, f3);
    return r6.length || u5(e7, f3), { e: p4, get c() {
      var t6 = [];
      return r6.length && [u5(applyDec(e7, [r6], n5, e7.name, 5, f3, t6), f3), c5.bind(null, t6, e7)];
    } };
  }
  function _toPropertyKey$7(t5) {
    var i7 = _toPrimitive$7(t5, "string");
    return "symbol" == _typeof(i7) ? i7 : i7 + "";
  }
  function _toPrimitive$7(t5, r6) {
    if ("object" != _typeof(t5) || !t5) return t5;
    var e7 = t5[Symbol.toPrimitive];
    if (void 0 !== e7) {
      var i7 = e7.call(t5, r6 || "default");
      if ("object" != _typeof(i7)) return i7;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r6 ? String : Number)(t5);
  }
  function _setFunctionName$7(e7, t5, n5) {
    "symbol" == _typeof(t5) && (t5 = (t5 = t5.description) ? "[" + t5 + "]" : "");
    try {
      Object.defineProperty(e7, "name", { configurable: true, value: n5 ? n5 + " " + t5 : t5 });
    } catch (e8) {
    }
    return e7;
  }
  function _checkInRHS$7(e7) {
    if (Object(e7) !== e7) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e7 ? _typeof(e7) : "null"));
    return e7;
  }
  function _callSuper$7(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$7() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$7() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$7 = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _superPropGet$2(t5, e7, o6, r6) {
    var p4 = _get(_getPrototypeOf(1 & r6 ? t5.prototype : t5), e7, o6);
    return 2 & r6 && "function" == typeof p4 ? function(t6) {
      return p4.apply(o6, t6);
    } : p4;
  }
  function _classPrivateFieldInitSpec$6(e7, t5, a3) {
    _checkPrivateRedeclaration$6(e7, t5), t5.set(e7, a3);
  }
  function _checkPrivateRedeclaration$6(e7, t5) {
    if (t5.has(e7)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classPrivateFieldSet$6(s5, a3, r6) {
    return s5.set(_assertClassBrand$6(s5, a3), r6), r6;
  }
  function _classPrivateFieldGet$6(s5, a3) {
    return s5.get(_assertClassBrand$6(s5, a3));
  }
  function _assertClassBrand$6(e7, t5, n5) {
    if ("function" == typeof e7 ? e7 === t5 : e7.has(t5)) return arguments.length < 3 ? t5 : n5;
    throw new TypeError("Private element is not present on this object");
  }
  function _applyDecs$6(e7, t5, r6, n5, o6, a3) {
    function i7(e8, t6, r7) {
      return function(n6, o7) {
        return r7 && r7(n6), e8[t6].call(n6, o7);
      };
    }
    function c5(e8, t6) {
      for (var r7 = 0; r7 < e8.length; r7++) e8[r7].call(t6);
      return t6;
    }
    function s5(e8, t6, r7, n6) {
      if ("function" != typeof e8 && (n6 || void 0 !== e8)) throw new TypeError(t6 + " must " + (r7 || "be") + " a function" + (n6 ? "" : " or undefined"));
      return e8;
    }
    function applyDec(e8, t6, r7, n6, o7, a4, c6, u6, l4, f4, p5, d3, h4) {
      function m3(e9) {
        if (!h4(e9)) throw new TypeError("Attempted to access private element on non-instance");
      }
      var y3, v3 = t6[0], g2 = t6[3], b3 = !u6;
      if (!b3) {
        r7 || Array.isArray(v3) || (v3 = [v3]);
        var w2 = {}, S3 = [], A2 = 3 === o7 ? "get" : 4 === o7 || d3 ? "set" : "value";
        f4 ? (p5 || d3 ? w2 = { get: _setFunctionName$6(function() {
          return g2(this);
        }, n6, "get"), set: function set(e9) {
          t6[4](this, e9);
        } } : w2[A2] = g2, p5 || _setFunctionName$6(w2[A2], n6, 2 === o7 ? "" : A2)) : p5 || (w2 = Object.getOwnPropertyDescriptor(e8, n6));
      }
      for (var P2 = e8, j2 = v3.length - 1; j2 >= 0; j2 -= r7 ? 2 : 1) {
        var D2 = v3[j2], E2 = r7 ? v3[j2 - 1] : void 0, I2 = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o7], name: n6, metadata: a4, addInitializer: function(e9, t7) {
          if (e9.v) throw Error("attempted to call addInitializer after decoration was finished");
          s5(t7, "An initializer", "be", true), c6.push(t7);
        }.bind(null, I2) };
        try {
          if (b3) (y3 = s5(D2.call(E2, P2, O), "class decorators", "return")) && (P2 = y3);
          else {
            var k2, F;
            O["static"] = l4, O["private"] = f4, f4 ? 2 === o7 ? k2 = function k3(e9) {
              return m3(e9), w2.value;
            } : (o7 < 4 && (k2 = i7(w2, "get", m3)), 3 !== o7 && (F = i7(w2, "set", m3))) : (k2 = function k3(e9) {
              return e9[n6];
            }, (o7 < 2 || 4 === o7) && (F = function F2(e9, t7) {
              e9[n6] = t7;
            }));
            var N2 = O.access = { has: f4 ? h4.bind() : function(e9) {
              return n6 in e9;
            } };
            if (k2 && (N2.get = k2), F && (N2.set = F), P2 = D2.call(E2, d3 ? { get: w2.get, set: w2.set } : w2[A2], O), d3) {
              if ("object" == _typeof(P2) && P2) (y3 = s5(P2.get, "accessor.get")) && (w2.get = y3), (y3 = s5(P2.set, "accessor.set")) && (w2.set = y3), (y3 = s5(P2.init, "accessor.init")) && S3.push(y3);
              else if (void 0 !== P2) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            } else s5(P2, (p5 ? "field" : "method") + " decorators", "return") && (p5 ? S3.push(P2) : w2[A2] = P2);
          }
        } finally {
          I2.v = true;
        }
      }
      return (p5 || d3) && u6.push(function(e9, t7) {
        for (var r8 = S3.length - 1; r8 >= 0; r8--) t7 = S3[r8].call(e9, t7);
        return t7;
      }), p5 || b3 || (f4 ? d3 ? u6.push(i7(w2, "get"), i7(w2, "set")) : u6.push(2 === o7 ? w2[A2] : i7.call.bind(w2[A2])) : Object.defineProperty(e8, n6, w2)), P2;
    }
    function u5(e8, t6) {
      return Object.defineProperty(e8, Symbol.metadata || Symbol["for"]("Symbol.metadata"), { configurable: true, enumerable: true, value: t6 });
    }
    if (arguments.length >= 6) var l3 = a3[Symbol.metadata || Symbol["for"]("Symbol.metadata")];
    var f3 = Object.create(null == l3 ? null : l3), p4 = function(e8, t6, r7, n6) {
      var o7, a4, i8 = [], s6 = function s7(t7) {
        return _checkInRHS$6(t7) === e8;
      }, u6 = /* @__PURE__ */ new Map();
      function l4(e9) {
        e9 && i8.push(c5.bind(null, e9));
      }
      for (var f4 = 0; f4 < t6.length; f4++) {
        var p5 = t6[f4];
        if (Array.isArray(p5)) {
          var d3 = p5[1], h4 = p5[2], m3 = p5.length > 3, y3 = 16 & d3, v3 = !!(8 & d3), g2 = 0 == (d3 &= 7), b3 = h4 + "/" + v3;
          if (!g2 && !m3) {
            var w2 = u6.get(b3);
            if (true === w2 || 3 === w2 && 4 !== d3 || 4 === w2 && 3 !== d3) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h4);
            u6.set(b3, !(d3 > 2) || d3);
          }
          applyDec(v3 ? e8 : e8.prototype, p5, y3, m3 ? "#" + h4 : _toPropertyKey$6(h4), d3, n6, v3 ? a4 = a4 || [] : o7 = o7 || [], i8, v3, m3, g2, 1 === d3, v3 && m3 ? s6 : r7);
        }
      }
      return l4(o7), l4(a4), i8;
    }(e7, t5, o6, f3);
    return r6.length || u5(e7, f3), { e: p4, get c() {
      var t6 = [];
      return r6.length && [u5(applyDec(e7, [r6], n5, e7.name, 5, f3, t6), f3), c5.bind(null, t6, e7)];
    } };
  }
  function _toPropertyKey$6(t5) {
    var i7 = _toPrimitive$6(t5, "string");
    return "symbol" == _typeof(i7) ? i7 : i7 + "";
  }
  function _toPrimitive$6(t5, r6) {
    if ("object" != _typeof(t5) || !t5) return t5;
    var e7 = t5[Symbol.toPrimitive];
    if (void 0 !== e7) {
      var i7 = e7.call(t5, r6 || "default");
      if ("object" != _typeof(i7)) return i7;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r6 ? String : Number)(t5);
  }
  function _setFunctionName$6(e7, t5, n5) {
    "symbol" == _typeof(t5) && (t5 = (t5 = t5.description) ? "[" + t5 + "]" : "");
    try {
      Object.defineProperty(e7, "name", { configurable: true, value: n5 ? n5 + " " + t5 : t5 });
    } catch (e8) {
    }
    return e7;
  }
  function _checkInRHS$6(e7) {
    if (Object(e7) !== e7) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e7 ? _typeof(e7) : "null"));
    return e7;
  }
  function _callSuper$6(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$6() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$6() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$6 = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _classPrivateFieldInitSpec$5(e7, t5, a3) {
    _checkPrivateRedeclaration$5(e7, t5), t5.set(e7, a3);
  }
  function _checkPrivateRedeclaration$5(e7, t5) {
    if (t5.has(e7)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classPrivateFieldSet$5(s5, a3, r6) {
    return s5.set(_assertClassBrand$5(s5, a3), r6), r6;
  }
  function _classPrivateFieldGet$5(s5, a3) {
    return s5.get(_assertClassBrand$5(s5, a3));
  }
  function _assertClassBrand$5(e7, t5, n5) {
    if ("function" == typeof e7 ? e7 === t5 : e7.has(t5)) return arguments.length < 3 ? t5 : n5;
    throw new TypeError("Private element is not present on this object");
  }
  function _applyDecs$5(e7, t5, r6, n5, o6, a3) {
    function i7(e8, t6, r7) {
      return function(n6, o7) {
        return r7 && r7(n6), e8[t6].call(n6, o7);
      };
    }
    function c5(e8, t6) {
      for (var r7 = 0; r7 < e8.length; r7++) e8[r7].call(t6);
      return t6;
    }
    function s5(e8, t6, r7, n6) {
      if ("function" != typeof e8 && (n6 || void 0 !== e8)) throw new TypeError(t6 + " must " + (r7 || "be") + " a function" + (n6 ? "" : " or undefined"));
      return e8;
    }
    function applyDec(e8, t6, r7, n6, o7, a4, c6, u6, l4, f4, p5, d3, h4) {
      function m3(e9) {
        if (!h4(e9)) throw new TypeError("Attempted to access private element on non-instance");
      }
      var y3, v3 = t6[0], g2 = t6[3], b3 = !u6;
      if (!b3) {
        r7 || Array.isArray(v3) || (v3 = [v3]);
        var w2 = {}, S3 = [], A2 = 3 === o7 ? "get" : 4 === o7 || d3 ? "set" : "value";
        f4 ? (p5 || d3 ? w2 = { get: _setFunctionName$5(function() {
          return g2(this);
        }, n6, "get"), set: function set(e9) {
          t6[4](this, e9);
        } } : w2[A2] = g2, p5 || _setFunctionName$5(w2[A2], n6, 2 === o7 ? "" : A2)) : p5 || (w2 = Object.getOwnPropertyDescriptor(e8, n6));
      }
      for (var P2 = e8, j2 = v3.length - 1; j2 >= 0; j2 -= r7 ? 2 : 1) {
        var D2 = v3[j2], E2 = r7 ? v3[j2 - 1] : void 0, I2 = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o7], name: n6, metadata: a4, addInitializer: function(e9, t7) {
          if (e9.v) throw Error("attempted to call addInitializer after decoration was finished");
          s5(t7, "An initializer", "be", true), c6.push(t7);
        }.bind(null, I2) };
        try {
          if (b3) (y3 = s5(D2.call(E2, P2, O), "class decorators", "return")) && (P2 = y3);
          else {
            var k2, F;
            O["static"] = l4, O["private"] = f4, f4 ? 2 === o7 ? k2 = function k3(e9) {
              return m3(e9), w2.value;
            } : (o7 < 4 && (k2 = i7(w2, "get", m3)), 3 !== o7 && (F = i7(w2, "set", m3))) : (k2 = function k3(e9) {
              return e9[n6];
            }, (o7 < 2 || 4 === o7) && (F = function F2(e9, t7) {
              e9[n6] = t7;
            }));
            var N2 = O.access = { has: f4 ? h4.bind() : function(e9) {
              return n6 in e9;
            } };
            if (k2 && (N2.get = k2), F && (N2.set = F), P2 = D2.call(E2, d3 ? { get: w2.get, set: w2.set } : w2[A2], O), d3) {
              if ("object" == _typeof(P2) && P2) (y3 = s5(P2.get, "accessor.get")) && (w2.get = y3), (y3 = s5(P2.set, "accessor.set")) && (w2.set = y3), (y3 = s5(P2.init, "accessor.init")) && S3.push(y3);
              else if (void 0 !== P2) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            } else s5(P2, (p5 ? "field" : "method") + " decorators", "return") && (p5 ? S3.push(P2) : w2[A2] = P2);
          }
        } finally {
          I2.v = true;
        }
      }
      return (p5 || d3) && u6.push(function(e9, t7) {
        for (var r8 = S3.length - 1; r8 >= 0; r8--) t7 = S3[r8].call(e9, t7);
        return t7;
      }), p5 || b3 || (f4 ? d3 ? u6.push(i7(w2, "get"), i7(w2, "set")) : u6.push(2 === o7 ? w2[A2] : i7.call.bind(w2[A2])) : Object.defineProperty(e8, n6, w2)), P2;
    }
    function u5(e8, t6) {
      return Object.defineProperty(e8, Symbol.metadata || Symbol["for"]("Symbol.metadata"), { configurable: true, enumerable: true, value: t6 });
    }
    if (arguments.length >= 6) var l3 = a3[Symbol.metadata || Symbol["for"]("Symbol.metadata")];
    var f3 = Object.create(null == l3 ? null : l3), p4 = function(e8, t6, r7, n6) {
      var o7, a4, i8 = [], s6 = function s7(t7) {
        return _checkInRHS$5(t7) === e8;
      }, u6 = /* @__PURE__ */ new Map();
      function l4(e9) {
        e9 && i8.push(c5.bind(null, e9));
      }
      for (var f4 = 0; f4 < t6.length; f4++) {
        var p5 = t6[f4];
        if (Array.isArray(p5)) {
          var d3 = p5[1], h4 = p5[2], m3 = p5.length > 3, y3 = 16 & d3, v3 = !!(8 & d3), g2 = 0 == (d3 &= 7), b3 = h4 + "/" + v3;
          if (!g2 && !m3) {
            var w2 = u6.get(b3);
            if (true === w2 || 3 === w2 && 4 !== d3 || 4 === w2 && 3 !== d3) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h4);
            u6.set(b3, !(d3 > 2) || d3);
          }
          applyDec(v3 ? e8 : e8.prototype, p5, y3, m3 ? "#" + h4 : _toPropertyKey$5(h4), d3, n6, v3 ? a4 = a4 || [] : o7 = o7 || [], i8, v3, m3, g2, 1 === d3, v3 && m3 ? s6 : r7);
        }
      }
      return l4(o7), l4(a4), i8;
    }(e7, t5, o6, f3);
    return r6.length || u5(e7, f3), { e: p4, get c() {
      var t6 = [];
      return r6.length && [u5(applyDec(e7, [r6], n5, e7.name, 5, f3, t6), f3), c5.bind(null, t6, e7)];
    } };
  }
  function _toPropertyKey$5(t5) {
    var i7 = _toPrimitive$5(t5, "string");
    return "symbol" == _typeof(i7) ? i7 : i7 + "";
  }
  function _toPrimitive$5(t5, r6) {
    if ("object" != _typeof(t5) || !t5) return t5;
    var e7 = t5[Symbol.toPrimitive];
    if (void 0 !== e7) {
      var i7 = e7.call(t5, r6 || "default");
      if ("object" != _typeof(i7)) return i7;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r6 ? String : Number)(t5);
  }
  function _setFunctionName$5(e7, t5, n5) {
    "symbol" == _typeof(t5) && (t5 = (t5 = t5.description) ? "[" + t5 + "]" : "");
    try {
      Object.defineProperty(e7, "name", { configurable: true, value: n5 ? n5 + " " + t5 : t5 });
    } catch (e8) {
    }
    return e7;
  }
  function _checkInRHS$5(e7) {
    if (Object(e7) !== e7) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e7 ? _typeof(e7) : "null"));
    return e7;
  }
  function setup$2(props) {
    var delay = typeof (props === null || props === void 0 ? void 0 : props.delay) === "undefined" ? 1e3 : props.delay;
    return {
      update: function update(context) {
        if (context.data.type === "contextmenu") {
          return {
            items: context.data.items,
            delay,
            searchBar: context.data.searchBar,
            onHide: context.data.onHide
          };
        }
      },
      render: function render(context) {
        if (context.data.type === "contextmenu") {
          return b2(_templateObject$7 || (_templateObject$7 = _taggedTemplateLiteral(['\n            <rete-context-menu\n                .items="', '"\n                .delay="', '"\n                .searchBar="', '"\n                .onHide="', '"\n            ></rete-context-menu>\n        '])), context.data.items, delay, context.data.searchBar, context.data.onHide);
        }
      }
    };
  }
  function px(value) {
    return "".concat(value, "px");
  }
  function styleMap(styles) {
    return Object.entries(styles).map(function(_ref2) {
      var _ref22 = _slicedToArray(_ref2, 2), key = _ref22[0], value = _ref22[1];
      return "".concat(key, ": ").concat(value);
    }).join("; ");
  }
  function _callSuper$5(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$5() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$5() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$5 = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _classPrivateFieldInitSpec$4(e7, t5, a3) {
    _checkPrivateRedeclaration$4(e7, t5), t5.set(e7, a3);
  }
  function _checkPrivateRedeclaration$4(e7, t5) {
    if (t5.has(e7)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classPrivateFieldSet$4(s5, a3, r6) {
    return s5.set(_assertClassBrand$4(s5, a3), r6), r6;
  }
  function _classPrivateFieldGet$4(s5, a3) {
    return s5.get(_assertClassBrand$4(s5, a3));
  }
  function _assertClassBrand$4(e7, t5, n5) {
    if ("function" == typeof e7 ? e7 === t5 : e7.has(t5)) return arguments.length < 3 ? t5 : n5;
    throw new TypeError("Private element is not present on this object");
  }
  function _applyDecs$4(e7, t5, r6, n5, o6, a3) {
    function i7(e8, t6, r7) {
      return function(n6, o7) {
        return r7 && r7(n6), e8[t6].call(n6, o7);
      };
    }
    function c5(e8, t6) {
      for (var r7 = 0; r7 < e8.length; r7++) e8[r7].call(t6);
      return t6;
    }
    function s5(e8, t6, r7, n6) {
      if ("function" != typeof e8 && (n6 || void 0 !== e8)) throw new TypeError(t6 + " must " + (r7 || "be") + " a function" + (n6 ? "" : " or undefined"));
      return e8;
    }
    function applyDec(e8, t6, r7, n6, o7, a4, c6, u6, l4, f4, p5, d3, h4) {
      function m3(e9) {
        if (!h4(e9)) throw new TypeError("Attempted to access private element on non-instance");
      }
      var y3, v3 = t6[0], g2 = t6[3], b3 = !u6;
      if (!b3) {
        r7 || Array.isArray(v3) || (v3 = [v3]);
        var w2 = {}, S3 = [], A2 = 3 === o7 ? "get" : 4 === o7 || d3 ? "set" : "value";
        f4 ? (p5 || d3 ? w2 = { get: _setFunctionName$4(function() {
          return g2(this);
        }, n6, "get"), set: function set(e9) {
          t6[4](this, e9);
        } } : w2[A2] = g2, p5 || _setFunctionName$4(w2[A2], n6, 2 === o7 ? "" : A2)) : p5 || (w2 = Object.getOwnPropertyDescriptor(e8, n6));
      }
      for (var P2 = e8, j2 = v3.length - 1; j2 >= 0; j2 -= r7 ? 2 : 1) {
        var D2 = v3[j2], E2 = r7 ? v3[j2 - 1] : void 0, I2 = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o7], name: n6, metadata: a4, addInitializer: function(e9, t7) {
          if (e9.v) throw Error("attempted to call addInitializer after decoration was finished");
          s5(t7, "An initializer", "be", true), c6.push(t7);
        }.bind(null, I2) };
        try {
          if (b3) (y3 = s5(D2.call(E2, P2, O), "class decorators", "return")) && (P2 = y3);
          else {
            var k2, F;
            O["static"] = l4, O["private"] = f4, f4 ? 2 === o7 ? k2 = function k3(e9) {
              return m3(e9), w2.value;
            } : (o7 < 4 && (k2 = i7(w2, "get", m3)), 3 !== o7 && (F = i7(w2, "set", m3))) : (k2 = function k3(e9) {
              return e9[n6];
            }, (o7 < 2 || 4 === o7) && (F = function F2(e9, t7) {
              e9[n6] = t7;
            }));
            var N2 = O.access = { has: f4 ? h4.bind() : function(e9) {
              return n6 in e9;
            } };
            if (k2 && (N2.get = k2), F && (N2.set = F), P2 = D2.call(E2, d3 ? { get: w2.get, set: w2.set } : w2[A2], O), d3) {
              if ("object" == _typeof(P2) && P2) (y3 = s5(P2.get, "accessor.get")) && (w2.get = y3), (y3 = s5(P2.set, "accessor.set")) && (w2.set = y3), (y3 = s5(P2.init, "accessor.init")) && S3.push(y3);
              else if (void 0 !== P2) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            } else s5(P2, (p5 ? "field" : "method") + " decorators", "return") && (p5 ? S3.push(P2) : w2[A2] = P2);
          }
        } finally {
          I2.v = true;
        }
      }
      return (p5 || d3) && u6.push(function(e9, t7) {
        for (var r8 = S3.length - 1; r8 >= 0; r8--) t7 = S3[r8].call(e9, t7);
        return t7;
      }), p5 || b3 || (f4 ? d3 ? u6.push(i7(w2, "get"), i7(w2, "set")) : u6.push(2 === o7 ? w2[A2] : i7.call.bind(w2[A2])) : Object.defineProperty(e8, n6, w2)), P2;
    }
    function u5(e8, t6) {
      return Object.defineProperty(e8, Symbol.metadata || Symbol["for"]("Symbol.metadata"), { configurable: true, enumerable: true, value: t6 });
    }
    if (arguments.length >= 6) var l3 = a3[Symbol.metadata || Symbol["for"]("Symbol.metadata")];
    var f3 = Object.create(null == l3 ? null : l3), p4 = function(e8, t6, r7, n6) {
      var o7, a4, i8 = [], s6 = function s7(t7) {
        return _checkInRHS$4(t7) === e8;
      }, u6 = /* @__PURE__ */ new Map();
      function l4(e9) {
        e9 && i8.push(c5.bind(null, e9));
      }
      for (var f4 = 0; f4 < t6.length; f4++) {
        var p5 = t6[f4];
        if (Array.isArray(p5)) {
          var d3 = p5[1], h4 = p5[2], m3 = p5.length > 3, y3 = 16 & d3, v3 = !!(8 & d3), g2 = 0 == (d3 &= 7), b3 = h4 + "/" + v3;
          if (!g2 && !m3) {
            var w2 = u6.get(b3);
            if (true === w2 || 3 === w2 && 4 !== d3 || 4 === w2 && 3 !== d3) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h4);
            u6.set(b3, !(d3 > 2) || d3);
          }
          applyDec(v3 ? e8 : e8.prototype, p5, y3, m3 ? "#" + h4 : _toPropertyKey$4(h4), d3, n6, v3 ? a4 = a4 || [] : o7 = o7 || [], i8, v3, m3, g2, 1 === d3, v3 && m3 ? s6 : r7);
        }
      }
      return l4(o7), l4(a4), i8;
    }(e7, t5, o6, f3);
    return r6.length || u5(e7, f3), { e: p4, get c() {
      var t6 = [];
      return r6.length && [u5(applyDec(e7, [r6], n5, e7.name, 5, f3, t6), f3), c5.bind(null, t6, e7)];
    } };
  }
  function _toPropertyKey$4(t5) {
    var i7 = _toPrimitive$4(t5, "string");
    return "symbol" == _typeof(i7) ? i7 : i7 + "";
  }
  function _toPrimitive$4(t5, r6) {
    if ("object" != _typeof(t5) || !t5) return t5;
    var e7 = t5[Symbol.toPrimitive];
    if (void 0 !== e7) {
      var i7 = e7.call(t5, r6 || "default");
      if ("object" != _typeof(i7)) return i7;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r6 ? String : Number)(t5);
  }
  function _setFunctionName$4(e7, t5, n5) {
    "symbol" == _typeof(t5) && (t5 = (t5 = t5.description) ? "[" + t5 + "]" : "");
    try {
      Object.defineProperty(e7, "name", { configurable: true, value: n5 ? n5 + " " + t5 : t5 });
    } catch (e8) {
    }
    return e7;
  }
  function _checkInRHS$4(e7) {
    if (Object(e7) !== e7) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e7 ? _typeof(e7) : "null"));
    return e7;
  }
  function ownKeys$12(e7, r6) {
    var t5 = Object.keys(e7);
    if (Object.getOwnPropertySymbols) {
      var o6 = Object.getOwnPropertySymbols(e7);
      r6 && (o6 = o6.filter(function(r7) {
        return Object.getOwnPropertyDescriptor(e7, r7).enumerable;
      })), t5.push.apply(t5, o6);
    }
    return t5;
  }
  function _objectSpread$12(e7) {
    for (var r6 = 1; r6 < arguments.length; r6++) {
      var t5 = null != arguments[r6] ? arguments[r6] : {};
      r6 % 2 ? ownKeys$12(Object(t5), true).forEach(function(r7) {
        _defineProperty(e7, r7, t5[r7]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e7, Object.getOwnPropertyDescriptors(t5)) : ownKeys$12(Object(t5)).forEach(function(r7) {
        Object.defineProperty(e7, r7, Object.getOwnPropertyDescriptor(t5, r7));
      });
    }
    return e7;
  }
  function useDrag(translate, getPointer) {
    var getCurrentPointer = function getCurrentPointer2(e7) {
      var pointer = getPointer(e7);
      return pointer ? _objectSpread$12({}, pointer) : null;
    };
    return {
      start: function start(e7) {
        var previous = getCurrentPointer(e7);
        function move(moveEvent) {
          var current = getCurrentPointer(moveEvent);
          if (current && previous) {
            var _dx = current.x - previous.x;
            var _dy = current.y - previous.y;
            translate(_dx, _dy);
          }
          previous = current;
        }
        function up() {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
          window.removeEventListener("pointercancel", up);
        }
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", up);
      }
    };
  }
  function _callSuper$4(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$4() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$4() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$4 = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _classPrivateFieldInitSpec$3(e7, t5, a3) {
    _checkPrivateRedeclaration$3(e7, t5), t5.set(e7, a3);
  }
  function _checkPrivateRedeclaration$3(e7, t5) {
    if (t5.has(e7)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classPrivateFieldSet$3(s5, a3, r6) {
    return s5.set(_assertClassBrand$3(s5, a3), r6), r6;
  }
  function _classPrivateFieldGet$3(s5, a3) {
    return s5.get(_assertClassBrand$3(s5, a3));
  }
  function _assertClassBrand$3(e7, t5, n5) {
    if ("function" == typeof e7 ? e7 === t5 : e7.has(t5)) return arguments.length < 3 ? t5 : n5;
    throw new TypeError("Private element is not present on this object");
  }
  function _applyDecs$3(e7, t5, r6, n5, o6, a3) {
    function i7(e8, t6, r7) {
      return function(n6, o7) {
        return r7 && r7(n6), e8[t6].call(n6, o7);
      };
    }
    function c5(e8, t6) {
      for (var r7 = 0; r7 < e8.length; r7++) e8[r7].call(t6);
      return t6;
    }
    function s5(e8, t6, r7, n6) {
      if ("function" != typeof e8 && (n6 || void 0 !== e8)) throw new TypeError(t6 + " must " + (r7 || "be") + " a function" + (n6 ? "" : " or undefined"));
      return e8;
    }
    function applyDec(e8, t6, r7, n6, o7, a4, c6, u6, l4, f4, p5, d3, h4) {
      function m3(e9) {
        if (!h4(e9)) throw new TypeError("Attempted to access private element on non-instance");
      }
      var y3, v3 = t6[0], g2 = t6[3], b3 = !u6;
      if (!b3) {
        r7 || Array.isArray(v3) || (v3 = [v3]);
        var w2 = {}, S3 = [], A2 = 3 === o7 ? "get" : 4 === o7 || d3 ? "set" : "value";
        f4 ? (p5 || d3 ? w2 = { get: _setFunctionName$3(function() {
          return g2(this);
        }, n6, "get"), set: function set(e9) {
          t6[4](this, e9);
        } } : w2[A2] = g2, p5 || _setFunctionName$3(w2[A2], n6, 2 === o7 ? "" : A2)) : p5 || (w2 = Object.getOwnPropertyDescriptor(e8, n6));
      }
      for (var P2 = e8, j2 = v3.length - 1; j2 >= 0; j2 -= r7 ? 2 : 1) {
        var D2 = v3[j2], E2 = r7 ? v3[j2 - 1] : void 0, I2 = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o7], name: n6, metadata: a4, addInitializer: function(e9, t7) {
          if (e9.v) throw Error("attempted to call addInitializer after decoration was finished");
          s5(t7, "An initializer", "be", true), c6.push(t7);
        }.bind(null, I2) };
        try {
          if (b3) (y3 = s5(D2.call(E2, P2, O), "class decorators", "return")) && (P2 = y3);
          else {
            var k2, F;
            O["static"] = l4, O["private"] = f4, f4 ? 2 === o7 ? k2 = function k3(e9) {
              return m3(e9), w2.value;
            } : (o7 < 4 && (k2 = i7(w2, "get", m3)), 3 !== o7 && (F = i7(w2, "set", m3))) : (k2 = function k3(e9) {
              return e9[n6];
            }, (o7 < 2 || 4 === o7) && (F = function F2(e9, t7) {
              e9[n6] = t7;
            }));
            var N2 = O.access = { has: f4 ? h4.bind() : function(e9) {
              return n6 in e9;
            } };
            if (k2 && (N2.get = k2), F && (N2.set = F), P2 = D2.call(E2, d3 ? { get: w2.get, set: w2.set } : w2[A2], O), d3) {
              if ("object" == _typeof(P2) && P2) (y3 = s5(P2.get, "accessor.get")) && (w2.get = y3), (y3 = s5(P2.set, "accessor.set")) && (w2.set = y3), (y3 = s5(P2.init, "accessor.init")) && S3.push(y3);
              else if (void 0 !== P2) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            } else s5(P2, (p5 ? "field" : "method") + " decorators", "return") && (p5 ? S3.push(P2) : w2[A2] = P2);
          }
        } finally {
          I2.v = true;
        }
      }
      return (p5 || d3) && u6.push(function(e9, t7) {
        for (var r8 = S3.length - 1; r8 >= 0; r8--) t7 = S3[r8].call(e9, t7);
        return t7;
      }), p5 || b3 || (f4 ? d3 ? u6.push(i7(w2, "get"), i7(w2, "set")) : u6.push(2 === o7 ? w2[A2] : i7.call.bind(w2[A2])) : Object.defineProperty(e8, n6, w2)), P2;
    }
    function u5(e8, t6) {
      return Object.defineProperty(e8, Symbol.metadata || Symbol["for"]("Symbol.metadata"), { configurable: true, enumerable: true, value: t6 });
    }
    if (arguments.length >= 6) var l3 = a3[Symbol.metadata || Symbol["for"]("Symbol.metadata")];
    var f3 = Object.create(null == l3 ? null : l3), p4 = function(e8, t6, r7, n6) {
      var o7, a4, i8 = [], s6 = function s7(t7) {
        return _checkInRHS$3(t7) === e8;
      }, u6 = /* @__PURE__ */ new Map();
      function l4(e9) {
        e9 && i8.push(c5.bind(null, e9));
      }
      for (var f4 = 0; f4 < t6.length; f4++) {
        var p5 = t6[f4];
        if (Array.isArray(p5)) {
          var d3 = p5[1], h4 = p5[2], m3 = p5.length > 3, y3 = 16 & d3, v3 = !!(8 & d3), g2 = 0 == (d3 &= 7), b3 = h4 + "/" + v3;
          if (!g2 && !m3) {
            var w2 = u6.get(b3);
            if (true === w2 || 3 === w2 && 4 !== d3 || 4 === w2 && 3 !== d3) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h4);
            u6.set(b3, !(d3 > 2) || d3);
          }
          applyDec(v3 ? e8 : e8.prototype, p5, y3, m3 ? "#" + h4 : _toPropertyKey$3(h4), d3, n6, v3 ? a4 = a4 || [] : o7 = o7 || [], i8, v3, m3, g2, 1 === d3, v3 && m3 ? s6 : r7);
        }
      }
      return l4(o7), l4(a4), i8;
    }(e7, t5, o6, f3);
    return r6.length || u5(e7, f3), { e: p4, get c() {
      var t6 = [];
      return r6.length && [u5(applyDec(e7, [r6], n5, e7.name, 5, f3, t6), f3), c5.bind(null, t6, e7)];
    } };
  }
  function _toPropertyKey$3(t5) {
    var i7 = _toPrimitive$3(t5, "string");
    return "symbol" == _typeof(i7) ? i7 : i7 + "";
  }
  function _toPrimitive$3(t5, r6) {
    if ("object" != _typeof(t5) || !t5) return t5;
    var e7 = t5[Symbol.toPrimitive];
    if (void 0 !== e7) {
      var i7 = e7.call(t5, r6 || "default");
      if ("object" != _typeof(i7)) return i7;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r6 ? String : Number)(t5);
  }
  function _setFunctionName$3(e7, t5, n5) {
    "symbol" == _typeof(t5) && (t5 = (t5 = t5.description) ? "[" + t5 + "]" : "");
    try {
      Object.defineProperty(e7, "name", { configurable: true, value: n5 ? n5 + " " + t5 : t5 });
    } catch (e8) {
    }
    return e7;
  }
  function _checkInRHS$3(e7) {
    if (Object(e7) !== e7) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e7 ? _typeof(e7) : "null"));
    return e7;
  }
  function _callSuper$3(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$3() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$3() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$3 = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _classPrivateFieldInitSpec$2(e7, t5, a3) {
    _checkPrivateRedeclaration$2(e7, t5), t5.set(e7, a3);
  }
  function _checkPrivateRedeclaration$2(e7, t5) {
    if (t5.has(e7)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classPrivateFieldSet$2(s5, a3, r6) {
    return s5.set(_assertClassBrand$2(s5, a3), r6), r6;
  }
  function _classPrivateFieldGet$2(s5, a3) {
    return s5.get(_assertClassBrand$2(s5, a3));
  }
  function _assertClassBrand$2(e7, t5, n5) {
    if ("function" == typeof e7 ? e7 === t5 : e7.has(t5)) return arguments.length < 3 ? t5 : n5;
    throw new TypeError("Private element is not present on this object");
  }
  function _applyDecs$2(e7, t5, r6, n5, o6, a3) {
    function i7(e8, t6, r7) {
      return function(n6, o7) {
        return r7 && r7(n6), e8[t6].call(n6, o7);
      };
    }
    function c5(e8, t6) {
      for (var r7 = 0; r7 < e8.length; r7++) e8[r7].call(t6);
      return t6;
    }
    function s5(e8, t6, r7, n6) {
      if ("function" != typeof e8 && (n6 || void 0 !== e8)) throw new TypeError(t6 + " must " + (r7 || "be") + " a function" + (n6 ? "" : " or undefined"));
      return e8;
    }
    function applyDec(e8, t6, r7, n6, o7, a4, c6, u6, l4, f4, p5, d3, h4) {
      function m3(e9) {
        if (!h4(e9)) throw new TypeError("Attempted to access private element on non-instance");
      }
      var y3, v3 = t6[0], g2 = t6[3], b3 = !u6;
      if (!b3) {
        r7 || Array.isArray(v3) || (v3 = [v3]);
        var w2 = {}, S3 = [], A2 = 3 === o7 ? "get" : 4 === o7 || d3 ? "set" : "value";
        f4 ? (p5 || d3 ? w2 = { get: _setFunctionName$2(function() {
          return g2(this);
        }, n6, "get"), set: function set(e9) {
          t6[4](this, e9);
        } } : w2[A2] = g2, p5 || _setFunctionName$2(w2[A2], n6, 2 === o7 ? "" : A2)) : p5 || (w2 = Object.getOwnPropertyDescriptor(e8, n6));
      }
      for (var P2 = e8, j2 = v3.length - 1; j2 >= 0; j2 -= r7 ? 2 : 1) {
        var D2 = v3[j2], E2 = r7 ? v3[j2 - 1] : void 0, I2 = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o7], name: n6, metadata: a4, addInitializer: function(e9, t7) {
          if (e9.v) throw Error("attempted to call addInitializer after decoration was finished");
          s5(t7, "An initializer", "be", true), c6.push(t7);
        }.bind(null, I2) };
        try {
          if (b3) (y3 = s5(D2.call(E2, P2, O), "class decorators", "return")) && (P2 = y3);
          else {
            var k2, F;
            O["static"] = l4, O["private"] = f4, f4 ? 2 === o7 ? k2 = function k3(e9) {
              return m3(e9), w2.value;
            } : (o7 < 4 && (k2 = i7(w2, "get", m3)), 3 !== o7 && (F = i7(w2, "set", m3))) : (k2 = function k3(e9) {
              return e9[n6];
            }, (o7 < 2 || 4 === o7) && (F = function F2(e9, t7) {
              e9[n6] = t7;
            }));
            var N2 = O.access = { has: f4 ? h4.bind() : function(e9) {
              return n6 in e9;
            } };
            if (k2 && (N2.get = k2), F && (N2.set = F), P2 = D2.call(E2, d3 ? { get: w2.get, set: w2.set } : w2[A2], O), d3) {
              if ("object" == _typeof(P2) && P2) (y3 = s5(P2.get, "accessor.get")) && (w2.get = y3), (y3 = s5(P2.set, "accessor.set")) && (w2.set = y3), (y3 = s5(P2.init, "accessor.init")) && S3.push(y3);
              else if (void 0 !== P2) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            } else s5(P2, (p5 ? "field" : "method") + " decorators", "return") && (p5 ? S3.push(P2) : w2[A2] = P2);
          }
        } finally {
          I2.v = true;
        }
      }
      return (p5 || d3) && u6.push(function(e9, t7) {
        for (var r8 = S3.length - 1; r8 >= 0; r8--) t7 = S3[r8].call(e9, t7);
        return t7;
      }), p5 || b3 || (f4 ? d3 ? u6.push(i7(w2, "get"), i7(w2, "set")) : u6.push(2 === o7 ? w2[A2] : i7.call.bind(w2[A2])) : Object.defineProperty(e8, n6, w2)), P2;
    }
    function u5(e8, t6) {
      return Object.defineProperty(e8, Symbol.metadata || Symbol["for"]("Symbol.metadata"), { configurable: true, enumerable: true, value: t6 });
    }
    if (arguments.length >= 6) var l3 = a3[Symbol.metadata || Symbol["for"]("Symbol.metadata")];
    var f3 = Object.create(null == l3 ? null : l3), p4 = function(e8, t6, r7, n6) {
      var o7, a4, i8 = [], s6 = function s7(t7) {
        return _checkInRHS$2(t7) === e8;
      }, u6 = /* @__PURE__ */ new Map();
      function l4(e9) {
        e9 && i8.push(c5.bind(null, e9));
      }
      for (var f4 = 0; f4 < t6.length; f4++) {
        var p5 = t6[f4];
        if (Array.isArray(p5)) {
          var d3 = p5[1], h4 = p5[2], m3 = p5.length > 3, y3 = 16 & d3, v3 = !!(8 & d3), g2 = 0 == (d3 &= 7), b3 = h4 + "/" + v3;
          if (!g2 && !m3) {
            var w2 = u6.get(b3);
            if (true === w2 || 3 === w2 && 4 !== d3 || 4 === w2 && 3 !== d3) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h4);
            u6.set(b3, !(d3 > 2) || d3);
          }
          applyDec(v3 ? e8 : e8.prototype, p5, y3, m3 ? "#" + h4 : _toPropertyKey$2(h4), d3, n6, v3 ? a4 = a4 || [] : o7 = o7 || [], i8, v3, m3, g2, 1 === d3, v3 && m3 ? s6 : r7);
        }
      }
      return l4(o7), l4(a4), i8;
    }(e7, t5, o6, f3);
    return r6.length || u5(e7, f3), { e: p4, get c() {
      var t6 = [];
      return r6.length && [u5(applyDec(e7, [r6], n5, e7.name, 5, f3, t6), f3), c5.bind(null, t6, e7)];
    } };
  }
  function _toPropertyKey$2(t5) {
    var i7 = _toPrimitive$2(t5, "string");
    return "symbol" == _typeof(i7) ? i7 : i7 + "";
  }
  function _toPrimitive$2(t5, r6) {
    if ("object" != _typeof(t5) || !t5) return t5;
    var e7 = t5[Symbol.toPrimitive];
    if (void 0 !== e7) {
      var i7 = e7.call(t5, r6 || "default");
      if ("object" != _typeof(i7)) return i7;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r6 ? String : Number)(t5);
  }
  function _setFunctionName$2(e7, t5, n5) {
    "symbol" == _typeof(t5) && (t5 = (t5 = t5.description) ? "[" + t5 + "]" : "");
    try {
      Object.defineProperty(e7, "name", { configurable: true, value: n5 ? n5 + " " + t5 : t5 });
    } catch (e8) {
    }
    return e7;
  }
  function _checkInRHS$2(e7) {
    if (Object(e7) !== e7) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e7 ? _typeof(e7) : "null"));
    return e7;
  }
  function setup$1(props) {
    return {
      update: function update(context) {
        if (context.data.type === "minimap") {
          return {
            nodes: context.data.nodes,
            size: (props === null || props === void 0 ? void 0 : props.size) || 200,
            ratio: context.data.ratio,
            viewport: context.data.viewport,
            onTranslate: context.data.translate,
            point: context.data.point
          };
        }
      },
      render: function render(context) {
        if (context.data.type === "minimap") {
          return b2(_templateObject$3 || (_templateObject$3 = _taggedTemplateLiteral(['\n        <rete-minimap\n            .nodes="', '"\n            .size="', '"\n            .ratio="', '"\n            .viewport="', '"\n            .onTranslate="', '"\n            .point="', '"\n        ></rete-minimap>\n        '])), context.data.nodes, (props === null || props === void 0 ? void 0 : props.size) || 200, context.data.ratio, context.data.viewport, context.data.translate, context.data.point);
        }
      }
    };
  }
  function _callSuper$2(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$2() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$2() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$2 = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _superPropGet$1(t5, e7, o6, r6) {
    var p4 = _get(_getPrototypeOf(1 & r6 ? t5.prototype : t5), e7, o6);
    return 2 & r6 && "function" == typeof p4 ? function(t6) {
      return p4.apply(o6, t6);
    } : p4;
  }
  function _classPrivateFieldInitSpec$1(e7, t5, a3) {
    _checkPrivateRedeclaration$1(e7, t5), t5.set(e7, a3);
  }
  function _checkPrivateRedeclaration$1(e7, t5) {
    if (t5.has(e7)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classPrivateFieldSet$1(s5, a3, r6) {
    return s5.set(_assertClassBrand$1(s5, a3), r6), r6;
  }
  function _classPrivateFieldGet$1(s5, a3) {
    return s5.get(_assertClassBrand$1(s5, a3));
  }
  function _assertClassBrand$1(e7, t5, n5) {
    if ("function" == typeof e7 ? e7 === t5 : e7.has(t5)) return arguments.length < 3 ? t5 : n5;
    throw new TypeError("Private element is not present on this object");
  }
  function _applyDecs$1(e7, t5, r6, n5, o6, a3) {
    function i7(e8, t6, r7) {
      return function(n6, o7) {
        return r7 && r7(n6), e8[t6].call(n6, o7);
      };
    }
    function c5(e8, t6) {
      for (var r7 = 0; r7 < e8.length; r7++) e8[r7].call(t6);
      return t6;
    }
    function s5(e8, t6, r7, n6) {
      if ("function" != typeof e8 && (n6 || void 0 !== e8)) throw new TypeError(t6 + " must " + (r7 || "be") + " a function" + (n6 ? "" : " or undefined"));
      return e8;
    }
    function applyDec(e8, t6, r7, n6, o7, a4, c6, u6, l4, f4, p5, d3, h4) {
      function m3(e9) {
        if (!h4(e9)) throw new TypeError("Attempted to access private element on non-instance");
      }
      var y3, v3 = t6[0], g2 = t6[3], b3 = !u6;
      if (!b3) {
        r7 || Array.isArray(v3) || (v3 = [v3]);
        var w2 = {}, S3 = [], A2 = 3 === o7 ? "get" : 4 === o7 || d3 ? "set" : "value";
        f4 ? (p5 || d3 ? w2 = { get: _setFunctionName$1(function() {
          return g2(this);
        }, n6, "get"), set: function set(e9) {
          t6[4](this, e9);
        } } : w2[A2] = g2, p5 || _setFunctionName$1(w2[A2], n6, 2 === o7 ? "" : A2)) : p5 || (w2 = Object.getOwnPropertyDescriptor(e8, n6));
      }
      for (var P2 = e8, j2 = v3.length - 1; j2 >= 0; j2 -= r7 ? 2 : 1) {
        var D2 = v3[j2], E2 = r7 ? v3[j2 - 1] : void 0, I2 = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o7], name: n6, metadata: a4, addInitializer: function(e9, t7) {
          if (e9.v) throw Error("attempted to call addInitializer after decoration was finished");
          s5(t7, "An initializer", "be", true), c6.push(t7);
        }.bind(null, I2) };
        try {
          if (b3) (y3 = s5(D2.call(E2, P2, O), "class decorators", "return")) && (P2 = y3);
          else {
            var k2, F;
            O["static"] = l4, O["private"] = f4, f4 ? 2 === o7 ? k2 = function k3(e9) {
              return m3(e9), w2.value;
            } : (o7 < 4 && (k2 = i7(w2, "get", m3)), 3 !== o7 && (F = i7(w2, "set", m3))) : (k2 = function k3(e9) {
              return e9[n6];
            }, (o7 < 2 || 4 === o7) && (F = function F2(e9, t7) {
              e9[n6] = t7;
            }));
            var N2 = O.access = { has: f4 ? h4.bind() : function(e9) {
              return n6 in e9;
            } };
            if (k2 && (N2.get = k2), F && (N2.set = F), P2 = D2.call(E2, d3 ? { get: w2.get, set: w2.set } : w2[A2], O), d3) {
              if ("object" == _typeof(P2) && P2) (y3 = s5(P2.get, "accessor.get")) && (w2.get = y3), (y3 = s5(P2.set, "accessor.set")) && (w2.set = y3), (y3 = s5(P2.init, "accessor.init")) && S3.push(y3);
              else if (void 0 !== P2) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            } else s5(P2, (p5 ? "field" : "method") + " decorators", "return") && (p5 ? S3.push(P2) : w2[A2] = P2);
          }
        } finally {
          I2.v = true;
        }
      }
      return (p5 || d3) && u6.push(function(e9, t7) {
        for (var r8 = S3.length - 1; r8 >= 0; r8--) t7 = S3[r8].call(e9, t7);
        return t7;
      }), p5 || b3 || (f4 ? d3 ? u6.push(i7(w2, "get"), i7(w2, "set")) : u6.push(2 === o7 ? w2[A2] : i7.call.bind(w2[A2])) : Object.defineProperty(e8, n6, w2)), P2;
    }
    function u5(e8, t6) {
      return Object.defineProperty(e8, Symbol.metadata || Symbol["for"]("Symbol.metadata"), { configurable: true, enumerable: true, value: t6 });
    }
    if (arguments.length >= 6) var l3 = a3[Symbol.metadata || Symbol["for"]("Symbol.metadata")];
    var f3 = Object.create(null == l3 ? null : l3), p4 = function(e8, t6, r7, n6) {
      var o7, a4, i8 = [], s6 = function s7(t7) {
        return _checkInRHS$1(t7) === e8;
      }, u6 = /* @__PURE__ */ new Map();
      function l4(e9) {
        e9 && i8.push(c5.bind(null, e9));
      }
      for (var f4 = 0; f4 < t6.length; f4++) {
        var p5 = t6[f4];
        if (Array.isArray(p5)) {
          var d3 = p5[1], h4 = p5[2], m3 = p5.length > 3, y3 = 16 & d3, v3 = !!(8 & d3), g2 = 0 == (d3 &= 7), b3 = h4 + "/" + v3;
          if (!g2 && !m3) {
            var w2 = u6.get(b3);
            if (true === w2 || 3 === w2 && 4 !== d3 || 4 === w2 && 3 !== d3) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h4);
            u6.set(b3, !(d3 > 2) || d3);
          }
          applyDec(v3 ? e8 : e8.prototype, p5, y3, m3 ? "#" + h4 : _toPropertyKey$1(h4), d3, n6, v3 ? a4 = a4 || [] : o7 = o7 || [], i8, v3, m3, g2, 1 === d3, v3 && m3 ? s6 : r7);
        }
      }
      return l4(o7), l4(a4), i8;
    }(e7, t5, o6, f3);
    return r6.length || u5(e7, f3), { e: p4, get c() {
      var t6 = [];
      return r6.length && [u5(applyDec(e7, [r6], n5, e7.name, 5, f3, t6), f3), c5.bind(null, t6, e7)];
    } };
  }
  function _toPropertyKey$1(t5) {
    var i7 = _toPrimitive$1(t5, "string");
    return "symbol" == _typeof(i7) ? i7 : i7 + "";
  }
  function _toPrimitive$1(t5, r6) {
    if ("object" != _typeof(t5) || !t5) return t5;
    var e7 = t5[Symbol.toPrimitive];
    if (void 0 !== e7) {
      var i7 = e7.call(t5, r6 || "default");
      if ("object" != _typeof(i7)) return i7;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r6 ? String : Number)(t5);
  }
  function _setFunctionName$1(e7, t5, n5) {
    "symbol" == _typeof(t5) && (t5 = (t5 = t5.description) ? "[" + t5 + "]" : "");
    try {
      Object.defineProperty(e7, "name", { configurable: true, value: n5 ? n5 + " " + t5 : t5 });
    } catch (e8) {
    }
    return e7;
  }
  function _checkInRHS$1(e7) {
    if (Object(e7) !== e7) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e7 ? _typeof(e7) : "null"));
    return e7;
  }
  function _callSuper$14(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct$14() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct$14() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct$14 = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _classPrivateFieldInitSpec(e7, t5, a3) {
    _checkPrivateRedeclaration(e7, t5), t5.set(e7, a3);
  }
  function _checkPrivateRedeclaration(e7, t5) {
    if (t5.has(e7)) throw new TypeError("Cannot initialize the same private elements twice on an object");
  }
  function _classPrivateFieldSet(s5, a3, r6) {
    return s5.set(_assertClassBrand(s5, a3), r6), r6;
  }
  function _classPrivateFieldGet(s5, a3) {
    return s5.get(_assertClassBrand(s5, a3));
  }
  function _assertClassBrand(e7, t5, n5) {
    if ("function" == typeof e7 ? e7 === t5 : e7.has(t5)) return arguments.length < 3 ? t5 : n5;
    throw new TypeError("Private element is not present on this object");
  }
  function _applyDecs(e7, t5, r6, n5, o6, a3) {
    function i7(e8, t6, r7) {
      return function(n6, o7) {
        return r7 && r7(n6), e8[t6].call(n6, o7);
      };
    }
    function c5(e8, t6) {
      for (var r7 = 0; r7 < e8.length; r7++) e8[r7].call(t6);
      return t6;
    }
    function s5(e8, t6, r7, n6) {
      if ("function" != typeof e8 && (n6 || void 0 !== e8)) throw new TypeError(t6 + " must " + (r7 || "be") + " a function" + (n6 ? "" : " or undefined"));
      return e8;
    }
    function applyDec(e8, t6, r7, n6, o7, a4, c6, u6, l4, f4, p5, d3, h4) {
      function m3(e9) {
        if (!h4(e9)) throw new TypeError("Attempted to access private element on non-instance");
      }
      var y3, v3 = t6[0], g2 = t6[3], b3 = !u6;
      if (!b3) {
        r7 || Array.isArray(v3) || (v3 = [v3]);
        var w2 = {}, S3 = [], A2 = 3 === o7 ? "get" : 4 === o7 || d3 ? "set" : "value";
        f4 ? (p5 || d3 ? w2 = { get: _setFunctionName(function() {
          return g2(this);
        }, n6, "get"), set: function set(e9) {
          t6[4](this, e9);
        } } : w2[A2] = g2, p5 || _setFunctionName(w2[A2], n6, 2 === o7 ? "" : A2)) : p5 || (w2 = Object.getOwnPropertyDescriptor(e8, n6));
      }
      for (var P2 = e8, j2 = v3.length - 1; j2 >= 0; j2 -= r7 ? 2 : 1) {
        var D2 = v3[j2], E2 = r7 ? v3[j2 - 1] : void 0, I2 = {}, O = { kind: ["field", "accessor", "method", "getter", "setter", "class"][o7], name: n6, metadata: a4, addInitializer: function(e9, t7) {
          if (e9.v) throw Error("attempted to call addInitializer after decoration was finished");
          s5(t7, "An initializer", "be", true), c6.push(t7);
        }.bind(null, I2) };
        try {
          if (b3) (y3 = s5(D2.call(E2, P2, O), "class decorators", "return")) && (P2 = y3);
          else {
            var k2, F;
            O["static"] = l4, O["private"] = f4, f4 ? 2 === o7 ? k2 = function k3(e9) {
              return m3(e9), w2.value;
            } : (o7 < 4 && (k2 = i7(w2, "get", m3)), 3 !== o7 && (F = i7(w2, "set", m3))) : (k2 = function k3(e9) {
              return e9[n6];
            }, (o7 < 2 || 4 === o7) && (F = function F2(e9, t7) {
              e9[n6] = t7;
            }));
            var N2 = O.access = { has: f4 ? h4.bind() : function(e9) {
              return n6 in e9;
            } };
            if (k2 && (N2.get = k2), F && (N2.set = F), P2 = D2.call(E2, d3 ? { get: w2.get, set: w2.set } : w2[A2], O), d3) {
              if ("object" == _typeof(P2) && P2) (y3 = s5(P2.get, "accessor.get")) && (w2.get = y3), (y3 = s5(P2.set, "accessor.set")) && (w2.set = y3), (y3 = s5(P2.init, "accessor.init")) && S3.push(y3);
              else if (void 0 !== P2) throw new TypeError("accessor decorators must return an object with get, set, or init properties or void 0");
            } else s5(P2, (p5 ? "field" : "method") + " decorators", "return") && (p5 ? S3.push(P2) : w2[A2] = P2);
          }
        } finally {
          I2.v = true;
        }
      }
      return (p5 || d3) && u6.push(function(e9, t7) {
        for (var r8 = S3.length - 1; r8 >= 0; r8--) t7 = S3[r8].call(e9, t7);
        return t7;
      }), p5 || b3 || (f4 ? d3 ? u6.push(i7(w2, "get"), i7(w2, "set")) : u6.push(2 === o7 ? w2[A2] : i7.call.bind(w2[A2])) : Object.defineProperty(e8, n6, w2)), P2;
    }
    function u5(e8, t6) {
      return Object.defineProperty(e8, Symbol.metadata || Symbol["for"]("Symbol.metadata"), { configurable: true, enumerable: true, value: t6 });
    }
    if (arguments.length >= 6) var l3 = a3[Symbol.metadata || Symbol["for"]("Symbol.metadata")];
    var f3 = Object.create(null == l3 ? null : l3), p4 = function(e8, t6, r7, n6) {
      var o7, a4, i8 = [], s6 = function s7(t7) {
        return _checkInRHS(t7) === e8;
      }, u6 = /* @__PURE__ */ new Map();
      function l4(e9) {
        e9 && i8.push(c5.bind(null, e9));
      }
      for (var f4 = 0; f4 < t6.length; f4++) {
        var p5 = t6[f4];
        if (Array.isArray(p5)) {
          var d3 = p5[1], h4 = p5[2], m3 = p5.length > 3, y3 = 16 & d3, v3 = !!(8 & d3), g2 = 0 == (d3 &= 7), b3 = h4 + "/" + v3;
          if (!g2 && !m3) {
            var w2 = u6.get(b3);
            if (true === w2 || 3 === w2 && 4 !== d3 || 4 === w2 && 3 !== d3) throw Error("Attempted to decorate a public method/accessor that has the same name as a previously decorated public method/accessor. This is not currently supported by the decorators plugin. Property name was: " + h4);
            u6.set(b3, !(d3 > 2) || d3);
          }
          applyDec(v3 ? e8 : e8.prototype, p5, y3, m3 ? "#" + h4 : _toPropertyKey(h4), d3, n6, v3 ? a4 = a4 || [] : o7 = o7 || [], i8, v3, m3, g2, 1 === d3, v3 && m3 ? s6 : r7);
        }
      }
      return l4(o7), l4(a4), i8;
    }(e7, t5, o6, f3);
    return r6.length || u5(e7, f3), { e: p4, get c() {
      var t6 = [];
      return r6.length && [u5(applyDec(e7, [r6], n5, e7.name, 5, f3, t6), f3), c5.bind(null, t6, e7)];
    } };
  }
  function _toPropertyKey(t5) {
    var i7 = _toPrimitive(t5, "string");
    return "symbol" == _typeof(i7) ? i7 : i7 + "";
  }
  function _toPrimitive(t5, r6) {
    if ("object" != _typeof(t5) || !t5) return t5;
    var e7 = t5[Symbol.toPrimitive];
    if (void 0 !== e7) {
      var i7 = e7.call(t5, r6 || "default");
      if ("object" != _typeof(i7)) return i7;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === r6 ? String : Number)(t5);
  }
  function _setFunctionName(e7, t5, n5) {
    "symbol" == _typeof(t5) && (t5 = (t5 = t5.description) ? "[" + t5 + "]" : "");
    try {
      Object.defineProperty(e7, "name", { configurable: true, value: n5 ? n5 + " " + t5 : t5 });
    } catch (e8) {
    }
    return e7;
  }
  function _checkInRHS(e7) {
    if (Object(e7) !== e7) throw TypeError("right-hand side of 'in' should be an object, got " + (null !== e7 ? _typeof(e7) : "null"));
    return e7;
  }
  function setup2(props) {
    return {
      update: function update(context) {
        if (context.data.type === "reroute-pins") {
          return {
            menu: (props === null || props === void 0 ? void 0 : props.contextMenu) || function() {
              return null;
            },
            translate: (props === null || props === void 0 ? void 0 : props.translate) || function() {
              return null;
            },
            down: (props === null || props === void 0 ? void 0 : props.pointerdown) || function() {
              return null;
            },
            pins: context.data.data.pins
          };
        }
      },
      render: function render(context, plugin) {
        if (context.data.type === "reroute-pins") {
          var area = plugin.parentScope(BaseAreaPlugin);
          return b2(_templateObject || (_templateObject = _taggedTemplateLiteral(['\n          <rete-pins\n            .onMenu="', '"\n            .onTranslate="', '"\n            .onDown="', '"\n            .getPointer="', '"\n            .pins="', '"\n          ></rete-pins>'])), (props === null || props === void 0 ? void 0 : props.contextMenu) || function() {
            return null;
          }, (props === null || props === void 0 ? void 0 : props.translate) || function() {
            return null;
          }, (props === null || props === void 0 ? void 0 : props.pointerdown) || function() {
            return null;
          }, function() {
            return area.area.pointer;
          }, context.data.data.pins);
        }
      }
    };
  }
  function _createForOfIteratorHelper3(r6, e7) {
    var t5 = "undefined" != typeof Symbol && r6[Symbol.iterator] || r6["@@iterator"];
    if (!t5) {
      if (Array.isArray(r6) || (t5 = _unsupportedIterableToArray4(r6)) || e7 && r6 && "number" == typeof r6.length) {
        t5 && (r6 = t5);
        var _n = 0, F = function F2() {
        };
        return { s: F, n: function n5() {
          return _n >= r6.length ? { done: true } : { done: false, value: r6[_n++] };
        }, e: function e8(r7) {
          throw r7;
        }, f: F };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var o6, a3 = true, u5 = false;
    return { s: function s5() {
      t5 = t5.call(r6);
    }, n: function n5() {
      var r7 = t5.next();
      return a3 = r7.done, r7;
    }, e: function e8(r7) {
      u5 = true, o6 = r7;
    }, f: function f3() {
      try {
        a3 || null == t5["return"] || t5["return"]();
      } finally {
        if (u5) throw o6;
      }
    } };
  }
  function _unsupportedIterableToArray4(r6, a3) {
    if (r6) {
      if ("string" == typeof r6) return _arrayLikeToArray4(r6, a3);
      var t5 = {}.toString.call(r6).slice(8, -1);
      return "Object" === t5 && r6.constructor && (t5 = r6.constructor.name), "Map" === t5 || "Set" === t5 ? Array.from(r6) : "Arguments" === t5 || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t5) ? _arrayLikeToArray4(r6, a3) : void 0;
    }
  }
  function _arrayLikeToArray4(r6, a3) {
    (null == a3 || a3 > r6.length) && (a3 = r6.length);
    for (var e7 = 0, n5 = Array(a3); e7 < a3; e7++) n5[e7] = r6[e7];
    return n5;
  }
  function ownKeys3(e7, r6) {
    var t5 = Object.keys(e7);
    if (Object.getOwnPropertySymbols) {
      var o6 = Object.getOwnPropertySymbols(e7);
      r6 && (o6 = o6.filter(function(r7) {
        return Object.getOwnPropertyDescriptor(e7, r7).enumerable;
      })), t5.push.apply(t5, o6);
    }
    return t5;
  }
  function _objectSpread3(e7) {
    for (var r6 = 1; r6 < arguments.length; r6++) {
      var t5 = null != arguments[r6] ? arguments[r6] : {};
      r6 % 2 ? ownKeys3(Object(t5), true).forEach(function(r7) {
        _defineProperty(e7, r7, t5[r7]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e7, Object.getOwnPropertyDescriptors(t5)) : ownKeys3(Object(t5)).forEach(function(r7) {
        Object.defineProperty(e7, r7, Object.getOwnPropertyDescriptor(t5, r7));
      });
    }
    return e7;
  }
  function _callSuper5(t5, o6, e7) {
    return o6 = _getPrototypeOf(o6), _possibleConstructorReturn(t5, _isNativeReflectConstruct5() ? Reflect.construct(o6, e7 || [], _getPrototypeOf(t5).constructor) : o6.apply(t5, e7));
  }
  function _isNativeReflectConstruct5() {
    try {
      var t5 = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
    } catch (t6) {
    }
    return (_isNativeReflectConstruct5 = function _isNativeReflectConstruct6() {
      return !!t5;
    })();
  }
  function _superPropGet2(t5, e7, o6, r6) {
    var p4 = _get(_getPrototypeOf(1 & r6 ? t5.prototype : t5), e7, o6);
    return 2 & r6 && "function" == typeof p4 ? function(t6) {
      return p4.apply(o6, t6);
    } : p4;
  }
  var import_regenerator5, _templateObject$h, _RootElement, _initProto$e, _renderedDecs, _init_rendered, _ref$e, _A$e, RootElement, _applyDecs$e$e, _applyDecs$e2$2, MovableElement, _RefElement, _initProto$d, _dataDecs$3, _init_data$3, _emitDecs$1, _init_emit$1, _ref$d, _A$d, _B$a, RefElement, _applyDecs$e$d, _applyDecs$e2$1, _ConnectionElement, _templateObject$g, _templateObject2$d, _initProto$c, _startDecs$1, _init_start$1, _endDecs$1, _init_end$1, _pathDecs$1, _init_path$1, _ref$c, _A$c, _B$9, _C$9, ConnectionElement, _applyDecs$e$c, _ConnectionWrapperElement, _initProto$b, _startDecs, _init_start, _endDecs, _init_end, _pathDecs, _init_path, _componentDecs, _init_component, _computedPathDecs, _init_computedPath, _ref$b, _A$b, _B$8, _C$8, _D$6, _E$5, ConnectionWrapperElement, _applyDecs$e$b, _applyDecs$e2, _ControlElement, _templateObject$f, _templateObject2$c, _templateObject3$6, _initProto$a, _dataDecs$2, _init_data$2, _ref$a, _A$a, ControlElement, _applyDecs$e$a, _NodeElement, _templateObject$e, _templateObject2$b, _templateObject3$5, _templateObject4$3, _templateObject5$1, _templateObject6, _templateObject7, _initProto$9, _widthDecs$2, _init_width$2, _heightDecs$2, _init_height$2, _dataDecs$1, _init_data$1, _stylesDecs, _init_styles, _emitDecs, _init_emit, _ref$9, _A$9, _B$7, _C$7, _D$5, _E$4, NodeElement, _applyDecs$e$9, _SocketElement, _templateObject$d, _templateObject2$a, _initProto$8, _dataDecs, _init_data, _ref$8, _A$8, SocketElement, _applyDecs$e$8, _templateObject$c, _templateObject2$9, _templateObject3$4, _templateObject4$2, _templateObject5, index$4, _templateObject$b, _templateObject2$8, BlockElement, _ItemElement, _templateObject$a, _templateObject2$7, _templateObject3$3, _templateObject4$1, _initProto$7, _subitemsDecs, _init_subitems, _delayDecs$1, _init_delay$1, _visibleSubitemsDecs, _init_visibleSubitems, _ref$7, _A$7, _B$6, _C$6, ItemElement, _applyDecs$e$7, _MenuElement, _templateObject$9, _templateObject2$6, _templateObject3$2, _templateObject4, _initProto$6, _itemsDecs, _init_items, _delayDecs, _init_delay, _searchBarDecs, _init_searchBar, _onHideDecs, _init_onHide, _filterDecs, _init_filter, _ref$6, _A$6, _B$5, _C$5, _D$4, _E$3, MenuElement, _applyDecs$e$6, _SearchElement, _templateObject$8, _templateObject2$5, _initProto$5, _textDecs, _init_text, _ref$5, _A$5, SearchElement, _applyDecs$e$5, _templateObject$7, index$3, _MiniNode, _templateObject$6, _templateObject2$4, _initProto$4, _leftDecs$1, _init_left$1, _topDecs$1, _init_top$1, _widthDecs$1, _init_width$1, _heightDecs$1, _init_height$1, _ref$4, _A$4, _B$4, _C$4, _D$3, MiniNode, _applyDecs$e$4, _MiniViewport, _templateObject$5, _templateObject2$3, _initProto$3, _leftDecs, _init_left, _topDecs, _init_top, _widthDecs, _init_width, _heightDecs, _init_height, _containerWidthDecs, _init_containerWidth, _onTranslateDecs$2, _init_onTranslate$2, _ref$3, _A$3, _B$3, _C$3, _D$2, _E$2, _F$1, MiniViewport, _applyDecs$e$3, _Minimap, _templateObject$4, _templateObject2$2, _templateObject3$1, _initProto$2, _sizeDecs, _init_size, _ratioDecs, _init_ratio, _nodesDecs, _init_nodes, _viewportDecs, _init_viewport, _onTranslateDecs$1, _init_onTranslate$1, _pointDecs, _init_point, _containerDecs, _init_container, _ref$2, _A$2, _B$2, _C$2, _D$1, _E$1, _F, _G, Minimap, _applyDecs$e$2, _templateObject$3, index$2, _Pin, _templateObject$2, _templateObject2$1, _initProto$1, _positionDecs, _init_position, _selectedDecs, _init_selected, _getPointerDecs$1, _init_getPointer$1, _ref$1, pinSize, _A$1, _B$1, _C$1, Pin, _applyDecs$e$1, _Pins, _templateObject$1, _templateObject2, _templateObject3, _initProto, _pinsDecs, _init_pins, _onMenuDecs, _init_onMenu, _onTranslateDecs, _init_onTranslate, _onDownDecs, _init_onDown, _getPointerDecs, _init_getPointer, _ref, _A, _B, _C, _D, _E, Pins, _applyDecs$e, _templateObject, index$1, index3, LitPlugin;
  var init_lit_plugin_esm = __esm({
    "node_modules/@retejs/lit-plugin/lit-plugin.esm.js"() {
      init_typeof();
      init_classCallCheck();
      init_createClass();
      init_possibleConstructorReturn();
      init_getPrototypeOf();
      init_get();
      init_inherits();
      init_defineProperty();
      init_rete_esm();
      init_taggedTemplateLiteral();
      init_lit();
      init_slicedToArray();
      init_decorators();
      init_asyncToGenerator();
      import_regenerator5 = __toESM(require_regenerator2());
      init_rete_render_utils_esm();
      init_rete_area_plugin_esm();
      _A$e = /* @__PURE__ */ new WeakMap();
      _ref$e = (_renderedDecs = n4({
        type: Function
      }), "rendered");
      RootElement = /* @__PURE__ */ function(_LitElement) {
        function RootElement2() {
          var _this;
          _classCallCheck(this, RootElement2);
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _callSuper$h(this, RootElement2, [].concat(args));
          _classPrivateFieldInitSpec$e(_this, _A$e, (_initProto$e(_this), _init_rendered(_this, null)));
          return _this;
        }
        _inherits(RootElement2, _LitElement);
        return _createClass(RootElement2, [{
          key: _ref$e,
          get: function get() {
            return _classPrivateFieldGet$e(_A$e, this);
          }
        }, {
          key: "rendered",
          set: function set(v3) {
            _classPrivateFieldSet$e(_A$e, this, v3);
          }
        }, {
          key: "connectedCallback",
          value: function connectedCallback() {
            var _this$rendered;
            _superPropGet$6(RootElement2, "connectedCallback", this, 3)([]);
            (_this$rendered = this.rendered) === null || _this$rendered === void 0 ? void 0 : _this$rendered.call(this);
          }
        }, {
          key: "createRenderRoot",
          value: function createRenderRoot() {
            return this;
          }
        }]);
      }(i4);
      _RootElement = RootElement;
      _applyDecs$e$e = _applyDecs$f(_RootElement, [[_renderedDecs, 1, "rendered"]], [], 0, void 0, i4).e;
      _applyDecs$e2$2 = _slicedToArray(_applyDecs$e$e, 2);
      _init_rendered = _applyDecs$e2$2[0];
      _initProto$e = _applyDecs$e2$2[1];
      MovableElement = /* @__PURE__ */ function(_LitElement) {
        function MovableElement2() {
          var _this;
          _classCallCheck(this, MovableElement2);
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _callSuper$g(this, MovableElement2, [].concat(args));
          _defineProperty(_this, "beingMoved", false);
          return _this;
        }
        _inherits(MovableElement2, _LitElement);
        return _createClass(MovableElement2, [{
          key: "connectedCallback",
          value: function connectedCallback() {
            _superPropGet$5(MovableElement2, "connectedCallback", this, 3)([]);
            if (!this.beingMoved) {
              this.mounted();
            }
            this.beingMoved = false;
          }
        }, {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            var _this2 = this;
            _superPropGet$5(MovableElement2, "disconnectedCallback", this, 3)([]);
            this.beingMoved = true;
            queueMicrotask(function() {
              if (_this2.beingMoved) {
                _this2.unmounted();
              }
            });
          }
        }]);
      }(i4);
      _A$d = /* @__PURE__ */ new WeakMap();
      _B$a = /* @__PURE__ */ new WeakMap();
      _ref$d = (_dataDecs$3 = n4({
        type: Object
      }), _emitDecs$1 = n4({
        type: Function
      }), "data");
      RefElement = /* @__PURE__ */ function(_MovableElement) {
        function RefElement2() {
          var _this;
          _classCallCheck(this, RefElement2);
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _callSuper$f(this, RefElement2, [].concat(args));
          _classPrivateFieldInitSpec$d(_this, _A$d, (_initProto$d(_this), _init_data$3(_this)));
          _classPrivateFieldInitSpec$d(_this, _B$a, _init_emit$1(_this));
          return _this;
        }
        _inherits(RefElement2, _MovableElement);
        return _createClass(RefElement2, [{
          key: _ref$d,
          get: function get() {
            return _classPrivateFieldGet$d(_A$d, this);
          }
        }, {
          key: "data",
          set: function set(v3) {
            _classPrivateFieldSet$d(_A$d, this, v3);
          }
        }, {
          key: "emit",
          get: function get() {
            return _classPrivateFieldGet$d(_B$a, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$d(_B$a, this, v3);
          }
        }, {
          key: "mounted",
          value: function mounted() {
            this.emit({
              type: "render",
              data: _objectSpread$32(_objectSpread$32({}, this.data), {}, {
                element: this
              })
            });
          }
        }, {
          key: "unmounted",
          value: function unmounted() {
            this.emit({
              type: "unmount",
              data: {
                element: this
              }
            });
          }
        }, {
          key: "createRenderRoot",
          value: function createRenderRoot() {
            this.style.display = "block";
            return this;
          }
        }]);
      }(MovableElement);
      _RefElement = RefElement;
      _applyDecs$e$d = _applyDecs$d(_RefElement, [[_dataDecs$3, 1, "data"], [_emitDecs$1, 1, "emit"]], [], 0, void 0, MovableElement).e;
      _applyDecs$e2$1 = _slicedToArray(_applyDecs$e$d, 3);
      _init_data$3 = _applyDecs$e2$1[0];
      _init_emit$1 = _applyDecs$e2$1[1];
      _initProto$d = _applyDecs$e2$1[2];
      _A$c = /* @__PURE__ */ new WeakMap();
      _B$9 = /* @__PURE__ */ new WeakMap();
      _C$9 = /* @__PURE__ */ new WeakMap();
      _ref$c = (_startDecs$1 = n4(), _endDecs$1 = n4(), _pathDecs$1 = n4(), "start");
      ConnectionElement = /* @__PURE__ */ function(_LitElement) {
        function ConnectionElement2() {
          var _this;
          _classCallCheck(this, ConnectionElement2);
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _callSuper$e(this, ConnectionElement2, [].concat(args));
          _classPrivateFieldInitSpec$c(_this, _A$c, (_initProto$c(_this), _init_start$1(_this)));
          _classPrivateFieldInitSpec$c(_this, _B$9, _init_end$1(_this));
          _classPrivateFieldInitSpec$c(_this, _C$9, _init_path$1(_this));
          return _this;
        }
        _inherits(ConnectionElement2, _LitElement);
        return _createClass(ConnectionElement2, [{
          key: _ref$c,
          get: function get() {
            return _classPrivateFieldGet$c(_A$c, this);
          }
        }, {
          key: "start",
          set: function set(v3) {
            _classPrivateFieldSet$c(_A$c, this, v3);
          }
        }, {
          key: "end",
          get: function get() {
            return _classPrivateFieldGet$c(_B$9, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$c(_B$9, this, v3);
          }
        }, {
          key: "path",
          get: function get() {
            return _classPrivateFieldGet$c(_C$9, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$c(_C$9, this, v3);
          }
        }, {
          key: "render",
          value: function render() {
            return b2(_templateObject$g || (_templateObject$g = _taggedTemplateLiteral(['\n      <svg data-testid="connection">\n        <path d=', "></path>\n      </svg>\n    "])), this.path);
          }
        }]);
      }(i4);
      _ConnectionElement = ConnectionElement;
      _applyDecs$e$c = _slicedToArray(_applyDecs$c(_ConnectionElement, [[_startDecs$1, 1, "start"], [_endDecs$1, 1, "end"], [_pathDecs$1, 1, "path"]], [], 0, void 0, i4).e, 4);
      _init_start$1 = _applyDecs$e$c[0];
      _init_end$1 = _applyDecs$e$c[1];
      _init_path$1 = _applyDecs$e$c[2];
      _initProto$c = _applyDecs$e$c[3];
      _defineProperty(ConnectionElement, "styles", i(_templateObject2$d || (_templateObject2$d = _taggedTemplateLiteral(["\n    svg {\n      overflow: visible !important;\n      position: absolute;\n      pointer-events: none;\n      width: 9999px;\n      height: 9999px;\n    }\n\n    path {\n      fill: none;\n      stroke-width: 5px;\n      stroke: steelblue;\n      pointer-events: auto;\n    }\n  "]))));
      _A$b = /* @__PURE__ */ new WeakMap();
      _B$8 = /* @__PURE__ */ new WeakMap();
      _C$8 = /* @__PURE__ */ new WeakMap();
      _D$6 = /* @__PURE__ */ new WeakMap();
      _E$5 = /* @__PURE__ */ new WeakMap();
      _ref$b = (_startDecs = n4(), _endDecs = n4(), _pathDecs = n4(), _componentDecs = n4(), _computedPathDecs = n4({
        reflect: false
      }), "start");
      ConnectionWrapperElement = /* @__PURE__ */ function(_LitElement) {
        function ConnectionWrapperElement2() {
          var _this;
          _classCallCheck(this, ConnectionWrapperElement2);
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _callSuper$d(this, ConnectionWrapperElement2, [].concat(args));
          _classPrivateFieldInitSpec$b(_this, _A$b, (_initProto$b(_this), _init_start(_this)));
          _classPrivateFieldInitSpec$b(_this, _B$8, _init_end(_this));
          _classPrivateFieldInitSpec$b(_this, _C$8, _init_path(_this));
          _classPrivateFieldInitSpec$b(_this, _D$6, _init_component(_this));
          _defineProperty(_this, "computedStart", null);
          _defineProperty(_this, "computedEnd", null);
          _classPrivateFieldInitSpec$b(_this, _E$5, _init_computedPath(_this));
          _defineProperty(_this, "unwatch1", false);
          _defineProperty(_this, "unwatch2", false);
          return _this;
        }
        _inherits(ConnectionWrapperElement2, _LitElement);
        return _createClass(ConnectionWrapperElement2, [{
          key: _ref$b,
          get: function get() {
            return _classPrivateFieldGet$b(_A$b, this);
          }
        }, {
          key: "start",
          set: function set(v3) {
            _classPrivateFieldSet$b(_A$b, this, v3);
          }
        }, {
          key: "end",
          get: function get() {
            return _classPrivateFieldGet$b(_B$8, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$b(_B$8, this, v3);
          }
        }, {
          key: "path",
          get: function get() {
            return _classPrivateFieldGet$b(_C$8, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$b(_C$8, this, v3);
          }
        }, {
          key: "component",
          get: function get() {
            return _classPrivateFieldGet$b(_D$6, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$b(_D$6, this, v3);
          }
        }, {
          key: "render",
          value: function render() {
            return this.component(this.computedPath, this.computedStart, this.computedEnd);
          }
        }, {
          key: "computedPath",
          get: function get() {
            return _classPrivateFieldGet$b(_E$5, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$b(_E$5, this, v3);
          }
        }, {
          key: "connectedCallback",
          value: function connectedCallback() {
            var _this2 = this;
            _superPropGet$4(ConnectionWrapperElement2, "connectedCallback", this, 3)([]);
            this.unwatch1 = typeof this.start === "function" && this.start(function(s5) {
              _this2.computedStart = s5;
              _this2.updatePath();
            });
            this.unwatch2 = typeof this.end === "function" && this.end(function(s5) {
              _this2.computedEnd = s5;
              _this2.updatePath();
            });
          }
        }, {
          key: "updated",
          value: function updated(changed) {
            if (changed.has("start") && typeof this.start !== "function") {
              this.computedStart = this.start;
              this.updatePath();
            }
            if (changed.has("end") && typeof this.end !== "function") {
              this.computedEnd = this.end;
              this.updatePath();
            }
          }
        }, {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            _superPropGet$4(ConnectionWrapperElement2, "disconnectedCallback", this, 3)([]);
            if (this.unwatch1) {
              this.unwatch1();
            }
            if (this.unwatch2) {
              this.unwatch2();
            }
          }
        }, {
          key: "updatePath",
          value: function updatePath() {
            var _this3 = this;
            if (this.computedStart && this.computedEnd) void this.path(this.computedStart, this.computedEnd).then(function(path) {
              _this3.computedPath = path;
            });
          }
        }]);
      }(i4);
      _ConnectionWrapperElement = ConnectionWrapperElement;
      _applyDecs$e$b = _applyDecs$b(_ConnectionWrapperElement, [[_startDecs, 1, "start"], [_endDecs, 1, "end"], [_pathDecs, 1, "path"], [_componentDecs, 1, "component"], [_computedPathDecs, 1, "computedPath"]], [], 0, void 0, i4).e;
      _applyDecs$e2 = _slicedToArray(_applyDecs$e$b, 6);
      _init_start = _applyDecs$e2[0];
      _init_end = _applyDecs$e2[1];
      _init_path = _applyDecs$e2[2];
      _init_component = _applyDecs$e2[3];
      _init_computedPath = _applyDecs$e2[4];
      _initProto$b = _applyDecs$e2[5];
      _A$a = /* @__PURE__ */ new WeakMap();
      _ref$a = (_dataDecs$2 = n4({
        type: Object
      }), "data");
      ControlElement = /* @__PURE__ */ function(_LitElement) {
        function ControlElement2() {
          var _this;
          _classCallCheck(this, ControlElement2);
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _callSuper$c(this, ControlElement2, [].concat(args));
          _classPrivateFieldInitSpec$a(_this, _A$a, (_initProto$a(_this), _init_data$2(_this, null)));
          return _this;
        }
        _inherits(ControlElement2, _LitElement);
        return _createClass(ControlElement2, [{
          key: _ref$a,
          get: function get() {
            return _classPrivateFieldGet$a(_A$a, this);
          }
        }, {
          key: "data",
          set: function set(v3) {
            _classPrivateFieldSet$a(_A$a, this, v3);
          }
        }, {
          key: "handleInput",
          value: function handleInput(e7) {
            if (!this.data) return;
            var target = e7.target;
            var val = this.data.type === "number" ? +target.value : target.value;
            this.data.setValue(val);
          }
        }, {
          key: "render",
          value: function render() {
            if (!this.data) return b2(_templateObject$f || (_templateObject$f = _taggedTemplateLiteral([""])));
            return b2(_templateObject2$c || (_templateObject2$c = _taggedTemplateLiteral(['\n      <input\n        type="', '"\n        .value="', '"\n        ?readonly="', '"\n        @input="', '"\n        @pointerdown="', '"\n      />\n    '])), this.data.type, this.data.value, this.data.readonly, this.handleInput, function(e7) {
              e7.stopPropagation();
            });
          }
        }]);
      }(i4);
      _ControlElement = ControlElement;
      _applyDecs$e$a = _slicedToArray(_applyDecs$a(_ControlElement, [[_dataDecs$2, 1, "data"]], [], 0, void 0, i4).e, 2);
      _init_data$2 = _applyDecs$e$a[0];
      _initProto$a = _applyDecs$e$a[1];
      _defineProperty(ControlElement, "styles", i(_templateObject3$6 || (_templateObject3$6 = _taggedTemplateLiteral(["\n    input {\n      width: 100%;\n      border-radius: 30px;\n      background-color: white;\n      padding: 2px 6px;\n      border: 1px solid #999;\n      font-size: 110%;\n      box-sizing: border-box;\n    }\n  "]))));
      _A$9 = /* @__PURE__ */ new WeakMap();
      _B$7 = /* @__PURE__ */ new WeakMap();
      _C$7 = /* @__PURE__ */ new WeakMap();
      _D$5 = /* @__PURE__ */ new WeakMap();
      _E$4 = /* @__PURE__ */ new WeakMap();
      _ref$9 = (_widthDecs$2 = n4({
        type: Number
      }), _heightDecs$2 = n4({
        type: Number
      }), _dataDecs$1 = n4({
        type: Object
      }), _stylesDecs = n4({
        type: Function
      }), _emitDecs = n4({
        type: Function
      }), "width");
      NodeElement = /* @__PURE__ */ function(_LitElement) {
        function NodeElement2() {
          var _this;
          _classCallCheck(this, NodeElement2);
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _callSuper$b(this, NodeElement2, [].concat(args));
          _classPrivateFieldInitSpec$9(_this, _A$9, (_initProto$9(_this), _init_width$2(_this, null)));
          _classPrivateFieldInitSpec$9(_this, _B$7, _init_height$2(_this, null));
          _classPrivateFieldInitSpec$9(_this, _C$7, _init_data$1(_this));
          _classPrivateFieldInitSpec$9(_this, _D$5, _init_styles(_this, null));
          _classPrivateFieldInitSpec$9(_this, _E$4, _init_emit(_this, null));
          return _this;
        }
        _inherits(NodeElement2, _LitElement);
        return _createClass(NodeElement2, [{
          key: _ref$9,
          get: function get() {
            return _classPrivateFieldGet$9(_A$9, this);
          }
        }, {
          key: "width",
          set: function set(v3) {
            _classPrivateFieldSet$9(_A$9, this, v3);
          }
        }, {
          key: "height",
          get: function get() {
            return _classPrivateFieldGet$9(_B$7, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$9(_B$7, this, v3);
          }
        }, {
          key: "data",
          get: function get() {
            return _classPrivateFieldGet$9(_C$7, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$9(_C$7, this, v3);
          }
        }, {
          key: "styles",
          get: function get() {
            return _classPrivateFieldGet$9(_D$5, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$9(_D$5, this, v3);
          }
        }, {
          key: "emit",
          get: function get() {
            return _classPrivateFieldGet$9(_E$4, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$9(_E$4, this, v3);
          }
        }, {
          key: "sortByIndex",
          value: function sortByIndex(entries) {
            entries.sort(function(a3, b3) {
              var _a$, _b$;
              var ai = ((_a$ = a3[1]) === null || _a$ === void 0 ? void 0 : _a$.index) || 0;
              var bi = ((_b$ = b3[1]) === null || _b$ === void 0 ? void 0 : _b$.index) || 0;
              return ai - bi;
            });
          }
        }, {
          key: "render",
          value: function render() {
            var _this$styles, _this2 = this;
            var inputs = Object.entries(this.data.inputs || {});
            var outputs = Object.entries(this.data.outputs || {});
            var controls = Object.entries(this.data.controls || {});
            var _this$data = this.data, id = _this$data.id, label = _this$data.label, width = _this$data.width, height = _this$data.height;
            this.sortByIndex(inputs);
            this.sortByIndex(outputs);
            this.sortByIndex(controls);
            if (this.data.selected) {
              this.classList.add("selected");
            } else {
              this.classList.remove("selected");
            }
            this.dataset.testid = "node";
            return b2(_templateObject$e || (_templateObject$e = _taggedTemplateLiteral(["\n      <style>\n        :host {\n          width: ", ";\n          height: ", ";\n        }\n        ", '\n      </style>\n      <div class="title" data-testid="title">', "</div>\n      ", "\n      ", "\n      ", "\n    "])), Number.isFinite(width) ? "".concat(width, "px") : "var(--node-width)", Number.isFinite(height) ? "".concat(height, "px") : "auto", (_this$styles = this.styles) === null || _this$styles === void 0 ? void 0 : _this$styles.call(this, this), label, outputs.map(function(_ref2) {
              var _ref3 = _slicedToArray(_ref2, 2), key = _ref3[0], output = _ref3[1];
              return output ? b2(_templateObject2$b || (_templateObject2$b = _taggedTemplateLiteral(['\n        <div class="output" key=', " data-testid=", '>\n          <div class="output-title" data-testid="output-title">', '</div><!--\n          --><span class="output-socket" data-testid="output-socket">\n            <rete-ref\n              .data=', "\n              .emit=", "\n            ></rete-ref>\n          </span>\n        </div>"])), key, "output-".concat(key), output.label, {
                type: "socket",
                side: "output",
                key,
                nodeId: id,
                payload: output.socket
              }, _this2.emit) : null;
            }), controls.map(function(_ref4) {
              var _ref5 = _slicedToArray(_ref4, 2), key = _ref5[0], control = _ref5[1];
              return control ? b2(_templateObject3$5 || (_templateObject3$5 = _taggedTemplateLiteral(['\n        <span class="control" data-testid="', '">\n          <rete-ref\n            .emit=', '\n            .data="', '"\n          ></rete-ref>\n        </span>\n        '])), "control-" + key, _this2.emit, {
                type: "control",
                payload: control
              }) : null;
            }), inputs.map(function(_ref6) {
              var _ref7 = _slicedToArray(_ref6, 2), key = _ref7[0], input = _ref7[1];
              return input ? b2(_templateObject4$3 || (_templateObject4$3 = _taggedTemplateLiteral(['\n        <div class="input" key=', " data-testid=", '>\n          <span class="input-socket" data-testid="input-socket">\n            <rete-ref\n              .data=', "\n              .emit=", "\n            ></rete-ref>\n          </span><!--\n          -->", "\n          ", "\n        </div>"])), key, "input-".concat(key), {
                type: "socket",
                side: "input",
                key,
                nodeId: id,
                payload: input.socket
              }, _this2.emit, input && (!input.control || !input.showControl) ? b2(_templateObject5$1 || (_templateObject5$1 = _taggedTemplateLiteral(['<!--\n          --><div class="input-title" data-testid="input-title">', "</div>"])), input.label) : null, input.control && input.showControl ? b2(_templateObject6 || (_templateObject6 = _taggedTemplateLiteral(['\n            <span class="control" data-testid="input-control">\n              <rete-ref\n                .emit=', '\n                .data="', '"\n              ></rete-ref>\n            </span>\n          '])), _this2.emit, {
                type: "control",
                payload: input.control
              }) : null) : null;
            }));
          }
        }]);
      }(i4);
      _NodeElement = NodeElement;
      _applyDecs$e$9 = _slicedToArray(_applyDecs$9(_NodeElement, [[_widthDecs$2, 1, "width"], [_heightDecs$2, 1, "height"], [_dataDecs$1, 1, "data"], [_stylesDecs, 1, "styles"], [_emitDecs, 1, "emit"]], [], 0, void 0, i4).e, 6);
      _init_width$2 = _applyDecs$e$9[0];
      _init_height$2 = _applyDecs$e$9[1];
      _init_data$1 = _applyDecs$e$9[2];
      _init_styles = _applyDecs$e$9[3];
      _init_emit = _applyDecs$e$9[4];
      _initProto$9 = _applyDecs$e$9[5];
      _defineProperty(NodeElement, "styles", i(_templateObject7 || (_templateObject7 = _taggedTemplateLiteral(["\n    :host {\n      --node-color: rgba(110, 136, 255, 0.8);\n      --node-color-hover: rgba(130, 153, 255, 0.8);\n      --node-color-selected: #ffd92c;\n      --socket-size: 24px;\n      --socket-margin: 6px;\n      --socket-color: #96b38a;\n      --node-width: 180px;\n    }\n\n    :host {\n      display: block;\n      background: var(--node-color);\n      border: 2px solid #4e58bf;\n      border-radius: 10px;\n      cursor: pointer;\n      box-sizing: border-box;\n      padding-bottom: 6px;\n      position: relative;\n      user-select: none;\n      line-height: initial;\n      font-family: Arial;\n    }\n\n    :host(:hover) {\n      background: var(--node-color-hover);\n    }\n\n    :host(.selected) {\n      background: var(--node-color-selected);\n      border-color: #e3c000;\n    }\n\n    .title {\n      color: white;\n      font-family: sans-serif;\n      font-size: 18px;\n      padding: 8px;\n    }\n\n    .output,\n    .input {\n      text-align: right;\n    }\n\n    .input {\n      text-align: left;\n    }\n\n\n    .output-socket {\n      text-align: right;\n      margin-right: calc(0px - var(--socket-size) / 2 - var(--socket-margin));\n      display: inline-block;\n    }\n    .input-socket {\n        text-align: left;\n        margin-left: calc(0px - var(--socket-size) / 2 - var(--socket-margin));\n        display: inline-block;\n    }\n\n    .input-title,\n    .output-title {\n      vertical-align: middle;\n      color: white;\n      display: inline-block;\n      font-family: sans-serif;\n      font-size: 14px;\n      margin: var(--socket-margin);\n      line-height: var(--socket-size);\n    }\n\n    .input-control {\n      z-index: 1;\n      width: calc(100% - calc(var(--socket-size) + 2 * var(--socket-margin)));\n      vertical-align: middle;\n      display: inline-block;\n    }\n\n    .control {\n      display: block;\n      padding: var(--socket-margin) calc(var(--socket-size) / 2 + var(--socket-margin));\n    }\n  "]))));
      _A$8 = /* @__PURE__ */ new WeakMap();
      _ref$8 = (_dataDecs = n4({
        type: Object
      }), "data");
      SocketElement = /* @__PURE__ */ function(_LitElement) {
        function SocketElement2() {
          var _this;
          _classCallCheck(this, SocketElement2);
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _callSuper$a(this, SocketElement2, [].concat(args));
          _classPrivateFieldInitSpec$8(_this, _A$8, (_initProto$8(_this), _init_data(_this, null)));
          return _this;
        }
        _inherits(SocketElement2, _LitElement);
        return _createClass(SocketElement2, [{
          key: _ref$8,
          get: function get() {
            return _classPrivateFieldGet$8(_A$8, this);
          }
        }, {
          key: "data",
          set: function set(v3) {
            _classPrivateFieldSet$8(_A$8, this, v3);
          }
        }, {
          key: "render",
          value: function render() {
            var _this$data;
            return b2(_templateObject$d || (_templateObject$d = _taggedTemplateLiteral(['\n      <div class="hoverable">\n        <div class="styles" title="', '"></div>\n      </div>\n    '])), (_this$data = this.data) === null || _this$data === void 0 ? void 0 : _this$data.name);
          }
        }]);
      }(i4);
      _SocketElement = SocketElement;
      _applyDecs$e$8 = _slicedToArray(_applyDecs$8(_SocketElement, [[_dataDecs, 1, "data"]], [], 0, void 0, i4).e, 2);
      _init_data = _applyDecs$e$8[0];
      _initProto$8 = _applyDecs$e$8[1];
      _defineProperty(SocketElement, "styles", i(_templateObject2$a || (_templateObject2$a = _taggedTemplateLiteral(["\n    :host {\n      --socket-color: #96b38a;\n      --socket-size: 24px;\n      --socket-margin: 6px;\n      --border-width: 1px;\n      --hover-border-width: 4px;\n      --multiple-border-color: yellow;\n    }\n\n    .styles {\n      display: inline-block;\n      cursor: pointer;\n      border: var(--border-width) solid white;\n      border-radius: calc(var(--socket-size) / 2);\n      width: var(--socket-size);\n      height: var(--socket-size);\n      vertical-align: middle;\n      background: var(--socket-color);\n      z-index: 2;\n      box-sizing: border-box;\n    }\n\n    .styles:hover {\n      border-width: var(--hover-border-width);\n    }\n\n    .multiple {\n      border-color: var(--multiple-border-color);\n    }\n\n    .hoverable {\n      border-radius: calc((var(--socket-size) + var(--socket-margin) * 2) / 2);\n      padding: var(--socket-margin);\n    }\n\n    .hoverable:hover .styles {\n      border-width: var(--hover-border-width);\n    }\n  "]))));
      customElements.define("rete-connection-wrapper", ConnectionWrapperElement);
      customElements.define("rete-connection", ConnectionElement);
      customElements.define("rete-ref", RefElement);
      customElements.define("rete-socket", SocketElement);
      customElements.define("rete-node", NodeElement);
      customElements.define("rete-control", ControlElement);
      index$4 = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        setup: setup$3
      });
      BlockElement = /* @__PURE__ */ function(_LitElement) {
        function BlockElement2() {
          _classCallCheck(this, BlockElement2);
          return _callSuper$9(this, BlockElement2, arguments);
        }
        _inherits(BlockElement2, _LitElement);
        return _createClass(BlockElement2, [{
          key: "render",
          value: function render() {
            return b2(_templateObject$b || (_templateObject$b = _taggedTemplateLiteral(["\n      <slot></slot>\n    "])));
          }
        }]);
      }(i4);
      _defineProperty(BlockElement, "styles", i(_templateObject2$8 || (_templateObject2$8 = _taggedTemplateLiteral(["\n    :host {\n      color: #fff;\n      padding: 4px;\n      border-bottom: 1px solid var(--context-color-dark);\n      background-color: var(--context-color);\n      cursor: pointer;\n      box-sizing: border-box;\n      width: 100%;\n      position: relative;\n      display: block;\n    }\n\n    :host(:first-child) {\n      border-top-left-radius: var(--context-menu-round);\n      border-top-right-radius: var(--context-menu-round);\n    }\n\n    :host(:last-child) {\n      border-bottom-left-radius: var(--context-menu-round);\n      border-bottom-right-radius: var(--context-menu-round);\n    }\n\n    :host(:hover) {\n      background-color: var(--context-color-light);\n    }\n  "]))));
      _A$7 = /* @__PURE__ */ new WeakMap();
      _B$6 = /* @__PURE__ */ new WeakMap();
      _C$6 = /* @__PURE__ */ new WeakMap();
      _ref$7 = (_subitemsDecs = n4({
        type: Array
      }), _delayDecs$1 = n4({
        type: Number
      }), _visibleSubitemsDecs = r5(), "subitems");
      ItemElement = /* @__PURE__ */ function(_LitElement) {
        function ItemElement2() {
          var _this;
          _classCallCheck(this, ItemElement2);
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _callSuper$8(this, ItemElement2, [].concat(args));
          _classPrivateFieldInitSpec$7(_this, _A$7, (_initProto$7(_this), _init_subitems(_this, [])));
          _classPrivateFieldInitSpec$7(_this, _B$6, _init_delay$1(_this, 0));
          _classPrivateFieldInitSpec$7(_this, _C$6, _init_visibleSubitems(_this, false));
          return _this;
        }
        _inherits(ItemElement2, _LitElement);
        return _createClass(ItemElement2, [{
          key: _ref$7,
          get: function get() {
            return _classPrivateFieldGet$7(_A$7, this);
          }
        }, {
          key: "subitems",
          set: function set(v3) {
            _classPrivateFieldSet$7(_A$7, this, v3);
          }
        }, {
          key: "delay",
          get: function get() {
            return _classPrivateFieldGet$7(_B$6, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$7(_B$6, this, v3);
          }
        }, {
          key: "visibleSubitems",
          get: function get() {
            return _classPrivateFieldGet$7(_C$6, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$7(_C$6, this, v3);
          }
        }, {
          key: "connectedCallback",
          value: function connectedCallback() {
            _superPropGet$3(ItemElement2, "connectedCallback", this, 3)([]);
            this.hide = debounce(this.delay, this.hideSubitems.bind(this));
          }
        }, {
          key: "hideSubitems",
          value: function hideSubitems() {
            this.visibleSubitems = false;
          }
        }, {
          key: "render",
          value: function render() {
            var _this$subitems, _this2 = this;
            if ((_this$subitems = this.subitems) !== null && _this$subitems !== void 0 && _this$subitems.length) {
              this.classList.add("hasSubitems");
            } else {
              this.classList.remove("hasSubitems");
            }
            return b2(_templateObject$a || (_templateObject$a = _taggedTemplateLiteral(['\n      <div data-testid="context-menu-item">\n        <div\n          class="content"\n          @click="', '"\n          @wheel="', '"\n          @pointerover="', '"\n          @pointerleave="', '"\n          @pointerdown="', '"\n        >\n          <slot></slot>\n          ', "\n        </div>\n      </div>\n    "])), this.handleClick, this.stopEvent, this.handlePointerOver, this.handlePointerLeave, this.stopEvent, this.subitems && this.visibleSubitems ? b2(_templateObject2$7 || (_templateObject2$7 = _taggedTemplateLiteral(['\n                <div class="subitems">\n                  ', "\n                </div>\n              "])), this.subitems.map(function(item) {
              return b2(_templateObject3$3 || (_templateObject3$3 = _taggedTemplateLiteral(['\n                      <rete-context-menu-item\n                        .key="', '"\n                        .delay="', '"\n                        .subitems="', '"\n                        @select="', '"\n                        @hide="', '"\n                      >\n                        ', "\n                      </rete-context-menu-item>\n                    "])), item.key, _this2.delay, item.subitems, item.handler, _this2.handleHide, item.label);
            })) : "");
          }
        }, {
          key: "handleClick",
          value: function handleClick(event) {
            event.stopPropagation();
            this.dispatchEvent(new CustomEvent("select", {
              detail: event
            }));
            this.dispatchEvent(new CustomEvent("hide"));
          }
        }, {
          key: "stopEvent",
          value: function stopEvent(event) {
            event.stopPropagation();
          }
        }, {
          key: "handlePointerOver",
          value: function handlePointerOver() {
            this.hide.cancel();
            this.visibleSubitems = true;
          }
        }, {
          key: "handlePointerLeave",
          value: function handlePointerLeave() {
            this.hide.call();
          }
        }, {
          key: "handleHide",
          value: function handleHide() {
            this.dispatchEvent(new CustomEvent("hide"));
          }
        }]);
      }(i4);
      _ItemElement = ItemElement;
      _applyDecs$e$7 = _slicedToArray(_applyDecs$7(_ItemElement, [[_subitemsDecs, 1, "subitems"], [_delayDecs$1, 1, "delay"], [_visibleSubitemsDecs, 1, "visibleSubitems"]], [], 0, void 0, i4).e, 4);
      _init_subitems = _applyDecs$e$7[0];
      _init_delay$1 = _applyDecs$e$7[1];
      _init_visibleSubitems = _applyDecs$e$7[2];
      _initProto$7 = _applyDecs$e$7[3];
      _defineProperty(ItemElement, "styles", [BlockElement.styles, i(_templateObject4$1 || (_templateObject4$1 = _taggedTemplateLiteral(["\n      :host {\n        padding: 0;\n      }\n      .content {\n        padding: 4px;\n      }\n      :host(.hasSubitems):after {\n        content: '\u25BA';\n        position: absolute;\n        opacity: 0.6;\n        right: 5px;\n        top: 5px;\n        pointer-events: none;\n      }\n      .subitems {\n        position: absolute;\n        top: 0;\n        left: 100%;\n        width: var(--menu-width);\n      }\n    "])))]);
      _A$6 = /* @__PURE__ */ new WeakMap();
      _B$5 = /* @__PURE__ */ new WeakMap();
      _C$5 = /* @__PURE__ */ new WeakMap();
      _D$4 = /* @__PURE__ */ new WeakMap();
      _E$3 = /* @__PURE__ */ new WeakMap();
      _ref$6 = (_itemsDecs = n4({
        type: Array
      }), _delayDecs = n4({
        type: Number
      }), _searchBarDecs = n4({
        type: Boolean
      }), _onHideDecs = n4({
        type: Function
      }), _filterDecs = r5(), "items");
      MenuElement = /* @__PURE__ */ function(_LitElement) {
        function MenuElement2() {
          var _this;
          _classCallCheck(this, MenuElement2);
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _callSuper$7(this, MenuElement2, [].concat(args));
          _classPrivateFieldInitSpec$6(_this, _A$6, (_initProto$6(_this), _init_items(_this, [])));
          _classPrivateFieldInitSpec$6(_this, _B$5, _init_delay(_this, 0));
          _classPrivateFieldInitSpec$6(_this, _C$5, _init_searchBar(_this, false));
          _classPrivateFieldInitSpec$6(_this, _D$4, _init_onHide(_this, function() {
            return null;
          }));
          _classPrivateFieldInitSpec$6(_this, _E$3, _init_filter(_this, ""));
          return _this;
        }
        _inherits(MenuElement2, _LitElement);
        return _createClass(MenuElement2, [{
          key: _ref$6,
          get: function get() {
            return _classPrivateFieldGet$6(_A$6, this);
          }
        }, {
          key: "items",
          set: function set(v3) {
            _classPrivateFieldSet$6(_A$6, this, v3);
          }
        }, {
          key: "delay",
          get: function get() {
            return _classPrivateFieldGet$6(_B$5, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$6(_B$5, this, v3);
          }
        }, {
          key: "searchBar",
          get: function get() {
            return _classPrivateFieldGet$6(_C$5, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$6(_C$5, this, v3);
          }
        }, {
          key: "onHide",
          get: function get() {
            return _classPrivateFieldGet$6(_D$4, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$6(_D$4, this, v3);
          }
        }, {
          key: "filter",
          get: function get() {
            return _classPrivateFieldGet$6(_E$3, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$6(_E$3, this, v3);
          }
        }, {
          key: "connectedCallback",
          value: function connectedCallback() {
            _superPropGet$2(MenuElement2, "connectedCallback", this, 3)([]);
            this.hide = debounce(this.delay, this.onHide);
          }
        }, {
          key: "firstUpdated",
          value: function firstUpdated() {
            var _this2 = this;
            this.addEventListener("mouseover", function() {
              _this2.hide.cancel();
            });
            this.addEventListener("mouseleave", function() {
              _this2.hide.call();
            });
          }
        }, {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            _superPropGet$2(MenuElement2, "disconnectedCallback", this, 3)([]);
            if (this.hide) this.hide.cancel();
          }
        }, {
          key: "getItems",
          value: function getItems() {
            var filterRegexp = new RegExp(this.filter, "i");
            return this.items.filter(function(item) {
              return item.label.match(filterRegexp);
            });
          }
        }, {
          key: "handleFilterChange",
          value: function handleFilterChange(event) {
            this.filter = event.target.value;
            this.requestUpdate();
          }
        }, {
          key: "render",
          value: function render() {
            var _this3 = this;
            return b2(_templateObject$9 || (_templateObject$9 = _taggedTemplateLiteral(['\n      <style>\n        :host {\n          --context-color: rgba(110, 136, 255, 0.8);\n          --context-color-light: rgba(130, 153, 255, 0.8);\n          --context-color-dark: rgba(69, 103, 255, 0.8);\n          --context-menu-round: 5px;\n          --menu-width: 120px;\n        }\n      </style>\n      <div class="menu" data-testid="context-menu">\n        ', "\n        ", "\n      </div>\n    "])), this.searchBar ? b2(_templateObject2$6 || (_templateObject2$6 = _taggedTemplateLiteral(["<rete-context-menu-block>\n                 <rete-context-menu-search .text=", " @change=", " />\n            </rete-context-menu-block>"])), this.filter, this.handleFilterChange) : "", this.getItems().map(function(item) {
              return b2(_templateObject3$2 || (_templateObject3$2 = _taggedTemplateLiteral(["\n          <rete-context-menu-item\n            .key=", "\n            @select=", "\n            .delay=", "\n            @hide=", "\n            .subitems=", '\n            class="first"\n          >\n            ', "\n          </rete-context-menu-item>\n        "])), item.key, item.handler, _this3.delay, _this3.onHide, item.subitems, item.label);
            }));
          }
        }]);
      }(i4);
      _MenuElement = MenuElement;
      _applyDecs$e$6 = _slicedToArray(_applyDecs$6(_MenuElement, [[_itemsDecs, 1, "items"], [_delayDecs, 1, "delay"], [_searchBarDecs, 1, "searchBar"], [_onHideDecs, 1, "onHide"], [_filterDecs, 1, "filter"]], [], 0, void 0, i4).e, 6);
      _init_items = _applyDecs$e$6[0];
      _init_delay = _applyDecs$e$6[1];
      _init_searchBar = _applyDecs$e$6[2];
      _init_onHide = _applyDecs$e$6[3];
      _init_filter = _applyDecs$e$6[4];
      _initProto$6 = _applyDecs$e$6[5];
      _defineProperty(MenuElement, "styles", i(_templateObject4 || (_templateObject4 = _taggedTemplateLiteral(["\n    .menu {\n      padding: 10px;\n      width: var(--menu-width);\n      margin-top: -20px;\n      margin-left: calc(-1 * var(--menu-width) / 2);\n    }\n  "]))));
      _A$5 = /* @__PURE__ */ new WeakMap();
      _ref$5 = (_textDecs = r5(), "properties");
      SearchElement = /* @__PURE__ */ function(_LitElement) {
        function SearchElement2() {
          var _this;
          _classCallCheck(this, SearchElement2);
          _this = _callSuper$6(this, SearchElement2);
          _classPrivateFieldInitSpec$5(_this, _A$5, (_initProto$5(_this), _init_text(_this, "")));
          _this.text = "";
          return _this;
        }
        _inherits(SearchElement2, _LitElement);
        return _createClass(SearchElement2, [{
          key: "text",
          get: function get() {
            return _classPrivateFieldGet$5(_A$5, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$5(_A$5, this, v3);
          }
        }, {
          key: "handleInput",
          value: function handleInput(event) {
            this.text = event.target.value;
            var newEvent = new InputEvent("change");
            Object.defineProperty(newEvent, "target", {
              writable: false,
              value: event.target
            });
            this.dispatchEvent(newEvent);
          }
        }, {
          key: "render",
          value: function render() {
            return b2(_templateObject$8 || (_templateObject$8 = _taggedTemplateLiteral(['\n      <input\n        class="search"\n        .value="', '"\n        @input="', '"\n        data-testid="context-menu-search-input"\n      />\n    '])), this.text, this.handleInput);
          }
        }]);
      }(i4);
      _SearchElement = SearchElement;
      _applyDecs$e$5 = _slicedToArray(_applyDecs$5(_SearchElement, [[_textDecs, 1, "text"]], [], 0, void 0, i4).e, 2);
      _init_text = _applyDecs$e$5[0];
      _initProto$5 = _applyDecs$e$5[1];
      _defineProperty(SearchElement, _ref$5, {
        text: {
          type: String
        }
      });
      _defineProperty(SearchElement, "styles", i(_templateObject2$5 || (_templateObject2$5 = _taggedTemplateLiteral(["\n    .search {\n      color: white;\n      padding: 1px 8px;\n      border: 1px solid white;\n      border-radius: 10px;\n      font-size: 16px;\n      font-family: serif;\n      width: 100%;\n      box-sizing: border-box;\n      background: transparent;\n    }\n  "]))));
      customElements.define("rete-context-menu", MenuElement);
      customElements.define("rete-context-menu-block", BlockElement);
      customElements.define("rete-context-menu-search", SearchElement);
      customElements.define("rete-context-menu-item", ItemElement);
      index$3 = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        setup: setup$2
      });
      _A$4 = /* @__PURE__ */ new WeakMap();
      _B$4 = /* @__PURE__ */ new WeakMap();
      _C$4 = /* @__PURE__ */ new WeakMap();
      _D$3 = /* @__PURE__ */ new WeakMap();
      _ref$4 = (_leftDecs$1 = n4({
        type: Number
      }), _topDecs$1 = n4({
        type: Number
      }), _widthDecs$1 = n4({
        type: Number
      }), _heightDecs$1 = n4({
        type: Number
      }), "left");
      MiniNode = /* @__PURE__ */ function(_LitElement) {
        function MiniNode2() {
          var _this;
          _classCallCheck(this, MiniNode2);
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _callSuper$5(this, MiniNode2, [].concat(args));
          _classPrivateFieldInitSpec$4(_this, _A$4, (_initProto$4(_this), _init_left$1(_this)));
          _classPrivateFieldInitSpec$4(_this, _B$4, _init_top$1(_this));
          _classPrivateFieldInitSpec$4(_this, _C$4, _init_width$1(_this));
          _classPrivateFieldInitSpec$4(_this, _D$3, _init_height$1(_this));
          return _this;
        }
        _inherits(MiniNode2, _LitElement);
        return _createClass(MiniNode2, [{
          key: _ref$4,
          get: function get() {
            return _classPrivateFieldGet$4(_A$4, this);
          }
        }, {
          key: "left",
          set: function set(v3) {
            _classPrivateFieldSet$4(_A$4, this, v3);
          }
        }, {
          key: "top",
          get: function get() {
            return _classPrivateFieldGet$4(_B$4, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$4(_B$4, this, v3);
          }
        }, {
          key: "width",
          get: function get() {
            return _classPrivateFieldGet$4(_C$4, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$4(_C$4, this, v3);
          }
        }, {
          key: "height",
          get: function get() {
            return _classPrivateFieldGet$4(_D$3, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$4(_D$3, this, v3);
          }
        }, {
          key: "styles",
          get: function get() {
            return {
              left: px(this.left),
              top: px(this.top),
              width: px(this.width),
              height: px(this.height)
            };
          }
        }, {
          key: "render",
          value: function render() {
            return b2(_templateObject$6 || (_templateObject$6 = _taggedTemplateLiteral(['\n      <div class="mini-node" style=', ' data-testid="minimap-node"></div>\n    '])), styleMap(this.styles));
          }
        }]);
      }(i4);
      _MiniNode = MiniNode;
      _applyDecs$e$4 = _slicedToArray(_applyDecs$4(_MiniNode, [[_leftDecs$1, 1, "left"], [_topDecs$1, 1, "top"], [_widthDecs$1, 1, "width"], [_heightDecs$1, 1, "height"]], [], 0, void 0, i4).e, 5);
      _init_left$1 = _applyDecs$e$4[0];
      _init_top$1 = _applyDecs$e$4[1];
      _init_width$1 = _applyDecs$e$4[2];
      _init_height$1 = _applyDecs$e$4[3];
      _initProto$4 = _applyDecs$e$4[4];
      _defineProperty(MiniNode, "styles", i(_templateObject2$4 || (_templateObject2$4 = _taggedTemplateLiteral(["\n    .mini-node {\n      position: absolute;\n      background: rgba(110, 136, 255, 0.8);\n      border: 1px solid rgb(192 206 212 / 60%);\n    }\n  "]))));
      _A$3 = /* @__PURE__ */ new WeakMap();
      _B$3 = /* @__PURE__ */ new WeakMap();
      _C$3 = /* @__PURE__ */ new WeakMap();
      _D$2 = /* @__PURE__ */ new WeakMap();
      _E$2 = /* @__PURE__ */ new WeakMap();
      _F$1 = /* @__PURE__ */ new WeakMap();
      _ref$3 = (_leftDecs = n4({
        type: Number
      }), _topDecs = n4({
        type: Number
      }), _widthDecs = n4({
        type: Number
      }), _heightDecs = n4({
        type: Number
      }), _containerWidthDecs = n4({
        type: Number
      }), _onTranslateDecs$2 = n4({
        type: Function
      }), "left");
      MiniViewport = /* @__PURE__ */ function(_LitElement) {
        function MiniViewport2() {
          var _this;
          _classCallCheck(this, MiniViewport2);
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _callSuper$4(this, MiniViewport2, [].concat(args));
          _classPrivateFieldInitSpec$3(_this, _A$3, (_initProto$3(_this), _init_left(_this, 0)));
          _classPrivateFieldInitSpec$3(_this, _B$3, _init_top(_this, 0));
          _classPrivateFieldInitSpec$3(_this, _C$3, _init_width(_this, 0));
          _classPrivateFieldInitSpec$3(_this, _D$2, _init_height(_this, 0));
          _classPrivateFieldInitSpec$3(_this, _E$2, _init_containerWidth(_this, 0));
          _classPrivateFieldInitSpec$3(_this, _F$1, _init_onTranslate$2(_this, function() {
            return null;
          }));
          _defineProperty(_this, "drag", useDrag(_this.onDrag.bind(_this), function(e7) {
            return {
              x: e7.pageX,
              y: e7.pageY
            };
          }));
          return _this;
        }
        _inherits(MiniViewport2, _LitElement);
        return _createClass(MiniViewport2, [{
          key: _ref$3,
          get: function get() {
            return _classPrivateFieldGet$3(_A$3, this);
          }
        }, {
          key: "left",
          set: function set(v3) {
            _classPrivateFieldSet$3(_A$3, this, v3);
          }
        }, {
          key: "top",
          get: function get() {
            return _classPrivateFieldGet$3(_B$3, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$3(_B$3, this, v3);
          }
        }, {
          key: "width",
          get: function get() {
            return _classPrivateFieldGet$3(_C$3, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$3(_C$3, this, v3);
          }
        }, {
          key: "height",
          get: function get() {
            return _classPrivateFieldGet$3(_D$2, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$3(_D$2, this, v3);
          }
        }, {
          key: "containerWidth",
          get: function get() {
            return _classPrivateFieldGet$3(_E$2, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$3(_E$2, this, v3);
          }
        }, {
          key: "onTranslate",
          get: function get() {
            return _classPrivateFieldGet$3(_F$1, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$3(_F$1, this, v3);
          }
        }, {
          key: "scale",
          value: function scale(v3) {
            return v3 * this.containerWidth;
          }
        }, {
          key: "invert",
          value: function invert(v3) {
            return v3 / this.containerWidth;
          }
        }, {
          key: "onDrag",
          value: function onDrag(dx, dy) {
            this.onTranslate(this.invert(-dx), this.invert(-dy));
          }
        }, {
          key: "styles",
          get: function get() {
            return {
              left: px(this.scale(this.left)),
              top: px(this.scale(this.top)),
              width: px(this.scale(this.width)),
              height: px(this.scale(this.height))
            };
          }
        }, {
          key: "render",
          value: function render() {
            return b2(_templateObject$5 || (_templateObject$5 = _taggedTemplateLiteral(["\n      <div\n        @pointerdown=", "\n        style=", '\n        data-testid="minimap-viewport"\n        class="mini-viewport"\n      ></div>\n    '])), this.drag.start, styleMap(this.styles));
          }
        }]);
      }(i4);
      _MiniViewport = MiniViewport;
      _applyDecs$e$3 = _slicedToArray(_applyDecs$3(_MiniViewport, [[_leftDecs, 1, "left"], [_topDecs, 1, "top"], [_widthDecs, 1, "width"], [_heightDecs, 1, "height"], [_containerWidthDecs, 1, "containerWidth"], [_onTranslateDecs$2, 1, "onTranslate"]], [], 0, void 0, i4).e, 7);
      _init_left = _applyDecs$e$3[0];
      _init_top = _applyDecs$e$3[1];
      _init_width = _applyDecs$e$3[2];
      _init_height = _applyDecs$e$3[3];
      _init_containerWidth = _applyDecs$e$3[4];
      _init_onTranslate$2 = _applyDecs$e$3[5];
      _initProto$3 = _applyDecs$e$3[6];
      _defineProperty(MiniViewport, "styles", i(_templateObject2$3 || (_templateObject2$3 = _taggedTemplateLiteral(["\n    .mini-viewport {\n      position: absolute;\n      background: rgba(255, 251, 128, 0.32);\n      border: 1px solid #ffe52b;\n    }\n  "]))));
      _A$2 = /* @__PURE__ */ new WeakMap();
      _B$2 = /* @__PURE__ */ new WeakMap();
      _C$2 = /* @__PURE__ */ new WeakMap();
      _D$1 = /* @__PURE__ */ new WeakMap();
      _E$1 = /* @__PURE__ */ new WeakMap();
      _F = /* @__PURE__ */ new WeakMap();
      _G = /* @__PURE__ */ new WeakMap();
      _ref$2 = (_sizeDecs = n4({
        type: Number
      }), _ratioDecs = n4({
        type: Number
      }), _nodesDecs = n4({
        type: Array
      }), _viewportDecs = n4({
        type: Object
      }), _onTranslateDecs$1 = n4({
        type: Function
      }), _pointDecs = n4({
        type: Function
      }), _containerDecs = e5(".minimap"), "size");
      Minimap = /* @__PURE__ */ function(_LitElement) {
        function Minimap2() {
          var _this;
          _classCallCheck(this, Minimap2);
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _callSuper$3(this, Minimap2, [].concat(args));
          _classPrivateFieldInitSpec$2(_this, _A$2, (_initProto$2(_this), _init_size(_this, 0)));
          _classPrivateFieldInitSpec$2(_this, _B$2, _init_ratio(_this, 1));
          _classPrivateFieldInitSpec$2(_this, _C$2, _init_nodes(_this, []));
          _classPrivateFieldInitSpec$2(_this, _D$1, _init_viewport(_this));
          _classPrivateFieldInitSpec$2(_this, _E$1, _init_onTranslate$1(_this));
          _classPrivateFieldInitSpec$2(_this, _F, _init_point(_this));
          _classPrivateFieldInitSpec$2(_this, _G, _init_container(_this));
          return _this;
        }
        _inherits(Minimap2, _LitElement);
        return _createClass(Minimap2, [{
          key: _ref$2,
          get: function get() {
            return _classPrivateFieldGet$2(_A$2, this);
          }
        }, {
          key: "size",
          set: function set(v3) {
            _classPrivateFieldSet$2(_A$2, this, v3);
          }
        }, {
          key: "ratio",
          get: function get() {
            return _classPrivateFieldGet$2(_B$2, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$2(_B$2, this, v3);
          }
        }, {
          key: "nodes",
          get: function get() {
            return _classPrivateFieldGet$2(_C$2, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$2(_C$2, this, v3);
          }
        }, {
          key: "viewport",
          get: function get() {
            return _classPrivateFieldGet$2(_D$1, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$2(_D$1, this, v3);
          }
        }, {
          key: "onTranslate",
          get: function get() {
            return _classPrivateFieldGet$2(_E$1, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$2(_E$1, this, v3);
          }
        }, {
          key: "point",
          get: function get() {
            return _classPrivateFieldGet$2(_F, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$2(_F, this, v3);
          }
        }, {
          key: "container",
          get: function get() {
            return _classPrivateFieldGet$2(_G, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$2(_G, this, v3);
          }
        }, {
          key: "render",
          value: function render() {
            var _this2 = this;
            return b2(_templateObject$4 || (_templateObject$4 = _taggedTemplateLiteral(['\n      <div\n        class="minimap"\n        style="width: ', "; height: ", '"\n        @pointerdown="', '"\n        @dblclick="', '"\n        data-testid="minimap"\n      >\n        ', '\n      <rete-mini-viewport\n        .left="', '"\n        .top="', '"\n        .width="', '"\n        .height="', '"\n        .containerWidth="', '"\n        .onTranslate="', '"\n      ></rete-mini-viewport>\n      </div>\n    '])), px(this.size * this.ratio), px(this.size), this.preventDefault, this.dblclick, this.nodes.map(function(node, index4) {
              return b2(_templateObject2$2 || (_templateObject2$2 = _taggedTemplateLiteral(['<rete-mini-node\n            .left="', '"\n            .top="', '"\n            .width="', '"\n            .height="', '"\n            key="', "_", '"\n          ></rete-mini-node>'])), _this2.scale(node.left), _this2.scale(node.top), _this2.scale(node.width), _this2.scale(node.height), index4, node.left);
            }), this.viewport.left, this.viewport.top, this.viewport.width, this.viewport.height, this.container ? this.container.clientWidth : 0, this.onTranslate);
          }
        }, {
          key: "scale",
          value: function scale(value) {
            return this.container ? value * this.container.clientWidth : 0;
          }
        }, {
          key: "preventDefault",
          value: function preventDefault(event) {
            event.stopPropagation();
            event.preventDefault();
          }
        }, {
          key: "dblclick",
          value: function dblclick(event) {
            this.preventDefault(event);
            if (!this.container) return;
            var box = this.container.getBoundingClientRect();
            var x2 = (event.clientX - box.left) / (this.size * this.ratio);
            var y3 = (event.clientY - box.top) / (this.size * this.ratio);
            this.point(x2, y3);
          }
        }]);
      }(i4);
      _Minimap = Minimap;
      _applyDecs$e$2 = _slicedToArray(_applyDecs$2(_Minimap, [[_sizeDecs, 1, "size"], [_ratioDecs, 1, "ratio"], [_nodesDecs, 1, "nodes"], [_viewportDecs, 1, "viewport"], [_onTranslateDecs$1, 1, "onTranslate"], [_pointDecs, 1, "point"], [_containerDecs, 1, "container"]], [], 0, void 0, i4).e, 8);
      _init_size = _applyDecs$e$2[0];
      _init_ratio = _applyDecs$e$2[1];
      _init_nodes = _applyDecs$e$2[2];
      _init_viewport = _applyDecs$e$2[3];
      _init_onTranslate$1 = _applyDecs$e$2[4];
      _init_point = _applyDecs$e$2[5];
      _init_container = _applyDecs$e$2[6];
      _initProto$2 = _applyDecs$e$2[7];
      _defineProperty(Minimap, "styles", i(_templateObject3$1 || (_templateObject3$1 = _taggedTemplateLiteral(["\n    .minimap {\n      position: absolute;\n      right: 24px;\n      bottom: 24px;\n      background: rgba(229, 234, 239, 0.65);\n      padding: 20px;\n      overflow: hidden;\n      border: 1px solid #b1b7ff;\n      border-radius: 8px;\n      box-sizing: border-box;\n    }\n  "]))));
      customElements.define("rete-minimap", Minimap);
      customElements.define("rete-mini-node", MiniNode);
      customElements.define("rete-mini-viewport", MiniViewport);
      index$2 = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        setup: setup$1
      });
      pinSize = 20;
      _A$1 = /* @__PURE__ */ new WeakMap();
      _B$1 = /* @__PURE__ */ new WeakMap();
      _C$1 = /* @__PURE__ */ new WeakMap();
      _ref$1 = (_positionDecs = n4({
        type: Object
      }), _selectedDecs = n4({
        type: Boolean
      }), _getPointerDecs$1 = n4({
        type: Function
      }), "position");
      Pin = /* @__PURE__ */ function(_LitElement) {
        function Pin2() {
          var _this;
          _classCallCheck(this, Pin2);
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _callSuper$2(this, Pin2, [].concat(args));
          _classPrivateFieldInitSpec$1(_this, _A$1, (_initProto$1(_this), _init_position(_this, {
            x: 0,
            y: 0
          })));
          _classPrivateFieldInitSpec$1(_this, _B$1, _init_selected(_this, false));
          _classPrivateFieldInitSpec$1(_this, _C$1, _init_getPointer$1(_this, function() {
            return null;
          }));
          _defineProperty(_this, "drag", null);
          return _this;
        }
        _inherits(Pin2, _LitElement);
        return _createClass(Pin2, [{
          key: _ref$1,
          get: function get() {
            return _classPrivateFieldGet$1(_A$1, this);
          }
        }, {
          key: "position",
          set: function set(v3) {
            _classPrivateFieldSet$1(_A$1, this, v3);
          }
        }, {
          key: "selected",
          get: function get() {
            return _classPrivateFieldGet$1(_B$1, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$1(_B$1, this, v3);
          }
        }, {
          key: "getPointer",
          get: function get() {
            return _classPrivateFieldGet$1(_C$1, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet$1(_C$1, this, v3);
          }
        }, {
          key: "connectedCallback",
          value: function connectedCallback() {
            _superPropGet$1(Pin2, "connectedCallback", this, 3)([]);
            this.drag = useDrag(this.onDrag.bind(this), this.getPointer);
          }
        }, {
          key: "render",
          value: function render() {
            var style = "\n      top: ".concat(this.position.y - pinSize / 2, "px;\n      left: ").concat(this.position.x - pinSize / 2, "px;\n    ");
            return b2(_templateObject$2 || (_templateObject$2 = _taggedTemplateLiteral(['\n      <div\n        class="pin ', '"\n        style="', '"\n        @pointerdown="', '"\n        @contextmenu="', '"\n        data-testid="pin"\n      ></div>\n    '])), this.selected ? "selected" : "", style, this.onPointerDown, this.onContextMenu);
          }
        }, {
          key: "onPointerDown",
          value: function onPointerDown(event) {
            var _this$drag;
            event.stopPropagation();
            event.preventDefault();
            (_this$drag = this.drag) === null || _this$drag === void 0 ? void 0 : _this$drag.start(event);
            this.dispatchEvent(new CustomEvent("down", {
              detail: event
            }));
          }
        }, {
          key: "onContextMenu",
          value: function onContextMenu(event) {
            event.stopPropagation();
            event.preventDefault();
            this.dispatchEvent(new CustomEvent("menu", {
              detail: event
            }));
          }
        }, {
          key: "onDrag",
          value: function onDrag(dx, dy) {
            this.dispatchEvent(new CustomEvent("translate", {
              detail: {
                dx,
                dy
              }
            }));
          }
        }]);
      }(i4);
      _Pin = Pin;
      _applyDecs$e$1 = _slicedToArray(_applyDecs$1(_Pin, [[_positionDecs, 1, "position"], [_selectedDecs, 1, "selected"], [_getPointerDecs$1, 1, "getPointer"]], [], 0, void 0, i4).e, 4);
      _init_position = _applyDecs$e$1[0];
      _init_selected = _applyDecs$e$1[1];
      _init_getPointer$1 = _applyDecs$e$1[2];
      _initProto$1 = _applyDecs$e$1[3];
      _defineProperty(Pin, "styles", i(_templateObject2$1 || (_templateObject2$1 = _taggedTemplateLiteral(["\n    :host {\n      display: block;\n    }\n    .pin {\n      width: ", "px;\n      height: ", "px;\n      box-sizing: border-box;\n      background: steelblue;\n      border: 2px solid white;\n      border-radius: ", "px;\n      position: absolute;\n    }\n    .selected {\n      background: #ffd92c;\n    }\n  "])), pinSize, pinSize, pinSize));
      _A = /* @__PURE__ */ new WeakMap();
      _B = /* @__PURE__ */ new WeakMap();
      _C = /* @__PURE__ */ new WeakMap();
      _D = /* @__PURE__ */ new WeakMap();
      _E = /* @__PURE__ */ new WeakMap();
      _ref = (_pinsDecs = n4({
        type: Array
      }), _onMenuDecs = n4({
        type: Function
      }), _onTranslateDecs = n4({
        type: Function
      }), _onDownDecs = n4({
        type: Function
      }), _getPointerDecs = n4({
        type: Function
      }), "pins");
      Pins = /* @__PURE__ */ function(_LitElement) {
        function Pins2() {
          var _this;
          _classCallCheck(this, Pins2);
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _callSuper$14(this, Pins2, [].concat(args));
          _classPrivateFieldInitSpec(_this, _A, (_initProto(_this), _init_pins(_this, [])));
          _classPrivateFieldInitSpec(_this, _B, _init_onMenu(_this, function() {
            return null;
          }));
          _classPrivateFieldInitSpec(_this, _C, _init_onTranslate(_this, function() {
            return null;
          }));
          _classPrivateFieldInitSpec(_this, _D, _init_onDown(_this, function() {
            return null;
          }));
          _classPrivateFieldInitSpec(_this, _E, _init_getPointer(_this, function() {
            return null;
          }));
          return _this;
        }
        _inherits(Pins2, _LitElement);
        return _createClass(Pins2, [{
          key: _ref,
          get: function get() {
            return _classPrivateFieldGet(_A, this);
          }
        }, {
          key: "pins",
          set: function set(v3) {
            _classPrivateFieldSet(_A, this, v3);
          }
        }, {
          key: "onMenu",
          get: function get() {
            return _classPrivateFieldGet(_B, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet(_B, this, v3);
          }
        }, {
          key: "onTranslate",
          get: function get() {
            return _classPrivateFieldGet(_C, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet(_C, this, v3);
          }
        }, {
          key: "onDown",
          get: function get() {
            return _classPrivateFieldGet(_D, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet(_D, this, v3);
          }
        }, {
          key: "getPointer",
          get: function get() {
            return _classPrivateFieldGet(_E, this);
          },
          set: function set(v3) {
            _classPrivateFieldSet(_E, this, v3);
          }
        }, {
          key: "render",
          value: function render() {
            var _this2 = this;
            return b2(_templateObject$1 || (_templateObject$1 = _taggedTemplateLiteral(['\n      <div class="pins">\n        ', "\n      </div>\n    "])), this.pins.map(function(pin) {
              return b2(_templateObject2 || (_templateObject2 = _taggedTemplateLiteral(["\n          <rete-pin\n            .position=", "\n            .selected=", "\n            .getPointer=", "\n            @menu=", "\n            @translate=", "\n            @down=", "\n          ></rete-pin>\n        "])), pin.position, pin.selected, _this2.getPointer, function() {
                _this2.onMenu(pin.id);
              }, function(e7) {
                _this2.onTranslate(pin.id, e7.detail.dx, e7.detail.dy);
              }, function() {
                _this2.onDown(pin.id);
              });
            }));
          }
        }]);
      }(i4);
      _Pins = Pins;
      _applyDecs$e = _slicedToArray(_applyDecs(_Pins, [[_pinsDecs, 1, "pins"], [_onMenuDecs, 1, "onMenu"], [_onTranslateDecs, 1, "onTranslate"], [_onDownDecs, 1, "onDown"], [_getPointerDecs, 1, "getPointer"]], [], 0, void 0, i4).e, 6);
      _init_pins = _applyDecs$e[0];
      _init_onMenu = _applyDecs$e[1];
      _init_onTranslate = _applyDecs$e[2];
      _init_onDown = _applyDecs$e[3];
      _init_getPointer = _applyDecs$e[4];
      _initProto = _applyDecs$e[5];
      _defineProperty(Pins, "styles", i(_templateObject3 || (_templateObject3 = _taggedTemplateLiteral(["\n    .pins {\n      display: flex;\n      flex-direction: column;\n    }\n  "]))));
      customElements.define("rete-pins", Pins);
      customElements.define("rete-pin", Pin);
      index$1 = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        setup: setup2
      });
      index3 = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        classic: index$4,
        contextMenu: index$3,
        minimap: index$2,
        reroute: index$1
      });
      customElements.define("rete-root", RootElement);
      LitPlugin = /* @__PURE__ */ function(_Scope) {
        function LitPlugin2() {
          var _this;
          _classCallCheck(this, LitPlugin2);
          _this = _callSuper5(this, LitPlugin2, ["lit"]);
          _defineProperty(_this, "presets", []);
          _defineProperty(_this, "owners", /* @__PURE__ */ new WeakMap());
          _this.renderer = getRenderer();
          _this.addPipe(function(context) {
            if (!context || _typeof(context) !== "object" || !("type" in context)) return context;
            if (context.type === "unmount") {
              _this.unmount(context.data.element);
            } else if (context.type === "render") {
              if ("filled" in context.data && context.data.filled) {
                return context;
              }
              if (_this.mount(context.data.element, context)) {
                return _objectSpread3(_objectSpread3({}, context), {}, {
                  data: _objectSpread3(_objectSpread3({}, context.data), {}, {
                    filled: true
                  })
                });
              }
            }
            return context;
          });
          return _this;
        }
        _inherits(LitPlugin2, _Scope);
        return _createClass(LitPlugin2, [{
          key: "setParent",
          value: function setParent(scope) {
            var _this2 = this;
            _superPropGet2(LitPlugin2, "setParent", this, 3)([scope]);
            this.presets.forEach(function(preset) {
              if (preset.attach) preset.attach(_this2);
            });
          }
        }, {
          key: "mount",
          value: function mount(element, context) {
            var _this3 = this;
            var existing = this.renderer.get(element);
            var parent = this.parentScope();
            if (existing) {
              this.presets.forEach(function(preset) {
                if (_this3.owners.get(element) !== preset) return;
                var result = preset.update(context, _this3);
                if (result) {
                  _this3.renderer.update(existing, result);
                }
              });
              return true;
            }
            var _iterator = _createForOfIteratorHelper3(this.presets), _step;
            try {
              var _loop = function _loop2() {
                var preset = _step.value;
                var result = preset.render(context, _this3);
                if (!result) return 0;
                var _ref2 = context, data = _ref2.data;
                _this3.renderer.mount(element, result, function() {
                  return void parent.emit({
                    type: "rendered",
                    data
                  });
                });
                _this3.owners.set(element, preset);
                return {
                  v: true
                };
              }, _ret;
              for (_iterator.s(); !(_step = _iterator.n()).done; ) {
                _ret = _loop();
                if (_ret === 0) continue;
                if (_ret) return _ret.v;
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
          }
        }, {
          key: "unmount",
          value: function unmount(element) {
            this.owners["delete"](element);
            this.renderer.unmount(element);
          }
          /**
           * Adds a preset to the plugin.
           * @param preset Preset that can render nodes, connections and other elements.
           */
        }, {
          key: "addPreset",
          value: function addPreset(preset) {
            var local = preset;
            if (local.attach) local.attach(this);
            this.presets.push(local);
          }
        }]);
      }(Scope);
    }
  });

  // node_modules/lit-html/directive.js
  var t3, e6, i5;
  var init_directive = __esm({
    "node_modules/lit-html/directive.js"() {
      t3 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
      e6 = (t5) => (...e7) => ({ _$litDirective$: t5, values: e7 });
      i5 = class {
        constructor(t5) {
        }
        get _$AU() {
          return this._$AM._$AU;
        }
        _$AT(t5, e7, i7) {
          this._$Ct = t5, this._$AM = e7, this._$Ci = i7;
        }
        _$AS(t5, e7) {
          return this.update(t5, e7);
        }
        update(t5, e7) {
          return this.render(...e7);
        }
      };
    }
  });

  // node_modules/lit-html/directive-helpers.js
  var t4, i6, s4, v2, u3, m2, p3, M2, h3;
  var init_directive_helpers = __esm({
    "node_modules/lit-html/directive-helpers.js"() {
      init_lit_html();
      ({ I: t4 } = j);
      i6 = (o6) => o6;
      s4 = () => document.createComment("");
      v2 = (o6, n5, e7) => {
        const l3 = o6._$AA.parentNode, d3 = void 0 === n5 ? o6._$AB : n5._$AA;
        if (void 0 === e7) {
          const i7 = l3.insertBefore(s4(), d3), n6 = l3.insertBefore(s4(), d3);
          e7 = new t4(i7, n6, o6, o6.options);
        } else {
          const t5 = e7._$AB.nextSibling, n6 = e7._$AM, c5 = n6 !== o6;
          if (c5) {
            let t6;
            e7._$AQ?.(o6), e7._$AM = o6, void 0 !== e7._$AP && (t6 = o6._$AU) !== n6._$AU && e7._$AP(t6);
          }
          if (t5 !== d3 || c5) {
            let o7 = e7._$AA;
            for (; o7 !== t5; ) {
              const t6 = i6(o7).nextSibling;
              i6(l3).insertBefore(o7, d3), o7 = t6;
            }
          }
        }
        return e7;
      };
      u3 = (o6, t5, i7 = o6) => (o6._$AI(t5, i7), o6);
      m2 = {};
      p3 = (o6, t5 = m2) => o6._$AH = t5;
      M2 = (o6) => o6._$AH;
      h3 = (o6) => {
        o6._$AR(), o6._$AA.remove();
      };
    }
  });

  // node_modules/lit-html/directives/repeat.js
  var u4, c4;
  var init_repeat = __esm({
    "node_modules/lit-html/directives/repeat.js"() {
      init_lit_html();
      init_directive();
      init_directive_helpers();
      u4 = (e7, s5, t5) => {
        const r6 = /* @__PURE__ */ new Map();
        for (let l3 = s5; l3 <= t5; l3++) r6.set(e7[l3], l3);
        return r6;
      };
      c4 = e6(class extends i5 {
        constructor(e7) {
          if (super(e7), e7.type !== t3.CHILD) throw Error("repeat() can only be used in text expressions");
        }
        dt(e7, s5, t5) {
          let r6;
          void 0 === t5 ? t5 = s5 : void 0 !== s5 && (r6 = s5);
          const l3 = [], o6 = [];
          let i7 = 0;
          for (const s6 of e7) l3[i7] = r6 ? r6(s6, i7) : i7, o6[i7] = t5(s6, i7), i7++;
          return { values: o6, keys: l3 };
        }
        render(e7, s5, t5) {
          return this.dt(e7, s5, t5).values;
        }
        update(s5, [t5, r6, c5]) {
          const d3 = M2(s5), { values: p4, keys: a3 } = this.dt(t5, r6, c5);
          if (!Array.isArray(d3)) return this.ut = a3, p4;
          const h4 = this.ut ??= [], v3 = [];
          let m3, y3, x2 = 0, j2 = d3.length - 1, k2 = 0, w2 = p4.length - 1;
          for (; x2 <= j2 && k2 <= w2; ) if (null === d3[x2]) x2++;
          else if (null === d3[j2]) j2--;
          else if (h4[x2] === a3[k2]) v3[k2] = u3(d3[x2], p4[k2]), x2++, k2++;
          else if (h4[j2] === a3[w2]) v3[w2] = u3(d3[j2], p4[w2]), j2--, w2--;
          else if (h4[x2] === a3[w2]) v3[w2] = u3(d3[x2], p4[w2]), v2(s5, v3[w2 + 1], d3[x2]), x2++, w2--;
          else if (h4[j2] === a3[k2]) v3[k2] = u3(d3[j2], p4[k2]), v2(s5, d3[x2], d3[j2]), j2--, k2++;
          else if (void 0 === m3 && (m3 = u4(a3, k2, w2), y3 = u4(h4, x2, j2)), m3.has(h4[x2])) if (m3.has(h4[j2])) {
            const e7 = y3.get(a3[k2]), t6 = void 0 !== e7 ? d3[e7] : null;
            if (null === t6) {
              const e8 = v2(s5, d3[x2]);
              u3(e8, p4[k2]), v3[k2] = e8;
            } else v3[k2] = u3(t6, p4[k2]), v2(s5, d3[x2], t6), d3[e7] = null;
            k2++;
          } else h3(d3[j2]), j2--;
          else h3(d3[x2]), x2++;
          for (; k2 <= w2; ) {
            const e7 = v2(s5, v3[w2 + 1]);
            u3(e7, p4[k2]), v3[k2++] = e7;
          }
          for (; x2 <= j2; ) {
            const e7 = d3[x2++];
            null !== e7 && h3(e7);
          }
          return this.ut = a3, p3(s5, v3), E;
        }
      });
    }
  });

  // node_modules/lit/directives/repeat.js
  var init_repeat2 = __esm({
    "node_modules/lit/directives/repeat.js"() {
      init_repeat();
    }
  });

  // js/custom-node.js
  var CustomNodeElement;
  var init_custom_node = __esm({
    "js/custom-node.js"() {
      init_lit();
      init_repeat2();
      CustomNodeElement = class _CustomNodeElement extends i4 {
        createRenderRoot() {
          return this;
        }
        static get properties() {
          return {
            data: { type: Object },
            emit: { attribute: false },
            selected: { type: Boolean, reflect: true },
            onConfig: { attribute: false },
            onDelete: { attribute: false },
            error: { type: String, reflect: true },
            onErrorDetails: { attribute: false }
          };
        }
        static get styles() {
          return i`
      custom-node {
        display: block;
        width: 88px;
        height: 88px;
        position: relative;
      }
      .circular-node {
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--node-bg, white);
        border: 3px solid var(--node-border, #e2e8f0);
        border-radius: 50%;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        cursor: pointer;
        width: 88px;
        height: 88px;
        box-sizing: border-box;
        position: relative;
        user-select: none;
        transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s;
        z-index: 10;
      }
      .circular-node:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }
      .selected .circular-node,
      .circular-node.is-selected {
        box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.4) !important;
        transform: scale(1.05);
        border-color: rgb(99, 102, 241) !important;
      }
      .dark .selected .circular-node,
      .dark .circular-node.is-selected {
        box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.5) !important;
        border-color: rgb(99, 102, 241) !important;
      }
      .selected .selection-indicator {
        opacity: 1;
      }
      .selection-indicator {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 20px;
        height: 20px;
        background: rgb(99, 102, 241);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s, transform 0.2s;
        transform: scale(0.5);
        z-index: 20;
      }
      .dark .selection-indicator {
        background: rgb(129, 140, 248);
      }
      .dark .circular-node {
        --node-bg: #18181b;
        --node-border: #27272a;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
      }
      .icon-container {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: none;
      }
      .icon-container span {
        width: 35px;
        height: 35px;
      }
      .socket-container {
        position: absolute;
        top: 50%;
        margin-top: -12px; /* Half of 24px height for perfect centering */
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 100;
      }
      .socket-container.left {
        left: -12px;
      }
      .socket-container.right {
        right: -12px;
      }
      .error-node-btn {
        position: absolute;
        top: -4px;
        left: -4px;
        background: #ef4444;
        color: white;
        border: 2px solid white;
        border-radius: 50%;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
        animation: node-pulse 2s infinite;
      }
      @keyframes node-pulse {
        0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
        70% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
        100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
      }
      .node-actions-container {
        position: absolute;
        bottom: -40px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        gap: 8px;
        padding: 4px 8px;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 20px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transition: opacity 0.2s, transform 0.2s;
        z-index: 50;
        pointer-events: auto;
      }
      .dark .node-actions-container {
        background: #18181b;
        border-color: #27272a;
      }
      custom-node:hover .node-actions-container,
      .node-actions-container:hover {
        opacity: 1;
        transform: translateX(-50%) translateY(2px);
      }
      .node-action-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.1s, filter 0.2s;
        border: none;
        color: white;
      }
      .node-action-btn:hover {
        transform: scale(1.1);
        filter: brightness(1.1);
      }
      .node-action-btn.delete {
        background: #f87171;
      }
      .node-action-btn.config {
        background: #6366f1;
      }
      .node-name-hover {
        position: absolute;
        top: -32px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(31, 41, 55, 0.9);
        color: white;
        padding: 4px 10px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.2s, transform 0.2s;
        pointer-events: none;
        z-index: 60;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
      }
      .dark .node-name-hover {
        background: rgba(24, 24, 27, 0.95);
        border: 1px solid rgba(63, 63, 70, 0.5);
      }
      custom-node:hover .node-name-hover {
        opacity: 1;
        transform: translateX(-50%) translateY(-4px);
      }
      .language-badge {
        position: absolute;
        bottom: 4px;
        right: 4px;
        background: #4f46e5;
        color: white;
        font-size: 9px;
        font-weight: 800;
        padding: 2px 4px;
        border-radius: 4px;
        text-transform: uppercase;
        border: 1px solid white;
        line-height: 1;
        z-index: 20;
        pointer-events: none;
      }
      .dark .language-badge {
        border-color: #18181b;
      }
    `;
        }
        connectedCallback() {
          super.connectedCallback();
          if (!document.getElementById("custom-node-styles")) {
            const style = document.createElement("style");
            style.id = "custom-node-styles";
            style.textContent = _CustomNodeElement.styles.cssText;
            document.head.appendChild(style);
          }
        }
        render() {
          const inputs = Object.entries(this.data.inputs || {});
          const outputs = Object.entries(this.data.outputs || {});
          const category = this.data.category || "default";
          const colors = {
            "trigger": "#10b981",
            "flow_control": "#6366f1",
            "code": "#818cf8",
            "data_manipulation": "#f59e0b",
            "integration": "#ec4899",
            "utility": "#64748b",
            "default": "#64748b"
          };
          const nodeColor = colors[category] || colors["default"];
          const language = this.data.controls?.language?.value;
          const langLabel = language === "elixir" ? "EX" : language === "python" ? "PY" : null;
          return b2`
      <div class="node-name-hover">${this.data.label || this.data.name}</div>

      <div 
        class="circular-node ${this.selected ? "is-selected" : ""}" 
        style="border-color: ${nodeColor}aa"
        @pointerdown=${(e7) => {
            if (e7.shiftKey) {
              e7.preventDefault();
              e7.stopPropagation();
              this.selected = !this.selected;
              const nodeId = this.data.id;
              const reteNode = window.reteEditorInstance?.getNode(nodeId);
              if (reteNode) {
                reteNode.selected = this.selected;
              }
              this.requestUpdate();
              this.dispatchEvent(new CustomEvent("node-select", {
                bubbles: true,
                detail: { selected: this.selected, nodeId: this.data.id }
              }));
            } else if (this._onPointerDown) {
              this._onPointerDown(e7);
            }
          }}
      >
        ${this.selected ? b2`
          <div class="selection-indicator">
            <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
          </div>
        ` : ""}
        ${this.error ? b2`
          <div 
            class="error-node-btn"
            style="position: absolute; top: -4px; left: -4px; background: #ef4444; color: white; border: 2px solid white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; z-index: 50; animation: node-pulse 2s infinite;"
            @click=${(e7) => {
            e7.stopPropagation();
            if (this.onErrorDetails) this.onErrorDetails();
          }}
          >!</div>
        ` : ""}

        <div class="icon-container" style="color: ${nodeColor}">
          <span class="${this.data.icon || "hero-cube"}"></span>
        </div>

        ${langLabel ? b2`
          <div class="language-badge">${langLabel}</div>
        ` : ""}
      </div>

      <div class="node-actions-container">
        <div 
          class="node-action-btn config" 
          title="Configure Node"
          @pointerdown=${(e7) => e7.stopPropagation()}
          @mousedown=${(e7) => e7.stopPropagation()}
          @click=${(e7) => {
            e7.stopPropagation();
            if (this.onConfig) this.onConfig();
          }}
        >
          <span class="hero-cog-6-tooth w-4 h-4"></span>
        </div>

        <div 
          class="node-action-btn delete" 
          title="Delete Node"
          @pointerdown=${(e7) => e7.stopPropagation()}
          @mousedown=${(e7) => e7.stopPropagation()}
          @click=${(e7) => {
            e7.stopPropagation();
            if (this.onDelete) this.onDelete();
          }}
        >
          <span class="hero-x-mark w-4 h-4"></span>
        </div>
      </div>

      ${c4(inputs, ([key]) => key, ([key, input]) => b2`
        <div class="socket-container left" key="input-${key}" data-key="${key}" data-side="input"></div>
      `)}

      ${c4(outputs, ([key]) => key, ([key, output]) => b2`
        <div class="socket-container right" key="output-${key}" data-key="${key}" data-side="output"></div>
      `)}
    `;
        }
        _onPointerDown(e7) {
          this._clickHandled = false;
          this._downTime = Date.now();
        }
        _onClick(e7) {
          const duration = Date.now() - this._downTime;
          if (duration < 300) {
            if (this.onConfig) {
              this.onConfig();
              this._clickHandled = true;
            }
          }
        }
        bindSocket(el, type, key) {
          if (el && this.data && this.emit) {
            if (el._bound) return;
            el._bound = true;
            this.emit({
              type: "render",
              data: {
                type: "socket",
                element: el,
                payload: type === "input" ? this.data.inputs[key] : this.data.outputs[key],
                side: type,
                key,
                nodeId: this.data.id
              }
            });
          }
        }
        updated() {
          this.querySelectorAll(".socket-container").forEach((el) => {
            const type = el.dataset.side;
            const key = el.dataset.key;
            this.bindSocket(el, type, key);
          });
        }
      };
    }
  });

  // js/custom-connection.js
  var CustomConnectionElement;
  var init_custom_connection = __esm({
    "js/custom-connection.js"() {
      init_lit();
      CustomConnectionElement = class extends i4 {
        static get styles() {
          return i`
      :host {
        cursor: pointer;
        display: block;
      }
      svg {
        overflow: visible !important;
        position: absolute;
        pointer-events: none;
        width: 9999px;
        height: 9999px;
      }
      path.hit-area {
        fill: none;
        stroke: transparent;
        stroke-width: 24px;
        pointer-events: auto;
        cursor: pointer;
      }
      path.visible {
        fill: none;
        stroke-width: 5px;
        stroke: #4338ca;
        pointer-events: none;
        transition: stroke-width 0.15s ease, stroke 0.15s ease;
      }
      path.visible.selected {
        stroke: oklch(58% 0.233 277.117);
        stroke-width: 7px;
      }
      path.visible:hover {
        stroke-width: 6px;
      }
    `;
        }
        static get properties() {
          return {
            path: { type: String },
            connectionId: { type: String },
            selected: { type: Boolean }
          };
        }
        render() {
          return b2`
      <svg>
        <path class="hit-area" d="${this.path}" @click=${this._onClick} @contextmenu=${this._onContextMenu}></path>
        <path
          class="visible ${this.selected ? "selected" : ""}"
          d="${this.path}"
        ></path>
      </svg>
    `;
        }
        _onClick(e7) {
          e7.stopPropagation();
          this.dispatchEvent(new CustomEvent("connection-click", {
            detail: { connectionId: this.connectionId, shiftKey: e7.shiftKey, ctrlKey: e7.ctrlKey, metaKey: e7.metaKey },
            bubbles: true,
            composed: true
          }));
        }
        _onContextMenu(e7) {
          e7.preventDefault();
          e7.stopPropagation();
          this.dispatchEvent(new CustomEvent("connection-contextmenu", {
            detail: { connectionId: this.connectionId, clientX: e7.clientX, clientY: e7.clientY },
            bubbles: true,
            composed: true
          }));
        }
      };
    }
  });

  // js/custom-socket.js
  var CustomSocketElement;
  var init_custom_socket = __esm({
    "js/custom-socket.js"() {
      init_lit();
      CustomSocketElement = class extends i4 {
        static get styles() {
          return i`
      :host {
        display: block;
        width: 24px;
        height: 24px;
        padding: 0;
        margin: 0;
      }
      .socket {
        width: 100% !important;
        height: 100% !important;
        background: #4338ca !important;
        border: 2px solid white !important;
        border-radius: 50%;
        cursor: pointer;
        z-index: 50;
        box-sizing: border-box;
        display: block !important;
      }
      .socket:hover {
        background: #3730a3 !important;
        border-width: 3px !important;
        transform: scale(1.1);
      }
      
      :host-context(.dark) .socket {
        border-color: #334155;
      }
      :host(.multiple) {
        border-color: yellow;
      }
      :host(.multiple) {
        border-color: yellow;
      }
    `;
        }
        static get properties() {
          return {
            data: { type: Object }
          };
        }
        render() {
          return b2`
        <div class="socket" title="${this.data?.payload?.label || ""}"></div>
        `;
        }
      };
    }
  });

  // js/custom-background.js
  function addCustomBackground(area) {
    const background = document.createElement("div");
    background.classList.add("background");
    background.classList.add("fill-area");
    background.classList.add("rete-bg-grid");
    background.style.zIndex = "-1";
    background.style.position = "absolute";
    background.style.top = "0";
    background.style.left = "0";
    background.style.width = "100%";
    background.style.height = "100%";
    background.style.pointerEvents = "none";
    area.area.content.add(background);
  }
  var init_custom_background = __esm({
    "js/custom-background.js"() {
    }
  });

  // js/custom-control.js
  var CustomControlElement;
  var init_custom_control = __esm({
    "js/custom-control.js"() {
      init_lit();
      CustomControlElement = class extends i4 {
        static get styles() {
          return i`
      :host {
        display: block;
        padding: 4px 0;
      }
      
      :host {
        --input-bg: #f8fafc;
        --input-border: #e2e8f0;
        --input-text: #1e293b;
        --input-placeholder: #94a3b8;
      }

      :host-context(.dark) {
        --input-bg: #334155;
        --input-border: #475569;
        --input-text: #f1f5f9;
        --input-placeholder: #94a3b8;
      }
      
      input, textarea, select {
        width: 100%;
        border-radius: 6px;
        background-color: var(--input-bg);
        padding: 8px 10px;
        border: 1px solid var(--input-border);
        font-size: 13px;
        line-height: 1.5;
        box-sizing: border-box;
        color: var(--input-text);
        font-family: inherit;
        transition: all 0.2s;
        outline: none;
      }

      input::placeholder, textarea::placeholder {
        color: var(--input-placeholder);
      }

      input:focus, textarea:focus, select:focus {
        border-color: #6366f1;
        box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.1);
      }

      textarea {
          resize: vertical;
          min-height: 80px;
          font-family: monospace;
      }
      
      .label {
        font-size: 11px;
        color: var(--input-label, #64748b);
        margin-bottom: 2px;
        font-weight: 600;
        text-transform: uppercase;
        display: block;
      }
    `;
        }
        static get properties() {
          return {
            type: { type: String },
            value: { type: String },
            readonly: { type: Boolean },
            label: { type: String },
            options: { type: Array },
            onChange: { attribute: false },
            onClick: { attribute: false }
          };
        }
        render() {
          const labelTemplate = this.label && this.type !== "code-icon" && this.type !== "code-button" ? b2`<div class="label">${this.label}</div>` : "";
          if (this.type === "area") {
            return b2`
            ${labelTemplate}
            <textarea
                @pointerdown=${(e7) => e7.stopPropagation()}
                @input=${(e7) => this.onChange && this.onChange(e7.target.value)}
                .value=${this.value || ""}
                ?readonly=${this.readonly}
                placeholder=${this.label || "Code..."}
            ></textarea>
          `;
          }
          if (this.type === "code-icon") {
            return b2``;
          }
          if (this.type === "code-button") {
            return b2`
            <button
                @pointerdown=${(e7) => e7.stopPropagation()}
                @click=${(e7) => {
              if (this.onClick) this.onClick();
            }}
                style="width: 100%; box-sizing: border-box; background: #4338ca; color: white; border: none; padding: 6px; border-radius: 4px; cursor: pointer;"
            >
                ${this.label || window.Translations && window.Translations["Edit Code"] || "Edit Code"}
            </button>
          `;
          }
          if (this.type === "select") {
            const options = this.options || [];
            return b2`
        ${labelTemplate}
        <select
          @pointerdown=${(e7) => e7.stopPropagation()}
          @change=${(e7) => this.onChange && this.onChange(e7.target.value)}
          .value=${this.value || ""}
        >
          ${options.map((opt) => {
              const value = typeof opt === "object" ? opt.value : opt;
              const label = typeof opt === "object" ? opt.label : opt;
              return b2`<option value=${value} ?selected=${this.value === value}>${label}</option>`;
            })}
        </select>
      `;
          }
          return b2`
      ${labelTemplate}
      <input
        type=${this.type || "text"}
        @pointerdown=${(e7) => e7.stopPropagation()} 
        @input=${(e7) => this.onChange && this.onChange(e7.target.value)}
        .value=${this.value || ""}
        ?readonly=${this.readonly}
        placeholder=${this.label || ""}
      />
    `;
        }
      };
    }
  });

  // js/rete_editor.js
  var rete_editor_exports = {};
  __export(rete_editor_exports, {
    createEditor: () => createEditor
  });
  async function createEditor(container) {
    const socket = new classic.Socket("socket");
    const editor = new NodeEditor();
    const area = new AreaPlugin(container);
    const connection = new ConnectionPlugin();
    const render = new LitPlugin();
    const selectedNodeIds = /* @__PURE__ */ new Set();
    const selectNode = (nodeId, add = false) => {
      if (!add) selectedNodeIds.clear();
      selectedNodeIds.add(nodeId);
      updateNodeSelectionVisuals();
    };
    const deselectNode = (nodeId) => {
      selectedNodeIds.delete(nodeId);
      updateNodeSelectionVisuals();
    };
    const clearNodeSelection = () => {
      selectedNodeIds.clear();
      updateNodeSelectionVisuals();
    };
    const updateNodeSelectionVisuals = () => {
      for (const node of editor.getNodes()) {
        const sel = selectedNodeIds.has(node.id);
        node.selected = sel;
        const view = area.nodeViews.get(node.id);
        if (view && view.element) {
          const customNode = view.element.querySelector("custom-node");
          if (customNode) {
            customNode.selected = sel;
            customNode.requestUpdate();
          }
        }
      }
    };
    index.selectableNodes(area, index.selector(), {
      accumulating: index.accumulateOnCtrl()
    });
    const selectedConnectionIds = /* @__PURE__ */ new Set();
    const selectConnection = (connId, addToSelection = false) => {
      if (!addToSelection) selectedConnectionIds.clear();
      selectedConnectionIds.add(connId);
      area.update("connection", connId);
    };
    const clearConnectionSelection = () => {
      if (selectedConnectionIds.size === 0) return;
      selectedConnectionIds.clear();
      editor.getConnections().forEach((c5) => area.update("connection", c5.id));
    };
    render.addPreset(
      index3.classic.setup({
        customize: {
          node(data) {
            return ({ emit }) => b2`<custom-node 
                .data=${data.payload} 
                .emit=${emit} 
                class="${data.payload.selected ? "selected" : ""}"
                .onDelete=${async () => {
              const nodeId = data.payload.id;
              const connections = editor.getConnections();
              for (const conn of connections) {
                if (conn.source === nodeId || conn.target === nodeId) {
                  await editor.removeConnection(conn.id);
                }
              }
              await editor.removeNode(nodeId);
            }}
                .onConfig=${() => {
              if (editor.triggerNodeConfig) {
                const node = data.payload;
                const variables = getUpstreamVariables(node.id);
                const cleanData = {
                  id: node.id,
                  label: node.label,
                  controls: {},
                  variables
                };
                if (node.controls) {
                  Object.entries(node.controls).forEach(([key, control]) => {
                    cleanData.controls[key] = {
                      value: control.value,
                      label: control.label || key,
                      type: control.type || "text",
                      options: control.options || []
                    };
                  });
                }
                editor.triggerNodeConfig(node.id, cleanData);
              }
            }}
                .onErrorDetails=${() => {
              if (editor.triggerErrorDetails) {
                const node = data.payload;
                const view = area.nodeViews.get(node.id);
                let message = "Error details not available";
                if (view && view.element) {
                  const customNode = view.element.querySelector("custom-node");
                  if (customNode && customNode.error) {
                    message = customNode.error;
                  }
                }
                editor.triggerErrorDetails(node.id, message);
              }
            }}
                .onControlChange=${(key, value) => {
              if (editor.triggerChange) {
                const node = data.payload;
                if (node.controls[key]) {
                  node.controls[key].value = value;
                  editor.triggerChange();
                }
              }
            }}
            ></custom-node>`;
          },
          connection(data) {
            const connId = data.payload?.id;
            const selected = connId ? selectedConnectionIds.has(connId) : false;
            return (props) => b2`<custom-connection
                            .path=${props.path}
                            .connectionId=${connId}
                            .selected=${selected}
                            data-connection-id=${connId || ""}
                            @connection-click=${(e7) => {
              if (e7.detail && e7.detail.connectionId) {
                selectConnection(e7.detail.connectionId, e7.detail.shiftKey || e7.detail.ctrlKey || e7.detail.metaKey);
              }
            }}
                        ></custom-connection>`;
          },
          socket(data) {
            return () => b2`<custom-socket .data=${data}></custom-socket>`;
          }
        }
      })
    );
    connection.addPreset(index2.classic.setup());
    addCustomBackground(area);
    editor.use(area);
    area.use(connection);
    area.use(render);
    index.simpleNodesOrder(area);
    let isMultiNodeDragging = false;
    let isTranslatingSelection = false;
    const clearMultiDragCursor = () => {
      if (isMultiNodeDragging) {
        isMultiNodeDragging = false;
        container.style.cursor = "";
      }
      window.removeEventListener("pointerup", clearMultiDragCursor);
    };
    area.addPipe(async (context) => {
      if (!context || context.type !== "nodetranslated") return context;
      if (isTranslatingSelection) return context;
      const { id: draggedId, position, previous } = context.data;
      const delta = { x: position.x - previous.x, y: position.y - previous.y };
      if (selectedNodeIds.size <= 1) return context;
      if (!selectedNodeIds.has(draggedId)) return context;
      const selected = editor.getNodes().filter((n5) => selectedNodeIds.has(n5.id));
      if (!isMultiNodeDragging) {
        isMultiNodeDragging = true;
        container.style.cursor = "grabbing";
        window.addEventListener("pointerup", clearMultiDragCursor, { once: true });
      }
      isTranslatingSelection = true;
      try {
        for (const node of selected) {
          if (node.id === draggedId) continue;
          const view = area.nodeViews.get(node.id);
          if (view) {
            const p4 = view.position;
            await area.translate(node.id, { x: p4.x + delta.x, y: p4.y + delta.y });
          }
        }
      } finally {
        isTranslatingSelection = false;
      }
      return context;
    });
    const UNDO_MAX = 50;
    const undoStack = [];
    const redoStack = [];
    let isRestoring = false;
    let isImportingData = false;
    let isDeletingSelection = false;
    let translateDebounce = null;
    let lastImportOrRestoreTime = 0;
    const IGNORE_TRANSLATED_MS = 600;
    const processChange = () => {
      if (editor.triggerChange) editor.triggerChange();
    };
    const getSnapshot = () => {
      const nodes = [];
      const connections = [];
      for (const node of editor.getNodes()) {
        const controls = {};
        Object.keys(node.controls).forEach((key) => {
          controls[key] = node.controls[key].value;
        });
        nodes.push({
          id: node.id,
          type: node.type || node.label,
          label: node.label,
          controls,
          position: area.nodeViews.get(node.id)?.position || { x: 0, y: 0 }
        });
      }
      for (const conn of editor.getConnections()) {
        connections.push({
          source: conn.source,
          sourceOutput: conn.sourceOutput,
          target: conn.target,
          targetInput: conn.targetInput
        });
      }
      return { nodes, connections };
    };
    const clearSelection = () => {
      clearNodeSelection();
    };
    const pushUndo = () => {
      if (isRestoring || isTranslatingSelection) return;
      const snapshot = getSnapshot();
      const top2 = undoStack[undoStack.length - 1];
      if (top2 && isSameSnapshot(top2, snapshot)) return;
      undoStack.push(snapshot);
      if (undoStack.length > UNDO_MAX) undoStack.shift();
      redoStack.length = 0;
    };
    const isSameSnapshot = (a3, b3) => {
      if (a3.nodes.length !== b3.nodes.length || a3.connections.length !== b3.connections.length) return false;
      const aIds = new Set(a3.nodes.map((n5) => n5.id));
      const bIds = new Set(b3.nodes.map((n5) => n5.id));
      if (aIds.size !== bIds.size) return false;
      for (const id of aIds) {
        if (!bIds.has(id)) return false;
      }
      const aConnKeys = new Set(a3.connections.map((c5) => `${c5.source}:${c5.sourceOutput}-${c5.target}:${c5.targetInput}`));
      const bConnKeys = new Set(b3.connections.map((c5) => `${c5.source}:${c5.sourceOutput}-${c5.target}:${c5.targetInput}`));
      if (aConnKeys.size !== bConnKeys.size) return false;
      for (const k2 of aConnKeys) {
        if (!bConnKeys.has(k2)) return false;
      }
      return true;
    };
    const restoreState = async (snapshot) => {
      const { nodes, connections } = snapshot;
      const definitions = editor.nodeDefinitions || {};
      if (translateDebounce) {
        clearTimeout(translateDebounce);
        translateDebounce = null;
      }
      isRestoring = true;
      lastImportOrRestoreTime = Date.now();
      try {
        await editor.clear();
        editor.nodeDefinitions = definitions;
        for (const nodeData of nodes) {
          const nodeType = nodeData.type || nodeData.label;
          const definition = definitions[nodeType];
          if (!definition) continue;
          await processAddNode(nodeType, definition, nodeData);
        }
        for (const connData of connections) {
          const sourceNode = editor.getNode(connData.source);
          const targetNode = editor.getNode(connData.target);
          if (sourceNode && targetNode) {
            try {
              await editor.addConnection(
                new classic.Connection(
                  sourceNode,
                  connData.sourceOutput,
                  targetNode,
                  connData.targetInput
                )
              );
            } catch (e7) {
            }
          }
        }
        clearSelection();
        if (nodes.length > 0) {
          index.zoomAt(area, editor.getNodes());
        }
      } finally {
        isRestoring = false;
      }
    };
    const getUpstreamVariables = (startNodeId) => {
      const variables = /* @__PURE__ */ new Set();
      const visited = /* @__PURE__ */ new Set();
      const queue = [startNodeId];
      while (queue.length > 0) {
        const currentId = queue.shift();
        if (visited.has(currentId)) continue;
        visited.add(currentId);
        const currentNode = editor.getNode(currentId);
        if (!currentNode) continue;
        if ((currentNode.type === "Variable" || currentNode.label === "Variable") && currentNode.id !== startNodeId) {
          const varName = currentNode.controls.var_name?.value;
          if (varName) variables.add(varName);
        }
        const connections = editor.getConnections().filter((c5) => c5.target === currentId);
        for (const conn of connections) {
          queue.push(conn.source);
        }
      }
      return Array.from(variables);
    };
    editor.addPipe((context) => {
      if (context.type === "nodecreated" || context.type === "noderemoved" || context.type === "connectioncreated" || context.type === "connectionremoved" || context.type === "translated") {
        processChange();
        if (!isRestoring && !isImportingData && !isTranslatingSelection && !isDeletingSelection) {
          if (context.type === "translated") {
            if (Date.now() - lastImportOrRestoreTime < IGNORE_TRANSLATED_MS) return context;
            if (translateDebounce) clearTimeout(translateDebounce);
            translateDebounce = setTimeout(() => {
              translateDebounce = null;
              pushUndo();
            }, 400);
          } else {
            if (translateDebounce) {
              clearTimeout(translateDebounce);
              translateDebounce = null;
            }
            pushUndo();
          }
        }
      }
      return context;
    });
    pushUndo();
    container.addEventListener("dragover", (e7) => {
      e7.preventDefault();
      e7.dataTransfer.dropEffect = "copy";
    });
    container.addEventListener("drop", async (e7) => {
      e7.preventDefault();
      const nodeName = e7.dataTransfer.getData("application/vnd.fusionflow.node");
      if (!nodeName) return;
      if (editor.handleDrop) {
        const rect = container.getBoundingClientRect();
        const { k: k2, x: tx, y: ty } = area.area.transform;
        const x2 = (e7.clientX - rect.left - tx - 40 * k2) / k2;
        const y3 = (e7.clientY - rect.top - ty - 40 * k2) / k2;
        editor.handleDrop(nodeName, { x: x2, y: y3 });
      }
    });
    let isSelecting = false;
    let selectionStartX = 0;
    let selectionStartY = 0;
    const createSelectionBox = () => {
      const box = document.createElement("div");
      box.id = "rete-selection-box";
      document.body.appendChild(box);
      return box;
    };
    const selectionBox = createSelectionBox();
    const updateSelectionBox = (startX, startY, endX, endY) => {
      const left = Math.min(startX, endX);
      const top2 = Math.min(startY, endY);
      const width = Math.abs(endX - startX);
      const height = Math.abs(endY - startY);
      selectionBox.style.cssText = `
            position: fixed;
            left: ${left}px;
            top: ${top2}px;
            width: ${width}px;
            height: ${height}px;
            border: 2px solid oklch(58% 0.233 277.117);
            background: oklch(58% 0.233 277.117 / 0.1);
            border-radius: 0.5rem;
            z-index: 9999;
            pointer-events: none;
            display: ${width > 5 && height > 5 ? "block" : "none"};
        `;
    };
    const selectNodesInBox = () => {
      const boxRect = selectionBox.getBoundingClientRect();
      const { k: k2, x: tx, y: ty } = area.area.transform;
      const boxLeft = (boxRect.left - tx) / k2;
      const boxRight = (boxRect.right - tx) / k2;
      const boxTop = (boxRect.top - ty) / k2;
      const boxBottom = (boxRect.bottom - ty) / k2;
      const nodesInBox = [];
      editor.getNodes().forEach((node) => {
        const view = area.nodeViews.get(node.id);
        if (view && view.element) {
          const nodeEl = view.element;
          const nodeRect = nodeEl.getBoundingClientRect();
          const nodeLeft = (nodeRect.left - tx) / k2;
          const nodeRight = (nodeRect.right - tx) / k2;
          const nodeTop = (nodeRect.top - ty) / k2;
          const nodeBottom = (nodeRect.bottom - ty) / k2;
          const overlaps = !(nodeRight < boxLeft || nodeLeft > boxRight || nodeBottom < boxTop || nodeTop > boxBottom);
          if (overlaps) nodesInBox.push(node);
        }
      });
      selectedNodeIds.clear();
      nodesInBox.forEach((node) => selectedNodeIds.add(node.id));
      updateNodeSelectionVisuals();
      const nodeIdsInBox = new Set(nodesInBox.map((n5) => n5.id));
      selectedConnectionIds.clear();
      editor.getConnections().forEach((conn) => {
        if (nodeIdsInBox.has(conn.source) && nodeIdsInBox.has(conn.target)) {
          selectedConnectionIds.add(conn.id);
        }
      });
      editor.getConnections().forEach((c5) => area.update("connection", c5.id));
      selectionBox.style.display = "none";
      if (area.area.privateDragInit) {
        area.area.setDragHandler(area.area.privateDragInit);
      }
      isSelecting = false;
    };
    const handleSelectionMove = (e7) => {
      if (isSelecting) {
        e7.preventDefault();
        updateSelectionBox(selectionStartX, selectionStartY, e7.clientX, e7.clientY);
      }
    };
    const handleSelectionUp = (e7) => {
      if (isSelecting) {
        e7.preventDefault();
        document.removeEventListener("mousemove", handleSelectionMove);
        document.removeEventListener("mouseup", handleSelectionUp);
        selectNodesInBox();
      }
    };
    document.addEventListener("pointerdown", (e7) => {
      if (e7.button !== 0 || !container.contains(e7.target)) return;
      let clickedNodeId = null;
      for (const [nodeId, view] of area.nodeViews) {
        if (view.element && (view.element.contains(e7.target) || view.element === e7.target)) {
          clickedNodeId = nodeId;
          break;
        }
      }
      if (!clickedNodeId) {
        const el = document.elementFromPoint(e7.clientX, e7.clientY);
        for (const [nodeId, view] of area.nodeViews) {
          if (view.element && view.element.contains(el)) {
            clickedNodeId = nodeId;
            break;
          }
        }
      }
      if ((e7.shiftKey || e7.ctrlKey || e7.metaKey) && clickedNodeId) {
        if (selectedNodeIds.has(clickedNodeId)) {
          deselectNode(clickedNodeId);
        } else {
          selectNode(clickedNodeId, true);
        }
        e7.stopPropagation();
        e7.preventDefault();
        return;
      }
      if (clickedNodeId) {
        if (!selectedNodeIds.has(clickedNodeId)) {
          selectNode(clickedNodeId, false);
        }
      }
    }, true);
    container.addEventListener("mousedown", (e7) => {
      if (!container.contains(e7.target)) return;
      const containerRect = container.getBoundingClientRect();
      const isInsideContainer = e7.clientX >= containerRect.left && e7.clientX <= containerRect.right && e7.clientY >= containerRect.top && e7.clientY <= containerRect.bottom;
      if (!isInsideContainer) return;
      const isBackground = e7.target === container || e7.target.classList.contains("rete-area") || e7.target.classList.contains("scene-layer") || e7.target.classList.contains("layer");
      const clickedElement = document.elementFromPoint(e7.clientX, e7.clientY);
      let clickedNodeId = null;
      const nodeViews = area.nodeViews;
      for (const [nodeId, view] of nodeViews) {
        if (view.element && view.element.contains(clickedElement)) {
          clickedNodeId = nodeId;
          break;
        }
      }
      if (e7.shiftKey && isBackground) {
        e7.preventDefault();
        e7.stopPropagation();
        isSelecting = true;
        area.area.privateDragInit = area.area.dragHandler;
        area.area.setDragHandler(null);
        selectionStartX = e7.clientX;
        selectionStartY = e7.clientY;
        updateSelectionBox(selectionStartX, selectionStartY, selectionStartX, selectionStartY);
        document.addEventListener("mousemove", handleSelectionMove);
        document.addEventListener("mouseup", handleSelectionUp);
      } else if (isBackground && e7.button === 0) {
        clearNodeSelection();
        clearConnectionSelection();
      } else if (clickedNodeId && e7.button === 0) {
        clearConnectionSelection();
      }
    });
    let contextMenu = null;
    let contextMenuX = 0;
    let contextMenuY = 0;
    window.copiedNodesData = [];
    const removeContextMenu = () => {
      if (contextMenu) {
        contextMenu.remove();
        contextMenu = null;
      }
    };
    const createContextMenu = (x2, y3, contextMenuConnectionId = null) => {
      removeContextMenu();
      contextMenuX = x2;
      contextMenuY = y3;
      const menu = document.createElement("div");
      menu.className = "fixed z-[200] bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-700 py-1.5 min-w-[200px]";
      const allNodes = editor.getNodes();
      const selectedNodes = allNodes.filter((n5) => selectedNodeIds.has(n5.id));
      const hasSelection = selectedNodes.length > 0;
      const hasConnectionSelection = selectedConnectionIds.size > 0;
      const hasDeleteTarget = hasSelection || hasConnectionSelection;
      const hasCopiedData = window.copiedNodesData && window.copiedNodesData.length > 0;
      const undoItem = document.createElement("button");
      undoItem.className = "w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3";
      undoItem.innerHTML = `<span>${window.Translations && window.Translations["Undo"] || "Undo"} <span class="text-gray-400 text-xs">Ctrl+Z</span></span>`;
      undoItem.addEventListener("click", async (e7) => {
        e7.stopPropagation();
        await doUndo();
        removeContextMenu();
      });
      menu.appendChild(undoItem);
      const redoItem = document.createElement("button");
      redoItem.className = "w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3";
      redoItem.innerHTML = `<span>${window.Translations && window.Translations["Redo"] || "Redo"} <span class="text-gray-400 text-xs">Ctrl+Y</span></span>`;
      redoItem.addEventListener("click", async (e7) => {
        e7.stopPropagation();
        await doRedo();
        removeContextMenu();
      });
      menu.appendChild(redoItem);
      const sepHistory = document.createElement("div");
      sepHistory.className = "my-1 border-t border-gray-100 dark:border-slate-700";
      menu.appendChild(sepHistory);
      if (hasSelection) {
        const copyItem = document.createElement("button");
        copyItem.className = "w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3";
        copyItem.innerHTML = `<span>Copy <span class="text-gray-400 text-xs">Ctrl+C</span></span>`;
        copyItem.addEventListener("click", (e7) => {
          e7.stopPropagation();
          const selectedIds = new Set(selectedNodes.map((n5) => n5.id));
          window.copiedNodesData = selectedNodes.map((node) => {
            let position = { x: 0, y: 0 };
            const view = area.nodeViews.get(node.id);
            if (view && view.position) position = { x: view.position.x, y: view.position.y };
            return { type: node.type, label: node.label, data: { ...node.data }, position, originalId: node.id };
          });
          window.copiedConnections = editor.getConnections().filter((c5) => selectedIds.has(c5.source) && selectedIds.has(c5.target)).map((c5) => ({ source: c5.source, target: c5.target, sourceOutput: c5.sourceOutput, targetInput: c5.targetInput }));
          removeContextMenu();
        });
        menu.appendChild(copyItem);
      }
      if (hasCopiedData) {
        const pasteItem = document.createElement("button");
        pasteItem.className = "w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3";
        pasteItem.innerHTML = `<span>Paste <span class="text-gray-400 text-xs">Ctrl+V</span></span>`;
        pasteItem.addEventListener("click", async (e7) => {
          e7.stopPropagation();
          const { k: k2, x: tx, y: ty } = area.area.transform;
          const pasteX = (contextMenuX - tx) / k2;
          const pasteY = (contextMenuY - ty) / k2;
          const positions = window.copiedNodesData.map((n5) => n5.position || { x: 0, y: 0 });
          const minX = Math.min(...positions.map((p4) => p4.x));
          const minY = Math.min(...positions.map((p4) => p4.y));
          const oldIdToNewId = {};
          for (const nodeData of window.copiedNodesData) {
            const pos = nodeData.position || { x: 0, y: 0 };
            const newId = "node_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
            oldIdToNewId[nodeData.originalId || nodeData.data?.id] = newId;
            const newData = { ...nodeData.data, id: newId, label: nodeData.label, position: { x: pasteX + (pos.x - minX) + 20, y: pasteY + (pos.y - minY) + 20 } };
            const definition = editor.nodeDefinitions && editor.nodeDefinitions[nodeData.type];
            if (definition) {
              await processAddNode(nodeData.type, definition, newData);
            }
          }
          const conns = window.copiedConnections || [];
          for (const conn of conns) {
            const sourceNew = oldIdToNewId[conn.source];
            const targetNew = oldIdToNewId[conn.target];
            if (!sourceNew || !targetNew) continue;
            const sourceNode = editor.getNode(sourceNew);
            const targetNode = editor.getNode(targetNew);
            if (sourceNode && targetNode) {
              try {
                await editor.addConnection(new classic.Connection(sourceNode, conn.sourceOutput, targetNode, conn.targetInput));
              } catch (err) {
              }
            }
          }
          removeContextMenu();
        });
        menu.appendChild(pasteItem);
      }
      if (hasDeleteTarget) {
        const deleteItem = document.createElement("button");
        deleteItem.className = "w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-3";
        deleteItem.innerHTML = `<span>Delete <span class="text-gray-400 text-xs">Del</span></span>`;
        deleteItem.addEventListener("click", async (e7) => {
          e7.stopPropagation();
          isDeletingSelection = true;
          try {
            const selectedIds = new Set(selectedNodes.map((n5) => n5.id));
            for (const connId of [...selectedConnectionIds]) {
              try {
                await editor.removeConnection(connId);
              } catch (err) {
              }
            }
            selectedConnectionIds.clear();
            const allConnections = [...editor.getConnections()];
            for (const conn of allConnections) {
              if (selectedIds.has(conn.source) || selectedIds.has(conn.target)) {
                try {
                  await editor.removeConnection(conn.id);
                } catch (err) {
                }
              }
            }
            for (const node of editor.getNodes()) {
              if (selectedIds.has(node.id)) {
                try {
                  await editor.removeNode(node.id);
                } catch (err) {
                }
              }
            }
            editor.getConnections().forEach((c5) => area.update("connection", c5.id));
            processChange();
          } finally {
            isDeletingSelection = false;
            pushUndo();
          }
          removeContextMenu();
        });
        menu.appendChild(deleteItem);
        const sep = document.createElement("div");
        sep.className = "my-1 border-t border-gray-100 dark:border-slate-700";
        menu.appendChild(sep);
      }
      const createItem = document.createElement("button");
      createItem.className = "w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-3";
      createItem.innerHTML = `<span>Create Node</span>`;
      createItem.addEventListener("click", (e7) => {
        e7.stopPropagation();
        const { k: k2, x: tx, y: ty } = area.area.transform;
        const nodeX = (contextMenuX - tx) / k2;
        const nodeY = (contextMenuY - ty) / k2;
        if (editor.triggerCreateNode) {
          editor.triggerCreateNode(nodeX, nodeY);
        }
        removeContextMenu();
      });
      menu.appendChild(createItem);
      let posX = x2;
      let posY = y3;
      if (x2 + 200 > window.innerWidth) posX = window.innerWidth - 210;
      if (y3 + 200 > window.innerHeight) posY = window.innerHeight - 210;
      menu.style.left = posX + "px";
      menu.style.top = posY + "px";
      document.body.appendChild(menu);
      contextMenu = menu;
    };
    container.addEventListener("connection-contextmenu", (e7) => {
      e7.preventDefault();
      e7.stopPropagation();
      if (e7.detail && e7.detail.connectionId != null) {
        selectConnection(e7.detail.connectionId, true);
        createContextMenu(e7.detail.clientX, e7.detail.clientY, e7.detail.connectionId);
      }
    });
    container.addEventListener("contextmenu", (e7) => {
      e7.preventDefault();
      const path = e7.composedPath && e7.composedPath();
      const connectionEl = path && Array.isArray(path) && path.find((el) => {
        if (el.nodeType !== 1) return false;
        if (el.hasAttribute && el.hasAttribute("data-connection-id")) return true;
        return el.tagName && el.tagName.toLowerCase() === "custom-connection" && el.connectionId;
      });
      const contextMenuConnectionId = connectionEl ? connectionEl.getAttribute && connectionEl.getAttribute("data-connection-id") || connectionEl.connectionId || null : null;
      if (contextMenuConnectionId) selectConnection(contextMenuConnectionId, true);
      createContextMenu(e7.clientX, e7.clientY, contextMenuConnectionId);
    }, true);
    document.addEventListener("click", (e7) => {
      if (e7.button === 0 && contextMenu && !contextMenu.contains(e7.target)) {
        removeContextMenu();
      }
    });
    const doUndo = async () => {
      if (undoStack.length < 2) return;
      redoStack.push(getSnapshot());
      undoStack.pop();
      const toRestore = undoStack[undoStack.length - 1];
      await restoreState(toRestore);
      processChange();
    };
    const doRedo = async () => {
      if (redoStack.length === 0) return;
      undoStack.push(getSnapshot());
      const toRestore = redoStack.pop();
      await restoreState(toRestore);
      processChange();
    };
    document.addEventListener("keydown", (e7) => {
      const isInput = e7.target && (e7.target.closest("input") || e7.target.closest("textarea") || e7.target.closest('[contenteditable="true"]'));
      if (!isInput && e7.key === "z" && (e7.ctrlKey || e7.metaKey) && !e7.shiftKey) {
        e7.preventDefault();
        doUndo();
        return;
      }
      if (!isInput && (e7.key === "y" && (e7.ctrlKey || e7.metaKey) || e7.key === "z" && (e7.ctrlKey || e7.metaKey) && e7.shiftKey)) {
        e7.preventDefault();
        doRedo();
        return;
      }
      if (e7.key === "Escape") {
        removeContextMenu();
        clearNodeSelection();
        clearConnectionSelection();
      }
      if (e7.key === "c" && (e7.ctrlKey || e7.metaKey)) {
        const nodes = editor.getNodes().filter((n5) => selectedNodeIds.has(n5.id));
        if (nodes.length > 0) {
          e7.preventDefault();
          const selectedIds = new Set(nodes.map((n5) => n5.id));
          window.copiedNodesData = nodes.map((node) => {
            let position = { x: 0, y: 0 };
            const view = area.nodeViews.get(node.id);
            if (view && view.position) position = { x: view.position.x, y: view.position.y };
            return { type: node.type, label: node.label, data: { ...node.data }, position, originalId: node.id };
          });
          window.copiedConnections = editor.getConnections().filter((c5) => selectedIds.has(c5.source) && selectedIds.has(c5.target)).map((c5) => ({ source: c5.source, target: c5.target, sourceOutput: c5.sourceOutput, targetInput: c5.targetInput }));
        }
      }
      if (e7.key === "v" && (e7.ctrlKey || e7.metaKey)) {
        if (window.copiedNodesData && window.copiedNodesData.length > 0) {
          e7.preventDefault();
          (async () => {
            const { k: k2, x: tx, y: ty } = area.area.transform;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const pasteX = (centerX - tx) / k2;
            const pasteY = (centerY - ty) / k2;
            const positions = window.copiedNodesData.map((n5) => n5.position || { x: 0, y: 0 });
            const minX = Math.min(...positions.map((p4) => p4.x));
            const minY = Math.min(...positions.map((p4) => p4.y));
            const oldIdToNewId = {};
            for (const nodeData of window.copiedNodesData) {
              const pos = nodeData.position || { x: 0, y: 0 };
              const newId = "node_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
              oldIdToNewId[nodeData.originalId || nodeData.data?.id] = newId;
              const newData = { ...nodeData.data, id: newId, label: nodeData.label, position: { x: pasteX + (pos.x - minX) + 20, y: pasteY + (pos.y - minY) + 20 } };
              const definition = editor.nodeDefinitions && editor.nodeDefinitions[nodeData.type];
              if (definition) await processAddNode(nodeData.type, definition, newData);
            }
            const conns = window.copiedConnections || [];
            for (const conn of conns) {
              const sourceNew = oldIdToNewId[conn.source];
              const targetNew = oldIdToNewId[conn.target];
              if (!sourceNew || !targetNew) continue;
              const sourceNode = editor.getNode(sourceNew);
              const targetNode = editor.getNode(targetNew);
              if (sourceNode && targetNode) {
                try {
                  await editor.addConnection(new classic.Connection(sourceNode, conn.sourceOutput, targetNode, conn.targetInput));
                } catch (err) {
                }
              }
            }
          })();
        }
      }
      if (e7.key === "Delete" || e7.key === "Backspace") {
        if (isInput) return;
        const allNodes = editor.getNodes();
        const selectedNodes = allNodes.filter((n5) => selectedNodeIds.has(n5.id));
        const hasConnectionSelection = selectedConnectionIds.size > 0;
        const hasNodeSelection = selectedNodes.length > 0;
        if (!hasConnectionSelection && !hasNodeSelection) return;
        e7.preventDefault();
        isDeletingSelection = true;
        (async () => {
          try {
            const selectedIds = new Set(selectedNodes.map((n5) => n5.id));
            for (const connId of [...selectedConnectionIds]) {
              try {
                await editor.removeConnection(connId);
              } catch (err) {
              }
            }
            selectedConnectionIds.clear();
            const allConnections = [...editor.getConnections()];
            for (const conn of allConnections) {
              if (selectedIds.has(conn.source) || selectedIds.has(conn.target)) {
                try {
                  await editor.removeConnection(conn.id);
                } catch (err) {
                }
              }
            }
            for (const node of editor.getNodes()) {
              if (selectedIds.has(node.id)) {
                try {
                  await editor.removeNode(node.id);
                } catch (err) {
                }
              }
            }
            editor.getConnections().forEach((c5) => area.update("connection", c5.id));
            processChange();
          } finally {
            isDeletingSelection = false;
            pushUndo();
          }
        })();
      }
    });
    const processAddNode = async (name, definition, data = null) => {
      if (!definition) {
        console.error("Node definition not provided for", name);
        return;
      }
      const node = new classic.Node(definition.name);
      node.type = definition.name;
      node.icon = definition.icon;
      node.category = definition.category;
      if (data && data.id) {
        node.id = data.id;
      }
      if (data && data.label) {
        node.label = data.label;
      }
      if (definition.inputs) {
        definition.inputs.forEach((inputName) => {
          node.addInput(inputName, new classic.Input(socket));
        });
      }
      if (definition.outputs) {
        definition.outputs.forEach((outputName) => {
          node.addOutput(outputName, new classic.Output(socket));
        });
      }
      const uiFields = definition.ui_fields || [];
      uiFields.forEach((field) => {
        const initialValue = data && data.controls && data.controls[field.name] || field.default || "";
        const control = new classic.InputControl("text", { initial: initialValue });
        control.value = initialValue;
        if (field.type === "code") {
          const renderMode = field.render || "icon";
          if (renderMode === "button") {
            control.type = "code-button";
          } else {
            control.type = "code-icon";
          }
          control.label = field.label || "Edit Code";
          control.language = field.language || "elixir";
          control.onClick = () => {
            if (editor.triggerCodeEdit) {
              const language = node.controls.language?.value || control.language;
              const code_elixir = node.controls.code_elixir?.value || "";
              const code_python = node.controls.code_python?.value || "";
              const variables = getUpstreamVariables(node.id);
              editor.triggerCodeEdit(node.id, code_elixir, code_python, field.name, language, variables);
            }
          };
        } else {
          control.type = field.type === "select" ? "select" : "text";
          control.label = field.label;
          if (field.options) control.options = field.options;
        }
        node.addControl(field.name, control);
      });
      const elixirField = uiFields.find((f3) => f3.name === "code_elixir");
      const pythonField = uiFields.find((f3) => f3.name === "code_python");
      const initialElixir = data && data.controls && data.controls.code_elixir !== void 0 ? data.controls.code_elixir : elixirField ? elixirField.default : "";
      const initialPython = data && data.controls && data.controls.code_python !== void 0 ? data.controls.code_python : pythonField ? pythonField.default : "";
      if (!node.controls.code_elixir) {
        const ctrl = new classic.InputControl("text", { initial: initialElixir });
        ctrl.value = initialElixir;
        ctrl.type = "hidden";
        node.addControl("code_elixir", ctrl);
      } else if (data && data.controls && data.controls.code_elixir !== void 0) {
        node.controls.code_elixir.value = data.controls.code_elixir;
      }
      if (!node.controls.code_python) {
        const ctrl = new classic.InputControl("text", { initial: initialPython });
        ctrl.value = initialPython;
        ctrl.type = "hidden";
        node.addControl("code_python", ctrl);
      } else if (data && data.controls && data.controls.code_python !== void 0) {
        node.controls.code_python.value = data.controls.code_python;
      }
      await editor.addNode(node);
      if (data && data.position) {
        await area.translate(node.id, data.position);
      }
      return node;
    };
    return {
      destroy: () => area.destroy(),
      addNode: async (name, definition, data = null) => {
        return await processAddNode(name, definition, data);
      },
      importData: async ({ nodes, connections, definitions }) => {
        if (translateDebounce) {
          clearTimeout(translateDebounce);
          translateDebounce = null;
        }
        isImportingData = true;
        try {
          await editor.clear();
          editor.nodeDefinitions = definitions || {};
          for (const nodeData of nodes) {
            const nodeType = nodeData.type || nodeData.label;
            const definition = definitions[nodeType];
            if (!definition) {
              console.warn(`Definition not found for node type: ${nodeType}`);
              continue;
            }
            await processAddNode(nodeType, definition, nodeData);
          }
          for (const connData of connections) {
            const sourceNode = editor.getNode(connData.source);
            const targetNode = editor.getNode(connData.target);
            if (sourceNode && targetNode) {
              try {
                await editor.addConnection(
                  new classic.Connection(
                    sourceNode,
                    connData.sourceOutput,
                    targetNode,
                    connData.targetInput
                  )
                );
              } catch (e7) {
                console.error("Failed to restore connection:", connData, e7);
              }
            } else {
              console.warn("Source or Target node not found for connection:", connData);
            }
          }
          if (nodes.length > 0) {
            index.zoomAt(area, editor.getNodes());
          }
          clearSelection();
          pushUndo();
          lastImportOrRestoreTime = Date.now();
        } finally {
          setTimeout(() => {
            isImportingData = false;
          }, 0);
        }
      },
      onChange: (cb) => {
        editor.triggerChange = cb;
      },
      onCodeEdit: (cb) => {
        editor.triggerCodeEdit = cb;
      },
      onNodeConfig: (cb) => {
        editor.triggerNodeConfig = cb;
      },
      onErrorDetails: (cb) => {
        editor.triggerErrorDetails = cb;
      },
      onCreateNode: (cb) => {
        editor.triggerCreateNode = cb;
      },
      onDrop: (cb) => {
        editor.handleDrop = cb;
      },
      updateNodeCode: async (nodeId, code_elixir, code_python, fieldName) => {
        const node = editor.getNode(nodeId);
        if (!node) return;
        if (!node.controls.code_elixir) {
          node.controls.code_elixir = { value: "" };
        }
        if (!node.controls.code_python) {
          node.controls.code_python = { value: "" };
        }
        node.controls.code_elixir.value = code_elixir;
        node.controls.code_python.value = code_python;
        await area.update("node", nodeId);
        processChange();
      },
      updateNodeData: async (nodeId, data) => {
        const node = editor.getNode(nodeId);
        if (!node) return;
        Object.entries(data).forEach(([key, value]) => {
          if (node.controls[key]) {
            node.controls[key].value = value;
          }
        });
        await area.update("node", nodeId);
        processChange();
      },
      updateNodeLabel: async (nodeId, label) => {
        const node = editor.getNode(nodeId);
        if (!node) return;
        node.label = label;
        await area.update("node", nodeId);
        processChange();
      },
      updateNodeSockets: async (nodeId, { inputs, outputs }) => {
        const node = editor.getNode(nodeId);
        if (!node) return;
        const currentInputs = Object.keys(node.inputs);
        for (const inputKey of currentInputs) {
          if (!inputs.includes(inputKey)) {
            const connections = editor.getConnections().filter((c5) => c5.target === nodeId && c5.targetInput === inputKey);
            for (const conn of connections) {
              await editor.removeConnection(conn.id);
            }
            node.removeInput(inputKey);
          }
        }
        for (const inputKey of inputs) {
          if (!node.inputs[inputKey]) {
            node.addInput(inputKey, new classic.Input(socket));
          }
        }
        const currentOutputs = Object.keys(node.outputs);
        for (const outputKey of currentOutputs) {
          if (!outputs.includes(outputKey)) {
            const connections = editor.getConnections().filter((c5) => c5.source === nodeId && c5.sourceOutput === outputKey);
            for (const conn of connections) {
              await editor.removeConnection(conn.id);
            }
            node.removeOutput(outputKey);
          }
        }
        for (const outputKey of outputs) {
          if (!node.outputs[outputKey]) {
            node.addOutput(outputKey, new classic.Output(socket));
          }
        }
        await area.update("node", nodeId);
        processChange();
      },
      exportData: async () => {
        const nodes = [];
        const connections = [];
        for (const node of editor.getNodes()) {
          const controls = {};
          Object.keys(node.controls).forEach((key) => {
            controls[key] = node.controls[key].value;
          });
          nodes.push({
            id: node.id,
            type: node.type || node.label,
            label: node.label,
            controls,
            position: area.nodeViews.get(node.id)?.position || { x: 0, y: 0 }
          });
        }
        for (const conn of editor.getConnections()) {
          connections.push({
            source: conn.source,
            sourceOutput: conn.sourceOutput,
            target: conn.target,
            targetInput: conn.targetInput
          });
        }
        return { nodes, connections };
      },
      addNodeError: (nodeId, message) => {
        const view = area.nodeViews.get(nodeId);
        if (view && view.element) {
          const customNode = view.element.querySelector("custom-node");
          if (customNode) {
            customNode.classList.add("error");
            customNode.error = message;
          } else {
            view.element.classList.add("error");
          }
        } else {
          console.warn("ReteEditor: View or element not found for nodeId", nodeId);
        }
      },
      clearNodeErrors: () => {
        area.nodeViews.forEach((view) => {
          if (view.element) {
            view.element.classList.remove("error");
            const customNode = view.element.querySelector("custom-node");
            if (customNode) {
              customNode.classList.remove("error");
              customNode.error = null;
            }
          }
        });
      }
    };
  }
  var init_rete_editor = __esm({
    "js/rete_editor.js"() {
      init_rete_esm();
      init_rete_area_plugin_esm();
      init_rete_connection_plugin_esm();
      init_lit_plugin_esm();
      init_lit();
      init_custom_node();
      init_custom_connection();
      init_custom_socket();
      init_custom_background();
      init_custom_control();
      if (!customElements.get("custom-node")) {
        customElements.define("custom-node", CustomNodeElement);
      }
      if (!customElements.get("custom-connection")) {
        customElements.define("custom-connection", CustomConnectionElement);
      }
      if (!customElements.get("custom-socket")) {
        customElements.define("custom-socket", CustomSocketElement);
      }
      if (!customElements.get("custom-control")) {
        customElements.define("custom-control", CustomControlElement);
      }
    }
  });

  // ../../../deps/phoenix_html/priv/static/phoenix_html.js
  (function() {
    var PolyfillEvent = eventConstructor();
    function eventConstructor() {
      if (typeof window.CustomEvent === "function") return window.CustomEvent;
      function CustomEvent2(event, params) {
        params = params || { bubbles: false, cancelable: false, detail: void 0 };
        var evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
      }
      CustomEvent2.prototype = window.Event.prototype;
      return CustomEvent2;
    }
    function buildHiddenInput(name, value) {
      var input = document.createElement("input");
      input.type = "hidden";
      input.name = name;
      input.value = value;
      return input;
    }
    function handleClick(element, targetModifierKey) {
      var to = element.getAttribute("data-to"), method = buildHiddenInput("_method", element.getAttribute("data-method")), csrf = buildHiddenInput("_csrf_token", element.getAttribute("data-csrf")), form = document.createElement("form"), submit = document.createElement("input"), target = element.getAttribute("target");
      form.method = element.getAttribute("data-method") === "get" ? "get" : "post";
      form.action = to;
      form.style.display = "none";
      if (target) form.target = target;
      else if (targetModifierKey) form.target = "_blank";
      form.appendChild(csrf);
      form.appendChild(method);
      document.body.appendChild(form);
      submit.type = "submit";
      form.appendChild(submit);
      submit.click();
    }
    window.addEventListener("click", function(e7) {
      var element = e7.target;
      if (e7.defaultPrevented) return;
      while (element && element.getAttribute) {
        var phoenixLinkEvent = new PolyfillEvent("phoenix.link.click", {
          "bubbles": true,
          "cancelable": true
        });
        if (!element.dispatchEvent(phoenixLinkEvent)) {
          e7.preventDefault();
          e7.stopImmediatePropagation();
          return false;
        }
        if (element.getAttribute("data-method") && element.getAttribute("data-to")) {
          handleClick(element, e7.metaKey || e7.shiftKey);
          e7.preventDefault();
          return false;
        } else {
          element = element.parentNode;
        }
      }
    }, false);
    window.addEventListener("phoenix.link.click", function(e7) {
      var message = e7.target.getAttribute("data-confirm");
      if (message && !window.confirm(message)) {
        e7.preventDefault();
      }
    }, false);
  })();

  // ../../../deps/phoenix/priv/static/phoenix.mjs
  var closure = (value) => {
    if (typeof value === "function") {
      return value;
    } else {
      let closure22 = function() {
        return value;
      };
      return closure22;
    }
  };
  var globalSelf = typeof self !== "undefined" ? self : null;
  var phxWindow = typeof window !== "undefined" ? window : null;
  var global = globalSelf || phxWindow || globalThis;
  var DEFAULT_VSN = "2.0.0";
  var SOCKET_STATES = { connecting: 0, open: 1, closing: 2, closed: 3 };
  var DEFAULT_TIMEOUT = 1e4;
  var WS_CLOSE_NORMAL = 1e3;
  var CHANNEL_STATES = {
    closed: "closed",
    errored: "errored",
    joined: "joined",
    joining: "joining",
    leaving: "leaving"
  };
  var CHANNEL_EVENTS = {
    close: "phx_close",
    error: "phx_error",
    join: "phx_join",
    reply: "phx_reply",
    leave: "phx_leave"
  };
  var TRANSPORTS = {
    longpoll: "longpoll",
    websocket: "websocket"
  };
  var XHR_STATES = {
    complete: 4
  };
  var AUTH_TOKEN_PREFIX = "base64url.bearer.phx.";
  var Push = class {
    constructor(channel, event, payload, timeout) {
      this.channel = channel;
      this.event = event;
      this.payload = payload || function() {
        return {};
      };
      this.receivedResp = null;
      this.timeout = timeout;
      this.timeoutTimer = null;
      this.recHooks = [];
      this.sent = false;
    }
    /**
     *
     * @param {number} timeout
     */
    resend(timeout) {
      this.timeout = timeout;
      this.reset();
      this.send();
    }
    /**
     *
     */
    send() {
      if (this.hasReceived("timeout")) {
        return;
      }
      this.startTimeout();
      this.sent = true;
      this.channel.socket.push({
        topic: this.channel.topic,
        event: this.event,
        payload: this.payload(),
        ref: this.ref,
        join_ref: this.channel.joinRef()
      });
    }
    /**
     *
     * @param {*} status
     * @param {*} callback
     */
    receive(status, callback) {
      if (this.hasReceived(status)) {
        callback(this.receivedResp.response);
      }
      this.recHooks.push({ status, callback });
      return this;
    }
    /**
     * @private
     */
    reset() {
      this.cancelRefEvent();
      this.ref = null;
      this.refEvent = null;
      this.receivedResp = null;
      this.sent = false;
    }
    /**
     * @private
     */
    matchReceive({ status, response, _ref: _ref2 }) {
      this.recHooks.filter((h4) => h4.status === status).forEach((h4) => h4.callback(response));
    }
    /**
     * @private
     */
    cancelRefEvent() {
      if (!this.refEvent) {
        return;
      }
      this.channel.off(this.refEvent);
    }
    /**
     * @private
     */
    cancelTimeout() {
      clearTimeout(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    /**
     * @private
     */
    startTimeout() {
      if (this.timeoutTimer) {
        this.cancelTimeout();
      }
      this.ref = this.channel.socket.makeRef();
      this.refEvent = this.channel.replyEventName(this.ref);
      this.channel.on(this.refEvent, (payload) => {
        this.cancelRefEvent();
        this.cancelTimeout();
        this.receivedResp = payload;
        this.matchReceive(payload);
      });
      this.timeoutTimer = setTimeout(() => {
        this.trigger("timeout", {});
      }, this.timeout);
    }
    /**
     * @private
     */
    hasReceived(status) {
      return this.receivedResp && this.receivedResp.status === status;
    }
    /**
     * @private
     */
    trigger(status, response) {
      this.channel.trigger(this.refEvent, { status, response });
    }
  };
  var Timer = class {
    constructor(callback, timerCalc) {
      this.callback = callback;
      this.timerCalc = timerCalc;
      this.timer = null;
      this.tries = 0;
    }
    reset() {
      this.tries = 0;
      clearTimeout(this.timer);
    }
    /**
     * Cancels any previous scheduleTimeout and schedules callback
     */
    scheduleTimeout() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.tries = this.tries + 1;
        this.callback();
      }, this.timerCalc(this.tries + 1));
    }
  };
  var Channel = class {
    constructor(topic, params, socket) {
      this.state = CHANNEL_STATES.closed;
      this.topic = topic;
      this.params = closure(params || {});
      this.socket = socket;
      this.bindings = [];
      this.bindingRef = 0;
      this.timeout = this.socket.timeout;
      this.joinedOnce = false;
      this.joinPush = new Push(this, CHANNEL_EVENTS.join, this.params, this.timeout);
      this.pushBuffer = [];
      this.stateChangeRefs = [];
      this.rejoinTimer = new Timer(() => {
        if (this.socket.isConnected()) {
          this.rejoin();
        }
      }, this.socket.rejoinAfterMs);
      this.stateChangeRefs.push(this.socket.onError(() => this.rejoinTimer.reset()));
      this.stateChangeRefs.push(
        this.socket.onOpen(() => {
          this.rejoinTimer.reset();
          if (this.isErrored()) {
            this.rejoin();
          }
        })
      );
      this.joinPush.receive("ok", () => {
        this.state = CHANNEL_STATES.joined;
        this.rejoinTimer.reset();
        this.pushBuffer.forEach((pushEvent) => pushEvent.send());
        this.pushBuffer = [];
      });
      this.joinPush.receive("error", () => {
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.onClose(() => {
        this.rejoinTimer.reset();
        if (this.socket.hasLogger()) this.socket.log("channel", `close ${this.topic} ${this.joinRef()}`);
        this.state = CHANNEL_STATES.closed;
        this.socket.remove(this);
      });
      this.onError((reason) => {
        if (this.socket.hasLogger()) this.socket.log("channel", `error ${this.topic}`, reason);
        if (this.isJoining()) {
          this.joinPush.reset();
        }
        this.state = CHANNEL_STATES.errored;
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.joinPush.receive("timeout", () => {
        if (this.socket.hasLogger()) this.socket.log("channel", `timeout ${this.topic} (${this.joinRef()})`, this.joinPush.timeout);
        let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), this.timeout);
        leavePush.send();
        this.state = CHANNEL_STATES.errored;
        this.joinPush.reset();
        if (this.socket.isConnected()) {
          this.rejoinTimer.scheduleTimeout();
        }
      });
      this.on(CHANNEL_EVENTS.reply, (payload, ref) => {
        this.trigger(this.replyEventName(ref), payload);
      });
    }
    /**
     * Join the channel
     * @param {integer} timeout
     * @returns {Push}
     */
    join(timeout = this.timeout) {
      if (this.joinedOnce) {
        throw new Error("tried to join multiple times. 'join' can only be called a single time per channel instance");
      } else {
        this.timeout = timeout;
        this.joinedOnce = true;
        this.rejoin();
        return this.joinPush;
      }
    }
    /**
     * Hook into channel close
     * @param {Function} callback
     */
    onClose(callback) {
      this.on(CHANNEL_EVENTS.close, callback);
    }
    /**
     * Hook into channel errors
     * @param {Function} callback
     */
    onError(callback) {
      return this.on(CHANNEL_EVENTS.error, (reason) => callback(reason));
    }
    /**
     * Subscribes on channel events
     *
     * Subscription returns a ref counter, which can be used later to
     * unsubscribe the exact event listener
     *
     * @example
     * const ref1 = channel.on("event", do_stuff)
     * const ref2 = channel.on("event", do_other_stuff)
     * channel.off("event", ref1)
     * // Since unsubscription, do_stuff won't fire,
     * // while do_other_stuff will keep firing on the "event"
     *
     * @param {string} event
     * @param {Function} callback
     * @returns {integer} ref
     */
    on(event, callback) {
      let ref = this.bindingRef++;
      this.bindings.push({ event, ref, callback });
      return ref;
    }
    /**
     * Unsubscribes off of channel events
     *
     * Use the ref returned from a channel.on() to unsubscribe one
     * handler, or pass nothing for the ref to unsubscribe all
     * handlers for the given event.
     *
     * @example
     * // Unsubscribe the do_stuff handler
     * const ref1 = channel.on("event", do_stuff)
     * channel.off("event", ref1)
     *
     * // Unsubscribe all handlers from event
     * channel.off("event")
     *
     * @param {string} event
     * @param {integer} ref
     */
    off(event, ref) {
      this.bindings = this.bindings.filter((bind) => {
        return !(bind.event === event && (typeof ref === "undefined" || ref === bind.ref));
      });
    }
    /**
     * @private
     */
    canPush() {
      return this.socket.isConnected() && this.isJoined();
    }
    /**
     * Sends a message `event` to phoenix with the payload `payload`.
     * Phoenix receives this in the `handle_in(event, payload, socket)`
     * function. if phoenix replies or it times out (default 10000ms),
     * then optionally the reply can be received.
     *
     * @example
     * channel.push("event")
     *   .receive("ok", payload => console.log("phoenix replied:", payload))
     *   .receive("error", err => console.log("phoenix errored", err))
     *   .receive("timeout", () => console.log("timed out pushing"))
     * @param {string} event
     * @param {Object} payload
     * @param {number} [timeout]
     * @returns {Push}
     */
    push(event, payload, timeout = this.timeout) {
      payload = payload || {};
      if (!this.joinedOnce) {
        throw new Error(`tried to push '${event}' to '${this.topic}' before joining. Use channel.join() before pushing events`);
      }
      let pushEvent = new Push(this, event, function() {
        return payload;
      }, timeout);
      if (this.canPush()) {
        pushEvent.send();
      } else {
        pushEvent.startTimeout();
        this.pushBuffer.push(pushEvent);
      }
      return pushEvent;
    }
    /** Leaves the channel
     *
     * Unsubscribes from server events, and
     * instructs channel to terminate on server
     *
     * Triggers onClose() hooks
     *
     * To receive leave acknowledgements, use the `receive`
     * hook to bind to the server ack, ie:
     *
     * @example
     * channel.leave().receive("ok", () => alert("left!") )
     *
     * @param {integer} timeout
     * @returns {Push}
     */
    leave(timeout = this.timeout) {
      this.rejoinTimer.reset();
      this.joinPush.cancelTimeout();
      this.state = CHANNEL_STATES.leaving;
      let onClose = () => {
        if (this.socket.hasLogger()) this.socket.log("channel", `leave ${this.topic}`);
        this.trigger(CHANNEL_EVENTS.close, "leave");
      };
      let leavePush = new Push(this, CHANNEL_EVENTS.leave, closure({}), timeout);
      leavePush.receive("ok", () => onClose()).receive("timeout", () => onClose());
      leavePush.send();
      if (!this.canPush()) {
        leavePush.trigger("ok", {});
      }
      return leavePush;
    }
    /**
     * Overridable message hook
     *
     * Receives all events for specialized message handling
     * before dispatching to the channel callbacks.
     *
     * Must return the payload, modified or unmodified
     * @param {string} event
     * @param {Object} payload
     * @param {integer} ref
     * @returns {Object}
     */
    onMessage(_event, payload, _ref2) {
      return payload;
    }
    /**
     * @private
     */
    isMember(topic, event, payload, joinRef) {
      if (this.topic !== topic) {
        return false;
      }
      if (joinRef && joinRef !== this.joinRef()) {
        if (this.socket.hasLogger()) this.socket.log("channel", "dropping outdated message", { topic, event, payload, joinRef });
        return false;
      } else {
        return true;
      }
    }
    /**
     * @private
     */
    joinRef() {
      return this.joinPush.ref;
    }
    /**
     * @private
     */
    rejoin(timeout = this.timeout) {
      if (this.isLeaving()) {
        return;
      }
      this.socket.leaveOpenTopic(this.topic);
      this.state = CHANNEL_STATES.joining;
      this.joinPush.resend(timeout);
    }
    /**
     * @private
     */
    trigger(event, payload, ref, joinRef) {
      let handledPayload = this.onMessage(event, payload, ref, joinRef);
      if (payload && !handledPayload) {
        throw new Error("channel onMessage callbacks must return the payload, modified or unmodified");
      }
      let eventBindings = this.bindings.filter((bind) => bind.event === event);
      for (let i7 = 0; i7 < eventBindings.length; i7++) {
        let bind = eventBindings[i7];
        bind.callback(handledPayload, ref, joinRef || this.joinRef());
      }
    }
    /**
     * @private
     */
    replyEventName(ref) {
      return `chan_reply_${ref}`;
    }
    /**
     * @private
     */
    isClosed() {
      return this.state === CHANNEL_STATES.closed;
    }
    /**
     * @private
     */
    isErrored() {
      return this.state === CHANNEL_STATES.errored;
    }
    /**
     * @private
     */
    isJoined() {
      return this.state === CHANNEL_STATES.joined;
    }
    /**
     * @private
     */
    isJoining() {
      return this.state === CHANNEL_STATES.joining;
    }
    /**
     * @private
     */
    isLeaving() {
      return this.state === CHANNEL_STATES.leaving;
    }
  };
  var Ajax = class {
    static request(method, endPoint, headers, body, timeout, ontimeout, callback) {
      if (global.XDomainRequest) {
        let req = new global.XDomainRequest();
        return this.xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback);
      } else if (global.XMLHttpRequest) {
        let req = new global.XMLHttpRequest();
        return this.xhrRequest(req, method, endPoint, headers, body, timeout, ontimeout, callback);
      } else if (global.fetch && global.AbortController) {
        return this.fetchRequest(method, endPoint, headers, body, timeout, ontimeout, callback);
      } else {
        throw new Error("No suitable XMLHttpRequest implementation found");
      }
    }
    static fetchRequest(method, endPoint, headers, body, timeout, ontimeout, callback) {
      let options = {
        method,
        headers,
        body
      };
      let controller = null;
      if (timeout) {
        controller = new AbortController();
        const _timeoutId = setTimeout(() => controller.abort(), timeout);
        options.signal = controller.signal;
      }
      global.fetch(endPoint, options).then((response) => response.text()).then((data) => this.parseJSON(data)).then((data) => callback && callback(data)).catch((err) => {
        if (err.name === "AbortError" && ontimeout) {
          ontimeout();
        } else {
          callback && callback(null);
        }
      });
      return controller;
    }
    static xdomainRequest(req, method, endPoint, body, timeout, ontimeout, callback) {
      req.timeout = timeout;
      req.open(method, endPoint);
      req.onload = () => {
        let response = this.parseJSON(req.responseText);
        callback && callback(response);
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.onprogress = () => {
      };
      req.send(body);
      return req;
    }
    static xhrRequest(req, method, endPoint, headers, body, timeout, ontimeout, callback) {
      req.open(method, endPoint, true);
      req.timeout = timeout;
      for (let [key, value] of Object.entries(headers)) {
        req.setRequestHeader(key, value);
      }
      req.onerror = () => callback && callback(null);
      req.onreadystatechange = () => {
        if (req.readyState === XHR_STATES.complete && callback) {
          let response = this.parseJSON(req.responseText);
          callback(response);
        }
      };
      if (ontimeout) {
        req.ontimeout = ontimeout;
      }
      req.send(body);
      return req;
    }
    static parseJSON(resp) {
      if (!resp || resp === "") {
        return null;
      }
      try {
        return JSON.parse(resp);
      } catch {
        console && console.log("failed to parse JSON response", resp);
        return null;
      }
    }
    static serialize(obj, parentKey) {
      let queryStr = [];
      for (var key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) {
          continue;
        }
        let paramKey = parentKey ? `${parentKey}[${key}]` : key;
        let paramVal = obj[key];
        if (typeof paramVal === "object") {
          queryStr.push(this.serialize(paramVal, paramKey));
        } else {
          queryStr.push(encodeURIComponent(paramKey) + "=" + encodeURIComponent(paramVal));
        }
      }
      return queryStr.join("&");
    }
    static appendParams(url, params) {
      if (Object.keys(params).length === 0) {
        return url;
      }
      let prefix = url.match(/\?/) ? "&" : "?";
      return `${url}${prefix}${this.serialize(params)}`;
    }
  };
  var arrayBufferToBase64 = (buffer) => {
    let binary = "";
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i7 = 0; i7 < len; i7++) {
      binary += String.fromCharCode(bytes[i7]);
    }
    return btoa(binary);
  };
  var LongPoll = class {
    constructor(endPoint, protocols) {
      if (protocols && protocols.length === 2 && protocols[1].startsWith(AUTH_TOKEN_PREFIX)) {
        this.authToken = atob(protocols[1].slice(AUTH_TOKEN_PREFIX.length));
      }
      this.endPoint = null;
      this.token = null;
      this.skipHeartbeat = true;
      this.reqs = /* @__PURE__ */ new Set();
      this.awaitingBatchAck = false;
      this.currentBatch = null;
      this.currentBatchTimer = null;
      this.batchBuffer = [];
      this.onopen = function() {
      };
      this.onerror = function() {
      };
      this.onmessage = function() {
      };
      this.onclose = function() {
      };
      this.pollEndpoint = this.normalizeEndpoint(endPoint);
      this.readyState = SOCKET_STATES.connecting;
      setTimeout(() => this.poll(), 0);
    }
    normalizeEndpoint(endPoint) {
      return endPoint.replace("ws://", "http://").replace("wss://", "https://").replace(new RegExp("(.*)/" + TRANSPORTS.websocket), "$1/" + TRANSPORTS.longpoll);
    }
    endpointURL() {
      return Ajax.appendParams(this.pollEndpoint, { token: this.token });
    }
    closeAndRetry(code, reason, wasClean) {
      this.close(code, reason, wasClean);
      this.readyState = SOCKET_STATES.connecting;
    }
    ontimeout() {
      this.onerror("timeout");
      this.closeAndRetry(1005, "timeout", false);
    }
    isActive() {
      return this.readyState === SOCKET_STATES.open || this.readyState === SOCKET_STATES.connecting;
    }
    poll() {
      const headers = { "Accept": "application/json" };
      if (this.authToken) {
        headers["X-Phoenix-AuthToken"] = this.authToken;
      }
      this.ajax("GET", headers, null, () => this.ontimeout(), (resp) => {
        if (resp) {
          var { status, token, messages } = resp;
          if (status === 410 && this.token !== null) {
            this.onerror(410);
            this.closeAndRetry(3410, "session_gone", false);
            return;
          }
          this.token = token;
        } else {
          status = 0;
        }
        switch (status) {
          case 200:
            messages.forEach((msg) => {
              setTimeout(() => this.onmessage({ data: msg }), 0);
            });
            this.poll();
            break;
          case 204:
            this.poll();
            break;
          case 410:
            this.readyState = SOCKET_STATES.open;
            this.onopen({});
            this.poll();
            break;
          case 403:
            this.onerror(403);
            this.close(1008, "forbidden", false);
            break;
          case 0:
          case 500:
            this.onerror(500);
            this.closeAndRetry(1011, "internal server error", 500);
            break;
          default:
            throw new Error(`unhandled poll status ${status}`);
        }
      });
    }
    // we collect all pushes within the current event loop by
    // setTimeout 0, which optimizes back-to-back procedural
    // pushes against an empty buffer
    send(body) {
      if (typeof body !== "string") {
        body = arrayBufferToBase64(body);
      }
      if (this.currentBatch) {
        this.currentBatch.push(body);
      } else if (this.awaitingBatchAck) {
        this.batchBuffer.push(body);
      } else {
        this.currentBatch = [body];
        this.currentBatchTimer = setTimeout(() => {
          this.batchSend(this.currentBatch);
          this.currentBatch = null;
        }, 0);
      }
    }
    batchSend(messages) {
      this.awaitingBatchAck = true;
      this.ajax("POST", { "Content-Type": "application/x-ndjson" }, messages.join("\n"), () => this.onerror("timeout"), (resp) => {
        this.awaitingBatchAck = false;
        if (!resp || resp.status !== 200) {
          this.onerror(resp && resp.status);
          this.closeAndRetry(1011, "internal server error", false);
        } else if (this.batchBuffer.length > 0) {
          this.batchSend(this.batchBuffer);
          this.batchBuffer = [];
        }
      });
    }
    close(code, reason, wasClean) {
      for (let req of this.reqs) {
        req.abort();
      }
      this.readyState = SOCKET_STATES.closed;
      let opts = Object.assign({ code: 1e3, reason: void 0, wasClean: true }, { code, reason, wasClean });
      this.batchBuffer = [];
      clearTimeout(this.currentBatchTimer);
      this.currentBatchTimer = null;
      if (typeof CloseEvent !== "undefined") {
        this.onclose(new CloseEvent("close", opts));
      } else {
        this.onclose(opts);
      }
    }
    ajax(method, headers, body, onCallerTimeout, callback) {
      let req;
      let ontimeout = () => {
        this.reqs.delete(req);
        onCallerTimeout();
      };
      req = Ajax.request(method, this.endpointURL(), headers, body, this.timeout, ontimeout, (resp) => {
        this.reqs.delete(req);
        if (this.isActive()) {
          callback(resp);
        }
      });
      this.reqs.add(req);
    }
  };
  var serializer_default = {
    HEADER_LENGTH: 1,
    META_LENGTH: 4,
    KINDS: { push: 0, reply: 1, broadcast: 2 },
    encode(msg, callback) {
      if (msg.payload.constructor === ArrayBuffer) {
        return callback(this.binaryEncode(msg));
      } else {
        let payload = [msg.join_ref, msg.ref, msg.topic, msg.event, msg.payload];
        return callback(JSON.stringify(payload));
      }
    },
    decode(rawPayload, callback) {
      if (rawPayload.constructor === ArrayBuffer) {
        return callback(this.binaryDecode(rawPayload));
      } else {
        let [join_ref, ref, topic, event, payload] = JSON.parse(rawPayload);
        return callback({ join_ref, ref, topic, event, payload });
      }
    },
    // private
    binaryEncode(message) {
      let { join_ref, ref, event, topic, payload } = message;
      let metaLength = this.META_LENGTH + join_ref.length + ref.length + topic.length + event.length;
      let header = new ArrayBuffer(this.HEADER_LENGTH + metaLength);
      let view = new DataView(header);
      let offset = 0;
      view.setUint8(offset++, this.KINDS.push);
      view.setUint8(offset++, join_ref.length);
      view.setUint8(offset++, ref.length);
      view.setUint8(offset++, topic.length);
      view.setUint8(offset++, event.length);
      Array.from(join_ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(ref, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(topic, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      Array.from(event, (char) => view.setUint8(offset++, char.charCodeAt(0)));
      var combined = new Uint8Array(header.byteLength + payload.byteLength);
      combined.set(new Uint8Array(header), 0);
      combined.set(new Uint8Array(payload), header.byteLength);
      return combined.buffer;
    },
    binaryDecode(buffer) {
      let view = new DataView(buffer);
      let kind = view.getUint8(0);
      let decoder = new TextDecoder();
      switch (kind) {
        case this.KINDS.push:
          return this.decodePush(buffer, view, decoder);
        case this.KINDS.reply:
          return this.decodeReply(buffer, view, decoder);
        case this.KINDS.broadcast:
          return this.decodeBroadcast(buffer, view, decoder);
      }
    },
    decodePush(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let topicSize = view.getUint8(2);
      let eventSize = view.getUint8(3);
      let offset = this.HEADER_LENGTH + this.META_LENGTH - 1;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: joinRef, ref: null, topic, event, payload: data };
    },
    decodeReply(buffer, view, decoder) {
      let joinRefSize = view.getUint8(1);
      let refSize = view.getUint8(2);
      let topicSize = view.getUint8(3);
      let eventSize = view.getUint8(4);
      let offset = this.HEADER_LENGTH + this.META_LENGTH;
      let joinRef = decoder.decode(buffer.slice(offset, offset + joinRefSize));
      offset = offset + joinRefSize;
      let ref = decoder.decode(buffer.slice(offset, offset + refSize));
      offset = offset + refSize;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      let payload = { status: event, response: data };
      return { join_ref: joinRef, ref, topic, event: CHANNEL_EVENTS.reply, payload };
    },
    decodeBroadcast(buffer, view, decoder) {
      let topicSize = view.getUint8(1);
      let eventSize = view.getUint8(2);
      let offset = this.HEADER_LENGTH + 2;
      let topic = decoder.decode(buffer.slice(offset, offset + topicSize));
      offset = offset + topicSize;
      let event = decoder.decode(buffer.slice(offset, offset + eventSize));
      offset = offset + eventSize;
      let data = buffer.slice(offset, buffer.byteLength);
      return { join_ref: null, ref: null, topic, event, payload: data };
    }
  };
  var Socket = class {
    constructor(endPoint, opts = {}) {
      this.stateChangeCallbacks = { open: [], close: [], error: [], message: [] };
      this.channels = [];
      this.sendBuffer = [];
      this.ref = 0;
      this.fallbackRef = null;
      this.timeout = opts.timeout || DEFAULT_TIMEOUT;
      this.transport = opts.transport || global.WebSocket || LongPoll;
      this.primaryPassedHealthCheck = false;
      this.longPollFallbackMs = opts.longPollFallbackMs;
      this.fallbackTimer = null;
      this.sessionStore = opts.sessionStorage || global && global.sessionStorage;
      this.establishedConnections = 0;
      this.defaultEncoder = serializer_default.encode.bind(serializer_default);
      this.defaultDecoder = serializer_default.decode.bind(serializer_default);
      this.closeWasClean = false;
      this.disconnecting = false;
      this.binaryType = opts.binaryType || "arraybuffer";
      this.connectClock = 1;
      this.pageHidden = false;
      if (this.transport !== LongPoll) {
        this.encode = opts.encode || this.defaultEncoder;
        this.decode = opts.decode || this.defaultDecoder;
      } else {
        this.encode = this.defaultEncoder;
        this.decode = this.defaultDecoder;
      }
      let awaitingConnectionOnPageShow = null;
      if (phxWindow && phxWindow.addEventListener) {
        phxWindow.addEventListener("pagehide", (_e) => {
          if (this.conn) {
            this.disconnect();
            awaitingConnectionOnPageShow = this.connectClock;
          }
        });
        phxWindow.addEventListener("pageshow", (_e) => {
          if (awaitingConnectionOnPageShow === this.connectClock) {
            awaitingConnectionOnPageShow = null;
            this.connect();
          }
        });
        phxWindow.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "hidden") {
            this.pageHidden = true;
          } else {
            this.pageHidden = false;
            if (!this.isConnected()) {
              this.teardown(() => this.connect());
            }
          }
        });
      }
      this.heartbeatIntervalMs = opts.heartbeatIntervalMs || 3e4;
      this.rejoinAfterMs = (tries) => {
        if (opts.rejoinAfterMs) {
          return opts.rejoinAfterMs(tries);
        } else {
          return [1e3, 2e3, 5e3][tries - 1] || 1e4;
        }
      };
      this.reconnectAfterMs = (tries) => {
        if (opts.reconnectAfterMs) {
          return opts.reconnectAfterMs(tries);
        } else {
          return [10, 50, 100, 150, 200, 250, 500, 1e3, 2e3][tries - 1] || 5e3;
        }
      };
      this.logger = opts.logger || null;
      if (!this.logger && opts.debug) {
        this.logger = (kind, msg, data) => {
          console.log(`${kind}: ${msg}`, data);
        };
      }
      this.longpollerTimeout = opts.longpollerTimeout || 2e4;
      this.params = closure(opts.params || {});
      this.endPoint = `${endPoint}/${TRANSPORTS.websocket}`;
      this.vsn = opts.vsn || DEFAULT_VSN;
      this.heartbeatTimeoutTimer = null;
      this.heartbeatTimer = null;
      this.pendingHeartbeatRef = null;
      this.reconnectTimer = new Timer(() => {
        if (this.pageHidden) {
          this.log("Not reconnecting as page is hidden!");
          this.teardown();
          return;
        }
        this.teardown(() => this.connect());
      }, this.reconnectAfterMs);
      this.authToken = opts.authToken;
    }
    /**
     * Returns the LongPoll transport reference
     */
    getLongPollTransport() {
      return LongPoll;
    }
    /**
     * Disconnects and replaces the active transport
     *
     * @param {Function} newTransport - The new transport class to instantiate
     *
     */
    replaceTransport(newTransport) {
      this.connectClock++;
      this.closeWasClean = true;
      clearTimeout(this.fallbackTimer);
      this.reconnectTimer.reset();
      if (this.conn) {
        this.conn.close();
        this.conn = null;
      }
      this.transport = newTransport;
    }
    /**
     * Returns the socket protocol
     *
     * @returns {string}
     */
    protocol() {
      return location.protocol.match(/^https/) ? "wss" : "ws";
    }
    /**
     * The fully qualified socket url
     *
     * @returns {string}
     */
    endPointURL() {
      let uri = Ajax.appendParams(
        Ajax.appendParams(this.endPoint, this.params()),
        { vsn: this.vsn }
      );
      if (uri.charAt(0) !== "/") {
        return uri;
      }
      if (uri.charAt(1) === "/") {
        return `${this.protocol()}:${uri}`;
      }
      return `${this.protocol()}://${location.host}${uri}`;
    }
    /**
     * Disconnects the socket
     *
     * See https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#Status_codes for valid status codes.
     *
     * @param {Function} callback - Optional callback which is called after socket is disconnected.
     * @param {integer} code - A status code for disconnection (Optional).
     * @param {string} reason - A textual description of the reason to disconnect. (Optional)
     */
    disconnect(callback, code, reason) {
      this.connectClock++;
      this.disconnecting = true;
      this.closeWasClean = true;
      clearTimeout(this.fallbackTimer);
      this.reconnectTimer.reset();
      this.teardown(() => {
        this.disconnecting = false;
        callback && callback();
      }, code, reason);
    }
    /**
     *
     * @param {Object} params - The params to send when connecting, for example `{user_id: userToken}`
     *
     * Passing params to connect is deprecated; pass them in the Socket constructor instead:
     * `new Socket("/socket", {params: {user_id: userToken}})`.
     */
    connect(params) {
      if (params) {
        console && console.log("passing params to connect is deprecated. Instead pass :params to the Socket constructor");
        this.params = closure(params);
      }
      if (this.conn && !this.disconnecting) {
        return;
      }
      if (this.longPollFallbackMs && this.transport !== LongPoll) {
        this.connectWithFallback(LongPoll, this.longPollFallbackMs);
      } else {
        this.transportConnect();
      }
    }
    /**
     * Logs the message. Override `this.logger` for specialized logging. noops by default
     * @param {string} kind
     * @param {string} msg
     * @param {Object} data
     */
    log(kind, msg, data) {
      this.logger && this.logger(kind, msg, data);
    }
    /**
     * Returns true if a logger has been set on this socket.
     */
    hasLogger() {
      return this.logger !== null;
    }
    /**
     * Registers callbacks for connection open events
     *
     * @example socket.onOpen(function(){ console.info("the socket was opened") })
     *
     * @param {Function} callback
     */
    onOpen(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.open.push([ref, callback]);
      return ref;
    }
    /**
     * Registers callbacks for connection close events
     * @param {Function} callback
     */
    onClose(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.close.push([ref, callback]);
      return ref;
    }
    /**
     * Registers callbacks for connection error events
     *
     * @example socket.onError(function(error){ alert("An error occurred") })
     *
     * @param {Function} callback
     */
    onError(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.error.push([ref, callback]);
      return ref;
    }
    /**
     * Registers callbacks for connection message events
     * @param {Function} callback
     */
    onMessage(callback) {
      let ref = this.makeRef();
      this.stateChangeCallbacks.message.push([ref, callback]);
      return ref;
    }
    /**
     * Pings the server and invokes the callback with the RTT in milliseconds
     * @param {Function} callback
     *
     * Returns true if the ping was pushed or false if unable to be pushed.
     */
    ping(callback) {
      if (!this.isConnected()) {
        return false;
      }
      let ref = this.makeRef();
      let startTime = Date.now();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref });
      let onMsgRef = this.onMessage((msg) => {
        if (msg.ref === ref) {
          this.off([onMsgRef]);
          callback(Date.now() - startTime);
        }
      });
      return true;
    }
    /**
     * @private
     */
    transportConnect() {
      this.connectClock++;
      this.closeWasClean = false;
      let protocols = void 0;
      if (this.authToken) {
        protocols = ["phoenix", `${AUTH_TOKEN_PREFIX}${btoa(this.authToken).replace(/=/g, "")}`];
      }
      this.conn = new this.transport(this.endPointURL(), protocols);
      this.conn.binaryType = this.binaryType;
      this.conn.timeout = this.longpollerTimeout;
      this.conn.onopen = () => this.onConnOpen();
      this.conn.onerror = (error) => this.onConnError(error);
      this.conn.onmessage = (event) => this.onConnMessage(event);
      this.conn.onclose = (event) => this.onConnClose(event);
    }
    getSession(key) {
      return this.sessionStore && this.sessionStore.getItem(key);
    }
    storeSession(key, val) {
      this.sessionStore && this.sessionStore.setItem(key, val);
    }
    connectWithFallback(fallbackTransport, fallbackThreshold = 2500) {
      clearTimeout(this.fallbackTimer);
      let established = false;
      let primaryTransport = true;
      let openRef, errorRef;
      let fallback = (reason) => {
        this.log("transport", `falling back to ${fallbackTransport.name}...`, reason);
        this.off([openRef, errorRef]);
        primaryTransport = false;
        this.replaceTransport(fallbackTransport);
        this.transportConnect();
      };
      if (this.getSession(`phx:fallback:${fallbackTransport.name}`)) {
        return fallback("memorized");
      }
      this.fallbackTimer = setTimeout(fallback, fallbackThreshold);
      errorRef = this.onError((reason) => {
        this.log("transport", "error", reason);
        if (primaryTransport && !established) {
          clearTimeout(this.fallbackTimer);
          fallback(reason);
        }
      });
      if (this.fallbackRef) {
        this.off([this.fallbackRef]);
      }
      this.fallbackRef = this.onOpen(() => {
        established = true;
        if (!primaryTransport) {
          if (!this.primaryPassedHealthCheck) {
            this.storeSession(`phx:fallback:${fallbackTransport.name}`, "true");
          }
          return this.log("transport", `established ${fallbackTransport.name} fallback`);
        }
        clearTimeout(this.fallbackTimer);
        this.fallbackTimer = setTimeout(fallback, fallbackThreshold);
        this.ping((rtt) => {
          this.log("transport", "connected to primary after", rtt);
          this.primaryPassedHealthCheck = true;
          clearTimeout(this.fallbackTimer);
        });
      });
      this.transportConnect();
    }
    clearHeartbeats() {
      clearTimeout(this.heartbeatTimer);
      clearTimeout(this.heartbeatTimeoutTimer);
    }
    onConnOpen() {
      if (this.hasLogger()) this.log("transport", `${this.transport.name} connected to ${this.endPointURL()}`);
      this.closeWasClean = false;
      this.disconnecting = false;
      this.establishedConnections++;
      this.flushSendBuffer();
      this.reconnectTimer.reset();
      this.resetHeartbeat();
      this.stateChangeCallbacks.open.forEach(([, callback]) => callback());
    }
    /**
     * @private
     */
    heartbeatTimeout() {
      if (this.pendingHeartbeatRef) {
        this.pendingHeartbeatRef = null;
        if (this.hasLogger()) {
          this.log("transport", "heartbeat timeout. Attempting to re-establish connection");
        }
        this.triggerChanError();
        this.closeWasClean = false;
        this.teardown(() => this.reconnectTimer.scheduleTimeout(), WS_CLOSE_NORMAL, "heartbeat timeout");
      }
    }
    resetHeartbeat() {
      if (this.conn && this.conn.skipHeartbeat) {
        return;
      }
      this.pendingHeartbeatRef = null;
      this.clearHeartbeats();
      this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
    }
    teardown(callback, code, reason) {
      if (!this.conn) {
        return callback && callback();
      }
      let connectClock = this.connectClock;
      this.waitForBufferDone(() => {
        if (connectClock !== this.connectClock) {
          return;
        }
        if (this.conn) {
          if (code) {
            this.conn.close(code, reason || "");
          } else {
            this.conn.close();
          }
        }
        this.waitForSocketClosed(() => {
          if (connectClock !== this.connectClock) {
            return;
          }
          if (this.conn) {
            this.conn.onopen = function() {
            };
            this.conn.onerror = function() {
            };
            this.conn.onmessage = function() {
            };
            this.conn.onclose = function() {
            };
            this.conn = null;
          }
          callback && callback();
        });
      });
    }
    waitForBufferDone(callback, tries = 1) {
      if (tries === 5 || !this.conn || !this.conn.bufferedAmount) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForBufferDone(callback, tries + 1);
      }, 150 * tries);
    }
    waitForSocketClosed(callback, tries = 1) {
      if (tries === 5 || !this.conn || this.conn.readyState === SOCKET_STATES.closed) {
        callback();
        return;
      }
      setTimeout(() => {
        this.waitForSocketClosed(callback, tries + 1);
      }, 150 * tries);
    }
    onConnClose(event) {
      if (this.conn) this.conn.onclose = () => {
      };
      let closeCode = event && event.code;
      if (this.hasLogger()) this.log("transport", "close", event);
      this.triggerChanError();
      this.clearHeartbeats();
      if (!this.closeWasClean && closeCode !== 1e3) {
        this.reconnectTimer.scheduleTimeout();
      }
      this.stateChangeCallbacks.close.forEach(([, callback]) => callback(event));
    }
    /**
     * @private
     */
    onConnError(error) {
      if (this.hasLogger()) this.log("transport", error);
      let transportBefore = this.transport;
      let establishedBefore = this.establishedConnections;
      this.stateChangeCallbacks.error.forEach(([, callback]) => {
        callback(error, transportBefore, establishedBefore);
      });
      if (transportBefore === this.transport || establishedBefore > 0) {
        this.triggerChanError();
      }
    }
    /**
     * @private
     */
    triggerChanError() {
      this.channels.forEach((channel) => {
        if (!(channel.isErrored() || channel.isLeaving() || channel.isClosed())) {
          channel.trigger(CHANNEL_EVENTS.error);
        }
      });
    }
    /**
     * @returns {string}
     */
    connectionState() {
      switch (this.conn && this.conn.readyState) {
        case SOCKET_STATES.connecting:
          return "connecting";
        case SOCKET_STATES.open:
          return "open";
        case SOCKET_STATES.closing:
          return "closing";
        default:
          return "closed";
      }
    }
    /**
     * @returns {boolean}
     */
    isConnected() {
      return this.connectionState() === "open";
    }
    /**
     * @private
     *
     * @param {Channel}
     */
    remove(channel) {
      this.off(channel.stateChangeRefs);
      this.channels = this.channels.filter((c5) => c5 !== channel);
    }
    /**
     * Removes `onOpen`, `onClose`, `onError,` and `onMessage` registrations.
     *
     * @param {refs} - list of refs returned by calls to
     *                 `onOpen`, `onClose`, `onError,` and `onMessage`
     */
    off(refs) {
      for (let key in this.stateChangeCallbacks) {
        this.stateChangeCallbacks[key] = this.stateChangeCallbacks[key].filter(([ref]) => {
          return refs.indexOf(ref) === -1;
        });
      }
    }
    /**
     * Initiates a new channel for the given topic
     *
     * @param {string} topic
     * @param {Object} chanParams - Parameters for the channel
     * @returns {Channel}
     */
    channel(topic, chanParams = {}) {
      let chan = new Channel(topic, chanParams, this);
      this.channels.push(chan);
      return chan;
    }
    /**
     * @param {Object} data
     */
    push(data) {
      if (this.hasLogger()) {
        let { topic, event, payload, ref, join_ref } = data;
        this.log("push", `${topic} ${event} (${join_ref}, ${ref})`, payload);
      }
      if (this.isConnected()) {
        this.encode(data, (result) => this.conn.send(result));
      } else {
        this.sendBuffer.push(() => this.encode(data, (result) => this.conn.send(result)));
      }
    }
    /**
     * Return the next message ref, accounting for overflows
     * @returns {string}
     */
    makeRef() {
      let newRef = this.ref + 1;
      if (newRef === this.ref) {
        this.ref = 0;
      } else {
        this.ref = newRef;
      }
      return this.ref.toString();
    }
    sendHeartbeat() {
      if (this.pendingHeartbeatRef && !this.isConnected()) {
        return;
      }
      this.pendingHeartbeatRef = this.makeRef();
      this.push({ topic: "phoenix", event: "heartbeat", payload: {}, ref: this.pendingHeartbeatRef });
      this.heartbeatTimeoutTimer = setTimeout(() => this.heartbeatTimeout(), this.heartbeatIntervalMs);
    }
    flushSendBuffer() {
      if (this.isConnected() && this.sendBuffer.length > 0) {
        this.sendBuffer.forEach((callback) => callback());
        this.sendBuffer = [];
      }
    }
    onConnMessage(rawMessage) {
      this.decode(rawMessage.data, (msg) => {
        let { topic, event, payload, ref, join_ref } = msg;
        if (ref && ref === this.pendingHeartbeatRef) {
          this.clearHeartbeats();
          this.pendingHeartbeatRef = null;
          this.heartbeatTimer = setTimeout(() => this.sendHeartbeat(), this.heartbeatIntervalMs);
        }
        if (this.hasLogger()) this.log("receive", `${payload.status || ""} ${topic} ${event} ${ref && "(" + ref + ")" || ""}`, payload);
        for (let i7 = 0; i7 < this.channels.length; i7++) {
          const channel = this.channels[i7];
          if (!channel.isMember(topic, event, payload, join_ref)) {
            continue;
          }
          channel.trigger(event, payload, ref, join_ref);
        }
        for (let i7 = 0; i7 < this.stateChangeCallbacks.message.length; i7++) {
          let [, callback] = this.stateChangeCallbacks.message[i7];
          callback(msg);
        }
      });
    }
    leaveOpenTopic(topic) {
      let dupChannel = this.channels.find((c5) => c5.topic === topic && (c5.isJoined() || c5.isJoining()));
      if (dupChannel) {
        if (this.hasLogger()) this.log("transport", `leaving duplicate topic "${topic}"`);
        dupChannel.leave();
      }
    }
  };

  // ../../../deps/phoenix_live_view/priv/static/phoenix_live_view.esm.js
  var CONSECUTIVE_RELOADS = "consecutive-reloads";
  var MAX_RELOADS = 10;
  var RELOAD_JITTER_MIN = 5e3;
  var RELOAD_JITTER_MAX = 1e4;
  var FAILSAFE_JITTER = 3e4;
  var PHX_EVENT_CLASSES = [
    "phx-click-loading",
    "phx-change-loading",
    "phx-submit-loading",
    "phx-keydown-loading",
    "phx-keyup-loading",
    "phx-blur-loading",
    "phx-focus-loading",
    "phx-hook-loading"
  ];
  var PHX_DROP_TARGET_ACTIVE_CLASS = "phx-drop-target-active";
  var PHX_COMPONENT = "data-phx-component";
  var PHX_VIEW_REF = "data-phx-view";
  var PHX_LIVE_LINK = "data-phx-link";
  var PHX_TRACK_STATIC = "track-static";
  var PHX_LINK_STATE = "data-phx-link-state";
  var PHX_REF_LOADING = "data-phx-ref-loading";
  var PHX_REF_SRC = "data-phx-ref-src";
  var PHX_REF_LOCK = "data-phx-ref-lock";
  var PHX_PENDING_REFS = "phx-pending-refs";
  var PHX_TRACK_UPLOADS = "track-uploads";
  var PHX_UPLOAD_REF = "data-phx-upload-ref";
  var PHX_PREFLIGHTED_REFS = "data-phx-preflighted-refs";
  var PHX_DONE_REFS = "data-phx-done-refs";
  var PHX_DROP_TARGET = "drop-target";
  var PHX_ACTIVE_ENTRY_REFS = "data-phx-active-refs";
  var PHX_LIVE_FILE_UPDATED = "phx:live-file:updated";
  var PHX_SKIP = "data-phx-skip";
  var PHX_MAGIC_ID = "data-phx-id";
  var PHX_PRUNE = "data-phx-prune";
  var PHX_CONNECTED_CLASS = "phx-connected";
  var PHX_LOADING_CLASS = "phx-loading";
  var PHX_ERROR_CLASS = "phx-error";
  var PHX_CLIENT_ERROR_CLASS = "phx-client-error";
  var PHX_SERVER_ERROR_CLASS = "phx-server-error";
  var PHX_PARENT_ID = "data-phx-parent-id";
  var PHX_MAIN = "data-phx-main";
  var PHX_ROOT_ID = "data-phx-root-id";
  var PHX_VIEWPORT_TOP = "viewport-top";
  var PHX_VIEWPORT_BOTTOM = "viewport-bottom";
  var PHX_VIEWPORT_OVERRUN_TARGET = "viewport-overrun-target";
  var PHX_TRIGGER_ACTION = "trigger-action";
  var PHX_HAS_FOCUSED = "phx-has-focused";
  var FOCUSABLE_INPUTS = [
    "text",
    "textarea",
    "number",
    "email",
    "password",
    "search",
    "tel",
    "url",
    "date",
    "time",
    "datetime-local",
    "color",
    "range"
  ];
  var CHECKABLE_INPUTS = ["checkbox", "radio"];
  var PHX_HAS_SUBMITTED = "phx-has-submitted";
  var PHX_SESSION = "data-phx-session";
  var PHX_VIEW_SELECTOR = `[${PHX_SESSION}]`;
  var PHX_STICKY = "data-phx-sticky";
  var PHX_STATIC = "data-phx-static";
  var PHX_READONLY = "data-phx-readonly";
  var PHX_DISABLED = "data-phx-disabled";
  var PHX_DISABLE_WITH = "disable-with";
  var PHX_DISABLE_WITH_RESTORE = "data-phx-disable-with-restore";
  var PHX_HOOK = "hook";
  var PHX_DEBOUNCE = "debounce";
  var PHX_THROTTLE = "throttle";
  var PHX_UPDATE = "update";
  var PHX_STREAM = "stream";
  var PHX_STREAM_REF = "data-phx-stream";
  var PHX_PORTAL = "data-phx-portal";
  var PHX_TELEPORTED_REF = "data-phx-teleported";
  var PHX_TELEPORTED_SRC = "data-phx-teleported-src";
  var PHX_RUNTIME_HOOK = "data-phx-runtime-hook";
  var PHX_LV_PID = "data-phx-pid";
  var PHX_KEY = "key";
  var PHX_PRIVATE = "phxPrivate";
  var PHX_AUTO_RECOVER = "auto-recover";
  var PHX_LV_DEBUG = "phx:live-socket:debug";
  var PHX_LV_PROFILE = "phx:live-socket:profiling";
  var PHX_LV_LATENCY_SIM = "phx:live-socket:latency-sim";
  var PHX_LV_HISTORY_POSITION = "phx:nav-history-position";
  var PHX_PROGRESS = "progress";
  var PHX_MOUNTED = "mounted";
  var PHX_RELOAD_STATUS = "__phoenix_reload_status__";
  var LOADER_TIMEOUT = 1;
  var MAX_CHILD_JOIN_ATTEMPTS = 3;
  var BEFORE_UNLOAD_LOADER_TIMEOUT = 200;
  var DISCONNECTED_TIMEOUT = 500;
  var BINDING_PREFIX = "phx-";
  var PUSH_TIMEOUT = 3e4;
  var DEBOUNCE_TRIGGER = "debounce-trigger";
  var THROTTLED = "throttled";
  var DEBOUNCE_PREV_KEY = "debounce-prev-key";
  var DEFAULTS = {
    debounce: 300,
    throttle: 300
  };
  var PHX_PENDING_ATTRS = [PHX_REF_LOADING, PHX_REF_SRC, PHX_REF_LOCK];
  var STATIC = "s";
  var ROOT = "r";
  var COMPONENTS = "c";
  var KEYED = "k";
  var KEYED_COUNT = "kc";
  var EVENTS = "e";
  var REPLY = "r";
  var TITLE = "t";
  var TEMPLATES = "p";
  var STREAM = "stream";
  var EntryUploader = class {
    constructor(entry, config, liveSocket2) {
      const { chunk_size, chunk_timeout } = config;
      this.liveSocket = liveSocket2;
      this.entry = entry;
      this.offset = 0;
      this.chunkSize = chunk_size;
      this.chunkTimeout = chunk_timeout;
      this.chunkTimer = null;
      this.errored = false;
      this.uploadChannel = liveSocket2.channel(`lvu:${entry.ref}`, {
        token: entry.metadata()
      });
    }
    error(reason) {
      if (this.errored) {
        return;
      }
      this.uploadChannel.leave();
      this.errored = true;
      clearTimeout(this.chunkTimer);
      this.entry.error(reason);
    }
    upload() {
      this.uploadChannel.onError((reason) => this.error(reason));
      this.uploadChannel.join().receive("ok", (_data) => this.readNextChunk()).receive("error", (reason) => this.error(reason));
    }
    isDone() {
      return this.offset >= this.entry.file.size;
    }
    readNextChunk() {
      const reader = new window.FileReader();
      const blob = this.entry.file.slice(
        this.offset,
        this.chunkSize + this.offset
      );
      reader.onload = (e7) => {
        if (e7.target.error === null) {
          this.offset += /** @type {ArrayBuffer} */
          e7.target.result.byteLength;
          this.pushChunk(
            /** @type {ArrayBuffer} */
            e7.target.result
          );
        } else {
          return logError("Read error: " + e7.target.error);
        }
      };
      reader.readAsArrayBuffer(blob);
    }
    pushChunk(chunk) {
      if (!this.uploadChannel.isJoined()) {
        return;
      }
      this.uploadChannel.push("chunk", chunk, this.chunkTimeout).receive("ok", () => {
        this.entry.progress(this.offset / this.entry.file.size * 100);
        if (!this.isDone()) {
          this.chunkTimer = setTimeout(
            () => this.readNextChunk(),
            this.liveSocket.getLatencySim() || 0
          );
        }
      }).receive("error", ({ reason }) => this.error(reason));
    }
  };
  var logError = (msg, obj) => console.error && console.error(msg, obj);
  var isCid = (cid) => {
    const type = typeof cid;
    return type === "number" || type === "string" && /^(0|[1-9]\d*)$/.test(cid);
  };
  function detectDuplicateIds() {
    const ids = /* @__PURE__ */ new Set();
    const elems = document.querySelectorAll("*[id]");
    for (let i7 = 0, len = elems.length; i7 < len; i7++) {
      if (ids.has(elems[i7].id)) {
        console.error(
          `Multiple IDs detected: ${elems[i7].id}. Ensure unique element ids.`
        );
      } else {
        ids.add(elems[i7].id);
      }
    }
  }
  function detectInvalidStreamInserts(inserts) {
    const errors = /* @__PURE__ */ new Set();
    Object.keys(inserts).forEach((id) => {
      const streamEl = document.getElementById(id);
      if (streamEl && streamEl.parentElement && streamEl.parentElement.getAttribute("phx-update") !== "stream") {
        errors.add(
          `The stream container with id "${streamEl.parentElement.id}" is missing the phx-update="stream" attribute. Ensure it is set for streams to work properly.`
        );
      }
    });
    errors.forEach((error) => console.error(error));
  }
  var debug = (view, kind, msg, obj) => {
    if (view.liveSocket.isDebugEnabled()) {
      console.log(`${view.id} ${kind}: ${msg} - `, obj);
    }
  };
  var closure2 = (val) => typeof val === "function" ? val : function() {
    return val;
  };
  var clone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
  };
  var closestPhxBinding = (el, binding, borderEl) => {
    do {
      if (el.matches(`[${binding}]`) && !el.disabled) {
        return el;
      }
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1 && !(borderEl && borderEl.isSameNode(el) || el.matches(PHX_VIEW_SELECTOR)));
    return null;
  };
  var isObject = (obj) => {
    return obj !== null && typeof obj === "object" && !(obj instanceof Array);
  };
  var isEqualObj = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);
  var isEmpty = (obj) => {
    for (const x2 in obj) {
      return false;
    }
    return true;
  };
  var maybe = (el, callback) => el && callback(el);
  var channelUploader = function(entries, onError, resp, liveSocket2) {
    entries.forEach((entry) => {
      const entryUploader = new EntryUploader(entry, resp.config, liveSocket2);
      entryUploader.upload();
    });
  };
  var eventContainsFiles = (e7) => {
    if (e7.dataTransfer.types) {
      for (let i7 = 0; i7 < e7.dataTransfer.types.length; i7++) {
        if (e7.dataTransfer.types[i7] === "Files") {
          return true;
        }
      }
    }
    return false;
  };
  var Browser = {
    canPushState() {
      return typeof history.pushState !== "undefined";
    },
    dropLocal(localStorage2, namespace, subkey) {
      return localStorage2.removeItem(this.localKey(namespace, subkey));
    },
    updateLocal(localStorage2, namespace, subkey, initial, func) {
      const current = this.getLocal(localStorage2, namespace, subkey);
      const key = this.localKey(namespace, subkey);
      const newVal = current === null ? initial : func(current);
      localStorage2.setItem(key, JSON.stringify(newVal));
      return newVal;
    },
    getLocal(localStorage2, namespace, subkey) {
      return JSON.parse(localStorage2.getItem(this.localKey(namespace, subkey)));
    },
    updateCurrentState(callback) {
      if (!this.canPushState()) {
        return;
      }
      history.replaceState(
        callback(history.state || {}),
        "",
        window.location.href
      );
    },
    pushState(kind, meta, to) {
      if (this.canPushState()) {
        if (to !== window.location.href) {
          if (meta.type == "redirect" && meta.scroll) {
            const currentState = history.state || {};
            currentState.scroll = meta.scroll;
            history.replaceState(currentState, "", window.location.href);
          }
          delete meta.scroll;
          history[kind + "State"](meta, "", to || null);
          window.requestAnimationFrame(() => {
            const hashEl = this.getHashTargetEl(window.location.hash);
            if (hashEl) {
              hashEl.scrollIntoView();
            } else if (meta.type === "redirect") {
              window.scroll(0, 0);
            }
          });
        }
      } else {
        this.redirect(to);
      }
    },
    setCookie(name, value, maxAgeSeconds) {
      const expires = typeof maxAgeSeconds === "number" ? ` max-age=${maxAgeSeconds};` : "";
      document.cookie = `${name}=${value};${expires} path=/`;
    },
    getCookie(name) {
      return document.cookie.replace(
        new RegExp(`(?:(?:^|.*;s*)${name}s*=s*([^;]*).*$)|^.*$`),
        "$1"
      );
    },
    deleteCookie(name) {
      document.cookie = `${name}=; max-age=-1; path=/`;
    },
    redirect(toURL, flash, navigate = (url) => {
      window.location.href = url;
    }) {
      if (flash) {
        this.setCookie("__phoenix_flash__", flash, 60);
      }
      navigate(toURL);
    },
    localKey(namespace, subkey) {
      return `${namespace}-${subkey}`;
    },
    getHashTargetEl(maybeHash) {
      const hash = maybeHash.toString().substring(1);
      if (hash === "") {
        return;
      }
      return document.getElementById(hash) || document.querySelector(`a[name="${hash}"]`);
    }
  };
  var browser_default = Browser;
  var DOM = {
    byId(id) {
      return document.getElementById(id) || logError(`no id found for ${id}`);
    },
    removeClass(el, className) {
      el.classList.remove(className);
      if (el.classList.length === 0) {
        el.removeAttribute("class");
      }
    },
    all(node, query, callback) {
      if (!node) {
        return [];
      }
      const array = Array.from(node.querySelectorAll(query));
      if (callback) {
        array.forEach(callback);
      }
      return array;
    },
    childNodeLength(html) {
      const template = document.createElement("template");
      template.innerHTML = html;
      return template.content.childElementCount;
    },
    isUploadInput(el) {
      return el.type === "file" && el.getAttribute(PHX_UPLOAD_REF) !== null;
    },
    isAutoUpload(inputEl) {
      return inputEl.hasAttribute("data-phx-auto-upload");
    },
    findUploadInputs(node) {
      const formId = node.id;
      const inputsOutsideForm = this.all(
        document,
        `input[type="file"][${PHX_UPLOAD_REF}][form="${formId}"]`
      );
      return this.all(node, `input[type="file"][${PHX_UPLOAD_REF}]`).concat(
        inputsOutsideForm
      );
    },
    findComponentNodeList(viewId, cid, doc2 = document) {
      return this.all(
        doc2,
        `[${PHX_VIEW_REF}="${viewId}"][${PHX_COMPONENT}="${cid}"]`
      );
    },
    isPhxDestroyed(node) {
      return node.id && DOM.private(node, "destroyed") ? true : false;
    },
    wantsNewTab(e7) {
      const wantsNewTab = e7.ctrlKey || e7.shiftKey || e7.metaKey || e7.button && e7.button === 1;
      const isDownload = e7.target instanceof HTMLAnchorElement && e7.target.hasAttribute("download");
      const isTargetBlank = e7.target.hasAttribute("target") && e7.target.getAttribute("target").toLowerCase() === "_blank";
      const isTargetNamedTab = e7.target.hasAttribute("target") && !e7.target.getAttribute("target").startsWith("_");
      return wantsNewTab || isTargetBlank || isDownload || isTargetNamedTab;
    },
    isUnloadableFormSubmit(e7) {
      const isDialogSubmit = e7.target && e7.target.getAttribute("method") === "dialog" || e7.submitter && e7.submitter.getAttribute("formmethod") === "dialog";
      if (isDialogSubmit) {
        return false;
      } else {
        return !e7.defaultPrevented && !this.wantsNewTab(e7);
      }
    },
    isNewPageClick(e7, currentLocation) {
      const href = e7.target instanceof HTMLAnchorElement ? e7.target.getAttribute("href") : null;
      let url;
      if (e7.defaultPrevented || href === null || this.wantsNewTab(e7)) {
        return false;
      }
      if (href.startsWith("mailto:") || href.startsWith("tel:")) {
        return false;
      }
      if (e7.target.isContentEditable) {
        return false;
      }
      try {
        url = new URL(href);
      } catch {
        try {
          url = new URL(href, currentLocation);
        } catch {
          return true;
        }
      }
      if (url.host === currentLocation.host && url.protocol === currentLocation.protocol) {
        if (url.pathname === currentLocation.pathname && url.search === currentLocation.search) {
          return url.hash === "" && !url.href.endsWith("#");
        }
      }
      return url.protocol.startsWith("http");
    },
    markPhxChildDestroyed(el) {
      if (this.isPhxChild(el)) {
        el.setAttribute(PHX_SESSION, "");
      }
      this.putPrivate(el, "destroyed", true);
    },
    findPhxChildrenInFragment(html, parentId) {
      const template = document.createElement("template");
      template.innerHTML = html;
      return this.findPhxChildren(template.content, parentId);
    },
    isIgnored(el, phxUpdate) {
      return (el.getAttribute(phxUpdate) || el.getAttribute("data-phx-update")) === "ignore";
    },
    isPhxUpdate(el, phxUpdate, updateTypes) {
      return el.getAttribute && updateTypes.indexOf(el.getAttribute(phxUpdate)) >= 0;
    },
    findPhxSticky(el) {
      return this.all(el, `[${PHX_STICKY}]`);
    },
    findPhxChildren(el, parentId) {
      return this.all(el, `${PHX_VIEW_SELECTOR}[${PHX_PARENT_ID}="${parentId}"]`);
    },
    findExistingParentCIDs(viewId, cids) {
      const parentCids = /* @__PURE__ */ new Set();
      const childrenCids = /* @__PURE__ */ new Set();
      cids.forEach((cid) => {
        this.all(
          document,
          `[${PHX_VIEW_REF}="${viewId}"][${PHX_COMPONENT}="${cid}"]`
        ).forEach((parent) => {
          parentCids.add(cid);
          this.all(parent, `[${PHX_VIEW_REF}="${viewId}"][${PHX_COMPONENT}]`).map((el) => parseInt(el.getAttribute(PHX_COMPONENT))).forEach((childCID) => childrenCids.add(childCID));
        });
      });
      childrenCids.forEach((childCid) => parentCids.delete(childCid));
      return parentCids;
    },
    private(el, key) {
      return el[PHX_PRIVATE] && el[PHX_PRIVATE][key];
    },
    deletePrivate(el, key) {
      el[PHX_PRIVATE] && delete el[PHX_PRIVATE][key];
    },
    putPrivate(el, key, value) {
      if (!el[PHX_PRIVATE]) {
        el[PHX_PRIVATE] = {};
      }
      el[PHX_PRIVATE][key] = value;
    },
    updatePrivate(el, key, defaultVal, updateFunc) {
      const existing = this.private(el, key);
      if (existing === void 0) {
        this.putPrivate(el, key, updateFunc(defaultVal));
      } else {
        this.putPrivate(el, key, updateFunc(existing));
      }
    },
    syncPendingAttrs(fromEl, toEl) {
      if (!fromEl.hasAttribute(PHX_REF_SRC)) {
        return;
      }
      PHX_EVENT_CLASSES.forEach((className) => {
        fromEl.classList.contains(className) && toEl.classList.add(className);
      });
      PHX_PENDING_ATTRS.filter((attr) => fromEl.hasAttribute(attr)).forEach(
        (attr) => {
          toEl.setAttribute(attr, fromEl.getAttribute(attr));
        }
      );
    },
    copyPrivates(target, source) {
      if (source[PHX_PRIVATE]) {
        target[PHX_PRIVATE] = source[PHX_PRIVATE];
      }
    },
    putTitle(str) {
      const titleEl = document.querySelector("title");
      if (titleEl) {
        const { prefix, suffix, default: defaultTitle } = titleEl.dataset;
        const isEmpty2 = typeof str !== "string" || str.trim() === "";
        if (isEmpty2 && typeof defaultTitle !== "string") {
          return;
        }
        const inner = isEmpty2 ? defaultTitle : str;
        document.title = `${prefix || ""}${inner || ""}${suffix || ""}`;
      } else {
        document.title = str;
      }
    },
    debounce(el, event, phxDebounce, defaultDebounce, phxThrottle, defaultThrottle, asyncFilter, callback) {
      let debounce2 = el.getAttribute(phxDebounce);
      let throttle = el.getAttribute(phxThrottle);
      if (debounce2 === "") {
        debounce2 = defaultDebounce;
      }
      if (throttle === "") {
        throttle = defaultThrottle;
      }
      const value = debounce2 || throttle;
      switch (value) {
        case null:
          return callback();
        case "blur":
          this.incCycle(el, "debounce-blur-cycle", () => {
            if (asyncFilter()) {
              callback();
            }
          });
          if (this.once(el, "debounce-blur")) {
            el.addEventListener(
              "blur",
              () => this.triggerCycle(el, "debounce-blur-cycle")
            );
          }
          return;
        default:
          const timeout = parseInt(value);
          const trigger = () => throttle ? this.deletePrivate(el, THROTTLED) : callback();
          const currentCycle = this.incCycle(el, DEBOUNCE_TRIGGER, trigger);
          if (isNaN(timeout)) {
            return logError(`invalid throttle/debounce value: ${value}`);
          }
          if (throttle) {
            let newKeyDown = false;
            if (event.type === "keydown") {
              const prevKey = this.private(el, DEBOUNCE_PREV_KEY);
              this.putPrivate(el, DEBOUNCE_PREV_KEY, event.key);
              newKeyDown = prevKey !== event.key;
            }
            if (!newKeyDown && this.private(el, THROTTLED)) {
              return false;
            } else {
              callback();
              const t5 = setTimeout(() => {
                if (asyncFilter()) {
                  this.triggerCycle(el, DEBOUNCE_TRIGGER);
                }
              }, timeout);
              this.putPrivate(el, THROTTLED, t5);
            }
          } else {
            setTimeout(() => {
              if (asyncFilter()) {
                this.triggerCycle(el, DEBOUNCE_TRIGGER, currentCycle);
              }
            }, timeout);
          }
          const form = el.form;
          if (form && this.once(form, "bind-debounce")) {
            form.addEventListener("submit", () => {
              Array.from(new FormData(form).entries(), ([name]) => {
                const namedItem = form.elements.namedItem(name);
                const input = namedItem instanceof RadioNodeList ? namedItem[0] : namedItem;
                if (input) {
                  this.incCycle(input, DEBOUNCE_TRIGGER);
                  this.deletePrivate(input, THROTTLED);
                }
              });
            });
          }
          if (this.once(el, "bind-debounce")) {
            el.addEventListener("blur", () => {
              clearTimeout(this.private(el, THROTTLED));
              this.triggerCycle(el, DEBOUNCE_TRIGGER);
            });
          }
      }
    },
    triggerCycle(el, key, currentCycle) {
      const [cycle, trigger] = this.private(el, key);
      if (!currentCycle) {
        currentCycle = cycle;
      }
      if (currentCycle === cycle) {
        this.incCycle(el, key);
        trigger();
      }
    },
    once(el, key) {
      if (this.private(el, key) === true) {
        return false;
      }
      this.putPrivate(el, key, true);
      return true;
    },
    incCycle(el, key, trigger = function() {
    }) {
      let [currentCycle] = this.private(el, key) || [0, trigger];
      currentCycle++;
      this.putPrivate(el, key, [currentCycle, trigger]);
      return currentCycle;
    },
    // maintains or adds privately used hook information
    // fromEl and toEl can be the same element in the case of a newly added node
    // fromEl and toEl can be any HTML node type, so we need to check if it's an element node
    maintainPrivateHooks(fromEl, toEl, phxViewportTop, phxViewportBottom) {
      if (fromEl.hasAttribute && fromEl.hasAttribute("data-phx-hook") && !toEl.hasAttribute("data-phx-hook")) {
        toEl.setAttribute("data-phx-hook", fromEl.getAttribute("data-phx-hook"));
      }
      if (toEl.hasAttribute && (toEl.hasAttribute(phxViewportTop) || toEl.hasAttribute(phxViewportBottom))) {
        toEl.setAttribute("data-phx-hook", "Phoenix.InfiniteScroll");
      }
    },
    putCustomElHook(el, hook) {
      if (el.isConnected) {
        el.setAttribute("data-phx-hook", "");
      } else {
        console.error(`
        hook attached to non-connected DOM element
        ensure you are calling createHook within your connectedCallback. ${el.outerHTML}
      `);
      }
      this.putPrivate(el, "custom-el-hook", hook);
    },
    getCustomElHook(el) {
      return this.private(el, "custom-el-hook");
    },
    isUsedInput(el) {
      return el.nodeType === Node.ELEMENT_NODE && (this.private(el, PHX_HAS_FOCUSED) || this.private(el, PHX_HAS_SUBMITTED));
    },
    resetForm(form) {
      Array.from(form.elements).forEach((input) => {
        this.deletePrivate(input, PHX_HAS_FOCUSED);
        this.deletePrivate(input, PHX_HAS_SUBMITTED);
      });
    },
    isPhxChild(node) {
      return node.getAttribute && node.getAttribute(PHX_PARENT_ID);
    },
    isPhxSticky(node) {
      return node.getAttribute && node.getAttribute(PHX_STICKY) !== null;
    },
    isChildOfAny(el, parents) {
      return !!parents.find((parent) => parent.contains(el));
    },
    firstPhxChild(el) {
      return this.isPhxChild(el) ? el : this.all(el, `[${PHX_PARENT_ID}]`)[0];
    },
    isPortalTemplate(el) {
      return el.tagName === "TEMPLATE" && el.hasAttribute(PHX_PORTAL);
    },
    closestViewEl(el) {
      const portalOrViewEl = el.closest(
        `[${PHX_TELEPORTED_REF}],${PHX_VIEW_SELECTOR}`
      );
      if (!portalOrViewEl) {
        return null;
      }
      if (portalOrViewEl.hasAttribute(PHX_TELEPORTED_REF)) {
        return this.byId(portalOrViewEl.getAttribute(PHX_TELEPORTED_REF));
      } else if (portalOrViewEl.hasAttribute(PHX_SESSION)) {
        return portalOrViewEl;
      }
      return null;
    },
    dispatchEvent(target, name, opts = {}) {
      let defaultBubble = true;
      const isUploadTarget = target.nodeName === "INPUT" && target.type === "file";
      if (isUploadTarget && name === "click") {
        defaultBubble = false;
      }
      const bubbles = opts.bubbles === void 0 ? defaultBubble : !!opts.bubbles;
      const eventOpts = {
        bubbles,
        cancelable: true,
        detail: opts.detail || {}
      };
      const event = name === "click" ? new MouseEvent("click", eventOpts) : new CustomEvent(name, eventOpts);
      target.dispatchEvent(event);
    },
    cloneNode(node, html) {
      if (typeof html === "undefined") {
        return node.cloneNode(true);
      } else {
        const cloned = node.cloneNode(false);
        cloned.innerHTML = html;
        return cloned;
      }
    },
    // merge attributes from source to target
    // if an element is ignored, we only merge data attributes
    // including removing data attributes that are no longer in the source
    mergeAttrs(target, source, opts = {}) {
      const exclude = new Set(opts.exclude || []);
      const isIgnored = opts.isIgnored;
      const sourceAttrs = source.attributes;
      for (let i7 = sourceAttrs.length - 1; i7 >= 0; i7--) {
        const name = sourceAttrs[i7].name;
        if (!exclude.has(name)) {
          const sourceValue = source.getAttribute(name);
          if (target.getAttribute(name) !== sourceValue && (!isIgnored || isIgnored && name.startsWith("data-"))) {
            target.setAttribute(name, sourceValue);
          }
        } else {
          if (name === "value") {
            const sourceValue = source.value ?? source.getAttribute(name);
            if (target.value === sourceValue) {
              target.setAttribute("value", source.getAttribute(name));
            }
          }
        }
      }
      const targetAttrs = target.attributes;
      for (let i7 = targetAttrs.length - 1; i7 >= 0; i7--) {
        const name = targetAttrs[i7].name;
        if (isIgnored) {
          if (name.startsWith("data-") && !source.hasAttribute(name) && !PHX_PENDING_ATTRS.includes(name)) {
            target.removeAttribute(name);
          }
        } else {
          if (!source.hasAttribute(name)) {
            target.removeAttribute(name);
          }
        }
      }
    },
    mergeFocusedInput(target, source) {
      if (!(target instanceof HTMLSelectElement)) {
        DOM.mergeAttrs(target, source, { exclude: ["value"] });
      }
      if (source.readOnly) {
        target.setAttribute("readonly", true);
      } else {
        target.removeAttribute("readonly");
      }
    },
    hasSelectionRange(el) {
      return el.setSelectionRange && (el.type === "text" || el.type === "textarea");
    },
    restoreFocus(focused, selectionStart, selectionEnd) {
      if (focused instanceof HTMLSelectElement) {
        focused.focus();
      }
      if (!DOM.isTextualInput(focused)) {
        return;
      }
      const wasFocused = focused.matches(":focus");
      if (!wasFocused) {
        focused.focus();
      }
      if (this.hasSelectionRange(focused)) {
        focused.setSelectionRange(selectionStart, selectionEnd);
      }
    },
    isFormInput(el) {
      if (el.localName && customElements.get(el.localName)) {
        return customElements.get(el.localName)[`formAssociated`];
      }
      return /^(?:input|select|textarea)$/i.test(el.tagName) && el.type !== "button";
    },
    syncAttrsToProps(el) {
      if (el instanceof HTMLInputElement && CHECKABLE_INPUTS.indexOf(el.type.toLocaleLowerCase()) >= 0) {
        el.checked = el.getAttribute("checked") !== null;
      }
    },
    isTextualInput(el) {
      return FOCUSABLE_INPUTS.indexOf(el.type) >= 0;
    },
    isNowTriggerFormExternal(el, phxTriggerExternal) {
      return el.getAttribute && el.getAttribute(phxTriggerExternal) !== null && document.body.contains(el);
    },
    cleanChildNodes(container, phxUpdate) {
      if (DOM.isPhxUpdate(container, phxUpdate, ["append", "prepend", PHX_STREAM])) {
        const toRemove = [];
        container.childNodes.forEach((childNode) => {
          if (!childNode.id) {
            const isEmptyTextNode = childNode.nodeType === Node.TEXT_NODE && childNode.nodeValue.trim() === "";
            if (!isEmptyTextNode && childNode.nodeType !== Node.COMMENT_NODE) {
              logError(
                `only HTML element tags with an id are allowed inside containers with phx-update.

removing illegal node: "${(childNode.outerHTML || childNode.nodeValue).trim()}"

`
              );
            }
            toRemove.push(childNode);
          }
        });
        toRemove.forEach((childNode) => childNode.remove());
      }
    },
    replaceRootContainer(container, tagName, attrs) {
      const retainedAttrs = /* @__PURE__ */ new Set([
        "id",
        PHX_SESSION,
        PHX_STATIC,
        PHX_MAIN,
        PHX_ROOT_ID
      ]);
      if (container.tagName.toLowerCase() === tagName.toLowerCase()) {
        Array.from(container.attributes).filter((attr) => !retainedAttrs.has(attr.name.toLowerCase())).forEach((attr) => container.removeAttribute(attr.name));
        Object.keys(attrs).filter((name) => !retainedAttrs.has(name.toLowerCase())).forEach((attr) => container.setAttribute(attr, attrs[attr]));
        return container;
      } else {
        const newContainer = document.createElement(tagName);
        Object.keys(attrs).forEach(
          (attr) => newContainer.setAttribute(attr, attrs[attr])
        );
        retainedAttrs.forEach(
          (attr) => newContainer.setAttribute(attr, container.getAttribute(attr))
        );
        newContainer.innerHTML = container.innerHTML;
        container.replaceWith(newContainer);
        return newContainer;
      }
    },
    getSticky(el, name, defaultVal) {
      const op = (DOM.private(el, "sticky") || []).find(
        ([existingName]) => name === existingName
      );
      if (op) {
        const [_name, _op, stashedResult] = op;
        return stashedResult;
      } else {
        return typeof defaultVal === "function" ? defaultVal() : defaultVal;
      }
    },
    deleteSticky(el, name) {
      this.updatePrivate(el, "sticky", [], (ops) => {
        return ops.filter(([existingName, _2]) => existingName !== name);
      });
    },
    putSticky(el, name, op) {
      const stashedResult = op(el);
      this.updatePrivate(el, "sticky", [], (ops) => {
        const existingIndex = ops.findIndex(
          ([existingName]) => name === existingName
        );
        if (existingIndex >= 0) {
          ops[existingIndex] = [name, op, stashedResult];
        } else {
          ops.push([name, op, stashedResult]);
        }
        return ops;
      });
    },
    applyStickyOperations(el) {
      const ops = DOM.private(el, "sticky");
      if (!ops) {
        return;
      }
      ops.forEach(([name, op, _stashed]) => this.putSticky(el, name, op));
    },
    isLocked(el) {
      return el.hasAttribute && el.hasAttribute(PHX_REF_LOCK);
    },
    attributeIgnored(attribute, ignoredAttributes) {
      return ignoredAttributes.some(
        (toIgnore) => attribute.name == toIgnore || toIgnore === "*" || toIgnore.includes("*") && attribute.name.match(toIgnore) != null
      );
    }
  };
  var dom_default = DOM;
  var UploadEntry = class {
    static isActive(fileEl, file) {
      const isNew = file._phxRef === void 0;
      const activeRefs = fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      const isActive = activeRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return file.size > 0 && (isNew || isActive);
    }
    static isPreflighted(fileEl, file) {
      const preflightedRefs = fileEl.getAttribute(PHX_PREFLIGHTED_REFS).split(",");
      const isPreflighted = preflightedRefs.indexOf(LiveUploader.genFileRef(file)) >= 0;
      return isPreflighted && this.isActive(fileEl, file);
    }
    static isPreflightInProgress(file) {
      return file._preflightInProgress === true;
    }
    static markPreflightInProgress(file) {
      file._preflightInProgress = true;
    }
    constructor(fileEl, file, view, autoUpload) {
      this.ref = LiveUploader.genFileRef(file);
      this.fileEl = fileEl;
      this.file = file;
      this.view = view;
      this.meta = null;
      this._isCancelled = false;
      this._isDone = false;
      this._progress = 0;
      this._lastProgressSent = -1;
      this._onDone = function() {
      };
      this._onElUpdated = this.onElUpdated.bind(this);
      this.fileEl.addEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
      this.autoUpload = autoUpload;
    }
    metadata() {
      return this.meta;
    }
    progress(progress) {
      this._progress = Math.floor(progress);
      if (this._progress > this._lastProgressSent) {
        if (this._progress >= 100) {
          this._progress = 100;
          this._lastProgressSent = 100;
          this._isDone = true;
          this.view.pushFileProgress(this.fileEl, this.ref, 100, () => {
            LiveUploader.untrackFile(this.fileEl, this.file);
            this._onDone();
          });
        } else {
          this._lastProgressSent = this._progress;
          this.view.pushFileProgress(this.fileEl, this.ref, this._progress);
        }
      }
    }
    isCancelled() {
      return this._isCancelled;
    }
    cancel() {
      this.file._preflightInProgress = false;
      this._isCancelled = true;
      this._isDone = true;
      this._onDone();
    }
    isDone() {
      return this._isDone;
    }
    error(reason = "failed") {
      this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
      this.view.pushFileProgress(this.fileEl, this.ref, { error: reason });
      if (!this.isAutoUpload()) {
        LiveUploader.clearFiles(this.fileEl);
      }
    }
    isAutoUpload() {
      return this.autoUpload;
    }
    //private
    onDone(callback) {
      this._onDone = () => {
        this.fileEl.removeEventListener(PHX_LIVE_FILE_UPDATED, this._onElUpdated);
        callback();
      };
    }
    onElUpdated() {
      const activeRefs = this.fileEl.getAttribute(PHX_ACTIVE_ENTRY_REFS).split(",");
      if (activeRefs.indexOf(this.ref) === -1) {
        LiveUploader.untrackFile(this.fileEl, this.file);
        this.cancel();
      }
    }
    toPreflightPayload() {
      return {
        last_modified: this.file.lastModified,
        name: this.file.name,
        relative_path: this.file.webkitRelativePath,
        size: this.file.size,
        type: this.file.type,
        ref: this.ref,
        meta: typeof this.file.meta === "function" ? this.file.meta() : void 0
      };
    }
    uploader(uploaders) {
      if (this.meta.uploader) {
        const callback = uploaders[this.meta.uploader] || logError(`no uploader configured for ${this.meta.uploader}`);
        return { name: this.meta.uploader, callback };
      } else {
        return { name: "channel", callback: channelUploader };
      }
    }
    zipPostFlight(resp) {
      this.meta = resp.entries[this.ref];
      if (!this.meta) {
        logError(`no preflight upload response returned with ref ${this.ref}`, {
          input: this.fileEl,
          response: resp
        });
      }
    }
  };
  var liveUploaderFileRef = 0;
  var LiveUploader = class _LiveUploader {
    static genFileRef(file) {
      const ref = file._phxRef;
      if (ref !== void 0) {
        return ref;
      } else {
        file._phxRef = (liveUploaderFileRef++).toString();
        return file._phxRef;
      }
    }
    static getEntryDataURL(inputEl, ref, callback) {
      const file = this.activeFiles(inputEl).find(
        (file2) => this.genFileRef(file2) === ref
      );
      callback(URL.createObjectURL(file));
    }
    static hasUploadsInProgress(formEl) {
      let active = 0;
      dom_default.findUploadInputs(formEl).forEach((input) => {
        if (input.getAttribute(PHX_PREFLIGHTED_REFS) !== input.getAttribute(PHX_DONE_REFS)) {
          active++;
        }
      });
      return active > 0;
    }
    static serializeUploads(inputEl) {
      const files = this.activeFiles(inputEl);
      const fileData = {};
      files.forEach((file) => {
        const entry = { path: inputEl.name };
        const uploadRef = inputEl.getAttribute(PHX_UPLOAD_REF);
        fileData[uploadRef] = fileData[uploadRef] || [];
        entry.ref = this.genFileRef(file);
        entry.last_modified = file.lastModified;
        entry.name = file.name || entry.ref;
        entry.relative_path = file.webkitRelativePath;
        entry.type = file.type;
        entry.size = file.size;
        if (typeof file.meta === "function") {
          entry.meta = file.meta();
        }
        fileData[uploadRef].push(entry);
      });
      return fileData;
    }
    static clearFiles(inputEl) {
      inputEl.value = null;
      inputEl.removeAttribute(PHX_UPLOAD_REF);
      dom_default.putPrivate(inputEl, "files", []);
    }
    static untrackFile(inputEl, file) {
      dom_default.putPrivate(
        inputEl,
        "files",
        dom_default.private(inputEl, "files").filter((f3) => !Object.is(f3, file))
      );
    }
    /**
     * @param {HTMLInputElement} inputEl
     * @param {Array<File|Blob>} files
     * @param {DataTransfer} [dataTransfer]
     */
    static trackFiles(inputEl, files, dataTransfer) {
      if (inputEl.getAttribute("multiple") !== null) {
        const newFiles = files.filter(
          (file) => !this.activeFiles(inputEl).find((f3) => Object.is(f3, file))
        );
        dom_default.updatePrivate(
          inputEl,
          "files",
          [],
          (existing) => existing.concat(newFiles)
        );
        inputEl.value = null;
      } else {
        if (dataTransfer && dataTransfer.files.length > 0) {
          inputEl.files = dataTransfer.files;
        }
        dom_default.putPrivate(inputEl, "files", files);
      }
    }
    static activeFileInputs(formEl) {
      const fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter(
        (el) => el.files && this.activeFiles(el).length > 0
      );
    }
    static activeFiles(input) {
      return (dom_default.private(input, "files") || []).filter(
        (f3) => UploadEntry.isActive(input, f3)
      );
    }
    static inputsAwaitingPreflight(formEl) {
      const fileInputs = dom_default.findUploadInputs(formEl);
      return Array.from(fileInputs).filter(
        (input) => this.filesAwaitingPreflight(input).length > 0
      );
    }
    static filesAwaitingPreflight(input) {
      return this.activeFiles(input).filter(
        (f3) => !UploadEntry.isPreflighted(input, f3) && !UploadEntry.isPreflightInProgress(f3)
      );
    }
    static markPreflightInProgress(entries) {
      entries.forEach((entry) => UploadEntry.markPreflightInProgress(entry.file));
    }
    constructor(inputEl, view, onComplete) {
      this.autoUpload = dom_default.isAutoUpload(inputEl);
      this.view = view;
      this.onComplete = onComplete;
      this._entries = Array.from(
        _LiveUploader.filesAwaitingPreflight(inputEl) || []
      ).map((file) => new UploadEntry(inputEl, file, view, this.autoUpload));
      _LiveUploader.markPreflightInProgress(this._entries);
      this.numEntriesInProgress = this._entries.length;
    }
    isAutoUpload() {
      return this.autoUpload;
    }
    entries() {
      return this._entries;
    }
    initAdapterUpload(resp, onError, liveSocket2) {
      this._entries = this._entries.map((entry) => {
        if (entry.isCancelled()) {
          this.numEntriesInProgress--;
          if (this.numEntriesInProgress === 0) {
            this.onComplete();
          }
        } else {
          entry.zipPostFlight(resp);
          entry.onDone(() => {
            this.numEntriesInProgress--;
            if (this.numEntriesInProgress === 0) {
              this.onComplete();
            }
          });
        }
        return entry;
      });
      const groupedEntries = this._entries.reduce((acc, entry) => {
        if (!entry.meta) {
          return acc;
        }
        const { name, callback } = entry.uploader(liveSocket2.uploaders);
        acc[name] = acc[name] || { callback, entries: [] };
        acc[name].entries.push(entry);
        return acc;
      }, {});
      for (const name in groupedEntries) {
        const { callback, entries } = groupedEntries[name];
        callback(entries, onError, resp, liveSocket2);
      }
    }
  };
  var ARIA = {
    anyOf(instance, classes) {
      return classes.find((name) => instance instanceof name);
    },
    isFocusable(el, interactiveOnly) {
      return el instanceof HTMLAnchorElement && el.rel !== "ignore" || el instanceof HTMLAreaElement && el.href !== void 0 || !el.disabled && this.anyOf(el, [
        HTMLInputElement,
        HTMLSelectElement,
        HTMLTextAreaElement,
        HTMLButtonElement
      ]) || el instanceof HTMLIFrameElement || el.tabIndex >= 0 && el.getAttribute("aria-hidden") !== "true" || !interactiveOnly && el.getAttribute("tabindex") !== null && el.getAttribute("aria-hidden") !== "true";
    },
    attemptFocus(el, interactiveOnly) {
      if (this.isFocusable(el, interactiveOnly)) {
        try {
          el.focus();
        } catch {
        }
      }
      return !!document.activeElement && document.activeElement.isSameNode(el);
    },
    focusFirstInteractive(el) {
      let child = el.firstElementChild;
      while (child) {
        if (this.attemptFocus(child, true) || this.focusFirstInteractive(child)) {
          return true;
        }
        child = child.nextElementSibling;
      }
    },
    focusFirst(el) {
      let child = el.firstElementChild;
      while (child) {
        if (this.attemptFocus(child) || this.focusFirst(child)) {
          return true;
        }
        child = child.nextElementSibling;
      }
    },
    focusLast(el) {
      let child = el.lastElementChild;
      while (child) {
        if (this.attemptFocus(child) || this.focusLast(child)) {
          return true;
        }
        child = child.previousElementSibling;
      }
    }
  };
  var aria_default = ARIA;
  var Hooks = {
    LiveFileUpload: {
      activeRefs() {
        return this.el.getAttribute(PHX_ACTIVE_ENTRY_REFS);
      },
      preflightedRefs() {
        return this.el.getAttribute(PHX_PREFLIGHTED_REFS);
      },
      mounted() {
        this.js().ignoreAttributes(this.el, ["value"]);
        this.preflightedWas = this.preflightedRefs();
      },
      updated() {
        const newPreflights = this.preflightedRefs();
        if (this.preflightedWas !== newPreflights) {
          this.preflightedWas = newPreflights;
          if (newPreflights === "") {
            this.__view().cancelSubmit(this.el.form);
          }
        }
        if (this.activeRefs() === "") {
          this.el.value = null;
        }
        this.el.dispatchEvent(new CustomEvent(PHX_LIVE_FILE_UPDATED));
      }
    },
    LiveImgPreview: {
      mounted() {
        this.ref = this.el.getAttribute("data-phx-entry-ref");
        this.inputEl = document.getElementById(
          this.el.getAttribute(PHX_UPLOAD_REF)
        );
        LiveUploader.getEntryDataURL(this.inputEl, this.ref, (url) => {
          this.url = url;
          this.el.src = url;
        });
      },
      destroyed() {
        URL.revokeObjectURL(this.url);
      }
    },
    FocusWrap: {
      mounted() {
        this.focusStart = this.el.firstElementChild;
        this.focusEnd = this.el.lastElementChild;
        this.focusStart.addEventListener("focus", (e7) => {
          if (!e7.relatedTarget || !this.el.contains(e7.relatedTarget)) {
            const nextFocus = e7.target.nextElementSibling;
            aria_default.attemptFocus(nextFocus) || aria_default.focusFirst(nextFocus);
          } else {
            aria_default.focusLast(this.el);
          }
        });
        this.focusEnd.addEventListener("focus", (e7) => {
          if (!e7.relatedTarget || !this.el.contains(e7.relatedTarget)) {
            const nextFocus = e7.target.previousElementSibling;
            aria_default.attemptFocus(nextFocus) || aria_default.focusLast(nextFocus);
          } else {
            aria_default.focusFirst(this.el);
          }
        });
        if (!this.el.contains(document.activeElement)) {
          this.el.addEventListener("phx:show-end", () => this.el.focus());
          if (window.getComputedStyle(this.el).display !== "none") {
            aria_default.focusFirst(this.el);
          }
        }
      }
    }
  };
  var findScrollContainer = (el) => {
    if (["HTML", "BODY"].indexOf(el.nodeName.toUpperCase()) >= 0)
      return null;
    if (["scroll", "auto"].indexOf(getComputedStyle(el).overflowY) >= 0)
      return el;
    return findScrollContainer(el.parentElement);
  };
  var scrollTop = (scrollContainer) => {
    if (scrollContainer) {
      return scrollContainer.scrollTop;
    } else {
      return document.documentElement.scrollTop || document.body.scrollTop;
    }
  };
  var bottom = (scrollContainer) => {
    if (scrollContainer) {
      return scrollContainer.getBoundingClientRect().bottom;
    } else {
      return window.innerHeight || document.documentElement.clientHeight;
    }
  };
  var top = (scrollContainer) => {
    if (scrollContainer) {
      return scrollContainer.getBoundingClientRect().top;
    } else {
      return 0;
    }
  };
  var isAtViewportTop = (el, scrollContainer) => {
    const rect = el.getBoundingClientRect();
    return Math.ceil(rect.top) >= top(scrollContainer) && Math.ceil(rect.left) >= 0 && Math.floor(rect.top) <= bottom(scrollContainer);
  };
  var isAtViewportBottom = (el, scrollContainer) => {
    const rect = el.getBoundingClientRect();
    return Math.ceil(rect.bottom) >= top(scrollContainer) && Math.ceil(rect.left) >= 0 && Math.floor(rect.bottom) <= bottom(scrollContainer);
  };
  var isWithinViewport = (el, scrollContainer) => {
    const rect = el.getBoundingClientRect();
    return Math.ceil(rect.top) >= top(scrollContainer) && Math.ceil(rect.left) >= 0 && Math.floor(rect.top) <= bottom(scrollContainer);
  };
  Hooks.InfiniteScroll = {
    mounted() {
      this.scrollContainer = findScrollContainer(this.el);
      let scrollBefore = scrollTop(this.scrollContainer);
      let topOverran = false;
      const throttleInterval = 500;
      let pendingOp = null;
      const onTopOverrun = this.throttle(
        throttleInterval,
        (topEvent, firstChild) => {
          pendingOp = () => true;
          this.liveSocket.js().push(this.el, topEvent, {
            value: { id: firstChild.id, _overran: true },
            callback: () => {
              pendingOp = null;
            }
          });
        }
      );
      const onFirstChildAtTop = this.throttle(
        throttleInterval,
        (topEvent, firstChild) => {
          pendingOp = () => firstChild.scrollIntoView({ block: "start" });
          this.liveSocket.js().push(this.el, topEvent, {
            value: { id: firstChild.id },
            callback: () => {
              pendingOp = null;
              window.requestAnimationFrame(() => {
                if (!isWithinViewport(firstChild, this.scrollContainer)) {
                  firstChild.scrollIntoView({ block: "start" });
                }
              });
            }
          });
        }
      );
      const onLastChildAtBottom = this.throttle(
        throttleInterval,
        (bottomEvent, lastChild) => {
          pendingOp = () => lastChild.scrollIntoView({ block: "end" });
          this.liveSocket.js().push(this.el, bottomEvent, {
            value: { id: lastChild.id },
            callback: () => {
              pendingOp = null;
              window.requestAnimationFrame(() => {
                if (!isWithinViewport(lastChild, this.scrollContainer)) {
                  lastChild.scrollIntoView({ block: "end" });
                }
              });
            }
          });
        }
      );
      this.onScroll = (_e) => {
        const scrollNow = scrollTop(this.scrollContainer);
        if (pendingOp) {
          scrollBefore = scrollNow;
          return pendingOp();
        }
        const rect = this.findOverrunTarget();
        const topEvent = this.el.getAttribute(
          this.liveSocket.binding("viewport-top")
        );
        const bottomEvent = this.el.getAttribute(
          this.liveSocket.binding("viewport-bottom")
        );
        const lastChild = this.el.lastElementChild;
        const firstChild = this.el.firstElementChild;
        const isScrollingUp = scrollNow < scrollBefore;
        const isScrollingDown = scrollNow > scrollBefore;
        if (isScrollingUp && topEvent && !topOverran && rect.top >= 0) {
          topOverran = true;
          onTopOverrun(topEvent, firstChild);
        } else if (isScrollingDown && topOverran && rect.top <= 0) {
          topOverran = false;
        }
        if (topEvent && isScrollingUp && isAtViewportTop(firstChild, this.scrollContainer)) {
          onFirstChildAtTop(topEvent, firstChild);
        } else if (bottomEvent && isScrollingDown && isAtViewportBottom(lastChild, this.scrollContainer)) {
          onLastChildAtBottom(bottomEvent, lastChild);
        }
        scrollBefore = scrollNow;
      };
      if (this.scrollContainer) {
        this.scrollContainer.addEventListener("scroll", this.onScroll);
      } else {
        window.addEventListener("scroll", this.onScroll);
      }
    },
    destroyed() {
      if (this.scrollContainer) {
        this.scrollContainer.removeEventListener("scroll", this.onScroll);
      } else {
        window.removeEventListener("scroll", this.onScroll);
      }
    },
    throttle(interval, callback) {
      let lastCallAt = 0;
      let timer;
      return (...args) => {
        const now = Date.now();
        const remainingTime = interval - (now - lastCallAt);
        if (remainingTime <= 0 || remainingTime > interval) {
          if (timer) {
            clearTimeout(timer);
            timer = null;
          }
          lastCallAt = now;
          callback(...args);
        } else if (!timer) {
          timer = setTimeout(() => {
            lastCallAt = Date.now();
            timer = null;
            callback(...args);
          }, remainingTime);
        }
      };
    },
    findOverrunTarget() {
      let rect;
      const overrunTarget = this.el.getAttribute(
        this.liveSocket.binding(PHX_VIEWPORT_OVERRUN_TARGET)
      );
      if (overrunTarget) {
        const overrunEl = document.getElementById(overrunTarget);
        if (overrunEl) {
          rect = overrunEl.getBoundingClientRect();
        } else {
          throw new Error("did not find element with id " + overrunTarget);
        }
      } else {
        rect = this.el.getBoundingClientRect();
      }
      return rect;
    }
  };
  var hooks_default = Hooks;
  var ElementRef = class {
    static onUnlock(el, callback) {
      if (!dom_default.isLocked(el) && !el.closest(`[${PHX_REF_LOCK}]`)) {
        return callback();
      }
      const closestLock = el.closest(`[${PHX_REF_LOCK}]`);
      const ref = closestLock.closest(`[${PHX_REF_LOCK}]`).getAttribute(PHX_REF_LOCK);
      closestLock.addEventListener(
        `phx:undo-lock:${ref}`,
        () => {
          callback();
        },
        { once: true }
      );
    }
    constructor(el) {
      this.el = el;
      this.loadingRef = el.hasAttribute(PHX_REF_LOADING) ? parseInt(el.getAttribute(PHX_REF_LOADING), 10) : null;
      this.lockRef = el.hasAttribute(PHX_REF_LOCK) ? parseInt(el.getAttribute(PHX_REF_LOCK), 10) : null;
    }
    // public
    maybeUndo(ref, phxEvent, eachCloneCallback) {
      if (!this.isWithin(ref)) {
        dom_default.updatePrivate(this.el, PHX_PENDING_REFS, [], (pendingRefs) => {
          pendingRefs.push(ref);
          return pendingRefs;
        });
        return;
      }
      this.undoLocks(ref, phxEvent, eachCloneCallback);
      this.undoLoading(ref, phxEvent);
      dom_default.updatePrivate(this.el, PHX_PENDING_REFS, [], (pendingRefs) => {
        return pendingRefs.filter((pendingRef) => {
          let opts = {
            detail: { ref: pendingRef, event: phxEvent },
            bubbles: true,
            cancelable: false
          };
          if (this.loadingRef && this.loadingRef > pendingRef) {
            this.el.dispatchEvent(
              new CustomEvent(`phx:undo-loading:${pendingRef}`, opts)
            );
          }
          if (this.lockRef && this.lockRef > pendingRef) {
            this.el.dispatchEvent(
              new CustomEvent(`phx:undo-lock:${pendingRef}`, opts)
            );
          }
          return pendingRef > ref;
        });
      });
      if (this.isFullyResolvedBy(ref)) {
        this.el.removeAttribute(PHX_REF_SRC);
      }
    }
    // private
    isWithin(ref) {
      return !(this.loadingRef !== null && this.loadingRef > ref && this.lockRef !== null && this.lockRef > ref);
    }
    // Check for cloned PHX_REF_LOCK element that has been morphed behind
    // the scenes while this element was locked in the DOM.
    // When we apply the cloned tree to the active DOM element, we must
    //
    //   1. execute pending mounted hooks for nodes now in the DOM
    //   2. undo any ref inside the cloned tree that has since been ack'd
    undoLocks(ref, phxEvent, eachCloneCallback) {
      if (!this.isLockUndoneBy(ref)) {
        return;
      }
      const clonedTree = dom_default.private(this.el, PHX_REF_LOCK);
      if (clonedTree) {
        eachCloneCallback(clonedTree);
        dom_default.deletePrivate(this.el, PHX_REF_LOCK);
      }
      this.el.removeAttribute(PHX_REF_LOCK);
      const opts = {
        detail: { ref, event: phxEvent },
        bubbles: true,
        cancelable: false
      };
      this.el.dispatchEvent(
        new CustomEvent(`phx:undo-lock:${this.lockRef}`, opts)
      );
    }
    undoLoading(ref, phxEvent) {
      if (!this.isLoadingUndoneBy(ref)) {
        if (this.canUndoLoading(ref) && this.el.classList.contains("phx-submit-loading")) {
          this.el.classList.remove("phx-change-loading");
        }
        return;
      }
      if (this.canUndoLoading(ref)) {
        this.el.removeAttribute(PHX_REF_LOADING);
        const disabledVal = this.el.getAttribute(PHX_DISABLED);
        const readOnlyVal = this.el.getAttribute(PHX_READONLY);
        if (readOnlyVal !== null) {
          this.el.readOnly = readOnlyVal === "true" ? true : false;
          this.el.removeAttribute(PHX_READONLY);
        }
        if (disabledVal !== null) {
          this.el.disabled = disabledVal === "true" ? true : false;
          this.el.removeAttribute(PHX_DISABLED);
        }
        const disableRestore = this.el.getAttribute(PHX_DISABLE_WITH_RESTORE);
        if (disableRestore !== null) {
          this.el.textContent = disableRestore;
          this.el.removeAttribute(PHX_DISABLE_WITH_RESTORE);
        }
        const opts = {
          detail: { ref, event: phxEvent },
          bubbles: true,
          cancelable: false
        };
        this.el.dispatchEvent(
          new CustomEvent(`phx:undo-loading:${this.loadingRef}`, opts)
        );
      }
      PHX_EVENT_CLASSES.forEach((name) => {
        if (name !== "phx-submit-loading" || this.canUndoLoading(ref)) {
          dom_default.removeClass(this.el, name);
        }
      });
    }
    isLoadingUndoneBy(ref) {
      return this.loadingRef === null ? false : this.loadingRef <= ref;
    }
    isLockUndoneBy(ref) {
      return this.lockRef === null ? false : this.lockRef <= ref;
    }
    isFullyResolvedBy(ref) {
      return (this.loadingRef === null || this.loadingRef <= ref) && (this.lockRef === null || this.lockRef <= ref);
    }
    // only remove the phx-submit-loading class if we are not locked
    canUndoLoading(ref) {
      return this.lockRef === null || this.lockRef <= ref;
    }
  };
  var DOMPostMorphRestorer = class {
    constructor(containerBefore, containerAfter, updateType) {
      const idsBefore = /* @__PURE__ */ new Set();
      const idsAfter = new Set(
        [...containerAfter.children].map((child) => child.id)
      );
      const elementsToModify = [];
      Array.from(containerBefore.children).forEach((child) => {
        if (child.id) {
          idsBefore.add(child.id);
          if (idsAfter.has(child.id)) {
            const previousElementId = child.previousElementSibling && child.previousElementSibling.id;
            elementsToModify.push({
              elementId: child.id,
              previousElementId
            });
          }
        }
      });
      this.containerId = containerAfter.id;
      this.updateType = updateType;
      this.elementsToModify = elementsToModify;
      this.elementIdsToAdd = [...idsAfter].filter((id) => !idsBefore.has(id));
    }
    // We do the following to optimize append/prepend operations:
    //   1) Track ids of modified elements & of new elements
    //   2) All the modified elements are put back in the correct position in the DOM tree
    //      by storing the id of their previous sibling
    //   3) New elements are going to be put in the right place by morphdom during append.
    //      For prepend, we move them to the first position in the container
    perform() {
      const container = dom_default.byId(this.containerId);
      if (!container) {
        return;
      }
      this.elementsToModify.forEach((elementToModify) => {
        if (elementToModify.previousElementId) {
          maybe(
            document.getElementById(elementToModify.previousElementId),
            (previousElem) => {
              maybe(
                document.getElementById(elementToModify.elementId),
                (elem) => {
                  const isInRightPlace = elem.previousElementSibling && elem.previousElementSibling.id == previousElem.id;
                  if (!isInRightPlace) {
                    previousElem.insertAdjacentElement("afterend", elem);
                  }
                }
              );
            }
          );
        } else {
          maybe(document.getElementById(elementToModify.elementId), (elem) => {
            const isInRightPlace = elem.previousElementSibling == null;
            if (!isInRightPlace) {
              container.insertAdjacentElement("afterbegin", elem);
            }
          });
        }
      });
      if (this.updateType == "prepend") {
        this.elementIdsToAdd.reverse().forEach((elemId) => {
          maybe(
            document.getElementById(elemId),
            (elem) => container.insertAdjacentElement("afterbegin", elem)
          );
        });
      }
    }
  };
  var DOCUMENT_FRAGMENT_NODE = 11;
  function morphAttrs(fromNode, toNode) {
    var toNodeAttrs = toNode.attributes;
    var attr;
    var attrName;
    var attrNamespaceURI;
    var attrValue;
    var fromValue;
    if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE || fromNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
      return;
    }
    for (var i7 = toNodeAttrs.length - 1; i7 >= 0; i7--) {
      attr = toNodeAttrs[i7];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      attrValue = attr.value;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        fromValue = fromNode.getAttributeNS(attrNamespaceURI, attrName);
        if (fromValue !== attrValue) {
          if (attr.prefix === "xmlns") {
            attrName = attr.name;
          }
          fromNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
        }
      } else {
        fromValue = fromNode.getAttribute(attrName);
        if (fromValue !== attrValue) {
          fromNode.setAttribute(attrName, attrValue);
        }
      }
    }
    var fromNodeAttrs = fromNode.attributes;
    for (var d3 = fromNodeAttrs.length - 1; d3 >= 0; d3--) {
      attr = fromNodeAttrs[d3];
      attrName = attr.name;
      attrNamespaceURI = attr.namespaceURI;
      if (attrNamespaceURI) {
        attrName = attr.localName || attrName;
        if (!toNode.hasAttributeNS(attrNamespaceURI, attrName)) {
          fromNode.removeAttributeNS(attrNamespaceURI, attrName);
        }
      } else {
        if (!toNode.hasAttribute(attrName)) {
          fromNode.removeAttribute(attrName);
        }
      }
    }
  }
  var range;
  var NS_XHTML = "http://www.w3.org/1999/xhtml";
  var doc = typeof document === "undefined" ? void 0 : document;
  var HAS_TEMPLATE_SUPPORT = !!doc && "content" in doc.createElement("template");
  var HAS_RANGE_SUPPORT = !!doc && doc.createRange && "createContextualFragment" in doc.createRange();
  function createFragmentFromTemplate(str) {
    var template = doc.createElement("template");
    template.innerHTML = str;
    return template.content.childNodes[0];
  }
  function createFragmentFromRange(str) {
    if (!range) {
      range = doc.createRange();
      range.selectNode(doc.body);
    }
    var fragment = range.createContextualFragment(str);
    return fragment.childNodes[0];
  }
  function createFragmentFromWrap(str) {
    var fragment = doc.createElement("body");
    fragment.innerHTML = str;
    return fragment.childNodes[0];
  }
  function toElement(str) {
    str = str.trim();
    if (HAS_TEMPLATE_SUPPORT) {
      return createFragmentFromTemplate(str);
    } else if (HAS_RANGE_SUPPORT) {
      return createFragmentFromRange(str);
    }
    return createFragmentFromWrap(str);
  }
  function compareNodeNames(fromEl, toEl) {
    var fromNodeName = fromEl.nodeName;
    var toNodeName = toEl.nodeName;
    var fromCodeStart, toCodeStart;
    if (fromNodeName === toNodeName) {
      return true;
    }
    fromCodeStart = fromNodeName.charCodeAt(0);
    toCodeStart = toNodeName.charCodeAt(0);
    if (fromCodeStart <= 90 && toCodeStart >= 97) {
      return fromNodeName === toNodeName.toUpperCase();
    } else if (toCodeStart <= 90 && fromCodeStart >= 97) {
      return toNodeName === fromNodeName.toUpperCase();
    } else {
      return false;
    }
  }
  function createElementNS(name, namespaceURI) {
    return !namespaceURI || namespaceURI === NS_XHTML ? doc.createElement(name) : doc.createElementNS(namespaceURI, name);
  }
  function moveChildren(fromEl, toEl) {
    var curChild = fromEl.firstChild;
    while (curChild) {
      var nextChild = curChild.nextSibling;
      toEl.appendChild(curChild);
      curChild = nextChild;
    }
    return toEl;
  }
  function syncBooleanAttrProp(fromEl, toEl, name) {
    if (fromEl[name] !== toEl[name]) {
      fromEl[name] = toEl[name];
      if (fromEl[name]) {
        fromEl.setAttribute(name, "");
      } else {
        fromEl.removeAttribute(name);
      }
    }
  }
  var specialElHandlers = {
    OPTION: function(fromEl, toEl) {
      var parentNode = fromEl.parentNode;
      if (parentNode) {
        var parentName = parentNode.nodeName.toUpperCase();
        if (parentName === "OPTGROUP") {
          parentNode = parentNode.parentNode;
          parentName = parentNode && parentNode.nodeName.toUpperCase();
        }
        if (parentName === "SELECT" && !parentNode.hasAttribute("multiple")) {
          if (fromEl.hasAttribute("selected") && !toEl.selected) {
            fromEl.setAttribute("selected", "selected");
            fromEl.removeAttribute("selected");
          }
          parentNode.selectedIndex = -1;
        }
      }
      syncBooleanAttrProp(fromEl, toEl, "selected");
    },
    /**
     * The "value" attribute is special for the <input> element since it sets
     * the initial value. Changing the "value" attribute without changing the
     * "value" property will have no effect since it is only used to the set the
     * initial value.  Similar for the "checked" attribute, and "disabled".
     */
    INPUT: function(fromEl, toEl) {
      syncBooleanAttrProp(fromEl, toEl, "checked");
      syncBooleanAttrProp(fromEl, toEl, "disabled");
      if (fromEl.value !== toEl.value) {
        fromEl.value = toEl.value;
      }
      if (!toEl.hasAttribute("value")) {
        fromEl.removeAttribute("value");
      }
    },
    TEXTAREA: function(fromEl, toEl) {
      var newValue = toEl.value;
      if (fromEl.value !== newValue) {
        fromEl.value = newValue;
      }
      var firstChild = fromEl.firstChild;
      if (firstChild) {
        var oldValue = firstChild.nodeValue;
        if (oldValue == newValue || !newValue && oldValue == fromEl.placeholder) {
          return;
        }
        firstChild.nodeValue = newValue;
      }
    },
    SELECT: function(fromEl, toEl) {
      if (!toEl.hasAttribute("multiple")) {
        var selectedIndex = -1;
        var i7 = 0;
        var curChild = fromEl.firstChild;
        var optgroup;
        var nodeName;
        while (curChild) {
          nodeName = curChild.nodeName && curChild.nodeName.toUpperCase();
          if (nodeName === "OPTGROUP") {
            optgroup = curChild;
            curChild = optgroup.firstChild;
            if (!curChild) {
              curChild = optgroup.nextSibling;
              optgroup = null;
            }
          } else {
            if (nodeName === "OPTION") {
              if (curChild.hasAttribute("selected")) {
                selectedIndex = i7;
                break;
              }
              i7++;
            }
            curChild = curChild.nextSibling;
            if (!curChild && optgroup) {
              curChild = optgroup.nextSibling;
              optgroup = null;
            }
          }
        }
        fromEl.selectedIndex = selectedIndex;
      }
    }
  };
  var ELEMENT_NODE = 1;
  var DOCUMENT_FRAGMENT_NODE$1 = 11;
  var TEXT_NODE = 3;
  var COMMENT_NODE = 8;
  function noop() {
  }
  function defaultGetNodeKey(node) {
    if (node) {
      return node.getAttribute && node.getAttribute("id") || node.id;
    }
  }
  function morphdomFactory(morphAttrs2) {
    return function morphdom2(fromNode, toNode, options) {
      if (!options) {
        options = {};
      }
      if (typeof toNode === "string") {
        if (fromNode.nodeName === "#document" || fromNode.nodeName === "HTML") {
          var toNodeHtml = toNode;
          toNode = doc.createElement("html");
          toNode.innerHTML = toNodeHtml;
        } else if (fromNode.nodeName === "BODY") {
          var toNodeBody = toNode;
          toNode = doc.createElement("html");
          toNode.innerHTML = toNodeBody;
          var bodyElement = toNode.querySelector("body");
          if (bodyElement) {
            toNode = bodyElement;
          }
        } else {
          toNode = toElement(toNode);
        }
      } else if (toNode.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
        toNode = toNode.firstElementChild;
      }
      var getNodeKey = options.getNodeKey || defaultGetNodeKey;
      var onBeforeNodeAdded = options.onBeforeNodeAdded || noop;
      var onNodeAdded = options.onNodeAdded || noop;
      var onBeforeElUpdated = options.onBeforeElUpdated || noop;
      var onElUpdated = options.onElUpdated || noop;
      var onBeforeNodeDiscarded = options.onBeforeNodeDiscarded || noop;
      var onNodeDiscarded = options.onNodeDiscarded || noop;
      var onBeforeElChildrenUpdated = options.onBeforeElChildrenUpdated || noop;
      var skipFromChildren = options.skipFromChildren || noop;
      var addChild = options.addChild || function(parent, child) {
        return parent.appendChild(child);
      };
      var childrenOnly = options.childrenOnly === true;
      var fromNodesLookup = /* @__PURE__ */ Object.create(null);
      var keyedRemovalList = [];
      function addKeyedRemoval(key) {
        keyedRemovalList.push(key);
      }
      function walkDiscardedChildNodes(node, skipKeyedNodes) {
        if (node.nodeType === ELEMENT_NODE) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = void 0;
            if (skipKeyedNodes && (key = getNodeKey(curChild))) {
              addKeyedRemoval(key);
            } else {
              onNodeDiscarded(curChild);
              if (curChild.firstChild) {
                walkDiscardedChildNodes(curChild, skipKeyedNodes);
              }
            }
            curChild = curChild.nextSibling;
          }
        }
      }
      function removeNode(node, parentNode, skipKeyedNodes) {
        if (onBeforeNodeDiscarded(node) === false) {
          return;
        }
        if (parentNode) {
          parentNode.removeChild(node);
        }
        onNodeDiscarded(node);
        walkDiscardedChildNodes(node, skipKeyedNodes);
      }
      function indexTree(node) {
        if (node.nodeType === ELEMENT_NODE || node.nodeType === DOCUMENT_FRAGMENT_NODE$1) {
          var curChild = node.firstChild;
          while (curChild) {
            var key = getNodeKey(curChild);
            if (key) {
              fromNodesLookup[key] = curChild;
            }
            indexTree(curChild);
            curChild = curChild.nextSibling;
          }
        }
      }
      indexTree(fromNode);
      function handleNodeAdded(el) {
        onNodeAdded(el);
        var curChild = el.firstChild;
        while (curChild) {
          var nextSibling = curChild.nextSibling;
          var key = getNodeKey(curChild);
          if (key) {
            var unmatchedFromEl = fromNodesLookup[key];
            if (unmatchedFromEl && compareNodeNames(curChild, unmatchedFromEl)) {
              curChild.parentNode.replaceChild(unmatchedFromEl, curChild);
              morphEl(unmatchedFromEl, curChild);
            } else {
              handleNodeAdded(curChild);
            }
          } else {
            handleNodeAdded(curChild);
          }
          curChild = nextSibling;
        }
      }
      function cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey) {
        while (curFromNodeChild) {
          var fromNextSibling = curFromNodeChild.nextSibling;
          if (curFromNodeKey = getNodeKey(curFromNodeChild)) {
            addKeyedRemoval(curFromNodeKey);
          } else {
            removeNode(
              curFromNodeChild,
              fromEl,
              true
              /* skip keyed nodes */
            );
          }
          curFromNodeChild = fromNextSibling;
        }
      }
      function morphEl(fromEl, toEl, childrenOnly2) {
        var toElKey = getNodeKey(toEl);
        if (toElKey) {
          delete fromNodesLookup[toElKey];
        }
        if (!childrenOnly2) {
          var beforeUpdateResult = onBeforeElUpdated(fromEl, toEl);
          if (beforeUpdateResult === false) {
            return;
          } else if (beforeUpdateResult instanceof HTMLElement) {
            fromEl = beforeUpdateResult;
            indexTree(fromEl);
          }
          morphAttrs2(fromEl, toEl);
          onElUpdated(fromEl);
          if (onBeforeElChildrenUpdated(fromEl, toEl) === false) {
            return;
          }
        }
        if (fromEl.nodeName !== "TEXTAREA") {
          morphChildren(fromEl, toEl);
        } else {
          specialElHandlers.TEXTAREA(fromEl, toEl);
        }
      }
      function morphChildren(fromEl, toEl) {
        var skipFrom = skipFromChildren(fromEl, toEl);
        var curToNodeChild = toEl.firstChild;
        var curFromNodeChild = fromEl.firstChild;
        var curToNodeKey;
        var curFromNodeKey;
        var fromNextSibling;
        var toNextSibling;
        var matchingFromEl;
        outer:
          while (curToNodeChild) {
            toNextSibling = curToNodeChild.nextSibling;
            curToNodeKey = getNodeKey(curToNodeChild);
            while (!skipFrom && curFromNodeChild) {
              fromNextSibling = curFromNodeChild.nextSibling;
              if (curToNodeChild.isSameNode && curToNodeChild.isSameNode(curFromNodeChild)) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              curFromNodeKey = getNodeKey(curFromNodeChild);
              var curFromNodeType = curFromNodeChild.nodeType;
              var isCompatible = void 0;
              if (curFromNodeType === curToNodeChild.nodeType) {
                if (curFromNodeType === ELEMENT_NODE) {
                  if (curToNodeKey) {
                    if (curToNodeKey !== curFromNodeKey) {
                      if (matchingFromEl = fromNodesLookup[curToNodeKey]) {
                        if (fromNextSibling === matchingFromEl) {
                          isCompatible = false;
                        } else {
                          fromEl.insertBefore(matchingFromEl, curFromNodeChild);
                          if (curFromNodeKey) {
                            addKeyedRemoval(curFromNodeKey);
                          } else {
                            removeNode(
                              curFromNodeChild,
                              fromEl,
                              true
                              /* skip keyed nodes */
                            );
                          }
                          curFromNodeChild = matchingFromEl;
                          curFromNodeKey = getNodeKey(curFromNodeChild);
                        }
                      } else {
                        isCompatible = false;
                      }
                    }
                  } else if (curFromNodeKey) {
                    isCompatible = false;
                  }
                  isCompatible = isCompatible !== false && compareNodeNames(curFromNodeChild, curToNodeChild);
                  if (isCompatible) {
                    morphEl(curFromNodeChild, curToNodeChild);
                  }
                } else if (curFromNodeType === TEXT_NODE || curFromNodeType == COMMENT_NODE) {
                  isCompatible = true;
                  if (curFromNodeChild.nodeValue !== curToNodeChild.nodeValue) {
                    curFromNodeChild.nodeValue = curToNodeChild.nodeValue;
                  }
                }
              }
              if (isCompatible) {
                curToNodeChild = toNextSibling;
                curFromNodeChild = fromNextSibling;
                continue outer;
              }
              if (curFromNodeKey) {
                addKeyedRemoval(curFromNodeKey);
              } else {
                removeNode(
                  curFromNodeChild,
                  fromEl,
                  true
                  /* skip keyed nodes */
                );
              }
              curFromNodeChild = fromNextSibling;
            }
            if (curToNodeKey && (matchingFromEl = fromNodesLookup[curToNodeKey]) && compareNodeNames(matchingFromEl, curToNodeChild)) {
              if (!skipFrom) {
                addChild(fromEl, matchingFromEl);
              }
              morphEl(matchingFromEl, curToNodeChild);
            } else {
              var onBeforeNodeAddedResult = onBeforeNodeAdded(curToNodeChild);
              if (onBeforeNodeAddedResult !== false) {
                if (onBeforeNodeAddedResult) {
                  curToNodeChild = onBeforeNodeAddedResult;
                }
                if (curToNodeChild.actualize) {
                  curToNodeChild = curToNodeChild.actualize(fromEl.ownerDocument || doc);
                }
                addChild(fromEl, curToNodeChild);
                handleNodeAdded(curToNodeChild);
              }
            }
            curToNodeChild = toNextSibling;
            curFromNodeChild = fromNextSibling;
          }
        cleanupFromEl(fromEl, curFromNodeChild, curFromNodeKey);
        var specialElHandler = specialElHandlers[fromEl.nodeName];
        if (specialElHandler) {
          specialElHandler(fromEl, toEl);
        }
      }
      var morphedNode = fromNode;
      var morphedNodeType = morphedNode.nodeType;
      var toNodeType = toNode.nodeType;
      if (!childrenOnly) {
        if (morphedNodeType === ELEMENT_NODE) {
          if (toNodeType === ELEMENT_NODE) {
            if (!compareNodeNames(fromNode, toNode)) {
              onNodeDiscarded(fromNode);
              morphedNode = moveChildren(fromNode, createElementNS(toNode.nodeName, toNode.namespaceURI));
            }
          } else {
            morphedNode = toNode;
          }
        } else if (morphedNodeType === TEXT_NODE || morphedNodeType === COMMENT_NODE) {
          if (toNodeType === morphedNodeType) {
            if (morphedNode.nodeValue !== toNode.nodeValue) {
              morphedNode.nodeValue = toNode.nodeValue;
            }
            return morphedNode;
          } else {
            morphedNode = toNode;
          }
        }
      }
      if (morphedNode === toNode) {
        onNodeDiscarded(fromNode);
      } else {
        if (toNode.isSameNode && toNode.isSameNode(morphedNode)) {
          return;
        }
        morphEl(morphedNode, toNode, childrenOnly);
        if (keyedRemovalList) {
          for (var i7 = 0, len = keyedRemovalList.length; i7 < len; i7++) {
            var elToRemove = fromNodesLookup[keyedRemovalList[i7]];
            if (elToRemove) {
              removeNode(elToRemove, elToRemove.parentNode, false);
            }
          }
        }
      }
      if (!childrenOnly && morphedNode !== fromNode && fromNode.parentNode) {
        if (morphedNode.actualize) {
          morphedNode = morphedNode.actualize(fromNode.ownerDocument || doc);
        }
        fromNode.parentNode.replaceChild(morphedNode, fromNode);
      }
      return morphedNode;
    };
  }
  var morphdom = morphdomFactory(morphAttrs);
  var morphdom_esm_default = morphdom;
  var DOMPatch = class {
    constructor(view, container, id, html, streams, targetCID, opts = {}) {
      this.view = view;
      this.liveSocket = view.liveSocket;
      this.container = container;
      this.id = id;
      this.rootID = view.root.id;
      this.html = html;
      this.streams = streams;
      this.streamInserts = {};
      this.streamComponentRestore = {};
      this.targetCID = targetCID;
      this.cidPatch = isCid(this.targetCID);
      this.pendingRemoves = [];
      this.phxRemove = this.liveSocket.binding("remove");
      this.targetContainer = this.isCIDPatch() ? this.targetCIDContainer(html) : container;
      this.callbacks = {
        beforeadded: [],
        beforeupdated: [],
        beforephxChildAdded: [],
        afteradded: [],
        afterupdated: [],
        afterdiscarded: [],
        afterphxChildAdded: [],
        aftertransitionsDiscarded: []
      };
      this.withChildren = opts.withChildren || opts.undoRef || false;
      this.undoRef = opts.undoRef;
    }
    before(kind, callback) {
      this.callbacks[`before${kind}`].push(callback);
    }
    after(kind, callback) {
      this.callbacks[`after${kind}`].push(callback);
    }
    trackBefore(kind, ...args) {
      this.callbacks[`before${kind}`].forEach((callback) => callback(...args));
    }
    trackAfter(kind, ...args) {
      this.callbacks[`after${kind}`].forEach((callback) => callback(...args));
    }
    markPrunableContentForRemoval() {
      const phxUpdate = this.liveSocket.binding(PHX_UPDATE);
      dom_default.all(
        this.container,
        `[${phxUpdate}=append] > *, [${phxUpdate}=prepend] > *`,
        (el) => {
          el.setAttribute(PHX_PRUNE, "");
        }
      );
    }
    perform(isJoinPatch) {
      const { view, liveSocket: liveSocket2, html, container } = this;
      let targetContainer = this.targetContainer;
      if (this.isCIDPatch() && !this.targetContainer) {
        return;
      }
      if (this.isCIDPatch()) {
        const closestLock = targetContainer.closest(`[${PHX_REF_LOCK}]`);
        if (closestLock && !closestLock.isSameNode(targetContainer)) {
          const clonedTree = dom_default.private(closestLock, PHX_REF_LOCK);
          if (clonedTree) {
            targetContainer = clonedTree.querySelector(
              `[data-phx-component="${this.targetCID}"]`
            );
          }
        }
      }
      const focused = liveSocket2.getActiveElement();
      const { selectionStart, selectionEnd } = focused && dom_default.hasSelectionRange(focused) ? focused : {};
      const phxUpdate = liveSocket2.binding(PHX_UPDATE);
      const phxViewportTop = liveSocket2.binding(PHX_VIEWPORT_TOP);
      const phxViewportBottom = liveSocket2.binding(PHX_VIEWPORT_BOTTOM);
      const phxTriggerExternal = liveSocket2.binding(PHX_TRIGGER_ACTION);
      const added = [];
      const updates = [];
      const appendPrependUpdates = [];
      let portalCallbacks = [];
      let externalFormTriggered = null;
      const morph = (targetContainer2, source, withChildren = this.withChildren) => {
        const morphCallbacks = {
          // normally, we are running with childrenOnly, as the patch HTML for a LV
          // does not include the LV attrs (data-phx-session, etc.)
          // when we are patching a live component, we do want to patch the root element as well;
          // another case is the recursive patch of a stream item that was kept on reset (-> onBeforeNodeAdded)
          childrenOnly: targetContainer2.getAttribute(PHX_COMPONENT) === null && !withChildren,
          getNodeKey: (node) => {
            if (dom_default.isPhxDestroyed(node)) {
              return null;
            }
            if (isJoinPatch) {
              return node.id;
            }
            return node.id || node.getAttribute && node.getAttribute(PHX_MAGIC_ID);
          },
          // skip indexing from children when container is stream
          skipFromChildren: (from) => {
            return from.getAttribute(phxUpdate) === PHX_STREAM;
          },
          // tell morphdom how to add a child
          addChild: (parent, child) => {
            const { ref, streamAt } = this.getStreamInsert(child);
            if (ref === void 0) {
              return parent.appendChild(child);
            }
            this.setStreamRef(child, ref);
            if (streamAt === 0) {
              parent.insertAdjacentElement("afterbegin", child);
            } else if (streamAt === -1) {
              const lastChild = parent.lastElementChild;
              if (lastChild && !lastChild.hasAttribute(PHX_STREAM_REF)) {
                const nonStreamChild = Array.from(parent.children).find(
                  (c5) => !c5.hasAttribute(PHX_STREAM_REF)
                );
                parent.insertBefore(child, nonStreamChild);
              } else {
                parent.appendChild(child);
              }
            } else if (streamAt > 0) {
              const sibling = Array.from(parent.children)[streamAt];
              parent.insertBefore(child, sibling);
            }
          },
          onBeforeNodeAdded: (el) => {
            if (this.getStreamInsert(el)?.updateOnly && !this.streamComponentRestore[el.id]) {
              return false;
            }
            dom_default.maintainPrivateHooks(el, el, phxViewportTop, phxViewportBottom);
            this.trackBefore("added", el);
            let morphedEl = el;
            if (this.streamComponentRestore[el.id]) {
              morphedEl = this.streamComponentRestore[el.id];
              delete this.streamComponentRestore[el.id];
              morph(morphedEl, el, true);
            }
            return morphedEl;
          },
          onNodeAdded: (el) => {
            if (el.getAttribute) {
              this.maybeReOrderStream(el, true);
            }
            if (dom_default.isPortalTemplate(el)) {
              portalCallbacks.push(() => this.teleport(el, morph));
            }
            if (el instanceof HTMLImageElement && el.srcset) {
              el.srcset = el.srcset;
            } else if (el instanceof HTMLVideoElement && el.autoplay) {
              el.play();
            }
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            if (dom_default.isPhxChild(el) && view.ownsElement(el) || dom_default.isPhxSticky(el) && view.ownsElement(el.parentNode)) {
              this.trackAfter("phxChildAdded", el);
            }
            if (el.nodeName === "SCRIPT" && el.hasAttribute(PHX_RUNTIME_HOOK)) {
              this.handleRuntimeHook(el, source);
            }
            added.push(el);
          },
          onNodeDiscarded: (el) => this.onNodeDiscarded(el),
          onBeforeNodeDiscarded: (el) => {
            if (el.getAttribute && el.getAttribute(PHX_PRUNE) !== null) {
              return true;
            }
            if (el.parentElement !== null && el.id && dom_default.isPhxUpdate(el.parentElement, phxUpdate, [
              PHX_STREAM,
              "append",
              "prepend"
            ])) {
              return false;
            }
            if (el.getAttribute && el.getAttribute(PHX_TELEPORTED_REF)) {
              return false;
            }
            if (this.maybePendingRemove(el)) {
              return false;
            }
            if (this.skipCIDSibling(el)) {
              return false;
            }
            if (dom_default.isPortalTemplate(el)) {
              const teleportedEl = document.getElementById(
                el.content.firstElementChild.id
              );
              if (teleportedEl) {
                teleportedEl.remove();
                morphCallbacks.onNodeDiscarded(teleportedEl);
                this.view.dropPortalElementId(teleportedEl.id);
              }
            }
            return true;
          },
          onElUpdated: (el) => {
            if (dom_default.isNowTriggerFormExternal(el, phxTriggerExternal)) {
              externalFormTriggered = el;
            }
            updates.push(el);
            this.maybeReOrderStream(el, false);
          },
          onBeforeElUpdated: (fromEl, toEl) => {
            if (fromEl.id && fromEl.isSameNode(targetContainer2) && fromEl.id !== toEl.id) {
              morphCallbacks.onNodeDiscarded(fromEl);
              fromEl.replaceWith(toEl);
              return morphCallbacks.onNodeAdded(toEl);
            }
            dom_default.syncPendingAttrs(fromEl, toEl);
            dom_default.maintainPrivateHooks(
              fromEl,
              toEl,
              phxViewportTop,
              phxViewportBottom
            );
            dom_default.cleanChildNodes(toEl, phxUpdate);
            if (this.skipCIDSibling(toEl)) {
              this.maybeReOrderStream(fromEl);
              return false;
            }
            if (dom_default.isPhxSticky(fromEl)) {
              [PHX_SESSION, PHX_STATIC, PHX_ROOT_ID].map((attr) => [
                attr,
                fromEl.getAttribute(attr),
                toEl.getAttribute(attr)
              ]).forEach(([attr, fromVal, toVal]) => {
                if (toVal && fromVal !== toVal) {
                  fromEl.setAttribute(attr, toVal);
                }
              });
              return false;
            }
            if (dom_default.isIgnored(fromEl, phxUpdate) || fromEl.form && fromEl.form.isSameNode(externalFormTriggered)) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeAttrs(fromEl, toEl, {
                isIgnored: dom_default.isIgnored(fromEl, phxUpdate)
              });
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (fromEl.type === "number" && fromEl.validity && fromEl.validity.badInput) {
              return false;
            }
            const isFocusedFormEl = focused && fromEl.isSameNode(focused) && dom_default.isFormInput(fromEl);
            const focusedSelectChanged = isFocusedFormEl && this.isChangedSelect(fromEl, toEl);
            if (fromEl.hasAttribute(PHX_REF_SRC)) {
              const ref = new ElementRef(fromEl);
              if (ref.lockRef && (!this.undoRef || !ref.isLockUndoneBy(this.undoRef))) {
                dom_default.applyStickyOperations(fromEl);
                const isLocked = fromEl.hasAttribute(PHX_REF_LOCK);
                const clone2 = isLocked ? dom_default.private(fromEl, PHX_REF_LOCK) || fromEl.cloneNode(true) : null;
                if (clone2) {
                  dom_default.putPrivate(fromEl, PHX_REF_LOCK, clone2);
                  if (!isFocusedFormEl) {
                    fromEl = clone2;
                  }
                }
              }
            }
            if (dom_default.isPhxChild(toEl)) {
              const prevSession = fromEl.getAttribute(PHX_SESSION);
              dom_default.mergeAttrs(fromEl, toEl, { exclude: [PHX_STATIC] });
              if (prevSession !== "") {
                fromEl.setAttribute(PHX_SESSION, prevSession);
              }
              fromEl.setAttribute(PHX_ROOT_ID, this.rootID);
              dom_default.applyStickyOperations(fromEl);
              return false;
            }
            if (this.undoRef && dom_default.private(toEl, PHX_REF_LOCK)) {
              dom_default.putPrivate(
                fromEl,
                PHX_REF_LOCK,
                dom_default.private(toEl, PHX_REF_LOCK)
              );
            }
            dom_default.copyPrivates(toEl, fromEl);
            if (dom_default.isPortalTemplate(toEl)) {
              portalCallbacks.push(() => this.teleport(toEl, morph));
              fromEl.innerHTML = toEl.innerHTML;
              return false;
            }
            if (isFocusedFormEl && fromEl.type !== "hidden" && !focusedSelectChanged) {
              this.trackBefore("updated", fromEl, toEl);
              dom_default.mergeFocusedInput(fromEl, toEl);
              dom_default.syncAttrsToProps(fromEl);
              updates.push(fromEl);
              dom_default.applyStickyOperations(fromEl);
              return false;
            } else {
              if (focusedSelectChanged) {
                fromEl.blur();
              }
              if (dom_default.isPhxUpdate(toEl, phxUpdate, ["append", "prepend"])) {
                appendPrependUpdates.push(
                  new DOMPostMorphRestorer(
                    fromEl,
                    toEl,
                    toEl.getAttribute(phxUpdate)
                  )
                );
              }
              dom_default.syncAttrsToProps(toEl);
              dom_default.applyStickyOperations(toEl);
              this.trackBefore("updated", fromEl, toEl);
              return fromEl;
            }
          }
        };
        morphdom_esm_default(targetContainer2, source, morphCallbacks);
      };
      this.trackBefore("added", container);
      this.trackBefore("updated", container, container);
      liveSocket2.time("morphdom", () => {
        this.streams.forEach(([ref, inserts, deleteIds, reset]) => {
          inserts.forEach(([key, streamAt, limit, updateOnly]) => {
            this.streamInserts[key] = { ref, streamAt, limit, reset, updateOnly };
          });
          if (reset !== void 0) {
            dom_default.all(document, `[${PHX_STREAM_REF}="${ref}"]`, (child) => {
              this.removeStreamChildElement(child);
            });
          }
          deleteIds.forEach((id) => {
            const child = document.getElementById(id);
            if (child) {
              this.removeStreamChildElement(child);
            }
          });
        });
        if (isJoinPatch) {
          dom_default.all(this.container, `[${phxUpdate}=${PHX_STREAM}]`).filter((el) => this.view.ownsElement(el)).forEach((el) => {
            Array.from(el.children).forEach((child) => {
              this.removeStreamChildElement(child, true);
            });
          });
        }
        morph(targetContainer, html);
        let teleportCount = 0;
        while (portalCallbacks.length > 0 && teleportCount < 5) {
          const copy = portalCallbacks.slice();
          portalCallbacks = [];
          copy.forEach((callback) => callback());
          teleportCount++;
        }
        this.view.portalElementIds.forEach((id) => {
          const el = document.getElementById(id);
          if (el) {
            const source = document.getElementById(
              el.getAttribute(PHX_TELEPORTED_SRC)
            );
            if (!source) {
              el.remove();
              this.onNodeDiscarded(el);
              this.view.dropPortalElementId(id);
            }
          }
        });
      });
      if (liveSocket2.isDebugEnabled()) {
        detectDuplicateIds();
        detectInvalidStreamInserts(this.streamInserts);
        Array.from(document.querySelectorAll("input[name=id]")).forEach(
          (node) => {
            if (node instanceof HTMLInputElement && node.form) {
              console.error(
                'Detected an input with name="id" inside a form! This will cause problems when patching the DOM.\n',
                node
              );
            }
          }
        );
      }
      if (appendPrependUpdates.length > 0) {
        liveSocket2.time("post-morph append/prepend restoration", () => {
          appendPrependUpdates.forEach((update) => update.perform());
        });
      }
      liveSocket2.silenceEvents(
        () => dom_default.restoreFocus(focused, selectionStart, selectionEnd)
      );
      dom_default.dispatchEvent(document, "phx:update");
      added.forEach((el) => this.trackAfter("added", el));
      updates.forEach((el) => this.trackAfter("updated", el));
      this.transitionPendingRemoves();
      if (externalFormTriggered) {
        liveSocket2.unload();
        const submitter = dom_default.private(externalFormTriggered, "submitter");
        if (submitter && submitter.name && targetContainer.contains(submitter)) {
          const input = document.createElement("input");
          input.type = "hidden";
          const formId = submitter.getAttribute("form");
          if (formId) {
            input.setAttribute("form", formId);
          }
          input.name = submitter.name;
          input.value = submitter.value;
          submitter.parentElement.insertBefore(input, submitter);
        }
        Object.getPrototypeOf(externalFormTriggered).submit.call(
          externalFormTriggered
        );
      }
      return true;
    }
    onNodeDiscarded(el) {
      if (dom_default.isPhxChild(el) || dom_default.isPhxSticky(el)) {
        this.liveSocket.destroyViewByEl(el);
      }
      this.trackAfter("discarded", el);
    }
    maybePendingRemove(node) {
      if (node.getAttribute && node.getAttribute(this.phxRemove) !== null) {
        this.pendingRemoves.push(node);
        return true;
      } else {
        return false;
      }
    }
    removeStreamChildElement(child, force = false) {
      if (!force && !this.view.ownsElement(child)) {
        return;
      }
      if (this.streamInserts[child.id]) {
        this.streamComponentRestore[child.id] = child;
        child.remove();
      } else {
        if (!this.maybePendingRemove(child)) {
          child.remove();
          this.onNodeDiscarded(child);
        }
      }
    }
    getStreamInsert(el) {
      const insert = el.id ? this.streamInserts[el.id] : {};
      return insert || {};
    }
    setStreamRef(el, ref) {
      dom_default.putSticky(
        el,
        PHX_STREAM_REF,
        (el2) => el2.setAttribute(PHX_STREAM_REF, ref)
      );
    }
    maybeReOrderStream(el, isNew) {
      const { ref, streamAt, reset } = this.getStreamInsert(el);
      if (streamAt === void 0) {
        return;
      }
      this.setStreamRef(el, ref);
      if (!reset && !isNew) {
        return;
      }
      if (!el.parentElement) {
        return;
      }
      if (streamAt === 0) {
        el.parentElement.insertBefore(el, el.parentElement.firstElementChild);
      } else if (streamAt > 0) {
        const children = Array.from(el.parentElement.children);
        const oldIndex = children.indexOf(el);
        if (streamAt >= children.length - 1) {
          el.parentElement.appendChild(el);
        } else {
          const sibling = children[streamAt];
          if (oldIndex > streamAt) {
            el.parentElement.insertBefore(el, sibling);
          } else {
            el.parentElement.insertBefore(el, sibling.nextElementSibling);
          }
        }
      }
      this.maybeLimitStream(el);
    }
    maybeLimitStream(el) {
      const { limit } = this.getStreamInsert(el);
      const children = limit !== null && Array.from(el.parentElement.children);
      if (limit && limit < 0 && children.length > limit * -1) {
        children.slice(0, children.length + limit).forEach((child) => this.removeStreamChildElement(child));
      } else if (limit && limit >= 0 && children.length > limit) {
        children.slice(limit).forEach((child) => this.removeStreamChildElement(child));
      }
    }
    transitionPendingRemoves() {
      const { pendingRemoves, liveSocket: liveSocket2 } = this;
      if (pendingRemoves.length > 0) {
        liveSocket2.transitionRemoves(pendingRemoves, () => {
          pendingRemoves.forEach((el) => {
            const child = dom_default.firstPhxChild(el);
            if (child) {
              liveSocket2.destroyViewByEl(child);
            }
            el.remove();
          });
          this.trackAfter("transitionsDiscarded", pendingRemoves);
        });
      }
    }
    isChangedSelect(fromEl, toEl) {
      if (!(fromEl instanceof HTMLSelectElement) || fromEl.multiple) {
        return false;
      }
      if (fromEl.options.length !== toEl.options.length) {
        return true;
      }
      toEl.value = fromEl.value;
      return !fromEl.isEqualNode(toEl);
    }
    isCIDPatch() {
      return this.cidPatch;
    }
    skipCIDSibling(el) {
      return el.nodeType === Node.ELEMENT_NODE && el.hasAttribute(PHX_SKIP);
    }
    targetCIDContainer(html) {
      if (!this.isCIDPatch()) {
        return;
      }
      const [first, ...rest] = dom_default.findComponentNodeList(
        this.view.id,
        this.targetCID
      );
      if (rest.length === 0 && dom_default.childNodeLength(html) === 1) {
        return first;
      } else {
        return first && first.parentNode;
      }
    }
    indexOf(parent, child) {
      return Array.from(parent.children).indexOf(child);
    }
    teleport(el, morph) {
      const targetSelector = el.getAttribute(PHX_PORTAL);
      const portalContainer = document.querySelector(targetSelector);
      if (!portalContainer) {
        throw new Error(
          "portal target with selector " + targetSelector + " not found"
        );
      }
      const toTeleport = el.content.firstElementChild;
      if (this.skipCIDSibling(toTeleport)) {
        return;
      }
      if (!toTeleport?.id) {
        throw new Error(
          "phx-portal template must have a single root element with ID!"
        );
      }
      const existing = document.getElementById(toTeleport.id);
      let portalTarget;
      if (existing) {
        if (!portalContainer.contains(existing)) {
          portalContainer.appendChild(existing);
        }
        portalTarget = existing;
      } else {
        portalTarget = document.createElement(toTeleport.tagName);
        portalContainer.appendChild(portalTarget);
      }
      toTeleport.setAttribute(PHX_TELEPORTED_REF, this.view.id);
      toTeleport.setAttribute(PHX_TELEPORTED_SRC, el.id);
      morph(portalTarget, toTeleport, true);
      toTeleport.removeAttribute(PHX_TELEPORTED_REF);
      toTeleport.removeAttribute(PHX_TELEPORTED_SRC);
      this.view.pushPortalElementId(toTeleport.id);
    }
    handleRuntimeHook(el, source) {
      const name = el.getAttribute(PHX_RUNTIME_HOOK);
      let nonce = el.hasAttribute("nonce") ? el.getAttribute("nonce") : null;
      if (el.hasAttribute("nonce")) {
        const template = document.createElement("template");
        template.innerHTML = source;
        nonce = template.content.querySelector(`script[${PHX_RUNTIME_HOOK}="${CSS.escape(name)}"]`).getAttribute("nonce");
      }
      const script = document.createElement("script");
      script.textContent = el.textContent;
      dom_default.mergeAttrs(script, el, { isIgnored: false });
      if (nonce) {
        script.nonce = nonce;
      }
      el.replaceWith(script);
      el = script;
    }
  };
  var VOID_TAGS = /* @__PURE__ */ new Set([
    "area",
    "base",
    "br",
    "col",
    "command",
    "embed",
    "hr",
    "img",
    "input",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr"
  ]);
  var quoteChars = /* @__PURE__ */ new Set(["'", '"']);
  var modifyRoot = (html, attrs, clearInnerHTML) => {
    let i7 = 0;
    let insideComment = false;
    let beforeTag, afterTag, tag, tagNameEndsAt, id, newHTML;
    const lookahead = html.match(/^(\s*(?:<!--.*?-->\s*)*)<([^\s\/>]+)/);
    if (lookahead === null) {
      throw new Error(`malformed html ${html}`);
    }
    i7 = lookahead[0].length;
    beforeTag = lookahead[1];
    tag = lookahead[2];
    tagNameEndsAt = i7;
    for (i7; i7 < html.length; i7++) {
      if (html.charAt(i7) === ">") {
        break;
      }
      if (html.charAt(i7) === "=") {
        const isId = html.slice(i7 - 3, i7) === " id";
        i7++;
        const char = html.charAt(i7);
        if (quoteChars.has(char)) {
          const attrStartsAt = i7;
          i7++;
          for (i7; i7 < html.length; i7++) {
            if (html.charAt(i7) === char) {
              break;
            }
          }
          if (isId) {
            id = html.slice(attrStartsAt + 1, i7);
            break;
          }
        }
      }
    }
    let closeAt = html.length - 1;
    insideComment = false;
    while (closeAt >= beforeTag.length + tag.length) {
      const char = html.charAt(closeAt);
      if (insideComment) {
        if (char === "-" && html.slice(closeAt - 3, closeAt) === "<!-") {
          insideComment = false;
          closeAt -= 4;
        } else {
          closeAt -= 1;
        }
      } else if (char === ">" && html.slice(closeAt - 2, closeAt) === "--") {
        insideComment = true;
        closeAt -= 3;
      } else if (char === ">") {
        break;
      } else {
        closeAt -= 1;
      }
    }
    afterTag = html.slice(closeAt + 1, html.length);
    const attrsStr = Object.keys(attrs).map((attr) => attrs[attr] === true ? attr : `${attr}="${attrs[attr]}"`).join(" ");
    if (clearInnerHTML) {
      const idAttrStr = id ? ` id="${id}"` : "";
      if (VOID_TAGS.has(tag)) {
        newHTML = `<${tag}${idAttrStr}${attrsStr === "" ? "" : " "}${attrsStr}/>`;
      } else {
        newHTML = `<${tag}${idAttrStr}${attrsStr === "" ? "" : " "}${attrsStr}></${tag}>`;
      }
    } else {
      const rest = html.slice(tagNameEndsAt, closeAt + 1);
      newHTML = `<${tag}${attrsStr === "" ? "" : " "}${attrsStr}${rest}`;
    }
    return [newHTML, beforeTag, afterTag];
  };
  var Rendered = class {
    static extract(diff) {
      const { [REPLY]: reply, [EVENTS]: events, [TITLE]: title } = diff;
      delete diff[REPLY];
      delete diff[EVENTS];
      delete diff[TITLE];
      return { diff, title, reply: reply || null, events: events || [] };
    }
    constructor(viewId, rendered) {
      this.viewId = viewId;
      this.rendered = {};
      this.magicId = 0;
      this.mergeDiff(rendered);
    }
    parentViewId() {
      return this.viewId;
    }
    toString(onlyCids) {
      const { buffer: str, streams } = this.recursiveToString(
        this.rendered,
        this.rendered[COMPONENTS],
        onlyCids,
        true,
        {}
      );
      return { buffer: str, streams };
    }
    recursiveToString(rendered, components = rendered[COMPONENTS], onlyCids, changeTracking, rootAttrs) {
      onlyCids = onlyCids ? new Set(onlyCids) : null;
      const output = {
        buffer: "",
        components,
        onlyCids,
        streams: /* @__PURE__ */ new Set()
      };
      this.toOutputBuffer(rendered, null, output, changeTracking, rootAttrs);
      return { buffer: output.buffer, streams: output.streams };
    }
    componentCIDs(diff) {
      return Object.keys(diff[COMPONENTS] || {}).map((i7) => parseInt(i7));
    }
    isComponentOnlyDiff(diff) {
      if (!diff[COMPONENTS]) {
        return false;
      }
      return Object.keys(diff).length === 1;
    }
    getComponent(diff, cid) {
      return diff[COMPONENTS][cid];
    }
    resetRender(cid) {
      if (this.rendered[COMPONENTS][cid]) {
        this.rendered[COMPONENTS][cid].reset = true;
      }
    }
    mergeDiff(diff) {
      const newc = diff[COMPONENTS];
      const cache = {};
      delete diff[COMPONENTS];
      this.rendered = this.mutableMerge(this.rendered, diff);
      this.rendered[COMPONENTS] = this.rendered[COMPONENTS] || {};
      if (newc) {
        const oldc = this.rendered[COMPONENTS];
        for (const cid in newc) {
          newc[cid] = this.cachedFindComponent(cid, newc[cid], oldc, newc, cache);
        }
        for (const cid in newc) {
          oldc[cid] = newc[cid];
        }
        diff[COMPONENTS] = newc;
      }
    }
    cachedFindComponent(cid, cdiff, oldc, newc, cache) {
      if (cache[cid]) {
        return cache[cid];
      } else {
        let ndiff, stat, scid = cdiff[STATIC];
        if (isCid(scid)) {
          let tdiff;
          if (scid > 0) {
            tdiff = this.cachedFindComponent(scid, newc[scid], oldc, newc, cache);
          } else {
            tdiff = oldc[-scid];
          }
          stat = tdiff[STATIC];
          ndiff = this.cloneMerge(tdiff, cdiff, true);
          ndiff[STATIC] = stat;
        } else {
          ndiff = cdiff[STATIC] !== void 0 || oldc[cid] === void 0 ? cdiff : this.cloneMerge(oldc[cid], cdiff, false);
        }
        cache[cid] = ndiff;
        return ndiff;
      }
    }
    mutableMerge(target, source) {
      if (source[STATIC] !== void 0) {
        return source;
      } else {
        this.doMutableMerge(target, source);
        return target;
      }
    }
    doMutableMerge(target, source) {
      if (source[KEYED]) {
        this.mergeKeyed(target, source);
      } else {
        for (const key in source) {
          const val = source[key];
          const targetVal = target[key];
          const isObjVal = isObject(val);
          if (isObjVal && val[STATIC] === void 0 && isObject(targetVal)) {
            this.doMutableMerge(targetVal, val);
          } else {
            target[key] = val;
          }
        }
      }
      if (target[ROOT]) {
        target.newRender = true;
      }
    }
    clone(diff) {
      if ("structuredClone" in window) {
        return structuredClone(diff);
      } else {
        return JSON.parse(JSON.stringify(diff));
      }
    }
    // keyed comprehensions
    mergeKeyed(target, source) {
      const clonedTarget = this.clone(target);
      Object.entries(source[KEYED]).forEach(([i7, entry]) => {
        if (i7 === KEYED_COUNT) {
          return;
        }
        if (Array.isArray(entry)) {
          const [old_idx, diff] = entry;
          target[KEYED][i7] = clonedTarget[KEYED][old_idx];
          this.doMutableMerge(target[KEYED][i7], diff);
        } else if (typeof entry === "number") {
          const old_idx = entry;
          target[KEYED][i7] = clonedTarget[KEYED][old_idx];
        } else if (typeof entry === "object") {
          if (!target[KEYED][i7]) {
            target[KEYED][i7] = {};
          }
          this.doMutableMerge(target[KEYED][i7], entry);
        }
      });
      if (source[KEYED][KEYED_COUNT] < target[KEYED][KEYED_COUNT]) {
        for (let i7 = source[KEYED][KEYED_COUNT]; i7 < target[KEYED][KEYED_COUNT]; i7++) {
          delete target[KEYED][i7];
        }
      }
      target[KEYED][KEYED_COUNT] = source[KEYED][KEYED_COUNT];
      if (source[STREAM]) {
        target[STREAM] = source[STREAM];
      }
      if (source[TEMPLATES]) {
        target[TEMPLATES] = source[TEMPLATES];
      }
    }
    // Merges cid trees together, copying statics from source tree.
    //
    // The `pruneMagicId` is passed to control pruning the magicId of the
    // target. We must always prune the magicId when we are sharing statics
    // from another component. If not pruning, we replicate the logic from
    // mutableMerge, where we set newRender to true if there is a root
    // (effectively forcing the new version to be rendered instead of skipped)
    //
    cloneMerge(target, source, pruneMagicId) {
      let merged;
      if (source[KEYED]) {
        merged = this.clone(target);
        this.mergeKeyed(merged, source);
      } else {
        merged = { ...target, ...source };
        for (const key in merged) {
          const val = source[key];
          const targetVal = target[key];
          if (isObject(val) && val[STATIC] === void 0 && isObject(targetVal)) {
            merged[key] = this.cloneMerge(targetVal, val, pruneMagicId);
          } else if (val === void 0 && isObject(targetVal)) {
            merged[key] = this.cloneMerge(targetVal, {}, pruneMagicId);
          }
        }
      }
      if (pruneMagicId) {
        delete merged.magicId;
        delete merged.newRender;
      } else if (target[ROOT]) {
        merged.newRender = true;
      }
      return merged;
    }
    componentToString(cid) {
      const { buffer: str, streams } = this.recursiveCIDToString(
        this.rendered[COMPONENTS],
        cid,
        null
      );
      const [strippedHTML, _before, _after] = modifyRoot(str, {});
      return { buffer: strippedHTML, streams };
    }
    pruneCIDs(cids) {
      cids.forEach((cid) => delete this.rendered[COMPONENTS][cid]);
    }
    // private
    get() {
      return this.rendered;
    }
    isNewFingerprint(diff = {}) {
      return !!diff[STATIC];
    }
    templateStatic(part, templates) {
      if (typeof part === "number") {
        return templates[part];
      } else {
        return part;
      }
    }
    nextMagicID() {
      this.magicId++;
      return `m${this.magicId}-${this.parentViewId()}`;
    }
    // Converts rendered tree to output buffer.
    //
    // changeTracking controls if we can apply the PHX_SKIP optimization.
    toOutputBuffer(rendered, templates, output, changeTracking, rootAttrs = {}) {
      if (rendered[KEYED]) {
        return this.comprehensionToBuffer(
          rendered,
          templates,
          output,
          changeTracking
        );
      }
      if (rendered[TEMPLATES]) {
        templates = rendered[TEMPLATES];
        delete rendered[TEMPLATES];
      }
      let { [STATIC]: statics } = rendered;
      statics = this.templateStatic(statics, templates);
      rendered[STATIC] = statics;
      const isRoot = rendered[ROOT];
      const prevBuffer = output.buffer;
      if (isRoot) {
        output.buffer = "";
      }
      if (changeTracking && isRoot && !rendered.magicId) {
        rendered.newRender = true;
        rendered.magicId = this.nextMagicID();
      }
      output.buffer += statics[0];
      for (let i7 = 1; i7 < statics.length; i7++) {
        this.dynamicToBuffer(rendered[i7 - 1], templates, output, changeTracking);
        output.buffer += statics[i7];
      }
      if (isRoot) {
        let skip = false;
        let attrs;
        if (changeTracking || rendered.magicId) {
          skip = changeTracking && !rendered.newRender;
          attrs = { [PHX_MAGIC_ID]: rendered.magicId, ...rootAttrs };
        } else {
          attrs = rootAttrs;
        }
        if (skip) {
          attrs[PHX_SKIP] = true;
        }
        const [newRoot, commentBefore, commentAfter] = modifyRoot(
          output.buffer,
          attrs,
          skip
        );
        rendered.newRender = false;
        output.buffer = prevBuffer + commentBefore + newRoot + commentAfter;
      }
    }
    comprehensionToBuffer(rendered, templates, output, changeTracking) {
      const keyedTemplates = templates || rendered[TEMPLATES];
      const statics = this.templateStatic(rendered[STATIC], templates);
      rendered[STATIC] = statics;
      delete rendered[TEMPLATES];
      for (let i7 = 0; i7 < rendered[KEYED][KEYED_COUNT]; i7++) {
        output.buffer += statics[0];
        for (let j2 = 1; j2 < statics.length; j2++) {
          this.dynamicToBuffer(
            rendered[KEYED][i7][j2 - 1],
            keyedTemplates,
            output,
            changeTracking
          );
          output.buffer += statics[j2];
        }
      }
      if (rendered[STREAM]) {
        const stream = rendered[STREAM];
        const [_ref2, _inserts, deleteIds, reset] = stream || [null, {}, [], null];
        if (stream !== void 0 && (rendered[KEYED][KEYED_COUNT] > 0 || deleteIds.length > 0 || reset)) {
          delete rendered[STREAM];
          rendered[KEYED] = {
            [KEYED_COUNT]: 0
          };
          output.streams.add(stream);
        }
      }
    }
    dynamicToBuffer(rendered, templates, output, changeTracking) {
      if (typeof rendered === "number") {
        const { buffer: str, streams } = this.recursiveCIDToString(
          output.components,
          rendered,
          output.onlyCids
        );
        output.buffer += str;
        output.streams = /* @__PURE__ */ new Set([...output.streams, ...streams]);
      } else if (isObject(rendered)) {
        this.toOutputBuffer(rendered, templates, output, changeTracking, {});
      } else {
        output.buffer += rendered;
      }
    }
    recursiveCIDToString(components, cid, onlyCids) {
      const component = components[cid] || logError(`no component for CID ${cid}`, components);
      const attrs = { [PHX_COMPONENT]: cid, [PHX_VIEW_REF]: this.viewId };
      const skip = onlyCids && !onlyCids.has(cid);
      component.newRender = !skip;
      component.magicId = `c${cid}-${this.parentViewId()}`;
      const changeTracking = !component.reset;
      const { buffer: html, streams } = this.recursiveToString(
        component,
        components,
        onlyCids,
        changeTracking,
        attrs
      );
      delete component.reset;
      return { buffer: html, streams };
    }
  };
  var focusStack = [];
  var default_transition_time = 200;
  var JS = {
    // private
    exec(e7, eventType, phxEvent, view, sourceEl, defaults) {
      const [defaultKind, defaultArgs] = defaults || [
        null,
        { callback: defaults && defaults.callback }
      ];
      const commands = phxEvent.charAt(0) === "[" ? JSON.parse(phxEvent) : [[defaultKind, defaultArgs]];
      commands.forEach(([kind, args]) => {
        if (kind === defaultKind) {
          args = { ...defaultArgs, ...args };
          args.callback = args.callback || defaultArgs.callback;
        }
        this.filterToEls(view.liveSocket, sourceEl, args).forEach((el) => {
          this[`exec_${kind}`](e7, eventType, phxEvent, view, sourceEl, el, args);
        });
      });
    },
    isVisible(el) {
      return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length > 0);
    },
    // returns true if any part of the element is inside the viewport
    isInViewport(el) {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      const windowWidth = window.innerWidth || document.documentElement.clientWidth;
      return rect.right > 0 && rect.bottom > 0 && rect.left < windowWidth && rect.top < windowHeight;
    },
    // private
    // commands
    exec_exec(e7, eventType, phxEvent, view, sourceEl, el, { attr, to }) {
      const encodedJS = el.getAttribute(attr);
      if (!encodedJS) {
        throw new Error(`expected ${attr} to contain JS command on "${to}"`);
      }
      view.liveSocket.execJS(el, encodedJS, eventType);
    },
    exec_dispatch(e7, eventType, phxEvent, view, sourceEl, el, { event, detail, bubbles, blocking }) {
      detail = detail || {};
      detail.dispatcher = sourceEl;
      if (blocking) {
        const promise = new Promise((resolve, _reject) => {
          detail.done = resolve;
        });
        view.liveSocket.asyncTransition(promise);
      }
      dom_default.dispatchEvent(el, event, { detail, bubbles });
    },
    exec_push(e7, eventType, phxEvent, view, sourceEl, el, args) {
      const {
        event,
        data,
        target,
        page_loading,
        loading,
        value,
        dispatcher,
        callback
      } = args;
      const pushOpts = {
        loading,
        value,
        target,
        page_loading: !!page_loading,
        originalEvent: e7
      };
      const targetSrc = eventType === "change" && dispatcher ? dispatcher : sourceEl;
      const phxTarget = target || targetSrc.getAttribute(view.binding("target")) || targetSrc;
      const handler = (targetView, targetCtx) => {
        if (!targetView.isConnected()) {
          return;
        }
        if (eventType === "change") {
          let { newCid, _target } = args;
          _target = _target || (dom_default.isFormInput(sourceEl) ? sourceEl.name : void 0);
          if (_target) {
            pushOpts._target = _target;
          }
          targetView.pushInput(
            sourceEl,
            targetCtx,
            newCid,
            event || phxEvent,
            pushOpts,
            callback
          );
        } else if (eventType === "submit") {
          const { submitter } = args;
          targetView.submitForm(
            sourceEl,
            targetCtx,
            event || phxEvent,
            submitter,
            pushOpts,
            callback
          );
        } else {
          targetView.pushEvent(
            eventType,
            sourceEl,
            targetCtx,
            event || phxEvent,
            data,
            pushOpts,
            callback
          );
        }
      };
      if (args.targetView && args.targetCtx) {
        handler(args.targetView, args.targetCtx);
      } else {
        view.withinTargets(phxTarget, handler);
      }
    },
    exec_navigate(e7, eventType, phxEvent, view, sourceEl, el, { href, replace }) {
      view.liveSocket.historyRedirect(
        e7,
        href,
        replace ? "replace" : "push",
        null,
        sourceEl
      );
    },
    exec_patch(e7, eventType, phxEvent, view, sourceEl, el, { href, replace }) {
      view.liveSocket.pushHistoryPatch(
        e7,
        href,
        replace ? "replace" : "push",
        sourceEl
      );
    },
    exec_focus(e7, eventType, phxEvent, view, sourceEl, el) {
      aria_default.attemptFocus(el);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => aria_default.attemptFocus(el));
      });
    },
    exec_focus_first(e7, eventType, phxEvent, view, sourceEl, el) {
      aria_default.focusFirstInteractive(el) || aria_default.focusFirst(el);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(
          () => aria_default.focusFirstInteractive(el) || aria_default.focusFirst(el)
        );
      });
    },
    exec_push_focus(e7, eventType, phxEvent, view, sourceEl, el) {
      focusStack.push(el || sourceEl);
    },
    exec_pop_focus(_e, _eventType, _phxEvent, _view, _sourceEl, _el) {
      const el = focusStack.pop();
      if (el) {
        el.focus();
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => el.focus());
        });
      }
    },
    exec_add_class(e7, eventType, phxEvent, view, sourceEl, el, { names, transition, time, blocking }) {
      this.addOrRemoveClasses(el, names, [], transition, time, view, blocking);
    },
    exec_remove_class(e7, eventType, phxEvent, view, sourceEl, el, { names, transition, time, blocking }) {
      this.addOrRemoveClasses(el, [], names, transition, time, view, blocking);
    },
    exec_toggle_class(e7, eventType, phxEvent, view, sourceEl, el, { names, transition, time, blocking }) {
      this.toggleClasses(el, names, transition, time, view, blocking);
    },
    exec_toggle_attr(e7, eventType, phxEvent, view, sourceEl, el, { attr: [attr, val1, val2] }) {
      this.toggleAttr(el, attr, val1, val2);
    },
    exec_ignore_attrs(e7, eventType, phxEvent, view, sourceEl, el, { attrs }) {
      this.ignoreAttrs(el, attrs);
    },
    exec_transition(e7, eventType, phxEvent, view, sourceEl, el, { time, transition, blocking }) {
      this.addOrRemoveClasses(el, [], [], transition, time, view, blocking);
    },
    exec_toggle(e7, eventType, phxEvent, view, sourceEl, el, { display, ins, outs, time, blocking }) {
      this.toggle(eventType, view, el, display, ins, outs, time, blocking);
    },
    exec_show(e7, eventType, phxEvent, view, sourceEl, el, { display, transition, time, blocking }) {
      this.show(eventType, view, el, display, transition, time, blocking);
    },
    exec_hide(e7, eventType, phxEvent, view, sourceEl, el, { display, transition, time, blocking }) {
      this.hide(eventType, view, el, display, transition, time, blocking);
    },
    exec_set_attr(e7, eventType, phxEvent, view, sourceEl, el, { attr: [attr, val] }) {
      this.setOrRemoveAttrs(el, [[attr, val]], []);
    },
    exec_remove_attr(e7, eventType, phxEvent, view, sourceEl, el, { attr }) {
      this.setOrRemoveAttrs(el, [], [attr]);
    },
    ignoreAttrs(el, attrs) {
      dom_default.putPrivate(el, "JS:ignore_attrs", {
        apply: (fromEl, toEl) => {
          let fromAttributes = Array.from(fromEl.attributes);
          let fromAttributeNames = fromAttributes.map((attr) => attr.name);
          Array.from(toEl.attributes).filter((attr) => {
            return !fromAttributeNames.includes(attr.name);
          }).forEach((attr) => {
            if (dom_default.attributeIgnored(attr, attrs)) {
              toEl.removeAttribute(attr.name);
            }
          });
          fromAttributes.forEach((attr) => {
            if (dom_default.attributeIgnored(attr, attrs)) {
              toEl.setAttribute(attr.name, attr.value);
            }
          });
        }
      });
    },
    onBeforeElUpdated(fromEl, toEl) {
      const ignoreAttrs = dom_default.private(fromEl, "JS:ignore_attrs");
      if (ignoreAttrs) {
        ignoreAttrs.apply(fromEl, toEl);
      }
    },
    // utils for commands
    show(eventType, view, el, display, transition, time, blocking) {
      if (!this.isVisible(el)) {
        this.toggle(
          eventType,
          view,
          el,
          display,
          transition,
          null,
          time,
          blocking
        );
      }
    },
    hide(eventType, view, el, display, transition, time, blocking) {
      if (this.isVisible(el)) {
        this.toggle(
          eventType,
          view,
          el,
          display,
          null,
          transition,
          time,
          blocking
        );
      }
    },
    toggle(eventType, view, el, display, ins, outs, time, blocking) {
      time = time || default_transition_time;
      const [inClasses, inStartClasses, inEndClasses] = ins || [[], [], []];
      const [outClasses, outStartClasses, outEndClasses] = outs || [[], [], []];
      if (inClasses.length > 0 || outClasses.length > 0) {
        if (this.isVisible(el)) {
          const onStart = () => {
            this.addOrRemoveClasses(
              el,
              outStartClasses,
              inClasses.concat(inStartClasses).concat(inEndClasses)
            );
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, outClasses, []);
              window.requestAnimationFrame(
                () => this.addOrRemoveClasses(el, outEndClasses, outStartClasses)
              );
            });
          };
          const onEnd = () => {
            this.addOrRemoveClasses(el, [], outClasses.concat(outEndClasses));
            dom_default.putSticky(
              el,
              "toggle",
              (currentEl) => currentEl.style.display = "none"
            );
            el.dispatchEvent(new Event("phx:hide-end"));
          };
          el.dispatchEvent(new Event("phx:hide-start"));
          if (blocking === false) {
            onStart();
            setTimeout(onEnd, time);
          } else {
            view.transition(time, onStart, onEnd);
          }
        } else {
          if (eventType === "remove") {
            return;
          }
          const onStart = () => {
            this.addOrRemoveClasses(
              el,
              inStartClasses,
              outClasses.concat(outStartClasses).concat(outEndClasses)
            );
            const stickyDisplay = display || this.defaultDisplay(el);
            window.requestAnimationFrame(() => {
              this.addOrRemoveClasses(el, inClasses, []);
              window.requestAnimationFrame(() => {
                dom_default.putSticky(
                  el,
                  "toggle",
                  (currentEl) => currentEl.style.display = stickyDisplay
                );
                this.addOrRemoveClasses(el, inEndClasses, inStartClasses);
              });
            });
          };
          const onEnd = () => {
            this.addOrRemoveClasses(el, [], inClasses.concat(inEndClasses));
            el.dispatchEvent(new Event("phx:show-end"));
          };
          el.dispatchEvent(new Event("phx:show-start"));
          if (blocking === false) {
            onStart();
            setTimeout(onEnd, time);
          } else {
            view.transition(time, onStart, onEnd);
          }
        }
      } else {
        if (this.isVisible(el)) {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:hide-start"));
            dom_default.putSticky(
              el,
              "toggle",
              (currentEl) => currentEl.style.display = "none"
            );
            el.dispatchEvent(new Event("phx:hide-end"));
          });
        } else {
          window.requestAnimationFrame(() => {
            el.dispatchEvent(new Event("phx:show-start"));
            const stickyDisplay = display || this.defaultDisplay(el);
            dom_default.putSticky(
              el,
              "toggle",
              (currentEl) => currentEl.style.display = stickyDisplay
            );
            el.dispatchEvent(new Event("phx:show-end"));
          });
        }
      }
    },
    toggleClasses(el, classes, transition, time, view, blocking) {
      window.requestAnimationFrame(() => {
        const [prevAdds, prevRemoves] = dom_default.getSticky(el, "classes", [[], []]);
        const newAdds = classes.filter(
          (name) => prevAdds.indexOf(name) < 0 && !el.classList.contains(name)
        );
        const newRemoves = classes.filter(
          (name) => prevRemoves.indexOf(name) < 0 && el.classList.contains(name)
        );
        this.addOrRemoveClasses(
          el,
          newAdds,
          newRemoves,
          transition,
          time,
          view,
          blocking
        );
      });
    },
    toggleAttr(el, attr, val1, val2) {
      if (el.hasAttribute(attr)) {
        if (val2 !== void 0) {
          if (el.getAttribute(attr) === val1) {
            this.setOrRemoveAttrs(el, [[attr, val2]], []);
          } else {
            this.setOrRemoveAttrs(el, [[attr, val1]], []);
          }
        } else {
          this.setOrRemoveAttrs(el, [], [attr]);
        }
      } else {
        this.setOrRemoveAttrs(el, [[attr, val1]], []);
      }
    },
    addOrRemoveClasses(el, adds, removes, transition, time, view, blocking) {
      time = time || default_transition_time;
      const [transitionRun, transitionStart, transitionEnd] = transition || [
        [],
        [],
        []
      ];
      if (transitionRun.length > 0) {
        const onStart = () => {
          this.addOrRemoveClasses(
            el,
            transitionStart,
            [].concat(transitionRun).concat(transitionEnd)
          );
          window.requestAnimationFrame(() => {
            this.addOrRemoveClasses(el, transitionRun, []);
            window.requestAnimationFrame(
              () => this.addOrRemoveClasses(el, transitionEnd, transitionStart)
            );
          });
        };
        const onDone = () => this.addOrRemoveClasses(
          el,
          adds.concat(transitionEnd),
          removes.concat(transitionRun).concat(transitionStart)
        );
        if (blocking === false) {
          onStart();
          setTimeout(onDone, time);
        } else {
          view.transition(time, onStart, onDone);
        }
        return;
      }
      window.requestAnimationFrame(() => {
        const [prevAdds, prevRemoves] = dom_default.getSticky(el, "classes", [[], []]);
        const keepAdds = adds.filter(
          (name) => prevAdds.indexOf(name) < 0 && !el.classList.contains(name)
        );
        const keepRemoves = removes.filter(
          (name) => prevRemoves.indexOf(name) < 0 && el.classList.contains(name)
        );
        const newAdds = prevAdds.filter((name) => removes.indexOf(name) < 0).concat(keepAdds);
        const newRemoves = prevRemoves.filter((name) => adds.indexOf(name) < 0).concat(keepRemoves);
        dom_default.putSticky(el, "classes", (currentEl) => {
          currentEl.classList.remove(...newRemoves);
          currentEl.classList.add(...newAdds);
          return [newAdds, newRemoves];
        });
      });
    },
    setOrRemoveAttrs(el, sets, removes) {
      const [prevSets, prevRemoves] = dom_default.getSticky(el, "attrs", [[], []]);
      const alteredAttrs = sets.map(([attr, _val]) => attr).concat(removes);
      const newSets = prevSets.filter(([attr, _val]) => !alteredAttrs.includes(attr)).concat(sets);
      const newRemoves = prevRemoves.filter((attr) => !alteredAttrs.includes(attr)).concat(removes);
      dom_default.putSticky(el, "attrs", (currentEl) => {
        newRemoves.forEach((attr) => currentEl.removeAttribute(attr));
        newSets.forEach(([attr, val]) => currentEl.setAttribute(attr, val));
        return [newSets, newRemoves];
      });
    },
    hasAllClasses(el, classes) {
      return classes.every((name) => el.classList.contains(name));
    },
    isToggledOut(el, outClasses) {
      return !this.isVisible(el) || this.hasAllClasses(el, outClasses);
    },
    filterToEls(liveSocket2, sourceEl, { to }) {
      const defaultQuery = () => {
        if (typeof to === "string") {
          return document.querySelectorAll(to);
        } else if (to.closest) {
          const toEl = sourceEl.closest(to.closest);
          return toEl ? [toEl] : [];
        } else if (to.inner) {
          return sourceEl.querySelectorAll(to.inner);
        }
      };
      return to ? liveSocket2.jsQuerySelectorAll(sourceEl, to, defaultQuery) : [sourceEl];
    },
    defaultDisplay(el) {
      return { tr: "table-row", td: "table-cell" }[el.tagName.toLowerCase()] || "block";
    },
    transitionClasses(val) {
      if (!val) {
        return null;
      }
      let [trans, tStart, tEnd] = Array.isArray(val) ? val : [val.split(" "), [], []];
      trans = Array.isArray(trans) ? trans : trans.split(" ");
      tStart = Array.isArray(tStart) ? tStart : tStart.split(" ");
      tEnd = Array.isArray(tEnd) ? tEnd : tEnd.split(" ");
      return [trans, tStart, tEnd];
    }
  };
  var js_default = JS;
  var js_commands_default = (liveSocket2, eventType) => {
    return {
      exec(el, encodedJS) {
        liveSocket2.execJS(el, encodedJS, eventType);
      },
      show(el, opts = {}) {
        const owner = liveSocket2.owner(el);
        js_default.show(
          eventType,
          owner,
          el,
          opts.display,
          js_default.transitionClasses(opts.transition),
          opts.time,
          opts.blocking
        );
      },
      hide(el, opts = {}) {
        const owner = liveSocket2.owner(el);
        js_default.hide(
          eventType,
          owner,
          el,
          null,
          js_default.transitionClasses(opts.transition),
          opts.time,
          opts.blocking
        );
      },
      toggle(el, opts = {}) {
        const owner = liveSocket2.owner(el);
        const inTransition = js_default.transitionClasses(opts.in);
        const outTransition = js_default.transitionClasses(opts.out);
        js_default.toggle(
          eventType,
          owner,
          el,
          opts.display,
          inTransition,
          outTransition,
          opts.time,
          opts.blocking
        );
      },
      addClass(el, names, opts = {}) {
        const classNames = Array.isArray(names) ? names : names.split(" ");
        const owner = liveSocket2.owner(el);
        js_default.addOrRemoveClasses(
          el,
          classNames,
          [],
          js_default.transitionClasses(opts.transition),
          opts.time,
          owner,
          opts.blocking
        );
      },
      removeClass(el, names, opts = {}) {
        const classNames = Array.isArray(names) ? names : names.split(" ");
        const owner = liveSocket2.owner(el);
        js_default.addOrRemoveClasses(
          el,
          [],
          classNames,
          js_default.transitionClasses(opts.transition),
          opts.time,
          owner,
          opts.blocking
        );
      },
      toggleClass(el, names, opts = {}) {
        const classNames = Array.isArray(names) ? names : names.split(" ");
        const owner = liveSocket2.owner(el);
        js_default.toggleClasses(
          el,
          classNames,
          js_default.transitionClasses(opts.transition),
          opts.time,
          owner,
          opts.blocking
        );
      },
      transition(el, transition, opts = {}) {
        const owner = liveSocket2.owner(el);
        js_default.addOrRemoveClasses(
          el,
          [],
          [],
          js_default.transitionClasses(transition),
          opts.time,
          owner,
          opts.blocking
        );
      },
      setAttribute(el, attr, val) {
        js_default.setOrRemoveAttrs(el, [[attr, val]], []);
      },
      removeAttribute(el, attr) {
        js_default.setOrRemoveAttrs(el, [], [attr]);
      },
      toggleAttribute(el, attr, val1, val2) {
        js_default.toggleAttr(el, attr, val1, val2);
      },
      push(el, type, opts = {}) {
        liveSocket2.withinOwners(el, (view) => {
          const data = opts.value || {};
          delete opts.value;
          let e7 = new CustomEvent("phx:exec", { detail: { sourceElement: el } });
          js_default.exec(e7, eventType, type, view, el, ["push", { data, ...opts }]);
        });
      },
      navigate(href, opts = {}) {
        const customEvent = new CustomEvent("phx:exec");
        liveSocket2.historyRedirect(
          customEvent,
          href,
          opts.replace ? "replace" : "push",
          null,
          null
        );
      },
      patch(href, opts = {}) {
        const customEvent = new CustomEvent("phx:exec");
        liveSocket2.pushHistoryPatch(
          customEvent,
          href,
          opts.replace ? "replace" : "push",
          null
        );
      },
      ignoreAttributes(el, attrs) {
        js_default.ignoreAttrs(el, Array.isArray(attrs) ? attrs : [attrs]);
      }
    };
  };
  var HOOK_ID = "hookId";
  var viewHookID = 1;
  var ViewHook = class _ViewHook {
    get liveSocket() {
      return this.__liveSocket();
    }
    static makeID() {
      return viewHookID++;
    }
    static elementID(el) {
      return dom_default.private(el, HOOK_ID);
    }
    constructor(view, el, callbacks) {
      this.el = el;
      this.__attachView(view);
      this.__listeners = /* @__PURE__ */ new Set();
      this.__isDisconnected = false;
      dom_default.putPrivate(this.el, HOOK_ID, _ViewHook.makeID());
      if (callbacks) {
        const protectedProps = /* @__PURE__ */ new Set([
          "el",
          "liveSocket",
          "__view",
          "__listeners",
          "__isDisconnected",
          "constructor",
          // Standard object properties
          // Core ViewHook API methods
          "js",
          "pushEvent",
          "pushEventTo",
          "handleEvent",
          "removeHandleEvent",
          "upload",
          "uploadTo",
          // Internal lifecycle callers
          "__mounted",
          "__updated",
          "__beforeUpdate",
          "__destroyed",
          "__reconnected",
          "__disconnected",
          "__cleanup__"
        ]);
        for (const key in callbacks) {
          if (Object.prototype.hasOwnProperty.call(callbacks, key)) {
            this[key] = callbacks[key];
            if (protectedProps.has(key)) {
              console.warn(
                `Hook object for element #${el.id} overwrites core property '${key}'!`
              );
            }
          }
        }
        const lifecycleMethods = [
          "mounted",
          "beforeUpdate",
          "updated",
          "destroyed",
          "disconnected",
          "reconnected"
        ];
        lifecycleMethods.forEach((methodName) => {
          if (callbacks[methodName] && typeof callbacks[methodName] === "function") {
            this[methodName] = callbacks[methodName];
          }
        });
      }
    }
    /** @internal */
    __attachView(view) {
      if (view) {
        this.__view = () => view;
        this.__liveSocket = () => view.liveSocket;
      } else {
        this.__view = () => {
          throw new Error(
            `hook not yet attached to a live view: ${this.el.outerHTML}`
          );
        };
        this.__liveSocket = () => {
          throw new Error(
            `hook not yet attached to a live view: ${this.el.outerHTML}`
          );
        };
      }
    }
    // Default lifecycle methods
    mounted() {
    }
    beforeUpdate() {
    }
    updated() {
    }
    destroyed() {
    }
    disconnected() {
    }
    reconnected() {
    }
    // Internal lifecycle callers - called by the View
    /** @internal */
    __mounted() {
      this.mounted();
    }
    /** @internal */
    __updated() {
      this.updated();
    }
    /** @internal */
    __beforeUpdate() {
      this.beforeUpdate();
    }
    /** @internal */
    __destroyed() {
      this.destroyed();
      dom_default.deletePrivate(this.el, HOOK_ID);
    }
    /** @internal */
    __reconnected() {
      if (this.__isDisconnected) {
        this.__isDisconnected = false;
        this.reconnected();
      }
    }
    /** @internal */
    __disconnected() {
      this.__isDisconnected = true;
      this.disconnected();
    }
    js() {
      return {
        ...js_commands_default(this.__view().liveSocket, "hook"),
        exec: (encodedJS) => {
          this.__view().liveSocket.execJS(this.el, encodedJS, "hook");
        }
      };
    }
    pushEvent(event, payload, onReply) {
      const promise = this.__view().pushHookEvent(
        this.el,
        null,
        event,
        payload || {}
      );
      if (onReply === void 0) {
        return promise.then(({ reply }) => reply);
      }
      promise.then(
        ({ reply, ref }) => onReply(reply, ref)
      ).catch(() => {
      });
    }
    pushEventTo(selectorOrTarget, event, payload, onReply) {
      if (onReply === void 0) {
        const targetPair = [];
        this.__view().withinTargets(
          selectorOrTarget,
          (view, targetCtx) => {
            targetPair.push({ view, targetCtx });
          }
        );
        const promises = targetPair.map(({ view, targetCtx }) => {
          return view.pushHookEvent(this.el, targetCtx, event, payload || {});
        });
        return Promise.allSettled(promises);
      }
      this.__view().withinTargets(
        selectorOrTarget,
        (view, targetCtx) => {
          view.pushHookEvent(this.el, targetCtx, event, payload || {}).then(
            ({ reply, ref }) => onReply(reply, ref)
          ).catch(() => {
          });
        }
      );
    }
    handleEvent(event, callback) {
      const callbackRef = {
        event,
        callback: (customEvent) => callback(customEvent.detail)
      };
      window.addEventListener(
        `phx:${event}`,
        callbackRef.callback
      );
      this.__listeners.add(callbackRef);
      return callbackRef;
    }
    removeHandleEvent(ref) {
      window.removeEventListener(
        `phx:${ref.event}`,
        ref.callback
      );
      this.__listeners.delete(ref);
    }
    upload(name, files) {
      return this.__view().dispatchUploads(null, name, files);
    }
    uploadTo(selectorOrTarget, name, files) {
      return this.__view().withinTargets(
        selectorOrTarget,
        (view, targetCtx) => {
          view.dispatchUploads(targetCtx, name, files);
        }
      );
    }
    /** @internal */
    __cleanup__() {
      this.__listeners.forEach(
        (callbackRef) => this.removeHandleEvent(callbackRef)
      );
    }
  };
  var prependFormDataKey = (key, prefix) => {
    const isArray = key.endsWith("[]");
    let baseKey = isArray ? key.slice(0, -2) : key;
    baseKey = baseKey.replace(/([^\[\]]+)(\]?$)/, `${prefix}$1$2`);
    if (isArray) {
      baseKey += "[]";
    }
    return baseKey;
  };
  var serializeForm = (form, opts, onlyNames = []) => {
    const { submitter } = opts;
    let injectedElement;
    if (submitter && submitter.name) {
      const input = document.createElement("input");
      input.type = "hidden";
      const formId = submitter.getAttribute("form");
      if (formId) {
        input.setAttribute("form", formId);
      }
      input.name = submitter.name;
      input.value = submitter.value;
      submitter.parentElement.insertBefore(input, submitter);
      injectedElement = input;
    }
    const formData = new FormData(form);
    const toRemove = [];
    formData.forEach((val, key, _index) => {
      if (val instanceof File) {
        toRemove.push(key);
      }
    });
    toRemove.forEach((key) => formData.delete(key));
    const params = new URLSearchParams();
    const { inputsUnused, onlyHiddenInputs } = Array.from(form.elements).reduce(
      (acc, input) => {
        const { inputsUnused: inputsUnused2, onlyHiddenInputs: onlyHiddenInputs2 } = acc;
        const key = input.name;
        if (!key) {
          return acc;
        }
        if (inputsUnused2[key] === void 0) {
          inputsUnused2[key] = true;
        }
        if (onlyHiddenInputs2[key] === void 0) {
          onlyHiddenInputs2[key] = true;
        }
        const isUsed = dom_default.private(input, PHX_HAS_FOCUSED) || dom_default.private(input, PHX_HAS_SUBMITTED);
        const isHidden = input.type === "hidden";
        inputsUnused2[key] = inputsUnused2[key] && !isUsed;
        onlyHiddenInputs2[key] = onlyHiddenInputs2[key] && isHidden;
        return acc;
      },
      { inputsUnused: {}, onlyHiddenInputs: {} }
    );
    for (const [key, val] of formData.entries()) {
      if (onlyNames.length === 0 || onlyNames.indexOf(key) >= 0) {
        const isUnused = inputsUnused[key];
        const hidden = onlyHiddenInputs[key];
        if (isUnused && !(submitter && submitter.name == key) && !hidden) {
          params.append(prependFormDataKey(key, "_unused_"), "");
        }
        if (typeof val === "string") {
          params.append(key, val);
        }
      }
    }
    if (submitter && injectedElement) {
      submitter.parentElement.removeChild(injectedElement);
    }
    return params.toString();
  };
  var View = class _View {
    static closestView(el) {
      const liveViewEl = el.closest(PHX_VIEW_SELECTOR);
      return liveViewEl ? dom_default.private(liveViewEl, "view") : null;
    }
    constructor(el, liveSocket2, parentView, flash, liveReferer) {
      this.isDead = false;
      this.liveSocket = liveSocket2;
      this.flash = flash;
      this.parent = parentView;
      this.root = parentView ? parentView.root : this;
      this.el = el;
      const boundView = dom_default.private(this.el, "view");
      if (boundView !== void 0 && boundView.isDead !== true) {
        logError(
          `The DOM element for this view has already been bound to a view.

        An element can only ever be associated with a single view!
        Please ensure that you are not trying to initialize multiple LiveSockets on the same page.
        This could happen if you're accidentally trying to render your root layout more than once.
        Ensure that the template set on the LiveView is different than the root layout.
      `,
          { view: boundView }
        );
        throw new Error("Cannot bind multiple views to the same DOM element.");
      }
      dom_default.putPrivate(this.el, "view", this);
      this.id = this.el.id;
      this.ref = 0;
      this.lastAckRef = null;
      this.childJoins = 0;
      this.loaderTimer = null;
      this.disconnectedTimer = null;
      this.pendingDiffs = [];
      this.pendingForms = /* @__PURE__ */ new Set();
      this.redirect = false;
      this.href = null;
      this.joinCount = this.parent ? this.parent.joinCount - 1 : 0;
      this.joinAttempts = 0;
      this.joinPending = true;
      this.destroyed = false;
      this.joinCallback = function(onDone) {
        onDone && onDone();
      };
      this.stopCallback = function() {
      };
      this.pendingJoinOps = [];
      this.viewHooks = {};
      this.formSubmits = [];
      this.children = this.parent ? null : {};
      this.root.children[this.id] = {};
      this.formsForRecovery = {};
      this.channel = this.liveSocket.channel(`lv:${this.id}`, () => {
        const url = this.href && this.expandURL(this.href);
        return {
          redirect: this.redirect ? url : void 0,
          url: this.redirect ? void 0 : url || void 0,
          params: this.connectParams(liveReferer),
          session: this.getSession(),
          static: this.getStatic(),
          flash: this.flash,
          sticky: this.el.hasAttribute(PHX_STICKY)
        };
      });
      this.portalElementIds = /* @__PURE__ */ new Set();
    }
    setHref(href) {
      this.href = href;
    }
    setRedirect(href) {
      this.redirect = true;
      this.href = href;
    }
    isMain() {
      return this.el.hasAttribute(PHX_MAIN);
    }
    connectParams(liveReferer) {
      const params = this.liveSocket.params(this.el);
      const manifest = dom_default.all(document, `[${this.binding(PHX_TRACK_STATIC)}]`).map((node) => node.src || node.href).filter((url) => typeof url === "string");
      if (manifest.length > 0) {
        params["_track_static"] = manifest;
      }
      params["_mounts"] = this.joinCount;
      params["_mount_attempts"] = this.joinAttempts;
      params["_live_referer"] = liveReferer;
      this.joinAttempts++;
      return params;
    }
    isConnected() {
      return this.channel.canPush();
    }
    getSession() {
      return this.el.getAttribute(PHX_SESSION);
    }
    getStatic() {
      const val = this.el.getAttribute(PHX_STATIC);
      return val === "" ? null : val;
    }
    destroy(callback = function() {
    }) {
      this.destroyAllChildren();
      this.destroyPortalElements();
      this.destroyed = true;
      dom_default.deletePrivate(this.el, "view");
      delete this.root.children[this.id];
      if (this.parent) {
        delete this.root.children[this.parent.id][this.id];
      }
      clearTimeout(this.loaderTimer);
      const onFinished = () => {
        callback();
        for (const id in this.viewHooks) {
          this.destroyHook(this.viewHooks[id]);
        }
      };
      dom_default.markPhxChildDestroyed(this.el);
      this.log("destroyed", () => ["the child has been removed from the parent"]);
      this.channel.leave().receive("ok", onFinished).receive("error", onFinished).receive("timeout", onFinished);
    }
    setContainerClasses(...classes) {
      this.el.classList.remove(
        PHX_CONNECTED_CLASS,
        PHX_LOADING_CLASS,
        PHX_ERROR_CLASS,
        PHX_CLIENT_ERROR_CLASS,
        PHX_SERVER_ERROR_CLASS
      );
      this.el.classList.add(...classes);
    }
    showLoader(timeout) {
      clearTimeout(this.loaderTimer);
      if (timeout) {
        this.loaderTimer = setTimeout(() => this.showLoader(), timeout);
      } else {
        for (const id in this.viewHooks) {
          this.viewHooks[id].__disconnected();
        }
        this.setContainerClasses(PHX_LOADING_CLASS);
      }
    }
    execAll(binding) {
      dom_default.all(
        this.el,
        `[${binding}]`,
        (el) => this.liveSocket.execJS(el, el.getAttribute(binding))
      );
    }
    hideLoader() {
      clearTimeout(this.loaderTimer);
      clearTimeout(this.disconnectedTimer);
      this.setContainerClasses(PHX_CONNECTED_CLASS);
      this.execAll(this.binding("connected"));
    }
    triggerReconnected() {
      for (const id in this.viewHooks) {
        this.viewHooks[id].__reconnected();
      }
    }
    log(kind, msgCallback) {
      this.liveSocket.log(this, kind, msgCallback);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.liveSocket.transition(time, onStart, onDone);
    }
    // calls the callback with the view and target element for the given phxTarget
    // targets can be:
    //  * an element itself, then it is simply passed to liveSocket.owner;
    //  * a CID (Component ID), then we first search the component's element in the DOM
    //  * a selector, then we search the selector in the DOM and call the callback
    //    for each element found with the corresponding owner view
    withinTargets(phxTarget, callback, dom = document) {
      if (phxTarget instanceof HTMLElement || phxTarget instanceof SVGElement) {
        return this.liveSocket.owner(
          phxTarget,
          (view) => callback(view, phxTarget)
        );
      }
      if (isCid(phxTarget)) {
        const targets = dom_default.findComponentNodeList(this.id, phxTarget, dom);
        if (targets.length === 0) {
          logError(`no component found matching phx-target of ${phxTarget}`);
        } else {
          callback(this, parseInt(phxTarget));
        }
      } else {
        const targets = Array.from(dom.querySelectorAll(phxTarget));
        if (targets.length === 0) {
          logError(
            `nothing found matching the phx-target selector "${phxTarget}"`
          );
        }
        targets.forEach(
          (target) => this.liveSocket.owner(target, (view) => callback(view, target))
        );
      }
    }
    applyDiff(type, rawDiff, callback) {
      this.log(type, () => ["", clone(rawDiff)]);
      const { diff, reply, events, title } = Rendered.extract(rawDiff);
      const ev = events.reduce(
        (acc, args) => {
          if (args.length === 3 && args[2] == true) {
            acc.pre.push(args.slice(0, -1));
          } else {
            acc.post.push(args);
          }
          return acc;
        },
        { pre: [], post: [] }
      );
      this.liveSocket.dispatchEvents(ev.pre);
      const update = () => {
        callback({ diff, reply, events: ev.post });
        if (typeof title === "string" || type == "mount" && this.isMain()) {
          window.requestAnimationFrame(() => dom_default.putTitle(title));
        }
      };
      if ("onDocumentPatch" in this.liveSocket.domCallbacks) {
        this.liveSocket.triggerDOM("onDocumentPatch", [update]);
      } else {
        update();
      }
    }
    onJoin(resp) {
      const { rendered, container, liveview_version, pid } = resp;
      if (container) {
        const [tag, attrs] = container;
        this.el = dom_default.replaceRootContainer(this.el, tag, attrs);
      }
      this.childJoins = 0;
      this.joinPending = true;
      this.flash = null;
      if (this.root === this) {
        this.formsForRecovery = this.getFormsForRecovery();
      }
      if (this.isMain() && window.history.state === null) {
        browser_default.pushState("replace", {
          type: "patch",
          id: this.id,
          position: this.liveSocket.currentHistoryPosition
        });
      }
      if (liveview_version !== this.liveSocket.version()) {
        console.warn(
          `LiveView asset version mismatch. JavaScript version ${this.liveSocket.version()} vs. server ${liveview_version}. To avoid issues, please ensure that your assets use the same version as the server.`
        );
      }
      if (pid) {
        this.el.setAttribute(PHX_LV_PID, pid);
      }
      browser_default.dropLocal(
        this.liveSocket.localStorage,
        window.location.pathname,
        CONSECUTIVE_RELOADS
      );
      this.applyDiff("mount", rendered, ({ diff, events }) => {
        this.rendered = new Rendered(this.id, diff);
        const [html, streams] = this.renderContainer(null, "join");
        this.dropPendingRefs();
        this.joinCount++;
        this.joinAttempts = 0;
        this.maybeRecoverForms(html, () => {
          this.onJoinComplete(resp, html, streams, events);
        });
      });
    }
    dropPendingRefs() {
      dom_default.all(document, `[${PHX_REF_SRC}="${this.refSrc()}"]`, (el) => {
        el.removeAttribute(PHX_REF_LOADING);
        el.removeAttribute(PHX_REF_SRC);
        el.removeAttribute(PHX_REF_LOCK);
      });
    }
    onJoinComplete({ live_patch }, html, streams, events) {
      if (this.joinCount > 1 || this.parent && !this.parent.isJoinPending()) {
        return this.applyJoinPatch(live_patch, html, streams, events);
      }
      const newChildren = dom_default.findPhxChildrenInFragment(html, this.id).filter(
        (toEl) => {
          const fromEl = toEl.id && this.el.querySelector(`[id="${toEl.id}"]`);
          const phxStatic = fromEl && fromEl.getAttribute(PHX_STATIC);
          if (phxStatic) {
            toEl.setAttribute(PHX_STATIC, phxStatic);
          }
          if (fromEl) {
            fromEl.setAttribute(PHX_ROOT_ID, this.root.id);
          }
          return this.joinChild(toEl);
        }
      );
      if (newChildren.length === 0) {
        if (this.parent) {
          this.root.pendingJoinOps.push([
            this,
            () => this.applyJoinPatch(live_patch, html, streams, events)
          ]);
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
          this.applyJoinPatch(live_patch, html, streams, events);
        }
      } else {
        this.root.pendingJoinOps.push([
          this,
          () => this.applyJoinPatch(live_patch, html, streams, events)
        ]);
      }
    }
    attachTrueDocEl() {
      this.el = dom_default.byId(this.id);
      this.el.setAttribute(PHX_ROOT_ID, this.root.id);
    }
    // this is invoked for dead and live views, so we must filter by
    // by owner to ensure we aren't duplicating hooks across disconnect
    // and connected states. This also handles cases where hooks exist
    // in a root layout with a LV in the body
    execNewMounted(parent = document) {
      let phxViewportTop = this.binding(PHX_VIEWPORT_TOP);
      let phxViewportBottom = this.binding(PHX_VIEWPORT_BOTTOM);
      this.all(
        parent,
        `[${phxViewportTop}], [${phxViewportBottom}]`,
        (hookEl) => {
          dom_default.maintainPrivateHooks(
            hookEl,
            hookEl,
            phxViewportTop,
            phxViewportBottom
          );
          this.maybeAddNewHook(hookEl);
        }
      );
      this.all(
        parent,
        `[${this.binding(PHX_HOOK)}], [data-phx-${PHX_HOOK}]`,
        (hookEl) => {
          this.maybeAddNewHook(hookEl);
        }
      );
      this.all(parent, `[${this.binding(PHX_MOUNTED)}]`, (el) => {
        this.maybeMounted(el);
      });
    }
    all(parent, selector2, callback) {
      dom_default.all(parent, selector2, (el) => {
        if (this.ownsElement(el)) {
          callback(el);
        }
      });
    }
    applyJoinPatch(live_patch, html, streams, events) {
      if (this.joinCount > 1) {
        if (this.pendingJoinOps.length) {
          this.pendingJoinOps.forEach((cb) => typeof cb === "function" && cb());
          this.pendingJoinOps = [];
        }
      }
      this.attachTrueDocEl();
      const patch = new DOMPatch(this, this.el, this.id, html, streams, null);
      patch.markPrunableContentForRemoval();
      this.performPatch(patch, false, true);
      this.joinNewChildren();
      this.execNewMounted();
      this.joinPending = false;
      this.liveSocket.dispatchEvents(events);
      this.applyPendingUpdates();
      if (live_patch) {
        const { kind, to } = live_patch;
        this.liveSocket.historyPatch(to, kind);
      }
      this.hideLoader();
      if (this.joinCount > 1) {
        this.triggerReconnected();
      }
      this.stopCallback();
    }
    triggerBeforeUpdateHook(fromEl, toEl) {
      this.liveSocket.triggerDOM("onBeforeElUpdated", [fromEl, toEl]);
      const hook = this.getHook(fromEl);
      const isIgnored = hook && dom_default.isIgnored(fromEl, this.binding(PHX_UPDATE));
      if (hook && !fromEl.isEqualNode(toEl) && !(isIgnored && isEqualObj(fromEl.dataset, toEl.dataset))) {
        hook.__beforeUpdate();
        return hook;
      }
    }
    maybeMounted(el) {
      const phxMounted = el.getAttribute(this.binding(PHX_MOUNTED));
      const hasBeenInvoked = phxMounted && dom_default.private(el, "mounted");
      if (phxMounted && !hasBeenInvoked) {
        this.liveSocket.execJS(el, phxMounted);
        dom_default.putPrivate(el, "mounted", true);
      }
    }
    maybeAddNewHook(el) {
      const newHook = this.addHook(el);
      if (newHook) {
        newHook.__mounted();
      }
    }
    performPatch(patch, pruneCids, isJoinPatch = false) {
      const removedEls = [];
      let phxChildrenAdded = false;
      const updatedHookIds = /* @__PURE__ */ new Set();
      this.liveSocket.triggerDOM("onPatchStart", [patch.targetContainer]);
      patch.after("added", (el) => {
        this.liveSocket.triggerDOM("onNodeAdded", [el]);
        const phxViewportTop = this.binding(PHX_VIEWPORT_TOP);
        const phxViewportBottom = this.binding(PHX_VIEWPORT_BOTTOM);
        dom_default.maintainPrivateHooks(el, el, phxViewportTop, phxViewportBottom);
        this.maybeAddNewHook(el);
        if (el.getAttribute) {
          this.maybeMounted(el);
        }
      });
      patch.after("phxChildAdded", (el) => {
        if (dom_default.isPhxSticky(el)) {
          this.liveSocket.joinRootViews();
        } else {
          phxChildrenAdded = true;
        }
      });
      patch.before("updated", (fromEl, toEl) => {
        const hook = this.triggerBeforeUpdateHook(fromEl, toEl);
        if (hook) {
          updatedHookIds.add(fromEl.id);
        }
        js_default.onBeforeElUpdated(fromEl, toEl);
      });
      patch.after("updated", (el) => {
        if (updatedHookIds.has(el.id)) {
          this.getHook(el).__updated();
        }
      });
      patch.after("discarded", (el) => {
        if (el.nodeType === Node.ELEMENT_NODE) {
          removedEls.push(el);
        }
      });
      patch.after(
        "transitionsDiscarded",
        (els) => this.afterElementsRemoved(els, pruneCids)
      );
      patch.perform(isJoinPatch);
      this.afterElementsRemoved(removedEls, pruneCids);
      this.liveSocket.triggerDOM("onPatchEnd", [patch.targetContainer]);
      return phxChildrenAdded;
    }
    afterElementsRemoved(elements, pruneCids) {
      const destroyedCIDs = [];
      elements.forEach((parent) => {
        const components = dom_default.all(
          parent,
          `[${PHX_VIEW_REF}="${this.id}"][${PHX_COMPONENT}]`
        );
        const hooks2 = dom_default.all(
          parent,
          `[${this.binding(PHX_HOOK)}], [data-phx-hook]`
        );
        components.concat(parent).forEach((el) => {
          const cid = this.componentID(el);
          if (isCid(cid) && destroyedCIDs.indexOf(cid) === -1 && el.getAttribute(PHX_VIEW_REF) === this.id) {
            destroyedCIDs.push(cid);
          }
        });
        hooks2.concat(parent).forEach((hookEl) => {
          const hook = this.getHook(hookEl);
          hook && this.destroyHook(hook);
        });
      });
      if (pruneCids) {
        this.maybePushComponentsDestroyed(destroyedCIDs);
      }
    }
    joinNewChildren() {
      dom_default.findPhxChildren(document, this.id).forEach((el) => this.joinChild(el));
    }
    maybeRecoverForms(html, callback) {
      const phxChange = this.binding("change");
      const oldForms = this.root.formsForRecovery;
      const template = document.createElement("template");
      template.innerHTML = html;
      dom_default.all(template.content, `[${PHX_PORTAL}]`).forEach((portalTemplate) => {
        template.content.firstElementChild.appendChild(
          portalTemplate.content.firstElementChild
        );
      });
      const rootEl = template.content.firstElementChild;
      rootEl.id = this.id;
      rootEl.setAttribute(PHX_ROOT_ID, this.root.id);
      rootEl.setAttribute(PHX_SESSION, this.getSession());
      rootEl.setAttribute(PHX_STATIC, this.getStatic());
      rootEl.setAttribute(PHX_PARENT_ID, this.parent ? this.parent.id : null);
      const formsToRecover = (
        // we go over all forms in the new DOM; because this is only the HTML for the current
        // view, we can be sure that all forms are owned by this view:
        dom_default.all(template.content, "form").filter((newForm) => newForm.id && oldForms[newForm.id]).filter((newForm) => !this.pendingForms.has(newForm.id)).filter(
          (newForm) => oldForms[newForm.id].getAttribute(phxChange) === newForm.getAttribute(phxChange)
        ).map((newForm) => {
          return [oldForms[newForm.id], newForm];
        })
      );
      if (formsToRecover.length === 0) {
        return callback();
      }
      formsToRecover.forEach(([oldForm, newForm], i7) => {
        this.pendingForms.add(newForm.id);
        this.pushFormRecovery(
          oldForm,
          newForm,
          template.content.firstElementChild,
          () => {
            this.pendingForms.delete(newForm.id);
            if (i7 === formsToRecover.length - 1) {
              callback();
            }
          }
        );
      });
    }
    getChildById(id) {
      return this.root.children[this.id][id];
    }
    getDescendentByEl(el) {
      if (el.id === this.id) {
        return this;
      } else {
        return this.children[el.getAttribute(PHX_PARENT_ID)]?.[el.id];
      }
    }
    destroyDescendent(id) {
      for (const parentId in this.root.children) {
        for (const childId in this.root.children[parentId]) {
          if (childId === id) {
            return this.root.children[parentId][childId].destroy();
          }
        }
      }
    }
    joinChild(el) {
      const child = this.getChildById(el.id);
      if (!child) {
        const view = new _View(el, this.liveSocket, this);
        this.root.children[this.id][view.id] = view;
        view.join();
        this.childJoins++;
        return true;
      }
    }
    isJoinPending() {
      return this.joinPending;
    }
    ackJoin(_child) {
      this.childJoins--;
      if (this.childJoins === 0) {
        if (this.parent) {
          this.parent.ackJoin(this);
        } else {
          this.onAllChildJoinsComplete();
        }
      }
    }
    onAllChildJoinsComplete() {
      this.pendingForms.clear();
      this.formsForRecovery = {};
      this.joinCallback(() => {
        this.pendingJoinOps.forEach(([view, op]) => {
          if (!view.isDestroyed()) {
            op();
          }
        });
        this.pendingJoinOps = [];
      });
    }
    update(diff, events, isPending = false) {
      if (this.isJoinPending() || this.liveSocket.hasPendingLink() && this.root.isMain()) {
        if (!isPending) {
          this.pendingDiffs.push({ diff, events });
        }
        return false;
      }
      this.rendered.mergeDiff(diff);
      let phxChildrenAdded = false;
      if (this.rendered.isComponentOnlyDiff(diff)) {
        this.liveSocket.time("component patch complete", () => {
          const parentCids = dom_default.findExistingParentCIDs(
            this.id,
            this.rendered.componentCIDs(diff)
          );
          parentCids.forEach((parentCID) => {
            if (this.componentPatch(
              this.rendered.getComponent(diff, parentCID),
              parentCID
            )) {
              phxChildrenAdded = true;
            }
          });
        });
      } else if (!isEmpty(diff)) {
        this.liveSocket.time("full patch complete", () => {
          const [html, streams] = this.renderContainer(diff, "update");
          const patch = new DOMPatch(this, this.el, this.id, html, streams, null);
          phxChildrenAdded = this.performPatch(patch, true);
        });
      }
      this.liveSocket.dispatchEvents(events);
      if (phxChildrenAdded) {
        this.joinNewChildren();
      }
      return true;
    }
    renderContainer(diff, kind) {
      return this.liveSocket.time(`toString diff (${kind})`, () => {
        const tag = this.el.tagName;
        const cids = diff ? this.rendered.componentCIDs(diff) : null;
        const { buffer: html, streams } = this.rendered.toString(cids);
        return [`<${tag}>${html}</${tag}>`, streams];
      });
    }
    componentPatch(diff, cid) {
      if (isEmpty(diff))
        return false;
      const { buffer: html, streams } = this.rendered.componentToString(cid);
      const patch = new DOMPatch(this, this.el, this.id, html, streams, cid);
      const childrenAdded = this.performPatch(patch, true);
      return childrenAdded;
    }
    getHook(el) {
      return this.viewHooks[ViewHook.elementID(el)];
    }
    addHook(el) {
      const hookElId = ViewHook.elementID(el);
      if (el.getAttribute && !this.ownsElement(el)) {
        return;
      }
      if (hookElId && !this.viewHooks[hookElId]) {
        const hook = dom_default.getCustomElHook(el) || logError(`no hook found for custom element: ${el.id}`);
        this.viewHooks[hookElId] = hook;
        hook.__attachView(this);
        return hook;
      } else if (hookElId || !el.getAttribute) {
        return;
      } else {
        const hookName = el.getAttribute(`data-phx-${PHX_HOOK}`) || el.getAttribute(this.binding(PHX_HOOK));
        if (!hookName) {
          return;
        }
        const hookDefinition = this.liveSocket.getHookDefinition(hookName);
        if (hookDefinition) {
          if (!el.id) {
            logError(
              `no DOM ID for hook "${hookName}". Hooks require a unique ID on each element.`,
              el
            );
            return;
          }
          let hookInstance;
          try {
            if (typeof hookDefinition === "function" && hookDefinition.prototype instanceof ViewHook) {
              hookInstance = new hookDefinition(this, el);
            } else if (typeof hookDefinition === "object" && hookDefinition !== null) {
              hookInstance = new ViewHook(this, el, hookDefinition);
            } else {
              logError(
                `Invalid hook definition for "${hookName}". Expected a class extending ViewHook or an object definition.`,
                el
              );
              return;
            }
          } catch (e7) {
            const errorMessage = e7 instanceof Error ? e7.message : String(e7);
            logError(`Failed to create hook "${hookName}": ${errorMessage}`, el);
            return;
          }
          this.viewHooks[ViewHook.elementID(hookInstance.el)] = hookInstance;
          return hookInstance;
        } else if (hookName !== null) {
          logError(`unknown hook found for "${hookName}"`, el);
        }
      }
    }
    destroyHook(hook) {
      const hookId = ViewHook.elementID(hook.el);
      hook.__destroyed();
      hook.__cleanup__();
      delete this.viewHooks[hookId];
    }
    applyPendingUpdates() {
      this.pendingDiffs = this.pendingDiffs.filter(
        ({ diff, events }) => !this.update(diff, events, true)
      );
      this.eachChild((child) => child.applyPendingUpdates());
    }
    eachChild(callback) {
      const children = this.root.children[this.id] || {};
      for (const id in children) {
        callback(this.getChildById(id));
      }
    }
    onChannel(event, cb) {
      this.liveSocket.onChannel(this.channel, event, (resp) => {
        if (this.isJoinPending()) {
          if (this.joinCount > 1) {
            this.pendingJoinOps.push(() => cb(resp));
          } else {
            this.root.pendingJoinOps.push([this, () => cb(resp)]);
          }
        } else {
          this.liveSocket.requestDOMUpdate(() => cb(resp));
        }
      });
    }
    bindChannel() {
      this.liveSocket.onChannel(this.channel, "diff", (rawDiff) => {
        this.liveSocket.requestDOMUpdate(() => {
          this.applyDiff(
            "update",
            rawDiff,
            ({ diff, events }) => this.update(diff, events)
          );
        });
      });
      this.onChannel(
        "redirect",
        ({ to, flash }) => this.onRedirect({ to, flash })
      );
      this.onChannel("live_patch", (redir) => this.onLivePatch(redir));
      this.onChannel("live_redirect", (redir) => this.onLiveRedirect(redir));
      this.channel.onError((reason) => this.onError(reason));
      this.channel.onClose((reason) => this.onClose(reason));
    }
    destroyAllChildren() {
      this.eachChild((child) => child.destroy());
    }
    onLiveRedirect(redir) {
      const { to, kind, flash } = redir;
      const url = this.expandURL(to);
      const e7 = new CustomEvent("phx:server-navigate", {
        detail: { to, kind, flash }
      });
      this.liveSocket.historyRedirect(e7, url, kind, flash);
    }
    onLivePatch(redir) {
      const { to, kind } = redir;
      this.href = this.expandURL(to);
      this.liveSocket.historyPatch(to, kind);
    }
    expandURL(to) {
      return to.startsWith("/") ? `${window.location.protocol}//${window.location.host}${to}` : to;
    }
    /**
     * @param {{to: string, flash?: string, reloadToken?: string}} redirect
     */
    onRedirect({ to, flash, reloadToken }) {
      this.liveSocket.redirect(to, flash, reloadToken);
    }
    isDestroyed() {
      return this.destroyed;
    }
    joinDead() {
      this.isDead = true;
    }
    joinPush() {
      this.joinPush = this.joinPush || this.channel.join();
      return this.joinPush;
    }
    join(callback) {
      this.showLoader(this.liveSocket.loaderTimeout);
      this.bindChannel();
      if (this.isMain()) {
        this.stopCallback = this.liveSocket.withPageLoading({
          to: this.href,
          kind: "initial"
        });
      }
      this.joinCallback = (onDone) => {
        onDone = onDone || function() {
        };
        callback ? callback(this.joinCount, onDone) : onDone();
      };
      this.wrapPush(() => this.channel.join(), {
        ok: (resp) => this.liveSocket.requestDOMUpdate(() => this.onJoin(resp)),
        error: (error) => this.onJoinError(error),
        timeout: () => this.onJoinError({ reason: "timeout" })
      });
    }
    onJoinError(resp) {
      if (resp.reason === "reload") {
        this.log("error", () => [
          `failed mount with ${resp.status}. Falling back to page reload`,
          resp
        ]);
        this.onRedirect({
          to: this.liveSocket.main.href,
          reloadToken: resp.token
        });
        return;
      } else if (resp.reason === "unauthorized" || resp.reason === "stale") {
        this.log("error", () => [
          "unauthorized live_redirect. Falling back to page request",
          resp
        ]);
        this.onRedirect({ to: this.liveSocket.main.href, flash: this.flash });
        return;
      }
      if (resp.redirect || resp.live_redirect) {
        this.joinPending = false;
        this.channel.leave();
      }
      if (resp.redirect) {
        return this.onRedirect(resp.redirect);
      }
      if (resp.live_redirect) {
        return this.onLiveRedirect(resp.live_redirect);
      }
      this.log("error", () => ["unable to join", resp]);
      if (this.isMain()) {
        this.displayError(
          [PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS],
          { unstructuredError: resp, errorKind: "server" }
        );
        if (this.liveSocket.isConnected()) {
          this.liveSocket.reloadWithJitter(this);
        }
      } else {
        if (this.joinAttempts >= MAX_CHILD_JOIN_ATTEMPTS) {
          this.root.displayError(
            [PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS],
            { unstructuredError: resp, errorKind: "server" }
          );
          this.log("error", () => [
            `giving up trying to mount after ${MAX_CHILD_JOIN_ATTEMPTS} tries`,
            resp
          ]);
          this.destroy();
        }
        const trueChildEl = dom_default.byId(this.el.id);
        if (trueChildEl) {
          dom_default.mergeAttrs(trueChildEl, this.el);
          this.displayError(
            [PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS],
            { unstructuredError: resp, errorKind: "server" }
          );
          this.el = trueChildEl;
        } else {
          this.destroy();
        }
      }
    }
    onClose(reason) {
      if (this.isDestroyed()) {
        return;
      }
      if (this.isMain() && this.liveSocket.hasPendingLink() && reason !== "leave") {
        return this.liveSocket.reloadWithJitter(this);
      }
      this.destroyAllChildren();
      this.liveSocket.dropActiveElement(this);
      if (this.liveSocket.isUnloaded()) {
        this.showLoader(BEFORE_UNLOAD_LOADER_TIMEOUT);
      }
    }
    onError(reason) {
      this.onClose(reason);
      if (this.liveSocket.isConnected()) {
        this.log("error", () => ["view crashed", reason]);
      }
      if (!this.liveSocket.isUnloaded()) {
        if (this.liveSocket.isConnected()) {
          this.displayError(
            [PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_SERVER_ERROR_CLASS],
            { unstructuredError: reason, errorKind: "server" }
          );
        } else {
          this.displayError(
            [PHX_LOADING_CLASS, PHX_ERROR_CLASS, PHX_CLIENT_ERROR_CLASS],
            { unstructuredError: reason, errorKind: "client" }
          );
        }
      }
    }
    displayError(classes, details = {}) {
      if (this.isMain()) {
        dom_default.dispatchEvent(window, "phx:page-loading-start", {
          detail: { to: this.href, kind: "error", ...details }
        });
      }
      this.showLoader();
      this.setContainerClasses(...classes);
      this.delayedDisconnected();
    }
    delayedDisconnected() {
      this.disconnectedTimer = setTimeout(() => {
        this.execAll(this.binding("disconnected"));
      }, this.liveSocket.disconnectedTimeout);
    }
    wrapPush(callerPush, receives) {
      const latency = this.liveSocket.getLatencySim();
      const withLatency = latency ? (cb) => setTimeout(() => !this.isDestroyed() && cb(), latency) : (cb) => !this.isDestroyed() && cb();
      withLatency(() => {
        callerPush().receive(
          "ok",
          (resp) => withLatency(() => receives.ok && receives.ok(resp))
        ).receive(
          "error",
          (reason) => withLatency(() => receives.error && receives.error(reason))
        ).receive(
          "timeout",
          () => withLatency(() => receives.timeout && receives.timeout())
        );
      });
    }
    pushWithReply(refGenerator, event, payload) {
      if (!this.isConnected()) {
        return Promise.reject(new Error("no connection"));
      }
      const [ref, [el], opts] = refGenerator ? refGenerator({ payload }) : [null, [], {}];
      const oldJoinCount = this.joinCount;
      let onLoadingDone = function() {
      };
      if (opts.page_loading) {
        onLoadingDone = this.liveSocket.withPageLoading({
          kind: "element",
          target: el
        });
      }
      if (typeof payload.cid !== "number") {
        delete payload.cid;
      }
      return new Promise((resolve, reject) => {
        this.wrapPush(() => this.channel.push(event, payload, PUSH_TIMEOUT), {
          ok: (resp) => {
            if (ref !== null) {
              this.lastAckRef = ref;
            }
            const finish = (hookReply) => {
              if (resp.redirect) {
                this.onRedirect(resp.redirect);
              }
              if (resp.live_patch) {
                this.onLivePatch(resp.live_patch);
              }
              if (resp.live_redirect) {
                this.onLiveRedirect(resp.live_redirect);
              }
              onLoadingDone();
              resolve({ resp, reply: hookReply, ref });
            };
            if (resp.diff) {
              this.liveSocket.requestDOMUpdate(() => {
                this.applyDiff("update", resp.diff, ({ diff, reply, events }) => {
                  if (ref !== null) {
                    this.undoRefs(ref, payload.event);
                  }
                  this.update(diff, events);
                  finish(reply);
                });
              });
            } else {
              if (ref !== null) {
                this.undoRefs(ref, payload.event);
              }
              finish(null);
            }
          },
          error: (reason) => reject(new Error(`failed with reason: ${JSON.stringify(reason)}`)),
          timeout: () => {
            reject(new Error("timeout"));
            if (this.joinCount === oldJoinCount) {
              this.liveSocket.reloadWithJitter(this, () => {
                this.log("timeout", () => [
                  "received timeout while communicating with server. Falling back to hard refresh for recovery"
                ]);
              });
            }
          }
        });
      });
    }
    undoRefs(ref, phxEvent, onlyEls) {
      if (!this.isConnected()) {
        return;
      }
      const selector2 = `[${PHX_REF_SRC}="${this.refSrc()}"]`;
      if (onlyEls) {
        onlyEls = new Set(onlyEls);
        dom_default.all(document, selector2, (parent) => {
          if (onlyEls && !onlyEls.has(parent)) {
            return;
          }
          dom_default.all(
            parent,
            selector2,
            (child) => this.undoElRef(child, ref, phxEvent)
          );
          this.undoElRef(parent, ref, phxEvent);
        });
      } else {
        dom_default.all(document, selector2, (el) => this.undoElRef(el, ref, phxEvent));
      }
    }
    undoElRef(el, ref, phxEvent) {
      const elRef = new ElementRef(el);
      elRef.maybeUndo(ref, phxEvent, (clonedTree) => {
        const patch = new DOMPatch(this, el, this.id, clonedTree, [], null, {
          undoRef: ref
        });
        const phxChildrenAdded = this.performPatch(patch, true);
        dom_default.all(
          el,
          `[${PHX_REF_SRC}="${this.refSrc()}"]`,
          (child) => this.undoElRef(child, ref, phxEvent)
        );
        if (phxChildrenAdded) {
          this.joinNewChildren();
        }
      });
    }
    refSrc() {
      return this.el.id;
    }
    putRef(elements, phxEvent, eventType, opts = {}) {
      const newRef = this.ref++;
      const disableWith = this.binding(PHX_DISABLE_WITH);
      if (opts.loading) {
        const loadingEls = dom_default.all(document, opts.loading).map((el) => {
          return { el, lock: true, loading: true };
        });
        elements = elements.concat(loadingEls);
      }
      for (const { el, lock, loading } of elements) {
        if (!lock && !loading) {
          throw new Error("putRef requires lock or loading");
        }
        el.setAttribute(PHX_REF_SRC, this.refSrc());
        if (loading) {
          el.setAttribute(PHX_REF_LOADING, newRef);
        }
        if (lock) {
          el.setAttribute(PHX_REF_LOCK, newRef);
        }
        if (!loading || opts.submitter && !(el === opts.submitter || el === opts.form)) {
          continue;
        }
        const lockCompletePromise = new Promise((resolve) => {
          el.addEventListener(`phx:undo-lock:${newRef}`, () => resolve(detail), {
            once: true
          });
        });
        const loadingCompletePromise = new Promise((resolve) => {
          el.addEventListener(
            `phx:undo-loading:${newRef}`,
            () => resolve(detail),
            { once: true }
          );
        });
        el.classList.add(`phx-${eventType}-loading`);
        const disableText = el.getAttribute(disableWith);
        if (disableText !== null) {
          if (!el.getAttribute(PHX_DISABLE_WITH_RESTORE)) {
            el.setAttribute(PHX_DISABLE_WITH_RESTORE, el.textContent);
          }
          if (disableText !== "") {
            el.textContent = disableText;
          }
          el.setAttribute(
            PHX_DISABLED,
            el.getAttribute(PHX_DISABLED) || el.disabled
          );
          el.setAttribute("disabled", "");
        }
        const detail = {
          event: phxEvent,
          eventType,
          ref: newRef,
          isLoading: loading,
          isLocked: lock,
          lockElements: elements.filter(({ lock: lock2 }) => lock2).map(({ el: el2 }) => el2),
          loadingElements: elements.filter(({ loading: loading2 }) => loading2).map(({ el: el2 }) => el2),
          unlock: (els) => {
            els = Array.isArray(els) ? els : [els];
            this.undoRefs(newRef, phxEvent, els);
          },
          lockComplete: lockCompletePromise,
          loadingComplete: loadingCompletePromise,
          lock: (lockEl) => {
            return new Promise((resolve) => {
              if (this.isAcked(newRef)) {
                return resolve(detail);
              }
              lockEl.setAttribute(PHX_REF_LOCK, newRef);
              lockEl.setAttribute(PHX_REF_SRC, this.refSrc());
              lockEl.addEventListener(
                `phx:lock-stop:${newRef}`,
                () => resolve(detail),
                { once: true }
              );
            });
          }
        };
        if (opts.payload) {
          detail["payload"] = opts.payload;
        }
        if (opts.target) {
          detail["target"] = opts.target;
        }
        if (opts.originalEvent) {
          detail["originalEvent"] = opts.originalEvent;
        }
        el.dispatchEvent(
          new CustomEvent("phx:push", {
            detail,
            bubbles: true,
            cancelable: false
          })
        );
        if (phxEvent) {
          el.dispatchEvent(
            new CustomEvent(`phx:push:${phxEvent}`, {
              detail,
              bubbles: true,
              cancelable: false
            })
          );
        }
      }
      return [newRef, elements.map(({ el }) => el), opts];
    }
    isAcked(ref) {
      return this.lastAckRef !== null && this.lastAckRef >= ref;
    }
    componentID(el) {
      const cid = el.getAttribute && el.getAttribute(PHX_COMPONENT);
      return cid ? parseInt(cid) : null;
    }
    targetComponentID(target, targetCtx, opts = {}) {
      if (isCid(targetCtx)) {
        return targetCtx;
      }
      const cidOrSelector = opts.target || target.getAttribute(this.binding("target"));
      if (isCid(cidOrSelector)) {
        return parseInt(cidOrSelector);
      } else if (targetCtx && (cidOrSelector !== null || opts.target)) {
        return this.closestComponentID(targetCtx);
      } else {
        return null;
      }
    }
    closestComponentID(targetCtx) {
      if (isCid(targetCtx)) {
        return targetCtx;
      } else if (targetCtx) {
        return maybe(
          // We either use the closest data-phx-component binding, or -
          // in case of portals - continue with the portal source.
          // This is necessary if teleporting an element outside of its LiveComponent.
          targetCtx.closest(`[${PHX_COMPONENT}],[${PHX_TELEPORTED_SRC}]`),
          (el) => {
            if (el.hasAttribute(PHX_COMPONENT)) {
              return this.ownsElement(el) && this.componentID(el);
            }
            if (el.hasAttribute(PHX_TELEPORTED_SRC)) {
              const portalParent = dom_default.byId(el.getAttribute(PHX_TELEPORTED_SRC));
              return this.closestComponentID(portalParent);
            }
          }
        );
      } else {
        return null;
      }
    }
    pushHookEvent(el, targetCtx, event, payload) {
      if (!this.isConnected()) {
        this.log("hook", () => [
          "unable to push hook event. LiveView not connected",
          event,
          payload
        ]);
        return Promise.reject(
          new Error("unable to push hook event. LiveView not connected")
        );
      }
      const refGenerator = () => this.putRef([{ el, loading: true, lock: true }], event, "hook", {
        payload,
        target: targetCtx
      });
      return this.pushWithReply(refGenerator, "event", {
        type: "hook",
        event,
        value: payload,
        cid: this.closestComponentID(targetCtx)
      }).then(({ resp: _resp, reply, ref }) => ({ reply, ref }));
    }
    extractMeta(el, meta, value) {
      const prefix = this.binding("value-");
      for (let i7 = 0; i7 < el.attributes.length; i7++) {
        if (!meta) {
          meta = {};
        }
        const name = el.attributes[i7].name;
        if (name.startsWith(prefix)) {
          meta[name.replace(prefix, "")] = el.getAttribute(name);
        }
      }
      if (el.value !== void 0 && !(el instanceof HTMLFormElement)) {
        if (!meta) {
          meta = {};
        }
        meta.value = el.value;
        if (el.tagName === "INPUT" && CHECKABLE_INPUTS.indexOf(el.type) >= 0 && !el.checked) {
          delete meta.value;
        }
      }
      if (value) {
        if (!meta) {
          meta = {};
        }
        for (const key in value) {
          meta[key] = value[key];
        }
      }
      return meta;
    }
    pushEvent(type, el, targetCtx, phxEvent, meta, opts = {}, onReply) {
      this.pushWithReply(
        (maybePayload) => this.putRef([{ el, loading: true, lock: true }], phxEvent, type, {
          ...opts,
          payload: maybePayload?.payload
        }),
        "event",
        {
          type,
          event: phxEvent,
          value: this.extractMeta(el, meta, opts.value),
          cid: this.targetComponentID(el, targetCtx, opts)
        }
      ).then(({ reply }) => onReply && onReply(reply)).catch((error) => logError("Failed to push event", error));
    }
    pushFileProgress(fileEl, entryRef, progress, onReply = function() {
    }) {
      this.liveSocket.withinOwners(fileEl.form, (view, targetCtx) => {
        view.pushWithReply(null, "progress", {
          event: fileEl.getAttribute(view.binding(PHX_PROGRESS)),
          ref: fileEl.getAttribute(PHX_UPLOAD_REF),
          entry_ref: entryRef,
          progress,
          cid: view.targetComponentID(fileEl.form, targetCtx)
        }).then(() => onReply()).catch((error) => logError("Failed to push file progress", error));
      });
    }
    pushInput(inputEl, targetCtx, forceCid, phxEvent, opts, callback) {
      if (!inputEl.form) {
        throw new Error("form events require the input to be inside a form");
      }
      let uploads;
      const cid = isCid(forceCid) ? forceCid : this.targetComponentID(inputEl.form, targetCtx, opts);
      const refGenerator = (maybePayload) => {
        return this.putRef(
          [
            { el: inputEl, loading: true, lock: true },
            { el: inputEl.form, loading: true, lock: true }
          ],
          phxEvent,
          "change",
          { ...opts, payload: maybePayload?.payload }
        );
      };
      let formData;
      const meta = this.extractMeta(inputEl.form, {}, opts.value);
      const serializeOpts = {};
      if (inputEl instanceof HTMLButtonElement) {
        serializeOpts.submitter = inputEl;
      }
      if (inputEl.getAttribute(this.binding("change"))) {
        formData = serializeForm(inputEl.form, serializeOpts, [inputEl.name]);
      } else {
        formData = serializeForm(inputEl.form, serializeOpts);
      }
      if (dom_default.isUploadInput(inputEl) && inputEl.files && inputEl.files.length > 0) {
        LiveUploader.trackFiles(inputEl, Array.from(inputEl.files));
      }
      uploads = LiveUploader.serializeUploads(inputEl);
      const event = {
        type: "form",
        event: phxEvent,
        value: formData,
        meta: {
          // no target was implicitly sent as "undefined" in LV <= 1.0.5, therefore
          // we have to keep it. In 1.0.6 we switched from passing meta as URL encoded data
          // to passing it directly in the event, but the JSON encode would drop keys with
          // undefined values.
          _target: opts._target || "undefined",
          ...meta
        },
        uploads,
        cid
      };
      this.pushWithReply(refGenerator, "event", event).then(({ resp }) => {
        if (dom_default.isUploadInput(inputEl) && dom_default.isAutoUpload(inputEl)) {
          ElementRef.onUnlock(inputEl, () => {
            if (LiveUploader.filesAwaitingPreflight(inputEl).length > 0) {
              const [ref, _els] = refGenerator();
              this.undoRefs(ref, phxEvent, [inputEl.form]);
              this.uploadFiles(
                inputEl.form,
                phxEvent,
                targetCtx,
                ref,
                cid,
                (_uploads) => {
                  callback && callback(resp);
                  this.triggerAwaitingSubmit(inputEl.form, phxEvent);
                  this.undoRefs(ref, phxEvent);
                }
              );
            }
          });
        } else {
          callback && callback(resp);
        }
      }).catch((error) => logError("Failed to push input event", error));
    }
    triggerAwaitingSubmit(formEl, phxEvent) {
      const awaitingSubmit = this.getScheduledSubmit(formEl);
      if (awaitingSubmit) {
        const [_el, _ref2, _opts, callback] = awaitingSubmit;
        this.cancelSubmit(formEl, phxEvent);
        callback();
      }
    }
    getScheduledSubmit(formEl) {
      return this.formSubmits.find(
        ([el, _ref2, _opts, _callback]) => el.isSameNode(formEl)
      );
    }
    scheduleSubmit(formEl, ref, opts, callback) {
      if (this.getScheduledSubmit(formEl)) {
        return true;
      }
      this.formSubmits.push([formEl, ref, opts, callback]);
    }
    cancelSubmit(formEl, phxEvent) {
      this.formSubmits = this.formSubmits.filter(
        ([el, ref, _opts, _callback]) => {
          if (el.isSameNode(formEl)) {
            this.undoRefs(ref, phxEvent);
            return false;
          } else {
            return true;
          }
        }
      );
    }
    disableForm(formEl, phxEvent, opts = {}) {
      const filterIgnored = (el) => {
        const userIgnored = closestPhxBinding(
          el,
          `${this.binding(PHX_UPDATE)}=ignore`,
          el.form
        );
        return !(userIgnored || closestPhxBinding(el, "data-phx-update=ignore", el.form));
      };
      const filterDisables = (el) => {
        return el.hasAttribute(this.binding(PHX_DISABLE_WITH));
      };
      const filterButton = (el) => el.tagName == "BUTTON";
      const filterInput = (el) => ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName);
      const formElements = Array.from(formEl.elements);
      const disables = formElements.filter(filterDisables);
      const buttons = formElements.filter(filterButton).filter(filterIgnored);
      const inputs = formElements.filter(filterInput).filter(filterIgnored);
      buttons.forEach((button) => {
        button.setAttribute(PHX_DISABLED, button.disabled);
        button.disabled = true;
      });
      inputs.forEach((input) => {
        input.setAttribute(PHX_READONLY, input.readOnly);
        input.readOnly = true;
        if (input.files) {
          input.setAttribute(PHX_DISABLED, input.disabled);
          input.disabled = true;
        }
      });
      const formEls = disables.concat(buttons).concat(inputs).map((el) => {
        return { el, loading: true, lock: true };
      });
      const els = [{ el: formEl, loading: true, lock: false }].concat(formEls).reverse();
      return this.putRef(els, phxEvent, "submit", opts);
    }
    pushFormSubmit(formEl, targetCtx, phxEvent, submitter, opts, onReply) {
      const refGenerator = (maybePayload) => this.disableForm(formEl, phxEvent, {
        ...opts,
        form: formEl,
        payload: maybePayload?.payload,
        submitter
      });
      dom_default.putPrivate(formEl, "submitter", submitter);
      const cid = this.targetComponentID(formEl, targetCtx);
      if (LiveUploader.hasUploadsInProgress(formEl)) {
        const [ref, _els] = refGenerator();
        const push = () => this.pushFormSubmit(
          formEl,
          targetCtx,
          phxEvent,
          submitter,
          opts,
          onReply
        );
        return this.scheduleSubmit(formEl, ref, opts, push);
      } else if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
        const [ref, els] = refGenerator();
        const proxyRefGen = () => [ref, els, opts];
        this.uploadFiles(formEl, phxEvent, targetCtx, ref, cid, (_uploads) => {
          if (LiveUploader.inputsAwaitingPreflight(formEl).length > 0) {
            return this.undoRefs(ref, phxEvent);
          }
          const meta = this.extractMeta(formEl, {}, opts.value);
          const formData = serializeForm(formEl, { submitter });
          this.pushWithReply(proxyRefGen, "event", {
            type: "form",
            event: phxEvent,
            value: formData,
            meta,
            cid
          }).then(({ resp }) => onReply(resp)).catch((error) => logError("Failed to push form submit", error));
        });
      } else if (!(formEl.hasAttribute(PHX_REF_SRC) && formEl.classList.contains("phx-submit-loading"))) {
        const meta = this.extractMeta(formEl, {}, opts.value);
        const formData = serializeForm(formEl, { submitter });
        this.pushWithReply(refGenerator, "event", {
          type: "form",
          event: phxEvent,
          value: formData,
          meta,
          cid
        }).then(({ resp }) => onReply(resp)).catch((error) => logError("Failed to push form submit", error));
      }
    }
    uploadFiles(formEl, phxEvent, targetCtx, ref, cid, onComplete) {
      const joinCountAtUpload = this.joinCount;
      const inputEls = LiveUploader.activeFileInputs(formEl);
      let numFileInputsInProgress = inputEls.length;
      inputEls.forEach((inputEl) => {
        const uploader = new LiveUploader(inputEl, this, () => {
          numFileInputsInProgress--;
          if (numFileInputsInProgress === 0) {
            onComplete();
          }
        });
        const entries = uploader.entries().map((entry) => entry.toPreflightPayload());
        if (entries.length === 0) {
          numFileInputsInProgress--;
          return;
        }
        const payload = {
          ref: inputEl.getAttribute(PHX_UPLOAD_REF),
          entries,
          cid: this.targetComponentID(inputEl.form, targetCtx)
        };
        this.log("upload", () => ["sending preflight request", payload]);
        this.pushWithReply(null, "allow_upload", payload).then(({ resp }) => {
          this.log("upload", () => ["got preflight response", resp]);
          uploader.entries().forEach((entry) => {
            if (resp.entries && !resp.entries[entry.ref]) {
              this.handleFailedEntryPreflight(
                entry.ref,
                "failed preflight",
                uploader
              );
            }
          });
          if (resp.error || Object.keys(resp.entries).length === 0) {
            this.undoRefs(ref, phxEvent);
            const errors = resp.error || [];
            errors.map(([entry_ref, reason]) => {
              this.handleFailedEntryPreflight(entry_ref, reason, uploader);
            });
          } else {
            const onError = (callback) => {
              this.channel.onError(() => {
                if (this.joinCount === joinCountAtUpload) {
                  callback();
                }
              });
            };
            uploader.initAdapterUpload(resp, onError, this.liveSocket);
          }
        }).catch((error) => logError("Failed to push upload", error));
      });
    }
    handleFailedEntryPreflight(uploadRef, reason, uploader) {
      if (uploader.isAutoUpload()) {
        const entry = uploader.entries().find((entry2) => entry2.ref === uploadRef.toString());
        if (entry) {
          entry.cancel();
        }
      } else {
        uploader.entries().map((entry) => entry.cancel());
      }
      this.log("upload", () => [`error for entry ${uploadRef}`, reason]);
    }
    dispatchUploads(targetCtx, name, filesOrBlobs) {
      const targetElement = this.targetCtxElement(targetCtx) || this.el;
      const inputs = dom_default.findUploadInputs(targetElement).filter(
        (el) => el.name === name
      );
      if (inputs.length === 0) {
        logError(`no live file inputs found matching the name "${name}"`);
      } else if (inputs.length > 1) {
        logError(`duplicate live file inputs found matching the name "${name}"`);
      } else {
        dom_default.dispatchEvent(inputs[0], PHX_TRACK_UPLOADS, {
          detail: { files: filesOrBlobs }
        });
      }
    }
    targetCtxElement(targetCtx) {
      if (isCid(targetCtx)) {
        const [target] = dom_default.findComponentNodeList(this.id, targetCtx);
        return target;
      } else if (targetCtx) {
        return targetCtx;
      } else {
        return null;
      }
    }
    pushFormRecovery(oldForm, newForm, templateDom, callback) {
      const phxChange = this.binding("change");
      const phxTarget = newForm.getAttribute(this.binding("target")) || newForm;
      const phxEvent = newForm.getAttribute(this.binding(PHX_AUTO_RECOVER)) || newForm.getAttribute(this.binding("change"));
      const inputs = Array.from(oldForm.elements).filter(
        (el) => dom_default.isFormInput(el) && el.name && !el.hasAttribute(phxChange)
      );
      if (inputs.length === 0) {
        callback();
        return;
      }
      inputs.forEach(
        (input2) => input2.hasAttribute(PHX_UPLOAD_REF) && LiveUploader.clearFiles(input2)
      );
      const input = inputs.find((el) => el.type !== "hidden") || inputs[0];
      let pending = 0;
      this.withinTargets(
        phxTarget,
        (targetView, targetCtx) => {
          const cid = this.targetComponentID(newForm, targetCtx);
          pending++;
          let e7 = new CustomEvent("phx:form-recovery", {
            detail: { sourceElement: oldForm }
          });
          js_default.exec(e7, "change", phxEvent, this, input, [
            "push",
            {
              _target: input.name,
              targetView,
              targetCtx,
              newCid: cid,
              callback: () => {
                pending--;
                if (pending === 0) {
                  callback();
                }
              }
            }
          ]);
        },
        templateDom
      );
    }
    pushLinkPatch(e7, href, targetEl, callback) {
      const linkRef = this.liveSocket.setPendingLink(href);
      const loading = e7.isTrusted && e7.type !== "popstate";
      const refGen = targetEl ? () => this.putRef(
        [{ el: targetEl, loading, lock: true }],
        null,
        "click"
      ) : null;
      const fallback = () => this.liveSocket.redirect(window.location.href);
      const url = href.startsWith("/") ? `${location.protocol}//${location.host}${href}` : href;
      this.pushWithReply(refGen, "live_patch", { url }).then(
        ({ resp }) => {
          this.liveSocket.requestDOMUpdate(() => {
            if (resp.link_redirect) {
              this.liveSocket.replaceMain(href, null, callback, linkRef);
            } else if (resp.redirect) {
              return;
            } else {
              if (this.liveSocket.commitPendingLink(linkRef)) {
                this.href = href;
              }
              this.applyPendingUpdates();
              callback && callback(linkRef);
            }
          });
        },
        ({ error: _error, timeout: _timeout }) => fallback()
      );
    }
    getFormsForRecovery() {
      if (this.joinCount === 0) {
        return {};
      }
      const phxChange = this.binding("change");
      return dom_default.all(
        document,
        `#${CSS.escape(this.id)} form[${phxChange}], [${PHX_TELEPORTED_REF}="${CSS.escape(this.id)}"] form[${phxChange}]`
      ).filter((form) => form.id).filter((form) => form.elements.length > 0).filter(
        (form) => form.getAttribute(this.binding(PHX_AUTO_RECOVER)) !== "ignore"
      ).map((form) => {
        const clonedForm = form.cloneNode(true);
        morphdom_esm_default(clonedForm, form, {
          onBeforeElUpdated: (fromEl, toEl) => {
            dom_default.copyPrivates(fromEl, toEl);
            if (fromEl.getAttribute("form") === form.id) {
              fromEl.parentNode.removeChild(fromEl);
              return false;
            }
            return true;
          }
        });
        const externalElements = document.querySelectorAll(
          `[form="${CSS.escape(form.id)}"]`
        );
        Array.from(externalElements).forEach((el) => {
          const clonedEl = (
            /** @type {HTMLElement} */
            el.cloneNode(true)
          );
          morphdom_esm_default(clonedEl, el);
          dom_default.copyPrivates(clonedEl, el);
          clonedEl.removeAttribute("form");
          clonedForm.appendChild(clonedEl);
        });
        return clonedForm;
      }).reduce((acc, form) => {
        acc[form.id] = form;
        return acc;
      }, {});
    }
    maybePushComponentsDestroyed(destroyedCIDs) {
      let willDestroyCIDs = destroyedCIDs.filter((cid) => {
        return dom_default.findComponentNodeList(this.id, cid).length === 0;
      });
      const onError = (error) => {
        if (!this.isDestroyed()) {
          logError("Failed to push components destroyed", error);
        }
      };
      if (willDestroyCIDs.length > 0) {
        willDestroyCIDs.forEach((cid) => this.rendered.resetRender(cid));
        this.pushWithReply(null, "cids_will_destroy", { cids: willDestroyCIDs }).then(() => {
          this.liveSocket.requestDOMUpdate(() => {
            let completelyDestroyCIDs = willDestroyCIDs.filter((cid) => {
              return dom_default.findComponentNodeList(this.id, cid).length === 0;
            });
            if (completelyDestroyCIDs.length > 0) {
              this.pushWithReply(null, "cids_destroyed", {
                cids: completelyDestroyCIDs
              }).then(({ resp }) => {
                this.rendered.pruneCIDs(resp.cids);
              }).catch(onError);
            }
          });
        }).catch(onError);
      }
    }
    ownsElement(el) {
      let parentViewEl = dom_default.closestViewEl(el);
      return el.getAttribute(PHX_PARENT_ID) === this.id || parentViewEl && parentViewEl.id === this.id || !parentViewEl && this.isDead;
    }
    submitForm(form, targetCtx, phxEvent, submitter, opts = {}) {
      dom_default.putPrivate(form, PHX_HAS_SUBMITTED, true);
      const inputs = Array.from(form.elements);
      inputs.forEach((input) => dom_default.putPrivate(input, PHX_HAS_SUBMITTED, true));
      this.liveSocket.blurActiveElement(this);
      this.pushFormSubmit(form, targetCtx, phxEvent, submitter, opts, () => {
        this.liveSocket.restorePreviouslyActiveFocus();
      });
    }
    binding(kind) {
      return this.liveSocket.binding(kind);
    }
    // phx-portal
    pushPortalElementId(id) {
      this.portalElementIds.add(id);
    }
    dropPortalElementId(id) {
      this.portalElementIds.delete(id);
    }
    destroyPortalElements() {
      if (!this.liveSocket.unloaded) {
        this.portalElementIds.forEach((id) => {
          const el = document.getElementById(id);
          if (el) {
            el.remove();
          }
        });
      }
    }
  };
  var LiveSocket = class {
    constructor(url, phxSocket, opts = {}) {
      this.unloaded = false;
      if (!phxSocket || phxSocket.constructor.name === "Object") {
        throw new Error(`
      a phoenix Socket must be provided as the second argument to the LiveSocket constructor. For example:

          import {Socket} from "phoenix"
          import {LiveSocket} from "phoenix_live_view"
          let liveSocket = new LiveSocket("/live", Socket, {...})
      `);
      }
      this.socket = new phxSocket(url, opts);
      this.bindingPrefix = opts.bindingPrefix || BINDING_PREFIX;
      this.opts = opts;
      this.params = closure2(opts.params || {});
      this.viewLogger = opts.viewLogger;
      this.metadataCallbacks = opts.metadata || {};
      this.defaults = Object.assign(clone(DEFAULTS), opts.defaults || {});
      this.prevActive = null;
      this.silenced = false;
      this.main = null;
      this.outgoingMainEl = null;
      this.clickStartedAtTarget = null;
      this.linkRef = 1;
      this.roots = {};
      this.href = window.location.href;
      this.pendingLink = null;
      this.currentLocation = clone(window.location);
      this.hooks = opts.hooks || {};
      this.uploaders = opts.uploaders || {};
      this.loaderTimeout = opts.loaderTimeout || LOADER_TIMEOUT;
      this.disconnectedTimeout = opts.disconnectedTimeout || DISCONNECTED_TIMEOUT;
      this.reloadWithJitterTimer = null;
      this.maxReloads = opts.maxReloads || MAX_RELOADS;
      this.reloadJitterMin = opts.reloadJitterMin || RELOAD_JITTER_MIN;
      this.reloadJitterMax = opts.reloadJitterMax || RELOAD_JITTER_MAX;
      this.failsafeJitter = opts.failsafeJitter || FAILSAFE_JITTER;
      this.localStorage = opts.localStorage || window.localStorage;
      this.sessionStorage = opts.sessionStorage || window.sessionStorage;
      this.boundTopLevelEvents = false;
      this.boundEventNames = /* @__PURE__ */ new Set();
      this.blockPhxChangeWhileComposing = opts.blockPhxChangeWhileComposing || false;
      this.serverCloseRef = null;
      this.domCallbacks = Object.assign(
        {
          jsQuerySelectorAll: null,
          onPatchStart: closure2(),
          onPatchEnd: closure2(),
          onNodeAdded: closure2(),
          onBeforeElUpdated: closure2()
        },
        opts.dom || {}
      );
      this.transitions = new TransitionSet();
      this.currentHistoryPosition = parseInt(this.sessionStorage.getItem(PHX_LV_HISTORY_POSITION)) || 0;
      window.addEventListener("pagehide", (_e) => {
        this.unloaded = true;
      });
      this.socket.onOpen(() => {
        if (this.isUnloaded()) {
          window.location.reload();
        }
      });
    }
    // public
    version() {
      return "1.1.24";
    }
    isProfileEnabled() {
      return this.sessionStorage.getItem(PHX_LV_PROFILE) === "true";
    }
    isDebugEnabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "true";
    }
    isDebugDisabled() {
      return this.sessionStorage.getItem(PHX_LV_DEBUG) === "false";
    }
    enableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "true");
    }
    enableProfiling() {
      this.sessionStorage.setItem(PHX_LV_PROFILE, "true");
    }
    disableDebug() {
      this.sessionStorage.setItem(PHX_LV_DEBUG, "false");
    }
    disableProfiling() {
      this.sessionStorage.removeItem(PHX_LV_PROFILE);
    }
    enableLatencySim(upperBoundMs) {
      this.enableDebug();
      console.log(
        "latency simulator enabled for the duration of this browser session. Call disableLatencySim() to disable"
      );
      this.sessionStorage.setItem(PHX_LV_LATENCY_SIM, upperBoundMs);
    }
    disableLatencySim() {
      this.sessionStorage.removeItem(PHX_LV_LATENCY_SIM);
    }
    getLatencySim() {
      const str = this.sessionStorage.getItem(PHX_LV_LATENCY_SIM);
      return str ? parseInt(str) : null;
    }
    getSocket() {
      return this.socket;
    }
    connect() {
      if (window.location.hostname === "localhost" && !this.isDebugDisabled()) {
        this.enableDebug();
      }
      const doConnect = () => {
        this.resetReloadStatus();
        if (this.joinRootViews()) {
          this.bindTopLevelEvents();
          this.socket.connect();
        } else if (this.main) {
          this.socket.connect();
        } else {
          this.bindTopLevelEvents({ dead: true });
        }
        this.joinDeadView();
      };
      if (["complete", "loaded", "interactive"].indexOf(document.readyState) >= 0) {
        doConnect();
      } else {
        document.addEventListener("DOMContentLoaded", () => doConnect());
      }
    }
    disconnect(callback) {
      clearTimeout(this.reloadWithJitterTimer);
      if (this.serverCloseRef) {
        this.socket.off(this.serverCloseRef);
        this.serverCloseRef = null;
      }
      this.socket.disconnect(callback);
    }
    replaceTransport(transport) {
      clearTimeout(this.reloadWithJitterTimer);
      this.socket.replaceTransport(transport);
      this.connect();
    }
    /**
     * @param {HTMLElement} el
     * @param {string} encodedJS
     * @param {string | null} [eventType]
     */
    execJS(el, encodedJS, eventType = null) {
      const e7 = new CustomEvent("phx:exec", { detail: { sourceElement: el } });
      this.owner(el, (view) => js_default.exec(e7, eventType, encodedJS, view, el));
    }
    /**
     * Returns an object with methods to manipulate the DOM and execute JavaScript.
     * The applied changes integrate with server DOM patching.
     *
     * @returns {import("./js_commands").LiveSocketJSCommands}
     */
    js() {
      return js_commands_default(this, "js");
    }
    // private
    unload() {
      if (this.unloaded) {
        return;
      }
      if (this.main && this.isConnected()) {
        this.log(this.main, "socket", () => ["disconnect for page nav"]);
      }
      this.unloaded = true;
      this.destroyAllViews();
      this.disconnect();
    }
    triggerDOM(kind, args) {
      this.domCallbacks[kind](...args);
    }
    time(name, func) {
      if (!this.isProfileEnabled() || !console.time) {
        return func();
      }
      console.time(name);
      const result = func();
      console.timeEnd(name);
      return result;
    }
    log(view, kind, msgCallback) {
      if (this.viewLogger) {
        const [msg, obj] = msgCallback();
        this.viewLogger(view, kind, msg, obj);
      } else if (this.isDebugEnabled()) {
        const [msg, obj] = msgCallback();
        debug(view, kind, msg, obj);
      }
    }
    requestDOMUpdate(callback) {
      this.transitions.after(callback);
    }
    asyncTransition(promise) {
      this.transitions.addAsyncTransition(promise);
    }
    transition(time, onStart, onDone = function() {
    }) {
      this.transitions.addTransition(time, onStart, onDone);
    }
    onChannel(channel, event, cb) {
      channel.on(event, (data) => {
        const latency = this.getLatencySim();
        if (!latency) {
          cb(data);
        } else {
          setTimeout(() => cb(data), latency);
        }
      });
    }
    reloadWithJitter(view, log) {
      clearTimeout(this.reloadWithJitterTimer);
      this.disconnect();
      const minMs = this.reloadJitterMin;
      const maxMs = this.reloadJitterMax;
      let afterMs = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
      const tries = browser_default.updateLocal(
        this.localStorage,
        window.location.pathname,
        CONSECUTIVE_RELOADS,
        0,
        (count) => count + 1
      );
      if (tries >= this.maxReloads) {
        afterMs = this.failsafeJitter;
      }
      this.reloadWithJitterTimer = setTimeout(() => {
        if (view.isDestroyed() || view.isConnected()) {
          return;
        }
        view.destroy();
        log ? log() : this.log(view, "join", () => [
          `encountered ${tries} consecutive reloads`
        ]);
        if (tries >= this.maxReloads) {
          this.log(view, "join", () => [
            `exceeded ${this.maxReloads} consecutive reloads. Entering failsafe mode`
          ]);
        }
        if (this.hasPendingLink()) {
          window.location = this.pendingLink;
        } else {
          window.location.reload();
        }
      }, afterMs);
    }
    getHookDefinition(name) {
      if (!name) {
        return;
      }
      return this.maybeInternalHook(name) || this.hooks[name] || this.maybeRuntimeHook(name);
    }
    maybeInternalHook(name) {
      return name && name.startsWith("Phoenix.") && hooks_default[name.split(".")[1]];
    }
    maybeRuntimeHook(name) {
      const runtimeHook = document.querySelector(
        `script[${PHX_RUNTIME_HOOK}="${CSS.escape(name)}"]`
      );
      if (!runtimeHook) {
        return;
      }
      let callbacks = window[`phx_hook_${name}`];
      if (!callbacks || typeof callbacks !== "function") {
        logError("a runtime hook must be a function", runtimeHook);
        return;
      }
      const hookDefiniton = callbacks();
      if (hookDefiniton && (typeof hookDefiniton === "object" || typeof hookDefiniton === "function")) {
        return hookDefiniton;
      }
      logError(
        "runtime hook must return an object with hook callbacks or an instance of ViewHook",
        runtimeHook
      );
    }
    isUnloaded() {
      return this.unloaded;
    }
    isConnected() {
      return this.socket.isConnected();
    }
    getBindingPrefix() {
      return this.bindingPrefix;
    }
    binding(kind) {
      return `${this.getBindingPrefix()}${kind}`;
    }
    channel(topic, params) {
      return this.socket.channel(topic, params);
    }
    joinDeadView() {
      const body = document.body;
      if (body && !this.isPhxView(body) && !this.isPhxView(document.firstElementChild)) {
        const view = this.newRootView(body);
        view.setHref(this.getHref());
        view.joinDead();
        if (!this.main) {
          this.main = view;
        }
        window.requestAnimationFrame(() => {
          view.execNewMounted();
          this.maybeScroll(history.state?.scroll);
        });
      }
    }
    joinRootViews() {
      let rootsFound = false;
      dom_default.all(
        document,
        `${PHX_VIEW_SELECTOR}:not([${PHX_PARENT_ID}])`,
        (rootEl) => {
          if (!this.getRootById(rootEl.id)) {
            const view = this.newRootView(rootEl);
            if (!dom_default.isPhxSticky(rootEl)) {
              view.setHref(this.getHref());
            }
            view.join();
            if (rootEl.hasAttribute(PHX_MAIN)) {
              this.main = view;
            }
          }
          rootsFound = true;
        }
      );
      return rootsFound;
    }
    redirect(to, flash, reloadToken) {
      if (reloadToken) {
        browser_default.setCookie(PHX_RELOAD_STATUS, reloadToken, 60);
      }
      this.unload();
      browser_default.redirect(to, flash);
    }
    replaceMain(href, flash, callback = null, linkRef = this.setPendingLink(href)) {
      const liveReferer = this.currentLocation.href;
      this.outgoingMainEl = this.outgoingMainEl || this.main.el;
      const stickies = dom_default.findPhxSticky(document) || [];
      const removeEls = dom_default.all(
        this.outgoingMainEl,
        `[${this.binding("remove")}]`
      ).filter((el) => !dom_default.isChildOfAny(el, stickies));
      const newMainEl = dom_default.cloneNode(this.outgoingMainEl, "");
      this.main.showLoader(this.loaderTimeout);
      this.main.destroy();
      this.main = this.newRootView(newMainEl, flash, liveReferer);
      this.main.setRedirect(href);
      this.transitionRemoves(removeEls);
      this.main.join((joinCount, onDone) => {
        if (joinCount === 1 && this.commitPendingLink(linkRef)) {
          this.requestDOMUpdate(() => {
            removeEls.forEach((el) => el.remove());
            stickies.forEach((el) => newMainEl.appendChild(el));
            this.outgoingMainEl.replaceWith(newMainEl);
            this.outgoingMainEl = null;
            callback && callback(linkRef);
            onDone();
          });
        }
      });
    }
    transitionRemoves(elements, callback) {
      const removeAttr = this.binding("remove");
      const silenceEvents = (e7) => {
        e7.preventDefault();
        e7.stopImmediatePropagation();
      };
      elements.forEach((el) => {
        for (const event of this.boundEventNames) {
          el.addEventListener(event, silenceEvents, true);
        }
        this.execJS(el, el.getAttribute(removeAttr), "remove");
      });
      this.requestDOMUpdate(() => {
        elements.forEach((el) => {
          for (const event of this.boundEventNames) {
            el.removeEventListener(event, silenceEvents, true);
          }
        });
        callback && callback();
      });
    }
    isPhxView(el) {
      return el.getAttribute && el.getAttribute(PHX_SESSION) !== null;
    }
    newRootView(el, flash, liveReferer) {
      const view = new View(el, this, null, flash, liveReferer);
      this.roots[view.id] = view;
      return view;
    }
    owner(childEl, callback) {
      let view;
      const viewEl = dom_default.closestViewEl(childEl);
      if (viewEl) {
        view = this.getViewByEl(viewEl);
      } else {
        if (!childEl.isConnected) {
          return null;
        }
        view = this.main;
      }
      return view && callback ? callback(view) : view;
    }
    withinOwners(childEl, callback) {
      this.owner(childEl, (view) => callback(view, childEl));
    }
    getViewByEl(el) {
      const rootId = el.getAttribute(PHX_ROOT_ID);
      return maybe(
        this.getRootById(rootId),
        (root) => root.getDescendentByEl(el)
      );
    }
    getRootById(id) {
      return this.roots[id];
    }
    destroyAllViews() {
      for (const id in this.roots) {
        this.roots[id].destroy();
        delete this.roots[id];
      }
      this.main = null;
    }
    destroyViewByEl(el) {
      const root = this.getRootById(el.getAttribute(PHX_ROOT_ID));
      if (root && root.id === el.id) {
        root.destroy();
        delete this.roots[root.id];
      } else if (root) {
        root.destroyDescendent(el.id);
      }
    }
    getActiveElement() {
      return document.activeElement;
    }
    dropActiveElement(view) {
      if (this.prevActive && view.ownsElement(this.prevActive)) {
        this.prevActive = null;
      }
    }
    restorePreviouslyActiveFocus() {
      if (this.prevActive && this.prevActive !== document.body && this.prevActive instanceof HTMLElement) {
        this.prevActive.focus();
      }
    }
    blurActiveElement() {
      this.prevActive = this.getActiveElement();
      if (this.prevActive !== document.body && this.prevActive instanceof HTMLElement) {
        this.prevActive.blur();
      }
    }
    /**
     * @param {{dead?: boolean}} [options={}]
     */
    bindTopLevelEvents({ dead } = {}) {
      if (this.boundTopLevelEvents) {
        return;
      }
      this.boundTopLevelEvents = true;
      this.serverCloseRef = this.socket.onClose((event) => {
        if (event && event.code === 1e3 && this.main) {
          return this.reloadWithJitter(this.main);
        }
      });
      document.body.addEventListener("click", function() {
      });
      window.addEventListener(
        "pageshow",
        (e7) => {
          if (e7.persisted) {
            this.getSocket().disconnect();
            this.withPageLoading({ to: window.location.href, kind: "redirect" });
            window.location.reload();
          }
        },
        true
      );
      if (!dead) {
        this.bindNav();
      }
      this.bindClicks();
      if (!dead) {
        this.bindForms();
      }
      this.bind(
        { keyup: "keyup", keydown: "keydown" },
        (e7, type, view, targetEl, phxEvent, _phxTarget) => {
          const matchKey = targetEl.getAttribute(this.binding(PHX_KEY));
          const pressedKey = e7.key && e7.key.toLowerCase();
          if (matchKey && matchKey.toLowerCase() !== pressedKey) {
            return;
          }
          const data = { key: e7.key, ...this.eventMeta(type, e7, targetEl) };
          js_default.exec(e7, type, phxEvent, view, targetEl, ["push", { data }]);
        }
      );
      this.bind(
        { blur: "focusout", focus: "focusin" },
        (e7, type, view, targetEl, phxEvent, phxTarget) => {
          if (!phxTarget) {
            const data = { key: e7.key, ...this.eventMeta(type, e7, targetEl) };
            js_default.exec(e7, type, phxEvent, view, targetEl, ["push", { data }]);
          }
        }
      );
      this.bind(
        { blur: "blur", focus: "focus" },
        (e7, type, view, targetEl, phxEvent, phxTarget) => {
          if (phxTarget === "window") {
            const data = this.eventMeta(type, e7, targetEl);
            js_default.exec(e7, type, phxEvent, view, targetEl, ["push", { data }]);
          }
        }
      );
      this.on("dragover", (e7) => e7.preventDefault());
      this.on("dragenter", (e7) => {
        const dropzone = closestPhxBinding(
          e7.target,
          this.binding(PHX_DROP_TARGET)
        );
        if (!dropzone || !(dropzone instanceof HTMLElement)) {
          return;
        }
        if (eventContainsFiles(e7)) {
          this.js().addClass(dropzone, PHX_DROP_TARGET_ACTIVE_CLASS);
        }
      });
      this.on("dragleave", (e7) => {
        const dropzone = closestPhxBinding(
          e7.target,
          this.binding(PHX_DROP_TARGET)
        );
        if (!dropzone || !(dropzone instanceof HTMLElement)) {
          return;
        }
        const rect = dropzone.getBoundingClientRect();
        if (e7.clientX <= rect.left || e7.clientX >= rect.right || e7.clientY <= rect.top || e7.clientY >= rect.bottom) {
          this.js().removeClass(dropzone, PHX_DROP_TARGET_ACTIVE_CLASS);
        }
      });
      this.on("drop", (e7) => {
        e7.preventDefault();
        const dropzone = closestPhxBinding(
          e7.target,
          this.binding(PHX_DROP_TARGET)
        );
        if (!dropzone || !(dropzone instanceof HTMLElement)) {
          return;
        }
        this.js().removeClass(dropzone, PHX_DROP_TARGET_ACTIVE_CLASS);
        const dropTargetId = dropzone.getAttribute(this.binding(PHX_DROP_TARGET));
        const dropTarget = dropTargetId && document.getElementById(dropTargetId);
        const files = Array.from(e7.dataTransfer.files || []);
        if (!dropTarget || !(dropTarget instanceof HTMLInputElement) || dropTarget.disabled || files.length === 0 || !(dropTarget.files instanceof FileList)) {
          return;
        }
        LiveUploader.trackFiles(dropTarget, files, e7.dataTransfer);
        dropTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
      this.on(PHX_TRACK_UPLOADS, (e7) => {
        const uploadTarget = e7.target;
        if (!dom_default.isUploadInput(uploadTarget)) {
          return;
        }
        const files = Array.from(e7.detail.files || []).filter(
          (f3) => f3 instanceof File || f3 instanceof Blob
        );
        LiveUploader.trackFiles(uploadTarget, files);
        uploadTarget.dispatchEvent(new Event("input", { bubbles: true }));
      });
    }
    eventMeta(eventName, e7, targetEl) {
      const callback = this.metadataCallbacks[eventName];
      return callback ? callback(e7, targetEl) : {};
    }
    setPendingLink(href) {
      this.linkRef++;
      this.pendingLink = href;
      this.resetReloadStatus();
      return this.linkRef;
    }
    // anytime we are navigating or connecting, drop reload cookie in case
    // we issue the cookie but the next request was interrupted and the server never dropped it
    resetReloadStatus() {
      browser_default.deleteCookie(PHX_RELOAD_STATUS);
    }
    commitPendingLink(linkRef) {
      if (this.linkRef !== linkRef) {
        return false;
      } else {
        this.href = this.pendingLink;
        this.pendingLink = null;
        return true;
      }
    }
    getHref() {
      return this.href;
    }
    hasPendingLink() {
      return !!this.pendingLink;
    }
    bind(events, callback) {
      for (const event in events) {
        const browserEventName = events[event];
        this.on(browserEventName, (e7) => {
          const binding = this.binding(event);
          const windowBinding = this.binding(`window-${event}`);
          const targetPhxEvent = e7.target.getAttribute && e7.target.getAttribute(binding);
          if (targetPhxEvent) {
            this.debounce(e7.target, e7, browserEventName, () => {
              this.withinOwners(e7.target, (view) => {
                callback(e7, event, view, e7.target, targetPhxEvent, null);
              });
            });
          } else {
            dom_default.all(document, `[${windowBinding}]`, (el) => {
              const phxEvent = el.getAttribute(windowBinding);
              this.debounce(el, e7, browserEventName, () => {
                this.withinOwners(el, (view) => {
                  callback(e7, event, view, el, phxEvent, "window");
                });
              });
            });
          }
        });
      }
    }
    bindClicks() {
      this.on("mousedown", (e7) => this.clickStartedAtTarget = e7.target);
      this.bindClick("click", "click");
    }
    bindClick(eventName, bindingName) {
      const click = this.binding(bindingName);
      window.addEventListener(
        eventName,
        (e7) => {
          let target = null;
          if (e7.detail === 0)
            this.clickStartedAtTarget = e7.target;
          const clickStartedAtTarget = this.clickStartedAtTarget || e7.target;
          target = closestPhxBinding(e7.target, click);
          this.dispatchClickAway(e7, clickStartedAtTarget);
          this.clickStartedAtTarget = null;
          const phxEvent = target && target.getAttribute(click);
          if (!phxEvent) {
            if (dom_default.isNewPageClick(e7, window.location)) {
              this.unload();
            }
            return;
          }
          if (target.getAttribute("href") === "#") {
            e7.preventDefault();
          }
          if (target.hasAttribute(PHX_REF_SRC)) {
            return;
          }
          this.debounce(target, e7, "click", () => {
            this.withinOwners(target, (view) => {
              js_default.exec(e7, "click", phxEvent, view, target, [
                "push",
                { data: this.eventMeta("click", e7, target) }
              ]);
            });
          });
        },
        false
      );
    }
    dispatchClickAway(e7, clickStartedAt) {
      const phxClickAway = this.binding("click-away");
      dom_default.all(document, `[${phxClickAway}]`, (el) => {
        if (!(el.isSameNode(clickStartedAt) || el.contains(clickStartedAt) || // When clicking a link with custom method,
        // phoenix_html triggers a click on a submit button
        // of a hidden form appended to the body. For such cases
        // where the clicked target is hidden, we skip click-away.
        !js_default.isVisible(clickStartedAt))) {
          this.withinOwners(el, (view) => {
            const phxEvent = el.getAttribute(phxClickAway);
            if (js_default.isVisible(el) && js_default.isInViewport(el)) {
              js_default.exec(e7, "click", phxEvent, view, el, [
                "push",
                { data: this.eventMeta("click", e7, e7.target) }
              ]);
            }
          });
        }
      });
    }
    bindNav() {
      if (!browser_default.canPushState()) {
        return;
      }
      if (history.scrollRestoration) {
        history.scrollRestoration = "manual";
      }
      let scrollTimer = null;
      window.addEventListener("scroll", (_e) => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          browser_default.updateCurrentState(
            (state) => Object.assign(state, { scroll: window.scrollY })
          );
        }, 100);
      });
      window.addEventListener(
        "popstate",
        (event) => {
          if (!this.registerNewLocation(window.location)) {
            return;
          }
          const { type, backType, id, scroll, position } = event.state || {};
          const href = window.location.href;
          const isForward = position > this.currentHistoryPosition;
          const navType = isForward ? type : backType || type;
          this.currentHistoryPosition = position || 0;
          this.sessionStorage.setItem(
            PHX_LV_HISTORY_POSITION,
            this.currentHistoryPosition.toString()
          );
          dom_default.dispatchEvent(window, "phx:navigate", {
            detail: {
              href,
              patch: navType === "patch",
              pop: true,
              direction: isForward ? "forward" : "backward"
            }
          });
          this.requestDOMUpdate(() => {
            const callback = () => {
              this.maybeScroll(scroll);
            };
            if (this.main.isConnected() && navType === "patch" && id === this.main.id) {
              this.main.pushLinkPatch(event, href, null, callback);
            } else {
              this.replaceMain(href, null, callback);
            }
          });
        },
        false
      );
      window.addEventListener(
        "click",
        (e7) => {
          const target = closestPhxBinding(e7.target, PHX_LIVE_LINK);
          const type = target && target.getAttribute(PHX_LIVE_LINK);
          if (!type || !this.isConnected() || !this.main || dom_default.wantsNewTab(e7)) {
            return;
          }
          const href = target.href instanceof SVGAnimatedString ? target.href.baseVal : target.href;
          const linkState = target.getAttribute(PHX_LINK_STATE);
          e7.preventDefault();
          e7.stopImmediatePropagation();
          if (this.pendingLink === href) {
            return;
          }
          this.requestDOMUpdate(() => {
            if (type === "patch") {
              this.pushHistoryPatch(e7, href, linkState, target);
            } else if (type === "redirect") {
              this.historyRedirect(e7, href, linkState, null, target);
            } else {
              throw new Error(
                `expected ${PHX_LIVE_LINK} to be "patch" or "redirect", got: ${type}`
              );
            }
            const phxClick = target.getAttribute(this.binding("click"));
            if (phxClick) {
              this.requestDOMUpdate(() => this.execJS(target, phxClick, "click"));
            }
          });
        },
        false
      );
    }
    maybeScroll(scroll) {
      if (typeof scroll === "number") {
        requestAnimationFrame(() => {
          window.scrollTo(0, scroll);
        });
      }
    }
    dispatchEvent(event, payload = {}) {
      dom_default.dispatchEvent(window, `phx:${event}`, { detail: payload });
    }
    dispatchEvents(events) {
      events.forEach(([event, payload]) => this.dispatchEvent(event, payload));
    }
    withPageLoading(info, callback) {
      dom_default.dispatchEvent(window, "phx:page-loading-start", { detail: info });
      const done = () => dom_default.dispatchEvent(window, "phx:page-loading-stop", { detail: info });
      return callback ? callback(done) : done;
    }
    pushHistoryPatch(e7, href, linkState, targetEl) {
      if (!this.isConnected() || !this.main.isMain()) {
        return browser_default.redirect(href);
      }
      this.withPageLoading({ to: href, kind: "patch" }, (done) => {
        this.main.pushLinkPatch(e7, href, targetEl, (linkRef) => {
          this.historyPatch(href, linkState, linkRef);
          done();
        });
      });
    }
    historyPatch(href, linkState, linkRef = this.setPendingLink(href)) {
      if (!this.commitPendingLink(linkRef)) {
        return;
      }
      this.currentHistoryPosition++;
      this.sessionStorage.setItem(
        PHX_LV_HISTORY_POSITION,
        this.currentHistoryPosition.toString()
      );
      browser_default.updateCurrentState((state) => ({ ...state, backType: "patch" }));
      browser_default.pushState(
        linkState,
        {
          type: "patch",
          id: this.main.id,
          position: this.currentHistoryPosition
        },
        href
      );
      dom_default.dispatchEvent(window, "phx:navigate", {
        detail: { patch: true, href, pop: false, direction: "forward" }
      });
      this.registerNewLocation(window.location);
    }
    historyRedirect(e7, href, linkState, flash, targetEl) {
      const clickLoading = targetEl && e7.isTrusted && e7.type !== "popstate";
      if (clickLoading) {
        targetEl.classList.add("phx-click-loading");
      }
      if (!this.isConnected() || !this.main.isMain()) {
        return browser_default.redirect(href, flash);
      }
      if (/^\/$|^\/[^\/]+.*$/.test(href)) {
        const { protocol, host } = window.location;
        href = `${protocol}//${host}${href}`;
      }
      const scroll = window.scrollY;
      this.withPageLoading({ to: href, kind: "redirect" }, (done) => {
        this.replaceMain(href, flash, (linkRef) => {
          if (linkRef === this.linkRef) {
            this.currentHistoryPosition++;
            this.sessionStorage.setItem(
              PHX_LV_HISTORY_POSITION,
              this.currentHistoryPosition.toString()
            );
            browser_default.updateCurrentState((state) => ({
              ...state,
              backType: "redirect"
            }));
            browser_default.pushState(
              linkState,
              {
                type: "redirect",
                id: this.main.id,
                scroll,
                position: this.currentHistoryPosition
              },
              href
            );
            dom_default.dispatchEvent(window, "phx:navigate", {
              detail: { href, patch: false, pop: false, direction: "forward" }
            });
            this.registerNewLocation(window.location);
          }
          if (clickLoading) {
            targetEl.classList.remove("phx-click-loading");
          }
          done();
        });
      });
    }
    registerNewLocation(newLocation) {
      const { pathname, search } = this.currentLocation;
      if (pathname + search === newLocation.pathname + newLocation.search) {
        return false;
      } else {
        this.currentLocation = clone(newLocation);
        return true;
      }
    }
    bindForms() {
      let iterations = 0;
      let externalFormSubmitted = false;
      this.on("submit", (e7) => {
        const phxSubmit = e7.target.getAttribute(this.binding("submit"));
        const phxChange = e7.target.getAttribute(this.binding("change"));
        if (!externalFormSubmitted && phxChange && !phxSubmit) {
          externalFormSubmitted = true;
          e7.preventDefault();
          this.withinOwners(e7.target, (view) => {
            view.disableForm(e7.target);
            window.requestAnimationFrame(() => {
              if (dom_default.isUnloadableFormSubmit(e7)) {
                this.unload();
              }
              e7.target.submit();
            });
          });
        }
      });
      this.on("submit", (e7) => {
        const phxEvent = e7.target.getAttribute(this.binding("submit"));
        if (!phxEvent) {
          if (dom_default.isUnloadableFormSubmit(e7)) {
            this.unload();
          }
          return;
        }
        e7.preventDefault();
        e7.target.disabled = true;
        this.withinOwners(e7.target, (view) => {
          js_default.exec(e7, "submit", phxEvent, view, e7.target, [
            "push",
            { submitter: e7.submitter }
          ]);
        });
      });
      for (const type of ["change", "input"]) {
        this.on(type, (e7) => {
          if (e7 instanceof CustomEvent && (e7.target instanceof HTMLInputElement || e7.target instanceof HTMLSelectElement || e7.target instanceof HTMLTextAreaElement) && e7.target.form === void 0) {
            if (e7.detail && e7.detail.dispatcher) {
              throw new Error(
                `dispatching a custom ${type} event is only supported on input elements inside a form`
              );
            }
            return;
          }
          const phxChange = this.binding("change");
          const input = e7.target;
          if (this.blockPhxChangeWhileComposing && e7.isComposing) {
            const key = `composition-listener-${type}`;
            if (!dom_default.private(input, key)) {
              dom_default.putPrivate(input, key, true);
              input.addEventListener(
                "compositionend",
                () => {
                  input.dispatchEvent(new Event(type, { bubbles: true }));
                  dom_default.deletePrivate(input, key);
                },
                { once: true }
              );
            }
            return;
          }
          const inputEvent = input.getAttribute(phxChange);
          const formEvent = input.form && input.form.getAttribute(phxChange);
          const phxEvent = inputEvent || formEvent;
          if (!phxEvent) {
            return;
          }
          if (input.type === "number" && input.validity && input.validity.badInput) {
            return;
          }
          const dispatcher = inputEvent ? input : input.form;
          const currentIterations = iterations;
          iterations++;
          const { at, type: lastType } = dom_default.private(input, "prev-iteration") || {};
          if (at === currentIterations - 1 && type === "change" && lastType === "input") {
            return;
          }
          dom_default.putPrivate(input, "prev-iteration", {
            at: currentIterations,
            type
          });
          this.debounce(input, e7, type, () => {
            this.withinOwners(dispatcher, (view) => {
              dom_default.putPrivate(input, PHX_HAS_FOCUSED, true);
              js_default.exec(e7, "change", phxEvent, view, input, [
                "push",
                { _target: e7.target.name, dispatcher }
              ]);
            });
          });
        });
      }
      this.on("reset", (e7) => {
        const form = e7.target;
        dom_default.resetForm(form);
        const input = Array.from(form.elements).find((el) => el.type === "reset");
        if (input) {
          window.requestAnimationFrame(() => {
            input.dispatchEvent(
              new Event("input", { bubbles: true, cancelable: false })
            );
          });
        }
      });
    }
    debounce(el, event, eventType, callback) {
      if (eventType === "blur" || eventType === "focusout") {
        return callback();
      }
      const phxDebounce = this.binding(PHX_DEBOUNCE);
      const phxThrottle = this.binding(PHX_THROTTLE);
      const defaultDebounce = this.defaults.debounce.toString();
      const defaultThrottle = this.defaults.throttle.toString();
      this.withinOwners(el, (view) => {
        const asyncFilter = () => !view.isDestroyed() && document.body.contains(el);
        dom_default.debounce(
          el,
          event,
          phxDebounce,
          defaultDebounce,
          phxThrottle,
          defaultThrottle,
          asyncFilter,
          () => {
            callback();
          }
        );
      });
    }
    silenceEvents(callback) {
      this.silenced = true;
      callback();
      this.silenced = false;
    }
    on(event, callback) {
      this.boundEventNames.add(event);
      window.addEventListener(event, (e7) => {
        if (!this.silenced) {
          callback(e7);
        }
      });
    }
    jsQuerySelectorAll(sourceEl, query, defaultQuery) {
      const all = this.domCallbacks.jsQuerySelectorAll;
      return all ? all(sourceEl, query, defaultQuery) : defaultQuery();
    }
  };
  var TransitionSet = class {
    constructor() {
      this.transitions = /* @__PURE__ */ new Set();
      this.promises = /* @__PURE__ */ new Set();
      this.pendingOps = [];
    }
    reset() {
      this.transitions.forEach((timer) => {
        clearTimeout(timer);
        this.transitions.delete(timer);
      });
      this.promises.clear();
      this.flushPendingOps();
    }
    after(callback) {
      if (this.size() === 0) {
        callback();
      } else {
        this.pushPendingOp(callback);
      }
    }
    addTransition(time, onStart, onDone) {
      onStart();
      const timer = setTimeout(() => {
        this.transitions.delete(timer);
        onDone();
        this.flushPendingOps();
      }, time);
      this.transitions.add(timer);
    }
    addAsyncTransition(promise) {
      this.promises.add(promise);
      promise.then(() => {
        this.promises.delete(promise);
        this.flushPendingOps();
      });
    }
    pushPendingOp(op) {
      this.pendingOps.push(op);
    }
    size() {
      return this.transitions.size + this.promises.size;
    }
    flushPendingOps() {
      if (this.size() > 0) {
        return;
      }
      const op = this.pendingOps.shift();
      if (op) {
        op();
        this.flushPendingOps();
      }
    }
  };
  var LiveSocket2 = LiveSocket;

  // js/app.js
  var import_topbar = __toESM(require_topbar());

  // js/code_editor.js
  var CodeEditorHook = {
    mounted() {
      const container = this.el;
      const elixirTextarea = container.querySelector("#code_elixir_textarea");
      const pythonTextarea = container.querySelector("#code_python_textarea");
      if (!elixirTextarea && !pythonTextarea) return;
      const editorContainer = document.createElement("div");
      editorContainer.style.height = "100%";
      editorContainer.style.width = "100%";
      editorContainer.style.minHeight = "400px";
      container.appendChild(editorContainer);
      const currentVariables = JSON.parse(container.dataset.variables || "[]");
      window.__fusionFlowCurrentVariables = currentVariables;
      const initMonaco = () => {
        if (window.require) {
          window.require.config({ paths: { "vs": "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs" } });
          window.require(["vs/editor/editor.main"], () => {
            if (!window.__elixirCompletionRegistered) {
              try {
                monaco.languages.registerCompletionItemProvider("elixir", {
                  provideCompletionItems: (model, position) => {
                    const suggestions = [
                      {
                        label: "variable",
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: "variable",
                        documentation: "Get a variable from context (returns nil if missing)",
                        detail: "FusionFlowRuntime.Runtime.Elixir.variable/1"
                      },
                      {
                        label: "variable!",
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: "variable!",
                        documentation: "Get a variable from context (raises if missing)",
                        detail: "FusionFlowRuntime.Runtime.Elixir.variable!/1"
                      },
                      {
                        label: "set_result",
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: "set_result",
                        documentation: "Set the value passed to the next node (overrides last expression)",
                        detail: "FusionFlowRuntime.Runtime.Elixir.set_result/1"
                      }
                    ];
                    const availableVars = window.__fusionFlowCurrentVariables || [];
                    availableVars.forEach((varName) => {
                      suggestions.push({
                        label: `:${varName}`,
                        kind: monaco.languages.CompletionItemKind.Constant,
                        insertText: `:${varName}`,
                        documentation: `Variable from flow: ${varName}`,
                        detail: "Atom"
                      });
                    });
                    return { suggestions };
                  }
                });
                window.__elixirCompletionRegistered = true;
              } catch (e7) {
                console.error("Failed to register Elixir completion provider:", e7);
              }
            }
            if (!window.__pythonCompletionRegistered) {
              try {
                monaco.languages.registerCompletionItemProvider("python", {
                  provideCompletionItems: (model, position) => {
                    const suggestions = [
                      {
                        label: "variable",
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: "variable",
                        documentation: "Get a variable from context (returns None if missing)",
                        detail: "FusionFlowRuntime.Runtime.Python.variable(name, default=None)"
                      },
                      {
                        label: "variable_required",
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: "variable_required",
                        documentation: "Get a variable from context (raises KeyError if missing)",
                        detail: "FusionFlowRuntime.Runtime.Python.variable_required(name)"
                      },
                      {
                        label: "set_result",
                        kind: monaco.languages.CompletionItemKind.Function,
                        insertText: "set_result",
                        documentation: "Set the value passed to the next node (overrides last expression)",
                        detail: "FusionFlowRuntime.Runtime.Python.set_result(value)"
                      }
                    ];
                    const availableVars = window.__fusionFlowCurrentVariables || [];
                    availableVars.forEach((varName) => {
                      suggestions.push({
                        label: varName,
                        kind: monaco.languages.CompletionItemKind.Variable,
                        insertText: varName,
                        documentation: `Variable from flow: ${varName}`,
                        detail: "Flow variable"
                      });
                    });
                    return { suggestions };
                  }
                });
                window.__pythonCompletionRegistered = true;
              } catch (e7) {
                console.error("Failed to register Python completion provider:", e7);
              }
            }
            const currentLang = container.dataset.language || "elixir";
            const initialValue = currentLang === "python" ? pythonTextarea ? pythonTextarea.value : "" : elixirTextarea ? elixirTextarea.value : "";
            this.editor = monaco.editor.create(editorContainer, {
              value: initialValue,
              language: currentLang,
              theme: "vs-dark",
              automaticLayout: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              fontFamily: "'Fira Code', Consolas, 'Courier New', monospace"
            });
            this.currentLanguage = currentLang;
            this.editor.onDidChangeModelContent(() => {
              const value = this.editor.getValue();
              if (this.currentLanguage === "python" && pythonTextarea) {
                pythonTextarea.value = value;
                pythonTextarea.dispatchEvent(new Event("input", { bubbles: true }));
              } else if (elixirTextarea) {
                elixirTextarea.value = value;
                elixirTextarea.dispatchEvent(new Event("input", { bubbles: true }));
              }
            });
            this.observer = new MutationObserver((mutations) => {
              mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && mutation.attributeName === "data-language") {
                  const newLang = container.dataset.language;
                  if (newLang !== this.currentLanguage) {
                    const currentValue = this.editor.getValue();
                    if (this.currentLanguage === "python" && pythonTextarea) {
                      pythonTextarea.value = currentValue;
                    } else if (elixirTextarea) {
                      elixirTextarea.value = currentValue;
                    }
                    const newValue = newLang === "python" ? pythonTextarea ? pythonTextarea.value : "" : elixirTextarea ? elixirTextarea.value : "";
                    this.editor.setValue(newValue);
                    monaco.editor.setModelLanguage(this.editor.getModel(), newLang);
                    this.currentLanguage = newLang;
                  }
                }
              });
            });
            this.observer.observe(container, { attributes: true });
          });
        }
      };
      if (!window.require) {
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/loader.js";
        script.async = true;
        script.onload = initMonaco;
        document.body.appendChild(script);
      } else {
        initMonaco();
      }
    },
    updated() {
      const container = this.el;
      const newLang = container.dataset.language;
      if (this.editor && newLang && newLang !== this.currentLanguage) {
        const elixirTextarea = container.querySelector("#code_elixir_textarea");
        const pythonTextarea = container.querySelector("#code_python_textarea");
        const currentValue = this.editor.getValue();
        if (this.currentLanguage === "python" && pythonTextarea) {
          pythonTextarea.value = currentValue;
        } else if (elixirTextarea) {
          elixirTextarea.value = currentValue;
        }
        const newValue = newLang === "python" ? pythonTextarea ? pythonTextarea.value : "" : elixirTextarea ? elixirTextarea.value : "";
        this.editor.setValue(newValue);
        monaco.editor.setModelLanguage(this.editor.getModel(), newLang);
        this.currentLanguage = newLang;
      }
    },
    destroyed() {
      if (this.observer) {
        this.observer.disconnect();
      }
      if (this.editor) {
        this.editor.dispose();
      }
    }
  };

  // js/app.js
  var hooks = {
    CodeEditor: CodeEditorHook,
    NodeSearch: {
      mounted() {
        this.el.addEventListener("input", (e7) => {
          this.pushEvent("filter_nodes", { value: e7.target.value });
        });
      }
    },
    Rete: {
      async mounted() {
        const { createEditor: createEditor2 } = await Promise.resolve().then(() => (init_rete_editor(), rete_editor_exports));
        const container = this.el;
        const editor = await createEditor2(container);
        this.handleEvent("add_node", async ({ name, definition, data }) => {
          if (editor.addNode) {
            await editor.addNode(name, definition, data);
          }
        });
        this.handleEvent("request_graph_data", async () => {
          if (editor.exportData) {
            const data = await editor.exportData();
            this.pushEvent("save_graph_data", { data });
          }
        });
        if (editor.onDrop) {
          editor.onDrop(async (name, position) => {
            this.pushEvent("get_node_definition", { name }, async ({ definition }) => {
              const node_data = {
                id: `node_${Date.now()}_${Math.floor(Math.random() * 1e3)}`,
                label: name,
                position
              };
              await editor.addNode(name, definition, node_data);
              this.pushEvent("node_added_internally", { name, data: node_data });
            });
          });
        }
        const handleDragStart = (e7) => {
          const btn = e7.target.closest('button[draggable="true"]');
          if (!btn) return;
          const nodeName = btn.dataset.nodeName;
          if (nodeName) {
            e7.dataTransfer.setData("application/vnd.fusionflow.node", nodeName);
            e7.dataTransfer.effectAllowed = "copy";
            const dragImage = document.createElement("div");
            const isDark = document.documentElement.classList.contains("dark");
            dragImage.style.width = "88px";
            dragImage.style.height = "88px";
            dragImage.style.backgroundColor = isDark ? "#18181b" : "white";
            dragImage.style.border = `3px solid ${isDark ? "#27272a" : "#e2e8f0"}`;
            dragImage.style.borderRadius = "50%";
            dragImage.style.boxShadow = isDark ? "0 4px 6px -1px rgba(0, 0, 0, 0.3)" : "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
            dragImage.style.position = "absolute";
            dragImage.style.top = "-1000px";
            dragImage.style.display = "flex";
            dragImage.style.alignItems = "center";
            dragImage.style.justifyContent = "center";
            const icon = document.createElement("div");
            icon.style.width = "40px";
            icon.style.height = "40px";
            icon.style.backgroundColor = "#6366f1";
            icon.style.maskImage = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-10.5v10.5" /></svg>')`;
            icon.style.maskRepeat = "no-repeat";
            icon.style.maskSize = "contain";
            dragImage.appendChild(icon);
            document.body.appendChild(dragImage);
            e7.dataTransfer.setDragImage(dragImage, 44, 44);
            setTimeout(() => {
              document.body.removeChild(dragImage);
            }, 0);
          }
        };
        document.addEventListener("dragstart", handleDragStart);
        this.handleEvent("request_save_and_run", async () => {
          if (editor.exportData) {
            const data = await editor.exportData();
            this.pushEvent("save_and_run", { data });
          }
        });
        this.handleEvent("load_graph_data", async ({ nodes, connections, definitions }) => {
          if (editor.importData) {
            await editor.importData({ nodes, connections, definitions });
          } else {
            console.error("Editor importData method missing!");
          }
        });
        this.handleEvent("update_node_code", ({ nodeId, code_elixir, code_python, fieldName }) => {
          if (editor.updateNodeCode) {
            editor.updateNodeCode(nodeId, code_elixir, code_python, fieldName);
          }
        });
        this.handleEvent("update_node_data", ({ nodeId, data }) => {
          if (editor.updateNodeData) {
            editor.updateNodeData(nodeId, data);
          }
        });
        this.handleEvent("update_node_label", ({ nodeId, label }) => {
          if (editor.updateNodeLabel) {
            editor.updateNodeLabel(nodeId, label);
          }
        });
        this.handleEvent("update_node_sockets", ({ nodeId, inputs, outputs }) => {
          if (editor.updateNodeSockets) {
            editor.updateNodeSockets(nodeId, { inputs, outputs });
          }
        });
        if (editor.onChange) {
          editor.onChange(() => {
            this.pushEvent("graph_changed", {});
          });
        }
        if (editor.onCodeEdit) {
          editor.onCodeEdit((nodeId, code_elixir, code_python, fieldName, language, variables) => {
            this.pushEvent("open_code_editor", { nodeId, code_elixir, code_python, fieldName, language, variables });
          });
        }
        if (editor.onErrorDetails) {
          editor.onErrorDetails((nodeId, message) => {
            this.pushEvent("show_error_details", { nodeId, message });
          });
        }
        if (editor.onNodeConfig) {
          editor.onNodeConfig((nodeId, nodeData) => {
            this.pushEvent("open_node_config", { nodeId, nodeData });
          });
        }
        if (editor.onCreateNode) {
          editor.onCreateNode((x2, y3) => {
            this.pushEvent("open_create_node_modal", { x: x2, y: y3 });
          });
        }
        this.handleEvent("highlight_node_error", ({ nodeId, message }) => {
          if (editor.addNodeError) {
            editor.addNodeError(nodeId, message);
          } else {
            console.error("Editor addNodeError method missing!");
          }
        });
        this.handleEvent("clear_node_errors", () => {
          if (editor.clearNodeErrors) {
            editor.clearNodeErrors();
          }
        });
        this.destroyed = () => {
          if (editor.destroy) editor.destroy();
        };
        this.pushEvent("client_ready", {});
      }
    },
    ScrollToBottom: {
      mounted() {
        this.el.scrollTop = this.el.scrollHeight;
      },
      updated() {
        this.el.scrollTop = this.el.scrollHeight;
      }
    },
    FocusInput: {
      mounted() {
        this.el.focus();
      },
      updated() {
        this.el.focus();
      }
    }
  };
  var csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content");
  var liveSocket = new LiveSocket2("/live", Socket, {
    longPollFallbackMs: 2500,
    params: { _csrf_token: csrfToken },
    hooks
  });
  import_topbar.default.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
  window.addEventListener("phx:page-loading-start", (_info) => import_topbar.default.show(300));
  window.addEventListener("phx:page-loading-stop", (_info) => import_topbar.default.hide());
  liveSocket.connect();
  function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const html = document.documentElement;
    if (savedTheme === "dark" || !savedTheme && prefersDark) {
      html.classList.add("dark");
      html.setAttribute("data-theme", "dark");
    } else {
      html.classList.remove("dark");
      html.setAttribute("data-theme", "light");
    }
  }
  initTheme();
  window.liveSocket = liveSocket;
  if (true) {
    window.addEventListener("phx:live_reload:attached", ({ detail: reloader }) => {
      reloader.enableServerLogs();
      let keyDown;
      window.addEventListener("keydown", (e7) => keyDown = e7.key);
      window.addEventListener("keyup", (_e) => keyDown = null);
      window.addEventListener("click", (e7) => {
        if (keyDown === "c") {
          e7.preventDefault();
          e7.stopImmediatePropagation();
          reloader.openEditorAtCaller(e7.target);
        } else if (keyDown === "d") {
          e7.preventDefault();
          e7.stopImmediatePropagation();
          reloader.openEditorAtDef(e7.target);
        }
      }, true);
      window.liveReloader = reloader;
    });
  }
  document.addEventListener("DOMContentLoaded", () => {
    const node1 = document.getElementById("node-1");
    const node2 = document.getElementById("node-2");
    const path = document.getElementById("connection-path");
    if (node1 && node2 && path) {
      let updatePath = function() {
        const containerRect = container.getBoundingClientRect();
        const r1 = node1.getBoundingClientRect();
        const r22 = node2.getBoundingClientRect();
        const x1 = r1.x + r1.width - containerRect.x;
        const y1 = r1.y + r1.height / 2 - containerRect.y;
        const x2 = r22.x - containerRect.x;
        const y22 = r22.y + r22.height / 2 - containerRect.y;
        const controlPointX1 = x1 + (x2 - x1) / 2;
        const controlPointX2 = x1 + (x2 - x1) / 2;
        path.setAttribute("d", `M ${x1} ${y1} C ${controlPointX1} ${y1} ${controlPointX2} ${y22} ${x2} ${y22}`);
        animationFrameId = requestAnimationFrame(updatePath);
      };
      const container = path.closest("svg");
      let animationFrameId;
      animationFrameId = requestAnimationFrame(updatePath);
    }
  });
})();
/**
 * @license MIT
 * topbar 3.0.0
 * http://buunguyen.github.io/topbar
 * Copyright (c) 2024 Buu Nguyen
 */
/*! Bundled license information:

@babel/runtime/helpers/regenerator.js:
  (*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE *)

rete/rete.esm.js:
  (*!
  * rete v2.0.5
  * (c) 2025 Vitaliy Stoliarov
  * Released under the MIT license.
  * *)

rete-area-plugin/rete-area-plugin.esm.js:
  (*!
  * rete-area-plugin v2.1.4
  * (c) 2025 Vitaliy Stoliarov
  * Released under the MIT license.
  * *)

rete-connection-plugin/rete-connection-plugin.esm.js:
  (*!
  * rete-connection-plugin v2.0.4
  * (c) 2024 Vitaliy Stoliarov
  * Released under the MIT license.
  * *)

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
lit-html/lit-html.js:
lit-element/lit-element.js:
@lit/reactive-element/decorators/custom-element.js:
@lit/reactive-element/decorators/property.js:
@lit/reactive-element/decorators/state.js:
@lit/reactive-element/decorators/event-options.js:
@lit/reactive-element/decorators/base.js:
@lit/reactive-element/decorators/query.js:
@lit/reactive-element/decorators/query-all.js:
@lit/reactive-element/decorators/query-async.js:
@lit/reactive-element/decorators/query-assigned-nodes.js:
lit-html/directive.js:
lit-html/directives/repeat.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

rete-render-utils/rete-render-utils.esm.js:
  (*!
  * rete-render-utils v2.0.2
  * (c) 2024 Vitaliy Stoliarov
  * Released under the MIT license.
  * *)

@retejs/lit-plugin/lit-plugin.esm.js:
  (*!
  * @retejs/lit-plugin v2.0.6
  * (c) 2024 Vitaliy Stoliarov
  * Released under the MIT license.
  * *)

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/

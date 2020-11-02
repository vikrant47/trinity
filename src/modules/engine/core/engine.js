const Engine = function() {

};
Engine.defaultActionOption = {
  default: {
    active: true,
    template: '<button class="action action-button"><i></i><span></span></button>',
    // element: {text: 'span', icon: 'i'},
    icon: false,
    event: 'click',
    css_class: '',
    attributes: [],
    prepend: false,
    beforeRender: function() {
    },
    afterRender: function() {
    },
    handler: function() {

    }
  },
  button: {
    template: '<button class="action action-button"><i></i></button>',
    event: 'click',
    css_class: '',
    attributes: []
  },
  input: {
    template: '<input class="action action-input"><i></i></input>',
    event: 'change',
    events: {},
    css_class: '',
    attributes: []
  },
  dropdown: {
    template: '<div class="dropdown action action-list">   <a href="#" data-toggle="dropdown" class="dropdown-title"></a>' +
      '<ul class="dropdown-menu" role="menu" data-dropdown-title="Add something large"></ul>' +
      '</div>',
    element: { text: '.dropdown-title', appendTo: 'ul', icon: '.dropdown-title' },
    attributes: [],
    event: 'click',
    css_class: ''
  },
  dropdownItem: {
    template: '<li class="action-list-item" role="presentation"><a role="menuitem" tabindex="-1" href="#" class=" dropdown-item-title"></a></li>',
    element: { text: '.dropdown-item-title', appendTo: 'li', icon: '.dropdown-item-title' },
    attributes: [],
    event: 'click',
    css_class: ''
  }
};
Object.assign(Engine.prototype, {
  keys: {},
  boot: function() {
    this.noConflicts();
  },
  ready: function() {
    // this.addNavFlyout();
    this.addResizeFlyout();
    this.registerEvents();
    this.moveActions();
    this.overrideDefaults();
  },
  noConflicts: function() {
    Engine._ = require('lodash');
  },
  overrideDefaults: function() {
    const s2CallbackOptions = ['dropdownParent'];
    $.fn.modal.Constructor.prototype.enforceFocus = function() {
    };
    $.fn.modal.Constructor.prototype._enforceFocus = function() {
    };
    const s2OptionGet = jQuery.fn.select2.amd.require('select2/options').prototype.get;
    jQuery.fn.select2.amd.require('select2/options').prototype.get = function(key) {
      let value = this.options[key];
      if (typeof value === 'function' && s2CallbackOptions.indexOf(key) >= 0) {
        value = value.apply(this, arguments);
      }
      return value;
    };
  },
  registerEvents: function() {
    var _this = this;
    $(document).ready(function() {
      _this.onDocumentReady();
    });
    $(document).keydown(function(event) {
      _this.keys[event.which] = true;
    });

    $(document).keyup(function(event) {
      delete _this.keys[event.which];
    });
  },
  getPressedKeys: function() {
    return Object.keys(this.keys);
  },
  evalFunction: function(script) {
    return Function('return ' + script)();
  },
  evalScript: function(fun, scope, args) {
    scope = scope || this;
    const keys = Object.keys(args);
    return (Function('return function(' + keys.join(',') + '){\n' +
      fun + '\n}')()).apply(scope, keys.map(function(key) {
      return args[key];
    }));
  },
  applyActionDataAttributes: function() {
    var _this = this;
    var dataActionConfig = {
      show: function(value) {
        if (value) {
          $(this).show();
        } else {
          $(this).hide();
        }
      }, hide: function(value) {
        if (value) {
          $(this).hide();
        } else {
          $(this).show();
        }
      }, disable: function(value) {
        $(this).prop('disabled', !!value);
      }
    };
    $('[data-show],[data-disable],[data-hide]').each(function() {
      var $this = $(this);
      var data = $this.data();
      data.engine = _this;
      for (var dataActionKey in dataActionConfig) {
        if (data[dataActionKey]) {
          this.data = data;
          dataActionConfig[dataActionKey].call(
            this,
            data[dataActionKey] === 'true' ||
            _this.evalScript(data[dataActionKey], this, data)
          );
        }
      }
    });
  },
  onDocumentReady: function() {
    const _this = this;
    $(document).on('engine.list.init engine.form.init', function() {
      _this.applyActionDataAttributes();
    });
    this.applyActionDataAttributes();
  },
  confirm: function(message, callback) {
    var _event = jQuery.Event('ajaxConfirmMessage');

    _event.promise = $.Deferred();
    if ($(window).triggerHandler(_event, [message]) !== undefined) {
      _event.promise.done(function() {
        callback();
      });
      return false;
    }
  },
  addResizeFlyout: function() {
    var _this = this;
    this.$resizeFlyout = $('#resize-flyout');
    if (this.$resizeFlyout.length === 0) {
      $('.mainmenu-preview').hide();
      this.$resizeFlyout = $('<div id="resize-flyout" class="flyout-toggle"><i class="oc-icon-external-link-square"></i></div>').css({
        'top': '52px',
        'right': '8px',
        position: 'fixed',
        'font-size': '20px',
        left: 'auto',
        background: 'none'
      }).appendTo(document.body).click(function() {
        _this.toggleResizeBody();
      }).data('flyout-state', 'minimized');
    }
  },
  addNavFlyout: function() {
    this.$navFlyout = $('#nav-flyout');
    if (this.$navFlyout.length === 0) {
      this.$navFlyout = $('<div id="nav-flyout" class="flyout-toggle"><i class="icon-chevron-left"></i></div>').css({
        'top': '82px',
        position: 'fixed'
      }).appendTo(document.body).click(function() {
        $(this).find('i').toggleClass('icon-chevron-right').toggleClass('icon-chevron-left');
        $('.layout-sidenav-container').toggle();
      });
    }
  },
  moveActions: function() {
    $('.engine-list-toolbar .engine-actions').appendTo($('.engine-list-toolbar .toolbar-item').children().eq(0));
  },
  removeNavFlyout: function() {
    this.$navFlyout.remove();
    this.$navFlyout = null;
  },
  getRandomColor: function() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  },
  maximizeBody: function() {
    $('.layout-row.min-size').hide();
    $('.layout-sidenav-container').hide();
  },
  minimizeBody: function() {
    $('.layout-row.min-size').show();
    $('.layout-sidenav-container').show();
  },
  toggleResizeBody: function() {
    this.$resizeFlyout.find('i').toggleClass('oc-icon-external-link-square').toggleClass('oc-icon-square-o');
    if (this.$resizeFlyout.data('flyout-state') === 'maximized') {
      this.$resizeFlyout.css('top', '52px');
      this.minimizeBody();
      this.$resizeFlyout.data('flyout-state', 'minimized');
      this.$navFlyout.show();
    } else {
      this.maximizeBody();
      this.$resizeFlyout.css('top', '0px');
      this.$resizeFlyout.data('flyout-state', 'maximized');
      this.$navFlyout.hide();
    }
  },
  addActions: function($container, actions, scope, prepend) {
    var _this = this;
    if (!scope) {
      scope = this;
    }
    return actions.map(function(action) {
      action = Object.assign({}, Engine.defaultActionOption.default, Engine.defaultActionOption[action.type || 'button'], action);
      action.scope = scope;
      if (typeof action.active === 'function') {
        action.active = action.active.call(action, $container, scope);
      }
      if (action.active) {
        action.beforeRender.apply(action, [{ name: 'beforeRender' }, scope, action, $container]);
        var $template = $(action.template).data('action', action).data('scope', scope).prop('id', action.id);
        if (action.label) {
          var $textElement = $template;
          if (action.element && action.element.text) {
            $textElement = $template.find(action.element.text);
          }
          $textElement.text(action.label);
        }
        $template.addClass(action.css_class);
        var $target = $template;
        if (action.target) {
          $target = $template.find(action.target);
        }
        $target.on(action.event, function(event) {
          event.preventDefault();
          action.handler.apply(this, [event, scope, action, $container]);
        });
        if (action.events) {
          for (var eventName in action.events) {
            $target.on(eventName, function(event) {
              action.events[eventName].apply(this, [event, scope, action, $container]);
            });
          }
        }
        if (action.icon) {
          var $icon = $template.find('i');
          if (action.element && action.element.icon) {
            $icon = $template.find(action.element.icon);
          }
          $icon.addClass(action.icon);
        } else {
          $template.find('i').remove();
        }
        if (action.tooltip) {
          if (action.tooltip.indexOf('<') >= 0) {
            action.tooltip = $(action.tooltip).text();
          }
          $template.prop('title', action.tooltip);
          $template.attr('data-toggle', 'tooltip');
        }
        if (action.attributes) {
          action.attributes.forEach(function(attr) {
            $template.attr(attr.name, attr.value);
          });
        }
        if (prepend) {
          $container.prepend($template);
        } else {
          $container.append($template);
        }
        if (action.hidden) {
          $template.hide();
        }
        if (action.actions && action.actions.length > 0) {
          var $appendTo = $template;
          if (action.element.appendTo) {
            $appendTo = $template.find(action.element.appendTo);
          }
          _this.addActions($appendTo, action.actions, scope);
        }
        action.afterRender.apply($template.get(0), [{ name: 'afterRender' }, scope, action, $container]);
        return $template;
      }
      return null;
    });
  },
  export: function(module, namespace) {
    this[namespace] = module;
  },
  define: function(name, options) {
    if (typeof options === 'undefined') {
      options = name;
    } else {
      options.name = name;
    }
    const settings = Object.assign({
      constructor: function() {

      },
      static: {},
      staticInheritance: false
    }, options);
    const cls = function() {
      if (settings.extends) {
        const parent = new settings.extends();
        for (const i in parent) {
          if (typeof i !== 'function' && typeof this[i] === 'undefined') {
            this[i] = parent[i];
          }
        }
      }
      settings.constructor.apply(this, arguments);
    };
    /** static fields handling*/
    // static inheritance
    if (settings.extends && settings.staticInheritance) {
      settings.static = Object.assign({}, settings.extends.prototype.static, settings.static);
    }
    let staticInitializer = null;
    for (const i in settings.static) {
      cls[i] = settings.static[i];
      if (i === '_ready' && typeof cls[i] === 'function') { // checking for ready event
        $(document).ready(function() {
          cls[i].apply(cls);
        });
      }
      if (i === '_static' && typeof cls[i] === 'function') { // checking for ready event
        staticInitializer = cls[i]; // calling static block/ function on class load
      }
    }
    if (settings.extends) {
      cls.prototype = Object.create(settings.extends.prototype);
    }
    Object.assign(cls.prototype, settings);
    Object.assign(cls.prototype.static, settings.static);
    if (settings.name) {
      let parentPackage = window;
      const namespace = settings.name.split('.');
      const name = namespace[namespace.length - 1];
      // cls.constructor.name = name;
      Object.defineProperty(cls, 'name', { value: name });
      namespace.splice(-1, 1);
      for (const pkg of namespace) {
        if (!parentPackage[pkg]) {
          parentPackage[pkg] = {};
        }
        parentPackage = parentPackage[pkg];
      }
      parentPackage[name] = cls;
    }
    if (staticInitializer) {
      staticInitializer.call(cls);
    }
    return cls;
  },
  extend: function(child, parent) {
    child.prototype = Object.create(parent.prototype, child.prototype);
    return child;
  }
});
window.Engine = Engine;
Engine.instance = new Engine();
$(document).ready(function() {
  Engine.instance.ready();
});
Engine.libs = {};
Engine.reloadLibrary = function(lib, callback) {
  delete Engine.libs[lib];
  Engine.loadLibrary(lib, callback);
};
Engine.loadLibrary = function(lib, callback) {
  callback = callback || function() {

  };
  if (Engine.libs[lib]) {
    callback.apply(this);
  } else {
    $.getScript(lib).done(function() {
      Engine.libs[lib] = lib;
      callback.apply(Engine);
    });
  }
};
Engine.instance.boot();

export default Engine;

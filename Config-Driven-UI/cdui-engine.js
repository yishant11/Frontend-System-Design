/* ============================================
   Config-Driven UI Engine
   ─────────────────────────────────────────
   Core architecture:
   1. ComponentRegistry  → Maps type strings to builder functions
   2. StateStore         → Reactive form state with change listeners
   3. renderNode()       → Recursive tree renderer with conditional logic
   4. ActionDispatcher   → Handles onClick events (toast, submit, reset, etc.)
   5. EventLogger        → Tracks all render, state, and action events
   ============================================ */

// ──────────────────────────────────────────────
// STATE STORE — Reactive form state
// ──────────────────────────────────────────────
const StateStore = {
  _state: {},
  _listeners: [],

  get(field) {
    return this._state[field] ?? '';
  },

  set(field, value) {
    const oldVal = this._state[field];
    this._state[field] = value;
    if (oldVal !== value) {
      EventLogger.log('state', `State changed: ${field} = "${value}"`);
      this._notify();
    }
  },

  getAll() {
    return { ...this._state };
  },

  reset() {
    this._state = {};
    EventLogger.log('state', 'State reset — all fields cleared');
    this._notify();
  },

  onChange(fn) {
    this._listeners.push(fn);
  },

  _notify() {
    this._listeners.forEach(fn => fn(this._state));
  }
};


// ──────────────────────────────────────────────
// EVENT LOGGER — Tracks everything
// ──────────────────────────────────────────────
const EventLogger = {
  _logs: [],
  _container: null,
  _countEl: null,

  init(containerEl, countEl) {
    this._container = containerEl;
    this._countEl = countEl;
  },

  log(type, message) {
    const now = new Date();
    const time = now.toLocaleTimeString('en-IN', { hour12: false });
    this._logs.unshift({ type, message, time });

    // Keep max 100 entries
    if (this._logs.length > 100) this._logs.pop();

    this._render();
  },

  clear() {
    this._logs = [];
    this._render();
  },

  _render() {
    if (!this._container) return;

    this._container.innerHTML = this._logs.map(entry => `
      <div class="event-log-item">
        <span class="log-time">${entry.time}</span>
        <span class="log-type ${entry.type}">${entry.type}</span>
        <span class="log-message">${this._escapeHtml(entry.message)}</span>
      </div>
    `).join('');

    if (this._countEl) {
      this._countEl.textContent = this._logs.length;
    }
  },

  _escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};


// ──────────────────────────────────────────────
// ACTION DISPATCHER — Handles button events
// ──────────────────────────────────────────────
const ActionDispatcher = {
  dispatch(action) {
    if (!action || !action.type) return;

    switch (action.type) {
      case 'toast':
        this._showToast(action.message || 'Action triggered!');
        EventLogger.log('action', `Toast: ${action.message}`);
        break;

      case 'submit':
        const formState = StateStore.getAll();
        const stateStr = JSON.stringify(formState, null, 2);
        this._showToast(action.message || '✅ Form submitted!');
        EventLogger.log('action', `Submit — Captured state: ${JSON.stringify(formState)}`);
        break;

      case 'reset':
        StateStore.reset();
        this._showToast(action.message || '🔄 Form reset!');
        // Re-render will happen automatically via state listener
        break;

      case 'navigate':
        EventLogger.log('action', `Navigate: ${action.url || action.route || 'unknown'}`);
        this._showToast(`🔗 Navigate to: ${action.url || action.route}`);
        break;

      case 'setState':
        if (action.field && action.value !== undefined) {
          StateStore.set(action.field, action.value);
        }
        break;

      default:
        EventLogger.log('action', `Unknown action type: ${action.type}`);
    }
  },

  _showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('leaving');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
};


// ──────────────────────────────────────────────
// COMPONENT REGISTRY — Maps type → builder fn
// ──────────────────────────────────────────────
const ComponentRegistry = {};

/**
 * Register a component builder function.
 * @param {string} type - Component type identifier
 * @param {Function} builderFn - (node, renderChildren) => HTMLElement
 */
function registerComponent(type, builderFn) {
  ComponentRegistry[type] = builderFn;
}


// ── page ──
registerComponent('page', (node, renderChildren) => {
  const el = document.createElement('div');
  el.className = 'cdui-page';
  renderChildren(node.children, el);
  return el;
});

// ── section ──
registerComponent('section', (node, renderChildren) => {
  const el = document.createElement('div');
  el.className = 'cdui-section';

  if (node.props?.title) {
    const title = document.createElement('div');
    title.className = 'section-title';
    title.textContent = node.props.title;
    el.appendChild(title);
  }
  if (node.props?.subtitle) {
    const sub = document.createElement('div');
    sub.className = 'section-subtitle';
    sub.textContent = node.props.subtitle;
    el.appendChild(sub);
  }

  renderChildren(node.children, el);
  return el;
});

// ── grid ──
registerComponent('grid', (node, renderChildren) => {
  const el = document.createElement('div');
  el.className = 'cdui-grid';
  const cols = node.props?.columns || 2;
  const gap = node.props?.gap || 12;
  el.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  el.style.gap = `${gap}px`;
  renderChildren(node.children, el);
  return el;
});

// ── row ──
registerComponent('row', (node, renderChildren) => {
  const el = document.createElement('div');
  el.className = 'cdui-row';
  renderChildren(node.children, el);
  return el;
});

// ── banner ──
registerComponent('banner', (node) => {
  const el = document.createElement('div');
  el.className = 'cdui-banner';

  if (node.props?.gradient) {
    const [c1, c2] = node.props.gradient;
    el.style.background = `linear-gradient(135deg, ${c1}, ${c2})`;
  }

  if (node.props?.title) {
    const t = document.createElement('div');
    t.className = 'banner-title';
    t.textContent = node.props.title;
    el.appendChild(t);
  }
  if (node.props?.subtitle) {
    const s = document.createElement('div');
    s.className = 'banner-subtitle';
    s.textContent = node.props.subtitle;
    el.appendChild(s);
  }

  return el;
});

// ── card ──
registerComponent('card', (node, renderChildren) => {
  const el = document.createElement('div');
  el.className = 'cdui-card';

  // Image/emoji placeholder
  if (node.props?.image) {
    const img = document.createElement('div');
    img.className = 'card-image';
    img.textContent = node.props.image;
    el.appendChild(img);
  }

  // Title
  if (node.props?.title) {
    const t = document.createElement('div');
    t.className = 'card-title';
    t.textContent = node.props.title;
    el.appendChild(t);
  }

  // Description
  if (node.props?.description) {
    const d = document.createElement('div');
    d.className = 'card-description';
    d.textContent = node.props.description;
    el.appendChild(d);
  }

  // Badges
  if (node.props?.badges?.length) {
    const meta = document.createElement('div');
    meta.className = 'card-meta';
    node.props.badges.forEach(b => {
      const badge = document.createElement('span');
      badge.className = `cdui-badge ${b.variant || 'blue'}`;
      badge.textContent = b.text;
      meta.appendChild(badge);
    });
    el.appendChild(meta);
  }

  // Render nested children (for e-commerce card pattern)
  if (node.children?.length) {
    renderChildren(node.children, el);
  }

  // Footer with action
  if (node.props?.footer) {
    const footer = document.createElement('div');
    footer.className = 'card-footer';

    const left = document.createElement('span');
    left.className = 'card-description';
    left.textContent = node.props.footer.left || '';
    footer.appendChild(left);

    if (node.props.footer.action) {
      const btn = document.createElement('button');
      btn.className = `cdui-button ${node.props.footer.action.style || 'primary'} small`;
      btn.textContent = node.props.footer.action.label || 'Action';
      btn.addEventListener('click', () => {
        ActionDispatcher.dispatch(node.props.footer.action.onClick);
      });
      footer.appendChild(btn);
    }

    el.appendChild(footer);
  }

  return el;
});

// ── badge ──
registerComponent('badge', (node) => {
  const el = document.createElement('span');
  el.className = `cdui-badge ${node.props?.variant || 'blue'}`;
  el.textContent = node.props?.text || '';
  return el;
});

// ── chip ──
registerComponent('chip', (node) => {
  const el = document.createElement('button');
  el.className = 'cdui-chip';
  el.textContent = node.props?.label || '';

  const group = node.props?.group;
  const value = node.props?.value || '';

  // Check if currently selected
  if (group && StateStore.get(group) === value) {
    el.classList.add('selected');
  }

  el.addEventListener('click', () => {
    if (group) {
      StateStore.set(group, value);
    }
    ActionDispatcher.dispatch({ type: 'toast', message: `Selected: ${node.props?.label}` });
  });

  return el;
});

// ── chip-group ──
registerComponent('chip-group', (node) => {
  const el = document.createElement('div');
  el.className = 'cdui-chip-group';

  const field = node.props?.field;
  const chips = node.props?.chips || [];

  chips.forEach(chipData => {
    const chip = document.createElement('button');
    chip.className = 'cdui-chip';
    chip.textContent = chipData.label;

    if (field && StateStore.get(field) === chipData.value) {
      chip.classList.add('selected');
    }

    chip.addEventListener('click', () => {
      if (field) {
        StateStore.set(field, chipData.value);
      }
    });

    el.appendChild(chip);
  });

  return el;
});

// ── button ──
registerComponent('button', (node) => {
  const el = document.createElement('button');
  const style = node.props?.style || 'primary';
  el.className = `cdui-button ${style}`;

  if (node.props?.fullWidth) el.classList.add('full-width');

  el.textContent = node.props?.label || 'Button';

  el.addEventListener('click', () => {
    ActionDispatcher.dispatch(node.props?.onClick);
  });

  return el;
});

// ── input ──
registerComponent('input', (node) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'cdui-field';

  if (node.props?.label) {
    const label = document.createElement('label');
    label.className = 'field-label';
    label.innerHTML = node.props.label;
    if (node.props.required) {
      label.innerHTML += ' <span class="required">*</span>';
    }
    wrapper.appendChild(label);
  }

  const input = document.createElement('input');
  input.className = 'cdui-input';
  input.type = node.props?.inputType || 'text';
  input.placeholder = node.props?.placeholder || '';

  const field = node.props?.field;
  if (field) {
    input.value = StateStore.get(field);
    input.addEventListener('input', (e) => {
      StateStore.set(field, e.target.value);
    });
  }

  wrapper.appendChild(input);
  return wrapper;
});

// ── select ──
registerComponent('select', (node) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'cdui-field';

  if (node.props?.label) {
    const label = document.createElement('label');
    label.className = 'field-label';
    label.textContent = node.props.label;
    wrapper.appendChild(label);
  }

  const select = document.createElement('select');
  select.className = 'cdui-select';

  (node.props?.options || []).forEach(opt => {
    const option = document.createElement('option');
    option.value = opt.value;
    option.textContent = opt.label;
    select.appendChild(option);
  });

  const field = node.props?.field;
  if (field) {
    select.value = StateStore.get(field);
    select.addEventListener('change', (e) => {
      StateStore.set(field, e.target.value);
    });
  }

  wrapper.appendChild(select);
  return wrapper;
});

// ── textarea ──
registerComponent('textarea', (node) => {
  const wrapper = document.createElement('div');
  wrapper.className = 'cdui-field';

  if (node.props?.label) {
    const label = document.createElement('label');
    label.className = 'field-label';
    label.textContent = node.props.label;
    wrapper.appendChild(label);
  }

  const textarea = document.createElement('textarea');
  textarea.className = 'cdui-textarea';
  textarea.placeholder = node.props?.placeholder || '';
  textarea.rows = node.props?.rows || 4;

  const field = node.props?.field;
  if (field) {
    textarea.value = StateStore.get(field);
    textarea.addEventListener('input', (e) => {
      StateStore.set(field, e.target.value);
    });
  }

  wrapper.appendChild(textarea);
  return wrapper;
});

// ── heading ──
registerComponent('heading', (node) => {
  const level = node.props?.level || 'h3';
  const el = document.createElement('div');
  el.className = `cdui-heading ${level}`;
  el.textContent = node.props?.text || '';
  return el;
});

// ── text ──
registerComponent('text', (node) => {
  const el = document.createElement('p');
  el.className = 'cdui-text';
  if (node.props?.modifier) {
    node.props.modifier.split(' ').forEach(m => el.classList.add(m));
  }

  // Handle strikethrough
  if (node.props?.modifier?.includes('strikethrough')) {
    el.innerHTML = `<s>${el.textContent}</s>`;
    el.querySelector('s').textContent = node.props?.content || '';
    el.style.color = 'var(--clr-text-dim)';
  } else {
    el.textContent = node.props?.content || '';
  }

  return el;
});

// ── divider ──
registerComponent('divider', () => {
  const el = document.createElement('hr');
  el.className = 'cdui-divider';
  return el;
});

// ── spacer ──
registerComponent('spacer', (node) => {
  const el = document.createElement('div');
  el.className = 'cdui-spacer';
  el.style.height = `${node.props?.height || 16}px`;
  return el;
});

// ── alert ──
registerComponent('alert', (node) => {
  const el = document.createElement('div');
  el.className = `cdui-alert ${node.props?.variant || 'info'}`;

  if (node.props?.icon) {
    const icon = document.createElement('span');
    icon.className = 'alert-icon';
    icon.textContent = node.props.icon;
    el.appendChild(icon);
  }

  const content = document.createElement('div');
  content.className = 'alert-content';

  if (node.props?.title) {
    const title = document.createElement('div');
    title.className = 'alert-title';
    title.textContent = node.props.title;
    content.appendChild(title);
  }

  if (node.props?.message) {
    const msg = document.createElement('div');
    msg.className = 'alert-message';
    msg.textContent = node.props.message;
    content.appendChild(msg);
  }

  el.appendChild(content);
  return el;
});

// ── metric ──
registerComponent('metric', (node) => {
  const el = document.createElement('div');
  el.className = 'cdui-metric';

  if (node.props?.icon) {
    const icon = document.createElement('div');
    icon.className = 'metric-icon';
    icon.textContent = node.props.icon;
    el.appendChild(icon);
  }

  if (node.props?.value) {
    const val = document.createElement('div');
    val.className = 'metric-value';
    val.textContent = node.props.value;
    el.appendChild(val);
  }

  if (node.props?.label) {
    const lbl = document.createElement('div');
    lbl.className = 'metric-label';
    lbl.textContent = node.props.label;
    el.appendChild(lbl);
  }

  if (node.props?.change) {
    const change = document.createElement('div');
    change.className = `metric-change ${node.props.change.direction || 'up'}`;
    change.textContent = `${node.props.change.direction === 'up' ? '↑' : '↓'} ${node.props.change.value}`;
    el.appendChild(change);
  }

  return el;
});

// ── progress ──
registerComponent('progress', (node) => {
  const el = document.createElement('div');
  el.className = 'cdui-progress';

  const header = document.createElement('div');
  header.className = 'progress-header';

  const label = document.createElement('span');
  label.className = 'progress-label';
  label.textContent = node.props?.label || '';
  header.appendChild(label);

  const value = document.createElement('span');
  value.className = 'progress-value';
  value.textContent = `${node.props?.value || 0}%`;
  header.appendChild(value);

  el.appendChild(header);

  const track = document.createElement('div');
  track.className = 'progress-track';

  const fill = document.createElement('div');
  fill.className = 'progress-fill';

  // Color mapping
  const colorMap = {
    accent: 'linear-gradient(90deg, #7c5cfc, #9b7cfc)',
    green:  'linear-gradient(90deg, #00d4aa, #10b981)',
    blue:   'linear-gradient(90deg, #38bdf8, #0ea5e9)',
    yellow: 'linear-gradient(90deg, #fbbf24, #f59e0b)',
    red:    'linear-gradient(90deg, #ff6b6b, #ef4444)',
  };

  fill.style.background = colorMap[node.props?.color] || colorMap.accent;
  // Animate width after paint
  requestAnimationFrame(() => {
    fill.style.width = `${node.props?.value || 0}%`;
  });

  track.appendChild(fill);
  el.appendChild(track);

  return el;
});

// ── list ──
registerComponent('list', (node, renderChildren) => {
  const el = document.createElement('div');
  el.className = 'cdui-list';
  renderChildren(node.children, el);
  return el;
});

// ── list-item ──
registerComponent('list-item', (node) => {
  const el = document.createElement('div');
  el.className = 'cdui-list-item';

  if (node.props?.icon) {
    const icon = document.createElement('div');
    icon.className = 'item-icon';
    icon.textContent = node.props.icon;

    // Background color based on iconBg prop
    const bgMap = {
      purple: 'rgba(124,92,252,0.12)',
      blue:   'rgba(56,189,248,0.12)',
      green:  'rgba(0,212,170,0.12)',
      yellow: 'rgba(251,191,36,0.12)',
      red:    'rgba(255,107,107,0.12)',
    };
    icon.style.background = bgMap[node.props.iconBg] || bgMap.blue;
    el.appendChild(icon);
  }

  const content = document.createElement('div');
  content.className = 'item-content';

  if (node.props?.title) {
    const title = document.createElement('div');
    title.className = 'item-title';
    title.textContent = node.props.title;
    content.appendChild(title);
  }

  if (node.props?.subtitle) {
    const sub = document.createElement('div');
    sub.className = 'item-subtitle';
    sub.textContent = node.props.subtitle;
    content.appendChild(sub);
  }

  el.appendChild(content);

  if (node.props?.trailing) {
    const trailing = document.createElement('span');
    trailing.className = 'item-trailing';
    trailing.textContent = node.props.trailing;
    el.appendChild(trailing);
  }

  return el;
});

// ── image ──
registerComponent('image', (node) => {
  const el = document.createElement('img');
  el.className = 'cdui-image';
  el.src = node.props?.src || '';
  el.alt = node.props?.alt || '';
  if (node.props?.height) el.style.height = `${node.props.height}px`;
  return el;
});


// ──────────────────────────────────────────────
// RECURSIVE RENDERER — The heart of CDUI
// ──────────────────────────────────────────────

/**
 * Render a single schema node recursively into a DOM element.
 * Handles:
 *  - Component lookup from registry
 *  - Conditional visibility (showIf)
 *  - Error boundaries (unknown components)
 *  - Recursive children
 *
 * @param {Object} node - A schema node { type, props, children, showIf }
 * @returns {HTMLElement|null}
 */
function renderNode(node) {
  if (!node || !node.type) return null;

  // ── Conditional Visibility Check ──
  if (node.showIf) {
    const fieldValue = StateStore.get(node.showIf.field);
    if (node.showIf.equals !== undefined && fieldValue !== node.showIf.equals) {
      return null; // Don't render — condition not met
    }
    if (node.showIf.notEquals !== undefined && fieldValue === node.showIf.notEquals) {
      return null;
    }
  }

  // ── Look up builder from registry ──
  const builderFn = ComponentRegistry[node.type];

  if (!builderFn) {
    // Error Boundary: Unknown component type
    EventLogger.log('error', `Unknown component type: "${node.type}"`);
    const fallback = document.createElement('div');
    fallback.className = 'cdui-error-fallback';
    fallback.textContent = `⚠️ Unknown component: "${node.type}" — Register it using registerComponent('${node.type}', builderFn)`;
    return fallback;
  }

  // ── Build element, passing a renderChildren helper ──
  const el = builderFn(node, (children, parentEl) => {
    if (!children || !Array.isArray(children)) return;
    children.forEach(child => {
      const childEl = renderNode(child);
      if (childEl) {
        // Wrap conditional nodes with animation class
        if (child.showIf) {
          childEl.classList.add('cdui-conditional');
        }
        parentEl.appendChild(childEl);
      }
    });
  });

  return el;
}


/**
 * Render a full schema tree into a target container.
 * @param {Object} schema - The root schema node
 * @param {HTMLElement} container - The DOM container to render into
 */
function renderSchema(schema, container) {
  if (!container) return;

  // Clear existing content
  container.innerHTML = '';

  if (!schema) {
    container.innerHTML = '<div class="cdui-error-fallback">⚠️ No schema provided</div>';
    return;
  }

  try {
    const rootEl = renderNode(schema);
    if (rootEl) {
      container.appendChild(rootEl);
      EventLogger.log('render', `Schema rendered successfully (root type: "${schema.type}")`);
    }
  } catch (err) {
    container.innerHTML = `<div class="cdui-error-fallback">⚠️ Render error: ${err.message}</div>`;
    EventLogger.log('error', `Render failed: ${err.message}`);
  }
}

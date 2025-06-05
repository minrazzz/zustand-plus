# Zustand Enhanced

Enhanced Zustand stores with persistence and update tracking

## Installation

```bash
npm install zustand-plus
```

## Features

- 🔗 **Method Composition** - Call methods from within other methods
- 🛡️ **Safe State Mutations** - Direct mutations with automatic cloning
- 🔄 **Automatic Update Tracking** - Built-in `lastUpdateTime`
- 💾 **Easy Persistence** - One-line persistent stores
- 📦 **TypeScript Support** - Full type safety

## Quick Start

```typescript
import { createStore, createPersistStore } from "zustand-plus";

// Basic store
const useCounter = createStore({ count: 0 }, (set, get) => ({
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Persistent store
const useSettings = createPersistStore(
  { theme: "light", language: "en" },
  (set, get) => ({
    setTheme: (theme) => set({ theme }),
    setLanguage: (language) => set({ language }),
  }),
  { name: "app-settings" }
);
```

## 🔗 Method Composition - The Game Changer

**The Problem with Standard Zustand:**

```typescript
// ❌ Can't call methods from within other methods
const useStore = create((set, get) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),

  // This doesn't work - get() only returns state
  doubleIncrement: () => {
    // get().increment(); // ❌ Error - increment is not available
    // Have to duplicate logic instead
    set((state) => ({ count: state.count + 2 }));
  },
}));
```

**The Solution with Zustand Enhanced:**

```typescript
// ✅ Methods can call other methods easily
const useCounterStore = createStore({ count: 0 }, (set, _get) => {
  function get() {
    return { ..._get(), ...methods }; // 🎯 Key pattern
  }

  const methods = {
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 }),

    // ✨ Now you can call other methods!
    doubleIncrement: () => {
      get().increment();
      get().increment();
    },

    incrementAndReset: () => {
      get().increment();
      setTimeout(() => get().reset(), 1000);
    },

    smartIncrement: () => {
      const { count } = get();
      if (count < 10) {
        get().increment();
      } else {
        get().reset();
      }
    },
  };

  return methods;
});
```

## Real-World Examples

### 🛒 Shopping Cart

```typescript
const useCartStore = createStore({ items: [], total: 0 }, (set, _get) => {
  function get() {
    return { ..._get(), ...methods };
  }

  const methods = {
    addItem: (item) =>
      set((state) => ({
        items: [...state.items, { ...item, id: Date.now() }],
      })),

    removeItem: (id) =>
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),

    calculateTotal: () => {
      const { items } = get();
      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      set({ total });
    },

    // ✨ Combine multiple operations
    addItemAndCalculate: (item) => {
      get().addItem(item);
      get().calculateTotal(); // Call another method!
    },

    clearCart: () => {
      set({ items: [], total: 0 });
      get().markUpdate(); // Built-in tracking
    },
  };

  return methods;
});
```

### 🎨 Theme Manager

```typescript
const useThemeStore = createPersistStore(
  {
    theme: "light",
    fontSize: 16,
    sidebarOpen: false,
  },
  (set, _get) => {
    function get() {
      return { ..._get(), ...methods };
    }

    const methods = {
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      // ✨ Complex operations made simple
      switchToDarkMode: () => {
        get().setTheme("dark");
        get().setFontSize(18); // Bigger font for dark mode
        if (!get().sidebarOpen) {
          get().toggleSidebar(); // Open sidebar in dark mode
        }
      },

      resetToDefaults: () => {
        get().setTheme("light");
        get().setFontSize(16);
        set({ sidebarOpen: false });
      },
    };

    return methods;
  },
  { name: "theme-settings" }
);
```

## 🛡️ Safe State Mutations

Update complex nested state without manual cloning:

```typescript
const useProfileStore = createStore(
  {
    user: { name: "", email: "" },
    preferences: { notifications: true, theme: "light" },
    settings: { privacy: { public: false } },
  },
  (set, get) => ({
    updateUserName: (name) => {
      get().update((state) => {
        state.user.name = name; // Direct mutation - safely cloned
      });
    },

    togglePrivacy: () => {
      get().update((state) => {
        state.settings.privacy.public = !state.settings.privacy.public;
      });
    },
  })
);
```

## 🔄 Automatic Update Tracking

```typescript
const useDataStore = createStore(
  { data: null, loading: false },
  (set, get) => ({
    fetchData: async () => {
      set({ loading: true });
      const data = await fetch("/api/data").then((r) => r.json());
      set({ data, loading: false });
      // lastUpdateTime automatically updated!
    },

    getLastSync: () => {
      const { lastUpdateTime } = get();
      return lastUpdateTime
        ? new Date(lastUpdateTime).toLocaleString()
        : "Never";
    },
  })
);
```

## Why Choose Zustand Enhanced?

| Feature         | Standard Zustand                                  | Zustand Enhanced                       |
| --------------- | ------------------------------------------------- | -------------------------------------- |
| Method calls    | ❌ `get().increment()` doesn't work               | ✅ `get().increment()` works perfectly |
| Complex updates | ❌ Manual `{...state, nested: {...state.nested}}` | ✅ `state.nested.value = newValue`     |
| Update tracking | ❌ Manual implementation                          | ✅ Built-in `lastUpdateTime`           |
| Persistence     | ❌ Complex middleware setup                       | ✅ One-line `createPersistStore`       |

## Usage in React

```typescript
function Counter() {
  const { count, increment, doubleIncrement, smartIncrement } =
    useCounterStore();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={doubleIncrement}>+2</button>
      <button onClick={smartIncrement}>Smart +</button>
    </div>
  );
}
```

## API Reference

### `createStore(initialState, methods)`

Create an enhanced store with method composition.

### `createPersistStore(initialState, methods, options)`

Create a persistent store that syncs to localStorage.

### Built-in Methods

- `update(updater)` - Safe state mutations with auto-cloning
- `markUpdate()` - Manual update timestamp
- `lastUpdateTime` - Timestamp of last change

### Utilities

- `deepClone<T>(obj)` - Deep clone any object
- `ensure<T>(obj, keys)` - Validate required properties

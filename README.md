# Zustand Enhanced

Enhanced Zustand stores with persistence and update tracking

## Installation

```bash
npm install zustand-plus
```

## Features

- 🔄 **Automatic Update Tracking** - Built-in `lastUpdateTime` and `markUpdate()`
- 🛡️ **Safe State Mutations** - `update()` method with automatic deep cloning
- 💾 **Easy Persistence** - Simplified persistent store creation
- 🔗 **Method Composition** - Call methods from within other methods
- 🧰 **Utility Functions** - Deep cloning and validation helpers
- 📦 **TypeScript Support** - Full type safety out of the box

## Quick Start

```typescript
import { createStore, createPersistStore } from "zustand-plus";

// Basic store
const useCounter = createStore({ count: 0 }, (set, get) => ({
  increment: () => set((state) => ({ count: state.count + 1 })),
  safeUpdate: () =>
    get().update((state) => {
      state.count += 10; // Mutate safely
    }),
}));

// Persistent store
const useSettings = createPersistStore(
  { theme: "light", language: "en" },
  (set, get) => ({
    updateTheme: (theme) => set({ theme }),
    bulkUpdate: (updates) =>
      get().update((state) => {
        Object.assign(state, updates);
      }),
  }),
  { name: "app-settings" }
);
```

## Feature Demos

### 🔗 Method Composition

Call methods from within other methods - impossible with standard Zustand:

```typescript
const useTaskStore = createStore({ tasks: [], filter: "all" }, (set, _get) => {
  function get() {
    return { ..._get(), ...methods };
  }

  const methods = {
    addTask: (task) =>
      set((state) => ({
        tasks: [...state.tasks, { ...task, id: Date.now() }],
      })),

    clearCompleted: () =>
      set((state) => ({
        tasks: state.tasks.filter((t) => !t.completed),
      })),

    // ✨ Call other methods seamlessly
    addAndCleanup: (task) => {
      get().addTask(task);
      get().clearCompleted();
      get().markUpdate(); // Built-in tracking
    },
  };

  return methods;
});
```

### 🛡️ Safe State Mutations

Mutate complex nested state without manual cloning:

```typescript
const useCartStore = createStore(
  { items: [], totals: { subtotal: 0, tax: 0, total: 0 } },
  (set, get) => ({
    updateQuantity: (productId, quantity) => {
      get().update((state) => {
        // Direct mutation - automatically cloned
        const item = state.items.find((i) => i.id === productId);
        if (item) {
          item.quantity = quantity;
          item.total = item.price * quantity;
        }

        // Recalculate totals
        state.totals.subtotal = state.items.reduce(
          (sum, item) => sum + item.total,
          0
        );
        state.totals.tax = state.totals.subtotal * 0.1;
        state.totals.total = state.totals.subtotal + state.totals.tax;
      });
    },
  })
);
```

### 🔄 Automatic Update Tracking

Built-in tracking without extra setup:

```typescript
const useDataStore = createStore(
  { data: null, loading: false },
  (set, get) => ({
    fetchData: async () => {
      set({ loading: true });
      const data = await api.getData();
      set({ data, loading: false });
      // lastUpdateTime automatically updated
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

### 💾 Simple Persistence

One-line persistent stores:

```typescript
const useUserPreferences = createPersistStore(
  {
    theme: "light",
    notifications: true,
    language: "en",
  },
  (set, get) => ({
    toggleTheme: () =>
      set((state) => ({
        theme: state.theme === "light" ? "dark" : "light",
      })),

    updateSettings: (settings) =>
      get().update((state) => {
        Object.assign(state, settings);
      }),
  }),
  { name: "user-preferences" } // Automatically synced to localStorage
);
```

## Why Better Than Standard Zustand?

| Feature            | Standard Zustand                | Zustand Enhanced                   |
| ------------------ | ------------------------------- | ---------------------------------- |
| Method composition | ❌ `get()` only returns state   | ✅ `get()` returns state + methods |
| Complex updates    | ❌ Manual deep cloning required | ✅ `update()` handles cloning      |
| Update tracking    | ❌ Manual implementation needed | ✅ Built-in `lastUpdateTime`       |
| Persistence        | ❌ Verbose middleware setup     | ✅ One-line `createPersistStore`   |

## API Reference

### `createStore(state, methods)`

Creates an enhanced store with update tracking and method composition.

### `createPersistStore(state, methods, options)`

Creates a persistent store that syncs to localStorage.

### Built-in Methods

- `update(updater)` - Safe state mutations with auto-cloning
- `markUpdate()` - Manual update timestamp
- `lastUpdateTime` - Timestamp of last change

### Utilities

- `deepClone(obj)` - Deep clone objects
- `ensure(obj, keys)` - Validate required properties
# zustand-plus
# zustand-plus

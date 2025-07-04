// @ts-ignore
import { create } from "zustand";
import { combine, persist } from "zustand/middleware";
import { deepClone } from "./utils/clone";

export type Updater<T> = (updater: (value: T) => void) => void;

type SecondParam<T> = T extends (
  _f: infer _F,
  _s: infer S,
  ...args: infer _U
) => any
  ? S
  : never;

type MakeUpdater<T> = {
  lastUpdateTime: number;

  markUpdate: () => void;
  update: Updater<T>;
};

export type SetStoreState<T> = {
  (
    partial: T | Partial<T> | ((state: T) => T | Partial<T>),
    replace?: boolean
  ): void; // Change here to allow `boolean` for replace
  (state: T | ((state: T) => T), replace: true): void;
};

export function createPersistStore<T extends object, M>(
  state: T,
  methods: (
    set: SetStoreState<T & MakeUpdater<T>>,
    get: () => T & MakeUpdater<T>
  ) => M,
  persistOptions: SecondParam<typeof persist<T & M & MakeUpdater<T>>>
) {
  return create(
    persist(
      combine(
        {
          ...state,
          lastUpdateTime: 0,
        },
        (set, get) => {
          return {
            ...methods(set as any, get as any),

            markUpdate() {
              set({ lastUpdateTime: Date.now() } as Partial<
                T & M & MakeUpdater<T>
              >);
            },
            update(updater) {
              const state = deepClone(get());
              updater(state);
              set({
                ...state,
                lastUpdateTime: Date.now(),
              });
            },
          } as M & MakeUpdater<T>;
        }
      ),
      persistOptions as any
    )
  );
}

export function createStore<T extends object, M>(
  state: T,
  methods: (
    set: SetStoreState<T & MakeUpdater<T>>,
    get: () => T & MakeUpdater<T>
  ) => M
) {
  return create(
    combine(
      {
        ...state,
        lastUpdateTime: 0,
      },
      (set, get) => {
        return {
          ...methods(set as any, get as any),

          markUpdate() {
            set({ lastUpdateTime: Date.now() } as Partial<
              T & M & MakeUpdater<T>
            >);
          },
          update(updater) {
            const state = deepClone(get());
            updater(state);
            set({
              ...state,
              lastUpdateTime: Date.now(),
            });
          },
        } as M & MakeUpdater<T>;
      }
    )
  );
}

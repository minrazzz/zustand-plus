import * as zustand_middleware from 'zustand/middleware';
import { persist } from 'zustand/middleware';
import * as zustand from 'zustand';

type Updater<T> = (updater: (value: T) => void) => void;
type SecondParam<T> = T extends (_f: infer _F, _s: infer S, ...args: infer _U) => any ? S : never;
type MakeUpdater<T> = {
    lastUpdateTime: number;
    markUpdate: () => void;
    update: Updater<T>;
};
type SetStoreState<T> = {
    (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean): void;
    (state: T | ((state: T) => T), replace: true): void;
};
declare function createPersistStore<T extends object, M>(state: T, methods: (set: SetStoreState<T & MakeUpdater<T>>, get: () => T & MakeUpdater<T>) => M, persistOptions: SecondParam<typeof persist<T & M & MakeUpdater<T>>>): zustand.UseBoundStore<Omit<zustand.StoreApi<Omit<T & {
    lastUpdateTime: number;
}, keyof M | keyof MakeUpdater<T>> & M & MakeUpdater<T>>, "persist"> & {
    persist: {
        setOptions: (options: Partial<zustand_middleware.PersistOptions<Omit<T & {
            lastUpdateTime: number;
        }, keyof M | keyof MakeUpdater<T>> & M & MakeUpdater<T>, Omit<T & {
            lastUpdateTime: number;
        }, keyof M | keyof MakeUpdater<T>> & M & MakeUpdater<T>>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: Omit<T & {
            lastUpdateTime: number;
        }, keyof M | keyof MakeUpdater<T>> & M & MakeUpdater<T>) => void) => () => void;
        onFinishHydration: (fn: (state: Omit<T & {
            lastUpdateTime: number;
        }, keyof M | keyof MakeUpdater<T>> & M & MakeUpdater<T>) => void) => () => void;
        getOptions: () => Partial<zustand_middleware.PersistOptions<Omit<T & {
            lastUpdateTime: number;
        }, keyof M | keyof MakeUpdater<T>> & M & MakeUpdater<T>, Omit<T & {
            lastUpdateTime: number;
        }, keyof M | keyof MakeUpdater<T>> & M & MakeUpdater<T>>>;
    };
}>;
declare function createStore<T extends object, M>(state: T, methods: (set: SetStoreState<T & MakeUpdater<T>>, get: () => T & MakeUpdater<T>) => M): zustand.UseBoundStore<zustand.StoreApi<Omit<T & {
    lastUpdateTime: number;
}, keyof M | keyof MakeUpdater<T>> & M & MakeUpdater<T>>>;

declare function deepClone<T>(obj: T): T;
declare function ensure<T extends object>(obj: T, keys: Array<keyof T>): boolean;

export { type SetStoreState, type Updater, createPersistStore, createStore, deepClone, ensure };

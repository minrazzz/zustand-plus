export function getMergedState<T, M>(_get: () => T & M, methods: M): T & M {
  return {
    ..._get(),
    ...methods,
  };
}

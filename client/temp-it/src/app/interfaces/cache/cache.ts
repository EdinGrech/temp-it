//create a cache type that will take a generic type and has a state property, error property wit ha message
export type CacheContentState = 'LOADING' | 'LOADED' | 'ERROR' | 'EMPTY';

export interface ContentCache<T = unknown> {
  state: CacheContentState;
  error?: string;
  message?: string;
  data?: T;
}

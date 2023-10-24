//create a cache type that will take a generic type and has a state property, error property wit ha message
export type State = 'LOADING' | 'LOADED' | 'ERROR' | 'EMPTY';

export interface ContentCache<T> {
  state: State;
  error?: string;
  data?: T;
}

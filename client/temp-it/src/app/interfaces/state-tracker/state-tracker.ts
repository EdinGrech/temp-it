export interface RequestState<T = unknown> {
  state: 'LOADING' | 'LOADED' | 'ERROR' | 'EMPTY';
  data?: T;
  error?: string;
}

import store from '../store';

export function previousState(path: string = 'calendarV2.calendarInfo'): any {
  // Cast the state to any to allow dynamic key access
  const state = store.getState() as any;
  return path
    .split('.')
    .reduce((prev, key) => (prev ? prev[key] : undefined), state);
}

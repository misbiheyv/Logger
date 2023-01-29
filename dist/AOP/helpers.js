export function isPropertyKey(o) {
    return typeof o === 'string' || typeof o === 'symbol' || typeof o === 'number';
}
export function isIterable(o) {
    return typeof o === 'object' && o != null && typeof o[Symbol.iterator] === 'function';
}
export function cast(obj) {
    return obj;
}

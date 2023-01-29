export function isPropertyKey(o: any): o is PropertyKey {
    return typeof o === 'string' || typeof o === 'symbol' || typeof o === 'number';
}

export function isIterable(o: any): o is Iterable<unknown> {
    return typeof o === 'object' && o != null && typeof o[Symbol.iterator] === 'function';
}

export function cast<T>(obj: any): T {
    return obj;
}

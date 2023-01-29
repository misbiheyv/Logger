export const getMethodNamesFromObject = (obj) => Object
    .getOwnPropertyNames(Object.getPrototypeOf(obj))
    .filter(name => typeof Object.getPrototypeOf(obj)[name] === 'function');
export const getMethodNamesFromFunction = (obj) => Object
    .getOwnPropertyNames(obj.prototype)
    .filter(name => typeof obj.prototype[name] === 'function');
export function replaceMethod({ target, methodName, advice, aspect }) {
    const originalCode = target[methodName];
    target[methodName] = (...args) => {
        if (["before", "around"].includes(advice))
            aspect.apply(target, args);
        const returnedValue = originalCode.apply(target, args);
        if (["after", "around"].includes(advice))
            aspect.apply(target, args);
        return "replace" == advice
            ? aspect.apply(target, [returnedValue])
            : returnedValue;
    };
}
export function inject(target, methods, adviceAspect) {
    const replaceTarget = target.prototype != null
        ? target.prototype
        : Object.getPrototypeOf(target);
    let methodNames = target.prototype != null
        ? getMethodNamesFromFunction(target)
        : getMethodNamesFromObject(target);
    if (methods instanceof Array) {
        methodNames = methodNames.filter(name => methods.includes(name));
    }
    else if (methods != null && methods != '*') {
        methodNames = methodNames.filter(name => methods === name);
    }
    for (const methodName of methodNames) {
        for (const [advice, aspect] of adviceAspect) {
            replaceMethod({ target: replaceTarget, methodName, aspect, advice });
        }
    }
}

export const getMethodNames = (obj) => Object
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
    let methodNames;
    if (methods == '*') {
        methodNames = getMethodNames(target);
    }
    else if (methods instanceof Array) {
        methodNames = getMethodNames(target).filter(name => methods.includes(name));
    }
    else {
        methodNames = getMethodNames(target).filter(name => methods === name);
    }
    for (const methodName of methodNames) {
        for (const [advice, aspect] of adviceAspect) {
            replaceMethod({ target: target.prototype, methodName, aspect, advice });
        }
    }
}

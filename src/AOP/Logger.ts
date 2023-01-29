import type { Advice } from "./interface";
import { inject, replaceMethod } from "./baseMethods";
import { cast } from "./helpers";

type LoggerAdvices = Exclude<Advice, 'replace'>;

export default abstract class Logger {
    private static aspect: Function;

    public static get log(): typeof this {
        this.aspect = (...args: any[]) => () => console.log(`[[ LOG ]]`, ...args);
        return this;
    }

    public static get warn(): typeof this {
        this.aspect = (...args: any[]) => () => console.warn(`[[ WARN ]]`, ...args);
        return this;
    }

    public static get error(): typeof this {
        this.aspect = (...args: any[]) => () => console.error(`[[ ERROR ]]`, ...args);
        return this;
    }

    public static write(adviceMessage: Iterable<[LoggerAdvices, string]>): MethodDecorator;
    public static write(methods: PropertyKey | PropertyKey[], adviceMessage: Iterable<[LoggerAdvices, string]>): ClassDecorator;
    public static write(
        param1: PropertyKey | PropertyKey[] | Iterable<[LoggerAdvices, string]>,
        param2?: Iterable<[LoggerAdvices, string]>,
    ): ClassDecorator | MethodDecorator {
        return this.callDecorator(param1, param2);
    }

    protected static callDecorator(param1: unknown, param2: unknown) {
        if (arguments.length === 2 && arguments[1] != undefined) {
            return this.classLogDecorator(cast(param1), cast(param2));
        }

        return this.methodLogDecorator(cast(param1));
    }

    protected static methodLogDecorator(
        adviceMessage: Iterable<[LoggerAdvices, string]>
    ): MethodDecorator {
        return (target, propertyKey, descriptor) => {
            for (const [advice, message] of adviceMessage) {
                replaceMethod({
                    target: descriptor,
                    methodName: 'value',
                    advice,
                    aspect: this.aspect(message)
                })
            }

            return descriptor;
        }
    }

    protected static classLogDecorator(
        methods: PropertyKey | PropertyKey[],
        adviceMessage: Iterable<[LoggerAdvices, string]>
    ): ClassDecorator {
        const adviceAspect = new Map<LoggerAdvices, Function>();

        for (const [advice, message] of adviceMessage) {
            adviceAspect.set(advice, this.aspect(message))
        }

        return (ctor: Function) => {
            inject(ctor, methods, adviceAspect);
        }
    }
}

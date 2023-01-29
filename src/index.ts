import Logger from "./AOP/Logger";

@Logger.warn.write(
    "*",
    [
        ['before', 'class before'],
        ['after', 'class after'],
    ],
)
class MyMath {
    @Logger.error.write([
        ['before', 'method before'],
        ['after', 'method after']
    ])
    public sum(a: number, b: number) {
        return a + b;
    }

    @Logger.log.write([
        ['before', 'method before'],
        ['after', 'method after']
    ])
    public multiply(a: number, b: number) {
        return a * b;
    }
}

const o = new MyMath();

o.sum(1, 2);

o.multiply(1, 2);

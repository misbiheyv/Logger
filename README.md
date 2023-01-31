# Реализация логгера в АОП подходе

### Логирование реализуется 2 способами:
1) [через декораторы из класса Logger](#logger)
2) [через функцию log](#log)

# <a name="logger">API класса Logger:</a>

### Методы:

- write(adviceMessage: Iterable<[LoggerAdvices, string]>): MethodDecorator\
Реализует декоратор метода, который будет логироваться

- write(methods: PropertyKey | PropertyKey[], adviceMessage: Iterable<[LoggerAdvices, string]>): ClassDecorator\
Реализует декоратор класса, указанные методы которого будут логироваться

### Свойства:

Свойства геттеры, которые задают соответствующий уровень логирования

- log - соответствует console.log
- warn - соответствует console.warn
- error - соответствует console.error

### Примеры использования:

Декоратор класса
```ts
@Logger.log.write(
  'sum', // чтобы пометить все методы укажите символ '*'
  [
    ['before', 'before sum'],
    ['after', 'after sum'],
  ]
)
class MathExpressions {
  public sum(a: number, b: number) {
    return a + b;
  }
}

new MathExpressions().sum(1, 2); // >> before sum, after sum
```

Декоратор метода
```ts
class MathExpressions {
  Logger.warn.write([
    ['before', 'method is deprecated']
  ])
  public sum(a: number, b: number) {
    return a + b;
  }
}

new MathExpressions().sum(1, 2); // warn: method is deprecated
```

# <a name="log">интерфейс функции log:</a>

type Advice = 'before' | 'after' | 'around' | 'replace'

type LogLevel = 'log' | 'warn' | 'error';

log(
  obj: Record<PropertyKey, any>,
  method: PropertyKey,
  adviceMessage: Iterable<[Advice, string]>,
  logLevel: LogLevel = 'log'
)

### Пример использования:
```ts
class MathExpressions {
  public sum(a: number, b: number) {
    return a + b;
  }
}

const m = new MathExpressions();

log(m, 'sum', [['around', 'sum']])

m.sum(1, 2) // >> sum, sum
```

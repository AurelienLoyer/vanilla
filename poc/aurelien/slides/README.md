# SLIDES

## Escmascript 2015 / ES6

### let + const

### Class

```js
class MyError extends Error {
  constructor(m) {
    super(m);
  }
}

const error = new Error("ll");
const myerror = new MyError("ll");

console.log(error.message); //shows up correctly
console.log(myerror.message); //shows empty string

class ExtendableError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
} 

// now I can extend
class MyError extends ExtendableError {}
const myerror = new MyError("ll");
console.log(myerror.message);
console.log(myerror instanceof Error);
console.log(myerror.name);
console.log(myerror.stack);

// pas du java !

// mais de l'extension prototypal
// l'extension de Error ne marchera pas :)
```

### Enhanced object literals

### Template String

```js
const name = "DevFest";
const date = "Today";

const conf = {
  name,
  date,
  start() {
    //...
  }
};

const toto = `${conf.name} start ${conf.date}`;
// Devfest start Today

```

### Arrow

**Remember scoping**

```js
```
 
### Rest + Spread
**Destructuring**

```js
// exemple de code React

<Component x={} y={} z={} /> 
// OR
const props = { x: 1, y: 1, z:1 };

<Component {...props} />
```

```js

function test(...rest) {
 	console.log(rest)
 	console.log({...rest})
	console.log([...arguments])
 	console.log(arguments)
}

test(1,"test",78)

> Array [1, "test", 78]
> Object { 0: 1, 1: "test", 2: 78 }
> Array [1, "test", 78]
> Object { 0: 1, 1: "test", 2: 78 }

```

### function default value

```js
function add(x, y=1){
    return x+y;
} 
add(1) // 2
```

### interator + for .. of

### generator

### Symbols

### promises

### Proxies

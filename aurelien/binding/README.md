# BINDING

## MENU

### [Simplae state binding](01-simple-state-binding.html)

### [Complex state binding](02-complex-state-binding.html)

### [Templating / Interpolation](03-interpolation-templating.html)

**_Marche pas !_**

```
// and define set for next object update
Object.defineProperty(this.state, stateKey, {
set: newValue => {
    this.updateElementsAttribute(
    this.stateElements[stateKey],
    attributeToUpdate,
    this.newValue
    );
}
});
```

**_Solution_**

?

### [Interpolation](04-interpolation.html)

## STEPS

find data-_ || z-bind:_ impossible -> regarder dans les specs

### One way

### Two way

### Mutation Observer

Exemple

```js
new MutationObserver( function callback );
```

[Documentation](https://developer.mozilla.org/fr/docs/Web/API/MutationObserver)

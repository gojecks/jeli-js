# @jeli/form

Reactive form controls for [jeli](https://github.com/gojecks/jeli-js) — a `FormGroup`/`FormControl`-shaped model (named `FormControlService`/`FormFieldControlService` here), validators, and value accessors that make two-way binding behave correctly across native input types (text, checkbox, radio, select, number, range).

## Install

```sh
npm install @jeli/form
```

## Setup

```js
import { FormModule } from '@jeli/form';

jModule({
    requiredModules: [FormModule],
    ...
})
export class AppModule {}
```

## The simple case: two-way binding with `{:model}`

For a plain property with no group/validation needs, `{:model}` (the `model` directive) is the shortest path — it wraps its own internal single-field control automatically:

```html
<input {:model}="user.name" placeholder="Name">
<input type="checkbox" {:model}="user.subscribed"> Subscribe
```

## The model: `FormControlService` (group) and `FormFieldControlService` (single field)

Both extend a shared `FormControlAbstract`, so they carry the same state/API — the naming is the reverse of what it sounds like coming from Angular:

| jeli | Roughly equivalent to (Angular) | Holds |
|---|---|---|
| `FormFieldControlService` | `FormControl` | One value |
| `FormControlService` | `FormGroup` | Named `FormFieldControlService`/nested `FormControlService` instances |
| `FormRepeaterService` | `FormArray` | An indexed array of controls (or of full `FormControlService` groups, if given a field config) |

Shared state/methods (`FormControlAbstract`), available on all three:

```js
control.value                       // current value
control.valid / control.invalid     // derived from status
control.enabled / control.disabled
control.touched / control.untouched
control.error                       // null, or { validatorName: true, ... }
control.valueChanges                // EventEmitter, fires on every value change
control.statusChanged               // EventEmitter, fires on valid/invalid/disabled transitions

control.setValue(value, options?)
control.patchValue(value, options?)
control.reset(value?, options?)
control.enable(options?) / control.disable(options?)
control.markAsTouched(options?) / control.markAsUntouched(options?)
control.setValidators(validatorConfig)
control.getError(name) / control.hasError(name)
```

`FormControlService` (the group) additionally has `addField`/`removeField`/`getField(name)` (dot-path names resolve nested groups, e.g. `getField('address.city')`), `patchValue`/`setValue` keyed by field name, `forEachField(cb)`, `allTouched()`, and `getAllValues()`.

```js
Service({ DI: [FormControlService] })
export class SignupFormService {
    constructor() {
        this.form = new FormControlService({
            name: { value: '', validators: { required: true, minlength: 2 } },
            email: { value: '', validators: { required: true, emailvalidation: true } }
        });
    }
}
```

## Directives

| Selector | Binds to | Usage |
|---|---|---|
| `model` | a plain property, via its own internal `FormFieldControlService` | `<input {:model}="user.name">` |
| `formControl` | a `FormControlService` (group) instance, on the container | `<form {formControl}="form">` |
| `formControlName` | a named field within the nearest ancestor `formControl` | `<input formControlName="email">` |
| `formField` | declares + auto-registers a field on the nearest ancestor `formControl`, by name | `<input formField="email">` |
| `fieldControl` | a standalone `FormFieldControlService` instance directly, no group | `<input {fieldControl}="emailControl">` |

```html
<form {formControl}="form">
    <input formField="name" placeholder="Name">
    <input formField="email" type="email" placeholder="Email">
    <button type="submit" {disabled}="form.invalid">Submit</button>
</form>
```

The right-value accessor (`DefaultEventBinder` for text/textarea, `CheckboxEventBinder`, `RadioEventBinder`, `SelectEventBinder`, `NumberEventBinder`, `RangeEventBinder`) is selected automatically based on the element/input type — nothing to configure.

## Validators

Two ways to attach validators, and they can combine:

1. **Native HTML5 attributes** — `required`, `pattern`, `minlength`, `maxlength` on the element itself are picked up automatically (via the framework's `VALIDATORS` static injection token):
   ```html
   <input formField="username" required minlength="3">
   ```
2. **Explicit config**, passed when constructing a `FormControlService`/`FormFieldControlService`, or via `control.setValidators({...})` — keys are matched case-insensitively against the built-in validator stack:
   ```js
   { required: true, minlength: 3, maxlength: 20, pattern: '^[a-z0-9_]+$' }
   ```
   Built in: `required`, `requiredtrue`, `minlength`, `maxlength`, `pattern`, `emailvalidation`, `minnumber`, `maxnumber`, `domainvalidation`, `mediumpasswordstrength`, `strongpasswordstrength`, `isempty`, `boolean`. A validator's value can also be a plain function `(value) => boolean`, or an `async` key for an async validator.

Register a new one globally:

```js
import { customFormValidator } from '@jeli/form';

customFormValidator('matchesField', (value, otherFieldValue) => value === otherFieldValue);
```

Full reference: **[API docs](https://gojecks.github.io/jeli-js/api/#form)** · **[Guide](https://gojecks.github.io/jeli-js/guide/#forms)**

## License

MIT

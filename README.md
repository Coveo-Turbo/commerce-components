# CommerceComponents

Commerce Components Bundle

Disclaimer: This component was built by the community at large and is not an official Coveo JSUI Component. Use this component at your own risk.

## Getting Started

1. Install the component into your project.

```
npm i @coveops/commerce-components
```

2. Use the Component or extend it

Typescript:

```javascript
import { CommerceComponents, ICommerceComponentsOptions } from '@coveops/commerce-components';
```

Javascript

```javascript
const CommerceComponents = require('@coveops/commerce-components').CommerceComponents;
```

3. You can also expose the component alongside other components being built in your project.

```javascript
export * from '@coveops/commerce-components'
```

4. Include the component in your template as follows:

Place the component in your markup:

```html
<div class="CoveoCommerceComponents"></div>
```

## Extending

Extending the component can be done as follows:

```javascript
import { CommerceComponents, ICommerceComponentsOptions } from "@coveops/commerce-components";

export interface IExtendedCommerceComponentsOptions extends ICommerceComponentsOptions {}

export class ExtendedCommerceComponents extends CommerceComponents {}
```

## Contribute

1. Clone the project
2. Copy `.env.dist` to `.env` and update the COVEO_ORG_ID and COVEO_TOKEN fields in the `.env` file to use your Coveo credentials and SERVER_PORT to configure the port of the sandbox - it will use 8080 by default.
3. Build the code base: `npm run build`
4. Serve the sandbox for live development `npm run serve`
# CommerceComponents

Commerce Components Bundle

Disclaimer: This component was built by the community at large and is not an official Coveo JSUI Component. Use this component at your own risk.

## Available Components

### Dynamic Color Facet

Displays a dynamic facet where the check boxes are the color of their corresponding field value option. This component extends the DynamicFacet component, therefore all dynamic facet options can be used.

### Dynamic Size Facet

Displays a dynamic facet where the field value options are organized numerically in a grid. This component extends the DynamicFacet component, therefore all dynamic facet options can be used.

### Store Facet

Displays a facet that allows you to filter items based on availability in a particular store. The store options in the facet are ordered by distance from the end user. This component extends the Facet component, therefore all facet options can be used.

### Store Picker

Displays a check box that allows you to filter results based on a single chosen store location.

## Getting Started

### Testing the Components

For quick testing, you can add the script from unpkg:

```html
<script src="https://unpkg.com/@coveops/commerce-components@latest/dist/index.min.js"></script>
```

> Disclaimer: Unpkg should be used for testing but not for production.

### Using the Components

1. Install the component bundle into your project.

    ```
    npm i @coveops/commerce-components
    ```

2. Use the components or extend them:

    Typescript

    ```javascript
    import { DynamicColorFacet } from '@coveops/commerce-components';
    import { DynamicSizeFacet } from '@coveops/commerce-components';
    import { StoreFacet } from '@coveops/commerce-components';
    import { StorePicker } from '@coveops/commerce-components';
    ```

    Javascript

    ```javascript
    const DynamicColorFacet = require('@coveops/commerce-components').DynamicColorFacet;
    const DynamicSizeFacet = require('@coveops/commerce-components').DynamicSizeFacet;
    const StoreFacet = require('@coveops/commerce-components').StoreFacet;
    const StorePicker = require('@coveops/commerce-components').StorePicker;
    ```

3. You can also expose the components alongside other components being built in your project.

    ```javascript
    export * from '@coveops/commerce-components'
    ```

4. Include the components in your template as follows:

    Place the component in your markup:

    ```html
    <div class="CoveoDynamicColorFacet" data-field="@color"></div>

    <div class="CoveoDynamicSizeFacet" data-field="@productsize"></div>

    <div class="CoveoStoreFacet" data-title="Store" data-field="@storename" data-computed-field="@distance"
         data-computed-field-format="n2" data-sort-criteria="computedfieldascending" data-number-of-values-in-facet-search='8'
         data-enable-facet-search="true" data-enable-expand-collapse="true" data-auto-collapse="false"
         data-number-of-values="8" data-enable-settings="false"></div>

    <div class="CoveoStorePicker"></div>
    ```

## Coveo Platform Configuration

In order for the Commerce Components to work as expected, you must have created an Omni-Channel Catalog in your organization. This requires you to have first [indexed catalog content](https://docs.coveo.com/en/2956) with the appropriate metadata.

## Extending

Extending a component can be done as follows:

```javascript
import { DynamicColorFacet, IDynamicColorFacetOptions } from "@coveops/commerce-components";

export interface IExtendedDynamicColorFacetOptions extends IDynamicColorFacetOptions {}

export class ExtendedDynamicColorFacet extends DynamicColorFacet {}
```

## Contribute

1. Clone the project
2. Copy `.env.dist` to `.env` and update the COVEO_ORG_ID and COVEO_TOKEN fields in the `.env` file to use your Coveo credentials and SERVER_PORT to configure the port of the sandbox - it will use 8080 by default.
3. Build the code base: `npm run build`
4. Serve the sandbox for live development `npm run serve`

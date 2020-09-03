import { DynamicFacet, IDynamicFacetOptions, IComponentBindings, ComponentOptions } from 'coveo-search-ui';
import { lazyComponent } from '@coveops/turbo-core';

export interface IDynamicColorFacetOptions extends IDynamicFacetOptions {}

@lazyComponent
export class DynamicColorFacet extends DynamicFacet {
    static ID = 'DynamicColorFacet';
    static options: IDynamicColorFacetOptions = {};

    constructor(public element: HTMLElement, public options: IDynamicColorFacetOptions, public bindings: IComponentBindings) {
        super(element, options, bindings);
        this.options = ComponentOptions.initComponentOptions(element, DynamicColorFacet, options);

        this.bind.onRootElement(Coveo.QueryEvents.deferredQuerySuccess, this.handleDeferredQuerySuccess);
    }

    private handleDeferredQuerySuccess(args: Coveo.IQuerySuccessEventArgs) {
        let facetValues: NodeListOf<HTMLElement> = this.element.querySelectorAll('.coveo-dynamic-facet-value');
        _.forEach(facetValues, (el: HTMLElement) => {
            let button = <HTMLElement>el.querySelector('.coveo-checkbox-button');
            if (!!button) {
                button.style.background = el.getAttribute('data-value');
            }
        });
    }
}
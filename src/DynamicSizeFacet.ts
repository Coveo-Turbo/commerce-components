import { DynamicFacet, IDynamicFacetOptions, IComponentBindings, ComponentOptions } from 'coveo-search-ui';
import { lazyComponent } from '@coveops/turbo-core';

export interface IDynamicSizeFacetOptions extends IDynamicFacetOptions {}

@lazyComponent
export class DynamicSizeFacet extends DynamicFacet {
    static ID = 'DynamicSizeFacet';
    static options: IDynamicSizeFacetOptions = {};

    constructor(public element: HTMLElement, public options: IDynamicSizeFacetOptions, public bindings: IComponentBindings) {
        super(element, options, bindings);
        this.options = ComponentOptions.initComponentOptions(element, DynamicSizeFacet, options);

        this.bind.onRootElement(Coveo.QueryEvents.deferredQuerySuccess, this.handleDeferredQuerySuccess);
    }

    private handleDeferredQuerySuccess(args: Coveo.IQuerySuccessEventArgs) {
        let facetValues: NodeListOf<HTMLElement> = this.element.querySelectorAll('.coveo-dynamic-facet-value');
        let valuesDict = [];
        _.forEach(facetValues, (el) => {
            valuesDict.push({ 'el': el, 'value': Number.parseFloat(el.getAttribute('data-value')) });
        });
        let sortedValues = _.sortBy(valuesDict, 'value');

        let valuesParentEl = this.element.querySelector('.coveo-dynamic-facet-values');
        if (!!valuesParentEl) {
            let showMore = <HTMLElement>valuesParentEl.querySelector('li:last-child');

            valuesParentEl.innerHTML = '';

            _.forEach(sortedValues, (value) => {
                valuesParentEl.appendChild(value.el);
            });

            !!showMore && valuesParentEl.appendChild(showMore);
        }

    }
}

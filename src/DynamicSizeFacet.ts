import { DynamicFacet, IDynamicFacetOptions, IComponentBindings, ComponentOptions } from 'coveo-search-ui';
import { lazyComponent } from '@coveops/turbo-core';

export interface IDynamicSizeFacetOptions extends IDynamicFacetOptions {}

@lazyComponent
export class DynamicSizeFacet extends DynamicFacet {
    static ID = 'DynamicSizeFacet';
    static options: IDynamicSizeFacetOptions = {};

    public observer;

    constructor(public element: HTMLElement, public options: IDynamicSizeFacetOptions, public bindings: IComponentBindings) {
        super(element, options, bindings);
        this.options = ComponentOptions.initComponentOptions(element, DynamicSizeFacet, options);

        this.bind.onRootElement(Coveo.QueryEvents.deferredQuerySuccess, this.handleDeferredQuerySuccess);
    }

    private handleDeferredQuerySuccess(args: Coveo.IQuerySuccessEventArgs) {
        if (!!this.observer) {
            this.observer.disconnect();
            this.observer = undefined;
        }

        let facetValues: NodeListOf<HTMLElement> = this.element.querySelectorAll('.coveo-dynamic-facet-value');
        let valuesDict = [];
        _.forEach(facetValues, (el) => {
            valuesDict.push({ 'el': el, 'value': Number.parseFloat(el.getAttribute('data-value')) });
        });
        let sortedValues = _.sortBy(valuesDict, 'value');

        let valuesParentEl = this.element.querySelector('.coveo-dynamic-facet-values');
        if (!!valuesParentEl) {
            let specialChildList = [];
            _.forEach(valuesParentEl.children, (childEl) => {
                if (!childEl.classList.contains('coveo-dynamic-facet-value')) {
                    specialChildList.push(childEl);
                }
            });

            valuesParentEl.innerHTML = '';

            _.forEach(sortedValues, (value) => {
                valuesParentEl.appendChild(value.el);
            });

            _.forEach(specialChildList, (specialChild) => {
                valuesParentEl.appendChild(specialChild);
            });

            this.bindMutationObserver();
        }
    }

    public bindMutationObserver() {
        const mutationEl = <HTMLElement>this.element.querySelector('.coveo-dynamic-facet-values');
        if (!this.observer) {
            this.observer = new MutationObserver((mutationList, observer) => {
                this.handleDeferredQuerySuccess(undefined);
            });

            this.observer.observe(mutationEl, { attributes: false, childList: true, subtree: false });
        }
    }
}

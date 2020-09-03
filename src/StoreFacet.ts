import { Facet, IFacetOptions, IComponentBindings, ComponentOptions, DistanceResources } from 'coveo-search-ui';
import { lazyComponent } from '@coveops/turbo-core';

export interface IStoreFacetOptions extends IFacetOptions {}

@lazyComponent
export class StoreFacet extends Facet {
    static ID = 'StoreFacet';
    static options: IStoreFacetOptions = { };

    static distanceResourcesComponent: Coveo.DistanceResources;

    constructor(public element: HTMLElement, public options: IStoreFacetOptions, public bindings: IComponentBindings) {
        super(element, options, bindings);
        this.options = ComponentOptions.initComponentOptions(element, StoreFacet, options);

        this.validateOptions();
        this.validateDistanceResources();
    }

    private validateOptions() {
        (this.options.computedFieldFormat !== 'n2') && this.logger.warn('The StoreFacet component works best with the computedFieldFormat option set to n2');
        (this.options.sortCriteria !== 'computedfieldascending') && this.logger.warn('The StoreFacet component works best with the computedFieldFormat option set to computedfieldascending')
    }

    private validateDistanceResources() {
        let distanceResources = this.root.querySelector('.CoveoDistanceResources');
        if (!!distanceResources) {
            if (distanceResources.getAttribute('data-distance-field') === this.options.computedField) {
                this.logger.error('Computed field different from DistanceResources distance field');
            }
        } else {
            this.logger.error('No DistanceResources found. Initializing new component.');

            let el = Coveo.$$('div', { class: 'CoveoDistanceResources' }).el;
            this.root.insertAdjacentElement('afterbegin', el);

            StoreFacet.distanceResourcesComponent = new DistanceResources(el, {
                longitudeField: '@longitude',
                latitudeField: '@latitude',
                distanceField: this.options.computedField,
                cancelQueryUntilPositionResolved: false,
                disabledDistanceCssClass: 'coveo-distance-disabled',
                googleApiKey: undefined,
                latitudeValue: 0,
                longitudeValue: 0,
                triggerNewQueryOnNewPosition: false,
                unitConversionFactor: 1000,
                useNavigator: true
            }, { });

            // Need to find a better way to bind on the DistanceResources initialization complete event
            setTimeout(() => {
                this.logger.warn('DistanceResources initialized, resending query.');
                Coveo.logSearchEvent(this.root, {
                    name: 'Distance Resources loaded',
                    type: 'search box'
                }, { })
                Coveo.executeQuery(this.root);
            }, 200);
        }
    }
}

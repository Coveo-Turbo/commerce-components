import {
	Component,
	ComponentOptions,
	IComponentBindings,
	Initialization
} from 'coveo-search-ui';

export interface IStorePickerOptions {
	localStorageItemName: string;
	extractNameFromStore?: IStorePickerExtractNameFromStore;
	storeFacetField: string;
}

export interface IStorePickerExtractNameFromStore {
	(rawStorageContent): string;
}

export class StorePicker extends Component {
	static ID = 'StorePicker';

	static options: IStorePickerOptions = {
		localStorageItemName: ComponentOptions.buildStringOption({ defaultValue: 'bopisStore' }),
		extractNameFromStore: ComponentOptions.buildCustomOption<IStorePickerExtractNameFromStore>(() => {
			return null;
		}),
		storeFacetField: ComponentOptions.buildStringOption({ defaultValue: '@storename' })
	};

	static currentStore: any;
	filterForCurrentStore: boolean = false;

	constructor(public element: HTMLElement, public options: IStorePickerOptions, public bindings: IComponentBindings, public result: any) {
		super(element, StorePicker.ID, bindings);
		this.options = ComponentOptions.initComponentOptions(element, StorePicker, options);

		this.retrieveStoreFromLocalStorage();

		this.bind.onRootElement(Coveo.InitializationEvents.afterComponentsInitialization, (e) => {
			this.bindLocalStorageEvent();
			this.updateCurrentStore(this);
		});

		this.element.appendChild(Coveo.$$('input', { type: 'checkbox', class: 'store-picker-checkbox' }).el);
		this.element.appendChild(Coveo.$$('span', { class: 'pickup-label' }).el);

		this.bindCheckboxInput();

		if (this.storeFacetExists()) {
			this.bind.onRootElement(`state:change:f:${this.options.storeFacetField}`, this.handleStateChangeExternal);
		}
		this.bind.onRootElement(Coveo.QueryEvents.preprocessResults, this.handleQuerySuccess);
	}

	private bindLocalStorageEvent() {
		let that = this;

		let localStorageSetItemBase = localStorage.setItem;
		localStorage.setItem = function () {
			localStorageSetItemBase.apply(this, arguments);
			if (that.retrieveStoreFromLocalStorage()) {
				// Reset component
				that.element.querySelector('input').checked = false;
				Coveo.state(document.getElementById('search'), `${that.options.storeFacetField}`, '');
				// Update
				that.updateCurrentStore(that);
			}
		};

		let localStorageRemoveItemBase = localStorage.removeItem;
		localStorage.removeItem = function () {
			localStorageRemoveItemBase.apply(this, arguments);
			// Reset component
			that.retrieveStoreFromLocalStorage();
			that.element.querySelector('input').checked = false;
			Coveo.state(document.getElementById('search'), `${that.options.storeFacetField}`, '');
			that.updateCurrentStore(that);
		};
	}

	private updateCurrentStore(storePicker?) {
		Coveo.$$(this.element).removeClass('coveo-hidden');
		if (!!StorePicker.currentStore && StorePicker.currentStore !== '') {
			let label = storePicker.element.querySelector('.pickup-label');
			if (!!label) {
				label.innerHTML = `Pick Up Today at ${StorePicker.currentStore}`;
			}
			this.sendLocationToDistanceResources();
			this.checkInputStatus();
		} else {
			let label = storePicker.element.querySelector('.pickup-label');
			if (!!label) {
				label.innerHTML = `Pick Up Today at a Store Nearby`;
			}
			this.sendLocationToDistanceResources();
			this.updateStateAndQuery('');
		}
	}

	private sendLocationToDistanceResources() {
		let distanceResourceEl = document.querySelector('.CoveoDistanceResources');
		if (distanceResourceEl) {
			let distanceResourceObject = <Coveo.DistanceResources>Coveo.get(<HTMLElement>distanceResourceEl, Coveo.DistanceResources);
			distanceResourceObject.getLastPositionRequest().then((pos) => {
				distanceResourceObject.setPosition(pos.latitude, pos.longitude);
			});
		}
	}

	private bindCheckboxInput() {
		Coveo.$$(this.element.querySelector('input')).on('click', (e) => {
			this.checkInputStatus(true);
		});
	}

	private checkInputStatus(triggerQuery: boolean = false) {
		if (this.element.querySelector('input').checked) {
			this.updateStateAndQuery(StorePicker.currentStore, triggerQuery);
		} else {
			this.updateStateAndQuery('', true);
		}
	}

	private updateStateAndQuery(storeName: string = '', triggerQuery: boolean = false) {

		if (!!storeName) {
			if (this.storeFacetExists()) {
				Coveo.state(document.getElementById('search'), `f:${this.options.storeFacetField}`, [storeName]);
			} else {
				this.bind.one(this.root, Coveo.QueryEvents.doneBuildingQuery, (args: Coveo.IDoneBuildingQueryEventArgs) => {
					args.queryBuilder.advancedExpression.addFieldExpression('@storename', '==' , [storeName]);
				});
			}
		} else {
			Coveo.state(document.getElementById('search'), `f:${this.options.storeFacetField}`, '');
		}

		Coveo.logSearchEvent(this.root, {
			name: "storeChange",
			type: "storePicker"
		}, {
			selected_store: ((!!storeName) ? localStorage.getItem(this.options.localStorageItemName) : 'No Store Query')
		});

		if (triggerQuery) {
			Coveo.executeQuery(this.root);
		}
	}

	private handleQuerySuccess(args: Coveo.IQuerySuccessEventArgs) {
		if (args.results.exception && args.results.exception.code == 'InvalidQueryFunctionSyntax') {
			args.results.exception = undefined;
			Coveo.$$(this.element).addClass('coveo-hidden');
		}
	}

	private handleStateChangeExternal(args) {
		if (args.value.length == 1) {
			const testString = args.value[0].toLowerCase();
			if (testString == StorePicker.currentStore) {
				(<HTMLInputElement>this.element.querySelector('input')).checked = true;
			}
		} else {
			(<HTMLInputElement>this.element.querySelector('input')).checked = false;
		}
	}

	private retrieveStoreFromLocalStorage(): Boolean {
		StorePicker.currentStore = undefined;
		let raw = localStorage.getItem(this.options.localStorageItemName);

		try {
			if (!!this.options.extractNameFromStore) {
				StorePicker.currentStore = this.options.extractNameFromStore(raw);
			} else {
				let rawJSON = JSON.parse(raw);
				if (!!rawJSON && !!rawJSON.name)
				StorePicker.currentStore = rawJSON.name;
			}
		} catch (e) {
			StorePicker.currentStore = raw;
		}
		
		return !!StorePicker.currentStore && StorePicker.currentStore !== '';
	}

	private storeFacetExists() {
		return !!this.root.querySelector('.CoveoFacet[data-field="@storename"]') || 
		!!this.root.querySelector('.CoveoDynamicFacet[data-field="@storename"]') || 
		!!this.root.querySelector('.CoveoStoreFacet[data-field="@storename"]');
	}
}

Initialization.registerAutoCreateComponent(StorePicker);

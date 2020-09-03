import { Component, IComponentBindings, ComponentOptions } from 'coveo-search-ui';
import { lazyComponent } from "@coveops/turbo-core";
import * as $ from 'jquery';
import 'slick-carousel';

export interface ICarouselOptions {
    itemsPerPanel: number;
    mobileItemsPerPanel: number;
    delay: number;
    autoplay: boolean;
    centerMode: boolean;
}

@lazyComponent
export class Carousel extends Component {
    static ID = "Carousel";

    static options: ICarouselOptions = {
        itemsPerPanel: ComponentOptions.buildNumberOption({ defaultValue: 4 }),
        mobileItemsPerPanel: ComponentOptions.buildNumberOption({ defaultValue: 2 }),
        delay: ComponentOptions.buildNumberOption({ defaultValue: 15000 }),
        autoplay: ComponentOptions.buildBooleanOption({ defaultValue: false }),
        centerMode: ComponentOptions.buildBooleanOption({ defaultValue: false })
    };

    private isSlickInit: boolean = false;
    private slickObj: any;
    private slickOptions: any;

    constructor(public element: HTMLElement, public options: ICarouselOptions, public bindings: IComponentBindings) {
        super(element, Carousel.ID, bindings);
        this.options = ComponentOptions.initComponentOptions(element, Carousel, options);
        this.initSlickOptions();

        this.bind.onRootElement(Coveo.QueryEvents.querySuccess, this.handleQuerySuccess);
        this.bind.onRootElement(Coveo.QueryEvents.deferredQuerySuccess, this.handleDeferredQuerySuccess);
    }

    private handleQuerySuccess(args: Coveo.IQuerySuccessEventArgs) {
        let resultListLayout: HTMLElement = this.element.parentElement.querySelector('.coveo-result-list-container') || this.element.parentElement.querySelector('.coveo-result-card-container');

        if (this.isSlickInit) {
            try {
                this.slickObj = $(resultListLayout).slick('getSlick');

                this.slickObj.unslick();
                this.isSlickInit = false;
            } catch (e) {
                console.log("Slick is not working")
            }
        }

        resultListLayout.style.overflow = 'hidden';
    }

    private handleDeferredQuerySuccess(args: Coveo.IQuerySuccessEventArgs) {
        let resultListLayout: HTMLElement = this.element.parentElement.querySelector('.coveo-result-list-container') || this.element.parentElement.querySelector('.coveo-result-card-container');
        this.removePlaceholders(resultListLayout);
        resultListLayout.style.overflow = 'inherit';

        if (args.results.results.length >= this.options.itemsPerPanel) {
            try {
                $(resultListLayout).slick(this.slickOptions);
            } catch (e) {
                console.log("Slick is not working")
            }
        }

        this.isSlickInit = true;
    }

    private initSlickOptions() {
        this.slickOptions = {
            infinite: true,
            speed: 300,
            slidesToShow: this.options.itemsPerPanel,
            slidesToScroll: this.options.itemsPerPanel,
            autoplay: this.options.autoplay,
            autoplaySpeed: this.options.delay,
            centerMode: this.options.centerMode,
            responsive: [
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    arrows: false
                  }
                },
                {
                  breakpoint: 500,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false
                  }
                }
            ]
        };
    }

    private removePlaceholders(resultListLayout: HTMLElement) {
        // ChildNode remove polyfill (https://developer.mozilla.org/en-US/docs/Web/API/ChildNode/remove)
        (function (arr) {
            arr.forEach(function (item) {
              if (item.hasOwnProperty('remove')) {
                return;
              }
              Object.defineProperty(item, 'remove', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: function remove() {
                  if (this.parentNode === null) {
                    return;
                  }
                  this.parentNode.removeChild(this);
                }
              });
            });
        })([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

        let placeholders = resultListLayout.querySelectorAll('.coveo-card-layout.coveo-card-layout-padding');
        _.forEach(placeholders, (node) => {
            node.remove();
        });
    }
}

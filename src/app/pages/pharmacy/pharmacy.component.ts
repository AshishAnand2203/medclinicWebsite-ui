import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit
} from '@angular/core';

import {
    forkJoin
} from 'rxjs';

import {
    ApiService
} from '../../services/api.service';

import {
    SeoService
} from '../../services/seo.service';

@Component({
    selector: 'app-pharmacy',
    templateUrl: './pharmacy.component.html',
    styleUrls: ['./pharmacy.component.css']
})
export class PharmacyComponent
    implements OnInit, AfterViewInit, OnDestroy {

    // =====================================================
    // PAGE DATA
    // =====================================================

    page: any = null;


    // =====================================================
    // SETTINGS
    // =====================================================

    settings: any = {};


    // =====================================================
    // LOADING / ERROR
    // =====================================================

    isLoading: boolean = true;

    errorMessage: string = '';


    // =====================================================
    // SCROLL REVEAL
    // =====================================================

    private observer?: IntersectionObserver;

    private viewReady: boolean = false;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    constructor(
        private apiService: ApiService,
        private seoService: SeoService,
        private elementRef: ElementRef
    ) {}


    // =====================================================
    // INIT
    // =====================================================

    ngOnInit(): void {

        this.loadPage();

    }


    // =====================================================
    // VIEW READY
    // =====================================================

    ngAfterViewInit(): void {

        this.viewReady = true;

    }


    // =====================================================
    // LOAD PAGE + SETTINGS
    // =====================================================

    loadPage(): void {

        this.isLoading = true;

        this.errorMessage = '';


        forkJoin({

            page:
                this.apiService
                    .get('pages/pharmacy-medical-centre-warringah-mall-brookvale'),

            settings:
                this.apiService
                    .get('settings')

        }).subscribe({

            next: (response: any) => {

                this.isLoading = false;


                // =================================================
                // PAGE RESPONSE
                // =================================================

                if (
                    response?.page?.status
                    !==
                    'success'
                ) {

                    this.errorMessage =
                        response?.page?.message ||
                        'Unable to load page.';

                    return;

                }


                this.page =
                    response?.page?.data ||
                    null;


                if (!this.page) {

                    this.errorMessage =
                        'Unable to load page.';

                    return;

                }


                // =================================================
                // SETTINGS RESPONSE
                // =================================================

                if (
                    response?.settings?.status
                    ===
                    'success'
                ) {

                    this.settings =
                        response?.settings?.data ||
                        {};

                }


                // =================================================
                // SEO
                // =================================================

                this.setSeo();


                // =================================================
                // SCROLL REVEAL
                // =================================================

                /*
                 * Wait until Angular has inserted
                 * [innerHTML] into the DOM.
                 */

                setTimeout(() => {

                    this.initScrollReveal();

                }, 50);

            },


            error: (error: any) => {

                console.error(
                    'About page error:',
                    error
                );


                this.isLoading = false;


                this.errorMessage =
                    error?.error?.message ||
                    'Unable to load page.';

            }

        });

    }


    // =====================================================
    // SEO
    // =====================================================

    private setSeo(): void {

        if (!this.page) {

            return;

        }


        const siteName =
            this.settings?.site_name ||
            '';


        this.seoService.update({

            // =================================================
            // TITLE
            // =================================================

            title:
                this.page.meta_title ||
                this.page.title ||
                siteName,


            // =================================================
            // DESCRIPTION
            // =================================================

            description:
                this.page.meta_description ||
                this.page.short_description ||
                '',


            // =================================================
            // KEYWORDS
            // =================================================

            keywords:
                this.page.meta_keywords ||
                '',


            // =================================================
            // CANONICAL
            // =================================================

            canonical:
                this.page.canonical_url ||
                '',


            // =================================================
            // SITE NAME
            // =================================================

            siteName:
                siteName,


            // =================================================
            // ROBOTS
            // =================================================

            robots:
                'index, follow',


            // =================================================
            // OPEN GRAPH TYPE
            // =================================================

            type:
                'website'

        });

    }


    // =====================================================
    // SCROLL REVEAL
    // =====================================================

    private initScrollReveal(): void {

        if (!this.viewReady) {

            setTimeout(() => {

                this.initScrollReveal();

            }, 50);

            return;

        }


        /*
         * Remove previous observer if page
         * content was reloaded.
         */

        if (this.observer) {

            this.observer.disconnect();

        }


        const root: HTMLElement =
            this.elementRef.nativeElement;


        const elements =
            root.querySelectorAll(
                '.med-scroll-reveal'
            );


        if (!elements.length) {

            return;

        }


        /*
         * If IntersectionObserver isn't supported,
         * simply show everything.
         */

        if (
            !('IntersectionObserver' in window)
        ) {

            elements.forEach(
                (element: Element) => {

                    element.classList.add(
                        'med-visible'
                    );

                }
            );

            return;

        }


        /*
         * Enable hidden/reveal state only after
         * everything is ready.
         */

        root.classList.add(
            'med-reveal-ready'
        );


        this.observer =
            new IntersectionObserver(

                (
                    entries:
                    IntersectionObserverEntry[]
                ) => {

                    entries.forEach(
                        (
                            entry:
                            IntersectionObserverEntry
                        ) => {

                            if (
                                entry.isIntersecting
                            ) {

                                entry.target
                                    .classList
                                    .add(
                                        'med-visible'
                                    );


                                /*
                                 * Animate only once.
                                 */

                                this.observer
                                    ?.unobserve(
                                        entry.target
                                    );

                            }

                        }
                    );

                },

                {
                    threshold: 0.12,

                    rootMargin:
                        '0px 0px -45px 0px'
                }

            );


        elements.forEach(
            (element: Element) => {

                this.observer
                    ?.observe(element);

            }
        );

    }


    // =====================================================
    // DESTROY
    // =====================================================

    ngOnDestroy(): void {

        if (this.observer) {

            this.observer.disconnect();

        }

    }

}

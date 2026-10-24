import {
  Component,
  OnInit,
  ChangeDetectionStrategy
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
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class ServicesComponent implements OnInit {

    // =========================================================
    // PAGE DATA
    // =========================================================

    page: any = null;


    // =========================================================
    // GLOBAL SETTINGS
    // =========================================================

    settings: any = {};


    // =========================================================
    // SERVICES
    // =========================================================

    services: any[] = [];


    // =========================================================
    // STATE
    // =========================================================

    isLoading: boolean = false;

    hasError: boolean = false;

    errorMessage: string = '';


    constructor(
        private apiService: ApiService,
        private seoService: SeoService
    ) {}


    // =========================================================
    // INIT
    // =========================================================

    ngOnInit(): void {

        this.loadPage();

    }


    // =========================================================
    // LOAD PAGE + SETTINGS + SERVICES
    // =========================================================

    loadPage(): void {

        this.isLoading = true;

        this.hasError = false;

        this.errorMessage = '';


        forkJoin({

            // CMS PAGE
            page:
                this.apiService.get(
                    'pages/services'
                ),


            // GLOBAL SITE SETTINGS
            settings:
                this.apiService.get(
                    'settings'
                ),


            // SERVICE CARDS
            services:
                this.apiService.get(
                    'services'
                )

        })
        .subscribe({

            next: (response: any) => {

                this.isLoading = false;


                // =============================================
                // PAGE
                // =============================================

                if (
                    response?.page?.status
                    === 'success'
                ) {

                    this.page =
                        response.page.data || null;

                } else {

                    this.page = null;

                    this.hasError = true;

                    this.errorMessage =
                        'Unable to load page information.';

                }


                // =============================================
                // SETTINGS
                // =============================================

                if (
                    response?.settings?.status
                    === 'success'
                ) {

                    this.settings =
                        response.settings.data || {};

                } else {

                    this.settings = {};

                }


                // =============================================
                // SERVICES
                // =============================================

                if (
                    response?.services?.status
                    === 'success'
                ) {

                    this.services =
                        response.services.data || [];

                } else {

                    this.services = [];

                    this.hasError = true;

                    if (!this.errorMessage) {

                        this.errorMessage =
                            'Unable to load services.';

                    }

                }


                // =============================================
                // SEO
                // =============================================

                if (this.page) {

                    this.setSeo();

                }

            },


            error: (error: any) => {

                console.error(
                    'Services page API error:',
                    error
                );


                this.isLoading = false;

                this.hasError = true;

                this.page = null;

                this.settings = {};

                this.services = [];

                this.errorMessage =
                    'Unable to load services. Please try again.';

            }

        });

    }


    // =========================================================
    // DYNAMIC SEO
    // =========================================================

    private setSeo(): void {

        if (!this.page) {
            return;
        }


        const siteName =
            this.settings?.site_name || '';


        this.seoService.update({

            // ---------------------------------------------
            // META TITLE
            // ---------------------------------------------

            title:
                this.page.meta_title
                ||
                this.page.title
                ||
                siteName,


            // ---------------------------------------------
            // META DESCRIPTION
            // ---------------------------------------------

            description:
                this.page.meta_description
                ||
                this.page.short_description
                ||
                '',


            // ---------------------------------------------
            // META KEYWORDS
            // ---------------------------------------------

            keywords:
                this.page.meta_keywords
                ||
                '',


            // ---------------------------------------------
            // CANONICAL
            // ---------------------------------------------

            canonical:
                this.page.canonical_url
                ||
                '',


            // ---------------------------------------------
            // SITE NAME - DYNAMIC
            // ---------------------------------------------

            siteName:
                siteName,


            // ---------------------------------------------
            // ROBOTS
            // ---------------------------------------------

            robots:
                'index, follow',


            // ---------------------------------------------
            // OPEN GRAPH TYPE
            // ---------------------------------------------

            type:
                'website'

        });

    }


    // =========================================================
    // RETRY
    // =========================================================

    retry(): void {

        this.loadPage();

    }


    // =========================================================
    // SERVICE IMAGE
    // =========================================================

    getServiceImage(
        service: any
    ): string {

        if (
            service?.image &&
            service.image.trim() !== ''
        ) {

            return service.image;

        }


        return 'assets/images/service-placeholder.jpg';

    }


    // =========================================================
    // TRACK BY
    // =========================================================

    trackByServiceId(
        index: number,
        service: any
    ): number {

        return service.id;

    }

    loadServices(): void {

    this.loadPage();

}

}

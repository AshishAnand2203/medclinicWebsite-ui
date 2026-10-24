import {
    Component,
    OnDestroy,
    OnInit
} from '@angular/core';

import {
    ActivatedRoute
} from '@angular/router';

import {
    forkJoin,
    Subject,
    takeUntil
} from 'rxjs';

import {
    ApiService
} from '../../services/api.service';

import {
    SeoService
} from '../../services/seo.service';


@Component({
    selector: 'app-service-detail',
    templateUrl: './service-detail.component.html',
    styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent
    implements OnInit, OnDestroy {

    // =====================================================
    // SERVICE
    // =====================================================

    service: any = null;


    // =====================================================
    // SETTINGS
    // =====================================================

    settings: any = {};


    // =====================================================
    // STATE
    // =====================================================

    isLoading: boolean = true;

    errorMessage: string = '';


    // =====================================================
    // DESTROY
    // =====================================================

    private destroy$ =
        new Subject<void>();


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    constructor(
        private route: ActivatedRoute,
        private apiService: ApiService,
        private seoService: SeoService
    ) {}


    // =====================================================
    // INIT
    // =====================================================

    ngOnInit(): void {

        /*
         * Listen to slug changes.
         *
         * This is important because Angular may reuse
         * this component when moving directly from
         * one service page to another.
         */

        this.route.paramMap
            .pipe(
                takeUntil(this.destroy$)
            )
            .subscribe((params) => {

                const slug =
                    params.get('slug');


                if (!slug) {

                    this.isLoading = false;

                    this.errorMessage =
                        'Service not found.';

                    return;

                }


                this.loadService(slug);

            });

    }


    // =====================================================
    // LOAD SERVICE
    // =====================================================

    loadService(
        slug: string
    ): void {

        this.isLoading = true;

        this.errorMessage = '';

        this.service = null;


        forkJoin({

            service:
                this.apiService.get(
                    'services/' +
                    encodeURIComponent(slug)
                ),

            settings:
                this.apiService.get(
                    'settings'
                )

        })
        .pipe(
            takeUntil(this.destroy$)
        )
        .subscribe({

            next: (response: any) => {

                this.isLoading = false;


                // =========================================
                // SERVICE RESPONSE
                // =========================================

                if (
                    response?.service?.status
                    !==
                    'success'
                ) {

                    this.errorMessage =
                        response?.service?.message ||
                        'Unable to load service.';

                    return;

                }


                this.service =
                    response?.service?.data ||
                    null;


                if (!this.service) {

                    this.errorMessage =
                        'Service not found.';

                    return;

                }


                // =========================================
                // SETTINGS RESPONSE
                // =========================================

                if (
                    response?.settings?.status
                    ===
                    'success'
                ) {

                    this.settings =
                        response?.settings?.data ||
                        {};

                }


                // =========================================
                // SEO
                // =========================================

                this.setSeo();

            },


            error: (error: any) => {

                console.error(
                    'Service detail error:',
                    error
                );


                this.isLoading = false;


                this.errorMessage =
                    error?.error?.message ||
                    'Unable to load service.';

            }

        });

    }


    // =====================================================
    // SEO
    // =====================================================

    private setSeo(): void {

        if (!this.service) {

            return;

        }


        const siteName =
            this.settings?.site_name ||
            '';


        this.seoService.update({

            // =============================================
            // TITLE
            // =============================================

            title:
                this.service.meta_title ||
                this.service.title ||
                siteName,


            // =============================================
            // DESCRIPTION
            // =============================================

            description:
                this.service.meta_description ||
                this.service.short_description ||
                '',


            // =============================================
            // KEYWORDS
            // =============================================

            keywords:
                this.service.meta_keywords ||
                '',


            // =============================================
            // CANONICAL
            // =============================================

            canonical:
                this.service.canonical_url ||
                '',


            // =============================================
            // SITE NAME
            // =============================================

            siteName:
                siteName,


            // =============================================
            // SOCIAL IMAGE
            // =============================================

            image:
                this.service.image ||
                '',


            // =============================================
            // ROBOTS
            // =============================================

            robots:
                'index, follow',


            // =============================================
            // TYPE
            // =============================================

            type:
                'website'

        });

    }


    // =====================================================
    // IMAGE FALLBACK
    // =====================================================

    getServiceImage(): string {

        if (
            this.service?.image &&
            this.service.image.trim() !== ''
        ) {

            return this.service.image;

        }


        return 'assets/images/service-placeholder.jpg';

    }


    // =====================================================
    // DESTROY
    // =====================================================

    ngOnDestroy(): void {

        this.destroy$.next();

        this.destroy$.complete();

    }

    onCmsContentClick(event: MouseEvent): void {

    const target = event.target as HTMLElement | null;

    if (!target) {
        return;
    }

    const question = target.closest(
        '.sexual-health-faq-question'
    ) as HTMLElement | null;

    if (!question) {
        return;
    }

    const faqItem = question.closest(
        '.sexual-health-faq-item'
    ) as HTMLElement | null;

    if (!faqItem) {
        return;
    }

    const faqContainer = faqItem.closest(
        '.sexual-health-faq'
    );

    if (!faqContainer) {
        return;
    }


    // Close other opened FAQs
    const faqItems = faqContainer.querySelectorAll(
        '.sexual-health-faq-item'
    );

    faqItems.forEach((item) => {

        if (item !== faqItem) {
            item.classList.remove('active');
        }

    });


    // Toggle clicked FAQ
    faqItem.classList.toggle('active');
}

}

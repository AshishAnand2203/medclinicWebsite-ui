import {
    Component,
    HostListener,
    OnInit
} from '@angular/core';

import {
    forkJoin
} from 'rxjs';

import {
    ApiService
} from '../../services/api.service';


@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
    standalone: false
})
export class FooterComponent implements OnInit {

    showBackToTop: boolean = false;

    settings: any = {};
    services: any[] = [];

    isLoading: boolean = true;

    currentYear: number =
        new Date().getFullYear();


    constructor(
        private apiService: ApiService
    ) {}


    // =========================================================
    // INIT
    // =========================================================

    ngOnInit(): void {

        this.loadFooterData();

    }


    // =========================================================
    // LOAD FOOTER DATA
    // =========================================================

    private loadFooterData(): void {

        this.isLoading = true;


        forkJoin({

            settings:
                this.apiService.get(
                    'settings'
                ),

            services:
                this.apiService.get(
                    'services'
                )

        }).subscribe({

            next: (response: any) => {

                // =============================================
                // SETTINGS
                // =============================================

                if (
                    response?.settings?.status
                    ===
                    'success'
                ) {

                    this.settings =
                        response?.settings?.data ||
                        {};

                }


                // =============================================
                // SERVICES
                // =============================================

                if (
                    response?.services?.status
                    ===
                    'success'
                ) {

                    const serviceData =
                        response?.services?.data ||
                        [];

                    this.services =
                        Array.isArray(serviceData)
                            ? serviceData
                            : [];

                }


                this.isLoading = false;

            },

            error: (error: any) => {

                console.error(
                    'Footer data error:',
                    error
                );

                this.isLoading = false;

            }

        });

    }


    // =========================================================
    // PHONE LINK
    // =========================================================

    getPhoneLink(
        phone: string
    ): string {

        if (!phone) {
            return '';
        }

        return 'tel:' +
            phone.replace(
                /[^0-9+]/g,
                ''
            );

    }


    // =========================================================
    // EMAIL LINK
    // =========================================================

    getEmailLink(
        email: string
    ): string {

        if (!email) {
            return '';
        }

        return 'mailto:' + email;

    }


    // =========================================================
    // SERVICE URL
    // =========================================================

    getServiceUrl(
        service: any
    ): string {

        return '/services/' +
            service.slug;

    }


    // =========================================================
    // WINDOW SCROLL
    // =========================================================

    @HostListener('window:scroll')
    onWindowScroll(): void {

        this.showBackToTop =
            window.scrollY > 350;

    }


    // =========================================================
    // SCROLL TO TOP
    // =========================================================

    scrollToTop(): void {

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    }

}

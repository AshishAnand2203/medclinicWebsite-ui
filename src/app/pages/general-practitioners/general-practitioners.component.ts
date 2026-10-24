import {
    Component,
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
    selector: 'app-general-practitioners',
    templateUrl: './general-practitioners.component.html',
    styleUrls: ['./general-practitioners.component.css'],
    standalone: false
})
export class GeneralPractitionersComponent implements OnInit {

    // =========================================================
    // PAGE DATA
    // =========================================================

    page: any = null;


    // =========================================================
    // DOCTOR DATA
    // =========================================================

    category: any = null;

    doctors: any[] = [];

    settings: any = {};


    // =========================================================
    // STATE
    // =========================================================

    isLoading: boolean = true;

    errorMessage: string = '';


    constructor(
        private apiService: ApiService,
        private seoService: SeoService
    ) {}


    // =========================================================
    // INIT
    // =========================================================

    ngOnInit(): void {

        this.loadDoctors();

    }


    // =========================================================
    // LOAD PAGE + DOCTORS + SETTINGS
    // =========================================================

    loadDoctors(): void {

        this.isLoading = true;

        this.errorMessage = '';


        forkJoin({

            // =============================================
            // CMS PAGE
            // =============================================

            page:
                this.apiService.get(
                    'pages/general-practitioners'
                ),


            // =============================================
            // DOCTORS
            // =============================================

            doctors:
                this.apiService.get(
                    'doctors/category/general-practitioners'
                ),


            // =============================================
            // SETTINGS
            // =============================================

            settings:
                this.apiService.get(
                    'settings'
                )

        }).subscribe({

            // =================================================
            // SUCCESS
            // =================================================

            next: (response: any) => {

                this.isLoading = false;


                // =============================================
                // PAGE
                // =============================================

                if (
                    response?.page?.status
                    ===
                    'success'
                ) {

                    this.page =
                        response?.page?.data ||
                        null;

                }


                // =============================================
                // DOCTORS RESPONSE
                // =============================================

                if (
                    response?.doctors?.status
                    !==
                    'success'
                ) {

                    this.errorMessage =
                        response?.doctors?.message ||
                        'Unable to load doctors.';

                    return;

                }


                // =============================================
                // CATEGORY
                // =============================================

                this.category =
                    response?.doctors?.data?.category ||
                    null;


                // =============================================
                // DOCTORS
                // =============================================

                const doctors =
                    response?.doctors?.data?.doctors ||
                    [];


                this.doctors =
                    Array.isArray(doctors)
                        ? doctors
                        : [];


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
                // SEO
                // =============================================

                this.setSeo();

            },


            // =================================================
            // ERROR
            // =================================================

            error: (error: any) => {

                console.error(
                    'General Practitioners error:',
                    error
                );


                this.isLoading = false;


                this.errorMessage =
                    error?.error?.message ||
                    'Unable to load doctors.';

            }

        });

    }


    // =========================================================
    // SEO
    // =========================================================

    private setSeo(): void {

        const siteName =
            this.settings?.site_name ||
            'Medclinic Family Practice';


        // =====================================================
        // USE CMS PAGE SEO WHEN AVAILABLE
        // =====================================================

        if (this.page) {

            this.seoService.update({

                title:
                    this.page.meta_title ||
                    this.page.title ||
                    'General Practitioners',

                description:
                    this.page.meta_description ||
                    this.page.short_description ||
                    '',

                keywords:
                    this.page.meta_keywords ||
                    '',

                canonical:
                    this.page.canonical_url ||
                    '',

                siteName:
                    siteName,

                robots:
                    'index, follow',

                type:
                    'website'

            });

            return;

        }


        // =====================================================
        // FALLBACK SEO
        // =====================================================

        const categoryName =
            this.category?.name ||
            'General Practitioners';


        this.seoService.update({

            title:
                categoryName +
                ' | ' +
                siteName,

            description:
                'Meet our ' +
                categoryName +
                ' at ' +
                siteName +
                '.',

            keywords:
                categoryName +
                ', Doctors, ' +
                siteName,

            canonical:
                '',

            siteName:
                siteName,

            robots:
                'index, follow',

            type:
                'website'

        });

    }


    // =========================================================
    // DOCTOR IMAGE
    // =========================================================

    getDoctorImage(
        doctor: any
    ): string {

        if (!doctor?.image) {

            return 'assets/images/doctor-placeholder.png';

        }

        return doctor.image;

    }


    // =========================================================
    // DAY NAME
    // =========================================================

    getDayName(
        day: number
    ): string {

        const days: {
            [key: number]: string
        } = {

            0: 'Sunday',

            1: 'Monday',

            2: 'Tuesday',

            3: 'Wednesday',

            4: 'Thursday',

            5: 'Friday',

            6: 'Saturday'

        };


        return days[day] || '';

    }


    // =========================================================
    // FORMAT TIME
    // =========================================================

    formatTime(
        time: string
    ): string {

        if (!time) {
            return '';
        }


        const parts =
            time.split(':');


        let hour =
            Number(parts[0]);


        const minute =
            parts[1];


        const period =
            hour >= 12
                ? 'PM'
                : 'AM';


        hour =
            hour % 12;


        if (hour === 0) {
            hour = 12;
        }


        return (
            hour +
            ':' +
            minute +
            ' ' +
            period
        );

    }

}

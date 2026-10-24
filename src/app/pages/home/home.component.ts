import {
    Component,
    OnInit
} from '@angular/core';

import {
    OwlOptions
} from 'ngx-owl-carousel-o';

import {
    ApiService
} from '../../services/api.service';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


    // =========================================================
    // SLIDER DATA
    // =========================================================

    sliders: any[] = [];

    isBannerLoading: boolean = true;

    bannerError: string = '';


    // =========================================================
    // SERVICE DATA
    // =========================================================

    services: any[] = [];

    isServicesLoading: boolean = true;


    // =========================================================
    // DOCTOR DATA
    // =========================================================

    doctors: any[] = [];

    isDoctorsLoading: boolean = true;


    // =========================================================
    // TESTIMONIAL DATA
    // =========================================================

    testimonials: any[] = [];

    isTestimonialsLoading: boolean = true;

    testimonialError: string = '';



    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    constructor(
        private apiService: ApiService
    ) {}



    // =========================================================
    // INIT
    // =========================================================

    ngOnInit(): void {

        this.loadSliders();

        this.loadServices();

        this.loadDoctors();

        this.loadTestimonials();

    }



    // =========================================================
    // LOAD SLIDERS
    // =========================================================

    loadSliders(): void {

        this.isBannerLoading = true;

        this.bannerError = '';


        this.apiService
            .get('sliders')
            .subscribe({

                next: (response: any) => {

                    this.isBannerLoading = false;


                    if (
                        response?.status ===
                        'success'
                    ) {

                        const data =
                            response?.data || [];


                        this.sliders =
                            Array.isArray(data)
                                ? data
                                : [];


                        return;

                    }


                    this.sliders = [];


                    this.bannerError =
                        response?.message ||
                        'Unable to load sliders.';

                },


                error: (error: any) => {

                    console.error(
                        'Slider API Error:',
                        error
                    );


                    this.isBannerLoading = false;

                    this.sliders = [];


                    this.bannerError =
                        'Unable to load sliders.';

                }

            });

    }



    // =========================================================
    // BANNER IMAGE
    // =========================================================

    getSliderImage(
        slider: any
    ): string {

        if (!slider?.image) {

            return '';

        }


        return slider.image;

    }



    // =========================================================
    // BANNER BACKGROUND
    // =========================================================

    getSliderBackground(
        slider: any
    ): string {

        const image =
            this.getSliderImage(slider);


        if (!image) {

            return 'none';

        }


        return `url("${image}")`;

    }



    // =========================================================
    // LOAD SERVICES
    // =========================================================

    loadServices(): void {

        this.isServicesLoading = true;


        this.apiService
            .get('services')
            .subscribe({

                next:
                (response: any) => {

                    this.isServicesLoading =
                        false;


                    if (
                        response?.status ===
                        'success'
                    ) {

                        this.services =
                            Array.isArray(
                                response?.data
                            )
                                ? response.data
                                : [];

                        return;

                    }


                    this.services = [];

                },


                error:
                (error: any) => {

                    console.error(
                        'Services API Error:',
                        error
                    );


                    this.services = [];

                    this.isServicesLoading =
                        false;

                }

            });

    }



    // =========================================================
    // LOAD DOCTORS
    // =========================================================

    loadDoctors(): void {

        this.isDoctorsLoading = true;


        this.apiService
            .get('doctors')
            .subscribe({

                next:
                (response: any) => {

                    this.isDoctorsLoading =
                        false;


                    if (
                        response?.status ===
                        'success'
                    ) {

                        this.doctors =
                            Array.isArray(
                                response?.data
                            )
                                ? response.data
                                : [];

                        return;

                    }


                    this.doctors = [];

                },


                error:
                (error: any) => {

                    console.error(
                        'Doctors API Error:',
                        error
                    );


                    this.doctors = [];

                    this.isDoctorsLoading =
                        false;

                }

            });

    }



    // =========================================================
    // LOAD TESTIMONIALS
    // =========================================================

    loadTestimonials(): void {

        this.isTestimonialsLoading = true;

        this.testimonialError = '';


        this.apiService
            .get('testimonials')
            .subscribe({

                next: (response: any) => {

                    this.isTestimonialsLoading =
                        false;


                    if (
                        response?.status ===
                        'success'
                    ) {

                        const data =
                            response?.data || [];


                        this.testimonials =
                            Array.isArray(data)
                                ? data
                                : [];


                        return;

                    }


                    this.testimonials = [];


                    this.testimonialError =
                        response?.message ||
                        'Unable to load testimonials.';

                },


                error: (error: any) => {

                    console.error(
                        'Testimonials API Error:',
                        error
                    );


                    this.isTestimonialsLoading =
                        false;


                    this.testimonials = [];


                    this.testimonialError =
                        'Unable to load testimonials.';

                }

            });

    }



    // =========================================================
    // TRACK TESTIMONIAL
    // =========================================================

    trackByTestimonialId(
        index: number,
        testimonial: any
    ): number {

        return testimonial?.id || index;

    }



    // =========================================================
    // BANNER CAROUSEL
    // =========================================================

    bannerOptions: OwlOptions = {

        items: 1,

        loop: true,

        autoplay: true,

        autoplayTimeout: 6000,

        autoplayHoverPause: true,

        smartSpeed: 900,

        mouseDrag: true,

        touchDrag: true,

        pullDrag: true,

        dots: true,

        nav: false,

        navText: [

            '<i class="fa-solid fa-chevron-left"></i>',

            '<i class="fa-solid fa-chevron-right"></i>'

        ],

        responsive: {

            0: {
                items: 1
            },

            576: {
                items: 1
            },

            768: {
                items: 1
            },

            992: {
                items: 1
            },

            1200: {
                items: 1
            }

        }

    };



    // =========================================================
    // WHY CHOOSE US CAROUSEL
    // =========================================================

    chooseOptions: OwlOptions = {

        autoplay: true,

        autoplayTimeout: 5000,

        autoplayHoverPause: true,

        smartSpeed: 700,

        dots: false,

        loop: true,

        margin: 25,

        nav: true,

        responsive: {

            0: {
                items: 1
            },

            600: {
                items: 2
            },

            1000: {
                items: 4
            }

        }

    };



    // =========================================================
    // DOCTORS CAROUSEL
    // =========================================================

    doctorOptions: OwlOptions = {

        autoplay: true,

        autoplayTimeout: 5000,

        autoplayHoverPause: true,

        smartSpeed: 700,

        dots: false,

        loop: true,

        margin: 25,

        nav: false,

        responsive: {

            0: {
                items: 1
            },

            600: {
                items: 2
            },

            1000: {
                items: 6
            }

        }

    };



    // =========================================================
    // TESTIMONIAL CAROUSEL
    // =========================================================

    testimonialOptions: OwlOptions = {

        autoplay: true,

        autoplayTimeout: 5000,

        autoplayHoverPause: true,

        smartSpeed: 700,

        dots: false,

        loop: true,

        margin: 25,

        nav: true,

        navText: [

            '<i class="fa-solid fa-chevron-left"></i>',

            '<i class="fa-solid fa-chevron-right"></i>'

        ],

        responsive: {

            0: {
                items: 1
            },

            600: {
                items: 2
            },

            1000: {
                items: 4
            }

        }

    };

}

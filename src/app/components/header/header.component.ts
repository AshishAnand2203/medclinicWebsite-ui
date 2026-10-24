import {
    Component,
    HostListener,
    OnInit
} from '@angular/core';

import {
    ApiService
} from '../../services/api.service';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    // =====================================================
    // SCROLL
    // =====================================================

    isScrolled: boolean = false;


    // =====================================================
    // LOADING
    // =====================================================

    isLoadingHeader: boolean = true;

    isLoadingServices: boolean = true;


    // =====================================================
    // SETTINGS
    // =====================================================

    settings: any = {};


    // =====================================================
    // SERVICES
    // =====================================================

    services: any[] = [];


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    constructor(
        private apiService: ApiService
    ) {}


    // =====================================================
    // INIT
    // =====================================================

    ngOnInit(): void {

        this.loadHeaderSettings();

        this.loadServices();

    }


    // =====================================================
    // SCROLL
    // =====================================================

    @HostListener('window:scroll')
    onWindowScroll(): void {

        this.isScrolled =
            window.scrollY > 1;

    }


    // =====================================================
    // LOAD HEADER SETTINGS
    // =====================================================

    loadHeaderSettings(): void {

        this.isLoadingHeader = true;


        this.apiService
            .get('settings')
            .subscribe({

                next: (response: any) => {

                    this.isLoadingHeader = false;


                    if (
                        response?.status === 'success'
                    ) {

                        this.settings =
                            response?.data || {};

                    }

                },


                error: (error: any) => {

                    console.error(
                        'Header settings error:',
                        error
                    );

                    this.isLoadingHeader = false;

                }

            });

    }


    // =====================================================
    // LOAD SERVICES
    // =====================================================

    loadServices(): void {

        this.isLoadingServices = true;


        this.apiService
            .get('services')
            .subscribe({

                next: (response: any) => {

                    this.isLoadingServices = false;


                    if (
                        response?.status === 'success'
                    ) {

                        const rawServices =
                            Array.isArray(response?.data)
                                ? response.data
                                : (
                                    response?.data?.services ||
                                    []
                                );


                        this.services =
                            this.buildServiceTree(
                                rawServices
                            );


                        console.log(
                            'Header services:',
                            this.services
                        );

                    } else {

                        this.services = [];

                    }

                },


                error: (error: any) => {

                    console.error(
                        'Header services error:',
                        error
                    );

                    this.isLoadingServices = false;

                    this.services = [];

                }

            });

    }


    // =====================================================
    // NORMALIZE SERVICE
    // =====================================================

    private normalizeService(
        service: any
    ): any {

        const children =
            service?.sub_services ??
            service?.subServices ??
            service?.subservices ??
            service?.children ??
            [];


        return {

            ...service,

            subServices:
                Array.isArray(children)
                    ? children.map(
                        (child: any) =>
                            this.normalizeService(child)
                    )
                    : []

        };

    }


    // =====================================================
    // BUILD SERVICE TREE
    //
    // Supports:
    //
    // 1. Nested API
    //    sub_services: []
    //
    // 2. Flat API
    //    parent_id
    //    parentId
    //    parent_service_id
    //    parentServiceId
    // =====================================================

    private buildServiceTree(
        rawServices: any[]
    ): any[] {

        if (
            !Array.isArray(rawServices) ||
            rawServices.length === 0
        ) {

            return [];

        }


        const services =
            rawServices.map(
                (service: any) =>
                    this.normalizeService(service)
            );


        const serviceMap =
            new Map<string, any>();


        // -------------------------------------------------
        // CREATE SERVICE MAP
        // -------------------------------------------------

        services.forEach(
            (service: any) => {

                const id =
                    this.getServiceId(service);


                if (id) {

                    serviceMap.set(
                        id,
                        service
                    );

                }

            }
        );


        // -------------------------------------------------
        // CONNECT FLAT CHILD SERVICES TO PARENTS
        // -------------------------------------------------

        services.forEach(
            (service: any) => {

                const parentId =
                    this.getParentId(service);


                if (!parentId) {
                    return;
                }


                const parent =
                    serviceMap.get(parentId);


                if (!parent) {
                    return;
                }


                if (
                    !Array.isArray(
                        parent.subServices
                    )
                ) {

                    parent.subServices = [];

                }


                const alreadyExists =
                    parent.subServices.some(
                        (child: any) => {

                            const childId =
                                this.getServiceId(
                                    child
                                );

                            const serviceId =
                                this.getServiceId(
                                    service
                                );


                            if (
                                childId &&
                                serviceId
                            ) {

                                return (
                                    childId ===
                                    serviceId
                                );

                            }


                            return (
                                child?.slug ===
                                service?.slug
                            );

                        }
                    );


                if (!alreadyExists) {

                    parent.subServices.push(
                        service
                    );

                }

            }
        );


        // -------------------------------------------------
        // RETURN ONLY ROOT / MAIN SERVICES
        // -------------------------------------------------

        return services.filter(
            (service: any) => {

                const parentId =
                    this.getParentId(service);


                if (!parentId) {

                    return true;

                }


                // If API gives a parent that isn't
                // present in response, don't hide service.

                return !serviceMap.has(
                    parentId
                );

            }
        );

    }


    // =====================================================
    // GET SERVICE ID
    // =====================================================

    private getServiceId(
        service: any
    ): string {

        const value =
            service?.id ??
            service?.service_id ??
            service?.serviceId ??
            service?.slug ??
            '';


        return String(value);

    }


    // =====================================================
    // GET PARENT SERVICE ID
    // =====================================================

    private getParentId(
        service: any
    ): string | null {

        const value =
            service?.parent_id ??
            service?.parentId ??
            service?.parent_service_id ??
            service?.parentServiceId ??
            service?.parent?.id ??
            null;


        if (
            value === null ||
            value === undefined ||
            value === '' ||
            value === 0 ||
            value === '0'
        ) {

            return null;

        }


        return String(value);

    }


    // =====================================================
    // PHONE LINK
    // =====================================================

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


    // =====================================================
    // EMAIL LINK
    // =====================================================

    getEmailLink(
        email: string
    ): string {

        if (!email) {
            return '';
        }


        return 'mailto:' + email;

    }

}

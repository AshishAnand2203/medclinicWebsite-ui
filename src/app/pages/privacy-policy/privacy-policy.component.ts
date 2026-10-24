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
    selector: 'app-privacy-policy',
    templateUrl: './privacy-policy.component.html',
    styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent implements OnInit {

    page: any = null;
    settings: any = {};

    isLoading: boolean = true;
    errorMessage: string = '';

    constructor(
        private apiService: ApiService,
        private seoService: SeoService
    ) {}

    ngOnInit(): void {
        this.loadPage();
    }


    loadPage(): void {

        this.isLoading = true;
        this.errorMessage = '';

        forkJoin({

            page:
                this.apiService.get(
                    'pages/policy'
                ),

            settings:
                this.apiService.get(
                    'settings'
                )

        }).subscribe({

            next: (response: any) => {

                this.isLoading = false;

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

                if (
                    response?.settings?.status
                    ===
                    'success'
                ) {

                    this.settings =
                        response?.settings?.data ||
                        {};

                }

                this.setSeo();

            },

            error: (error: any) => {

                console.error(
                    'Privacy policy error:',
                    error
                );

                this.isLoading = false;

                this.errorMessage =
                    error?.error?.message ||
                    'Unable to load page.';

            }

        });

    }


    private setSeo(): void {

        if (!this.page) {
            return;
        }

        const siteName =
            this.settings?.site_name ||
            '';

        this.seoService.update({

            title:
                this.page.meta_title ||
                this.page.title ||
                siteName,

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

    }

}

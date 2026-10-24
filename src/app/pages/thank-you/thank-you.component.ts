import {
    Component,
    OnInit
} from '@angular/core';

import {
    SeoService
} from '../../services/seo.service';

@Component({
    selector: 'app-thank-you',
    templateUrl: './thank-you.component.html',
    styleUrls: ['./thank-you.component.css'],
    standalone: false
})
export class ThankYouComponent implements OnInit {

    constructor(
        private seoService: SeoService
    ) {}

    ngOnInit(): void {

        this.seoService.update({
            title: 'Thank You | Medclinic Family Practice',
            description:
                'Thank you for contacting Medclinic Family Practice.',
            keywords: '',
            canonical: '',
            siteName: 'Medclinic Family Practice',
            robots: 'noindex, follow',
            type: 'website'
        });

    }

}

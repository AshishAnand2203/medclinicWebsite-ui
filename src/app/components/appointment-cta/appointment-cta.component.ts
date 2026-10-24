import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-appointment-cta',
    templateUrl: './appointment-cta.component.html',
    styleUrls: ['./appointment-cta.component.css']
})
export class AppointmentCtaComponent {

    @Input() smallTitle: string = 'NEED TO SEE A DOCTOR?';

    @Input() title: string =
        'Your health deserves thoughtful care.';

    @Input() description: string =
        'Our experienced team is here to provide professional and compassionate healthcare for you and your family.';

    @Input() phone: string =
        '02 8319 6266';

    bookingUrl: string =
        'https://www.hotdoc.com.au/medical-centres/brookvale-NSW-2100/medclinic-family-practice/doctors?wp=w_lightbox';


    get phoneLink(): string {

        return 'tel:' +
            this.phone.replace(/\s+/g, '');
    }
}

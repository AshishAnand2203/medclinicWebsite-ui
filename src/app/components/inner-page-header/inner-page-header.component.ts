import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';


@Component({
    selector: 'app-inner-page-header',
    templateUrl: './inner-page-header.component.html',
    styleUrls: ['./inner-page-header.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class InnerPageHeaderComponent {

    // Main page title
    @Input()
    title: string = '';

    // Small heading above title
    @Input()
    smallTitle: string =
        'MEDCLINIC FAMILY PRACTICE';

}

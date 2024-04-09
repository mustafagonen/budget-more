import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../shared.module';

@Component({
    selector: 'app-confirmation',
    templateUrl: './confirmation.component.html',
    styleUrls: ['./confirmation.component.scss'],
    imports: [
        SharedModule,
    ],
    standalone: true
})
export class ConfirmationComponent {
    @Input() model!: { title?: string, content?: string, item?: string, imageUrl?: string, okBtnText?: string, dismissBtnText?: string };
    @Output() confirm = new EventEmitter<boolean>();
}

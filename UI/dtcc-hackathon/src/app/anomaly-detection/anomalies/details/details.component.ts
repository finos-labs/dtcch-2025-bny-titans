import { NgIf } from '@angular/common';
import { Component, DestroyRef, Inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { EfmDialogHeaderComponent } from '../../../../efm-components/dialog/public-api';
import { AnomalyDetectionDetails, AnomalyDetectionRow } from '../../anomaly-detection';
import { AnomalyDetectionService } from '../../anomaly-detection.service';
import { EfmSpinnerService } from '../../../../efm-components/spinner/public-api';
import { finalize } from 'rxjs';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        MatButtonModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        EfmDialogHeaderComponent
    ]
})
export class AnomalyDetectionAnomaliesDetailsComponent {
    details?: AnomalyDetectionDetails;
    panelOpenState = true;

    constructor(
        private destroyRef: DestroyRef,
        private spinner: EfmSpinnerService,
        private api: AnomalyDetectionService,
        @Inject(MAT_DIALOG_DATA) private row: AnomalyDetectionRow
    ) { }

    ngOnInit(): void {
        this.getAnomalyDetails(this.row);
    }

    private getAnomalyDetails(row: AnomalyDetectionRow): void {
        this.spinner.open();
        this.api.getAnomalyDetails(row).pipe(
            finalize(() => this.spinner.close()),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe(details => {
            this.details = details;
        });
    }
}
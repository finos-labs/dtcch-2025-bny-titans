import { DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { Component, DestroyRef, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Title } from '@angular/platform-browser';
import { AnomalyDetectionSource } from './anomaly-detection';
import { AnomalyDetectionTransactionsComponent } from './transactions/transactions.component';
import { AnomalyDetectionCorporateActionsComponent } from './corporate-actions/corporate-actions.component';
import { AnomalyDetectionAnomaliesComponent } from './anomalies/anomalies.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AnomalyDetectionUploadComponent } from './upload/upload.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EfmSpinnerService } from 'src/efm-components/spinner/spinner.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AnomalyDetectionService } from './anomaly-detection.service';

@Component({
    selector: 'app-anomaly-detection',
    templateUrl: './anomaly-detection.component.html',
    styleUrls: ['./anomaly-detection.component.scss'],
    providers: [
        DatePipe,
        DecimalPipe
    ],
    standalone: true,
    imports: [
        NgFor,
        NgIf,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatDialogModule,
        MatTabsModule,
        AnomalyDetectionTransactionsComponent,
        AnomalyDetectionCorporateActionsComponent,
        AnomalyDetectionAnomaliesComponent
    ]
})
export class AnomalyDetectionComponent implements OnInit {
    sources: AnomalyDetectionSource[] = Object.values(AnomalyDetectionSource);
    #source: AnomalyDetectionSource = AnomalyDetectionSource.TRANSACTIONS;

    get transData() { return this.adService.transData; }
    get corpData() { return this.adService.corpData; }

    constructor(
        private destroyRef: DestroyRef,
        private title: Title,
        private dialog: MatDialog,
        private spinner: EfmSpinnerService,
        private adService: AnomalyDetectionService
    ) { }

    ngOnInit(): void {
        this.title.setTitle('DTCC Tradewatch | Anomaly Detection');
        if (!this.transData && !this.corpData) {
            this.onUpload();
        }
    }

    onUpload(): void {
        this.dialog.open(AnomalyDetectionUploadComponent, { autoFocus: false }).afterClosed().pipe(
            takeUntilDestroyed(this.destroyRef)
        ).subscribe((files: File[]) => {
            if (files && files.length === 2) {
                this.adService.transData = [];
                this.adService.corpData = [];
                this.spinner.open();
                const file = files[0];
                let reader: FileReader = new FileReader();
                reader.readAsText(file);
                reader.onload = () => {
                    let txt = reader.result as string;
                    const rows = txt.split('\r\n');
                    const header = rows[0].split(',');
                    const data: any[] = [];
                    for (let r = 1; r < rows.length; r++) {
                        const obj: any = {};
                        const row = rows[r].split(',');
                        for (let c = 0; c < header.length; c++) {
                            obj[header[c]] = row[c];
                        }
                        data.push(obj);
                    }
                    this.adService.transData = data;

                    const file2 = files[1];
                    let reader2: FileReader = new FileReader();
                    reader2.readAsText(file2);
                    reader2.onload = () => {
                        let txt = reader2.result as string;
                        const rows = txt.split('\r\n');
                        const header = rows[0].split(',');
                        const data: any[] = [];
                        for (let r = 1; r < rows.length; r++) {
                            const obj: any = {};
                            const row = rows[r].split(',');
                            for (let c = 0; c < header.length; c++) {
                                obj[header[c]] = row[c];
                            }
                            data.push(obj);
                        }
                        this.adService.corpData = data;
                        this.spinner.close();
                    }
                }
            }
        });
    }


    onSelectTab(event: MatTabChangeEvent): void {
        this.#source = this.sources[event.index] as AnomalyDetectionSource;
    }

    showTransactions(): boolean {
        return this.#source === AnomalyDetectionSource.TRANSACTIONS;
    }

    showCorporateActions(): boolean {
        return this.#source === AnomalyDetectionSource.CORPORATE_ACTIONS;
    }

    showAnomalies(): boolean {
        return this.#source === AnomalyDetectionSource.ANOMALY_DETECTION;
    }
}
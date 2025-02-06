import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { EfmDialogHeaderComponent } from '../../../efm-components/dialog/public-api';
import { MatIconModule } from '@angular/material/icon';
import { EfmSpinnerService } from 'src/efm-components/spinner/spinner.service';

@Component({
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
    standalone: true,
    imports: [
        MatButtonModule,
        MatDialogModule,
        MatDividerModule,
        MatIconModule,
        EfmDialogHeaderComponent
    ]
})
export class AnomalyDetectionUploadComponent {
    transFile?: File;
    transFileName?: string;
    corpFile?: File;
    corpFileName?: string;

    constructor(
        private dialogRef: MatDialogRef<AnomalyDetectionUploadComponent>
    ) { }

    onFileChange(event: Event, corp?: boolean): void {
        const file = (event?.target as HTMLInputElement)?.files?.[0];
        if (file) {
            if (corp) {
                this.corpFile = file;
                this.corpFileName = file.name;
            } else {
                this.transFile = file;
                this.transFileName = file.name;
            }
        }
    }

    onSubmit(): void {
        this.dialogRef.close([this.transFile, this.corpFile]);
    }

    canSubmit(): boolean {
        return !!this.transFile && !!this.corpFile;
    }
}
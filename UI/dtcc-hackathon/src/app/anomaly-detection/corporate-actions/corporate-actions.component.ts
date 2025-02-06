import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridOptions } from 'ag-grid-community';
import { EfmGridComponent, EfmGridConfig, EfmGridService } from '../../../efm-components/grid/public-api';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AnomalyDetectionRow } from '../anomaly-detection';
import { AnomalyDetectionService } from '../anomaly-detection.service';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-anomaly-detection-corporate-actions',
    templateUrl: './corporate-actions.component.html',
    styleUrls: ['./corporate-actions.component.scss'],
    providers: [EfmGridService],
    standalone: true,
    imports: [
        MatCardModule,
        EfmGridComponent
    ]
})
export class AnomalyDetectionCorporateActionsComponent implements OnInit {
    @Input() set data(data: any[]) {
        this.#data = data;
        this.gridService.setRowData(data);
    }
    gridConfig!: EfmGridConfig<any>;
    #data: any[] = [];

    constructor(
        private datePipe: DatePipe,
        private decimalPipe: DecimalPipe,
        private dialog: MatDialog,
        private gridService: EfmGridService<any>,
        private api: AnomalyDetectionService
    ) { }

    ngOnInit(): void {
        this.gridConfig = this.getGridConfig();
        setTimeout(() => {
            this.gridService.setRowData(this.#data);
        }, 10)
    }

    private getColumnDefs(): ColDef<any>[] {
        return [
            { headerName: 'Instrument Name', field: 'Instrument_Name' },
            { headerName: 'Announcement Date', field: 'Announcement_Date', sort: 'desc' },
            { headerName: 'Announcement Details', field: 'Announcement_Details' },
        ];
    }

    private getGridConfig(): EfmGridConfig<AnomalyDetectionRow> {
        return {
            gridName: 'CorporateActionsGrid',
            gridOptions: this.getGridOptions(),
            autoLoad: true,
            autoSizeColumnsToFit: false,
            saveGridState: false,
            rowData$: () => of({ data: [], totalRecords: 0 })
        }
    }

    private getGridOptions(): GridOptions<AnomalyDetectionRow> {
        return {
            columnDefs: this.getColumnDefs(),
            paginationAutoPageSize: true,
            rowSelection: undefined
        };
    }
}
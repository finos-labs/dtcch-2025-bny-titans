import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ColDef, GridOptions } from 'ag-grid-community';
import { EfmGridComponent, EfmGridConfig, EfmGridService } from '../../../efm-components/grid/public-api';
import { DatePipe, DecimalPipe } from '@angular/common';
import { AnomalyDetectionService } from '../anomaly-detection.service';
import { of } from 'rxjs';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-anomaly-detection-transactions',
    templateUrl: './transactions.component.html',
    styleUrls: ['./transactions.component.scss'],
    providers: [EfmGridService],
    standalone: true,
    imports: [
        MatCardModule,
        EfmGridComponent
    ]
})
export class AnomalyDetectionTransactionsComponent implements OnInit {
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
        private api: AnomalyDetectionService,
        private gridService: EfmGridService<any>
    ) { }

    ngOnInit(): void {
        this.gridConfig = this.getGridConfig();
        setTimeout(() => {
            this.gridService.setRowData(this.#data);
        }, 10)
    }

    private getColumnDefs(): ColDef<any>[] {
        return [
            { headerName: 'BRx Transaction ID', field: 'BRx_Transaction_ID' },
            { headerName: 'Account ID', field: 'Account_ID' },
            { headerName: 'Instrument Name', field: 'Instrument_Name' },
            {
                headerName: 'Quantity', field: 'Quantity',
                valueFormatter: params => this.decimalPipe.transform(params.value, '1.0-0') || ''
            },
            {
                headerName: 'Execution Timestamp', field: 'Execution_Timestamp', sort: 'desc',
                valueFormatter: params => this.datePipe.transform(params.value, 'MM-dd-YYYY HH:mm:ss') || ''
            },
            { headerName: 'CUSIP', field: 'CUSIP' },
            { headerName: 'Direction', field: 'Direction' },
            { headerName: 'Asset Class', field: 'Asset_Class' },
            { headerName: 'Customer Account Name', field: 'Customer_Account_Name' },
            { headerName: 'Clearing House Source', field: 'Clearing_House_Source' },
            { headerName: 'Broker', field: 'Broker' },
            { headerName: 'DTC Participant Number', field: 'DTC_Participant_Number' },
            { headerName: 'Depository', field: 'Depository' },
            { headerName: 'Tag Number', field: 'Tag_Number', hide: true },
            { headerName: 'Trade Origin', field: 'Trade_Origin', hide: true },
            { headerName: 'Transaction Sub Type', field: 'Transaction_Sub_Type', hide: true },
            { headerName: 'Source Transaction ID', field: 'Source_Transaction_ID', hide: true },
            { headerName: 'External Reference', field: 'External_Reference', hide: true },
            { headerName: 'Our Entity', field: 'Our_Entity', hide: true },
            { headerName: 'Book', field: 'Book', hide: true },
            {
                headerName: 'Transaction Date', field: 'Transaction_Date', hide: true,
                valueFormatter: params => this.datePipe.transform(params.value, 'MM-dd-YYYY') || ''
            },
            { headerName: 'BR Security ID', field: 'BR_Security_ID', hide: true },
            { headerName: 'Execution Venue', field: 'Execution_Venue', hide: true },
            { headerName: 'Execution Price', field: 'Execution_Price', hide: true },
            { headerName: 'Price Currency', field: 'Price_Currency', hide: true },
            { headerName: 'Principal Amount Currency', field: 'Principal_Amount_Currency', hide: true },
            { headerName: 'Principal Amount', field: 'Principal_Amount', hide: true },
            { headerName: 'Net Amount Currency', field: 'Net_Amount_Currency', hide: true },
            { headerName: 'Net Amount', field: 'Net_Amount', hide: true },
            { headerName: 'Customer Legal Identifier', field: 'Customer_Legal_Identifier', hide: true },
            { headerName: 'Trading Account', field: 'Trading_Account', hide: true },
            { headerName: 'Clearing Member Account Identifier', field: 'Clearing_Member_Account_Identifier', hide: true },
            { headerName: 'Trader', field: 'Trader', hide: true },
            { headerName: 'Place Of Settlement', field: 'Place_Of_Settlement', hide: true },
            { headerName: 'Settlement Currency', field: 'Settlement_Currency', hide: true },
            { headerName: 'Principal Amount In Settlement Currency', field: 'Principal_Amount_In_Settlement_Currency', hide: true },
            { headerName: 'Transaction Status', field: 'Transaction_Status', hide: true },
            { headerName: 'SEC Fee', field: 'SEC_Fee', hide: true },
            { headerName: 'FINRA_FEE', field: 'FINRA_FEE', hide: true },
            { headerName: 'Exchange Fee', field: 'Exchange_Fee', hide: true },
            { headerName: 'Match Status', field: 'Match_Status', hide: true },
            { headerName: 'Confirmation Status', field: 'Confirmation_Status', hide: true },
            { headerName: 'Sales Person', field: 'Sales_Person', hide: true },
            { headerName: 'DTC Eligible', field: 'DTC_Eligible', hide: true },
            { headerName: 'Transaction Entered By', field: 'Transaction_Entered_By', hide: true }
        ];
    }

    private getGridConfig(): EfmGridConfig<any> {
        return {
            gridName: 'TransactionsGrid',
            gridOptions: this.getGridOptions(),
            autoLoad: true,
            autoSizeColumnsToFit: false,
            saveGridState: false,
            rowData$: () => of({ data: [], totalRecords: 0 })
        }
    }

    private getGridOptions(): GridOptions<any> {
        return {
            columnDefs: this.getColumnDefs(),
            paginationAutoPageSize: true,
            rowSelection: undefined
        };
    }
}
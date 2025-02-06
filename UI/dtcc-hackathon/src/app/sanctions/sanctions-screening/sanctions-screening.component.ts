import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';
import { ColDef, GridOptions } from 'ag-grid-community';
import { SanctionsService } from 'src/app/api/sanctions.service';
import { EfmGridComponent, EfmGridConfig, EfmGridRowAction, EfmGridService } from '../../../efm-components/grid/public-api';
import { SanctionsDetailsComponent } from '../sanctions-details/sanctions-details.component';
import { SanctionScreenRow } from '../sansaction';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-sanctions-screening',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    EfmGridComponent,
    MatCardModule,
  ],
  providers: [EfmGridService],
  templateUrl: './sanctions-screening.component.html',
  styleUrls: ['./sanctions-screening.component.scss']
})
export class SanctionsScreeningComponent {
  gridConfigScreening!: EfmGridConfig<SanctionScreenRow>;
  file!: File;
  fileName?: string;
  constructor(
    private title: Title,
    private gridServiceScreening: EfmGridService<any>,
    private api: SanctionsService,
    private dialog: MatDialog,
  ) {
  }
  ngOnInit(): void {
    this.title.setTitle('DTCC Tradewatch | Sanctions');
    this.gridConfigScreening = this.getGridConfig();
  }
  onFileChange(event: Event): void {
    const file = (event?.target as HTMLInputElement)?.files?.[0];
    if (file) {
      this.file = file;
      this.fileName = file.name;
    }
  }
  getProcessData(): Observable<any> {
    if (this.file) {
      return this.api.sancProcessData(this.file)
    } else {
      return this.api.getSancProcessData()
    }
  }
  onGenerate(): void {
    this.gridServiceScreening.refreshRowData();
  }
  private getColumnDefs(): ColDef<SanctionScreenRow>[] {
    return [
      {
        headerName: 'Swift Message', field: 'swift_message', cellRenderer: (params: any) => {
          const span = document.createElement('span');
          span.textContent = params.value;
          span.title = params.value;
          return span;
        }
      },
      { headerName: 'Final Decision', field: 'final_decision' },
    ];
  }

  private getGridConfig(): EfmGridConfig<any> {
    console.log(this.api.getSancProcessData());
    return {
      gridName: 'SanctionsGrid1',
      gridOptions: this.getGridOptions(),
      rowActions: this.getRowActions(),
      saveGridState: false,
      autoLoad: true,
      rowData$: () => this.getProcessData()
      // rowData$: () => of({ data: sanction_data, totalRecords: sanction_data.length })
    }
  }

  private getGridOptions(): GridOptions {
    return {
      columnDefs: this.getColumnDefs(),
      paginationAutoPageSize: true,
      rowSelection: undefined,
    };
  }

  private getRowActions(): EfmGridRowAction<any>[] {
    return [
      {
        label: 'Details', icon: 'pageview',
        onClick: row => this.openActionLog(row)
      }
    ];
  }
  private openActionLog(row: any): void {
    this.dialog.open(
      SanctionsDetailsComponent,
      { data: row, autoFocus: false, width: '100%' }
    );
  }
}

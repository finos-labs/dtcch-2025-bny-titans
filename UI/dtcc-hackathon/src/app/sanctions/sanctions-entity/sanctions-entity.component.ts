import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';
import { ColDef, GridOptions } from 'ag-grid-community';
import { EfmGridComponent, EfmGridConfig, EfmGridService } from '../../../efm-components/grid/public-api';
import { of } from 'rxjs';
import { sanction_entity_data, SanctionEntityRow } from '../sansaction';
import { SanctionsService } from 'src/app/api/sanctions.service';

@Component({
  selector: 'app-sanctions-entity',
  standalone: true,
  imports: [MatButtonModule,
    MatCardModule,
    MatIconModule,
    EfmGridComponent,
    MatCardModule,],
  providers: [EfmGridService],
  templateUrl: './sanctions-entity.component.html',
  styleUrls: ['./sanctions-entity.component.scss']
})
export class SanctionsEntityComponent {
  gridConfig!: EfmGridConfig<SanctionEntityRow>;
  constructor(
    private title: Title,
    private gridService: EfmGridService<any>,
    private api: SanctionsService,
  ) {
  }
  ngOnInit(): void {
    this.title.setTitle('DTCC Tradewatch | Sanctions');
    this.gridConfig = this.getGridConfig();
  }
  private getColumnDefs(): ColDef<SanctionEntityRow>[] {
    return [
      { headerName: 'Sanctioned Entity', field: 'sanctioned_entity' },
      { headerName: 'Entity Type', field: 'entity_type' },
      { headerName: 'Country', field: 'country' },
    ];
  }

  private getGridConfig(): EfmGridConfig<any> {
    console.log(this.api.getSanctionEntityData());
    return {
      gridName: 'SanctionsGrid',
      gridOptions: this.getGridOptions(),
      // rowActions: this.getRowActions(),
      saveGridState: false,
      autoLoad: true,
      rowData$: () => this.api.getSanctionEntityData()
      // rowData$: () => of({ data: sanction_entity_data, totalRecords: sanction_entity_data.length })
    }
  }

  private getGridOptions(): GridOptions {
    return {
      columnDefs: this.getColumnDefs(),
      paginationAutoPageSize: true,
      rowSelection: undefined
    };
  }

  onGenerate(): void {
    this.gridService.refreshRowData();
  }
}

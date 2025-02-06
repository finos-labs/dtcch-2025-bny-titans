import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { Title } from '@angular/platform-browser';
import { EfmGridService } from '../../efm-components/grid/public-api';
import { SanctionsEntityComponent } from './sanctions-entity/sanctions-entity.component';
import { SanctionsScreeningComponent } from './sanctions-screening/sanctions-screening.component';
import { SanctionsSource } from './sansaction';

@Component({
    selector: 'app-sanctions',
    templateUrl: './sanctions.component.html',
    styleUrls: ['./sanctions.component.scss'],
    providers: [EfmGridService],
    standalone: true,
    imports: [
        NgFor,
        NgIf,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatTabsModule,
        MatCardModule,
        SanctionsScreeningComponent,
        SanctionsEntityComponent,
    ]
})
export class SanctionsComponent implements OnInit {
    sources: SanctionsSource[] = Object.values(SanctionsSource);
    #source: SanctionsSource = SanctionsSource.SANCTION_ENTITY;

    constructor(
        private title: Title,
    ) { }
    ngOnInit(): void {
        this.title.setTitle('DTCC Tradewatch | Sanctions');
    }
    onSelectTab(event: MatTabChangeEvent): void {
        this.#source = this.sources[event.index] as SanctionsSource;
    }
    showSanctionsEntity(): boolean {
        return this.#source === SanctionsSource.SANCTION_ENTITY;
    }

    showSanctionsScreening(): boolean {
        return this.#source === SanctionsSource.SANCTION_SCREENING;
    }
}
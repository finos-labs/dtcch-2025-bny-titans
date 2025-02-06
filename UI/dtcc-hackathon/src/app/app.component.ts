import { Component, OnInit } from '@angular/core';
import { EfmAppComponent } from '../efm-components/app/public-api';
import { EfmNavLink } from '../efm-components/nav/public-api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [EfmAppComponent]
})
export class AppComponent implements OnInit {
    links: EfmNavLink[] = [];

    ngOnInit(): void {
        this.links = this.getLinks();
    }

    private getLinks(): EfmNavLink[] {
        return [
            { label: 'Anomaly Detection', path: 'anomaly-detection', icon: 'dashboard' },
            { label: 'Sanctions', path: 'sanctions', icon: 'dashboard' }
        ];
    }
}
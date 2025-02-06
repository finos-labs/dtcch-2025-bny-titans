import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EfmGridResponse } from '../../efm-components/grid/public-api';
import { EfmNotificationService } from '../../efm-components/notification/public-api';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
    constructor(
        private http: HttpClient,
        private notificationService: EfmNotificationService
    ) { }

    getMockData(): Observable<EfmGridResponse<any>> {
        return of([
            { fieldA: 'A1', fieldB: 'B1', fieldC: 'C1' },
            { fieldA: 'A2', fieldB: 'B2', fieldC: 'C2' },
            { fieldA: 'A3', fieldB: 'B3', fieldC: 'C3' }
        ]).pipe(
            map(data => ({ data: data || [], totalRecords: data?.length || 0 })),
            catchError(() => {
                this.notificationService.addError('Failed to get mock data');
                return EMPTY;
            })
        );
    }
}
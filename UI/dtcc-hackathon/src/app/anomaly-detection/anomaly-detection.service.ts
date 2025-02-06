import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EfmGridResponse } from '../../efm-components/grid/public-api';
import { EfmNotificationService } from '../../efm-components/notification/public-api';
import { catchError, EMPTY, map, Observable, tap } from 'rxjs';
import { AnomalyDetectionDetails, AnomalyDetectionResponse, AnomalyDetectionRow } from '../anomaly-detection/anomaly-detection';

@Injectable({ providedIn: 'root' })
export class AnomalyDetectionService {
    transData?: any[];
    corpData?: any[];

    constructor(
        private http: HttpClient,
        private notificationService: EfmNotificationService
    ) { }

    getAnomalies(): Observable<EfmGridResponse<AnomalyDetectionRow>> {
        return this.http.get<AnomalyDetectionResponse>('/identify_anomalies').pipe(
            map(response => {
                const data: AnomalyDetectionRow[] = JSON.parse(response?.output_sheet) || [];
                for (let i = 0; i < data.length; i++) {
                    data[i].rowNumber = i;
                }
                return { data: data, totalRecords: data?.length || 0 };
            }),
            catchError(() => {
                this.notificationService.addError('Failed to get anomaly data');
                return EMPTY;
            })
        );
    }

    getAnomalyDetails(row: AnomalyDetectionRow): Observable<AnomalyDetectionDetails> {
        return this.http.get<AnomalyDetectionDetails>(`/explain_anomaly/${row.rowNumber}`).pipe(
            tap(details => {
                details.prompt = details.prompt.replace(/\n/g, '<br/>');
                details.response = details.response.replace(/\n/g, '<br/>');
            }),
            catchError(() => {
                this.notificationService.addError('Failed to get anomaly details');
                return EMPTY;
            })
        );
    }

    getTransactions(): Observable<EfmGridResponse<any>> {

        return this.http.get<AnomalyDetectionResponse>('/identify_anomalies').pipe(
            map(response => {
                const data: AnomalyDetectionRow[] = JSON.parse(response?.output_sheet) || [];
                for (let i = 0; i < data.length; i++) {
                    data[i].rowNumber = i;
                }
                return { data: data, totalRecords: data?.length || 0 };
            }),
            catchError(() => {
                this.notificationService.addError('Failed to get anomaly data');
                return EMPTY;
            })
        );
    }
}
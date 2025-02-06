import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { EfmNotificationService } from '../../efm-components/notification/public-api';

@Injectable({ providedIn: 'root' })
export class SanctionsService {
  constructor(
    private http: HttpClient,
    private notificationService: EfmNotificationService
  ) { }

  getSanctionEntityData(): Observable<any> {
    return this.http.get<any>('/sanction_entity_list/').pipe(
      map(response => {
        return { data: response, totalRecords: response?.length || 0 };
      }),
      catchError(() => {
        this.notificationService.addError('Failed to get Sanction Entity Data.');
        return EMPTY;
      })
    );
  }
  getSancProcessData(): Observable<any> {
    return this.http.get<any>('/processed-records/').pipe(
      map(response => {
        return { data: response, totalRecords: response?.length || 0 };
      }),
      catchError(() => {
        this.notificationService.addError('Failed to get Sanction Entity Data.');
        return EMPTY;
      })
    );
  }

  sancProcessData(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>('/process_records', formData).pipe(
      map(response => {
        return { data: response, totalRecords: response?.length || 0 };
      }),
      catchError(() => {
        this.notificationService.addError('Failed to get Sanction Entity Data.');
        return EMPTY;
      })
    );
  }
}
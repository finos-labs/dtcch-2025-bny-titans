import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'anomaly-detection', pathMatch: 'full' },
    { path: 'anomaly-detection', loadComponent: () => import('./anomaly-detection/anomaly-detection.component').then(m => m.AnomalyDetectionComponent) },
    { path: 'sanctions', loadComponent: () => import('./sanctions/sanctions.component').then(m => m.SanctionsComponent) },
    { path: '404', loadComponent: () => import('../efm-components/404/public-api').then(m => m.Efm404Component) },
    { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule { }
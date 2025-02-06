import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { EfmCoreModule } from '../efm-components/core/public-api';
import { EfmEnvironmentModule } from '../efm-components/environment/public-api';
import { AppRoutingModule } from './app-routing.module';
import ENVIRONMENTS from '../environments/environments';

export const appConfig: ApplicationConfig = {
    providers: [
        importProvidersFrom(
            AppRoutingModule,
            EfmCoreModule,
            EfmEnvironmentModule.forRoot(ENVIRONMENTS)
        )
    ]
};
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { watchNativeInsets } from './app/core/safe-area';

watchNativeInsets();
bootstrapApplication(App, appConfig).catch((err) => console.error(err));

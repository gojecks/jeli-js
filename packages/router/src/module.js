import { GoFn } from './components/go.directive';
import { jViewFn } from './components/jview.element';
import { OpenIntent } from './components/open.directive';
import { JIntentContainer } from './components/view-container.element';

import { ViewIntentService } from './services/intent.service';
import { ViewInit } from './services/jWebRoute.init';
import { ViewHandler } from './services/jWebViewHandler.service';
import { WebStateProvider } from './services/jwebstate.provider';
import { WebStateService } from './services/jwebstate.service';
import { INITIALIZERS } from '@jeli/core';

// jeli route manager
// created 10-11-15 7:00pm
// created by Gojecks Joseph

jModule({
    services: [
        ViewHandler,
        WebStateService,
        WebStateProvider,
        ViewIntentService,
        {
            name: INITIALIZERS,
            DI: [WebStateProvider, WebStateService],
            factory: ViewInit
        }
    ],
    selectors: [
        jViewFn,
        JIntentContainer,
        GoFn,
        OpenIntent
    ]
})
export function RouterModule() {}
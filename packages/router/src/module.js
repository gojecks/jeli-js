import { GoFn } from './components/go.directive';
import { jViewFn } from './components/jview.element';
import { OpenIntent } from './components/open.directive';
import { JIntentContainer } from './components/view-container.element';

import { ViewIntentService } from './intent.service';
import { jViewInitFn } from './jWebRoute.init';
import { jViewHandlerFn } from './jWebViewHandler.service';
import { WebStateProvider } from './jwebstate.provider';
import { WebStateService } from './jwebstate.service';
import { INITIALIZERS } from '@jeli/core';

// jeli route manager
// created 10-11-15 7:00pm
// created by Gojecks Joseph

jModule({
    services: [
        jViewHandlerFn,
        WebStateService,
        WebStateProvider,
        ViewIntentService,
        {
            name: INITIALIZERS,
            DI: ["$jeliWebStateProvider", "$webState"],
            factory: jViewInitFn
        }
    ],
    selectors: [
        jViewFn,
        JIntentContainer,
        GoFn,
        OpenIntent
    ]
})
export function jEliWebRouteModule() {}
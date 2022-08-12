import { GoFn } from './components/go.directive';
import { jViewFn } from './components/jview.element';
import { OpenIntent } from './components/open.directive';
import { JIntentContainer } from './components/view-container.element';
import { ViewIntentService } from './services/intent.service';
import { ViewHandler } from './services/jWebViewHandler.service';
import { WebStateService } from './services/jwebstate.service';
import { APP_BOOTSTRAP } from '@jeli/core';
import './services/utils';
import { RouterInitService } from './services/router.init.service';
import { LocationService } from './services/route.location.service';

// jeli route manager
// created 10-11-15 7:00pm
// created by Gojecks Joseph

jModule({
    services: [
        ViewHandler,
        WebStateService,
        ViewIntentService,
        {
            name: APP_BOOTSTRAP,
            DI: [LocationService],
            factory: RouterInitService
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
RouterModule.setRoutes = function(routes, elements) {
    if (Array.isArray(routes)) {
        routes.forEach(function(route) { setupRoutes(route, elements); });
    } else {
        setupRoutes(routes, elements);
    }
};
import { RouterModule, ROUTE_INTERCEPTOR } from '@jeli/router';
import { INITIALIZERS } from '@jeli/core';
import { WebStateProvider, WebStateService } from '@jeli/router';
import { CalculatorComponent } from './components/calculator/calculator';
import { RouterPageElement } from './components/route-form-page/route-form-page.element';

export function configureWebState(webStateProvider) {
    webStateProvider.fallback = '/';
}

export function InitializeApp(webStateService) {
    webStateService.events.listener('$webRouteStart', console.log);
}

Service({})
export function validatorService() {
    this.resolve = function(route, locals, next) {
        next();
    }
}

jModule({
    requiredModules: [
        RouterModule
    ],
    services: [{
            name: INITIALIZERS,
            factory: configureWebState,
            DI: [WebStateProvider]
        },
        {
            name: INITIALIZERS,
            factory: InitializeApp,
            DI: [WebStateService]
        },
        {
            name: ROUTE_INTERCEPTOR,
            useClass: validatorService
        }
    ]
})
export function AppRouteModule() {
    RouterModule.setRoutes('app', {
        children: [{
                name: 'calculator',
                url: '/calculator',
                views: {
                    "@content": CalculatorComponent
                }
            },
            {
                name: 'welcome',
                url: '/',
                views: {
                    "@content": RouterPageElement
                }
            }
        ]
    });
}
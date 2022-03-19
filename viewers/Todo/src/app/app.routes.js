import { RouterModule, ROUTE_INTERCEPTOR } from '@jeli/router';
import { INITIALIZERS } from '@jeli/core';
import { WebStateService } from '@jeli/router';
import { CalculatorComponent } from './components/calculator/calculator';
import { RouterPageElement } from './components/route-form-page/route-form-page.element';


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
    RouterModule.setRoutes([{
            name: 'calculator',
            url: '/calculator',
            views: {
                "@content": CalculatorComponent
            }
        },
        {
            name: 'welcome',
            url: '/',
            fallback: true,
            views: {
                "@content": RouterPageElement
            }
        }
    ]);
}
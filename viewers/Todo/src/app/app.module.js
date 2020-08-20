import { CommonModule } from '@jeli/common';
import { DateTimeModule } from '@jeli/common/datetime';
import { FormModule } from '@jeli/form';
import { HttpModule } from '@jeli/http';
import { AppRouteModule } from './app.routes';
import { TestPlaceElement } from './components/test-place';
import { ItemList } from './components/item-list/item-list';
import { AppRootElement } from './app.component';
import { CalculatorComponent } from './components/calculator/calculator';
import { RouterPageElement } from './components/route-form-page/route-form-page.element';


jModule({
    requiredModules: [
        CommonModule,
        DateTimeModule,
        FormModule,
        HttpModule,
        AppRouteModule
    ],
    rootElement: AppRootElement,
    selectors: [
        AppRootElement,
        CalculatorComponent,
        TestPlaceElement,
        ItemList,
        RouterPageElement
    ]
})
export function AppModule() {}
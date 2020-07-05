import { CommonModule } from '@jeli/common';
import { FormModule } from '@jeli/form';
import { HttpModule } from '@jeli/http';
import { TestPlaceElement } from './components/test-place';
import { ItemList } from './components/item-list';
import { AppRootElement } from './app.component';
import { CalculatorComponent } from './components/calculator/calculator';


jModule({
    requiredModules: [
        CommonModule,
        FormModule,
        HttpModule
    ],
    rootElement: AppRootElement,
    selectors: [
        AppRootElement,
        CalculatorComponent,
        TestPlaceElement,
        ItemList
    ]
})
export function AppModule() {
    console.log('triggered')
}
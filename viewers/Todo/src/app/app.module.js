import { CommonModule } from '@jeli/core';
import { jEliFormModule } from '@jeli/form';
import { jEliHttpModule } from '@jeli/http';
import { TestPlaceElement } from './components/test-place';
import { ItemList } from './components/item-list';
import { AppRootElement } from './app.component';

jModule({
    requiredModules: [
        CommonModule,
        jEliFormModule,
        jEliHttpModule
    ],
    rootElement: AppRootElement,
    selectors: [
        AppRootElement,
        TestPlaceElement,
        ItemList
    ]
})
export function AppModule() {
    console.log('triggered')
}
import { CommonModule } from '../../../../dist/modules/common/index';
import { jEliFormModule } from '../../../../dist/modules/form/index';
import { jEliHttpModule } from '../../../../dist/modules/http/index';
import { TestPlaceElement } from './components/test-place';
import { ItemList } from './components/item-list';
import { AppRootElement } from './app.component';

jModule({
    requiredModules: [CommonModule, jEliFormModule, jEliHttpModule],
    rootElement: AppRootElement,
    selectors: [
        AppRootElement,
        TestPlaceElement,
        ItemList
    ]
}, AppModule);

function AppModule() {
    console.log('triggered')
}
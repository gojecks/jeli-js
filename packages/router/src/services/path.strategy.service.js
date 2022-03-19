import { AbstractStrategy } from "./abstract.strategy";

Service({
    static: true
})
export function PathStrategyService(locationService) {
    AbstractStrategy.call(this, locationService);
}

PathStrategyService.prototype = Object.create(AbstractStrategy.prototype);
PathStrategyService.prototype.constructor = AbstractStrategy;
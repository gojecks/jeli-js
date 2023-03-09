import { AbstractStrategy } from "./abstract.strategy";
export function PathStrategyService(locationService) {
    AbstractStrategy.call(this, locationService);

}

PathStrategyService.prototype = Object.create(AbstractStrategy.prototype);
PathStrategyService.prototype.constructor = AbstractStrategy;

PathStrategyService.prototype.path = function() {
    return "";
}
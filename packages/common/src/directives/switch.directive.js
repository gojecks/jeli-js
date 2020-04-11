import { isequal } from 'js.helpers/helpers';
/**
 * 
 * @param {*} viewRef 
 * @param {*} templateRef 
 */
function SwitchViewContext(viewRef, templateRef) {
    this._isCreated = false;
    this.setState = function(create) {
        if (create && !this._isCreated) {
            this.createView();
        } else if (!create && this._isCreated) {
            this.destroyView();
        }
    };

    this.createView = function() {
        this._isCreated = true;
        viewRef.createEmbededView(templateRef);
    };

    this.destroyView = function() {
        this._isCreated = false;
        viewRef.clearView();
    };
}


Directive({
    selector: 'switch',
    props: ['switch']
})
export function SwitchDirective() {
    this._caseCount = 0;
    this.defaultViews;
    this._lastCaseCheckIndex = 0;
    this._isDefaultCase = false;
    this._previousValue = undefined;
    this._lastCaseMatched = false;
    this._addCase = function() {
        this._caseCount++;
    };

    this._addDefaultView = function(viewContext) {
        if (!this.defaultViews) {
            this.defaultViews = [];
        }

        this.defaultViews.push(viewContext);
    };

    Object.defineProperty(this, 'switch', {
        set: function(value) {
            this._jSwitch = value;
            if (isequal(this._caseCount, 0)) {
                this._compileDefaultView(true);
            }
        }
    });
}

SwitchDirective.prototype._compileDefaultView = function(isDefaultCase) {
    if (this.defaultViews && !isequal(this._isDefaultCase, isDefaultCase)) {
        this._isDefaultCase = isDefaultCase;
        for (var i = 0; i < this.defaultViews.length; i++) {
            var defaultView = this.defaultViews[i];
            defaultView.setState(isDefaultCase);
        }
    }
};

SwitchDirective.prototype.viewDidDestroy = function() {

};

SwitchDirective.prototype._matchCase = function(caseValue) {
    var matched = isequal(this._jSwitch, caseValue);
    this._lastCaseMatched = this._lastCaseMatched || matched;
    this._lastCaseCheckIndex++;
    if (isequal(this._lastCaseCheckIndex, this._caseCount)) {
        this._compileDefaultView(!this._lastCaseMatched);
        this._lastCaseCheckIndex = 0;
        this._lastCaseMatched = false;
    }

    return matched;
}




Directive({
    selector: "switchCase",
    props: ["switchCase"],
    DI: ['ViewRef?', 'TemplateRef?', 'jSwitch?:SwitchDirective']
})

export function SwitchCaseDirective(viewRef, templateRef, jSwitch) {
    jSwitch._addCase();
    this._view = new SwitchViewContext(viewRef, templateRef);
    this.willObserve = function() {
        this._view.setState(jSwitch._matchCase(this.switchCase));
    };
}

Directive({
    selector: "switchDefault",
    DI: ['ViewRef?', 'TemplateRef?', 'jSwitch?:SwitchDirective'],
})
export function SwitchDefaultDirective(viewRef, templateRef, jSwitch) {
    jSwitch._addDefaultView(new SwitchViewContext(viewRef, templateRef));
}
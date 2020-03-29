 //@Method _MutationObserver
 // @param : HTMLELEMENT
 // @param : FUNCTION
 var _MutationObserver = (function() {
     var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
     var _regsisteredListeners = [],
         observer,
         observerStarted = false;

     function isInPage(node) {
         return (node === document.body) ? false : !document.body.contains(node);
     }

     function triggerRemovedNodes() {
         _regsisteredListeners = _regsisteredListeners.filter(function(event) {
             var removed = isInPage(event.node);
             if (removed) {
                 event._callback();
             }

             return !removed;
         });
     }

     function inStack(ele) {
         return _regsisteredListeners.some(function(obj) { return obj.node === ele; })
     }

     function startObserver() {
         observer.observe(document.body, {
             attributes: true,
             childList: true,
             characterData: true,
             subtree: true
         });

         observerStarted = true;
     }

     if (MutationObserver) {
         observer = new MutationObserver(function(mutations) {
             mutations.forEach(function(mutation) {
                 if (mutation.removedNodes.length) {
                     triggerRemovedNodes();
                 }
             });
         });

         if (document.body) {
             startObserver();
         }
     }

     /**
      * 
      * @param {*} ele 
      * @param {*} CB 
      */
     function ObserverFacade(ele, CB) {
         if (!ele) {
             return;
         }

         if (!observerStarted) {
             startObserver();
         }

         if (!inStack(ele)) {
             _regsisteredListeners.push({
                 node: ele,
                 _callback: CB || noop
             });
         }
     };

     return ObserverFacade;
 })();
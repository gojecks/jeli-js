 //@Method _MutationObserver
 // @param : HTMLELEMENT
 // @param : FUNCTION
 var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver,
     _mutationObserver = (function() {

         var _regsisteredEvents = [],
             observer,
             observerStarted = false;

         function isInPage(node) {
             return (node === document.body) ? false : !document.body.contains(node);
         }

         function triggerRemovedNodes() {
             _regsisteredEvents = _regsisteredEvents.filter(function(event) {
                 var removed = isInPage(event.node);
                 if (removed) {
                     event._callback();
                 }

                 return !removed;
             });
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



         return function(ele, CB) {
             if (!ele) {
                 return;
             }

             if (!observerStarted) {
                 startObserver();
             }

             if (!_regsisteredEvents.some(function(obj) { return obj.node === ele; })) {
                 _regsisteredEvents.push({
                     node: ele,
                     _callback: CB || noop
                 });
             }
         };
     })();
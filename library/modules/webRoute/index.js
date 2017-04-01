(function()
{

	// jEli route manager
	// created 10-11-15 7:00pm
	// created by Gojecks Joseph

	'use strict';

	jEli
	.jModule('jEli.web.route',{})
	.jElement('jView',['jViewHandler',jViewFn])
	.jElement('go',['$webState',goFn])
	.jElement('jActivityView',['$webState',activityViewFn])
	.jElement('jOpenActivity',['$webState',jOpenActivityFn]);

	//Directive for mimicking Anchor
	function goFn($webState)
	{
		
		return {
			allowType : 'AE',
			$init : function(ele,attr,model)
			{
				ele.bind('click',function(e)
				{
					var splitWhere = attr.where.split(':'),
						goWhere = splitWhere.shift(),
						param = {};

						//where attr contains a parameter
						if(splitWhere.length)
						{
							//convert the required string to OBJECT
							param = jEli.$stringToObject( splitWhere.join(':') , model);
						}

					// state has changed
					$webState.go( $webState.$href(goWhere , param) );

				});
			}
		}
	};

	//jOpenActivity Element Fn
	function jOpenActivityFn($webState){

		return ({
			allowType : 'AE',
			$init : jOpenActivityInitFn
		});

		function jOpenActivityInitFn(ele,attr,model){
			ele.on('click',function(){
				//open the activity
				$webState.openActivity(attr.jOpenActivity || attr.activityName || '');
			});
		}
	}

	function activityViewFn($webState){
		return ({
			template : function(ele,attr){
				//set the header and body view here
			var html = '<div class="jActivityWrapper"';
				html += ((attr.templateUrl)?'j-include="'+attr.templateUrl+'"':'');
				html += ((attr.templateController)?'j-controller="'+attr.templateController+'"':'');
				html +='></div>';

				return html;
			},
			$init : activityViewInitFn
		});

		function _setCss(ele,_css, force){
			var ele = jEli.dom(ele).css(_css);
			if(force){
				ele.removeAttr('style');
			}
			ele = null;
		}

		function openViewPage(css, force){
			//hide all activities
			var _dataRoles = jEli.dom("[view-page]");
		 	_dataRoles.each(function(idx,_ele){
			 	_setCss(_ele, css, force);
			 });
		}

		function activityViewInitFn(ele,attr,model){
			openViewPage({'display':'none'});
			$webState.currentOpenActivity(attr.viewPage);
			//close activity
			model.closeActivity = function(){
				//remove the current ele
				ele.animate({transform:'translateX(-100%)'},100,function(){
					ele.remove();
					$webState.removeActivity(attr.viewPage);
					var nextActivity = $webState.getNextActivity();
					if(nextActivity){
						$webState.transitActivity(nextActivity);
					}else{
						openViewPage({display:'block',transform:'translateX(0px)'}, true);
					}
					
				});
			};
		}
	}


	//j-View Directive Fn
	//As an Elemen <j-view ref="default"></j-view>
	//as Attribute <element j-view="default"></element>

	function jViewFn(jViewHandler)
	{

		return {
			allowType : 'AE',
			$compiler : function(ele,attr)
			{
				return function(ele,attr,model){
					//viewSetter for reference
					attr.ref =  '@' + (attr.ref || attr.jView || '');
					jViewHandler
					.setViewReference(ele,attr,model)
					.events.$broadcast('view.render',attr.ref);

				}
			}
		};
	}


})();
angular.module('searchApp.directives', [])

.directive('selectFocus', function(){
	return {
		link: function(scope, elem, attrs) {
			elem.bind('focus', function() {
				elem.parent().addClass('select-focus');
			});
			elem.bind('blur', function() {
				elem.parent().removeClass('select-focus');
			});
		}
	}
})

.directive('datePicker', function () {
    return {
        restrict: 'A',
        scope: {
        	date: '='
        },
        link: function (scope, element, attrs) {
            element.datepicker({
                dateFormat: scope.format,
                defaultDate: scope.start,
                minDate: 0,
                onSelect: function (date) {
                	scope.$emit("changed", $(element).datepicker('getDate'));
                }
            });
        }
    };
});
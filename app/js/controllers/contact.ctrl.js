angular.module('app').controller('ContactCtrl', function ContactCtrl($scope) {

    var vm = this; // this == $scope because we use the controllerAs definition

    // private variables
    vm.master = {};
    vm.isSending = false;

    // bind public functions
    vm.update = update;
    vm.reset = reset;

    reset();

    $scope.$watch('contactForm.$valid', function(newVal) {
        $scope.valid = newVal;
    });

    ///////////////////////////

    function update() {
        if ($scope.valid) {
            vm.master = angular.copy(vm.message);

            vm.isSending = true;
            $.ajax({
                type: "POST",
                url: 'http://' + location.host + '/sendMessage.php',
                data: JSON.stringify(vm.message),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                complete: function(xhr, data){
                    // show success
                    vm.isSending = false;
                },
                failure: function(errMsg) {
                    console.log(errMsg);
                    vm.isSending = false;
                }
            });
        }
    }

    function reset() {
        vm.message = angular.copy(vm.master);
    }

});

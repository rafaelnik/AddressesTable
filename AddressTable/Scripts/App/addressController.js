var myApp = angular.module('addressApp', []);

    myApp.controller('addressController', function ($scope, $http) {

    $scope.currentPage = 0;
    $scope.addressesPerPage = 100;
    $scope.startDate = "";
    $scope.endDate = "";
    $scope.countryFilter = "";
    $scope.cityFilter = "";
    $scope.streetFilter = "";
    $scope.houseFilter = "";
    $scope.minHouseRange = "";
    $scope.maxHouseRange = "";
    $scope.houseRange = "";
    $scope.postcodeFilter = "";
    $scope.reverseSort = false;

    $scope.setDateRange = function (startDate, endDate) {
        $scope.startDate = startDate;
        $scope.endDate = endDate;
    }

    //сброс фильтров, сортировок, диапазонов домов, дат и условного форматирования колонок таблицы
    $scope.resetFiltersAndSort = function () {
        $scope.sortKey = "";
        $scope.countryFilter = "";
        $scope.cityFilter = "";
        $scope.streetFilter = "";
        
        $scope.houseFilter = "";
        $scope.minHouseRange = "";
        $scope.maxHouseRange = "";
        $scope.houseRange = "";
        $scope.postcodeFilter = "";

        $('#daterange').val('');
        $scope.setDateRange('', '');

        $scope.setTextStyleToAllCollumns();
    }

    // выставляем значения названий элементов интерфейса в зависимости от выбранного языка
    $scope.setInterface = function (langSelected) {
        if (langSelected == 'EN') {
            $scope.interface.changeInterfaceLangMessage = 'Choose interface language:';
            $scope.interface.resetFiltersAndSort = 'Reset filters and sort';
            $scope.interface.country = 'Country';
            $scope.interface.city = 'City';
            $scope.interface.street = 'Street';
            $scope.interface.house = 'House';
            $scope.interface.postcode = 'Postcode';
            $scope.interface.recordDate = 'Record date';
            $scope.interface.goToFirstPage = 'First';
            $scope.interface.goToLastPage = 'Last';
        }
        else if (langSelected == 'RU') {
            $scope.interface.changeInterfaceLangMessage = 'Выберите язык интерфейса:';
            $scope.interface.resetFiltersAndSort = 'Сбросить фильтры и сортировки';
            $scope.interface.country = 'Страна';
            $scope.interface.city = 'Город';
            $scope.interface.street = 'Улица';
            $scope.interface.house = 'Дом';
            $scope.interface.postcode = 'Индекс';
            $scope.interface.recordDate = 'Дата записи';
            $scope.interface.goToFirstPage = 'В начало';
            $scope.interface.goToLastPage = 'В конец';
            
        }
    }
    
    // проверка на 1ю страницу
    $scope.firstPage = function () {
        return $scope.currentPage == 0;
    }

    // проверка на последнюю страницу
    $scope.lastPage = function () {
        return $scope.currentPage + 1 == $scope.numberOfPages;
    }

    // переход на одну страницу назад
    $scope.pageBack = function (step) {
        $scope.currentPage = $scope.currentPage - step;
        $scope.getAddresses();
    }

    // переход на одну страницу вперед
    $scope.pageForward = function (step) {
        $scope.currentPage = $scope.currentPage + step;
        $scope.getAddresses();
    }

    // вызов сортировки по выбранной колонке
    $scope.sortByClickedCol = function (nameOfClickedCol) {

        // проверяем на первое нажатие сортировки 
        if ($scope.sortKey != nameOfClickedCol)
            // и если так то устанавливаем прямую сортировку
            $scope.reverseSort = false;
        else
            // в противном случае меняем направление сортировки
            $scope.reverseSort = !$scope.reverseSort;

        $scope.sortKey = nameOfClickedCol;
        $scope.setTextStyleToAllCollumns();

        $scope.getAddresses();
    }

        // выставляем условное форматирование по состоянию сортировки и фильтров ВСЕХ колонок
    $scope.setTextStyleToAllCollumns = function () {
        $scope.countryTextStyle = $scope.setTextStyleToCol('Country', $scope.countryFilter);
        $scope.cityTextStyle = $scope.setTextStyleToCol('City', $scope.cityFilter);
        $scope.streetTextStyle = $scope.setTextStyleToCol('Street', $scope.streetFilter);
        $scope.houseTextStyle = $scope.setTextStyleToCol('House', $scope.houseRange);
        $scope.postcodeTextStyle = $scope.setTextStyleToCol('Postcode', $scope.postcodeFilter);
        $scope.recordDateTextStyle = $scope.setTextStyleToCol('RecordDate', $scope.startDate, $scope.endDate);
    }

    // возвращаем "класс" для условного форматирования колонки по имени колонки и фильтрам (диапазону)
    // setTextStyleToCol (columnName, filter1); - для колонок с фильтром
    // setTextStyleToCol (columnName, filter1, filter2); - для колонок с диапазонами
    $scope.setTextStyleToCol = function (columnName, filter1, filter2) {
        if (arguments.length == 2) {
            if ((columnName == $scope.sortKey) || (filter1 != '')) return 'text-primary';
            else return '';
        }
        if ((columnName == $scope.sortKey) || ((filter1 != '') && (filter2 != ''))) return 'text-primary';
        else return '';
    }

    // функция удаляет из строки цифры и возвращает получившуюся строку 
    $scope.deleteDigit = function (text) {
        return text.replace(/\d/g, '');
    }

    // функция удаляет из строки все символы кроме цифр и возвращает получившуюся строку 
    $scope.deleteNotDigits = function (text) {
        return text.replace(/\D+/g, '');
    }

    // проверка на ошибку ввода на минимум максимум, при значении минимума диапазона больше максимум значения меняются местами
    $scope.checkMinMaxRange = function () {
        if ((Number($scope.minHouseRange) > Number($scope.maxHouseRange)) && ($scope.maxHouseRange != ''))
        {
            var tmp = $scope.minHouseRange;
            $scope.minHouseRange = $scope.maxHouseRange;
            $scope.maxHouseRange = tmp;
        }
        $scope.setHouseRangeInput();
    }

    // формирование строки для поля диапазона номеров домов 
    $scope.setHouseRangeInput = function () {
        if ($scope.minHouseRange && $scope.maxHouseRange)
            $scope.houseRange = "От " + String($scope.minHouseRange) + " до " + String($scope.maxHouseRange);
        else if ($scope.minHouseRange)
            $scope.houseRange = "От " + String($scope.minHouseRange);
        else if ($scope.maxHouseRange)
            $scope.houseRange = "До " + String($scope.maxHouseRange);
        else if ($scope.houseFilter) $scope.houseRange = String($scope.houseFilter);
        else $scope.houseRange = "";
    }

    // отправка запроса в контроллер HomeController для получения списка адресов
    $scope.getAddresses = function () {

        $scope.addresses = $http({
            method: 'GET',
            url: '/Home/GetAddresses',
            params: {
                currentPage: $scope.currentPage,
                countryFilter: $scope.countryFilter,
                cityFilter: $scope.cityFilter,
                streetFilter: $scope.streetFilter,
                houseFilter: $scope.houseFilter,
                postcodeFilter: $scope.postcodeFilter,
                minHouseRange: $scope.minHouseRange,
                maxHouseRange: $scope.maxHouseRange,
                startDate: $scope.startDate,
                endDate: $scope.endDate,
                sortKey: $scope.sortKey,
                reverseSort: $scope.reverseSort
            }
        }).then(function (result) {
            $scope.addresses = result.data;
            $scope.getNumberOfPages();
        })
    }

    // отправка запроса в контроллер HomeController для получения количества записей, соответсвующих текущей сортировке и фильтрации
    $scope.getNumberOfPages = function () {

        $scope.numberOfPages = $http({
            method: 'GET',
            url: '/Home/GetNumberOfPages',
            params: {
                currentPage: $scope.currentPage,
                countryFilter: $scope.countryFilter,
                cityFilter: $scope.cityFilter,
                streetFilter: $scope.streetFilter,
                houseFilter: $scope.houseFilter,
                postcodeFilter: $scope.postcodeFilter,
                minHouseRange: $scope.minHouseRange,
                maxHouseRange: $scope.maxHouseRange,
                startDate: $scope.startDate,
                endDate: $scope.endDate,
                sortKey: $scope.sortKey,
                reverseSort: $scope.reverseSort
            }
        }).then(function (result) {
            $scope.numberOfPages = result.data;
            if ((($scope.currentPage + 1) > $scope.numberOfPages) && ($scope.numberOfPages != 0)) {
                $scope.currentPage = $scope.numberOfPages - 1;
                $scope.getAddresses();
            }
        })
    }
    });


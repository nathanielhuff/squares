// script.js
(function (window, angular, undefined) {

  // NON-ANGULAR HELPER FUNCTIONS
  function rand (min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function randomHexColor (blacklisted) {
    blacklisted = blacklisted || [];
    function r () {
      return '#'+Math.floor(Math.random()*16777215).toString(16).toUpperCase();
    }
    var c = r();
    while ( blacklisted.indexOf(c) > -1 || c.length < 7 ) {
      c = r();
    }
    return c;
  }

  function windowDimensions () {
    var padded = (document.body.style.padding);

    if (padded) {
      var o = {}, dimensions = ['top', 'bottom', 'left', 'right'];
      for (var i=0,ii=dimensions.length; i<ii; ++i) {
        o[ dimensions[i] ] = parseFloat( window.getComputedStyle(document.body)[ 'padding-'+dimensions[i] ] );
      }
    }

    return {
      width: (padded) ? (document.documentElement.clientWidth) - (o.left + o.right) : document.documentElement.clientWidth,
      height: (padded) ? (document.documentElement.clientHeight) - (o.top + o.bottom) : document.documentElement.clientHeight
    };
  }

  // ANGULAR STUFF

	var appName = 'app';

  angular
    .module(appName, ['ngResize']);

  // directives

  function maxSquareArea ($document, resize) {
    return {
      restrict: 'A',
      scope: true,
      link: function ($scope, $element, $attrs) {

        function setDimensions (element) {
          var winDimensions = windowDimensions();
          var extraDimension = (winDimensions.width > winDimensions.height) ? 'width' : 'height';
          var maxedDimension = (extraDimension === 'width') ? 'height' : 'width';

          element.style[maxedDimension] = '100%';
          element.style[extraDimension] = ( (winDimensions[maxedDimension] / winDimensions[extraDimension]) * 100 ) + '%';

          return element;
        }

        $scope.$on('windowResize', function ($event, data) {

          // Hide $element during resize
          if(!$element.hasClass('hidden')) $element.addClass('hidden');

          // Set the $element's dimensions
          setDimensions( $element[0] );

          // When it's resized, show the $element
          $element.removeClass('hidden');

        });

        resize.trigger($scope);
      }
    }
  }

  angular
    .module(appName)
    .directive('maxSquareArea', maxSquareArea);

  // run time
  function run ($document) {

    function drawSquaredSquare (order, dimension, code) {
      var squares = [];
      var i, j, k; // Counters
      var f = []; // Used as an ordering assistant

      function createSquare (dimensionProportion, left, top) {
        var div = document.createElement('div');

        div.classList.add('sub-square');
        div.style.width = (dimensionProportion * 100) + '%';
        div.style.height = (dimensionProportion * 100) + '%';
        div.style.left = (left * 100) + '%';
        div.style.top = (top * 100) + '%';
        div.style['background-color'] = randomHexColor(['#555555', '#333333']);

        return div;
      }
           
      for (i=0; i<dimension; ++i) {
        f[i] = 0;
      }

      for (k=0; k<order; ++k) {
        i = 0;

        for (j=1; j<dimension; ++j) { 
          if (f[j] < f[i]) {
            i = j;
          }
        }

        // this line needs to be before the next loop... don't know why.
        squares.push( createSquare((code[k]/dimension), (i/dimension), (f[i]/dimension)) );

        // some magic happening here
        for (j=0; j<code[k]; ++j) {
          f[i+j] += code[k];
        }
      }

      return squares;
    }

    function draw (id) {
      if (!BOUWKAMPCODES) {
        return;
      }

      id = id || 'square';

      var idx = rand(0, BOUWKAMPCODES.length - 1);
      var bk = BOUWKAMPCODES[idx];
      var squares = drawSquaredSquare(bk.order, bk.dimension, bk.code);

      var mainSquare = document.getElementById(id);
      for (var i=0,ii=squares.length; i<ii; ++i) {
        mainSquare.appendChild( squares[i] );
      }
    }

    $document.ready(draw);
  }

  angular
    .module(appName)
    .run(run);

})(window, window.angular);
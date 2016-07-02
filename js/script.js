// script.js
(function (window, angular, undefined) {

  // DEFINE IMAGES
  var DIMENSION_THRESHOLD = 75;
  var IMAGES = [
    {
      src: 'img/eat-breakfast.png',
      heading: 'Eat breakfast',
      caption: 'Had some yogurt with granola, nuts, and berries.',
      position: 'left',
      square: true,
      added: false
    },
    {
      src: 'img/hike.jpg',
      heading: 'Take a hike',
      caption: 'Hiked to one of my favorite views to catch the sunset.',
      position: 'left',
      square: true,
      added: false
    },
    {
      src: 'img/lunch-salad.png',
      heading: 'Eat a salad',
      caption: 'A salad from Packer\'s Pizza in Linglestown.',
      position: 'top',
      square: true,
      added: false
    },
    {
      src: 'img/planting-seeds.gif',
      heading: 'Plant something',
      caption: 'Planted beet seeds for the first time.',
      position: '',
      square: true,
      added: false
    },
    {
      src: 'img/walk-dog-1.jpg',
      heading: 'Walk the dog',
      caption: 'I did not have a dog so I had to borrow one.',
      position: 'right',
      square: true,
      added: false
    },
    {
      src: 'img/wear-sunscreen.jpg',
      heading: 'Wear sunscreen',
      caption: 'I am way too used to this.',
      position: 'right',
      square: true,
      added: false
    },
    {
      src: 'img/fresh-strawberries.png',
      heading: 'Eat fresh strawberries',
      caption: 'Home-grown right in the soil of the backyard.',
      position: '',
      square: true,
      added: false
    },
    {
      src: 'img/healthy-recipe.jpg',
      heading: 'Try a healthy new recipe',
      caption: 'Sauteed spinach and grape tomatoes with garlic and avacado oil.',
      position: '',
      square: true,
      added: false
    },
    {
      src: 'img/hm5k.jpg',
      heading: 'Run the Hershey Miracle 5K',
      caption: 'Turns out if you win you get a 5 LB Hershey bar.',
      position: '',
      square: true,
      added: false
    },
    {
      src: 'img/park-backlot.jpg',
      heading: 'Park in the back of the lot',
      caption: 'Probably the easiest of these ones.',
      position: 'right',
      square: true,
      added: false
    },
    {
      src: 'img/take-the-stairs.jpg',
      heading: 'Take the stairs all day',
      caption: 'All stairs, all the time.',
      position: '',
      square: true,
      added: false
    },
    {
      src: 'img/walking-break.jpg',
      heading: 'Take a walking break at lunch',
      caption: 'I would do this every day if I could.',
      position: '',
      square: true,
      added: false
    },
    {
      src: 'img/weeding.jpg',
      heading: 'Pull weeds for 10 minutes',
      caption: 'More like 2 hours. At least I had a friend with me.',
      position: 'top',
      square: true,
      added: false
    },
    {
      src: 'img/frisbee.gif',
      heading: 'Throw frisbee for 10 minutes',
      caption: 'One of many activities at JPL recess.',
      position: '',
      square: true,
      added: false
    }
  ];

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

  function randomGrayColor (blacklisted) {
    blacklisted = blacklisted || [];
    function r () {
      var a = [1,2,3,4,5,6,7,8,9,'a','b','c','d','e'];
      var r1 = a[ rand(0,a.length-1) ];
      var r2 = a[ rand(0,a.length-1) ];
      return '#'+r1+r2+r1+r2+r1+r2;
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
    .module(appName, ['ngAnimate', 'ngResize', 'pathgather.popeye']);

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

  function squareImages ($document, Popeye) {
    return {
      restrict: 'A',
      scope: true,
      link: function ($scope, $element, $attrs) {
        // $element = #square
        
        $scope.$on('squaresDrawn', function () {
          // Get all the sub-squares
          var subSquares = $element[0].querySelectorAll('.sub-square');
          var imageSquares = [];

          // Check each sub-square's dimensions
          for (var i=0, ii=subSquares.length; i<ii; ++i) {
            if ( subSquares[i].getBoundingClientRect().width >= DIMENSION_THRESHOLD ) {
              // Create an image and flag it as added
              for (var j=0,jj=IMAGES.length; j<jj; ++j) {
                if (!IMAGES[j].added && IMAGES[j].square) {
                  // create image
                  var img = $document[0].createElement('img');
                  img.setAttribute('src', IMAGES[j].src);
                  img.classList.add('thumbnail');

                  // create wrapper
                  var wrapper = document.createElement('div');
                  wrapper.classList.add('wrapper');

                  // create icon
                  var icon = $document[0].createElement('img');
                  icon.setAttribute('src', 'img/icon/expand.png');
                  icon.classList.add('expand');

                  // add img and icon to wrapper
                  wrapper.appendChild(img);
                  wrapper.appendChild(icon);
                  
                  // add wrapper to the square along with other data + styles
                  subSquares[i].appendChild(wrapper);
                  subSquares[i].style['background'] = 'none';
                  subSquares[i].setAttribute('data-image-index', j);
                  IMAGES[j].added = true;
                  imageSquares.push(i);
                  break;
                }
              }
            }
          }

          // Add click handlers for squares with images
          for (var i=0, ii=imageSquares.length; i<ii; ++i) {
            angular.element( subSquares[ imageSquares[i] ] ).on('click', function (evt, data) {

              var imgIdx = evt.currentTarget.getAttribute('data-image-index');

              var modal = Popeye.openModal({
                template: [
                  '<div class="background">',
                    '<img src="' + IMAGES[imgIdx].src + '" alt="' + IMAGES[imgIdx].heading + '">',
                    '<div class="wrapper ' + (IMAGES[imgIdx].position || 'bottom') + '">',
                      '<div class="text">',
                        '<h2 class="heading">',
                          IMAGES[imgIdx].heading,
                        '</h2>',
                        '<p class="caption">',
                          IMAGES[imgIdx].caption,
                        '</p>',
                      '</div>',
                    '</div>',
                  '</div>'
                ].join('')
              });
              
              /*  if we need to do stuff after the modal is opened or closed...
                modal.resolved.then(function() {
                  
                });
                
                modal.closed.then(function() {
                  
                });
              */
            });
          }
        });
      }
    };
  }

  angular
    .module(appName)
    .directive('maxSquareArea', maxSquareArea);

  angular
    .module(appName)
    .directive('squareImages', squareImages);

  // run time
  function run ($document, $rootScope) {

    function drawSquaredSquare (order, dimension, code) {
      var squares = [];
      var i, j, k; // Counters
      var f = []; // Used as an ordering assistant

      function createSquare (dimensionProportion, left, top) {
        var div = $document[0].createElement('div');

        div.classList.add('sub-square');
        div.style.width = (dimensionProportion * 100) + '%';
        div.style.height = (dimensionProportion * 100) + '%';
        div.style.left = (left * 100) + '%';
        div.style.top = (top * 100) + '%';
        div.style['background-color'] = randomGrayColor(['#555555', '#333333']);

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

      var mainSquare = $document[0].getElementById(id);
      for (var i=0,ii=squares.length; i<ii; ++i) {
        mainSquare.appendChild( squares[i] );
      }
    }

    $document.ready(function () {
      draw();
      $rootScope.$broadcast('squaresDrawn');
    });
  }

  angular
    .module(appName)
    .run(run);

})(window, window.angular);
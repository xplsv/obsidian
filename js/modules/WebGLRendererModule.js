var WebGLRendererModule = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		width: 800,
		height: 600,
		dom: null

	};

	var CARDBOARD = location.search === '?cardboard';

	var width, height;
	var renderer, effect, controls, camera2;

	var resize = function () {

		var scale = window.innerWidth / width;

		if ( CARDBOARD ) {

			effect.setSize( width * scale, height * scale );

		}

		renderer.setSize( width * scale, height * scale );

		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.left = '0px';
		renderer.domElement.style.top = ( ( window.innerHeight - renderer.domElement.offsetHeight ) / 2 ) + 'px';

	};

	this.init = function ( parameters ) {

		width = parameters.width;
		height = parameters.height;

		renderer = new THREE.WebGLRenderer( { antialias: ! CARDBOARD } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.autoClear = false;

		// TODO: Move outside

		renderer.domElement.addEventListener( 'dblclick', function ( event ) {

			var element = document.body;

			if ( element.requestFullscreen ) {

				element.requestFullscreen();

			} else if ( element.msRequestFullscreen ) {

				element.msRequestFullscreen();

			} else if ( element.mozRequestFullScreen ) {

				element.mozRequestFullScreen();

			} else if ( element.webkitRequestFullscreen ) {

				element.webkitRequestFullscreen();

			}

		} );

		if ( parameters.dom !== null ) {

			parameters.dom.appendChild( renderer.domElement );
			parameters.dom = null; // TODO: Another hack

		}

		// TODO: Remove this nasty global

		if ( CARDBOARD ) {

			camera2 = new THREE.PerspectiveCamera();
			controls = new THREE.DeviceOrientationControls( camera2 );

			effect = new THREE.CardboardEffect( renderer );

			window.renderer = {
				clear: function () {

					effect.renderOut();
					effect.clear();

				},
				render: function ( scene, camera ) {

					camera2.fov = camera.fov;
					camera2.aspect = width / height;
					camera2.near = camera.near;
					camera2.far = camera.far;
					camera2.scale.z = 0.5; // zoom

					camera.add( camera2 );
					camera.updateMatrixWorld( true );

					effect.render( scene, camera2 );

				},
				domElement: renderer.domElement
			};

		} else {

			window.renderer = renderer;

		}

		window.addEventListener( 'resize', resize );

		resize();

	};

	this.update = function ( t ) {

		if ( CARDBOARD ) {

			controls.update();

		}

	};

};

var WebGLRendererModule = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		width: 800,
		height: 600,
		dom: null

	};

	var isWebVR = location.search === '?webvr';

	var width, height;
	var renderer, effect, controls, camera2;

	var resize = function () {

		if ( isWebVR ) {

			effect.setSize( window.innerWidth, window.innerHeight );

			if ( WEBVR.isAvailable() === true ) {

				document.body.appendChild( WEBVR.getButton( effect ) );

			}
		}

		var scale = window.innerWidth / width;

		renderer.setSize( width * scale, height * scale );

		renderer.domElement.style.position = 'absolute';
		renderer.domElement.style.left = '0px';
		renderer.domElement.style.top = ( ( window.innerHeight - renderer.domElement.offsetHeight ) / 2 ) + 'px';

	};

	this.init = function ( parameters ) {

		width = parameters.width;
		height = parameters.height;

		renderer = new THREE.WebGLRenderer( { antialias: true } );
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.autoClear = false;

		var timeoutID;

		renderer.domElement.addEventListener( 'mousemove', function () {

			document.body.style.cursor = 'default';

			if ( timeoutID !== undefined ) {

				clearTimeout( timeoutID );

			}

			timeoutID = setTimeout( function () {

				document.body.style.cursor = 'none';

			}, 1000 );

		} );

		// TODO: Move outside

		if ( parameters.dom !== null ) {

			parameters.dom.appendChild( renderer.domElement );
			parameters.dom = null; // TODO: Another hack

		}

		// TODO: Remove this nasty global

		if ( isWebVR ) {

			camera2 = new THREE.PerspectiveCamera();
			controls = new THREE.VRControls( camera2 );

			effect = new THREE.VREffect( renderer );

			window.renderer = {
				clear: function () {},
				render: function ( scene, camera ) {

					camera2.near = camera.near;
					camera2.far = camera.far;
					camera2.projectionMatrix = camera.projectionMatrix;

					camera.add( camera2 );
					camera.updateMatrixWorld( true );

					effect.render( scene, camera2 );

				},
				domElement: renderer.domElement
			};

		} else {

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

			window.renderer = renderer;

		}

		window.addEventListener( 'resize', resize );

		resize();

	};

	this.start = function () {

		if ( isWebVR ) {

			controls.resetPose();

		}

	};

	this.update = function () {

		if ( isWebVR ) {

			controls.update();

		}

	};

};

import * as THREE from "three";
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { FRAME } from 'Frame.js';

var TextModule = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		text: "empty",
		startPosition: [0, 0, 20],
		endPosition: [0, 0, 40]

	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var camera = new THREE.PerspectiveCamera( 60, width / height, 1, 1000 );

	var scene = new THREE.Scene();

	var texts = {};
	var currentText = null;

	var material = new THREE.LineBasicMaterial( { depthTest: false, opacity: 0.9, transparent: true } );

	//

	var startPosition = new THREE.Vector3();
	var endPosition = new THREE.Vector3();
	var deltaPosition = new THREE.Vector3();

	this.init = function ( parameters ) {

		var string = parameters.text;

		var loader = new FontLoader();
		loader.load( 'files/fonts/helvetiker_regular.typeface.json', function ( font ) {

			var shapes = font.generateShapes( string, 2 );

			var text = new THREE.Object3D();

			var offset = new THREE.Box3();

			for ( var i = 0; i < shapes.length; i ++ ) {

				var shape = shapes[ i ];

				var geometry = new THREE.BufferGeometry().setFromPoints( shape.getPoints() );
				geometry.computeBoundingBox();

				offset.union( geometry.boundingBox );

				var mesh = new THREE.Line( geometry, material );
				text.add( mesh );

				if ( shape.holes && shape.holes.length > 0 ) {

					for ( var j = 0; j < shape.holes.length; j ++ ) {

						var hole = shape.holes[ j ];
						shapes.push( hole );

					}

				}

			}

			text.position.addVectors( offset.min, offset.max ).multiplyScalar( - 0.5 );

			texts[ parameters.text ] = text;

		} );

	};

	this.start = function ( t, parameters ) {

		if ( currentText !== null ) {

			scene.remove( currentText );

		}

		currentText = texts[ parameters.text ];
		scene.add( currentText );

		startPosition.fromArray( parameters.startPosition );
		endPosition.fromArray( parameters.endPosition );
		deltaPosition.subVectors( endPosition, startPosition );

	};

	this.update = function ( t ) {

		camera.position.copy( deltaPosition );
		camera.position.multiplyScalar( t );
		camera.position.add( startPosition );
		camera.lookAt( scene.position );

		renderer.render( scene, camera );

	};

};

export { TextModule };
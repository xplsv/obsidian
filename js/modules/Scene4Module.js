import * as THREE from "three";
import { FRAME } from 'Frame.js';

var Scene4Module = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		startPosition: [0, 0, 0],
		endPosition: [0, 0, 0]

	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var camera = new THREE.PerspectiveCamera( 60, width / height, 1, 2000 );
	camera.up.y = 0.5;
	camera.up.x = -1;
	camera.up.normalize();

	var scene = new THREE.Scene();

	var light = new THREE.PointLight( 0xff0000, 10, 300 );
	scene.add( light );

	var light1 = new THREE.PointLight( 0x8844ff, 2, 1000 );
	light1.position.set( 500, 500, 500 );
	scene.add( light1 );

	var group = new THREE.Object3D();
	scene.add( group );

	var geometry =  new THREE.TetrahedronGeometry( 20, 0 );
	var material = new THREE.MeshLambertMaterial( {
		color: 0x404040,
		flatShading: true,
	} );

	for ( var i = 0; i < 1000; i ++ ) {

		var object = new THREE.Mesh( geometry, material );

		object.position.x = Math.random() - 0.5;
		object.position.y = Math.random() - 0.5;
		object.position.z = Math.random() - 0.5;
		object.position.normalize();
		object.position.multiplyScalar( Math.random() * Math.random() * 2000 + 50 );
		group.add( object );

	}

	var group2 = new THREE.Object3D();
	scene.add( group2 );

	var material = new THREE.MeshLambertMaterial( {
		emissive: 0xf00000,
		flatShading: true,
	} );

	for ( var i = 0; i < 200; i ++ ) {

		var object = new THREE.Mesh( geometry, material );

		object.position.x = Math.random() - 0.5;
		object.position.y = Math.random() - 0.5;
		object.position.z = Math.random() - 0.5;
		object.position.normalize();
		object.position.multiplyScalar( Math.random() * Math.random() * 1000 + 100 );
		group2.add( object );

	}

	// sphere

	var sphere = new THREE.Object3D();
	scene.add( sphere );

	sphere.add( new THREE.Mesh( new THREE.SphereGeometry( 20, 2, 2 ), material ) );
	sphere.add( new THREE.Mesh( new THREE.IcosahedronGeometry( 20, 0 ), material ) );
	sphere.add( new THREE.Mesh( new THREE.BoxGeometry( 20, 20, 20 ), material ) );
	sphere.add( new THREE.Mesh( new THREE.OctahedronGeometry( 20, 0 ), material ) );
	sphere.add( new THREE.Mesh( new THREE.IcosahedronGeometry( 20, 1 ), material ) );
	sphere.add( new THREE.Mesh( new THREE.TetrahedronGeometry( 20, 0 ), material ) );
	sphere.add( new THREE.Mesh( new THREE.TetrahedronGeometry( 20, 1 ), material ) );

	//

	var startPosition = new THREE.Vector3();
	var endPosition = new THREE.Vector3();
	var deltaPosition = new THREE.Vector3();

	this.start = function ( t, parameters ) {

		startPosition.fromArray( parameters.startPosition );
		endPosition.fromArray( parameters.endPosition );
		deltaPosition.subVectors( endPosition, startPosition );

	};

	var prevShape = 0;

	this.update = function ( t ) {

		camera.position.copy( deltaPosition );
		camera.position.multiplyScalar( t );
		camera.position.add( startPosition );
		camera.lookAt( scene.position );

		if ( t > 0.44 ) camera.position.z += 600;

		light.distance = t * 500 + 100;

		var shape = Math.floor( t * 125 ) % sphere.children.length;

		if ( shape !== prevShape ) {

			for ( var i = 0, l = sphere.children.length; i < l; i ++ ) {

				var object = sphere.children[ i ];
				object.visible = i === shape;

			}

			prevShape = shape;

		}

		for ( var i = 0, l = group2.children.length; i < l; i ++ ) {

			var mesh = group2.children[ i ];
			mesh.rotation.x = i + t * 24;
			mesh.rotation.z = i + t * 12;

		}


		for ( var i = 0, l = group.children.length; i < l; i ++ ) {

			var mesh = group.children[ i ];
			mesh.rotation.x = i + t * 6;
			mesh.rotation.z = i + t * 4;

		}

		group2.scale.x = group2.scale.y = group2.scale.z = t * 1 + 0.05;

		sphere.scale.x = sphere.scale.y = sphere.scale.z = t * 18 + 0.2;

		renderer.render( scene, camera );

	};

};

export { Scene4Module };
import * as THREE from 'three';
import { FRAME } from 'Frame.js';

function createInstancedMesh(parameters, count = 800) {

	var geometry = new THREE.BoxGeometry( 2, 2, 2 );
	geometry.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 1, 0 ) );
	var material = new THREE.MeshLambertMaterial(parameters);
	var mesh = new THREE.InstancedMesh(geometry, material, count);

	var dummy = new THREE.Object3D();

	for (var i = 0; i < count; i++) {

		dummy.position.x = Math.random() * 2000 - 1000;
		dummy.position.z = Math.random() * 2000 - 1000;
		dummy.scale.x = Math.random() * 20;
		dummy.scale.y = Math.random() * Math.random() * 100;
		dummy.scale.z = Math.random() * 20;
		dummy.updateMatrix();
		mesh.setMatrixAt(i, dummy.matrix);

	}

	return mesh;

}

var Scene7Module = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		startPosition: [0, 0, 0],
		endPosition: [0, 0, 0],
		startPositionTarget: [ 0, 0, 0 ],
		endPositionTarget: [ 0, 0, 2000 ]

	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var camera = new THREE.PerspectiveCamera( 60, width / height, 1, 4000 );
	var cameraTarget = new THREE.Vector3();

	var scene = new THREE.Scene();

	var light = new THREE.PointLight( 0xff0000, 5, 300 );
	scene.add( light );

	var light1 = new THREE.PointLight( 0x8844ff, 5, 1000 );
	scene.add( light1 );

	// city

	scene.add( createInstancedMesh( { color: 0x808080 } ) )
	scene.add( createInstancedMesh( { color: 0x606060, wireframe: true} ) )

	//

	var group = new THREE.Object3D();
	scene.add( group );

	var geometry =  new THREE.TetrahedronGeometry( 20, 0 );
	var material = new THREE.MeshPhongMaterial( {
		emissive: 0xf00000,
		flatShading: true,
	} );

	for ( var i = 0; i < 400; i ++ ) {

		var object = new THREE.Mesh( geometry, material );
		object.position.x = Math.random() - 0.5;
		object.position.z = Math.random() - 0.5;
		object.position.normalize();
		object.position.multiplyScalar( Math.random() * 80 );
		object.position.y = - Math.random() * 2000 + 2050;
		group.add( object );

	}

	var sphere = new THREE.Object3D();
	sphere.scale.multiplyScalar( 5 );
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

	var startPositionTarget = new THREE.Vector3();
	var endPositionTarget = new THREE.Vector3();
	var deltaPositionTarget = new THREE.Vector3();

	this.start = function ( t, parameters ) {

		startPosition.fromArray( parameters.startPosition );
		endPosition.fromArray( parameters.endPosition );
		deltaPosition.subVectors( endPosition, startPosition );

		startPositionTarget.fromArray( parameters.startPositionTarget );
		endPositionTarget.fromArray( parameters.endPositionTarget );
		deltaPositionTarget.subVectors( endPositionTarget, startPositionTarget );

	};

	var prevShape = 0;

	this.update = function ( t ) {

		camera.position.copy( deltaPosition );
		camera.position.multiplyScalar( t );
		camera.position.add( startPosition );

		cameraTarget.copy( deltaPositionTarget );
		cameraTarget.multiplyScalar( t );
		cameraTarget.add( startPositionTarget );

		camera.lookAt( cameraTarget );

		sphere.position.y = 1900 - ( t  * 1700 );

		group.position.y = sphere.position.y;
		group.rotation.y = t * 15;
		light.position.y = sphere.position.y;

		var shape = Math.floor( t * 525 ) % sphere.children.length;

		if ( shape !== prevShape ) {

			for ( var i = 0, l = sphere.children.length; i < l; i ++ ) {

				var object = sphere.children[ i ];
				object.visible = i === shape;

			}

			prevShape = shape;

		}

		for ( var i = 0, l = group.children.length; i < l; i ++ ) {

			var mesh = group.children[ i ];
			mesh.rotation.x = i + t * 60;
			mesh.rotation.z = i + t * 30;

		}

		renderer.render( scene, camera );

	};

};

export { Scene7Module };
var TextModule = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		text: "empty",
		color: 0xffffff,
		startPosition: [0, 0, 20],
		endPosition: [0, 0, 40]

	};

	var width = renderer.domElement.width;
	var height = renderer.domElement.height;

	var camera = new THREE.PerspectiveCamera( 60, width / height, 1, 1000 );

	var scene = new THREE.Scene();

	var geometries = {};

	var geometry = new THREE.Geometry();
	var material = new THREE.MeshBasicMaterial( { depthTest: false } );

	var mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );

	//
	
	var startPosition = new THREE.Vector3();
	var endPosition = new THREE.Vector3();
	var deltaPosition = new THREE.Vector3();

	this.init = function ( parameters ) {

		var string = parameters.text;
		
		var shapes = THREE.FontUtils.generateShapes( string, {
			font: "helvetiker",
			size: 2
		} );
		
		var geometry = new THREE.ShapeGeometry( shapes );
		THREE.GeometryUtils.center( geometry );
		
		geometries[ string ] = geometry;
		
	}
		
	this.start = function ( t, parameters ) {
	 
		delete mesh.__webglInit; // TODO: Remove (WebGLRenderer refactoring)
		mesh.geometry = geometries[ parameters.text ];
	 
		if ( parameters.color !== undefined ) {
		
			material.color.setHex( parameters.color );
		
		} else {
			
			material.color.setHex( 0xffffff );
			
		}
	 
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

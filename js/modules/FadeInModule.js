var FadeInModule = function () {

	FRAME.Module.call( this );

	this.parameters.input = {

		color: 0xffffff,
		opacity: 1

	};

	var camera, scene, material;
	var opacity = 1;

	this.init = function ( parameters ) {

		camera = new THREE.PerspectiveCamera( 60, 1, 1, 10 );

		material = new THREE.MeshBasicMaterial( {
			color: parameters.color,
			depthTest: false,
			side: THREE.BackSide,
			transparent: true
		} );

		scene = new THREE.Scene();

		var object = new THREE.Mesh( new THREE.BoxGeometry( 5, 5, 5 ), material );
		scene.add( object );

		opacity = this.parameters.input.opacity;

	};

	this.start = function ( t, parameters ) {

		material.color.setHex( parameters.color );
		opacity = parameters.opacity;

	};

	this.update = function ( t ) {

		material.opacity = ( 1 - t ) * opacity;
		renderer.render( scene, camera );

	};

};

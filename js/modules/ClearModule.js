import { FRAME } from 'Frame.js';

var ClearModule = function () {

	FRAME.Module.call( this );

	this.update = function ( t ) {

		renderer.clear();

	};

};

export { ClearModule };
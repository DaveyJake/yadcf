/**
 * Polyfill functions.
 *
 * @since 0.9.5beta
 */

// NodeList.prototype.forEach
export const forEach = function( callback: () => any, thisArg: Node | Window ) {
	thisArg = thisArg || window;

	for ( var i = 0; i < this.length; i++ ) {
		callback.call( thisArg, this[i], i, this );
	}
};

// Object.entries
export const entries = function( obj: { [ key: string ]: any } ) {
	const ownProps = Object.keys( obj );

	let i        = ownProps.length,
			resArray = new Array( i ); // preallocate the Array

	while ( i-- ) {
		resArray[i] = [ ownProps[i], obj[ ownProps[i] ] ];
	}

	return resArray;
};

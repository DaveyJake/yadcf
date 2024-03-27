import isPlainObject from './is-plain-object';

export const extend = function( ...args: any ) {
	let target: any = args[ 0 ] || {},
      i: number = 1,
      length: number = args.length,
      deep: boolean = false,
      options: Record<string, any>,
      name: string,
      src: any,
      copy: any,
      copyIsArray: boolean,
      clone: any;

	// Handle a deep copy situation
	if ( typeof target === 'boolean' ) {
		deep = target;

		// Skip the boolean and the target
		target = args[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== 'object' && typeof target !== 'function' ) {
		target = {};
	}

	// Extend this object itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = args[ i ] ) !== null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === '__proto__' || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( isPlainObject( copy ) || Array.isArray( copy ) ) ) {
					copyIsArray = Array.isArray( copy );
					src         = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};
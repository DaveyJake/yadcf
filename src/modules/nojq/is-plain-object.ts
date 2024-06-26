import fnToString from 'jquery/src/var/fnToString';
import getProto from 'jquery/src/var/getProto';
import hasOwn from 'jquery/src/var/hasOwn';
import toString from 'jquery/src/var/toString';
import ObjectFunctionString from 'jquery/src/var/ObjectFunctionString';

export const isPlainObject = ( obj: Record<string, any> ): boolean => {
  let proto: Record<string, any>,
      Ctor;

  // Detect obvious negatives
  // Use toString instead of jQuery.type to catch host objects
  if ( !obj || toString.call( obj ) !== '[object Object]' ) {
    return false;
  }

  proto = getProto( obj );

  // Objects with no prototype (e.g., `Object.create( null )`) are plain
  if ( !proto ) {
    return true;
  }

  // Objects with prototype are plain iff they were constructed by a global Object function
  Ctor = hasOwn.call( proto, 'constructor' ) && proto.constructor;
  return typeof Ctor === 'function' && fnToString.call( Ctor ) === ObjectFunctionString;
};
export class TypeUtil
{
	/**
	 *	@param data	{any}
	 *	@returns {boolean}
	 */
	static isObject( data )
	{
		const typeOfData = typeof data;
		if ( 'object' !== typeOfData )
		{
			return false;
		}
		return ! Array.isArray( data );
	}

	/**
	 *	@param data	{any}
	 *	@returns {boolean}
	 */
	static isNotNullObject( data )
	{
		if ( ! this.isObject( data ) )
		{
			return false;
		}
		return null !== data;
	}

	/**
	 *	@param data	{any}
	 *	@param keys	{Array<string>}
	 *	@returns {boolean}
	 */
	static isNotNullObjectWithKeys( data, keys )
	{
		if ( ! this.isNotNullObject( data ) )
		{
			return false;
		}
		if ( Array.isArray( keys ) )
		{
			for ( const key of keys )
			{
				if ( ! data.hasOwnProperty( key ) )
				{
					return false;
				}
			}
		}

		return true;
	}

	/**
	 *	@param data	{any}
	 *	@returns {boolean}
	 */
	static instanceOfWxEncryptedData( data )
	{
		return this.isNotNullObjectWithKeys( data, [ 'encryptedData', 'iv' ] ) &&
		       'string' === typeof data.encryptedData &&
		       'string' === typeof data.iv
			;
	}

	/**
	 *	@param str	{any}
	 *	@returns {boolean}
	 */
	static isNumeric( str )
	{
		return 'number' === typeof str || 'bigint' === typeof str;
	}

	/**
	 *	@param obj	{any}
	 *	@returns {number}
	 */
	static getIntValue( obj )
	{
		if ( this.isNumeric( obj ) || this.isString( obj ) )
		{
			return parseInt( obj );
		}

		return 0;
	}

	/**
	 *	@param obj	{any}
	 *	@returns {number}
	 */
	static getFloatValue( obj )
	{
		if ( this.isNumeric( obj ) || this.isString( obj ) )
		{
			return parseFloat( obj );
		}

		return 0;
	}

	/**
	 *	@param str	{any}
	 *	@returns {boolean}
	 */
	static isString( str )
	{
		return 'string' === typeof str;
	}

	/**
	 *	@param str	{any}
	 *	@returns {boolean}
	 */
	static isFunction( str )
	{
		return 'function' === typeof str;
	}

	/**
	 *	@param str {any}
	 *	@returns {boolean}
	 */
	static isNotEmptyString( str )
	{
		//	允许空格
		return this.getStringLength( str ) > 0;
	}

	/**
	 *	@param str	{any}
	 *	@returns {string}
	 */
	static nullToEmpty( str )
	{
		if ( this.isNotEmptyString( str ) )
		{
			return str;
		}

		return '';
	}

	/**
	 *	@param str	{any}
	 *	@returns {number}
	 */
	static getStringLength( str )
	{
		return this.isString( str ) ? str.length : 0;
	}

	/**
	 *	@param object	{any}
	 *	@returns {*|number}
	 */
	static getObjectLength( object )
	{
		if ( 'string' === typeof object )
		{
			return object.length;
		}
		else if ( 'number' === typeof object )
		{
			return String( object ).length;
		}
		else if ( Array.isArray( object ) )
		{
			return object.length;
		}

		return 0;
	}
}

export class TypeUtil
{
	/**
	 *	@param data	{any}
	 *	@returns {boolean}
	 */
	public static isObject( data : any ) : boolean
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
	public static isNotNullObject( data : null ) : boolean
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
	public static isNotNullObjectWithKeys( data : any, keys : string[] ) : boolean
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
	public static instanceOfWxEncryptedData( data : any ) : boolean
	{
		return data &&
			this.isNotNullObjectWithKeys( data, [ 'encryptedData', 'iv' ] ) &&
		       'string' === typeof data[ 'encryptedData' ] &&
		       'string' === typeof data[ 'iv' ]
			;
	}

	/**
	 *	@param str	{any}
	 *	@returns {boolean}
	 */
	public static isNumeric( str : any ) : boolean
	{
		return 'number' === typeof str || 'bigint' === typeof str;
	}

	/**
	 *	@param obj	{any}
	 *	@returns {number}
	 */
	public static getIntValue( obj : any ) : number
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
	public static getFloatValue( obj : any ) : number
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
	public static isString( str : any ) : boolean
	{
		return 'string' === typeof str;
	}

	/**
	 *	@param str	{any}
	 *	@returns {boolean}
	 */
	public static isFunction( str : any ) : boolean
	{
		return 'function' === typeof str;
	}

	/**
	 *	@param str {any}
	 *	@returns {boolean}
	 */
	public static isNotEmptyString( str : string ) : boolean
	{
		//	允许空格
		return this.getStringLength( str ) > 0;
	}

	/**
	 *	@param str	{any}
	 *	@returns {string}
	 */
	public static nullToEmpty( str : string ) : string
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
	public static getStringLength( str : any ) : number
	{
		return this.isString( str ) ? str.length : 0;
	}

	/**
	 *	@param object	{any}
	 *	@returns {*|number}
	 */
	public static getObjectLength( object : any ) : number
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

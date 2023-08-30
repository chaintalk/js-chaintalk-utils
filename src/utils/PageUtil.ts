import { TypeUtil } from "./TypeUtil";

export class PageUtil
{
	public static defaultPageNo : number = 1;
	public static defaultPageSize : number = 30;
	public static defaultPageSizeMin : number = 1;
	public static defaultPageSizeMax : number = 100;


	/**
	 *	@param pageNo		{number}
	 *	@param defaultValue	{number}
	 *	@returns {number}
	 */
	public static getSafePageNo( pageNo : number, defaultValue ?: number ) : number
	{
		if ( pageNo > 0 )
		{
			return pageNo;
		}
		if ( TypeUtil.isNumeric( defaultValue ) && defaultValue && defaultValue > 0 )
		{
			return defaultValue;
		}

		return this.defaultPageNo;
	}


	/**
	 *	@param pageSize		{number}
	 *	@param defaultValue	{number}
	 *	@returns {number}
	 */
	public static getSafePageSize( pageSize : number, defaultValue ?: number ) : number
	{
		if ( this.isValidPageSize( pageSize ) )
		{
			return pageSize;
		}
		if ( undefined !== defaultValue && this.isValidPageSize( defaultValue ) )
		{
			return defaultValue;
		}

		return this.defaultPageSize;
	}

	/**
	 *	@param value	{any}
	 *	@returns {boolean}
	 */
	public static isValidPageSize( value : any ) : boolean
	{
		if ( undefined !== value || ! TypeUtil.isNumeric( value ) )
		{
			return false;
		}

		return value >= this.defaultPageSizeMin && value <= this.defaultPageSizeMax;
	}
}

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
	public static getSafePageNo( pageNo ? : number, defaultValue ? : number ) : number
	{
		if ( undefined !== pageNo && pageNo > 0 )
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
	public static getSafePageSize( pageSize ? : number, defaultValue ? : number ) : number
	{
		if ( undefined !== pageSize && this.isValidPageSize( pageSize ) )
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
		if ( !TypeUtil.isNumeric( value ) )
		{
			return false;
		}

		return value >= this.defaultPageSizeMin && value <= this.defaultPageSizeMax;
	}

	/**
	 *	@param arr	{Array<*>}
	 *	@param pageNo	{number}
	 *	@param pageSize	{number}
	 *	@returns {Array<*>}
	 */
	public static getRangeFromArrayByPage<T>( arr : Array<T>, pageNo : number, pageSize : number ) : Array<T>
	{
		if ( ! Array.isArray( arr ) || 0 === arr.length )
		{
			return [];
		}

		pageNo = this.getSafePageNo( pageNo );
		pageSize = this.getSafePageSize( pageSize );
		const startIndex : number = ( pageNo - 1 ) * pageSize;
		const endIndex : number = Math.min( pageNo * pageSize, arr.length ) - 1;

		return this.getRangeFromArrayByIndex<T>( arr, startIndex, endIndex );
	}

	/**
	 *	@param arr		{Array<*>}
	 *	@param startIndex	{number}
	 *	@param endIndex		{number}
	 *	@returns {Array<*>}
	 */
	public static getRangeFromArrayByIndex<T>( arr : Array<T>, startIndex : number, endIndex : number ) : Array<T>
	{
		if ( ! Array.isArray( arr ) || 0 === arr.length )
		{
			return [];
		}
		if ( startIndex < 0 )
		{
			startIndex = 0;
		}
		if ( endIndex >= arr.length )
		{
			endIndex = arr.length - 1;
		}
		if ( startIndex > endIndex )
		{
			return [];
		}

		//
		//	const data = [10, 20, 30, 40, 50, 60, 70, 80];
		//
		// 	const startIndex = 2;
		// 	const endIndex = 5;
		//
		// 	const extractedData = getRangeFromArray(data, startIndex, endIndex);
		// 	console.log(extractedData); // Output: [30, 40, 50, 60]
		//
		return arr.slice( startIndex, endIndex + 1 );
	}
}

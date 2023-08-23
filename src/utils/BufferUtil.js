/**
 * 	class BufferUtil
 */
export class BufferUtil
{
	/**
	 *	@param arr {Uint8Array}
	 *	@param trimLeft {boolean}
	 *	@param trimRight {boolean}
	 */
	static trimZeroOfUint8Array( arr, trimLeft = true, trimRight = true )
	{
		let start = 0;
		let end = arr.length - 1;

		if ( trimLeft )
		{
			//	find the index of the first non-zero element
			while ( start < arr.length && 0 === arr[ start ] )
			{
				start ++;
			}
		}
		if ( trimRight )
		{
			//	find the index of the last non-zero element
			while ( end >= 0 && 0 === arr[ end ] )
			{
				end --;
			}
		}

		//	Creates a new Uint8Array containing only the range of non-zero elements
		return new Uint8Array( arr.subarray( start, end + 1 ) );
	}
}

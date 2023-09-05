export class TestUtil
{
	/**
	 *	@param ms	{number}
	 *	@returns {Promise<void>}
	 */
	public static sleep( ms : number ) : Promise<void>
	{
		return new Promise(resolve => setTimeout( resolve, ms ) );
	}

	/**
	 * 	@returns {boolean}
	 */
	public static isTestEnv() : boolean
	{
		return this.isJestEnv();
	}

	/**
	 * 	@returns {boolean}
	 */
	public static isJestEnv() : boolean
	{
		try
		{
			if ( process &&
				process.env &&
				process.env.NODE_ENV &&
				process.env.NODE_ENV === 'test' &&
				process.env.JEST_WORKER_ID )
			{
				return true;
			}
		}
		catch ( err )
		{
		}

		return false;
	}
}

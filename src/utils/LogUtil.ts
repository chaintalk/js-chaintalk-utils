import { TestUtil } from "./TestUtil";

export class LogUtil
{
	public static LEVEL_DEBUG	= 0;
	public static LEVEL_INFO	= 1;
	public static LEVEL_WARNING	= 2;
	public static LEVEL_ERROR	= 3;
	public static LEVEL_FATAL	= 4;

	//	define log level
	public static logLevel		= this.LEVEL_DEBUG;

	constructor()
	{
		//	only print logs with level greater than or equal to the defined level
		LogUtil.logLevel = LogUtil.LEVEL_DEBUG;
	}

	/**
	 *	@param args {any[]}
	 */
	public static debug( ...args: any[] ) : void
	{
		this.output( LogUtil.LEVEL_DEBUG, args );
	}

	/**
	 *	@param args {any[]}
	 */
	public static info( ...args: any[] ) : void
	{
		this.output( LogUtil.LEVEL_INFO, args );
	}

	/**
	 *	@param args {any[]}
	 */
	public static warn( ...args: any[] ) : void
	{
		this.output( LogUtil.LEVEL_WARNING, args );
	}

	/**
	 *	@param args {any[]}
	 */
	public static error( ...args: any[] ) : void
	{
		this.output( LogUtil.LEVEL_ERROR, args );
	}

	/**
	 *	@param args {any[]}
	 */
	public static fatal( ...args: any[] ) : void
	{
		this.output( LogUtil.LEVEL_FATAL, args );
	}

	/**
	 *	@param args {any[]}
	 */
	public static say( ...args: any[] ) : void
	{
		for ( const arg of args )
		{
			console.log( `))) ${ arg }` );
		}
	}

	/**
	 *	@param args {any[]}
	 *	@param level {number}
	 */
	public static output( level: number, ...args: any[][] ) : void
	{
		if ( TestUtil.isTestEnv() )
		{
			//	output nothing in test env
			return;
		}

		if ( level >= LogUtil.logLevel )
		{
			//	使用剩余参数数组
			for ( const arg of args )
			{
				switch ( level )
				{
					case LogUtil.LEVEL_WARNING:
						console.warn( `[${ new Date() }] : `, arg[ 0 ] );
						break;
					case LogUtil.LEVEL_ERROR:
					case LogUtil.LEVEL_FATAL:
						console.error( `[${ new Date() }] : `, arg[ 0 ] );
						break;
					default:
						console.log( `[${ new Date() }] : `, arg[ 0 ] );
				}
			}
		}
	}
}

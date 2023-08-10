import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { TypeUtil } from "../../utils/TypeUtil.js";
import fs from "fs";

/**
 * 	define constants
 */
const __filename = fileURLToPath( import.meta.url );
const __dirname = dirname( __filename );


export class StorageService
{
	static get __filename()
	{
		return __filename;
	}

	static get __dirname()
	{
		return __dirname;
	}

	/**
	 *	@returns {string}
	 */
	static getConfigDirectory()
	{
		return `/etc/chaintalk`;
		// const srcDir = resolve( resolve( __dirname, ".." ), ".." );
		// return resolve( srcDir, ".." );
	}

	/**
	 * 	load data from local file
	 * 	@param filename
	 * 	@returns {Promise<string | Buffer>}
	 */
	static async loadDataFromFile( filename )
	{
		return new Promise( ( resolve, reject ) =>
		{
			try
			{
				if ( ! fs.existsSync( filename ) )
				{
					return reject( `file not found` );
				}

				//	...
				fs.readFile( filename, ( err, data ) =>
				{
					if ( err )
					{
						return reject( err );
					}

					resolve( data );
				} );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 *	@param filename
	 *	@param data
	 *	@returns {Promise<boolean>}
	 */
	static saveDataToFile( filename, data )
	{
		return new Promise( ( resolve, reject ) =>
		{
			try
			{
				if ( ! TypeUtil.isNotEmptyString( filename ) )
				{
					return reject( `invalid filename` );
				}

				//
				//	filename	<string> | <Buffer> | <URL> | <integer> filename or file descriptor
				//	data		<string> | <Buffer> | <TypedArray> | <DataView>
				//
				fs.writeFile( filename, data, {
					encoding : "utf8",
					flag : "w",
					mode : 0o666
				}, ( err ) =>
				{
					if ( err )
					{
						reject( err );
					}

					resolve( true );
				} );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}
}

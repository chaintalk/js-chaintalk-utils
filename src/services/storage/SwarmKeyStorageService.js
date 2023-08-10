import fs from 'fs';
import { generateKey } from 'libp2p/pnet';
import { toString as uint8ArrayToString } from "uint8arrays";

import { StorageService } from './StorageService.js';
import { LogUtil } from "../../utils/LogUtil.js";
import { TypeUtil } from "../../utils/TypeUtil.js";


export class SwarmKeyStorageService
{
	/**
	 *	@returns {string}
	 */
	static getDefaultFilename()
	{
		return `${ StorageService.getConfigDirectory() }/.swarmKey`;
	}

	/**
	 *	@param obj
	 *	@returns {boolean}
	 */
	static isValidSwarmObject( obj )
	{
		return TypeUtil.isNotNullObjectWithKeys( obj, [ 'protocol', 'encode', 'key' ] );
	}

	/**
	 *	@param swarmKey
	 *	@returns {{encode: string, protocol: string, key: string}|null}
	 */
	static swarmKeyToObject( swarmKey )
	{
		if ( swarmKey instanceof Uint8Array )
		{
			swarmKey = this.swarmKeyToString( swarmKey );
		}
		if ( ! TypeUtil.isNotEmptyString( swarmKey ) )
		{
			return null;
		}

		const lines = swarmKey.split( /\r?\n/ );
		if ( ! Array.isArray( lines ) || lines.length < 3 )
		{
			return null;
		}

		const [ protocol, encode, key ] = lines;
		if ( ! TypeUtil.isNotEmptyString( protocol ) ||
		     ! TypeUtil.isNotEmptyString( encode ) ||
		     ! TypeUtil.isNotEmptyString( key ) )
		{
			return null;
		}

		return {
			protocol,
			encode,
			key
		}
	}

	/**
	 *	@param swarmKey
	 *	@returns { string | null }
	 */
	static swarmKeyToString( swarmKey )
	{
		try
		{
			return uint8ArrayToString( swarmKey );
		}
		catch ( err )
		{
			console.error( err );
		}

		return null;
	}

	/**
	 *	@param filename
	 *	@returns {Promise<Uint8Array>}
	 */
	static async flushSwarmKey( filename )
	{
		//	load from local file .swarmKey
		const swarmKey = await SwarmKeyStorageService.loadSwarmKey( filename );
		if ( swarmKey )
		{
			return swarmKey;
		}

		//	generate a new swarmKey
		const writer = fs.createWriteStream( SwarmKeyStorageService.getDefaultFilename(), {
			encoding : "utf8",
			flag : "w",
			mode : 0o666
		} );
		generateKey( writer );
		writer.close();

		//	load and return
		return await SwarmKeyStorageService.loadSwarmKey( filename );
	}

	/**
	 *	@param filename
	 *	@returns {Promise<{encode: string, protocol: string, key: string}>}
	 */
	static async loadSwarmObject( filename )
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const swarmKey = await this.loadSwarmKey( filename );
				const swarmObject = this.swarmKeyToObject( swarmKey );
				resolve( swarmObject );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 *	@param filename
	 *	@returns {Promise<Uint8Array>}
	 */
	static async loadSwarmKey( filename )
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const swarmKeyFilename = filename || SwarmKeyStorageService.getDefaultFilename();
				if ( ! fs.existsSync( swarmKeyFilename ) )
				{
					LogUtil.debug( `swarmKey file not found : ${ swarmKeyFilename }` );
					return resolve( null );
				}

				//	...
				const data = await StorageService.loadDataFromFile( swarmKeyFilename );
				if ( ! data instanceof Uint8Array ||
					0 === data.byteLength ||
					0 === data.length )
				{
					LogUtil.debug( `invalid swarmKey file` );
					return resolve( null );
				}

				resolve( data );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}
}

import fs from 'fs';
import { generateKey } from 'libp2p/pnet';
import { toString as uint8ArrayToString } from "uint8arrays";

import { StorageService } from './StorageService.js';
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
	 *	@param filename
	 *	@returns {*|string}
	 */
	static getSafeFilename( filename )
	{
		if ( ! filename || ! TypeUtil.isNotEmptyString( filename ) )
		{
			return SwarmKeyStorageService.getDefaultFilename();
		}

		return filename;
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
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				filename = SwarmKeyStorageService.getSafeFilename( filename );

				try
				{
					//	try load from local file .swarmKey
					const swarmKey = await SwarmKeyStorageService.loadSwarmKey( filename );
					if ( swarmKey )
					{
						return resolve( swarmKey );
					}
				}
				catch ( err )
				{
					//	do nothing
				}

				//
				//	generate a new swarmKey
				//
				const writer = fs.createWriteStream( filename, {
					encoding : "utf8",
					flag : "w",
					mode : 0o666
				} );
				generateKey( writer );
				writer.close();

				//	load and return
				resolve( await SwarmKeyStorageService.loadSwarmKey( filename ) );
			}
			catch ( err )
			{
				reject( err );
			}
		});
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
				filename = SwarmKeyStorageService.getSafeFilename( filename );

				//	...
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
				filename = SwarmKeyStorageService.getSafeFilename( filename );
				if ( ! fs.existsSync( filename ) )
				{
					return reject( `swarmKey file not found : ${ filename }` );
				}

				//	...
				const data = await StorageService.loadDataFromFile( filename );
				if ( ! data instanceof Uint8Array ||
					0 === data.byteLength ||
					0 === data.length )
				{
					return resolve( `invalid swarmKey file` );
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

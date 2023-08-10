import fs from 'fs';
import { toString as uint8ArrayToString } from 'uint8arrays'

import { createFromJSON } from '@libp2p/peer-id-factory'
import { StorageService } from './StorageService.js';
import { TypeUtil } from '../../utils/TypeUtil.js';


/**
 * 	class PeerIdStorageService
 */
export class PeerIdStorageService
{
	getFilename()
	{
		return `${ StorageService.getConfigDirectory() }/.peerId`;
	}

	/**
	 *	@param rawPeerIdObject	- {PeerId}
	 *	@returns {{privKey: string, id: string, pubKey: string}|null}
	 */
	storagePeerIdFromRaw( rawPeerIdObject )
	{
		if ( ! this.isValidPeerId( rawPeerIdObject ) )
		{
			return null;
		}

		try
		{
			//	convert to storage format
			return {
				id: uint8ArrayToString( rawPeerIdObject.multihash.bytes, 'base58btc' ),
				privKey: uint8ArrayToString( rawPeerIdObject.privateKey, 'base64pad' ),
				pubKey: uint8ArrayToString( rawPeerIdObject.publicKey, 'base64pad' )
			};
		}
		catch ( err ) {}

		return null;
	}

	/**
	 * 	convert storagePeerId to PeerId
	 *	@param storagePeerIdObject	{{privKey: string, id: string, pubKey: string}}
	 *	@returns {Promise<PeerId>}
	 */
	async peerIdFromStorage( storagePeerIdObject )
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! this.isValidStoragePeerId( storagePeerIdObject ) )
				{
					return reject( `invalid storagePeerIdObject` );
				}

				//	PeerId : { id: string, privKey?: string, pubKey?: string }
				const peerId = await createFromJSON( storagePeerIdObject );
				resolve( peerId );
			}
			catch ( err )
			{
				reject( err );
			}
		});
	}


	isValidStoragePeerId( peerIdObject )
	{
		return TypeUtil.isNotNullObjectWithKeys( peerIdObject, [ 'id', 'privKey', 'pubKey' ] );
	}

	isValidPeerId( peerIdObject )
	{
		return TypeUtil.isNotNullObjectWithKeys( peerIdObject, [ 'type', 'multihash', 'privateKey', 'publicKey' ] );
	}

	/**
	 *	@param	filename	{string}
	 *	@returns {Promise<{ id: string, privKey: string, pubKey: string }>}
	 */
	async loadStoragePeerId( filename )
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const peerIdDataFilename = filename || this.getFilename();
				if ( ! fs.existsSync( peerIdDataFilename ) )
				{
					return resolve( `file not found : ${ peerIdDataFilename }` );
				}

				const dataObject = await StorageService.loadDataFromFile( peerIdDataFilename );
				const jsonString = String( dataObject );
				if ( 'string' !== typeof jsonString ||
				     ! TypeUtil.isNotEmptyString( jsonString ) )
				{
					return reject( `empty content in file : ${ peerIdDataFilename }` );
				}

				const storagePeerIdObject = JSON.parse( jsonString );
				if ( ! this.isValidStoragePeerId( storagePeerIdObject ) )
				{
					return reject( `invalid peerId in file : ${ peerIdDataFilename }` );
				}

				return resolve( storagePeerIdObject );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}


	/**
	 *	@param filename
	 *	@returns {Promise<PeerId>}
	 */
	async loadPeerId( filename )
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const storagePeerIdObject = await this.loadStoragePeerId( filename );

				//	PeerId : { id: string, privKey?: string, pubKey?: string }
				const rawPeerIdObject = await this.peerIdFromStorage( storagePeerIdObject );
				if ( ! this.isValidPeerId( rawPeerIdObject ) )
				{
					return reject( `invalid peerId` );
				}

				//	...
				resolve( rawPeerIdObject );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 *	@param	rawPeerIdObject		- {PeerId}
	 *	@returns {Promise<boolean>}
	 */
	savePeerId( rawPeerIdObject )
	{
		//
		//	rawPeerIdObject:
		//	{
		//		readonly type: 'RSA'
		//		readonly multihash: MultihashDigest
		//		readonly privateKey?: Uint8Array
		//		readonly publicKey?: Uint8Array
		//	}
		//
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				if ( ! this.isValidPeerId( rawPeerIdObject ) )
				{
					return reject( `invalid rawPeerIdObject` );
				}

				const peerIdObject = this.storagePeerIdFromRaw( rawPeerIdObject );
				const peerIdJsonString = JSON.stringify( peerIdObject );
				await StorageService.saveDataToFile( this.getFilename(), peerIdJsonString );

				//	...
				resolve( true );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}
}

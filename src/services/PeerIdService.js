import { createRSAPeerId } from '@libp2p/peer-id-factory'
import { PeerIdStorageService } from "./storage/PeerIdStorageService.js";
import { toString as uint8ArrayToString } from "uint8arrays/to-string";


export class PeerIdService
{
	/**
	 * 	@returns {Promise<RSAPeerId>}
	 */
	static async generatePeerId()
	{
		//
		//	readonly type: 'RSA'
		//	readonly multihash: MultihashDigest
		//	readonly privateKey?: Uint8Array
		//	readonly publicKey?: Uint8Array
		//
		return await createRSAPeerId();
	}

	/**
	 *	@returns {Promise<PeerId>}
	 */
	static async flushPeerId( filename )
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				//
				//	export type PeerId = RSAPeerId | Ed25519PeerId | Secp256k1PeerId
				//
				const rsaPeerIdObject = await this.generatePeerId();
				await new PeerIdStorageService().savePeerId( filename, rsaPeerIdObject );
				resolve( rsaPeerIdObject );
			}
			catch ( err )
			{
				reject( err );
			}
		} );
	}

	/**
	 * 	load peer id from local file
	 *	@param	filename	{string} - filename where we store peerId
	 * 	@returns {Promise<PeerId>}
	 */
	static async loadPeerId( filename )
	{
		return new PeerIdStorageService().loadPeerId( filename );
	}
}

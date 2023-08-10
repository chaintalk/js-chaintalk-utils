import { createRSAPeerId } from '@libp2p/peer-id-factory'
import { PeerIdStorageService } from "./storage/PeerIdStorageService.js";


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
	static async flushPeerId()
	{
		return new Promise( async ( resolve, reject ) =>
		{
			try
			{
				const rawPeerIdObject = await this.generatePeerId();
				await new PeerIdStorageService().savePeerId( rawPeerIdObject );
				resolve( rawPeerIdObject );
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

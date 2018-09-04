import config from '../config/config';

const request = require('request-promise');

export interface DataProduct {
    title: string;
}

class MetadataService {
    async getProductMetadata(fileHash: string): Promise<DataProduct> {
        const url = `${config.ipfs.httpUrl}/api/v0/cat/${fileHash}`;

        return JSON.parse(await request.get({ url, timeout: config.ipfs.requestTimeoutMs }));
    }
}

export default new MetadataService();

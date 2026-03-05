import * as crypto from 'crypto';

export default (value: string) => crypto.createHash('sha256').update(value).digest('hex');
import { Injectable } from '@nestjs/common';
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const { ENCRIPTION_TYPE, ENCRIPTION_LENGTH } = process.env;

@Injectable()
export class EncryptionService {
  private readonly algorithm = ENCRIPTION_TYPE;
  private readonly keyLength = ENCRIPTION_LENGTH;

  async encrypt(password: string): Promise<string> {
    const iv = randomBytes(16);
    const { PASS } = process.env;
    if (!PASS) {
      return;
    }
    const key = (await promisify(scrypt)(
      PASS,
      'salt',
      this.keyLength,
    )) as Buffer;
    const cipher = createCipheriv(this.algorithm, key, iv);

    const encryptedPassword = Buffer.concat([
      cipher.update(password),
      cipher.final(),
    ]);

    return `${iv.toString('hex')}:${encryptedPassword.toString('hex')}`;
  }

  async decrypt(encryptedPassword: string): Promise<string> {
    const [ivHex, encryptedHex] = encryptedPassword.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const { PASS } = process.env;
    if (!PASS) {
      return;
    }

    const key = (await promisify(scrypt)(
      PASS,
      'salt',
      this.keyLength,
    )) as Buffer;
    const decipher = createDecipheriv(this.algorithm, key, iv);

    const decryptedPassword = Buffer.concat([
      decipher.update(Buffer.from(encryptedHex, 'hex')),
      decipher.final(),
    ]);

    return decryptedPassword.toString('utf-8');
  }
}

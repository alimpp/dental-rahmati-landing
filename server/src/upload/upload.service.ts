import {
  BadRequestException,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { extname, join } from 'path';

const IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]);

const FILE_TYPES = new Set([...IMAGE_TYPES, 'application/pdf']);

@Injectable()
export class UploadService implements OnModuleInit {
  private readonly root = join(process.cwd(), 'uploads');

  async onModuleInit() {
    await mkdir(join(this.root, 'images'), { recursive: true });
    await mkdir(join(this.root, 'files'), { recursive: true });
  }

  async save(file: Express.Multer.File, kind: 'image' | 'file' = 'image') {
    if (!file?.buffer?.length) {
      throw new BadRequestException('فایلی انتخاب نشده است');
    }

    const allowed = kind === 'image' ? IMAGE_TYPES : FILE_TYPES;
    if (!allowed.has(file.mimetype)) {
      throw new BadRequestException('نوع فایل مجاز نیست');
    }

    const folder = kind === 'image' ? 'images' : 'files';
    const ext = this.safeExt(file.originalname, file.mimetype);
    const name = `${Date.now()}-${randomBytes(4).toString('hex')}${ext}`;
    const dir = join(this.root, folder);
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, name), file.buffer);

    const url = `/uploads/${folder}/${name}`;
    return {
      url,
      name: file.originalname,
      mime: file.mimetype,
      size: file.size,
    };
  }

  private safeExt(original: string, mime: string) {
    const fromName = extname(original).toLowerCase();
    if (fromName && /^\.[a-z0-9]+$/.test(fromName) && fromName.length <= 8) {
      return fromName;
    }
    if (mime === 'image/jpeg') return '.jpg';
    if (mime === 'image/png') return '.png';
    if (mime === 'image/webp') return '.webp';
    if (mime === 'image/gif') return '.gif';
    if (mime === 'image/svg+xml') return '.svg';
    if (mime === 'application/pdf') return '.pdf';
    return '';
  }
}

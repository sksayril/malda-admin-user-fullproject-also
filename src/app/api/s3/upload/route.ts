import { NextResponse } from 'next/server';
import { uploadFileToS3 } from '@/lib/s3';
import { connectToDatabase } from '@/lib/db';
import { DocumentMetadata } from '@/models';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const entityType = (formData.get('entityType') as string) || 'document';
    const entityId = (formData.get('entityId') as string) || 'general';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided in form-data' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const sanitizedFileName = file.name.replace(/\s+/g, '_');
    const fileKey = `tenant/TNT001/${entityType}/${entityId}/${Date.now()}_${sanitizedFileName}`;

    // Upload to Amazon S3
    const s3Result = await uploadFileToS3(buffer, fileKey, file.type || 'application/octet-stream');

    // Save metadata in MongoDB
    try {
      await connectToDatabase();
      await DocumentMetadata.create({
        fileKey: s3Result.key,
        fileName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        s3Url: s3Result.url,
        tenantId: 'TNT001',
        entityType,
        entityId,
      });
    } catch (dbErr) {
      console.warn('Metadata save skipped or error:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: 'File successfully stored in Amazon S3',
      data: {
        fileKey: s3Result.key,
        url: s3Result.url,
        fileName: file.name,
        fileSize: file.size,
      },
    });
  } catch (error: any) {
    console.error('AWS S3 upload error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'AWS S3 upload failed',
        code: 'S3_UPLOAD_ERROR',
      },
      { status: 500 }
    );
  }
}

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { promises as fs } from 'fs';
import { join } from 'path';

//morgana : This inteceptor is needed to clean u ploaded avatar if any error occurs on entity update or creation.
//Files upload before controller execution, so if error occurs during controller work and entity is not being updated/created, we dont need to store unconnected image

@Injectable()
export class FileCleanupInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    return next.handle().pipe(
      catchError(async (error) => {
        const request = context.switchToHttp().getRequest();
        const files = request.files || request.file; // Handle either single or multiple files
        if (files) {
          const avatar = Array.isArray(files) ? files[0] : files;
          if (avatar) {
            // Construct the full, absolute path of the file
            const filePath = join(
              process.cwd(), // Current working directory (project root)
              process.env.FILES_ROOT, // Your folder where uploads are stored
              avatar.filename, // The file name itself
            );

            // Check if the file exists before trying to delete it
            try {
              await fs.access(filePath); // Check if file exists
              await fs.unlink(filePath); // Delete the file
              console.log(`Deleted file: ${filePath}`);
            } catch (err) {
              if (err.code === 'ENOENT') {
                console.error(`File not found: ${filePath}`);
              } else {
                console.error(`Error deleting file: ${filePath}`, err);
              }
            }
          }
        }
        return throwError(() => error);
      }),
    );
  }
}

import * as React from 'react';
import { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageIcon } from 'lucide-react';
import { generateVideoThumbnail, resizeImageTo4by5 } from '@/utils/mediaHelper';

interface MediaPickerCardProps {
  /** Base64 preview string of the media (if any) */
  mediaPreview: string;
  /** Type of media: 'image', 'video', or empty string if none */
  mediaType: 'image' | 'video' | '';
  /** Callback invoked when media is changed; returns base64 string and type */
  onMediaChange: (preview: string, type: 'image' | 'video' | '') => void;
  /** Maximum allowed video size in bytes (default: 2 MB) */
  maxVideoSize?: number;
}

/**
 * MediaPickerCard Component
 *
 * Provides a user interface for uploading images or videos.
 * Images are resized to a 4:5 aspect ratio, while videos generate a thumbnail.
 * Displays an error message if the media is invalid or too large.
 *
 * @param {MediaPickerCardProps} props - Props containing media info and change handler.
 */
export function MediaPickerCard({
  mediaPreview,
  mediaType,
  onMediaChange,
  maxVideoSize = 2 * 1024 * 1024, // default 2MB
}: MediaPickerCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mediaError, setMediaError] = React.useState('');

  /**
   * Trigger the hidden file input when the button is clicked.
   * Because sometimes, clicking a hidden input just doesn't feel right.
   */
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * Handle the file input change event.
   * Processes the selected file by resizing images or generating video thumbnails.
   *
   * @param e React change event for the file input.
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMediaError('');

    try {
      if (file.type.startsWith('image/')) {
        // Resize the image to a 4:5 aspect ratio.
        const base64 = await resizeImageTo4by5(file);
        onMediaChange(base64, 'image');
      } else if (file.type.startsWith('video/')) {
        // For videos, ensure the file size is within the allowed limit.
        if (file.size > maxVideoSize) {
          throw new Error(
            `Video too large. Please select a file under ${maxVideoSize} bytes.`,
          );
        }

        const thumbnail = await generateVideoThumbnail(file);
        onMediaChange(thumbnail, 'video');
      } else {
        throw new Error('Unsupported file type. Please upload image or video.');
      }
    } catch (err: any) {
      setMediaError(err.message || 'Failed to process media.');
      onMediaChange('', '');
    }
  };

  const isEmpty = !mediaPreview;
  // Set the button label based on whether a media is already present.
  const buttonLabel = isEmpty ? 'Add Photo' : 'Replace Photo';

  return (
    <div className="p-4">
      <Card className="relative h-full w-full min-h-[31rem] md:min-w-[400px] flex items-center justify-center rounded-lg overflow-hidden bg-muted/50">
        <CardContent className="p-0 h-full w-full relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {isEmpty ? (
            <div className="flex flex-col h-full items-center justify-center text-center gap-2 p-4">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
              <Button variant="outline" size="sm" onClick={handleButtonClick}>
                {buttonLabel}
              </Button>
            </div>
          ) : (
            <>
              {mediaType === 'image' ? (
                <img
                  src={mediaPreview}
                  alt="Media Preview"
                  className="h-full w-full object-cover"
                />
              ) : mediaType === 'video' ? (
                <img
                  src={mediaPreview}
                  alt="Video Thumbnail"
                  className="h-full w-full object-cover"
                />
              ) : null}

              <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleButtonClick}
                >
                  {buttonLabel}
                </Button>
              </div>
            </>
          )}
          {/* Display media error if any (because mistakes happen) */}
          {mediaError && (
            <p className="text-red-500 text-xs text-center absolute -bottom-4 left-2 right-2">
              {mediaError}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

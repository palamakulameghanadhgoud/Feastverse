import cloudinary
import cloudinary.uploader
from .config import settings

# Configure Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)


def upload_video(file_path: str, public_id: str = None, folder: str = "feastverse/reels"):
    """
    Upload video to Cloudinary
    
    Args:
        file_path: Path to the video file
        public_id: Optional custom public ID
        folder: Cloudinary folder path
    
    Returns:
        dict: Upload response with video URL
    """
    try:
        result = cloudinary.uploader.upload(
            file_path,
            resource_type="video",
            folder=folder,
            public_id=public_id,
            overwrite=True,
            transformation=[
                {
                    'quality': 'auto',
                    'fetch_format': 'auto'
                }
            ]
        )
        return {
            "success": True,
            "url": result.get('secure_url'),
            "public_id": result.get('public_id'),
            "format": result.get('format'),
            "duration": result.get('duration'),
            "width": result.get('width'),
            "height": result.get('height'),
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def delete_video(public_id: str):
    """
    Delete video from Cloudinary
    
    Args:
        public_id: Cloudinary public ID of the video
    
    Returns:
        dict: Deletion response
    """
    try:
        result = cloudinary.uploader.destroy(
            public_id,
            resource_type="video"
        )
        return {
            "success": result.get('result') == 'ok',
            "result": result
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def upload_image(file_path: str, public_id: str = None, folder: str = "feastverse/images"):
    """
    Upload image to Cloudinary
    
    Args:
        file_path: Path to the image file
        public_id: Optional custom public ID
        folder: Cloudinary folder path
    
    Returns:
        dict: Upload response with image URL
    """
    try:
        result = cloudinary.uploader.upload(
            file_path,
            folder=folder,
            public_id=public_id,
            overwrite=True,
            transformation=[
                {
                    'quality': 'auto',
                    'fetch_format': 'auto'
                }
            ]
        )
        return {
            "success": True,
            "url": result.get('secure_url'),
            "public_id": result.get('public_id'),
            "format": result.get('format'),
            "width": result.get('width'),
            "height": result.get('height'),
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }


def generate_video_thumbnail(public_id: str):
    """
    Generate thumbnail URL for a video
    
    Args:
        public_id: Cloudinary public ID of the video
    
    Returns:
        str: Thumbnail URL
    """
    return cloudinary.CloudinaryImage(public_id).build_url(
        resource_type="video",
        format="jpg",
        transformation=[
            {'width': 300, 'height': 300, 'crop': 'fill'},
            {'quality': 'auto'}
        ]
    )


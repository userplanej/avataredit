export const createAvatarObject = (avatar) => {
  return {
    "name": avatar.avatar_name,
    "description": "",
    "type": "avatar",
    "option": {
      "type": "image",
      "subtype": "avatar",
      "version": "3.6.6",
      "originX": "center",
      "originY": "center",
      "scaleX": 0.28,
      "scaleY": 0.28,
      "crossOrigin": "Anonymous",
      "src": avatar.avatar_dir,
      "src_thumbnail": avatar.avatar_thumbnail_dir
    }
  }
}

export const createImageObject = (image) => {
  return {
    "name": image.image_name,
    "description": "",
    "type": "image",
    "option": {
      "type": "image",
      "name": image.image_name,
      "src": image.image_dir,
      "crossOrigin": "Anonymous",
      "originX": "center",
      "originY": "center",
      "scaleX": 0.5,
      "scaleY": 0.5
    }
  }
}

export const createBackgroundImageObject = (image) => {
  return {
    "name": image.image_name,
    "description": "",
    "type": "background",
    "option": {
      "type": "background",
      "subtype": "image",
      "src": image.image_dir,
      "originX": "left",
      "originY": "top",
      "crossOrigin": "Anonymous",
      "layout": "fixed",
      "width": 550,
      "height": 310
    }
  }
}

export const createBackgroundVideoObject = (video) => {
  return {
    "name": video.video_name,
    "description": "",
    "type": "background",
    "option": {
      "type": "background",
      "subtype": "video",
      "src": video.video_dir,
      "originX": "left",
      "originY": "top",
      "crossOrigin": "Anonymous",
      "layout": "fixed",
      "width": 550,
      "height": 310
    }
  }
}

export const createShapeObject = (shape) => {
  return {
    "name": shape.shape_name,
    "description": "",
    "type": "shape",
    "option": {
      "type": "image",
      "subtype": "shape",
      "width": 30,
      "height": 30,
      "name": shape.shape_name,
      "src": shape.shape_dir,
      "crossOrigin": "Anonymous",
      "scaleX": 0.1,
      "scaleY": 0.1,
      "originX": "center",
      "originY": "center"
    }
  }
}
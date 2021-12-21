import { scaling } from '../components/canvas/constants';

export const createAvatarObject = (avatar) => {
  return {
    "name": avatar.avatar_name,
    "type": "avatar",
    "model": avatar.model_type,
    "option": {
      "type": "image",
      "name": avatar.avatar_name,
      "cloneable": false,
      "subtype": "avatar",
      "version": "3.6.6",
      "originX": "center",
      "originY": "center",
      "scaleX": scaling.AVATAR,
      "scaleY": scaling.AVATAR,
      "crossOrigin": "Anonymous",
      "src": avatar.avatar_dir,
      "src_thumbnail": avatar.avatar_thumbnail_dir
    }
  }
}

export const createImageObject = (image) => {
  return {
    "id": image.image_id,
    "name": image.image_name,
    "type": "image",
    "option": {
      "type": "image",
      "name": image.image_name,
      "src": image.image_dir,
      "crossOrigin": "Anonymous",
      "originX": "center",
      "originY": "center",
      "scaleX": scaling.IMAGE,
      "scaleY": scaling.IMAGE
    }
  }
}

export const createBackgroundColorObject = (background) => {
  return {
    "name": background.background_name,
    "type": "background",
    "option": {
      "type": "background",
      "subtype": "color",
      "backgroundColor": background.color_hex,
      "originX": "left",
      "originY": "top",
      "layout": "fixed",
      "width": 550,
      "height": 310
    }
  }
}

export const createBackgroundImageObject = (background) => {
  return {
    "id": background.background_id,
    "name": background.background_name,
    "type": "background",
    "option": {
      "type": "background",
      "subtype": "image",
      "src": background.background_src,
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
    "type": "shape",
    "option": {
      "type": "image",
      "subtype": "shape",
      "width": 30,
      "height": 30,
      "name": shape.shape_name,
      "src": shape.shape_dir,
      "crossOrigin": "Anonymous",
      "scaleX": scaling.SHAPE,
      "scaleY": scaling.SHAPE,
      "originX": "center",
      "originY": "center"
    }
  }
}
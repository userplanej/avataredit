export const createAvatarObject = (avatar) => {
  return {
    "name": avatar.avatar_name,
    "description": "",
    "type": "avatar",
    "option": {
      "type": "image",
      "subtype": "avatar",
      "version": "3.6.6",
      "originX": "left",
      "originY": "top",
      "fill": "rgb(0,0,0)",
      "stroke": null,
      "strokeWidth": 0,
      "strokeDashArray": null,
      "strokeLineCap": "butt",
      "strokeDashOffset": 0,
      "strokeLineJoin": "miter",
      "strokeMiterLimit": 4,
      "scaleX": 1,
      "scaleY": 1,
      "angle": 0,
      "flipX": false,
      "flipY": false,
      "opacity": 1,
      "shadow": null,
      "visible": true,
      "clipTo": null,
      "backgroundColor": null,
      "fillRule": "nonzero",
      "paintFirst": "fill",
      "globalCompositeOperation": "source-over",
      "transformMatrix": null,
      "skewX": 0,
      "skewY": 0,
      "crossOrigin": "",
      "cropX": 0,
      "cropY": 0,
      "id": "workarea",
      "name": "",
      "file": null,
      "src": avatar.avatar_dir,
      "link": {},
      "tooltip": {
        "enabled": false
      },
      "layout": "fixed",
      "workareaWidth": 600,
      "workareaHeight": 400,
      "filters": []
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
      "src": shape.shape_dir
    }
  }
}
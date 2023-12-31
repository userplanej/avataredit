import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Badge, Button, Menu } from 'antd';
import debounce from 'lodash/debounce';
import i18n from 'i18next';
import SandBox from '../sandbox/SandBox';
import { Grid } from '@mui/material';
import { Box } from '@mui/system';

import { SocketContext } from '../../hooks/socket';

import '../../libs/fontawesome-5.2.0/css/all.css';
import '../../styles/index.less';

import Canvas from '../canvas/Canvas';
import { scaling } from '../canvas/constants';
import ImageMapItems from './ImageMapItems';
import Slides from '../../components-site/views/editor/Slides';
import Appbar from '../../components-site/Appbar';
import Sidebar from '../../components-site/Sidebar';
import Script from '../../components-site/views/editor/Script';
import GenerateVideo from '../../components-site/views/editor/GenerateVideo';
import DiscardDraft from '../../components-site/views/editor/DiscardDraft';
import PlayVideo from '../../components-site/views/editor/PlayVideo';

import { setActiveObject } from '../../redux/canvas/canvasSlice';
import { setActiveTab, setPreviousTab } from '../../redux/toolbar/toolbarSlice';
import { setShowBackdrop } from '../../redux/backdrop/backdropSlice';
import { setActiveSlide, setActiveSlideId, setSelectedAvatar } from '../../redux/video/videoSlice';
import { setLeft, setTop, setWidth, setHeight, setIsBack, setIsFront, setAvatarPosition, setAvatarSize, setAvatarType, setAvatarPose } from '../../redux/object/objectSlice';

import { getAllImagePackage, getImagePackage } from '../../api/image/package';
import { getAllUserImages, getAllDefaultImages } from '../../api/image/image';
import { getAllAvatars } from '../../api/avatar/avatar';
import { getAllShapes } from '../../api/shape/shape';
import { getAllImageClipByPackageId, updateImageClip } from '../../api/image/clip';
import { getAllVideos } from '../../api/video/video';
import { uploadFile, deleteFile } from '../../api/s3';
import { getAllDefaultBackgrounds, getAllUserBackgrounds } from '../../api/background/background';

import {
	createAvatarObject,
	createImageObject,
	createBackgroundImageObject,
	createShapeObject,
	createBackgroundVideoObject,
	createBackgroundColorObject
} from '../../utils/CanvasObjectUtils';
import { showAlert } from '../../utils/AlertUtils';

import { avatarPositionEnum } from '../../enums/AvatarPosition';
import { avatarSizeEnum } from '../../enums/AvatarSize';

const propertiesToInclude = [
	'id',
	'name',
	'locked',
	'file',
	'backgroundColor',
	'src',
	'link',
	'tooltip',
	'animation',
	'layout',
	'workareaWidth',
	'workareaHeight',
	'videoLoadType',
	'autoplay',
	'shadow',
	'muted',
	'loop',
	'code',
	'icon',
	'userProperty',
	'trigger',
	'configuration',
	'superType',
	'points',
	'svg',
	'loadType',
	'subtype',
	'crossOrigin',
	'src_thumbnail',
	'lockMovementX',
	'lockMovementY',
	'hasControls',
	'selectable'
];

const defaultOption = {
	fill: 'rgba(0, 0, 0, 1)',
	stroke: 'rgba(255, 255, 255, 0)',
	strokeUniform: true,
	resource: {},
	link: {
		enabled: false,
		type: 'resource',
		state: 'new',
		dashboard: {},
	},
	tooltip: {
		enabled: true,
		type: 'resource',
		template: '<div>{{message.name}}</div>',
	},
	animation: {
		type: 'none',
		loop: true,
		autoplay: true,
		duration: 1000,
	},
	userProperty: {},
	trigger: {
		enabled: false,
		type: 'alarm',
		script: 'return message.value > 0;',
		effect: 'style',
	},
};

const indexFormatTab = 7;

class ImageMapEditor extends Component {
	static contextType = SocketContext;

	state = {
		updatedValue : false,
		selectedItem: null,
		zoomRatio: 1,
		preview: false,
		progress: 0,
		animations: [],
		styles: [],
		dataSources: [],
		editing: false,
		objects: undefined,
		src: undefined,
		openGenerateVideo: false,
		openDiscardDraft: false,
		openPlayVideo: false,
		videoSource: '',
		mobileOpen: false,
		packageId: this.props.match.params.id,
		descriptors: {},
		avatars: {},
		shapes: {},
		uploadedBackgroundImages: {},
		defaultBackgroundColors: {},
		defaultBackgroundImages: {},
		defaultBackgroundVideos: {},
		uploadedImages: {},
		defaultImages: {},
		videos: {},
		slides: [],
		video: null,
		userTemplates: []
	};

	componentDidMount() {
		const socket = this.context;
		socket.on('update-slide-done', () => {
			this.loadImageClips();
		});

		this.props.setShowBackdrop(true);

		Promise.all([
			import('./Descriptors.json').then(descriptors => {
				this.setState({ descriptors });
			}),
			this.loadImagePackage(),
			this.loadImageClips(),
			this.loadAvatars(),
			this.loadImages(),
			this.loadShapes(),
			this.loadBackgrounds(),
			this.loadTemplates()
			// this.loadVideos()
		]).then(() => {
			this.props.setShowBackdrop(false);
			this.setState({ selectedItem: null });
		});
	}

	componentWillUnmount() {
		const socket = this.context;
		socket.off('update-slide-done');
	}

	loadImagePackage = async () => {
		const { packageId } = this.state;

		await getImagePackage(packageId).then(res => {
      const video = res.data.body;
			this.setState({ video });
      this.props.setActiveSlideId(video.clip_id);
    });
	}

	loadImageClips = async () => {
		const { packageId } = this.state;
		
		await getAllImageClipByPackageId(packageId).then(res => {
			const slides = res.data.body.rows;
			this.setState({ slides });

			setTimeout(() => {
				const currentSlide = slides.find(slide => slide.clip_id === this.props.activeSlideId);
				this.props.setActiveSlide(currentSlide);
				// this.props.setActiveSlideId(currentSlide.clip_id);
			}, 100);
		});
	}

	loadAvatars = async () => {
		await getAllAvatars().then(res => {
			const avatars = res.data.body.rows;

			if (avatars && avatars.length > 0) {
				const avatarArray = [];
				avatars.filter(avatar => avatar.is_active).forEach(avatar => {
					const avatarObject = createAvatarObject(avatar);
					avatarArray.push(avatarObject);
				});
	
				const avatarList = {
					"AVATAR": avatarArray
				}
	
				this.setState({ avatars: avatarList });
			}
		});
	}

	loadImages = async () => {
		const user = JSON.parse(sessionStorage.getItem('user'));

		let imageList = {};
		await getAllUserImages(user.user_id).then(res => {
			const images = res.data.body;

			if (images && images.length > 0) {
				const imageArray = [];
				images.forEach(image => {
					const imageObject = createImageObject(image);
					imageArray.push(imageObject);
				});
				
				imageList = {
					"IMAGE": imageArray
				}
			}

			this.setState({ uploadedImages: imageList });
		});

		await getAllDefaultImages().then(res => {
			const images = res.data.body;

			if (images && images.length > 0) {
				const imageArray = [];
				images.forEach(image => {
					const imageObject = createImageObject(image);
					imageArray.push(imageObject);
				});
				
				const imageList = {
					"IMAGE": imageArray
				}

				this.setState({ defaultImages: imageList });
			}
		});
	}

	loadShapes = async () => {
		await getAllShapes().then(res => {
			const shapes = res.data.body;

			if (shapes && shapes.length > 0) {
				const shapeArray = [];
				shapes.forEach(shape => {
					const shapeObject = createShapeObject(shape);
					shapeArray.push(shapeObject);
				});

				const shapeList = {
					"SHAPE": shapeArray
				}

				this.setState({ shapes: shapeList });
			}
		});
	}

	loadBackgrounds = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));

		let uploadedBackgroundImagesList = {};
		await getAllUserBackgrounds(user.user_id).then(res => {
			const backgrounds = res.data.body.rows;

			if (backgrounds && backgrounds.length > 0) {
				const uploadedBackgroundImageArray = [];

				backgrounds.forEach((background) => {
					const backgroundImageObject = createBackgroundImageObject(background);
					uploadedBackgroundImageArray.push(backgroundImageObject);
				});

				uploadedBackgroundImagesList = {
					"IMAGE": uploadedBackgroundImageArray
				}
			}

			this.setState({	uploadedBackgroundImages: uploadedBackgroundImagesList });
		});

		await getAllDefaultBackgrounds().then(res => {
			const backgrounds = res.data.body.rows;

			if (backgrounds && backgrounds.length > 0) {
				const backgroundImageArray = [];
				const backgroundColorArray = [];

				backgrounds.forEach(background => {
					if (background.color_hex !== null) {
						const backgroundObject = createBackgroundColorObject(background);
						backgroundColorArray.push(backgroundObject);
					}
					if (background.background_src !== null) {
						const backgroundImageObject = createBackgroundImageObject(background);
						backgroundImageArray.push(backgroundImageObject);
					}
				});

				const backgroundColorList = {
					"COLOR": backgroundColorArray
				}

				const backgroundImageList = {
					"IMAGE": backgroundImageArray
				}

				this.setState({
					defaultBackgroundColors: backgroundColorList,
					defaultBackgroundImages: backgroundImageList
				});
			}
		});
	}

	loadVideos = async () => {
		await getAllVideos().then(res => {
			const videos = res.data.body;

			if (videos && videos.length > 0) {
				const backgroundVideoArray = [];
				videos.forEach(video => {
					const backgroundImageObject = createBackgroundVideoObject(video);
					backgroundVideoArray.push(backgroundImageObject);
				});
				
				const backgroundVideoList = {
					"VIDEO": backgroundVideoArray
				}

				this.setState({ defaultBackgroundVideos: backgroundVideoList });
			}
		});
	}

	loadTemplates = async () => {
    const user = JSON.parse(sessionStorage.getItem('user'));

    await getAllImagePackage(null, true).then(res => {
      const templates = res.data.body.rows;
      const templatesSorted = templates.sort((a, b) => (a.create_date < b.create_date) ? 1 : -1);
      const defaultTemplates = templatesSorted.filter((template) => template.user_id === null);
      const myTemplates = templatesSorted.filter((template) => template.user_id === user.user_id && !template.is_draft );

			this.setState({ userTemplates: myTemplates });
    });
  }

	canvasHandlers = {
		onAdd: target => {
			const { editing } = this.state;
			this.forceUpdate();
			if (!editing) {
				this.changeEditing(true);
			}
			if (target.type === 'activeSelection') {
				this.canvasHandlers.onSelect(null);
				return;
			}
			this.canvasRef.handler.select(target);
			// Change tools tab
			this.props.setActiveObject({ id: target.id, type: target.subtype ? target.subtype : target.type });
			// this.props.setPreviousTab(this.props.activeTab);
			// this.props.setActiveTab(indexFormatTab);
		},
		onSelect: target => {
			const { selectedItem } = this.state;
			if (!target) {
				this.setState({
					selectedItem: target,
				});
				// Change tools tab
				// this.props.setActiveTab(this.props.previousTab);
				// this.props.setActiveObject(null);
				return;
			}
			if (target && target.id && target.id !== 'workarea' && target.type !== 'activeSelection') {
				if (selectedItem && target.id === selectedItem.id) {
					return;
				}
				this.canvasRef.handler.getObjects().forEach(obj => {
					if (obj) {
						this.canvasRef.handler.animationHandler.resetAnimation(obj, true);
					}
				});
				this.setState({
					selectedItem: target,
				});

				// Change tools tab
				this.props.setActiveObject({ id: target.id, type: target.subtype ? target.subtype : target.type });
				// if (this.props.activeTab !== indexFormatTab) {
				// 	this.props.setPreviousTab(this.props.activeTab);
				// }
				// this.props.setActiveTab(indexFormatTab);

				// Update format values
				this.setFormatValues(target);

				// Update object stack values
				this.setBackAndFrontValues(target);
				return;
			}
			this.canvasRef.handler.getObjects().forEach(obj => {
				if (obj) {
					this.canvasRef.handler.animationHandler.resetAnimation(obj, true);
				}
			});
			this.setState({
				selectedItem: null,
			});
		},
		onRemove: () => {
			const { editing } = this.state;
			if (!editing) {
				this.changeEditing(true);
			}
			const activeObject = this.canvasRef.handler.getActiveObject();
			if (activeObject && activeObject.subtype === 'avatar') {
				this.props.setSelectedAvatar(null);
			}
			// Change tools tab
			this.canvasHandlers.onSelect(null);
			// this.props.setActiveTab(this.props.previousTab);
			// this.props.setActiveObject(null);
		},
		onModified: debounce(() => {
			const { editing } = this.state;
			this.forceUpdate();
			if (!editing) {
				this.changeEditing(true);
			}
		}, 300),
		onZoom: zoom => {
			this.setState({
				zoomRatio: zoom,
			});
		},
		onChange: (selectedItem, changedValues, allValues) => {
			const { editing } = this.state;
			if (!editing) {
				this.changeEditing(true);
			}
			const changedKey = Object.keys(changedValues)[0];
			const changedValue = changedValues[changedKey];
			if (allValues.workarea) {
				this.canvasHandlers.onChangeWokarea(changedKey, changedValue, allValues.workarea);
				return;
			}
			if (changedKey === 'width' || changedKey === 'height') {
				this.canvasRef.handler.scaleToResize(allValues.width, allValues.height);
				return;
			}
			if (changedKey === 'angle') {
				this.canvasRef.handler.rotate(allValues.angle);
				return;
			}
			if (changedKey === 'locked') {
				this.canvasRef.handler.setObject({
					lockMovementX: changedValue,
					lockMovementY: changedValue,
					hasControls: !changedValue,
					hoverCursor: changedValue ? 'pointer' : 'move',
					editable: !changedValue,
					locked: changedValue,
				});
				return;
			}
			if (changedKey === 'file' || changedKey === 'src' || changedKey === 'code') {
				if (selectedItem.type === 'image') {
					this.canvasRef.handler.setImageById(selectedItem.id, changedValue);
				} else if (selectedItem.superType === 'element') {
					this.canvasRef.handler.elementHandler.setById(selectedItem.id, changedValue);
				}
				return;
			}
			if (changedKey === 'link') {
				const link = Object.assign({}, defaultOption.link, allValues.link);
				this.canvasRef.handler.set(changedKey, link);
				return;
			}
			if (changedKey === 'tooltip') {
				const tooltip = Object.assign({}, defaultOption.tooltip, allValues.tooltip);
				this.canvasRef.handler.set(changedKey, tooltip);
				return;
			}
			if (changedKey === 'animation') {
				const animation = Object.assign({}, defaultOption.animation, allValues.animation);
				this.canvasRef.handler.set(changedKey, animation);
				return;
			}
			if (changedKey === 'icon') {
				const { unicode, styles } = changedValue[Object.keys(changedValue)[0]];
				const uni = parseInt(unicode, 16);
				if (styles[0] === 'brands') {
					this.canvasRef.handler.set('fontFamily', 'Font Awesome 5 Brands');
				} else if (styles[0] === 'regular') {
					this.canvasRef.handler.set('fontFamily', 'Font Awesome 5 Regular');
				} else {
					this.canvasRef.handler.set('fontFamily', 'Font Awesome 5 Free');
				}
				this.canvasRef.handler.set('text', String.fromCodePoint(uni));
				this.canvasRef.handler.set('icon', changedValue);
				return;
			}
			if (changedKey === 'shadow') {
				if (allValues.shadow.enabled) {
					if ('blur' in allValues.shadow) {
						this.canvasRef.handler.setShadow(allValues.shadow);
					} else {
						this.canvasRef.handler.setShadow({
							enabled: true,
							blur: 15,
							offsetX: 10,
							offsetY: 10,
						});
					}
				} else {
					this.canvasRef.handler.setShadow(null);
				}
				return;
			}
			if (changedKey === 'fontWeight') {
				this.canvasRef.handler.set(changedKey, changedValue ? 'bold' : 'normal');
				return;
			}
			if (changedKey === 'fontStyle') {
				this.canvasRef.handler.set(changedKey, changedValue ? 'italic' : 'normal');
				return;
			}
			if (changedKey === 'textAlign') {
				this.canvasRef.handler.set(changedKey, Object.keys(changedValue)[0]);
				return;
			}
			if (changedKey === 'trigger') {
				const trigger = Object.assign({}, defaultOption.trigger, allValues.trigger);
				this.canvasRef.handler.set(changedKey, trigger);
				return;
			}
			if (changedKey === 'filters') {
				const filterKey = Object.keys(changedValue)[0];
				const filterValue = allValues.filters[filterKey];
				if (filterKey === 'gamma') {
					const rgb = [filterValue.r, filterValue.g, filterValue.b];
					this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {
						gamma: rgb,
					});
					return;
				}
				if (filterKey === 'brightness') {
					this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {
						brightness: filterValue.brightness,
					});
					return;
				}
				if (filterKey === 'contrast') {
					this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {
						contrast: filterValue.contrast,
					});
					return;
				}
				if (filterKey === 'saturation') {
					this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {
						saturation: filterValue.saturation,
					});
					return;
				}
				if (filterKey === 'hue') {
					this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {
						rotation: filterValue.rotation,
					});
					return;
				}
				if (filterKey === 'noise') {
					this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {
						noise: filterValue.noise,
					});
					return;
				}
				if (filterKey === 'pixelate') {
					this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {
						blocksize: filterValue.blocksize,
					});
					return;
				}
				if (filterKey === 'blur') {
					this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey].enabled, {
						value: filterValue.value,
					});
					return;
				}
				this.canvasRef.handler.imageHandler.applyFilterByType(filterKey, changedValue[filterKey]);
				return;
			}
			if (changedKey === 'chartOption') {
				try {
					const sandbox = new SandBox();
					const compiled = sandbox.compile(changedValue);
					const { animations, styles } = this.state;
					const chartOption = compiled(3, animations, styles, selectedItem.userProperty);
					selectedItem.setChartOptionStr(changedValue);
					this.canvasRef.handler.elementHandler.setById(selectedItem.id, chartOption);
				} catch (error) {
					console.error(error);
				}
				return;
			}
			this.canvasRef.handler.set(changedKey, changedValue);
		},
		onChangeWokarea: (changedKey, changedValue, allValues) => {
			if (changedKey === 'layout') {
				this.canvasRef.handler.workareaHandler.setLayout(changedValue);
				return;
			}
			if (changedKey === 'file' || changedKey === 'src') {
				this.canvasRef.handler.workareaHandler.setImage(changedValue);
				return;
			}
			if (changedKey === 'color') {
				this.canvasRef.handler.workareaHandler.setWorkareaBackgroundColor(changedValue);
				return;
			}
			if (changedKey === 'width' || changedKey === 'height') {
				this.canvasRef.handler.originScaleToResize(
					this.canvasRef.handler.workarea,
					allValues.width,
					allValues.height,
				);
				this.canvasRef.canvas.centerObject(this.canvasRef.handler.workarea);
				return;
			}
			this.canvasRef.handler.workarea.set(changedKey, changedValue);
			this.canvasRef.canvas.requestRenderAll();
		},
		onTooltip: (ref, target) => {
			const value = Math.random() * 10 + 1;
			const { animations, styles } = this.state;
			// const { code } = target.trigger;
			// const compile = SandBox.compile(code);
			// const result = compile(value, animations, styles, target.userProperty);
			// console.log(result);
			return (
				<div>
					<div>
						<div>
							<Button>{target.id}</Button>
						</div>
						<Badge count={value} />
					</div>
				</div>
			);
		},
		onClick: (canvas, target) => {
			const { link } = target;
			if (link.state === 'current') {
				document.location.href = link.url;
				return;
			}
			window.open(link.url);
		},
		onContext: (ref, event, target) => {
			if ((target && (target.id === 'workarea' || target.type === 'background')) || !target) {
				return;
			}
			if (target.type === 'activeSelection') {
				return (
					<Menu>
						<Menu.Item
							onClick={() => {
								this.canvasRef.handler.remove();
							}}
						>
							Delete
						</Menu.Item>
					</Menu>
				);
			}
			if (target.type === 'group') {
				return (
					<Menu>
						<Menu.Item
							onClick={() => {
								this.canvasRef.handler.remove();
							}}
						>
							Delete
						</Menu.Item>
					</Menu>
				);
			}
			return (
				<Menu>
					<Menu.Item
						onClick={() => {
							this.canvasRef.handler.remove();
							setTimeout(() => this.canvasHandlers.onSaveSlide(), 1);
						}}
					>
						Delete
					</Menu.Item>
				</Menu>
			);
		},
		onTransaction: transaction => {
			this.forceUpdate();
		},
		onSaveSlide: async () => {
			const { packageId } = this.state;
			const { activeSlideId, activeSlide, avatarPosition, avatarSize } = this.props;

			const imageWithAvatar = this.canvasRef?.handler?.getCanvasImageAsBlob();
			const fileNameWithAvatar = `video-${packageId}-slide-${activeSlideId}-${new Date().getTime()}.png`;
			const oldLocationWithAvatar = activeSlide.html5_dir;
			const objects = this.canvasRef.handler.exportJSON();
			const dataToSend = {
				html5_script: JSON.stringify(objects),
				activeSlideId
			}

			const avatar = objects.find(object => object.subtype === 'avatar');
			let imageWithoutAvatar = null;
			const fileNameWithoutAvatar = `video-${packageId}-slide-${activeSlideId}-background.png`;
			if (avatar) {
				this.canvasRef.handler?.removeById(avatar.id, true);

				imageWithoutAvatar = this.canvasRef.handler?.getCanvasImageAsBlob();

				this.canvasRef.handler.clear();
				this.canvasRef.handler.importJSON(objects);
				this.canvasRef.handler.transactionHandler.state = objects;
			} else {
				// Update avatar props
				this.props.setSelectedAvatar(null);
				this.props.setAvatarPosition(null);
				this.props.setAvatarType(null);
				this.props.setAvatarSize(null);
				this.props.setAvatarPose(null);
			}
			if (activeSlide.avatar_position !== avatarPosition) {
				dataToSend.avatar_position = avatarPosition;
			}
			if (activeSlide.avatar_size !== avatarSize) {
				dataToSend.avatar_size = avatarSize;
			}

			const socket = this.context;
			socket.emit('update-slide', oldLocationWithAvatar, fileNameWithAvatar, imageWithAvatar, dataToSend, imageWithoutAvatar, fileNameWithoutAvatar);
		}
	};

	handlers = {
		onChangePreview: checked => {
			let data;
			if (this.canvasRef) {
				data = this.canvasRef.handler.exportJSON().filter(obj => {
					if (!obj.id) {
						return false;
					}
					return true;
				});
			}
			this.setState({
				preview: typeof checked === 'object' ? false : checked,
				objects: data,
			});
		},
		onProgress: progress => {
			this.setState({
				progress,
			});
		},
		onImport: files => {
			if (files) {
				this.props.setShowBackdrop(true);
				setTimeout(() => {
					const reader = new FileReader();
					reader.onprogress = e => {
						if (e.lengthComputable) {
							const progress = parseInt((e.loaded / e.total) * 100, 10);
							this.handlers.onProgress(progress);
						}
					};
					reader.onload = e => {
						const { objects, animations, styles, dataSources } = JSON.parse(e.target.result);
						this.setState({
							animations,
							styles,
							dataSources,
						});
						if (objects) {
							this.canvasRef.handler.clear(true);
							const data = objects.filter(obj => {
								if (!obj.id) {
									return false;
								}
								return true;
							});
							this.canvasRef.handler.importJSON(data);
						}
					};
					reader.onloadend = () => {
						this.props.setShowBackdrop(false);
					};
					reader.onerror = () => {
						this.props.setShowBackdrop(false);
					};
					reader.readAsText(files[0]);
				}, 500);
			}
		},
		onUpload: () => {
			const inputEl = document.createElement('input');
			inputEl.accept = '.json';
			inputEl.type = 'file';
			inputEl.hidden = true;
			inputEl.onchange = e => {
				this.handlers.onImport(e.target.files);
			};
			document.body.appendChild(inputEl); // required for firefox
			inputEl.click();
			inputEl.remove();
		},
		onDownload: () => {
			this.props.setShowBackdrop(true);
			const objects = this.canvasRef.handler.exportJSON().filter(obj => {
				if (!obj.id) {
					return false;
				}
				return true;
			});
			const { animations, styles, dataSources } = this.state;
			const exportDatas = {
				objects,
				animations,
				styles,
				dataSources,
			};
			const anchorEl = document.createElement('a');
			anchorEl.href = `data:text/json;charset=utf-8,${encodeURIComponent(
				JSON.stringify(exportDatas, null, '\t'),
			)}`;
			anchorEl.download = `${this.canvasRef.handler.workarea.name || 'sample'}.json`;
			document.body.appendChild(anchorEl); // required for firefox
			anchorEl.click();
			anchorEl.remove();
			this.props.setShowBackdrop(false);
		},
		onChangeAnimations: animations => {
			if (!this.state.editing) {
				this.changeEditing(true);
			}
			this.setState({
				animations,
			});
		},
		onChangeStyles: styles => {
			if (!this.state.editing) {
				this.changeEditing(true);
			}
			this.setState({
				styles,
			});
		},
		onChangeDataSources: dataSources => {
			if (!this.state.editing) {
				this.changeEditing(true);
			}
			this.setState({
				dataSources,
			});
		},
		onSaveImage: () => {
			this.canvasRef.handler.saveCanvasImage();
		},
	};

	transformList = () => {
		return Object.values(this.state.descriptors).reduce((prev, curr) => prev.concat(curr), []);
	};

	changeEditing = editing => {
		this.setState({
			editing,
		});
	};
	
	componentDidUpdate(prevProps) {
		if(prevProps.value !== this.props.value) {
		  this.setState({value: this.props.value});
		}
	}

	handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  }

	handleOpenGenerateVideo = () => {
		this.setState({ openGenerateVideo: true });
	}

	handleCloseGenerateVideo = () => {
		this.setState({ openGenerateVideo: false });
	}

	handleOpenDiscardDraft = () => {
		this.setState({ openDiscardDraft: true });
	}

	handleCloseDiscardDraft = () => {
		this.setState({ openDiscardDraft: false });
	}

	handleOpenPlayVideo = () => {
		this.setState({ openPlayVideo: true });
	}

	handleClosePlayVideo = () => {
		this.setState({ openPlayVideo: false });
	}

	handleChangeVideoSource = (source) => {
		this.setState({ videoSource: source });
	}

	setVideo = (video) => {
		this.setState({ video });
	}

	setFormatValues = (target) => {
		// Set position
		this.props.setLeft(Math.round(target.left));
		this.props.setTop(Math.round(target.top));

		// Set size
		let defaultScale = scaling.IMAGE;
		if (target.subtype === 'avatar') {
			defaultScale = scaling.AVATAR;
		}
		if (target.subtype === 'shape') {
			defaultScale = scaling.SHAPE;
		}
		const width = (target.width * target.scaleX) / defaultScale;
		const height = (target.height * target.scaleY) / defaultScale;
		this.props.setWidth(Math.round(width));
		this.props.setHeight(Math.round(height));
	}

	setBackAndFrontValues = (target) => {
    const objects = this.canvasRef.handler.getObjects();
    this.props.setIsBack(objects[0] === target);
    this.props.setIsFront(objects[objects.length - 1] === target);
	}

	updateAvatarType = async (type) => {
		const { activeSlideId } = this.props;
		const dataToSend = {
			avatar_type: type,
			avatar_size: avatarSizeEnum.full,
			avatar_pose: null,
			avatar_position: avatarPositionEnum.center
		}
		await updateImageClip(activeSlideId, dataToSend);
	}

	render() {
		const {
			avatars,
			descriptors,
			uploadedImages,
			defaultImages,
			shapes,
			uploadedBackgroundImages,
			defaultBackgroundColors,
			defaultBackgroundImages,
			defaultBackgroundVideos,
			mobileOpen,
			openGenerateVideo,
			openDiscardDraft,
			openPlayVideo,
			videoSource,
			packageId,
			video,
			slides,
			userTemplates
		} = this.state;
		const {
			onAdd,
			onRemove,
			onSelect,
			onModified,
			onChange,
			onZoom,
			onTooltip,
			onClick,
			onContext,
			onTransaction,
			onSaveSlide
		} = this.canvasHandlers;

		return (
			<Box sx={{ width: '100%', display: 'flex', overflow: { md: 'hidden' } }}>
				{this.canvasRef && video && slides && slides.length > 0 && 
					<GenerateVideo 
						canvasRef={this.canvasRef}
						video={video}
						slides={slides}
						open={openGenerateVideo}
						close={() => this.handleCloseGenerateVideo()}
					/>
				}
				<DiscardDraft open={openDiscardDraft} close={() => this.handleCloseDiscardDraft()} />
				<PlayVideo open={openPlayVideo} close={() => this.handleClosePlayVideo()} source={videoSource} />

				{this.canvasRef && video &&
					<Appbar 
						video={video}
						slides={slides}
						setVideo={(video) => this.setVideo(video)}
						handleDrawerToggle={() => this.handleDrawerToggle()}
						canvasRef={this.canvasRef}
						onSaveSlide={onSaveSlide}
						openGenerateVideo={() => this.handleOpenGenerateVideo()}
						openDiscardDraft={() => this.handleOpenDiscardDraft()}
						openPlayVideo={() => this.handleOpenPlayVideo()}
						changeVideoSource={(source) => this.handleChangeVideoSource(source)}
					/>
				}

				<Sidebar 
					mobileOpen={mobileOpen} 
					handleDrawerToggle={() => this.handleDrawerToggle()}
				/>

				<Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
					<Grid container sx={{ width: '100%', height: '100%' }}>
						
						<Grid item xs={12} md={3} lg={2.3} xl={1.7}>
							<Box sx={{ backgroundColor: '#24282c', height: '100%' }}>
							{this.canvasRef && video && slides && slides.length > 0 &&
								<Slides
									video={video}
									slides={slides}
									loadSlides={() => this.loadImageClips()}
									canvasRef={this.canvasRef}
									packageId={packageId}
								/>
							}
							</Box>
						</Grid>
						
						<Grid item xs={12} md={9} lg={4.9} xl={5.7}>
							<Box sx={{ py: 5, display: 'flex', justifyContent: 'center' }}>
								<Canvas
									ref={c => {
										this.canvasRef = c;
									}}
									minZoom={100}
									maxZoom={100}
									zoomEnabled={false}
									objectOption={defaultOption}
									propertiesToInclude={propertiesToInclude}
									onModified={onModified}
									onAdd={onAdd}
									onRemove={onRemove}
									onSelect={onSelect}
									onZoom={onZoom}
									onTooltip={onTooltip}
									onClick={onClick}
									onContext={onContext}
									onTransaction={onTransaction}
									keyEvent={{
										transaction: true,
									}}
								/>
							</Box>

							<Script onSaveSlide={onSaveSlide} />
						</Grid>

						{this.canvasRef && 
						<Grid item xs={12} md={12} lg={4.8} xl={4.6}>
							<ImageMapItems
								canvasRef={this.canvasRef}
								descriptors={descriptors}
								uploadedBackgroundImages={uploadedBackgroundImages}
								defaultBackgroundColors={defaultBackgroundColors}
								defaultBackgroundImages={defaultBackgroundImages}
								defaultBackgroundVideos={defaultBackgroundVideos}
								uploadedImages={uploadedImages}
								defaultImages={defaultImages}
								avatars={avatars}
								shapes={shapes}
								reloadImages={() => this.loadImages()}
								reloadBackgrounds={() => this.loadBackgrounds()}
								onSaveSlide={onSaveSlide}
								userTemplates={userTemplates}
								reloadSlides={() => this.loadImageClips()}
								video={video}
								updateAvatarType={(type) => this.updateAvatarType(type)}
							/>
						</Grid>}
					</Grid>
				</Box>
			</Box>
		);
	}
}

const mapStateToProps = state => ({
	activeTab: state.toolbar.activeTab,
	previousTab: state.toolbar.previousTab,
	activeSlide: state.video.activeSlide,
	activeSlideId: state.video.activeSlideId,
	avatarPosition: state.object.avatarPosition,
	avatarSize: state.object.avatarSize
});

const mapDispatchToProps  = {
	setActiveObject,
	setActiveTab,
	setPreviousTab,
	setShowBackdrop,
	setActiveSlide,
	setActiveSlideId,
	setSelectedAvatar,
	setAvatarPosition,
	setAvatarSize,
	setAvatarType,
	setAvatarPose,
	setLeft,
	setTop,
	setWidth,
	setHeight,
	setIsFront,
	setIsBack
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ImageMapEditor));
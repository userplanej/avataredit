import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Badge, Button, Menu } from 'antd';
import debounce from 'lodash/debounce';
import i18n from 'i18next';
import SandBox from '../sandbox/SandBox';
import { Grid, Container } from '@mui/material';
import { Box } from '@mui/system';

import '../../libs/fontawesome-5.2.0/css/all.css';
import '../../styles/index.less';

import Canvas from '../canvas/Canvas';
import { code } from '../canvas/constants';
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
import { setVideo, setSlides } from '../../redux/video/videoSlice';

import { getImagePackage } from '../../api/image/package';
import { getAllUserImages, getAllDefaultImages } from '../../api/image/image';
import { getAllAvatars } from '../../api/avatar/avatar';
import { getAllShapes } from '../../api/shape/shape';
import { getAllImageClipByPackageId } from '../../api/image/clip';

import { createAvatarObject, createImageObject, createBackgroundImageObject, createShapeObject } from '../../utils/CanvasObjectUtils';

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
		packageId: this.props.history.location.state?.id,
		descriptors: {},
		avatars: {},
		shapes: {},
		backgrounds: {},
		uploadedBackgroundImages: {},
		defaultBackgroundImages: {},
		uploadedImages: {},
		defaultImages: {}
	};

	componentDidMount() {
		this.props.setShowBackdrop(true);

		Promise.all([
			import('./Descriptors.json').then(descriptors => {
				this.setState({ descriptors });
			}),
			// Import background colors
			import('./Backgrounds.json').then(backgrounds => {
				this.setState({ backgrounds });
			}),
			this.loadImagePackage(),
			this.loadImageClips(),
			this.loadAvatars(),
			this.loadImages(),
			this.loadShapes()
		]).then(() => {
			this.props.setShowBackdrop(false);
			this.setState({ selectedItem: null });
			this.shortcutHandlers.esc();
		});
	}

	loadImagePackage = async () => {
		const { packageId } = this.state;

		await getImagePackage(packageId).then(res => {
      const video = res.data.body;
      this.props.setVideo(video);
    });
	}

	loadImageClips = async () => {
		const { packageId } = this.state;
		
		await getAllImageClipByPackageId(packageId).then(res => {
			const slides = res.data.body.rows;
			this.props.setSlides(slides);
		});
	}

	loadAvatars = async () => {
		await getAllAvatars().then(res => {
			const avatars = res.data.body.rows;

			const avatarArray = [];
			avatars.forEach(avatar => {
				const avatarObject = createAvatarObject(avatar);
				avatarArray.push(avatarObject);
			});

			const avatarList = {
				"AVATAR": avatarArray
			}

			this.setState({ avatars: avatarList })
		});
	}

	loadImages = async () => {
		const user = JSON.parse(sessionStorage.getItem('user'));

		await getAllUserImages(user.user_id).then(res => {
			const images = res.data.body;

			const imageArray = [];
			const backgroundImageArray = [];
			images.forEach(image => {
				const imageObject = createImageObject(image);
				imageArray.push(imageObject);
				const backgroundImageObject = createBackgroundImageObject(image);
				backgroundImageArray.push(backgroundImageObject);
			});
			
			const imageList = {
				"IMAGE": imageArray
			}
			const backgroundImageList = {
				"IMAGE": backgroundImageArray
			}

			this.setState({ uploadedImages: imageList, uploadedBackgroundImages: backgroundImageList })
		});

		await getAllDefaultImages().then(res => {
			const images = res.data.body;

			const imageArray = [];
			const backgroundImageArray = [];
			images.forEach(image => {
				const imageObject = createImageObject(image);
				imageArray.push(imageObject);
				const backgroundImageObject = createBackgroundImageObject(image);
				backgroundImageArray.push(backgroundImageObject);
			});
			
			const imageList = {
				"IMAGE": imageArray
			}
			const backgroundImageList = {
				"IMAGE": backgroundImageArray
			}

			this.setState({ defaultImages: imageList, defaultBackgroundImages: backgroundImageList })
		});
	}

	loadShapes = async () => {
		await getAllShapes().then(res => {
			const shapes = res.data.body;

			const shapeArray = [];
			shapes.forEach(shape => {
				const shapeObject = createShapeObject(shape);
				shapeArray.push(shapeObject);
			});

			const shapeList = {
				"SHAPE": shapeArray
			}

			this.setState({ shapes: shapeList })
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
			this.props.setActiveObject({ id: target.id, type: target.subtype ? target.subtype : target.type });
			this.props.setPreviousTab(this.props.activeTab);
			this.props.setActiveTab(indexFormatTab);
		},
		onSelect: target => {
			const { selectedItem } = this.state;
			if (!target || (target && target.type === 'background')) {
				this.setState({
					selectedItem: target,
				});
				this.props.setActiveTab(this.props.previousTab);
				this.props.setActiveObject(null);
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
				this.props.setActiveObject({ id: target.id, type: target.subtype ? target.subtype : target.type });
				if (this.props.activeTab !== indexFormatTab) {
					this.props.setPreviousTab(this.props.activeTab);
				}
				this.props.setActiveTab(indexFormatTab);
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
			this.canvasHandlers.onSelect(null);
			this.props.setActiveTab(this.props.previousTab);
			this.props.setActiveObject(null);
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
								this.canvasRef.handler.toGroup();
							}}
						>
							{i18n.t('action.object-group')}
						</Menu.Item>
						<Menu.Item
							onClick={() => {
								this.canvasRef.handler.remove();
							}}
						>
							{i18n.t('action.delete')}
						</Menu.Item>
					</Menu>
				);
			}
			if (target.type === 'group') {
				return (
					<Menu>
						<Menu.Item
							onClick={() => {
								this.canvasRef.handler.toActiveSelection();
							}}
						>
							{i18n.t('action.object-ungroup')}
						</Menu.Item>
						<Menu.Item
							onClick={() => {
								this.canvasRef.handler.remove();
							}}
						>
							{i18n.t('action.delete')}
						</Menu.Item>
					</Menu>
				);
			}
			return (
				<Menu>
					<Menu.Item
						onClick={() => {
							this.canvasRef.handler.removeById(target.id);
						}}
					>
						{i18n.t('action.delete')}
					</Menu.Item>
				</Menu>
			);
		},
		onTransaction: transaction => {
			this.forceUpdate();
		},
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
		onSlide: () => {
			alert("test222");
			fetch("./sample1.json")
			.then(res => res.json())
			.then(data => alert(data));
						alert("test");
						const { objects, animations, styles, dataSources } = JSON.parse("./sample1.json");
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
		onLoadSlide: () => {
			// console.log(e.target, "-------------------index---------------------")
			fetch('/api/slides')
			.then(res => res.json())
			.then(({ slides }) => {
			const { objects, animations, styles, dataSources} = JSON.parse(JSON.stringify(slides[0]));
				this.setState({
					animations,
					styles,
					dataSources
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
			});
			
		},
		onBackgroundChange: () => {
			const originalObjects = this.canvasRef.handler.exportJSON().filter(obj => {
				if (!obj.id) {
					return false;
				}
				return true;
			});
			const newObjects = {
				
					type: "image",
					version: "3.6.6",
					originX: "left",
					originY: "top",
					left: 830,
					top: 403.6,
					width: 600,
					height: 400,
					backgroundColor: "rgba(50, 50, 10, 1)",
					crossOrigin: "",
					cropX: 0,
					cropY: 0,
				    id: "workarea",
					name: "",
					link: {},
					layout: "fixed",
					workareaWidth: 600,
					workareaHeight: 400,
					src: "",
					filters: []
				
			};
			
				const combinedObject = [newObjects, originalObjects[0]];
				if (combinedObject) {
					const data = combinedObject.filter(obj => {
						if (!obj.id) {
							return false;
						}
						return true;
					});
					this.canvasRef.handler.importJSON(data);
			}
		
			
			
		},

		// onAvatarChange : (url) => {
		// 	// alert("this is reached;");
		// 	console.log("----------here is the url----------", url);
		// 	const originalObjects = this.canvasRef.handler.exportJSON().filter(obj => {
		// 		if (!obj.id) {
		// 			return false;
		// 		}
		// 		return true;
		// 	});
		// 	const newObjects = {
				
		// 			type: "image",
		// 			version: "3.6.6",
		// 			originX: "left",
		// 			originY: "top",
		// 			left: 830,
		// 			top: 403.6,
		// 			width: 600,
		// 			height: 400,
		// 			backgroundColor: "rgba(255, 255, 255, 1)",
		// 			crossOrigin: "",
		// 			cropX: 0,
		// 			cropY: 0,
		// 		    id: "workarea",
		// 			name: "",
		// 			link: {},
		// 			layout: "fixed",
		// 			workareaWidth: 600,
		// 			workareaHeight: 400,
		// 			src: url,
		// 			filters: []
				
		// 	};
			
		// 		const combinedObject = [newObjects, originalObjects[0]];
		// 		if (combinedObject) {
		// 			const data = combinedObject.filter(obj => {
		// 				if (!obj.id) {
		// 					return false ;
		// 				}
		// 				return true;
		// 			});
		// 			this.canvasRef.handler.importJSON(data);
		// 	}
		
			
			
		// },
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

	shortcutHandlers = {
		esc: () => {
			document.addEventListener('keydown', e => {
				if (e.code === code.ESCAPE) {
					this.handlers.onChangePreview(false);
				}
			});
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

	render() {
		const {
			avatars,
			descriptors,
			uploadedImages,
			defaultImages,
			shapes,
			backgrounds,
			uploadedBackgroundImages,
			defaultBackgroundImages,
			mobileOpen,
			openGenerateVideo,
			openDiscardDraft,
			openPlayVideo,
			videoSource,
			packageId
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
		} = this.canvasHandlers;
		const {
			onChangePreview,
			onDownload,
			onUpload,
			onChangeAnimations,
			onChangeStyles,
			onChangeDataSources,
			onSaveImage,
			onLoadSlide,
			onBackgroundChange,
			onAvatarChange
		} = this.handlers;

		return (
			<Box sx={{ width: '100%', display: 'flex', overflow: { md: 'hidden' } }}>
				<GenerateVideo open={openGenerateVideo} close={() => this.handleCloseGenerateVideo()} />
				<DiscardDraft open={openDiscardDraft} close={() => this.handleCloseDiscardDraft()} />
				<PlayVideo open={openPlayVideo} close={() => this.handleClosePlayVideo()} source={videoSource} />

				{this.canvasRef && this.props.video &&
				<Appbar 
					handleDrawerToggle={() => this.handleDrawerToggle()}
					canvasRef={this.canvasRef}
					openGenerateVideo={() => this.handleOpenGenerateVideo()}
					openDiscardDraft={() => this.handleOpenDiscardDraft()}
					openPlayVideo={() => this.handleOpenPlayVideo()}
					changeVideoSource={(source) => this.handleChangeVideoSource(source)}
				/>}

				<Sidebar 
					mobileOpen={mobileOpen} 
					handleDrawerToggle={() => this.handleDrawerToggle()}
				/>

				<Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
					<Grid container sx={{ width: '100%', height: '100%' }}>
						{this.canvasRef && this.props.slides.length > 0 &&
						<Grid item xs={12} md={3} lg={2} xl={2}>
							<Box sx={{ backgroundColor: '#24282c', height: '100%' }}>
								<Slides canvasRef={this.canvasRef} packageId={packageId} />
							</Box>
						</Grid>}
						
						<Grid item xs={12} md={9} lg={5} xl={5.5}>
							<Box sx={{ py: 5, display: 'flex', justifyContent: 'center' }}>
								<Canvas
									ref={c => {
										this.canvasRef = c;
									}}
									minZoom={30}
									maxZoom={300}
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
							<Script />
						</Grid>

						{this.canvasRef && 
						<Grid item xs={12} md={12} lg={5} xl={4.5}>
							<ImageMapItems
								canvasRef={this.canvasRef}
								descriptors={descriptors}
								backgrounds={backgrounds}
								uploadedBackgroundImages={uploadedBackgroundImages}
								defaultBackgroundImages={defaultBackgroundImages}
								uploadedImages={uploadedImages}
								defaultImages={defaultImages}
								avatars={avatars}
								shapes={shapes}
								reloadImages={() => this.loadImages()}
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
	video: state.video.video,
	slides: state.video.slides
});

const mapDispatchToProps  = {
	setActiveObject,
	setActiveTab,
	setPreviousTab,
	setShowBackdrop,
	setVideo,
	setSlides
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ImageMapEditor));
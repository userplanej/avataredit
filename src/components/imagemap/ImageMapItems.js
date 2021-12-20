import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notification, message } from 'antd';
import { v4 } from 'uuid';
import { Flex } from '../flex';

import { code, scaling } from '../canvas/constants';

import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';
import DeleteIcon from '@mui/icons-material/Delete';

import ToolsView from '../../components-site/views/editor/ToolsView';
import SearchInput from '../../components-site/inputs/SearchInput';

import { getStringShortcut } from '../../utils/StringUtils';
import { showAlert } from '../../utils/AlertUtils';

import { uploadFile } from '../../api/s3';
import { postImage, deleteImage } from '../../api/image/image';
import { postBackground, deleteBackground } from '../../api/background/background';

import { setShowBackdrop } from '../../redux/backdrop/backdropSlice';
import { setLeft, setTop, setWidth, setHeight, setAvatarPosition, setAvatarSize } from '../../redux/object/objectSlice';
import { setSelectedAvatar } from '../../redux/video/videoSlice';

import { avatarPositionValues } from '../../enums/AvatarPosition';

notification.config({
	top: 80,
	duration: 2,
});

class ImageMapItems extends Component {
	constructor(props) {
		super(props);

		this.state = {
			activeKey: [],
			collapse: false,
			textSearch: '',
			descriptors: {},
			backgrounds: {},
			avatars: {},
			images: {},
			filteredDescriptors: [],
			svgModalVisible: false,
			optionValue: null,
			indexTab: 0,
			avatarSearch: '',
			backgroundColorSearch: '',
			backgroundImageSearch: '',
			imageSearch: ''
		};
	}

	static propTypes = {
		canvasRef: PropTypes.any,
		descriptors: PropTypes.object,
		backgrounds: PropTypes.object,
		avatars: PropTypes.object,
		images: PropTypes.object
	};

	componentDidMount() {
		const { canvasRef } = this.props;
		this.waitForCanvasRender(canvasRef);
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		if (JSON.stringify(this.props.descriptors) !== JSON.stringify(nextProps.descriptors)) {
			const descriptors = Object.keys(nextProps.descriptors).reduce((prev, key) => {
				return prev.concat(nextProps.descriptors[key]);
			}, []);
			this.setState({
				descriptors,
			});
		}
		if (JSON.stringify(this.props.backgrounds) !== JSON.stringify(nextProps.backgrounds)) {
			const backgrounds = Object.keys(nextProps.backgrounds).reduce((prev, key) => {
				return prev.concat(nextProps.backgrounds[key]);
			}, []);
			this.setState({
				backgrounds,
			});
		}
		if (JSON.stringify(this.props.avatars) !== JSON.stringify(nextProps.avatars)) {
			const avatars = Object.keys(nextProps.avatars).reduce((prev, key) => {
				return prev.concat(nextProps.avatars[key]);
			}, []);
			this.setState({
				avatars,
			});
		}
		if (JSON.stringify(this.props.images) !== JSON.stringify(nextProps.images)) {
			const images = Object.keys(nextProps.images).reduce((prev, key) => {
				return prev.concat(nextProps.images[key]);
			}, []);
			this.setState({
				images,
			});
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (JSON.stringify(this.state.descriptors) !== JSON.stringify(nextState.descriptors)) {
			return true;
		} else if (JSON.stringify(this.state.backgrounds) !== JSON.stringify(nextState.backgrounds)) {
			return true;
		} else if (JSON.stringify(this.state.avatars) !== JSON.stringify(nextState.avatars)) {
			return true;
		} else if (JSON.stringify(this.state.filteredDescriptors) !== JSON.stringify(nextState.filteredDescriptors)) {
			return true;
		} else if (this.state.textSearch !== nextState.textSearch) {
			return true;
		} else if (JSON.stringify(this.state.activeKey) !== JSON.stringify(nextState.activeKey)) {
			return true;
		} else if (this.state.collapse !== nextState.collapse) {
			return true;
		} else if (this.state.svgModalVisible !== nextState.svgModalVisible) {
			return true;
		} else if (this.state.avatarSearch !== nextState.avatarSearch) {
			return true;
		} else if (this.state.backgroundColorSearch !== nextState.backgroundColorSearch) {
			return true;
		} else if (this.state.backgroundImageSearch !== nextState.backgroundImageSearch) {
			return true;
		} else if (this.state.imageSearch !== nextState.imageSearch) {
			return true;
		} else if (JSON.stringify(this.state.images) !== JSON.stringify(nextState.images)) {
			return true;
		} else if (this.props.uploadedBackgroundImages !== nextProps.uploadedBackgroundImages) {
			return true;
		} else if (this.props.defaultBackgroundColors !== nextProps.defaultBackgroundColors) {
			return true;
		} else if (this.props.defaultBackgroundImages !== nextProps.defaultBackgroundImages) {
			return true;
		} else if (this.props.defaultBackgroundVideos !== nextProps.defaultBackgroundVideos) {
			return true;
		} else if (this.props.avatars !== nextProps.avatars) {
			return true;
		} else if (this.props.uploadedImages !== nextProps.uploadedImages) {
			return true;
		} else if (this.props.defaultImages !== nextProps.defaultImages) {
			return true;
		} else if (this.props.shapes !== nextProps.shapes) {
			return true;
		}
		return false;
	}

	componentWillUnmount() {
		const { canvasRef } = this.props;
		this.detachEventListener(canvasRef);
		this.props.setSelectedAvatar(null);
	}

	waitForCanvasRender = canvas => {
		setTimeout(() => {
			if (canvas) {
				this.attachEventListener(canvas);
				return;
			}
			const { canvasRef } = this.props;
			this.waitForCanvasRender(canvasRef);
		}, 5);
	};

	attachEventListener = canvas => {
		canvas.canvas.wrapperEl.addEventListener('dragenter', this.events.onDragEnter, false);
		canvas.canvas.wrapperEl.addEventListener('dragover', this.events.onDragOver, false);
		canvas.canvas.wrapperEl.addEventListener('dragleave', this.events.onDragLeave, false);
		canvas.canvas.wrapperEl.addEventListener('drop', this.events.onDrop, false);
		this.attachObjectEventListener(canvas);
		this.attachDocumentEventListener();
	};

	attachObjectEventListener = canvas => {
		const updateObject = (target, width, height) => this.updateObjectSize(target, width, height);
		canvas.canvas.on({
			'object:moving': () => {
				const activeObject = canvas.handler.getActiveObject();
				this.updateObjectPosition(activeObject);
			},
			'object:moved': () => {
				const activeObject = canvas.handler.getActiveObject();
				if (activeObject.subtype === 'avatar') {
					this.props.setAvatarPosition(null);
				}
				this.props.onSaveSlide();
			},
			'object:scaling': () => {
				const activeObject = canvas.handler.getActiveObject();
				let defaultScale = scaling.IMAGE;
				if (activeObject.subtype === 'avatar') {
					defaultScale = scaling.AVATAR;
				}
				if (activeObject.subtype === 'shape') {
					defaultScale = scaling.SHAPE;
				}
				const newWidth = (activeObject.width * activeObject.scaleX) / defaultScale;
				const newHeight = (activeObject.height * activeObject.scaleY) / defaultScale;
				updateObject(activeObject, parseInt(newWidth), parseInt(newHeight));
			},
			'object:scaled': () => {
				this.props.onSaveSlide();
			},
			'object:rotated': () => {
				this.props.onSaveSlide();
			}
		});
	}

	attachDocumentEventListener = () => {
		document.addEventListener('keydown', e => {
			if (e.code === code.DELETE) {
				setTimeout(() => this.props.onSaveSlide(), 1);
			}
		});
	}

	detachEventListener = canvas => {
		canvas.canvas.wrapperEl.removeEventListener('dragenter', this.events.onDragEnter);
		canvas.canvas.wrapperEl.removeEventListener('dragover', this.events.onDragOver);
		canvas.canvas.wrapperEl.removeEventListener('dragleave', this.events.onDragLeave);
		canvas.canvas.wrapperEl.removeEventListener('drop', this.events.onDrop);
	};

	updateObjectPosition = (target) => {
		this.props.setLeft(Math.round(target.left));
		this.props.setTop(Math.round(target.top));
	}

	updateObjectSize = (target, width, height) => {
		this.props.setWidth(width ? width : target.width);
		this.props.setHeight(height ? height : target.height);
	}

	/* eslint-disable react/sort-comp, react/prop-types */
	handlers = {
		onAddItem: (item, centered) => {
			const { canvasRef, onSaveSlide } = this.props;
			const updateObjectPosition = (target) => this.updateObjectPosition(target);
			const updateObjectSize = (target, width, height) => this.updateObjectSize(target, width, height);
			if (canvasRef.handler.interactionMode === 'polygon') {
				message.info('Already drawing');
				return;
			}
			const id = v4();
			const option = Object.assign({}, item.option, { id });
			if (item.option.superType === 'svg' && item.type === 'default') {
				this.handlers.onSVGModalVisible(item.option);
				return;
			}
			if (item.type === 'avatar') {
				canvasRef.handler.getObjects().forEach((obj) => {
					if (obj.subtype !== 'avatar') {
						return;
					}
					canvasRef.handler.remove(obj, true);
				});
				this.props.setSelectedAvatar(item);
				this.props.setAvatarPosition(avatarPositionValues.center);
				this.props.setAvatarSize("100");
			}
			const target = canvasRef.handler.add(option, centered, false, onSaveSlide);

			// Update format values
			updateObjectPosition(target);
			updateObjectSize(target);
		},
		onAddSVG: (option, centered) => {
			const { canvasRef } = this.props;
			canvasRef.handler.add({ ...option, type: 'svg', superType: 'svg', id: v4(), name: 'New SVG' }, centered);
			this.handlers.onSVGModalVisible();
		},
		onDrawingItem: item => {
			const { canvasRef } = this.props;
			if (canvasRef.handler.interactionMode === 'polygon') {
				message.info('Already drawing');
				return;
			}
			if (item.option.type === 'line') {
				canvasRef.handler.drawingHandler.line.init();
			} else if (item.option.type === 'arrow') {
				canvasRef.handler.drawingHandler.arrow.init();
			} else {
				canvasRef.handler.drawingHandler.polygon.init();
			}
		},
		onChangeActiveKey: activeKey => {
			this.setState({
				activeKey,
			});
		},
		onCollapse: () => {
			this.setState({
				collapse: !this.state.collapse,
			});
		},
		onSearchNode: e => {
			const filteredDescriptors = this.handlers
				.transformList()
				.filter(descriptor => descriptor.name.toLowerCase().includes(e.target.value.toLowerCase()));
			this.setState({
				textSearch: e.target.value,
				filteredDescriptors,
			});
		},
		transformList: () => {
			return Object.values(this.props.descriptors).reduce((prev, curr) => prev.concat(curr), []);
		},
		onSVGModalVisible: () => {
			this.setState(prevState => {
				return {
					svgModalVisible: !prevState.svgModalVisible,
				};
			});
		},
		onChangeWorkareaBackgroundColor: (color) => {
			this.props.canvasRef.handler.workareaHandler.setImage(null, false);
			this.props.canvasRef.handler.workareaHandler.setWorkareaBackgroundColor(color);
			this.props.onSaveSlide();
		},
		onChangeWorkareaBackgroundImage: (src) => {
			this.props.canvasRef.handler.workareaHandler.setWorkareaBackgroundColor('#e8e9e9');
			this.props.canvasRef.handler.workareaHandler.setImage(src, false);
			setTimeout(() => this.props.onSaveSlide(), 100);
		},
		onChangeWorkareaBackgroundVideo: (src) => {
			this.props.canvasRef.handler.workareaHandler.setWorkareaBackgroundColor('#e8e9e9');
			this.props.canvasRef.handler.workareaHandler.setImage(null, true);
			this.props.canvasRef.handler.workareaHandler.setVideo(src);
		}
	};

	events = {
		onDragStart: (e, item) => {
			this.item = item;
			const { target } = e;
			target.classList.add('dragging');
		},
		onDragOver: e => {
			if (e.preventDefault) {
				e.preventDefault();
			}
			e.dataTransfer.dropEffect = 'copy';
			return false;
		},
		onDragEnter: e => {
			const { target } = e;
			target.classList.add('over');
		},
		onDragLeave: e => {
			const { target } = e;
			target.classList.remove('over');
		},
		onDrop: e => {
			e = e || window.event;
			if (e.preventDefault) {
				e.preventDefault();
			}
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			const { layerX, layerY } = e;
			const dt = e.dataTransfer;
			if (dt.types.length && dt.types[0] === 'Files') {
				const { files } = dt;
				Array.from(files).forEach(file => {
					file.uid = v4();
					const { type } = file;
					if (type === 'image/png' || type === 'image/jpeg' || type === 'image/jpg') {
						const item = {
							option: {
								type: 'image',
								file,
								left: layerX,
								top: layerY,
							},
						};
						this.handlers.onAddItem(item, false);
					} else {
						notification.warn({
							message: 'Not supported file type',
						});
					}
				});
				return false;
			}
			const option = Object.assign({}, this.item.option, { left: layerX, top: layerY });
			const newItem = Object.assign({}, this.item, { option });
			this.handlers.onAddItem(newItem, false);
			return false;
		},
		onDragEnd: e => {
			this.item = null;
			e.target.classList.remove('dragging');
		},
	};

	renderItems = (items, key, type, isUpload) => {
		const isText = type === 'text';
		let hasOneItem = false;

		const itemsList = items && items.map(item => {
			if (this.shouldRenderItem(item, type)) {
				hasOneItem = true;
				return this.renderItem(item, isUpload);
			}
		});

		return <div key={key}>
				{this.renderSearchField(type)}
				{!isText && <Flex flexWrap="wrap" flexDirection="row" style={{ width: '100%' }} key={key}>
					{isUpload && this.renderUploadItem(type)}
					{hasOneItem && itemsList}
					{!isUpload && !hasOneItem && <Typography variant="body1" color="#fff">No result</Typography>}
				</Flex>}
				{isText && <div style={{ width: '100%' }} key={key}>
					{items.map(item => {
						if (this.shouldRenderItem(item, type)) {
							return this.renderItem(item);
						}
					})}
				</div>
				}
			</div>
	};

	renderUploadItem = (type) => {
		return (
			<Box sx={{ marginRight: '12px' }} key={'upload'}>
				<Box
					key={'upload'}
					onClick={this.handleUploadImage}
					sx={{ 
						justifyContent: this.state.collapse ? 'center' : null, 
						display: 'flex', 
						flexDirection: 'column', 
						cursor: 'pointer'
					}}
				>
          <input id="input-upload" type="file" hidden onChange={(event) => this.uploadImage(event, type)} accept="image/png,image/jpeg,image/bmp,image/gif" />
					<Box 
						className="rde-editor-items-item-icon" 
						sx={{ 
							width: '125px', 
							height: '100px', 
							backgroundColor: 'white',
							backgroundPosition: 'center', /* Center the image */
							backgroundRepeat: 'no-repeat', /* Do not repeat the image */
							backgroundSize: 'cover', /* Resize the background image to cover the entire container */
							display: 'flex', 
							flexDirection: 'column', 
							alignItems: 'center',
							borderRadius: '10px'
						}}
					>
						<UploadIcon fontSize='large' />
					</Box>
				</Box>
				{this.state.collapse ? null : <div className="rde-editor-items-item-text" key={`name-upload`}>Upload</div>}
			</Box>
		);
	}

	renderSearchField = (type) => {
		let searchField = null;

		if (type === 'avatar') {
			searchField = <SearchInput
				id="input-with-icon-textfield"
				placeholder="Search avatars"
				fullWidth
				onChange={(event) => this.handleAvatarNameChange(event.target.value)}
			/>
		}

		if (type === 'background-color') {
			searchField = <SearchInput
				id="input-with-icon-textfield"
				placeholder="Search colors"
				fullWidth
				onChange={(event) => this.handleBackgroundColorChange(event.target.value)}
			/>
		}

		if (type === 'background-image') {
			searchField = <SearchInput
				id="input-with-icon-textfield"
				placeholder="Search images"
				fullWidth
				onChange={(event) => this.handleBackgroundImageNameChange(event.target.value)}
			/>
		}

		if (type === 'image') {
			searchField = <SearchInput
				id="input-with-icon-textfield"
				placeholder="Search images"
				fullWidth
				onChange={(event) => this.handleImageNameChange(event.target.value)}
			/>
		}

		return searchField;
	}

	shouldRenderItem = (item, type) => {
		const { avatarSearch, backgroundColorSearch, backgroundImageSearch, imageSearch } = this.state;

		if (type === 'avatar' && avatarSearch !== '') {
			return item.name.toLowerCase().includes(avatarSearch.toLowerCase()) ? true : false;
		}
		if (type === 'background-color' && backgroundColorSearch !== '') {
			return item.name.toLowerCase().includes(backgroundColorSearch.toLowerCase()) ? true : false;
		}
		if (type === 'background-image' && backgroundImageSearch !== '') {
			return item.name.toLowerCase().includes(backgroundImageSearch.toLowerCase()) ? true : false;
		}
		if (type === 'image' && imageSearch !== '') {
			return item.name.toLowerCase().includes(imageSearch.toLowerCase()) ? true : false;
		}

		return true;
	}

	renderItem = (item, isUpload, centered) => {
		const isBackground = item.type === 'background';
		const isBackgroundColor = isBackground && item.option.subtype === 'color';
		const isBackgroundImage = isBackground && item.option.subtype === 'image';
		const isBackgroundVideo = isBackground && item.option.subtype === 'video';
		const isAvatar = item.type === 'avatar';
		const isImage = item.type === 'image';
		const isShape = item.type === 'shape';
		const source = item.option.src_thumbnail ? item.option.src_thumbnail : item.option.src;

		return item.type === 'text' ? (
			<Box
				key={item.name}
				onClick={e => this.handlers.onAddItem(item, centered)}
				sx={{ 
					textAlign: 'center',
					width: '100%',
					margin: '16px 19px 16px 0',
					padding: '15px 0px 17px',
					borderRadius: '10px',
					backgroundColor: '#e8e9e9',
					color: '#9a9a9a',
					fontWeight: 'bold',
					cursor: 'pointer',
					fontSize: item.fontSize,
					':hover': {
						backgroundColor: 'rgba(232, 233, 233, 0.6)'
					}
				}}
			>
				{item.name}
			</Box>
		) : (
			<Box sx={{ marginRight: '12px' }} key={item.name}>
				<Box
					key={item.name}
					onClick={() => {
						if (isBackgroundColor) {
							this.handlers.onChangeWorkareaBackgroundColor(item.option.backgroundColor);
							return;
						}
						if (isBackgroundImage || isBackgroundVideo) {
							this.handlers.onChangeWorkareaBackgroundImage(item.option.src);
							return;
						}
						this.handlers.onAddItem(item, centered);
					}}
					sx={{ 
						justifyContent: this.state.collapse ? 'center' : null, 
						display: 'flex', 
						flexDirection: 'column', 
						cursor: 'pointer',
						':hover .delete-upload-image': {
							display: 'block'
						}
					}}
				>
					<Box 
						className="rde-editor-items-item-icon" 
						sx={{ 
							width: '125px', 
							height: '100px', 
							backgroundColor: isBackgroundColor ? item.option.backgroundColor : 'white',
							backgroundImage: (isShape || isAvatar || isImage || isBackgroundImage) && source ? `url(${source})` : '',
							backgroundPosition: 'center', /* Center the image */
							backgroundRepeat: 'no-repeat', /* Do not repeat the image */
							backgroundSize: isShape ? 'contain' : 'cover', /* Resize the background image to cover the entire container */
							display: 'flex',
							borderRadius: '10px',
							justifyContent: 'right'
						}}
					>
						{isUpload &&
							<DeleteIcon
								id={`upload-image-btn-${item.name}`}
								className="delete-upload-image"
								onClick={(event) => this.handleDeleteImage(event, item.id, isImage)} 
								sx={{
									mt: 1,
									display: 'none',
									cursor: 'pointer',
									color: '#30353a',
									':hover': {
										color: '#df678c'
									}
								}}
							/>
						}
					</Box>
				</Box>
				{this.state.collapse ? null : <div className="rde-editor-items-item-text" key={`name-${item.name}`}>{getStringShortcut(item.name, 13)}</div>}
			</Box>
		)
	}

	viewActivated = () =>{
		this.setState({
			optionValue : "bezier-curve"
		});
	}

	handleAvatarNameChange = (value) => {
		this.setState({ avatarSearch: value });
	}

	handleBackgroundColorChange = (value) => {
		this.setState({ backgroundColorSearch: value });
	}

	handleBackgroundImageNameChange = (value) => {
		this.setState({ backgroundImageSearch: value });
	}

	handleImageNameChange = (value) => {
		this.setState({ imageSearch: value });
	}

	resetSearch = () => {
		this.handleAvatarNameChange('');
		this.handleBackgroundColorChange('');
		this.handleBackgroundImageNameChange('');
		this.handleImageNameChange('');
	}

	uploadImage = async (event, type) => {
		const user = JSON.parse(sessionStorage.getItem('user'));
    const filePath = event.target.value;
    const files = event.target.files;
		const isImage = type === 'image';

    if (files && files.length > 0) {
			const file = files[0];
			if (!['image/png', 'image/bmp', 'image/jpeg', 'image/gif'].includes(file.type)) {
				showAlert('You can only upload image files.', 'error');
				return;
			}

      this.props.setShowBackdrop(true);

      const fileName = filePath.replace(/^.*?([^\\\/]*)$/, '$1');
      const formData = new FormData();
      formData.append('files', file);

      await uploadFile(formData, isImage ? 'images' : 'backgrounds').then(async (res) => {
        const upload = res.data.body[0];
        let dataToSend = {
					is_upload: true,
					user_id: user.user_id
				};

				if (isImage) {
					dataToSend.image_name = fileName;
					dataToSend.image_dir = upload.file_dir;

					await postImage(dataToSend).then(() => {
						this.props.reloadImages();
						this.props.setShowBackdrop(false);
					});
				} else {
					dataToSend.background_name = fileName;
					dataToSend.background_src = upload.file_dir;

					await postBackground(dataToSend).then(() => {
						this.props.reloadBackgrounds();
						this.props.setShowBackdrop(false);
					});
				}
      });
    }
  }

	handleUploadImage = () => {
		document.getElementById('input-upload').click();
	}

	handleDeleteImage = async (event, id, isImage) => {
		event.stopPropagation();

		const { reloadImages, reloadBackgrounds } = this.props;

		if (isImage) {
			await deleteImage(id).then(async () => await reloadImages());
		} else {
			await deleteBackground(id).then(async () => await reloadBackgrounds());
		}
	}

	render() {
		const { 
			canvasRef, descriptors, uploadedBackgroundImages, defaultBackgroundColors, defaultBackgroundImages, 
			defaultBackgroundVideos, avatars, uploadedImages, defaultImages, shapes, onSaveSlide, userTemplates,
			reloadSlides, video
		} = this.props;

		// Texts
		const textsItems = Object.keys(descriptors).filter(key => key === 'TEXT').map(key => this.renderItems(descriptors[key], key, 'text'));
		// Shapes
		const shapesItems = Object.keys(shapes).map(key => this.renderItems(shapes[key], key, 'shape'));
		// Backgrounds
		const backgroundsColorsItems = Object.keys(defaultBackgroundColors).map(key => this.renderItems(defaultBackgroundColors[key], key, 'background-color'));
		const backgroundsImagesDefaultItems = Object.keys(defaultBackgroundImages).map(key => this.renderItems(defaultBackgroundImages[key], key, 'background-image'));
		const backgroundsImagesUploadedKeys = Object.keys(uploadedBackgroundImages);
		const backgroundsImagesUploadedItems = backgroundsImagesUploadedKeys.filter(key => key === 'IMAGE').length > 0 ?
			backgroundsImagesUploadedKeys.map(key => this.renderItems(uploadedBackgroundImages[key], key, 'background-image', true))
			:
			this.renderItems([], 0, 'background-image', true);
		const backgroundsVideosDefaultItems = Object.keys(defaultBackgroundVideos).map(key => this.renderItems(defaultBackgroundVideos[key], key, 'background-image'));
		// Avatars
		const avatarsItems = Object.keys(avatars).map(key => this.renderItems(avatars[key], key, 'avatar'));
		// Images
		const imagesUploadedKeys = Object.keys(uploadedImages);
		const imagesUploadedItems = imagesUploadedKeys.filter(key => key === 'IMAGE').length > 0 ? 
			imagesUploadedKeys.map(key => this.renderItems(uploadedImages[key], key, 'image', true)) 
			: 
			this.renderItems([], 0, 'image', true);
		const imagesDefaultItems = Object.keys(defaultImages).map(key => this.renderItems(defaultImages[key], key, 'image'));

		return (
			<Box height="100%">
				<ToolsView 
					canvasRef={canvasRef}
					onSaveSlide={onSaveSlide}
					texts={textsItems}
					shapes={shapesItems}
					imagesDefault={imagesDefaultItems}
					imagesUploaded={imagesUploadedItems}
					backgroundsColors={backgroundsColorsItems}
					backgroundsImagesDefault={backgroundsImagesDefaultItems}
					backgroundsImagesUploaded={backgroundsImagesUploadedItems}
					backgroundsVideosDefault={backgroundsVideosDefaultItems}
					avatars={avatarsItems}
					userTemplates={userTemplates}
					reloadSlides={reloadSlides}
					video={video}
					resetSearch={this.resetSearch}
				/>
			</Box>
		);
	}
}

const mapDispatchToProps  = {
	setShowBackdrop,
	setSelectedAvatar,
	setLeft,
	setTop,
	setWidth,
	setHeight,
	setAvatarPosition,
	setAvatarSize
}

export default connect(null, mapDispatchToProps)(ImageMapItems);

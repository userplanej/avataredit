import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { notification, message } from 'antd';
import { v4 } from 'uuid';
import { Flex } from '../flex';
import Icon from '../icon/Icon';
import { Box } from '@mui/system';
import UploadIcon from '@mui/icons-material/Upload';

import ToolsView from '../../components-site/views/editor/ToolsView';
import SearchInput from '../../components-site/inputs/SearchInput';

import { getStringShortcut } from '../../utils/StringUtils';
import { uploadFile } from '../../api/s3';
import { postImage } from '../../api/image/image';
import { setShowBackdrop } from '../../redux/backdrop/backdropSlice';

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
		} else if (this.state.backgroundImageSearch !== nextState.backgroundImageSearch) {
			return true;
		} else if (this.state.imageSearch !== nextState.imageSearch) {
			return true;
		} else if (JSON.stringify(this.state.images) !== JSON.stringify(nextState.images)) {
			return true;
		}
		return false;
	}

	componentWillUnmount() {
		const { canvasRef } = this.props;
		this.detachEventListener(canvasRef);
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
	};

	detachEventListener = canvas => {
		canvas.canvas.wrapperEl.removeEventListener('dragenter', this.events.onDragEnter);
		canvas.canvas.wrapperEl.removeEventListener('dragover', this.events.onDragOver);
		canvas.canvas.wrapperEl.removeEventListener('dragleave', this.events.onDragLeave);
		canvas.canvas.wrapperEl.removeEventListener('drop', this.events.onDrop);
	};

	/* eslint-disable react/sort-comp, react/prop-types */
	handlers = {
		onAddItem: (item, centered) => {
			const { canvasRef } = this.props;
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
					canvasRef.handler.remove(obj);
				});
			}
			canvasRef.handler.add(option, centered);
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
		},
		onChangeWorkareaBackgroundImage: (src) => {
			this.props.canvasRef.handler.workareaHandler.setWorkareaBackgroundColor('#e8e9e9');
			this.props.canvasRef.handler.workareaHandler.setImage(src, true);
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
		return <div key={key}>
				{this.renderSearchField(type)}
				{!isText && <Flex flexWrap="wrap" flexDirection="row" style={{ width: '100%' }} key={key}>
					{isUpload && this.renderUploadItem(type)}
					{items.map(item => {
						if (this.shouldRenderItem(item, type)) {
							return this.renderItem(item);
						}
					})}
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

	renderUploadItem = () => {
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
          <input id="input-upload" type="file" hidden onChange={this.uploadImage} accept="image/*" />
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
		const { avatarSearch, backgroundImageSearch, imageSearch } = this.state;

		// if (type === 'image' && item.type === 'upload') {
		// 	return false;
		// }
		if (type === 'avatar' && avatarSearch !== '') {
			return item.name.toLowerCase().includes(avatarSearch.toLowerCase()) ? true : false;
		}
		if (type === 'background-image' && backgroundImageSearch !== '') {
			return item.name.toLowerCase().includes(backgroundImageSearch.toLowerCase()) ? true : false;
		}
		if (type === 'image' && imageSearch !== '') {
			return item.name.toLowerCase().includes(imageSearch.toLowerCase()) ? true : false;
		}

		return true;
	}

	renderItem = (item, centered) => {
		const isBackground = item.type === 'background';
		const isBackgroundColor = isBackground && item.option.subtype === 'color';
		const isBackgroundImage = isBackground && item.option.subtype === 'image';
		const isAvatar = item.type === 'avatar';
		const isImage = item.type === 'image';

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
						if (isBackgroundImage) {
							this.handlers.onChangeWorkareaBackgroundImage(item.option.src);
							return;
						}
						this.handlers.onAddItem(item, centered);
					}}
					sx={{ 
						justifyContent: this.state.collapse ? 'center' : null, 
						display: 'flex', 
						flexDirection: 'column', 
						cursor: 'pointer'
					}}
				>
					<Box 
						className="rde-editor-items-item-icon" 
						sx={{ 
							width: '125px', 
							height: '100px', 
							backgroundColor: isBackgroundColor ? item.option.backgroundColor : 'white',
							backgroundImage: isAvatar || isImage || isBackgroundImage ? `url(${item.option.src})` : '',
							backgroundPosition: 'center', /* Center the image */
							backgroundRepeat: 'no-repeat', /* Do not repeat the image */
							backgroundSize: 'cover', /* Resize the background image to cover the entire container */
							display: 'flex', 
							flexDirection: 'column', 
							textAlign: 'center',
							borderRadius: '10px'
						}}
					>
						{/* {!isBackground || !isAvatar || !isImage && <Icon name={item.icon.name} prefix={item.icon.prefix} style={item.icon.style} />} */}
						{!isBackground && !isAvatar && !isImage && <Icon name={item.icon.name} prefix={item.icon.prefix} style={item.icon.style} />}
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

	handleBackgroundImageNameChange = (value) => {
		this.setState({ backgroundImageSearch: value });
	}

	handleImageNameChange = (value) => {
		this.setState({ imageSearch: value });
	}

	uploadImage = (event) => {
		const user = JSON.parse(sessionStorage.getItem('user'));
    const filePath = event.target.value;
    const files = event.target.files;

    if (files && files.length > 0) {
      this.props.setShowBackdrop(true);

      const fileName = filePath.replace(/^.*?([^\\\/]*)$/, '$1');
      const formData = new FormData();
      formData.append('adminId', 'admin1018');
      formData.append('images', files[0]);

      uploadFile(formData, 'image').then((res) => {
        const location = res.data.body.location;
        const dataToSend = {
          image_name: fileName,
          image_dir: location,
					is_upload: true,
					user_id: user.user_id
        }
        postImage(dataToSend).then(() => {
					this.props.reloadImages();
          this.props.setShowBackdrop(false);
        });
      });
    }
  }

	handleUploadImage = () => {
		document.getElementById('input-upload').click();
	}

	render() {
		const { canvasRef, descriptors, backgrounds, backgroundImages, avatars, images, shapes, saveImage } = this.props;

		const texts = Object.keys(descriptors).filter(key => key === 'TEXT').map(key => this.renderItems(descriptors[key], key, 'text'));
		// const shapesItems = Object.keys(shapes).map(key => this.renderItems(shapes[key], key, 'shape'));
		const shapesItems = Object.keys(descriptors).filter(key => key === 'SHAPE').map(key => this.renderItems(descriptors[key], key));
		const imagesDefault = Object.keys(descriptors).filter(key => key === 'IMAGE').map(key => this.renderItems(descriptors[key], key, 'image'));
		const backgroundsColorsItems = Object.keys(backgrounds).filter(key => key === 'BACKGROUND').map(key => this.renderItems(backgrounds[key], key, 'background-color'));
		const backgroundsImagesItems = Object.keys(backgrounds).filter(key => key === 'IMAGE').map(key => this.renderItems(backgrounds[key], key, 'background-image'));
		const backgroundsImagesUploaded = Object.keys(backgroundImages).map(key => this.renderItems(backgroundImages[key], key, 'background-image', true));
		const avatarsItems = Object.keys(avatars).map(key => this.renderItems(avatars[key], key, 'avatar'));
		const imagesUploaded = Object.keys(images).map(key => this.renderItems(images[key], key, 'image', true));

		return (
			<Box height="100%">
				<ToolsView 
					canvasRef={canvasRef}
					texts={texts}
					shapes={shapesItems}
					images={imagesDefault}
					backgroundsColors={backgroundsColorsItems}
					backgroundsImages={backgroundsImagesItems}
					backgroundsImagesUploaded={backgroundsImagesUploaded}
					avatars={avatarsItems}
					imagesUploaded={imagesUploaded}
					saveImage={saveImage}
				/>
			</Box>
		);
	}
}

const mapDispatchToProps  = {
	setShowBackdrop
}

export default connect(null, mapDispatchToProps)(ImageMapItems);

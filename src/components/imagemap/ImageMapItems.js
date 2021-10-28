import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Collapse, notification, Input, message } from 'antd';
import { v4 } from 'uuid';
import classnames from 'classnames';
import i18n from 'i18next';
import Button from '@mui/material/Button';
import { Flex } from '../flex';
import Icon from '../icon/Icon';
import Scrollbar from '../common/Scrollbar';
import CommonButton from '../common/CommonButton';
import { SVGModal } from '../common';
import { view } from 'react-dom-factories';
import { Row, Col } from 'antd';
import ToolsView from '../../components-site/editor/ToolsView';
import Image from '@mui/icons-material/Image';

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
			filteredDescriptors: [],
			svgModalVisible: false,
			optionValue: null,
			indexTab: 0
		};
	}

	static propTypes = {
		canvasRef: PropTypes.any,
		descriptors: PropTypes.object,
		backgrounds: PropTypes.object,
		avatars: PropTypes.object
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

	renderItems = (items, key) => (
		<Flex flexWrap="wrap" flexDirection="row" style={{ width: '100%' }} key={key}>
			{items.map(item => this.renderItem(item))}
		</Flex>
	);

	renderItem = (item, centered) => {
		const isBackground = item.type === 'background';
		const isAvatar = item.type === 'avatar';
		return item.type === 'drawing' ? (
			<div
				key={item.name}
				draggable
				onClick={e => this.handlers.onDrawingItem(item)}
				className="rde-editor-items-item"
				style={{ justifyContent: this.state.collapse ? 'center' : null }}
			>
				<span className="rde-editor-items-item-icon">
					<Icon name={item.icon.name} prefix={item.icon.prefix} style={item.icon.style} />
				</span>
				{this.state.collapse ? null : <div className="rde-editor-items-item-text">{item.name}</div>}
			</div>
		) : (
			<div style={{ marginRight: '12px' }} key={item.name}>
				<div
					key={item.name}
					draggable
					onClick={e => { 
						this.handlers.onAddItem(item, centered); 
						if (isBackground) {
							this.props.canvasRef.handler?.sendToBack();
						}
					}}
					onDragStart={e => this.events.onDragStart(e, item)}
					onDragEnd={e => this.events.onDragEnd(e, item)}
					style={{ justifyContent: this.state.collapse ? 'center' : null, display: 'flex', flexDirection: 'column' }}
				>
					<span 
						className="rde-editor-items-item-icon" 
						style={{ 
							width: '168px', 
							height: '136px', 
							backgroundColor: isBackground ? item.option.backgroundColor : 'white', 
							display: 'flex', 
							flexDirection: 'column', 
							textAlign: 'center' 
						}}
					>
						{!isBackground && !isAvatar && <Icon name={item.icon.name} prefix={item.icon.prefix} style={item.icon.style} />}
						{isAvatar && <img src={item.option.src} />}
					</span>
				</div>
			{this.state.collapse ? null : <div className="rde-editor-items-item-text">{item.name}</div>}
			</div>
		)
	}

	viewActivated = () =>{
		this.setState({
			optionValue : "bezier-curve"
		});
	}

	render() {
		const { descriptors, backgrounds, avatars } = this.props;
		const { collapse, textSearch, filteredDescriptors, activeKey, svgModalVisible, svgOption, indexTab } = this.state;
		const className = classnames('rde-editor-items', {
			minimize: collapse,
		});
		const texts = Object.keys(descriptors).filter(key => key === 'TEXT').map(key => this.renderItems(descriptors[key], key));
		const shapes = Object.keys(descriptors).filter(key => key === 'SHAPE').map(key => this.renderItems(descriptors[key], key));
		const images = Object.keys(descriptors).filter(key => key === 'IMAGE').map(key => this.renderItems(descriptors[key], key));
		const backgroundsItems = Object.keys(backgrounds).map(key => this.renderItems(backgrounds[key], key));
		const avatarsItems = Object.keys(avatars).map(key => this.renderItems(avatars[key], key));
		console.log(avatarsItems)
		return (
			<ToolsView 
				texts={texts}
				shapes={shapes}
				images={images}
				backgrounds={backgroundsItems}
				avatars={avatarsItems}
			/>
			
			// <div className={className}>
			// 	<Row>
			// 	<Col span={16}>
			// 		<Collapse
			// 			style={{ width: '100%' }}
			// 			bordered={false}
			// 			activeKey={activeKey.length ? activeKey : Object.keys(descriptors)}
			// 			onChange={this.handlers.onChangeActiveKey}
			// 		>
			// 			{Object.keys(descriptors).map(key => (
			// 				<Collapse.Panel key={key} header={key} showArrow={!collapse}>
			// 					{this.renderItems(descriptors[key])}
			// 				</Collapse.Panel>
			// 			))}
			// 		</Collapse>
			// 	</Col>
			// 	{/* <Col span={8}>
			// 		<Button
			// 				value={"bezier-curve"}
			// 				onClick={this.viewActivated}>
			// 			Here is the button
			// 		</Button>
			// 	</Col> */}
			// 	</Row>
			// 	<SVGModal
			// 		visible={svgModalVisible}
			// 		onOk={this.handlers.onAddSVG}
			// 		onCancel={this.handlers.onSVGModalVisible}
			// 		option={svgOption}
			// 	/>
			// </div>
		);
	}
}

export default ImageMapItems;

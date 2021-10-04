import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { notification,  Tooltip, Button } from 'antd';
import { v4 } from 'uuid';
import classnames from 'classnames';
import i18n from 'i18next';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Flex } from '../flex';
import Icon from '../icon/Icon';
import Scrollbar from '../common/Scrollbar';
import CommonButton from '../common/CommonButton';
import { SVGModal } from '../common';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Block from 'react-color/lib/components/block/Block';

notification.config({
	top: 80,
	duration: 2,
});
const { Meta } = Card;

class Slide extends Component {
	static propTypes = {
		canvasRef: PropTypes.any,
		descriptors: PropTypes.object,
		slides: PropTypes.Array
	};

	state = {
		activeKey: [],
		collapse: false,
		textSearch: '',
		descriptors: {},
		filteredDescriptors: [],
		svgModalVisible: false,
		name: PropTypes.string,
		id: PropTypes.string,
		style: PropTypes.object,
		wrapperStyle: PropTypes.object,
		wrapperClassName: PropTypes.string,
		tooltipTitle: PropTypes.string,
		tooltipPlacement: PropTypes.string,
		className: PropTypes.string,
		icon: PropTypes.string,
		iconStyle: PropTypes.object,
		iconClassName: PropTypes.string,
		iconAnimation: PropTypes.string,
		visible: PropTypes.bool,
		shape: PropTypes.string,
		disabled: PropTypes.bool,
		loading: PropTypes.bool,
		type: PropTypes.string,
	};
	static defaultProps = {
		type: 'default',
		visible: true,
		disabled: false,
		loading: false,
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
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (JSON.stringify(this.state.descriptors) !== JSON.stringify(nextState.descriptors)) {
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

	renderItems = items => (
		<Flex flexWrap="wrap" flexDirection="column" style={{ width: '100%' }}>
			{items.map(item => this.renderItem(item))}
		</Flex>
	);

	renderItem = (item, centered) =>
		item.type === 'drawing' ? (
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
			<div
				key={item.name}
				draggable
				onClick={e => this.handlers.onAddItem(item, centered)}
				onDragStart={e => this.events.onDragStart(e, item)}
				onDragEnd={e => this.events.onDragEnd(e, item)}
				className="rde-editor-items-item"
				style={{ justifyContent: this.state.collapse ? 'center' : null }}
			>
				<span className="rde-editor-items-item-icon">
					<Icon name={item.icon.name} prefix={item.icon.prefix} style={item.icon.style} />
				</span>
				{this.state.collapse ? null : <div className="rde-editor-items-item-text">{item.name}</div>}
			</div>
		);

	render() {
		const { descriptors, slides, onLoadSlide } = this.props;
		const { collapse, textSearch, filteredDescriptors, activeKey, svgModalVisible, svgOption } = this.state;
		const className = classnames('rde-editor-items', {
			minimize: collapse,
		});
		console.log("-------------slides------------", slides);
		const styles = {
			grid: {
				justifyContent: 'center',
				flexDirection: 'row',
				flexWrap: 'wrap',
				flex: 1,
				width: '100%'
			},
			gridItem: {
				margin:5,
				width: 150,
				height: 150,
				justifyContent: 'center',
				alignItems: 'center',
			},
			gridItemImage: {
				width: 100,
				height: 100,
				borderWidth: 1.5, 
				borderColor: 'white',
				borderRadius: 50,
			},
			gridItemText: {
				marginTop: 5,
				textAlign:'center',
			},
		};
		return (
			<div className={className}>
							{slides.map(slide=>{
								console.log(slide, "----------slide--------");
								return(
									<>
									
									<Tooltip title={this.props.tooltipTitle} placement={this.props.tooltipPlacement}>
									
											<span style={this.props.wrapperStyle} className={this.props.wrapperClassName}>
												<Button
													id={this.props.id}
													className={this.props.className}
													name={this.props.name}
													style={this.props.style}
													url={slide.url}
													shape={this.props.shape}
													size={this.props.size}
													onClick={this.props.onClick}
													type={this.props.type}
													disabled={this.props.disabled}
													loading={this.props.loading}
												>
													{this.props.icon ? (
														this.props.iconAnimation ? (
															<Icon
																name={this.props.icon}
																style={this.props.iconStyle}
																className={this.props.iconClassName}
																animation={this.props.iconAnimation}
															/>
														) : (
															<Icon
																name={this.props.icon}
																style={this.props.iconStyle}
																className={this.props.iconClassName}
															/>
														)
													) : null}
													{this.props.children}
												</Button>
											</span>
										
									</Tooltip>
								  </>
								)
							})}
			</div>
		);
	}
}

export default Slide;

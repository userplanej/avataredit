import React, { Component } from 'react';
import { fabric } from 'fabric';
import { v4 } from 'uuid';
import ResizeObserver from 'resize-observer-polyfill';

import Handler, { HandlerOptions } from './handlers/Handler';
import { FabricCanvas } from './utils';
import { defaults } from './constants';

import '../../styles/core/canvas.less';
import '../../styles/core/tooltip.less';
import '../../styles/core/contextmenu.less';
import '../../styles/fabricjs/fabricjs.less';

import { TextField, Box, Tabs, Tab } from '@mui/material';
import { TabStyle } from '../../components-site/GlobalStyles.d';

export type CanvasProps = HandlerOptions & {
	responsive?: boolean;
	style?: React.CSSProperties;
	ref?: React.RefAttributes<Handler>;
};

interface IState {
	id: string;
	loaded: boolean;
	activeTab: number;
}

class Canvas extends Component<CanvasProps, IState> {
	public handler: Handler;
	public canvas: FabricCanvas;
	public container = React.createRef<HTMLDivElement>();
	private resizeObserver: ResizeObserver;
	static defaultProps: CanvasProps = {
		id: v4(),
		editable: true,
		zoomEnabled: true,
		minZoom: 30,
		maxZoom: 300,
		responsive: true,
		width: 0,
		height: 0,
	};

	state: IState = {
		id: v4(),
		loaded: false,
		activeTab: 0
	};

	componentDidMount() {
		const { editable, canvasOption, width, height, responsive, ...other } = this.props;
		const { id } = this.state;
		const mergedCanvasOption = Object.assign({}, defaults.canvasOption, canvasOption, {
			width,
			height,
			selection: editable,
		});
		this.canvas = new fabric.Canvas(`canvas_${id}`, mergedCanvasOption);
		this.canvas.setBackgroundColor(mergedCanvasOption.backgroundColor, this.canvas.renderAll.bind(this.canvas));
		this.canvas.renderAll();
		this.handler = new Handler({
			id,
			width,
			height,
			editable,
			canvas: this.canvas,
			container: this.container.current,
			canvasOption: mergedCanvasOption,
			...other,
		});
		if (this.props.responsive) {
			this.createObserver();
		} else {
			this.handleLoad();
		}
	}

	componentDidUpdate(prevProps: CanvasProps) {
		if (this.props.width !== prevProps.width || this.props.height !== prevProps.height) {
			this.handler.eventHandler.resize(this.props.width, this.props.height);
		}
		if (this.props.editable !== prevProps.editable) {
			this.handler.editable = this.props.editable;
		}
		if (this.props.responsive !== prevProps.responsive) {
			if (!this.props.responsive) {
				this.destroyObserver();
			} else {
				this.destroyObserver();
				this.createObserver();
			}
		}
		if (JSON.stringify(this.props.canvasOption) !== JSON.stringify(prevProps.canvasOption)) {
			this.handler.setCanvasOption(this.props.canvasOption);
		}
		if (JSON.stringify(this.props.keyEvent) !== JSON.stringify(prevProps.keyEvent)) {
			this.handler.setKeyEvent(this.props.keyEvent);
		}
		if (JSON.stringify(this.props.fabricObjects) !== JSON.stringify(prevProps.fabricObjects)) {
			this.handler.setFabricObjects(this.props.fabricObjects);
		}
		if (JSON.stringify(this.props.workareaOption) !== JSON.stringify(prevProps.workareaOption)) {
			this.handler.setWorkareaOption(this.props.workareaOption);
		}
		if (JSON.stringify(this.props.guidelineOption) !== JSON.stringify(prevProps.guidelineOption)) {
			this.handler.setGuidelineOption(this.props.guidelineOption);
		}
		if (JSON.stringify(this.props.objectOption) !== JSON.stringify(prevProps.objectOption)) {
			this.handler.setObjectOption(this.props.objectOption);
		}
		if (JSON.stringify(this.props.gridOption) !== JSON.stringify(prevProps.gridOption)) {
			this.handler.setGridOption(this.props.gridOption);
		}
		if (JSON.stringify(this.props.propertiesToInclude) !== JSON.stringify(prevProps.propertiesToInclude)) {
			this.handler.setPropertiesToInclude(this.props.propertiesToInclude);
		}
		if (JSON.stringify(this.props.activeSelectionOption) !== JSON.stringify(prevProps.activeSelectionOption)) {
			this.handler.setActiveSelectionOption(this.props.activeSelectionOption);
		}
	}

	componentWillUnmount() {
		this.destroyObserver();
		this.handler.destroy();
	}

	createObserver = () => {
		this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
			const { width = 0, height = 0 } = (entries[0] && entries[0].contentRect) || {};
			this.handler.eventHandler.resize(width, height);
			if (!this.state.loaded) {
				this.handleLoad();
			}
		});
		this.resizeObserver.observe(this.container.current);
	};

	destroyObserver = () => {
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}
	};

	handleLoad = () => {
		this.setState(
			{
				loaded: true,
			},
			() => {
				if (this.props.onLoad) {
					this.props.onLoad(this.handler, this.canvas);
				}
			},
		);
	};

	handleChangeTab = (_event: any, value: number) => {
		this.setState({ activeTab: value });
	}

	render() {
		const { style } = this.props;
		const { id, activeTab } = this.state;
		return (
			<div
				ref={this.container}
				id={id}
				className="rde-canvas"
				style={{ height: '450px', ...style }}
			>
				<canvas id={`canvas_${id}`} />
				
				<Box sx={{ mt: '16px', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
					<Box sx={{ borderBottom: 1, borderColor: 'divider', width: '90%' }}>
						<Tabs value={activeTab} onChange={this.handleChangeTab} aria-label="basic tabs example" sx={TabStyle}>
							<Tab label="Type your script" id="simple-tab-1" />
							<Tab label="Upload your voice" id="simple-tab-2" />
						</Tabs>
					</Box>
					<div
						role="tabpanel"
						hidden={activeTab !== 0}
						id={`vertical-tabpanel-${0}`}
						aria-labelledby={`vertical-tab-${0}`}
						style={{ width: '90%', backgroundColor: '#e8dff4' }}
					>
						{activeTab === 0 && (
							<Box sx={{ p: 3, width: '100%' }}>
								<TextField
									id="filled-multiline-flexible"
									multiline
									minRows={8}
									maxRows={8}
									// value={value}
									// onChange={handleChange}
									variant="filled"
									sx={{ width: "100%", backgroundColor: '#fff' }}
								/>
							</Box>
						)}
					</div>
					<div
						role="tabpanel"
						hidden={activeTab !== 1}
						id={`vertical-tabpanel-${1}`}
						aria-labelledby={`vertical-tab-${1}`}
					>
						{activeTab === 1 && (
							<Box sx={{ p: 3, width: '100%' }}>
							</Box>
						)}
					</div>
				</Box>
			</div>
		);
	}
}

export default Canvas;

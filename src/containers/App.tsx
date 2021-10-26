import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import axios from "axios";
import ImageMapEditor from '../components/imagemap/ImageMapEditor';
import WorkflowEditor from '../components/workflow/WorkflowEditor';
import Title from './Title';
import FlowEditor from '../components/flow/FlowEditor';
import FlowContainer from './FlowContainer';
import HexGrid from '../components/hexgrid/HexGrid';
import { VideoStudioEditor } from '../components/video-studio/VideoStudioEditor';
import { QueryClient, QueryClientProvider } from 'react-query';
import Authentication from './Authentication';
import Main from '../components-site/Main';
// import { Config } from '../../config';
const queryClient = new QueryClient();

type EditorType = 'imagemap' | 'workflow' | 'flow' | 'hexgrid' | 'videoStudio';

interface IState {
	activeEditor?: EditorType;
}

class App extends Component<any, IState> {
	state: IState = {
		activeEditor: 'imagemap',
	};

	onChangeMenu = ({ key }) => {
		this.setState({
			activeEditor: key,
		});
	};

	renderEditor = (activeEditor: EditorType) => {
		switch (activeEditor) {
			case 'imagemap':
				return <ImageMapEditor />;
			case 'workflow':
				return <WorkflowEditor />;
			case 'flow':
				return <FlowEditor />;
			case 'hexgrid':
				return <HexGrid />;
			case 'videoStudio':
				return <VideoStudioEditor />;
		}
	};

	render() {
		const { activeEditor } = this.state;
		return (
			<div className="rde-main" style={{height: '100%'}}>
				<Helmet>
					<meta charSet="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta
						name="description"
						content="React Design Editor has started to developed direct manipulation of editable design tools like Powerpoint, We've developed it with react.js, ant.design, fabric.js "
					/>
					<link rel="manifest" href="./manifest.json" />
					<link rel="shortcut icon" href="./favicon.ico" />
					<link rel="stylesheet" href="https://fonts.googleapis.com/earlyaccess/notosanskr.css" />
					<title>주식회사 럭스피엠</title>
					<script async={true} src="https://www.googletagmanager.com/gtag/js?id=UA-97485289-3" />
					<script>
						{`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'UA-97485289-3');
                        `}
					</script>
					<script async={true} src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" />
				</Helmet>
				{/* <div className="rde-title">
					<Title onChangeMenu={this.onChangeMenu} current={activeEditor} />
				</div> */}
				<FlowContainer>
					<QueryClientProvider client={queryClient}>
						<div className="rde-content" style={{height: '100%'}}><Main /></div>
					</QueryClientProvider>
				</FlowContainer>
			</div>
		);
	}
}

export default App;

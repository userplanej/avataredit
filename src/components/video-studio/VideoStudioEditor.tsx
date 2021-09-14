import { Input, Tabs, Typography } from 'antd';
import * as React from 'react';
import { Container } from '../common';
import Icon from '../icon/Icon';
import { ActorConfiguration } from './configuration/ActorConfiguration';
import { defaultImagePlaceholder } from './imagePlaceholder';
import { VideoStudioTitle } from './VideoStudioTitle';

// FIXME get all actors from the backend
const ACTORS = ['Anna', 'Tom', 'Mia', 'Jack', 'Rose'];

type VideoStudioEditorProps = React.PropsWithChildren<{}>;

export function VideoStudioEditor(props: VideoStudioEditorProps) {
	const [activeActor, setActiveActor] = React.useState(ACTORS[0]);

	return (
		<Container title={<VideoStudioTitle />} className="">
			<div className="rde-editor">
				<div className="rde-editor-video-preview">
					<div className="rde-editor-video-holder">
						<video width={320} height={180} poster={defaultImagePlaceholder}></video>
					</div>
					<div className="rde-editor-script-holder">
						<Typography.Title level={4} style={{ fontSize: 12 }}>
							Video Script
						</Typography.Title>
						<Input.TextArea
							placeholder="Type your script..."
							rows={5}
							style={{ backgroundColor: '#fff' }}
						/>
					</div>
				</div>
				<div className="rde-editor-configurations">
					<Tabs tabPosition="right" style={{ height: '100%' }} activeKey="actor">
						<Tabs.TabPane tab={<Icon name="user" />} key="actor">
							<ActorConfiguration
								actors={ACTORS}
								activeActor={activeActor}
								onActorSelect={setActiveActor}
							/>
						</Tabs.TabPane>
					</Tabs>
				</div>
			</div>
		</Container>
	);
}

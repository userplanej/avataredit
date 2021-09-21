import { Input, Tabs, Typography } from 'antd';
import * as React from 'react';
import { Actor } from '../../types/Actor';
import { Container } from '../common';
import Icon from '../icon/Icon';
import { VideoConfiguration } from './configuration/VideoConfiguration';
import { defaultImagePlaceholder } from './data/imagePlaceholder';
import { VideoStudioTitle } from './VideoStudioTitle';

type VideoStudioEditorProps = React.PropsWithChildren<{}>;

export function VideoStudioEditor(props: VideoStudioEditorProps) {
	const [actors, setActors] = React.useState<Actor[]>(undefined);
	React.useEffect(() => {
		fetch('/api/actors')
			.then(res => res.json())
			.then(({ actors }) => setActors(actors));
	}, []);

	if (!actors) {
		return <div>loading ...</div>;
	}

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
							<VideoConfiguration actors={actors} />
						</Tabs.TabPane>
					</Tabs>
				</div>
			</div>
		</Container>
	);
}

import { Tabs } from 'antd';
import * as React from 'react';
import { Container } from '../common';
import Icon from '../icon/Icon';
import { VideoStudioTitle } from './VideoStudioTitle';

type VideoStudioEditorProps = React.PropsWithChildren<{}>;

export function VideoStudioEditor(props: VideoStudioEditorProps) {
	return (
		<Container title={<VideoStudioTitle />} className="">
			<div className="rde-editor">
				<div style={{ flex: 1 }}>
					<div>Video Player</div>
					<div>Type your script</div>
				</div>
				<div className="rde-editor-configurations">
					<Tabs tabPosition="right" style={{ height: '100%' }} activeKey="actor" onChange={() => undefined}>
						<Tabs.TabPane tab={<Icon name="user" />} key="actor">
							<span>Select actor, size and alignment</span>
						</Tabs.TabPane>
					</Tabs>
				</div>
			</div>
		</Container>
	);
}

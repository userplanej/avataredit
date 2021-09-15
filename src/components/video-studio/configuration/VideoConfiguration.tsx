import { Collapse } from 'antd';
import * as React from 'react';
import { ActorConfiguration } from './ActorConfiguration';
import { BackgroundVideoConfiguration } from './BackgroundVideoConfiguration';

// FIXME get all actors from the backend
const ACTORS = ['Anna', 'Tom', 'Mia', 'Jack', 'Rose'];

type VideoConfigurationProps = React.PropsWithChildren<{}>;

export function VideoConfiguration(props: VideoConfigurationProps) {
	const [activeActor, setActiveActor] = React.useState(ACTORS[0]);
	return (
		<Collapse className="rde-editor-video-collapse" bordered={false} defaultActiveKey={['1', '2']}>
			<Collapse.Panel header="Select actor, size and alignment" key="1">
				<ActorConfiguration actors={ACTORS} activeActor={activeActor} onActorSelect={setActiveActor} />
			</Collapse.Panel>
			<Collapse.Panel header="Select Background" key="2">
				<BackgroundVideoConfiguration />
			</Collapse.Panel>
		</Collapse>
	);
}

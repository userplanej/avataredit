import { Collapse } from 'antd';
import * as React from 'react';
import { Actor } from '../../../types/Actor';
import { ActorConfiguration } from './ActorConfiguration';
import { BackgroundVideoConfiguration } from './BackgroundVideoConfiguration';

type VideoConfigurationProps = React.PropsWithChildren<{
	actors: Actor[];
}>;

export function VideoConfiguration(props: VideoConfigurationProps) {
	const { actors } = props;
	const [activeActor, setActiveActor] = React.useState<Actor>(actors[0]);

	const handleActorSelect = (id: string) => {
		const actor = actors.find(actor => actor.id === id);
		setActiveActor(actor);
	};

	return (
		<Collapse className="rde-editor-video-collapse" bordered={false} defaultActiveKey={['1', '2']}>
			<Collapse.Panel header="Select actor, size and alignment" key="1">
				<ActorConfiguration actors={actors} activeActor={activeActor} onActorSelect={handleActorSelect} />
			</Collapse.Panel>
			<Collapse.Panel header="Select Background" key="2">
				<BackgroundVideoConfiguration />
			</Collapse.Panel>
		</Collapse>
	);
}

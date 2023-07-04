import { Radio } from 'antd';
import * as React from 'react';
import { Actor } from '../../../types/Actor';
import { defaultImagePlaceholder } from '../data/imagePlaceholder';
import { SelectableImageCard } from './SelectableImageCard';

type ActorConfigurationProps = React.PropsWithChildren<{
	actors: Actor[];
	activeActor: Actor;
	onActorSelect: (id: string) => void;
}>;

export function ActorConfiguration(props: ActorConfigurationProps) {
	const { actors, activeActor, onActorSelect } = props;
	return (
		<React.Fragment>
			<div className="rde-editor-image-tile-holder">
				{actors.map(actor => (
					<div key={actor.id}>
						<SelectableImageCard
							name={actor.name}
							src={actor.thumbnailMediumUrl}
							isActive={actor.id === activeActor.id}
							onClick={() => onActorSelect(actor.id)}
						/>
					</div>
				))}
			</div>

			<div className="rde-editor-configurations-alignment-holder">
				<Radio.Group defaultValue="center" buttonStyle="solid" style={{ marginTop: 16 }}>
					<Radio.Button value="left">Left</Radio.Button>
					<Radio.Button value="center">Center</Radio.Button>
					<Radio.Button value="right">Right</Radio.Button>
				</Radio.Group>
			</div>
		</React.Fragment>
	);
}

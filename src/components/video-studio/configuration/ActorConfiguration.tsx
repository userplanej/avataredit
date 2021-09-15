import { Radio } from 'antd';
import * as React from 'react';
import { defaultImagePlaceholder } from '../data/imagePlaceholder';
import { SelectableImageCard } from './SelectableImageCard';

type ActorConfigurationProps = React.PropsWithChildren<{
	actors: string[];
	activeActor: string;
	onActorSelect: (actor: string) => void;
}>;

export function ActorConfiguration(props: ActorConfigurationProps) {
	const { actors, activeActor, onActorSelect } = props;
	return (
		<React.Fragment>
			<div className="rde-editor-image-tile-holder">
				{actors.map(name => (
					<div key={name}>
						<SelectableImageCard
							name={name}
							src={defaultImagePlaceholder}
							isActive={name === activeActor}
							onClick={() => onActorSelect(name)}
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

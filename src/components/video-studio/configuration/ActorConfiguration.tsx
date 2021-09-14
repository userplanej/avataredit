import { Card, Col, Radio, Row, Typography } from 'antd';
import classnames from 'classnames';
import * as React from 'react';
import { defaultImagePlaceholder } from '../imagePlaceholder';

type ActorConfigurationProps = React.PropsWithChildren<{
	actors: string[];
	activeActor: string;
	onActorSelect: (actor: string) => void;
}>;

export function ActorConfiguration(props: ActorConfigurationProps) {
	const { actors, activeActor, onActorSelect } = props;
	return (
		<React.Fragment>
			<Typography.Title level={4} style={{ fontSize: 14, margin: 8 }}>
				Select actor, size and alignment
			</Typography.Title>
			<Row style={{ padding: '0 8px 8px' }}>
				{actors.map(name => (
					<Col xs={8} style={{ marginBottom: 8 }}>
						<Card
							key={name}
							size="small"
							hoverable
							bordered
							style={{ width: 100 }}
							onClick={() => onActorSelect(name)}
							className={classnames({
								'rde-editor-configurations-active-actor': name === activeActor,
							})}
							cover={<img alt="example" width={100} height={900 / 16} src={defaultImagePlaceholder} />}
						>
							<Card.Meta description={name} />
						</Card>
					</Col>
				))}
			</Row>
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

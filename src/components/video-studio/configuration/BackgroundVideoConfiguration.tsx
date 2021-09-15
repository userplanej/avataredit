import { Tabs } from 'antd';
import * as React from 'react';
import { defaultImagePlaceholder } from '../data/imagePlaceholder';
import { SelectableImageCard } from './SelectableImageCard';

const SOLID_COLORS = [
	{ name: 'Green screen', color: '#00b140' },
	{ name: 'Off-white', color: '#f5f5f5' },
	{ name: 'Warm white', color: '#fdf4dc' },
	{ name: 'Light pink', color: '#ffb6c1' },
	{ name: 'Soft pink', color: '#fadadd' },
	{ name: 'Light blue', color: '#add8e6' },
	{ name: 'Dark blue', color: '#00008b' },
	{ name: 'Soft cyan', color: '#b2f3f3' },
];
const SAMPLE_IMAGES = ['White Studio', 'White cafe', 'Luxury lobby', 'Large window', 'Meeting room', 'Open office'];

type BackgroundVideoConfigurationProps = React.PropsWithChildren<{}>;

export function BackgroundVideoConfiguration(props: BackgroundVideoConfigurationProps) {
	const [activeSolidColor, setActiveSolidColor] = React.useState(SOLID_COLORS[0]);
	const [activeSampleImage, setActiveSampleImage] = React.useState(SAMPLE_IMAGES[0]);
	return (
		<React.Fragment>
			<Tabs defaultActiveKey="solid" size="small">
				<Tabs.TabPane tab="solid" key="solid" style={{ marginTop: 16 }}>
					<div className="rde-editor-image-tile-holder">
						{SOLID_COLORS.map(({ name, color }) => (
							<div key={color}>
								<SelectableImageCard
									name={name}
									backgroundColor={color}
									isActive={color === activeSolidColor.color}
									onClick={colorName => {
										setActiveSolidColor(SOLID_COLORS.find(({ name }) => name === colorName));
									}}
								/>
							</div>
						))}
					</div>
				</Tabs.TabPane>
				<Tabs.TabPane tab="image" key="image" style={{ marginTop: 16 }}>
					<div className="rde-editor-image-tile-holder">
						{SAMPLE_IMAGES.map(name => (
							<div key={name}>
								<SelectableImageCard
									name={name}
									src={defaultImagePlaceholder}
									isActive={name === activeSampleImage}
									onClick={name => {
										setActiveSampleImage(name);
									}}
								/>
							</div>
						))}
					</div>
				</Tabs.TabPane>
				<Tabs.TabPane tab="custom" key="custom" style={{ marginTop: 16 }}></Tabs.TabPane>
			</Tabs>
		</React.Fragment>
	);
}

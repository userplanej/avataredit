import { Collapse } from 'antd';
import * as React from 'react';
import { SlideFrame } from '../../../types/SlideFrame';
import { ImageClip } from './ImageClip';
import { BackgroundVideoConfiguration } from './BackgroundVideoConfiguration';

type SlideProps = React.PropsWithChildren<{
	slides: SlideFrame[];
}>;

export function SlideConfiguration(props: SlideProps) {
	const { slides } = props;
	const [activeSlide, setActiveSlide] = React.useState<SlideFrame>(slides[0]);

	const handleSlideSelect = (id: string) => {
		const slide = slides.find(slide => slide.id === id);
		setActiveSlide(slide);
	};

	return (
		<Collapse className="rde-editor-video-collapse" bordered={false} defaultActiveKey={['1', '2']}>
			<Collapse.Panel header="Select actor, size and alignment" key="1">
				<ImageClip 
				slides={slides} 
				activeSlide={activeSlide} 
				onSlideSelect={handleSlideSelect} 
				/>
				
			</Collapse.Panel>

		</Collapse>
	);
}

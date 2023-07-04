import { Radio } from 'antd';
import * as React from 'react';
import { SlideFrame } from '../../../types/SlideFrame';
import { defaultImagePlaceholder } from '../data/imagePlaceholder';
import { SelectableSlide } from './SelectableSlide';

type ImageClipProps = React.PropsWithChildren<{
	slides: SlideFrame[];
	activeSlide: SlideFrame;
	onSlideSelect: (id: string) => void;
}>;

export function ImageClip(props: ImageClipProps) {
	const { slides, activeSlide, onSlideSelect } = props;
	return (
		<React.Fragment>
			<div className="rde-editor-image-tile-holder">
				{slides.map(slide => (
					<div key={slide.id}>
						<SelectableSlide
							name={slide.name}
							src={slide.thumbnailMediumUrl}
							isActive={slide.id === activeSlide.id}
							onClick={() => onSlideSelect(slide.id)}
						/>
					</div>
				))}
			</div>
		</React.Fragment>
	);
}

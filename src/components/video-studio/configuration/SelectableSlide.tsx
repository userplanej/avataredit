import { Card } from 'antd';
import classnames from 'classnames';
import * as React from 'react';

type SelectableSlideProps = React.PropsWithChildren<{
	src?: string;
	backgroundColor?: string;
	name: string;
	isActive: boolean;
	onClick: (name: string) => void;
}>;

export function SelectableSlide(props: SelectableSlideProps) {
	const { src, backgroundColor, name, isActive, onClick } = props;

	let cover: JSX.Element = null;
	if (src) {
		cover = <img alt="" src={src} className="rde-editor-configurations-image-cover" />;
	} else if (backgroundColor) {
		cover = <div className="rde-editor-configurations-image-cover" style={{ backgroundColor }} />;
	}

	return (
		<Card
			hoverable
			bordered
			style={{ width: 100 }}
			bodyStyle={{ padding: '4px 0' }}
			onClick={() => onClick(name)}
			className={classnames({
				'rde-editor-configurations-active-image-card': isActive,
			})}
			cover={cover}
		>
			<Card.Meta description={name} style={{ fontSize: 12 }} />
		</Card>
	);
}

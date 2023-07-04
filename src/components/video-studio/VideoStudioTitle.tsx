import i18n from 'i18next';
import * as React from 'react';
import { Flex } from '../flex';

type VideoStudioTitleProps = React.PropsWithChildren<{
	action?: React.ReactNode;
}>;

export function VideoStudioTitle(props: VideoStudioTitleProps) {
	const { action } = props;

	return (
		<Flex className="rde-content-layout-title" alignItems="center" flexWrap="wrap">
			<Flex.Item>
				<Flex className="rde-content-layout-title-title" justifyContent="flex-start" alignItems="center">
					{i18n.t('videoStudio.videoStudio-editor')}
				</Flex>
			</Flex.Item>
			<Flex.Item flex="auto">
				<Flex className="rde-content-layout-title-action" justifyContent="flex-end" alignItems="center">
					{action}
				</Flex>
			</Flex.Item>
		</Flex>
	);
}

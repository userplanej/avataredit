export type Actor = {
	id: string;
	name: string;
	gender: Gender;
	description?: string;
	createdAt: number;
	updatedAt: number;
	alignment: {
		center: { horizontalOffset: number; scalePivotX: number };
		circular: { horizontalOffset: number; radius: number; scalePivotX: number; scalePivotY: number };
		left: { horizontalOffset: number; scalePivotX: number };
		rectangular: {
			height: number;
			width: number;
			horizontalOffset: number;
			scalePivotX: number;
			scalePivotY: number;
		};
		right: { horizontalOffset: number; scalePivotX: number };
	};
	previews: {
		de: string;
		en: string;
		es: string;
		fr: string;
		it: string;
	};
	thumbnailMediumUrl: string;
	thumbnailSilhouetteUrl: string;
	thumbnailUrl: string;
};

export type Gender = 'm' | 'f';

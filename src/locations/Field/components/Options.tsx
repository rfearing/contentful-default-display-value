import { Menu } from '@contentful/f36-components';
import { FieldAppSDK, ContentType, Entry } from '@contentful/app-sdk';

type OptionsProps = {
	contentTypes: ContentType[];
	sdk: FieldAppSDK;
	locale: string;
	entries: Entry[];
	onCreate: (contentType: ContentType) => void;
}

const Options = ({
	contentTypes,
	sdk,
	locale,
	entries,
	onCreate,
}: OptionsProps) => {
	return (
		<Menu.List>
			<Menu.SectionTitle>Add existing content</Menu.SectionTitle>

			{/* TODO: Check if adding existing is permitted */}
			{/* TODO: Save selecting existing */}
			{contentTypes.map(contentType => (
				<Menu.Item
				key={contentType.sys.id + 'old'}
				onClick={() => sdk.dialogs.selectSingleEntry({contentTypes: [contentType.sys.id]})}
				>
					{contentType.name}
				</Menu.Item>
			))}

			<Menu.Divider />
			<Menu.SectionTitle>Add new content</Menu.SectionTitle>

			{/* Todo: Check if adding new is permitted */}
			{contentTypes.map(contentType => (
				<Menu.Item
					key={contentType.sys.id + 'new'}
					onClick={() => { onCreate(contentType) } }
				>
				{contentType.name}
				</Menu.Item>
			))}
		</Menu.List>
	)
}


export default Options
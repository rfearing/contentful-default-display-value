import { Menu } from '@contentful/f36-components';
import { FieldAppSDK, ContentType, Entry } from '@contentful/app-sdk';
import { createEntry, attachEntry } from '../../../helpers'

type OptionsProps = {
	contentTypes: ContentType[];
	sdk: FieldAppSDK;
	locale: string;
	entries: Entry[];
}

const Options = ({
	contentTypes,
	sdk,
	locale,
	entries,
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
					onClick={() => {
						// `title` would be "Page Title::Section" if:
						// - current content type is `Page`
						// - the display field value is set to "Page Title"
						// - the linked content type is `Section`
						const title = `${String(sdk.entry.fields[sdk.contentType.displayField].getValue())}::${contentType.name}`;
						createEntry({
							sdk,
							typeId: contentType.sys.id,
							key: contentType.displayField,
							value: { [locale]: title }
					}).then(entity => attachEntry({sdk, entity, entries, locale}));
					}}
				>
				{contentType.name}
				</Menu.Item>
			))}
		</Menu.List>
	)
}


export default Options
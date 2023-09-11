import { Menu } from '@contentful/f36-components';
import { ContentType } from '@contentful/app-sdk';

type OptionsProps = {
	contentTypes: ContentType[];
	onAdd: (contentType: string) => void;
	onCreate: (contentType: ContentType) => void;
}

const Options = ({
	contentTypes,
	onAdd,
	onCreate,
}: OptionsProps) => {
	return (
		<Menu.List>
			<Menu.SectionTitle>Add existing content</Menu.SectionTitle>

			{/* TODO: Check if adding existing is permitted */}
			{contentTypes.map(contentType => (
				<Menu.Item
					key={contentType.sys.id + 'old'}
					onClick={() => onAdd(contentType.sys.id)}
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
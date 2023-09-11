/* eslint-disable react-hooks/exhaustive-deps */
import { EntryCard, MenuItem } from '@contentful/f36-components';
import { ContentType, Entry, FieldAppSDK } from '@contentful/app-sdk';
import { css } from 'emotion';
import { status } from '../../../helpers'

type EntriesProps = {
	sdk: FieldAppSDK;
	entries: Entry[];
	types: ContentType[];
	locale: string;
	onRemove: (entry: Entry) => void;
}

/**
 * Displays a list of entries
 */
const Entries = ({entries, types, locale, onRemove, sdk}: EntriesProps) => {
	return entries.map(entry => {
		const contentType = types.find(contentType => contentType.sys.id === entry.sys.contentType.sys.id);
		if (!contentType) {
			return null;
		}

		return (
			<EntryCard
				className={css`margin-bottom: 1rem;`}
				key={entry.sys.id + 'entry'}
				status={status(entry)}
				contentType={contentType.name}
				title={entry.fields[contentType.displayField][locale]}
				onClick={() => sdk.navigator.openEntry(entry.sys.id, { slideIn: true })}
				actions={[
					<MenuItem key="remove" onClick={() => onRemove(entry)}>
						Remove
					</MenuItem>,
				]}
			/>
		)
	})
};

export default Entries;

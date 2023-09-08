/* eslint-disable react-hooks/exhaustive-deps */
import { EntryCard } from '@contentful/f36-components';
import { ContentType, Entry } from '@contentful/app-sdk';
import { css } from 'emotion';
import { status } from '../../../helpers'

type EntriesProps = {
	entries: Entry[];
	types: ContentType[];
	locale: string;
}

/* TODO: Remove card */
const Entries = ({entries, types, locale}: EntriesProps) => {
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
			/>
		)
	})
};

export default Entries;

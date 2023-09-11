import { Entry, FieldAppSDK } from '@contentful/app-sdk';

export type Locale = {[key: string]: string}

export function isChanged(entity: Entry) {
  return !!entity.sys.publishedVersion &&
    entity.sys.version >= entity.sys.publishedVersion + 2
}

export function isPublished(entity: Entry) {
  return !!entity.sys.publishedVersion &&
    entity.sys.version === entity.sys.publishedVersion + 1
}

export function isArchived(entity: Entry) {
  return !!entity.sys.archivedVersion
}

export function isDraft(entity: Entry) {
  return !entity.sys.publishedVersion
}

export function status(entity: Entry) {
	if (isChanged(entity)) {
		return 'changed'
	}
	if (isPublished(entity)) {
		return 'published'
	}
	if (isArchived(entity)) {
		return 'archived'
	}
	return 'draft'
}

type CreateEntry = {
	sdk: FieldAppSDK;
	typeId: string;
	key: string;
	value: Locale;
}

export async function createEntry({sdk, typeId, key, value}: CreateEntry) {
	return sdk.cma.entry.create({
		spaceId: sdk.ids.space,
		environmentId: sdk.ids.environment,
		contentTypeId: typeId,
	}, {
		fields: {
			[key]: value
		}
	});
};

type SetEntry = {
	sdk: FieldAppSDK;
	entity: Entry;
	entries: Entry[];
	locale: string;
}

export async function attachEntry({ sdk, entity, entries, locale }: SetEntry) {
	const updatedEntries = [...entries, entity].map(entry => ({
		sys: {
			type: "Link",
			linkType: "Entry",
			id: entry.sys.id,
		}
	}))
	await sdk.entry.fields[sdk.field.id].setValue(updatedEntries, locale);
	sdk.navigator.openEntry(entity.sys.id, { slideIn: true });

	return [...entries, entity];
};

/* Remove an entity and return the new list */
export async function removeEntry({ sdk, entity, entries, locale }: SetEntry) {
	const remaining = entries.filter((entry: Entry)=> entry.sys.id !== entity.sys.id)
	const updatedEntries = remaining.map(entry => ({
		sys: {
			type: "Link",
			linkType: "Entry",
			id: entry.sys.id,
		}
	}))
	await sdk.entry.fields[sdk.field.id].setValue(updatedEntries, locale)

	return remaining;
}

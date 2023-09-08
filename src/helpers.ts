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

type AttachEntry = {
	sdk: FieldAppSDK;
	entity: Entry;
	entries: Entry[];
	locale: string;
}

export function attachEntry({ sdk, entity, entries, locale }: AttachEntry) {
	sdk.entry.fields[sdk.field.id].setValue([
		...(entries.map(entry => entry.sys)),
		{
			sys: {
				type: "Link",
				linkType: "Entry",
				id: entity.sys.id,
			}
		}],
		locale
	);
	sdk.navigator.openEntry(entity.sys.id, { slideIn: true });
};
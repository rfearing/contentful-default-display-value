/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Button, Menu } from '@contentful/f36-components';
import { ChevronDownIcon } from '@contentful/f36-icons';
import { FieldAppSDK, ContentType, Entry } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { css } from 'emotion';
import Entries from './components/Entries';
import Options from './components/Options';
import { createEntry, removeEntry, attachEntry } from '../../helpers';

const buttonStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  const locale = sdk.locales.default;
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  sdk.window.startAutoResizer();

  // Fetch the content types so that we can display the names, e.g. "Add new {content type name}"
  useEffect(() => {
    // linkValidations: Top level validations
    const linkValidations = sdk.field.validations
    // itemsValidations: Validations if the field is an array (select multiple entries)
    const itemsValidations = (sdk.field.type === 'Array') && sdk.field.items.validations ? sdk.field.items.validations  : []
    const validations = [...itemsValidations, ...linkValidations]
    // modelRestrictions: Array of permitted content model IDs (empty array if no restrictions)
    const modelRestrictions: string[] = validations.flatMap(validation => validation?.linkContentType ?? []);

    (async () => {
      const contentTypes = await Promise.all(modelRestrictions.map(id => sdk.cma.contentType.get(({contentTypeId:id}))))
      setContentTypes(contentTypes);
    })();
  }, []);

  // Fetch current linked entries
  useEffect(() => {
    const previousEntries: Entry[] = sdk.entry.fields[sdk.field.id].getValue() || [];
    (async () => {
      if (previousEntries.length > 0) {
        const entryObjects = await Promise.all(previousEntries.map(entry => {
          return sdk.cma.entry.get({entryId: entry.sys.id}) || [];
        }))
        setEntries(entryObjects);
      }
    })();
  }, []);

  // Add new entries
  const onCreate = (contentType: ContentType) => {
    // `title` would be "Page Title::Section" if:
    // - current content type is `Page`
    // - the display field value is set to "Page Title"
    // - the linked content type is `Section`
    const title = `${String(sdk.entry.fields[sdk.contentType.displayField].getValue())}::${contentType.name} #${entries.length + 1}`;
    createEntry({
      sdk,
      typeId: contentType.sys.id,
      key: contentType.displayField,
      value: { [locale]: title }
    })
    // Attach new entry to the existing entries
    .then(async entity => {
      const updatedEntries = await attachEntry({sdk, entity, entries, locale})
      setEntries(updatedEntries)
    })
  }

  // Remove entries
  const onRemove = async (entry: Entry) => {
    const updatedEntries = await removeEntry({sdk, entity: entry, entries, locale})
    setEntries(updatedEntries);
  }

  return (
    <>
      {/* Existing entries */}
      <Entries types={contentTypes} entries={entries} locale={locale} onRemove={onRemove} />

      {contentTypes.length === 0 && (
        <Button onClick={() => sdk.dialogs.selectSingleEntry()}>
          Add existing content
        </Button>
      )}

      {contentTypes.length > 0 && (
        <Menu>
          <Menu.Trigger>
            <Button>
              <span className={buttonStyles}>
                Add content&nbsp;&nbsp;
                <ChevronDownIcon variant="secondary" size="tiny" />
              </span>
            </Button>
          </Menu.Trigger>

          <Options
            contentTypes={contentTypes}
            sdk={sdk}
            locale={locale}
            entries={entries}
            onCreate={onCreate}
          />
        </Menu>
      )}
    </>
  )
};

export default Field;

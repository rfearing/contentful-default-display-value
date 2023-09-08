import { useState, useEffect } from 'react';
import { Button, Menu } from '@contentful/f36-components';
import { ChevronDownIcon } from '@contentful/f36-icons';
import { FieldAppSDK, ContentType } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { css } from 'emotion';

type locale = {[key: string]: string}

const buttonStyles = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();

  // linkValidations: Top level validations
  const linkValidations = sdk.field.validations
  // itemsValidations: Validations if the field is an array (select multiple entries)
  const itemsValidations = (sdk.field.type === 'Array') && sdk.field.items.validations ? sdk.field.items.validations  : []
  const validations = [...itemsValidations, ...linkValidations]
  // modelRestrictions: Array of permitted content model IDs (empty array if no restrictions)
  const modelRestrictions: string[] = validations.flatMap(validation => validation?.linkContentType ?? []);

  // Fetch the content types so that we can display the names, e.g. "Add new {content type name}"
  const [contentTypes, setContentTypes] = useState<ContentType[]>([]);
  useEffect(() => {
    const fetchContentTypes = async () => {
      const contentTypes = await Promise.all(modelRestrictions.map(id => sdk.cma.contentType.get(({contentTypeId:id}))))
      setContentTypes(contentTypes);
    };
    fetchContentTypes();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // We cannot open a new entry dialog with a dynamic default value 🫤 so we need to create the entry first
  const createEntry = async (contentTypeId: string, key: string, value: locale) => {
    return sdk.cma.entry.create({
      spaceId: sdk.ids.space,
      environmentId: sdk.ids.environment,
      contentTypeId,
    }, {
      fields: {
        [key]: value
      }
    });
  };

  if (contentTypes.length === 0) {
    return (
      <Button onClick={() => sdk.dialogs.selectSingleEntry()}>
        Add existing content
      </Button>
    )
  }

  return (
    <Menu>
      <Menu.Trigger>
        <Button>
          <span className={buttonStyles}>
            Add content&nbsp;&nbsp;
            <ChevronDownIcon variant="secondary" size="tiny" />
          </span>
        </Button>
      </Menu.Trigger>

      {/* TODO: Add size validation */}
      {/* TODO: Show entities in field */}
      <Menu.List>
        <Menu.SectionTitle>Add existing content</Menu.SectionTitle>

        {contentTypes.map(contentType => (
          <Menu.Item onClick={() => sdk.dialogs.selectSingleEntry({contentTypes: [contentType.sys.id]})}>
            {contentType.name}
          </Menu.Item>
        ))}

        <Menu.Divider />
        <Menu.SectionTitle>Add new content</Menu.SectionTitle>

        {/* Todo: Add new content and ensure that adding new is allowed */}
        {contentTypes.map(contentType => (
          <Menu.Item onClick={() => {
            // `title` would be "Page Title::Section" if:
            // - current content type is `Page`
            // - the display field value is set to "Page Title"
            // - the linked content type is `Section`
            const title = `${String(sdk.entry.fields[sdk.contentType.displayField].getValue())}::${contentType.name}`;
            const locale = sdk.locales.default;

            createEntry(contentType.sys.id, contentType.displayField, { [locale]: title })
              .then(entity => {
                sdk.navigator.openEntry(entity.sys.id, { slideIn: true });
              });
            }
          }>
           {contentType.name}
          </Menu.Item>
        ))}
      </Menu.List>
    </Menu>
  )
};

export default Field;

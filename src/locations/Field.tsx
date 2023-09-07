import React, { useState } from 'react';
import { Button, Menu } from '@contentful/f36-components';
import { PlusIcon } from '@contentful/f36-icons';
import { FieldAppSDK } from '@contentful/app-sdk';
import { /* useCMA, */ useSDK } from '@contentful/react-apps-toolkit';
// import { ContentTypeFieldValidation } from 'contentful-management'


const Field = () => {
  const sdk = useSDK<FieldAppSDK>();

  const itemsValidations = (sdk.field.type === 'Array') && sdk.field.items.validations ? sdk.field.items.validations  : []
  const linkValidations = sdk.field.validations
  const validations = [...itemsValidations, ...linkValidations]
  const allowedTypes: string[] = []
  // const allowedTypeNames: string[] = []

  if (validations && validations.length > 0) {
    validations.forEach(validation => {
      if (validation?.linkContentType) {
        validation.linkContentType.forEach(type => {
          allowedTypes.push(String(type))
          // allowedTypeName.push(/*..*/)
        })
      }
    })
  }

  const availableTypes = allowedTypes.length > 0 ? { contentTypes: allowedTypes } : {}

  console.log({name: sdk.field.name, all: sdk.field, validations, availableTypes})

  return (
    <Menu>
      <Menu.Trigger>
        <Button>
          <PlusIcon variant="secondary" size="tiny" />
          Add content
        </Button>
      </Menu.Trigger>

      <Menu.List>
        {/* TODO: Add size validation */}
        <Menu.Item onClick={() => sdk.dialogs.selectSingleEntry(availableTypes)}>
          Add existing content
        </Menu.Item>
        {/* TODO: Maybe add map of allowedTypes to Add {type} */}

        <Menu.Divider />

        {/* Todo: Add new content and ensure that adding new is allowed */}
        <Menu.SectionTitle>Add new content</Menu.SectionTitle>

      </Menu.List>
    </Menu>
  )
};

export default Field;

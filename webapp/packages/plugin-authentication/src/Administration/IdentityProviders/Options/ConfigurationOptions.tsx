/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import styled, { css } from 'reshadow';

import { AuthProvidersResource } from '@cloudbeaver/core-authentication';
import {
  BASE_CONTAINERS_STYLES, ColoredContainer, ComboboxNew, Group, GroupTitle,
  InputFieldNew, ObjectPropertyInfoFormNew, SubmittingForm, TabContainerPanelComponent, useMapResource
} from '@cloudbeaver/core-blocks';
import { useTranslate } from '@cloudbeaver/core-localization';
import type { AuthProviderConfigurationParametersFragment } from '@cloudbeaver/core-sdk';
import { useStyles } from '@cloudbeaver/core-theming';

import { AuthProviderConfigurationParametersResource } from '../AuthProviderConfigurationParametersResource';
import type { IConfigurationFormProps } from '../IConfigurationFormProps';

const styles = css`
  SubmittingForm {
    flex: 1;
    overflow: auto;
  }
`;

export const ConfigurationOptions: TabContainerPanelComponent<IConfigurationFormProps> = observer(function ConfigurationOptions({
  state,
}) {
  const formRef = useRef<HTMLFormElement>(null);

  const translate = useTranslate();
  const style = useStyles(BASE_CONTAINERS_STYLES, styles);

  const providers = useMapResource(AuthProvidersResource, AuthProvidersResource.keyAll);
  const parameters = useMapResource(AuthProviderConfigurationParametersResource, state.config.providerId || null);

  const identityProviders = providers.resource.values.filter(provider => provider.configurable);
  const edit = state.mode === 'edit';

  return styled(style)(
    <SubmittingForm ref={formRef} onSubmit={state.save}>
      <ColoredContainer parent gap overflow>
        <Group small gap>
          <ComboboxNew
            name='providerId'
            state={state.config}
            items={identityProviders}
            keySelector={provider => provider.id}
            valueSelector={provider => provider.label}
            placeholder={translate('administration_identity_providers_choose_provider_placeholder')}
            readOnly={state.readonly || edit}
            disabled={state.disabled}
            searchable={false}
            tiny
            fill
          >
            {translate('administration_identity_providers_provider')}
          </ComboboxNew>
          <InputFieldNew
            name='id'
            state={state.config}
            readOnly={state.readonly || edit}
            disabled={state.disabled}
            tiny
            fill
          >
            {translate('administration_identity_providers_provider_id')}
          </InputFieldNew>
          <InputFieldNew
            name='displayName'
            state={state.config}
            minLength={1}
            disabled={state.disabled}
            readOnly={state.readonly}
            required
            tiny
            fill
          >
            {translate('administration_identity_providers_provider_configuration_name')}
          </InputFieldNew>
          <InputFieldNew
            name='description'
            state={state.config}
            disabled={state.disabled}
            readOnly={state.readonly}
          >
            {translate('administration_identity_providers_provider_configuration_description')}
          </InputFieldNew>
          <InputFieldNew
            name='iconURL'
            state={state.config}
            disabled={state.disabled}
            readOnly={state.readonly}
          >
            {translate('administration_identity_providers_provider_configuration_icon_url')}
          </InputFieldNew>
        </Group>
        {parameters.isLoaded() && parameters.data && (
          <Group small gap vertical>
            <GroupTitle>{translate('administration_identity_providers_provider_configuration_parameters')}</GroupTitle>
            <ObjectPropertyInfoFormNew
              state={state.config.parameters}
              properties={parameters.data as AuthProviderConfigurationParametersFragment[]}
              disabled={state.disabled}
              readOnly={state.readonly}
            />
          </Group>
        )}
      </ColoredContainer>
    </SubmittingForm>
  );
});

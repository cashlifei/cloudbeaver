/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import styled, { css } from 'reshadow';
import { use } from 'reshadow';

import { useStyles, composes } from '@cloudbeaver/core-theming';

import { Icon } from './Icons';
import { Loader } from './Loader/Loader';
import { useObjectRef } from './useObjectRef';

const buttonStyles = composes(
  css`
    Button {
      composes: theme-button from global;
    }
    button-label {
      composes: theme-button__label from global;
    }
    button-icon {
      composes: theme-button__icon from global;
    }
    ripple {
      composes: theme-button_ripple from global;
    }
  `,
  css`
    Button {
      display: flex;

      & Loader, & button-label {
        transition: opacity cubic-bezier(0.4, 0.0, 0.2, 1) 0.3s;
      }

      & Loader {
        position: absolute;
        opacity: 0;
      }

      & button-label {
        opacity: 1;
      }

      &[|loading] {
        & Loader {
          opacity: 1;
        }

        & button-label {
          opacity: 0;
        }
      }
    }
    
  `
);

const buttonMod = {
  raised: composes(
    css`
    Button {
      composes: theme-button_raised from global;
    }
    `
  ),
  unelevated: composes(
    css`
    Button {
      composes: theme-button_unelevated from global;
    }
    `
  ),
  outlined: composes(
    css`
    Button {
      composes: theme-button_outlined from global;
    }
    `
  ),
  secondary: composes(
    css`
    Button {
      composes: theme-button_secondary from global;
    }
    `
  ),
};

type ButtonProps = (
  React.ButtonHTMLAttributes<HTMLButtonElement | HTMLAnchorElement>
  & React.LinkHTMLAttributes<HTMLLinkElement | HTMLButtonElement>
) & {
  loading?: boolean;
  icon?: string;
  viewBox?: string;
  mod?: Array<keyof typeof buttonMod>;
  tag?: 'button' | 'a';
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  loader?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement | HTMLLinkElement> | (() => Promise<any>);
  download?: boolean;
};

export const Button: React.FC<ButtonProps> = observer(function Button({
  children,
  icon,
  viewBox,
  mod,
  tag = 'button',
  disabled = false,
  loading,
  loader,
  onClick,
  className,
  ...rest
}) {
  const state = useObjectRef({
    loading: false,
    click: (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement | HTMLLinkElement>) => {},
  }, {
    click(e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement | HTMLLinkElement>) {
      const returnValue = onClick?.(e);

      if (returnValue instanceof Promise) {
        if (loader) {
          this.loading = true;
          returnValue.finally(() => {
            this.loading = false;
          });
        }
      }
    },
  }, { loading: observable }, ['click']);

  loading = state.loading || loading;

  if (loading) {
    disabled = true;
  }

  const Button = tag;
  return styled(useStyles(buttonStyles, ...(mod || []).map(mod => buttonMod[mod])))(
    <Button {...rest} disabled={disabled} {...use({ loading })} className={className} onClick={state.click}>
      <ripple />
      {icon && <button-icon><Icon name={icon} viewBox={viewBox} /></button-icon>}
      <button-label as='span'>{children}</button-label>
      <Loader small />
    </Button>
  );
});

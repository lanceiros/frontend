import 'antd/lib/button/style/index.css';
import React from 'react';
import styled, { css } from 'styled-components/macro';
import AntButton from 'antd/lib/button';
import { useHistory } from 'react-router-dom';

import { get } from '@styles/utils';

const Button = styled(AntButton)`
  ${({ type }) =>
    !type &&
    css`
      &:not([disabled]).ant-btn:hover,
      &:not([disabled]).ant-btn:focus {
        border-color: ${get('colors.accent')};
        color: ${get('colors.accent')};
      }
    `}

  &.ant-btn-primary {
    background-color: ${get('colors.accent')};
    border-color: ${get('colors.accent')};

    &:active,
    &:focus,
    &:hover {
      background-color: ${get('colors.accentSecondary')};
      border-color: ${get('colors.accentSecondary')};
    }
  }

  &.ant-btn-secondary {
    background-color: ${get('colors.accentSecondary')};
    border-color: ${get('colors.accentSecondary')};
    color: ${get('colors.commonLighter')};

    &:active,
    &:focus,
    &:hover {
      background-color: ${get('colors.accent')};
      border-color: ${get('colors.accent')};
      color: ${get('colors.commonLighter')};
    }
  }

  &.ant-btn-link-active {
    span {
      text-decoration: underline;
    }
  }

  &.ant-btn-link-hover:hover {
    span {
      text-decoration: underline;
    }
  }
`;

export const Link = ({ href, to, children, target, ...props }) => {
  const history = useHistory();

  return (
    <Button
      onClick={() => {
        if (target === '_blank') {
          window.open(href || to);
        } else {
          history.push(href || to);
        }
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export const HelpButton = ({ href, type }) => {
  return (
    <Button
      type={type}
      ghost
      shape="circle"
      icon="question"
      style={{ width: '28px', height: '28px', minWidth: '28px', margin: '0 5px' }}
      onClick={() => {
        window.open(href);
      }}
    />
  );
};

export default Button;

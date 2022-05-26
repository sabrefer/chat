// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, PrimaryButton, Stack, Link, Text } from '@fluentui/react';
import React, { useCallback, useState } from 'react';
import {
  bottomStackFooterStyle,
  buttonStyle,
  buttonWithIconStyles,
  buttonsStackTokens,
  chatIconStyle,
  endChatContainerStyle,
  endChatTitleStyle,
  mainStackTokens,
  upperStackTokens
} from './styles/EndChat.styles';

import { Chat20Filled } from '@fluentui/react-icons';
import { getExistingThreadIdFromURL } from './utils/getExistingThreadIdFromURL';
import { joinThread } from './utils/joinThread';

export interface EndCallProps {
  userId: string;
  displayName: string;
  rejoinHandler(): void;
  homeHandler(): void;
}

export const EndScreen = (props: EndCallProps): JSX.Element => {
  const leftCall = 'You left the chat';
  const goHomePage = 'Go to homepage';
  const rejoinChat = 'Rejoin chat';
  const rejoining = 'Rejoining...';

  const [isRejoiningThread, setIsRejoiningThread] = useState(false);

  const { rejoinHandler, userId, displayName } = props;

  const rejoinThread = useCallback(async (): Promise<void> => {
    if (!isRejoiningThread) {
      const threadId = getExistingThreadIdFromURL();
      if (!threadId) {
        console.error('thread id is null');
        return;
      }

      await joinThread(threadId, userId, displayName);

      setIsRejoiningThread(true);
      rejoinHandler();
    }
  }, [isRejoiningThread, displayName, userId, rejoinHandler]);

  const sabretoothLink =
    'https://www.sabretoothtechnologies.com';

  return (
    <Stack
      horizontal
      wrap
      horizontalAlign="center"
      verticalAlign="center"
      tokens={mainStackTokens}
      className={endChatContainerStyle}
    >
      <Stack tokens={upperStackTokens}>
        <Text role={'heading'} aria-level={1} className={endChatTitleStyle}>
          {leftCall}
        </Text>
        <Stack horizontal wrap tokens={buttonsStackTokens}>
          <PrimaryButton
            disabled={isRejoiningThread}
            className={buttonStyle}
            styles={buttonWithIconStyles}
            text={isRejoiningThread ? rejoining : rejoinChat}
            onClick={async () => {
              await rejoinThread();
            }}
            onRenderIcon={() => <Chat20Filled className={chatIconStyle} />}
          />
          <DefaultButton
            className={buttonStyle}
            styles={buttonWithIconStyles}
            text={goHomePage}
            onClick={props.homeHandler}
          />
        </Stack>
        <div className={bottomStackFooterStyle}>
          <Link href={feedbackLink}>Sabretooth Innovative Technologies</Link>
          Acclaimed Restaurant and Hospitality Software Solutions
        </div>
      </Stack>
    </Stack>
  );
};

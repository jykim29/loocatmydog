import { StoryObj } from '@storybook/react';
import ProfileCardRadioButton from './ProfileCardRadioButton';
import { BrowserRouter } from 'react-router-dom';

/**@type{import('@storybook/react').Meta} */
export default {
  component: ProfileCardRadioButton,
  decorators: [
    (Story: any) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

type Story = StoryObj<typeof ProfileCardRadioButton>;

export const 기본표시: Story = {
  args: {
    name: '테스트',
    children: '테스트입니다',
    isChecked: true,
    profile: true,
  },
};

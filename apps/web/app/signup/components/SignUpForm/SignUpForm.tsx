'use client';
import { useRouter } from 'next/navigation';
import { Button, Form, notification } from 'antd';
import { useTransition } from 'react';
import Link from 'next/link';

import { type SignUpBodyDto } from '@/signup/models';
import { ROUTERS } from '@/(constants)/router';
import { AuthForm } from '@/(auth)/components/AuthForm';
import './SignUpForm.scss';
import { signUpUser } from '@/(auth)/api';
import ky, { KyResponse } from 'ky';

export const SignUpForm = () => {
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();
  // const { mutateAsync: submitSignupForm, isPending } = useSignUp();

  const onSubmit = (values: SignUpBodyDto) => {
    startTransaction(async () => {
      try {
        const response: KyResponse<any> = await ky.post('/api/auth/signup', {
          headers: {
            'Content-Type': 'application/json',
          },
          json: values,
        });
        const data = await response.json();
        const { message } = data;

        api.open({
          message,
          duration: 0,
          type: 'success',
        });
        router.push(ROUTERS.signin);
      } catch (error: unknown) {
        const body = await error?.response?.json();
        const { message } = body;
        api.open({
          message,
          duration: 0,
          type: 'error',
        });
      }
    });
  };

  return (
    <>
      {contextHolder}
      <AuthForm
        onSubmitAction={onSubmit}
        footer={
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit" disabled={isPending}>
              Sign Up
            </Button>
            <div className="sign-up-form_account-link">
              <Link href={ROUTERS.signin}>Have an account? Sign In</Link>
            </div>
          </Form.Item>
        }
        isPending={isPending}
      />
    </>
  );
};

'use client';
import { Button, Form, notification } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTransition } from 'react';
import ky, { type KyResponse } from 'ky';

import { ROUTERS } from '@/(constants)/router';
import { AuthForm } from '@/(auth)/components/AuthForm';
import { type SignInBodyDto } from '@/signin/models';
import './SignInForm.scss';

export const SignInForm = () => {
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();

  const onSubmit = (values: SignInBodyDto) => {
    startTransaction(async () => {
      try {
        const response: KyResponse<any> = await ky.post('/api/auth/login', {
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
        router.push(ROUTERS.profile);
      } catch (error: unknown) {
        console.error(error);
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
              Sign In
            </Button>
            <div className="sign-in-form_account-link">
              <Link href={ROUTERS.signup}>
                Hasn&apos;t an account yet? Sign Up
              </Link>
            </div>
          </Form.Item>
        }
        isPending={isPending}
      />
    </>
  );
};

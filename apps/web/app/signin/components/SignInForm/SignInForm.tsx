'use client';

import { Button, Form, notification } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTransition } from 'react';
import ky, { type KyResponse } from 'ky';

import { ROUTERS } from '@/constants/router.constant';
import { IS_AUTHENTICATED } from '@/constants/local-storage-keys.constant';
import { AuthForm } from '@/auth/components/AuthForm';
import { type LoginRequestDto, type LoginResponseDto } from '@repo/api';
import './SignInForm.scss';

export const SignInForm = () => {
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const [isPending, startTransaction] = useTransition();

  const onSubmit = (values: LoginRequestDto) => {
    startTransaction(async () => {
      try {
        const response: KyResponse<LoginResponseDto> = await ky.post(
          '/api/auth/login',
          {
            headers: {
              'Content-Type': 'application/json',
            },
            json: values,
          },
        );
        const data = await response.json();
        const { message } = data;

        api.open({
          message,
          duration: 0,
          type: 'success',
        });
        localStorage.setItem(IS_AUTHENTICATED, 'true');
        router.refresh();
        router.push(ROUTERS.profile);
      } catch (error: unknown) {
        const body =
          error && typeof error === 'object' && 'response' in error
            ? await (error as any).response?.json()
            : null;
        const message = body?.message || 'An error occurred';
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

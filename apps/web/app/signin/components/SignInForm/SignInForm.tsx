'use client';
import { Button, Form, notification } from 'antd';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { ROUTERS } from '@/(constants)/router';
import { AuthForm } from '@/(auth)/components/AuthForm';
import { useSignIn } from '@/signin/hooks/useSignIn';
import { type SignInDto } from '@/signin/models';
import './SignInForm.scss';

export const SignInForm = () => {
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const { mutateAsync: submitSignInForm, isPending } = useSignIn();

  const onSubmit = async (values: SignInDto) => {
    try {
      const { message } = await submitSignInForm(values);
      api.open({
        message,
        duration: 0,
        type: 'success',
      });
      router.push(ROUTERS.profile);
    } catch (error: unknown) {
      console.error(error);
      // @ts-ignore
      const body = await error?.response?.json();
      const { message } = body;
      api.open({
        message,
        duration: 0,
        type: 'error',
      });
    }
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

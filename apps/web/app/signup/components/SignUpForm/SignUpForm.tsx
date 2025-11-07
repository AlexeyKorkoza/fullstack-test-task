'use client';

import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Button, Form, Input, notification } from 'antd';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';

import { signUpFormSchema } from '@/signup/schemas/sign-up.schema';
import { type SignUpDto } from '@/signup/models';
import { useSignUp } from '@/signup/hooks/useSignUp';
import { FormErrorMessage } from '@/shared/FormErrorMessage';
import { ROUTERS } from '@/(constants)/router';
import './SignUpForm.scss';

export const SignUpForm = () => {
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();
  const formProps = useForm<SignUpDto>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signUpFormSchema),
  });
  const { mutateAsync: submitSignupForm, isPending } = useSignUp();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = formProps;

  const onFinish = async (values: SignUpDto) => {
    try {
      const { message } = await submitSignupForm(values);
      api.open({
        message,
        duration: 0,
        type: 'success',
      });
      router.push(ROUTERS.login);
    } catch (error: unknown) {
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
    <div className="sign-up-form_wrapper">
      {contextHolder}
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleSubmit(onFinish)}
        autoComplete="off"
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Form.Item<SignUpDto> label="Email">
              <Input {...field} />
              {errors.email?.message && (
                <FormErrorMessage message={errors.email.message} />
              )}
            </Form.Item>
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Form.Item<SignUpDto> label="Password">
              <Input.Password {...field} />
              {errors.password?.message && (
                <FormErrorMessage message={errors.password.message} />
              )}
            </Form.Item>
          )}
        />

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit" disabled={isPending}>
            Sign Up
          </Button>
          <div className="sign-up-form_account-link">
            <Link href={ROUTERS.login}>Have an account? Sign In</Link>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

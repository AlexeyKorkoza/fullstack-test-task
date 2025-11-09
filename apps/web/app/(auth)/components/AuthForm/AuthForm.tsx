'use client';

import { type FC, type ReactNode } from 'react';
import { Form, Input } from 'antd';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import type { SignUpDto } from '@/signup/models';
import { FormErrorMessage } from '@/shared/FormErrorMessage';
import { type AuthFormModel } from '@/(auth)/models';
import { authFormSchema } from '@/(auth)/schemas/auth-form.schema';
import './AuthForm.scss';

type Props = {
  onSubmitAction: SubmitHandler<AuthFormModel>;
  footer: ReactNode;
  isPending: boolean;
};

export const AuthForm: FC<Props> = ({ onSubmitAction, footer, isPending }) => {
  const formProps = useForm<AuthFormModel>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(authFormSchema),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = formProps;

  return (
    <div className="auth-form_wrapper">
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={handleSubmit(onSubmitAction)}
        autoComplete="off"
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Form.Item<SignUpDto> label="Email">
              <Input {...field} disabled={isPending} />
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
              <Input.Password {...field} disabled={isPending} />
              {errors.password?.message && (
                <FormErrorMessage message={errors.password.message} />
              )}
            </Form.Item>
          )}
        />

        {footer}
      </Form>
    </div>
  );
};

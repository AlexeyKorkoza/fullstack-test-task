'use client';

import { type FC } from 'react';
import './FormErrorMessage.scss';

type Props = {
  message: string;
};

export const FormErrorMessage: FC<Props> = ({ message }) => {
  return <span className="formErrorMessage">{message}</span>;
};

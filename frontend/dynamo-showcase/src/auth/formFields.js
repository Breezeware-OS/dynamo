const formFields = {
  signIn: {
    username: {
      placeholder: 'Enter your email',
      isRequired: false,
      label: 'Email',
      labelHidden: false,

      // order: 1,
    },
  },
  signUp: {
    password: {
      label: 'Password',
      labelHidden: false,
      // placeholder: 'Enter your Password',
      isRequired: true,

      order: 3,
    },
    confirm_password: {
      label: 'Confirm Password',
      placeholder: 'Confirm Password',
      isRequired: true,
      order: 4,
    },
    email: {
      label: 'Email',
      placeholder: 'Email',
      isRequired: true,
      order: 1,
    },
  },

  resetPassword: {
    username: {
      placeholder: 'Enter your email:',
    },
  },
  confirmResetPassword: {
    confirmation_code: {
      placeholder: 'Enter your Confirmation Code:',
      label: 'New Label',
      isRequired: false,
    },
    confirm_password: {
      placeholder: 'Enter your Password Please:',
    },
  },
  setupTOTP: {
    QR: {
      totpIssuer: 'test issuer',
      totpUsername: 'amplify_qr_test_user',
    },
    confirmation_code: {
      label: 'New Label',
      placeholder: 'Enter your Confirmation Code:',
      isRequired: false,
    },
  },
  confirmSignIn: {
    confirmation_code: {
      label: 'New Label',
      placeholder: 'Enter your Confirmation Code:',
      isRequired: false,
    },
  },
};

export default formFields;

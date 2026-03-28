import { ICreateAccount, IResetPassword } from '../types/emailTamplate';

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: 'Verify your account',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://i.postimg.cc/6pgNvKhD/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
          <h2 style="color: #277E16; font-size: 24px; margin-bottom: 20px;">Hey! ${values.name}, Your Toothlens Account Credentials</h2>
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #277E16; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
        </div>
    </div>
</body>`,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: 'Reset your password',
    html: `<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; margin: 50px; padding: 20px; color: #555;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <img src="https://i.postimg.cc/6pgNvKhD/logo.png" alt="Logo" style="display: block; margin: 0 auto 20px; width:150px" />
        <div style="text-align: center;">
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Your single use code is:</p>
            <div style="background-color: #277E16; width: 80px; padding: 10px; text-align: center; border-radius: 8px; color: #fff; font-size: 25px; letter-spacing: 2px; margin: 20px auto;">${values.otp}</div>
            <p style="color: #555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">This code is valid for 3 minutes.</p>
                <p style="color: #b9b4b4; font-size: 16px; line-height: 1.5; margin-bottom: 20px;text-align:left">If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
        </div>
    </div>
</body>`,
  };
  return data;
};


const emargencyUnlockAppOtpTemplate = (values: { appName: string, otp: number, name: string, email: string, userMessage: string, userName: string }) => {
  const data = {
    to: values.email,
    subject: `Unlock ${values.appName} App`,
    html: `
<body style="margin:0; padding:0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color:#f4f6f8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px 0; background-color:#f4f6f8;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td align="center" style="padding: 30px 0; background: linear-gradient(90deg, #ff4d4d, #ff7a7a);">
              <h1 style="color:#ffffff; margin:0; font-size:32px; font-weight:700;">One Time Password</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 30px; text-align:center;">
              <h2 style="color:#333333; font-size:24px; margin-bottom:20px;">Your OTP Code</h2>
              <p style="color:#555555; font-size:16px; line-height:1.6; margin-bottom:30px;">
                Hello, <strong>${values.name}</strong>!<br>
                ${values.userName} requested to unlock his <strong>${values.appName}</strong> App. Use the OTP below to continue:
              </p>

              <!-- OTP -->
              <div style="display:inline-block; padding: 20px 40px; font-size:32px; letter-spacing:12px; background-color:#fff5f5; border-radius:12px; border:2px dashed #ff4d4d; color:#ff4d4d; font-weight:bold; margin-bottom:30px;">
                ${values.otp}
              </div>

              <p style="color:#777777; font-size:14px; margin-bottom:20px;">
                If you did not request this OTP, please ignore this email.
              </p>

              <p style="color:#555555; font-size:15px; background-color:#f9f9f9; padding:15px; border-radius:8px; border:1px solid #e0e0e0;">
                Message from <strong>${values.userName}</strong>:<br>
                "${values.userMessage}"
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; text-align:center; background-color:#f4f6f8; font-size:12px; color:#999999;">
              &copy; 2026 Locked In. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
    `
  }
  return data;
}

export const emailTemplate = {
  createAccount,
  resetPassword,
  emargencyUnlockAppOtpTemplate
};

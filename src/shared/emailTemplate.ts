import { ICreateAccount, IResetPassword } from '../types/emailTamplate';

const createAccount = (values: ICreateAccount) => {
  const data = {
    to: values.email,
    subject: 'Verify your account',
    html: `<body style="margin:0; padding:0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color:#f4f6f8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0; background-color:#f4f6f8;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:30px 0; background: linear-gradient(90deg, #ff4d4d, #ff7a7a);">
              <img src="https://res.cloudinary.com/dkbcx9amc/image/upload/c_crop,g_north_west,h_266,w_838,x_243,y_193/Locked_in-removebg-preview_1_1_fb0ekg.png" alt="Logo" style="width:200px; margin-bottom:10px;" />
              <h1 style="color:#ffffff; margin:0; font-size:30px; font-weight:700;">
                Account Verification
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 30px; text-align:center;">
              <h2 style="color:#333333; font-size:22px; margin-bottom:15px;">
                Hey ${values.name}!
              </h2>

              <p style="color:#555555; font-size:16px; margin-bottom:25px;">
                Your single use verification code is:
              </p>

              <div style="display:inline-block; padding:20px 40px; font-size:32px; letter-spacing:10px;
                background-color:#fff5f5; border-radius:12px; border:2px dashed #ff4d4d;
                color:#ff4d4d; font-weight:bold;">
                ${values.otp}
              </div>

              <p style="color:#777777; font-size:14px; margin-top:25px;">
                This code is valid for 3 minutes.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 30px; text-align:center; background-color:#f4f6f8; font-size:12px; color:#999999;">
              © 2026 Your Company. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>`,
  };
  return data;
};

const resetPassword = (values: IResetPassword) => {
  const data = {
    to: values.email,
    subject: 'Reset your password',
    html: `<body style="margin:0; padding:0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color:#f4f6f8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0; background-color:#f4f6f8;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:30px 0; background: linear-gradient(90deg, #ff4d4d, #ff7a7a);">
              <img src="https://res.cloudinary.com/dkbcx9amc/image/upload/c_crop,g_north_west,h_266,w_838,x_243,y_193/Locked_in-removebg-preview_1_1_fb0ekg.png" alt="Logo" style="width:200px; margin-bottom:10px;" />
              <h1 style="color:#ffffff; margin:0; font-size:30px; font-weight:700;">
                Reset Password
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 30px; text-align:center;">
              <p style="color:#555555; font-size:16px; margin-bottom:25px;">
                Your password reset code is:
              </p>

              <div style="display:inline-block; padding:20px 40px; font-size:32px; letter-spacing:10px;
                background-color:#fff5f5; border-radius:12px; border:2px dashed #ff4d4d;
                color:#ff4d4d; font-weight:bold;">
                ${values.otp}
              </div>

              <p style="color:#777777; font-size:14px; margin-top:25px;">
                This code is valid for 3 minutes.
              </p>

              <p style="color:#b9b4b4; font-size:14px; margin-top:20px; text-align:left;">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 30px; text-align:center; background-color:#f4f6f8; font-size:12px; color:#999999;">
              © 2026 Your Company. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>`,
  };
  return data;
};


const emargencyUnlockAppOtpTemplate = (values: {
  appName: string;
  otp: number;
  name: string;
  email: string;
  userMessage: string;
  userName: string;
}) => {
  return {
    to: values.email,
    subject: `${values.userName} wants to unlock ${values.appName} early`,
    html: `
<body style="margin:0; padding:0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; background-color:#f4f6f8;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0; background-color:#f4f6f8;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td align="center" style="padding:30px 0; background:linear-gradient(90deg, #ff4d4d, #ff7a7a);">
              <h1 style="color:#ffffff; margin:0; font-size:32px; font-weight:700;">
                One Time Password
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 30px; text-align:center;">

              <h2 style="color:#333333; font-size:24px; margin-bottom:25px;">
                Your Code
              </h2>

              <p style="color:#555555; font-size:16px; line-height:1.7; margin-bottom:15px;">
                Hi <strong>${values.name}</strong>,
              </p>

              <p style="color:#555555; font-size:16px; line-height:1.7; margin-bottom:15px;">
                <strong>${values.userName}</strong> wants to unlock their
                <strong>${values.appName}</strong> app early.
              </p>

              <p style="color:#555555; font-size:16px; line-height:1.7; margin-bottom:30px;">
                Only share the code below if you approve:
              </p>

              <!-- OTP -->
              <div style="
                display:inline-block;
                padding:20px 40px;
                font-size:32px;
                letter-spacing:12px;
                background-color:#fff5f5;
                border-radius:12px;
                border:2px dashed #ff4d4d;
                color:#ff4d4d;
                font-weight:bold;
                margin-bottom:30px;
              ">
                ${values.otp}
              </div>

              ${
                values.userMessage
                  ? `
                <div style="
                  margin:0 auto 30px;
                  max-width:450px;
                  text-align:left;
                  background-color:#f9f9f9;
                  border:1px solid #e5e5e5;
                  border-radius:8px;
                  padding:16px;
                ">
                  <p style="margin:0 0 8px; color:#333; font-size:14px; font-weight:600;">
                    Message from ${values.userName}
                  </p>
                  <p style="margin:0; color:#555; font-size:14px; line-height:1.6;">
                    "${values.userMessage}"
                  </p>
                </div>
              `
                  : ""
              }

              <p style="color:#777777; font-size:14px; line-height:1.7; margin-bottom:0;">
                This password will expire in <strong>3 minutes</strong>.
                If you do not approve this request, please ignore this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="
              padding:20px 30px;
              text-align:center;
              background-color:#f4f6f8;
              font-size:12px;
              color:#999999;
            ">
              This code should only be shared if you approve the unlock request.
              <br /><br />
              &copy; 2026 Locked In. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
    `,
  };
};

export const emailTemplate = {
  createAccount,
  resetPassword,
  emargencyUnlockAppOtpTemplate
};

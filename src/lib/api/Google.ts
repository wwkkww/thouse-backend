import { google } from 'googleapis';

const oAuth2Client = new google.auth.OAuth2(
  process.env.G_CLIENT_ID,
  process.env.G_CLIENT_SECRET,
  `${process.env.PUBLIC_URL}/login`
);

export const Google = {
  authUrl: oAuth2Client.generateAuthUrl({
    access_type: 'online',
    scope: [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ],
  }),
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  login: async (code: string) => {
    const { tokens } = await oAuth2Client.getToken(code);

    oAuth2Client.setCredentials(tokens);

    const { data } = await google.people({ version: 'v1', auth: oAuth2Client }).people.get({
      resourceName: 'people/me',
      personFields: 'emailAddresses,names,photos',
    });

    return { user: data };
  },
};

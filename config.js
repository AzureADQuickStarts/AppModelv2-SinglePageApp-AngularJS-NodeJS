 exports.creds = {
     
     // The app id you get from the registration portal
     audience: '<Your-application-id>',
     
     // Passport will use this URL to fetch the token validation information from Azure AD
     identityMetadata: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration'
 };
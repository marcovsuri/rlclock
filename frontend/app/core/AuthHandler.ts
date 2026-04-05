// frontend/app/core/AuthHandler.ts
const BLACKBAUD_CLIENT_ID = import.meta.env.VITE_BLACKBAUD_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_BLACKBAUD_REDIRECT_URI;
const SIGNIN_URL = import.meta.env.VITE_SIGNIN_URL;

/**
 * Redirects the user to the Blackbaud OAuth authorization page
 */
const signIn = () => {
  const oauthUrl = `https://app.blackbaud.com/oauth/authorize?client_id=${encodeURIComponent(
    BLACKBAUD_CLIENT_ID,
  )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code`;
  // console.log('Redirecting to Blackbaud OAuth URL:', oauthUrl);
  window.location.href = oauthUrl;
};

/**
 * Handles the OAuth callback, exchanges the code for an access token, and stores user info
 */
const handleOAuthCallback = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  // console.log('Handling OAuth callback, extracted code:', code);
  if (!code) {
    console.error('No authorization code found in URL');
    return;
  }

  try {
    const res = await fetch(SIGNIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      console.error('OAuth exchange failed with status:', res.status);
      throw new Error('OAuth exchange failed');
    }

    const data = await res.json();
    console.log('Received data from SIGNIN_URL:', data);

    if (data.success === true) {
      console.log('SUCCESS: ', data.data);
      localStorage.setItem('isSignedIn', 'true');
      localStorage.setItem('userData', JSON.stringify(data.data));
    } else {
      console.error('SIGNIN_URL response indicates failure:', data);
      throw new Error(
        'OAuth exchange failed: ' + (data.error || 'Unknown error'),
      );
    }
  } catch (err) {
    console.error('Error handling OAuth callback:', err);
  }
};

/**
 * Signs the user out by clearing local storage and reloading the page
 */
const signOut = () => {
  // console.log('Signing out user');
  localStorage.setItem('isSignedIn', 'false');
  localStorage.removeItem('userData');
  window.location.reload();
};

/**
 * Returns true if a user is currently signed in
 */
const isSignedIn = () => localStorage.getItem('isSignedIn') === 'true';

const getUserData = () => {
  const raw = localStorage.getItem('userData');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error parsing user data from localStorage:', err);
    return null;
  }
};

export { signIn, signOut, handleOAuthCallback, isSignedIn, getUserData };

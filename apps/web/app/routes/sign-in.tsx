import { Button } from '@web-app-template/ui/button';
import { Flex } from '@web-app-template/ui/flex';
import { useState } from 'react';
import { Link } from 'react-router';
import { authClient } from '~/modules/auth/auth-client';

export default function Login() {
  const [showSignIn, setShowSignIn] = useState(false);

  const signInWithGoogle = async () => {
    const { error, data } = await authClient.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}`,
    });
    console.log({ data, error });
  };

  return (
    <Flex direction='col' className='h-full max-w-[1300px] m-auto pb-8'>
      <Link to='/'>
        <Flex align='center' className='sm:px-8 px-4 sm:mt-6 mt-4 h-10'>
          <img
            src='/logo.png'
            alt='web-app-template-logo'
            className='h-[40px] w-[40px]'
          />
          <span className='ml-2 font-["Work Sans"] text-[16px] font-bold text-foreground'>
            Kipzat
          </span>
        </Flex>
      </Link>
      <Flex justify='center' flex='1' className='mb-16 pt-16'>
        <Flex
          direction='col'
          className='mt-12 w-full sm:mt-[12vh] sm:max-w-[330px] px-8 sm:px-0'
        >
          <Flex direction='col' className='mb-10'>
            <span className='text-2xl font-semibold'>Sign In</span>
            <span className='my-2 text-xl font-semibold text-foreground/50 leading-7'>
              Sign in to your account
            </span>
          </Flex>
          <Button variant='outline' size='lg' onClick={signInWithGoogle}>
            <GoogleLogo />
            Sign in with Google
          </Button>
          <div className='mt-14 mb-8 text-xs text-foreground/40 text-center'>
            Accept terms and conditions{' '}
            <Link to='/terms-and-conditions' className='text-foreground/60'>
              Terms and conditions
            </Link>{' '}
            and{' '}
            <Link to='/privacy-policy' className='text-foreground/60'>
              Privacy policy
            </Link>
            .
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
}

type IconProps = React.HTMLAttributes<SVGElement>;
export function GoogleLogo(props: IconProps) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' {...props}>
      <g
        xmlns='http://www.w3.org/2000/svg'
        transform='matrix(1, 0, 0, 1, 27.009001, -39.238998)'
      >
        <path
          fill='#4285F4'
          d='M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z'
        />
        <path
          fill='#34A853'
          d='M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z'
        />
        <path
          fill='#FBBC05'
          d='M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z'
        />
        <path
          fill='#EA4335'
          d='M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z'
        />
      </g>
    </svg>
  );
}

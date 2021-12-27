import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  const router = useRouter();

  return (
    <Link href="/">
      <header className={styles.header}>
        <Image src="/logo.svg" alt="logo" width="240" height="25" />
      </header>
    </Link>
  );
}

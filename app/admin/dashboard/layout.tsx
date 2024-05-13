'use client';

import useUIStore from '@/app/stores/ui';
import Redirect from './Redirect';
import SideBar from './SideBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isIconOnly = useUIStore((state) => state.isIconOnly);
  const toggleIsIconOnly = useUIStore((state) => state.toggleIsIconOnly);

  return (
    <>
      <Redirect />
      <section
        className={`grid ${
          isIconOnly
            ? 'grid-cols-1 md:grid-cols-[5fr_85fr]'
            : 'grid-cols-1 md:grid-cols-[15fr_85fr]'
        } h-screen overflow-hidden`}
      >
        <SideBar isIconOnly={isIconOnly} toggleIconOnly={toggleIsIconOnly} />

        <main className="bg-gray-200 min-h-svh overflow-y-scroll">
          <div className="h-full max-w-6xl mx-auto pb-20">{children}</div>
        </main>
      </section>
    </>
  );
}

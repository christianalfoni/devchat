import { Sidebar } from "$ui-components/Sidebar";
import { SearchHeader } from "$ui-components/SearchHeader";
import { FollowersFeed } from "$ui-components/FollowersFeed";
import { Feed } from "$ui-components/Feed";

import { useState } from "react";
import { observer } from "signalit";
import { useInject } from "../impact-app-test";
import { Session } from "$services/Session";
import { PostComment } from "$editor/PostComment";

export function App() {
  using _ = observer()
  
  const session = useInject(Session)
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <>
      <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} avatarUrl={session.user.photoURL} name={session.user.displayName} />
      <div className="xl:pl-72">
        <SearchHeader setSidebarOpen={setSidebarOpen} />
        <main className="lg:pr-96">
          <header className="border-b border-white/5 px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            <PostComment avatarUrl={session.user.photoURL} />
          </header>
          <Feed />
          <FollowersFeed />
        </main>
      </div>
    </>
  );
}

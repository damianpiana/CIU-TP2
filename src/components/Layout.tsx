import { Outlet } from "react-router-dom";
import { AppHeader } from "./AppHeader";
import { AppFooter } from "./AppFooter";

export function Layout() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <AppHeader />
      <main className="flex-grow-1 py-4">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import styles from "@/components/layout.module.css";
import { THEME_CONFIG } from "@/config/theme";
import { NotificationProvider } from "@/contexts/NotificationContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NotificationProvider>
      <div className={styles.dashboardContainer}>
        <style dangerouslySetInnerHTML={{__html: `
          :root {
            --primary-accent: ${THEME_CONFIG.primaryAccentColor};
            --primary-color: ${THEME_CONFIG.primaryAccentColor};
            --sidebar-bg: ${THEME_CONFIG.sidebarBackground};
          }
        `}} />
        <Sidebar />
        <div className={styles.mainArea}>
          <Topbar />
          <main className={styles.contentArea}>
            {children}
          </main>
        </div>
      </div>
    </NotificationProvider>
  );
}

import { useRouter } from "next/navigation";
import { useState } from "react";

import { useBrainFetcher } from "@/app/studio/[brainId]/BrainManagementTabs/hooks/useBrainFetcher";
import Icon from "@/lib/components/ui/Icon/Icon";
import { LoaderIcon } from "@/lib/components/ui/LoaderIcon/LoaderIcon";
import { Brain } from "@/lib/context/BrainProvider/types";
import { useNotificationsContext } from "@/lib/context/NotificationsProvider/hooks/useNotificationsContext";
import { useSupabase } from "@/lib/context/SupabaseProvider";

import styles from "./Notification.module.scss";

import { BulkNotification, NotificationType } from "../../../types/types";
import { NotificationLoadingBar } from "../NotificationLoadingBar/NotificationLoadingBar";

interface NotificationProps {
  bulkNotification: BulkNotification;
  lastNotification?: boolean;
  updateNotifications: () => Promise<void>;
}

const NotificationHeader = ({
  bulkNotification,
  brain,
  onDelete,
  allNotifsProcessed,
}: {
  bulkNotification: BulkNotification;
  brain?: Brain;
  onDelete: () => void;
  allNotifsProcessed: boolean;
}) => (
  <div className={styles.header}>
    <div className={styles.left}>
      <span className={styles.title}>
        <span>
          {bulkNotification.category === "upload" &&
            `${allNotifsProcessed ? "Uploaded" : "Uploading"} files `}
          {bulkNotification.category === "crawl" &&
            `${allNotifsProcessed ? "Crawled" : "Crawling"} websites `}
          {bulkNotification.category === "sync" &&
            `${allNotifsProcessed ? "Synced" : "Syncing"} files `}
        </span>
        for
      </span>
      {brain && (
        <div className={styles.brain_name}>
          <Icon name="brain" size="small" color="dark-grey" />
          <span>{brain.name}</span>
        </div>
      )}
    </div>
    <Icon
      name="delete"
      size="small"
      color="dangerous"
      handleHover={true}
      onClick={onDelete}
    />
  </div>
);

const NotificationIcon = ({
  notifications,
}: {
  notifications: NotificationType[];
}) => {
  const hasInfo = notifications.some((notif) => notif.status === "info");
  const allSuccess = notifications.every((notif) => notif.status === "success");

  if (hasInfo) {
    return <LoaderIcon size="small" color="primary" />;
  }
  if (allSuccess) {
    return <Icon color="success" name="check" size="small" />;
  }

  return <Icon color="warning" name="warning" size="small" />;
};

const NotificationCount = ({
  notifications,
}: {
  notifications: NotificationType[];
}) => {
  const total = notifications.length;
  const completed = notifications.filter(
    (notif) => notif.status !== "info"
  ).length;
  const hasError = notifications.some((notif) => notif.status === "error");

  let className = "";
  if (completed === total) {
    className = hasError ? styles.warning : styles.success;
  }

  return (
    <div className={`${styles.count} ${className}`}>
      {`${completed} / ${total}`}
    </div>
  );
};

export const Notification = ({
  bulkNotification,
  lastNotification,
}: NotificationProps): JSX.Element => {
  const { brain } = useBrainFetcher({ brainId: bulkNotification.brain_id });
  const { supabase } = useSupabase();
  const { updateNotifications } = useNotificationsContext();
  const [errorsHovered, setErrorsHovered] = useState(false);
  const [errorsOpened, setErrorsOpened] = useState(false);
  const router = useRouter();

  const navigateToBrain = () => {
    console.info(brain);
    router.push(`/studio/${bulkNotification.brain_id}`); // Naviguer vers l'URL
  };

  const allNotifsProcessed = bulkNotification.notifications.every(
    (notif) => notif.status !== "info"
  );

  const deleteNotification = async () => {
    const deletePromises = bulkNotification.notifications.map(
      async (notification) => {
        await supabase.from("notifications").delete().eq("id", notification.id);
      }
    );
    await Promise.all(deletePromises);
    await updateNotifications();
  };

  return (
    <div
      className={`${styles.notification} ${
        lastNotification ? styles.last : ""
      }`}
      onClick={() => navigateToBrain()}
    >
      <NotificationHeader
        bulkNotification={bulkNotification}
        brain={brain}
        onDelete={() => void deleteNotification()}
        allNotifsProcessed={allNotifsProcessed}
      />
      {bulkNotification.notifications.some(
        (notif) => notif.status === "info"
      ) ? (
        <div className={styles.loader_wrapper}>
          <div className={styles.left}>
            <div className={styles.icon_info}>
              <NotificationIcon
                notifications={bulkNotification.notifications}
              />
            </div>
            <NotificationCount notifications={bulkNotification.notifications} />
          </div>
          <NotificationLoadingBar bulkNotification={bulkNotification} />
        </div>
      ) : (
        <div className={styles.status_report}>
          {bulkNotification.notifications.some(
            (notif) => notif.status === "success"
          ) && (
            <div className={styles.success}>
              <Icon name="check" size="normal" color="success" />
              <span>
                {
                  bulkNotification.notifications.filter(
                    (notif) => notif.status === "success"
                  ).length
                }
              </span>
            </div>
          )}
          {bulkNotification.notifications.some(
            (notif) => notif.status === "error"
          ) && (
            <div className={styles.error}>
              <Icon name="warning" size="normal" color="dangerous" />
              <span>
                {
                  bulkNotification.notifications.filter(
                    (notif) => notif.status === "error"
                  ).length
                }
              </span>
            </div>
          )}
        </div>
      )}
      {bulkNotification.notifications.some(
        (notif) => notif.status === "error"
      ) && (
        <div>
          <div
            className={styles.errors_header}
            onMouseEnter={() => setErrorsHovered(true)}
            onMouseLeave={() => setErrorsHovered(false)}
            onClick={() => setErrorsOpened(!errorsOpened)}
          >
            <Icon
              name="chevronRight"
              size="small"
              color={errorsHovered ? "dangerous-dark" : "dangerous"}
            />
            <span className={styles.title}>
              {
                bulkNotification.notifications.filter(
                  (notif) => notif.status === "error"
                ).length
              }{" "}
              errors
            </span>
          </div>
          {errorsOpened && (
            <div className={styles.errors}>
              {bulkNotification.notifications
                .filter((notif) => notif.status === "error")
                .map((notif, index) => (
                  <div key={index}>{notif.description}</div>
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;

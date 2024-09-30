"use client";

import { useEffect, useRef, useState } from "react";

import PageHeader from "@/lib/components/PageHeader/PageHeader";

import ConnectionsKnowledges from "./ConnectionsKnowledge/ConnectionsKnowledges";
import CurrentFolderExplorer from "./CurrentFolderExplorer/CurrentFolderExplorer";
import { KnowledgeProvider } from "./KnowledgeProvider/knowledge-provider";
import QuivrKnowledges from "./QuivrKnowledge/QuivrKnowledges";
import styles from "./page.module.scss";

const Knowledge = (): JSX.Element => {
  const [isResizing, setIsResizing] = useState(false);
  const [foldersWidth, setFoldersWidth] = useState(400);
  const [initialMouseX, setInitialMouseX] = useState(0);
  const [initialWidth, setInitialWidth] = useState(400);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const foldersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && foldersRef.current) {
        const newWidth = initialWidth + (e.clientX - initialMouseX);
        setFoldersWidth(newWidth < 200 ? 200 : newWidth > 900 ? 900 : newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.userSelect = "";
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
    };
  }, [isResizing, initialMouseX, initialWidth]);

  return (
    <KnowledgeProvider>
      <div className={styles.main_container}>
        <div className={styles.page_header}>
          <PageHeader iconName="knowledge" label="My Knowledge" buttons={[]} />
        </div>
        <div className={styles.content_wrapper}>
          <div
            className={styles.folders_wrapper}
            ref={foldersRef}
            style={{ minWidth: `${foldersWidth}px` }}
          >
            <div className={styles.folders}>
              <div className={styles.quivr_folder}>
                <QuivrKnowledges />
              </div>
              <ConnectionsKnowledges />
            </div>
          </div>
          <div
            className={styles.resize_wrapper}
            ref={resizeHandleRef}
            onMouseDown={(e) => {
              setIsResizing(true);
              setInitialMouseX(e.clientX);
              setInitialWidth(foldersWidth);
            }}
          >
            <div
              className={`${styles.resize_handle} ${
                isResizing ? styles.active : ""
              }`}
            ></div>
          </div>
          <div className={styles.folder_content}>
            <CurrentFolderExplorer />
          </div>
        </div>
      </div>
    </KnowledgeProvider>
  );
};

export default Knowledge;

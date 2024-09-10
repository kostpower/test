"use client";

import { useEffect, useRef, useState } from "react";

import PageHeader from "@/lib/components/PageHeader/PageHeader";

import ConnectionsKnowledges from "./ConnectionsKnowledge/ConnectionsKnowledges";
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
        setFoldersWidth(newWidth < 300 ? 300 : newWidth > 900 ? 900 : newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, initialMouseX, initialWidth]);

  return (
    <div className={styles.main_container}>
      <div className={styles.page_header}>
        <PageHeader iconName="knowledge" label="My Knowledge" buttons={[]} />
      </div>
      <div className={styles.content_wrapper}>
        <div
          className={styles.folders_wrapper}
          ref={foldersRef}
          style={{ width: `${foldersWidth}px` }}
        >
          <div className={styles.folders}>
            <ConnectionsKnowledges />
          </div>
        </div>
        <div
          className={`${styles.resize_handle} ${
            isResizing ? styles.active : ""
          }`}
          ref={resizeHandleRef}
          onMouseDown={(e) => {
            setIsResizing(true);
            setInitialMouseX(e.clientX);
            setInitialWidth(foldersWidth); // Mémoriser la largeur initiale au début du redimensionnement
          }}
        ></div>
        <div className={styles.folder_content}></div>
      </div>
    </div>
  );
};

export default Knowledge;

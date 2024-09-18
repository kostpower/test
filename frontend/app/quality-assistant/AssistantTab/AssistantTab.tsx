"use client";

import { useEffect, useState } from "react";

import { useAssistants } from "@/lib/api/assistants/useAssistants";
import { FileInput } from "@/lib/components/ui/FileInput/FileInput";
import QuivrButton from "@/lib/components/ui/QuivrButton/QuivrButton";

import AssistantCard from "./AssistantCard/AssistantCard";
import styles from "./AssistantTab.module.scss";

import { Assistant } from "../types/assistant";

const AssistantTab = (): JSX.Element => {
  const [assistantChoosed, setAssistantChoosed] = useState<
    Assistant | undefined
  >(undefined);
  const [assistants, setAssistants] = useState<Assistant[]>([]);

  const { getAssistants } = useAssistants();

  const handleFileChange = (file: File) => {
    console.log("Selected file:", file);
  };

  useEffect(() => {
    console.log("Assistant choosed:", assistantChoosed);
    void (async () => {
      try {
        const res = await getAssistants();
        setAssistants(res);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [assistantChoosed]);

  return (
    <div className={styles.assistant_tab_wrapper}>
      {!assistantChoosed ? (
        <div className={styles.content_section}>
          <span className={styles.title}>Choose an assistant</span>
          <div className={styles.assistant_choice_wrapper}>
            {assistants.map((assistant, index) => (
              <div key={index} onClick={() => setAssistantChoosed(assistant)}>
                <AssistantCard assistant={assistant} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.form_wrapper}>
          <span className={styles.title}>{assistantChoosed.name}</span>
          <div className={styles.file_inputs_wrapper}>
            <FileInput label="Document 1" onFileChange={handleFileChange} />
            <FileInput label="Document 2" onFileChange={handleFileChange} />
          </div>
        </div>
      )}
      {assistantChoosed && (
        <div className={styles.buttons_wrapper}>
          <QuivrButton
            iconName="chevronLeft"
            label="Back"
            color="primary"
            onClick={() => setAssistantChoosed(undefined)}
          />
          <QuivrButton
            iconName="chevronRight"
            label="EXECUTE"
            color="primary"
            important={true}
          />
        </div>
      )}
    </div>
  );
};

export default AssistantTab;

"use client";
import { useTranslation } from "react-i18next";
import { PiPaperclipFill } from "react-icons/pi";

import { useChat } from "@/app/chat/[chatId]/hooks/useChat";
import Button from "@/lib/components/ui/Button";
import { useKnowledgeToFeedContext } from "@/lib/context/KnowledgeToFeedProvider/hooks/useKnowledgeToFeedContext";
import { useSecurity } from "@/services/useSecurity/useSecurity";

import { OnboardingQuestions } from "./components";
import { ChatBar } from "./components/ChatBar/ChatBar";
import { ConfigModal } from "./components/ConfigModal";
import { useChatInput } from "./hooks/useChatInput";

type ChatInputProps = {
  shouldDisplayFeedCard: boolean;
};

export const ChatInput = ({
  shouldDisplayFeedCard,
}: ChatInputProps): JSX.Element => {
  const { isStudioMember } = useSecurity();

  const { generatingAnswer } = useChat();
  const { setMessage, submitQuestion, message } = useChatInput();
  const { t } = useTranslation(["chat"]);

  const { setShouldDisplayFeedCard } = useKnowledgeToFeedContext();

  return (
    <>
      <OnboardingQuestions />
      <div className="flex mt-1 flex-col w-full shadow-md dark:shadow-primary/25 hover:shadow-xl transition-shadow rounded-xl bg-white dark:bg-black border border-black/10 dark:border-white/25 p-2">
        <form
          data-testid="chat-input-form"
          onSubmit={(e) => {
            e.preventDefault();
            submitQuestion();
          }}
          className="sticky bottom-0 bg-white dark:bg-black w-full flex items-center gap-2 z-20 p-2"
        >
          {isStudioMember && !shouldDisplayFeedCard && (
            <Button
              className="p-0"
              variant={"tertiary"}
              data-testid="feed-button"
              type="button"
              onClick={() => setShouldDisplayFeedCard(true)}
              tooltip={t("add_content_card_button_tooltip")}
            >
              <PiPaperclipFill size={38} />
            </Button>
          )}

          <div className="flex flex-1 flex-col items-center">
            <ChatBar
              message={message}
              setMessage={setMessage}
              onSubmit={submitQuestion}
            />
          </div>

          <div className="flex flex-row items-end">
            <Button
              className="px-3 py-2 sm:px-4 sm:py-2"
              type="submit"
              isLoading={generatingAnswer}
              data-testid="submit-button"
            >
              {generatingAnswer
                ? t("thinking", { ns: "chat" })
                : t("chat", { ns: "chat" })}
            </Button>
            <div className="hidden md:flex items-center">
              {isStudioMember && <ConfigModal />}
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

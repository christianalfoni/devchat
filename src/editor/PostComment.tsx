import { Fragment, useEffect, useState } from "react";
import {
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  EditorThemeClasses,
} from "lexical";
import { Listbox, Transition } from "@headlessui/react";
import { classNames } from "../utils/classNames";
import {
  LexicalComposer,
  InitialConfigType,
} from "@lexical/react/LexicalComposer";
import { TRANSFORMERS } from "@lexical/markdown";
import { $createCodeNode, CodeNode, CodeHighlightNode } from "@lexical/code";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode, $createHeadingNode } from "@lexical/rich-text";
import { ListNode, ListItemNode, $createListNode } from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { CodeBracketIcon, ListBulletIcon } from "@heroicons/react/24/outline";
import { $setBlocksType } from "@lexical/selection";
import CodeHighlightPlugin from "./CodeHighlightPlugin";

const moods = [
  {
    name: "Excited",
    value: "excited",
    icon: FireIcon,
    iconColor: "text-white",
    bgColor: "bg-red-500",
  },
  {
    name: "Loved",
    value: "loved",
    icon: HeartIcon,
    iconColor: "text-white",
    bgColor: "bg-pink-400",
  },
  {
    name: "Happy",
    value: "happy",
    icon: FaceSmileIcon,
    iconColor: "text-white",
    bgColor: "bg-green-400",
  },
  {
    name: "Sad",
    value: "sad",
    icon: FaceFrownIcon,
    iconColor: "text-white",
    bgColor: "bg-yellow-400",
  },
  {
    name: "Thumbsy",
    value: "thumbsy",
    icon: HandThumbUpIcon,
    iconColor: "text-white",
    bgColor: "bg-blue-500",
  },
  {
    name: "I feel nothing",
    value: null,
    icon: XMarkIcon,
    iconColor: "text-gray-400",
    bgColor: "bg-transparent",
  },
];

function MyCustomAutoFocusPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Focus the editor when the effect fires!
    editor.focus();
  }, [editor]);

  return null;
}

function HeadingTool({ type }: { type: "h1" | "h2" | "h3" }) {
  const [editor] = useLexicalComposerContext();
  return (
    <button
      className="flex items-center font-bold text-gray-400 hover:text-gray-500 text-sm"
      onClick={() => {
        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            $setBlocksType(selection, () => $createHeadingNode(type));
          }
        });
      }}
    >
      {type.toUpperCase()}
    </button>
  );
}

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [selected, setSelected] = useState(moods[5]);

  return (
    <div className="absolute inset-x-0 -bottom-14 flex justify-between py-2 pl-3 pr-2 rounded-b-lg">
      <div className="flex items-center space-x-3">
        <HeadingTool type="h1" />
        <HeadingTool type="h2" />
        <HeadingTool type="h3" />
        <button
          className="flex items-center font-bold text-gray-400 hover:text-gray-500"
          onClick={() => {
            editor.update(() => {
              const selection = $getSelection();

              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createListNode("bullet"));
              }
            });
          }}
        >
          <ListBulletIcon
            className="h-5 w-5 flex-shrink-0"
            aria-hidden="true"
          />
        </button>
        <button
          className="flex items-center font-bold text-gray-400 hover:text-gray-500"
          onClick={() => {
            editor.update(() => {
              const selection = $getSelection();

              if ($isRangeSelection(selection)) {
                $setBlocksType(selection, () => $createCodeNode("typescript"));
              }
            });
          }}
        >
          <CodeBracketIcon
            className="h-5 w-5 flex-shrink-0"
            aria-hidden="true"
          />
        </button>
        <div className="flex items-center">
          <Listbox value={selected} onChange={setSelected}>
            {({ open }) => (
              <>
                <Listbox.Label className="sr-only">Your mood</Listbox.Label>
                <div className="relative">
                  <Listbox.Button className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                    <span className="flex items-center justify-center">
                      {selected.value === null ? (
                        <span>
                          <FaceSmileIcon
                            className="h-5 w-5 flex-shrink-0"
                            aria-hidden="true"
                          />
                          <span className="sr-only">Add your mood</span>
                        </span>
                      ) : (
                        <span>
                          <span
                            className={classNames(
                              selected.bgColor,
                              "flex h-8 w-8 items-center justify-center rounded-full"
                            )}
                          >
                            <selected.icon
                              className="h-5 w-5 flex-shrink-0 text-white"
                              aria-hidden="true"
                            />
                          </span>
                          <span className="sr-only">{selected.name}</span>
                        </span>
                      )}
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 -ml-6 mt-1 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                      {moods.map((mood) => (
                        <Listbox.Option
                          key={mood.value}
                          className={({ active }) =>
                            classNames(
                              active ? "bg-gray-100" : "bg-white",
                              "relative cursor-default select-none px-3 py-2"
                            )
                          }
                          value={mood}
                        >
                          <div className="flex items-center">
                            <div
                              className={classNames(
                                mood.bgColor,
                                "flex h-8 w-8 items-center justify-center rounded-full"
                              )}
                            >
                              <mood.icon
                                className={classNames(
                                  mood.iconColor,
                                  "h-5 w-5 flex-shrink-0"
                                )}
                                aria-hidden="true"
                              />
                            </div>
                            <span className="ml-3 block truncate font-medium">
                              {mood.name}
                            </span>
                          </div>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
        </div>
      </div>
      <div className="flex-shrink-0">
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-green-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Post
        </button>
      </div>
    </div>
  );
}

const EDITOR_NODES = [
  CodeNode,
  HeadingNode,
  LinkNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
];

const theme: EditorThemeClasses = {
  quote:
    "text-xl italic font-semibold text-gray-900 dark:text-white p-4 my-4 border-l-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800",
  heading: {
    h1: "text-xl",
  },
  list: {
    ul: "list-disc ml-4",
  },
  codeHighlight: {
    atrule: "PlaygroundEditorTheme__tokenAttr",
    attr: "PlaygroundEditorTheme__tokenAttr",
    boolean: "text-blue-500",
    builtin: "PlaygroundEditorTheme__tokenSelector",
    cdata: "PlaygroundEditorTheme__tokenComment",
    char: "PlaygroundEditorTheme__tokenSelector",
    class: "PlaygroundEditorTheme__tokenFunction",
    "class-name": "PlaygroundEditorTheme__tokenFunction",
    comment: "PlaygroundEditorTheme__tokenComment",
    constant: "PlaygroundEditorTheme__tokenProperty",
    deleted: "PlaygroundEditorTheme__tokenProperty",
    doctype: "PlaygroundEditorTheme__tokenComment",
    entity: "PlaygroundEditorTheme__tokenOperator",
    function: "PlaygroundEditorTheme__tokenFunction",
    important: "PlaygroundEditorTheme__tokenVariable",
    inserted: "PlaygroundEditorTheme__tokenSelector",
    keyword: "text-blue-500",
    namespace: "PlaygroundEditorTheme__tokenVariable",
    number: "PlaygroundEditorTheme__tokenProperty",
    operator: "PlaygroundEditorTheme__tokenOperator",
    prolog: "PlaygroundEditorTheme__tokenComment",
    property: "PlaygroundEditorTheme__tokenProperty",
    punctuation: "PlaygroundEditorTheme__tokenPunctuation",
    regex: "PlaygroundEditorTheme__tokenVariable",
    selector: "PlaygroundEditorTheme__tokenSelector",
    string: "PlaygroundEditorTheme__tokenSelector",
    symbol: "PlaygroundEditorTheme__tokenProperty",
    tag: "PlaygroundEditorTheme__tokenProperty",
    url: "PlaygroundEditorTheme__tokenOperator",
    variable: "text-blue-500",
  },
};

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();

    console.log(root, selection);
  });
}

export function PostComment({ avatarUrl }: { avatarUrl: string }) {
  const initialConfig: InitialConfigType = {
    namespace: "MyEditor",
    theme,
    onError: console.error,
    nodes: EDITOR_NODES,
  };

  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <img
          className="inline-block h-10 w-10 rounded-full"
          src={avatarUrl}
          alt=""
        />
      </div>
      <div className="min-w-0 flex-1">
        <form action="#" className="relative">
          <div className=" ring-1 ring-gray-300 p-2 rounded-lg bg-white">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <div className=" rounded-md ring-1  ring-gray-300 focus-within:ring-2 focus-within:ring-blue-500 relative w-full bg-gray-50 shadow-sm focus-within:bg-white py-3 px-2.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6">
              <LexicalComposer initialConfig={initialConfig}>
                <RichTextPlugin
                  contentEditable={<ContentEditable className="outline-none" />}
                  placeholder={
                    <div className="absolute py-3 px-2.5 top-0 left-0 pointer-events-none text-gray-400">
                      Add your comment...
                    </div>
                  }
                  ErrorBoundary={LexicalErrorBoundary}
                />
                <HistoryPlugin />
                <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
                <MyCustomAutoFocusPlugin />
                <ToolbarPlugin />
                <TabIndentationPlugin />
                <ListPlugin />
                <CodeHighlightPlugin />
              </LexicalComposer>
            </div>

            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden="true">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9 " />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

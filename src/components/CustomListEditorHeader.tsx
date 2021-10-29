import * as React from "react";
import TextWithEditMode from "./TextWithEditMode";
import { CollectionData } from "opds-web-client/lib/interfaces";
import { Button } from "library-simplified-reusable-components";
import { Entry } from "./CustomListEntriesEditor";

export interface CustomListEditorHeaderProps {
  draftTitle: string;
  list?: CollectionData;
  listId?: string | number;
  hasListInfoChanged: boolean;
  draftEntries: Entry[];
  setDraftTitle: (title: string) => void;
  setDraftEntries: (entries: Entry[]) => void;
  setCancelClicked: (wasCancelClicked: boolean) => void;
  saveFormData: () => void;
}

export default function CustomListEditorHeader({
  draftTitle,
  list,
  listId,
  hasListInfoChanged,
  setDraftTitle,
  setDraftEntries,
  setCancelClicked,
  saveFormData,
  draftEntries,
}: CustomListEditorHeaderProps) {
  const titleOrEntriesIsBlank = (): boolean =>
    draftTitle === "" || draftTitle === "list title" || !draftEntries.length;

  const setNewTitleOnState = (newTitle): void => {
    setDraftTitle(newTitle);
  };

  const resetState = (): void => {
    setDraftTitle(list ? list.title : "");
    setDraftEntries(list ? list.books : []);
    setCancelClicked(true);
  };

  return (
    <div className="custom-list-editor-header">
      <div className="edit-custom-list-title">
        <fieldset className="save-or-edit">
          <legend className="visuallyHidden">List name</legend>
          <TextWithEditMode
            text={draftTitle}
            placeholder="list title"
            onUpdate={setNewTitleOnState}
            aria-label="Enter a title for this list"
            disableIfBlank={true}
          />
        </fieldset>
        {listId && <h4>ID-{listId}</h4>}
      </div>
      <div className="save-or-cancel-list">
        <Button
          callback={saveFormData}
          disabled={titleOrEntriesIsBlank() || !hasListInfoChanged}
          content="Save this list"
        />
        <Button
          className="inverted"
          callback={resetState}
          disabled={!hasListInfoChanged}
          content="Cancel Changes"
        />
      </div>
    </div>
  );
}

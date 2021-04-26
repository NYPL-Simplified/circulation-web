/* eslint-disable */
import * as React from "react";
import EditableInput from "./EditableInput";
import { Button } from "library-simplified-reusable-components";

export interface AnnouncementFormProps {
  content?: string;
  start?: string;
  finish?: string;
  id?: string;
  add: (announcement: any) => void;
}

export interface AnnouncementFormState {
  content?: string;
  start?: string;
  finish?: string;
  id?: string;
}

const formatDate = (date: Date | string): string => {
  if (!date || (typeof date === "string" && date.indexOf("/") === -1)) {
    return date as any;
  }
  let [month, day, year] =
    typeof date === "string"
      ? date.split("/")
      : date.toLocaleDateString("en-US").split("/");
  return `${year}-${month.toString().length === 1 ? "0" + month : month}-${
    day.toString().length === 1 ? "0" + day : day
  }`;
};

export default class AnnouncementForm extends React.Component<
  AnnouncementFormProps,
  AnnouncementFormState
> {
  constructor(props: AnnouncementFormProps) {
    super(props);
    this.updateStartDate = this.updateStartDate.bind(this);
    this.updateEndDate = this.updateEndDate.bind(this);
    let [start, finish] = this.getDefaultDates();
    this.state = {
      content: this.props.content || "",
      start: this.props.start || start,
      finish: this.props.finish || finish,
    };
  }
  getDefaultDates(): string[] {
    // By default, the start date is today's date and the end date is two months from today.
    let today = new Date();
    let start = this.formatDate(today);
    let finish = this.formatDate(
      new Date(today.setMonth(today.getMonth() + 2))
    );
    return [start, finish];
  }
  formatDate(date: Date | string): string {
    if (!date || (typeof date === "string" && date.indexOf("/") === -1)) {
      return date as any;
    }
    let [month, day, year] =
      typeof date === "string"
        ? date.split("/")
        : date.toLocaleDateString("en-US").split("/");
    return `${year}-${month.toString().length === 1 ? "0" + month : month}-${
      day.toString().length === 1 ? "0" + day : day
    }`;
  }
  updateContent(content: string) {
    this.setState({ content });
  }
  updateStartDate(start: string) {
    this.setState({ start });
    // The first time you change the start date, the end date updates to be two months later.
    // Presumably, if the end date has already been changed away from the default, then it's already where
    // you want it, and it would just be annoying/confusing for it to keep jumping around every time you change the start date,
    if (this.state.finish === this.getDefaultDates()[1]) {
      let startDate = new Date(start);
      let newMonth = startDate.getMonth() + 2;
      let finishDate = startDate.setMonth(newMonth);
      this.setState({ finish: this.formatDate(new Date(finishDate)) });
    }
  }
  updateEndDate(finish: string) {
    this.setState({ finish });
  }
  add(e: Event) {
    // Add the current announcement to the list of announcements in the parent component (AnnouncementsSection)
    e.preventDefault();
    this.props.add({
      content: this.state.content,
      start: this.state.start,
      finish: this.state.finish,
      id: this.props.id || null,
    });
    // Restore the form to default dates and an empty content field.
    let [start, finish] = this.getDefaultDates();
    this.setState({ content: "", start: start, finish: finish });
  }
  cancel(e: Event) {
    e.preventDefault();
    // If an existing announcement was being edited, just put it back into the list.
    if (this.props.content) {
      this.add(e);
    } else {
      // Blank out the content field and restore the dates to their defaults.
      let [start, finish] = this.getDefaultDates();
      this.setState({ content: "", start: start, finish: finish });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { content, start, finish } = this.props;
    let clear = this.props.content === prevProps.content && !this.state.content.length;
    if (!this.state.content.length && (this.props.content?.length > 0)) {
      this.setState({
        content: this.props.content,
        start: formatDate(start),
        finish: formatDate(finish),
      });
    }
  }

  render(): JSX.Element {
    // None of the fields can be blank.  Content must be between 15 and 350 characters.
    let wrongLength =
      this.state.content.length < 15 || this.state.content.length >= 350;
    let shouldDisable = () => {
      if (!this.state.content || !this.state.start || !this.state.finish) {
        return true;
      } else if (wrongLength) {
        return true;
      }
      return false;
    };
    return (
      <div className="announcement-form">
        <EditableInput
          className={wrongLength && "wrong-length"}
          elementType="textarea"
          type="text"
          minLength={15}
          maxLength={350}
          value={this.state.content}
          label="New Announcement Text (15-350 characters)"
          optionalText={false}
          onChange={(e) => this.updateContent(e)}
          description={`(Current length: ${this.state.content.length}/350)`}
        />
        <EditableInput
          type="date"
          max={this.state.finish}
          value={this.state.start}
          label="Start Date"
          optionalText={true}
          onChange={(e) => this.updateStartDate(e)}
          description="If no start date is chosen, the default start date is today's date."
        />
        <EditableInput
          type="date"
          min={this.state.start}
          value={this.state.finish}
          label="End Date"
          optionalText={true}
          onChange={(e) => this.updateEndDate(e)}
          description="If no expiration date is chosen, the default expiration date is 2 months from the start date."
        />
        <Button
          callback={(e: Event) => this.add(e)}
          className="inline left-align"
          disabled={shouldDisable()}
        />
        <Button
          callback={(e: Event) => this.cancel(e)}
          content="Cancel"
          className="inline left-align"
        />
      </div>
    );
  }
}

import * as React from "react";
import EditableInput from "./EditableInput";
import AnnouncementForm from "./AnnouncementForm";
import { Button } from "library-simplified-reusable-components";

export interface AnnouncementProps {
  content?: string;
  startDate?: string;
  endDate?: string;
  position?: number;
  onChange?: () => void;
  editable?: boolean;
  delete?: (content: string) => void;
  edit?: (content: string) => void;
}

export default class Announcement extends React.Component<AnnouncementProps, {}> {
  constructor(props: AnnouncementProps) {
    super(props);
    this.delete = this.delete.bind(this);
    this.edit = this.edit.bind(this);
  }
  edit(e) {
    e.preventDefault();
    this.props.edit(this.props.content);
  }
  delete(e) {
    e.preventDefault();
    this.props.delete(this.props.content);
  }
  format(date) {
    let [year, month, day] = date.split("-");
    return `${month}/${day}/${year}`;
  }
  render() {
    let announcement =
      <section className="announcement-info">
        <section className="dates">
          {this.format(this.props.startDate)} – {this.format(this.props.endDate)}
        </section>
        <span>{this.props.content}</span>
      </section>
    let editButton = (
      <Button
        content="Edit"
        onClick={(e) => this.edit(e)}
        className="left-align"
      />
    )
    let deleteButton = (
      <Button
        content="Delete"
        onClick={(e) => this.delete(e)}
        className="left-align"
      />
    )
    let renderAnnouncement = (provided?, snapshot?) => {
      return (
        <li className="announcement">
          { announcement }
          <hr />
          <section className="buttons">
            { editButton }
            { deleteButton }
          </section>
        </li>
      )
    }
    return (
      renderAnnouncement()
    )
  }
}

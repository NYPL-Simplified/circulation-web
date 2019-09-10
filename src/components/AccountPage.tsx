import * as React from "react";
import { Store } from "redux";
import * as PropTypes from "prop-types";
import ChangePasswordForm from "./ChangePasswordForm";
import { State } from "../reducers/index";
import Header from "./Header";

export interface AccountPageContext {
  editorStore: Store<State>;
  csrfToken: string;
}

/** Page for configuring account settings. */
export default class AccountPage extends React.Component<{}, {}> {
  context: AccountPageContext;

  static contextTypes: React.ValidationMap<AccountPageContext> = {
    editorStore: PropTypes.object.isRequired,
    csrfToken: PropTypes.string.isRequired,
  };


  render(): JSX.Element {
    return (
      <div className="account">
        <Header />
        <ChangePasswordForm
          store={this.context.editorStore}
          csrfToken={this.context.csrfToken}
          />
      </div>
    );
  }

  componentWillMount() {
    document.title = "Circulation Manager - Account";
  }
}
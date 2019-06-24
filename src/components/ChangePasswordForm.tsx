import * as React from "react";
import { Store } from "redux";
import { FetchErrorData } from "opds-web-client/lib/interfaces";
import { State } from "../reducers/index";
import { connect } from "react-redux";
import ActionCreator from "../actions";
import LoadingIndicator from "opds-web-client/lib/components/LoadingIndicator";
import ErrorMessage from "./ErrorMessage";
import EditableInput from "./EditableInput";
import { Form } from "library-simplified-reusable-components";

export interface ChangePasswordFormStateProps {
  fetchError?: FetchErrorData;
  isFetching?: boolean;
}

export interface ChangePasswordFormDispatchProps {
  changePassword?: (data: FormData) => Promise<void>;
}

export interface ChangePasswordFormOwnProps {
  store?: Store<State>;
  csrfToken: string;
}

export interface ChangePasswordFormProps extends ChangePasswordFormStateProps, ChangePasswordFormDispatchProps, ChangePasswordFormOwnProps {}

export interface ChangePasswordState {
  success: boolean;
  error: string | null;
}

export class ChangePasswordForm extends React.Component<ChangePasswordFormProps, ChangePasswordState> {
  constructor(props) {
    super(props);
    this.state = { success: false, error: null };
    this.save = this.save.bind(this);
  }

  render(): JSX.Element {
    let formContent = (
      <fieldset>
        <legend className="visuallyHidden">Change admin's password</legend>
        <EditableInput
          elementType="input"
          type="password"
          disabled={this.props.isFetching}
          name="password"
          label="New Password"
          ref="password"
          required={true}
        />
        <EditableInput
          elementType="input"
          type="password"
          disabled={this.props.isFetching}
          name="confirm_password"
          label="Confirm New Password"
          ref="confirm"
          required={true}
        />
      </fieldset>
    );

    return (
        <Form
          title="Change Password"
          onSubmit={this.save}
          content={formContent}
          disableButton={this.props.isFetching}
          className="border change-password-form"
          successText={this.state.success && "Password changed successfully"}
          errorText={(this.props.fetchError && <ErrorMessage error={this.props.fetchError} />) || this.state.error}
          loadingText={this.props.isFetching && <LoadingIndicator />}
        ></Form>
    );
  }

  save(data: FormData) {
    if (data.get("password") !== data.get("confirm_password")) {
      this.setState({ success: false, error: "Passwords do not match." });
    } else {
      this.props.changePassword(data).then(() => {
        this.setState({ success: true, error: null });
      });
    }
  }
}

function mapStateToProps(state, ownProps) {
  return {
    fetchError: state.editor.changePassword && state.editor.changePassword.fetchError,
    isFetching: state.editor.changePassword && state.editor.changePassword.isFetching
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  let actions = new ActionCreator(null, ownProps.csrfToken);
  return {
    changePassword: (data: FormData) => dispatch(actions.changePassword(data))
  };
}

const ConnectedChangePasswordForm = connect<ChangePasswordFormStateProps, ChangePasswordFormDispatchProps, ChangePasswordFormOwnProps>(
  mapStateToProps,
  mapDispatchToProps
)(ChangePasswordForm);

export default ConnectedChangePasswordForm;

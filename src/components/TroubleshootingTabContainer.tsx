import * as React from "react";
import { Store } from "redux";
import * as PropTypes from "prop-types";
import { State } from "../reducers/index";
import { TabContainer, TabContainerProps, TabContainerContext } from "./TabContainer";
import TroubleshootingCategoryPage from "./TroubleshootingCategoryPage";

export interface TroubleshootingTabContainerProps extends TabContainerProps {
  goToTab: (tabName: string) => void;
  subtab?: string;
}

export default class TroubleshootingTabContainer extends TabContainer<TroubleshootingTabContainerProps> {
  context: TabContainerContext;
  static contextTypes: React.ValidationMap<TabContainerContext> = {
    router: PropTypes.object.isRequired,
    pathFor: PropTypes.func.isRequired
  };

  tabs() {
    return {
      "diagnostics": <TroubleshootingCategoryPage subtab={this.props.tab === "diagnostics" ? this.props.subtab : "coverage_provider"} type="diagnostics" />,
      "self-tests": <TroubleshootingCategoryPage subtab={this.props.tab === "self-tests" ? this.props.subtab : "collections"} type="self-tests" />
    };
  }

  componentDidUpdate(prevProps: TroubleshootingTabContainerProps, prevState) {
    (this.props.tab !== prevProps.tab) && this.route(this.props.tab, this.props.subtab);
  }

  handleSelect(event) {
    let tab = event.currentTarget.dataset.tabkey;
    let subtab = this.props.subtab;
    this.props.goToTab(tab);
    this.route(tab, subtab);

  }

  route(tab: string, subtab: string) {
    if (this.context.router) {
      this.context.router.push("/admin/web/troubleshooting/" + tab + "/" + subtab);
    }
  }
}

import * as React from "react";
import * as ReactDOM from "react-dom";
const OPDSBrowser = require("opds-browser");
import { createStore, applyMiddleware } from "redux";
let thunk: any = require("redux-thunk");
import Editor from "./Editor";
import editorReducers from "../editor-reducers";
import createBookDetailsContainer from "./BookDetailsContainer";

export default class Root extends React.Component<RootProps, any> {
  browser: any;
  editorStore: Redux.Store;
  bookDetailsContainer: any;
  browserOnNavigate: (collectionUrl: string, bookUrl: string) => void;

  constructor(props) {
    super(props);
    let that = this;
    this.state = props;
    this.browserOnNavigate = function(collectionUrl, bookUrl) {
      that.setState({ collection: collectionUrl, book: bookUrl });
      that.props.onNavigate(collectionUrl, bookUrl);
    };
    this.bookDetailsContainer = createBookDetailsContainer({
      editorStore: createStore(
        editorReducers,
        applyMiddleware(thunk)
      ),
      csrfToken: this.props.csrfToken,
      onNavigate: this.props.onNavigate,
      tab: this.props.tab
    });
  }

  render(): JSX.Element {
    return (
      <OPDSBrowser
        ref={c => this.browser = c}
        collection={this.state.collection}
        book={this.state.book}
        onNavigate={this.browserOnNavigate}
        bookLinks={this.state.bookLinks}
        BookDetailsContainer={this.bookDetailsContainer} />
    );
  }

  setCollectionAndBook(collection: string, book: string): void {
    this.setState({ collection, book });
  }

  setTab(tab: string): void {
    this.browser.getBookDetailsContainer().setTab(tab);
  }
}
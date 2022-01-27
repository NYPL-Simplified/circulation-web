/* eslint-disable */
import * as React from "react";
import { connect } from "react-redux";
import { Store } from "redux";
import * as PropTypes from "prop-types";
import { State } from "../reducers/index";
import ActionCreator from "../actions";
import { LibraryData, LibrariesData } from "../interfaces";
import Admin from "../models/Admin";
import EditableInput from "./EditableInput";
import { Link } from "react-router";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { Router } from "opds-web-client/lib/interfaces";

export interface HeaderStateProps {
  libraries?: LibraryData[];
}

export interface HeaderDispatchProps {
  fetchLibraries?: () => Promise<LibrariesData>;
}

export interface HeaderOwnProps {
  store?: Store<State>;
  /** libraryProp stores the library's short name and is passed to `Header`
   * only when its parent is a functional component using the useContext hook
   * (as seen in `CustomListPage`). */
  libraryProp?: string;
}

export interface HeaderProps
  extends React.Props<Header>,
    HeaderStateProps,
    HeaderDispatchProps,
    HeaderOwnProps {}

export interface HeaderState {
  showAccountDropdown: boolean;
}

export interface HeaderRouter extends Router {
  getCurrentLocation?: Function;
}

export interface HeaderNavItem {
  label: string;
  href: string;
  auth?: boolean;
}

/** Header of all admin interface pages, with a dropdown for selecting a library,
    library-specific links for the current library, and site-wide links. */
export class Header extends React.Component<HeaderProps, HeaderState> {
  context: { library: () => string; router: HeaderRouter; admin: Admin };

  static contextTypes = {
    library: PropTypes.func,
    router: PropTypes.object.isRequired,
    admin: PropTypes.object.isRequired,
  };
  private libraryRef = React.createRef<EditableInput>();

  constructor(props) {
    super(props);
    this.state = { showAccountDropdown: false };
    this.changeLibrary = this.changeLibrary.bind(this);
    this.toggleAccountDropdown = this.toggleAccountDropdown.bind(this);

    document.body.addEventListener("click", (event: MouseEvent) => {
      if (
        this.state.showAccountDropdown &&
        (event.target as any).className.indexOf("account-dropdown-toggle") ===
          -1
      ) {
        this.toggleAccountDropdown();
      }
    });
  }

  displayPermissions(isSystemAdmin: boolean, isLibraryManager: boolean) {
    let permissions = isSystemAdmin
      ? "system admin"
      : isLibraryManager
      ? "library manager"
      : "librarian";
    return <li className="permissions">Logged in as a {permissions}</li>;
  }

  render(): JSX.Element {
    const currentPathname =
      (this.context.router &&
        this.context.router.getCurrentLocation() &&
        this.context.router.getCurrentLocation().pathname) ||
      "";
    let currentLibrary =
      this.props.libraryProp ||
      (this.context.library && this.context.library());
    let isLibraryManager = this.context.admin.isLibraryManager(currentLibrary);
    let isSystemAdmin = this.context.admin.isSystemAdmin();
    let isSiteWide = !this.context.library || !currentLibrary;
    let isSomeLibraryManager = this.context.admin.isLibraryManagerOfSomeLibrary();

    // Links that will be rendered in a NavItem Bootstrap component.
    const libraryNavItems = [
      { label: "Catalog", href: "%2Fgroups?max_cache_age=0" },
      { label: "Complaints", href: "%2Fadmin%2Fcomplaints" },
      { label: "Hidden Books", href: "%2Fadmin%2Fsuppressed" },
    ];
    // Links that will be rendered in a Link router component and are library specific.
    const libraryLinkItems = [
      { label: "Lists", href: "lists/" },
      { label: "Lanes", href: "lanes/", auth: isLibraryManager },
      { label: "Dashboard", href: "dashboard/" },
      { label: "Patrons", href: "patrons/", auth: isLibraryManager },
    ];
    // Links that will be rendered in a Link router component and are sitewide.
    const sitewideLinkItems = [
      { label: "Dashboard", href: "dashboard/", auth: isSiteWide },
      {
        label: "System Configuration",
        href: "config/",
      },
      {
        label: "Troubleshooting",
        href: "troubleshooting/",
        auth: isSystemAdmin,
      },
    ];
    const accountLink = { label: "Change password", href: "account/" };

    let permissions = isSystemAdmin
      ? "system admin"
      : isLibraryManager
      ? "library manager"
      : "librarian";

    return (
      <Navbar expand="lg" role="navigation" variant="dark">
        <Navbar.Brand>Admin</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        {this.props.libraries && this.props.libraries.length > 0 && (
          <EditableInput
            elementType="select"
            ref={this.libraryRef}
            value={currentLibrary}
            onChange={this.changeLibrary}
            aria-label="Select a library"
          >
            {(!this.context.library || !currentLibrary) && (
              <option aria-selected={false}>Select a library</option>
            )}
            {this.props.libraries.map((library) => (
              <option
                key={library.short_name}
                value={library.short_name}
                aria-selected={currentLibrary === library.short_name}
              >
                {library.name || library.short_name}
              </option>
            ))}
          </EditableInput>
        )}
        <Navbar.Collapse
          role="menubar"
          className="menu"
          id="responsive-navbar-nav"
        >
          <Nav role="menu">
            {currentLibrary && (
              <ul>
                {libraryNavItems.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    currentPathname={currentPathname}
                    currentLibrary={currentLibrary}
                  />
                ))}
                {libraryLinkItems.map((item) => (
                  <NavLinkItem
                    key={item.href}
                    item={item}
                    currentPathname={currentPathname}
                    currentLibrary={currentLibrary}
                  />
                ))}
              </ul>
            )}
          </Nav>
          <Nav role="menu">
            <ul>
              {sitewideLinkItems.map((item) => (
                <NavLinkItem
                  key={item.href}
                  item={item}
                  currentPathname={currentPathname}
                />
              ))}
              {this.context.admin.email && (
                <li>
                  <NavDropdown
                    className="dropdown"
                    title={this.context.admin.email}
                  >
                    <ul>
                      <li className="permissions">
                        Logged in as a {permissions}
                      </li>
                      <li>
                        <NavLinkItem
                          item={accountLink}
                          currentPathname={currentPathname}
                          isDropdownNav={true}
                        />
                      </li>
                      <li>
                        <NavDropdown.Item
                          role="menuitem"
                          href="/admin/sign_out"
                        >
                          Sign out
                        </NavDropdown.Item>
                      </li>
                    </ul>
                  </NavDropdown>
                </li>
              )}
            </ul>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }

  UNSAFE_componentWillMount() {
    if (this.props.fetchLibraries) {
      this.props.fetchLibraries();
    }
  }

  changeLibrary() {
    let library = this.libraryRef.current.getValue();
    if (library) {
      this.context.router.push(
        "/admin/web/collection/" + library + "%2Fgroups?max_cache_age=0"
      );
      this.forceUpdate();
    }
  }

  toggleAccountDropdown() {
    let showAccountDropdown = !this.state.showAccountDropdown;
    this.setState({ showAccountDropdown });
  }
}

function mapStateToProps(state, ownProps) {
  return {
    libraries:
      state.editor.libraries &&
      state.editor.libraries.data &&
      state.editor.libraries.data.libraries,
  };
}

function mapDispatchToProps(dispatch) {
  let actions = new ActionCreator();
  return {
    fetchLibraries: () => dispatch(actions.fetchLibraries()),
  };
}

const ConnectedHeader = connect<
  HeaderStateProps,
  HeaderDispatchProps,
  HeaderOwnProps
>(
  mapStateToProps,
  mapDispatchToProps
)(Header);

/** HeaderWithStore is a wrapper component to pass the store as a prop to the
    ConnectedHeader, since it's not in the regular place in the context. */
export default class HeaderWithStore extends React.Component<
  { libraryProp?: string },
  {}
> {
  context: { editorStore: Store<State> };

  static contextTypes = {
    editorStore: PropTypes.object.isRequired,
  };

  render(): JSX.Element {
    return (
      <ConnectedHeader
        store={this.context.editorStore}
        libraryProp={this.props.libraryProp}
      />
    );
  }
}

export type NavLinkItem = {
  item: HeaderNavItem;
  currentPathname: string;
  currentLibrary?: string;
  isDropdownNav?: boolean;
};

const NavLinkItem: React.FC<NavLinkItem> = ({
  item,
  currentPathname,
  currentLibrary = "",
  isDropdownNav = false,
}) => {
  const rootUrl = "/admin/web/";
  const { label, href, auth } = item;
  let isActive = currentPathname.indexOf(href) !== -1;
  if (currentLibrary) {
    isActive = !!(isActive && currentLibrary);
  }
  if (auth) {
    if (isDropdownNav) {
      return (
        <NavDropdown.Item
          as={Link}
          to={`${rootUrl}${href}${currentLibrary}`}
          className={isActive ? "active-link" : ""}
        >
          {label}
        </NavDropdown.Item>
      );
    } else
      return (
        <li>
          <Nav.Link
            role="menuitem"
            as={Link}
            to={`${rootUrl}${href}${currentLibrary}`}
            className={isActive ? "active-link" : ""}
          >
            {label}
          </Nav.Link>
        </li>
      );
  } else return null;
};

const NavItem: React.FC<NavLinkItem> = ({
  item,
  currentPathname,
  currentLibrary = "",
}) => {
  const rootCatalogURL = "/admin/web/collection/";
  const { label, href } = item;
  const isActive = currentPathname.indexOf(href) !== -1;
  return (
    <li>
      <Nav.Link
        role="menuitem"
        className="header-link"
        href={`${rootCatalogURL}${currentLibrary}${href}`}
        active={isActive}
      >
        {label}
      </Nav.Link>
    </li>
  );
};

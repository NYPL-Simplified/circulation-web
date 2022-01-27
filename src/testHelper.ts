import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import jsdom from "jsdom";

function setUpDomEnvironment() {
  const { JSDOM } = jsdom;
  const dom = new JSDOM(
    "<!doctype html><html><body><div id='root'></div></body></html>",
    {
      url: "http://example.com",
    }
  );
  const { window } = dom;

  global.window = window;
  global.document = window.document;
}

setUpDomEnvironment();

configure({ adapter: new Adapter() });

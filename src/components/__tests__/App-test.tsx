import { expect } from "chai";
import * as React from "react";
import { mount } from "enzyme";
import App from "../../App";
import { Router } from "react-router";
// import SetupPage from "../components/SetupPage";

describe("App", () => {
  // TODO: Fix these tests once we have data coming from CM
  //   it("renders Setup", () => {
  //     const wrapper = mount(<App />);
  //     const setup = wrapper.find(SetupPage);
  //     expect(setup.length).to.equal(1);
  //   });
  it("renders Router", () => {
    const wrapper = mount(<App />);
    const router = wrapper.find(Router);
    expect(router.length).to.equal(1);
  });
});
